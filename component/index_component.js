// 防止window.App 不存在
if (!window.App || typeof window.App !== 'object') {
    window.App = {};
}


/* 轮播 */
(function (App) {
    // var template ='<div class="m-slider">\
    //     <a><div class="slides"></div></a>\
    // </div>';

    var template = '<div class="m-slider"></div>';

    /**
     * options 参数说明
     * {
     *    container: dom节点, 父容器 (必填)
     *    imgList: array, 图片src数组 (必填)
     *    interval: num, 轮播间隔时间 (选填, 默认5000)
     * }
     **/
    function Slider(options) {

        _.extend(this, options);

        // 内部数据结构
        this.imgLength = this.imgList.length;
        this.interval = this.interval || 5000;

        // 初始化组件
        this.slider = this._layout.cloneNode(true);
        this.slides = this.buildSlides();
        this.cursors = this.buildCursor();

        // 注册事件
        this.slider.addEventListener('mouseenter', this.stop.bind(this));
        this.slider.addEventListener('mouseleave', this.autoPlay.bind(this));

        // 挂载组件
        this.container.appendChild(this.slider);

        this.nav(this.initIndex || 0);
        this.autoPlay();
    }

    _.extend(Slider.prototype, {

        _layout: _.html2node(template),

        // 构建轮播图节点
        buildSlides: function () {
            var slides = document.createElement('ul');
            var html = '';
            for (var i = 0; i < this.imgLength; i++) {
                html +=
                    '<li class="slider_img">\
                        <img src="' + this.imgList[i] + '">\
                    </li>';
            }

            slides.innerHTML = html;
            this.slider.appendChild(slides);

            // return slides.children;
            // 兼容IE EDGE, live HTMLCollection在后续append操作后会改变， 导致无法访问
            // 将slides.children转换成数组类型, ES6实现：Array.from(array-like)
            return Array.prototype.slice.call(slides.children, 0);

        },

        // 构造指示器节点
        buildCursor: function () {
            var cursor = document.createElement('ul'),
                html = '';

            cursor.className = 'm-cursor';

            for (var i = 0; i < this.imgLength; i++) {
                html += '<li data-index="' + i + '"></li>';
            }

            cursor.innerHTML = html;
            this.slider.appendChild(cursor);

            cursor.addEventListener('click', function (event) {
                index = event.target.dataset.index;
                if (typeof index !== 'undefined') {
                    this.nav(parseInt(index));
                }
            }.bind(this));

            // return cursor.children;
            // 兼容IE EDGE, live HTMLCollection在后续append操作后会改变， 导致无法访问
            // 将cursor.children转换成数组类型, ES6实现：Array.from(array-like)
            return Array.prototype.slice.call(cursor.children, 0);
        },

        // 自动播放
        autoPlay: function () {
            this.timer = setInterval(function () {
                this.next();
            }.bind(this), this.interval);
        },

        // 停止播放
        stop: function () {
            clearInterval(this.timer);
        },

        // 下一页
        next: function () {
            var index = (this.index + 1) % this.imgLength; //+1，index下一张
            this.nav(index);
        },

        // 跳到指定页
        nav: function (index) { //给每个指示器li注册click nav事件
            // 若未改变index, 则不做任何操作
            if (this.index === index) return;
            // 保存上一页
            this.last = this.index;
            this.index = index;

            this.fade();
            this.setCurrent();
        },

        // 设置当前选中状态
        setCurrent: function () {
            // 若存在上一页
            if (typeof this.last !== 'undefined') {
                // 除去上一节点的选中状态
                _.delClass(this.slides[this.last], 'z-active');
                _.delClass(this.cursors[this.last], 'z-active');
            }
            // 添加当前选中节点的选中状态
            _.addClass(this.slides[this.index], 'z-active');
            _.addClass(this.cursors[this.index], 'z-active');
        },

        // 切换效果
        fade: function () {
            // 若存在上一页
            if (typeof this.last !== 'undefined') {
                // 上一页隐藏
                this.slides[this.last].style.opacity = 0;
            }
            // 当前页显示
            this.slides[this.index].style.opacity = 1;
        }
    });

    App.Slider = Slider;
})(window.App);

/* 登录 Modal
 * 状态
 * emit：toRegister、loggedin (closeModal 继承自通用 Modal)
 */
(function (App) {
    var html = `<div>
        <div class="modal-tt">
            <strong class="wlcm">欢迎回来</strong>
            <span class="goreg">还没有账号？&nbsp;&nbsp;<a class="u-link" id="goregister">立即注册</a></span>
        </div>
        <!--<form class="m-form m-form-1" autocomplete="off" id="loginform">-->
        <form class="m-form m-form-1" id="loginform">
            <div class="u-formitem">
                <input type="text" id="username" placeholder="手机号" class="formitem-ct u-ipt">
            </div>
            <div class="u-formitem">
                <input type="password" id="password" autocomplete="new-password" placeholder="密&nbsp;码" class="formitem-ct u-ipt">
            </div>
            <div class="u-formitem u-formitem-1 f-cb">
                <label for="remember" class="u-checkbox u-checkbox-remember">
                    <input type="checkbox" id="remember">
                    <i class="u-icon u-icon-checkbox"></i>
                    <i class="u-icon u-icon-checkboxchecked"></i>
                    <span>保持登录</span>
                </label>
                <span class="forget"><a>忘记密码？</a></span>
            </div>
            <div class="u-formitem u-formitem-1 f-dn">
                <span class="u-icon u-icon-error"></span><span id="errormsg"></span>
            </div>
            <button class="u-btn u-btn-primary" type="submit">登&nbsp;&nbsp;录</button>
        </form>
    </div>`;


    /* options 参数说明
    * {
    *	container: dom节点, 父容器（可选），默认document.body
    * }
    */
    function LoginModal(options) {

        _.extend(this, options);

        this.content = _.html2node(html);
        // 将登录弹窗的节点作为通用弹窗的自定义内容
        App.Modal.call(this, {
            content: this.layout
            // 以下在Modal中被设置为默认值
            // MASK: true,
            // HEAD: false,
            // FOOT: false
        });

        //缓存节点
        this.nGoregister = this.content.querySelector("#goregister");
        this.nForm = this.content.querySelector("#loginform");
        this.nUsername = this.nForm.querySelector("#username");
        this.nPassword = this.nForm.querySelector("#password");
        this.nRemember = this.nForm.querySelector("#remember");
        this.nErrormsg = this.nForm.querySelector("#errormsg");
        this.nError = this.nErrormsg.parentNode;

        this.initLoginEvent();
    }

    // 继承父类Modal的原型
    LoginModal.prototype = Object.create(App.Modal.prototype);
    LoginModal.prototype.constructor = LoginModal;

    _.extend(LoginModal.prototype, {
        initLoginEvent: function () {
            // // 订阅显示登录弹窗事件
            // this.on('toLogin', this.show.bind(this));
            // this.on('registered', this.show.bind(this));

            //绑定提交事件
            this.nForm.addEventListener('submit', this.submit.bind(this));
            //绑定跳转注册事件
            this.nGoregister.addEventListener('click', function () {
                // 关闭登录弹窗（进一步销毁登录弹窗对象）
                this.hide();
                // 触发去注册事件
                this.emit('toRegister');
            }.bind(this));
        },

        check: function () {
            var validator = App.validator;
            var isValid = true,
                flag = true;

            //验证用户名
            flag = flag && !validator.isEmpty(this.nUsername.value);
            flag = flag && validator.isPhone(this.nUsername.value);
            this.showError(this.nUsername, !flag);
            isValid = isValid && flag;

            //验证密码
            flag = true;
            flag = flag && !validator.isEmpty(this.nPassword.value);
            this.showError(this.nPassword, !flag);
            isValid = isValid && flag;

            //显示错误
            this.nErrormsg.innerText = "账号或密码不正确，请重新输入";
            this.showError(this.nError, !isValid);
            return isValid;
        },

        submit: function (event) {
            event.preventDefault();
            if (this.check()) {
                var data = {
                    username: this.nUsername.value.trim(),
                    password: hex_md5(this.nPassword.value),
                    remember: !!this.nRemember.checked
                };
                _.ajax({
                    url: _.getApiUrl('/api/login', 'POST'),
                    method: _.fixMethod('POST'),
                    data: data,
                    success: function (data) {
                        if (data.code == 200) {
                            this.hide();
                            window.App.user = data.result
                            this.emit('loggedin', data.result);
                        } else {
                            //根据错误吗显示不同的错误信息
                            switch (data.code) {
                                case 400:
                                    this.nErrormsg.innerText = "密码错误，请重新输入";
                                    this.showError(this.nPassword, true);
                                    break;
                                case 404:
                                    this.nErrormsg.innerText = "用户不存在，请重新输入";
                                    this.showError(this.nUsername, true);
                                    break;
                            }
                            this.showError(this.nError, true);
                        }
                    }.bind(this),
                    fail: function (data) {
                    }
                });
            }
        }
    });

    App.LoginModal = LoginModal;
})(window.App);

/* 选择器单项 Select
 * 状态
 * emit: selectClick、selected
 */
(function (App) {
    var template =
        '<div class="m-select">\
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
                optionsHTML += `<li data-index=${i}>${data[i].name}</li>`;
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


            this.emit('selected', this.getValue());
            this.close();
        }
    });

    App.Select = Select;
})(window.App);

/* 级联选择器 CascadeSelect
 * 状态
 * emit: CSClick
 */
(function (App) {

    /* options 参数说明
   * {
   *	container: dom节点, 父容器（必填）
   *    data: [{name:,value:,list:}]
   * }
   */
    function CascadeSelect(options) {
        // 继承配置
        _.extend(this, options);
        // 缓存各级选择器节点列表
        this.selectList = [];
        // 初始化
        this.init();
    }

    _.extend(CascadeSelect.prototype, App.localEmitter);

    _.extend(CascadeSelect.prototype, {
        init: function () {
            this.initSelect();
            this.selectList[0].render(this.data);
        },
        initSelect: function () {
            for (var i = 0; i < 3; i++) {
                var select = new App.Select({
                    container: this.container
                });
                select.on('selected', this.onChange.bind(this, i));
                select.on('selectClick', this.closeOther.bind(this, i));
                this.selectList[i] = select;
            }
        },
        getValue: function () {
            var valueArr = [];
            for (var i = 0; i < 3; i++) {
                valueArr.push(this.selectList[i].getValue());
            }
            return valueArr;
        },
        getSelIndex: function () {
            var selIndexArr = [];
            for (var i = 0; i < 3; i++) {
                selIndexArr.push(this.selectList[i].selectedIndex);
            }
            return selIndexArr;
        },
        onChange: function (index, value) {
            var next = index + 1;
            if (next === this.selectList.length) return;
            this.selectList[next].render(this.getList(next, value));
        },
        getList: function (n, value) {
            var temp_data = this.data;
            var selIndexArr = this.getSelIndex();
            for (var i = 0; i < n; i++) {
                temp_data = temp_data[selIndexArr[i]].children;
            }
            return temp_data;
        },
        closeOther: function (i) {
            this.selectList.forEach(function (item, index) {
                if (index !== i && !_.hasClass(item.nOption, 'f-dn')) {
                    item.close();
                }
            });
            this.emit('CSClick', this.container.id);
        }
    });

    App.CascadeSelect = CascadeSelect;
})(window.App);

/* 注册 Modal
 * 状态
 * emit: registered (closeModal 继承自通用 Modal)
 */
(function (App) {
    var validator = App.validator;
    var template = `<div>
        <div class="u-regmdlogo"><img src="${BASE_URL}/res/images/logo.png" alt="logo"></div>
        <form class="m-form m-form-2" id="registerform" autocomplete="off">
            <!-- 手机号/username -->
            <div class="u-formitem">
                <label for="phone" class="formitem-tt">手机号</label><input type="text" id="phone" placeholder="请输入11位手机号码" class="formitem-ct u-ipt">
            </div>
            <!-- 昵称／nickname -->
            <div class="u-formitem">
                <label for="nickname" class="formitem-tt">昵称</label><input type="text" id="nick" placeholder="中英文均可，至少8个字符" class="formitem-ct u-ipt">
            </div>
            <!-- 密码/password -->
            <div class="u-formitem">
                <label for="reg-password" class="formitem-tt">密码</label><input type="password" id="pwd" placeholder="长度6-16个字符，不包含空格" class="formitem-ct u-ipt" autocomplete="new-password">
            </div>
            <!-- 确认密码/confirm password -->
            <div class="u-formitem">
                <label for="reg-password-2" class="formitem-tt">确认密码</label><input type="password" id="confirmpwd" placeholder="长度6-16个字符，不包含空格" class="formitem-ct u-ipt" autocomplete="new-password">
            </div>
            <!-- 性别/sex -->
            <div class="u-formitem"  id="sex">
                <label class="formitem-tt">性别</label>
                <label for="male" class="formitem-ct formitem-ct-sex u-radio u-radio-checked"><input type="radio" id="male" name="sex" value="0" checked><i class="u-icon u-icon-radio"></i><i class="u-icon u-icon-radiochecked"></i>少 男</label><label for="female" class="formitem-ct formitem-ct-sex u-radio u-radio-checked"><input type="radio" id="female" name="sex" value="1"><i class="u-icon u-icon-radio"></i><i class="u-icon u-icon-radiochecked"></i>少 女</label>
            </div>
            <!-- 生日／birthday: year month day -->
            <div class="u-formitem">
                <label for="" class="formitem-tt">生日</label>
                <div class="formitem-ct">
                    <div class="m-cascadeselect" id="birthday">
                    </div>
                </div>
            </div>
            <!-- 所在地／location: province city district -->
            <div class="u-formitem">
                <label for="" class="formitem-tt">所在地</label>
                <div class="formitem-ct">
                    <div class="m-cascadeselect" id="location">
                    </div>
                </div>
            </div>
            <!-- 验证码/captcha -->
            <div class="u-formitem">
                <label for="" class="formitem-tt">验证码</label>
                <div class="formitem-ct formitem-ct-validate">
                    <input type="text" id="captcha" class="u-ipt">
                    <img src="` + _.getApiUrl('/captcha') + `" alt="验证码" id="captchaimg">
                </div>
            </div>
            <div class="u-formitem u-formitem-1 u-formitem-2">
                <label for="agreement" class="u-checkbox u-checkbox-remember">
                    <input type="checkbox" id="agreement">
                    <i class="u-icon u-icon-checkbox"></i>
                    <i class="u-icon u-icon-checkboxchecked"></i>
                    <span>我已阅读并同意相关条款</span>
                </label>
            </div>
            <!-- 错误提示 -->
            <div class="u-formitem u-formitem-1 f-dn"><span class="u-icon u-icon-error"></span><span id="errormsg">输入有误</span></div>
            <!-- 提交注册 -->
            <button class="u-btn u-btn-primary" type="submit">注&nbsp;&nbsp;册</button>
        </form>
    </div>`;

    /* options 参数说明
    * {
    *	container: dom节点, 父容器（可选），默认document.body
    * }
    */
    function RegisterModal(options) {
        this.content = _.html2node(template);
        // App.Modal.call(this, {
        //     // content: this.content
        //     //以下在Modal中被设为默认值
        //     // MASK: true,
        //     // HEAD: false,
        //     // FOOT: false
        // });
        App.Modal.call(this, options);

        //缓存节点
        this.nForm = this.content.querySelector("#registerform");
        this.nLocSelect = this.nForm.querySelector('#location');
        this.nBirthSelect = this.nForm.querySelector('#birthday');
        this.nCaptchaImg = this.nForm.querySelector('#captchaimg');
        this.phone = this.nForm.querySelector('#phone');
        this.nick = this.nForm.querySelector('#nick');
        this.pwd = this.nForm.querySelector('#pwd');
        this.confirmpwd = this.nForm.querySelector('#confirmpwd');
        this.captcha = this.nForm.querySelector('#captcha');
        this.agreement = this.nForm.querySelector('#agreement');
        this.nErrormsg = this.nForm.querySelector('#errormsg');
        this.nError = this.nErrormsg.parentNode;

        this.initSelect();
        this.initRegisterEvent();
    }

    // 继承父类Modal的原型
    RegisterModal.prototype = Object.create(App.Modal.prototype);
    RegisterModal.prototype.constructor = RegisterModal;

    _.extend(RegisterModal.prototype, {
        // 初始化注册事件
        initRegisterEvent: function () {
            // // 订阅显示注册弹窗事件
            // this.on('toRegister', this.show.bind(this));

            //绑定提交事件
            this.nForm.addEventListener('submit', this.submit.bind(this));

            this.locationSelect.on('CSClick', this.closeOther.bind(this));
            this.birthdaySelect.on('CSClick', this.closeOther.bind(this));
            this.nCaptchaImg.addEventListener('click', function () {
                this.resetCaptcha();
            }.bind(this));

        },

        // 初始化选择器
        initSelect: function () {
            // 初始化 地址 级联选择器
            this.initLocSelect();
            // 初始化 生日 级联选择器
            this.initBirthSelect();
        },

        // 初始化 地址 级联选择器
        initLocSelect: function () {
            this.addData = this.formatData(ADDRESS_CODES, []);
            this.locationSelect = new App.CascadeSelect({
                container: this.nLocSelect,
                data: this.addData,
            });
        },

        // 初始化 生日 级联选择器
        initBirthSelect: function () {

            function BirthCS(opt) {
                App.CascadeSelect.call(this, opt);
            }

            BirthCS.prototype = Object.create(App.CascadeSelect.prototype);

            BirthCS.prototype.init = function () {
                this.initSelect();
                this.createYM();
                this.days = 0;
                this.selectList[0].render(this.YEAR);
                this.selectList[1].render(this.MONTH);
            }

            BirthCS.prototype.onChange = function (index, value) {
                if (index !== 2 && this.selectList[1].selectedIndex !== undefined) {
                    var valueArr = this.getValue();
                    var date = new Date(valueArr[0], valueArr[1], 0);
                    var days = date.getDate();
                    date = null;
                    if (this.days !== days) {
                        var oldDaySel = this.selectList[2].selectedIndex;
                        this.selectList[2].render(this.getDAYS(days));
                        if (valueArr[2] !== undefined && valueArr[2] <= days) {
                            this.selectList[2].setSelect(oldDaySel);
                        }
                        this.days = days;
                    }
                }
            };

            BirthCS.prototype.createYM = function () {
                var date = new Date;
                var CURRENT_YEAR = date.getFullYear();
                date = null;

                this.YEAR = [];
                this.MONTH = [];
                var tmp, i;

                for (i = CURRENT_YEAR; i >= CURRENT_YEAR - 100 + 1; i--) {
                    tmp = new Object;
                    tmp.name = (i).toString();
                    tmp.value = i;
                    this.YEAR.push(tmp);
                }

                for (i = 1; i < 13; i++) {
                    tmp = new Object;
                    tmp.name = (i).toString();
                    tmp.value = i;
                    this.MONTH.push(tmp);
                }
            };

            BirthCS.prototype.getDAYS = function (days) {
                var tmp = [],
                    DAYS = [];
                for (var i = 1; i <= days; i++) {
                    tmp = new Object;
                    tmp.name = (i).toString();
                    tmp.value = i;
                    DAYS.push(tmp);
                }
                return DAYS;
            };

            this.birthdaySelect = new BirthCS({
                container: this.nBirthSelect
            });
        },

        resetCaptcha: function () {
            this.nCaptchaImg.src = "/captcha?t=" + new Date();
        },

        getRadioValue: function (formid, name) {
            var nForm = document.getElementById(formid);
            return nForm.querySelector("input[name=" + name + "]:checked").value;
        },

        check: function () {
            var isValid = true,
                errorMsg = "";

            var checkList = [
                [this.phone, ['required', 'phone']],
                [this.nick, ['required', 'nickname']],
                [this.pwd, ['required', 'length']],
                [this.confirmpwd, ['required', 'length']],
                [this.captcha, ['required']]
            ]

            isValid = this.checkRules(checkList);
            if (!isValid) {
                errorMsg = '输入有误';
            }

            //验证两次密码
            if (isValid && this.pwd.value !== this.confirmpwd.value) {
                isValid = false;
                errorMsg = '密码输入不一致';
            }

            //验证条款是否为空
            if (!this.agreement.checked) {
                isValid = false;
                errorMsg = '请阅读并同意相关条款';
            }

            //显示错误
            this.nErrormsg.innerText = errorMsg;
            this.showError(this.nError, !isValid);

            return isValid;
        },

        checkRules: function (checkList) {
            var validator = App.validator,
                isValid = true;

            for (var i = 0; i < checkList.length; i++) {
                var checkItem = checkList[i][0],
                    rules = checkList[i][1],
                    flag;

                for (var j = 0; j < rules.length; j++) {
                    var key = rules[j];
                    switch (key) {
                        case 'required':
                            flag = !validator.isEmpty(checkItem.value);
                            break;
                        case 'phone':
                            flag = validator.isPhone(checkItem.value);
                            break;
                        case 'nickname':
                            flag = validator.isNickName(checkItem.value);
                            break;
                        case 'length':
                            flag = validator.isLength(checkItem.value, 6, 16);
                            break;
                    }
                    if (!flag) {
                        break;
                    }
                }
                //显示错误
                this.showError(checkItem, !flag);

                if (!flag && isValid == true) {
                    isValid = false;
                }
            }

            return isValid;
        },
        submit: function (event) {
            event.preventDefault();
            if (this.check()) {
                var data = {
                    username: this.phone.value.trim(),
                    nickname: this.nick.value.trim(),
                    sex: this.getRadioValue('registerform', 'sex'),
                    password: hex_md5(this.pwd.value),
                    captcha: this.captcha.value.trim()
                };

                this.birthday = this.birthdaySelect.getValue().join('-');
                this.location = this.locationSelect.getValue();
                data.province = this.location[0];
                data.city = this.location[1];
                data.district = this.location[2];
                data.birthday = this.birthday;

                _.ajax({
                    url: _.getApiUrl('/api/register', 'POST'),
                    method: _.fixMethod('POST'),
                    data: data,
                    success: function (data) {
                        if (data.code === 200) {
                            this.hide();
                            this.emit('registered');
                        } else {
                            this.nErrormsg.innerText = data.msg;
                            this.showError(this.nError, true);
                        }
                    }.bind(this),
                    fail: function () {
                    }
                });
            }
        },
        //Array to Object{name: , value: }
        formatData: function (arr, data) {
            if (arr == undefined || data == undefined) return;
            for (var i = 0; i < arr.length; i++) {
                data[i] = {
                    name: arr[i][1],
                    value: arr[i][0],
                    children: []
                };
                if (arr[i][2] !== undefined) {
                    this.formatData(arr[i][2], data[i].children);
                }
            }
            return data;

        },

        closeOther: function (id) {
            var otherNode = {};
            if (id == 'birthday') {
                otherNode = this.locationSelect;
            } else {
                otherNode = this.birthdaySelect;
            }
            otherNode.selectList.forEach(function (item) {
                if (!_.hasClass(item.nOption, 'f-dn'))
                    item.close();
            });
        }
    });

    App.RegisterModal = RegisterModal;
})(window.App);

/* 主栏 明日之星
 * 状态
 * emit: toLogin
 */
(function (App) {
    var followConfig = [{
        class: "z-unfollow",
        icon: "u-icon-follow",
        text: "关注"
    },
        {
            class: "z-follow",
            icon: "u-icon-ok",
            text: "已关注"
        }
    ];

    function StarList(options) {
        // 继承配置
        _.extend(this, options);

        this.init();
    }

    _.extend(StarList.prototype, App.localEmitter);

    _.extend(StarList.prototype, {
        init: function () {
            // 初始化 明日之星列表
            this.getStarlist();
            //绑定事件
            this.container.addEventListener('click', this.followHandler.bind(this));

            // 订阅事件
            // this.on('loggedin', this.getStarlist.bind(this)); // 登录时，刷新明日之星列表
            // this.on('notLoggedin', this.getStarlist.bind(this)); // 登出时，刷新明日之星列表
        },
        getStarlist: function () {
            var urlMock = '';
            if(window.App.user.username !== undefined){
                urlMock = '/api/users?getstarlist?loggedin';
            } else {
                urlMock = '/api/users?getstarlist?notLoggedin';
            }
            _.ajax({
                url: _.getApiUrl(urlMock),
                success: function(data) {
                    if (data.code == 200) {
                        this.starsInfo = data.result;
                        this.render(data.result);
                    }
                }.bind(this),
                fail: function() {}
            })
        },
        render: function(data) {
            var html = "";
            data.forEach(function(item) {
                html += this.renderItem(item);
            }.bind(this));
            this.container.innerHTML = html;
        },
        renderItem: function(data) {
            var config = followConfig[Number(!!data.isFollow)];
            var html = `
                <li class="m-card">
                    <img src="${BASE_URL}/res/images/avatar${data.id}.jpg" alt="头像" class="card-avatar">
                    <div class="card-info">
                        <div class="u-name f-thide">${data.nickname}</div>
                        <div>
                            <span class="u-works">作品&nbsp;&nbsp;${data.workCount}</span>
                            <span class="u-fans">粉丝&nbsp;&nbsp;${data.followCount}</span>
                        </div>
                    </div>
                    <button class="u-btn u-btn-sm ${config.class}" data-userid="${data.id}">
                        <span class="u-icon ${config.icon}"></span>${config.text}
                    </button>
                </li>`;
            return html;
        },
        followHandler: function(event) {
            var target = event.target;
            if (event.target.tagName === "BUTTON") {
                var user = window.App.user;
                //未登录情况
                if (user.username === undefined) {
                    this.emit('toLogin');
                    return;
                }
                //已经登录的情况
                var userId = parseInt(target.dataset.userid),
                    dataArr = this.starsInfo,
                    data;

                // data = 点击的用户信息
                for (var i = 0; i < dataArr.length; i++) {
                    if (dataArr[i].id === userId) {
                        data = dataArr[i];
                        break;
                    }
                }

                if (_.hasClass(target, 'z-unfollow')) {
                    this.follow(data, target.parentNode);
                } else {
                    this.unfollow(data, target.parentNode);
                }
            }
        },
        follow: function (followInfo, replaceNode) {
            _.ajax({
                url: _.getApiUrl('/api/users?follow', 'POST'),
                method: _.fixMethod('POST'),
                data: {id: followInfo.id},
                success: function (data) {
                    if (data.code == 200) {
                        followInfo.isFollow = true;
                        followInfo.followCount++;
                        var newNode = _.html2node(this.renderItem(followInfo));
                        replaceNode.parentNode.replaceChild(newNode, replaceNode);
                    }
                }.bind(this),
                fail: function () {
                }
            });
        },
        unfollow: function (followInfo, replaceNode) {
            _.ajax({
                url: _.getApiUrl('/api/users?unfollow', 'POST'),
                method: _.fixMethod('POST'),
                data: {id: followInfo.id},
                success: function (data) {
                    if (data.code == 200) {
                        followInfo.isFollow = false;
                        followInfo.followCount--;
                        var newNode = _.html2node(this.renderItem(followInfo));
                        replaceNode.parentNode.replaceChild(newNode, replaceNode);
                    }
                }.bind(this),
                fail: function () {
                }
            });
        }
    });

    App.StarList = StarList;
})(window.App);