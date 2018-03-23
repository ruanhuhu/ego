// 首页
(function (App) {
    var page = {
        init: function () {
            // 编译模板（主内容区）
            this.compileTemplateMain();
            // 编译模板（侧边栏）
            this.compileTemplateAside();
            // 添加底栏
            this.initFooter();

            // 导航
            this.initNav();
            // 轮播图
            this.initSlider();
            // 侧边栏排行榜tabs
            this.initRankingTabs();
        },
        // 编译 主内容区 模板
        compileTemplateMain: function () {
            var html = '';

            // 精选推荐
            html += App.template.m_section({
                section_style: 'm-recommend',
                icon: 'u-icon-diamond',
                title: '/ 精 选 推 荐 /',
                cnt: App.template.img_list({
                    list_style: 'm-list-4',
                    list: [
                        {img_url: BASE_URL + '/res/images/work1.jpg', img_alt: '作品1'},
                        {img_url: BASE_URL + '/res/images/work2.jpg', img_alt: '作品2'},
                        {img_url: BASE_URL + '/res/images/work3.jpg', img_alt: '作品3'},
                        {img_url: BASE_URL + '/res/images/work4.jpg', img_alt: '作品4'}
                    ]
                })
            });

            // 明日之星
            html += App.template.m_section({
                section_style: 'm-starlist',
                icon: 'u-icon-star',
                title: '/ 明 日 之 星 /',
                cnt: '<ul class="section-cnt m-list m-list-3 f-cb" id="starlist"></ul>'
            });

            // 最新作品
            html += App.template.m_section({
                section_style: 'm-newwork',
                icon: 'u-icon-work',
                title: '/ 最 新 作 品 /',
                cnt: App.template.img_list({
                    list_style: 'm-list-1',
                    list: [
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品1', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品2', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品3', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品4', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品5', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品6', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品7', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品8', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品9', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品10', img_name: '我是作品名称'}
                    ]
                })
            });

            // 活动进行时
            html += App.template.m_section({
                section_style: 'm-activities',
                icon: 'u-icon-activity',
                title: '/ 活 动 进 行 时 /',
                cnt: App.template.activities_list({
                    list_style: 'm-list-2',
                    act_one: {
                        img_url: BASE_URL + '/res/images/actimg1.jpg',
                        img_alt: '活动1',
                        title: '第五期 | 我是活动主题名称',
                        date: '7.23 - 8.12'
                    },
                    act_two: {
                        img_url: BASE_URL + '/res/images/actimg2.jpg',
                        img_alt: '活动2',
                        title: '第五期 | 我是活动主题名称',
                        description: '根据维基百科的定义，做决定／决策是一个认知过程，这种认知过程以“从多个可能中作出选择”为结果。每个做决定的过程都会产生出一个最后的选择，尽管这种选择也有可能不会被付诸行动。',
                        date: '7.30 - 8.23'
                    }
                })
            });

            // 我们都爱原创
            html += App.template.m_section({
                section_style: 'm-original',
                icon: 'u-icon-love',
                title: '/ 我 们 都 爱 原 创 /',
                cnt: App.template.img_list({
                    list_style: 'm-list-1',
                    list: [
                        {img_url: BASE_URL + '/res/images/work_big1.jpg', img_alt: '作品1', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品2', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品3', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small2.jpg', img_alt: '作品4', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品5', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品6', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small2.jpg', img_alt: '作品7', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small2.jpg', img_alt: '作品8', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品9', img_name: '我是作品名字称'},
                    ]
                })
            });

            // 我们都是同人粉
            html += App.template.m_section({
                section_style: 'm-fans',
                icon: 'u-icon-fans',
                title: '/ 我 们 都 是 同 人 粉 /',
                cnt: App.template.img_list({
                    list_style: 'm-list-1',
                    list: [
                        {img_url: BASE_URL + '/res/images/work_big1.jpg', img_alt: '作品1', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品2', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品3', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small2.jpg', img_alt: '作品4', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small2.jpg', img_alt: '作品5', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品6', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small2.jpg', img_alt: '作品7', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small2.jpg', img_alt: '作品8', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品9', img_name: '我是作品名字称'},
                    ]
                })
            });

            // 我们都是同人粉
            html += App.template.m_section({
                section_style: 'm-copy',
                icon: 'u-icon-copy',
                title: '/ 看 谁 临 摹 的 最 好 /',
                cnt: App.template.img_list({
                    list_style: 'm-list-1',
                    list: [
                        {img_url: BASE_URL + '/res/images/work_big1.jpg', img_alt: '作品1', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品2', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品3', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small2.jpg', img_alt: '作品4', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small2.jpg', img_alt: '作品5', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品6', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small2.jpg', img_alt: '作品7', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small2.jpg', img_alt: '作品8', img_name: '我是作品名字称'},
                        {img_url: BASE_URL + '/res/images/work_small1.jpg', img_alt: '作品9', img_name: '我是作品名字称'},
                    ]
                })
            });

            // 编译结果，载入页面主内容区
            _.$('.g-main').innerHTML = html;
        },

        // 编译 侧边栏 模板
        compileTemplateAside: function () {
            var html = '';

            // 侧边栏 我的作品
            html += '<div class="m-section m-mywork">\
                <h4 class="section-head">\
                    <i class="u-icon u-icon-sideavatar"></i> 我 的 作 品\
                    <span class="section-more">\
                        <a href="javascript:void(0);"><i class="u-icon u-icon-moredown"></i></a>\
                    </span>\
                </h4>\
                <ul class="section-cnt m-list f-cb">\
                    <li><a><img src="' + BASE_URL + '/res/images/avatar64541.jpg" alt="作品1"></a></li>\
                </ul>\
            </div>';

            // 侧边栏 圈子
            html += App.template.aside_groups({
                list: [
                    {
                        img_url: BASE_URL + '/res/images/circle1.jpg',
                        img_alt: '图片',
                        group_name: '门口小贩',
                        group_members: 5221
                    },
                    {
                        img_url: BASE_URL + '/res/images/circle2.jpg',
                        img_alt: '图片',
                        group_name: '原画集中营',
                        group_members: 2132
                    },
                    {
                        img_url: BASE_URL + '/res/images/circle3.jpg',
                        img_alt: '图片',
                        group_name: '—Horizon—',
                        group_members: 910
                    }
                ]
            });

            // 侧边栏 热门话题
            html += App.template.aside_hottopic({
                list: [
                    {topic_url: 'javascript:void(0);', topic_title: '1. 【萝莉学院】你不知道的那些事儿这是标题标题标题标题标题标题标题标题标题标题'},
                    {topic_url: 'javascript:void(0);', topic_title: '1. 【萝莉学院】你不知道的那些事儿这是标题标题标题标题标题标题标题标题标题标题'},
                    {topic_url: 'javascript:void(0);', topic_title: '1. 【萝莉学院】你不知道的那些事儿这是标题标题标题标题标题标题标题标题标题标题'},
                    {topic_url: 'javascript:void(0);', topic_title: '1. 【萝莉学院】你不知道的那些事儿这是标题标题标题标题标题标题标题标题标题标题'},
                    {topic_url: 'javascript:void(0);', topic_title: '1. 【萝莉学院】你不知道的那些事儿这是标题标题标题标题标题标题标题标题标题标题'}
                ]
            });

            // 侧边栏 排行
            html += App.template.aside_toplist({
                list: [
                    {
                        img_url: BASE_URL + '/res/images/work_small1.jpg',
                        img_alt: '图片',
                        work_name: '我是作品名称',
                        work_author: '用户名',
                        work_visit: 2348,
                        work_collection: 421
                    },
                    {
                        img_url: BASE_URL + '/res/images/work_small1.jpg',
                        img_alt: '图片',
                        work_name: '我是作品名称',
                        work_author: '用户名',
                        work_visit: 2348,
                        work_collection: 421
                    },
                    {
                        img_url: BASE_URL + '/res/images/work_small1.jpg',
                        img_alt: '图片',
                        work_name: '我是作品名称',
                        work_author: '用户名',
                        work_visit: 2348,
                        work_collection: 421
                    },
                    {
                        img_url: BASE_URL + '/res/images/work_small1.jpg',
                        img_alt: '图片',
                        work_name: '我是作品名称',
                        work_author: '用户名',
                        work_visit: 2348,
                        work_collection: 421
                    },
                    {
                        img_url: BASE_URL + '/res/images/work_small1.jpg',
                        img_alt: '图片',
                        work_name: '我是作品名称',
                        work_author: '用户名',
                        work_visit: 2348,
                        work_collection: 421
                    }
                ]
            });

            // 侧边栏 达人
            html += App.template.aside_startoplist({
                list: [
                    {
                        img_url: BASE_URL + '/res/images/work_small1.jpg',
                        img_alt: '图片',
                        author_name: 'Grinch',
                        works_num: 377,
                        fans_num: 1706
                    },
                    {
                        img_url: BASE_URL + '/res/images/work_small1.jpg',
                        img_alt: '图片',
                        author_name: 'Grinch',
                        works_num: 377,
                        fans_num: 1706
                    },
                    {
                        img_url: BASE_URL + '/res/images/work_small1.jpg',
                        img_alt: '图片',
                        author_name: 'Grinch',
                        works_num: 377,
                        fans_num: 1706
                    },
                    {
                        img_url: BASE_URL + '/res/images/work_small1.jpg',
                        img_alt: '图片',
                        author_name: 'Grinch',
                        works_num: 377,
                        fans_num: 1706
                    },
                    {
                        img_url: BASE_URL + '/res/images/work_small1.jpg',
                        img_alt: '图片',
                        author_name: 'Grinch',
                        works_num: 377,
                        fans_num: 1706
                    }
                ]
            });

            // 编译结果，载入页面侧边栏
            _.$('.g-side').innerHTML = html;
        },

        // 初始化底栏
        initFooter: function () {
            var html = '<div class="m-link">/ 友 情 链 接 /</div><div class="m-aboutus"> / 关 于 我 们 /</div>';

            _.$('.g-footer').innerHTML = html;
        },


        // 初始化 顶栏
        initNav: function () {
            this.nav = new App.Nav({
                container: _.$('.g-header')
            });
            // Nav->Guest 点击"登录"， 初始化登录弹窗
            this.nav.on('toLogin', this.initLoginModal.bind(this));
            // Nav->Guest 点击"注册"，初始化注册弹窗
            this.nav.on('toRegister', this.initRegisterModal.bind(this));
            // Nav 初始化获取用户信息成功后触发 loggedin，初始化登录后明日之星的内容
            // 登录弹窗loggedin监听事件中触发nav的loggedin，刷新明日之星的内容
            this.nav.on('loggedin', function () {
                if (this.starList) {
                    this.starList.getStarlist();
                } else {
                    this.initStarList();
                }
            }.bind(this));
            // Nav 状态初始化获取登录用户信息失败后触发notLoggedin，初始化未登录明日之星内容
            // 或 Nav->User 点击"退出"，触发notLoggedin，则刷新主页明日之星栏目的内容
            this.nav.on('notLoggedin', function () {
                if (this.starList) {
                    this.starList.getStarlist();
                } else {
                    this.initStarList();
                }
            }.bind(this));
        },

        // 初始化 轮播图
        initSlider: function () {
            new App.Slider({
                container: _.$('#banner'),
                imgList: [
                    BASE_URL + '/res/images/bannerLQ/banner0.jpg',
                    BASE_URL + '/res/images/bannerLQ/banner1.jpg',
                    BASE_URL + '/res/images/bannerLQ/banner2.jpg',
                    BASE_URL + '/res/images/bannerLQ/banner3.jpg'
                ],
                interval: 5000
            });
        },

        // 初始化 明日之星
        initStarList: function () {
            this.starList = new App.StarList({
                container: _.$('#starlist')
            });
            // 未登录情况下，StarList 点击"关注"，初始化登录弹窗
            this.starList.on('toLogin', this.initLoginModal.bind(this));
        },

        // 初始化 侧边栏中排行榜的tabs组件
        initRankingTabs: function () {
            new App.Tabs({
                container: _.$('#sidetabs-wrap'),
                nTabData: [
                    {name: '原 创', url: 'javascript:;'},
                    {name: '同 人', url: 'javascript:;'},
                    {name: '临 摹', url: 'javascript:;'}
                ],
                id: 'sidetabs',
                class: 'm-tabs-aside'
            });
        },

        // 初始化 登录弹窗
        initLoginModal: function () {
            this.loginModal = new App.LoginModal();
            this.loginModal.show();

            // 监听去注册 toRegister 事件， 调用注册弹窗
            this.loginModal.on('toRegister', this.initRegisterModal.bind(this));
            // 监听已登录事件
            this.loginModal.on('loggedin', function (user) {
                // 传递给内部的guest和user组件，进一步显示/隐藏
                this.nav.emit('loggedin', user);
                // 刷新明日之星栏目
                // this.starList.getStarlist();
            }.bind(this));

            // 关闭登录弹窗， 销毁登录弹窗对象
            this.loginModal.on('closeModal', function () {
                this.loginModal = null;
            }.bind(this));
        },

        // 初始化 注册弹窗
        initRegisterModal: function () {
            this.registerModal = new App.RegisterModal();
            this.registerModal.show();

            // 监听注册成功 registered 事件, 调用登录弹窗
            this.registerModal.on('registered', this.initLoginModal.bind(this));

            // 关闭注册弹窗， 销毁注册弹窗对象
            this.registerModal.on('closeModal', function () {
                this.registerModal = null;
            }.bind(this));
        },

    };

    App.page = page;
    App.user = {};

    //页面初始化
    document.addEventListener('DOMContentLoaded', function (e) {
        page.init();
    });
})(window.App);