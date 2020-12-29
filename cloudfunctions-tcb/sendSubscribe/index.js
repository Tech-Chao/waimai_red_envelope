'use strict';
const db = uniCloud.database(); //代码块为cdb
const MAX_LIMIT = 100
// 订阅消息下放功能
exports.main = async (event, context) => {
	const countResult = await db.collection('SubscribeMessageTable').count()
	const total = countResult.total
	// 计算需分几次取
	const batchTimes = Math.ceil(total / 100)
	// 承载所有读操作的 promise 的数组
	const tasks = []
	for (let i = 0; i < batchTimes; i++) {
		const promise = await db.collection('SubscribeMessageTable').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()

		console.log("promise是：", promise.data)
		tasks.push(...promise.data)
	}

	for (var i = 0, len = tasks.length; i < len; i++) {
		const task = tasks[i]
		const res = await uniCloud.httpclient.request("https://api.weixin.qq.com/cgi-bin/token", {
			method: 'GET',
			dataType: 'json',
			data: {
				'grant_type': 'client_credential',
				'appid': getApp().globalData.appid //appid  
				'secret': getApp().globalData.secret, //小程序的secret
			}
		})
		let token = res.data.access_token
		//返回数据给客户端
		const subscribeUrl = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=' + token;

		console.log("openi是：", task.openid)
		console.log(task.template_id)
		const subscribe = await uniCloud.httpclient.request(subscribeUrl, {
			method: 'POST',
			contentType: "json",
			dataType: "json",
			data: {
				"touser": task.openid, //需要下发的用户openid
				"template_id": task.template_id, //订阅消息id
				"page": "pages/index/index", //点击订阅消息后进入的页面，可以带参数
				// "miniprogram_state": "formal", // 进入小程序的版本
				"data": {
					"thing1": {
						"value": "又到了吃饭时刻，快来吃喝炒鸡优惠券啦！"
					},
					"thing2": {
						"value": '红包天天领，叫外卖省省省'
					}
				}
			}
		})
		if (subscribe.data.errcode == 0) {
			await db.collection('SubscribeMessageTable').doc(task._id).remove();
		}
	}
};
