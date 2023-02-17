<template>
	<view class="tabar_placeholder">
		
	</view>
</template>

<script>
	export default {
		name:"tabar_placeholder",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
	.tabar_placeholder {
		height: calc(120rpx + env(safe-area-inset-bottom) / 2);
		padding-bottom: calc(env(safe-area-inset-bottom) / 2);
	}

</style>