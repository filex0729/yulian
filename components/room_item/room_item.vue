<template>
	<view class="room_wrapper second_title_color" @tap.stop="room_detail">
		<view class="room_name main_title_color font_weight_bold" :class="from_type == 'detail' ? 'font_size28' : 'font_size26'">
			<view v-if="batch_change" class="choose_box" >
				<image v-if="!room_info.is_checked"  src="../../static/checkedF.png" mode=""></image>
				<image v-if="room_info.is_checked" src="../../static/checkedT.png" mode=""></image>
			</view>
			{{!!room_info.another_name?room_info.another_name: prefix+room_info.door_num}}室
		</view>
		<view class="u-flex align-center justify-start" style="font-size: 18rpx;">
			<view class="room_type " >{{room_info.apartment}}</view>
		</view>
		<view class="room_price">
			<view class="is_special" v-if="room_info.is_special==1">
				特价
			</view>
			<view class="price_num font_weight_bold" :class="from_type == 'detail' ? 'font_size28' : 'font_size26'">
				{{room_info.rent*1}}
				<text class="font_size22 font_weight_normal">元/月</text>
			</view>
		</view>
		<view class="room_status" :class="from_type == 'detail' ? 'room_status_detail' : ''">
			<image v-if="room_info.status==1" src="../../static/image/floor/daizu.png" mode=""></image>
			<image v-if="room_info.status==2" src="../../static/image/floor/yizu.png" mode=""></image>
			<image v-if="room_info.status==3" src="../../static/image/floor/buzu.png" mode=""></image>
		</view>
	</view>
</template>

<script>
export default {
	name: 'room_item',
	props: {
		from_type: String,
		prefix:String,
		batch_change: String,
		room_index:Number,
		index:Number,
		building_id:String,
		room_info:{
		  type: Object,
		  default: {}
		}
	},
	
	data() {
		return {
		};
	},
	created() {
	},
	methods: {
		room_detail() {
			console.log(this.index,this.room_index,'士大夫撒多')
			if(!!this.batch_change){
				if(this.batch_change==1){
					if(!!this.room_info.is_checked){
						return;
					}
					if(this.$parent.room_info.length>0){
						this.$parent.room_info.forEach(item=>{
							if(item.room.length>0){
								item.room.forEach(room=>{
									room.is_checked = false
								})
							}
						})
					}
					this.$parent.room_info[this.index].room[this.room_index].is_checked = true
				}else {
					this.$parent.room_info[this.index].room[this.room_index].is_checked = !this.$parent.room_info[this.index].room[this.room_index].is_checked
				}
				
			}else {
				uni.navigateTo({
					url: '../../pages/room_detail/room_detail?room_id='+this.room_info.id+'&building_id='+this.building_id
				});
			}
			
		}
	}
};
</script>

<style scoped lang="scss">
.room_wrapper {
	position: relative;
	width: 100%;
	height: 100%;
	box-shadow: 0px 3rpx 6rpx rgba(0, 0, 0, 0.16);
	border-radius: 12rpx;
	padding: 10rpx 0;
	padding-left: 18rpx;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.room_name {
		display: flex;
		align-items: center;
		.choose_box {
			display: flex;
			image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 8rpx;
				
			}
		}
	}
	.room_area {
		margin-left: 10rpx;
	}

	.room_price {
		display: flex;
		align-items: center;
		justify-content: space-between;
        .is_special {
			font-size: 22rpx;
			font-family: Source Han Sans CN-Bold, Source Han Sans CN;
			font-weight: bold;
			color: #FF551D;
		}
		.price_num {
			display: flex;
			align-items: center;
			color: #ff551d;
		}
		.time_desc {
			font-size: 22rpx;
			margin-right: 10rpx;
		}
	}
	.room_status {
		position: absolute;
		right: 0;
		top: 0;
		z-index: 1;
		width: 66rpx;
		height: 48rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.room_status_detail {
		width: 82rpx;
		height: 60rpx;
	}
}
</style>
