<template>
	<view class="tabbar_box">
		<view class="cu-bar tabbar  bg-white">
			<view class="action " :class="{ 'add-action': index == 2 }" v-for="(item, index) in tabbar" :key="index" @tap="changeTab(item)">
				<view class="cuIcon-cu-image"><image :src="item.pagePath == currentpage ? item.selectedIconPath : item.iconPath"></image></view>
				<view class="text-green" v-if="index != 2" :style="{ color: item.pagePath == currentpage ? '#3366FF' : '#7B8193' }">{{ item.text }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'tabbar',
	data() {
		return {
			currentpage:getCurrentPages()[0].route,
			page:'',
			tabbar: [
				{
					pagePath: 'pages/index/index',
					iconPath: '/static/image/tabbar/home.png',
					selectedIconPath: '/static/image/tabbar/home_on.png',
					text: '首页'
				},
				{
					pagePath: 'pages/house/house',
					iconPath: '/static/image/tabbar/searchhouse.png',
					selectedIconPath: '/static/image/tabbar/searchhouse_on2.png',
					text: '找房'
				},
				{
					pagePath: 'pages/add_house/add_house',
					iconPath: '/static/image/tabbar/add.png',
					selectedIconPath: '/static/image/tabbar/add.png',
					text: '发布'
				},
				{
					pagePath: 'pages/deal/deal',
					iconPath: '/static/image/tabbar/order.png',
					selectedIconPath: '/static/image/tabbar/order_on.png',
					text: '成交'
				},
				{
					pagePath: 'pages/personal/personal',
					iconPath: '/static/image/tabbar/personal.png',
					selectedIconPath: '/static/image/tabbar/personal_on2.png',
					text: '我的'
				}
			]
		};
	},
	methods: {
		changeTab(item) {
			getApp().is_bind_phone();
			this.page = item.pagePath;
			// 使用reLaunch关闭所有的页面，打开新的栏目页面
			// console.log(item.pagePath)
			// console.log(this.page)
			if(this.page==this.currentpage){
				return;
			}
			if(this.page=="pages/add_house/add_house"){
				uni.navigateTo({
					url:'/pages/createRoom/createRoom'
				})
			}else{
				uni.switchTab({
					url: '/' + this.page
				});
			}
			
		}
	}
};
</script>

<style>
.tabbar_box {
	width: 100vw;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 100;
	background: #fff;
	box-shadow: 0px -2rpx 6rpx rgba(0, 0, 0, 0.08);
}
</style>
