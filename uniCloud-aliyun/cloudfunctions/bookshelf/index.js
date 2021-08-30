'use strict';
const {
	verifyToken
} = require('wx-common')

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database();
	const dbCmd = db.command;
	const {
		token,
		action,
		shelfName,
		describtion,
		address,
		shelfId
	} = event
	const {
		openId
	} = verifyToken(token)
	let dbRes
	if (action == 'create') {
		dbRes = await db.collection("bookshelfs").add({
			owner: openId,
			name: shelfName,
			address: address,
			describtion: describtion,
			geopoint: new db.Geo.Point(event.longitude, event.latitude),
			totalbook: 0
		})
		return dbRes
	} else if (action == 'query') {
		// dbRes = await db.collection('bookshelfs').doc(shelfId).field({
		// 	owner: false
		// }).get()
		// return dbRes.data[0]
		dbRes = await db.collection('bookshelfs').aggregate().lookup({
			from:'users',
			localField:'owner',
			foreignField:'openId',
			as:'ownerInfo'
		})
		.project({
			'ownerInfo.nickName': true,
			address:1,
			name:1,
			_id:1,
			describtion:1,
			geopoint:1,
			totalbook:1,
		}).match({
			_id:dbCmd.eq(shelfId)
		})
		.end()
		return dbRes.data[0]
	} else if (action == 'getmyshelfs') {
		dbRes = await db.collection('bookshelfs').where({
			owner: dbCmd.eq(openId)
		}).orderBy("_id", "desc").field({
			owner: false
		}).get()
		return dbRes
	} else if (action == 'getallshelfs') {
		dbRes = await db.collection('bookshelfs').orderBy("_id", "desc").field({
			owner: false
		}).get()
		return dbRes
	} else if (action == 'updateshelf') {
		dbRes = await db.collection('bookshelfs').doc(shelfId).update({
			name: shelfName,
			address: address,
			describtion: describtion,
			geopoint: new db.Geo.Point(event.longitude, event.latitude),
		})
		return dbRes
	} else if (action == 'deleteshelf') {
		dbRes = await db.collection("bookshelfs").doc(shelfId).remove();
		return dbRes
	}
};
