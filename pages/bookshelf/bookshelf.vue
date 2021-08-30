<template>
	<view>
		<view class="header">
			<view class="cell">
				<view class="key">拥有者：</view>
				<view class="value">{{ownerName}}
				</view>
			</view>
			<view class="cell">
				<view class="key">名称：</view>
				<view class="value">{{shelfName}}
				</view>
			</view>
			<view class="cell">
				<view class="key">描述：</view>
				<view class="value">{{describtion}}
				</view>
			</view>
			<view class="cell">
				<view class="key">位置：</view>
				<view class="value">{{address}}
				</view>
			</view>
		</view>
		<view  class="books-wrapper">
			<bookitem :data='item' v-for="item in booksList" :key='item._id'></bookitem>
		</view>

		<view class="btn-wrapper">
			<u-button @click="addBook" type="primary" shape="circle">扫码添加书籍</u-button>
		</view>
	</view>
</template>

<script>
	import {
		cloudRequest
	} from '../../common/cloudRequest.js'
	import bookitem from '../../common/components/bookitem.vue'
	export default {
		components: {
			bookitem
		},
		data() {
			return {
				ownerName: '',
				shelfName: '',
				describtion: '',
				address: '',
				shelfId: '',
				booksList: [],
			};
		},
		onLoad(options) {
			this.shelfId = options.shelfId
			this.getShelf(this.shelfId)
			this.listShelfBooks(this.shelfId)
		},
		methods: {
			async getShelf(shelfId) {
				const {
					result: getShelf
				} = await cloudRequest({
					name: 'bookshelf',
					data: {
						action: 'query',
						shelfId
					}
				})
				console.log('getShelf', getShelf);
				this.shelfName = getShelf.name;
				this.address = getShelf.address;
				this.describtion = getShelf.describtion;
				this.ownerName = getShelf.ownerInfo[0].nickName
			},
			async listShelfBooks(shelfId) {
				let getshelfBooks = await cloudRequest({
					name: 'books',
					data: {
						action: 'listbyshelf',
						shelfId
					}
				})
				this.booksList = getshelfBooks.result.data
			},
			async addBook() {				
				let getISBN = await uni.scanCode()
				console.log('getISBN',getISBN);
				const ISBN = getISBN[1].result
				console.log('ISBN', ISBN);
				uni.showLoading()
				const {
					result
				} = await cloudRequest({
					name: 'books',
					data: {
						ISBN,
						shelfId: this.shelfId,
						action: 'addbook'
					}
				})
				this.listShelfBooks(this.shelfId)
				uni.hideLoading()
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
		margin-bottom: 30rpx;
		position: sticky;
		top: 0;
		z-index: 99;
	}

	.cell {
		width: 90%;
		display: flex;
		position: relative;
		font-size: 32rpx;
		align-items: center;
		border-bottom: 1px solid #999;
		padding: 15rpx;


		.key {
			width: 180rpx;
			color: #f37b1d;
			font-weight: bold;
		}

		.value {
			width: 490rpx;
			text-align: left;
			word-break: normal;
		}
	}
	
	.books-wrapper{
		display: flex;
		flex-wrap: wrap;
		// justify-content: space-around;
	}

	.btn-wrapper {
		width: 90%;
		position: fixed;
		bottom: 5%;
		
	}
</style>
