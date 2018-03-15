// 检索App：不存在 或 不为对象
if (!window.App || typeof window.App !== 'object') {
    window.App = {};
}

/**
 * 描述：  验证数据
 * 参数：
 * 返回值：
**/
window.App.validator = (function () {
    return {
        // 是否为空
        isEmpty: function (value) {
            return /^\s*$/.test(value);
        },
        //11位数字电话号码
        isPhone: function (value) {
            return /^\d{11}$/.test(value);
        },
        // 昵称 中英文数字，至少8个字符
        isNickName: function (value) {
            return /[\u4e00-\u9fa5_a-zA-Z0-9]{8,}/.test(value);
        },
        // 长度验证 [min, max]
        isLength: function (value, min, max) {
            var length = value.toString().length;
            if(!max){
                return length <= min;
            }
            if(min > max){
                var p = min;
                min = max;
                max = p;
            }
            return length >= min && length <= max;
        }
    };
})();