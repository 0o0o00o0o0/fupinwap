import Vue from 'vue'
import Router from 'vue-router'
import navContainer from '@/components/navContainer/navContainer'
import index from '@/components/index/index'
import fupin from '@/components/index/fupin'
import classi from '@/components/classi/classi'
import shoppingCart from '@/components/shoppingCart/shoppingCart'
import personal from '@/components/personal/personal'
import myCard from '@/components/myCard/myCard'
import addCard from '@/components/myCard/addCard'
import cardDetail from '@/components/myCard/cardDetail'
import productDetail from '@/components/product/productDetail'
import addressList from '@/components/address/addressList'
import addAddress from '@/components/address/addAddress'
import editAddress from '@/components/address/editAddress'
import productList from '@/components/product/productList'
import searchProductList from '@/components/product/searchProductList'
import login from '@/components/login/login'
import error from '@/components/login/error'
import confirmOrder from '@/components/order/confirmOrder'
import orderDetail from '@/components/order/orderDetail'
import orderList from '@/components/order/orderList'
import myFuBag from '@/components/myFuBag/myFuBag'
import faceValueItem from '@/components/myFuBag/faceValueItem'
import accountRecord from '@/components/myFuBag/accountRecord'
import festival from '@/components/product/festival'
import recordList from '@/components/myFuBag/recordList'
import comList from '@/components/comList/comList'
import code from '@/components/login/code'
import evaluate from '@/components/evaluate/evaluate'
import afterSale from '@/components/afterSale/afterSale'
import active from '@/components/active/active'
import video from '@/components/video/video';
import evaluat from '@/components/order/evaluate'
import fastVue from '@/components/fast/fastv'
import giftBag from '@/components/index/giftBag'
import temporary from '@/components/temporary/temporary'
import go1 from '@/components/temporary/1go'
import go5 from '@/components/temporary/5go'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'navContainer',
      component: navContainer,
      redirect: '/navContainer/login',
      children: [
        {
          path: '/navContainer/login',
          name: 'login',
          component: login
        },
        {
          path: '/navContainer/index',
          name: 'index',
          component: index
        },
        // {
        // 	path: '/navContainer/classi',
        // 	name: 'classi',
        // 	component: classi
        // },
        {
          path: '/navContainer/fupin',
          name: 'fupin',
          component: fupin
        },   {
          path: '/navContainer/video',
          name: 'video',
          component: video
        },
        {
          path: '/navContainer/shoppingCart',
          name: 'shoppingCart',
          component: shoppingCart
        },
        {
          path: '/navContainer/personal',
          name: 'personal',
          component: personal
        },
        {
          path: '/navContainer/giftBag',
          name: 'giftBag',
          component: giftBag
        },
        {
          path: '/productList',
          name: 'productList',
          component: productList
        },
        {
          path: '/orderDetail',
          name: 'orderDetail',
          component: orderDetail
        },
        {
          path: '/orderList',
          name: 'orderList',
          component: orderList
        }, {
          path: '/comList',
          name: 'comList',
          component: comList
        }, {
          path: '/evaluate',
          name: 'evaluate',
          component: evaluate
        }, {
          path: '/afterSale',
          name: 'afterSale',
          component: afterSale
        }
      ]
    },
    {
      path: '/evaluat',
      name: 'evaluat',
      component: evaluat
    },
    {
      path: '/addCard',
      name: 'addCard',
      component: addCard
    },
    {
      path: '/productDetail',
      name: 'productDetail',
      component: productDetail
    },
    {
      path: '/addressList',
      name: 'addressList',
      component: addressList
    },
    {
      path: '/addAddress',
      name: 'addAddress',
      component: addAddress
    },
    {
      path: '/editAddress',
      name: 'editAddress',
      component: editAddress
    },
    {
      path: '/searchProductList',
      name: 'searchProductList',
      component: searchProductList
    },
    {
      path: '/confirmOrder',
      name: 'confirmOrder',
      component: confirmOrder
    },
    {
      path: '/cardDetail',
      name: 'cardDetail',
      component: cardDetail
    },
    {
      path: '/accountRecord',
      name: 'accountRecord',
      component: accountRecord
    },
    {
      path: '/festival',
      name: 'festival',
      component: festival
    },
    {
      path: '/error',
      name: 'error',
      component: error
    },
    {
      path: '/myFuBag',
      name: 'myFuBag',
      component: myFuBag
    },
    {
      path: '/recordList',
      name: 'recordList',
      component: recordList
    },
    {
      path: '/faceValueItem',
      name: 'faceValueItem',
      component: faceValueItem
    },
    {
      path: '/myCard',
      name: 'myCard',
      component: myCard
    },
    {
      path: '/code',
      name: 'code',
      component: code
    },
    {
      path: '/active',
      name: 'active',
      component: active
    },
    {
      path: '/temporary',
      name: 'temporary',
      component: temporary
    },
    {
      path: '/go1',
      name: 'go1',
      component: go1
    },
    {
      path: '/go5',
      name: 'go5',
      component: go5
    },
    {
      path: '/fast',
      name: 'fast',
      component: fastVue
    },
  ]
})
