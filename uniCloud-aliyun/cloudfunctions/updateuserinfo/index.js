'use strict';
const {
	verifyToken
} = require('wx-common')
exports.main = async (event, context) => {
	console.log('updateuserinfo', event);
	const {
		userDetailInfo,
		token
	} = event
	const db = uniCloud.database()

	const {
		openId
	} = verifyToken(token)
	console.log('openId', openId);

	await db.collection('users').where({
		openId
	}).update({
		...userDetailInfo
	})

	//返回数据给客户端
	return userDetailInfo
};
