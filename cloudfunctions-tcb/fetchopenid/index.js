'use strict';
exports.main = async (event, context) => {

	let js_code =  event.code  
	const appid =  getApp().globalData.appid //appid  
	const secret = getApp().globalData.secret //secret  
	const loginUrl = 'https://api.weixin.qq.com/sns/jscode2session'   
	
	let res = await uniCloud.httpclient.request(loginUrl, {  
	  data: {  
	    appid: appid,  
	    secret: secret,  
	    js_code: js_code,  
	    grant_type: 'authorization_code'  
	  },  
	  dataType: 'json'  
	  })  
	//返回数据给客户端
	return res
};
