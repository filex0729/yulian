<template>
	<view class="create_room" :style="{ paddingBottom: false ? '0' : '150rpx' }">
		<u-navbar leftText="返回" :fixed="true" :title="page_title" :safeAreaInsetTop="true" :placeholder="true">
			<view class="u-nav-slot" slot="left">
				<uni-icons @tap="$u.throttle(backPage, 500)" custom-prefix="yulian" type="yulian-fanhui" size="20">
				</uni-icons>
				<u-line direction="column" :hairline="false" length="16" margin="0 16rpx"></u-line>
				<uni-icons @tap="$u.throttle(backIndex, 500)" custom-prefix="yulian" type="yulian-fanhuishouye"
					size="20"></uni-icons>
			</view>
		</u-navbar>
		<view class="create_room_content" v-if="vuex_isBind==1">
			<view class="" v-if="!is_success">
				<u-sticky v-if="from_type == 'add'||from_type == 'room_edit'" bgColor="#fff">
					<u-tabs lineWidth="54rpx" lineHeight="6rpx" lineColor="#3366FF" :current="current"
						@change="change_current" :activeStyle="{
							color: '#3366FF ',
							fontWeight: 'bold',
							transform: 'scale(1.05)'
						}" :inactiveStyle="{
							color: '#2A2E34 ',
							fontWeight: 'bold',
							transform: 'scale(1)'
						}" itemStyle=" height: 84rpx;" :list="top_nav_list" :scrollable="false"></u-tabs>
				</u-sticky>
				<!-- record_from表单 -->
				<view class="" v-show="current == 0">
					<u--form labelPosition="left" labelWidth="300rpx" :model="record_from" ref="record_from">
						<view class="head_title">来源信息</view>
						<view class="form-item_box">
							<u-form-item :required="true" label="房源类型" prop="house_type"
								@click="show_house_type = true">
								<u--input placeholder="请选择房源类型" inputAlign="right" border="none"
									v-model="record_from.house_type_name" disabled disabledColor="#ffffff"
									suffixIcon="arrow-right" suffixIconStyle="color: #C7C7CC"></u--input>
							</u-form-item>
							<!-- <u-form-item label="渠道来源">
								<u--input placeholder="请输入渠道来源" inputAlign="right" border="none" v-model="record_from.channel"></u--input>
							</u-form-item> -->
						</view>
						<view class="head_title">位置信息</view>
						<view class="form-item_box">
							<u-form-item :required="true" borderBottom label="选择楼栋" prop="floorName"
								@click.stop.prevent="choose_floor">
								<u--input placeholder="请先选择楼栋" inputAlign="right" border="none"
									v-model="record_from.floorName" disabled disabledColor="#ffffff"
									suffixIcon="arrow-right" suffixIconStyle="color: #C7C7CC"></u--input>
							</u-form-item>
							<u-form-item :required="true" borderBottom label="房间楼层" prop="room_floor"
								@click="show_room_floor = from_type=='room_edit'?false:true">
								<u--input placeholder="请选择房间的楼层" inputAlign="right" border="none"
									v-model="record_from.room_floor" disabled disabledColor="#ffffff"
									suffixIcon="arrow-right" suffixIconStyle="color: #C7C7CC"></u--input>
							</u-form-item>
							<u-form-item :required="true" borderBottom label="房间尾号" prop="room_number"
								@click="show_room_num = from_type=='room_edit'?false:true">
								<u--input placeholder="请选择房间的尾号" inputAlign="right" border="none"
									v-model="record_from.room_num" disabled disabledColor="#ffffff"
									suffixIcon="arrow-right" suffixIconStyle="color: #C7C7CC"></u--input>
							</u-form-item>
							<u-form-item label="自定义房号" borderBottom >
								<u--input placeholder="请输入自定义房号" inputAlign="right" border="none"
									v-model="record_from.another_name"></u--input>
							</u-form-item>
							<u-form-item :required="true"  label="是否为特价房" borderBottom>
								<view class="" style="display: flex;justify-content: flex-end;">
									<u-switch v-model="record_from.is_special" @change="change_is_special"></u-switch>
								</view>
								
							</u-form-item>
							<u-form-item label="钥匙位置">
								<u--input placeholder="请输入钥匙位置" inputAlign="right" border="none"
									v-model="record_from.key_position"></u--input>
							</u-form-item>
						</view>
						<!-- <view class="head_title">房东/管家信息</view>
						<view class="form-item_box">
							<u-form-item borderBottom label="姓名" prop="contact_name">
								<u--input placeholder="请输入姓名" inputAlign="right" border="none"
									v-model="record_from.contact_name" type="text"></u--input>
							</u-form-item>
							<u-form-item borderBottom label="手机" prop="contact_phone">
								<u--input placeholder="请输入手机" inputAlign="right" border="none"
									v-model="record_from.contact_phone" type="number"></u--input>
							</u-form-item>
							<u-form-item borderBottom label="与业主的关系" prop="relationship" @click="show_look = true">
								<u--input placeholder="请输入与业主的关系" inputAlign="right" border="none"
									:value="record_from.relationship" disabled disabledColor="#ffffff"
									suffixIcon="arrow-right" suffixIconStyle="color: #C7C7CC"></u--input>
							</u-form-item>
							<u-form-item label="其他信息" prop="other_info">
								<u--input placeholder="请输入其他信息" inputAlign="right" border="none"
									v-model="record_from.other_info" type="text"></u--input>
							</u-form-item>
						</view> -->
						<view class="footer_box" v-if="from_type=='room_edit'">
							<view class=""><button class="u-reset-button continue_btn"
									@tap="continue_click(2)">确定修改</button></view>
						</view>
						<view class="footer_box" v-else>
							<view class=""><button class="u-reset-button continue_btn"
									@tap="continue_click(0)">继续录入</button></view>
						</view>
					</u--form>
				</view>
				<view class="" v-show="current == 1">
					<!-- maintain_from表单 -->
					<u--form labelPosition="left" labelWidth="300rpx" :model="maintain_from" ref="maintain_from">
						<view class="head_title">硬装信息</view>
						<view class="form-item_box">
							<!-- <u-form-item :required="true"  borderBottom label="面积(㎡)" prop="area">
								<u--input placeholder="请输入房间面积" inputAlign="right" border="none" v-model="maintain_from.area"></u--input>
							</u-form-item> -->
							<u-form-item :required="true" borderBottom label="整租户型" prop="room_type"
								@click="show_room_type = true">
								<u--input placeholder="请选择整租户型" inputAlign="right" border="none"
									v-model="maintain_from.room_type_name" disabled disabledColor="#ffffff"
									suffixIcon="arrow-right" suffixIconStyle="color: #C7C7CC"></u--input>
							</u-form-item>
							<u-form-item  borderBottom label="朝向" prop="orientation_name" @click="show_orientation = true">
								<u--input
									placeholder="请选择朝向"
									inputAlign="right"
									border="none"
									v-model="maintain_from.orientation_name"
									disabled
									disabledColor="#ffffff"
									suffixIcon="arrow-right"
									suffixIconStyle="color: #C7C7CC"
								></u--input>
							</u-form-item>
							<!-- <u-form-item borderBottom label="装修" prop="renovation" @click="show_renovation = true">
								<u--input
									placeholder="请选择装修程度"
									inputAlign="right"
									border="none"
									v-model="maintain_from.renovation_name"
									disabled
									disabledColor="#ffffff"
									suffixIcon="arrow-right"
									suffixIconStyle="color: #C7C7CC"
								></u--input>
							</u-form-item> -->
						</view>
						<view class="head_title">配套设施</view>
						<view class="thing_box">
							<view class="thing_item" :class="!!thing.flag ? 'thing_item_active' : ''"
								@click="select_thing(index)" v-for="(thing, index) in maintain_from.room_thing"
								:key="index">
								{{ thing.name }}
							</view>
						</view>
						<view class="head_title">业主需求</view>
						<view class="form-item_box">
							<u-form-item borderBottom label="房间状态" prop="room_status_name"
								@click="show_room_status = true">
								<u--input placeholder="请选择房间状态" inputAlign="right" border="none"
									v-model="maintain_from.room_status_name" disabled disabledColor="#ffffff"
									suffixIcon="arrow-right" suffixIconStyle="color: #C7C7CC"></u--input>
							</u-form-item>
							<u-form-item :required="true" borderBottom label="月租金" prop="month_price">
								<u--input placeholder="请输入月租金" inputAlign="right" border="none"
									v-model="maintain_from.month_price"></u--input>
							</u-form-item>
							<!-- <u-form-item borderBottom label="可看房时间" prop="see_room_time" @click="show_see_room_time = true">
								<u--input
									placeholder="请选择可看房时间"
									inputAlign="right"
									border="none"
									v-model="maintain_from.see_room_time_name"
									disabled
									disabledColor="#ffffff"
									suffixIcon="arrow-right"
									suffixIconStyle="color: #C7C7CC"
								></u--input>
							</u-form-item> -->
							<!-- <u-form-item borderBottom label="可入住时间" prop="check_in_time" @click="show_check_in_time = true">
								<u-datetime-picker
									ref="datetimePicker"
									@cancel="show_check_in_time = false"
									@confirm="getDate"
									:formatter="formatter"
									:show="show_check_in_time"
									v-model="now_time"
									mode="date"
								></u-datetime-picker>
								<u--input
									placeholder="请选择可入住时间"
									inputAlign="right"
									border="none"
									v-model="maintain_from.check_in_time"
									disabled
									disabledColor="#ffffff"
									suffixIcon="arrow-right"
									suffixIconStyle="color: #C7C7CC"
								></u--input>
							</u-form-item> -->
							<u-form-item label="其他需求" prop="remarks">
								<u--input placeholder="请输入其他需求" inputAlign="right" border="none"
									v-model="maintain_from.remarks"></u--input>
							</u-form-item>
						</view>
						<view class="head_title">抽成比例</view>
						<view class="form-item_box">
							<u-form-item borderBottom label="计算方式" prop="computer_type"
								@click="show_computer_type = true">
								<u--input placeholder="请选择计算方式" inputAlign="right" border="none"
									:value="maintain_from.computer_type == 1 ? '月租金比例' : '固定金额'" disabled
									disabledColor="#ffffff" suffixIcon="arrow-right" suffixIconStyle="color: #C7C7CC">
								</u--input>
							</u-form-item>
							<u-form-item :required="true" label="佣金占比" v-if="maintain_from.computer_type == 1"
								prop="proportion">
								<u-input placeholder="请输入佣金占比" type="digit" inputAlign="right" border="none"
									v-model="maintain_from.proportion">
									<template slot="suffix">
										<u--text color="#888888" text="%"></u--text>
									</template>
								</u-input>
							</u-form-item>
							<u-form-item :required="true" label="固定金额" v-if="maintain_from.computer_type == 2"
								prop="fixed_price">
								<u-input placeholder="请输入固定金额" type="digit" inputAlign="right" border="none"
									v-model="maintain_from.fixed_price">
									<template slot="suffix">
										<u--text color="#888888" text="元"></u--text>
									</template>
								</u-input>
							</u-form-item>
						</view>

						<view class="footer_box" v-if="from_type=='room_edit'">
							<view class=""><button class="u-reset-button continue_btn"
									@tap="continue_click(2)">确定修改</button></view>
						</view>
						<view class="footer_box" v-else>
							<view class=""><button class="u-reset-button continue_btn"
									@tap="continue_click(1)">继续录入</button></view>
						</view>
					</u--form>
				</view>
				<view v-show="current == 2">
					<!-- resources_from表单 -->
					<u--form :model="resources_from" labelWidth="300rpx" ref="resources_from">
						<view class="head_title" v-if="from_type=='edit'">业主需求</view>
						<view class="form-item_box" v-if="from_type=='edit'">
							<u-form-item borderBottom label="房间状态" prop="room_status_name"
								@click="show_room_status = true">
								<u--input placeholder="请选择房间状态" inputAlign="right" border="none"
									v-model="maintain_from.room_status_name" disabled disabledColor="#ffffff"
									suffixIcon="arrow-right" suffixIconStyle="color: #C7C7CC"></u--input>
							</u-form-item>
							<u-form-item label="月租金" borderBottom prop="month_price">
								<u--input placeholder="请输入月租金" inputAlign="right" border="none"
									v-model="maintain_from.month_price"></u--input>
							</u-form-item>
							<u-form-item borderBottom label="计算方式" prop="computer_type"
								@click="show_computer_type = true">
								<u--input placeholder="请选择计算方式" inputAlign="right" border="none"
									:value="maintain_from.computer_type == 1 ? '月租金比例' : '固定金额'" disabled
									disabledColor="#ffffff" suffixIcon="arrow-right" suffixIconStyle="color: #C7C7CC">
								</u--input>
							</u-form-item>
							<u-form-item :required="true" label="佣金占比" v-if="maintain_from.computer_type == 1"
								prop="proportion">
								<u-input placeholder="请输入佣金占比" type="digit" inputAlign="right" border="none"
									v-model="maintain_from.proportion">
									<template slot="suffix">
										<u--text color="#888888" text="%"></u--text>
									</template>
								</u-input>
							</u-form-item>
							<u-form-item :required="true" label="固定金额" v-if="maintain_from.computer_type == 2"
								prop="fixed_price">
								<u-input placeholder="请输入固定金额" type="digit" inputAlign="right" border="none"
									v-model="maintain_from.fixed_price">
									<template slot="suffix">
										<u--text color="#888888" text="元"></u--text>
									</template>
								</u-input>
							</u-form-item>
						</view>
						<view class="head_title">房间主图</view>
						<view class="resources_from_box">
							<!-- <view class="resources_from_box_title">房间主图</view> -->
							<view class="resources_from_item">
								<u-form-item prop="bedroom_imgs">
									<u-upload :width="'116rpx'" :height="'116rpx'" name="bedroom_imgs"
										@afterRead="afterRead" @delete="deleteFloorImage"
										:fileList="resources_from.bedroom_imgs" multiple :maxCount="5"></u-upload>
								</u-form-item>
							</view>
							<!-- 	<view class="resources_from_item">
								<view class="title">客厅</view>
								<u-form-item prop="living_room_imgs">
									<view style="padding: 30rpx 0;">
										<u-upload
											:width="'116rpx'"
											:height="'116rpx'"
											name="living_room_imgs"
											@afterRead="afterRead"
											@delete="deleteFloorImage"
											:fileList="resources_from.living_room_imgs"
											multiple
											:maxCount="5"
										></u-upload>
									</view>
								</u-form-item>
							</view>
							<view class="resources_from_item">
								<view class="title">餐厅</view>
								<u-form-item prop="restaurant_imgs">
									<view style="padding: 30rpx 0;">
										<u-upload
											:width="'116rpx'"
											:height="'116rpx'"
											name="restaurant_imgs"
											@afterRead="afterRead"
											@delete="deleteFloorImage"
											:fileList="resources_from.restaurant_imgs"
											multiple
											:maxCount="5"
										></u-upload>
									</view>
								</u-form-item>
							</view>
							<view class="resources_from_item">
								<view class="title">卫生间</view>
								<u-form-item prop="toilet_imgs">
									<view style="padding: 30rpx 0;">
										<u-upload
											:width="'116rpx'"
											:height="'116rpx'"
											name="toilet_imgs"
											@afterRead="afterRead"
											@delete="deleteFloorImage"
											:fileList="resources_from.toilet_imgs"
											multiple
											:maxCount="5"
										></u-upload>
									</view>
								</u-form-item>
							</view>
							<view class="resources_from_item">
								<view class="title">厨房</view>
								<u-form-item prop="kitchen_imgs">
									<view style="padding: 30rpx 0;">
										<u-upload
											:width="'116rpx'"
											:height="'116rpx'"
											name="kitchen_imgs"
											@afterRead="afterRead"
											@delete="deleteFloorImage"
											:fileList="resources_from.kitchen_imgs"
											multiple
											:maxCount="5"
										></u-upload>
									</view>
								</u-form-item>
							</view>
						 -->
						</view>
						<view class="head_title">房间视频(可上传1条视频，大小不超过20M)</view>
						<view class="resources_from_box">
							<view class="resources_from_item">
								<u-form-item prop="function_video">
									<view style="padding-bottom: 30rpx;">
										<u-upload :width="'116rpx'" :height="'116rpx'" :maxSize="1024 * 1024 * 20"
											accept="video" name="function_video" @afterRead="afterReadVideo"
											@delete="deleteFloorVideo" :fileList="resources_from.function_video"
											:maxCount="1"></u-upload>
										<video class="floor_video"
											v-if="resources_from.function_video.length > 0 && !!show_video"
											:src="resources_from.function_video[0].url"></video>
									</view>
								</u-form-item>
							</view>
						</view>
						<!-- <view class="head_title">户型图视频(可上传1条视频，大小不超过20M)</view>
						<view class="resources_from_box">
							<view class="resources_from_item">
								<u-form-item prop="room_type_video">
									<view style="padding-bottom: 30rpx;">
										<u-upload
											:width="'116rpx'"
											:height="'116rpx'"
											:maxSize="1024 * 1024 * 20"
											accept="video"
											name="room_type_video"
											@afterRead="afterReadVideo"
											@delete="deleteFloorVideo"
											:fileList="resources_from.room_type_video"
											:maxCount="1"
										></u-upload>
									</view>
								</u-form-item>
							</view>
						</view> -->
						<view class="footer_box">
							<view class="" style="width: 100%;">
								<button class="u-reset-button continue_btn" v-if="from_type == 'add'||from_type=='room_edit'"
									@tap="continue_click(2)">完成录入</button>
								<button class="u-reset-button continue_btn" v-if="from_type == 'edit'"
									@tap="batch_change_room">确认修改</button>
							</view>
						</view>
					</u--form>
				</view>

				<!-- 房源类型picker -->
				<u-picker :show="show_house_type" :immediateChange="true" closeOnClickOverlay
					:columns="house_type_columns" keyName="label" @cancel="show_house_type = false"
					@confirm="select_house_type" @close="show_house_type = false"></u-picker>
				<!-- 房间楼层picker -->
				<u-picker :show="show_room_floor" :immediateChange="true" closeOnClickOverlay
					:columns="room_floor_columns" @cancel="show_room_floor = false" @confirm="select_room_floor"
					@close="show_room_floor = false"></u-picker>
				<!-- 房间尾号picker -->
				<u-picker :show="show_room_num" :immediateChange="true" closeOnClickOverlay :columns="room_num_columns"
					@cancel="show_room_num = false" @confirm="select_room_num" @close="show_room_num = false">
				</u-picker>
				<!-- 与业主关系 -->
				<u-picker :show="show_look" :immediateChange="true" closeOnClickOverlay :columns="look_columns"
					@cancel="show_look = false" @confirm="select_look" @close="show_look = false"></u-picker>
				<!-- 整租户型 由后台提供 -->
				<u-picker :show="show_room_type" :immediateChange="true" closeOnClickOverlay
					:columns="manage_charge_columns" keyName="name" @cancel="show_room_type = false"
					@confirm="select_room_type" @close="show_room_type = false"></u-picker>
				<!-- 朝向 -->
				<u-picker :show="show_orientation" :immediateChange="true" closeOnClickOverlay
					:columns="orientation_columns" @cancel="show_orientation = false" @confirm="select_orientation"
					@close="show_orientation = false"></u-picker>
				<!-- 装修程度 -->
				<u-picker :show="show_renovation" :immediateChange="true" closeOnClickOverlay
					:columns="renovation_columns" @cancel="show_renovation = false" @confirm="select_renovation"
					@close="show_renovation = false"></u-picker>
				<!-- 房间状态 -->
				<u-picker :show="show_room_status" :immediateChange="true" closeOnClickOverlay
					:columns="room_status_columns" keyName="label" @cancel="show_room_status = false"
					@confirm="select_room_status" @close="show_room_status = false"></u-picker>
				<!-- 可看房时间 -->

				<u-picker :show="show_see_room_time" :immediateChange="true" closeOnClickOverlay
					:columns="see_room_time_columns" keyName="label" @cancel="show_see_room_time = false"
					@confirm="select_see_room_time" @close="show_see_room_time = false"></u-picker>
				<!-- 佣金方式 -->
				<u-picker :show="show_computer_type" :immediateChange="true" closeOnClickOverlay
					:columns="computer_ways" keyName="label" @cancel="show_computer_type = false"
					@confirm="select_computer_type" @close="show_computer_type = false"></u-picker>
			</view>
			<view class="success_page" v-if="is_success">
				<view class="success_page_title">{{from_type=='room_edit'?'修改成功':'录入成功'}}</view>
				<view class="success_page_func">
					<view class="back_house" @tap="$u.throttle(back_self_house, 500)">回到我的房源</view>
					<view class="batch_create" @tap="$u.throttle(batch_create_room, 500)">批量生成房源</view>
				</view>
			</view>
		</view>

		<login_error v-if="vuex_isBind!=1"></login_error>
	</view>
</template>

<script>
	import {
		buildingFloorRoom,
		saveRoom,
		batchHandleRoom
	} from '@/config/api.js';
	export default {
		data() {
			return {
				room_id:'',
				page_title: '录入房间',
				show_video: false,
				is_success: false,
				from_type: 'add',
				current: 0,
				computer_ways: [
					[{
							type: 1,
							label: '月租金比例'
						},
						{
							type: 2,
							label: '固定金额'
						}
					]
				],
				see_room_time_columns: [
					[{
							label: '随时看房',
							type: 1
						},
						{
							label: '下班后',
							type: 2
						},
						{
							label: '周末看房',
							type: 3
						},
						{
							label: '其他时间',
							type: 4
						}
					]
				],
				room_status_columns: [
					[{
							label: '待出租',
							type: 1
						},
						{
							label: '已出租',
							type: 2
						},
						{
							label: '维修中',
							type: 3
						}
					]
				],
				renovation_columns: [
					[
						'精装',
						'简装',
						'毛坯'
					]
				],
				orientation_columns: [
					[
						'南',
						'东',
						'西',
						'北',
						'东南',
						'东北',
						'南北',
						'西北',
						'西南',
						'东西'
					]
				],
				manage_charge_columns: [],
				house_type_columns: [
					[{
						label: '整租',
						type: 0
					}]
				],
				look_columns: [
					[
						'管家',
						'房东',
						'二房东',
						'操盘人'
					]
				],
				room_floor_columns: [],
				room_num_columns: [],
				record_from: {
					house_type_name: '',
					house_type: '',
					channel: '',
					floorName: '',
					floorId: '',
					room_floor: '',
					room_num: '',
					another_name:'',
					key_position: '',
					is_special:false,
					contact_name: '',
					contact_phone: '',
					contact_weixin: '',
					relationship: '管家',
					other_info: '',
					look: 0,
				},
				maintain_from: {
					room_type_name: '',
					room_type: '',
					area: '',
					orientation_name: '南',
					renovation_name: '精装',
					room_status: 1,
					room_status_name: '待出租',
					see_room_time: '',
					see_room_time_name: '',
					check_in_time: new Date(),
					remarks: '',
					computer_type: 1,
					proportion: '',
					fixed_price: '',
					room_thing: [{
							name: '大床',
							flag: true
						},
						{
							name: '空调',
							flag: true
						},
						{
							name: '衣柜',
							flag: true
						},
						{
							name: '梳妆台',
							flag: true
						},
						{
							name: 'WI-FI',
							flag: true
						},
						{
							name: '洗衣机',
							flag: true
						},
						{
							name: '冰箱',
							flag: true
						},
						{
							name: '沙发',
							flag: true
						},
						{
							name: '茶几',
							flag: true
						},
						{
							name: '电视机',
							flag: true
						},
						{
							name: '电磁炉',
							flag: true
						},
						{
							name: '热水器',
							flag: true
						},
						{
							name: '天然气',
							flag: true
						},
						{
							name: '阳台',
							flag: false
						}
					]
				},
				resources_from: {
					bedroom_imgs: [],
					living_room_imgs: [],
					restaurant_imgs: [],
					toilet_imgs: [],
					kitchen_imgs: [],
					function_video: [],
					property_imgs: [],
					ID_imgs: [],
					other_imgs: []
				},
				show_house_type: false,
				show_room_floor: false,
				show_room_num: false,
				show_look: false,
				show_room_type: false,
				show_orientation: false,
				show_renovation: false,
				show_room_status: false,
				show_see_room_time: false,
				show_check_in_time: false,
				show_computer_type: false,
				now_time: Number(new Date()),
				top_nav_list: [{
						name: '录房人',
					},
					{
						name: '维护人',
					},
					{
						name: '实勘人',
					}
				],
				hasBuilding: false,
				room_ids: '',
				building_id: '',

			};
		},
		async onLoad(options) {
			this.from_type = options.type || 'add';
			if (this.from_type == 'edit') {
				this.current = 2;
				this.page_title = '批量修改';
				this.room_ids = options.room_ids;
				this.building_id = options.building_id;
				this.maintain_from.room_status = '';
				this.maintain_from.room_status_name='';
			} else {
				if (!!options.building_id) {
					this.hasBuilding = true;
					this.record_from.floorId = options.building_id;
					this.record_from.floorName = options.building_name;
					await this.getFloorRoomNum(options.building_id);
					if(this.from_type == 'room_edit'){
						this.page_title = '编辑房源';
						let room_info = JSON.parse(decodeURIComponent(options.room_info));
						// 赋值房间数据
						this.room_id = room_info.id;
						this.handle_room_data(room_info)
					}
				}
			}

			let _this = this;
			uni.$on('getFloor', floorInfo => {
				console.log(floorInfo, 'floorInfo');
				_this.record_from.floorName = floorInfo.name;
				_this.record_from.floorId = floorInfo.id;
				// 获取楼栋对应数据
			    this.getFloorRoomNum(floorInfo.id);
			});
		},
		onUnload() {
			// 移除监听事件
			uni.$off('getFloor');
		},
		onReady() {},
		methods: {
			change_is_special(e){
				this.record_from.is_special = e;
			},
			handle_room_data(room_info){
				console.log(room_info,'room_info')
				this.record_from.house_type = room_info.building_type;
				this.record_from.house_type_name =  this.house_type_columns[0].find(item=>{
					return item.type == room_info.building_type*1
				}).label
				this.record_from.room_floor = room_info.ground_floor*1;
				this.record_from.room_num = room_info.room_num;
				if(!room_info.another_name){
					room_info.another_name = ''
				}
				this.record_from.another_name = room_info.another_name;
				this.record_from.key_position = room_info.key_pos;
				this.record_from.is_special = room_info.is_special==1?true:false;
				this.record_from.contact_name = room_info.name;
				this.record_from.contact_phone = room_info.phone;
				this.record_from.relationship = room_info.relation;
				this.record_from.other_info = room_info.other_info;
				this.maintain_from.room_type_name = room_info.apartment;
				this.maintain_from.orientation_name = room_info.direction;
				this.maintain_from.room_type = this.manage_charge_columns[0].find(item=>{
					return item.name ==room_info.apartment
				})
				let fit_info = room_info.fit_info.split(';');
				let room_thing = {};
				fit_info.forEach(item=>{
					room_thing[item]=true;
				})
				console.log(room_thing,'room_thing')
				let fit_info_arr = this.maintain_from.room_thing;
				for(var i=0;i<fit_info_arr.length;i++){
					if(!!room_thing[fit_info_arr[i].name]){
						fit_info_arr[i].flag=true
					}else {
						fit_info_arr[i].flag=false
					}
					
				}
				this.maintain_from.room_thing = fit_info_arr;
				this.maintain_from.room_status = room_info.status;
				this.maintain_from.room_status_name = this.room_status_columns[0].find(item=>{
					return item.type ==room_info.status*1
				}).label;
				this.maintain_from.month_price = room_info.rent*1;
				this.maintain_from.remarks = room_info.other_need;
				this.maintain_from.computer_type = room_info.commission_type;
				if(room_info.commission_type==1){
					this.maintain_from.proportion = room_info.commission_precent;
				}else {
					this.maintain_from.fixed_price = room_info.commission_precent;
				}
				if(!!room_info.function_video){
					let function_video = [],
					obj = {};
					if(room_info.function_video.indexOf(getApp().globalData.static_url)!=-1){
						obj = {
							url:room_info.function_video,
							default_url: room_info.function_video.replace(getApp().globalData.static_url,"")
						}
					}else{
						obj = {
							url:getApp().globalData.static_url + room_info.function_video,
							default_url: room_info.function_video
						}
					}
					function_video.push(obj);
					this.resources_from.function_video = function_video;
					this.show_video = true;
				}
				
				if(!!room_info.beedroom_img){
					let beedroom_img = [];
					room_info.beedroom_img.split(";").forEach(item=>{
						let obj = {
						}
						if(item.indexOf(getApp().globalData.static_url)!=-1){
							obj = {
								url:item,
								default_url: item.replace(getApp().globalData.static_url,"")
							}
						}else {
							obj = {
								url:getApp().globalData.static_url + item,
								default_url: item
							}
						}
						beedroom_img.push(obj)
					})
					this.resources_from.bedroom_imgs = beedroom_img;
				}
				
			},
			async batch_change_room() {
				let beedroom_img = this.change_resource('bedroom_imgs');
				let function_video = '';
				if (this.resources_from.function_video.length > 0) {
					function_video = this.resources_from.function_video[0].url;
				}
				let params = {
					room_ids: this.room_ids,
					building_id: this.building_id,
				};
				if(!!beedroom_img){
					params.beedroom_img = beedroom_img
				}
				if(!!function_video){
					params.function_video = function_video
				}
				if(!!this.maintain_from.room_status){
					params.status = this.maintain_from.room_status
				}
				if(!!this.maintain_from.month_price){
					params.rent = this.maintain_from.month_price
				}
				if(!!this.maintain_from.proportion||this.maintain_from.fixed_price){
					params.commission_type = this.maintain_from.computer_type
					params.commission_precent =  this.maintain_from.computer_type == 1 ? this.maintain_from.proportion:this.maintain_from.fixed_price
				}
				let data = await batchHandleRoom(params);
				uni.showToast({
					title: '修改成功',
					icon: 'none',
					duration: 1500,
					success() {
						uni.navigateBack();
					}
				})

			},
			change_current(event) {
				console.log(event, '的算法的');
				if (event.index != this.current) {
					this.current = event.index
				}
			},
			// 新增图片
			async afterRead(event) {
				//当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file),
					name = event.name;
				let fileListLen = this.resources_from[name].length;
				lists.map(item => {
					this.resources_from[name].push({
						...item,
						status: 'uploading',
						message: '上传中'
					});
				});
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url);
					let item = this.resources_from[name][fileListLen];
					this.resources_from[name].splice(fileListLen, 1, {
						url: getApp().globalData.static_url + result,
						default_url:result
					});
					fileListLen++;
				}
			},
			async afterReadVideo(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [event.file],
					name = event.name;
				let fileListLen = this.resources_from[name].length;
				lists.map(item => {
					this.resources_from[name].push({
						...item,
						status: 'uploading',
						message: '上传中'
					});
				});
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url);
					let item = this.resources_from[name][fileListLen];
					this.resources_from[name].splice(fileListLen, 1, {
						url: getApp().globalData.static_url + result,
						default_url:result
					});
					fileListLen++;
				}
				this.show_video = true;
			},
			deleteFloorImage(event) {
				let name = event.name;
				this.resources_from[name].splice(event.index, 1);
			},
			deleteFloorVideo(event) {
				let name = event.name;
				this.resources_from[name].splice(event.index, 1);
				this.show_video = false;
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: getApp().globalData.apiUrl + '/common/tool/uploadfile',
						filePath: url,
						name: 'image',
						formData: {
							lwm_sess_token: this.vuex_token,
						},
						success: res => {
							let staticData = JSON.parse(res.data);
							console.log(staticData, '的说法是');
							resolve(staticData.data.image_url);
						},
						fail: error => {
							uni.showToast({
								title: '上传失败',
								icon: 'none'
							});
						}
					});
				});
			},

			// 根据楼栋id返回楼层数和每层房间数
			async getFloorRoomNum(building_id) {
				let params = {
					building_id: building_id
				};
				let data = await buildingFloorRoom(params);
				console.log(data, '范德萨对方');
				//造数据
				let room_floor_columns = [],
					room_num_columns = [],
					manage_charge_columns = []
				room_floor_columns[0] = [];
				room_num_columns[0] = [];
				manage_charge_columns[0] = [];
				if (data.floor_num > 0) {
					for (let i = 1; i <= data.floor_num * 1; i++) {
						room_floor_columns[0].push(i)
					}
				}
				if (data.floor_room_num > 0) {
					for (let i = 1; i <= data.floor_room_num * 1; i++) {
						if (i < 10) {
							room_num_columns[0].push('0' + i)
						} else {
							room_num_columns[0].push(i)
						}

					}
				}
				let manage_charge = data.manage_charge;
				manage_charge_columns[0] = manage_charge
				this.room_floor_columns = room_floor_columns;
				this.room_num_columns = room_num_columns;
				this.manage_charge_columns = manage_charge_columns;
			},
			backPage() {
				if (this.vuex_isBind != 1) {
					let pages = getCurrentPages();
					if (pages.length > 1) {
						uni.navigateBack();
					} else {
						uni.switchTab({
							url: '/pages/index/index'
						});
					}
					return;
				}
				uni.showModal({
					title: '温馨提示',
					confirmText: '继续返回',
					cancelText: '取消返回',
					content: '返回页面后不会保留当前数据，是否确定继续',
					success(res) {
						if (!!res.confirm) {
							let pages = getCurrentPages();
							if (pages.length > 1) {
								uni.navigateBack();
							} else {
								uni.switchTab({
									url: '/pages/index/index'
								});
							}
						}
					}
				});
			},
			backIndex() {
				if (this.vuex_isBind != 1) {
					uni.switchTab({
						url: '/pages/index/index'
					});
					return;
				}
				uni.showModal({
					title: '温馨提示',
					confirmText: '继续返回',
					cancelText: '取消返回',
					content: '返回首页后不会保留当前数据，是否确定继续',
					success(res) {
						if (!!res.confirm) {
							uni.switchTab({
								url: '/pages/index/index'
							});
						}
					}
				});
			},
			async continue_click(current) {
				// 提交数据 必填的要进行判断是否有值
				if (current == 0) {
					//判断record_from 里面必填字段
					//1.判断楼栋
					if (!this.record_from.floorId) {
						uni.showModal({
							title: '温馨提示',
							content: '请先选择楼栋'
						})
						return;
					}
					//2.楼层
					if (!this.record_from.room_floor) {
						uni.showModal({
							title: '温馨提示',
							content: '必须选择房间的楼层'
						})
						return;
					}
					// 3.房号
					if (!this.record_from.room_num) {
						uni.showModal({
							title: '温馨提示',
							content: '必须选择房间的房号'
						})
						return;
					}
				}
				if (current == 1) {
					//判断maintain_from 里面必填字段
					if (!this.maintain_from.room_type_name) {
						uni.showModal({
							title: '温馨提示',
							content: '房间户型为必填项'
						})
						return;
					}
					//1.房间状态
					if (!this.maintain_from.room_status) {
						uni.showModal({
							title: '温馨提示',
							content: '房间状态为必填项'
						})
						return;
					}
					if (!this.maintain_from.month_price) {
						uni.showModal({
							title: '温馨提示',
							content: '房间月租金为必填项'
						})
						return;
					}
					if (this.maintain_from.computer_type == 1) {
						if (!this.maintain_from.proportion) {
							uni.showModal({
								title: '温馨提示',
								content: '佣金占比为必填项'
							})
							return;
						}
					}
					if (this.maintain_from.computer_type == 2) {
						if (!this.maintain_from.fixed_price) {
							uni.showModal({
								title: '温馨提示',
								content: '佣金占比为必填项'
							})
							return;
						}
					}
				}
				if (current == 2) {
					//处理图片
					let beedroom_img = this.change_resource('bedroom_imgs');
					let livingroom_img = this.change_resource('living_room_imgs');
					let diningroom_img = this.change_resource('restaurant_imgs');
					let bathroom_img = this.change_resource('toilet_imgs');
					let cookhouse_img = this.change_resource('kitchen_imgs');
					let fangchan_card_img = this.change_resource('property_imgs');
					let idcard_img = this.change_resource('ID_imgs');
					let other_img = this.change_resource('other_imgs')
					let function_video = '';
					if (this.resources_from.function_video.length > 0) {
						function_video = this.resources_from.function_video[0].default_url;
					}
					let fit_info_arr = [],
						fit_info = ''
					this.maintain_from.room_thing.forEach(item => {
						if (!!item.flag) {
							fit_info_arr.push(item.name)
						}
					})
					if (fit_info_arr.length > 1) {
						fit_info = fit_info_arr.join(';');
					} else if (fit_info_arr.length == 1) {
						fit_info = fit_info_arr[0]
					}
					// 保存房间信息
					let params = {
						room_id: this.room_id,
						building_id: this.record_from.floorId,
						building_type: this.record_from.house_type,
						qudao_type: this.record_from.channel,
						ground_floor: this.record_from.room_floor,
						room_num: this.record_from.room_num,
						door_num: this.record_from.room_floor + this.record_from.room_num,
						another_name:this.record_from.another_name,
						key_pos: this.record_from.key_position,
						is_special:this.record_from.is_special==true?1:0,
						name: this.record_from.contact_name,
						phone: this.record_from.contact_phone,
						wechat: this.record_from.contact_weixin,
						relation: this.record_from.relationship,
						is_daikan: this.record_from.look,
						other_info: this.record_from.other_info,
						room_square: this.maintain_from.area,
						apartment: this.maintain_from.room_type.name,
						bedroom_num: this.maintain_from.room_type.bedroomNum,
						livingroom_num: this.maintain_from.room_type.hallNum,
						bathroom_num: this.maintain_from.room_type.toiletNum,
						diningroom_num: 0,
						direction: this.maintain_from.orientation_name,
						fittings: this.maintain_from.renovation_name,
						fit_info: fit_info,
						status: this.maintain_from.room_status,
						rent: this.maintain_from.month_price,
						other_need: this.maintain_from.remarks,
						commission_type: this.maintain_from.computer_type,
						commission_precent: this.maintain_from.computer_type == 1 ? this.maintain_from.proportion :
							this.maintain_from.fixed_price,
						beedroom_img: beedroom_img,
						livingroom_img: livingroom_img,
						diningroom_img: diningroom_img,
						bathroom_img: bathroom_img,
						cookhouse_img: cookhouse_img,
						function_video: function_video,
						fangchan_card_img: fangchan_card_img,
						idcard_img: idcard_img,
						other_img: other_img,
					}
					let saveData = await saveRoom(params);
					if (!!saveData.room_id) {
						this.room_id = saveData.room_id;
						this.is_success = true;
					}
				} else {
					this.current = current + 1;
				}
			},
			change_resource(type) {
				let building_photo = '',
					new_floor_imgs = [];
				if (this.resources_from[type].length > 1) {
					this.resources_from[type].forEach(item => {
						new_floor_imgs.push(item.default_url)
					})
					building_photo = new_floor_imgs.join(";");
				} else {
					if (this.resources_from[type].length > 0) {
						building_photo = this.resources_from[type][0].default_url;
					}
				}
				return building_photo

			},
			//批量生成房源
			batch_create_room() {
				uni.redirectTo({
					url: '/pages/batchCreateRomm/batchCreateRomm?room_id=' + this.room_id + '&building_id=' + this
						.record_from.floorId + '&room_name=' + this.record_from.room_floor + this.record_from
						.room_num+'&rent='+this.maintain_from.month_price*1+'&apartment=' + this.maintain_from.room_type.name
				});
			},
			back_self_house() {
				uni.navigateBack()
			},
			getDate(e) {
				// console.log(e)
				const timeFormat = uni.$u.timeFormat;
				this.maintain_from.check_in_time = timeFormat(e.value, 'yyyy-mm-dd');
				this.show_check_in_time = false;
			},
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`;
				}
				if (type === 'month') {
					return `${value}月`;
				}
				if (type === 'day') {
					return `${value}日`;
				}
				return value;
			},
			choose_floor(e) {
				if (this.hasBuilding) {
					return;
				}
				uni.navigateTo({
					url: '/pages/choose_floor/choose_floor?type=self'
				});
			},
			select_house_type(e) {
				let value = e.value[0].label;
				this.record_from.house_type_name = value;
				this.record_from.house_type = e.value[0].type;
				this.show_house_type = false;
			},
			select_room_floor(e) {
				let value = e.value[0];
				this.record_from.room_floor = value;
				this.show_room_floor = false;
			},
			select_room_num(e) {
				let value = e.value[0];
				this.record_from.room_num = value;
				this.show_room_num = false;
			},
			select_look(e) {
				this.record_from.relationship = e.value[0];
				this.show_look = false;
			},
			select_room_type(e) {
				this.maintain_from.room_type_name = e.value[0].name;
				this.maintain_from.room_type = e.value[0];
				this.show_room_type = false;
			},
			select_orientation(e) {
				this.maintain_from.orientation_name = e.value[0];
				this.show_orientation = false;
			},
			select_renovation(e) {
				this.maintain_from.renovation_name = e.value[0];
				this.show_renovation = false;
			},
			select_room_status(e) {
				this.maintain_from.room_status_name = e.value[0].label;
				this.maintain_from.room_status = e.value[0].type;
				this.show_room_status = false;
			},
			select_see_room_time(e) {
				this.maintain_from.see_room_time_name = e.value[0].label;
				this.maintain_from.see_room_time = e.value[0].type;
				this.show_see_room_time = false;
			},
			select_computer_type(e) {
				this.maintain_from.computer_type = e.value[0].type;
				this.show_computer_type = false;
			},
			select_thing(index) {
				this.maintain_from.room_thing[index].flag = !this.maintain_from.room_thing[index].flag;
			}
		}
	};
</script>

<style scoped lang="scss">
	/* #ifndef APP-NVUE */
	page {
		background-color: $u-bg-color;
	}

	/* #endif */

	.u-page {
		padding: 0;
		flex: 1;
		background-color: $u-bg-color;

		&__item {
			&__title {
				color: $u-tips-color;
				background-color: $u-bg-color;
				padding: 15px;
				font-size: 15px;

				&__slot-title {
					color: $u-primary;
					font-size: 14px;
				}
			}
		}
	}

	.u-nav-slot {
		@include flex;
		align-items: center;
		justify-content: space-between;
		width: 180rpx;
		height: 60rpx;
		background: rgba(255, 255, 255, 0.39);
		border: 2rpx solid #ebebeb;
		opacity: 1;
		border-radius: 30rpx;
		padding: 0 26rpx;
	}

	.floor_video {
		width: 300rpx;
		height: 200rpx;
	}

	.create_room {
		padding-bottom: 210rpx;
	}

	.success_page {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		overflow: hidden;
	}

	.success_page_title {
		color: #000000;
		text-align: center;
		margin-bottom: 200rpx;
	}

	.success_page_func {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.success_page_func view {
		width: 250rpx;
		height: 80rpx;
		border-radius: 12rpx;
		text-align: center;
		line-height: 80rpx;
	}

	.back_house {
		border: 2rpx solid #3366ff;
		color: #3366ff;
	}

	.batch_create {
		background: #3366ff;
		color: #fff;
		margin-left: 40rpx;
	}

	.head_title {
		width: 100%;
		height: 84rpx;
		line-height: 86rpx;
		text-indent: 30rpx;
		border-bottom: 1rpx solid #eee;
		font-size: 28rpx;
		font-family: Source Han Sans CN;
		color: #888888;
	}

	.form-item_box {
		background: #fff;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

	.footer_box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		display: flex;
		z-index: 1000;
	}

	.footer_box view {
		flex: 1;
		height: 100%;
	}

	.complate_btn,
	.continue_btn {
		height: 100%;
		border-radius: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 32rpx;
		font-family: Source Han Sans CN;
	}

	.complate_btn {
		background: #7b8193;
	}

	.continue_btn {
		background: #3366ff;
	}

	.thing_box {
		padding: 30rpx 20rpx 10rpx 30rpx;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		background: #fff;
	}

	.thing_item {
		padding: 10rpx 30rpx;
		background: #f4f5f9;
		color: #7b8193;
		font-size: 28rpx;
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;
		margin-right: 10rpx;
	}

	.thing_item_active {
		background: #3366ff;
		color: #fff;
	}

	.resources_from_box {
		padding: 30rpx;
		padding-bottom: 0;
		background: #fff;
	}

	.resources_from_box_title {
		font-size: 34rpx;
		font-family: Source Han Sans CN;
		color: #000000;
		margin-bottom: 30rpx;
	}

	.resources_from_item .title {
		font-size: 28rpx;
		font-family: Source Han Sans CN;
		color: #000000;
	}
</style>
<style>
	.resources_from_item .u-form-item__body {
		padding: 0 !important;
	}

	.u-navbar--fixed {
		z-index: 1000 !important;
	}
</style>
