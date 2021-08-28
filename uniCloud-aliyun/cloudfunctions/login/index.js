'use strict';
const {
	APPID,
	APPSECRET
} = require('wx-common')


exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	// 
	const {
		code
	} = event
	const res = await uniCloud.httpclient.request(
		`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${APPSECRET}&js_code=${code}&grant_type=authorization_code`, {
			dataType: 'json'
		}
	)
	//返回数据给客户端
	return res
};
