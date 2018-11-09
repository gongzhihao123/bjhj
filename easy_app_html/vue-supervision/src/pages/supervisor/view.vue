<template>
    <div class="view">
        <div class="content">
          <el-button @click="back">返回</el-button>
          <el-button @click="download" type="primary"><i class="el-icon-download"></i>下载
            (<span v-if="item.size > 1024 && item.size < 1048576" class="number">
            {{parseInt(item.size/1024)+'KB'}}
            </span>
            <span v-if="item.size > 1048576" class="number">
            {{parseInt(item.size/1024/1024) +'MB'}}
            </span>)
          </el-button>  
          <h2>{{item.name}}</h2>
          <div class="content-box">
              <iframe :src="url" class="score-content" style="width:945px;height: 850px;margin: 16px auto; display: block; overflow-y: auto;"></iframe>
          </div>   
        </div>     
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'view',
  data () {
    return {
      id: '',
      flag: '',
      Info: {},
      url: '',
      item: {}
    }
  },
  methods: {
    back () {
      history.back()
    },
    download () {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/common/readAttachment?attachmentId=${this.item.id}`
    }
  },
  created () {
    this.url = sessionStorage.url
    this.item = JSON.parse(sessionStorage.item)
  },
  computed: {
    ...mapGetters([
      'previewUrl',
      'rootUrl',
      'previewInterface'
    ])
  }
}
</script>
<style lang="scss">
    .view {
      .content {   
        
        
        &>h2 {
            height: 50px;
            line-height: 50px;
            background: #FFFFFF;
            border-bottom: 1px solid #E5E5E5;
            text-indent: 2em;
          }

        &>.el-button {
          float: right;
          margin-right: 20px;
          margin-top: 5px;

          &>span {

            &>.el-icon-download {
              margin-right: 10px;
            }
          }
        }
        &>.content-box {
          padding: 10px 30px;
          clear: both;
          margin-top: 10px;

          &>p {
            font-family: PingFangSC-Regular;
            font-size: 24px;
            color: #333333;
            text-align: center;
            margin-top: 33px;
          }

          &>.box {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
            text-indent: 2em;
            max-height: 700px;
            overflow-y: auto;        
          }
          &>ul {
            position: absolute;
            bottom: 20px;
            left: 20px;
            max-height: 200px;
            overflow-y: auto;

            &>li {
              line-height: 25px;

              span {
                margin-right: 10px;
              }
              a {
                color: #20A0FF;
                cursor: pointer;
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
</style>