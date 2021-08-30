'use strict';
const {
	APPID,
	APPSECRET,
	getToken
} = require('wx-common')


exports.main = async (event, context) => {
	const db = uniCloud.database()
	const {
		code
	} = event
	const res = await uniCloud.httpclient.request(
		`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${APPSECRET}&js_code=${code}&grant_type=authorization_code`, {
			dataType: 'json'
		}
	)
	const openId = res.data.openid
	let userInfo
	const dbRes = await db.collection("users").where({
		openId
	}).get()
	if (dbRes.affectedDocs <= 0) {
		userInfo = {
			nickName: "",
			avatarUrl: "",
			gender: 0,
			country: "",
			province: "",
			city: ""
		}
		await db.collection('users').add({
			openId,
			...userInfo
		})
	} else {
		userInfo = dbRes.data[0]
		delete userInfo['openId']
	}
	const token = getToken(openId)
	// userInfo['token'] = token
	//返回数据给客户端
	return {
		userInfo,
		token
	}
};
