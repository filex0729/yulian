<template>
	<view class="write_record">
		<u--form labelPosition="left" labelWidth="160rpx" :model="customer_form" ref="customer_form">
			<view class="head_title">此处可以记录对客户需求的跟进过程</view>
			<view class="form-item_box">
				<u-form-item borderBottom label="跟进状态" prop="status" @click="open_picker('status')">
					<u--input placeholder="请选择" inputAlign="right" border="none" v-model="record_form.status" disabled
						disabledColor="#ffffff" suffixIcon="arrow-right" suffixIconStyle="color: #C7C7CC"></u--input>
				</u-form-item>
				<u-form-item borderBottom label="需求类型" prop="demand " @click="open_picker('demand')">
					<u--input placeholder="请选择" inputAlign="right" border="none" v-model="record_form.demand" disabled
						disabledColor="#ffffff" suffixIcon="arrow-right" suffixIconStyle="color: #C7C7CC"></u--input>
				</u-form-item>
				<u-form-item borderBottom label="跟进时间" prop="time" @click="show_time = true">
					<u--input placeholder="非必填" inputAlign="right" border="none" v-model="record_form.time" disabled
						disabledColor="#ffffff" suffixIcon="arrow-right" suffixIconStyle="color: #C7C7CC"></u--input>
					</u--input>
				</u-form-item>
				<u-form-item label="跟进地点" prop="place">
					<u--input placeholder="非必填" inputAlign="right" border="none" v-model="record_form.place" type="text"
						suffixIcon="arrow-right" suffixIconStyle="color: #C7C7CC"></u--input>
				</u-form-item>
			</view>

			<view class="head_title">备注</view>
			<view class="form-item_box">
				<u-form-item prop="remark">
					<u--textarea v-model="customer_form.remark" placeholder="请输入备注内容"></u--textarea>
				</u-form-item>
			</view>
			<u-picker :show="showPicker" closeOnClickOverlay immediateChange :columns="columns" keyName="label"
				@cancel="cancel" @confirm="confirm" @close="close"></u-picker>
			<u-datetime-picker ref="datetimePicker" :show="show_time" closeOnClickOverlay @confirm="confirm_time"
				@cancel="cancel_time" @close="close_time" v-model="current_time" mode="datetime">
			</u-datetime-picker>
			<view class="footer_box">
				<view class=""><button class="u-reset-button continue_btn">确认提交</button></view>
			</view>
		</u--form>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: '', //记录来源
				record_form: {
					status: '',
					demand: '',
					time: '',
					place: ''
				},
				columns: [],
				status_columns: [
					[{
							label: '否',
							id: 0
						},
						{
							label: '是',
							id: 1
						}
					]
				],
				demand_columns: [
					[{
							label: '否',
							id: 0
						},
						{
							label: '是',
							id: 1
						}
					]
				],
				open_picker_name: '',
				show_time: false,
				showPicker: false,
				current_time: Number(new Date()),
			};
		},
		onLoad(options) {
			console.log(options, '阿士大夫撒大')
			this.type = options.type;
			if (this.type == 'write_follow') {
				uni.setNavigationBarTitle({
					title: '跟进记录'
				})
			}
			//获取当前时间
			this.confirm_time({
				value: this.current_time
			});
		},
		onReady() {
			// 微信小程序需要用此写法
			// this.$refs.datetimePicker.setFormatter(this.formatter)
		},
		methods: {
			cancel_time() {
				this.show_time = false;
			},
			close_time() {
				this.show_time = false;
			},
			confirm_time(e) {
				this.current_time = Number(e.value)
				this.record_form.time = this.$u.timeFormat(this.current_time, 'yyyy-mm-dd hh:MM');
				this.show_time = false;
			},
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`
				}
				if (type === 'month') {
					return `${value}月`
				}
				if (type === 'day') {
					return `${value}日`
				}
				return value
			},
			open_picker(type) {
				let attrName = type + '_columns';
				this.open_picker_name = type;
				this.columns = this[attrName];
				this.showPicker = true;
			},
			confirm(e) {
				console.log('confirm', e);
				let value = e.value[0].label;
				this.record_form[this.open_picker_name] = value;
				this.showPicker = false;
			},
			close() {
				// console.log('cancel');
				this.showPicker = false;
			},
			cancel() {
				// console.log('cancel');
				this.showPicker = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.write_record {
		padding-top: 10rpx;
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
