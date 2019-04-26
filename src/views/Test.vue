<template>
  <div class="test">
    <div class="average js-average" :data-json="scrollTop >= affixTop" :class="{fixed: scrollTop >= affixTop}">
      平均值: {{average}}
    </div>
    <div class="list-wrap">
      <div class="list" v-for="item in dataList" :key="item.id">
        <div class="card-top">
          <span>id: {{item.id}}</span>
          <span>data: {{item.data}}</span>
        </div>
        <div class="card-bottom">time: {{item.time}}</div>
      </div>
    </div>
    <button class="js-load-more" @click="update('click loading...')">{{isLoading ? '加载中...' : '加载更多'}}</button>
  </div>
</template>

<script>

export default {
  name: 'test',
  data () {
    return {
      dataList: [],
      average: 0,
      index: 0,
      affixTop: 40,
      scrollTop: 0,
      isLoading: false
    }
  },
  computed: {},
  async created () {
    await this.update('init loading...')
  },
  mounted () {
    window.addEventListener('scroll', this.scrollBottom)
    this.$nextTick(() => {
      const el = document.querySelector('.js-average')
      el.addEventListener('click', this.backTop)
      this.affixTop = el.offsetTop
    })
  },
  methods: {
    backTop () {
      if (this.scrollTop > 0) {
        window.requestAnimationFrame(this.backTop)
        window.scrollTo(0, this.scrollTop - this.scrollTop / 8)
      }
    },
    async scrollBottom () {
      this.scrollTop = document.body.scrollTop || document.documentElement.scrollTop
      const top = (document.querySelector('.js-load-more').getBoundingClientRect()).top
      if (
        !this.isLoading &&
        window.innerHeight - top > 0) {
        await this.update('loading more...')
      }
    },
    async update (info = 'loading...') {
      console.info(info)
      if (this.isLoading === true) return false
      this.isLoading = true
      this.index += await this.$store.dispatch('getDataCall', this.index)
      this.dataList = this.$store.getters.getData
      this.average = this.$store.getters.getAverage
      this.isLoading = false
      console.info('loading success.')
    }
  }
}
</script>

<style scoped lang="less">
  @max-width: 400px;
  @linear: linear-gradient(270deg, #ed5252 0, #ffa33b 100%, #ffab3d 100%);
  .test {
    font-family: 'Microsoft JhengHei Light','Microsoft JhengHei','Microsoft YaHei Light','Microsoft YaHei',sans-serif;
    -webkit-tap-highlight-color: transparent;
    max-width: 750px;
    margin: 0 auto;
    .average {
      position: relative;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9;
      height: 40px;
      line-height: 40px;
      letter-spacing: 1px;
      cursor: pointer;
      background: @linear;
      transition: .5s cubic-bezier(0.71,1.7,0.77,1.24) all;
      &.fixed {
        position: fixed;
        color: #fff;
      }
    }
    .list-wrap {
      display: flex;
      justify-content: center;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .list {
      position: relative;
      margin: 0 auto;
      padding: 20px;
      width: 100%;
      max-width: 750px / 2;
      box-sizing: border-box;
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: calc(100% - 20px);
        height: 1px;
        background: rgba(0, 0, 0, .1);
        transform: scaleY(.5) translateX(-50%);
      }
    }
    .card-top {
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
      & > span:nth-last-of-type(1) {
        background-image: @linear;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      & > span:first-of-type {
        position: relative;
        color: #fff;
        padding-left: 5px;
      }
      & > span:first-of-type::after {
        position: absolute;
        top: 0;
        left: -3px;
        z-index: -1;
        content: '';
        width: calc(100% + 10px);
        height: 100%;
        border-radius: 10px;
        background: @linear;
      }
    }
    .card-bottom {
      text-align: justify;
    }

    button {
      margin: 40px 0 10px 0;
      background: @linear;
      padding: 10px;
      font-size: 15px;
      color: white;
      width: 100%;
      max-width: @max-width;
      border: none;
      border-radius: 6px;
      outline: none;
    }
  }

</style>
