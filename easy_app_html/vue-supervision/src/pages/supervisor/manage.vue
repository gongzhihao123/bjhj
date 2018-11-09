<template>
    <div class="manage">
        <p>
          人员管理
        </p>

        <main>
          <p>
            <el-row>
              <el-col :span="12">
                <el-button icon="el-icon-plus" size="small" type="primary" @click="add">添加人员</el-button>
              </el-col>
              <el-col :span="12">
                <el-input v-model.trim="keyword" placeholder="请输入关键字" @keyup.enter.native="search">
                  <template slot="append"><i class="el-icon-search" @click="search"></i></template>
                </el-input>
              </el-col>
            </el-row>
          </p>

          <template>
            <el-table
              :data="tableData"
              border
              style="width: 100%">
              <el-table-column
                prop="name"
                label="姓名"
                align='center'
                show-overflow-tooltip
                label-class-name="head"
                width="180">
              </el-table-column>
              <el-table-column
                prop="userRoleName"
                label="人员类型"
                align='center'
                show-overflow-tooltip
                label-class-name="head"
                width="180">
              </el-table-column>
              <el-table-column
                prop="mobileNumber"
                label="手机号码"
                align='center'
                show-overflow-tooltip
                label-class-name="head"
                width="180">
              </el-table-column>
              <el-table-column
                prop="ddfield"
                label="督导领域"
                align='center'
                show-overflow-tooltip
                label-class-name="head">
              </el-table-column>
              <el-table-column
                label="操作"
                align='center'
                show-overflow-tooltip
                label-class-name="head"
                width="180">
                <template slot-scope="scope">
                  <span @click="edit(scope.row)" class="edit">编辑</span>
                  <el-popover
                    popper-class="start-over"
                    placement="bottom"
                    trigger="click">
                    <span @click="startOrOver(scope.row)" style="cursor: pointer;">
                      {{ scope.row.userState === 1 ? '禁用' : '启用' }}
                    </span>
                    <span @click="start(scope.row)" slot="reference" :class="{start: scope.row.userState === 1, over: scope.row.userState === 2}">{{ scope.row.userState === 1 ? '启用中' : '禁用中' }}</span>
                    <i class="arrow el-icon-caret-bottom" slot="reference" v-if="!scope.row.show"></i>
                    <i class="arrow el-icon-caret-top" slot="reference" v-else></i>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </template>

          <transition name="slide-left" mode="out-in">
            <div class="right-box" v-click-outside="hide" v-if="boxShow">
              <p>
                <span @click="close">
                  <i class="el-icon-close"></i>
                </span>
                <span>
                  {{ isEdit ? '编辑' : '添加' }}
                </span>
              </p>

              <el-form :model="contentData" :rules="rules" ref="contentData" label-width="100px" class="demo-ruleForm">
                <el-row>
                  <el-col :span="12">
                    <span> 所属单位：</span>
                    <el-form-item
                      prop="company"
                      :rules="[
                        { required: true, message: '所属单位不能为空'},
                      ]"
                    >
                      <el-select v-model="contentData.company" filterable placeholder="请选择" @change="companyChange">
                        <el-option
                          v-for="item in companyList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <span class="red">*</span>
                  </el-col>
                  <el-col :span="12">
                    <span> 姓名：</span>
                    <el-form-item
                      prop="name"
                      :rules="[
                        { required: true, message: '姓名不能为空'},
                      ]"
                    >
                      <el-select :disabled="contentData.company === ''" @change="userChange" filterable v-model="contentData.name" placeholder="请选择">
                        <el-option
                          v-for="item in nameList"
                          :key="item.userId"
                          :label="item.name"
                          :value="item.userId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <span class="red">*</span>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <span> 人员类型：</span>
                    <el-form-item
                      prop="personType"
                      ref="personType"
                      :rules="[
                        { required: true, message: '人员类型不能为空'},
                      ]"
                    >
                      <el-select v-model="contentData.personType" placeholder="请选择" @change="personTypeChange">
                        <el-option
                          v-for="item in personTypeList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <span class="red">*</span>
                  </el-col>
                  <el-col :span="12">
                    <span> 督学分类：</span>
                    <el-form-item
                      prop="supervisorCategory"
                    >
                      <el-select :disabled="contentData.personType === 3" v-model="contentData.supervisorCategory" placeholder="请选择">
                        <el-option
                          v-for="item in supervisorCategoryList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <span class="red">*</span>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <span> 督导类别：</span>
                    <el-form-item
                      prop="supervisionClass"
                    >
                      <el-checkbox :disabled="contentData.personType === 3" v-for="(item, index) in supervisionClassList" :key="index" v-model="item.show">
                        {{ item.label }}
                      </el-checkbox>
                    </el-form-item>
                    <span class="red">*</span>
                  </el-col>
                  <el-col :span="12">
                    <span> 手机号码：</span>
                    <el-form-item
                      prop="phoneNumber"
                      :rules="[
                        { required: false, message: '手机号码不能为空'},
                      ]"
                    >
                      <el-input style="width: 215px;" v-model.trim="contentData.phoneNumber" :maxlength="11"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <span> 性别：</span>
                    <el-form-item
                      prop="sex"
                      :rules="[
                        { required: false },
                      ]"
                    >
                      <el-select v-model="contentData.sex" placeholder="请选择">
                        <el-option
                          v-for="item in sexList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <span> 民族：</span>
                    <el-form-item
                      prop="peoples"
                      :rules="[
                        { required: false },
                      ]"
                    >
                      <el-select v-model="contentData.peoples" placeholder="请选择">
                        <el-option
                          v-for="item in peoplesList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <span> 通讯地址：</span>
                    <el-form-item
                      prop="address"
                      :rules="[
                        { required: false },
                      ]"
                    >
                      <el-input style="width: 575px;" v-model.trim="contentData.address" :maxlength="50"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <span> 出生年月：</span>
                    <el-form-item
                      prop="bornDate"
                      :rules="[
                        { required: false },
                      ]"
                    >
                      <el-date-picker
                        v-model="contentData.bornDate"
                        type="date"
                        placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <span> 政治面貌：</span>
                    <el-form-item
                      prop="politics"
                      :rules="[
                        { required: false },
                      ]"
                    >
                      <el-select v-model="contentData.politics" placeholder="请选择">
                        <el-option
                          v-for="item in politicsList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <span> 从教年月：</span>
                    <el-form-item
                      prop="teachDate"
                      :rules="[
                        { required: false },
                      ]"
                    >
                      <el-date-picker
                        v-model="contentData.teachDate"
                        type="month"
                        placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <span> 是否在职：</span>
                    <el-form-item
                      prop="isJob"
                      :rules="[
                        { required: false },
                      ]"
                    >
                      <el-select v-model="contentData.isJob" placeholder="请选择">
                        <el-option
                          v-for="item in isJobList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <span> 从事督导时间：</span>
                    <el-form-item
                      prop="supervisionDate"
                      :rules="[
                        { required: false },
                      ]"
                    >
                      <el-date-picker
                        v-model="contentData.supervisionDate"
                        type="month"
                        placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <span> 学历：</span>
                    <el-form-item
                      prop="education"
                      :rules="[
                        { required: false },
                      ]"
                    >
                      <el-select v-model="contentData.education" placeholder="请选择">
                        <el-option
                          v-for="item in educationList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="duty">
                  <el-col :span="24">
                    <span> 督导领域：</span>
                    <el-form-item
                      prop="duty"
                      :rules="[
                        { required: false },
                      ]"
                    >
                      
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-row>
                      <el-col style="margin-top: 10px;padding-left: 50px;" :span="6" v-for="(item, index) in dutyList" :key="index">
                        <el-checkbox v-model="item.show">
                          {{ item.name }}
                        </el-checkbox>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>

                <el-row class="button-group">
                  <el-button @click="close">取消</el-button>
                  <el-button type="primary" :disabled="canSave" @click="submitForm('contentData')">保存</el-button>
                </el-row>
              </el-form>
            </div>
          </transition>
          
          <el-pagination
            v-if="totalCount !== 0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>  
        </main>
    </div>
</template>
<script>
import { success, notice } from '../../api/index'
import server from '../../utils/axios'
import { dateFormat } from '../../filters/index'
export default {
  name: 'manage',
  data () {
    return {
      userFace: '',
      userName: '',
      isEdit: false,
      canSave: false,
      personTypeDisabled: true,
      userId: '',
      keyword: '',
      pageSize: 10,
      pageNo: 1,
      totalCount: 0,
      contentData: {
        company: '',
        name: '',
        personType: '',
        supervisorCategory: '',
        supervisionClass: '',
        sex: '',
        phoneNumber: '',
        peoples: '',
        address: '',
        politics: '',
        bornDate: '',
        teachDate: '',
        supervisionDate: '',
        isJob: '',
        duty: '',
        education: ''
      },
      rules: {
        supervisorCategory: [
          { required: true, message: '督学分类不能为空' }
        ],
        supervisionClass: [
          { required: true, message: '督导类别不能为空' }
        ]
      },
      educationList: [
        { label: '高中以下', value: 1 },
        { label: '高中', value: 2 },
        { label: '中职中专', value: 3 },
        { label: '高职高专', value: 4 },
        { label: '本科', value: 5 },
        { label: '研究生(硕士)', value: 6 },
        { label: '研究生(博士)', value: 7 }
      ],
      dutyList: [],
      isJobList: [
        { label: '是', value: 1 },
        { label: '否', value: 2 }
      ],
      politicsList: [
        { label: '中共党员', value: 1 },
        { label: '民主党派', value: 2 },
        { label: '群众', value: 3 }
      ],
      peoplesList: [
        { label: '汉族', value: '01' },
        { label: '壮族', value: '02' },
        { label: '回族', value: '03' },
        { label: '满族', value: '04' },
        { label: '维吾尔族', value: '05' },
        { label: '苗族', value: '06' },
        { label: '彝族', value: '07' },
        { label: '土家族', value: '08' },
        { label: '藏族', value: '09' },
        { label: '蒙古族', value: '10' },
        { label: '侗族', value: '11' },
        { label: '布依族', value: '12' },
        { label: '瑶族', value: '13' },
        { label: '白族', value: '14' },
        { label: '朝鲜族', value: '15' },
        { label: '哈尼族', value: '16' },
        { label: '黎族', value: '17' },
        { label: '哈萨克族', value: '18' },
        { label: '傣族', value: '19' },
        { label: '畲族', value: '20' },
        { label: '傈僳族', value: '21' },
        { label: '东乡族', value: '22' },
        { label: '仡佬族', value: '23' },
        { label: '拉祜族', value: '24' },
        { label: '佤族', value: '25' },
        { label: '水族', value: '26' },
        { label: '纳西族', value: '27' },
        { label: '羌族', value: '28' },
        { label: '土族', value: '29' },
        { label: '仫佬族', value: '30' },
        { label: '锡伯族', value: '31' },
        { label: '柯尔克孜族', value: '32' },
        { label: '景颇族', value: '33' },
        { label: '达斡尔族', value: '34' },
        { label: '撒拉族', value: '35' },
        { label: '布朗族', value: '36' },
        { label: '毛南族', value: '37' },
        { label: '塔吉克族', value: '38' },
        { label: '普米族', value: '39' },
        { label: '阿昌族', value: '40' },
        { label: '怒族', value: '41' },
        { label: '鄂温克族', value: '42' },
        { label: '京族', value: '43' },
        { label: '基诺族', value: '44' },
        { label: '德昂族', value: '45' },
        { label: '保安族', value: '46' },
        { label: '俄罗斯族', value: '47' },
        { label: '裕固族', value: '48' },
        { label: '乌孜别克族', value: '49' },
        { label: '门巴族', value: '50' },
        { label: '鄂伦春族', value: '51' },
        { label: '独龙族', value: '52' },
        { label: '赫哲族', value: '53' },
        { label: '高山族', value: '54' },
        { label: '珞巴族', value: '55' },
        { label: '塔塔尔族', value: '56' }
      ],
      sexList: [
        { label: '男', value: 1 },
        { label: '女', value: 2 }
      ],
      supervisionClassList: [
        { label: '督政', value: 1, show: false },
        { label: '督学', value: 2, show: false },
        { label: '评估监测', value: 3, show: false }
      ],
      supervisorCategoryList: [
        { label: '专职', value: 1 },
        { label: '兼职', value: 2 }
      ],
      personTypeList: [],
      companyList: [],
      nameList: [
        { label: '孙悟空', value: 0 }
      ],
      boxShow: false,
      tableData: []
    }
  },
  methods: {
    hide () {
      this.boxShow = false
    },
    // 人员类型change
    personTypeChange () {
      if (this.contentData.personType === 3) {
        this.contentData.supervisorCategory = ''
        this.supervisionClassList.forEach(item => {
          item.show = false
        })
        this.personTypeDisabled = true
      } else {
        this.personTypeDisabled = false
      }
    },
    // 选择所属单位
    companyChange () {
      this.getDeptUserList()
      this.contentData.name = ''
    },
    // 搜索
    search () {
      this.getUserPage()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getUserPage()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getUserPage()
    },
    // 提交表单
    submitForm (formName) {
      if (this.contentData.personType === 3) {
        this.rules.supervisorCategory[0].required = false
        this.rules.supervisionClass[0].required = false
      } else {
        this.rules.supervisorCategory[0].required = true
        this.rules.supervisionClass[0].required = true
      }
      this.contentData.supervisionClass = this.supervisionClassList.filter(item => item.show === true).map(n => n.value).join(',')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveUser()
        } else {
          return false
        }
      })
    },
    // 添加人员按钮
    add () {
      this.boxShow = !this.boxShow
      this.isEdit = false
      this.canSave = false
      this.getRoleList()
      this.getDdfield()
      this.supervisionClassList = [
        { label: '督政', value: 1, show: false },
        { label: '督学', value: 2, show: false },
        { label: '评估监测', value: 3, show: false }
      ]
      this.contentData = {
        company: '',
        name: '',
        personType: '',
        supervisorCategory: '',
        supervisionClass: '',
        sex: '',
        phoneNumber: '',
        peoples: '',
        address: '',
        politics: '',
        bornDate: '',
        teachDate: '',
        supervisionDate: '',
        isJob: '',
        duty: '',
        education: ''
      }
    },
    // 编辑
    edit (item) {
      this.isEdit = true
      this.userName = item.name
      this.canSave = false
      server.get(`/ryglController/getUser?userId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          let data = res.data.result
          this.supervisionClassList = [
            { label: '督政', value: 1, show: false },
            { label: '督学', value: 2, show: false },
            { label: '评估监测', value: 3, show: false }
          ]
          this.supervisionClassList.forEach((item) => {
            if (data.userType && data.userType.indexOf(item.value) !== -1) {
              item.show = true
            }
          })
          this.dutyList.forEach((item) => {
            if (data.ddfield.length !== 0 && (',' + data.ddfield.join(',') + ',').indexOf(`,${item.id},`) !== -1) {
              item.show = true
            } else {
              item.show = false
            }
          })
          this.contentData = {
            company: data.companyId,
            name: data.id,
            personType: data.userRoleId,
            supervisorCategory: data.jobType,
            supervisionClass: '',
            sex: data.sex,
            phoneNumber: data.mobileNumber,
            peoples: data.nation,
            address: data.address,
            politics: data.politicalFace,
            bornDate: data.birthday,
            teachDate: data.beginTeachingDate,
            supervisionDate: data.beginDdDate,
            isJob: data.jobState,
            duty: '',
            education: data.education
          }
          // this.userFace = data.userFace
          this.userId = data.id
          this.getDeptUserList()
        } else {
          notice(res.data.message)
        }
      })
      this.boxShow = !this.boxShow
    },
    // 关闭
    close () {
      this.boxShow = false
    },
    start (val) {
      if (val.show === false) val.show = true
      else val.show = false
    },
    leave (val) {
      val.show = false
    },
    startOrOver (val) {
      this.editUserState(val)
    },
    // 人员切换
    userChange () {
      this.userFace = this.nameList.filter(item => item.userId === this.contentData.name)[0].userFace
    },
    // 保存用户信息
    saveUser (item) {
      console.log(this.contentData.supervisionDate)
      this.canSave = true
      server.post(`/ryglController/saveUser`, {
        id: this.isEdit ? this.userId : this.contentData.name,
        companyId: this.contentData.company,
        companyName: this.companyList.filter(item => item.id === this.contentData.company)[0].name,
        name: this.nameList.filter(item => item.userId === this.contentData.name)[0].name,
        jobType: this.contentData.supervisorCategory,
        mobileNumber: this.contentData.phoneNumber,
        userType: this.supervisionClassList.filter(item => item.show).map(item => item.value).join(','),
        birthday: this.contentData.bornDate ? (String(this.contentData.bornDate).length === 13 ? dateFormat(this.contentData.bornDate, 'yyyy-MM-dd HH:mm:ss') : dateFormat(this.contentData.bornDate, 'yyyy-MM-dd HH:mm:ss')) : '',
        sex: this.contentData.sex,
        politicalFace: this.contentData.politics,
        nation: this.contentData.peoples,
        address: this.contentData.address,
        jobState: this.contentData.isJob,
        beginDdDate: this.contentData.supervisionDate ? (String(this.contentData.supervisionDate).length === 13 ? dateFormat(this.contentData.supervisionDate, 'yyyy-MM-dd HH:mm:ss') : dateFormat(this.contentData.supervisionDate, 'yyyy-MM-dd HH:mm:ss')) : '',
        beginTeachingDate: this.contentData.teachDate ? (String(this.contentData.teachDate).length === 13 ? dateFormat(this.contentData.teachDate, 'yyyy-MM-dd HH:mm:ss') : dateFormat(this.contentData.teachDate, 'yyyy-MM-dd HH:mm:ss')) : '',
        education: this.contentData.education,
        roleId: this.contentData.personType,
        ddfield: this.dutyList.filter(item => item.show).map(item => item.id).join(','),
        userFace: this.userFace
      })
      .then(res => {
        if (res.data.code === 1) {
          this.boxShow = false
          success(this.isEdit ? '编辑成功' : '保存成功')
          this.getUserPage()
        } else {
          notice(res.data.message)
        }
        this.canSave = false
      })
    },
    // 获取人员分页列表
    getUserPage () {
      server.get(`/ryglController/getUserPage?keyword=${this.keyword}&pageNo=${this.pageNo}&pageSize=${this.pageSize}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result.list.map(item => ({...item, show: false}))
          this.totalCount = res.data.result.totalCount
        } else {
          notice(res.data.message)
        }
      })
    },
    // 获取单位列表
    getCompanyList () {
      server.get(`/ryglController/getCompanyList?keyword=${''}`)
      .then(res => {
        if (res.data.code === 1) {
          this.companyList = res.data.result
        } else {
          notice(res.data.message)
        }
      })
    },
    // 获取单位下的部门用户信息
    getDeptUserList () {
      server.get(`/ryglController/getDeptUserList?companyId=${this.contentData.company}`)
      .then(res => {
        if (res.data.code === 1) {
          this.nameList = res.data.result.users
          if (this.contentData.name) {
            this.userFace = this.nameList.filter(item => item.userId === this.contentData.name)[0].userFace
            this.contentData.name = this.nameList.filter(item => item.name === this.userName)[0].userId
          }
        } else {
          notice(res.data.message)
        }
      })
    },
    // 获取角色列表
    getRoleList () {
      server.get(`/ryglController/getRoleList`)
      .then(res => {
        if (res.data.code === 1) {
          this.personTypeList = res.data.result
        } else {
          notice(res.data.message)
        }
      })
    },
    // 获取督导领域列表
    getDdfield () {
      server.get(`/ryglController/getDdfield`)
      .then(res => {
        if (res.data.code === 1) {
          this.dutyList = res.data.result.map(item => ({...item, show: false}))
        } else {
          notice(res.data.message)
        }
      })
    },
    // 修改账号状态
    editUserState (item) {
      server.post(`/ryglController/editUserState`, {
        userId: item.id,
        userState: item.userState === 1 ? 2 : 1
      })
      .then(res => {
        if (res.data.code === 1) {
          let message = ''
          if (item.userState === 1) message = '禁用成功'
          else message = '启用成功'
          success(message)
          this.getUserPage()
        } else {
          notice(res.data.message)
        }
      })
    }
  },
  created () {
    this.getUserPage()
    this.getCompanyList()
    this.getDdfield()
    this.getRoleList()
  }
}
</script>
<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.manage {
  padding: 0 $width $width;
  &>p {
    padding: $width;
    font-size: 16px;
  }

  &>main {
    background: #fff;
    padding-bottom: $width;
    // min-height: calc(100vh - 135px);
    &>p {
      padding: $width;
      .el-col:last-child {
        text-align: right;
        .el-input {
          width: 400px;
        }
      }
    }

    .el-table {
      // padding-bottom: $width;
      .operation {
        position: absolute;
        top: 0;
        bottom: 0;
        padding: 12px 25px;
      }
      .edit {
        color: #199ED8;
        margin-right: $width/1.5;
        cursor: pointer;
      }
      .start {
        color: #009966;
        cursor: pointer;
      }
      .over {
        cursor: pointer;
        color: #FF3333;
      }
      .arrow {
        color: #BCBCBC;
        vertical-align: center;
      }
    }

    .right-box {
      position: fixed;
      z-index: 1;
      right: 0;
      top: 50px;
      width: 720px;
      height: calc(100vh - 50px);
      // height: 600px;
      padding: $width;
      background: $white;
      border: 1px solid #E6E6E6;
      box-shadow: 0px 0px 4px 0 rgba(0,0,0,0.28);
      overflow-x: hidden;

      &>p {
        font-size: 20px;
        font-weight: bold;
        span:first-child {
          float: right;
          cursor: pointer;
          i {
            font-weight: bold;
          }
        }
      }
      .el-form {
        margin-top: $width;
        .el-row {
          .el-col {
            display: flex;
            justify-content: flex-start;
            align-content: center;
            margin-bottom: 20px;
            > span {
              display: block;
              line-height: 40px;
            }
            .el-form-item {
              width: 65%;
              margin-bottom: 0px;
              .el-form-item__content {
                margin-left: 0 !important;
                div {
                  width: 90%;
                }
              }
              .el-checkbox {
                margin-left: 10px;
              }
            }
          }
        }
        .red {
          width: 10px !important;
          right: 0;
          top: 5px;
          color: red;
          font-size: 20px;
        }

        .duty {
          .el-checkbox {
            margin-top: 10px;
          }
          .el-input {
            margin-top: 5px;
            vertical-align: center;
            position: absolute;
            margin-left: $width;
            .el-input__inner {
              height: 30px;
            }
          }
        }
      }
      
      .button-group {
        margin-top: $width*1.5;
        margin-bottom: $width*3;
        text-align: center;
        .el-button {
          margin-left: 10px;
        }
      }
    }

    .el-pagination {
      margin: 20px;
      text-align: right;
    }
  }
}
.start-over {
  min-width: 40px !important;
  text-align: center;
  padding: 6px 10px;
}
</style>

