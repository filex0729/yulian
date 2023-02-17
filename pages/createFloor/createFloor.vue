<template>
	<page-meta :page-style="`overflow:${!show_maintainer ? 'visible' : 'hidden'}`"></page-meta>
	<view class="create_floor">
		<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
		<u--form labelPosition="left" labelWidth="300rpx" :model="form" ref="form1">
			<view class="head_title">楼层信息</view>
			<view class="form-item_box">
				<u-form-item :required="true" borderBottom label="选择楼栋" prop="floor" @click.stop.prevent="choose_floor">
					<u--input
						placeholder="请先选择楼栋"
						inputAlign="right"
						border="none"
						v-model="form.floor"
						disabled
						disabledColor="#ffffff"
						suffixIcon="arrow-right"
						suffixIconStyle="color: #C7C7CC"
					></u--input>
				</u-form-item>
				<!-- <u-form-item :required="true" borderBottom label="楼栋位置" prop="floor_address" @click.stop.prevent="choose_floor_address">
					<u--input placeholder="请选择楼栋位置" inputAlign="right" border="none" v-model="form.floor_address" disabled
						disabledColor="#ffffff" suffixIcon="arrow-right" suffixIconStyle="color: #C7C7CC"></u--input>
				</u-form-item> -->
				<u-form-item borderBottom label="房间号前缀" prop="prefix">
					<u--input placeholder="支持1位字母/数字" inputAlign="right" border="none" @input="TypeInput($event)" maxlength="1" v-model="form.prefix" type="text"></u--input>
				</u-form-item>
				<u-form-item :required="true" borderBottom label="楼层数" prop="storeyNum">
					<u--input
						placeholder="请输入楼栋的楼层数"
						inputAlign="right"
						border="none"
						v-model="form.storeyNum"
						type="number"
						suffixIcon="arrow-right"
						suffixIconStyle="color: #C7C7CC"
					></u--input>
				</u-form-item>
				<u-form-item :required="true" borderBottom label="每层间数" prop="roomNum">
					<u--input
						placeholder="请输入楼栋的每层间数"
						inputAlign="right"
						border="none"
						v-model="form.roomNum"
						type="number"
						suffixIcon="arrow-right"
						suffixIconStyle="color: #C7C7CC"
					></u--input>
				</u-form-item>
				<u-form-item :required="true" label="电梯" prop="elevator" @click="showElevator = true">
					<u--input
						placeholder="请选择是否有电梯"
						inputAlign="right"
						border="none"
						v-model="form.elevator"
						disabled
						disabledColor="#ffffff"
						suffixIcon="arrow-right"
						suffixIconStyle="color: #C7C7CC"
					></u--input>
				</u-form-item>
			</view>
			<view class="head_title">房东/管家信息</view>
			<view class="form-item_box">
				<u-form-item borderBottom label="姓名" prop="manager_name">
					<u--input placeholder="请输入姓名" inputAlign="right" border="none" v-model="form.manager_name" type="text"></u--input>
				</u-form-item>
				<u-form-item borderBottom label="手机" prop="manager_phone">
					<u--input placeholder="请输入手机" inputAlign="right" border="none" v-model="form.manager_phone" type="number"></u--input>
				</u-form-item>
				<!-- <u-form-item borderBottom label="微信" prop="contact_weixin">
					<u--input placeholder="请输入微信" inputAlign="right" border="none" v-model="record_from.contact_weixin" type="text"></u--input>
				</u-form-item> -->
				<u-form-item label="与业主的关系" prop="manager_relation" @click="show_look = true">
					<u--input
						placeholder="请输入与业主的关系"
						inputAlign="right"
						border="none"
						:value="form.manager_relation"
						disabled
						disabledColor="#ffffff"
						suffixIcon="arrow-right"
						suffixIconStyle="color: #C7C7CC"
					></u--input>
				</u-form-item>
			</view>
			<view class="head_title">业主需求</view>
			<view class="form-item_box">
				<u-form-item :required="true" borderBottom label="付款方式" prop="payWayName" @click="showPayWay = true">
					<u--input
						placeholder="请选择"
						inputAlign="right"
						border="none"
						v-model="form.payWayName"
						disabled
						disabledColor="#ffffff"
						suffixIcon="arrow-right"
						suffixIconStyle="color: #C7C7CC"
					></u--input>
				</u-form-item>
				<u-form-item :required="true" borderBottom label="签约期限" prop="signing_period" @click="showPeriod = true">
					<u--input
						placeholder="请选择"
						inputAlign="right"
						border="none"
						v-model="form.signing_period"
						disabled
						disabledColor="#ffffff"
						suffixIcon="arrow-right"
						suffixIconStyle="color: #C7C7CC"
					></u--input>
				</u-form-item>
				<u-form-item :required="true" borderBottom label="佣金" prop="commission">
					<u-input placeholder="请输入" inputAlign="right" border="none" v-model="form.commission" type="number">
						<template slot="suffix">
							<u--text color="#888888" text="%"></u--text>
						</template>
					</u-input>
				</u-form-item>
				<!-- <u-form-item :required="true" borderBottom label="定金" prop="deposit">
					<u-input placeholder="请输入" inputAlign="right" border="none" v-model="form.deposit" type="number">
						<template slot="suffix">
							<u--text color="#888888" text="元"></u--text>
						</template>
					</u-input>
				</u-form-item>
				<u-form-item borderBottom label="留房" prop="stay_days">
					<u-input placeholder="请输入" inputAlign="right" border="none" v-model="form.stay_days" type="number">
						<template slot="suffix">
							<u--text color="#888888" text="天"></u--text>
						</template>
					</u-input>
				</u-form-item> -->
				<u-form-item :required="true" borderBottom label="电费" prop="electricity">
					<u-input placeholder="请输入" inputAlign="right" border="none" v-model="form.electricity" type="digit">
						<template slot="suffix">
							<u--text color="#888888" text="/度"></u--text>
						</template>
					</u-input>
				</u-form-item>
				<u-form-item :required="true" borderBottom label="水费" prop="water_fee">
					<u-input placeholder="请输入" inputAlign="right" border="none" v-model="form.water_fee" type="digit">
						<template slot="suffix">
							<u--text color="#888888" text="/方"></u--text>
						</template>
					</u-input>
				</u-form-item>
				<u-form-item :required="true" borderBottom label="热水费" prop="hot_water_fee">
					<u-input placeholder="请输入" inputAlign="right" border="none" v-model="form.hot_water_fee" type="digit">
						<template slot="suffix">
							<u--text color="#888888" text="/方"></u--text>
						</template>
					</u-input>
				</u-form-item>
				<u-form-item :required="true" borderBottom label="网费" prop="network_fee">
					<u-input placeholder="请输入" inputAlign="right" border="none" v-model="form.network_fee" type="digit">
						<template slot="suffix">
							<u--text color="#888888" text="/月"></u--text>
						</template>
					</u-input>
				</u-form-item>
				<u-form-item :required="true" borderBottom label="管理费" prop="management_room_type">
					<u-input placeholder="请在下方新增房型和管理费" inputAlign="right" border="none" disabled disabledColor="#fff"></u-input>
				</u-form-item>
				<view class="management_box">
					<u-swipe-action>
						<u-swipe-action-item
							v-for="(item, index) in form.management_room_type"
							:key="item.name"
							:index="index"
							:options="swipe_action_options"
							@click="detele_room_type(index)"
						>
							<view class="management_item">
								<view class="management_name main_title_color font_weight_bold">{{ item.name }}</view>
								<u-input placeholder="请输入" inputAlign="right" v-model="form.management_room_type[index].value" border="none" type="number">
									<template slot="suffix">
										<u--text color="#888888" text="/月"></u--text>
									</template>
								</u-input>
							</view>
						</u-swipe-action-item>
					</u-swipe-action>
				</view>
				<view class="add_room_type" @tap="show_add_room = true">
					<u-icon name="plus" size="36rpx"></u-icon>
					<view style="margin-left: 10rpx;" class="font_size30 main_color_blue margin-left-xs">新增</view>
				</view>
			</view>
			<view class="head_title">楼栋维护人</view>
			<view class="form-item_box">
				<view v-for="(item, index) in form.maintainer" :key="index">
					<u-form-item borderBottom :label="'维护人' + (index + 1)" @click.stop.prevent="open_maintainer(index)">
						<u--input placeholder="请先选择维护人" :value="item.name" inputAlign="right" border="none" disabled disabledColor="#ffffff"></u--input>
						<u-button
							:customStyle="{ marginLeft: '20rpx' }"
							slot="right"
							@tap.stop.prevent="delete_maintainer(index)"
							:text="'删除'"
							type="error"
							size="small"
						></u-button>
					</u-form-item>
				</view>

				<view v-if="form.maintainer.length < 3" class="add_room_type" style="border-top: none;" @tap.stop="$u.throttle(add_maintainer, 500)">
					<u-icon name="plus" size="36rpx"></u-icon>
					<view style="margin-left: 10rpx;" class="font_size30 main_color_blue margin-left-xs">新增</view>
				</view>
			</view>

			<view class="head_title">其他</view>
			<view class="form-item_box">
				<view class="check_box">
					<view class="check_box_item" v-for="(item, index) in other_arr" :key="item.attr_name" @click="change_checkStatus(index)">
						<image v-if="!item.disabled" src="../../static/checkedF.png" mode=""></image>
						<image v-else src="../../static/checkedT.png" mode=""></image>
						<view class="check_box_item_title">{{ item.name }}</view>
					</view>
				</view>
			</view>
			<view class="head_title">公告</view>
			<view class="form-item_box">
				<u-form-item prop="notice"><u--textarea v-model="form.notice" placeholder="请输入公告" :height="'120rpx'"></u--textarea></u-form-item>
			</view>
			<view class="head_title">楼栋环境照片(可上传5张照片)</view>
			<view class="form-item_box ">
				<u-form-item prop="floor_imgs">
					<view style="padding: 30rpx 0;">
						<u-upload
							:width="'116rpx'"
							:height="'116rpx'"
							:fileList="form.floor_imgs"
							@afterRead="afterRead"
							@delete="deleteFloorImage"
							multiple
							:maxCount="5"
						></u-upload>
					</view>
				</u-form-item>
			</view>
			<!-- <view class="head_title">视频(可上传1条视频，大小不超过20M)</view>
			<view class="form-item_box">
				<u-form-item prop="floor_videos">
					<view style="padding: 30rpx 0;">
						<u-upload :width="'116rpx'" :maxSize="1024 * 1024 * 20" :height="'116rpx'" accept="video"
							:fileList="form.floor_videos" @afterRead="afterReadVideo" @delete="deleteFloorVideo"
							:maxCount="1"></u-upload>
						<video class="floor_video" v-if="form.floor_videos.length > 0 && !!show_video"
							:src="form.floor_videos[0].url"></video>
					</view>
				</u-form-item>
			</view> -->
			<view class="footer_box">
				<view class=""><button class="u-reset-button complate_btn" @tap="submit_floor(1)">完成录入</button></view>
				<view class="" v-if="!options.type || options.type != 'edit'"><button class="u-reset-button continue_btn" @tap="submit_floor(2)">继续录入</button></view>
			</view>
		</u--form>
		<!-- 新增房型 -->
		<u-picker
			:show="show_add_room"
			closeOnClickOverlay
			:columns="add_room_columns"
			:immediateChange="true"
			keyName="label"
			closeOnClickOverlay
			@cancel="show_add_room = false"
			@confirm="confirm_add_room"
			@close="show_add_room = false"
		></u-picker>
		<!-- <u-popup :show="show_add_room" :round="10" mode="center" @close="show_add_room = false" :safeAreaInsetBottom="false">
			<view class="text-center u-flex u-flex-column u-flex-around u-flex-items-center" style="padding: 20rpx 30rpx;">
				<view class="font_size30">新增房型</view>
				<view style="margin: 30rpx 0;"><u-input customStyle="height: 80rpx;" v-model="room_name" placeholder="请输入房型"></u-input></view>
				<view class=""><u-button type="primary" text="确定" @click="add_room"></u-button></view>
			</view>
		</u-popup> -->
		<!-- 电梯picker -->
		<u-picker
			:show="showElevator"
			closeOnClickOverlay
			:columns="elevator_columns"
			:immediateChange="true"
			keyName="label"
			closeOnClickOverlay
			@cancel="cancel"
			@confirm="confirm"
			@close="close"
		></u-picker>
		<!-- 付款方式picker -->
		<u-picker
			:show="showPayWay"
			closeOnClickOverlay
			:columns="payWay_columns"
			keyName="label"
			closeOnClickOverlay
			:immediateChange="true"
			@cancel="showPayWay = false"
			@confirm="select_payWay"
			@close="showPayWay = false"
		></u-picker>
		<!-- 签约期限 -->
		<u-picker
			:show="showPeriod"
			closeOnClickOverlay
			:columns="period_columns"
			keyName="label"
			closeOnClickOverlay
			:immediateChange="true"
			@cancel="showPeriod = false"
			@confirm="select_period"
			@close="showPeriod = false"
		></u-picker>
		<!-- 与业主关系 -->
		<u-picker
			:show="show_look"
			:immediateChange="true"
			closeOnClickOverlay
			:columns="look_columns"
			@cancel="show_look = false"
			@confirm="select_look"
			@close="show_look = false"
		></u-picker>

		<qianziyu-select
			:show="show_maintainer"
			type="radio"
			:popupTitle="popupTitle"
			name="cworkStationName"
			:dataLists="employeeData"
			placeholder="输入维护人姓名搜索"
			@cancel="show_maintainer = false"
			@search="selectSearch"
			@submit="confirm_data"
		></qianziyu-select>
	</view>
</template>

<script>
import { employeeList, saveBuilding } from '@/config/api.js';
export default {
	data() {
		return {
			popupTitle: '请选择维护人',
			current_index: '',
			show_maintainer: false,
			show_video: false,
			employeeData: [],
			source_employee: [],
			swipe_action_options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#f56c6c'
					}
				}
			],
			show_look: false,
			look_columns: [['管家', '房东', '二房东', '操盘人']],
			show_add_room: false,
			form: {
				floor: '',
				// floor_address:'',
				// lng:'',
				// lat:'',
				floorId: null,
				prefix: '',
				storeyNum: null,
				roomNum: null,
				elevator: '',
				elevator_type: '',
				payWayName: '',
				payWay: '',
				signing_period: '',
				signing_period_type: '',
				commission: '',
				deposit: '',
				stay_days: '',
				electricity: '',
				water_fee: '',
				hot_water_fee: '',
				network_fee: '',
				management_room_type: [],
				maintainer: [], //维护人
				employee_id1: '',
				employee_id2: '',
				employee_id3: '',
				other: [],
				notice: '',
				floor_imgs: [],
				floor_videos: [],
				manager_name: '',
				manager_phone: '',
				manager_relation: '管家'
			},
			other_arr: [
				{
					attr_name: 'is_cat',
					name: '可养小猫',
					disabled: true
				},
				{
					attr_name: 'is_dog',
					name: '可养小狗',
					disabled: true
				},
				{
					attr_name: 'is_gravida',
					name: '可住孕妇',
					disabled: true
				},
				{
					attr_name: 'is_foreigners',
					name: '可住友人',
					disabled: true
				},
				{
					attr_name: 'is_child',
					name: '可住小孩',
					disabled: true
				},
				{
					attr_name: 'is_parking',
					name: '可停车',
					disabled: true
				}
			],
			rules: {},
			add_room_columns: [
				[
					{
						label: '1室',
						id: 1
					},
					{
						label: '2室',
						id: 2
					},
					{
						label: '3室',
						id: 3
					},
					{
						label: '4室',
						id: 3
					},
					{
						label: '5室',
						id: 3
					}
				],
				[
					{
						label: '0厅',
						id: 0
					},
					{
						label: '1厅',
						id: 1
					},
					{
						label: '2厅',
						id: 2
					},
					{
						label: '3厅',
						id: 3
					}
				],
				[
					{
						label: '0卫',
						id: 0
					},
					{
						label: '1卫',
						id: 1
					},
					{
						label: '2卫',
						id: 2
					},
					{
						label: '3卫',
						id: 3
					}
				]
			],
			elevator_columns: [
				[
					{
						label: '没有',
						// 其他属性值
						id: 0
						// ...
					},
					{
						label: '有',
						id: 1
					}
				]
			],
			payWay_columns: [
				[
					{
						label: '押一付一',
						// 其他属性值
						id: 1
						// ...
					},
					{
						label: '押二付一',
						id: 2
					},
					{
						label: '押三付一',
						id: 3
					},
					{
						label: '押一付二',
						id: 4
					},
					{
						label: '押一付三',
						id: 5
					},
					{
						label: '押二付二',
						id: 6
					},
					{
						label: '押三付三',
						id: 7
					}
				]
			],
			period_columns: [
				[
					{
						label: '一个月起',
						// 其他属性值
						id: 1
						// ...
					},
					{
						label: '三个月起',
						id: 2
					},
					{
						label: '半年起租',
						id: 3
					},
					{
						label: '一年起租',
						id: 4
					}
				]
			],
			showElevator: false,
			showPayWay: false,
			showPeriod: false,
			type: 'add', //新增楼栋 还是编辑楼栋
			options: ''
		};
	},
	onLoad(options) {
		let _this = this;
		uni.$on('getFloor', floorInfo => {
			console.log(floorInfo, 'floorInfo');
			_this.form.floor = floorInfo.name;
			_this.form.floorId = floorInfo.id;
		});
		this.options = options;
		if (!!options.type && options.type == 'edit') {
			uni.setNavigationBarTitle({
				title: '修改楼栋'
			});
			this.type = options.type;
			let building_info = JSON.parse(decodeURIComponent(options.building_info));
			console.log(building_info, 'building_info');
			this.initData(building_info);
		}
		// 请求中介信息
		this.getEmployeeList();
	},
	onUnload() {
		// 移除监听事件
		uni.$off('getFloor');
	},
	onReady() {},
	methods: {
		confirm_data(event) {
			this.show_maintainer = false;
			let item_data = event;
			this.form.maintainer[this.current_index] = item_data;
			this.form['employee_id'+(this.current_index+1)] = item_data.id;
		},
		selectSearch(event) {
			if (!!event) {
				this.employeeData = this.fuzzySearch(this.source_employee, event);
			} else {
				this.employeeData = this.source_employee;
			}
		},
		fuzzySearch(list, search) {
			let data = [];
			if (list.length != 0 && search) {
				let str = `\S*${search}\S*`;
				let reg = new RegExp(str, 'i'); //不区分大小写
				list.map(item => {
					if (reg.test(item.name)) {
						data.push(item);
					}
				});
			}
			return data;
		},
		open_maintainer(index) {
			if (this.employeeData.length > 0) {
				this.employeeData.forEach(item => {
					if (item.id == this.form.employee_id1 || item.id == this.form.employee_id2 || item.id == this.form.employee_id3) {
						item.flag = true;
					} else {
						item.flag = false;
					}
				});
				this.employeeData = this.employeeData;
			}
			this.current_index = index;
			this.show_maintainer = true;
		},
		TypeInput(e, val) {
			// 只能输入数字、字母的验证;
			const inputType = /[\W]/g;
			this.$nextTick(function() {
				this.form.prefix = e.replace(inputType, '');
			});
		},
		select_look(e) {
			this.form.manager_relation = e.value[0];
			this.show_look = false;
		},
		change_checkStatus(index) {
			this.other_arr[index].disabled = !this.other_arr[index].disabled;
		},
		async getEmployeeList() {
			let params = {},
				_this = this;
			let employeeData = await employeeList(params);
			if (employeeData.length > 0) {
				employeeData.forEach(item => {
					item.flag = false;
				});
				this.source_employee = employeeData;
				this.employeeData = this.source_employee;
				if(!!(this.form.employee_id1*1)){
					let item_data = {
						name:'',
						id:''
					}
					this.employeeData.forEach(item=>{
						if(item.id == _this.form.employee_id1){
							item_data = item
						}
					})
					this.form.maintainer.push(item_data)
				}
				if(!!(this.form.employee_id2*1)){
					let item_data = {
						name:'',
						id:''
					}
					this.employeeData.forEach(item=>{
						if(item.id == _this.form.employee_id2){
							item_data = item
						}
					})
					this.form.maintainer.push(item_data)
				}
				if(!!(this.form.employee_id3*1)){
					let item_data = {
						name:'',
						id:''
					}
					this.employeeData.forEach(item=>{
						if(item.id == _this.form.employee_id3){
							item_data = item
						}
					})
					this.form.maintainer.push(item_data)
				}
			}
		},
		// 提交数据
		async submit_floor(type) {
			let _this = this;
			//先判断是否选择楼栋
			if (!this.form.floorId) {
				uni.showModal({
					showCancel: false,
					title: '温馨提示',
					content: '请先选择楼栋'
				});
				return;
			}
			this.form.employee_id1 = '';
			this.form.employee_id2 = '';
			this.form.employee_id3 = '';
			if(this.form.maintainer.length>0){
				for(var i=0;i<this.form.maintainer.length;i++){
					if(!this.form.maintainer[i].id){
						uni.showToast({
							title:'维护人'+(i+1)+'不能为空',
							icon:'none'
						})
						return;
					}else {
						this.form['employee_id'+(i+1)] = this.form.maintainer[i].id;
					}
				}
			}
			uni.showLoading({
				mask: true,
				title: '保存中'
			});
			// 楼栋保存数据
			let params = {};
			params.building_id = this.form.floorId;
			// params.lat = this.form.lat;
			// params.lng = this.form.lng;
			// params.address = this.form.floor_address
			params.prefix = this.form.prefix;
			params.floor_num = this.form.storeyNum;
			params.floor_room_num = this.form.roomNum;
			params.is_lift = this.form.elevator_type;
			params.pay_type = this.form.payWay;
			params.contract_type = this.form.signing_period_type;
			params.commission_precent = this.form.commission;
			params.reserved_time = this.form.stay_days;
			params.payment = this.form.deposit;
			params.electricity = this.form.electricity;
			params.water_rates = this.form.water_fee;
			params.hot_water_fee = this.form.hot_water_fee;
			params.net_charge = this.form.network_fee;
			params.manager_name = this.form.manager_name;
			params.manager_phone = this.form.manager_phone;
			params.manager_relation = this.form.manager_relation;
			params.manage_charge = JSON.stringify(this.form.management_room_type);
			params.employee_id1= this.form.employee_id1;
			params.employee_id2= this.form.employee_id2;
			params.employee_id3= this.form.employee_id3;
			let other_info = [];
			// params.maintainer = this.form.maintainer;
			this.other_arr.forEach(item => {
				if (!!item.disabled) {
					other_info.push(item.name);
				}
			});
			params.other_info = other_info.join(',');
			this.other_arr.forEach(item => {
				params[item.attr_name] = item.disabled == true ? 1 : 0;
			});
			params.building_notice = this.form.notice;
			let building_photo = '',
				building_video = '',
				new_floor_imgs = [];
			if (this.form.floor_imgs.length > 1) {
				this.form.floor_imgs.forEach(item => {
					new_floor_imgs.push(item.default_url);
				});
				building_photo = new_floor_imgs.join(';');
			} else {
				if (this.form.floor_imgs.length > 0) {
					building_photo = this.form.floor_imgs[0].default_url;
				}
			}
			params.building_photo = building_photo;
			params.building_video = '';
			let submitData = await saveBuilding(params);
			uni.hideLoading();
			if (submitData.status == '更新成功') {
				uni.showToast({
					icon: 'none',
					title: '提交成功',
					duration: 1500,
					success() {
						if (type == 1) {
							uni.navigateBack();
							let last_page = getCurrentPages()[getCurrentPages().length - 2];
							if (last_page.route == 'self_page/selfHouse/selfHouse') {
								last_page.$vm.page = 1;
								last_page.$vm.status = 'loading';
								last_page.$vm.getBuildingData('');
							}
						} else {
							uni.redirectTo({
								url: '/pages/createRoom/createRoom?building_id=' + _this.form.floorId + '&building_name=' + _this.form.floor
							});
						}
					}
				});
			}
		},
		initData(building_info) {
			this.form.floorId = building_info.id;
			this.form.floor = building_info.name;
			// this.form.floor_address = building_info.address;
			// this.form.lat = building_info.lat;
			// this.form.lng = building_info.lng;
			this.form.storeyNum = building_info.floor_num;
			if (!building_info.prefix) {
				building_info.prefix = '';
			}
			this.form.prefix = building_info.prefix;
			this.form.roomNum = building_info.floor_room_num;
			this.form.elevator_type = building_info.is_lift;
			this.form.elevator = building_info.is_lift == 1 ? '有电梯' : '没有电梯';
			this.form.payWayName = building_info.pay_type_text;
			this.form.payWay = building_info.pay_type;
			this.form.signing_period_type = building_info.contract_type;
			this.form.signing_period = building_info.contract_type_text;
			this.form.commission = building_info.commission_precent * 1;
			this.form.deposit = building_info.payment || '';
			this.form.stay_days = building_info.reserved_time || '';
			this.form.electricity = building_info.electricity * 1;
			this.form.water_fee = building_info.water_rates * 1;
			this.form.hot_water_fee = building_info.hot_water_fee * 1 || '';
			this.form.manager_name = building_info.manager_name || '';
			this.form.manager_phone = building_info.manager_phone || '';
			this.form.manager_relation = building_info.manager_relation || '';
			this.form.network_fee = building_info.net_charge * 1;
			this.form.management_room_type = building_info.manage_charge;
			if (!!building_info.employee_id1) {
				this.form.employee_id1 = building_info.employee_id1;
			}
			if (!!building_info.employee_id2) {
				this.form.employee_id2 = building_info.employee_id2;
			}
			if (!!building_info.employee_id3) {
				this.form.employee_id3 = building_info.employee_id3;
			}
			this.other_arr.forEach(item => {
				item.disabled = building_info[item.attr_name] == 1 ? true : false;
			});
			this.form.other = building_info.other_info;
			this.form.notice = building_info.building_notice;
			let floor_imgs = [],
				floor_videos = [];
			if (!!building_info.building_photo) {
				let arr = building_info.building_photo.split(';');
				arr.forEach(item => {
					let obj = {};
					if (item.indexOf(getApp().globalData.static_url) != -1) {
						obj = {
							url: item,
							default_url: item.replace(getApp().globalData.static_url, '')
						};
					} else {
						obj = {
							url: getApp().globalData.static_url + item,
							default_url: item
						};
					}

					floor_imgs.push(obj);
				});
			}
			this.form.floor_imgs = floor_imgs;
		},
		//新增维护人
		add_maintainer() {
			this.form.maintainer.push({
				name: '',
				id: ''
			});
		},
		change_maintainer(event, index) {
			this.form.maintainer[index].id = event.id;
		},
		delete_maintainer(index) {
			let maintainer = this.form.maintainer;
			maintainer.splice(index, 1);
			this.form.maintainer = maintainer;
		},
		deleteFloorImage(event) {
			this.form.floor_imgs.splice(event.index, 1);
		},
		// deleteFloorVideo(event) {
		// 	this.form.floor_videos.splice(event.index, 1)
		// 	this.show_video = false;
		// },
		// 新增图片
		async afterRead(event) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			let lists = [].concat(event.file);
			let fileListLen = this.form.floor_imgs.length;
			lists.map(item => {
				this.form.floor_imgs.push({
					...item,
					status: 'uploading',
					message: '上传中'
				});
			});
			for (let i = 0; i < lists.length; i++) {
				const result = await this.uploadFilePromise(lists[i].url);
				let item = this.form.floor_imgs[fileListLen];
				this.form.floor_imgs.splice(fileListLen, 1, {
					url: getApp().globalData.static_url + result,
					default_url: result
				});
				fileListLen++;
			}
		},
		// async afterReadVideo(event) {
		// 	// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
		// 	let lists = [event.file];
		// 	let fileListLen = this.form.floor_videos.length;
		// 	lists.map(item => {
		// 		this.form.floor_videos.push({
		// 			...item,
		// 			status: 'uploading',
		// 			message: '上传中'
		// 		});
		// 	});
		// 	for (let i = 0; i < lists.length; i++) {
		// 		const result = await this.uploadFilePromise(lists[i].url);
		// 		let item = this.form.floor_videos[fileListLen];
		// 		this.form.floor_videos.splice(fileListLen, 1, {
		// 			url: result
		// 		});
		// 		fileListLen++;
		// 	}
		// 	this.show_video = true
		// },
		uploadFilePromise(url) {
			console.log(url, '的说法');
			return new Promise((resolve, reject) => {
				let a = uni.uploadFile({
					url: getApp().globalData.apiUrl + '/common/tool/uploadfile', // 仅为示例，非真实的接口地址
					filePath: url,
					name: 'image',
					formData: {
						lwm_sess_token: this.vuex_token
					},
					success: res => {
						let staticData = JSON.parse(res.data);
						if (staticData.errcode !== 0) {
							resolve('');
						} else {
							resolve(staticData.data.image_url);
						}
					},
					fail: error => {
						uni.showToast({
							title: '上传失败',
							icon: 'none'
						});
					}
				});
			});
		},
		confirm_add_room(e) {
			let selectData = e.value;
			//造房型数据
			let roominfo = {
				name: selectData[0].label + selectData[1].label + selectData[2].label,
				bedroomNum: selectData[0].id,
				hallNum: selectData[1].id,
				toiletNum: selectData[2].id,
				value: ''
			};
			this.form.management_room_type.push(roominfo);
			this.show_add_room = false;
		},
		detele_room_type(index) {
			console.log(index, 'sdfafd');
			this.form.management_room_type.splice(index, 1);
		},
		choose_floor(e) {
			if (this.type == 'add') {
				uni.navigateTo({
					url: '/pages/choose_floor/choose_floor?type=area'
				});
			}
		},
		// choose_floor_address(){
		// 	let _this = this;
		// 	uni.getLocation({
		// 		type: 'gcj02', //返回可以用于uni.openLocation的经纬度
		// 		success: function (res) {
		// 			const latitude = res.latitude;
		// 			const longitude = res.longitude;
		// 			uni.chooseLocation({
		// 				latitude: latitude,
		// 				longitude: longitude,
		// 				success: function (res) {
		// 					console.log('success',res);
		// 					if(res.errMsg =="chooseLocation:ok"){
		// 						_this.form.floor_address = res.name;
		// 						_this.form.lat = res.latitude;
		// 						_this.form.lng = res.longitude
		// 					}
		// 				}
		// 			});
		// 		}
		// 	});
		// },
		confirm(e) {
			console.log('confirm', e);
			this.form.elevator = e.value[0].label;
			this.form.elevator_type = e.value[0].id;
			this.showElevator = false;
		},
		select_payWay(e) {
			this.form.payWayName = e.value[0].label;
			this.form.payWay = e.value[0].id;
			this.showPayWay = false;
		},
		select_period(e) {
			this.form.signing_period = e.value[0].label;
			this.form.signing_period_type = e.value[0].id;
			this.showPeriod = false;
		},
		close() {
			// console.log('cancel');
			this.showElevator = false;
		},
		cancel() {
			// console.log('cancel');
			this.showElevator = false;
		}
	}
};
</script>

<style scoped>
.floor_video {
	width: 300rpx;
	height: 200rpx;
}

.create_floor {
	padding-bottom: 210rpx;
}

.head_title {
	width: 100%;
	height: 84rpx;
	line-height: 86rpx;
	text-indent: 30rpx;
	border-bottom: 1rpx solid #eee;
	font-size: 28rpx;
	font-family: Source Han Sans CN;
	color: #888888;
}

.management_item {
	padding-left: 80rpx;
	padding-right: 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 100rpx;
	border-bottom: 1rpx solid #e5e5e5;
}

.add_room_type {
	margin-left: 30rpx;
	height: 120rpx;
	display: flex;
	align-items: center;
}

.footer_box {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: calc(100rpx + env(safe-area-inset-bottom) / 2);
	display: flex;
	z-index: 1000;
}

.footer_box view {
	flex: 1;
	height: calc(100rpx + env(safe-area-inset-bottom) / 2);
}

.complate_btn,
.continue_btn {
	height: calc(100rpx + env(safe-area-inset-bottom) / 2);
	border-radius: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 32rpx;
	font-family: Source Han Sans CN;
}

.complate_btn {
	background: #7b8193;
}

.continue_btn {
	background: #3366ff;
}

.check_box {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}

.check_box_item {
	width: 50%;
	display: flex;
	align-items: center;
	height: 68rpx;
}

.check_box_item image {
	width: 36rpx;
	height: 36rpx;
}

.check_box_item_title {
	margin-left: 20rpx;
}
</style>
<style lang="scss">
.form-item_box {
	background: #fff;
	padding-left: 30rpx;
}

.u-form-item__body__right {
	padding-right: 30rpx;
}

.u-checkbox-group {
	flex-wrap: wrap;
}

.u-swipe-action-item {
	overflow: inherit !important;
}
textarea {
	z-index: 10;
}
</style>
