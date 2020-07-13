import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/views/layout/Layout';
require('./_import_development')('userManagement/roleManagement');

Vue.use(Router);

export const constantRouterMap = [
  {
    name: 'login',
    path: '/login',
    component: require('./_import_development')('login/index'),
    hidden: true,
    meta: {
      title: '登录',
      icon: 'iconfont icon-zhuye'
    }
  },
  {
    name: 'authredirect',
    path: '/authredirect',
    component: require('./_import_development')('login/authredirect'),
    hidden: true,
    meta: {
      title: 'authredirect',
      icon: 'iconfont icon-zhuye'
    }
  },
  {
    name: 'onlineMonitor',
    path: '/onlineMonitor',
    component: require('./_import_development')(
      'OrderManagement1/OnlineMonitor'
    ),
    hidden: true,
    meta: {
      title: 'authredirect',
      icon: 'iconfont icon-zhuye'
    }
  },
  {
    name: 'vehicleTrack',
    path: '/vehicleTrack',
    component: require('./_import_development')(
      'OrderManagement1/VehicleTrack'
    ),
    hidden: true,
    meta: {
      title: 'authredirect',
      icon: 'iconfont icon-zhuye'
    }
  },

  // {
  // 	name: "exceptionDetail",
  // 	path: '/exceptionDetail',
  // 	component: require('./_import_development')('OrderManagement1/ExceptionDetail'),
  // 	hidden: true,
  // 	meta: {
  // 		title: 'authredirect',
  // 		icon: 'iconfont icon-zhuye',
  // 		noCache: true
  // 	}
  // },
  {
    name: 'OrderManagement1',
    path: '/OrderManagement',
    component: Layout, //require('./_import_development')('OrderManagement1/ExceptionDetail'),
    hidden: true,
    meta: {
      title: '异常处理',
      icon: 'iconfont icon-zhuye'
    },
    props: true,
    children: [
      {
        name: 'exceptionDetail',
        path: 'exceptionDetail/:ordIdx',
        component: require('./_import_development')(
          'OrderManagement1/ExceptionDetail'
        ),
        hidden: true,
        meta: {
          title: '异常详情',
          icon: 'iconfont icon-zhuye'
        },
        props: true
      }
    ]
  },
  {
    name: 'wmsQuery',
    path: '/WmsQuery',
    component: Layout, //require('./_import_development')('OrderManagement1/ExceptionDetail'),
    hidden: true,
    meta: {
      title: 'Wms查询管理',
      icon: 'iconfont icon-zhuye'
    },
    props: true,
    children: [
      {
        name: 'WmsOrderApprovalInfo',
        path: 'WmsOrderApprovalInfo/:docEntry',
        component: require('./_import_development')(
          'wmsQuery/WmsOrderApprovalInfo'
        ),
        hidden: true,
        meta: {
          title: '领用申请单审核',
          icon: 'iconfont icon-zhuye',
          keepAlive: true
        },
        props: true
      },
      {
        name: 'wmsCheckReportDt',
        path: 'wmsCheckReportDt',
        component: require('./_import_development')(
          'wmsQuery/wmsCheckReportDt'
        ),
        hidden: true,
        meta: {
          title: '盘点报告单明细',
          icon: 'iconfont icon-zhuye',
          keepAlive: true
        },
        props: true
      },
      {
        name: 'wmsAccountCheckDt',
        path: 'wmsAccountCheckDt',
        component: require('./_import_development')(
          'wmsQuery/wmsAccountCheckDt'
        ),
        hidden: true,
        meta: {
          title: '对账报表明细',
          icon: 'iconfont icon-zhuye',
          keepAlive: true
        },
        props: true
      }
    ]
  },
  {
    name: 'CheckManagement',
    path: '/CheckManagement',
    component: Layout, //require('./_import_development')('OrderManagement1/ExceptionDetail'),
    hidden: true,
    meta: {
      title: '盘点任务管理',
      icon: 'iconfont icon-zhuye'
    },
    props: true,
    children: [
      {
        name: 'checkTaskDt',
        path: 'checkTaskDt',
        component: require('./_import_development')(
          'checkManagement/checkTaskDt'
        ),
        hidden: true,
        meta: {
          title: '盘点任务明细',
          icon: 'iconfont icon-zhuye',
          keepAlive: true
        },
        props: true
      }
    ]
  },
  {
    name: 'WoMallManagement',
    path: '/WoMallManagement',
    redirect: '/WoMallManagement/ExpressCostPrice',
    component: Layout, //require('./_import_development')('OrderManagement1/ExceptionDetail'),
    hidden: true,
    meta: {
      title: '联通商城项目管理',
      icon: 'iconfont icon-zhuye'
    },
    props: true,
    children: [
      {
        name: 'MessageQueue',
        path: 'MessageQueue',
        component: require('./_import_development')(
          'WoMallManagement/MessageQueue'
        ),
        hidden: true,
        meta: {
          title: '物流单详情',
          icon: 'iconfont icon-zhuye',
          keepAlive: true
        },
        props: true
      },
      {
        name: 'LogisticsOrderInfo',
        path: 'LogisticsOrderInfo',
        component: require('./_import_development')(
          'WoMallManagement/LogisticsOrderInfo'
        ),
        hidden: true,
        meta: {
          title: '物流单详情',
          icon: 'iconfont icon-zhuye',
          keepAlive: true
        },
        props: true,
        children: [
          {
            name: 'relateUserInfo',
            path: 'relateUserInfo/:orderNO',
            component: require('./_import_development')(
              'WoMallManagement/RelateUserInfo'
            ),
            hidden: true,
            meta: {
              title: '下单、寄件、收件人',
              icon: 'iconfont icon-zhuye',
              keepAlive: true,
              hidden: true
            },
            props: true
          },
          {
            name: 'goodInfo',
            path: 'goodInfo/:orderNO',
            component: require('./_import_development')(
              'WoMallManagement/GoodInfo'
            ),
            hidden: true,
            meta: {
              title: '商品信息',
              icon: 'iconfont icon-zhuye',
              keepAlive: true,
              hidden: true
            },
            props: true
          },
          {
            name: 'mallPushInfo',
            path: 'mallPushInfo/:orderNO',
            component: require('./_import_development')(
              'WoMallManagement/MallPushInfo'
            ),
            hidden: true,
            meta: {
              title: '商城推送',
              icon: 'iconfont icon-zhuye',
              keepAlive: true,
              hidden: true
            },
            props: true
          },
          {
            name: 'takeCargoInfo',
            path: 'takeCargoInfo/:orderNO',
            component: require('./_import_development')(
              'WoMallManagement/TakeCargoInfo'
            ),
            hidden: true,
            meta: {
              title: '取件信息',
              icon: 'iconfont icon-zhuye',
              keepAlive: true,
              hidden: true
            },
            props: true
          },
          {
            name: 'electronicContract',
            path: 'electronicContract/:orderNO',
            component: require('./_import_development')(
              'WoMallManagement/ElectronicContract'
            ),
            hidden: true,
            meta: {
              title: '电子合同信息',
              icon: 'iconfont icon-zhuye',
              keepAlive: true,
              hidden: true
            },
            props: true
          },
          {
            name: 'additionFee',
            path: 'additionFee/:orderNO',
            component: require('./_import_development')(
              'WoMallManagement/AdditionFee'
            ),
            hidden: true,
            meta: {
              title: '追加费用信息',
              icon: 'iconfont icon-zhuye',
              keepAlive: true,
              hidden: true
            },
            props: true
          },
          {
            name: 'deliverRejection',
            path: 'deliverRejection/:orderNO',
            component: require('./_import_development')(
              'WoMallManagement/DeliverRejection'
            ),
            hidden: true,
            meta: {
              title: '妥投/拒收信息',
              icon: 'iconfont icon-zhuye',
              keepAlive: true,
              hidden: true
            },
            props: true
          },
          {
            name: 'cancelConfirm',
            path: 'cancelConfirm/:orderNO',
            component: require('./_import_development')(
              'WoMallManagement/CancelConfirm'
            ),
            hidden: true,
            meta: {
              title: '取消结果确认',
              icon: 'iconfont icon-zhuye',
              keepAlive: true,
              hidden: true
            },
            props: true
          },
          {
            name: 'shipmentConfirm',
            path: 'shipmentConfirm/:orderNO',
            component: require('./_import_development')(
              'WoMallManagement/ShipmentConfirm'
            ),
            hidden: true,
            meta: {
              title: '确认发货信息',
              icon: 'iconfont icon-zhuye',
              keepAlive: true,
              hidden: true
            },
            props: true
          },
          {
            name: 'logisticsTracking',
            path: 'logisticsTracking/:orderNO',
            component: require('./_import_development')(
              'WoMallManagement/LogisticsTracking'
            ),
            hidden: true,
            meta: {
              title: '物流追踪信息',
              icon: 'iconfont icon-zhuye',
              keepAlive: true,
              hidden: true
            },
            props: true
          }
        ]
      }
    ]
  },
  {
    name: '404',
    path: '/404',
    component: require('./_import_development')('errorPage/404'),
    hidden: true,
    meta: {
      title: '404',
      icon: 'iconfont icon-zhuye',
      keepAlive: true
    }
  },
  {
    name: '401',
    path: '/401',
    component: require('./_import_development')('errorPage/401'),
    hidden: true,
    meta: {
      title: '401',
      icon: 'iconfont icon-zhuye',
      noCache: true
    }
  },

  {
    path: '',
    name: 'all',
    component: Layout,
    redirect: 'home',
    children: [
      {
        path: 'home',
        component: require('./_import_development')('welcome/index'),
        name: 'home',
        meta: {
          title: '首页',
          icon: 'iconfont icon-zhuye',
          noCache: true
        }
      }
    ]
  }
];

export const asyncRouterMap = [
  // {
  // 	path: '/orderTrajectoryQuery',
  // 	component: Layout,
  // 	redirect: '/orderTrajectoryQuery/index',
  // 	name: 'orderTrajectoryQuery',
  // 	meta: {
  // 		title: '订单轨迹查询',
  // 		icon: 'iconfont icon-guiji',
  // 		roles: ['admin']
  // 	},
  // 	children: [{
  // 		path: 'index',
  // 		component: require('./_import_development')('orderTrajectoryQuery/index'),
  // 		name: 'orderTrajectoryQueryChild',
  // 		meta: {
  // 			title: '订单轨迹查询',
  // 			icon: 'iconfont icon-guiji',
  // 			noCache: true,
  // 			roles: ['admin']
  // 		}
  // 	}]
  // },
  // {
  // 	path: '/orderReturnQuery',
  // 	component: Layout,
  // 	redirect: '/orderReturnQuery/index',
  // 	name: 'orderReturnQuery',
  // 	meta: {
  // 		title: '订单回单查询',
  // 		icon: 'iconfont icon-dingdan',
  // 		roles: ['admin']
  // 	},
  // 	children: [{
  // 		path: 'index',
  // 		component: require('./_import_development')('orderReturnQuery/index'),
  // 		name: 'orderReturnQueryChild',
  // 		meta: {
  // 			title: '订单回单查询',
  // 			icon: 'iconfont icon-dingdan',
  // 			noCache: true,
  // 			roles: ['admin']
  // 		}
  // 	}]
  // },
  // {
  // 	path: '/charts',
  // 	component: Layout,
  // 	redirect: 'noredirect',
  // 	name: 'charts',
  // 	meta: {
  // 	  title: 'charts',
  // 	  icon: 'iconfont icon-quanxianguanli'
  // 	},
  // 	children: [
  // 	  { path: 'keyboard', component: _import('charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
  // 	  { path: 'line', component: _import('charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
  // 	  { path: 'mixchart', component: _import('charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
  // 	]
  //   },
  // {
  // 	path: '/mapTrajectoryDetails',
  // 	component: Layout,
  // 	component: require('./_import_development')('orderTrajectoryQuery/mapTrajectoryDetails'),
  // 	name: 'mapTrajectoryDetails',
  // 	meta: {
  // 		title: '地图轨迹详情',
  // 		icon: 'iconfont icon-dingdan',
  // 	}
  // },
  {
    path: '/userManagement',
    component: Layout,
    redirect: 'noredirect',
    name: 'userManagement',
    meta: {
      title: '用户权限管理',
      icon: 'iconfont icon-quanxianguanli',
      roles: ['Customer']
    },
    children: [
      {
        path: 'index',
        component: require('./_import_development')('userManagement/users'),
        name: 'userList',
        meta: {
          title: '用户列表',
          icon: 'iconfont icon-yonghuliebiao',
          roles: ['Customer']
        }
      },
      {
        path: 'roleManagement',
        component: require('./_import_development')(
          'userManagement/roleManagement'
        ),
        name: 'roleManagement',
        meta: {
          title: '角色管理',
          icon: 'iconfont icon-jiaoseziliao',
          roles: ['Customer']
        }
      },
      {
        path: 'menus',
        component: require('./_import_development')('userManagement/menus'),
        name: 'menus',
        meta: {
          title: '菜单管理',
          icon: 'iconfont icon-caidan',
          roles: ['Customer']
        }
      },
      {
        path: 'modules',
        component: require('./_import_development')('userManagement/modules'),
        name: 'modules',
        meta: {
          title: '模块管理',
          icon: 'iconfont icon-mokuai',
          roles: ['Customer']
        }
      },
      {
        path: 'modifyPassword',
        component: require('./_import_development')(
          'userManagement/modifyPassword'
        ),
        name: 'modifyPassword',
        meta: {
          title: '修改密码',
          icon: 'iconfont icon-xiugaimima',
          roles: ['Customer']
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
];

export const localRouter = [
  {
    path: '*',
    redirect: '/404',
    hidden: true
  },
  {
    path: '/mapTrajectoryDetails',
    //component: Layout,
    component: require('@/views/orderManagement/mapTrajectoryDetails.vue')
      .default,
    name: 'mapTrajectoryDetails',
    meta: {
      title: '地图轨迹详情',
      icon: 'iconfont icon-dingdan'
    }
  },
  {
    path: '/TaskList',
    name: 'TaskList',
    component: Layout,
    meta: {
      icon: 'iconfont icon-caidan1',
      title: '任务列表'
    },
    redirect: 'noredirect',
    children: [
      {
        path: 'ExportTaskList',
        component: require('./_import_development')('TaskList/ExportTaskList'),
        name: 'ExportTaskList',
        meta: {
          title: '导出任务进度',
          icon: 'el-icon-time',
          noCache: true
        }
      }
    ]
  }
];

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  //   scrollBehavior: () => ({
  // 		y: 0
  // 	}),
  routes: constantRouterMap
});
