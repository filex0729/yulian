<template>
	<view class="map_house_box">
		<!-- 搜索控件 -->
		<view class="house_box_top">
			<u-search placeholder="输入定位地址查询附近公寓/楼栋" v-model="address_name" :disabled="true" :showAction="false" @click="open_wx_map"></u-search>
		</view>
		<view class="map_container">
			<map name="seekMap" @regionchange="regionchange" @callouttap="callouttap" id="seek_map" :markers="markers"
				:longitude="longitude" :latitude="latitude" :show-location="false" :scale="scale">
				<cover-image class="center_flag" src="../../static/image/location_flag.png"></cover-image>
				<cover-view class="location_box" @click="get_location">
					<cover-image class="icon_diwei" src="../../static/image/icon_diwei.png"></cover-image>
					<cover-view class="location_title">定位</cover-view>
				</cover-view>
				<cover-view slot="callout" v-if="customCalloutMarkerIds.length>0&&type==1">
					<block v-for="(item, index) in customCalloutMarkerIds" :key="index">
						<cover-view class="customCallout" :marker-id="item">
							<cover-view class="content">{{ markers[index].name }}</cover-view>
						</cover-view>
					</block>
				</cover-view>
				<cover-view slot="callout" v-if="customCalloutMarkerIds.length>0&&type==2&&!!markers[0].floor_num">
					<block v-for="(item, index) in customCalloutMarkerIds" :key="index">
						<cover-view class="customCallout" :marker-id="item">
							<cover-view class="content">{{ markers[index].name }}</cover-view>
							<cover-view class="content_title" v-if="!!markers[index].floor_num">
								{{markers[index].floor_num}}栋</cover-view>
						</cover-view>
					</block>
				</cover-view>
				<cover-view slot="callout"
					v-if="customCalloutMarkerIds.length>0&&type==3&&markers[0].room_num!=undefined">
					<block v-for="(item, index) in customCalloutMarkerIds" :key="index">
						<cover-view class="customCallout_three"
							:class="click_marker_id==markers[index].id?'selected_callout':''" :marker-id="item">
							<cover-view class="content_three">{{ markers[index].name }}</cover-view>
							<cover-view class="content_three_title" v-if="!!markers[index].room_num">
								|&nbsp;&nbsp;{{markers[index].room_num}}套</cover-view>
						</cover-view>
					</block>
				</cover-view>
			</map>
			<view class="room_box" v-if="select_floor_room.length>0&&!!click_marker_id">
				<swiper class="room_box_swiper" :indicator-active-color="'#3366ff'" :duration="1000">
					<block v-for="(item,index) in select_floor_room" :key="index">
						<swiper-item>
							<view class="floor_content  second_title_color" @click="room_detail(item.id)">
								<view class="floor_content_left">
									<u-image width="214rpx" height="165rpx" mode="aspectFill"
										:src="select_floor_info.building_photo"></u-image>
								</view>
								<view class="floor_content_right">
									<view class="floor_info box_flex_row_center">
										<view class="name">{{select_floor_info.name}}{{item.door_num}}室</view>
										<view class="upload_time font_size24 ">4天前</view>
									</view>
									<view class="floor_place u-flex align-center"
										v-if="!!select_floor_info.subway_text">
										<u-icon name="map" size="20rpx" color="#7B8194"></u-icon>
										<view class="place_name font_size22">近地铁{{select_floor_info.subway_text}}站
										</view>
									</view>
									<view class="label_box">
										<!-- 是否有电梯 -->
										<view class="label_item">{{select_floor_info.is_lift==1?'有电梯':'没有电梯'}}</view>
										<!-- 押金方式 -->
										<view class="label_item" v-if="!!select_floor_info.pay_type_text">
											{{select_floor_info.pay_type_text}}</view>
										<!-- 多久起租 -->
										<view class="label_item" v-if="!!select_floor_info.contract_type_text">
											{{select_floor_info.contract_type_text}}</view>
									</view>
									<view class="floor_price_box">
										<view class="price_box" v-if="!!item.rent">
											<view class="price_num">{{item.rent*1}}</view>
											<view class="price_unit">元/月起</view>
										</view>
										<view class="commission_precent" v-if="!!select_floor_info.commission_precent">
											佣金{{select_floor_info.commission_precent*1}}%
										</view>
									</view>
								</view>
							</view>
						</swiper-item>

					</block>

				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		searchRoomByMap,
		roomList
	} from '@/config/api.js';
	export default {
		data() {
			return {
				scale: 16,
				longitude: '',
				latitude: '',
				mpCtx: null,
				markers: [],
				click_marker_id: '',
				customCalloutMarkerIds: [],
				type: 3, //请求数据类型 1行政区 2 片区 3 楼栋
				flag: true,
				select_floor_info: '',
				select_floor_room: [],
				address_name:''
			};
		},
		onLoad() {
			if (!!this.vuex_current_location.lat) {
				this.longitude = this.vuex_current_location.lng;
				this.latitude = this.vuex_current_location.lat;
			}
		},
		onReady() {
			let _this = this;
			this.mpCtx = wx.createMapContext('seek_map');
			this.mpCtx.getRegion({
				success(e) {
					_this.get_map_data(e);
				}
			});
		},
		onUnload() {
			this.mpCtx = null;
		},
		methods: {
			open_wx_map(){
				let _this = this;
				uni.chooseLocation({
					success: function (res) {
						console.log('位置名称：' ,res);
						if(!!res.latitude&&!!res.longitude){
							_this.address_name = res.name;
							_this.longitude =res.longitude;
							_this.latitude = res.latitude;
							_this.click_marker_id = '';
							_this.select_floor_info = '';
							_this.type = 2;
							_this.select_floor_room = []
							// 获取地图，map要与wxml页面的id名一致。注意：不需要#符号
							
							// 将地图中心移置当前定位点，此时需设置地图组件 show-location 为true。'2.8.0' 起支持将地图中心移动到指定位置。
							_this.mpCtx.moveToLocation();
						}
					}
				});
			},
			room_detail(id) {
				uni.navigateTo({
					url: '../../pages/room_detail/room_detail?room_id=' + id + '&building_id=' + this
						.click_marker_id
				});
			},
			callouttap(e) {
				let marker_id = e.markerId;
				if (this.type == 1) {
					this.scale = this.scale==14?14.00001:14;
					this.latitude = this.markers[marker_id - 1].latitude;
					this.longitude = this.markers[marker_id - 1].longitude;
				} else if (this.type == 2) {
					this.scale = this.scale==16?16.00001:16;
					this.latitude = this.markers[marker_id - 1].latitude;
					this.longitude = this.markers[marker_id - 1].longitude;
				} else {
					if (this.markers.length > 0) {
						let marker_info = this.markers.find(item => {
							return item.id == e.markerId
						})
						this.latitude = marker_info.latitude;
						this.longitude = marker_info.longitude;
						this.click_marker_id = e.markerId;
						// if (marker_info.room_num > 0) {
						// 	//请求对应楼栋可租的房间数据
						// 	this.getFloorData()
						// } else {
						// 	this.select_floor_info = '';
						// 	this.select_floor_room = [];
						// }
						// 先留着上面代码
						uni.navigateTo({
							url:'/pages/floor_detail/floor_detail?building_id='+e.markerId
						})
						
					}


				}
			},
			async getFloorData() {
				uni.showLoading({
					mask: true,
					title: '请求数据中'
				})
				let params = {
					building_id: this.click_marker_id
				}
				let floor_data = await roomList(params);
				let building_info = floor_data.building_info;
				if (!!building_info.building_photo) {
					building_info.building_photo = building_info.building_photo.split(';')[0];
				}
				let pay_type_text = '',
					contract_type_text = '';
				if (!!building_info.pay_type) {
					switch (building_info.pay_type * 1) {
						case 1:
							pay_type_text = "押一付一";
							break;
						case 2:
							pay_type_text = "押二付一";
							break;
				  case 3:
							pay_type_text = "押三付一";
							break;
				  case 4:
							pay_type_text = "押一付二";
							break;
				  case 5:
							pay_type_text = "押一付三";
							break;
				  case 6:
							pay_type_text = "押二付二";
							break;
				 	case 7:
							pay_type_text = "押三付三";
							break;
					}

				}
				if (!!building_info.contract_type) {
					switch (building_info.contract_type * 1) {
						case 1:
							contract_type_text = "一个月起";
							break;
						case 2:
							contract_type_text = "三个月起";
							break;
						case 3:
							contract_type_text = "半年起租";
							break;
						case 4:
							contract_type_text = "一年起租";
							break;
					}
				}
				building_info.pay_type_text = pay_type_text;
				building_info.contract_type_text = contract_type_text
				this.select_floor_info = building_info;
				let select_floor_room = []
				floor_data.room_info.sort((a, b) => {
					return a.floor - b.floor
				})
				if (floor_data.room_info.length > 0) {
					floor_data.room_info.forEach(floor => {
						if (floor.room.length > 0) {
							floor.room.forEach(item => {
								if (item.status == 1) { //在租状态
									select_floor_room.push(item)
								}
							})
						}

					})
				}
				this.select_floor_room = select_floor_room;
				uni.hideLoading();
			},
			//获取当前定位
			get_location() {
				if (!!this.vuex_current_location.lat) {
					this.longitude = this.vuex_current_location.lng;
					this.latitude = this.vuex_current_location.lat;
				}
				this.click_marker_id = '';
				this.select_floor_info = '';
				this.select_floor_room = []
				// 获取地图，map要与wxml页面的id名一致。注意：不需要#符号

				// 将地图中心移置当前定位点，此时需设置地图组件 show-location 为true。'2.8.0' 起支持将地图中心移动到指定位置。
				this.mpCtx.moveToLocation();
			},
			regionchange(e) {
				uni.$u.throttle(this.toNext(e), 1000)
			},
			toNext(e){
				let _this = this;
				if (e.type == 'end') {
					let scale = e.target.scale;
					if (this.type == 3) {
				
					} else {
						this.click_marker_id = ''
						this.select_floor_info = '';
						this.select_floor_room = []
					}
					let region = e.target.region;
					this.get_map_data(region,scale);
				}
			},
			async get_map_data(region,scale) {
				if (scale < 13.5) {
					if (this.type == 1) {
						return;
					}
					this.type = 1;
				} else if (scale < 15.5) {
					this.type = 2;
				} else {
					this.type = 3;
				}
				let max_lat = region.northeast.latitude,
					max_lng = region.northeast.longitude,
					min_lat = region.southwest.latitude,
					min_lng = region.southwest.longitude;
				let params = {
					zoom: this.type,
					max_lat: max_lat,
					max_lng: max_lng,
					min_lat: min_lat,
					min_lng: min_lng
				};

				let mapData = await searchRoomByMap(params);
				let markers = [],
					customCalloutMarkerIds = [];
				mapData.forEach((item, index) => {
					if (this.type == 1) {
						let point = {
							id: index + 1,
							latitude: item.lat,
							longitude: item.lng,
							name: item.name,
							with: 10,
							height: 10,
							customCallout: {
								anchorY: 40,
								anchorX: 0,
								display: 'ALWAYS'
							}
						};
						markers.push(point);
						customCalloutMarkerIds.push(index + 1);
					} else if (this.type == 2) {
						let point = {
							id: index + 1,
							latitude: item.lat,
							longitude: item.lng,
							name: item.name,
							floor_num: item.count,
							with: 10,
							height: 10,
							customCallout: {
								anchorY: 40,
								anchorX: 0,
								display: 'ALWAYS'
							}
						};
						markers.push(point);
						customCalloutMarkerIds.push(index + 1);
					} else {
						let point = {
							id: item.building_id * 1,
							latitude: item.lat,
							longitude: item.lng,
							name: item.name,
							room_num: item.count,
							with: 10,
							height: 10,
							customCallout: {
								anchorY: 22,
								anchorX: 0,
								display: 'ALWAYS'
							}
						};
						markers.push(point);
						customCalloutMarkerIds.push(item.building_id * 1);
					}

				});
				this.markers = markers;
				this.customCalloutMarkerIds = customCalloutMarkerIds;
			}
		}
	};
</script>

<style scoped lang="scss">
	.map_house_box {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.house_box_top {
		padding: 0 30rpx;
		flex-shrink: 0;
		background: #fff;
		height: 100rpx;
	}

	.map_container {
		height: calc(100vh - 100rpx);
		position: relative;
	}

	#seek_map {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.center_flag {
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -22rpx;
		margin-top: -22rpx;
		width: 44rpx;
		height: 44rpx;
	}

	.location_box {
		position: absolute;
		right: 40rpx;
		bottom: 400rpx;
		background: #fff;
		width: 90rpx;
		height: 100rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.icon_diwei {
		width: 42rpx;
		height: 42rpx;
	}

	.location_title {
		font-size: 24rpx;
		margin-top: 10rpx;
	}

	.customCallout {
		position: relative;
		z-index: 100;
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		background: #3366ff;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.content {
		font-size: 24rpx;
		color: #fff;
	}

	.content_title {
		color: #fff;
		font-size: 24rpx;
		margin-top: 10rpx;
	}

	.customCallout_three {
		position: relative;
		z-index: 100;
		height: 60rpx;
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 30rpx;
		background: #3366ff;
	}

	.content_three {
		color: #fff;
		font-size: 24rpx;
	}

	.content_three_title {
		margin-left: 20rpx;
		font-size: 24rpx;
		color: #fff;
	}

	.selected_callout {
		background: #FF551D;
	}

	.room_box {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100vw;
		height: 300rpx;
		background: #fff;
		z-index: 3;

	}

	.room_box_swiper {
		height: 300rpx;
	}

	/* //房间展示 */
	.floor_content {
		padding: 40rpx 30rpx;
		display: flex;
		justify-content: space-between;

		.floor_content_left {
			margin-right: 20rpx;
			border-radius: 12rpx;
			overflow: hidden;

		}

		.floor_content_right {
			flex: 1;
			width: 0;
			flex-shrink: 0;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.floor_info {
				.name {
					width: 372rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					font-size: 28rpx;
					font-weight: bold;
					color: #2a2e34;
				}
			}

			.label_box {
				display: flex;
				align-items: center;
				overflow: hidden;

				.label_item {
					white-space: nowrap;
					font-size: 22rpx;
					margin-right: 20rpx;
				}
			}

			.floor_price_box {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.price_box {
					display: flex;
					align-items: baseline;

					.price_num {
						font-size: 36rpx;
						font-weight: bold;
						color: #ff551d;
					}

					.price_unit {
						font-size: 24rpx;
					}
				}

				.commission_precent {
					width: 100rpx;
					height: 40rpx;
					background: rgba(255, 240, 235, 0.39);
					border: 1px solid #FE8962;
					border-radius: 6rpx;
					font-size: 20rpx;
					color: #FE8962;
					display: flex;
					align-items: center;
					justify-content: center;
				}

			}
		}
	}
</style>
