<template>
	<view class="book-item">
		<image :src="data.cover_url" class="image"></image>
		<view class="title">{{data.title}}</view>
	</view>

</template>

<script>
	export default {
		props: {
			data: {
				type: Object
			}
		},
		mounted() {

		}
	}
</script>

<style scoped>
	.book-item {
		width: 220rpx;
		height: 300rpx;
		/* border: 1px solid #f37b1d; */
		border-radius: 10px;
		box-shadow: 4px 4px 4px rgba(0,0,0,0.3);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		margin-bottom: 20rpx;
		margin-left: 22.5rpx;
	}
	
	.image{
		width: 180rpx;
		height: 250rpx;
	}
	
	.title{
		font-size: 30rpx;
		text-align: center;
		width:100%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
