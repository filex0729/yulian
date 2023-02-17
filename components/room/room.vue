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
	props: {},
	data() {
		return {
			room_select_arr:[],
			list: [
				{
					title: '整租户型',
					item: [
						{ name: '单间', checked: false,id:'is_single_room' },
						{ name: '一房一厅', checked: false,id:'is_one_room' },
						{ name: '2居', checked: false ,id:'is_two_room'},
						{ name: '3居', checked: false ,id:'is_three_room'},
						{ name: '4居', checked: false ,id:'is_four_room'},
						{ name: '5居+', checked: false ,id:'is_five_room'}
					]
				}
			]
		};
	},
	watch: {},
	created() {
		if(this.$parent.room_select_arr.length>0){
			this.$parent.room_select_arr.forEach(item=>{
				this.list[0].item.forEach(key=>{
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
				let room_select_arr = [];
			    this.list[index].item.forEach(item=>{
					if(!!item.checked){
						room_select_arr.push(item.id)
					}
				})
				this.room_select_arr = room_select_arr
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
