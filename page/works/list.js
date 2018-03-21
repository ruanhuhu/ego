/* 作品列表页面 */
(function (App) {
    var page = {
        init: function () {
            // 预加载loading图片
            var loadingUrl = BASE_URL + '/res/images/loading.gif';
            this.preloadImg(loadingUrl);
            // 顶栏
            this.initNav();
            // 用户简介
            this.initProfile();
            // 作品列表
            this.initWorksList();
            // 侧边栏
            this.initAside();
        },
        preloadImg: function (url) {
            var img = new Image();
            img.src = url;
        },
        // 初始化顶栏
        initNav: function () {
            this.nav = new App.Nav({
                container: _.$('.g-header')
            });
            // 登录后（请求用户信息） 显示用户信息
            this.nav.on('loggedin', function (user) {
                if (!this.profile) {
                    this.initProfile();
                }
                this.profile.renderProfile(user);
            }.bind(this));
        },
        // 初始化用户简介
        initProfile: function () {
            this.profile = new App.Profile({
                container: _.$('#profile')
            });
        },
        // 侧边栏
        initAside: function () {
            App.Aside.init({
                container: _.$('#aside')
            });
        },
        // 作品列表
        initWorksList: function () {
            new App.WorksList({
                container: _.$('#WLContainer')
            })
        }
    };

    App.page = page;
    App.user = {};

    //页面初始化
    document.addEventListener('DOMContentLoaded', function (e) {
        page.init();
    });
})(window.App);