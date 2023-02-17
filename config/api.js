const http = uni.$u.http
// post请求，登录
export const Login = (params, config = {}) => http.post('/common/customer/wxlogin', params, config)

// 绑定微信手机号
export const bindPhone = (params, config = {}) => http.post('/common/customer/wxAppRegister', params, config)

// 临时手机号登录
export const phoneLogin = (params, config = {}) => http.post('/common/customer/phoneLogin', params, config)

// 分区下对应的未被认领楼栋列表接口
export const buildingList = (params, config = {}) => http.post('/common/customer/getBuildingNoEmployee', params, config)

// 中介自己认领的楼栋接口
export const selfBuildingList = (params, config = {}) => http.post('/common/customer/getBuildingByEmployee', params, config)

// 根据楼栋返回楼层数量 跟每层房间数
export const buildingFloorRoom = (params, config = {}) => http.post('/common/customer/getBuildingInfo', params, config)

// 除了中介自己所有的中介信息接口
export const employeeList = (params, config = {}) => http.post('/common/customer/getEmployeeList', params, config)

// 保存/编辑楼栋信息的接口
export const saveBuilding = (params, config = {}) => http.post('/common/customer/saveBuilding', params, config);

//保存房间接口
export const saveRoom = (params, config = {}) => http.post('/common/customer/saveRoom', params, config);

// 删除房间接口
export const deleteRoom = (params, config = {}) => http.post('/common/customer/deleteRoom', params, config);

// 批量生成房间接口
export const batchSaveRoom = (params, config = {}) => http.post('/common/customer/batchSaveRoom', params, config);

// 批量修改房间接口
export const batchHandleRoom = (params, config = {}) => http.post('/common/customer/batchHandleRoom', params, config);

// 我的楼栋列表
export const buildingInfoList = (params, config = {}) => http.post('/common/customer/getBuildingList', params, config);

//九宫格房间接口
export const roomList = (params, config = {}) => http.post('/common/customer/getRoomList', params, config);

//房间详情接口
export const getRoomInfo = (params, config = {}) => http.post('/common/customer/getRoomInfo', params, config);

// 客户模块

//客户列表
export const customerList = (params, config = {}) => http.post('/common/customer/customerList', params, config);

//新增客户
export const editCustomer = (params, config = {}) => http.post('/common/customer/editCustomer', params, config);


// 地图找房
export const searchRoomByMap = (params, config = {}) => http.post('/common/customer/searchRoomByMap', params, config);

// 推荐楼栋列表
export const recommendList = (params, config = {}) => http.post('/common/customer/recommendList', params, config);

// 录盘人所负责的楼栋
export const  getBuilding= (params, config = {}) => http.post('/common/customer/getBuilding', params, config);

// 搜索楼栋
export const  searchValue= (params, config = {}) => http.post('/common/customer/getBuildingListByKeyword', params, config);

//商圈与地铁数据
export const subwayBusiness = (params, config = {}) => http.post('/common/customer/getSubwayBusiness', params, config);
// get请求，获取菜单，注意：get请求的配置等，都在第二个参数中，详见前面解释
export const getMenu = (data) => http.get('/ebapi/public_api/index', data)