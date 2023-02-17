<template>
	<view v-if="vuex_isBind == 1" class="self_customer">
		<view class="self_customer_top">
			<view class="customer_search"><u-search shape="square" placeholder="请输入搜索关键字"></u-search></view>
			<view class="customer_filter">
				<view class="customer_filter_item" v-for="(item, index) in filter_arr" :key="item.type">
					<fui-dropdown-menu
						:size="28"
						:minWidth="324"
						selectedColor="#465CFF"
						isCheckMark
						checkmarkColor="#465CFF"
						:options="item.options"
						@click="rangeItemClick(index, $event)"
						@close="rangeClose(index)"
						:ref="item.type"
					>
						<view class="fui-filter__item" @tap="filterTap(index)">
							<text>{{ item.range }}</text>
							<view class="fui-filter__icon" :class="{ 'fui-icon__ani': item.rangeShow }"><fui-icon name="arrowdown" :size="20"></fui-icon></view>
						</view>
					</fui-dropdown-menu>
				</view>
			</view>
		</view>
		<view class="self_customer_bottom">
			<scroll-view
				scroll-y="true"
				v-if="customer_data.length > 0"
				:refresher-enabled="isOpenRefresh"
				:refresher-triggered="isTriggered"
				scroll-anchoring="true"
				lower-threshold="100"
				@refresherpulling="onPulling"
				@refresherrefresh="onRefresh"
				@refresherrestore="onRestore"
				@refresherabort="onAbort"
				@scrolltolower="loading_data"
				class="self_customer_scroll"
			>
				<template v-for="item in customer_data">
					<customer_item :key="item.id" :customer_item="item" :type="'customer'"></customer_item>
				</template>

				<!-- 加载状态 -->
				<view class="loading_box"><u-loadmore :status="status" /></view>
			</scroll-view>
			<view class="no_customer" v-else><u-empty mode="data" textSize="'24rpx'" text="暂无客户数据" icon="/static/image/login_error.png"></u-empty></view>
		</view>
		<view class="add_customer" @tap="$u.throttle(addCustomer, 500)"><fui-icon name="plus" :size="80" color="#fff"></fui-icon></view>
		<u-loading-page :loading="is_loading" loading-text="加载中"></u-loading-page>
	</view>
	<login_error v-else></login_error>
</template>

<script>
import { customerList } from '@/config/api.js';
export default {
	data() {
		return {
			filter_arr: [
				{
					options: [
						{
							text: '大单间',
							value: 1
						},
						{
							text: '一房一厅',
							value: 2
						},
						{
							text: '二房一厅',
							value: 3
						},
						{
							text: '三房一厅',
							value: 4
						}
					],
					range: '户型',
					rangeShow: false,
					type: 'room_type'
				},
				{
					options: [
						{
							text: '五星',
							value: 5
						},
						{
							text: '四星',
							value: 4
						},
						{
							text: '三星',
							value: 3
						},{
							text: '二星',
							value: 2
						},
						{
							text: '一星',
							value: 1
						}
					],
					range: '星级',
					rangeShow: false,
					type: 'grade'
				},
				{
					options: [
						{
							text: '更新时间(从近到远)',
							value: 1
						},
						{
							text: '更新时间(从远到近)',
							value: 2
						}
					],
					range: '排序',
					rangeShow: false,
					type: 'sort'
				}
			],
			status: 'loading',
			isTriggered: false,
			isOpenRefresh: true,
			customer_data: [],
			is_loading: true,
			page:1
		};
	},
	onLoad() {
		this._freshing = false;
		if (this.vuex_isBind == 1) {
			uni.$on('refresh_data', data => {
				this.page = 1;
				this.getCustomerList();
			});
			this.getCustomerList();
		}
	},
	onUnload() {
		// 移除监听事件
		uni.$off('refresh_data');
	},
	methods: {
		loading_data(){
			if(this.status=='nomore'){
				return;
			}
			this.page++;
			this.getCustomerList()
			
		},
		async getCustomerList(type) {
			uni.showLoading({
				mask: true,
				title: '加载中'
			});
			let params = {
				page:this.page
			}
			let customer_data = await customerList(params);
			if (type == 'onRefresh') {
				this.isTriggered = false;
				this._freshing = false;
			}
			if (!!this.is_loading) {
				this.is_loading = false;
			}
			if (!!customer_data.info) {
				uni.hideLoading();
				if(customer_data.info.length<20){
					this.status = 'nomore';
				}
				if(this.page==1){
					this.customer_data = customer_data.info;
				}else{
					this.customer_data = this.customer_data.concat(customer_data.info);
				}
				
			}
		},
		addCustomer() {
			uni.navigateTo({
				url: '/customer/addCustomer/addCustomer'
			});
		},
		filterTap(index) {
			//显示下拉框
			let refName = this.filter_arr[index].type;
			this.$refs[refName][0].show();
			this.filter_arr[index].rangeShow = true;
		},
		rangeItemClick(index, event) {
			this.filter_arr[index].range = event.text;
			this.rangeClose(index);
		},
		rangeClose(index) {
			this.filter_arr[index].rangeShow = false;
		},
		onPulling(e) {
			if (e.detail.deltaY < 0) return; // 防止上滑页面也触发下拉
			this.isTriggered = true;
		},

		// 自定义下拉刷新被触发
		onRefresh() {
			if (this._freshing) return;
			this._freshing = true;
			// 刷新楼栋接口
			this.page = 1;
			this.status = 'loading';
			this.getCustomerList('onRefresh');
		},
		// 自定义下拉刷新被复位
		onRestore() {
			this.isTriggered = 'restore'; // 需要重置
		}
	}
};
</script>

<style lang="scss" scoped>
.self_customer {
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;

	.self_customer_top {
		height: 154rpx;
		background: #fff;
		flex-shrink: 0;

		.customer_search {
			padding: 0 30rpx;
		}

		.customer_filter {
			padding: 0 30rpx;
			display: flex;
			align-items: center;

			.customer_filter_item {
				flex: 1;
			}
		}
	}

	.self_customer_bottom {
		flex: 1;
		overflow: hidden;
		padding:  20rpx;

		.self_customer_scroll {
			height: 100%;
			.loading_box {
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.no_customer {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.add_customer {
		position: fixed;
		right: 50rpx;
		bottom: 240rpx;
		width: 100rpx;
		height: 100rpx;
		background: #3366ff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}

.fui-filter__item {
	width: 100%;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	color: #7b8193;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
	background-color: #fff;
}

.fui-filter__icon {
	transition: all 0.15s linear;
}

.fui-icon__ani {
	transform: rotate(180deg);
}
</style>
