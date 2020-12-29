'use strict';
/* 用户点击订阅时，后台记录用户openid 及 推送模板 */
const db = uniCloud.database(); //代码块为cdb
exports.main = async (event, context) => {
	const collection = db.collection('SubscribeMessageTable')
	const sendDate = new db.serverDate({
		offset: 86400000
	})
	// 单条插入数据
	let res = await collection.add({
		"openid": event.openid,
		"template_id": event.template_id,
		"sendDate":sendDate,
		"sended": false,
	})
	return res
}
