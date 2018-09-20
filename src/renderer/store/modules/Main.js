export default {
  namespaced: true,
  state: {
    // 目前默认框架名称vue
    frameName: 'vue',
    // 存储的项目路径
    cacheDirLists: [],
    // 当前项目名称
    currentProjectName: '--',
    // 当前项目的框架
    currentFrameName: '',
    // 当前构建的组件集合(扁平化数组: 存放vuex库中)
    drawComponentLists: [],
    // 当前构建的组件模版
    VUETEMPLATE: '',
    // 当前展示的组件列表
    currentComponentLists: [
      { 
        name: 'el-input', 
        slots: ['prefix', 'suffix', 'prepend', 'append'], 
        propLists: [
          {name: 'clearable', type: 'boolean', input: false}, 
          {name: 'value', input: ''},
          {name: 'placeholder', input: ''},
          {name: 'disabled', type: 'boolean', input: false},
          {name: 'size', input: 'small'}
        ]
      },
      { name: 'el-button', slots: ['default']},
      { name: 'el-switch'},
      { name: 'el-pagination'},
      { name: 'el-autocomplete'},
      { name: 'el-menu'},
      { name: 'el-input-number'},
      { name: 'el-table'},
      { name: 'el-date-picker'},
      { name: 'el-tabs'}
    ]
  },

  mutations: {
    // 保存
    setCacheDir(state, payload) {
      if(state.cacheDirLists.indexOf(payload) < 0) {
        state.cacheDirLists.push(payload);
      }
    },

    // 从文件缓存删除
    deleteCacheDir(state, payload) {
      const idx = state.cacheDirLists.findIndex(val => val === payload);
      state.cacheDirLists.splice(idx, 1);
    },

    /**
     * 设置当前的项目路径和框架选型
     * @param {*} state 
     * @param {Object} payload: {projectPath, frameName}
     */
    setCurrentProject(state, {projectPath, frameName}) {   
      state.currentProjectName = projectPath;
      state.currentFrameName = frameName;
    },
    
    /**
    * 拖拽的组件信息存入vuex
    * @param {Object} list: {id, pid, ...}
     */
    saveDrawComponents(state, list) {
      // 随机产生id编号
      const id = new Date() * 1;
      state.drawComponentLists.push({
        ...list,
        id: list.id ? list.id : `${state.frameName}_${id}`
      });
    },

    deleteDrawComponents(state, id) {
      const idx = state.drawComponentLists.findIndex(val => val.id === id);
      state.drawComponentLists.splice(idx, 1);
    },

    /**
    * 修改组件信息
    * @param {Object} params: {id, mess:}
     */
    modifyDrawComponents(state, params) {
      const { id } = params;
      const idx = state.drawComponentLists.findIndex(val => val.id === id);
      state.drawComponentLists.splice(idx, 1, params);
      //state.drawComponentLists[idx] = params;
    },

    saveVueTemplate(state, tpl) {
      state.VUETEMPLATE = tpl;
    }
  },

  actions: {
    // 获取组件库的子集合
    getLibraryChilds({state}, name) {
      return new Promise(resolve => {
        setTimeout(() => {
          if(name === 'element-ui'){
            resolve(state.currentComponentLists);
          }else {
            resolve(state.iViewComponentLists);
          }
        }, 0);
      })
    }
  },

  getters: {
    /**
    * 将扁平化数组---> 嵌套数组
     */
    findComponentLists(state) {
      var lists = state.drawComponentLists.concat();
      return lists.length > 0 ? getTrees(lists, 0) : [];
    }
  }
}

/**
* 1. 取出数组的第一个(id)和剩下的数据(pid)进行比较,相同说明都是第一个的子集合
* 2. 存在到它的children中
* 树状的算法
* @params list     代转化数组
* @params parentId 起始节点
*/
function getTrees(list, parentId) {
  let items = {};
  // 获取每个节点的直属子节点，*记住是直属，不是所有子节点
  for (let i = 0; i < list.length; i++) {
      let key = list[i].pid;
      if (items[key]) {
        items[key].push(list[i]);
      } else {
        items[key] = [];
        items[key].push(list[i]);
      }
  }
  return formatTree(items, parentId);
}

/**
* 利用递归格式化每个节点
*/
function formatTree(items, parentId) {
    let result = [];
    if (!items[parentId]) {
        return result;
    }
    for (let t of items[parentId]) {
        t.children = formatTree(items, t.id)
        result.push(t);
    }
  return result;
}
