import App from './App'
import uView from '@/uni_modules/uview-ui';
import store from '@/store';
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.use(uView)
let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);
Vue.prototype.$onLaunched = new Promise(resolve => {
    Vue.prototype.$isResolve = resolve
})
const app = new Vue({
	store,
    ...App
})
// 引入请求封装，将app参数传递到配置中
require('./config/request.js')(app)
app.$mount()
// 如此配置即可
// uni.$u.config.unit = 'rpx'
