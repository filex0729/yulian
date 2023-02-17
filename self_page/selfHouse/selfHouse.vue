<template>
	<view class="house_box">

		<!-- 搜索控件 -->
		<view class="house_box_top">
			<search_house></search_house>
			<filter-house></filter-house>
		</view>
		<view class="house_box_bottom" v-if="buildingList.length>0">
			<scroll-view scroll-y="true" :refresher-enabled="isOpenRefresh" :refresher-triggered="isTriggered"
				scroll-anchoring="true" @refresherpulling="onPulling" @refresherrefresh="onRefresh" lower-threshold="100"
				@refresherrestore="onRestore" @refresherabort="onAbort" @scrolltolower="loading_data" class="house_box_scroll">
				<!-- 楼栋列表 -->
				<view class="floor_list" v-for="(item,index) in buildingList">
					<floor_item  :building_info="item"></floor_item>
				</view>

				<!-- 加载状态 -->
				<view class="loading_box">
					<u-loadmore :status="status"   />
				</view>
			</scroll-view>
		</view>
		<view class="claim_building" @tap="$u.throttle(claim_building,500)">
			认领<br/>楼栋
		</view>
		<view class="no_building" v-if="buildingList.length==0">
			<u-empty   mode="data" textSize="'24rpx'" text="暂无数据" icon="/static/image/login_error.png"></u-empty>
		</view>
		<login_error v-if="vuex_isBind!=1"></login_error>
	</view>
</template>

<script>
	import {
		buildingInfoList
	} from '@/config/api.js';
	export default {
		data() {
			return {
				status: 'loading',
				isTriggered: false,
				isOpenRefresh: true,
				buildingList: [],
				page:1,
				total_num:0,
			};
		},
		onLoad() {
			this._freshing = false;
			
			if (this.vuex_isBind == 1) {
				this.getBuildingData()
			}

		},
		onShareAppMessage(res) {
			return {
				title: '寓联好房，与您分享',
				imageUrl: '../../static/image/share_img.jpg',
				path: '/pages/manage_house/manage_house?building_id='+this.buildingList[0].id
			};
		},
		// 分享到朋友圈
		onShareTimeline() {
			return {
				title: '寓联好房，与您分享',
				path: '/pages/manage_house/manage_house?building_id='+this.buildingList[0].id,
				imageUrl: '../../static/image/share_img.jpg'
			};
		},
		methods: {
			loading_data(){
				if(this.buildingList.length>=this.total_num){
					return;
				}
				this.page++;
				this.getBuildingData()
				
			},
			claim_building(){
				uni.navigateTo({
					url:'/pages/createFloor/createFloor'
				})
				
			},
			async getBuildingData(type) {
				uni.showLoading({
					mask: true,
					title: '加载中'
				})
				let params = {
					page: this.page
				}
				let buildingList = await buildingInfoList(params);
				if(type =='onRefresh'){
					this.isTriggered = false;
					this._freshing = false;
				}
				if (!!buildingList.list) {
					uni.hideLoading();
					if (buildingList.list.length > 0) {
						buildingList.list.forEach(item => {
							if(!!item.building_photo){
								if(item.building_photo.split(";")[0].indexOf(getApp().globalData.static_url)!=-1){
									item.building_photo =  item.building_photo.split(";")[0];
								}else {
									item.building_photo  = getApp().globalData.static_url + item.building_photo.split(";")[0];
								}
							}
							let subway_text = item.subway_info.map(function(obj, index) {
								return obj.station_name;
							}).join(",");
							item.subway_text = subway_text;
							let pay_type_text = '',
							contract_type_text = '';
							if(!!item.pay_type){
								switch (item.pay_type*1) 
								{ 
								  case 1:pay_type_text="押一付一"; 
								  break; 
								  case 2:pay_type_text="押二付一"; 
								  break; 
								  case 3:pay_type_text="押三付一"; 
								  break; 
								  case 4:pay_type_text="押一付二"; 
								  break; 
								  case 5:pay_type_text="押一付三"; 
								  break; 
								  case 6:pay_type_text="押二付二"; 
								  break; 
								  case 7:pay_type_text="押三付三";
								  break; 
								}
								
							}
							if(!!item.contract_type){
								switch (item.contract_type*1)
								{ 
								  case 1:contract_type_text="一个月起"; 
								  break; 
								  case 2:contract_type_text="三个月起"; 
								  break; 
								  case 3:contract_type_text="半年起租"; 
								  break; 
								  case 4:contract_type_text="一年起租"; 
								  break; 
								}
							}
							item.pay_type_text = pay_type_text;
							item.contract_type_text = contract_type_text
						})
					}
					if(this.page==1){
						this.buildingList = buildingList.list;
					}else {
						this.buildingList = this.buildingList.concat(buildingList.list);
					}
					
					this.total_num = buildingList.count;
					if(this.total_num <=this.buildingList.length){
						this.status = 'nomore'
					}
					if(this.buildingList.length==0){
						uni.hideShareMenu();
					}
				}
			},
			onPulling(e) {
				if (e.detail.deltaY < 0) return; // 防止上滑页面也触发下拉
				this.isTriggered = true;
			},

			// 自定义下拉刷新被触发
			onRefresh() {
				if (this._freshing) return;
				this._freshing = true;
				// 刷新楼栋接口
				this.page = 1;
				this.status = 'loading';
				this.getBuildingData('onRefresh')
			},
			// 自定义下拉刷新被复位
			onRestore() {
				this.isTriggered = 'restore'; // 需要重置
			}
		}
	};
</script>

<style scoped>
	.house_box {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #fff;
	}

	.house_box_top {
		padding: 0 30rpx;
		flex-shrink: 0;
	}

	.house_box_bottom {
		flex: 1;
		overflow: hidden;
	}

	.house_box_scroll {
		height: 100%;
	}

	.filter_box {
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.filter_box_item {
		display: flex;
		align-items: center;
		color: #7B8193;
		font-size: 24rpx;
	}

	.active_item {
		color: #3366FF;
	}

	.floor_list {
		margin-bottom: 46rpx;
	}

	.floor_list:last-of-type {
		margin-bottom: 20rpx;
	}

	.login_error {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.claim_building {
		position: fixed;
		bottom: 150rpx;
		right: 60rpx;
		width: 120rpx;
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		border-radius: 50%;
		background: #3366FF;
		color: #fff;
		font-size: 28rpx;
	}
	.no_building{
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
</style>
