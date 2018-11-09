<template>
  <div class="assign-group">
    
    <header>
        <img src="../../../../src/assets/images/courseManager/manager-iocn.png"><span>课题管理</span>
    </header>

    <main>
      <p><img src="../../../assets/images/circle-icon.png">立项申请
        <a style="color:rgb(26, 179, 247); font-size: 14px;">(请先设置评审结束时间，再添加评审。)</a>
        <span>
            评审结束时间:
            <el-date-picker
              v-model="value1"
              type="date"
              placeholder="选择日期"
              @change="setEnd">
            </el-date-picker>
          </span>
      </p>
      <div class="button-group">
        <ul>
          <li>
            <span>评审状态：</span>
            <el-select v-model="typeValue" placeholder="请选择" @change="getData">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>            
          </li>
          <li>
            <span>添加状态：</span>
            <el-select v-model="value" placeholder="请选择" @change="getData">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </li>
        </ul>
      </div>
      <div class="table-box">
        <el-table
        :data="tableData"
        stripe
        v-loading="loading"
        @select-all="selectAll"
        @select="choose"        
        style="width: 100%">
        <el-table-column
          type="selection"
          align='center'
          show-overflow-tooltip
          label-class-name="head"
          width="60">
        </el-table-column>
        <el-table-column
          label="序号"
          show-overflow-tooltip
          label-class-name="head"
          width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="topicName"
          label="课题名称"
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="typeName"
          label="课题类别"
          width="150"
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="leadUserName"
          label="申报人"
          show-overflow-tooltip
          width="130"
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="单位"
          width="150"
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="审批状态"
          width="100"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span v-if="scope.row.checkSubmitFlag === 1 || scope.row.checkSubmitFlag === null" :class="{red: scope.row.checkSubmitFlag === 1 || scope.row.checkSubmitFlag === null}">未完成</span>
            <span v-if="scope.row.checkSubmitFlag === 2 && scope.row.checkSubmitFlag !== null" :class="{green: scope.row.checkSubmitFlag === 2 && scope.row.checkSubmitFlag !== null}">已完成</span>
          </template>
        </el-table-column>
        <el-table-column
          label="评审人"
          show-overflow-tooltip
          width="200"
          label-class-name="head">
          <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="添加" placement="top-start">
                  <el-button class="add-btn" @click="add(scope.row.id)" v-if="!scope.row.checkLeaderName" :disabled="!value1" :class="{disAdd: !value1}" type="text"></el-button>
                </el-tooltip>
            <span v-if="scope.row.checkLeaderName">{{scope.row.checkLeaderName + '组'}}</span>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button type="text" class="edit-btn" @click="edit(scope.row.id)" v-if="scope.row.checkLeaderName" :disabled="scope.row.checkState !== 0 || scope.row.score > 0" :class="{disEdit: scope.row.checkState !== 0 || scope.row.score > 0}"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      </div>
    </main>

  <div class="buttons">
      <el-button type="primary" @click="allAdd" :disabled="!value1 || count < 1 || selection.some(item => item.checkLeaderName)"><img src="../../../../src/assets/images/courseManager/add-guide.png">添加</el-button>
      <el-button type="primary" @click="publish" :disabled="tableData.some(item => item.checkSubmitFlag === 1 || item.checkSubmitFlag === null || item.ifPublish !== 0) || tableData.length === 0"><img src="../../../../src/assets/images/courseManager/publish.png">一键发布</el-button>
      <span>已选{{count}}条</span>
      <el-pagination
      v-if="tableData.length !== 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>    
  </div>
    <el-dialog
      :title="editflag ? '编辑评审' : '添加评审'"
      :visible.sync="dialogVisible"
      width="655px"
      v-if="dialogVisible">
      <!-- <p>评审结束时间：<span v-if="value1">{{value1 | dateFormat('yyyy-MM-dd')}}</span></p> -->
      <el-row>
        <el-col :span="11">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>

          <el-tree
            class="filter-tree"
            show-checkbox
            :data="data2"
            :props="defaultProps"
            default-expand-all
            node-key="id"
            :filter-node-method="filterNode"
            @check-change="selectByAssessment"
            ref="data2">
          </el-tree>

        </el-col>
        <el-col :span="2">
          <i class="el-icon-arrow-right"></i>
        </el-col>
        <el-col :span="11">
          <ul>
            <draggable :list="hasSelectedByAssessment" element="li" :options="{animation: 150}" @end="Move">
              <transition-group name="slide-left" mode="out-in">
                  <li v-for="(child, i) in hasSelectedByAssessment" :key="i">{{child.name}}<span v-if="child.state === 3">（专家）</span> <span v-if="i === 0 && child.state !== 3"> （组长） </span> <i class="el-icon-remove" @click="reMove(i)"></i></li>                  
              </transition-group>
            </draggable>
          </ul>
        </el-col>
      </el-row>
      <p style="font-size: 12px; color: #ccc; margin-top: 10px;">注意：默认第一个位置的评审为组长，且专家不能为组长。</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="startCheck">开始评审</el-button>        
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import service from '../../../utils/axios.js'
import { notice, success } from '../../../api/index.js'
import { dateFormat } from '../../../filters/index.js'
import draggable from 'vuedraggable'
export default {
  name: 'assign-group',
  components: {
    draggable
  },
  data () {
    return {
      currentPage: 1,
      selection: [],
      value1: '',
      dialogVisible: false,
      loading: false,
      ids: '',
      pageSize: 10,
      totalCount: 0,
      count: 0,
      value: '0',
      tableData: [],
      canMove: true,
      hasSelectedByAssessment: [],
      options: [
        { value: '0', label: '全部' },
        { value: '1', label: '已添加' },
        { value: '2', label: '未添加' }
      ],
      typeValue: '0',
      typeOptions: [
        { value: '0', label: '全部' },
        { value: '1', label: '已审批' },
        { value: '2', label: '未审批' }
      ],
      filterText: '',
      id: '',
      editflag: false,
      length: '',
      data2: [{
        id: '',
        name: '专家',
        children: []
      }, {
        id: '',
        name: '用户',
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    Move () {
      this.hasSelectedByAssessment.map(item => {
        if (item.state === 1) {
          item.state = 2
        }
      })
      if (this.hasSelectedByAssessment[0].state !== 3) {
        this.hasSelectedByAssessment[0].state = 1
      }
    },
    publish () {
      service.post(`backJudgementController/publishTopicCheck`)
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          success(this, res.data.message, 2000)
        }
      })
    },
    startCheck () {
      if (this.hasSelectedByAssessment[0].state === 3) {
        notice(this, '专家不能作为组长', 2000)
        return
      }
      this.dialogVisible = false
      // 添加
      if (!this.editflag) {
        service.post(`backJudgementController/addTopicCheckUser`, {
          topicIds: this.count === 1 ? this.id : this.ids,
          checkUserIds: this.hasSelectedByAssessment.map(item => item.id).join(','),
          checkUserNames: this.hasSelectedByAssessment.map(item => item.name).join(','),
          userState: this.hasSelectedByAssessment.map(item => item.state).join(',')
        })
        .then(res => {
          if (res.data.code !== 1) {
            notice(this, res.data.message, 2000)
          } else {
            success(this, res.data.message, 2000)
            this.getData()
          }
        })
      } else {
        // 编辑
        service.post(`backJudgementController/updatePointCheckUser`, {
          topicId: this.id,
          checkUserIds: this.hasSelectedByAssessment.map(item => item.id).join(','),
          checkUserNames: this.hasSelectedByAssessment.map(item => item.name).join(','),
          userState: this.hasSelectedByAssessment.map(item => item.state).join(',')
        })
        .then(res => {
          if (res.data.code !== 1) {
            notice(this, res.data.message, 2000)
          } else {
            success(this, res.data.message, 2000)
            this.getData()
          }
        })
      }
    },
    reMove (i) {
      this.hasSelectedByAssessment.splice(i, 1)
      this.$refs.data2.setCheckedNodes(this.hasSelectedByAssessment)
    },
    selectByAssessment (a, b) {
      console.log(1111111)
      if (a.id) {
        if (b === true) {
          if (this.hasSelectedByAssessment.filter(item => item.id === a.id).length === 0) {
            this.hasSelectedByAssessment.push({name: a.name, id: a.id, state: a.userState})
          }
        } else {
          let list = []
          this.hasSelectedByAssessment.forEach((m, index) => {
            if (m.id !== a.id) {
              list.push({name: m.name, id: m.id, state: m.state})
            }
          })
          this.hasSelectedByAssessment = list
        }
      }
    },
    setEnd () {
      if (!this.value1) {
        return
      }
      service.post(`backJudgementController/setCheckEndTime`, {
        endTime: this.value1 !== this.length ? dateFormat((new Date(this.value1)).getTime() + 86399900, 'yyyy-MM-dd HH:mm:ss') : dateFormat(this.value1, 'yyyy-MM-dd HH:mm:ss')
      })
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
          this.value1 = this.length
        } else {
          success(this, res.data.message, 2000)
          this.getEndTime()
        }
      })
    },
    allAdd () {
      this.count = this.selection.length
      if (this.count > 1) {
        this.ids = this.selection.map(n => n.id).join(',')
      } else {
        this.id = this.selection[0].id
      }
      this.hasSelectedByAssessment = []
      this.dialogVisible = true
      this.editflag = false
      this.getExperts()
    },
    add (id) {
      this.id = id
      this.count = 1
      this.dialogVisible = true
      this.editflag = false
      this.getExperts()
      this.hasSelectedByAssessment = []
    },
    edit (id) {
      this.editflag = true
      this.id = id
      this.dialogVisible = true
      this.hasSelectedByAssessment = []
      this.getExperts()
      this.getDetail()
    },
    choose (selection, row) {
      this.count = selection.length
      this.selection = selection
      this.ids = selection.map(n => n.id).join(',')
    },
    selectAll (selection) {
      this.count = selection.length
      this.selection = selection
      this.ids = selection.map(n => n.id).join(',')
    },
    getDetail () {
      service.get(`backJudgementController/getCheckUserByTopicId?topicId=${this.id}`)
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          res.data.result.map(item => {
            this.hasSelectedByAssessment.push({name: item.userName, id: item.userId, state: item.userType})
          })
          setTimeout(() => {
            this.$refs.data2.setCheckedNodes(this.hasSelectedByAssessment)
          }, 200)
        }
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getData()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    getExperts () {
      service.get(`backJudgementController/getAllExpertAndUser`)
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          this.data2[0].children = [...res.data.result.expertList]
          this.data2[1].children = [...res.data.result.userList]
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getData () {
      this.loading = true
      setTimeout(() => {
        service.get(`backJudgementController/getNowGuideTopicList?pageNo=${this.currentPage}&pageSize=${this.pageSize}&ifAdd=${this.value}&ifCheck=${this.typeValue}`)
        .then(res => {
          if (res.data.code === 1) {
            res.data.result.list ? this.tableData = res.data.result.list : this.tableData = []
            this.totalCount = res.data.result.totalCount
            this.loading = false
            this.count = 0
          } else {
            notice(this, res.data.message, 2000)
          }
          this.loading = false
        })
        .catch(res => {
          notice(this, res.data.message, 2000)
        })
      }, 1000)
    },
    getEndTime () {
      service.get(`backJudgementController/getCheckEndTime`)
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          this.value1 = res.data.result
          this.length = this.value1
        }
      })
    }
  },
  watch: {
    filterText (val) {
      this.$refs.data2.filter(val)
    }
  },
  created () {
    this.getData()
    this.getEndTime()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.assign-group{
  padding-bottom: $width;

  .add-btn {
    display: inline-block;
    width:22px;
    height: 22px;
    float: left;
    margin-top: 2px;
    background: url(../../../../src/assets/images/courseManager/btn-add-normal.png);
    &:hover {
    background: url(../../../../src/assets/images/courseManager/btn-add-active.png);
    }
  }
  .disAdd {
    &:hover {
      background: url(../../../../src/assets/images/courseManager/btn-add-normal.png) !important;
    }
  }
  .disEdit {
    &:hover {
      background: url(../../../../src/assets/images/courseManager/btn-edit-normal.png) !important;
    }    
  }
  .edit-btn {
    float: left;
    margin-top: 2px;
    display: inline-block;
    width: 22px !important;
    height: 22px !important;
    background: url(../../../../src/assets/images/courseManager/btn-edit-normal.png);
    &:hover {
    background: url(../../../../src/assets/images/courseManager/btn-edit-active.png);
    }
  }

  .red {
    color: #F47564 !important;
  }
  .green {
    color: #87D57C !important;
  }

  .buttons {
    margin-top: 20px;
    &>span {
      line-height: 30px;
      margin-left: 10px;
    }

    &>.el-button {
      img {
        margin-right: 13px;
        vertical-align: middle;
      }
    }

    &>.el-pagination{
      text-align: right;
      width: 500px;
      float: right;
    } 
  }


  header{
    padding: 25px 0px 20px 0px;

    &:after {
      display: block;
      content: '';
      height: 0;
      clear: both;
      overflow: hidden;
      visibility: hidden;
    }
    img {
      float: left;
    }
    span {
      margin-left: 10px;
      font-size: 16px;
      float: left;
      height: 24px;
      line-height: 24px;
    }
  }

  main{
    background: #fff;

    .el-table::before {
      display: none;
    }
    .el-table td, .el-table th.is-leaf {
      border: none !important;
    }
    .el-table .head  {
      background: #EBEEF7;
      color: #666;
    }
    .el-table__header {
      /* width: auto !important; */

      tr {
        background: #EBEEF7;
        border-radius: 4px;
        th {
          &:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
          }
           &:nth-child(8){
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
           }
        }
      }
    }
    .el-table__body {
      tr {

        &:hover {
          cursor: default;
          td {
            color: #5295EB;
          }
        }
        td {
          color: #999;
          padding: 5px 0px;
          &:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
          }
          &:nth-child(8){
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
            .cell {
              &>span {
                height: 29px;
                line-height: 29px;
                display: block;
                float: left;
                margin-right: 10px;
              }
            }
           }
        }
      }      
    }
    .table-box {
      padding: 0px $width $width $width;
      margin-top: 0px;
    }
    .el-table {


      /* img {
        margin-right: 10px;
      } */
    }
    
    p {
      padding: $width;
      font-size: 16px;
      border-bottom: 1px solid #EBEEF7;
      position: relative;

      img {
        margin-right: 10px;
      }
      a {
        margin-left: 10px;
      }
      &>span {
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
    }
    .button-group{
      padding: 20px; 
      &:after {
        @include clearfloat;
      }
      &>ul {
        float: left;
        &>li {
          float: left;
          margin-right: 10px;
        }
      }
      .el-select{
        margin-left: 10px;
        width: 150px;
      }
    }

    .bottom {
      margin-top: 20px;
      span {
        line-height: 30px;
      }     
    }
  }

  // 新增弹出框
  .el-dialog{
    .el-dialog__header {
      border-bottom: 1px solid #E4E9ED;
      padding: 20px;
    }

    .el-dialog__footer {
      text-align: center;
      padding-top: 0px;
      .el-button {
        padding: 10px 28px;
        color: #fff;

        &:nth-child(1) {
          background: #59A1FF;
          border: 1px solid #59A1FF;

          &:hover {
            background: #59A1FF !important;
            border: 1px solid #59A1FF !important;
          }
        }

        &:nth-child(2) {
          background: #FF6C60;
          border: 1px solid #FF6C60;
        }
      }
    }  
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
      font-size: 18px;
      margin-top: 2px;
    }      
    .el-dialog__body{
      padding-top: 10px;
      &>p{
        font-size: 16px;
        margin-bottom: 10px;
      }
      &>.el-row{
        .el-col:first-child,.el-col:last-child{
          border: 1px solid #ddd;
          border-radius: 5px;
          width: 280px;
          padding: 10px 10px 0 10px;
          box-sizing: border-box;
          height: 300px;
          
          .el-tree{
            margin-top: 10px;
            height: 230px;
            overflow-x: hidden;
            span{
              font-size: 16px;
            }

          }
          &>ul {
            height: 280px;
            overflow-y: auto;
            &>li {
            text-indent: 2em;
            &>span {
              &>li {
                line-height: 30px;
                &:hover {
                  cursor: move;
                }
                &>i {
                  float: right;
                    &:hover {
                      color: red;
                      cursor: pointer;
                    }
                  }
                }
              }
            }
          }
        }
        .el-col:nth-child(2){
          line-height: 300px;
          font-size: 50px;
        }
      }

    }
    .el-dialog__close {
      position: absolute;
      top: -60px;
      right: -60px;
      width: 25px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      border-radius: 50%;
      border: 2px solid #fff; 
      color: #fff;

      &:hover {
        background: #FF6C60;
        color: #fff;
      }
    } 
  }
}
</style>
