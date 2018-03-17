// 检索App：不存在 或 不为对象
if (!window.App || typeof window.App !== 'object') {
    window.App = {};
}

// 图片预加载
(function (App) {

    /**
     * imgs: 单张图片url字符串、多张图片url字符串数组
     * options 参数说明
     * {
     *    order: string 'unordered'(默认值) || 'ordered'
     *    each: 每张图片加载完毕后执行的函数
     *    all: 所有图片加载完毕后执行的函数
     *    error: 每张图片加载错误执行的函数
     * }
     **/
    function PreLoad(imgs, options) {
        // 将单张图片url字符串转换为图片url数组
        this.imgs = typeof imgs === 'string' ? [imgs] : imgs;
        this.opts = options || {};
        // 若用户没有定义,使用默认值覆盖
        _.extend(this.opts, PreLoad.DEFAULTS);

        if (this.opts.order === 'ordered') {
            this._ordered();
        } else {
            this._unordered();
        }
    }

    PreLoad.DEFAULTS = {
        order: 'unordered', //无序预加载
        each: null, //每张图片加载完毕后执行
        all: null, //所有图片加载完毕后执行
        error: function (url) {
            console.log('图片加载出错: ' + url);
        }
    };

    // 无序加载
    PreLoad.prototype._unordered = function () {
        var imgs = this.imgs,
            opts = this.opts,
            count = 0,
            length = imgs.length;

        imgs.forEach(function (url) {
            if (typeof url !== 'string') return;

            var imgObj = new Image();

            callback = function (event) {
                if (event.type === 'error') {
                    opts.error && opts.error(url);
                } else {
                    opts.each && opts.each(count, url);
                }

                if (count >= length - 1) {
                    opts.all && opts.all();
                }
                count++;
            };

            imgObj.onload = callback;
            imgObj.onerror = callback;

            imgObj.src = url;
        })
    };

    // 有序加载
    PreLoad.prototype._ordered = function () {
        var imgs = this.imgs,
            length = imgs.length,
            count = 0,
            opts = this.opts;

        function load() {
            var imgObj = new Image();

            var callback = function (event) {
                opts.each && opts.each(count, imgs[count]);

                if (count >= length - 1) {
                    opts.all && opts.all();
                } else {
                    count++;
                    load();
                }

                if (event.type === 'error') {
                    opts.error && opts.error(imgs[count]);
                }
            };

            imgObj.onload = callback;
            imgObj.onerror = callback;

            imgObj.src = imgs[count];
        }

        load();

    };

    App.PreLoad = PreLoad;

})(window.App);


(function (App) {
    // 雪碧图（主页logo）
    var SPRITES = BASE_URL + '/res/images/sprites.png';

    // 主页 轮播图
    var INDEX_BANNER_IMGS = [
        BASE_URL + '/res/images/bannerLQ/banner0.jpg',
        BASE_URL + '/res/images/bannerLQ/banner1.jpg',
        BASE_URL + '/res/images/bannerLQ/banner2.jpg',
        BASE_URL + '/res/images/bannerLQ/banner3.jpg'
    ];

    // 主页 精选推荐
    var INDEX_RECOMMEND_LIST_IMGS = [
        BASE_URL + '/res/images/work1.jpg',
        BASE_URL + '/res/images/work2.jpg',
        BASE_URL + '/res/images/work3.jpg',
        BASE_URL + '/res/images/work4.jpg'
    ];

    // 注册弹窗logo图
    var REGISTER_MODAL_IMG = BASE_URL + '/res/images/logo.png';

    var preloadImgs = [].concat(SPRITES, INDEX_BANNER_IMGS, INDEX_RECOMMEND_LIST_IMGS,REGISTER_MODAL_IMG);

    new App.PreLoad(preloadImgs);

})(window.App);