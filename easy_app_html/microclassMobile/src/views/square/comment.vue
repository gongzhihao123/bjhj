<template>
    <div id="comment">
        <mt-header fixed title="发布评论">
            <router-link to="/course" slot="left">
                <span class="small">取消</span>
            </router-link>
            <mt-button slot="right"><span @click="saveComment" class="small">确定</span></mt-button>
        </mt-header>

        <el-input
            type="textarea"
            contenteditable="true"
            :rows="4"
            placeholder="请输入内容"
            v-model="textarea"
            :maxlength="200">
        </el-input>
    </div>
</template>
<script>
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      textarea: '',
      item: {},
      userType: ''
    }
  },
  methods: {
    async saveComment () {
      if (this.textarea === '') {
        Toast({
          message: '评论不能为空',
          position: 'center',
          duration: 3000,
          className: 'tips'
        })
        return
      }
      // var patt = /[\ud800-\udbff][\udc00-\udfff]/g
      // var str = this.textarea.replace(patt, function (char) {
      //   var H, L, code
      //   if (char.length === 2) {
      //     H = char.charCodeAt(0)
      //     L = char.charCodeAt(1)
      //     code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00
      //     return '&#' + code + ';'
      //   } else {
      //     return char
      //   }
      // })
      await this.$store.dispatch('saveComment', {
        userType: this.userType,
        microclassId: this.item.id,
        comment: this.textarea
      })
      this.textarea = ''
      Toast({
        message: '评论成功',
        position: 'center',
        duration: 3000,
        className: 'tips'
      })
      this.$router.push('/course')
    }
  },
  created () {
    this.item = JSON.parse(sessionStorage.item)
    setTimeout(() => {
      this.userType = this.$store.state.user.loginUser.userType
    })
  }
}
</script>
<style lang="scss">
#comment {
  width: 100%;
  height: 100%;
  background: #fff;

  input {
    -webkit-user-select: auto;
  }
  * {
      user-select: none;
    }

    input, textarea {
      user-select: text;
    }
  .small {
    font-size: 33px;
    line-height: 96px;
    color: #4a4a4a;
  }
  .el-textarea {
    margin: 120px auto 0px auto;
    width: 660px;
    display: block;
    padding-top: 50px;
    .el-textarea__inner {
      resize: none !important;
      height: 200px;
      font-size: 28px;
    }
  }

  /* 解决苹果自带浏览器无法自动获取焦点 */
  input {
    -webkit-user-select: auto;
    line-height:normal;
  }
.mint-header {
    height: 96px;
    font-size: 36px;
    line-height: 96px;
    background: #fff;
    box-shadow:0 2px 4px 0 rgba(0,0,0,0.08);
    color: #000;
    width: 100%;
    padding: 0px 30px;
  }
  .mint-header .mint-button {
    height: 96px;
    line-height: 96px;
  }
  .mint-button-text {
    &>img {
      width: 41px;
      height: 42px;
      display: block;
      margin-bottom: 9px;
    }
  }
  .mintui .mintui-back {
    font-size: 44px !important;
    color: #000;
  }
    .mint-header-title {
    line-height: 96px;
    font-size: 36px;
  }

  .mint-header-button > a {
    font-size: 36px;
    line-height: 96px;
    color: #4a4a4a;
  }
}
.mint-toast-text {
    font-size: 30px !important;
  }
</style>
