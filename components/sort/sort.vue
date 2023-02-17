<template>
	<view class="sort_box">
		<view class="sort_box_item" v-for="(item,index) in sort_list"  :key="item.name" @click.stop="change_sort(index)">
			<view class="sort_box_item_title" :class="item.checked ? 'active' : ''">
				{{item.name}}
			</view>
			<view class="sort_box_item_icon">
				<u-icon v-if="!!item.checked" name="checkmark" color="#3366FF" size="32rpx"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"sort",
		data() {
			return {
				sort_list:[
					{
						name:'默认排序',
						checked:false,
					},
					{
						name:'跟进日期(从近到远)',
						checked:false
					},
					{
						name:'跟进日期(从远到近)',
						checked:false
					},
					{
						name:'价格(从低到高)',
						checked:false
					},
					{
						name:'价格(从高到低)',
						checked:false
					},
				]
				
			};
		},
		created() {
			this.sort_list[this.$parent.sort_index].checked=true;
			
		},
		methods:{
			change_sort(index){
				this.sort_list.forEach(item=>{
					item .checked = false
				})
				this.sort_list[index].checked= true;
				// this.$parent.tabindex = -1;
				this.$parent.popshow = false;
				this.$parent.sort_index = index;
				console.log(this.$parent,'this.$parent')
				this.$parent.submit_filter();
			}
		}
	}
</script>

<style scoped>
	.sort_box {
		padding: 0 30rpx;
		padding-bottom: 30rpx;
		overflow: auto;
		background: #fff;
		
	}
	.sort_box_item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 40rpx;
	}
	.sort_box_item_title {
		font-size: 28rpx;
	}
	.active{
		color: #3366FF;
	}

</style>