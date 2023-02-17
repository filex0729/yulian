<!-- 公共空白页 -->
<template>
	<view>
		<view class="box">
			<view class="left">
				<scroll-view class="scroll-view_H" scroll-y="true">
					<view v-for="(item, index) in list" :key="index" :class="tabindex == index ? 'leftactive' : ''" @click="(tabindex = index), (contindex = 0)">
						{{ item.name }}
					</view>
				</scroll-view>
			</view>
			<view class="content" :style="{ width: (contindex > 0) & (tabindex != 2) ? '240rpx' : '420rpx' }">
				<scroll-view class="scroll-view_H" scroll-y="true">
					<view v-for="(item, index) in list[tabindex].children" :key="index" :class="contindex == index ? 'contactive' : ''" @click="change_contindex(index)">
						{{ item.name }}
					</view>
				</scroll-view>
			</view>
			<view class="right" v-if="contindex > 0 && tabindex != 2">
				<scroll-view class="scroll-view_H" scroll-y="true">
					<view :class="item.checked ? 'contactive' : ''" v-for="(item, index) in list[tabindex].children[contindex].children" @click="onchecked(index)" :key="index">
						{{ item.name }}
						<image :src="item.checked ? '../../static/checkedT.png' : '../../static/checkedF.png'" mode="" v-if="index > 0"></image>
						<u-icon v-else-if="item.checked && index == 0" name="checkbox-mark" color="#2a5bd2"></u-icon>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'position',
	props: {},
	data() {
		return {
			list: [],
			tabindex: 0,
			contindex: 0,
			position_select_arr: []
		};
	},
	watch: {},
	
	created() {
		this.list = this.$parent.position_list;
		this.tabindex = this.$parent.position_tabindex;
		this.contindex = this.$parent.contindex;
		if (this.$parent.position_select_arr.length > 0) {
			console.log(this.list[this.tabindex].children[this.contindex],'this.list[this.tabindex].children[this.contindex]')
			if (this.list[this.tabindex].children[this.contindex].children.length > 0) {
				this.$parent.position_select_arr.forEach(item => {
					this.list[this.tabindex].children[this.contindex].children.forEach(key => {
						if (item == key.id) {
							key.checked = true;
						}
					});
					if(item==0){
						this.list[this.tabindex].children[this.contindex].children[0].checked = true;
					}else {
						this.list[this.tabindex].children[this.contindex].children[0].checked = false;
					}
				});
			}
		}else {
			if(this.contindex>0){
				this.list[this.tabindex].children[this.contindex].children[0].checked = true;
			}
		}
	},
	methods: {
		change_contindex(index) {
			this.contindex = index;
			this.list[this.tabindex].children[this.contindex].children.map(item => {
				item.checked = false;
			});
			if(this.list[this.tabindex].children[this.contindex].children.length>0){
				this.list[this.tabindex].children[this.contindex].children[0].checked = true;
				this.position_select_arr = [0];
			}
			
		},
		checkboxGroupChange(e) {
			console.log(e, this.list);
		},
		onconfirm() {},
		onchecked(index) {
			if (index == 0) {
				this.list[this.tabindex].children[this.contindex].children.map(item => {
					item.checked = false;
				});
				this.list[this.tabindex].children[this.contindex].children[0].checked = true;
				this.position_select_arr = [0];
			} else if (index != 0) {
				this.list[this.tabindex].children[this.contindex].children[0].checked = false;
				this.list[this.tabindex].children[this.contindex].children[index].checked = !this.list[this.tabindex].children[this.contindex].children[index].checked;
				let position_select_arr = [];
				this.list[this.tabindex].children[this.contindex].children.forEach(item => {
					if (!!item.checked) {
						position_select_arr.push(item.id);
					}
				});
				this.position_select_arr = position_select_arr;
			}
		}
	},
	mounted() {}
};
</script>
<style scoped lang="less">
.box {
	display: flex;
	background-color: #f6f6f6;
	height: 600rpx;
	view {
		font-size: 26rpx;
	}
	.scroll-view_H {
		white-space: nowrap;
		height: 100%;
	}
	.left {
		flex: 1;
		view {
			padding: 0 30rpx;
			height: 78rpx;
			line-height: 78rpx;
		}
	}
	.content {
		background-color: #fafafc;
		view {
			padding: 0 30rpx;
			height: 78rpx;
			line-height: 78rpx;
		}
	}
	.right {
		background-color: #fff;
		width: 360rpx;
		view {
			padding: 0 30rpx;
			height: 78rpx;
			line-height: 78rpx;
			display: flex;
			flex-flow: row wrap;
			justify-content: space-between;
			align-items: center;
			image {
				width: 35rpx;
				height: 35rpx;
			}
		}
	}
}
.leftactive {
	color: #3366ff !important;
	background-color: #fafafc;
}
.contactive {
	color: #3366ff !important;
	background-color: #fff;
}
</style>
