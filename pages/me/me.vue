<template>
	<view class="content">
		<view class="header">
			<view class='user-avatar'>
				<open-data type="userAvatarUrl" />
			</view>
			<view class="username" v-if="userInfo.nickName">Helllo! {{userInfo.nickName}}</view>
			<u-button v-if='unrecorded' @click="getUser" type="primary" :ripple="true" size="medium">绑定信息
			</u-button>
			<view class="addshelf_wrapper">
				<u-button type="warning" shape="circle" :ripple="true" @click="addShelf">添加书架</u-button>
			</view>
		</view>
		<u-loading :show="showLoading" size="50"></u-loading>
		<view v-for="item in myShelfs" :key='item._id'>
			<shelfItem :data='item' canEdit @removeHandler='removeSuccess'></shelfItem>
		</view>
	</view>
</template>

<script>
	import {
		cloudRequest
	} from '../../common/cloudRequest.js'
	import shelfItem from '../../common/components/shelfitem.vue'

	export default {
		components: {
			shelfItem
		},
		data() {
			return {
				userInfo: null,
				userName: null,
				unrecorded: false,
				myShelfs: null,
				showLoading: true
			}
		},
		async onLoad() {
			await this.getUserInfo()
			this.getMyShelfs();
		},
		async onShow() {
			if (this.userInfo) this.getMyShelfs()
		},
		methods: {
			async getUser() {
				let res = await wx.getUserProfile({
					desc: '用于完善书架信息'
				})
				const userDetailInfo = res.userInfo
				console.log('userDetailInfo', userDetailInfo);
				const {
					result: updateRes
				} = await cloudRequest({
					name: 'updateuserinfo',
					data: {
						userDetailInfo
					}
				})
				console.log('updateRes', updateRes);
				this.userInfo = updateRes
				this.unrecorded = false
			},
			async getUserInfo() {
				let loginres = await uni.login({
					provider: 'weixin'
				});
				let code = loginres[1].code
				const {
					result
				} = await cloudRequest({
					name: 'login',
					data: {
						code
					}
				})
				console.log('userINFO', result);
				this.userInfo = result.userInfo
				if (!this.userInfo.nickName) {
					this.unrecorded = true
					this.userInfo.nickName = '微信用户'
				}
			},

			async getMyShelfs() {
				const {
					result: myShelfs
				} = await cloudRequest({
					name: 'bookshelf',
					data: {
						action: 'getmyshelfs'
					}
				})
				console.log('myShelfs', myShelfs);
				this.myShelfs = myShelfs.data
				this.showLoading = false
			},

			addShelf() {
				uni.navigateTo({
					url: '../addbookshelf/addbookshelf'
				})
			},

			removeSuccess() {
				uni.showToast({
					title: '删除成功'
				})
				this.getMyShelfs()
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
		width: 100%;
	}

	.header {
		width: 100%;
		background-color: #F8F8F8;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
		margin-bottom: 30rpx;
	}

	.addshelf_wrapper {
		margin: 30px 0;
		width: 300px;
	}

	.username {
		font-weight: bold;
		margin-top: 10rpx;
		font-size: 50rpx;
	}

	.user-avatar {
		margin: 0 auto;
		margin-top: 40px;
		background-color: white;
		height: 80px;
		width: 80px;
		border-radius: 50%;
		overflow: hidden;
	}
</style>
