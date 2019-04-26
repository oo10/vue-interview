import Vue from 'vue'
import Vuex from 'vuex'
import mockGenerator from './mock'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dataList: [],
    sum: 0
  },
  mutations: {
    setData: (state, data) => state.dataList.push(...data),
    setSum: (state, sum) => {
      state.sum = state.sum + sum
    }
  },
  getters: {
    getAverage: state => (state.sum / state.dataList.length).toFixed(2),
    getData: state => state.dataList
  },
  actions: {
    async getDataCall ({
      commit,
      state
    }, index) {
      const res = await mockGenerator(index, state.size || 20)
      const len = res.length
      let sum
      if (typeof res === 'object' && res !== null) {
        sum = [...res].reduce((a, b) => {
          return a + b.data
        }, 0)
      } else {
        throw new Error('返回数据类型错误')
      }
      console.log('当前平均值：', sum / res.length)
      commit('setData', res)
      commit('setSum', sum)
      return len
    }
  }
})
