<template>
	<view class="floor_wrapper" @click="go_building_info">
		<view class="floor_content  second_title_color">
			<view class="floor_content_left">
				<u-image v-if="!!building_info.building_photo"  width="214rpx" height="165rpx" mode="aspectFill"
					:src="building_info.building_photo+'!width200'" :lazy-load="true" >
					<template v-slot:loading>
						<u-loading-icon ></u-loading-icon>
					</template>
				</u-image>
				<u-image v-else  width="214rpx" height="165rpx" mode="aspectFill"
					:src="default_img" >
					<template v-slot:loading>
						<u-loading-icon ></u-loading-icon>
					</template>
				</u-image>
			</view>
			<view class="floor_content_right">
				<view class="floor_info box_flex_row_center">
					<view class="name">{{building_info.name}}</view>
					<view class="upload_time font_size24 " v-if="!!building_info.update_time">{{$u.timeFrom(Date.parse(building_info.update_time))}}</view>
					<view class="upload_time font_size24 " v-else>{{$u.timeFrom(Date.parse(building_info.init_time))}}</view>
				</view>
				<view class="floor_place u-flex align-center" v-if="!!building_info.subway_text">
					<u-icon name="map" size="20rpx" color="#7B8194"></u-icon>
					<view class="place_name font_size22">近地铁{{building_info.subway_text}}站</view>
				</view>
				<view class="label_box">
					<!-- 多少套可租 -->
					<view class="label_item" v-if="building_info.room_count>0">{{building_info.room_count}}套可租</view>
					<!-- 是否有电梯 -->
					<view class="label_item">{{building_info.is_lift==1?'有电梯':'没有电梯'}}</view>
					<!-- 押金方式 -->
					<view class="label_item" v-if="!!building_info.pay_type_text">{{building_info.pay_type_text}}</view>
					<!-- 多久起租 -->
					<view class="label_item" v-if="!!building_info.contract_type_text">
						{{building_info.contract_type_text}}</view>
				</view>
				<view class="floor_price_box">
					<view class="price_box" v-if="!!building_info.min_rent">
						<view class="price_num">{{building_info.min_rent}}</view>
						<view class="price_unit">元/月起</view>
					</view>
					<view class="commission_precent" v-if="!!building_info.commission_precent">
						佣金{{building_info.commission_precent*1}}%
					</view>
				</view>
			</view>
		</view>
		<!-- 在租房间展示 -->
		<view class="floor_room_wrapper" v-if="building_info.room_count>0">
			<u-scroll-list :indicator="false">
				<view class="floor_room_content">
					<view class="room_item_wrapper" v-for="(room,index) in building_info.room_info" :key="room.id">
						<room_item :from_type="'floor'" :prefix="building_info.prefix||''" :room_info="room" :building_id="building_info.id"></room_item>
					</view>
				</view>
			</u-scroll-list>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'floor_item',
		props: {
			building_info: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				default_img:getApp().globalData.static_url+'/upload_files/building.jpg'
			};
		},
		created() {},
		methods: {
			go_building_info() {
				uni.navigateTo({
					url: '/pages/floor_detail/floor_detail?building_id=' + this.building_info.id
				})
			}
		}

	};
</script>

<style scoped lang="scss">
	.floor_wrapper {
		padding: 0 30rpx;
		background: #fff;
		margin-bottom: 30rpx;

		.floor_content {
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
						width: 352rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
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

		.floor_room_wrapper {
			margin-top: 32rpx;

			.floor_room_content {
				padding: 10rpx 0;
				padding-left: 172rpx;
				display: flex;

				.room_item_wrapper {
					margin-right: 14rpx;
					width: 180rpx;

				}
			}
		}
	}
</style>
