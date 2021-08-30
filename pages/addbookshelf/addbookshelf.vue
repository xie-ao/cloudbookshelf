<template>
	<view>
		<u-card :title="title">
			<view class="" slot='body'>
				<view class="input-wrapper">
					<input v-model="name" placeholder="给你的书架起个名字(必填)" maxlength="15"></input>
				</view>
				<view class="input-wrapper">
					<input v-model="describtion" placeholder="描述一下你的书架" maxlength="40"></input>
				</view>
				<view class="address-wrapper" @click="btnChooseLocation">
					<view class="address">{{address}}</view>
					<image src="../../static/icons/right.png" mode=""></image>
				</view>
			</view>
		</u-card>
		<view class="btn-wrapper">
			<u-button type="primary" shape="circle" @click="saveShelf">保存</u-button>
		</view>
	</view>
</template>

<script>
	import {
		cloudRequest
	} from '../../common/cloudRequest.js'

	export default {
		data() {
			return {
				title: '书架信息',
				shelfId: null,
				name: "",
				address: "选取书架所在地址(必填)",
				describtion: "",
				longitude: "",
				latitude: ""
			};
		},
		async onLoad(options) {
			if (options.id) {
				this.shelfId = options.id
				const {
					result: getShelf
				} = await cloudRequest({
					name: 'bookshelf',
					data: {
						action: 'query',
						shelfId: options.id
					}
				})
				console.log('getShelf', getShelf);
				this.name = getShelf.name;
				this.address = getShelf.address;
				this.describtion = getShelf.describtion;
				this.longitude = getShelf.geopoint.coordinates[0];
				this.latitude = getShelf.geopoint.coordinates[1];
			}
		},
		methods: {
			btnChooseLocation() {
				uni.getLocation({
					success: (res) => {
						console.log('res', res);
						uni.chooseLocation({
							latitude: res.latitude,
							longitude: res.longitude,
							success: (res) => {
								this.address = res.address + res.name;
								this.longitude = res.longitude;
								this.latitude = res.latitude;
							}
						})
					}
				})
			},

			async saveShelf() {
				if (this.name.length < 3) return uni.showToast({
					icon: "none",
					title: "书架名称至少需要3个字符"
				})
				if (this.latitude == "" || this.longitude == "" || this.address == "") return uni.showToast({
					icon: "none",
					title: "请选择正确的书房所在地址"
				})
				console.log('this.shelfId', this.shelfId);
				let addShelfRes = await cloudRequest({
					name: 'bookshelf',
					data: {
						action: this.shelfId ? 'updateshelf' : 'create',
						shelfId: this.shelfId,
						shelfName: this.name,
						address: this.address,
						longitude: this.longitude,
						latitude: this.latitude,
						describtion: this.describtion
					}
				})
				console.log('addShelfRes', addShelfRes);
				if (addShelfRes.result) {
					uni.showToast({
						title: '成功',
						duration: 1000,
					})
					setTimeout(() => {
						uni.navigateBack({
							animationType: 'pop-out',
							animationDuration: 200
						})
					}, 1000)
				}
			},
		}
	}
</script>

<style lang="scss">
	.input-wrapper {
		font-size: 32rpx;
		height: 70rpx;
		line-height: 60rpx;
		display: flex;
		width: 100%;
		align-items: center;
		border-bottom: 1px solid rgb(221, 221, 221);

		input {
			width: 100%;
		}
	}

	.address-wrapper {
		display: flex;
		align-items: center;
		font-size: 32rpx;
		padding: 15rpx 0;
		border-bottom: 1px solid rgb(221, 221, 221);
		position: relative;

		.address {
			width: 550rpx;
		}

		image {
			position: absolute;
			right: 10rpx;
			width: 30rpx;
			height: 30rpx;
			text-align: right;
		}
	}

	.btn-wrapper {
		position: relative;
		left: 50%;
		transform: translate(-50%);
		width: 600rpx;
	}
</style>
