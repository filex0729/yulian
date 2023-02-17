<template>
	<view class="loading_page">
		<u-loading-page :loading="show_loading" ></u-loading-page>
	</view>
</template>

<script>
	export default {
		name:"loading_page",
		data() {
			return {
				show_loading:true
				
			};
		},
		methods:{
			show(){
				this.show_loading = true
			},
			hide(){
				this.show_loading = false
			}
		}
	}
</script>

<style lang="scss">
.loading_page {
	position: fixed;
	z-index: 10;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
}
</style>