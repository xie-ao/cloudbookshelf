let token;


export function cloudRequest(option) {
	return new Promise((resolve, reject) => {
		if (!option.data) option.data = {};
		if (token) option.data.token = token;
		uniCloud.callFunction({
			name: option.name,
			data: option.data,
			success: (res) => {
				if (res.result && res.result.token) token = res.result.token;
				if (option.success) option.success(res);
				resolve(res);
			},
			fail: (err) => {
				if (option.fail) option.fail(err);
				reject();
				return uni.showToast({
					icon: 'none',
					title: '发生了错误'
				})
			},
			complete: () => {
				if (option.complete) option.complete();
			}
		});
	});
}
