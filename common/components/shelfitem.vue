<template>
	<view class='card'
		style="width: 94%;background-color: #fff;border-radius: 8px;border: 1px solid #ccc;overflow: hidden;">
		<view
			style="height:30px;line-height: 30px;font-size: 18px;padding:0px 10px;display: flex;justify-content: space-between;align-items: center;">
			<view @click="btnEnter" style="flex:1;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
				{{data.name}}<text style="color:#999;font-size: 12px;margin-left: 5px;">({{data.totalbook}}本藏书)</text>
			</view>
			<image v-if="canEdit" @click="btnMore" src="../../static/icons/more-dot.png"
				style="width: 30rpx;height: 30rpx;"></image>
		</view>
		<view @click="btnEnter">
			<image mode="aspectFill"
				:src="'https://api.map.baidu.com/staticimage/v2?ak=6eFt9p4rmjFqjZaHQCjFpvgDnqpZGnB1&&zoom=18&coordtype=gcj02ll&center='+data.geopoint.coordinates[0]+','+data.geopoint.coordinates[1]"
				style="width:100%;height:80px;vertical-align: middle;"></image>
		</view>
		<view
			style="height:30px;line-height: 30px;font-size: 14px;color:#666;padding:0px 10px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
			{{data.address}}
		</view>
	</view>
</template>

<script>
	import {
		cloudRequest
	} from '../cloudRequest.js'
	export default {
		props: {
			data: {
				type: Object
			},
			canEdit: {
				type: Boolean
			}
		},
		methods: {
			btnEnter() {
				uni.navigateTo({
					url: "../../pages/bookshelf/bookshelf?shelfId=" + this.data._id
				})
			},
			btnMore() {
				uni.showActionSheet({
					itemList: ["修改", "删除"],
					success: (res) => {
						if (res.tapIndex == 0) {
							uni.navigateTo({
								url: "../../pages/addbookshelf/addbookshelf?id=" + this.data._id
							})
						} else if (res.tapIndex == 1) {
							uni.showModal({
								content: "确定要删除此书房吗？",
								success: (res) => {
									if (res.confirm) {
										cloudRequest({
											name: "bookshelf",
											data: {
												action: "deleteshelf",
												shelfId: this.data._id
											},
											success: (res) => {
												console.log('resss', res);
												if (!res.result.deleted) return uni
													.showToast({
														icon: 'none',
														title: '删除失败'
													})
												this.$emit("removeHandler")
											}
										})
									}
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	.card {
		margin-bottom: 15rpx;
		position: relative;
		left: 50%;
		transform: translate(-50%);
		box-shadow: 5px 5px 5px rgba(0,0,0,0.1);
	}
</style>
