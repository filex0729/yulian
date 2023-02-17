<template>
	<view class="multiple_box">
		<view class="multiple_item"   @tap.native.stop="select_all">
			<view class="check_box_item_title" :style="{color:!!all_select?'#3366ff':'#666'}">
				全选
			</view>
			<image  v-if="!all_select" src="../../static/checkedF.png" mode=""></image>
			<image v-else  src="../../static/checkedT.png" mode=""></image>
		</view>
		<view class="multiple_item"  v-for="(item,index) in list" :key="index" @tap.native.stop="change_select(index)">
			<view class="check_box_item_title" :style="{color:!!item.is_click?'#3366ff':'#666'}">
				{{item.label}}
			</view>
			<image  v-if="!item.is_click" src="../../static/checkedF.png" mode=""></image>
			<image v-else  src="../../static/checkedT.png" mode=""></image>
		</view>
	</view>
</template>

<script>
export default {
	name: 'multiple_box',
	data() {
		return {
			all_select:false,
		};
	},
	props: {
		list: Array,
		fromtype:String
	},
	mounted() {
		this.is_all_select()
	},
	methods:{
		is_all_select(){
			let flag = true;
			this.list.forEach(item=>{
				if(!item.is_click){
					flag = false
				}
			})
			if(!!flag){
				this.all_select = true;
			}else {
				this.all_select = false;
			}
		},
		change_select(index){
			this.list[index].is_click = !this.list[index].is_click;
			this.is_all_select();
			this.$emit("getListData",this.list,this.fromtype);
		},
		select_all(){
			if(!this.all_select){
				this.list.forEach(item=>{
					item.is_click = true
				})
			}else {
				this.list.forEach(item=>{
					item.is_click = false
				})
			}
			this.all_select = !this.all_select;
			this.$emit("getListData",this.list,this.fromtype);
		}
	}
};
</script>

<style scoped>
.multiple_box {
	position: absolute;
	right: 30rpx;
	top: 90rpx;
	z-index: 10;
	width: 400rpx;
	height: 400rpx;
	overflow-y: scroll;
}
.multiple_item {
	padding: 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 28rpx;
	color: #3366FF;
	background: #e5e5e5;
}
.multiple_item image {
	width: 36rpx;
	height: 36rpx;
}
</style>
