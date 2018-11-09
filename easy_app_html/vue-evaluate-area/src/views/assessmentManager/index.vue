<template>
  <div id="assessment-manager">
    <header>
      测评管理
    </header>
    <p class="add-button">
      <el-button @click="createAssessment" type="primary" icon="el-icon-plus"><i class="el-icon-plus"></i>&nbsp;创建测评</el-button>
    </p>

    <!-- 测评列表 -->
    <div class="manager-list">
      <el-row>
        <el-col :span="Number(item.num)" v-for="(item, index) in listTitle" :key="index">{{item.name}}</el-col>
      </el-row>

      <transition-group name="slide-left" mode="out-in">
        <el-row @mouseleave.native="item.show = false" class="list-body" v-for="(item, index) in listBody" :key="index">
          <el-col :span="2">{{ pageSize * (pageNo - 1) + index + 1 }}</el-col>
          <el-col :span="6">
            <el-popover
              placement="top"
              v-if="item.name.length >= 10"
              :width="item.name.length * 7"
              trigger="hover"
              :content="item.name">
              <span @click="lookDetails(item)" style="cursor: pointer;" slot="reference">{{item.name.slice(0, 20) + '...'}}</span>
            </el-popover>
            <span @click="lookDetails(item)" style="cursor: pointer;" v-if="item.name.length < 10">{{item.name}}</span>
          </el-col>
          <el-col :span="4">{{item.starttime | dateFormatT('yyyy-MM-dd hh:mm:ss')}}</el-col>
          <el-col :span="4">{{item.endtime | dateFormatT('yyyy-MM-dd hh:mm:ss')}}</el-col>
          <el-col :span="3">
            <img src="../../assets/images/yellow-point.png" v-if="(item.checkState === 1 || item.checkState === 0)">
            <img src="../../assets/images/green-point.png" v-if="item.checkState === 2">
            <img src="../../assets/images/red-point.png" v-if="item.checkState === 3">
            <el-popover
              placement="top"
              title="驳回原因"
              width="200"
              trigger="hover"
              :content="item.reason">
              <span slot="reference" v-if="item.checkState === 3 && item.needCheck === 1">审核驳回</span>
            </el-popover>
            <!-- <span v-if="item.needCheck === 0"> -- </span> -->
            <span v-if="item.checkState === 0">未提交</span>
            <span v-if="item.checkState === 1">待审核</span>
            <span v-if="item.checkState === 2">审核通过</span>
            <el-popover
              placement="top"
              title="驳回原因"
              width="200"
              trigger="hover"
              :content="item.reason">
              <img slot="reference" class="rejected" src="../../assets/images/rejected.png" v-if="item.checkState === 3">
            </el-popover>
          </el-col>
          <el-col :span="3">
            <span v-if="item.checkState !== 2 || (item.checkState === 2 && item.isStarting === 1)">
              <img src="../../assets/images/yellow-point.png">未开始
            </span>
            <span v-if="item.checkState === 2 && item.isStarting === 2">
              <img src="../../assets/images/green-point.png">进行中
            </span>
            <span v-if="item.checkState === 2 && item.isStarting === 3">
              <img src="../../assets/images/red-point.png">已结束
            </span>
          </el-col>
          <el-col :span="2">
            <i v-if="item.checkState === 1" style="cursor: default;">--</i>
            <i v-else class="el-icon-more" @click="item.show = !item.show"></i>
            <div v-if="item.show">
              <p v-if="item.checkState === 0 || item.checkState === 3 || (item.checkState === 2 && item.isStarting === 2) || (item.checkState === 2 && item.isStarting === 1) || (item.checkState === 2 && item.isStarting === 3)" @click="edit(item)">编辑</p>
              <p v-if="item.checkState === 0 || item.checkState === 3" @click="del(item)">删除</p>
              <p v-if="item.checkState === 2 && item.isStarting !== 1" @click="lookResult(item)">测评结果</p>
              <p v-if="item.checkState === 2 && item.isStarting !== 1" @click="lookAssessmentPeople(item)">查看测评人</p>
              <p v-if="item.checkState === 0" @click="submitCheck(item)">提交审核</p>
            </div>
          </el-col>
        </el-row>
      </transition-group>
      
    </div>

    <!--分页-->
    <div class="page" v-if="listBody.length !== 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { notice, success, error } from '../../api/index'
import querystring from 'querystring'
import { mapActions } from 'vuex'
export default {
  name: 'assessmentManager',
  data () {
    return {
      nowTime: '',
      visible: false,
      listTitle: [
        {name: '序号', num: '2'},
        {name: '测评名称', num: '6'},
        {name: '开始时间', num: '4'},
        {name: '结束时间', num: '4'},
        {name: '审核状态', num: '3'},
        {name: '测评状态', num: '3'},
        {name: '操作', num: '2'}
      ],
      listBody: [],
      pageSize: 20,
      totalCount: 0,
      pageNo: 1
    }
  },
  methods: {
    ...mapActions([
      'people'
    ]),
    handleCurrentChange (val) {
      this.pageNo = val
      this.getList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    // 查看详情
    lookDetails (item) {
      this.$router.push({path: '/assessmentManager/lookDetails', query: {id: JSON.stringify(item.id)}})
    },
    // 提交审核
    submitCheck (item) {
      this.$https.post('/eval/comfirmCheck', querystring.stringify({
        id: item.id
      }))
      .then(res => {
        if (res.data.code === 1) {
          success(this, '提交成功', 1000)
          this.getList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 查看结果
    lookResult (item) {
      this.people(item)
      this.$router.push({path: '/assessmentManager/lookResult', query: {id: JSON.stringify(item.id)}})
    },
    // 查看测评人
    lookAssessmentPeople (item) {
      this.people(item)
      this.$router.push({path: '/assessmentManager/assessmentState', query: {id: JSON.stringify(item.id)}})
    },
    // 删除
    del (item) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$https.post(`/eval/deleteEval`, querystring.stringify({
          id: item.id
        }))
        .then(res => {
          if (res.data.code === 1) {
            success(this, '删除成功', 1000)
            this.getList()
          } else if (res.data.code === -2) {
            notice(this, res.data.message, 2000)
          }
        })
      })
    },
    // 编辑按钮
    edit (item) {
      if (item.checkState === 0 || item.checkState === 3) {
        sessionStorage.isEdit = '1'
        this.$router.push({path: '/assessmentManager/createAssessment', query: {id: JSON.stringify(item.id)}})
      } else {
        this.$router.push({path: '/assessmentManager/editAssessment', query: {id: JSON.stringify(item.id)}})
      }
    },
    // 创建测评
    createAssessment () {
      sessionStorage.isEdit = '2'
      this.$router.push('/assessmentManager/createAssessment')
    },
    // 获取测评管理列表
    getList () {
      this.$https.get(`/eval/getList?pageSize=${this.pageSize}&pageNo=${this.pageNo}`)
      .then(res => {
        if (res.data.code === 1) {
          this.listBody = res.data.result.list.map(item => ({...item, show: false}))
          this.totalCount = res.data.result.totalCount
          this.listBody.forEach((item, index) => {
            if (!item.reason) {
              item.reason = '-'
            }
            if (item.starttime > this.nowTime) {
              item.isStarting = 1 // 未开始
            } else if (item.endtime > this.nowTime && this.nowTime > item.starttime) {
              item.isStarting = 2 // 进行中
            } else if (item.endtime < this.nowTime) {
              item.isStarting = 3 // 已结束
            }
          })
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    this.nowTime = new Date().getTime()
    this.getList()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/main.scss';
#assessment-manager{
  header{
    font-size: 14px;
    padding: 18px;
    padding-bottom: 13px;
    color: #484848;
    border-bottom: 2px solid #DDD;
  }

  &>.add-button{
    padding: $width;
    .el-button{
      font-size: 14px;
      span{
        margin-left: 0;
        i{
          margin-right: 10px;
        }
      }
    }
  }

  // 测评列表
  .manager-list{
    padding-bottom: $width;

    .el-row{
      line-height: 48px;
      border-bottom: 1px solid #E6E6E6;
      color: #333333;
      font-size: 14px;

      .el-col{
        padding-left: 20px;

        &:last-child,&:first-child{
          text-align: center;
          position: relative;

          img{
            cursor: pointer;
          }

          i{
            font-size: 20px;
            cursor: pointer;
            color: #BFBFBF;
          }

          div{
            position: absolute;
            top: 40px;
            right: 5%;
            width: 80px;
            background: #fff;
            border: 1px solid #ddd;
            line-height: 30px;
            z-index: 1001;
            box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);

            p{
              border-bottom: 1px solid #ddd;
              cursor: pointer;
              &:last-child{
                border: 0;
              }
              &:hover{
                background: #ddd;
              }
            }
          }
        }

        img{
          margin-right: $width / 4;
        }

        .rejected{
          vertical-align: middle;
          margin-top: -3px;
        }
      }
    }
    
    .list-body:hover{
      background: #F7F7F7;
    }
  }

  // 分页
  .page {
    text-align: right;
    margin-top: $width;
    margin-bottom: $width;
    
    .el-pagination {
      margin-right: 20px;
    }
  }
}
</style>
