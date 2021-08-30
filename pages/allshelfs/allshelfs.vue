<template>
	<view>
		<view class="header">
			<view class="total">
				书架总数：{{shelfsNum}}
			</view>
		</view>
		<view v-for="item in allShelfs" :key='item._id'>
			<shelfItem :data='item'></shelfItem>
		</view>
	</view>
</template>

<script>
	import {
		cloudRequest
	} from '../../common/cloudRequest.js'
	import shelfItem from '../../common/components/shelfitem.vue'
	export default {
		data() {
			return {
				allShelfs: null,
				shelfsNum: ''
			};
		},
		components: {
			shelfItem
		},
		onLoad() {
			this.getAllShelfs()
		},
		methods: {
			async getAllShelfs() {
				const {
					result
				} = await cloudRequest({
					name: 'bookshelf',
					data: {
						action: 'getallshelfs'
					}
				})
				this.allShelfs = result.data
				this.shelfsNum = result.data.length
				console.log('getAllShelfs', this.allShelfs);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		width: 100%;
		background-color: #F8F8F8;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
		margin-bottom: 20rpx;
		position: sticky;
		top: 0;
		z-index: 99;
	}
	
	.total{
		font-size: 35rpx;
		font-weight: bold;
		height: 80rpx;
		line-height: 80rpx;
	}
</style>
