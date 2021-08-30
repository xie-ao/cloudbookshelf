'use strict';
const doubanbook = require('doubanbook')
exports.main = async (event, context) => {
	const db = uniCloud.database()
	const {
		ISBN
	} = event

	let res = await uniCloud.httpclient.request("https://search.douban.com/book/subject_search?search_text=" +
		ISBN + "&cat=1001")
	console.log('res', res);
	let reg = /window\.__DATA__ = "(.*)"/;
	if (reg.test(res.data)) {
		let bookdata = RegExp.$1;
		let data = doubanbook(bookdata)[0]
		let coverImage = await uniCloud.httpclient.request(data.cover_url);
		let uploadCoverImage = await uniCloud.uploadFile({
			cloudPath: ISBN + ".jpg",
			fileContent: coverImage.data
		})

		let resData = {
			ISBN: ISBN,
			rating: data.rating,
			title: data.title,
			doubanId: data.id,
			doubanurl: data.url,
			cover_url: uploadCoverImage.fileID,
			abstract: data.abstract,
			isbnCreateTime: Date.now()
		}

		let dbResult = await db.collection("isbns").add(resData);
		return resData;
	}
};
