/**
 * http配置
 */
// 引入axios以及element ui中的loading和message组件
import axios from 'axios';
import Vant from 'vant'
import { Toast } from 'vant';
import 'vant/lib/index.css'
import ApiKey from './apiKey';
import Config from './globalConfig';

function RequestService() {
  this.defConf = {
    protocol: ApiKey.PROTOCOLTYPE,                        // 协议
    domain: ApiKey.DOMAIN,                                // 域名
    port: ApiKey.PORT,                                    // 端口号
    timeout: Config.API_TIMEOUT,                          // 请求超时
    needLoading: true,                                    // 是否需要加载中遮罩,默认需要
    ignoreMsg: false,                                     // 是否不处理错误信息,默认处理
    data: {}
  };
}

/**
 * 生成实例对象
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
RequestService.prototype.instanceObj = function(){
  this.instance = axios.create({
    baseURL: this.opt.baseUrl,
    timeout: this.opt.timeout,
    headers: {'Content-Type': 'application/json'}
  });

  var that = this;

  // 发起请求之前的操作，即服务端响应之前，类似于ajax的beforeSend函数
  this.instance.interceptors.request.use(config => {
    // element ui Loading方法
    if(that.opt.needLoading) {
      //that.loadinginstace = Loading.service({ fullscreen: true });
      Toast.loading({
        mask: true,
        message: '数据请求中...',
        duration: 2000
      });
    }
    // todo 如果需要在请求参数或者header中添加额外的信息,则在此处理
    return config;
  }, error => {
    // todo 待完善
    if(that.opt.needLoading) {
      //that.loadinginstace.close();
      Toast.clear();
    }
    /*Message.error({
      message: '加载失败',// todo 需要做翻译，此处还未发起接口请求就已经报错了
    });*/
    Toast.fail('加载失败');
    return Promise.reject(error);
  });

  // 添加响应拦截器，即服务端响应之后，类似于ajax的complete函数
  this.instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if(that.opt.needLoading) {
      //that.loadinginstace.close();
      Toast.clear();
    }
    return response;
  }, function (error) {
    // 对响应错误做点什么
    if(that.opt.needLoading) {
      that.loadinginstace.close();
    }
    return Promise.reject(error);
  });
};

/**
 * 设置配置信息
 * @param {[type]} opt [description]
 */
RequestService.prototype.setConf = function(opt) {
  var protocol = opt.protocol || this.defConf.protocol;                       // 协议
  var domain = opt.domain || this.defConf.domain;                                 // 域名
  var port = opt.port || this.defConf.port;                                       // 端口号
  var baseUrl = protocol + "://" + domain;
  baseUrl = port ? (baseUrl + ":" + port) : baseUrl;

  opt.baseUrl = opt.baseUrl || baseUrl;
  opt.url = opt.url || ApiKey[opt.urlKey];
  opt.timeout = opt.timeout || this.defConf.timeout;
  opt.needLoading = opt.needLoading == undefined ? this.defConf.needLoading : opt.needLoading;  // 是否需要加载中遮罩,默认需要
  opt.ignoreMsg = opt.ignoreMsg || this.defConf.ignoreMsg;                                   // 是否不处理错误信息,默认处理
  opt.data = opt.data || this.defConf.data;

  this.opt = opt;

  this.instanceObj();
  /*if(this.opt.baseUrl != opt.baseUrl || !this.instance) {
    this.instanceObj();
  }*/
}

/**
 * GET请求
 * @return {[type]} [description]
 */
RequestService.prototype.get = function() {
  var that = this;
  return this.instance.get(this.opt.url, this.opt).then(function(response) {
    if(response.data.success == ApiKey.SUCCESS_CODE) {
      return Promise.resolve(response.data);
    } else {
      // 如果配置信息里面需要弹出错误信息，才提示，否则忽略，默认为需要弹出
      if(!that.opt.ignoreMsg) {
        Message.error({
          message: response.data.errorMsg
        });
      }
      return Promise.reject(response);
    }
  }).catch(function(error) {
    if(!that.opt.ignoreMsg) {
      if(response.errorMsg && (response.errorMsg.length>0 && response.errorMsg.length<60)){
        Toast.fail(response.errorMsg);
      }else{
        Toast.fail('接口请求有误！');
      }
    }
    return Promise.reject(error);
  });
}

/**
 * GET请求，不做回调处理
 * @return {[type]} [description]
 */
RequestService.prototype.getNoCall = function(opt) {
  this.setConf(opt);
  this.opt.dataNeedJson = opt.dataNeedJson || false;
  return this.instance.get(this.opt.url, this.opt);
}

/**
 * POST请求
 * @return {[type]} [description]
 */
RequestService.prototype.post = function() {
  if(this.opt.dataNeedJson) {
    this.opt.data = JSON.stringify(this.opt.data);
  }
  var that = this;
  return this.instance.post(this.opt.url, this.opt.data, this.opt).then(function(response) {
    if(response.data.success == 1) {
      return Promise.resolve(response.data);
    } else {
      // 如果配置信息里面需要弹出错误信息，才提示，否则忽略，默认为需要弹出
      if(!that.opt.ignoreMsg) {
        if(response.data){
          Message.error({
            message: response.data.message
          });
        }
      }
      return Promise.reject(response);
    }
  }).catch(function(error) {
    if(!that.opt.ignoreMsg) {
      if(response.errorMsg && (response.errorMsg.length>0 && response.errorMsg.length<60)){
        Toast.fail(response.errorMsg);
      }else{
        Toast.fail('接口请求有误！');
      }
    }
    return Promise.reject(error);
  });
};

/**
 * POST请求，不做回调处理
 * @return {[type]} [description]
 */
RequestService.prototype.postNoCall = function(opt) {
  this.setConf(opt);
  this.opt.dataNeedJson = opt.dataNeedJson == undefined ? true : opt.dataNeedJson;
  if(this.opt.dataNeedJson) {
    this.opt.data = JSON.stringify(this.opt.data);
  }
  return this.instance.post(this.opt.url, this.opt.data, this.opt);
};

/**
 * 批量请求
 * @return {[type]} [description]
 */
RequestService.prototype.all = function(confArr) {
  var requestArr = [], confObj;
  var that = this;
  for(var i = 0, len = confArr.length; i < len; i++) {
    confObj = confArr[i];
    switch (confObj.type) {
      case "post":
        requestArr.push(that.postNoCall(confObj));
        break;
      default:
        requestArr.push(that.getNoCall(confObj));
        break;
    }
  }
  axios.all(requestArr)
  .then(axios.spread(function (argument) {
    // 所有请求都执行完成
    console.log(argument);
  }))
  .catch(axios.spread(function (argument) {
    // 请求执行失败
    console.log(argument);
  }));
};

var requestObj;

export default {
  init: function() {
    requestObj = new RequestService();
  },
  post: function(opt){
    opt = opt || {};
    requestObj = requestObj || new RequestService();
    requestObj.setConf(opt);
    requestObj.opt.dataNeedJson = opt.dataNeedJson == undefined ? true : opt.dataNeedJson;
    return requestObj.post();
  },
  get: function(opt){
    opt = opt || {};
    requestObj = requestObj || new RequestService();
    requestObj.setConf(opt);
    requestObj.opt.dataNeedJson = opt.dataNeedJson || false;
    return requestObj.get();
  },
  all: function(confArr) {
    /**
     * confArr 里面任意对象
     *   每一个属性都参考opt即可
     */
    confArr = confArr || [];
    requestObj = requestObj || new RequestService();
    return requestObj.all(confArr);
  }
}