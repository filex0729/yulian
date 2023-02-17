<template>
	<view class="customer_detail">
		<view class="customer_info">
			<view class="customer_info_top">
				<view class="customer_info_top_left">
					<view class="name main_title_color font_size32 font_weight_bold">某某某</view>
					<view class="check_in_time">3天内入住</view>
				</view>
				<view class="customer_info_top_right">
					<u-icon name="edit-pen-fill" color="#7B8193 " :size="'44rpx'"></u-icon>
					<view class="font_size24 second_title_color">编辑</view>
				</view>
			</view>
			<view class="customer_info_content">
				<view class="label font_size26 second_title_color">手机:</view>
				<view class="content font_size26 font_weight_bold main_title_color">134511223000</view>
				<view class="copy_btn">
					<image src="/static/copy_img.png"></image>
					<text class="font_size24 second_title_color">复制</text>
				</view>
			</view>
		</view>
		<u-sticky :offset-top="0">
			<view class="customer_tabs">
				<u-tabs :list="tab_list" lineColor="#3366FF" @click="toggle_tab"
					:activeStyle="{ color: '#3366FF', fontWeight: '700' }"
					:inactiveStyle="{ color: '#2A2E34', fontWeight: '700' }" :itemStyle="{ height: '86rpx' }"
					:scrollable="fasle"></u-tabs>
			</view>
		</u-sticky>

		<!-- 意向信息 -->
		<view class="intention_info" v-if="tab_currentIndex==0">
			<view class="intention_info_item" v-for="(item, index) in intention_info_list" :key="item.label">
				<view class="label font_size26 second_title_color ">{{ item.label }}</view>
				<view class="content font_size28 font_weight_bold main_title_color">{{ item.content }}</view>
			</view>
			<view class="edit_box">
				<u-icon name="edit-pen-fill" color="#7B8193 " :size="'44rpx'"></u-icon>
				<view class="font_size24 second_title_color">编辑</view>
			</view>
		</view>
		<block v-if="tab_currentIndex==2">
			<view class="intention_info">
				<view class="intention_info_title">
					跟进记录(1)
				</view>
				<view class="intention_info_item" v-for="(item, index) in intention_info_list" :key="item.label">
					<view class="label font_size26 second_title_color ">{{ item.label }}</view>
					<view class="content font_size28 font_weight_bold main_title_color">{{ item.content }}</view>
				</view>
			</view>
		</block>

		<!-- 底部占位区域 -->
		<view class="footer_placeholder"></view>
		<!-- 录入约看 和 带看记录 -->
		<u-overlay :show="show_history" @click="show_history = false">
			<view class="history_box">
				<view class="history_btn appointment_btn">录入约看</view>
				<view class="history_btn show_btn">录入带看</view>
			</view>
		</u-overlay>
		<!-- 底部操作区域 -->
		<view class="footer_box">
			<view class="footer_box_item" v-for="(footer, index) in footer_btn_list" @tap.stop="footer_click(footer)"
				:key="footer.type">
				<image :src="footer.icon"></image>
				<view class="font_size24 second_title_color">{{ footer.text }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tab_currentIndex: 0,
				show_history: false,
				footer_btn_list: [{
						icon: '/static/customer_edit.png',
						text: '改状态',
						type: 'change_status'
					},
					{
						icon: '/static/customer_sharing.png',
						text: '立即派单',
						type: 'dispatch'
					},
					{
						icon: '/static/customer_more.png',
						text: '更多',
						type: 'more'
					},
					{
						icon: '/static/customer_write.png',
						text: '写跟进',
						type: 'write_follow'
					},
					{
						icon: '/static/customer_phone.png',
						text: '联系租客',
						type: 'contact'
					}
				],
				current_index: 0,
				intention_info_list: [{
						label: '房源类型:',
						content: '租房/整租，合租'
					},
					{
						label: '求租人数:',
						content: '3人'
					},
					{
						label: '价格:',
						content: '1000-3000元'
					},
					{
						label: '面积:',
						content: '50-80㎡'
					},
					{
						label: '期望片区:',
						content: '白石洲'
					},
					{
						label: '地铁站:',
						content: '1号线白石洲'
					},
					{
						label: '办公地点:',
						content: '高新园'
					},
					{
						label: '通勤工具:',
						content: '自己开车'
					},
					{
						label: '最早入住:',
						content: '2022-12-19'
					},
					{
						label: '看房时间:',
						content: '随时看房'
					},
					{
						label: '付款方式:',
						content: '押一付一'
					},
					{
						label: '月收入:',
						content: '押一付一'
					},
					{
						label: '月收入:',
						content: '1w到3w'
					},
					{
						label: '中介费:',
						content: '接受'
					},
					{
						label: '备注:',
						content: '不可住老人，不可住小孩，不可住孕妇， 不可养宠物'
					}
				],
				tab_list: [{
						name: '意向',
						type: 'intention'
					},
					{
						name: '跟进',
						type: 'follow',
						badge: {
							value: 3
						}
					},
					{
						name: '约看记录',
						type: 'appointment',
						badge: {
							value: 0
						}
					},
					{
						name: '带看记录',
						type: 'show'
					}
				],

			};
		},
		methods: {
			toggle_tab(event) {
				console.log(event, '打发斯蒂芬');
				if (this.tab_currentIndex == event.index) {
					return
				}
				this.tab_currentIndex = event.index;
			},
			footer_click(item) {

				if (item.type == 'more') {  //更多
					this.show_history = !this.show_history;
				} else {
					this.show_history = false
				}
				if(item.type == 'write_follow'){
					uni.navigateTo({
						url:'/customer/write_record/write_record?type='+item.type
					})
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.customer_detail {
		.customer_info {
			margin-top: 20rpx;
			padding: 20rpx 30rpx;
			padding-bottom: 50rpx;
			background: #fff;

			.customer_info_top {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.customer_info_top_left {
					display: flex;
					align-items: center;

					.check_in_time {
						width: 186rpx;
						height: 48rpx;
						border: 1px solid #3366ff;
						border-radius: 6rpx;
						font-size: 26rpx;
						line-height: 48rpx;
						text-align: center;
						color: #3366ff;
						margin-left: 34rpx;
					}
				}

				.customer_info_top_right {
					display: flex;
					align-items: center;
				}
			}

			.customer_info_content {
				display: flex;
				align-items: center;
				margin-top: 26rpx;

				.content {
					margin-left: 26rpx;
				}

				.copy_btn {
					margin-left: 30rpx;
					display: flex;
					align-items: center;

					image {
						width: 26rpx;
						height: 26rpx;
						margin-right: 6rpx;
					}
				}
			}
		}

		.customer_tabs {
			margin-top: 20rpx;
			height: 86rpx;
			background: #fff;
			border-bottom: 1px solid #eee;
			padding-right: 20rpx;
			box-sizing: border-box;
		}

		.intention_info {
			padding: 40rpx 30rpx;
			background: #fff;
			position: relative;
			.intention_info_title{
				font-size: 26rpx;
				font-family: Source Han Sans CN;
				font-weight: bold;
				color: #2A2E34;
				margin-bottom: 24rpx;
			}

			.edit_box {
				position: absolute;
				right: 45rpx;
				top: 40rpx;
				display: flex;
				align-items: center;
			}

			.intention_info_item {
				margin-bottom: 30rpx;
				display: flex;
				align-items: baseline;

				.label {
					width: 150rpx;
				}
			}
		}
       
		.footer_placeholder {
			height: calc(140rpx + env(safe-area-inset-bottom) / 2);
		}

		.footer_box {
			position: fixed;
			right: 0;
			left: 0;
			bottom: 0;
			padding: 0 20rpx;
			height: calc(140rpx + env(safe-area-inset-bottom) / 2);
			padding-bottom: calc(env(safe-area-inset-bottom) / 2);
			background: #fff;
			display: flex;
			align-items: center;
			justify-content: space-around;
			border: 1px solid #eeeeee;
			box-shadow: 0px -3rpx 6rpx rgba(0, 0, 0, 0.16);
			box-sizing: border-box;
			z-index: 10071;

			.footer_box_item {
				flex: 1;
				text-align: center;

				image {
					width: 36rpx;
					height: 36rpx;
					margin-bottom: 10rpx;
				}
			}
		}

		.history_box {
			position: fixed;
			z-index: 10071;
			left: 0;
			right: 0;
			bottom: calc(160rpx + env(safe-area-inset-bottom) / 2);
			display: flex;
			flex-direction: column;
			align-items: center;

			.history_btn {
				width: 350rpx;
				height: 80rpx;
				border-radius: 6rpx;
				background: #fff;
				font-size: 28rpx;
				color: #3366ff;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 30rpx;
			}
		}
	}
</style>
