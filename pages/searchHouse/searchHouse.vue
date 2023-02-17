<template>
	<view class="search_house">
		<view class="search_key_box">
			<u-search
				searchIconSize="40rpx"
				searchIconColor="#d0d0dc"
				placeholderColor="#d0d0dc"
				color="#2A2E34"
				:inputStyle="{ 'font-size': '26rpx' }"
				:actionStyle="{ color: '#3366FF' }"
				shape="square"
				:clearabled="true"
				bgColor="#F4F5F9"
				height="60rpx"
				:focus="true"
				placeholder="请输入楼栋、商圈、地铁等"
				v-model="keyword"
				:show-action="true"
				actionText="取消"
				:animation="false"
				@change="$u.debounce(search_val, 500)"
				@custom="cancel_search"
				@clear="clear_event"
			></u-search>
		</view>
		<!-- 历史记录 -->
		<view class="search_content" v-if="search_history.length > 0&&search_result.length==0&&!keyword">
			<view class="search_content_top">
				<view class="search_content_top_left second_title_color font_size26">您搜索过的记录</view>
				<view class="search_content_top_right" @click="deleteKeys"><u-icon name="trash" color="#2a2e34" size="40rpx"></u-icon></view>
			</view>
			<view class="search_content_item" v-for="(item, index) in search_history" :key="item.id" @click="start_search(item)">{{ item.title }}</view>
		</view>
		<!-- 搜索结果 -->
		<view class="search_result" v-if="search_result.length>0">
			<view class="search_content_top">
				<view class="search_content_top_left second_title_color font_size26">搜索结果</view>
			</view>
			<view class="search_result_box">
				<view class="search_result_box_item" v-for="(item,index) in search_result" :key="item.id" @click="start_search(item)">
					<view class="left" v-if="item.type=='subway'">
						<view class="result_type">
							地铁 ·
						</view>
						<view class="result_name">
							{{item.station_name}}
						</view>
						<view v-if="!!item.subway_line" class="result_type">
							({{item.subway_line}})
						</view>
					</view>
					<view class="left" v-else>
						<view class="result_type">
							{{item.type=='business'?'商圈 ·':'公寓 ·'}}
						</view>
						<view class="result_name">
							{{item.name}}
						</view>
					</view>
					
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {searchValue} from '@/config/api.js'
export default {
	data() {
		return {
			keyword: '',
			search_history: [],
			search_result:[],
		};
	},
	methods: {
		async search_val(){
			if(!this.keyword){
				this.search_result=[];
				return;
			}
			let params = {
				keyword:this.keyword
			}
			let searchData = await searchValue(params);
			console.log(searchData,'searchData')
			if(searchData.building.length>0){
				searchData.building.forEach(item=>{
					item.type = 'house'
				})
			}
			if(searchData.business.length>0){
				searchData.business.forEach(item=>{
					item.type = 'business'
				})
			}
			if(searchData.subway.length>0){
				searchData.subway.forEach(item=>{
					item.type = 'subway'
				})
			}
			this.search_result = [].concat(searchData.subway).concat(searchData.business).concat(searchData.building)
		},
		cancel_search(){
			uni.navigateBack({
			})
		},
		clear_event(){
			this.keyword = '';
			this.$u.vuex('vuex_keyword','');
		},
		deleteKeys(){
			let _this = this
			uni.showModal({
				title:'操作确认',
				content:'确认删除历史搜索记录?',
				success(res) {
					if(res.confirm){
						_this.search_history=[];
						uni.removeStorage({
							key: 'search_history',
							success: function (res) {
								console.log('success');
							}
						});
					}
				}
			})
		},
		start_search(item) {
			if(item.type=='subway'){
				item.title = item.station_name+'/'+item.subway_line
			}else {
				item.title = item.name
			}
			let search_history = this.search_history;
			let flag = true;
			 if(search_history.length>0){
				 search_history.forEach(history=>{
					 if(JSON.stringify(history)===JSON.stringify(item)){
						 flag = false
					 }
				 })
			 }
			if (!flag) {
			} else {
				search_history.push(item);
				uni.setStorage({
					key: 'search_history',
					data: JSON.stringify(search_history),
					success: function () {
					}
				});
			}
			this.$u.vuex('vuex_keyword', item);
			uni.switchTab({
				url:"/pages/house/house"
			})
		
		}
	},
	onShow() {
		let search_history =  uni.getStorageSync('search_history') || [];
		this.search_history =search_history.length>0?JSON.parse(search_history):search_history;
		if(!!this.vuex_keyword){
			this.keyword = this.vuex_keyword.title;
		}
	},
	onHide() {}
};
</script>

<style lang="scss" scoped>
.search_house {
	min-height: 100vh;
	background-color: #fff;
	overflow: auto;
}
.search_key_box {
	padding: 14rpx 30rpx;
}
.search_content {
	padding: 0 30rpx;
}
.search_content_top {
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.search_content_item {
	height: 88rpx;
	line-height: 88rpx;
	border-bottom: 1rpx solid #e5e5e5;
}
.search_content_item:last-of-type {
	border-bottom: none;
}
.search_result {
	padding-left: 30rpx;
}
.search_result_box_item{
	padding-right: 30rpx;
	border-bottom: 1rpx solid #e5e5e5;
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.search_result_box_item .left{
	display: flex;
	align-items: center;
	color: #2A2E34 ;
	font-size: 28rpx;
}
.result_type {
	color: #7B8193;
	font-size: 24rpx;
}
.result_name {
	margin:0 20rpx;
}
</style>
