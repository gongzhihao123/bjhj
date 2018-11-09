<template>
  <div class="step-2">
    <p>
      负责人信息
      <br>
      <span>
        <i>*</i>
        说明：不能填写部分都是从个人信息获取来的
      </span>  
    </p>

    <p>
      <el-button size="small" type="primary" @click="submitForm ('contentData')" :disabled="canSave">
        保存
      </el-button>
    </p>

    <el-form :model="contentData" ref="contentData" label-width="100px" class="demo-ruleForm">

      <el-row>
        <el-col v-if="!isChange" :span="12" style="line-height: 40px;" class="text-right">
          <span> 负责人姓名：</span>
          {{ user ? user.name : '' }}
        </el-col>
        <el-col  v-if="isChange" :span="12">
          <span> 负责人姓名：</span>
          <el-button size="small" @click="search" type="primary">选择</el-button>
          {{ userName }}
        </el-col>
        <el-col :span="12">
          <span> 性别：</span>
          <el-form-item
            prop="sexValue"
            :rules="[
              { required: true, message: '性别不能为空'},
            ]"
            >
            <el-select v-model="contentData.sexValue" placeholder="请选择">
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

      <el-row style="margin-bottom: 10px;">
        <el-col :span="12" class="text-right">
          <span> 民族：</span>
          <el-form-item
            prop="peoples"
            :rules="[
              { required: true, message: '民族不能为空'},
            ]"
          >
            <el-input type="peoples" v-model="contentData.peoples" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <span> 出生年月：</span>
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
        <el-col :span="12" class="text-right">
          <span> 行政职务：</span>
          <el-form-item
            prop="administrationDuty"
            :rules="[
              { required: true, message: '行政职务不能为空'},
            ]"
          >
            <el-input v-model="contentData.administrationDuty" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <span> 专业职务：</span>
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
        <el-col :span="12" class="text-right">
          <span> 最后学历：</span>
          <el-form-item
            prop="education"
            :rules="[
              { required: true, message: '最后学历不能为空'},
            ]"
          >
            <el-input v-model="contentData.education" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="text-right">
          <span> 最后学位：</span>
          <el-form-item
            prop="degree"
            :rules="[
              { required: true, message: '最后学位不能为空'},
            ]"
          >
            <el-input v-model="contentData.degree" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row  style="margin-bottom: 10px;">
        <el-col :span="12">
          <span> 研究专长：</span>
          <el-form-item
            prop="specialty"
            :rules="[
              { required: true, message: '研究专长不能为空'},
            ]"
          >
            <el-input v-model="contentData.specialty" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="!isChange" :span="12" class="text-right" style="line-height: 45px;">
          <span> 工作单位：</span>
          {{ user ? user.companyName : '' }}
        </el-col>
        <el-col v-if="isChange" :span="12" class="text-right" style="line-height: 45px;">
          <span> 工作单位：</span>
          {{ companyName }}
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" class="text-right">
          <span> 通讯地址：</span>
          <el-form-item
            prop="address"
            :rules="[
              { required: true, message: '通讯地址不能为空'},
            ]"
          >
            <el-input v-model="contentData.address" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <span> 电子邮箱：</span>
          <el-form-item
            prop="E_mail"
            :rules="[
              { required: true, message: '电子邮箱不能为空'},
            ]"
          >
            <el-input v-model="contentData.E_mail"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" class="text-right">
          <span> 单位电话：</span>
          <el-form-item
            prop="companyPhone"
            :rules="[
              { required: true, message: '单位电话不能为空'},
            ]"
          >
            <el-input v-model="contentData.companyPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <span> 邮政编码：</span>
          <el-form-item
            prop="postcode"
            :rules="[
              { required: true, message: '邮政编码不能为空'},
            ]"
          >
            <el-input v-model="contentData.postcode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" class="text-right">
          <span> 个人电话：</span>
          <el-form-item
            prop="personPhone"
            :rules="[
              { required: true, message: '个人电话不能为空'},
            ]"
          >
            <el-input v-model="contentData.personPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <span> 家庭电话：</span>
          <el-form-item
            prop="homePhone"
            :rules="[
              { required: true, message: '家庭电话不能为空'},
            ]"
          >
            <el-input v-model="contentData.homePhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

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
        <!-- <p v-if="schoolList.length === 0"> 暂无数据</p> -->
      <div slot="footer" class="dialog-footer">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { success, notice } from '../../../../../api/index'
import { dateFormatT } from '../../../../../filters/index'
import server from '../../../../../utils/axios'
import { TreeMenu } from '../../../../../api/tree'
export default {
  name: 'step-2',
  data () {
    return {
      filterText: '',
      userName: '',
      userId: '',
      companyName: '',
      schoolList: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isChange: false,
      canSave: false,
      outerVisible: false,
      innerVisible: false,
      changeObject: {},
      contentData: {
        editId: '',
        sexValue: '',
        peoples: '',
        bornDate: '',
        administrationDuty: '', // 行政职务
        majorsDuty: '', // 专业职务
        education: '',
        degree: '', // 学位
        specialty: '', // 专长
        address: '',
        E_mail: '',
        companyPhone: '',
        postcode: '',
        personPhone: '',
        homePhone: '',
        schoolArr: []
      },
      sexOptions: [
        { label: '男', value: 1 },
        { label: '女', value: 0 }
      ]
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 搜索
    search () {
      this.userName = ''
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
          this.schoolArr = res.data.result.map(item => ({...item, children: [{name: '_'}]}))
          console.log(this.schoolList)
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
    },
    handleNodeClick (val) {
      if (val.deptId) {
        this.userName = val.name
        this.userId = val.userId
        this.outerVisible = false
        this.innerVisible = false
        this.contentData.name = val.name
      } else {
        if (!val.parentId && val.parentId !== 0) {
          this.getCompanyDeptUser(val)
        }
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(this.contentData.E_mail)) {
            notice(this, '邮箱格式不正确', 2000)
            return
          }
          if (!(/^\d{8}$/).test(this.contentData.companyPhone)) {
            notice(this, '单位电话应为8位数字', 2000)
            return
          }
          if (!(/^[0-9]{6}$/).test(this.contentData.postcode)) {
            notice(this, '邮政编码应为6位数字', 2000)
            return
          }
          if (!(/^\d{11}$/).test(this.contentData.personPhone)) {
            notice(this, '个人电话应为11位数字', 2000)
            return
          }
          if (!(/^\d{8}$/).test(this.contentData.homePhone)) {
            notice(this, '家庭电话应为8位数字', 2000)
            return
          }
          if (sessionStorage.IS_CHANGE === '1') {
            this.change()
          } else {
            if (this.editId) {
              this.editStepTwo()
            } else {
              this.saveStepTwo()
            }
          }
        } else {
          return false
        }
      })
    },
    // 变更
    change () {
      if (!this.userName) {
        notice(this, '请选择负责人', 2000)
        return
      }
      this.canSave = true
      server.post('/frontTopicManageController/saveStateTwo', {
        changeId: this.changeObject === null ? null : this.changeObject.id,
        tpTopicId: sessionStorage.SUBJECT_ID,
        leadUserId: this.userId,
        leadUserName: this.userName,
        companyName: this.companyName,
        sex: this.contentData.sexValue,
        nation: this.contentData.peoples,
        birthday: String(this.contentData.bornDate).length === 13 ? dateFormatT(Number(this.contentData.bornDate), 'yyyy-MM-dd hh:mm:ss') : dateFormatT(this.contentData.bornDate.getTime() + 86399000, 'yyyy-MM-dd hh:mm:ss'),
        administrativeDuty: this.contentData.administrationDuty,
        specialtyDuty: this.contentData.majorsDuty,
        education: this.contentData.education,
        degree: this.contentData.degree,
        studySpeciality: this.contentData.specialty,
        address: this.contentData.address,
        email: this.contentData.E_mail,
        companyPhone: this.contentData.companyPhone,
        postalCode: this.contentData.postcode,
        phone: this.contentData.personPhone,
        familyPhone: this.contentData.homePhone,
        changeReason: ''
      })
      .then(res => {
        if (res.data.code === 1) {
          this.selectStateTwo()
          success(this, '保存成功', 1000)
        } else {
          notice(this, res.data.message, 2000)
        }
        this.canSave = false
      })
    },
    // 保存
    saveStepTwo () {
      this.canSave = true
      server.post('/frontTopicDeclareController/saveStepTwo', {
        topicId: sessionStorage.SUBJECT_ID,
        leadUserId: this.user.id,
        leadUserName: this.user.name,
        leadUserFace: this.user.userFace,
        companyName: this.user.companyName,
        sex: this.contentData.sexValue,
        nation: this.contentData.peoples,
        birthday: dateFormatT(this.contentData.bornDate.getTime() + 86399000, 'yyyy-MM-dd hh:mm:ss'),
        administrativeDuty: this.contentData.administrationDuty,
        specialtyDuty: this.contentData.majorsDuty,
        education: this.contentData.education,
        degree: this.contentData.degree,
        studySpeciality: this.contentData.specialty,
        address: this.contentData.address,
        email: this.contentData.E_mail,
        companyPhone: this.contentData.companyPhone,
        postalCode: this.contentData.postcode,
        phone: this.contentData.personPhone,
        familyPhone: this.contentData.homePhone
      })
      .then(res => {
        if (res.data.code === 1) {
          success(this, '保存成功', 1000)
          this.getStepTwo()
        } else {
          notice(this, res.data.message, 2000)
        }
        this.canSave = false
      })
    },
    // 修改
    editStepTwo () {
      this.canSave = true
      server.post('/frontTopicDeclareController/editStepTwo', {
        id: this.editId,
        topicId: sessionStorage.SUBJECT_ID,
        leadUserId: this.user.id,
        leadUserName: this.user.name,
        leadUserFace: this.user.userFace,
        companyName: this.user.companyName,
        sex: this.contentData.sexValue,
        nation: this.contentData.peoples,
        birthday: String(this.contentData.bornDate).length === 13 ? dateFormatT(Number(this.contentData.bornDate), 'yyyy-MM-dd hh:mm:ss') : dateFormatT(this.contentData.bornDate.getTime() + 86399000, 'yyyy-MM-dd hh:mm:ss'),
        administrativeDuty: this.contentData.administrationDuty,
        specialtyDuty: this.contentData.majorsDuty,
        education: this.contentData.education,
        degree: this.contentData.degree,
        studySpeciality: this.contentData.specialty,
        address: this.contentData.address,
        email: this.contentData.E_mail,
        companyPhone: this.contentData.companyPhone,
        postalCode: this.contentData.postcode,
        phone: this.contentData.personPhone,
        familyPhone: this.contentData.homePhone
      })
      .then(res => {
        if (res.data.code === 1) {
          success(this, '修改成功', 1000)
        } else {
          notice(this, res.data.message, 2000)
        }
        this.canSave = false
      })
    },
    // 获取负责人信息-第二步
    getStepTwo () {
      server.get(`/frontTopicDeclareController/getStepTwo?topicId=${sessionStorage.SUBJECT_ID}`)
      .then(res => {
        if (res.data.code === 1) {
          if (res.data.result) {
            // this.changeObject = res.data.result
            let data = res.data.result
            this.editId = data.id
            this.contentData = {
              sexValue: data.sex,
              peoples: data.nation,
              bornDate: data.birthday,
              administrationDuty: data.administrativeDuty, // 行政职务
              majorsDuty: data.specialtyDuty, // 专业职务
              education: data.education,
              degree: data.degree, // 学位
              specialty: data.studySpeciality, // 专长
              address: data.address,
              E_mail: data.email,
              companyPhone: data.companyPhone,
              postcode: data.postalCode,
              personPhone: data.phone,
              homePhone: data.familyPhone
            }
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 变更获取内容-第二步
    selectStateTwo () {
      server.get(`/frontTopicManageController/selectStateTwo?id=${sessionStorage.SUBJECT_ID}`)
      .then(res => {
        if (res.data.code === 1) {
          sessionStorage.changeId = JSON.stringify(res.data.result.changeId)
          this.changeObject = res.data.result.changeId
          let data = res.data.result.tpTopicStepTwo
          this.userName = data.leadUserName
          this.userId = data.leadUserId
          this.companyName = data.companyName
          this.editId = data.id
          this.contentData = {
            sexValue: data.sex,
            peoples: data.nation,
            bornDate: data.birthday,
            administrationDuty: data.administrativeDuty, // 行政职务
            majorsDuty: data.specialtyDuty, // 专业职务
            education: data.education,
            degree: data.degree, // 学位
            specialty: data.studySpeciality, // 专长
            address: data.address,
            E_mail: data.email,
            companyPhone: data.companyPhone,
            postcode: data.postalCode,
            personPhone: data.phone,
            homePhone: data.familyPhone
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  watch: {
    filterText (val) {
      let arr = this.schoolArr.filter(item => item.name.indexOf(val) !== -1)
      this.schoolList = arr
      // this.$refs.tree2.filter(val)
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.editId) {
      next()
    } else {
      this.$confirm('您还没有创建负责人信息，确定离开吗？', '提示', {
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
    if (sessionStorage.IS_CHANGE === '1') {
      this.isChange = true
      this.selectStateTwo()
    } else {
      this.getStepTwo()
    }
  }
}
</script>

<style lang="scss">
@import '../../../../../assets/scss/variable.scss';
@import '../../../../../assets/scss/mixin.scss';
.step-2{
  &>p:nth-child(2){
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

  .el-form{
    .el-row{
      .el-col{
        padding-left: 40px;
        &>span{
          display: inline-block;
          width: 120px;
          text-align: left;
        }
        .el-form-item{
          width: 65%;
          display: inline-block;
          .el-form-item__content{
            margin-left: 0 !important;
          }
        }

        .el-input {
          width: 202px;
        }
      }
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
