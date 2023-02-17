<template>
	<view class="choose_floor">
		<view class="search_address" @tap.stop="$u.throttle(choose_location, 500)"><u-search v-model="address_info" placeholder="输入地址，查找对应附近的楼栋" :showAction="false" shape="square" disabled></u-search></view>
		<view class="floor_content">
			<view class="floor_content_title font_size28 second_title_color">{{address_info?address_info:'当前地址'}}附近的楼栋</view>
			<view class="floor_item" v-for="(item,index) in building" @tap="choose_floor(item)" :key="item.id">
				<view class="floor_item_top">
					<view class="floor_item_top_left">
						<view class="floor_name u-line-1 font_size28 main_title_color">
							{{item.name}}
						</view>
						<view class="floor_distance font_size26 second_title_color">
							距离您<text class="main_color_blue">{{item.distance}}公里</text>
						</view>
					</view>
					<view class="floor_item_top_right font_size26 main_color_blue">
						选择
					</view>
				</view>
				<view class="floor_item_address u-line-2 font_size26 second_title_color">
					{{item.name}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {buildingList,selfBuildingList} from '@/config/api.js';
export default {
	data() {
		return {
			latitude: null,
			longitude: null,
			address_info:'',
			building:[],
			type:'',
		};
	},
	onLoad(options) {
		this.type = options.type;
		let _this = this;
		uni.authorize({
			scope: 'scope.userLocation',
			success() {
				uni.getLocation({
					type: 'gcj02',
					success: function(res) {
						_this.latitude = res.latitude;
						_this.longitude = res.longitude;
						_this.getBuildingList()
					},
					fail() {
						uni.showModal({
							showCancel: false,
							title: '温馨提示',
							content: '请检查微信是否允许定位'
						});
						uni.navigateBack({});
					}
				});
			},
			fail() {
				uni.showModal({
					showCancel: false,
					title: '温馨提示',
					content: '请允许小程序获取定位',
					success(result) {
						if (result.confirm) {
							uni.openSetting({
								success(e) {
									if (!e.authSetting['scope.userLocation']) {
										uni.showModal({
											showCancel: false,
											title: '温馨提示',
											content: '请开启小程序定位'
										});
										uni.navigateBack({});
									} else {
										uni.getLocation({
											type: 'gcj02',
											success: function(event) {
												console.log(event, 'dsfasfsd');
												_this.latitude = event.latitude;
												_this.longitude = event.longitude;
												_this.getBuildingList()
											},
											fail() {
												uni.showModal({
													showCancel: false,
													title: '温馨提示',
													content: '请检查微信是否允许定位'
												});
												uni.navigateBack({});
											}
										});
									}
								}
							});
						}
					}
				});
			}
		});
	},

	onReady() {},
	methods: {
		async getBuildingList(){
			uni.showLoading({
				mask:true,
				title:'加载中...'
			})
			let params = {
				lng:this.longitude,
				lat:this.latitude
			}
			let buildingData = ''
			if(this.type=="self"){
				buildingData  =  await selfBuildingList(params)
			}else{
				buildingData  =  await buildingList(params)
			}
			uni.hideLoading();
			this.building = buildingData
			
		},
		choose_location(){
			let _this = this
			uni.chooseLocation({
				success(res) {
					if(!!res.longitude&&!!res.latitude){
						_this.latitude = res.latitude;
						_this.longitude = res.longitude;
						_this.address_info = res.name;
						_this.getBuildingList()
					}
				}
			})
		},
		choose_floor(floor_info){
			uni.$emit('getFloor',floor_info)
			uni.navigateBack({
				delta:1
			})
		},
		
	}
};
</script>

<style scoped lang="scss">
.choose_floor {
	overflow: auto;
}
.search_address {
	height: 100rpx;
	border-bottom: 1px solid #eee;
	display: flex;
	align-items: center;
	background: #fff;
	padding: 0 30rpx;
}
.floor_content {
	margin-top: 20rpx;
	background: #fff;
	padding-left: 30rpx;
}
.floor_content_title {
	height: 88rpx;
	line-height: 88rpx;
	padding-left: 36rpx;
}
.floor_item {
	padding: 24rpx  36rpx;
	border-top: 1px solid #eee;
}
.floor_item_top {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.floor_name {
	width: 500rpx;
}
.floor_distance {
	margin-top: 8rpx;
}
.floor_item_address{
	margin-top: 8rpx;
}
.floor_item_top_right {
	width: 108rpx;
	height: 50rpx;
	border-radius: 6rpx;
	border: 1px solid #3366FF;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
