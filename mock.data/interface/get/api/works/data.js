/*
 *	模拟分页逻辑
 *	json: 本地响应数据，data.json里的数据
 *	req : 请求数据
 */
module.exports = function (json, req) {
	let result = json.result;
	let query = req.query;

	if(query.total === '1'){
		result.total = result.data.length;
	} else {
		delete result.total
	}

	result.data = result.data.splice(query.offset, query.limit || 15);

	return json;
}