import { loginByUsername } from '@/api/login';
import { getUserInfo, setUserInfo, getToken } from '@/utils/auth';
// import { userInfo } from 'os';
import { getKpiInfo } from '@/api/yuebao/kpiBase';
const user = {
  state: {
    name: getUserInfo().realName || '',
    avatar: require('@/assets/images/user.png'), //login_bg2.jpg,account.png; https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=518199616,1801304562&fm=27&gp=0.jpg
    roles: [],
    token: getToken(),
    usersInfo: null,
    userDepartments: [],
    deptCode: '',
    regionCode: ''
  },
  getters: {
    userInfo: state => {
      if (!state.usersInfo) {
        state.usersInfo = getUserInfo();
      }
      return state.usersInfo;
    },
    userDepartments: state => {
      if (!(state.userDepartments && state.userDepartments.lenth)) {
        let deptFromLocal = sessionStorage.getItem('userDepartments');
        deptFromLocal = deptFromLocal || '[]';
        state.userDepartments = JSON.parse(deptFromLocal);
      }
      return state.userDepartments;
    },
    deptCode: state => {
      if (!state.deptCode) {
        state.deptCode = sessionStorage.getItem('deptCode');
      }
      return state.deptCode;
    },
    regionCode: state => {
      if (!state.regionCode) {
        state.regionCode = sessionStorage.getItem('regionCode');
      }
      return state.regionCode;
    }
  },
  mutations: {
    SET_USER_INFO: (state, usersInfo) => {
      state.usersInfo = usersInfo;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USER_ID: (state, userId) => {
      state.userId = userId;
    },
    SET_RIGHTS_TYPE: (state, rightsType) => {
      state.rightsType = rightsType;
    },
    SET_USER_DEPARTMENTS: (state, userDepartments2) => {
      state.userDepartments = [];
      state.userDepartments.push(userDepartments2);
      sessionStorage.setItem(
        'userDepartments',
        JSON.stringify(userDepartments2)
      );
    },
    SET_DEPTCODE: (state, deptCode) => {
      state.deptCode = deptCode;
      sessionStorage.setItem('deptCode', deptCode);
    },
    SET_REGIONCODE: (state, regionCode) => {
      state.regionCode = regionCode;
      sessionStorage.setItem('regionCode', regionCode);
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, loginForm) {
      return new Promise((resolve, reject) => {
        loginByUsername(loginForm)
          .then(response => {
            if (response.data.resultCode === 1) {
              let data = response.data.data;
              // console.dir(data);
              commit('SET_AVATAR', require('@/assets/images/user.png'));
              commit('SET_USER_INFO', data);
              commit('SET_NAME', data.realName);
              commit('SET_ROLES', data.userType);
              commit('SET_USER_ID', data.userId);
              commit('SET_TOKEN', data.token);
              commit('SET_RIGHTS_TYPE', data.rightsType);
              setUserInfo(data); //写入用户信息到localstorage
              getKpiInfo({
                type: 3
              })
                .then(res => {
                  if (res.data.resultCode === 1) {
                    let userDepartments = res.data.data.depart;
                    commit('SET_USER_DEPARTMENTS', userDepartments);
                    console.log('101');
                  }
                  resolve(response);
                })
                .catch(() => {
                  reject(response);
                });

              return;
            }
            reject(response);
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 获取用户信息
    // GetUserInfo({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getUserInfo(state.token).then(response => {
    //       if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
    //         reject('error')
    //       }
    //       const data = response.data
    //       commit('SET_ROLES', data.roles)
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // logout(state.usersInfo).then(() => {
        commit('SET_TOKEN', '');
        commit('SET_USER_ID', -1);
        commit('SET_ROLES', []);
        commit('SET_USER_INFO', []);
        sessionStorage.removeItem('userInfo');
        sessionStorage.removeItem('asyncRouterMapData');
        resolve();
        // }).catch(error => {
        //   reject(error)
        // })
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        resolve();
      });
    }

    //获取Wms用户权限
    // GetUserDepartments({ commit, state }) {}

    // 动态修改权限
    // ChangeRoles({ commit }, role) {
    //   return new Promise(resolve => {
    //     commit('SET_TOKEN', role)
    //     setToken(role)
    //     getUserInfo(role).then(response => {
    //       const data = response.data
    //       commit('SET_ROLES', data.roles)
    //       commit('SET_NAME', data.name)
    //       commit('SET_AVATAR', data.avatar)
    //       commit('SET_INTRODUCTION', data.introduction)
    //       resolve()
    //     })
    //   })
    // }
  }
};

export default user;
