<template>
    <div id="squareModel">
      <div class="head-title">
        <span>新增教案>引用模板</span>
        <a @click.prevent="change">
            <span class="head-title-bg"></span>
            返回上一层</a>
      </div>

      <div class="model-box">
        <el-table :data="modelPlans" v-loading="listLoading"  style="width: 100%;">
          <el-table-column  label="备课模板" width="50%"  prop="name">
          </el-table-column>

        <el-table-column label="操作" width="50%">
          <template scope="scope">
            <a class="view" @click="modelLook(scope.row)"><i></i><span>查看</span></a>
            <a class="quote" @click="modelquote(scope.row)"><i></i><span>引用</span></a>
          </template>
        </el-table-column> 
        <div slot="empty"><i class="el-icon-warning" style="margin-right: 4px;"></i>暂无数据</div>
			</el-table>  
      </div>

        <!--引用模板-->
      <el-dialog title="" v-model="dialogVisible">
        <h3>模板名称：{{Modelmes.name}}</h3>
        <div class="content" v-html="Modelmes.html"></div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="modelquote">引 用</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>      
    </div>
</template>

<script>
import { error, notice, success } from '../../../api/index.js'
export default {
  name: 'squareModel',
  data () {
    return {
      modelPlans: [],
      Modelmes: {},
      quoteInfo: {},
      listLoading: false,
      dialogVisible: false,
      id: ''
    }
  },
  methods: {
    change () {
      this.$router.push({path: '/squareReuse'})
    },
    getModelPlanList () {
      this.$https.get(`/mine/lessonPlanTemplateList`)
      .then(res => {
        if (res.data.code === 1) {
          this.modelPlans = res.data.result
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    modelLook (row) {
      this.dialogVisible = true
      this.$https.get(`/mine/lessonPlanTemplateDetail?templateId=${row.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.Modelmes = res.data.result
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    modelquote (row) {
      if (row.id) {
        this.dialogVisible = false
        this.$https.get(`/templateSet/templateDetail?templateId=${row.id}`)
        .then(res => {
          if (res.data.code === 1) {
            this.quoteInfo = res.data.result
            success(this, '引用模板成功', 1000)
            this.$router.push({path: '/squareReuse', query: {modelhtml: this.quoteInfo.htmlStr}})
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
        })
        .catch(res => {
          notice(this, res.message, 2000)
        })
      } else {
        this.$https.get(`?templateId=${this.Modelmes.id}`)
        .then(res => {
          if (res.data.code === 0) {
            this.quoteInfo = res.data.result
            success(this, '引用模板成功', 1000)
            this.$router.push({path: '/squareReuse', query: {modelhtml: this.quoteInfo.htmlStr}})
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
        })
        .catch(res => {
          notice(this, res.message, 2000)
        })
      }
    }
  },
  created () {
    this.getModelPlanList()
  }
}
</script>

<style lang="scss">
    #squareModel {
        width: 100%;
        margin: 0px;
        padding: 0px;
        background: #fff;

      .head-title {
          width: auto;
          height: 40px;
          background: #DDE6EF;
          padding-left: 20px;
          border-bottom: 1px solid #E1E8F1;
          border-radius: 4px;


          span{
              padding-left: 22px;
              line-height: 40px;
              color: #636C7B;
              font-size: 14px;
              margin: 0px;
              letter-spacing: 2px;
            }

          a {
            text-decoration: none;
            line-height: 40px;
            float: right;
            margin-right: 20px;
            position: relative;
            color: #B2BCCE;
            

            .head-title-bg {
              display: inline-block;
              vertical-align: middle;
              width: 24px;
              height: 24px;
              border: none;
              margin-right: 10px;
              padding: 0px;
              background: url(../../../assets/images/back.png) no-repeat;
            }
          }

          a:hover {
            color: #408EE6;
            cursor: default;
            .head-title-bg {
              background: url(../../../assets/images/back-active.png) no-repeat;
            }
          }    
      }      
      .model-box {
        padding: 30px 60px 50px 60px;
        .el-table {
          border-radius: 4px;
          border: 1px solid #B7C2D0;
          .el-table__header-wrapper{
            table {
              width: 100% !important;
              thead {
                tr {
                  th {
                    .cell {
                      width: 100%;
                      text-align: center;
                      font-weight: normal;
                      padding: 0px;
                    }
                  }
                }
              }
            }
          }

          .el-table__body-wrapper {
            min-height: 400px;

            table {
              width: 100% !important;
              tbody {
                tr {
                  height: 55px;
                  td {
                    text-align: center;
                    width: 100%;

                    &:nth-child(1){
                      .cell:hover {
                        color: #408EE6;
                      }
                    }
                    &:nth-child(2){
                      .cell{
                        
                        .view {
                          margin-left: 35%;
                          margin-right: 30px;
                          width: 80px;
                          display: block;
                          line-height: 55px;
                          float: left;
                          i {
                            width: 24px;
                            height: 24px;
                            display: block;
                            background: url(../../../assets/images/view.png) no-repeat;
                            float: left;
                            line-height: 55px;
                            margin-top: 16px;
                          }

                          span {
                            color: #666666;
                            margin-left: 10px;
                            float: left;
                          }
                        }
                        .view:hover {
                          cursor: default;
                          i {
                            background: url(../../../assets/images/view-active.png) no-repeat;
                            }
                            span {
                              color: #9FD35D;
                            }
                         
                        }
                        .quote {
                          float: left;
                          width: 80px;
                          display: block;
                          line-height: 55px;  
                          i {
                            width: 24px;
                            height: 24px;
                            display: block;
                            background: url(../../../assets/images/quote.png) no-repeat;
                            float: left;
                            line-height: 55px;
                            margin-top: 16px;
                          }

                          span {
                            color: #666;
                            margin-left: 10px;
                            float: left;
                          }
                        }

                        .quote:hover {
                          cursor: default;
                          i {
                            background: url(../../../assets/images/quote-active.png) no-repeat;
                          }
                          span {
                            color: #408EE6;
                          }
                        }
                      }
                    }
                  }
                }
                tr:hover {
                  background: #fff;
                }
              }
            }
          }
        }
      }
  .el-dialog__wrapper {
    .el-dialog {
      width: 1092px;
      border-radius: 8px;
      .el-dialog__header {
        height: 0px;
      }
      .el-dialog__body {
        padding: 0px 60px;
        margin-bottom: 40px;
        h3 {
          width: 100%;
          text-align: center;
          border-bottom: 1px solid #DAE2ED;
          padding-bottom: 20px;
        }
        .content {
          height: 800px;
          /*border: 1px solid #ccc;*/
          table {
            margin: 10px;
            border-collapse: collapse;
            td {
                border: 1px solid #666;
            }
          }
        }
      }

      .el-dialog__footer {
        text-align: center;
        padding-bottom: 20px;
        .dialog-footer {
          .el-button {
            width: 90px;
            height: 30px;
            background: #fff;
            border: 1px solid #408EE6;
            margin-right: 20px;
            position: relative;

            span {
              color: #408EE6;
              position: absolute;
              width: 90px;
              text-align: center;
              display: block;
              left: 0px;
              height: 30px;
              top: 0px;
              line-height: 30px;
            }
          }

          .el-button:hover {
            background: #FF6C60;
            border: 1px solid #FF6C60;
            cursor: default;

            span {
              color: #fff;
            }
          }
        }
      }
    }
  }      

    }

</style>
