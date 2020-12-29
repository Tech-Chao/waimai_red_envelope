'use strict';

const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection('ActivityTable') 
	const res = await collection.limit(20).get()
	//返回数据给客户端
	return res
};
