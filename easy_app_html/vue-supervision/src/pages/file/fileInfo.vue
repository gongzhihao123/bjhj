<template>
    <div class="fileInfo">
        <div class="content">
          <el-button @click="download" type="primary"><i class="el-icon-download"></i>下载
            (<span v-if="size > 1024 && size < 1048576" class="number">
              {{parseInt(size/1024)+'KB'}}
              </span>
              <span v-if="size > 1048576" class="number">
              {{parseInt(size/1024/1024) +'MB'}}
              </span>)          
          </el-button>
          <iframe :src="url" class="score-content" style="width:945px;height: 850px;margin: 16px auto;"></iframe>
        </div>
    </div>
</template>
<script>
export default {
  name: 'fileInfo',
  data () {
    return {
      url: '',
      id: '',
      size: ''
    }
  },
  methods: {
    download () {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/common/readAttachment?attachmentId=${this.id}`
    }
  },
  created () {
    this.url = this.$route.query.url
    this.id = this.$route.query.id
    this.size = this.$route.query.size
  }
}
</script>
<style lang="scss">
    .fileInfo {
        .content {
          width: 945px;
          height: 850px;
          margin: 20px auto;

          .number {
            margin-left: 0px;
          }

          &>.el-button {
            float: right;
            margin-right: 20px;
            padding: 12px;

            &>span {

              &>.el-icon-download {
                margin-right: 10px;
              }
            }
          }
        }
    }
</style>