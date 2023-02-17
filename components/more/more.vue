<!-- 公共空白页 -->
<template>
	<view>
		<view class="box">
			<scroll-view class="scroll-view_H" scroll-y="true">
				<view class="list" v-for="(item, index) in list" :key="index">
					<view class="list-title">{{ item.title }}</view>
					<view class="list-item">
						<view v-for="(itm, ink) in item.item" :key="ink" :class="itm.checked ? 'active' : ''" @click="onChecked(index, ink)">{{ itm.name }}</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'position',
	props: {
		
	},
	data() {
		return {
			list: [
				{
					title: '最短租期',
					item: [{ name: '1个月起', checked: false,id:'3' }, { name: '3个月起', checked: false,id:'2' }, { name: '半年起租', checked: false,id:'0' }, { name: '一年起租', checked: false,id:'1' }]
				},
				{
					title: '租客要求',
					item: [{ name: '可住小孩', checked: false,id:'is_child' }, { name: '可住孕妇', checked: false,id:'is_gravida' },  { name: '可住外国友人', checked: false,id:'is_foreigners' },{ name: '可养小猫', checked: false,id:'is_cat' },{ name: '可养小狗', checked: false,id:'is_dog' },{ name: '可停车', checked: false,id:'is_parking' }]
				}
			],
			more_one_select_arr:[],
			more_two_select_arr:[]
		};
	},
	watch: {},
	created() {
		if(this.$parent.more_one_select_arr.length>0){
			this.$parent.more_one_select_arr.forEach(item=>{
				this.list[0].item.forEach(key=>{
					if(item==key.id){
						key.checked = true
					}
				})
			})
		}
		if(this.$parent.more_two_select_arr.length>0){
			this.$parent.more_two_select_arr.forEach(item=>{
				this.list[1].item.forEach(key=>{
					if(item==key.id){
						key.checked = true
					}
				})
			})
		}
		
	},
	methods: {
		onChecked(index, ink) {
			this.list[index].item[ink].checked = !this.list[index].item[ink].checked;
			if(index==0){
				let more_one_select_arr = [];
			    this.list[index].item.forEach(item=>{
					if(!!item.checked){
						more_one_select_arr.push(item.id)
					}
				})
				this.more_one_select_arr = more_one_select_arr
			}
			if(index==1){
				let more_two_select_arr = [];
			    this.list[index].item.forEach(item=>{
					if(!!item.checked){
						more_two_select_arr.push(item.id)
					}
				})
				this.more_two_select_arr = more_two_select_arr
			}
		}
	},
	mounted() {}
};
</script>
<style scoped lang="less">
.box {
	background: #fff;
	height: 600rpx;
	.scroll-view_H {
		height: 100%;
		.list {
			margin-top: 34rpx;
			.list-title {
				font-size: 26rpx;
				padding-left: 28rpx;
				box-sizing: border-box;
			}
			.list-item {
				display: flex;
				flex-flow: row wrap;
				justify-content: flex-start;
				padding: 0 18rpx 0 28rpx;
				box-sizing: border-box;
				view {
					margin-top: 25rpx;
					margin-left: 21rpx;
					width: 154rpx;
					height: 58rpx;
					font-size: 25rpx;
					background-color: #f6f6f6;
					border-radius: 5rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
	}
}
.active {
	background-color: #ecf0fc !important;
	color: #3366ff;
}
</style>
