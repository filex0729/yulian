<template>
	<view class="personal_wrapper">
		<view class="personal_head" @tap="go_login">
			<view class="personal_head_left"><open-data type="userAvatarUrl"></open-data></view>
			<view class="personal_head_right">
				<open-data  class="title font_size42 font_weight_bold" type="userNickName"></open-data>
				<view class="intro font_size28">{{vuex_isBind==1?'已登录，快去体验吧':'登录后可享受更多资源'}}</view>
			</view>
		</view>
		
		<!-- <view class="phone_box" v-if="!vuex_phone">
			<u--input
			    placeholder="请输入手机号"
			    border="surround"
			    v-model="phone"
			  ></u--input>
			  <u-button type="primary" text="登录" @click="submit_phone"></u-button>
		</view> -->
		<!-- <view class="personal_content">
			<u-cell-group :border="false" :customStyle="{'padding':0}">
				<u-cell :customStyle="{'padding':0}"  icon="star" center :iconStyle="{color:'#3366FF',fontSize:'50rpx'}" :titleStyle="{fontSize:'32rpx',color:'#7B8193 '}" isLink :border="false" title="收藏房源" ></u-cell>
			</u-cell-group>
		</view> -->
		<tabbar></tabbar>
	</view>
</template>

<script>
	import { phoneLogin } from '@/config/api.js';
export default {
	
	data() {
		return {
			phone:''
		};
	},
	methods: {
		go_login(){
			if(this.vuex_isBind!=1){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			}
			
		},
		async submit_phone(){
			let params = {
				phone:this.phone
			}
			let loginData = await phoneLogin(params)
			if(loginData.status=="success"){
				this.$u.vuex('vuex_token', loginData.data.sess_token);
				this.$u.vuex('vuex_employee_id', loginData.data.employee_id);
				this.$u.vuex('vuex_phone', loginData.data.phone);
				uni.showToast({
					icon:'none',
					title:"登录成功"
				})
			}else {
				uni.showToast({
					icon:'none',
					title:loginData.status
				})
			}
		}
	}
};
</script>

<style scoped>
.personal_head {
	padding: 0 80rpx;
	height: 332rpx;
	display: flex;
	align-items: center;
	background: #3366ff;
}
.personal_head_left {
	width: 120rpx;
	height: 120rpx;
	background: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	margin-right: 40rpx;
}
.personal_head_left image {
	width: 80rpx;
	height: 80rpx;
}
.personal_head_right {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	color: #fff;
	height: 120rpx;
}
.personal_content {
	padding: 80rpx 20rpx;
}
</style>
