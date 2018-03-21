/* 创建作品页面 */
(function (App) {
    var page = {
        init: function () {
            // 初始化导航栏
            this.initNav();

            // 初始化表单
            this.initForm();
        },
        // 导航栏
        initNav: function () {
            this.nav = new App.Nav({
                container: _.$('.g-header')
            });
        },
        // 表单
        initForm: function () {
            // 标签
            this.initTags();
            // 授权
            this.initAuthorSlct();
            // 上传图片
            this.initUploadPics();
            // 创建
            this.initSubmit();
        },

        // 标签
        initTags: function () {
            this.tags = new App.Tags({
                parent: _.$('#m-tags')
            });
        },

        // 作品授权选择器
        initAuthorSlct: function () {
            this.authorSlct = new App.Select({
                container: _.$('#authorization').querySelector('.u-cnt')
            });
            var authorData = [
                {value: 0, name: '不限制作品用途'},
                {value: 1, name: '禁止匿名转载；禁止商业使用'}
            ];
            this.authorSlct.render(authorData);
        },

        // 上传图片
        initUploadPics: function () {
            this.uploadPics = new App.UploadPics({
                container: _.$('#m-uploadpics')
            })
        },

        // 初始化提交表单（创建作品）
        initSubmit: function () {
            this.form = _.$('#uploadform');
            this.form.addEventListener('submit', this.submitForm.bind(this), false);
        },
        // 上传表单
        submitForm: function (e) {
            e.preventDefault();
            if (this.checkForm()) {
                _.ajax({
                    url: _.getApiUrl('/api/works', 'POST'),
                    method: _.fixMethod('POST'),
                    data: this.postData,
                    success: function (data) {
                        if (data.code === 200) {
                            // 跳转回作品页面
                            window.location.href = BASE_URL + "/html/works/list.html";
                        } else {
                            var tipModal = new App.Modal({
                                content: data.msg,
                                CANCEL: false
                            });
                            tipModal.show();
                        }
                    }.bind(this)
                });
            }
        },
        // 检验表单数据
        checkForm: function () {
            // 作品名称
            var nameInput = _.$('#worksname', this.form);
            this.name = nameInput.value.trim();
            var nError = nameInput.nextElementSibling;
            // 作品名称是否为空，
            if (!this.name) {
                // 空 显示错误提示 并返回
                _.addClass(nError, 'show-error');
                return false;
            } else {
                // 不为空 删除错误提示
                _.delClass(nError, 'show-error');
            }

            // 上传的图片
            var uploadResult = this.uploadPics.getValue();
            this.pictures = uploadResult.pictures;
            // 若没有上传图片，返回错误
            if (this.pictures.length === 0) {
                var tipModal = new App.Modal({
                    HEAD: true,
                    FOOT: true,
                    CANCEL: false,
                    CHECK: false
                });
                tipModal.show('请选择图片上传');
                return false;
            }

            // 若用户没有设置封面，默认为第一张图
            if (!uploadResult.coverId) {
                this.coverId = this.pictures[0].id;
                this.coverUrl = this.pictures[0].url;
            } else {
                this.coverId = uploadResult.coverId;
                this.coverUrl = uploadResult.coverUrl;
            }

            // 标签字符串
            this.tagsStr = this.tags.getValue().join();

            // 分类
            this.category = parseInt(this.form.querySelector('input[name="category"]:checked').value);

            // 描述
            this.description = _.$('#description').value;

            // 权限设置
            this.privilege = parseInt(this.form.querySelector('input[name="privilege"]:checked').value);

            // 授权设置
            this.authorization = this.authorSlct.getValue();

            this.postData = {
                name: this.name,
                tag: this.tagsStr,
                coverId: this.coverId,
                coverUrl: this.coverUrl,
                pictures: this.pictures,
                category: this.category,
                description: this.description,
                privilege: this.privilege,
                authorization: this.authorization
            };

            return true;
        }


    };

    App.page = page;
    App.user = {};

    //页面初始化
    document.addEventListener('DOMContentLoaded', function (e) {
        page.init();
    });
})(window.App)