<template>
	<view class="add_customer">
		<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
		<u--form labelPosition="left" labelWidth="160rpx" :model="customer_form" ref="customer_form">
			<view class="head_title">客户来源</view>
			<view class="form-item_box">
				<u-form-item :required="true" label="来源类型" prop="qudao_type_text" @click="open_picker('qudao_type')">
					<u--input
						placeholder="请选择来源"
						inputAlign="right"
						border="none"
						v-model="customer_form.qudao_type_text"
						disabled
						disabledColor="#ffffff"
						suffixIcon="arrow-right"
						suffixIconStyle="color: #C7C7CC"
					></u--input>
				</u-form-item>
			</view>
			<view class="head_title">联系信息</view>
			<view class="form-item_box">
				<u-form-item :required="true" borderBottom label="客户星级" prop="name">
					<u-rate :activeColor="'#3366ff'" :count="5" v-model="customer_form.grade"></u-rate>
				</u-form-item>
				<u-form-item :required="true" borderBottom label="客户姓名" prop="name">
					<u--input placeholder="请输入客户姓名" inputAlign="right" border="none" v-model="customer_form.name" type="text"></u--input>
				</u-form-item>
				<u-form-item :required="true" borderBottom label="手机号码" prop="phone">
					<u--input placeholder="请输入手机号码" inputAlign="right" border="none" v-model="customer_form.phone" type="number"></u--input>
				</u-form-item>
				<u-form-item :required="true" borderBottom label="客户性别" prop="gender_text" @click="open_picker('gender')">
					<u--input
						placeholder="请选择客户性别"
						inputAlign="right"
						border="none"
						v-model="customer_form.gender_text"
						disabled
						disabledColor="#ffffff"
						suffixIcon="arrow-right"
						suffixIconStyle="color: #C7C7CC"
					></u--input>
				</u-form-item>
				<u-form-item label="其他备注" prop="customer_remark">
					<u--input placeholder="请输入其他备注" inputAlign="right" border="none" v-model="customer_form.customer_remark" type="text"></u--input>
				</u-form-item>
			</view>
			<view class="head_title">求租需求</view>
			<view class="form-item_box">
				<u-form-item :required="true" borderBottom label="需求户型" prop="room_type_text" @click="open_picker('room_type')">
					<u--input
						placeholder="请选择需求户型"
						inputAlign="right"
						border="none"
						v-model="customer_form.room_type_text"
						disabled
						disabledColor="#ffffff"
						suffixIcon="arrow-right"
						suffixIconStyle="color: #C7C7CC"
					></u--input>
				</u-form-item>
				<u-form-item :required="true" borderBottom label="期望位置" prop="expect_area">
					<u--input placeholder="请输入期望位置" inputAlign="right" border="none" v-model="customer_form.expect_area" type="text"></u--input>
				</u-form-item>
				<u-form-item :required="true" borderBottom label="看房时间" prop="showings_time" @click="show_time = true">
					<u--input
						placeholder="请选择看房时间"
						inputAlign="right"
						border="none"
						v-model="customer_form.showings_time"
						disabled
						disabledColor="#ffffff"
						suffixIcon="arrow-right"
						suffixIconStyle="color: #C7C7CC"
					></u--input>
				</u-form-item>
				<u-form-item :required="true" borderBottom label="求租预算" prop="budget">
					<u--input placeholder="请输入求租预算" inputAlign="right" border="none" v-model="customer_form.budget" type="number"></u--input>
				</u-form-item>
			</view>
			<view class="head_title">备注</view>
			<view class="form-item_box">
				<u-form-item prop="remark"><u--textarea v-model="customer_form.remark" placeholder="请输入备注内容"></u--textarea></u-form-item>
			</view>
			<view class="footer_box">
				<view class=""><button class="u-reset-button continue_btn" @tap="$u.throttle(save_customer, 500)">确认提交</button></view>
			</view>
		</u--form>
		<!-- 渠道类型 -->
		<u-picker :show="showPicker" closeOnClickOverlay immediateChange :columns="columns" keyName="label" @cancel="cancel" @confirm="confirm" @close="close"></u-picker>
		<!-- 最早入住时间设置 -->
		<u-datetime-picker
			ref="datetimePicker"
			:show="show_time"
			v-model="now_time"
			mode="date"
			:formatter="formatter"
			closeOnClickOverlay
			@confirm="time_confirm"
			@cancel="time_cancel"
			@close="time_close"
		></u-datetime-picker>
	</view>
</template>

<script>
import { editCustomer } from '@/config/api.js';
export default {
	data() {
		return {
			now_time: Number(new Date()),
			show_time: false,
			customer_form: {
				customer_id: 0,
				qudao_type: '',
				qudao_type_text: '',
				grade: 5,
				name: '',
				phone: '',
				gender: '',
				gender_text: '',
				customer_remark: '',
				expect_area: '',
				room_type: '',
				room_type_text: '',
				showings_time: '',
				budget: '',
				remark: '',
				status: 1
			},
			open_picker_name: '',
			rules: {},
			columns: [],
			showPicker: false,
			room_type_columns: [
				[
					{
						label: '大单间',
						id: 1
					},
					{
						label: '一房一厅',
						id: 2
					},
					{
						label: '二房一厅',
						id: 3
					},
					{
						label: '三房一厅',
						id: 4
					}
				]
			],
			gender_columns: [
				[
					{
						label: '男',
						id: 1
					},
					{
						label: '女',
						id: 2
					}
				]
			],
			qudao_type_columns: [
				[
					{
						label: '闲鱼',
						id: 1
					},
					{
						label: '豆瓣',
						id: 2
					},
					{
						label: '抖音',
						id: 3
					},
					{
						label: '小红书',
						id: 4
					},
					{
						label: '58同城',
						id: 5
					},
					{
						label: '微信视频号',
						id: 6
					},
					{
						label: '转介绍',
						id: 7
					},
					{
						label: '上门客',
						id: 8
					},
					{
						label: '公司分配',
						id: 9
					},
					{
						label: '小程序分享',
						id: 10
					},
					{
						label: '其他',
						id: 11
					}
				]
			],
			showElevator: false
		};
	},
	onLoad() {},
	onUnload() {},
	onReady() {
		// 微信小程序需要用此写法
		this.$refs.datetimePicker.setFormatter(this.formatter);
	},
	methods: {
		formatter(type, value) {
			if (type === 'year') {
				return `${value}年`;
			}
			if (type === 'month') {
				return `${value}月`;
			}
			if (type === 'day') {
				return `${value}日`;
			}
			return value;
		},
		time_close() {
			this.show_time = false;
		},
		time_cancel() {
			this.show_time = false;
		},
		async time_confirm(e) {
			console.log('confirm', e);
			this.show_time = false;
			const timeFormat = uni.$u.timeFormat;
			let showings_time = await timeFormat(e.value, 'yyyy-mm-dd');
			this.customer_form.showings_time = showings_time;
		},

		open_picker(type) {
			let attrName = type + '_columns';
			this.open_picker_name = type;
			this.columns = this[attrName];
			console.log(this.columns, 'this.columns');
			this.showPicker = true;
		},
		confirm(e) {
			console.log('confirm', e);
			let value = e.value[0].id;
			this.customer_form[this.open_picker_name] = value;
			this.customer_form[this.open_picker_name + '_text'] = e.value[0].label;
			this.showPicker = false;
		},
		close() {
			// console.log('cancel');
			this.showPicker = false;
		},
		cancel() {
			// console.log('cancel');
			this.showPicker = false;
		},
		async save_customer() {
			this.customer_form.init_date = uni.$u.timeFormat(new Date().getTime(), 'yyyy-mm-dd hh:MM:ss');
			this.customer_form.nick_name = this.customer_form.name;
			let params = this.customer_form;
			let data = await editCustomer(params);
			console.log(data, 'data');
			if (!!data.customer_id) {
				uni.showToast({
					title: '新增成功',
					icon: 'none',
					duration: 1500,
					complete() {}
				});

				setTimeout(function() {
					uni.$emit('refresh_data', '');
					uni.navigateBack();
				}, 1500);
			}
		}
	}
};
</script>

<style scoped>
.add_customer {
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

.management_box {
	padding: 20rpx 0;
}

.management_item {
	padding-left: 80rpx;
	padding-right: 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 100rpx;
}

.add_room_type {
	margin-left: 30rpx;
	height: 120rpx;
	display: flex;
	align-items: center;
	border-top: 1rpx solid #e5e5e5;
}

.footer_box {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	display: flex;
	z-index: 1000;
}

.footer_box view {
	width: 100%;
	height: 100%;
}

.complate_btn,
.continue_btn {
	height: 100%;
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
</style>
<style>
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
</style>
