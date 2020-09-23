export default{
	"PROTOCOLTYPE": "http",			// 协议类型
	"DOMAIN": "backmanage.chhtf.com:8080/store",	// 默认的后端接口域名  192.168.0.106:8080/hmp/  window.100tp.cn:8680/hmp/
	
	"PORT": "",						// 默认的后端域名端口号
	"SUCCESS_CODE": 1,			// 请求接口成功状态码

	"IMG_SERVER":"http://backmanage.chhtf.com:8180/",     //图片显示服务器

	"URL_COMODITYINFO_FINDBYID":"/commodityinfo/findById",    //商品详情
	"URL_COMODITYINFO_FINDBYPAGE":"/commodityinfo/findByPage",    //分页查询商品

	"URL_SHOPPINGCART_ADD":"/shoppingcart/add",			//增加至购物车
	"URL_SHOPPINGCART_UPDATE":"/shoppingcart/update",		//更新购物车
	"URL_SHOPPINGCART_DELETEBYID":"/shoppingcart/deleteById", //删除购物车商品
	"URL_SHOPPINGCART_FINDBYID":"/shoppingcart/findById",		//根据id查购物车信息
	"URL_SHOPPINGCART_FINDBYPAGE":"/shoppingcart/findShoppingCartListByOpenid",	//分页查购物车数据

	"URL_WEIXIN_LOGIN":"/wxuserinfo/login",
	"URL_USER_INFO_BYOPENID":"/wxuserinfo/findWxuserInfoByOpenid",

	"URL_ADDRESS_ADD":"/receiveraddress/add",
	"URL_ADDRESS_UPDATE":"/receiveraddress/update",
	"URL_ADDRESS_FINDBYID":"/receiveraddress/findById",
	"URL_ADDRESS_FINDBYPAGE":"/receiveraddress/findReceiverAddressListByOpenid",
	"URL_ADDRESS_DELETEBYID":"/receiveraddress/deleteById",
	"URL_UPDATE_DEFAULT_ADDRESS":"/receiveraddress/updateDefaultReceiverAddress",

	"URL_ACCOUNTINFO_FIND_BYOPENID":"/accountinfo/findAccountInfoByOpenid",

	"URL_ORDER_ADD":"/orderinfo/add",
	"URL_ORDER_UPDATE":"/orderinfo/cancelForOrder",
	"URL_ORDER_DELETEBYID":"/orderinfo/deleteById",
	"URL_ORDER_FINDBYID":"/orderinfo/findById",
	"URL_ORDER_FINDBYPAGE":"/orderinfo/findByPage",
	"URL_ORDER_PAYFORORDER":"/orderinfo/payForOrder",

	"URL_FIND_MY_CARD":"/cardinfo/findCardInfoListByOpenid",
	"URL_BIND_CARD":"/cardinfo/bindingCardForWxuser",
	"URL_CARD_FINDBYID":"/cardinfo/findById",

	"URL_CREATE_RECHARGE_RECORD":"/rechargerecord/createRechargeRecord",
	"URL_RECHARGE_CONFIRM":"/rechargerecord/rechargeConfirm",
	"URL_RECHARGERECORD_FINDBYPAGE":"/rechargerecord/findByPage",
	"URL_FIND_RECHARGERECORDLIST_BYOPENID":"/rechargerecord/findRechargeRecordListByOpenid",
	"URL_DELETERECHARGERECCORDBYRECHARGENUMBER":"/rechargerecord/deleteRechargeRecordByRechargeNumber",

	"URL_WXPAY_RECHARGE_RECORD":"/wxpayRechargeRecord",

	"URL_FIND_CONSUMPTIONRECORDLIST_BYOPENID":"/consumptionrecord/findConsumptionRecordListByOpenid",

	"URL_FIND_BOARDINFOLIT_BYBORADTYPE":"/boardinfo/findBoardInfoListByBoardType",

	"URL_FIND_BOARDIMAGESLIST_BYBOARDID":"/boardimages/findBoardImagesListByBoardId",

	"URL_GET_OPENID":"https://pay.chhtf.com/store/findOpenidByCode"

}