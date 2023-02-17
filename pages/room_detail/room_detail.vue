<template>
	<u-loading-page v-if="is_loading" :loading="is_loading" loading-text="加载中"></u-loading-page>
	<view class="room_detail" v-else>
		<!-- 轮播图 -->
		<view class="resource_box">
			<swiper :indicator-dots="false" :autoplay="false" style="height: 100%;" :duration="1000" @change="e => (currentNum = e.detail.current)">
				<swiper-item v-for="(item, index) in resource_list" :key="item.url" @click="resource_click(index)">
					<image style="width: 100%;height: 100%;" show-menu-by-longpress v-if="item.type == 'image'" :src="item.url+'!width400'" mode="aspectFill"></image>
					<video style="width: 100%;height: 100%;" :enable-progress-gesture="false" v-else :src="item.url"></video>
				</swiper-item>
			</swiper>
			<view class="resource_indicator" v-if="resource_list[currentNum].type == 'image'">
				<view class="resource_indicator_left">{{ resource_list[currentNum].title }}</view>
				<view class="resource_indicator_right">{{ currentNum + 1 }}/{{ resource_list.length }}</view>
			</view>
		</view>
		<!-- 房间信息 -->
		<view class="room_info">
			<view class="room_info_top">
				<view class="room_price_box">
					<view class="price main_color_orange font_size42 font_weight_bold box_flex_row_center">
						{{ room_info.rent * 1 }}
						<text class="font_weight_middle font_size28">元/月({{ building_info.pay_type_text }})</text>
					</view>
					<view class="commission">佣金{{room_info.commission_type==1?room_info.commission_precent * 1+'%':room_info.commission_precent*1+'元'}}</view>
					<view class="download_video" @tap="download_video" v-if="!!room_info.function_video">保存视频</view>
				</view>
				<view class="room_name font_size42">
					{{ building_info.district }}{{ building_info.name }}{{ !!room_info.another_name ? room_info.another_name : (building_info.prefix || '') + room_info.door_num }}
				</view>
			</view>
			<view class="room_info_bottom">
				<view class="room_info_bottom_item">
					<view class="content font_size28 main_title_color">{{ room_info.apartment }}</view>
					<view class="title font_size24 second_title_color">户型</view>
				</view>
				<view class="room_info_bottom_item">
					<view class="content font_size28 main_title_color">{{ room_info.fittings || '精装' }}</view>
					<view class="title font_size24 second_title_color">装修</view>
				</view>
				<view class="room_info_bottom_item">
					<view class="content font_size28 main_title_color">{{ room_info.direction }}</view>
					<view class="title font_size24 second_title_color">朝向</view>
				</view>
			</view>
		</view>
		<!-- 位置信息 -->
		<view class="location_info">
			<view class="location_info_item">
				<view class="title font_size26 second_title_color">位置:</view>
				<view class="content" @tap.stop="$u.throttle(open_room_map, 500)">
					<image src=".././../static/image/floor/map.png"></image>
					<text class="font_size26 font_weight_bold main_title_color">{{ building_info.district }}{{ !!building_info.address ? building_info.address : '' }}</text>
					<image src="../../static/image/floor/next_right_icon.png" class="icon_image"></image>
				</view>
			</view>
			<view class="location_info_item">
				<view class="title font_size26 second_title_color">楼栋:</view>
				<view class="content">
					<text class="font_size26 font_weight_bold main_title_color" style="margin-left: 0;">{{ building_info.name }}</text>
					<image src="../../static/image/floor/next_right_icon.png" class="icon_image"></image>
				</view>
			</view>
		</view>
		<!-- 来源信息 -->
		<view class="from_info ">
			<view class="head_title font_size32 font_weight_bold">来源信息</view>
			<view class="from_info_content">
				<view class="from_info_item">
					<view class="title second_title_color font_size26">房源类型:</view>
					<view class="content font_size26 font_weight_bold main_title_color">整租</view>
				</view>

				<view class="from_info_item">
					<view class="title second_title_color font_size26">房屋楼层:</view>
					<view class="content font_size26 font_weight_bold main_title_color">{{ room_info.ground_floor }}/{{ building_info.floor_num }}楼</view>
				</view>
				<view class="from_info_item">
					<view class="title second_title_color font_size26">付款方式:</view>
					<view class="content font_size26 font_weight_bold main_title_color">{{ building_info.pay_type_text }}</view>
				</view>
				<view class="from_info_item">
					<view class="title second_title_color font_size26">最短租期:</view>
					<view class="content font_size26 font_weight_bold main_title_color">{{ building_info.contract_type_text }}</view>
				</view>
				<view class="from_info_item" style="width: 100%;">
					<view class="title second_title_color font_size26">房东要求:</view>
					<view class="content font_size26 font_weight_bold main_title_color">{{ building_info.other_info }}</view>
				</view>
				<view class="from_info_item" style="width: 100%;">
					<view class="title second_title_color font_size26">其他要求:</view>
					<view class="content font_size26 font_weight_bold main_title_color">{{ room_info.other_need }}</view>
				</view>
			</view>
		</view>
		<!-- 房屋配置 -->
		<view class="from_info " v-if="room_thing.length > 0">
			<view class="head_title font_size32 font_weight_bold">房屋配置</view>
			<view class="thing_box">
				<view class="thing_item thing_item_active" v-for="(thing, index) in room_thing" :key="index">{{ thing }}</view>
			</view>
		</view>
		<!-- 房东信息 -->
		<view class="from_info " v-if="!!room_info.phone">
			<view class="head_title font_size32 font_weight_bold">房东信息</view>
			<view class="from_info_content">
				<view class="from_info_item">
					<view class="title second_title_color font_size26">姓名:</view>
					<view class="content font_size26 font_weight_bold main_title_color">{{ room_info.name }}</view>
				</view>
				<view class="from_info_item">
					<view class="title second_title_color font_size26">与业主的关系:</view>
					<view class="content font_size26 font_weight_bold main_title_color">{{ room_info.relation }}</view>
				</view>
				<view class="from_info_item">
					<view class="title second_title_color font_size26">手机:</view>
					<view class="content font_size26 font_weight_bold main_title_color">{{ room_info.phone }}</view>
				</view>
				<view class="from_info_item" style="width: 100%;">
					<view class="title second_title_color font_size26">钥匙位置:</view>
					<view class="content font_size26 font_weight_bold main_title_color">{{ room_info.key_pos }}</view>
				</view>
			</view>
		</view>
		<!-- 底部操作 -->
		<view class="footer_box">
			<view class="footer_box_left">
				<view class="change_status" @click="open_status">
					<image src="../../static/image/floor/edit256.png" mode="aspectFill"></image>
					<view class="title font_size24 second_title_color">改状态</view>
				</view>
				<view class="more_box" @tap="more_show = is_building_employee == 1 ? true : false">
					<image src="../../static/image/floor/more256.png" mode="aspectFill"></image>
					<view class="title font_size24 second_title_color">更多</view>
				</view>
			</view>

			<view class="footer_box_right">
				<view class="footer_btn write" style="visibility: hidden">写跟进</view>
				<view class="footer_btn contact" @tap="phone_show = true">电话联系</view>
			</view>
		</view>
		<!-- 房间状态 -->
		<u-picker
			:show="show_room_status"
			:immediateChange="true"
			closeOnClickOverlay
			:defaultIndex="defaultIndex"
			:columns="room_status_columns"
			keyName="label"
			@cancel="show_room_status = false"
			@confirm="select_room_status"
			@close="show_room_status = false"
		></u-picker>
		<u-action-sheet
			:actions="phone_list"
			@select="selectPhoneClick"
			:show="phone_show"
			@close="phone_show = false"
			:closeOnClickOverlay="true"
			:closeOnClickAction="true"
		></u-action-sheet>
		<!--更多操作 -->
		<u-action-sheet
			:actions="more_list"
			@select="selectClick"
			:show="more_show"
			@close="more_show = false"
			:closeOnClickOverlay="true"
			:closeOnClickAction="true"
		></u-action-sheet>
	</view>
</template>

<script>
import { getRoomInfo, saveRoom, deleteRoom } from '@/config/api.js';
export default {
	data() {
		return {
			phone_show: false,
			is_area: 0,
			is_building_employee: 0, //0 不是自己负责的楼栋 1自己的楼栋
			show_room_status: false,
			room_status_columns: [
				[
					{
						label: '待出租',
						type: 1
					},
					{
						label: '已出租',
						type: 2
					},
					{
						label: '维修中',
						type: 3
					}
				]
			],
			is_loading: true,
			room_id: '',
			building_id: '',
			more_show: false,
			more_list: [
				{
					name: '删除房源'
				},
				{
					name: '编辑房源'
				},
				{
					name: '复制房源'
				}
			],
			phone_list: [
				{
					name: '联系伙伴'
				},
				{
					name: '联系房东'
				}
			],
			room_thing: [],
			currentNum: 0,
			resource_list: [],
			source_list: [],
			building_info: {},
			room_info: {},
			account_info: {}
		};
	},
	onLoad(options) {
		this.room_id = options.room_id;
		this.building_id = options.building_id;
	},
	async onShow() {
		await this.$onLaunched;
		getApp().is_bind_phone();
		//请求房间详情
		this.getRoomDetail();
	},
	onShareAppMessage(res) {
		let imageUrl = '';
		if (!!this.room_info.beedroom_img) {
			imageUrl = this.room_info.beedroom_img.split(';')[0];
		} else {
			imageUrl = '/upload_files/building.jpg';
		}
		if (imageUrl.indexOf(getApp().globalData.static_url) == -1) {
			imageUrl = getApp().globalData.static_url + imageUrl;
		}
		let title = '',
			room_name = !!this.room_info.another_name ? this.room_info.another_name : (this.building_info.prefix || '') + this.room_info.door_num;
		title = this.building_info.name + room_name + '房  ' + this.room_info.rent * 1 + '/月';
		return {
			title: title,
			imageUrl: imageUrl,
			path: 'pages/room_detail/room_detail?building_id=' + this.building_id + '&room_id=' + this.room_id
		};
	},
	methods: {
		download_video() {
			uni.showLoading({
				title: '下载中...'
			});
			let url = ''
			if (this.room_info.function_video.indexOf(getApp().globalData.static_url) != -1) {
				url = this.room_info.function_video;
			} else {
				url =getApp().globalData.static_url  + this.room_info.function_video;
			}
			uni.downloadFile({
				//视频信息的Url
				url:  url,
				success: function(res) {
					// 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
					if (res.statusCode === 200) {
						console.log(res.tempFilePath);
						uni.saveVideoToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function(res) {
								console.log(res.errMsg);
								uni.hideLoading();
							},
							fail() {
								uni.showModal({
									title:'温馨提示',
									content:'保存视频失败'
								})
								uni.hideLoading();
							}
						});
					}
				},
				fail() {
					uni.showModal({
						title:'温馨提示',
						content:'保存视频失败'
					})
					uni.hideLoading();
				}
			});
		},
		selectPhoneClick(event) {
			if (event.name == '联系伙伴') {
				uni.makePhoneCall({
					phoneNumber: this.account_info.login_phone
				});
			} else {
				if (!this.building_info.manager_phone) {
					uni.showToast({
						title: '暂无管理员/房东电话',
						icon: 'none'
					});
				}
				uni.makePhoneCall({
					phoneNumber: this.building_info.manager_phone
				});
			}
		},
		selectClick(event) {
			let _this = this;
			if (event.name == '复制房源') {
				uni.reLaunch({
					url:
						'/pages/batchCreateRomm/batchCreateRomm?building_id=' +
						this.building_id +
						'&room_name=' +
						this.room_info.door_num +
						'&room_id=' +
						this.room_info.id +
						'&rent=' +
						this.room_info.rent * 1+'&apartment='+this.room_info.apartment
				});
			} else if (event.name == '编辑房源') {
				uni.navigateTo({
					url:
						'/pages/createRoom/createRoom?building_id=' +
						this.building_id +
						'&building_name=' +
						this.building_info.name +
						'&room_info=' +
						encodeURIComponent(JSON.stringify(this.room_info)) +
						'&type=room_edit'
				});
			} else if (event.name == '删除房源') {
				uni.showModal({
					title: '温馨提示',
					content: '您确定要删除当前房间吗？',
					success(res) {
						if (!!res.confirm) {
							_this.delete_room();
						}
					}
				});
			}
		},
		async delete_room() {
			let params = {
				room_id: this.room_id,
				building_id: this.building_id
			};
			let deleteData = await deleteRoom(params);
			if (!!deleteData.room_id) {
				uni.showToast({
					title: '删除成功',
					icon: 'none',
					position: 'bottom',
					duration: 2000
				});
				setTimeout(function() {
					uni.navigateBack();
				}, 2000);
			}
		},
		open_status() {
			if (this.is_building_employee == 1) {
				this.show_room_status = true;
				this.defaultIndex = this.room_info.status * 1 - 1;
			} else {
				uni.showToast({
					title: '亲，不是您负责的楼栋',
					icon: 'none',
					position: 'bottom'
				});
			}
		},
		async select_room_status(e) {
			console.log(e, '手动阀');
			let status = e.value[0].type;
			let params = {
				room_id: this.room_info.id,
				building_id: this.building_id,
				status: status
			};
			let data = await saveRoom(params);
			this.show_room_status = false;
			uni.showToast({
				title: '修改房间状态成功',
				icon: 'none'
			});
		},
		async getRoomDetail() {
			let room_data = await getRoomInfo({
				room_id: this.room_id,
				building_id: this.building_id
			});
			this.is_loading = false;
			let building_info = room_data.building_info,
				room_info = room_data.room_info;
			if (room_info.length == 0) {
				uni.showModal({
					title: '温馨提示',
					content: '房间已经被删除',
					showCancel: false,
					confirmText: '返回页面',
					complete() {
						uni.navigateBack();
					}
				});
			}
			//创建图片视频数据
			let resource_list = [],
				source_list = [];
			//卧室数据
			if (!!room_info.beedroom_img) {
				room_info.beedroom_img.split(';').forEach(item => {
					if (item.indexOf(getApp().globalData.static_url) != -1) {
					} else {
						item = getApp().globalData.static_url + item;
					}
					let obj = {
						url: item,
						title: '房间',
						type: 'image'
					};
					resource_list.push(obj);
					source_list.push({
						type: 'image',
						url: item
					});
				});
			} else {
				let obj = {
					url: getApp().globalData.static_url + '/upload_files/building.jpg',
					title: '房间',
					type: 'image'
				};
				resource_list.push(obj);
				source_list.push({
					type: 'image',
					url: getApp().globalData.static_url + '/upload_files/building.jpg'
				});
			}
			//视频数据 放在第二个
			if (!!room_info.function_video) {
				room_info.function_video.split(';').forEach(item => {
					if (item.indexOf(getApp().globalData.static_url) != -1) {
					} else {
						item = getApp().globalData.static_url + item;
					}
					let obj = {
						url: item, //默认图
						title: '视频',
						type: 'video'
					};
					resource_list.push(obj);
					source_list.push({
						type: 'video',
						url: item
					});
				});
			} else {
				let obj = {
					url: getApp().globalData.static_url + '/upload_files/building_video.mp4', //默认图
					title: '视频',
					type: 'video'
				};
				resource_list.push(obj);
				source_list.push({
					type: 'video',
					url: getApp().globalData.static_url + '/upload_files/building_video.mp4'
				});
			}
			// 客厅数据
			if (!!room_info.livingroom_img) {
				room_info.livingroom_img.split(';').forEach(item => {
					let obj = {
						url: item,
						title: '客厅'
					};
					resource_list.push(obj);
					source_list.push({
						type: 'image',
						url: item
					});
				});
			}
			// 餐厅数据
			if (!!room_info.diningroom_img) {
				room_info.diningroom_img.split(';').forEach(item => {
					let obj = {
						url: item,
						title: '餐厅'
					};
					resource_list.push(obj);
					source_list.push({
						type: 'image',
						url: item
					});
				});
			}
			//卫生间数据
			if (!!room_info.bathroom_img) {
				room_info.bathroom_img.split(';').forEach(item => {
					let obj = {
						url: item,
						title: '卫生间'
					};
					resource_list.push(obj);
					source_list.push({
						type: 'image',
						url: item
					});
				});
			}
			//厨房数据
			if (!!room_info.cookhouse_img) {
				room_info.cookhouse_img.split(';').forEach(item => {
					let obj = {
						url: item,
						title: '厨房'
					};
					resource_list.push(obj);
					source_list.push({
						type: 'image',
						url: item
					});
				});
			}

			// 处理数据
			let pay_type_text = '',
				contract_type_text = '';
			if (!!building_info.pay_type) {
				switch (building_info.pay_type * 1) {
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
			if (!!building_info.contract_type) {
				switch (building_info.contract_type * 1) {
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
			building_info.pay_type_text = pay_type_text;
			building_info.contract_type_text = contract_type_text;
			let room_thing = [];
			if (!!room_info.fit_info) {
				room_thing = room_info.fit_info.split(';');
			}
			this.is_building_employee = room_data.is_building_employee;
			this.is_area = room_data.is_area;
			this.room_thing = room_thing;
			this.resource_list = resource_list;
			this.source_list = source_list;
			this.room_info = room_info;
			this.building_info = building_info;
			this.account_info = room_data.account_info;
		},
		resource_click(index) {
			// #ifdef  MP-WEIXIN
			if (this.resource_list[index].type == 'video') {
				return;
			}
			wx.previewMedia({
				sources: this.source_list,
				current: this.currentNum
			});
			// #endif
		},
		open_room_map() {
			// #ifdef  MP-WEIXIN
			uni.openLocation({
				latitude: this.building_info.lat * 1,
				longitude: this.building_info.lng * 1,
				name: this.building_info.name,
				address: this.building_info.address,
				success: function() {}
			});
			// #endif
		}
	}
};
</script>

<style scoped lang="scss">
.room_detail {
	padding-bottom: 140rpx;

	.resource_box {
		position: relative;
		width: 100%;
		height: 480rpx;
		overflow: hidden;

		.resource_indicator {
			position: absolute;
			left: 0;
			bottom: 24rpx;
			width: 100%;
			padding: 0 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			view {
				padding: 6rpx 26rpx;
				background: rgba(0, 0, 0, 0.24);
				border-radius: 24rpx;
				color: #fff;
				font-size: 24rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	.location_info {
		margin-top: 20rpx;
		padding: 36rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;

		.location_info_item {
			width: 48%;

			.content {
				display: flex;
				margin-top: 20rpx;
				margin-bottom: 10rpx;

				image {
					margin-top: 4rpx;
					width: 36rpx;
					height: 36rpx;
					flex-shrink: 0;
				}

				text {
					margin: 0 10rpx;
					flex: 1;
				}

				.icon_image {
					margin-top: 4rpx;
					width: 26rpx;
					height: 26rpx;
				}
			}
		}
	}

	.room_info {
		background: #fff;
		padding: 20rpx 30rpx;

		.room_info_top {
			padding-bottom: 50rpx;
			border-bottom: 1px solid #eee;

			.room_price_box {
				padding: 36rpx 0;
				display: flex;
				align-items: center;

				.price {
					text {
						margin-left: 14rpx;
					}
				}

				.commission {
					margin-left: 20rpx;
					padding: 5rpx 10rpx;
					border: 1px solid #fe8962;
					border-radius: 6rpx;
					font-size: 20rpx;
					color: #fe8962;
					background: #fff0eb;
				}
				.download_video {
					width: 180rpx;
					height: 46rpx;
					background: #3366ff;
					font-size: 24rpx;
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-left: 50rpx;
					border-radius: 8rpx;
				}
			}

			.room_name {
			}
		}

		.room_info_bottom {
			height: 146rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.room_info_bottom_item {
				width: 25%;
				text-align: center;

				.content {
					margin-top: 10rpx;
				}

				.title {
					margin-top: 20rpx;
				}
			}
		}
	}

	.from_info {
		margin-top: 20rpx;
		padding: 36rpx;
		background: #fff;

		.from_info_content {
			margin-top: 36rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: wrap;

			.from_info_item {
				display: flex;
				margin-bottom: 30rpx;
				width: 50%;

				.title {
					max-width: 200rpx;
					flex-shrink: 0;
				}

				.content {
					margin-left: 24rpx;
				}
			}

			.from_info_item:last-of-type {
				margin-bottom: 0;
			}
		}
	}
}

.thing_box {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	background: #fff;
}

.thing_item {
	padding: 10rpx 30rpx;
	background: #f4f5f9;
	color: #7b8193;
	font-size: 28rpx;
	border-radius: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20rpx;
	margin-right: 10rpx;
}

.thing_item_active {
	background: #3366ff;
	color: #fff;
}

.footer_box {
	width: 100%;
	height: 140rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30rpx;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 2;
	background: #fff;
	border-top: 1px solid #eeeeee;
	box-shadow: 0px -3rpx 6rpx rgba(0, 0, 0, 0.16);

	.footer_box_left {
		display: flex;
		align-items: center;

		.change_status {
			margin-left: 28rpx;
			text-align: center;

			image {
				width: 36rpx;
				height: 36rpx;
				margin-bottom: 6rpx;
			}
		}

		.more_box {
			margin-left: 70rpx;
			text-align: center;

			image {
				width: 36rpx;
				height: 36rpx;
				margin-bottom: 6rpx;
			}
		}
	}

	.footer_box_right {
		display: flex;
		align-items: center;

		.footer_btn {
			width: 178rpx;
			height: 88rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			border-radius: 6rpx;
			color: #fff;
		}

		.write {
			background: #ff551d;
		}

		.contact {
			background: #3366ff;
			margin-left: 22rpx;
		}
	}
}
</style>
