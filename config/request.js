// 此vm参数为页面的实例，可以通过它引用vuex中的变量
import {
	Login
} from '@/config/api.js'
module.exports = (vm) => {
	// 初始化请求配置
	uni.$u.http.setConfig((config) => {
		/* config 为默认全局配置*/
		config.baseURL = 'https://api.yhb816.com'; /* 根域名 */
		config.header = {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
		// #ifdef H5 || APP-PLUS || MP-ALIPAY || MP-WEIXIN
		config.timeout=20000;
		// #endif
		return config
	})

	// 请求拦截
	uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
		// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
		config.data = config.data || {}
		if(config.url== "/common/customer/wxlogin"){
			
		}else{
			config.data.lwm_sess_token = vm.vuex_token //token 必传 
		}
		
		// 根据custom参数中配置的是否需要token，添加对应的请求头
		if (config?.custom?.auth) {
			// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
		}
		return config
	}, config => { // 可使用async await 做异步操作
		return Promise.reject(config)
	})

	
	//重试请求队列
	let requests = []
	// 用户登录获取token、获取用户信息
	const login = function() {
		return new Promise((resolve) => {
			uni.login({
				success: async res => {
					const {
						lwm_sess_token,
						is_blind
					} = await Login({
						code: res.code
					})
					vm.$u.vuex('vuex_token',lwm_sess_token)
					vm.$u.vuex('vuex_isBind',is_blind)
					resolve()
				}
			})
		})
	}
	// 响应拦截
	uni.$u.http.interceptors.response.use(async(response) => {
		/* 对响应成功做点什么 可使用async await 做异步操作*/
		const data = response.data
		// 自定义参数
		const custom = response.config?.custom;
		// 是否正在刷新token的标记
		let isRefreshing = false;
		if (data.errcode !== 0) {
			//重新登录
			if (data.errcode == -300) {  // -300 用户token过期
				if (!isRefreshing) { // 正在刷新
					isRefreshing = true
					await login() // 重新登录（刷新token、用户信息）
					await Promise.all(requests) // 逐个按请求队列顺序重新发起请求
						.catch(err => { // 捕获请求队列里可能产生的接口异常
						})
					requests = [] // 清空请求队列
					return vm.$u.http.request(response.config)
				} else { // 同时并发出现的请求 新的token没回来之前 先用promise 存入等待队列中
					const req = function() {
						return new Promise(resolve => {
							resolve(vm.$u.http.request(response.config))
						})
					}
					requests.push(req()) // 请求存入队列
				}
			}else{
				if(!!data.errmsg){
					uni.showToast({
						title:data.errmsg,
						icon:'none',
						duration:1500
					})
				}
				
			}
		}
		return data.data === undefined ? {} : data.data
	}, (response) => {
		// 对响应错误做点什么 （statusCode !== 200）
		uni.hideLoading();
		uni.showModal({
			title:'温馨提示',
			content:response.config.url+'接口超时',
			showCancel:false
		})
		return ''
		
	})
}
