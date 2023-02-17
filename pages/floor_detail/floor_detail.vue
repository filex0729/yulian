<template>
	<view class="floor_detail" v-if="!is_loading">
		<!-- 公告 -->
		<view class="floor_notice" v-if="!is_change && !!building_info.building_notice">
			<view class="xibao_wrapper_left">
				<image class="xibao_icon" src="../../static/image/gonggao@2x.png" mode=""></image>
				<u-notice-bar customStyle="width:500rpx" :text="building_info.building_notice" color="#2A2E34" bgColor="none" fontSize="28rpx" :icon="none"></u-notice-bar>
			</view>
			<view class="xibao_wrapper_right"><u-icon name="arrow-right" color="#D0D0DC" size="30rpx"></u-icon></view>
		</view>
		<view v-show="is_change" class="choose_room_title font_size28 main_title_color">{{ is_change == 1 ? '请勾选要批量复制的房源' : '请勾选要批量修改的房源' }}</view>
		<!-- tab切换  分为在租 跟全部 -->
		<u-sticky bgColor="#f4f5f9"><u-tabs :activeStyle="{color:'#3366ff',fontWeight:'500'}" :lineColor="'#3366ff'" :lineWidth="'60rpx'" :itemStyle="{height:'100rpx',padding:'0 30rpx'}" :list="tab_list" @click="change_tab"></u-tabs></u-sticky>
		<!-- 每个楼层对应的房间 -->
		<view class="floor_detail_content" v-if="room_info.length > 0">
			<view class="floor_detail_item" v-for="(item, index) in room_info" :key="index">
				<view class="head_title font_size32 font_weight_bold main_title_color" v-if="item.room.length > 0">楼层：{{ item.floor }}楼</view>
				<view class="floor_room_content" v-if="item.room.length > 0" :style="{ maxHeight: !!item.open_status ? 'auto' : '280rpx' }">
					<view class="room_item_wrapper" v-for="(room, roomIndex) in item.room" :key="roomIndex">
						<room_item
							:from_type="'detail'"
							:index="index"
							:building_id="building_id"
							:room_index="roomIndex"
							:room_info="room"
							:prefix="building_info.prefix || ''"
							:batch_change="is_change"
						></room_item>
					</view>
				</view>
				<view class="more_box" v-if="item.room.length > 6" @click="change_height(index)">
					<view class="more_box_title">{{ !!item.open_status ? '收起' : '展开' }}</view>
					<u-icon :name="!!item.open_status ? 'arrow-up' : 'arrow-down'" :color="'#7B8193'" :size="'24rpx'"></u-icon>
				</view>
			</view>
		</view>
		<view class="floor_detail_footer" v-show="!is_change">
			<view class="floor_info font_size22 second_title_color">
				<view class="floor_info_item" v-if="building_info.is_lift != undefined">{{ building_info.is_lift == 1 ? '有电梯' : '没有电梯' }}</view>
				<view class="floor_info_item" v-if="building_info.pay_type_text">{{ building_info.pay_type_text }}</view>
				<view class="floor_info_item" v-if="building_info.contract_type_text">{{ building_info.contract_type_text }}</view>
				<view class="floor_info_item" v-if="building_info.commission_precent">佣金{{ building_info.commission_precent * 1 }}%</view>
				<view class="floor_info_item" v-if="building_info.other_info">{{ building_info.other_info }}</view>
				<view class="floor_info_item" v-if="building_info.electricity * 1">电费{{ building_info.electricity * 1 }}元/度</view>
				<view class="floor_info_item" v-if="building_info.water_rates * 1">水费{{ building_info.water_rates * 1 }}元/方</view>
				<view class="floor_info_item" v-if="building_info.hot_water_fee * 1">热水费{{ building_info.hot_water_fee * 1 }}元/方</view>
				<view class="floor_info_item" v-if="building_info.net_charge">网费{{ building_info.net_charge }}/月</view>
				<view class="floor_info_item" v-for="(manage,index) in building_info.manage_charge" :key="name">{{manage.name}}({{manage.value}}元/月)</view>
			</view>
			<view class="floor_btn_box" v-if="is_building_employee == 1">
				<view class="btn_item" @tap.stop="$u.throttle(batch_generate, 500)">批量生成</view>
				<view class="btn_item" @tap.stop="batch_change">批量修改</view>
				<view class="btn_item" @tap.stop="$u.throttle(floor_change, 500)">楼栋管理</view>
				<view class="btn_item contact_partner" @click="add_room">新建房源</view>
			</view>
			<view class="floor_btn_box" v-else style="justify-content: flex-end">
				<view class="btn_item" style="width: 260rpx;margin-right: 30rpx;" @click="go_manage_house">录盘人的其他楼栋</view>
				<view class="btn_item contact_partner" @tap="more_show = true">电话联系</view>
			</view>
		</view>
		<view class="next_footer" v-if="!!is_change">
			<view class="next_footer_left">
				<view class="cart_image"><u-badge :value="room_count" type="error" :offset="[0, 0]" :absolute="true"></u-badge></view>
			</view>
			<view class="cancel_footer_right font_size28" @tap.stop="$u.throttle(cancel_choose, 500)">取消</view>
			<view class="next_footer_right font_size28" @tap.stop="$u.throttle(edit_room, 500)">下一步</view>
		</view>
		<u-action-sheet
			:actions="more_list"
			@select="selectClick"
			:show="more_show"
			@close="more_show = false"
			:closeOnClickOverlay="true"
			:closeOnClickAction="true"
		></u-action-sheet>
	</view>
	<!--更多操作 -->
	<u-loading-page v-else :loading="is_loading" loading-text="加载中"></u-loading-page>
</template>

<script>
import {
	roomList
} from '@/config/api.js';
export default {
	data() {
		return {
			tab_list:[
              {
				  name:'在租房间'
			  },
			  {
				  name:'全部房间'
			  }
			],
			current_tab:0,
			is_change: '',
			is_loading: true,
			building_id: '',
			building_info: {}, //楼栋信息
			room_info: [], //房间数组
			all_room_info:[],//全部房间数据
			wait_room_info:[],//在租房间数据
			wait_room_num:0,
			is_building_employee: 0, //是否属于自己负责的楼栋 1属于 0不属于
			room_count: 0,
			more_show: false,
			more_list: [{
					name: '联系伙伴'
				},
				{
					name: '联系房东'
				}
			],
			account_info:{

			}
		};
	},
	onLoad(options) {
		//保存楼栋id
		this.building_id = options.building_id;

	},
	async onShow() {
		await this.$onLaunched;
		getApp().is_bind_phone();
		// 请求楼栋以及房间信息
		this.is_change = '';
		this.getRoomList();

	},
	watch: {
		room_info: {
			handler(newName, oldName) {
				this.get_room_count()
			},
			deep: true
		}
	},
	onShareAppMessage(res) {
		// let imageUrl = ''
		// if (!!this.building_info.building_photo) {
		// 	imageUrl = this.building_info.building_photo.split(";")[0];
		// }
		// if (imageUrl.indexOf(getApp().globalData.static_url) == -1) {
		// 	imageUrl = getApp().globalData.static_url + imageUrl
		// }
		return {
			title: '['+this.building_info.name+'] 在租'+this.wait_room_num+'套,最新销控表',
			imageUrl: '',
			path: "pages/floor_detail/floor_detail?building_id=" + this.building_id
		}
	},
	// // 分享到朋友圈
	// onShareTimeline() {
	// 	let imageUrl = this.building_info.building_photo;
	// 	if(this.building_info.building_photo.indexOf(getApp().globalData.static_url)==-1){
	// 		imageUrl = getApp().globalData.static_url + this.building_info.building_photo
	// 	}
	// 	return {
	// 		title: this.building_info.name,
	// 		path: "pages/floor_detail/floor_detail?building_id="+this.building_id,
	// 		imageUrl: imageUrl
	// 	};
	// },
	methods: {
		change_tab(event){
			if(this.current_tab == event.index){
				return;
			}
			
			this.current_tab = event.index;
			if(this.current_tab==0){
				this.room_info = this.wait_room_info
			}else{
				this.room_info = this.all_room_info
			}
			if(!!this.is_change){
				this.cancel_choose();
			}
		},
		go_manage_house() {
			uni.navigateTo({
				url: "/pages/manage_house/manage_house?building_id=" + this.building_id
			})
		},
		selectClick(event) {
			if (event.name == '联系伙伴') {
			    uni.makePhoneCall({
			    	phoneNumber: this.account_info.login_phone
			    })
			} else {
				if (!this.building_info.manager_phone) {
					uni.showToast({
						title: '暂无管理员/房东电话',
						icon: 'none'
					})
				}
				uni.makePhoneCall({
					phoneNumber: this.building_info.manager_phone
				})
			}
		},
		change_height(index) {
			this.room_info[index].open_status = !this.room_info[index].open_status
		},
		add_room() {
			uni.navigateTo({
				url: '/pages/createRoom/createRoom?building_id=' + this.building_id + '&building_name=' + this
					.building_info.name
			})
		},
		get_room_count() {
			let room_count = 0;
			if (this.room_info.length > 0) {
				this.room_info.forEach(item => {
					if (item.room.length > 0) {
						item.room.forEach(room => {
							if (!!room.is_checked) {
								room_count++
							}
						})
					}
				})
			}
			this.room_count = room_count;
		},
		async getRoomList() {
			let params = {
				building_id: this.building_id
			}
			let roomListData = await roomList(params);
			console.log(roomListData, 'roomListData')
			this.is_loading = false;
			this.is_building_employee = roomListData.is_building_employee;
			this.account_info = roomListData.account_info;
			let building_info = roomListData.building_info;
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
			this.building_info = roomListData.building_info;
			if (roomListData.room_info.length > 0) {
				roomListData.room_info.forEach(item => {
					item.open_status = false
					if (item.room.length > 0) {
						item.room.forEach(room => {
							room.is_checked = false;
						})
					}
				})
			}
			roomListData.room_info.sort((a, b) => {
				return a.floor - b.floor
			})
			
			let wait_room_info = [],
			wait_room_num = 0
			if( roomListData.room_info.length>0){
				 roomListData.room_info.forEach(item=>{
					 let wait_item = uni.$u.deepClone(item);
					 wait_item.room = []
					 if(item.room.length>0){
						 item.room.forEach(key=>{
							 if(key.status==1){
								  wait_item.room.push(key);
								  wait_room_num=wait_room_num+1;
							 }
						 })
					 }
					 wait_room_info.push(wait_item)
				 })
			}
			this.all_room_info =  roomListData.room_info;
			this.wait_room_info = wait_room_info;
			this.wait_room_num = wait_room_num;
			if(this.current_tab==0){
				this.room_info = this.wait_room_info
			}else {
				this.room_info = this.all_room_info
			}
			uni.setNavigationBarTitle({
				title: this.building_info.name
			})


		},
		batch_generate() {
			this.is_change = 1;
		},
		batch_change() {
			this.is_change = 2;
		},
		cancel_choose() {
			this.is_change = '';
			if (this.room_info.length > 0) {
				this.room_info.forEach(item => {
					if (item.room.length > 0) {
						item.room.forEach(room => {
							room.is_checked = false
						})
					}
				})
			}
		},
		edit_room() {
			let select_room = [];
			if (this.room_info.length > 0) {
				this.room_info.forEach(item => {
					if (item.room.length > 0) {
						item.room.forEach(room => {
							if (!!room.is_checked) {
								select_room.push(room)
							}
						})
					}
				})
			}
			if (select_room.length == 0) {
				uni.showToast({
					title: '请先选择好房间',
					duration: 2000,
					icon: 'none'
				})
				return;
			}
			if (this.is_change == 1) {
				let select_room_info = select_room[0],
				room_name = !!select_room_info.another_name?select_room_info.another_name:(this.building_info.prefix||'')+select_room_info.door_num
				uni.navigateTo({
					url: '/pages/batchCreateRomm/batchCreateRomm?building_id=' + this.building_id +
						'&room_name=' + room_name + '&room_id=' + select_room_info.id +
						'&rent=' + select_room_info.rent+'&apartment='+select_room_info.apartment,
				})
			} else {
				let room_ids = [];
				select_room.forEach(item => {
					room_ids.push(item.id);
				})
				uni.navigateTo({
					url: '/pages/createRoom/createRoom?type=edit&room_ids=' + room_ids.join(",") +
						'&building_id=' + this.building_id
				});
			}

		},
		floor_change() {
			uni.navigateTo({
				url: '/pages/createFloor/createFloor?type=edit&building_info=' + encodeURIComponent(JSON
					.stringify(this.building_info))
			});
		}
	}
};
</script>

<style scoped lang="scss">
.floor_detail {
	padding-bottom: 250rpx;

	.floor_notice {
		padding: 0 48rpx;
		padding-left: 62rpx;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.xibao_wrapper_left {
			display: flex;
			align-items: center;

			.xibao_icon {
				width: 72rpx;
				height: 30rpx;
				margin-right: 20rpx;
			}
		}
	}

	.choose_room_title {
		height: 94rpx;
		line-height: 94rpx;
		text-align: center;
	}

	.floor_detail_content {
		.floor_detail_item {
			padding: 0 30rpx;

			.head_title {
				padding: 20rpx;
			}

			.floor_room_content {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				overflow: hidden;

				.room_item_wrapper {
					margin-right: 15rpx;
					width: 220rpx;
					margin-bottom: 20rpx;
				}

				.room_item_wrapper:nth-of-type(3n) {
					margin-right: 0;
				}
			}
		}
	}

	.more_box {
		display: flex;
		align-items: center;
		justify-content: center;

		.more_box_title {
			margin-right: 12rpx;
			font-size: 28rpx;
			font-family: Source Han Sans CN-Regular, Source Han Sans CN;
			color: #7b8193;
		}
	}

	.more_box::after {
		content: '';
		display: block;
		width: 160rpx;
		height: 1rpx;
		background: #7b8193;
		margin-left: 70rpx;
	}

	.more_box::before {
		content: '';
		display: block;
		width: 160rpx;
		height: 1rpx;
		background: #7b8193;
		margin-right: 70rpx;
	}

	.next_footer {
		width: 750rpx;
		height: 160rpx;
		background: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 2;
		padding: 0 30rpx;
		border-top: 1px solid #eeeeee;
		box-shadow: 0px -3rpx 6rpx rgba(0, 0, 0, 0.16);
		display: flex;
		justify-content: space-between;

		.next_footer_left {
			padding-left: 20rpx;
			margin-top: 35rpx;

			.cart_image {
				width: 60rpx;
				height: 60rpx;
				position: relative;
				background: url('../../static/cart.png') no-repeat;
				background-size: cover;
			}
		}

		.cancel_footer_right {
			margin-top: 21rpx;
			width: 150rpx;
			height: 88rpx;
			background: #7b8193;
			border-radius: 6rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
		}

		.next_footer_right {
			margin-top: 21rpx;
			width: 360rpx;
			height: 88rpx;
			background: #3366ff;
			border-radius: 6rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
		}
	}

	.floor_detail_footer {
		width: 750rpx;
		height: 250rpx;
		overflow: auto;
		background: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 2;
		padding: 0 36rpx;
		border-top: 1px solid #eeeeee;
		box-shadow: 0px -3rpx 6rpx rgba(0, 0, 0, 0.16);

		.floor_info {
			display: flex;
			flex-wrap: wrap;
			padding-top: 20rpx;
			padding-bottom: 86rpx;

			.floor_info_item {
				margin-right: 20rpx;
				margin-bottom: 10rpx;
			}
		}

		.floor_btn_box {
			position: fixed;
			bottom: 30rpx;
			left: 0;
			width: 100%;
			padding: 0 36rpx;
			background: #fff;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.btn_item {
				width: 160rpx;
				height: 56rpx;
				border: 1px solid #3366ff;
				border-radius: 6rpx;
				font-size: 26rpx;
				color: #3366ff;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.contact_partner {
				background: #3366ff;
				color: #fff;
			}
		}
	}
}

.hidden {
	visibility: hidden;
}
</style>
