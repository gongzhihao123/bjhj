<template>
  <div id="assessment-way">
    <p class="add-button">
      <el-button @click="add" type="primary" icon="el-icon-plus"><i class="el-icon-plus"></i>&nbsp;新增</el-button>
    </p>

    <!-- 测评方式列表 -->
    <el-row>
      <el-col v-for="(item, index) in listTitle" :key="index" :span="item.num">{{ item.name }}</el-col>
    </el-row>

    <transition-group name="slide-left" mode="out-in">
      <el-row class="list-body" v-for="(item, index) in listBody" :key="index">
        <el-col :span="2">{{ index + 1 }}</el-col>
        <el-col :span="18">{{ item.modeName }}</el-col>
        <el-col :span="4">
          <el-button type="primary" @click="update(item)">编辑</el-button>
          <el-button type="danger" @click="del(item)">删除</el-button>
        </el-col>
      </el-row>
    </transition-group>

    <!-- 底部按钮组 -->
    <div class="button-group">
      <el-button size="large" @click="cancel">取消</el-button>
      <el-button size="large" @click="beforeStep">上一步</el-button>
      <el-button size="large" @click="nextStep" type="primary">下一步</el-button>
    </div>

    <el-dialog
      title="新增"
      v-model="dialogVisible"
      size="tiny">
      <p>
        <span>测评方式：</span>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item prop="name">
            <el-input :maxlength="30" v-model.trim="ruleForm.name" placeholder="请填写测评方式名称"></el-input>
          </el-form-item>
        </el-form>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  
</template>

<script>
import { notice, success, error } from '../../../api/index.js'
import querystring from 'querystring'
export default {
  name: 'assessmentWay',
  data () {
    return {
      dialogVisible: false,
      evalId: '',
      updateId: '',
      listTitle: [
        {name: '编号', num: 2},
        {name: '测评方式', num: 18},
        {name: '操作', num: 4}
      ],
      listBody: [],
      ruleForm: {
        name: ''
      },
      rules: {
        name: [
          {required: true, message: '请填写分组名称', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 取消
    cancel () {
      if (sessionStorage.isEdit === '2') {
        this.$https.post(`/eval/deleteEval`, querystring.stringify({
          id: this.evalId
        }))
        .then(res => {
        })
      }
      this.$router.push('/assessmentManager/index')
    },
    // 上一步
    beforeStep () {
      this.$router.push({path: '/assessmentManager/basicInformation', query: {id: JSON.stringify(this.evalId)}})
      this.$store.dispatch('active')
    },
    // 下一步
    nextStep () {
      if (this.listBody.length !== 0) {
        this.$router.push({path: '/assessmentManager/otherParameterSetting', query: {id: JSON.stringify(this.evalId)}})
      } else {
        notice(this, '请先创建测评方式', 2000)
      }
    },
    // 新增按钮
    add () {
      this.dialogVisible = true
      this.ruleForm.name = ''
      this.updateId = ''
    },
    update (item) {
      this.dialogVisible = true
      this.ruleForm.name = item.modeName
      this.updateId = item.id
    },
    // 新增分组确定
    addSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.updateId) {
            this.$https.post('/eval/updateMode', querystring.stringify({
              id: this.updateId,
              modeName: this.ruleForm.name
            }))
            .then(res => {
              if (res.data.code === 1) {
                success(this, '修改成功', 1000)
                this.dialogVisible = false
                this.getModeList()
              } else {
                notice(this, res.data.message, 2000)
              }
            })
          } else {
            this.$https.post('/eval/addMode', querystring.stringify({
              evalId: this.evalId,
              modeName: this.ruleForm.name
            }))
            .then(res => {
              if (res.data.code === 1) {
                success(this, '创建成功', 1000)
                this.dialogVisible = false
                this.getModeList()
              } else {
                notice(this, res.data.message, 2000)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 删除
    del (item) {
      this.$confirm('确定删除该测评方式?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$https.post('/eval/deleteMode', querystring.stringify({
          id: item.id
        }))
        .then(res => {
          if (res.data.code === 1) {
            success(this, '删除成功', 1000)
            this.getModeList()
          } else {
            notice(this, res.data.message, 2000)
          }
        })
      }).catch(() => {
      })
    },
    // 获取测评方式列表
    getModeList () {
      this.$https.get(`/eval/getModeList?evalId=${this.evalId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.listBody = res.data.result
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    this.evalId = JSON.parse(this.$route.query.id)
    this.getModeList()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/main.scss';
#assessment-way{
  padding-bottom: 50px;

  &>.add-button{
    padding: $width;

    .el-button{
      font-size: 15px;

      span{
        margin-left: 0;

        i{
          margin-right: 10px;
        }
      }
    }
  }

  // 测评方式列表
  .el-row{
    text-align: center;
    line-height: 50px;
    font-size: 15px;
    color: #343434;
    border-bottom: 1px solid #ddd;
  }

  .list-body:hover{
    background: #f7f7f7;
  }

  .button-group{
    margin: $width*2 auto;
    width: 280px;
  }

  // 弹出框
  .el-dialog{
    width: 500px;

    .el-dialog__header{
      text-align: center;
      padding: $width;
      border-bottom: 1px solid #ddd;

      span{
        font-weight: normal;
      }
    }
    .el-dialog__body{
      padding: $width*4 $width*2;
      font-size: 15px;

      .el-form{
        display: inline-block;
        width: 320px;
      }
      
      .el-input{
        width: 320px;
      }
    }
  }

  
}
// 删除弹出框
  // .el-message-box{
  //   .el-message-box__header{
  //     border-bottom: 1px solid #ddd;
  //     padding: $width;
  //     .el-message-box__title{
  //       text-align: center;
  //       font-weight: normal;
  //       font-size: 17px;
  //     }
  //   }
  //   .el-message-box__content{
  //     padding: $width*3 $width*2;
  //     p{
  //       text-align: center;
  //       font-size: 16px;
  //     }
  //   }
  //   .el-message-box__btns{
  //     padding-top: 0;
  //     .el-button{
  //       padding: $width/2 $width*1.5;
  //       span{
  //         font-size: 15px;
  //       }
  //     }
  //   }
  // }
</style>
