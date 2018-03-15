// 防止window.App 不存在
if (!window.App || typeof window.App !== 'object') {
    window.App = {};
}


/* Tabs */
(function (App) {

    // 模板
    var template = Handlebars.compile(`<div class="m-tabs {{class}}" id="{{id}}">
		<ul>
			{{#each nTabData}}
				<li><a href="{{url}}">{{name}}</a></li>
			{{/each}}
		</ul>
		<div class="tabs-track">
			<div class="tabs-thumb"></div>
		</div>
	</div>`);

    /** options 参数说明
     * {
	*   container: dom节点, 父容器 (必填)
	*   index: num类型，Tab选中项的序号
	*   nTabData: [     选项卡数据 (必填)
	*     {
	*       name: str, tab名称
	*       url: str,  url地址
	*     }
	*   ],
	*   id: 组件id名
	*   class: str,  Tab的扩展样式
	* }
     */
    function Tabs(options) {
        // 将options 复制到 组件实例上
        _.extend(this, options);
        this.index = this.index || 0;

        //缓存节点
        this.layout = _.html2node(template(this));
        this.nTab = this.layout.getElementsByTagName('ul')[0];
        this.nTabs = this.nTab.children;
        this.tabs = this.nTab.getElementsByTagName('a');
        this.track = this.layout.querySelector('.tabs-track');
        this.nThumb = this.track.querySelector('.tabs-thumb');

        //动态构建滑动条
        this.nThumb.style.width = this.nTabs[this.index].offsetWidth + 'px';
        this.nThumb.style.left = this.nTabs[this.index].offsetLeft + 'px';

        this._init();
    }

    Tabs.prototype._init = function () {
        //绑定事件
        for (var i = 0; i < this.nTabs.length; i++) {
            this.nTabs[i].addEventListener('mouseenter', function (index) {
                this._highlight(index);
            }.bind(this, i));
            this.nTabs[i].addEventListener('click', function (index) {
                this._setCurrent(index);
            }.bind(this, i));
        }
        this.nTab.addEventListener('mouseleave', function () {
            this._highlight(this.index);
        }.bind(this));

        // 将组件载入页面(先挂载组件，在获取offset值，不然为0)
        this.container.appendChild(this.layout);

        this._setCurrent(this.index);
    };

    Tabs.prototype._setCurrent = function (index) {
        _.delClass(this.tabs[this.index], 'z-slide');
        this.index = index;
        _.addClass(this.tabs[index], 'z-slide');
        this._highlight(index);
    };

    Tabs.prototype._highlight = function (index) {
        var tab = this.nTabs[index];
        this.nThumb.style.width = tab.offsetWidth + 'px';
        this.nThumb.style.left = tab.offsetLeft + 'px';
    };

    App.Tabs = Tabs;
})(window.App);

/* Search */
(function (App) {
    // 模板
    var template = `<div class="m-topsrch">
            <form class="m-search" action="${PAGES_URL}/search" id="search" method="GET">
                <input type="text" id="keyword" name="keyword" placeholder="输入搜索内容" autocomplete="off">
                <button type="submit"><i class="u-icon u-icon-search"></i></button>
                <span class="icon-txt">搜索</span>
            </form>
        </div>`;

    /**
     * options 参数说明
     * {
     *    container: dom节点, 父容器 (必填)
     * }
     **/
    function Search(options) {
        // 将options 复制到 组件实例上
        _.extend(this, options);

        // 缓存节点
        this.nForm = this._layout.cloneNode(true);
        this.nKeyword = this.nForm.getElementsByTagName('input')[0];

        // 初始化
        this._init();
    }

    // 用于复用的dom节点
    Search.prototype._layout = _.html2node(template);
    Search.prototype._init = function () {
        this.nForm.addEventListener('submit', this._search.bind(this));
        // 挂载组件
        this.container.appendChild(this.nForm);
    };
    Search.prototype._search = function (event) {
        var notVaild = false;
        var srcIpt = event.target.keyword;

        if (/^\s*$/.test(srcIpt.value)) {
            notVaild = true;
        }

        if (notVaild) {
            event.preventDefault();
            return;
        }

        srcIpt.value = srcIpt.value.trim();
    };

    App.Search = Search;
})(window.App);

/* Guest emit: toLogin、toRegister */
(function (App) {
    // 模版
    var template = `<div class="m-guest f-dn" id="guest" style>
            <button class="u-btn u-btn-primary u-btn-icon" id="login"><i class="u-icon u-icon-user"></i>登&nbsp;&nbsp;录</button>
            <button class="u-btn" id="register">注&nbsp;&nbsp;册</button>
        </div>`;

    /**
     * options 参数说明
     * {
     *    container: dom节点, 父容器 (必填)
     * }
     **/
    function Guest(options) {
        // 将options 复制到 组件实例上
        _.extend(this, options);

        // 缓存节点
        this.layout = this._layout.cloneNode(true);
        this.nLogin = this.layout.querySelector('#login');
        this.nRegister = this.layout.querySelector('#register');

        // 初始化
        this._init();
    }

    // 混入事件管理器
    _.extend(Guest.prototype, App.localEmitter);

    // 用于复用的dom节点
    Guest.prototype._layout = _.html2node(template);

    // 初始化（绑定事件，将组件载入页面）
    Guest.prototype._init = function () {
        // 挂载组件
        this.container.appendChild(this.layout);

        // 订阅事件
        // this.on('loggedin', this.hide.bind(this)); // 登录事件
        // this.on('notLoggedin', this.show.bind(this)); // 未登录事件

        // 绑定事件
        this.nLogin.addEventListener('click', this.loginHandler.bind(this));
        this.nRegister.addEventListener('click', this.registerHandler.bind(this));
    }

    // 显示此组件
    Guest.prototype.show = function () {
        _.delClass(this.layout, 'f-dn');
    };

    // 隐藏此组件
    Guest.prototype.hide = function () {
        _.addClass(this.layout, 'f-dn');
    };

    Guest.prototype.loginHandler = function () {
        // 弹出登录弹窗
        this.emit('toLogin');
    };

    Guest.prototype.registerHandler = function () {
        // 弹出注册弹窗
        this.emit('toRegister');
    };

    App.Guest = Guest;
})(window.App);

/* User emit: notLoggedin */
(function (App) {
    // 模版
    var template = `<div class="m-user  f-dn" id="userdropdown">
            <div class="u-info">
                <span class="u-avatar"><img src="${BASE_URL}/res/images/avater.png" alt="个人头像"></span>
                <span>
                    <span class="u-name f-thide" id="name"></span>
                    <span class="u-icon"></span>
                </span>
            </div>
            <span class="u-icon u-icon-down"></span>
            <ul class="user-list f-cb f-dn">
                <li><a>个人中心</a></li>
                <li><a>信息</a></li>
                <li><a>设置</a></li>
                <li id="logout"><a>退出账号</a></li>
            </ul>
        </div>`;

    /**
     * options 参数说明
     * {
     *    container: dom节点, 父容器 (必填)
     * }
     **/
    function User(options) {
        // 将options 复制到 组件实例上
        _.extend(this, options);

        // 缓存节点
        this.layout = this._layout.cloneNode(true);
        this.nLogout = this.layout.querySelector('#logout');
        this.nName = this.layout.querySelector('#name');
        this.nSexIcon = this.nName.nextElementSibling;

        // 初始化
        this._init();
    }

    // 混入事件管理器
    _.extend(User.prototype, App.localEmitter);

    // 用于复制的Dom节点
    User.prototype._layout = _.html2node(template);

    // 初始化（绑定事件，将组件载入页面）
    User.prototype._init = function () {
        // 挂载组件
        this.container.appendChild(this.layout);

        // 订阅事件
        // this.on('loggedin', this.show.bind(this)); // 登录事件

        //绑定退出登录
        this.nLogout.addEventListener('click', this.logoutHandler.bind(this));
    };

    // 显示此组件
    User.prototype.show = function (user) {
        this.initUserInfo(user);
        _.delClass(this.layout, 'f-dn');

    };

    // 隐藏此组件
    User.prototype.hide = function () {
        _.addClass(this.layout, 'f-dn');
    };

    // 初始化用户信息
    User.prototype.initUserInfo = function (user) {
        var iconConfig = [
            'u-icon-male',
            'u-icon-female'
        ];
        // 设置用户姓名
        this.nName.innerText = user.nickname;
        // 清空之前的用户性别icon
        for (var key in iconConfig) {
            _.delClass(this.nSexIcon, iconConfig[key]);
        }
        // 设置用户性别Icon
        _.addClass(this.nSexIcon, iconConfig[user.sex]);
    };

    // 退出登录
    User.prototype.logoutHandler = function () {
        _.ajax({
            url: _.getApiUrl('/api/logout', 'POST'),
            method: _.fixMethod('POST'),
            data: {},
            success: function (data) {
                if (data.code === 200) {
                    if (window.location.pathname === (BASE_URL + '/index.html')) {
                        // 用于 StarList 中，点击关注时判断登录状态
                        window.App.user = {};
                        this.hide();
                        // 触发未登录事件
                        this.emit('notLoggedin');
                    } else {
                        // 非首页退出登录，则跳转回首页
                        window.location.href = BASE_URL + "/index.html";
                    }
                }
            }.bind(this),
            fail: function () {
            }
        });
    };

    App.User = User;

})(window.App);

/* 通用 Modal emit: closeModal、confirmModal、cancelModal*/
(function (App) {
    var str = `<div>
            <div class="m-modal">
                {{#if HEAD}}
                    <div class="modal-head">标题</div>
                {{/if}}
                <div class="modal-body">内容</div>
                {{#if FOOT}}
                    <div class="modal-foot toggle hover">
                        <label>
                            <input type="radio" checked>
                            <button class="u-btn confirm">确认</button>
                        </label>
                        {{#if CANCEL}}
                        <label>
                            <input type="radio">
                            <button class="u-btn cancel">取消</button>
                        </label>
                        {{/if}}
                    </div>
                {{/if}}
                <span class="close u-icon u-icon-close" title="关闭"></span>
            </div>
            <div class="m-modal-mask"></div>
        </div>`;


    /**
     * options 参数说明
     * {
     *    container: dom节点, 父容器 (可选), 默认为 document.body
     *    content： str | node, 需要显示的内容，默认undefined, 自定义
     *
     *    HEAD: bool, 标题， 默认不显示(false)
     *    title： str, 若开启标题，要显示的标题内容， 默认为'提示'
     *    FOOT: bool, 确认/取消等底部操作区域， 默认不显示(false)
     *    CANCEL: bool, 底部取消按钮， 若开启FOOT，默认显示(true)
     *    MASK: bool, 遮罩， 默认显示(true)
     *    CHECK: bool, 是否开启检验信息，若开启，则提交（确认时）要手动关闭弹窗（调用hide），默认开启(true)
     * }
     **/
    function Modal(options) {

        options = options || {};
        // 将options 复制到 组件实例上
        _.extend(this, options);

        this.container = this.container || document.body;

        if (this.MASK === undefined) {
            this.MASK = true;  // 默认显示遮罩
        }
        if (this.HEAD === undefined) {
            this.HEAD = false;   // 默认不显示标题
        }
        if (this.FOOT === undefined) {
            this.FOOT = false;   // 默认不显示底部（确认/取消区域）
        }
        if (this.CANCEL === undefined) {
            this.CANCEL = true; // 默认不显示取消按钮
        }
        if (this.CHECK === undefined) {
            this.CHECK = true;  // 默认开启检验
        }
        this.title = this.title || '提示';

        // 缓存dom节点
        this.layout = this._layout();
        this.nModal = this.layout.querySelector('.m-modal');
        // 自定义内容
        this.nBody = this.nModal.querySelector('.modal-body');
        // 标题
        if (this.HEAD) {
            this.nHead = this.nModal.querySelector('.modal-head');
        }
        // 底部操作区域（确认/取消）
        if (this.FOOT) {
            this.nFoot = this.nModal.querySelector('.modal-foot');
            this.nConfirm = this.nFoot.querySelector('.confirm');
            if (this.CANCEL) {
                this.nCancel = this.nFoot.querySelector('.cancel');
            }
        }
        // 遮罩
        this.nMask = this.layout.querySelector('.m-modal-mask');
        // 关闭按钮
        this.nClose = this.layout.querySelector('.close');

        // 初始化
        this._initEvent();
    }

    _.extend(Modal.prototype, App.localEmitter);

    _.extend(Modal.prototype, {

        _layout: function () {
            var template = Handlebars.compile(str);
            var context = {HEAD: this.HEAD, FOOT: this.FOOT, CANCEL: this.CANCEL};
            var html = template(context);
            return _.html2node(html);
        },

        // 初始化事件
        _initEvent: function () {
            this.nClose.addEventListener(
                'click', this.hide.bind(this)
            );

            if (this.FOOT) {
                this.nConfirm.addEventListener('click', this._onConfirm.bind(this));
                if (this.CANCEL) {
                    this.nCancel.addEventListener('click', this._onCancel.bind(this));
                }
            }
        },

        // 显示弹窗
        // content: str | node 自定义提示的主内容
        show: function (content) {
            content = content || this.content;
            if (content) this.setContent(content);
            if (this.HEAD) {
                this.nHead.innerText = this.title;
            }
            this.container.appendChild(this.nModal);

            if (this.MASK) {
                // document.body.style.overflowY = "hidden";
                _.addClass(this.nMask, 'visible');
                this.container.appendChild(this.nMask);
            }
        },

        hide: function () {
            this.container.removeChild(this.nModal);
            if (this.MASK) {
                // document.body.style.overflowY = "scroll";
                this.container.removeChild(this.nMask);
            }

            this.emit('closeModal');
        },

        // 自定义弹窗内容区域的内容
        setContent: function (content) {
            if (!content) return;

            //支持两种字符串结构和DOM节点
            if (content.nodeType === 1) {
                this.nBody.innerHTML = "";
                this.nBody.appendChild(content);

            } else {
                this.nBody.innerHTML = content;
            }
        },

        _onCancel: function () {
            this.emit('cancelModal');
            this.hide();
        },

        _onConfirm: function () {
            /* 需要自己注册confirm监听事件 */
            this.emit('confirmModal');

            // 有无信息检验，没有的话直接关闭弹窗，有的话需要手动调用hide去关闭
            /* 如果弹窗中需要输入信息，当输入信息有误时点击确定不能关闭 */
            if (!this.CHECK) {
                this.hide();
            }
        },

        showError: function (node, flag) {
            flag ? _.addClass(node, 'u-error') : _.delClass(node, 'u-error');
        }

    });

    App.Modal = Modal;
})(window.App);

/* 导航顶栏 emit: toLogin、toRegister notLoggedin ; on: loggedin */
(function (App) {
    // 模版
    var template = `<div class="m-nav f-cb">
        <!-- logo -->
        <h1 class="u-icon u-icon-logo">
            <a hidefocus="true" href="${BASE_URL}">ego /漫画学园/</a>
        </h1>
    </div>`;

    /**
     * options 参数说明
     * {
     *    container: dom节点, 父容器 (必填)
     * }
     **/
    function Nav(options) {
        // 将options 复制到 组件实例上
        _.extend(this, options);

        // 缓存节点
        this.layout = this._layout.cloneNode(true);

        // 初始化
        this._init();
    }

    _.extend(Nav.prototype, App.localEmitter);

    Nav.prototype._layout = _.html2node(template);

    Nav.prototype._init = function () {
        // 先挂载容器组件，不然Tabs的滑块offset定位不准确
        this.container.appendChild(this.layout);

        // 1.顶栏选项卡 组件
        this.hdtab = new App.Tabs({
            container: this.layout,
            index: this.getTabIndex(),
            nTabData: [
                {name: '首页', url: BASE_URL + '/index.html'},
                {name: '作品', url: BASE_URL + '/html/works/list.html'},
                {name: '圈子', url: 'javascript:void(0);'},
                {name: '奇思妙想', url: 'javascript:void(0);'}
            ],
            id: 'hdtabs',
            class: 'm-tabs-hd'
        });

        // 2.搜索框 组件
        this.search = new App.Search({
            container: this.layout
        });

        // 3.未登录显示的客人 组件
        this.guest = new App.Guest({
            container: this.layout
        });
        // 传递guest发射的事件（给注册/登录弹窗组件）
        this.guest.on('toLogin', function(){
            this.emit('toLogin');
        }.bind(this));
        this.guest.on('toRegister', function () {
            this.emit('toRegister');
        }.bind(this));

        // 4.已登录显示的用户 组件
        this.user = new App.User({
            container: this.layout
        });
        this.user.on('notLoggedin', function () {
            this.guest.show();
            // 传递给 starlist 组件
            this.emit('notLoggedin');
        }.bind(this));

        // 注册事件
        this.on('loggedin', function (user) {
            this.guest.hide();
            this.user.show(user);
        }.bind(this));

        this.initLoginStatus();
    };

    //  获取tab的选中项的序号
    Nav.prototype.getTabIndex = function () {
        // 根据url 的path，决定 tab的index
        switch (window.location.pathname.split('/')[2]) {
            // 作品页    /html/works/list.html->['','html','works','list.html']
            case 'works':
                return 1;
            // 首页（默认）
            default:
                return 0;
        }
    };

    Nav.prototype.initLoginStatus = function () {
        _.ajax({
            url: _.getApiUrl('/api/users?getloginuser'),
            success: function (data) {
                // 200表示请求成功{code,msg,result[user]}
                if (data.code == 200) {
                    window.App.user = data.result;
                    // 触发登录事件
                    this.emit('loggedin', data.result);
                } else {
                    // 触发未登录事件
                    // this.emit('notLoggedin');

                    this.user.hide();
                    this.guest.show();
                }
                console.log(data);
            }.bind(this),
            fail: function (data) {
                console.log("User Login Status: Log Out." + data);
            }
        });
    };

    App.Nav = Nav;

})(window.App);





