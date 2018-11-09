<template>
  <div class="subject-change">
      <p>当前位置：课题变更</p>    
    <div class="box">
      <p class="head">
        <img src="../../../../assets/images/courseManager/title-List.png">课题列表
        <span style="color: #1AB3F7;">（说明：如有未审核的申请，则不能申请新的变更）</span>
      </p>
      <div class="contents">
        
        <div class="tab" v-loading="loading">
          <table>
            <tr>
              <th v-for="item in thList" :key="item.name">{{item.name}}</th>
            </tr>
            <tr v-for="item in tableList" :key="item.name">
              <td>{{item.topicCode}}</td>
              <td>{{item.name}}</td>
              <td>{{item.changeType === 1 ? '变更' : '撤项'}}</td>
              <td>{{item.saveSubmitTime}}</td>
              <td>
                <span v-if="item.check_state === 2">审批未通过</span>
                <span v-if="item.check_state === 1">审批通过</span>
                <span v-if="item.check_state === 0">审批中</span>
              </td>
            </tr>
            <tr v-if="!tableList.length">
              <td colspan="5" style="text-align: center;">暂无数据</td>
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
  </div>
</template>

<script>
import service from '../../../../utils/axios.js'
import {notice} from '../../../../api/index'
import { dateFormat } from '../../../../filters/index.js'
export default {
  name: 'subject-change',
  data () {
    return {
      loading: false,
      currentPage: 1,
      thList: [
        {name: '课题立项号'},
        {name: '课题名称'},
        {name: '变更事项'},
        {name: '申请时间'},
        {name: '变更审批'}
      ],
      tableList: [],
      pageSize: 10,
      totalCount: 0
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getList()
    },
    getList () {
      this.loading = true
      service.get(`/frontTopicManageController/changeStateList?pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableList = (res.data.result.list || []).map(item => ({
            ...item,
            saveSubmitTime: dateFormat(item.saveSubmitTime, 'yyyy-MM-dd')
          }))
          this.totalCount = res.data.result.totalCount
        } else {
          notice(this, res.data.messge || '获取失败', 2000)
        }
        this.loading = false
      })
      .catch(_ => {
        this.loading = false
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
.subject-change {
  p {
    margin-bottom: 20px;
  }  
  .box {
    background: #fff;
    border: 1px solid #EBEEF7;

    .head {
      padding: 20px;
      border-bottom: 1px solid #EBEEF7;
      line-height: 25px;

      &>img {
          width: 25px;
          height: 25px;
          float: left;
          margin: 0px 10px 0px 0px;
        }
    }
    .contents {
      max-height: none;
      .tab {
        padding: 20px;
        table {
          width: 100%;
          tr {
            /* height: 50px; */
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
