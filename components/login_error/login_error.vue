<template>
	<view class="login_error">
		<u-empty mode="data"  textSize="'24rpx'" text="暂无数据,　查看更多数据请在'我的'页面登录后查看!"
			icon="/static/image/login_error.png">
		</u-empty>
	</view>
</template>

<script>
	export default {
		name:"login_error",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.login_error{
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

</style>