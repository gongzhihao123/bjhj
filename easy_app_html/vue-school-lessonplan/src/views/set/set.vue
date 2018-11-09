<template>
  <div id="set">
      <div class="head">
        <ul>
          <li v-for="(item, index) in nav" :key="item"><a :class="{'active': activeInd === index, 'space': activeInd === 1}" @click="link(item, index)">{{item.name}}</a></li>
        </ul>
      </div>   

      <main>
        <transition name="slide-left" mode="out-in">
          <router-view></router-view>  
        </transition>  
      </main>      
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'set',
  data () {
    return {
      nav: [
        {name: '备课模板设置', path: '/set/lessonmodel'},
        {name: '备课设置', path: '/set/lessonset'},
        {name: '备课检查设置', path: '/set/lcheckset'}
      ],
      activeInd: 0
    }
  },
  computed: {
    ...mapGetters([
      'my'
    ])
  },
  watch: {
    my () {
      this.activeInd = 0
    }
  },
  methods: {
    link (item, index) {
      this.$router.push(item.path)
      this.activeInd = index
    }
  },
  created () {
    this.activeInd = this.$route.query.activeInd
    if (this.$route.meta.manager === 0) {
      this.activeInd = 0
    } else {
      this.activeInd = this.$route.meta.manager
    }
  }
}
</script>

<style lang="scss">
#set {
  width: 100%;
  margin: 0px;
  padding: 0px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;

  .head {
    /*width: 100%;*/
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    ul {
      width: auto;
      height: 40px;
      background: #DDE6EF;
      padding-left: 30px;
      margin: 0px;
      border-bottom: 1px solid#DAE2ED;
      li {
        float: left;
        list-style-type: none;
        margin-left: 35px;

        a {
          color: #636C7B;
          width: 130px;
          height: 31px;
          border-radius: 10px 10px 0px 0px;
          display: block;
          margin-top: 10px;
          text-align: center;
          font-size: 14px;
          line-height: 31px;
          border-bottom: 1px solid #fff;

        }
        .active {
          background: #fff;
          color: #408EE6;
        }
        a:hover {
          cursor: pointer;
        }
      }
    }
  }
  main {
    margin-top: 30xpx;
  }
}
</style>
