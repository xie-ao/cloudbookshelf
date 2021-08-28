<template>
	<view class="content">
		<view class='user-avatar'>
			<open-data type="userAvatarUrl" />
		</view>
		<button type="default" @click="getUser">绑定信息</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		async onLoad() {
			await this.getUserInfo()
		},
		methods: {
			getUser() {
				uni.getUserInfo({
					success(res) {
						console.log('res', res);
					}
				})
			},
			async getUserInfo() {
				let loginres = await uni.login({
					provider: 'weixin'
				});
				let code = loginres[1].code
				console.log('code', code);

				uniCloud.callFunction({
					name: 'login',
					data: {
						code
					},
					success: (res) => {
						console.log('res', res);
					}
				})
			},
		}
	}
</script>

<style scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.user-avatar {
		margin: 0 auto;
		margin-top: 40px;
		background-color: white;
		height: 60px;
		width: 60px;
		border-radius: 50%;
		overflow: hidden;
	}
</style>
