<template>
  <div id="publish">
    <h3>{{ message }}！</h3>
    <div class="button-group">
        <el-button type="success" @click="route('/index')" v-if="state != 1">返回问卷调查首页</el-button>
        <el-button type="info" @click="route('/manage', 1)" v-show="manage == 1">查看问卷管理</el-button>
    </div>
    <table class="table">
      <tr v-show="state == 1">
          <td>问卷链接:</td>
          <td>
            <el-input v-model="url"></el-input>
            <el-button v-clipboard:copy="url">复制</el-button>
            <el-button @click="open">打开</el-button>
          </td>
      </tr>
      <tr v-show="state == 1">
          <td>下载二维码:</td>
          <td>
            <a :href="drowImage" download="图片">
              <img :src="drowImage" :alt="drowImage" @click="download"/>
            </a>
          </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'publish',
  data () {
    return {
      drowImage: '',
      state: '',
      url: '',
      manage: 0,
      message: '发布成功'
    }
  },
  computed: {
    ...mapGetters([
      'leftMenu'
    ])
  },
  created () {
    let naireId = this.$route.query.naireId
    if (JSON.parse(sessionStorage.naireJson)[0].checkState) {
      this.message = '已提交审核'
    } else {
      this.message = '发布成功'
    }
    this.state = this.$route.query.state
    this.leftMenu.forEach(item => {
      if (item.path === '/manage') {
        this.manage = 1
      }
    })
    if (Number(this.state) === 1) {
      this.$https.get(`/publish/naireRelease?naireId=${naireId}&type=${1}`)
      .then(res => {
        // this.url = res.data.split('result":"')[1].split('"}')[0]
        this.url = res.data.result
        this.drowImage = `/naire/common/naireQrcodeView?naireId=${naireId}&type=${1}`
      })
    }
  },
  methods: {
    open () {
      window.location.href = this.url
    },
    route (r, s) {
      if (s) {
        sessionStorage.index = 2
      }
      this.$router.push(r)
    },
    download () {}
  }
}
</script>

<style lang="scss" scoped>
    #publish {
        background: #fff;
        padding: 80px 50px;
        h3 {
            height: 50px;
            line-height: 50px;
            text-align: center;
            background: url(../../../assets/images/publish.png) no-repeat 42% center;
        }
        .button-group {
            text-align: center;
            margin: 40px 0;
        }
        .table {
            width: 660px;
            margin: 0 auto;
            td {
              &:first-child {
                text-align: right;
              }
              &:nth-child(2) {
                padding-left: 10px;
                * {
                  float: left;
                }
                .el-input {
                  width: 400px;
                  margin-right: 20px;
                }
                img {
                  width: 200px;
                }
              }
            }
        }
    }
</style>
