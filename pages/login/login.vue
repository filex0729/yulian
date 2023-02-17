<template>
	<view class="login_wrapper">
		<image class="login_icon" src="../../static/image/yulian-logo@2x.png" mode=""></image>
		<view class="main_title_color font_size28">
			亲爱的寓联小伙伴
			<br />
			请先登录，才能体验完整的服务哦~
		</view>
		<view class="">
			<button class="login_btn mian_bg_title  font_size32" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber" >登录</button>
		</view>
	</view>
</template>

<script>
	import {bindPhone} from '@/config/api.js';
export default {
	data() {
		return {};
	},
	onShow() {
		
	},
	methods: {
		async decryptPhoneNumber(res){
			if(res.detail.errMsg=="getPhoneNumber:ok"){
				let params  = {
					code:res.detail.code,
					lwm_sess_token:this.vuex_token
				}
				let bindData = await bindPhone(params);
				if(!!bindData.lwm_sess_token){
					this.$u.vuex('vuex_token', bindData.lwm_sess_token)
					this.$u.vuex('vuex_isBind', bindData.is_blind);
					uni.showToast({
						title:'登录成功',
						icon:'none',
						duration:1500,
						success() {
							uni.navigateBack()
						}
					})
				}
				
			}
		},
	}
};
</script>

<style lang="scss" scoped>
.login_wrapper {
	min-height: 100vh;
	background-color: #fff;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	overflow: hidden;
}
.login_icon {
	width: 300rpx;
	height: 300rpx;
	margin-top: 65rpx;
	margin-bottom: 10rpx;
}
.login_btn {
	width: 400rpx;
	height: 88rpx;
	color: #fff;
	margin-top: 64rpx;
}
.tips {
	margin-top: 24rpx;
}

</style>
