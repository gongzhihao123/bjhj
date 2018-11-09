<template>
  <div class="my-declaration">
    <p>当前位置：我的申报</p>
    <div class="box">
      <div class="contents">
        <div class="radios">
          <el-radio-group v-model="radioValue" @change="filter">
            <el-radio label="">全部</el-radio>
            <el-radio :label="1">未提交</el-radio>
            <el-radio :label="2">审批中</el-radio>
            <el-radio :label="3">已通过</el-radio>
            <el-radio :label="4">未通过</el-radio>
          </el-radio-group>
        </div>
        <div class="tab" v-loading="loading">
          <table>
            <tr>
              <th v-for="item in thList" :key="item.topicCode">{{item.name}}</th>
            </tr>
            <tr v-for="item in tableList" :key="item.name">
              <td>{{item.topicCode}}</td>
              <td>{{item.name}}</td>
              <td>
                <span v-if="item.publishState === 1">{{item.classifyName}}</span>
                <span v-else></span>
              </td>
              <td>{{item.leadUserName}}</td>
              <td>{{item.companyName}}</td>
              <td>
                <span v-if="item.saveSubmitFlag === 1">未提交</span>
                <span v-else>
                  <span v-if="item.checkState === 0 || item.checkState === null">审核中</span>
                  <span v-else-if="item.checkState === 1 || item.checkState === 3">已通过</span>
                  <span v-else-if="item.checkState === 2">未通过</span>
                </span>
              </td>
              <td>
                <el-button type="primary" @click="submit(item)" :disabled="item.saveSubmitFlag === 2">提交</el-button>
                <el-button type="primary" @click="route(item)" :disabled="item.saveSubmitFlag === 2">修改</el-button>
                <el-button type="primary" @click="deleteClick(item)" :disabled="item.saveSubmitFlag === 2">删除</el-button>
              </td>
            </tr>
            <tr v-if="!tableList.length">
              <td colspan="7" style="text-align: center;">暂无数据</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <el-pagination
    v-if="tableList.length > 0"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-size="pageSize"
    :page-sizes="[10, 20, 30]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalCount">
  </el-pagination>    

    <!-- 删除 -->
    <el-dialog title="提示" :visible.sync="deleteDialog" width="500px">
      <div>
        <span>确定删除选中的信息吗？</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteSure" :disabled="canSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { success, notice } from '../../../../api/index.js'
import service from '../../../../utils/axios.js'
import { mapActions } from 'vuex'
export default {
  name: 'my-declaration',
  data () {
    return {
      canSave: false,
      loading: false,
      deleteDialog: false,
      radioValue: '',
      currentPage: 1,
      thList: [
        {name: '立项号'},
        {name: '课题名称'},
        {name: '课题分类'},
        {name: '课题负责人'},
        {name: '单位'},
        {name: '当前状态'},
        {name: '操作'}
      ],
      tableList: [],
      pageSize: 10,
      totalCount: 0
    }
  },
  methods: {
    ...mapActions([
      'remind'
    ]),
    filter () {
      this.getList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getList()
    },
    deleteClick (item) {
      this.infoId = item.id
      this.deleteDialog = true
    },
    deleteSure () {
      this.canSave = true
      service.post(`/frontTopicManageController/deleteDeclaration`, ({
        id: this.infoId
      }))
      .then(res => {
        this.canSave = false
        if (res.data.code === 1) {
          success(this, res.data.message || '删除成功', 2000)
          this.getList()
        } else {
          notice(this, res.data.message || '删除失败', 2000)
        }
      })
      this.deleteDialog = false
    },
    route (item) {
      service.get(`/frontTopicManageController/updateDeclaration?id=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          // console.log(res)
        }
      })
      sessionStorage.SUBJECT_ID = item.id
      sessionStorage.IS_CHANGE = '0'
      sessionStorage.BACK_PATH = `/subjectManager/myDeclaration`
      this.$router.push({path: `/declarationStep/index`, query: {id: item.guideId}})
    },
    getList () {
      this.loading = true
      service.get(`/frontTopicManageController/myDeclaration?state=${this.radioValue}&pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableList = res.data.result.list || []
        } else {
          notice(this, res.data.messge || '获取失败', 2000)
        }
        this.totalCount = res.data.result.totalCount
        this.loading = false
      })
      .catch(_ => {
        this.loading = false
      })
    },
    submit (item) {
      service.post(`/frontTopicManageController/submitDeclaration`, ({
        id: item.id,
        state: 0
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message || '提交成功', 2000)
          this.getList()
          this.remind('1')
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style lang="scss">
@import '../../../../assets/scss/variable.scss';
@import '../../../../assets/scss/mixin.scss';
.my-declaration {
  p {
    margin-bottom: 20px;
  }
  .box {
    padding: 20px;
    background: #fff;
    border: 1px solid #EBEEF7;
    .contents {
      max-height: none;
      .radios {
        width: 100%;
        height: 30px;
        line-height: 30px;
        // margin-top: 20px;
      }
      .tab {
        width: 100%;
        margin-top: 10px;
        margin-bottom: 30px;
        // height: 420px;
        table {
          width: 100%;
          tr {
            // height: 50px;
            cursor:　pointer;
            td {
                padding-top: 12px;
                padding-bottom: 12px;
                color: #999999;

                &>.el-button {
                  padding: 5px 15px;
                  &>span {
                    width: 38px;
                    display: inline-block;
                    text-align: center;
                  }
                }
            }

            &:hover {
              background: #F1F3F9;
              
              td {
                color: #5295EB;
                &:first-child {
                  border-top-left-radius: 8px;
                  border-bottom-left-radius: 8px;
                }
                &:nth-child(9){
                  border-top-right-radius: 8px;
                  border-bottom-right-radius: 8px;
                }
              }
            }
            &:nth-child(1) {
              background: #EBEEF7;
              border-radius: 4px;

              th {
                font-size: normal;
                padding-top: 12px;
                padding-bottom: 12px;

                &:first-child {
                  border-top-left-radius: 8px;
                  border-bottom-left-radius: 8px;
                }
                &:nth-child(9){
                  border-top-right-radius: 8px;
                  border-bottom-right-radius: 8px;
                }
              }
            }
            td,th {
              text-align: left;

              &:nth-child(1) {
                padding-left: 10px;
              }
            }
          }
        }
      }
    }
  }
  .el-pagination {
    margin: 20px 0;
    text-align: right;
  }  
}
</style>
