<template>
	<view class="customer_item" @tap.stop="go_detail_customer">
		<view class="customer_info">
			<view class="customer_name">
				{{customer_item.name||'默认昵称'}}
			</view>
			<view class="customer_label">
				<u-rate  :activeColor="'#FF551D'"  :count="5" :value="customer_item.grade" readonly></u-rate>
			</view>
		</view>
		<view class="customer_claim">
			<view class="claim_item" v-if="!!customer_item.budget">
				{{customer_item.budget}}元
			</view>
			<view class="claim_item" v-if="customer_item.room_type==1">
				大单间
			</view>
			<view class="claim_item" v-if="customer_item.room_type==2">
				一房一厅
			</view>
			<view class="claim_item" v-if="customer_item.room_type==3">
				二房一厅
			</view>
			<view class="claim_item" v-if="customer_item.room_type==4">
				三房一厅
			</view>
			<view class="claim_item" v-if="customer_item.gender==1">
				男
			</view>
			<view class="claim_item" v-if="customer_item.gender==2">
				女
			</view>
			<view class="claim_item" >
				期望位置：{{customer_item.expect_area||'未知'}}
			</view>
		</view>
		<view class="customer_status" v-if="customer_item.status==1">
			待跟进
		</view>
		<view class="customer_status" v-if="customer_item.status==2">
			已租
		</view>
		<view class="customer_status" v-if="customer_item.status==3">
			无效
		</view>
		<view class="customer_content">
			<text class="label">跟进：</text>
			3天未跟进
		</view>
		<view class="customer_content" v-if="!!customer_item.remark" style="margin-top: 20rpx;">
			<text class="label">备注：</text>
			{{customer_item.remark}}
		</view>
		<!-- 底部操作按钮 -->
		<view class="customer_footer">
			<view class="follow_up">
				跟进
			</view>
			<view class="call_customer" @click.stop="call_phone(customer_item.phone)">
				拨打电话
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "customer_item",
		props:{
			customer_item:{
			  type: Object,
			  default: {}
			},
			type:{
				type:String,
				default:''
			}
		},
		data() {
			return {

			};
		},
		methods:{
			go_detail_customer(){
				uni.navigateTo({
					url:'/customer/detailCustomer/detailCustomer'
				})
			},
			call_phone(phone){
				if(!!phone){
					uni.makePhoneCall({
						phoneNumber:phone
					})
				}else {
					uni.showToast({
						title:'亲，您还未备注手机号呢！',
						icon:'none'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.customer_item {
		background: #fff;
		border-radius: 12rpx;
		min-height: 300rpx;
		margin-bottom: 20rpx;
		padding: 0 25rpx;
		overflow: auto;
		.customer_info {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 24rpx;
			padding-left: 4rpx;
	
			.customer_name {
				font-size: 28rpx;
				font-weight: bold;
				color: #2A2E34;
				margin-right: 20rpx;
			}
			.customer_label {
				
			}
		}
		.customer_claim {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			margin-top: 24rpx;
			padding-left: 4rpx;
			.claim_item {
				font-size: 24rpx;
				line-height: 42rpx;
				color: #7B8194;
				margin-right: 54rpx;
			}
		}
		.customer_status {
			padding-left: 4rpx;
			margin-top: 24rpx;
			width: 96rpx;
			height: 40rpx;
			background: #F4F5F9;
			border-radius: 6rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
			color: #7B8193;
		}
		.customer_content {
			padding-left: 4rpx;
			margin-top: 24rpx;
			font-size: 24rpx;
			color: #2A2E34;
			.label{
				color: #7B8194;
			}
		}
		.customer_footer {
			margin-top: 22rpx;
			height: 106rpx;
			border-top: 1px solid #eee;
			font-size: 26rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			.follow_up {
				width: 108rpx;
				height: 56rpx;
				border: 1px solid #3366FF;
				border-radius: 6rpx;
				text-align: center;
				line-height: 56rpx;
				color: #3366FF;
			}
			.call_customer {
				width: 160rpx;
				height: 56rpx;
				text-align: center;
				line-height: 56rpx;
				background: #3366FF;
				border-radius: 6rpx;
				color: #FFFFFF;
				margin-left: 20rpx;
			}
		}
	}
	

</style>
