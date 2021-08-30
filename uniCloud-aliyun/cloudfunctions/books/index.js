'use strict';
const {
	verifyToken
} = require('wx-common')
exports.main = async (event, context) => {
	const {
		token,
		ISBN,
		shelfId,
		action
	} = event
	const {
		openId
	} = verifyToken(token)
	const db = uniCloud.database()
	const dbCmd = db.command
	if (action == 'addbook') {
		let bookInfo
		// 查询isbns里面有没有这本书：
		// 没有： 去豆瓣爬完加进去后把这本书信息连同shelfId存到books表里
		// 有： 把信息拿到连同shelfId存到books表里
		let dbRes = await db.collection('isbns').where({
			ISBN: dbCmd.eq(ISBN)
		}).field({
			_id: 0
		}).get()
		if (dbRes.affectedDocs == 0) {
			console.log('数据库新增ISBN');
			let callFuncRes = await uniCloud.callFunction({
				name: 'isbnquery',
				data: {
					ISBN
				}
			})
			bookInfo = callFuncRes.result
		} else {
			console.log('查询到了已有书籍');
			bookInfo = dbRes.data[0]
		}
		let add = await db.collection('books').add({
			shelfId,
			...bookInfo
		})
		let inc = await db.collection("bookshelfs").where({
			owner: openId,
			_id: shelfId,
		}).update({
			totalbook: dbCmd.inc(1)
		})
		return add
	} else if (action == 'listbyshelf') {
		let dbRes = await db.collection('books').where({
			shelfId: dbCmd.eq(shelfId)
		}).get()
		return dbRes
	}
};
