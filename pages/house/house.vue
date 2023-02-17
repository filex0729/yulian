<template>
	<view class="house_box">
		<!-- 搜索控件 -->
		<view class="house_box_top">
			<search_house :keyword="keyword"></search_house>
			<filter-house @refresh_floor="refresh_floor" ></filter-house>
		</view>
		<view class="house_box_bottom">
			<scroll-view scroll-y="true" :refresher-enabled="isOpenRefresh" :refresher-triggered="isTriggered"
				scroll-anchoring="true" @refresherpulling="onPulling" @refresherrefresh="onRefresh"
				@refresherrestore="onRestore" @refresherabort="onAbort" lower-threshold="100"
				@scrolltolower="loading_data" class="house_box_scroll">
				<!-- 楼栋列表 -->
				<view class="floor_list" v-for="(item, index) in buildingList" :key="item.id">
					<floor_item :building_info="item"></floor_item>
				</view>

				<!-- 加载状态 -->
				<view class="loading_box" v-if="buildingList.length>0">
					<u-loadmore :status="status" />
				</view>
				<view class="no_building" v-if="buildingList.length==0&&is_first_loaded">
					<u-empty   mode="data" textSize="'24rpx'" text="暂无数据" icon="/static/image/login_error.png"></u-empty>
				</view>
			</scroll-view>
		</view>
		<login_error v-if="vuex_isBind != 1"></login_error>
		<tabar_placeholder></tabar_placeholder>
		<tabbar></tabbar>
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
				page: 1,
				total_num: 0,
				keyword: '',
				district: '', //区域名称 不限的情况下
				business_id: '', //区域id.
				subway_line: '', //地铁名称 不限的情况下
				subway_id: '', //地铁id
				rent_choose:'',
				room_filter: {
					"is_single_room":0,
					"is_one_room": 0,
					"is_two_room": 0,
					"is_three_room": 0,
					"is_four_room": 0,
					"is_five_room": 0
				},
				contract_type:'',
				more_filter:{
					"is_cat":0,
					"is_dog":0,
					"is_gravida":0,
					"is_foreigners":0,
					"is_child":0,
					"is_parking":0
				},
				order_by:'',
				is_first_loaded:false
			};
		},
		watch: {
			/* 使用watch来响应数据的变化 */
			vuex_isBind(newVal, oldVal) {
				if (newVal == 1) {
					this.page = 1;
					this.total_num = 0;
					this.getBuildingData();
				}
			}
		},
		async onLoad(options) {
			this._freshing = false;
			await this.$onLaunched;
			if (this.vuex_isBind == 1) {
				this.getBuildingData();
			}
		},
		onUnload() {
		},
		onShow() {
			uni.hideTabBar({})
			getApp().is_bind_phone();
			if(!!this.vuex_keyword){
				this.keyword = this.vuex_keyword.title;
			}else{
				this.keyword= '';
			}
		},
		onShareAppMessage(res) {
			return {
				title: '寓联好房，与您分享',
				imageUrl: '../../static/image/yulian-logo@2x.png',
				path: ''
			}
		},
		// 分享到朋友圈
		onShareTimeline() {
			return {
				title: '寓联好房，与您分享',
				path: '',
				imageUrl: '../../static/image/yulian-logo@2x.png'
			};
		},
		methods: {
			refresh_floor(info) {
				if (info.type == 'position') {
					if (info.position_tabindex == 0) {
						this.subway_line = '';
						this.subway_id = '';
						if (info.is_reset == 1) {
							this.district = '';
							this.business_id = '';
						} else {
							if (info.limit == 0) {
								this.district = info.select_name;
								this.business_id = ''
							} else {
								this.district = '';
								this.business_id = info.select_id.join(',')
							}
						}
					} else if (info.position_tabindex == 1) {
						this.district = '';
						this.business_id = ''
						if (info.is_reset == 1) {
							this.subway_line = '';
							this.subway_id = '';
						} else {
							if (info.limit == 0) {
								this.subway_line = info.select_name;
								this.subway_id = ''
							} else {
								this.subway_line = '';
								this.subway_id = info.select_id.join(',')
							}
						}
					}
				} else if (info.type == 'room') {
					if (info.select_arr.length > 0) {
						for (let key in this.room_filter) {
							this.room_filter[key] = 0
						}
						info.select_arr.forEach(item=>{
							this.room_filter[item] = 1
						})
					} else {
						for (let key in this.room_filter) {
							this.room_filter[key] = 0
						}
					}
				} else if (info.type == 'price') {
					if (info.select_arr.length > 0) {
						this.rent_choose = JSON.stringify(info.select_arr)
					} else {
						this.rent_choose = ''
					}
				}else if (info.type == 'more') {
					if (info.select_one_arr.length > 0) {
						this.contract_type = info.select_one_arr.join(',')
					} else {
						this.contract_type = ''
					}
					if (info.select_two_arr.length > 0) {
						for (let key in this.more_filter) {
							this.more_filter[key] = 0
						}
						info.select_two_arr.forEach(item=>{
							this.more_filter[item] = 1
						})
					} else {
						for (let key in this.more_filter) {
							this.more_filter[key] = 0
						}
					}
				}else if(info.type=='sort'){
					this.order_by = info.order_by
				}
				this.is_first_loaded  = false;
				this.buildingList = [];
				this.page = 1;
				this.total_num = 0;
				this.getBuildingData();
			},
			loading_data() {
				if (this.buildingList.length >= this.total_num) {
					return;
				}
				this.page++;
				this.getBuildingData()

			},
			async getBuildingData(type) {
				uni.showLoading({
					mask: true,
					title: '加载中'
				});
				let params = {
					page: this.page,
					is_open_building: 1
				};
				params.district = this.district;
				params.business_id = this.business_id;
				params.subway_id = this.subway_id;
				params.subway_line = this.subway_line;
				params.order_by = this.order_by;
				params.rent_choose = this.rent_choose;
				params.contract_type = this.contract_type;
				for (let key in this.more_filter) {
					if(this.more_filter[key]==1){
						params[key] = this.more_filter[key]
					}
				}
				for (let key in this.room_filter) {
					if(this.room_filter[key]==1){
						params[key] = this.room_filter[key]
					}
				}
				let buildingList = await buildingInfoList(params);
				if (type == 'onRefresh') {
					this.isTriggered = false;
					this._freshing = false;
				}
				console.log(buildingList, 'buildingList');
				if (!!buildingList.list) {
					
					if (buildingList.list.length > 0) {
						buildingList.list.forEach(item => {
							if (!!item.building_photo) {
								if (item.building_photo.split(";")[0].indexOf(getApp().globalData
									.static_url) != -1) {
									item.building_photo = item.building_photo.split(";")[0];
								} else {
									item.building_photo = getApp().globalData.static_url + item.building_photo
										.split(";")[0];
								}
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
						this.buildingList = buildingList.list;
					} else {
						this.buildingList = this.buildingList.concat(buildingList.list);
					}
                    this.is_first_loaded = true;
					this.total_num = buildingList.count;
					// this.page = this.buildingList.length ;
					if (this.total_num <= this.buildingList.length) {
						this.status = 'nomore';
					}
				}
			    setTimeout(function(){
					uni.hideLoading();
				},2000)
				
			},
			go_floor_detail() {
				uni.navigateTo({
					url: '/pages/floor_detail/floor_detail'
				});
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
				this.getBuildingData('onRefresh');
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
		background: #fff;
	}

	.house_box_bottom {
		flex: 1;
		overflow: hidden;
		background: #fff;
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
		color: #7b8193;
		font-size: 24rpx;
	}

	.active_item {
		color: #3366ff;
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
	.no_building {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
