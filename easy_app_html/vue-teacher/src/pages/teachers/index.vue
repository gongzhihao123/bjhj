<template>
  <div class="planning">
    <div class="header">教师档案管理</div>
    <div class="plannContent">
      <div class="header">
        <div>
          <div>
            <el-input  :maxlength="20" size="small" v-model="userName" placeholder="教师关键字"></el-input>
          </div>
            <el-select size="small" clearable v-model="educationType" placeholder="学历">
              <el-option
                v-for="item in education"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <div>
              <el-input size="small" clearable v-model="workType" placeholder="岗位"></el-input>
            </div>
            <el-select size="small" clearable v-model="stateType" placeholder="状态">
              <el-option
                v-for="(item, index) in statesType"
                :key="item"
                :label="item"
                :value="index + 1">
              </el-option>
            </el-select>
            <el-select size="small" clearable v-model="sex" placeholder="教师性别">
              <el-option
                v-for="(item, index) in sexType"
                :key="item"
                :label="item"
                :value="index + 1">
              </el-option>
            </el-select>
        </div>
        <div>
          <el-button size="small" type="success" @click="search" icon="el-icon-search">搜索</el-button>
        </div>
      </div>
      <div class="content">
        <el-table
          v-loading='loading'
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="userName"
            label="教师名称">
          </el-table-column>
          <el-table-column
            prop="sex"
            label="性别">
            <template slot-scope="scope">
              {{ scope.row.sex === 1 ? '男' : scope.row.sex === 2 ? '女' : '' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="birthdate"
            label="出生年月">
            <template slot-scope="scope">
              <span>{{ scope.row.birthdate | format('yyyy年MM月dd日') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="education"
            label="学历">
          </el-table-column>
          <el-table-column
            prop='occupation'
            label="岗位">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
                <el-button size='small' type='primary' @click="audit(scope.row)" v-if="scope.row.checkState !== 1" >审核</el-button>
                <el-button size='small' type='primary' @click="audit(scope.row)" v-else :disabled="true" >已审核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      :visible.sync="teacherDia"
      width="65%">
       <el-dialog
        width="60%"
        title="审核不通过原因"
        :visible.sync="innerTeacherDia"
        append-to-body>
        <div class="Through">
          <el-input  :maxlength="20"
            type="textarea"
            placeholder="请输入审核不通过原因（注意请详细说明不通过原因以便人员及时修改）"
            v-model="notThrough">
          </el-input>
        </div>
        <div class="footer" slot="footer">
          <el-button size="small" type="primary" @click="auditStep(2)" >确定</el-button>
          <el-button size="small" @click="innerTeacherDia = false; notThrough = false;notThrough = ''">取消</el-button>
        </div>
      </el-dialog>
      <div class="header" slot="title">
        审核内容  <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      </div>
      <div class="content">
        <el-checkbox-group v-model="contentList">
          <div class="audit" v-for="(item, index) in auditList" :key="index">
            <el-checkbox :label="item.id">
              <div v-if="item.tableName === 'TeacherInfo'">
                <div class="teacher">基础信息</div>
                <div v-if="item.record && JSON.parse(item.record)">
                  <p>历史记录（用户信息）</p>
                  <ul class='infoList'>
                    <li v-for="(elem, index) in basicList" :key="index" v-if="JSON.parse(item.record)[elem.attribute]" ><span>{{ elem.name }}</span>{{ elem.attribute === 'sex' ? Number(JSON.parse(item.record)[elem.attribute]) === 1 ? '男' : '女' : elem.attribute === 'gat' ? Number(JSON.parse(item.record)[elem.attribute]) === 1 ? '港' : Number(JSON.parse(item.record)[elem.attribute]) === 2 ? '澳' : '台' : elem.attribute === 'archives' ? Number(JSON.parse(item.record)[elem.attribute]) === 1 ? '已婚' : '未婚' : typeof JSON.parse(item.editRecord)[elem.attribute] === 'number' && JSON.parse(item.editRecord)[elem.attribute] > 1000 ? (new Date(JSON.parse(item.editRecord)[elem.attribute])).getFullYear() + '年' + ((new Date(JSON.parse(item.editRecord)[elem.attribute])).getMonth() + 1) + '月' + (new Date(JSON.parse(item.editRecord)[elem.attribute])).getDate() + '日' : JSON.parse(item.record)[elem.attribute]}}</li>
                  </ul>
                </div>
                <div v-if="item.editRecord && JSON.parse(item.editRecord)">
                  <p>编辑信息（用户信息）</p>
                  <ul class='infoList'>
                    <li v-for="(elem, index) in basicList" :key="index" v-if="JSON.parse(item.editRecord)[elem.attribute]" ><span>{{ elem.name }}</span>{{ elem.attribute === 'sex' ? Number(JSON.parse(item.editRecord)[elem.attribute]) === 1 ? '男' : '女' : elem.attribute === 'gat' ? Number(JSON.parse(item.editRecord)[elem.attribute]) === 1 ? '港' : Number(JSON.parse(item.editRecord)[elem.attribute]) === 2 ? '澳' : '台' : elem.attribute === 'archives' ? Number(JSON.parse(item.editRecord)[elem.attribute]) === 1 ? '已婚' : '未婚' : typeof JSON.parse(item.editRecord)[elem.attribute] === 'number' && JSON.parse(item.editRecord)[elem.attribute] > 1000 ? (new Date(JSON.parse(item.editRecord)[elem.attribute])).getFullYear() + '年' + ((new Date(JSON.parse(item.editRecord)[elem.attribute])).getMonth() + 1) + '月' + (new Date(JSON.parse(item.editRecord)[elem.attribute])).getDate() + '日' : JSON.parse(item.editRecord)[elem.attribute]}}</li>
                  </ul>
                </div>
              </div>
              <div v-else-if="item.tableName === 'TeacherHonor'">
                <div class="teacher">个人荣誉</div>
                <div v-if="item.record && JSON.parse(item.record)">
                  <p>历史记录</p>
                  <el-table
                    :data="[JSON.parse(item.record)]"
                    style="width: 100%">
                    <el-table-column
                      prop="honorName"
                      label="荣誉名称"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="honorDate"
                      label="授予日期"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="company"
                      label="授予单位">
                    </el-table-column>
                    <el-table-column
                      prop="level"
                      label="级别">
                    </el-table-column>
                    <el-table-column
                      label="附件">
                      <template slot-scope="scope">
                        <div class="prove">
                          文件
                          <i class="iconfont">&#xe62c;</i>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作">
                      <template slot-scope="scope">
                        <div class="operation">
                          <el-button size="small" @click="honorDown(scope.row)" type="primary">
                            <i class="iconfont">&#xe63b;</i>
                          </el-button>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div v-if="item.editRecord && JSON.parse(item.editRecord)">
                  <p>编辑信息</p>
                  <el-table
                    :data="[JSON.parse(item.editRecord)]"
                    style="width: 100%">
                    <el-table-column
                      prop="honorName"
                      label="荣誉名称"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="honorDate"
                      label="授予日期"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="company"
                      label="授予单位">
                    </el-table-column>
                    <el-table-column
                      prop="level"
                      label="级别">
                    </el-table-column>
                    <el-table-column
                      label="附件">
                      <template slot-scope="scope">
                        <div class="prove">
                          文件
                          <i class="iconfont">&#xe62c;</i>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作">
                      <template slot-scope="scope">
                        <div class="operation">
                          <el-button  size="small" @click="down(scope.row)" type="primary">
                            <i class="iconfont">&#xe63b;</i>
                          </el-button>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div v-else-if="item.tableName === 'TeacherYearReview'">
                <div class="teacher">教师年度审核</div>
                <div v-if="item.record && JSON.parse(item.record)">
                  <p>历史记录</p>
                  <el-table
                    :data="[JSON.parse(item.record)]"
                    style="width: 100%">
                    <el-table-column
                      prop="yearDate"
                      label="年度考评时间"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="review"
                      label="师德考核结果"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="yearReview"
                      label="颁发荣誉单位">
                    </el-table-column>
                    <el-table-column
                      prop="remarks"
                      label="备注">
                    </el-table-column>
                  </el-table>
                </div>
                <div v-if="item.editRecord && JSON.parse(item.editRecord)">
                  <p>编辑信息</p>
                  <el-table
                    :data="[JSON.parse(item.editRecord)]"
                    style="width: 100%">
                    <el-table-column
                      prop="yearDate"
                      label="年度考评时间"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="review"
                      label="师德考核结果"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="yearReview"
                      label="颁发荣誉单位">
                    </el-table-column>
                    <el-table-column
                      prop="remarks"
                      label="备注">
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div v-else-if="item.tableName === 'TeacherQualifications'">
                <div class="teacher">学习经历</div>
                <div v-if="item.record && JSON.parse(item.record)">
                  <p>历史记录</p>
                  <el-table
                    :data="[JSON.parse(item.record)]"
                    style="width: 100%">
                    <el-table-column
                      prop="startDate"
                      label="开始时间">
                    </el-table-column>
                    <el-table-column
                      prop="endDate"
                      label="结束时间"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      prop="graduationSchoole"
                      label="学校"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      prop="grantMajor"
                      label="专业">
                    </el-table-column>
                    <el-table-column
                      prop="grantDegreeSchool"
                      label="授学位学校"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      prop="degree"
                      label="学位">
                    </el-table-column>
                    <el-table-column
                      prop="schoolLength"
                      label="学制">
                    </el-table-column>
                    <el-table-column
                      prop="degreeNumber"
                      label="学位证书号"
                      width="180">
                    </el-table-column>
                  </el-table>
                </div>
                <div v-if="item.editRecord && JSON.parse(item.editRecord)">
                  <p>编辑信息</p>
                  <el-table
                    :data="[JSON.parse(item.editRecord)]"
                    style="width: 100%">
                    <el-table-column
                      prop="startDate"
                      label="开始时间">
                    </el-table-column>
                    <el-table-column
                      prop="endDate"
                      label="结束时间"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      prop="graduationSchoole"
                      label="学校"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      prop="grantMajor"
                      label="专业">
                    </el-table-column>
                    <el-table-column
                      prop="grantDegreeSchool"
                      label="授学位学校"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      prop="degree"
                      label="学位">
                    </el-table-column>
                    <el-table-column
                      prop="schoolLength"
                      label="学制">
                    </el-table-column>
                    <el-table-column
                      prop="degreeNumber"
                      label="学位证书号"
                      width="180">
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div v-else-if="item.tableName === 'TeacherWorkExperience'">
                <div class="teacher">工作经历</div>
                <div v-if="item.record && JSON.parse(item.record)">
                  <p>历史记录</p>
                  <el-table
                    :data="[JSON.parse(item.record)]"
                    style="width: 100%">
                    <el-table-column
                      prop="startDate"
                      label="开始时间">
                    </el-table-column>
                    <el-table-column
                      prop="endDate"
                      label="结束时间">
                    </el-table-column>
                    <el-table-column
                      prop="companyName"
                      label="单位">
                    </el-table-column>
                    <el-table-column
                      prop="workContent"
                      label="工作内容">
                    </el-table-column>
                    <el-table-column
                    label="曾任党政职务">
                    <template slot-scope="scope">
                      {{ scope.row.governmentJob ? scope.row.governmentJob : '------' }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="曾任专业技术">
                    <template slot-scope="scope">
                      {{ scope.row.majorTechnology ? scope.row.majorTechnology : '------' }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="工作备注">
                    <template slot-scope="scope">
                      {{ scope.row.jobRemark ? scope.row.jobRemark : '------' }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="工作证明人">
                    <template slot-scope="scope">
                      {{ scope.row.jobReterence ? scope.row.jobReterence : '------' }}
                    </template>
                  </el-table-column>
                  </el-table>
                </div>
                <div v-if="item.editRecord && JSON.parse(item.editRecord)">
                  <p>编辑信息</p>
                  <el-table
                    :data="[JSON.parse(item.editRecord)]"
                    style="width: 100%">
                    <el-table-column
                      prop="startDate"
                      label="开始时间">
                    </el-table-column>
                    <el-table-column
                      prop="endDate"
                      label="结束时间">
                    </el-table-column>
                    <el-table-column
                      prop="companyName"
                      label="单位">
                    </el-table-column>
                    <el-table-column
                      prop="workContent"
                      label="工作内容">
                    </el-table-column>
                    <el-table-column
                    label="曾任党政职务">
                    <template slot-scope="scope">
                      {{ scope.row.governmentJob ? scope.row.governmentJob : '------' }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="曾任专业技术">
                    <template slot-scope="scope">
                      {{ scope.row.majorTechnology ? scope.row.majorTechnology : '------' }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="工作备注">
                    <template slot-scope="scope">
                      {{ scope.row.jobRemark ? scope.row.jobRemark : '------' }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="工作证明人">
                    <template slot-scope="scope">
                      {{ scope.row.jobReterence ? scope.row.jobReterence : '------' }}
                    </template>
                  </el-table-column>
                  </el-table>
                </div>
              </div>
              <div v-else-if="item.tableName === 'TeacherTitle'">
                <div class="teacher">职称管理</div>
                <div v-if="item.record && JSON.parse(item.record)">
                  <p>历史记录</p>
                  <el-table
                    :data="[JSON.parse(item.record)]"
                    style="width: 100%">
                    <el-table-column
                      prop="titleDate"
                      label="评职时间">
                    </el-table-column>
                    <el-table-column
                      prop="level"
                      label="级别">
                    </el-table-column>
                    <el-table-column
                      prop="company"
                      label="评职所在单位">
                    </el-table-column>
                    <el-table-column
                      label="证书">
                      <template slot-scope="scope">
                        <div class="prove">
                          文件
                          <i class="iconfont">&#xe62c;</i>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      width="200">
                      <template slot-scope="scope">
                        <div class="operation">
                          <el-button @click="down(scope.row)" size="small" type="primary">
                            <i class="iconfont">&#xe63b;</i>
                          </el-button>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div v-if="item.editRecord && JSON.parse(item.editRecord)">
                  <p>编辑信息</p>
                  <el-table
                    :data="[JSON.parse(item.editRecord)]"
                    style="width: 100%">
                    <el-table-column
                      prop="titleDate"
                      label="评职时间">
                    </el-table-column>
                    <el-table-column
                      prop="level"
                      label="级别">
                    </el-table-column>
                    <el-table-column
                      prop="company"
                      label="评职所在单位">
                    </el-table-column>
                    <el-table-column
                      label="证书">
                      <template slot-scope="scope">
                        <div class="prove">
                          文件
                          <i class="iconfont">&#xe62c;</i>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      width="200">
                      <template slot-scope="scope">
                        <div class="operation">
                          <el-button size="small" @click="down(scope.row)" type="primary">
                            <i class="iconfont">&#xe63b;</i>
                          </el-button>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-checkbox>
          </div>
      </el-checkbox-group>
      </div>
      <div class="footer" slot="footer">
        <el-button size="small" type="primary" @click="auditStep(1)" >审核通过</el-button>
        <el-button size="small" @click="innerTeacherDia = true">审核不通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { error } from '../../utils/handle'
export default {
  name: 'planning',
  data () {
    return {
      scopeDate: '',
      educationType: '',
      stateType: '',
      sex: '',
      userName: '',
      tableData: [],
      addPlanForm: {
        scopeDate: '',
        platDevelopment: ''
      },
      addPlanRules: {
        scopeDate: [
          { required: true, message: '请选择时间范围', trigger: 'blur' }
        ],
        platDevelopment: [
          { required: true, message: '请输入发展计划', trigger: 'blur' }
        ]
      },
      education: [
        '研究生教育', '博士研究生毕业', '博士研究生结业', '博士研究生肄业', '硕士研究生毕业', '硕士研究生结业', '硕士研究生肄业', '研究生班毕业', '研究生班结业', '研究生班肄业', '大学本科教育', '大学本科毕业', '大学本科结业', '大学本科肄业', '大学普通班毕业', '大学专科教育', '大学专科毕业', '大学专科结业', '大学专科肄业', '中等职业教育', '中等专科毕业', '中等专科结业', '中等专科肄业', '职业高中毕业', '职业高中结业', '职业高中肄业', '技工学校毕业', '技工学校结业', '技工学校肄业', '普通高级中学教育', '普通高中毕业', '普通高中结业', '普通高中肄业', '初级中学教育', '初中毕业', '初中肄业', '小学教育', '小学毕业', '小学肄业', '其他'
      ],
      statesType: [
        '已审核', '待审核'
      ],
      sexType: [
        '男', '女'
      ],
      teachSection: [
        '学前教育', '小学', '普通初中', '普通高中', '职业初中', '职业高中', '成人中等专业学校', '成人中学', '特殊教育', '其他'
      ],
      basicList: [
        {
          name: '姓名：',
          attribute: 'userName'
        },
        {
          name: '英文名：',
          attribute: 'englishName'
        },
        {
          name: '民族：',
          attribute: 'nation'
        },
        {
          name: '性别：',
          attribute: 'sex'
        },
        {
          name: '籍贯：',
          attribute: 'userNative'
        },
        {
          name: '健康状况：',
          attribute: 'health'
        },
        {
          name: '血型：',
          attribute: 'bloodType'
        },
        {
          name: '证件类型：',
          attribute: 'documentType'
        },
        {
          name: '证件有效期：',
          attribute: 'documentValidity'
        },
        {
          name: '港澳台：',
          attribute: 'gat'
        },
        {
          name: '现住址：',
          attribute: 'nowAddress'
        },
        {
          name: '户口性质：',
          attribute: 'registeredNature'
        },
        {
          name: '户籍所在地：',
          attribute: 'registeredLocation'
        },
        {
          name: '联系电话：',
          attribute: 'phone'
        },
        {
          name: '电子邮箱：',
          attribute: 'email'
        },
        {
          name: '参加工作年月：',
          attribute: 'joinWorkTime'
        },
        {
          name: '从教年月：',
          attribute: 'teachTime'
        },
        {
          name: '档案文本：',
          attribute: 'archives'
        },
        {
          name: '岗位职业：',
          attribute: 'occupation'
        },
        {
          name: '工号：',
          attribute: 'userCode'
        },
        {
          name: '名字拼音：',
          attribute: 'namePinyin'
        },
        {
          name: '曾用名：',
          attribute: 'oldName'
        },
        {
          name: '国籍地区码：',
          attribute: 'nationalityCode'
        },
        {
          name: '出生日期：',
          attribute: 'birthdate'
        },
        {
          name: '信仰：',
          attribute: 'marriage'
        },
        {
          name: '婚姻：',
          attribute: 'archives'
        },
        {
          name: '证件号码：',
          attribute: 'occupation'
        },
        {
          name: '家庭住址：',
          attribute: 'homeAddress'
        },
        {
          name: '编制类别：',
          attribute: 'organizationType'
        },
        {
          name: '通讯地址：',
          attribute: 'communicationAddress'
        },
        {
          name: '邮政编码：',
          attribute: 'postalCode'
        },
        {
          name: '主页地址：',
          attribute: 'homepageAddress'
        },
        {
          name: '来校年月：',
          attribute: 'comeSchoolTime'
        },
        {
          name: '档案编号：',
          attribute: 'archivesNumber'
        },
        {
          name: '特长：',
          attribute: 'specialty'
        },
        {
          name: '主要任课学段：',
          attribute: 'teachSection'
        }
      ],
      file: '',
      pageSize: 10,
      totalPage: 11,
      currentPage: 1,
      plann: false,
      plannState: true,
      totalCount: 11,
      loading: false,
      workType: '',
      teacherDia: false,
      auditList: [],
      teacherId: '',
      innerTeacherDia: false,
      notThrough: '',
      contentList: [],
      checkAll: false
    }
  },
  methods: {
    handleCheckAllChange () {
      if (this.checkAll) {
        this.contentList = this.$store.state.teachers.teacherDetail.map(item => item.id)
      } else {
        this.contentList = []
      }
    },
    search () {
      this.planList(10, this.currentPage, this.userName, this.sex, this.stateType, this.educationType, this.workType)
    },
    handleCurrentChange (item) {
      this.sex = ''
      this.stateType = ''
      this.workType = ''
      this.educationType = ''
      this.userName = ''
      this.planList(10, item)
    },
    down (item) {
      window.open(item.certificate)
    },
    async auditStep (state) {
      if (this.contentList.length) {
        await this.$store.dispatch('teacherState', {
          checkState: state,
          teacherId: this.teacherId,
          checkReason: this.notThrough,
          ids: this.contentList.join(',')
        })
        this.checkAll = false
        this.innerTeacherDia = false
        this.notThrough = ''
        this.teacherDia = false
        this.planList(10, this.currentPage)
      } else {
        error('请选择您要审批的模块')
      }
    },
    honorDown (item) {
      window.open(item.honorFile)
    },
    async audit (item) {
      this.teacherId = item.id
      await this.$store.dispatch('teacherDetail', {
        teacherId: item.id
      })
      this.auditList = this.$store.state.teachers.teacherDetail
      this.teacherDia = true
    },
    async planList (pageSize, pageNo, keyword, sex, checkState, education, work) {
      this.loading = true
      await this.$store.dispatch('getTeacher', {
        sex: sex,
        work: work,
        pageNo: pageNo,
        keyword: keyword,
        pageSize: pageSize,
        education: education,
        checkState: checkState
      })
      this.pageSize = pageSize
      this.currentPage = pageNo
      this.totalCount = this.$store.state.teachers.teacherList.totalCount
      this.tableData = this.$store.state.teachers.teacherList.list
      this.totalPage = this.$store.state.teachers.teacherList.totalPage
      this.loading = false
    }
  },
  mounted () {
    this.planList(10, 1)
  }
}
</script>
<style lang='scss'>
.planning {
  padding: 22px;
  > .header {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    &::before {
      height: 15px;
      width: 3px;
      content: '';
      display: block;
      background: #4c73eb;
      margin-top: 2px;
      margin-right: 10px;
    }
  }
  .plannContent {
    width: 100%;
    height: calc(100vh - 135px);
    background: #fff;
    margin-top: 10px;
    border-radius: 5px;
    box-sizing: border-box;
    > .header {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;
      color: #85a4ff;
      font-weight: bold;
      border-bottom: 1px solid #e5e5e5;
      div {
        &:nth-child(1) {
          display: flex;
          justify-content: flex-start;
          align-content: center;
          div {
            margin-right: 10px;
          }
        }
        &:nth-child(2) {
          width: 150px;
          display: flex;
          justify-content: flex-end;
          align-content: center;
        }
      }
    }
    .content {
      width: 100%;
      padding: 10px;
      height: calc(100% - 90px);
      overflow: auto;
    }
  }
  .prove {
    color: #97acff;
  }
  .content {
    height: 500px;
    overflow: auto;
    .audit {
      width: 100%;
      > label {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      > div {
        > .teacher {
          width: 100%;
          padding: 10px;
          padding-top: 0;
          border-bottom: 1px solid #E3E3E3;
        }
        > div {
          padding: 10px;
          > .infoList {
            display: flex;
            justify-content: flex-start;
            align-content: center;
            flex-wrap: wrap;
            > li {
              padding-left: 5px;
              color: #85a4ff;
              span {
               color: #606266;
              }
            }
          }
        }
      }
    }
  }
  .Through {
    textarea {
      resize: none;
    }
  }
  .uploadPlann {
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding-right: 10px;
    font-size: 16px;
    color: #97acff;
  }
  .textPlann {
    width: 350px;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
