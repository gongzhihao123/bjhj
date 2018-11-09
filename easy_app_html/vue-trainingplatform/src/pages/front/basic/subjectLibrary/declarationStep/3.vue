<template>
  <div class="step-3">
    <p>参与人信息
      <br>
      <span>
        <i>*</i>
        说明：只需要填写主要参与人员信息
      </span> 
    </p>

    <el-table
      :data="tableData"
      border
      stripe
      style="width: 840px">
      <el-table-column
        prop="userName"
        label="参与人姓名"
        align='center'
        show-overflow-tooltip
        label-class-name="head">
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        align='center'
        show-overflow-tooltip
        label-class-name="head">
        <template slot-scope="scope">
          {{ scope.row.sex === 1 ? '男' : '女'}}
        </template>
      </el-table-column>
      <el-table-column
        label="出生年月"
        align='center'
        show-overflow-tooltip
        label-class-name="head">
        <template slot-scope="scope">
          {{ scope.row.birthday | dateFormatT('yyyy-MM-dd') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="education"
        label="学历"
        align='center'
        show-overflow-tooltip
        label-class-name="head">
      </el-table-column>
      <el-table-column
        prop="degree"
        label="学位"
        align='center'
        show-overflow-tooltip
        label-class-name="head">
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="工作单位"
        align='center'
        show-overflow-tooltip
        label-class-name="head">
      </el-table-column>
      <el-table-column
        prop="specialtyDuty"
        label="专业职务"
        align='center'
        show-overflow-tooltip
        label-class-name="head">
      </el-table-column>
      <el-table-column
        prop="studySpeciality"
        label="研究专长"
        align='center'
        show-overflow-tooltip
        label-class-name="head">
      </el-table-column>
      <el-table-column
        label="功能"
        align='center'
        show-overflow-tooltip
        label-class-name="head">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <p>
      <el-button size="small" type="primary" @click="submitForm('contentData')" :disabled="canSave">
        保存
      </el-button>
    </p>

    <el-form :model="contentData" ref="contentData" label-width="100px" class="demo-ruleForm">

      <el-row>
        <el-col :span="4" class="text-right">参与人姓名：</el-col>
        <el-col :span="20">
          <el-form-item
            prop="name"
            :rules="[
              { required: true, message: '参与人姓名不能为空'},
            ]"
          >
            <!-- <el-input type="name" v-model="contentData.company" placeholder="请输入参与人单位搜索" @keyup.enter.native="search" prefix-icon="el-icon-search" :maxlength="20"></el-input> -->
            <el-button type="primary" size="small" @click="search">选择</el-button>
            {{ userName.name }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4" class="text-right">参与人单位：</el-col>
        <el-col :span="20">
          <el-form-item
            class="name"
            prop="company"
            :rules="[
              { required: true, message: '参与人单位不能为空'},
            ]"
          >
            <!-- <el-input type="name" v-model="contentData.name" :maxlength="20"></el-input> -->
            <span>{{ companyName }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4" class="text-right">性别：</el-col>
        <el-col :span="20">
          <el-form-item
            prop="sex"
            :rules="[
              { required: true, message: '性别不能为空'},
            ]"
          >
            <el-select v-model="contentData.sex" placeholder="请选择">
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4" class="text-right">出生年月：</el-col>
        <el-col :span="20">
          <el-form-item
            prop="bornDate"
            :rules="[
              { required: true, message: '出生年月不能为空'},
            ]"
          >
            <el-date-picker
              v-model="contentData.bornDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="4" class="text-right">学历：</el-col>
        <el-col :span="20">
          <el-form-item
            prop="education"
            :rules="[
              { required: true, message: '学历不能为空'},
            ]"
          >
            <el-input v-model="contentData.education" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4" class="text-right">学位：</el-col>
        <el-col :span="20">
          <el-form-item
            prop="degree"
            :rules="[
              { required: true, message: '学位不能为空'},
            ]"
          >
            <el-input v-model="contentData.degree" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-row>
        <el-col :span="4" class="text-right">工作单位：</el-col>
        <el-col :span="20">
          <el-form-item
            prop="company"
            :rules="[
              { required: true, message: '工作单位不能为空'},
            ]"
          >
            <el-input v-model="contentData.company" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->

      <el-row>
        <el-col :span="4" class="text-right">专业职务：</el-col>
        <el-col :span="20">
          <el-form-item
            prop="majorsDuty"
            :rules="[
              { required: true, message: '专业职务不能为空'},
            ]"
          >
            <el-input v-model="contentData.majorsDuty" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4" class="text-right">研究专长：</el-col>
        <el-col :span="20">
          <el-form-item
            prop="specialty"
            :rules="[
              { required: true, message: '研究专长不能为空'},
            ]"
          >
            <el-input v-model="contentData.specialty" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    

    <!-- 弹出框 -->
    <el-dialog width="340px" title="请选择学校" :visible.sync="outerVisible">
      <!-- <el-dialog
        class="inner-dialog"
        title="请选择参与人"
        :visible.sync="innerVisible"
        append-to-body>
        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-dialog> -->
      <el-input
        placeholder="输入单位名称进行过滤"
        prefix-icon="el-icon-search"
        v-model="filterText">
      </el-input>
      <el-tree :data="schoolList" :props="defaultProps" @node-click="handleNodeClick" ref="tree2" :filter-node-method="filterNode"></el-tree>
        <!-- <el-row>
          <el-col :span="8" v-for="(item, index) in schoolList" :key="index" @click.native="getCompanyDeptUser(item)"> {{ item.name }} </el-col>
        </el-row> -->
        <p v-if="schoolList.length === 0"> 暂无数据 </p>
      <div slot="footer" class="dialog-footer">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import server from '../../../../../utils/axios'
import { success, notice } from '../../../../../api/index'
import { dateFormatT } from '../../../../../filters/index'
import { TreeMenu } from '../../../../../api/tree'
export default {
  name: 'step-3',
  data () {
    return {
      filterText: '',
      canSave: false,
      userName: '',
      outerVisible: false,
      innerVisible: false,
      companyName: '',
      contentData: {
        name: '',
        sex: '',
        bornDate: '',
        education: '',
        degree: '',
        company: '',
        majorsDuty: '',
        specialty: ''
      },
      tableData: [],
      sexOptions: [
        { label: '男', value: 1 },
        { label: '女', value: 0 }
      ],
      schoolList: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick (val) {
      if (val.deptId) {
        this.userName = val
        this.outerVisible = false
        this.innerVisible = false
        this.contentData.name = val.name
      } else {
        if (!val.parentId && val.parentId !== 0) {
          this.getCompanyDeptUser(val)
        }
      }
    },
    // 删除
    del (val) {
      server.post('/frontTopicDeclareController/deleteStepThree', {
        stepThreeId: val.id
      })
      .then(res => {
        this.getStepThreeList()
      })
    },
    // 保存
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.save()
        } else {
          return false
        }
      })
    },
    // 保存
    save () {
      this.canSave = true
      server.post('/frontTopicDeclareController/saveStepThree', {
        topicId: sessionStorage.SUBJECT_ID,
        userId: this.userName.userId,
        userName: this.userName.name,
        companyName: this.companyName,
        sex: this.contentData.sex,
        birthday: dateFormatT(this.contentData.bornDate.getTime() + 86399000, 'yyyy-MM-dd hh:mm:ss'),
        education: this.contentData.education,
        degree: this.contentData.degree,
        specialtyDuty: this.contentData.majorsDuty,
        studySpeciality: this.contentData.specialty
      })
      .then(res => {
        if (res.data.code === 1) {
          success(this, '保存成功', 1000)
          this.getStepThreeList()
          this.$refs['contentData'].resetFields()
          this.userName = ''
          this.companyName = ''
        } else {
          notice(this, res.data.message, 2000)
        }
        this.canSave = false
      })
    },
    // 获取课题参与人列表
    getStepThreeList () {
      server.get(`/frontTopicDeclareController/getStepThreeList?topicId=${sessionStorage.SUBJECT_ID}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 搜索
    search () {
      this.filterText = ''
      this.getCompanyList()
    },
    // 获取单位信息
    getCompanyList () {
      server.get(`/frontTopicDeclareController/getCompanyList?keyword=${''}`)
      .then(res => {
        if (res.data.code === 1) {
          this.outerVisible = true
          this.schoolList = res.data.result.map(item => ({...item, children: [{name: '_'}]}))
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取人
    getCompanyDeptUser (item) {
      server.get(`/frontTopicDeclareController/getCompanyDeptUser?companyId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.contentData.company = item.name
          this.companyName = item.name
          res.data.result.users = res.data.result.users.map(item => ({...item, parentId: item.deptId}))
          res.data.result.depts = res.data.result.depts.map(item => ({...item, parentId: 0}))
          this.treeData = new TreeMenu(res.data.result.depts.concat(res.data.result.users)).init(0)
          // this.innerVisible = true
          this.schoolList.filter(n => n.id === item.id)[0].children = this.treeData
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val)
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.tableData.length !== 0) {
      next()
    } else {
      this.$confirm('您还没有创建参与人信息，确定离开吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
        next(false)
      })
    }
  },
  created () {
    this.getStepThreeList()
  }
}
</script>

<style lang="scss">
@import '../../../../../assets/scss/variable.scss';
@import '../../../../../assets/scss/mixin.scss';
.step-3{
  &>p:nth-child(3){
    text-align: right;
    padding: $width;
    font-size: 18px;
  }

  &>p:nth-child(1){
    text-align: center;
    padding: 17px;
    font-size: 20px;
    background: #F8F9FC;
    border-bottom: #EDF1F4;

    &>span {
      font-size: 14px;
      color: #B8B8B8;

      i {
        color: red;
      }
    } 
  }

  .el-table{
    margin-top: 0px;
  }

  .el-form{
    margin-top: $width;
    .el-row{

      padding-left: 20px;

      .el-col:last-child{
        padding-left: $width;
        padding-bottom: 22px;
        line-height: 40px;

        .el-form-item{
          margin-bottom: 0;
        }
      }

      .el-input {
        width: 360px;
      }
    }
    .el-row:nth-child(2){
      .el-form-item__content{
        height: $width*1.5;
      }
    }
    .el-row:nth-child(3){
      .el-col:last-child{
        line-height: 40px;
      }
    }
    .text-right{
      text-align: left;
      line-height: $width*2;
      font-size: 15px;
    }
    .el-form-item__content{
      margin-left: 0 !important;
      padding-right: 100px;
    }
  }

  .el-dialog{
    .el-dialog__body{
      padding-top: 10px;
      .el-tree{
        height: 300px;
        overflow-x: hidden;
      }
      .el-input{
        margin-bottom: 10px;
      }
      .el-col{
        cursor: pointer;
        text-align: center;
        &:hover{
          color: #1AB3F7;
        }
      }
      &>p{
        text-align: center;
      }
    }
  }

  
}
.inner-dialog{
  .el-dialog{
    .el-dialog__body{
      padding-right: 100px;
      height: 300px;
      overflow-x: hidden;
      padding-left: 100px;
    }
  }
}
</style>
