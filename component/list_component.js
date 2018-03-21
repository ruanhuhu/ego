// 防止window.App 不存在
if (!window.App || typeof window.App !== 'object') {
    window.App = {};
}

/* 用户信息 */
(function (App) {
    var template = Handlebars.compile(`<div class="u-avatar">
        <img src="{{ avatar_url }}" alt="用户头像">
    </div>
    <div class="u-info">
        <em class="u-name f-thide" title="">{{ nickname }}</em><span class="sex"><em class="u-icon {{ sex }}"></em></span>
    </div>
    <div class="u-info">
        <em class="age">{{ age }}岁</em>&nbsp;
        <em class="constellation">{{ constellation }}座</em>&nbsp;&nbsp;&nbsp;
        <span class="address-info">
            <em class="u-icon u-icon-address"></em>
            <em class="address">{{ address }}</em>
        </span>
    </div>`);

    /**
     * options 参数说明
     * {
     *    container: dom节点, 父容器, (必填)
     * }
     **/
    function Profile(options) {
        // 继承配置
        _.extend(this, options);
    }

    _.extend(Profile.prototype, {
        // 挂载组件
        renderProfile: function (user) {
            var iconConfig = [
                'u-icon-male',
                'u-icon-female'
            ];
            // 模板所用数据
            var user_info = {
                avatar_url: BASE_URL + '/res/images/mywork_avatar.png',
                nickname: user.nickname,
                sex: iconConfig[user.sex],
                age: this.getAge(user.birthday),
                constellation: this.getConstellation(user.birthday),
                address: this.getAddress(user) || '未知'
            };
            // 通过数据 生成模板
            this.container.innerHTML = template(user_info);
        },
        // 计算年龄
        getAge: function (birth) {
            var birthday = new Date(birth.replace(/-/g, "/"));
            var birthYear = birthday.getFullYear();
            var birthMonth = birthday.getMonth() + 1;

            var now = new Date();
            var nowYear = now.getFullYear();
            var nowMonth = now.getMonth() + 1;

            if (nowYear < birthYear) return;

            var age = nowYear - birthYear;

            if (nowMonth > birthMonth) {
                return age;
            }

            var birthDay = birthday.getDate();
            var nowDay = now.getDate();

            if ((nowMonth < birthMonth) || (nowMonth === birthMonth && nowDay < birthMonth)) {
                return --age;
            } else {
                return age;
            }
        },
        // 计算星座
        getConstellation: function (birth) {
            birthday = new Date(birth.replace(/-/g, "/"));
            var month = birthday.getMonth() + 1;
            var date = birthday.getDate();
            var constellations = ['摩羯', '水瓶', '双鱼', '白羊', '金牛', '双子', '巨蟹', '狮子', '处女', '天秤', '天蝎', '射手', '摩羯'];
            return constellations[month - (date - 14 <= '546567888987'.charAt(month - 1))];
        },
        // 查找城市名
        getAddress: function (user) {
            var add = {};
            add.province = user.province;
            add.city = user.city;

            for (var i = 0; i < ADDRESS_CODES.length; i++) {
                if (ADDRESS_CODES[i][0] == add.province) {
                    var cityArr = ADDRESS_CODES[i][2];
                    for (var j = 0; j < cityArr.length; j++) {
                        if (cityArr[j][0] == add.city) {
                            return cityArr[j][1];
                        }
                    }
                }
            }
        }
    });

    App.Profile = Profile;

})(window.App);

/* 侧边栏 */
(function (App) {
    var template = `<ul>
        <li class="dot"><a>个人中心</a></li>
        <li class="z-select"><a>我的作品</a></li>
        <li><a>我关注的</a></li>
        <li><a>我的圈子</a></li>
        <li><a>消息提醒</a></li>
        <li><a>隐私设置</a></li>
    </ul>`;

    /**
     * options 参数说明
     * {
     *    container: dom节点, 父容器, (必填)
     * }
     **/
    var Aside = {
        // 初始化
        init: function (options) {
            // 继承配置
            _.extend(this, options);
            // 缓存节点
            this.layout = _.html2node(template);
            this.container.appendChild(this.layout);
        }
    };

    App.Aside = Aside;

})(window.App);

/* 分页组件
 * 状态
 * emit: pageChange
 */
(function (App) {
    // 默认选中页码
    var DEFAULT_CURRENT_PAGE = 1;
    // 默认显示的页码个数
    var DEFAULT_SHOW_NUM = 8;
    // 每页显示的默认数量
    var DEFAULT_ITEMS_LIMIT = 10;

    /**
     *  options = {
	*	 parent: dom节点
	*    total: number 总共作品数
	*    current: number 当前页码
    *    showNum: number 显示页码个数
    *    itemsLimit: number 每页显示的项目数量
	*  }
     */
    function Pagination(options) {
        // 继承配置
        _.extend(this, options);
        // 当前页码
        this.current = options.current || DEFAULT_CURRENT_PAGE;
        // 显示页码个数
        this.showNum = options.showNum || DEFAULT_SHOW_NUM;
        // 每页显示项目数量
        this.itemsLimit = options.itemsLimit || DEFAULT_ITEMS_LIMIT;
        // 总项目数量
        this.total = options.total || 0;

        this.render(this.current, this.total);
    }

    _.extend(Pagination.prototype, App.localEmitter);

    _.extend(Pagination.prototype, {
        render: function (current, total) {
            this.destroy();

            this.current = current || this.current;
            this.total = total || this.total;

            //判断当前页页码是否大于总页码（ 删除作品操作造成 )
            this.pageNum = Math.ceil(this.total / this.itemsLimit);
            if (this.current > this.pageNum) {
                this.current--;
            }

            var ul = _.createElement('ul', 'm-pagination');
            //第一页
            this.first = _.createElement('li', '', '第一页');
            this.first.dataset.page = 1;
            //上一页
            this.prev = _.createElement('li', '', '上一页');
            this.prev.dataset.page = this.current - 1;
            ul.appendChild(this.first);
            ul.appendChild(this.prev);

            //当前起始页
            this.startNum = Math.floor((this.current - 1) / this.showNum) * this.showNum + 1;
            this.nNums = [];
            for (var i = 0; i < this.showNum; i++) {
                var nNum = _.createElement('li'),
                    num = this.startNum + i;
                if (num <= this.pageNum) {
                    nNum.innerHTML = num;
                    nNum.dataset.page = num;
                    this.nNums.push(nNum);
                    ul.appendChild(nNum);
                }
            }

            //下一页
            this.next = _.createElement('li', '', '下一页');
            this.next.dataset.page = this.current + 1;
            //尾页
            this.last = _.createElement('li', '', '尾页');
            this.last.dataset.page = this.pageNum;
            ul.appendChild(this.next);
            ul.appendChild(this.last);

            this.parent.appendChild(ul);
            this.container = ul;

            this.setStatus();
            this.addEvent();
        },
        destroy: function () {
            if (this.container) {
                this.parent.removeChild(this.container);
                this.container = null;
            }
        },
        setStatus: function () {
            if (this.current === 1) {
                this.first.className = 'disabled';
                this.prev.className = 'disabled';
            } else {
                this.first.className = '';
                this.prev.className = '';
            }
            if (this.current === this.pageNum) {
                this.next.className = 'disabled';
                this.last.className = 'disabled';
            } else {
                this.next.className = '';
                this.last.className = '';
            }

            this.prev.dataset.page = this.current - 1;
            this.next.dataset.page = this.current + 1;

            this.nNums.forEach(function (nNum) {
                nNum.className = '';
                if (this.current === parseInt(nNum.dataset.page)) {
                    nNum.className = 'active';
                }
            }.bind(this));
        },
        addEvent: function () {
            var clickHandler = function (e) {
                var nNum = e.target;
                //如果已经是disabled或active状态，则不操作
                if (nNum.className === 'disabled' || nNum.className === 'active') return;
                this.current = parseInt(nNum.dataset.page);
                //判断是否需要翻页
                if (this.current < this.startNum || this.current >= this.startNum + this.showNum) {
                    this.render();
                } else {
                    this.setStatus();
                }
                //有切换动作就需要回调
                this.emit('pageChange', this.current);
            }.bind(this);
            this.container.addEventListener('click', clickHandler);
        }
    });

    App.Pagination = Pagination;

})(window.App);

/* 作品列表 */
(function (App) {
    var template = `<div>
        <h2 class="title">/ 我 的 发 表 作 品 /</h2>
        <a href="${BASE_URL}/html/works/create.html">
            <button id="upload" class="u-btn u-btn-primary">上传作品</button>
        </a>
        <ul class="m-works" id="workslist"></ul>
        </div>`;

    var DEFAULT_QUERY_LIMIT = 15;   // 请求条数

    /**
     * options 参数说明
     * {
     *    container: dom节点, 父容器, (必填)
     *    query: {
     *               total: number  是否需要返回总数 0否1是
     *               offset: number  偏移数
     *               limit: number  请求条数
     *           }
     * }
     **/
    function WorksList(options) {
        // 继承配置
        _.extend(this, options);

        // 查询参数初始化
        this.query = this.query || {};
        this.query.total = this.query.total || 1;   // 是否需要返回总数 0否1是
        this.query.offset = this.query.offset || 0; // 偏移数
        this.query.limit = this.query.limit || 15; // 请求条数

        // 初始化
        this.init();
    }

    _.extend(WorksList.prototype, App.localEmitter);

    WorksList.prototype.init = function () {
        // 渲染列表头
        this._layout = _.html2node(template);
        this.container.appendChild(this._layout);

        // 缓存节点
        this.worksContainer = this._layout.querySelector('#workslist');

        // 添加loading图标
        // _.addClass(this.worksContainer, 'addloading');

        // 加载作品列表信息
        this.loadList({
            query: this.query,
            callback: function (data) {
                if (!data.result.data.length) {
                    this.worksContainer.innerHTML = "你还没有创建过作品～";
                    return;
                }
                //首次加载
                this.renderList(data.result.data);  // 渲染作品列表
                this.addEvent();   // 整个作品列表上绑定点击事件 管理作品删除、编辑事件
                this.initPagination(data.result.total); // 初始化分页组件
                this.worksSum = data.result.total;
            }.bind(this)
        });
    };

    /**
     * options 参数说明
     * {
     *    query: {
     *               total: number  是否需要返回总数 0否1是
     *               offset: number  偏移数
     *               limit: number  请求条数
     *           }
     *
     *    callback: function 获取到作品列表信息后的回调函数
     * }
     **/
    WorksList.prototype.loadList = function (options) {
        var LOADING = true;

        // 隐藏已有数据列表
        this.worksContainer.innerHTML = '';
        // 超时500ms 添加loading图标
        setTimeout(function () {
            if (LOADING === true)
                _.addClass(this.worksContainer, 'addloading');
        }.bind(this), 500);

        _.ajax({
            url: _.getApiUrl('/api/works'),
            data: {
                total: options.query.total,
                offset: options.query.offset,
                limit: options.query.limit
            },
            success: function (data) {
                LOADING = false;
                // 取消loading图标
                _.delClass(this.worksContainer, 'addloading');
                options.callback(data);
            }.bind(this)
        });
    };

    WorksList.prototype.renderList = function(list){
        //拼装列表的 html 字符串
        var rawTemplate = `
                {{#each works}}
                <li class="item" data-id="{{this.id}}">
                    <a>
                        {{#if this.coverUrl}}
                        <img src="{{this.coverUrl}}" alt="{{this.name}}">
                        {{else}}
                        <img src="${BASE_URL}/res/images/default_cover.png" alt="作品默认封面">
                        {{/if}}
                        <h3 class="f-thide">{{this.name}}</h3>
                    </a>
                    <div class="icons f-dn">
                        <i class="u-icon u-icon-delete"></i>
                        <i class="u-icon u-icon-edit"></i>
                    </div>
                </li>
                {{/each}}
            `;
        var template = Handlebars.compile(rawTemplate);
        var context = {
            'works': list
        };
        var html = template(context);
        this.worksContainer.innerHTML = html;
    };

    WorksList.prototype.addEvent = function () {
        //给编辑和删除图标添加点击事件
        var self = this;
        this.worksContainer.addEventListener('click', function (e) {
            var target = e.target;
            if (_.hasClass(target, 'u-icon')) {
                var nWork = target.parentNode.parentNode;
                var nName = nWork.querySelector('h3');
                var options = {
                    name: nName.innerHTML,
                    id: parseInt(nWork.dataset.id)
                };
                if (_.hasClass(target, 'u-icon-delete')) {
                    self.deleteWorks(options);
                } else if (_.hasClass(target, 'u-icon-edit')) {
                    self.editWorks(options, nWork);
                }
            }
        });
    };

    WorksList.prototype.deleteWorks = function (options) {
        var self = this;
        var modal = new App.Modal({
            HEAD: true,
            content: '确定要删除作品 <em class="del-item-name">"' + options.name + '"</em> 吗？',
            FOOT: true
        });
        //需要自己注册confirm监听事件
        modal.on('confirmModal', function () {
            this.hide();
            _.ajax({
                // url: _.getApiUrl('/api/works/'+options.id,'DELETE'),
                url: _.getApiUrl('/api/works?id', 'DELETE'),
                method: _.fixMethod('DELETE'),
                data: {id: options.id},
                success: function (data) {
                    if (data.code === 200) {
                        // 重新渲染分页 跳转至删除操作时所在页 或 上一页
                        self.pagination.render(self.pagination.current, self.worksSum);
                        // 重新渲染作品列表
                        self.pagination.emit('pageChange', self.pagination.current);
                    }
                }
            });
        });
        modal.show();
    };

    WorksList.prototype.editWorks = function(options,nWork){
        var nInput, nError;
        var modal = new App.Modal({
            HEAD: true,
            title: '请输入新的作品名称',
            content: `
                <input class="item-name-ipt" value="${options.name}"/>
                <i class='f-dn'></i>`,
            FOOT: true
        });
        modal.on('confirmModal', function(){
            var newName = nInput.value.trim();

            // 如果新名称为空字符串，则返回错误提示
            if(newName === ''){
                nError = modal.nBody.querySelector('i');
                nError.innerText = '名称不能为空';
                _.addClass(nError, 'item-name-error');
                return;
            }

            // 新名称有效， 则关闭编辑名称弹窗
            this.hide();

            if (newName !== options.name) {
                _.ajax({
                    // url: _.getApiUrl('/api/works/'+options.id,'PATCH'),
                    url: _.getApiUrl('/api/works?id', 'PATCH'),
                    method: _.fixMethod('PATCH'),
                    data: {name: newName},
                    success: function (data) {
                        if (data.code === 200) {
                            // 如果新名称修改正常，修改新名称
                            // nWork.querySelector('h3').innerText = data.result.name;
                            nWork.querySelector('h3').innerText = newName;
                        } else {
                            // 如果新名称修改失败，调用错误提示弹窗
                            var tipModal = new App.Modal({
                                content: data.msg,
                                CANCEL: false
                            });
                            tipModal.show();
                            tipModal.on('confirmModal', function () {
                                this.hide();
                            }.bind(this));
                        }
                    }
                });
            }

        });
        modal.show();
        // 默认选中弹窗中输入框内的字符串
        nInput = modal.nBody.querySelector('input');
        nInput.focus();
        // nInput.setSelectionRange(0,-1);  //safari 不兼容第二个参数为负值
        nInput.setSelectionRange(0, nInput.value.length + 1);
    };

    WorksList.prototype.initPagination = function (worksTotal) {

        this.pagination = new App.Pagination({
            parent: _.$('#pagination'),
            total: worksTotal,
            current: 1,
            showNum: 8,
            itemsLimit: 15
        });

        this.pagination.on('pageChange', function (currentPage) {
            this.loadList({
                query: {
                    total: 0,
                    offset: (currentPage - 1) * 15,
                    limit: 15
                },
                callback: function (data) {
                    this.renderList(data.result.data);
                }.bind(this)
            });
        }.bind(this));
    };

    App.WorksList = WorksList;

})(window.App);