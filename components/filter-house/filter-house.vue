<template>
	<view class="box">
		<view class="tabs">
			<view class="tabs-view" v-for="(item, index) in tablist" :key="item" @click="ontab(index)"
				:style="tabindex == index||(index==0&&position_select_arr.length>0)||(index==1&&room_select_arr.length>0)||(index==2&&price_arr.length>0)||(index==3&&(more_one_select_arr.length>0||more_two_select_arr.length>0))||(index==4&&sort_index>0) ? 'color: #3366FF;' : ''">
				{{ item }}
				<view class="" style="margin-left: 10rpx">
					<u-icon
						:name="tabindex == index||(index==0&&position_select_arr.length>0)||(index==1&&room_select_arr.length>0)||(index==2&&price_arr.length>0)||(index==3&&(more_one_select_arr.length>0||more_two_select_arr.length>0))||(index==4&&sort_index>0)  ? 'arrow-up' : 'arrow-down'"
						:color="tabindex == index||(index==0&&position_select_arr.length>0)||(index==1&&room_select_arr.length>0)||(index==2&&price_arr.length>0)||(index==3&&(more_one_select_arr.length>0||more_two_select_arr.length>0))||(index==4&&sort_index>0)  ? '#3366FF' : '#7b8193'"
						size="20rpx"></u-icon>
				</view>
			</view>
		</view>
		<!-- <view class="label-view">
			<scroll-view class="scroll-view_H" scroll-x="true">
				<view v-for="(item, index) in labelList" :key="index">{{ item }}</view>
			</scroll-view>
		</view> -->
		<view class="pop-view" @click="(popshow = false), (tabindex = -1)" v-if="popshow">
			<view @click.stop="popshow = true">
				<position v-if="tabindex == 0" ref="position"></position>
				<room v-if="tabindex == 1" ref="room"></room>
				<price v-if="tabindex == 2" ref="price"></price>
				<more v-if="tabindex == 3" ref="more"></more>
				<sort v-if="tabindex == 4"></sort>
				<view class="pop-bottom w-box-shadownone w-box-display" v-if="tabindex != 4">
					<view class="left" @click.stop="reset_filter">重置</view>
					<view class="right" @click.stop="submit_filter('')">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		subwayBusiness
	} from "@/config/api.js";
	export default {
		watch: {
			vuex_keyword: { //写成对象形式，就可以跟更多的属性。不加属性与原来的写法效果是一样的。
				handler: function(newV, oldV) {
					this.handleSearch(newV);
					
					
				},
				deep: true, //深度侦听
				immediate:true
			},
		},
		data() {
			return {
				tablist: ['位置', '房型', '价格', '更多', '排序'],
				tabindex: -1,
				popshow: false,
				sort_index: 0,
				sort_filter: ['', 'date_desc', 'date_asc', 'rent_asc', 'rent_desc'],
				position_tabindex: 0,
				contindex: 0,
				position_select_arr: [],
				room_select_arr: [],
				price_select_arr: [],
				more_one_select_arr: [],
				more_two_select_arr: [],
				price_arr: [],
				min_price: '',
				max_price: '',
				position_list: []
			};
		},
		mounted() {},
		created(option) {
			// 请求地铁与商圈数据
			this.getSubwayBusiness();

		},
		methods: {
			handleSearch(newV){
				let timer = null,
				_this = this;
				if(this.position_list.length>0){
					if(!!timer){
						clearTimeout(timer);
					}
					if(!!newV){
						this.position_select_arr= [newV.id];
						this.tabindex = 0;
						if(newV.type=='subway'){
							this.position_tabindex = 1;
							for (var i=0;i<this.position_list[1].children.length;i++){
								for(var j=0;j<this.position_list[1].children[i].children.length;j++){
									if(newV.id == this.position_list[1].children[i].children[j].id){
										this.contindex = i;
									}
								}
							}
						}
						if(newV.type=='business'){
							this.position_tabindex = 0;
							this.$refs.position.position_tabindex = 0;
							for (var i=0;i<this.position_list[0].children.length;i++){
								for(var j=0;j<this.position_list[0].children[i].children.length;j++){
									if(newV.id == this.position_list[0].children[i].children[j].id){
										this.contindex = i;
									}
								}
							}
						}
					}else{
						this.position_tabindex = 0;
						this.contindex = 0;
						this.position_select_arr = [];
					}
					this.submit_filter('search')
				}else{
					timer =  setTimeout(function(){
						_this.handleSearch(newV)
					},200)
				}
				
			},
			async getSubwayBusiness() {
				let subwayBusinessData = await subwayBusiness();
				let business = subwayBusinessData.business,
					subway = subwayBusinessData.subway
				//造数据 先是区域数据
				let business_obj = {
						name: '区域',
						children: [{
							name: '不限',
							children: []
						}]
					},
					subway_obj = {
						name: '地铁',
						children: [{
							name: '不限',
							children: []
						}]
					}
				for (let key in business) {
					let obj = {
						name: key,
						children: [{
							name: '不限',
							checked: true,
							id: 0
						}]
					}
					if (business[key].length > 0) {
						business[key].forEach(item => {
							obj.children.push({
								name: item.name,
								checked: false,
								id: item.id
							})
						})
					}
					business_obj.children.push(obj)
				}
				for (let key in subway) {
					let obj = {
						name: key,
						children: [{
							name: '不限',
							checked: true,
							id: 0
						}]
					}
					if (subway[key].length > 0) {
						subway[key].forEach(item => {
							obj.children.push({
								name: item.station_name,
								checked: false,
								id: item.id
							})
						})
					}
					subway_obj.children.push(obj)
				}
				this.position_list = [business_obj, subway_obj];
			},
			// 重置筛选
			reset_filter() {
				if (this.tabindex == 0) {
					this.position_tabindex = 0;
					this.contindex = 0;
					this.position_select_arr = [];
					this.$refs.position.tabindex = 0;
					this.$refs.position.contindex = 0;
					this.$refs.position.position_select_arr = [];
				} else if (this.tabindex == 1) {
					this.room_select_arr = [];
					this.$refs.room.room_select_arr=[];
				} else if (this.tabindex == 2) {
					this.price_select_arr = [];
					this.price_arr = [];
					this.min_price = '';
					this.max_price = ''
					this.$refs.price.price_select_arr=[];
					this.$refs.price.price_arr = [];
					this.$refs.price.min_price='';
					this.$refs.price.max_price = '';
					console.log(this.price_select_arr,this.price_arr,'第三方')
				} else if (this.tabindex == 3) {
					this.more_one_select_arr = [];
					this.more_two_select_arr = [];
					this.$refs.more.more_one_select_arr = [];
					this.$refs.more.more_two_select_arr = [];
				}
				this.submit_filter('');
				this.tabindex = -1;
				this.popshow = false;

			},
			submit_filter(type) {
				let info = {};
				if (this.tabindex == 0) {
					this.position_tabindex =type=="search"?this.position_tabindex:this.$refs.position.tabindex;
					this.contindex =type=="search"?this.contindex:this.$refs.position.contindex;
					this.position_select_arr = type=="search"?this.position_select_arr:this.$refs.position.position_select_arr;
					info.type = "position";
					info.position_tabindex = this.position_tabindex;
					if (this.position_select_arr.length > 0) {
						info.is_reset = 0;
						if (this.position_select_arr.length == 1 && this.position_select_arr[0] == 0) { //处理不限的情况
							info.limit = 0;
							info.select_name = this.position_list[this.position_tabindex].children[this.contindex].name
						} else {
							info.limit = 1;
							info.select_id = this.position_select_arr
						}
					} else {
						info.is_reset = 1;
					}
					this.$emit('refresh_floor', info)
				} else if (this.tabindex == 1) { //筛选房间
					info.type = "room";
					this.room_select_arr = this.$refs.room.room_select_arr;
					info.select_arr = this.room_select_arr;
					this.$emit('refresh_floor', info)
				} else if (this.tabindex == 2) { //价格筛选
					info.type = "price";
					this.price_select_arr =  this.$refs.price.price_select_arr;
					this.price_arr = this.$refs.price.price_arr;
					this.min_price = this.$refs.price.min_price;
					this.max_price = this.$refs.price.max_price;
					if (this.price_select_arr.length > 0) {
						this.min_price = '';
						this.max_price = ''
					}
					if (!this.$refs.price.min_price && !this.$refs.price.max_price) {
						info.select_arr = this.$refs.price.price_arr;
					} else {
						if (!this.$refs.price.min_price && !!this.$refs.price.max_price) {
							info.select_arr = [{
								min_rent: 0,
								max_rent: this.$refs.price.max_price
							}]
							this.price_arr = [{
								min_rent: 0,
								max_rent: this.$refs.price.max_price
							}]
						}
						if (!!this.$refs.price.min_price && !this.$refs.price.max_price) {
							info.select_arr = [{
								min_rent: this.$refs.price.min_price,
								max_rent: 30000
							}]
							this.price_arr = [{
								min_rent: this.$refs.price.min_price,
								max_rent: 30000
							}]

						}
						if (!!this.$refs.price.min_price && !!this.$refs.price.max_price) {
							info.select_arr = [{
								min_rent: this.$refs.price.min_price,
								max_rent: this.$refs.price.max_price
							}]
							this.price_arr = [{
								min_rent: this.$refs.price.min_price,
								max_rent: this.$refs.price.max_price
							}]
						}
					}
					this.$emit('refresh_floor', info)
				} else if (this.tabindex == 3) {
					info.type = "more";
					this.more_one_select_arr = this.$refs.more.more_one_select_arr;
					this.more_two_select_arr = this.$refs.more.more_two_select_arr;
					info.select_one_arr = this.more_one_select_arr;
					info.select_two_arr = this.more_two_select_arr;
					this.$emit('refresh_floor', info)
				} else if (this.tabindex == 4) {
					info.type = "sort";
					info.order_by = this.sort_filter[this.sort_index];
					this.$emit('refresh_floor', info)
				}
				if (this.tabindex == 4||type=='search') {

				} else {
					this.tabindex = -1;
					this.popshow = false;
				}

			},
			ontab(index) {
				if (this.tabindex == index) {
					if (this.tabindex == 4) {
						this.popshow = !this.popshow;
					} else {
						if(this.position_select_arr.length>0){
							this.tabindex = index;
							this.popshow = true;
						}else {
							this.tabindex = -1;
							this.popshow = false;
						}
					}
				} else {
					this.tabindex = index;
					this.popshow = true;
				}
			}
		},
	};
</script>

<style scoped lang="less">
	.tabs {
		width: 100%;
		height: 100rpx;
		padding: 0 0rpx;
		box-sizing: border-box;
		display: flex;
		flex-flow: row wrap;
		justify-content: space-between;
		align-items: center;
		position: relative;

		.tabs-view {
			height: 100%;
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: #717171;
		}
	}

	.label-view {
		width: 100%;
		height: 50rpx;

		.scroll-view_H {
			white-space: nowrap;
			padding: 0 10rpx 0 30rpx;
			box-sizing: border-box;
			height: 50rpx;

			view {
				height: 100%;
				line-height: 50rpx;
				font-size: 26rpx;
				padding: 0 30rpx;
				border-radius: 20rpx;
				background-color: #f6f6f6;
				color: #b5b8b7;
				display: flex;
				justify-content: center;
				align-items: center;
				display: inline-block;
				margin-right: 18rpx;
			}
		}
	}

	.pop-view {
		position: fixed;
		top: 160rpx;
		left: 0;
		background: rgba(0, 0, 0, 0.4);
		height: 100vh;
		width: 100%;
		z-index: 999;

		.pop-bottom {
			height: 116rpx;
			padding: 17rpx 36rpx;
			box-sizing: border-box;
			background: #fff;
			box-shadow: 0px 1px 4px 1px rgb(106 98 93 / 20%);
			display: flex;
			flex-flow: row wrap;
			justify-content: space-between;

			view {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 26rpx;
				border-radius: 8rpx;
			}

			.left {
				width: 160rpx;
				height: 80rpx;
				border: 1rpx solid #ececec;
				color: #5c5c5c;
			}

			.right {
				width: 500rpx;
				height: 80rpx;
				background-color: #2a62ff;
				color: #fff;
			}
		}
	}
</style>
