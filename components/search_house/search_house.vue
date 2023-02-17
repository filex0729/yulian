<template>
	<view class="index_search_house">
		<view class="index_search_house_left main_bg_color border_radius12" :class="!!is_map?'is_map':''" @click="$u.throttle(search_house,500)">
			<img src="/static/image/search@2x.png" alt="" />
			<text v-if="!keyword" class="assist_title_color font_size26">请输入楼栋、商圈、地铁等</text>
			<text v-else class="main_title_color font_size26">{{keyword}}</text>
		</view>
		<view @tap="go_map_house" v-if="!is_map" class="index_search_house_right"><img src="/static/image/map@2x.png" alt="" /></view>
	</view>
</template>

<script>
	export default {
		name:"search_house",
		props:{
			is_map:Boolean,
			keyword:String,
		},
		data() {
			return {
				
			};
		},
		methods:{
			search_house() {
				getApp().is_bind_phone();
				uni.navigateTo({
					url:'/pages/searchHouse/searchHouse'
				})
			},
			go_map_house(){
				getApp().is_bind_phone();
				uni.navigateTo({
					url:'/pages/map_house/map_house'
				})
			}
		}
	}
</script>

<style scoped>
	.index_search_house {
		margin-top: 14rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.index_search_house_left {
		width: 622rpx;
		height: 60rpx;
		line-height: 60rpx;
		flex-shrink: 0;
	}
	.index_search_house_left img {
		width: 30rpx;
		height: 30rpx;
		margin-left: 16rpx;
		margin-right: 22rpx;
		vertical-align: middle;
	}
	.index_search_house_right{
		height: 60rpx;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.index_search_house_right img {
		width: 30rpx;
		height: 30rpx;
	}
	.is_map {
		flex: 1;
	}

</style>