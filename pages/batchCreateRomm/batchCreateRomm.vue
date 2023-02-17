<template>
	<view class="batch_create" @tap="close_multiple">
		<view class="" v-if="!next_step">
			<view class="head_title">批量生成房源</view>
			<view class="content">
				<view class="content_item">
					<u-cell :border="false" disabled title="复制房号" :value="room_name" isLink></u-cell>
				</view>
				<view class="content_item">
					<u-cell :border="false" title="朝向" @tap="show_orientation = true" :value="orientation_name" isLink>
					</u-cell>
				</view>
				<view class="content_item">
					<u-cell :border="false" title="户型" @tap="show_room_type = true" :value="room_type_name" isLink>
					</u-cell>
				</view>
				<view class="content_item">
					<u-cell :border="false" title="楼层" :value="storey_value" arrow-direction="down"
						@tap.native.stop="toggle_storey" isLink></u-cell>
					<multiple_box v-if="show_storey" :list="storey_list" :fromtype="'storey'"
						@getListData="getListData"></multiple_box>
				</view>
				<view class="content_item">
					<u-cell :border="false" title="房间尾号" :value="room_value" arrow-direction="down"
						@tap.native.stop="toggle_room" isLink></u-cell>
					<multiple_box v-if="show_room" :list="room_list" :fromtype="'room'" @getListData="getListData">
					</multiple_box>
				</view>
			</view>
		</view>
		<view v-else style="padding-bottom: 100rpx;">
			<view class="create_room_tile box_flex_row_center font_size28 ">
				<view class="nav_title">
					楼层
				</view>
				<view class="nav_title">
					房号
				</view>
				<view class="nav_title">
					价格
				</view>
			</view>
			<view class="room_table">
				<view class="room_tr box_flex_row_center font_size34 " v-for="(room_item,index) in create_room_data"
					:key="room_item.door_num">
					<view class="floor_name">
						{{room_item.ground_floor}}层
					</view>
					<view class="room_name">
						{{room_item.door_num}}
					</view>
					<view class="room_price" style="padding-right: 30rpx;display: flex;">
						<u--input type="digit" placeholder="请输入" v-model="create_room_data[index].rent"
							:customStyle="{padding:'10rpx','padding-left':'20rpx'}"></u--input>
					</view>
				</view>
			</view>
		</view>
		<view class="batch_footer">
			<view class="cancel_btn" @tap="$u.throttle(give_up, 500)">放弃</view>
			<view class="next_btn" v-if="!next_step" @tap="$u.throttle(to_next_step, 500)">下一步</view>
			<view class="next_btn" v-else @tap="$u.throttle(batch_save_room, 500)">下一步</view>
		</view>
		<!-- 朝向 -->
		<u-picker :show="show_orientation" closeOnClickOverlay :columns="orientation_columns" keyName="label"
			:immediateChange='true' @cancel="show_orientation = false" @confirm="select_orientation"
			@close="show_orientation = false">
		</u-picker>
		<!-- 户型 -->
		<u-picker :show="show_room_type" closeOnClickOverlay :columns="room_type_columns" keyName="name"
			:immediateChange='true' @cancel="show_room_type = false" @confirm="select_room_type"
			@close="show_room_type = false"></u-picker>
	</view>
</template>

<script>
	import {
		buildingFloorRoom,
		batchSaveRoom
	} from '@/config/api.js';
	export default {
		data() {
			return {
				next_step: false,
				show_orientation: false,
				show_room_type: false,
				room_type_columns: [
				],
				room_type_name: '请选择',
				room_type: '',
				orientation_name: '请选择',
				room_name: '',
				room_id: '',
				rent:0, //房间租金
				orientation: '',
				show_storey: false,
				show_room: false,
				room_value: '请选择',
				orientation_columns: [
					[{
							label: '东',
							type: 1
						},
						{
							label: '南',
							type: 2
						},
						{
							label: '西',
							type: 3
						},
						{
							label: '北',
							type: 4
						},
						{
							label: '东南',
							type: 5
						},
						{
							label: '东北',
							type: 6
						},
						{
							label: '南北',
							type: 7
						},
						{
							label: '西北',
							type: 8
						},
						{
							label: '西南',
							type: 9
						},
						{
							label: '东西',
							type: 10
						}
					]
				],
				room_list: [],
				storey_value: '请选择',
				storey_list: [],
				click_room: [],
				click_storey: [],
				create_room_data: [],
				apartment:''
			};
		},
		onLoad(options) {
			//请求数据
			console.log(options, 'building_id')
			this.getFloorRoomNum(options.building_id)
			this.room_name = options.room_name;
			this.room_id = options.room_id;
			this.rent = options.rent;
			this.apartment = options.apartment
		},
		methods: {
			// 批量保存房间接口
			async batch_save_room() {
				let params = {
					room_id: this.room_id,
					direction: this.orientation_name,
					apartment: this.room_type.name,
					bedroom_num:this.room_type.bedroomNum,
					livingroom_num:this.room_type.hallNum,
					bathroom_num:this.room_type.toiletNum,
					diningroom_num:0,
					copy_info: JSON.stringify(this.create_room_data)
				}
				let saveData = await batchSaveRoom(params);
				uni.showToast({
					title: !!saveData.error_msg ? saveData.error_msg : '批量生成房间成功',
					icon: 'none',
					duration:1500,
					success() {
						uni.reLaunch({
							url:'/self_page/selfHouse/selfHouse'
						})
					}
				})
			},
			// 放弃
			give_up() {
				uni.showModal({
					title: '温馨提示',
					content: '确定要放弃批量生成房间吗？',
					success(res) {
						if (!!res.confirm) {
							uni.navigateBack()
						}
					}
				})
			},
			// 根据楼栋id返回楼层数和每层房间数
			async getFloorRoomNum(building_id) {
				let params = {
					building_id: building_id
				};
				let data = await buildingFloorRoom(params);
				//造数据
				if (data.floor_num > 0) {
					let storey_list = [];
					for (let i = 1; i <= data.floor_num * 1; i++) {
						storey_list.push({
							label: i + '层',
							value: i,
							is_click: false
						})
					}
					this.storey_list = storey_list
				}
				if (data.floor_room_num > 0) {
					let room_list = [];
					for (let i = 1; i <= data.floor_room_num * 1; i++) {
						i = i < 10 ? '0' + i : i;
						room_list.push({
							label: i,
							value: i,
							is_click: false
						})
					}
					this.room_list = room_list
				}
				
				let manage_charge = data.manage_charge;
				this.room_type_columns[0] = manage_charge;
				for(let i=0;i<manage_charge.length;i++){
					if(this.apartment == manage_charge[i].name){
						this.room_type = manage_charge[i];
						this.room_type_name = manage_charge[i].name;
						return;
					}
				}
				
			},
			to_next_step() {
				if (this.click_storey.length == 0) {
					uni.showModal({
						title: '温馨提示',
						content: '请选择要复制的楼层',
						success: function(res) {}
					});
					return;
				}
				if (this.click_room.length == 0) {
					uni.showModal({
						title: '温馨提示',
						content: '请选择要复制的房间号',
						success: function(res) {}
					});
					return;
				}
				if (!this.room_type) {
					uni.showModal({
						title: '温馨提示',
						content: '请选择房间户型',
						success: function(res) {}
					});
					return;
				}
				if (!this.orientation) {
					uni.showModal({
						title: '温馨提示',
						content: '请选择房间朝向',
						success: function(res) {}
					});
					return;
				}
				let create_room_data = [];
				this.click_storey.forEach(item => {
					this.click_room.forEach(room_item => {
						create_room_data.push({
							ground_floor: item,
							room_num: room_item,
							door_num: item + '' + room_item,
							rent: this.rent*1
						})
					})
				})
				this.create_room_data = create_room_data;
				this.next_step = true;


			},
			select_orientation(e) {
				this.orientation_name = e.value[0].label;
				this.orientation = e.value[0].type;
				this.show_orientation = false;
			},
			select_room_type(e) {
				this.room_type = e.value[0];
				this.room_type_name = e.value[0].name;
				this.show_room_type = false;
			},
			close_multiple() {
				this.show_room = false;
				this.show_storey = false;
			},
			getListData(e, from_type) {
				if (from_type == 'room') {
					this.room_list = e;
					let click_arr = [];
					let click_room = [];
					this.room_list.forEach(item => {
						if (!!item.is_click) {
							click_arr.push(item.label);
							click_room.push(item.value)
						}
					});
					this.click_room = click_room
					if (click_arr.length > 0) {
						this.room_value = click_arr.join(';');
					} else {
						this.room_value = '请选择';
					}
				} else {
					this.storey_list = e;
					let click_arr = [];
					let click_storey = [];
					this.storey_list.forEach(item => {
						if (!!item.is_click) {
							click_arr.push(item.label);
							click_storey.push(item.value)
						}
					});
					this.click_storey = click_storey
					if (click_arr.length > 0) {
						this.storey_value = click_arr.join(';');
					} else {
						this.storey_value = '请选择';
					}
				}
			},
			toggle_storey() {
				this.show_storey = !this.show_storey;
				this.show_room = false;
			},
			toggle_room() {
				this.show_storey = false;
				this.show_room = !this.show_room;
			}
		}
	};
</script>

<style scoped>
	.batch_create {
		min-height: 100vh;
	}

	.head_title {
		height: 100rpx;
		color: #888;
		font-size: 28rpx;
		padding-left: 30rpx;
		line-height: 100rpx;
	}

	.content {
		background: #fff;
		border-top: 2rpx solid #e5e5e5;
		border-bottom: 2rpx solid #e5e5e5;
		padding-left: 30rpx;
	}

	.content_item {
		position: relative;
		height: 86rpx;
		padding-right: 30rpx;
		border-bottom: 2rpx solid #e5e5e5;
	}

	.content_item:last-of-type {
		border-bottom: none;
	}
</style>
<style>
	.u-cell__body {
		height: 86rpx;
		line-height: 86rpx;
		padding: 0 !important;
	}

	.batch_footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		z-index: 1;
	}

	.batch_footer view {
		width: 50%;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 32rpx;
		color: #fff;
		box-sizing: content-box;
	}

	.cancel_btn {
		background: #7b8193;
	}

	.next_btn {
		background: #3366ff;
	}

	.create_room_tile {
		position: sticky;
		top: 0;
		height: 96rpx;
		padding-left: 30rpx;
		background: #f4f5f9;
		z-index: 2;

	}

	.nav_title {
		width: 25%;
		color: #888;
	}

	.room_table {
		background: #fff;
		border-top: 2rpx solid #e5e5e5;
		border-bottom: 2rpx solid #e5e5e5;
		padding-left: 30rpx;

	}

	.room_tr {
		color: #000;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #e5e5e5;
	}

	.room_tr:last-of-type {
		border-bottom: none;
	}

	.room_tr view {
		width: 25%;
	}
</style>
