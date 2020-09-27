import axios from "axios";
import { config } from "../config/baseconf.js";

import router from "../routes/index.js";

// 提示方法

import { store } from "../store/store";

const env = process.env.NODE_ENV === "development";
const baseUrl = env ? config.dev : config.prod;

// let Loading = Spin.
// 网络请求
axios.defaults.baseURL = baseUrl;
// axios.defaults.timeout = 6000;
//http request 拦截器 请求拦截器
axios.interceptors.request.use(
  (config) => {
    store.state.loading = true; //在请求发出之前进行一些操作
    let csrftoken = window.sessionStorage.getItem("customerCsrftoken");
    let token = window.sessionStorage.getItem("customerToken");
    let productId = sessionStorage.getItem("productId");
    config.headers.common["csrftoken"] = csrftoken;
    config.headers.common["Authorization"] = "Basic-" + token;

    config.headers.common["productId"] = productId;
    return config;
  },
  (error) => {
    store.state.loading = false;
    return Promise.reject(error);
  }
);

// 响应处理  如果登录超时则返回登录页
axios.interceptors.response.use(
  (res) => {
    const { data } = res;
    const { resp } = data;

    store.state.loading = false; //关闭loading

    // const downLoadList = [
    //   "api/salesman/urlDownLoad",
    //   "api/merchantProduct/urlDownLoad"
    // ];
    // const downLoad = downLoadList.some(e => res.config.url.indexOf(e) > -1);
    // if (downLoad) {
    //   return data;
    // }
    if (
      resp.code == 403 ||
      resp.code == 404 ||
      resp.code == 405 ||
      resp.code == 406 ||
      resp.code == 407
    ) {
      // 退出清除缓存
      sessionStorage.clear();
      router.push("/login");
    }

    if (res.config.method == "post") {
      if (res.headers.csrftoken != undefined) {
        window.sessionStorage.removeItem("customerCsrftoken");
        let csrftoken = res.headers.csrftoken;
        window.sessionStorage.setItem("customerCsrftoken", csrftoken);
      }
    }
    if (data.result == "SUCCESS") {
      return resp;
    } else {
      // message.error(data.message);
    }
  },
  (error) => {
    // store.state.loading = false; //关闭loading
    // message.error("系统异常，请检查网路是否正常");
    return Promise.reject(error);
  }
);

class Ajax {
  constructor() {
    this.$http = axios;
    //   默认请求头
    this.dataMethodDefaults = {
      headers: {
        "Content-Type": "application/json;",
      },
    };
  }

  get(url, config = {}) {
    return this.$http.get(url, config);
  }

  post(url, data = {}, config = {}) {
    return this.$http.post(url, data, {
      ...this.dataMethodDefaults,
      ...config,
    });
  }

  put(url, data = undefined, config = {}) {
    return this.$http.put(url, data, {
      ...this.dataMethodDefaults,
      ...config,
    });
  }

  delete(url, config = {}) {
    return this.$http.delete(url, config);
  }
}

export const $http = new Ajax();
