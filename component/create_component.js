// 防止window.App 不存在
if (!window.App || typeof window.App !== 'object') {
    window.App = {};
}

/* 选择器单项 Select
 * 状态
 * emit: selectClick、selected
 */
(function (App) {
    var template = '<div class="m-select">\
            <div class="select-hd">\
                <span class="select-val"></span>\
                <span class="u-icon u-icon-dropdown"></span>\
            </div>\
            <ul class="select-op f-dn">\
            </ul>\
        </div>';

    /* options 参数说明
    * {
    *	container: dom节点, 父容器（必填）
    * }
    */
    function Select(options) {
        _.extend(this, options);

        this.layout = _.html2node(template);
        //缓存节点
        this.nHead = this.layout.querySelector('.select-hd');
        this.nValue = this.nHead.querySelector('.select-val');
        this.nOption = this.layout.getElementsByTagName('ul')[0];

        this.init();

    }

    _.extend(Select.prototype, App.localEmitter);

    _.extend(Select.prototype, {
        init: function () {
            // 绑定事件
            this.initEvent();
            // 挂载组件
            this.container.appendChild(this.layout);
        },

        initEvent: function () {
            this.layout.addEventListener('click', this.clickHandler.bind(this));
            document.addEventListener('click', this.close.bind(this));
        },

        render: function (data, defaultIndex) {
            var optionsHTML = '';
            for (var i = 0; i < data.length; i++) {
                optionsHTML += '<li data-index="' + i + '">' + data[i].name + '</li>';
            }
            this.nOption.innerHTML = optionsHTML;
            this.nOptions = this.nOption.children;
            this.options = data;
            this.selectedIndex = undefined;

            //默认选中第一项
            this.setSelect(defaultIndex || 0);
        },

        clickHandler: function (event) {
            var target = event.target;
            if (target.parentNode === this.nOption) {
                this.setSelect(parseInt(target.dataset.index));
            } else if (target.parentNode === this.nHead || target === this.nHead) {
                this.toggle();
            } else {
                if (!_.hasClass(this.nOption, 'f-dn')) {
                    this.close();
                }
            }
            event.stopImmediatePropagation();
            this.emit('selectClick');
        },

        open: function () {
            _.delClass(this.nOption, 'f-dn');
        },

        close: function () {
            _.addClass(this.nOption, 'f-dn');
        },

        toggle: function () {
            _.hasClass(this.nOption, 'f-dn') ? this.open() : this.close();
        },

        getValue: function () {
            if (this.selectedIndex === undefined) return undefined;
            return this.options[this.selectedIndex].value;
        },

        setSelect: function (index) {
            //判断是否和上次选中的index相同
            if (this.selectedIndex === index) {
                this.close();
                return;
            }

            //取消上次选中效果
            if (this.selectedIndex !== undefined) {
                _.delClass(this.nOptions[this.selectedIndex], 'z-select');
            }

            //设置选中
            this.selectedIndex = index;
            this.nValue.innerText = this.options[this.selectedIndex].name;
            _.addClass(this.nOptions[this.selectedIndex], 'z-select');

            // 触发选中事件，将选中的值传递出去
            this.emit('selected', this.getValue());
            this.close();
        }
    });

    App.Select = Select;

})(window.App);

/* 标签Tags */
(function (App) {
    var html = '<div class="u-formitem  u-formitem-2 u-formitem-4">\
                <label class="u-tt">标签</label>\
                <div class="u-cnt" >\
                    <ul class="m-tag" id="tags">\
                        <li class="tag u-btn tag-add">\
                            <input type="text" class="u-ipt">\
                            <span class="txt">+ 自定义标签</span>\
                        </li>\
                    </ul>\
                </div>\
            </div>\
            <div class="u-formitem u-formitem-2 u-formitem-5">\
                <p class="u-tt">推荐标签</p>\
                <div class="u-cnt" >\
                    <ul class="m-tag" id="rcmdtags"></ul>\
                </div>\
            </div>';

    /* options 参数说明
    * {
    *	parent: dom节点, 父容器（必填）
    * }
    */
    function Tags(options) {

        _.extend(this, options);

        // 挂载模版
        this.parent.innerHTML = html;

        // 缓存节点
        this.nTags = _.$('#tags', this.parent); // 标签列表
        this.nRecommendTags = _.$('#rcmdtags', this.parent);    // 推荐标签列表
        this.nAddTag = _.$('li.tag-add', this.nTags); // 自定义标签按钮
        this.nAddTagInput = _.$('input.u-ipt', this.nAddTag); // 自定义标签按钮中输入框
        // tag数组
        this.list = [];

        // 初始化默认标签 & 推荐标签
        this.initTagList();
        this.addEvent();
    }

    _.extend(Tags.prototype, {
        // 初始化默认标签 & 推荐标签
        initTagList: function () {
            // 添加 初始化时传入的标签
            this.addTags(this.tags);
            // 获取推荐标签
            this.getRcmdTags()
        },

        // 添加标签
        // tags: [] || str 存放标签的字符串数组 或者 单个标签字符串
        addTags: function (tags) {

            var add = function (tag) {
                //判断标签是否已存在
                // if (this.list.includes(tag)) {
                //     return;
                // }
                // 兼容ie
                for (var i = 0; i < this.list.length; i++) {
                    if (this.list[i] === tag) {
                        return;
                    }
                }

                var nTag;
                var html = '<li class="tag u-btn">\
                    <button class="close">x</button>\
                    <span>' + tag + '</span>\
                </li>';
                nTag = _.html2node(html);
                this.nTags.insertBefore(nTag, this.nAddTag);
                //将标签存入数组
                this.list.push(tag);
            };

            // tags 参数，支持单个字符串，也支持数组
            if (tags && !Array.isArray(tags)) {
                tags = [tags];
            }
            (tags || []).forEach(add, this);
        },

        // 删除标签
        // nTag: 标签节点
        remove: function (nTag) {
            var tag = nTag.querySelector('span').innerText;
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i] === tag) {
                    //从 this.list 数组中将该标签删除
                    this.list.splice(i, 1);
                    // 删除标签元素
                    this.nTags.removeChild(nTag);
                    //退出循环
                    break;
                }
            }
        },

        // 添加事件
        addEvent: function () {
            // 用户标签、自定义标签 点击事件
            var tagsClickHandler = function (e) {
                var target = e.target;
                var nTag = target.parentNode;
                if (_.hasClass(nTag, 'tag') && !_.hasClass(nTag, 'tag-add')) {  // 点击标签按钮 删除标签
                    this.remove(nTag);
                } else if (_.hasClass(nTag, 'tag-add')) {   // 点击自定义标签按钮
                    // 显示输入框, 隐藏文本
                    _.addClass(nTag, 'focused');
                    // 输入框获取焦点
                    this.nAddTagInput.focus();
                }
            }.bind(this);
            this.nTags.addEventListener('click', tagsClickHandler);

            // 推荐标签 点击事件
            var rcmdTagsClickHandler = function (e) {
                var target = e.target;
                var tgParent = target.parentNode;
                if (_.hasClass(tgParent, 'tag') || _.hasClass(target, 'tag')) {
                    var tagStr = target.innerText.split(' ')[1];
                    this.addTags(tagStr);
                }
            }.bind(this);
            this.nRecommendTags.addEventListener('click', rcmdTagsClickHandler);

            // tag 输入框失焦事件
            var addTagInputBlurHandler = function () {
                // 清空输入框的值
                this.nAddTagInput.value = '';
                // 隐藏输入框，显示文本
                _.delClass(this.nAddTag, 'focused');

            }.bind(this);

            // tag 输入框回车事件
            var addTagInputKeydownHandler = function (e) {
                if (e.keyCode === 13 || e.keyCode === 108) {
                    e.preventDefault();
                    // 取 value 时去除前后空格
                    var value = this.nAddTagInput.value.trim();
                    // 标签不存在，则添加这个标签，并清空输入框的值
                    // 标签存在与否 add 内部判断
                    this.addTags(value);
                    this.nAddTagInput.value = '';
                    console.log('自定义标签 回车');

                }
            }.bind(this);

            this.nAddTagInput.addEventListener('blur', addTagInputBlurHandler);
            this.nAddTagInput.addEventListener('keypress', addTagInputKeydownHandler);
        },
        // 获取标签数组
        getValue: function () {
            return this.list;
        },
        // 获取推荐标签
        getRcmdTags: function () {
            _.ajax({
                url: _.getApiUrl('/api/tags?recommend'),
                success: function (data) {
                    if (data.code === 200) {
                        // 渲染推荐标签
                        this.renderRcmdTags(data.result);
                    } else {
                        console.log(data.msg);
                    }
                }.bind(this)
            })
        },
        // 渲染推荐标签
        renderRcmdTags: function (tags) {
            var tagsArr = tags.split(',');
            var rawTemplate = '{{#each tags}}\
                    <li class="tag u-btn u-btn-primary">\
                        <span>+ {{this}}</span>\
                    </li>\
                {{/each}}';
            var template = Handlebars.compile(rawTemplate);
            var context = {
                'tags': tagsArr
            };

            this.nRecommendTags.innerHTML = template(context);
        }
    });

    App.Tags = Tags;

})(window.App);

/* 上传图片 */
(function (App) {
    var html = '<div class="u-formitem u-formitem-1" id="m-uploadpics">\
                <label class="u-tt">上传图片</label>\
                <div class="u-cnt">\
                    <input type="file" id="upload" class="f-dn" accept="image/*" multiple="">\
                    <label for="upload" class="u-btn u-btn-primary u-btn-upload">选择图片上传</label>\
                    <!--进度条-->\
                    <span class="progress-wrap f-dn">\
                            <progress value="50" max="100" id="progress"></progress>\
                            <span id="progressInfo"></span>\
                        </span>\
                    <span class="tips">提示：作品可以包含多张图片，一次选择多张图片，最多不超过10张（单张图片大小 &lt; 1M）</span>\
                </div>\
            </div>\
            <!-- 上传图片列表 -->\
            <div class="uploadWorklist">\
                <div class="uploadWorklist-wrap">\
                    <ul class="m-works"></ul>\
                </div>\
            </div>';

    /* options 参数说明
    * {
    *	container: dom节点, 父容器（必填）
    * }
    */
    function UploadPics(options) {
        // 继承配置
        _.extend(this, options);

        this.init();
    }

    UploadPics.prototype.init = function () {

        // 挂载模版
        this.container.innerHTML = html;

        this.pictures = [];

        this.picsContainer = _.$('.uploadWorklist', this.container);    // 上传图片列表容器
        this.picsList = _.$('.m-works', this.picsContainer);    // 图片列表ul容器
        this.uploadInput = _.$('#upload', this.container);    // 上传文件input按钮(隐藏)
        this.uploadButton = _.$('.u-btn-upload', this.container);    // 上传样式化按钮
        this.progressBar = _.$('#progress', this.container);        // 上传进度条
        this.progressInfo = _.$('#progressInfo', this.container);    // 上传进度信息
        this.progressContainer = this.progressBar.parentNode;   // 进度容器


        // 文件类型input 上传图片
        this.uploadInput.addEventListener('change', this.changeHandler.bind(this));
        // 拖拽 上传图片
        this.picsContainer.addEventListener('dragover', function (e) {
            e.preventDefault();
        });
        this.picsContainer.addEventListener('drop', function (e) {
            e.preventDefault();
            this.dropFiles(e.dataTransfer.files);
        }.bind(this));
        // 点击事件：删除、设置封面
        this.picsContainer.addEventListener('click', this.worklistClickHandler.bind(this), false);


    };
    // 1.通过文件类型input 上传文件
    UploadPics.prototype.changeHandler = function (e) {
        var files = e.target.files;
        this.checkFiles(files);
        // 清空input选择文件记录 可上传一样的文件
        e.target.value = '';
    };

    // 2.通过拖拽 上传文件
    UploadPics.prototype.dropFiles = function (files) {
        this.checkFiles(files);
    };

    // 检验文件 错误文件提示弹窗，合格图片上传
    UploadPics.prototype.checkFiles = function (files) {
        var sizeExceedFiles = [];
        var typeExceedFiles = [];
        var okFiles = [];
        var maxSize = 3 * 1024 * 1024;

        var tipModal = new App.Modal({
            HEAD: true,
            FOOT: true,
            CANCEL: false,
            CHECK: false
        });

        //超过10张不再上传
        if (files.length > 10) {
            tipModal.show('每次最多选择 10 张照片');
            return;
        }

        // 过滤图片，非图片类型、大于 1M 的图片、可以上传的图片
        Array.prototype.forEach.call(files, function (item) {
            if (!/^image\//.test(item.type)) {
                typeExceedFiles.push(item);
                return;
            }
            if (item.size > maxSize) {
                sizeExceedFiles.push(item);
            } else {
                okFiles.push(item);
            }
        });

        // 显示错误信息弹窗（非图片类型、大于1M）后，上传合格的图片
        new Promise(function (resolve) {
            if (typeExceedFiles.length > 0) {
                var msg;
                if (typeExceedFiles.length === 1) {
                    msg = '<p class="modalmsg">文件 <em class="del-item-name">"' + typeExceedFiles[0].name + '"</em> 非图片类型，无法上传</p>';
                } else {
                    msg = '<p class="modalmsg"><em class="del-item-name">"' + typeExceedFiles[0].name + '"</em> 等 ' + sizeExceedFiles.length + ' 文件非图片类型，无法上传</p>';
                }
                tipModal.show(msg);
                tipModal.on('closeModal', resolve);
            } else {
                resolve();
            }
        }).then(function () {
            if (sizeExceedFiles.length > 0) {
                return new Promise(function (resolve) {
                    var msg;
                    if (sizeExceedFiles.length === 1) {
                        msg = '<p class="modalmsg">图片 <em class="del-item-name">"' + sizeExceedFiles[0].name + '"</em> 超过 1M，无法上传</p>';
                    } else {
                        msg = '<p class="modalmsg"><em class="del-item-name">"' + sizeExceedFiles[0].name + '"</em> 等 ' + sizeExceedFiles.length + ' 张图片超过 1M，无法上传</p>';
                    }
                    tipModal.show(msg);
                    tipModal.on('closeModal', resolve);
                });
            }
        }).then(function () {
            if (okFiles.length > 0) {
                // 阻塞上传
                this.uploadFiles(okFiles);
                // 并发上传
                // this._upload(okFiles);
            }
        }.bind(this)).catch(function (error) {
            console.log('checkFiles提示弹窗发生错误！', error);
        });

    };

    // 绑定点击事件
    UploadPics.prototype.worklistClickHandler = function (e) {
        e.preventDefault();
        var target = e.target;
        if (_.hasClass(target, 'setcover')) {
            this.setCover(target);
        } else if (_.hasClass(target, 'u-icon-delete')) {
            this.deletePicture(target);
        }
    };
    // 点击 设置封面
    UploadPics.prototype.setCover = function (target) {
        var picId = parseInt(target.parentNode.dataset.id);
        var picUrl = target.parentNode.dataset.url;

        if (typeof MOCK === 'boolean' && !MOCK) {
            if (this.coverId === picId) {
                return;
            }
        }
        this.coverId = picId;
        this.coverUrl = picUrl;

        target.innerText = '已设为封面';
        if (!this.nCover) {
            this.nCover = target;
        } else {
            this.nCover.innerText = '设为封面';
            this.nCover = target;
        }
    };
    // 点击 删除图片
    UploadPics.prototype.deletePicture = function (target) {
        var picId = parseInt(target.parentNode.dataset.id);
        for (var i = 0; i < this.pictures.length; i++) {
            if (this.pictures[i].id === picId) {
                //从 this.pictures 数组中将该图删除
                this.pictures.splice(i, 1);
                // 删除图元素
                this.picsList.removeChild(target.parentNode);
                break;
            }
        }
    };

    // 并发上传合格图片 Promise实现
    UploadPics.prototype._upload = function (files) {
        var totalSize = 0,  // 上传文件总大小
            loadedSize = [], // 各个文件已上传大小
            filesNum = files.length,    // 上传文件总数量
            uploadedFilesNum = 0, // 已上传文件数量
            uploadProgress = 0; // 上传进度
        var self = this;

        var uploadRequests = [],    // 并发上传请求
            failUploadFiles = [];   // 上传失败文件名

        //禁用 上传按钮
        this.uploadInput.disabled = true;
        _.addClass(this.uploadButton, 'disabled');

        // 初始化各个文件已上传大小
        for (var i = 0; i < filesNum; i++) {
            loadedSize.push(0);
        }

        // 计算文件总大小（比实际上传时的文件大小略小, 更准确值在xhr.upload @progress 中的 event.total）
        // 但只有所有文件触发progress事件才能计算出总大小，为了提前获取进度，以 file.size 大小为准
        totalSize = files.reduce(function (sum, item) {
            return sum + item.size;
        }, 0);


        // 初始化进度条信息 并显示进度条
        this.progressBar.max = totalSize;
        this.progressBar.value = 0;
        this.progressInfo.innerHTML = '共 ' + filesNum + ' 张图片，成功上传 0 张，上传进度 0%';
        _.delClass(this.progressContainer, 'f-dn');


        // 计算已上传总大小
        var getLoadedSize = function (loadingSize, index) {
            loadedSize[index] = loadingSize;
            return loadedSize.reduce(function (sum, cur) {
                return sum + cur;
            })
        };

        // 本地预览
        var previewImg = function (picture, file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (event) {
                var previewUrl = event.target.result;

                var html = '<li class="item" data-id="' + picture.id + '" data-url="' + picture.url + '">\
                                <img src="' + previewUrl + '" alt="' + picture.name + '">\
                                <button class="setcover u-btn">设为封面</button>\
                                <i class="u-icon u-icon-delete"></i>\
                            </li>';

                var nPicture = _.html2node(html);
                self.picsList.appendChild(nPicture);
            }
        };
        // 添加图片
        var addImg = function (picture, file) {
            self.pictures.push(picture);

            if (typeof window.FileReader !== 'undefined') {
                previewImg(picture, file);
            } else {
                var html = '<li class="item" data-id="' + picture.id + '" data-url="' + picture.url + '">\
                                <img src="' + picture.url + '" alt="' + picture.name + '">\
                                <button class="setcover u-btn">设为封面</button>\
                                <i class="u-icon u-icon-delete"></i>\
                            </li>';
                var nPicture = _.html2node(html);
                self.picsList.appendChild(nPicture);
            }

        };

        // 上传进度 回调
        var progressHandler = function (index, event) {
            if (event.lengthComputable) {
                var loadedSizeSum = getLoadedSize(event.loaded, index);
                self.progressBar.value = loadedSizeSum;
                uploadProgress = Math.ceil(loadedSizeSum / totalSize * 100);
                // 实际文件上传大小 大于 本地文件大小
                if (uploadProgress > 100) {
                    uploadProgress = 100;
                }
                // 更新进度条
                self.progressInfo.innerHTML = '共 ' + filesNum + ' 张图片，成功上传 ' + uploadedFilesNum + ' 张，上传进度 ' + uploadProgress + '%';
            }
        };


        files.forEach(function (item, index) {

            uploadRequests.push(new Promise(function (resolve, reject) {

                    var fd = new FormData();
                    fd.append('file', item, item.name);

                    var xhr = new XMLHttpRequest();
                    xhr.withCredentials = true;
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                                resolve({
                                    picture: JSON.parse(xhr.responseText).result,
                                    file: item
                                });
                            } else {
                                reject({
                                    error: xhr.responseText,
                                    file: item
                                });
                            }
                        }
                    };

                    if ("upload" in new XMLHttpRequest) {
                        xhr.upload.onprogress = progressHandler.bind(self, index);
                    }

                    // xhr.open(_.fixMethod('POST'), _.getApiUrl('/api/works?upload', 'POST'));
                    xhr.open('POST', _.getApiUrl('/api/works?upload', 'POST'));
                    xhr.send(fd);

                }).then(function (response) {
                    // 追加上传成功文件个数 更新进度条
                    uploadedFilesNum++;
                    self.progressInfo.innerHTML = '共 ' + filesNum + ' 张图片，成功上传 ' + uploadedFilesNum + ' 张，上传进度 ' + uploadProgress + '%';
                    // 本地添加文件显示
                    addImg(response.picture, response.file);
                }).catch(function (errorinfo) {
                    // 上传失败
                    // console.log(errorinfo.error);
                    // console.log(errorinfo.file);
                    // 模拟上传成功
                    if (typeof MOCK !== 'undefined' && MOCK) {
                        // 追加上传成功文件个数 更新进度条
                        uploadedFilesNum++;
                        self.progressInfo.innerHTML = '共 ' + filesNum + ' 张图片，成功上传 ' + uploadedFilesNum + ' 张，上传进度 ' + uploadProgress + '%';
                        // 本地添加文件显示
                        addImg(MOCK_POST_WORKS_UPLOAD.result, errorinfo.file);
                    } else {
                        // 记录上传失败文件名称
                        failUploadFiles.push(errorinfo.file.name);
                    }
                })
            )
        });

        Promise.all(uploadRequests).then(function () {
            //恢复 上传按钮
            self.uploadInput.disabled = false;
            _.delClass(self.uploadButton, 'disabled');
            //隐藏进度
            _.addClass(self.progressContainer, 'f-dn');

            // 上传失败弹窗
            if (failUploadFiles.length > 0) {
                var tipModal = new App.Modal({
                    HEAD: true,
                    FOOT: true,
                    CANCEL: false,
                    CHECK: false
                });
                var failFiles = failUploadFiles.join('、');
                var msg = '<p class="modalmsg">' + failUploadFiles.length + ' 张图片: <em class="del-item-name">"' + failFiles + '"</em> 上传失败</p>';
                tipModal.show(msg);
            }
        }).catch(function (error) {
            console.log(error);
        })

    };

    // 阻塞上传合格图片 非Promise实现
    UploadPics.prototype.uploadFiles = function (files) {
        var totalSize = 0,  // 上传文件总大小
            loadedSize = 0, // 已上传总大小
            filesNum = files.length,    // 上传文件数量
            uploadingFileIndex = 0, // 当前上传文件索引
            failUploadFiles = [];   // 上传失败文件数组
        var self = this;

        //禁用 上传按钮
        this.uploadInput.disabled = true;
        _.addClass(this.uploadButton, 'disabled');

        // 计算文件总大小
        totalSize = files.reduce(function (sum, item) {
            return sum + item.size;
        }, 0);

        // 初始化进度条信息 并显示进度条
        this.progressBar.max = totalSize;
        this.progressBar.value = 0;
        this.progressInfo.innerHTML = '共 ' + filesNum + ' 张图片，正在上传第 1 张，上传进度 0%';
        _.delClass(this.progressContainer, 'f-dn');


        // 计算已上传总大小
        var getLoadedSize = function (loadingSize) {
            loadedSize = 0;
            // 之前已上传文件大小之和
            for (var i = 0; i < uploadingFileIndex; i++) {
                loadedSize += files[i].size;
            }
            // 加上本次上传文件中已上传的大小
            loadedSize += loadingSize;
            // 返回相对于所有文件已上传的大小
            return loadedSize;
        };

        // 本地预览
        var previewImg = function (picture) {
            var reader = new FileReader();
            reader.readAsDataURL(files[uploadingFileIndex]);
            reader.onload = function (event) {
                var previewUrl = event.target.result;

                var html = '<li class="item" data-id="' + picture.id + '" data-url="' + picture.url + '">\
                                <img src="' + previewUrl + '" alt="' + picture.name + '">\
                                <button class="setcover u-btn">设为封面</button>\
                                <i class="u-icon u-icon-delete"></i>\
                            </li>';
                var nPicture = _.html2node(html);
                self.picsList.appendChild(nPicture);
            }
        };

        // 添加图片
        var addImg = function (picture) {
            // 添加图片到全局图片数组
            self.pictures.push(picture);

            if (typeof window.FileReader !== 'undefined') {
                previewImg(picture);
            } else {
                var html = '<li class="item" data-id="' + picture.id + '" data-url="' + picture.url + '">\
                                <img src="' + picture.url + '" alt="' + picture.name + '">\
                                <button class="setcover u-btn">设为封面</button>\
                                <i class="u-icon u-icon-delete"></i>\
                            </li>';
                var nPicture = _.html2node(html);
                self.picsList.appendChild(nPicture);
            }

        };

        // 上传进度 回调
        var progressHandler = function (e) {
            if (e.lengthComputable) {
                self.progressBar.value = getLoadedSize(e.loaded);
                var pg = Math.ceil(loadedSize / totalSize * 100);
                // 实际文件上传大小 大于 本地文件大小
                if (pg > 100) {
                    pg = 100;
                }
                self.progressInfo.innerHTML = '共 ' + filesNum + ' 张图片，正在上传第 ' + (uploadingFileIndex + 1) +
                    ' 张，上传进度 ' + pg + '%';
            }
        };

        var upload = function () {
            var file = files[uploadingFileIndex];

            // 上传完毕
            if (!file) {
                //恢复 上传按钮
                self.uploadInput.disabled = false;
                _.delClass(self.uploadButton, 'disabled');
                //隐藏进度
                _.addClass(self.progressContainer, 'f-dn');

                if (failUploadFiles.length > 0) {
                    // 提示上传失败错误
                    var tipModal = new App.Modal({
                        HEAD: true,
                        FOOT: true,
                        CANCEL: false,
                        CHECK: false
                    });
                    var failsNames = failUploadFiles.join('、');
                    var msg = '<p class="modalmsg">' + failUploadFiles.length + ' 张图片 <em class="del-item-name">"' + failsNames + '"</em> 上传失败</p>';
                    tipModal.show(msg);
                }
                return;
            }

            var fd = new FormData();
            fd.append('file', file, file.name);

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                        var picture = JSON.parse(xhr.responseText).result;
                        // 添加图片
                        addImg(picture);
                        // 上传下一个
                        uploadingFileIndex++;
                        upload();
                    } else {
                        // 上传失败
                        // console.log(xhr.responseText);

                        if (typeof MOCK !== 'undefined' && MOCK) {
                            // 模拟模式 模拟上传成功
                            var picture = MOCK_POST_WORKS_UPLOAD.result;
                            addImg(picture);
                        } else {
                            failUploadFiles.push(file.name);
                        }
                        // 上传下一个
                        uploadingFileIndex++;
                        upload();
                    }
                }
            };

            // xhr.onerror = function (e) {
            //     console.log('xhr.onerror');
            // };
            // xhr.timeout =  1000;
            // xhr.ontimeout = function (e) {
            //     console.log('xhr.ontimeout');
            // };

            if ("upload" in new XMLHttpRequest) {
                xhr.upload.onprogress = progressHandler;
            }
            // xhr.open(_.fixMethod('POST'), _.getApiUrl('/api/works?upload', 'POST'));
            xhr.open('POST', _.getApiUrl('/api/works?upload', 'POST'));
            xhr.send(fd);
        };

        upload();
    };

    // 获取图片信息数组
    UploadPics.prototype.getValue = function () {
        return {
            coverId: this.coverId, // 封面id
            coverUrl: this.coverUrl, // 封面url
            pictures: this.pictures.map(function (item, index) {
                var picture = {};
                for (key in item) {
                    picture[key] = item[key];
                }
                picture['position'] = index;    //图画在作品中的位置顺序
                return picture;
            })
        };
    };

    App.UploadPics = UploadPics;

})(window.App);