// 检索App：不存在 或 不为对象
if (!window.App || typeof window.App !== 'object') {
    window.App = {};
}


/**
 * 描述： (单个对象)事件管理 监听者、订阅发布模式
 * 参数：
 * 返回值：
 **/
window.App.localEmitter = (function () {
    return {
        /**
         * 描述：  注册事件
         * 参数：   event | string | 要注册的事件名称
         * 参数：  fn | function | 要注册的事件回调函数
         * 返回值： object | 要注册事件的对象
         **/
        on: function (event, fn) {
            var handles = this._handles || (this._handles = {}),    // 事件管理对象
                calls = handles[event] || (handles[event] = []);    // 对应事件的回调函数数组

            // 在对应的事件回调函数数组中注入新回调函数
            calls.push(fn);

            return this;
        },

        /**
         * 描述：  解绑事件
         * 参数：  event | string | 要解绑的事件名称
         * 参数：  fn | function | 要解绑的事件回调函数
         * 返回值： object | 要解绑事件的对象
         **/
        off: function (event, fn) {
            // if (!event || !this._handles) this._handles = {};
            // 如果事件管理对象不存在 返回
            if (!this._handles) return;

            var handles = this._handles,
                calls;

            // 对应事件有无回调函数
            if (calls = handles[event]) {
                // 若没有指定回调函数，则清除所有回调
                if (!fn) {
                    handles[event] = [];
                    return this;
                }
                // 找到对应listener 并移除
                for (var i = 0, len = calls.length; i < len; i++) {
                    if (fn === calls[i]) {
                        calls.splice(i, 1);
                        return this;
                    }
                }
            }
            return this;
        },

        /**
         * 描述：  触发事件
         * 参数：   event | string | 要触发的事件名称
         * 返回值： object | 要触发事件的对象
         **/
        emit: function (event) {
            var args = [].slice.call(arguments, 1), // 触发事件时要传递的参数
                handles = this._handles,
                calls;

            if (!handles || !(calls = handles[event])) return this;
            // 触发所有对应名字的listeners
            for (var i = 0, len = calls.length; i < len; i++) {
                calls[i].apply(this, args)
            }
            return this;
        }
    };
})();

/**
 * 描述： (全局)事件管理 监听者、订阅发布模式
 * 参数：
 * 返回值：
 **/
window.App.emitter = (function () {
    // 全局事件管理对象
    var _handles = {};

    return {
        /**
         * 描述：  注册事件
         * 参数：   event | string | 要注册的事件名称
         * 参数：  fn | function | 要注册的事件回调函数
         **/
        on: function (event, fn) {
            // 对应事件的回调函数数组
            var calls = _handles[event] || (_handles[event] = []);
            // 在对应的事件回调函数数组中注入新回调函数
            calls.push(fn);
        },

        /**
         * 描述：  解绑事件
         * 参数：  event | string | 要解绑的事件名称
         * 参数：  fn | function | 要解绑的事件回调函数
         **/
        off: function (event, fn) {
            var calls = _handles[event];
            // 对应事件有无回调函数
            if (calls) {
                // 若没有指定回调函数，则清除所有回调
                if (!fn) {
                    _handles[event] = [];
                    return;
                }
                // 找到对应listener 并移除
                for (var i = 0, len = calls.length; i < len; i++) {
                    if (fn === calls[i]) {
                        calls.splice(i, 1);
                    }
                }
            }
        },

        /**
         * 描述：  触发事件
         * 参数：   event | string | 要触发的事件名称
         * 返回值： object | 要触发事件的对象
         **/
        emit: function (event) {
            var args = [].slice.call(arguments, 1), // 触发事件时要传递的参数
                calls;

            if (!(calls = _handles[event])) return;

            // 触发所有对应名字的listeners
            for (var i = 0, len = calls.length; i < len; i++) {
                calls[i].apply(this, args)
            }
        }
    };
})();