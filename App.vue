<script>
	export default {
		//全局变量
		globalData: {
			apiUrl: 'https://api.yhb816.com',
			static_url: 'https://img.yhb816.com'
		},
		onLaunch: function() {
			// 是否判断登录
			wx.checkSession({
				success: () => {
					//没用到token可以直接忽略以下步骤:
					if (this.vuex_token) {
						this.$isResolve();
					} else {
						//
						this.wxLogin();
					}
				},
				fail: () => {
					console.log('fail');
					this.wxLogin();
				}
			});
			// 程序一进来需要先拿到用户当前位置经纬度 存入本地缓存
			this.getCurrentLocation();
		},
		onShow: function() {
			var self = this
			// 获取小程序更新机制兼容
			if (uni.canIUse('getUpdateManager')) {
				var updateManager = uni.getUpdateManager()
				//1. 检查小程序是否有新版本发布
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					if (res.hasUpdate) {
						//检测到新版本，需要更新，给出提示
						uni.showModal({
							title: '更新提示',
							showCancel: false, //隐藏取消按钮
							confirmText: "确定更新", //只保留确定更新按钮
							content: '检测到新版本，是否下载新版本并重启小程序？',
							success: function(res) {
								if (res.confirm) {
									//2. 用户确定下载更新小程序，小程序下载及更新静默进行
									self.downLoadAndUpdate(updateManager)
								} else if (res.cancel) {
									//用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
									uni.showModal({
										title: '温馨提示~',
										content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
										showCancel: false, //隐藏取消按钮
										confirmText: "确定更新", //只保留确定更新按钮
										success: function(res) {
											if (res.confirm) {
												//下载新版本，并重新应用
												self.downLoadAndUpdate(updateManager)
											}
										}
									})
								}
							}
						})
					}
				})
			} else {
				// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
				uni.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				})
			}
		},
		onHide: function() {},
		methods: {
			/**
			 * 下载小程序新版本并重启应用
			 */
			downLoadAndUpdate: function(updateManager) {
				var self = this
				//静默下载更新小程序新版本
				updateManager.onUpdateReady(function() {
					//新的版本已经下载好，调用 applyUpdate 应用新版本并重启
					updateManager.applyUpdate();
				})
				updateManager.onUpdateFailed(function() {
					// 新的版本下载失败
					uni.showModal({
						title: '已经有新版本了哟~',
						content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
					})
				})
			},
			getCurrentLocation() {
				let _this = this;
				//检测用户是否授权
				uni.authorize({
					scope: 'scope.userLocation',
					success() {
						uni.getLocation({
							type: 'gcj02',
							success: function(res) {
								let current_location = {
									lat: res.latitude,
									lng: res.longitude
								};
								_this.$u.vuex('vuex_current_location', current_location);
							},
							fail() {
								uni.showModal({
									showCancel: false,
									title: '温馨提示',
									content: '请检查微信是否允许定位'
								});
							}
						});
					},
					fail(res) {
						uni.showModal({
							title: '温馨提示',
							content: '您未开启定位授权，请开启',
							showCancel: false,
							confirmText: '好的',
							success(result) {
								if (!!result.confirm) {
									uni.openSetting({
										success(response) {
											uni.getLocation({
												type: 'gcj02',
												success: function(res) {
													let current_location = {
														lat: res.latitude,
														lng: res.longitude
													};
													_this.$u.vuex(
														'vuex_current_location',
														current_location);
												},
												fail() {
													uni.showModal({
														showCancel: false,
														title: '温馨提示',
														content: '请检查微信是否允许定位'
													});
												}
											});
										}
									});
								}
							}
						});
					}
				});
			},
			wxLogin() {
				let _this = this;
				uni.login({
					success: res => {
						uni.$u.http
							.post('/common/customer/wxlogin', {
								code: res.code
							}, {
								custom: {
									auth: true,
									toast: false,
									catch: true
								}
							})
							.then(res => {
								let loginData = res;
								_this.$u.vuex('vuex_token', loginData.lwm_sess_token);
								_this.$u.vuex('vuex_isBind', loginData.is_blind);
								_this.$isResolve();
							})
							.catch(() => {
								_this.$isResolve();
							});
					}
				});
			},
			is_bind_phone() {
				if (this.$vm.vuex_isBind != 1) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
			}

		}
	};
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import '@/uni_modules/uview-ui/index.scss';
	@import '@/uni_modules/uview-ui/libs/css/flex.scss';
	@import 'colorui/main.css';
	@import '@/static/css/iconfont.css';

	// @import 'colorui/icon.css';
	page {
		background: #f4f5f9;
		font-family: 'Source Han Sans CN';
	}

	.font_size20 {
		font-size: 20rpx;
	}

	.font_size22 {
		font-size: 22rpx;
	}

	.font_size24 {
		font-size: 24rpx;
	}

	.font_size26 {
		font-size: 26rpx;
	}

	.font_size28 {
		font-size: 28rpx;
	}

	.font_size30 {
		font-size: 30rpx;
	}

	.font_size32 {
		font-size: 32rpx;
	}

	.font_size34 {
		font-size: 34rpx;
	}

	.font_size36 {
		font-size: 36rpx;
	}

	.font_size38 {
		font-size: 38rpx;
	}

	.font_size40 {
		font-size: 40rpx;
	}

	.font_size42 {
		font-size: 42rpx;
	}

	.font_weight_normal {
		font-weight: normal;
	}

	.font_weight_middle {
		font-weight: 500;
	}

	.font_weight_bold {
		font-weight: bold;
	}

	// 主要颜色
	.main_color_blue {
		color: #3366ff;
	}

	.main_color_change {
		background: linear-gradient(to left right #4494fd, #3366ff);
		-webkit-background-clip: text;
		color: transparent;
	}

	.main_color_orange {
		color: #ff551d;
	}

	.main_color_indigo {
		color: #7bbf8a;
	}

	.main_title_color {
		color: #2a2e34;
	}

	.second_title_color {
		color: #7b8193;
	}

	.assist_title_color {
		color: #d0d0dc;
	}

	.main_bg_color {
		background: #f4f5f9;
	}

	.mian_bg_title {
		background-color: #3366ff;
	}

	.bg_colorfff {
		background: #ffffff;
	}

	.border_radius12 {
		border-radius: 12rpx;
	}

	.box_flex_row_center {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tabbar_placeholder {
		height: 100rpx;
	}
</style>
