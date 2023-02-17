<template>
	<view class="self_customer">
		<view class="self_customer_top">
			<view class="customer_search">
				<u-search shape="square" placeholder="请输入搜索关键字"></u-search>
			</view>
			<view class="customer_filter">
				<view class="customer_filter_item" v-for="(item,index) in filter_arr" :key="item.type">
					<fui-dropdown-menu :size="28" :minWidth="324" selectedColor="#465CFF" isCheckMark
						checkmarkColor="#465CFF" :options="item.options" @click="rangeItemClick(index,$event)"
						@close="rangeClose(index)" :ref="item.type">
						<view class="fui-filter__item" @tap="filterTap(index)">
							<text>{{item.range}}</text>
							<view class="fui-filter__icon" :class="{'fui-icon__ani':item.rangeShow}">
								<fui-icon name="arrowdown" :size="20"></fui-icon>
							</view>
						</view>
					</fui-dropdown-menu>
				</view>

			</view>
		</view>
		<view class="self_customer_bottom">
			<scroll-view scroll-y="true" :refresher-enabled="isOpenRefresh" :refresher-triggered="isTriggered"
				scroll-anchoring="true" @refresherpulling="onPulling" @refresherrefresh="onRefresh"
				@refresherrestore="onRestore" @refresherabort="onAbort" class="self_customer_scroll">
				<customer_item ></customer_item>
				<!-- 加载状态 -->
				<view class="loading_box">
					<u-loadmore :status="status" />
				</view>
			</scroll-view>
			<view class="no_customer" v-if="false">
				<u-empty mode="data" textSize="'24rpx'" text="暂无数据" icon="/static/image/login_error.png">
				</u-empty>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				filter_arr: [{
						options: [{
							text: '综合推荐',
							value: 1
						}, {
							text: '新品优先',
							value: 2
						}, {
							text: '评论数从高到低',
							value: 3
						}, ],
						range: '意向类型',
						rangeShow: false,
						type: 'intentiontype'
					},
					{
						options: [{
							text: '综合推荐',
							value: 1
						}, {
							text: '新品优先',
							value: 2
						}, {
							text: '评论数从高到低',
							value: 3
						}, ],
						range: '入住时间',
						rangeShow: false,
						type: "checktime"
					},
					{
						options: [{
							text: '综合推荐',
							value: 1
						}, {
							text: '新品优先',
							value: 2
						}, {
							text: '评论数从高到低',
							value: 3
						}, ],
						range: '状态',
						rangeShow: false,
						type: "status"
					},
					{
						options: [{
							text: '综合推荐',
							value: 1
						}, {
							text: '新品优先',
							value: 2
						}, {
							text: '评论数从高到低',
							value: 3
						}, ],
						range: '排序',
						rangeShow: false,
						type: 'sort'
					}
				],
				status: 'loading',
				isTriggered: false,
				isOpenRefresh: true
			};
		},
		onLoad() {
			this._freshing = false;
			//this.getData()
		},
		methods: {
			
			addCustomer(){
				uni.navigateTo({
					url:'/customer/addCustomer/addCustomer'
				})
			},
			filterTap(index) {
				//显示下拉框
				let refName = this.filter_arr[index].type
				this.$refs[refName][0].show()
				this.filter_arr[index].rangeShow = true;
			},
			rangeItemClick(index, event) {
				this.filter_arr[index].range = event.text
				this.rangeClose(index)
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
				setTimeout(() => {
					this.isTriggered = false;
					this._freshing = false;
				}, 500);
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
			padding:0 20rpx;

			.self_customer_scroll {
				height: 100%;
				.loading_box {
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
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
			background: #3366FF;
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
		color: #7B8193;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		background-color: #fff;
	}

	.fui-filter__icon {
		transition: all .15s linear;
	}

	.fui-icon__ani {
		transform: rotate(180deg);
	}
</style>
