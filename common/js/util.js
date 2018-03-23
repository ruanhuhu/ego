(function (global) {
    var _ = {};

    /**
     * 描述： 获取单个dom节点的简写
     * 参数： sel | string | CSS选择器字符串
     * 参数： node | Element | 可选 | 基于该元素获取节点（默认document）
     * 返回值：Element | 父元素中第一个匹配CSS选择器的后代元素
     **/
    _.$ = function (sel, node) {
        if (!node) {
            return document.querySelector(sel);
        } else {
            return node.querySelector(sel);
        }
    };

    /**
     * 描述：生成一个可包含文本、类的元素
     * 参数：tag | string | html标签字符串
     * 参数：className | string | 指定元素类的字符串
     * 参数: text | string | 元素的文本内容
     * 返回值：Element
     **/
    _.createElement = function (tag, className, text) {
        var node = document.createElement(tag);
        if (!node) return;
        if (className) {
            this.addClass(node, className);
        }
        if (text) {
            node.innerText = text;
        }
        return node;
    };

    /**
     * 描述：将html模版字符串转化成dom元素
     * 参数：str | string | html模版字符串
     * 返回值：Element
     **/
    _.html2node = function (str) {
        var container = document.createElement('div');
        container.innerHTML = str;
        return container.children[0];
        // return container.children;
    };

    /**
     * 描述：拷贝o2对象的新属性到o1对象上，不覆盖o1对象上原有的属性
     * 参数：o1,o2 object
     * 返回值：
     **/
    _.extend = function (o1, o2) {
        if (o1 === undefined) {
            return;
        }
        for (var i in o2) {
            if (o1[i] === undefined) {
                o1[i] = o2[i]
            }
        }
    };

    /**
     * 描述：判断某元素是否含有某个类
     * 参数：node | element
     * 参数：className | string | 要查询的类字符串
     * 返回值： boolean
     **/
    _.hasClass = function (node, className) {
        if (!node.className) return false;
        return (" " + node.className + " ").indexOf(" " + className + " ") !== -1;
    };

    /**
     * 描述：为元素添加类
     * 参数：
     * 返回值：
     **/
    _.addClass = function (node, className) {
        var current = node.className || "";
        //是否已经包含该类，已有该类，不添加
        if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
            node.className = current ? (current + " " + className) : className;
        }
    }

    /**
     * 描述：  为元素删除类
     * 参数：
     * 返回值：
     **/
    _.delClass = function (node, className) {
        var current = node.className || "";
        node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
    };

    /**
     * 描述： 请求参数序列化，将数据对象转换为字符串
     * 参数：
     * 返回值：
     **/
    _.serialize = function (data) {
        if (!data) {
            return '';
        }
        var pairs = [];
        for (var name in data) {
            // 自身属性
            if (!data.hasOwnProperty(name)) continue;
            // 排除function类属性
            if (typeof data[name] === 'function') continue;

            var value = data[name].toString();
            value = encodeURIComponent(value);
            name = encodeURIComponent(name);
            pairs.push(name + '=' + value);
        }
        return pairs.join('&');
    };

    /**
     * 描述： 将原url解析为获取Mock数据的url地址
     * 参数：
     * 返回值：
     **/
    _.getApiUrl = function (url, method) {
        var mock_url = '';
        method = method || 'GET';
        mock_url = API_URL + '/' + method.toLowerCase() + url.replace(/\?/g, '/params/') + '/data.json?t=' + this.mockTime();
        return mock_url;
    };

    /**
     * 描述：  为获取Mock数据添加时间标签 防止缓存
     * 参数：
     * 返回值：
     **/
    _.mockTime = function () {
        var date = new Date();

        function padding(number) {
            return number > 10 ? '' + number : '0' + number;
        }

        return '' + date.getFullYear() + padding(date.getMonth() + 1) + padding(date.getDate()) +
            padding(date.getHours()) + padding(date.getMinutes()) + padding(date.getSeconds());
    };

    /**
     * 描述：  某些环境下获取模拟数据只能使用get方法
     * 参数：
     * 返回值：
     **/
    _.fixMethod = function (method) {
        // 若在 config.js 中开启 FIX_METHOD，将所有请求方式置换为 GET
        if (typeof FIX_METHOD !== 'undefined' && FIX_METHOD) {
            method = 'GET';
        }
        return method;
    };

    /**
     * 描述：Ajax 数据请求
     * 参数：options = {
     *          url: string     请求地址，如：'/api/logout'
     *          method: string  请求方法
     *          data: object    请求数据(可选)
     *          success: func   请求成功后的回调函数
     *          fail: func      请求失败后的回调函数
     *      }
     * 返回值：
     **/
    _.ajax = function (options) {
        options = options || {};
        //指定提交方式的默认值
        options.method = (options.method == null ? "GET" : options.method.toUpperCase());
        //设置是否异步，默认为true(异步)
        options.async = options.async || true;
        //设置数据的默认值
        options.data = options.data || null;
        if (window.XMLHttpRequest) {
            //非ie
            var xhr = new XMLHttpRequest();
        } else {
            //ie
            var xhr = new ActiveXoptionsect("Microsoft.XMLHTTP");
        }

        // 监听状态变化
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                    if (options.success) {
                        options.success(JSON.parse(xhr.responseText));
                    }
                } else {
                    if (options.fail) {
                        options.fail(xhr.status);
                    }
                }
            }
        };

        // 非GET请求的请求方式时的数据处理
        if (options.method === "POST" || options.method === 'PATCH' || options.method === 'DELETE') {
            var srlzData = JSON.stringify(options.data);
            xhr.open(options.method, options.url, options.async);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.send(srlzData);
        }
        // GET请求的请求参数处理
        if (options.method === "GET") {
            if (options.data) {
                options.url += '?' + this.serialize(options.data);
            }
            xhr.open(options.method, options.url, options.async);
            xhr.send(null);
        }
    };

    /**
     * 描述：兼容ie，获取 dataset 的某属性值, 不区分大小写
     * 参数：
     *      ele: Element
     *      name: 'data-' 之后的字符串, 如'data-index'只需传入'index'
     * 返回值：对应属性的字符串类型值
     **/
    _.getDataset = function (ele, name) {
        // 先转换成小写
        name = name.toLowerCase();

        if (ele.dataset) {
            if (name.split('-').length > 1) {
                // 驼峰化 date-of-birth -> dateOfBirth
                name = name.replace(/-([^-]*)/g, function (match, string) {
                    return string[0].toUpperCase() + string.slice(1);
                });
            }
            return ele.dataset[name];
        } else {
            return ele.getAttribute('data-' + name);
        }
    };

    /**
     * 描述：兼容ie，设置 dataset 的某属性值，不区分大小写
     * 参数：
     *      ele: Element
     *      name: 'data-' 之后的字符串, 如'data-index'只需传入'index'
     *      value: 设置的属性值
     * 返回值：对应属性的字符串类型值
     **/
    _.setDataset = function (ele, name, value) {
        // 先转换成小写
        name = name.toLowerCase();

        if (ele.dataset) {
            if (name.split('-').length > 1) {
                // 驼峰化 date-of-birth -> dateOfBirth
                name = name.replace(/-([^-]*)/g, function (match, string) {
                    return string[0].toUpperCase() + string.slice(1);
                });
            }
            ele.dataset[name] = value;
        } else {
            ele.setAttribute('data-' + name, value);
        }
    };

    global._ = _;

})(window);
