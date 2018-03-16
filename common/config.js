// 基础url地址
var BASE_URL = '/ego';
// var BASE_URL = '';
// 页面路由
var PAGES_URL = BASE_URL + '/html';
// api 地址
// var api_url = 'http://59.111.99.234';
var API_URL = BASE_URL + '/mock.data/interface';
// 如果为真 所有ajax的请求方式均设为GET方法
var FIX_METHOD = true;

// 开启模拟数据模式
var MOCK = true;

// 上传图片中使用POST方法返回404时，模拟数据
var MOCK_POST_WORKS_UPLOAD = {
    "code": 200,
    "msg": "kiGxsSmzZ8",
    "result": {
        "id": 94479,
        "name": "JlFYcmMmq7",
        "url": "http://via.placeholder.com/100x140",
        "position": 62750,
        "worksId": 95034,
        "creatorId": 95472,
        "createTime": 1505657070072,
        "updateTime": 1505656726598
    }
};
