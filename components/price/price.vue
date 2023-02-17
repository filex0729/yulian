<!-- 公共空白页 -->
<template>
	<view>
		<view class="box">
			<scroll-view class="scroll-view_H" scroll-y="true">
				<view class="list" v-for="(item, index) in list" :key="index">
					<view class="list-title">{{ item.title }}</view>
					<view class="list-item">
						<view v-for="(itm, ink) in item.item" :key="ink" :class="itm.checked ? 'active' : ''"
							@click="onChecked(index, ink)">{{ itm.name }}</view>
					</view>
				</view>
				<view class="list">
					<view class="list-title">自定义区间</view>
					<view class="list-input">
						<input type="number" v-model="min_price" placeholder="最低" />
						<text>-</text>
						<input type="number" v-model="max_price" placeholder="最高" />
						<text>元/月</text>
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
				price_select_arr:[],
				price_arr:[],
				list: [{
					title: '价格区间（元/月）',
					item: [{
							name: '800元以下',
							min_rent:0,
							max_rent:800,
							checked: false
						},
						{
							name: '800-1500',
							min_rent:800,
							max_rent:1500,
							checked: false
						},
						{
							name: '1500-2000',
							min_rent:1500,
							max_rent:2000,
							checked: false
						},
						{
							name: '2000-3000',
							min_rent:2000,
							max_rent:3000,
							checked: false
						},
						{
							name: '3000-4000',
							min_rent:3000,
							max_rent:4000,
							checked: false
						},
						{
							name: '4000-6000',
							min_rent:4000,
							max_rent:6000,
							checked: false
						},
						{
							name: '6000-8000',
							min_rent:6000,
							max_rent:8000,
							checked: false
						},
						{
							name: '8000元以上',
							min_rent:8000,
							max_rent:30000,
							checked: false
						},
					]
				}],
				min_price: '',
				max_price: ''
			};
		},
		watch: {
			min_price(newVal, oldVal) {
				this.resetPrice()
			},
			max_price(newVal, oldVal) {
				this.resetPrice()
			},
		},
		
		methods: {
			resetPrice(){
				this.list[0].item.forEach(item=>{
					item.checked = false;
				})
				this.price_select_arr = [];
				this.price_arr = []
			},
			onChecked(index, ink) {
				this.list[index].item[ink].checked = !this.list[index].item[ink].checked;
				let price_select_arr = [],
				price_arr = []
				this.list[index].item.forEach(item=>{
					if(!!item.checked){
						price_select_arr.push(item.name)
						let obj = {
							min_rent:item.min_rent,
							max_rent:item.max_rent
						}
						price_arr.push(obj)
					}
				})
				this.price_select_arr = price_select_arr;
				this.price_arr = price_arr;
			}
		},
		mounted() {
			let price_arr = []
			if(this.$parent.price_select_arr.length>0){
				this.$parent.price_select_arr.forEach(item=>{
					this.list[0].item.forEach(key=>{
						if(item==key.name){
							key.checked = true
							let obj = {
								min_rent:key.min_rent,
								max_rent:key.max_rent
							}
							price_arr.push(obj)
						}
					})
				})
			}
			this.price_arr = price_arr;
			console.log(this.$parent.price_select_arr,'this.$parent.price_select_arr;')
			this.price_select_arr = this.$parent.price_select_arr;
			this.min_price = this.$parent.min_price;
			this.max_price = this.$parent.max_price;
		}
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

				.list-input {
					display: flex;
					align-items: center;
					padding: 0 0 0 28rpx;
					margin-top: 25rpx;

					input {
						height: 60rpx;
						width: 180rpx;
						border: 1rpx solid #ececec;
						text-align: center;
					}

					text {
						margin: 0 16rpx;
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
