<template>
	<view>
		<!-- 首页内容 -->
		<!-- <loading_page ref="loading"></loading_page> -->
		<view class="index_wrapper">
			<view class="index_wrapper_top bg_colorfff">
				<!-- 搜索房源控件 -->
				<search_house></search_house>
			</view>
			<view class="banner_wrapper">
				<u-swiper :list="banner_list" @change="e => (current = e.current)" :autoplay="true" circular :height="'320rpx'">
					<view slot="indicator" class="indicator">
						<view class="indicator__dot" v-for="(item, index) in banner_list" :key="index" :class="[index === current && 'indicator__dot--active']"></view>
					</view>
				</u-swiper>
			</view>
			<view class="index_wrapper_bottom">
				<u-grid :border="false" col="4">
					<u-grid-item v-for="(listItem, listIndex) in list" @tap="switchpage(listItem)" :key="listIndex" customStyle="padding-top: 20rpx; padding-bottom: 20rpx">
						<image class="grid_icon" :src="listItem.imgsrc" mode=""></image>
						<text class="grid-text main_title_color font_size26 font_weight_bold">{{ listItem.title }}</text>
					</u-grid-item>
				</u-grid>
			</view>
			<view class="hot_house" v-if="hot_list.length > 0">
				<view class="hot_house_title">好房推荐</view>
				<view class="house_wrapper">
					<view class="house_wrapper_item" v-for="(item, index) in hot_list" :key="item.id">
						<floor_item :building_info="item"></floor_item>
					</view>
				</view>
				<!-- 加载状态 -->
				<view class="loading_box">
					<u-loadmore :status="status" />
				</view>
				<tabar_placeholder></tabar_placeholder>
			</view>
		</view>
		<tabbar></tabbar>
	</view>
</template>

<script>
import { recommendList } from '@/config/api.js';
export default {
	data() {
		return {
			status: 'loading',
			page: 1,
			total_num: 0,
			hot_list: [],
			banner_list: [require('../../static/image/banner_img.png'), require('../../static/image/banner_img.png')],
			current: 0,
			list: [
			{
						imgsrc: '../../static/image/index/sipan3@2x.png',
					title: '我的房源',
					path: '/self_page/selfHouse/selfHouse',
					type: 'my_house'
				},
				{
					imgsrc: '../../static/image/index/gongpan@2x.png',
					title: '公共房源',
					path: '/pages/house/house',
					type: 'public_house'
				},
				{
					imgsrc: '../../static/image/index/customer2@2x.png',
					title: '我的客户',
					path: '/customer/selfCustomer/selfCustomer',
					type: 'my_customer'
				},
				{
					imgsrc: '../../static/image/index/write@2x.png',
					title: '录入房源',
					path: '/pages/createRoom/createRoom',
					type: 'createRoom'
				}
			]
		};
	},
	async onLoad() {
		// this.$refs.loading.show()
		await this.$onLaunched;
		this.getHotList();
	},
    onReachBottom() {
		if (this.hot_list.length >= this.total_num) {
			return;
		}
		this.page++;
		this.getHotList()
    },
	onPullDownRefresh() {
		this.page = 1;
		this.total_num = 0;
		this.getHotList('refresh')
	},
	onShareAppMessage(res) {
		return {
			title: '寓联好房，与您分享',
			imageUrl: '../../static/image/yulian-logo@2x.png',
			path: ''
		};
	},
	// 分享到朋友圈
	onShareTimeline() {
		return {
			title: '寓联好房，与您分享',
			path: '',
			imageUrl: '../../static/image/yulian-logo@2x.png'
		};
	},
	onShow() {
		uni.hideTabBar({})
	},
	methods: {
		async getHotList(type) {
			uni.showLoading({
				mask: true,
				title: '加载中'
			});
			let params = {
				page: this.page
			};
			let buildingList = await recommendList(params);
			console.log(buildingList,'buildingList')
			if(type=='refresh'){
				uni.stopPullDownRefresh();
			}
			if (!!buildingList) {
				
				if (buildingList.list.length > 0) {
					buildingList.list.forEach(item => {
						if (!!item.building_photo) {
							if (item.building_photo.split(';')[0].indexOf(getApp().globalData.static_url) != -1) {
								item.building_photo = item.building_photo.split(';')[0];
							} else {
								item.building_photo = getApp().globalData.static_url + item.building_photo.split(';')[0];
							}
						}else{
							item.building_photo = ''
						}

						let subway_text = item.subway_info
							.map(function(obj, index) {
								return obj.station_name;
							})
							.join(',');
						item.subway_text = subway_text;
						let pay_type_text = '',
							contract_type_text = '';
						if (!!item.pay_type) {
							switch (item.pay_type * 1) {
								case 1:
									pay_type_text = '押一付一';
									break;
								case 2:
									pay_type_text = '押二付一';
									break;
								case 3:
									pay_type_text = '押三付一';
									break;
								case 4:
									pay_type_text = '押一付二';
									break;
								case 5:
									pay_type_text = '押一付三';
									break;
								case 6:
									pay_type_text = '押二付二';
									break;
								case 7:
									pay_type_text = '押三付三';
									break;
							}
						}
						if (!!item.contract_type) {
							switch (item.contract_type * 1) {
								case 1:
									contract_type_text = '一个月起';
									break;
								case 2:
									contract_type_text = '三个月起';
									break;
								case 3:
									contract_type_text = '半年起租';
									break;
								case 4:
									contract_type_text = '一年起租';
									break;
							}
						}
						item.pay_type_text = pay_type_text;
						item.contract_type_text = contract_type_text;
					});
				}
				if (this.page == 1) {
					this.hot_list = buildingList.list;
				} else {
					this.hot_list = this.hot_list.concat(buildingList.list);
				}

				this.total_num = buildingList.count;
				if (this.total_num <= this.hot_list.length) {
					this.status = 'nomore';
				}
			}
			setTimeout(function(){
				uni.hideLoading();
			},1000)
		},
		switchpage(item) {
			if (this.vuex_isBind != 1) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
				return
			}
			if (item.type == 'deal' || item.type == 'public_house') {
				uni.switchTab({
					url: item.path
				});
			} else {
				if(item.type == 'my_customer' ){
					uni.showToast({
						icon:'none',
						title:'功能待开发中'
					})
					return;
				}
				uni.navigateTo({
					url: item.path
				});
			}
		},
		navigateBack() {
			uni.navigateBack({
				delta: 1
			});
		},
		rightClick() {
			console.log('rightClick');
		},
		leftClick() {
			console.log('leftClick');
		}
	}
};
</script>
<style lang="scss" scoped>
.indicator {
	@include flex(row);
	justify-content: center;

	&__dot {
		width: 25rpx;
		height: 15rpx;
		background: #ffffff;
		border-radius: 6rpx;
		opacity: 0.66;
		margin-right: 15rpx;

		&--active {
			opacity: 1;
		}
	}
}

.u-nav-slot {
	@include flex;
	align-items: center;
	justify-content: space-between;
	border: 1rpx solid rgba(0, 0, 0, 0.1);
	border-radius: 200rpx;
	padding: 10rpx 30rpx;
	background: rgba(255, 255, 255, 0.6);
}

.index_wrapper {
	min-height: 100vh;
	background: #ffffff;
}

.index_wrapper_top {
	position: sticky;
	top: 0;
	z-index: 10;
	padding: 0 30rpx;
	padding-bottom: 30rpx;
	overflow: auto;
	border-radius: 0 0 24rpx 24rpx;
}

.index_number_wrapper {
	margin-top: 28rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 170rpx;
	padding: 30rpx 0;
	box-sizing: border-box;
}

.index_number_item {
	width: 33.33%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
}

.day_work {
	margin-top: 8rpx;
}

.day_work_top {
	height: 184rpx;
	padding: 40rpx 0;
	box-sizing: border-box;
	border-bottom: 1rpx solid #eee;
}

.day_work_top_item {
	width: 20%;
}

.grid_icon {
	width: 80rpx;
	height: 80rpx;
	margin-bottom: 24rpx;
}

.banner_wrapper {
	margin: 30rpx 25rpx;
	margin-top: 0;
	height: 320rpx;
	border-radius: 12rpx;
	overflow: hidden;
}

.banner_wrapper swiper {
	height: 100%;
}

.swiper-item {
	height: 100%;
	background: pink;
}

.hot_house {
	margin-top: 26rpx;
}

.hot_house_title {
	margin-bottom: 30rpx;
	margin-left: 28rpx;
	font-size: 36rpx;
	font-family: Source Han Sans CN-Bold, Source Han Sans CN;
	font-weight: bold;
	color: #353535;
}
</style>
