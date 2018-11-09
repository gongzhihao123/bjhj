<template>
  <div class="back-subject-change">

    <div class="nav-name">
      <img src="../../../assets/images/backSubjectChange-icon.png" alt="">
      课题评审
    </div>

    <header>
      课题变更及撤项审批
    </header>

    <main>
      <el-radio-group v-model="radioValue" @change="screening">
        <el-radio :label="3">全部</el-radio>
        <el-radio :label="0">待审批</el-radio>
        <el-radio :label="1">通过</el-radio>
        <el-radio :label="2">未通过</el-radio>
      </el-radio-group>

      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="序号"
          align='center'
          show-overflow-tooltip
          width="60"
          label-class-name="head">
          <template slot-scope="scope">
            <span>
              {{ scope.$index + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="课题名称"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span :class="{pointer: scope.row.checkState === 0}" @click="getChangeDetail(scope.row)">
              {{ scope.row.topicName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="classificationName"
          label="课题分类"
          align='center'
          width="130"
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="leadUserName"
          label="课题负责人"
          align='center'
          width="130"
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="单位"
          align='center'
          width="130"
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="变更事项"
          align='center'
          width="130"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            {{ scope.row.changeType === 1 ? '变更' : '撤项' }}
          </template>
        </el-table-column>
        <el-table-column
          label="立项时间"
          align='center'
          width="130"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            {{ scope.row.checkedTime | dateFormat('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column
          label="变更审批"
          align='center'
          width="130"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span v-if="scope.row.checkState === 0" style="color: #5295EB">待审批</span>
            <span v-if="scope.row.checkState === 1" style="color: #97D98F">通过</span>
            <span v-if="scope.row.checkState === 2" style="color: #F47564">未通过</span>
          </template>
        </el-table-column>
      </el-table>

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

    <el-dialog
      title="变更审批"
      width="950px"
      :visible.sync="dialogVisible">
      <el-row v-if="changeReason.changeType === 1">
        <el-col :span="11">
          <!-- 原课题内容 -->
          <div v-if="oneShow" class="old-one">
            <p>原课题内容</p>
            <div>
              <el-row>
                <el-col :span="10">
                  课题名称：
                </el-col>
                <el-col :span="14">
                  {{ oldOne.name }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  关键词：
                </el-col>
                <el-col :span="14">
                  {{ oldOne.keyword }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  课题指南名称：
                </el-col>
                <el-col :span="14">
                  {{ oldOne.guideName }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  课题级别：
                </el-col>
                <el-col :span="14">
                  {{ oldOne.topicLevel }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  课题类别：
                </el-col>
                <el-col :span="14">
                  {{ oldOne.typeName }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  单位：
                </el-col>
                <el-col :span="14">
                  {{ oldOne.companyName }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  预期研究成果：
                </el-col>
                <el-col :span="14">
                  <span v-if="oldOne.wishResult.indexOf('1') !== -1">专著</span>
                  <span v-if="oldOne.wishResult.indexOf('2') !== -1">译著</span>
                  <span v-if="oldOne.wishResult.indexOf('3') !== -1">研究报告</span>
                  <span v-if="oldOne.wishResult.indexOf('4') !== -1">工具书</span>
                  <span v-if="oldOne.wishResult.indexOf('5') !== -1">电脑软件</span>
                  <span v-if="oldOne.wishResult.indexOf('6') !== -1">其他</span>
                  <!-- {{ oldOne.wishResult }} -->
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  预计完成时间：
                </el-col>
                <el-col :span="14">
                  {{ oldOne.wishFinishTime | dateFormat('yyyy-MM-dd') }}
                </el-col>
              </el-row>
            </div>
          </div>

          <!-- 原负责人信息 -->
          <div v-if="twoShow" class="old-two">
            <p>原负责人信息</p>
            <div>
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="12">负责人姓名：</el-col>
                    <el-col :span="12">{{ oldTwo.leadUserName }}</el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-col :span="10">性别：</el-col>
                  <el-col :span="14">{{ oldTwo.sex === 0 ? '女' : '男' }}</el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="12">民族：</el-col>
                    <el-col :span="12">{{ oldTwo.nation }}</el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-col :span="10">出生年月：</el-col>
                  <el-col :span="14">{{ oldTwo.birthday | dateFormat('yyyy-MM-dd') }}</el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="12">行政职务：</el-col>
                    <el-col :span="12">{{ oldTwo.administrativeDuty }}</el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-col :span="10">专业职务：</el-col>
                  <el-col :span="14">{{ oldTwo.specialtyDuty }}</el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="12">最后学位：</el-col>
                    <el-col :span="12">{{ oldTwo.degree }}</el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-col :span="10">最后学历：</el-col>
                  <el-col :span="14">{{ oldTwo.education }}</el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="12">工作单位：</el-col>
                    <el-col :span="12">{{ oldOne.companyName }}</el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-col :span="10">研究专长：</el-col>
                  <el-col :span="14">{{ oldTwo.specialtyDuty }}</el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="12">通讯地址：</el-col>
                    <el-col :span="12">{{ oldTwo.address }}</el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-col :span="10">电子邮箱：</el-col>
                  <el-col :span="14">{{ oldTwo.email }}</el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="12">单位电话：</el-col>
                    <el-col :span="12">{{ oldTwo.companyPhone }}</el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-col :span="10">邮政编码：</el-col>
                  <el-col :span="14">{{ oldTwo.postalCode }}</el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="12">个人电话：</el-col>
                    <el-col :span="12">{{ oldTwo.phone }}</el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-col :span="10">家庭电话：</el-col>
                  <el-col :span="14">{{ oldTwo.familyPhone }}</el-col>
                </el-col>
              </el-row>
            </div>
          </div>

          <!-- 原预期研究成果 -->
          <div v-if="threeShow" class="old-two">
            <p>原预期研究成果</p>
            <div>
              <el-table
                :data="oldThree"
                border
                stripe
                style="width: 860px">
                <el-table-column
                  prop="startTime"
                  label="开始时间"
                  align='center'
                  width="70"
                  show-overflow-tooltip
                  label-class-name="head">
                  <template slot-scope="scope">
                    {{ scope.row.startTime | dateFormatT('yyyy-MM-dd') }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="stopTime"
                  label="结束时间"
                  align='center'
                  width="70"
                  show-overflow-tooltip
                  label-class-name="head">
                  <template slot-scope="scope">
                    {{ scope.row.stopTime | dateFormatT('yyyy-MM-dd') }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="achievementName"
                  label="最终研究成果名称"
                  align='center'
                  show-overflow-tooltip
                  label-class-name="head">
                </el-table-column>
                <el-table-column
                  label="成果形式"
                  align='center'
                  show-overflow-tooltip
                  width="70"
                  label-class-name="head">
                  <template slot-scope="scope">
                    <span v-for="(item, index) in options" :key="index" v-if="Number(scope.row.achievementShape) === item.value"> {{ item.label }} </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="underwriter"
                  label="承担人"
                  align='center'
                  width="70"
                  show-overflow-tooltip
                  label-class-name="head">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>

        <el-col :span="1">
          <img src="../../../assets/images/right-arrow.png">
        </el-col>

        <el-col :span="11">
          <!-- 现课题内容 -->
          <div v-if="oneShow" class="new-one">
            <p>现课题内容</p>
            <!-- <img src="../../../assets/images/new.png" alt=""> -->
            <P v-if="!newOne">未改变</P>
            <div v-if="newOne">
              <el-row>
                <el-col :span="10">
                  课题名称：
                </el-col>
                <el-col :span="14">
                  {{ newOne.name }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  关键词：
                </el-col>
                <el-col :span="14">
                  {{ newOne.keyword }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  课题指南名称：
                </el-col>
                <el-col :span="14">
                  {{ oldOne.guideName }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  课题级别：
                </el-col>
                <el-col :span="14">
                  {{ newOne.topicLevel }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  课题类别：
                </el-col>
                <el-col :span="14">
                  {{ newOne.typeName }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  单位：
                </el-col>
                <el-col :span="14">
                  {{ newOne.companyName }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  预期研究成果：
                </el-col>
                <el-col :span="14">
                  <span v-if="newOne.wishResult.indexOf('1') !== -1">专著</span>
                  <span v-if="newOne.wishResult.indexOf('2') !== -1">译著</span>
                  <span v-if="newOne.wishResult.indexOf('3') !== -1">研究报告</span>
                  <span v-if="newOne.wishResult.indexOf('4') !== -1">工具书</span>
                  <span v-if="newOne.wishResult.indexOf('5') !== -1">电脑软件</span>
                  <span v-if="newOne.wishResult.indexOf('6') !== -1">其他</span>
                  <!-- {{ newOne.wishResult }} -->
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  预计完成时间：
                </el-col>
                <el-col :span="14">
                  {{ newOne.wishFinishTime | dateFormat('yyyy-MM-dd') }}
                </el-col>
              </el-row>
            </div>
          </div>

          <!-- 现负责人信息 -->
          <div v-if="twoShow" class="old-two">
            <p>现负责人信息</p>
            <P v-if="!newTwo">未改变</P>
            <!-- <img src="../../../assets/images/new.png" alt=""> -->
            <div v-if="newTwo">
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="12">负责人姓名：</el-col>
                    <el-col :span="12">{{ newTwo.leadUserName }}</el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-col :span="10">性别：</el-col>
                  <el-col :span="14">{{ newTwo.sex === 0 ? '女' : '男' }}</el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="12">民族：</el-col>
                    <el-col :span="12">{{ newTwo.nation }}</el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-col :span="10">出生年月：</el-col>
                  <el-col :span="14">{{ newTwo.birthday | dateFormat('yyyy-MM-dd') }}</el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="12">行政职务：</el-col>
                    <el-col :span="12">{{ newTwo.administrativeDuty }}</el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-col :span="10">专业职务：</el-col>
                  <el-col :span="14">{{ newTwo.specialtyDuty }}</el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="12">最后学位：</el-col>
                    <el-col :span="12">{{ newTwo.degree }}</el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-col :span="10">最后学历：</el-col>
                  <el-col :span="14">{{ newTwo.education }}</el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="12">工作单位：</el-col>
                    <el-col :span="12">{{ newTwo.companyName }}</el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-col :span="10">研究专长：</el-col>
                  <el-col :span="14">{{ newTwo.specialtyDuty }}</el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="12">通讯地址：</el-col>
                    <el-col :span="12">{{ newTwo.address }}</el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-col :span="10">电子邮箱：</el-col>
                  <el-col :span="14">{{ newTwo.email }}</el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="12">单位电话：</el-col>
                    <el-col :span="12">{{ newTwo.companyPhone }}</el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-col :span="10">邮政编码：</el-col>
                  <el-col :span="14">{{ newTwo.postalCode }}</el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="12">个人电话：</el-col>
                    <el-col :span="12">{{ newTwo.phone }}</el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-col :span="10">家庭电话：</el-col>
                  <el-col :span="14">{{ newTwo.familyPhone }}</el-col>
                </el-col>
              </el-row>
            </div>
          </div>

          <!-- 现预期研究成果 -->
          <div v-if="threeShow" class="old-two">
            <p>现预期研究成果</p>
            <!-- <img src="../../../assets/images/new.png" alt=""> -->
            <P v-if="!newThree || newThree.length === 0">未改变</P>
            <div v-if="newThree && newThree.length !== 0">
              <el-table
                :data="newThree"
                border
                stripe
                style="width: 860px">
                <el-table-column
                  prop="startTime"
                  label="开始时间"
                  align='center'
                  width="70"
                  show-overflow-tooltip
                  label-class-name="head">
                  <template slot-scope="scope">
                    {{ scope.row.startTime | dateFormatT('yyyy-MM-dd') }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="stopTime"
                  label="结束时间"
                  align='center'
                  width="70"
                  show-overflow-tooltip
                  label-class-name="head">
                  <template slot-scope="scope">
                    {{ scope.row.stopTime | dateFormatT('yyyy-MM-dd') }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="achievementName"
                  label="最终研究成果名称"
                  align='center'
                  show-overflow-tooltip
                  label-class-name="head">
                </el-table-column>
                <el-table-column
                  label="成果形式"
                  align='center'
                  width="70"
                  show-overflow-tooltip
                  label-class-name="head">
                  <template slot-scope="scope">
                    <span v-for="(item, index) in options" :key="index" v-if="Number(scope.row.achievementShape) === item.value"> {{ item.label }} </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="underwriter"
                  label="承担人"
                  align='center'
                  width="70"
                  show-overflow-tooltip
                  label-class-name="head">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 小圆点列表 -->
      <div v-if="changeReason.changeType === 1" class="circle-point">
        <span v-for="(item, index) in pointList" :key="index" :class="{active: activeNum === index}" @click="jump(item, index)"></span>
      </div>

      <p style="font-size: 16px;font-weight: bold; clear: both;">{{ changeReason.changeType === 1 ? '变更原因' : '撤项原因' }}： {{ changeReason.changeReason || '无' }} </p>

      <el-input type="textarea" :rows="5" placeholder="变更事由" v-model="value"></el-input>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkTopicChange(1)">通过</el-button>
        <el-button type="danger" @click="checkTopicChange(2)">不通过</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import server from '../../../utils/axios'
import { notice } from '../../../api/index'
export default {
  name: 'back-subject-change',
  data () {
    return {
      value: '',
      radioValue: 3,
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      dialogVisible: false,
      checkState: '',
      tableData: [],
      oneShow: false,
      twoShow: false,
      threeShow: false,
      oldOne: '',
      newOne: '',
      oldTwo: '',
      newTwo: '',
      oldThree: [],
      newThree: [],
      activeNum: 0,
      changeId: '',
      changeReason: {},
      pointList: [
        { name: '' },
        { name: '' },
        { name: '' }
      ],
      options: [
        { label: '专著', value: 1 },
        { label: '译著', value: 2 },
        { label: '研究报告', value: 3 },
        { label: '工具书', value: 4 },
        { label: '电脑软件', value: 5 },
        { label: '其他', value: 6 }
      ]
    }
  },
  methods: {
    // 审核
    checkTopicChange (val) {
      server.post(`/backChangeCheckController/checkTopicChange`, {
        changeId: this.changeId,
        checkState: val,
        checkReason: this.value
      })
      .then(res => {
        if (res.data.code === 1) {
          this.getChangeList()
          this.dialogVisible = false
          // this.$router.push('/subjectReview/backSubjectChange')
        }
      })
    },
    // 获取变更内容
    getChangeDetail (item) {
      if (item.checkState !== 0) return
      this.changeId = item.changeId
      server.get(`/backChangeCheckController/getChangeDetail?changeId=${item.changeId}&topicId=${item.topicId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.changeReason = res.data.result.change
          let data = res.data.result
          this.oldOne = data.oldTopic
          this.newOne = data.newTopic
          this.oldTwo = data.oldStepTwo
          this.newTwo = data.newStepTwo
          this.oldThree = data.oldStepNine
          this.newThree = data.newStepNine
          this.dialogVisible = true
          this.oneShow = true
          this.twoShow = false
          this.threeShow = false
          this.activeNum = 0
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    jump (item, index) {
      this.activeNum = index
      if (index === 0) {
        this.oneShow = true
        this.twoShow = false
        this.threeShow = false
      } else if (index === 1) {
        this.oneShow = false
        this.twoShow = true
        this.threeShow = false
      } else {
        this.oneShow = false
        this.twoShow = false
        this.threeShow = true
      }
    },
    signed () {
      this.$router.push('/subjectReview/backProjectApprovalSigned')
    },
    // 筛选
    screening (val) {
      this.checkState = this.radioValue
      this.getChangeList()
    },
    // 获取列表
    getChangeList () {
      server.get(`/backChangeCheckController/getChangeTopicList?checkState=${this.checkState === 3 ? '' : this.checkState}&pageNo=${this.pageNo}&pageSize=${this.pageSize}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result.list
          this.totalCount = res.data.result.totalCount
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    lookDetail (val) {
      // let para = {
      //   topicId: val.topicId,
      //   changeId: val.changeId
      // }
      if (val.checkState !== 0) return
      // this.$router.push({ path: '/subjectReview/backSubjectChangeDetail', query: {para: JSON.stringify(para)} })
      this.dialogVisible = true
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getChangeList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getChangeList()
    }
  },
  created () {
    this.getChangeList()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.back-subject-change{
  padding-bottom: $width;
  .pointer{
    cursor: pointer;
  }

  .nav-name {
    line-height: 60px;
    font-size: 16px;
    img {
      vertical-align: middle;
      margin-right: 10px;
    }
  }

  header{
    line-height: 56px;
    font-size: 18px;
    padding-left: $width;
    background: #F8F9FC;
    &:before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #5295EB;
    }
  }

  main{
    background: #fff;
    padding: $width $width*2;

    &>p{
      margin-top: $width;
    }

    // 分页
    .el-pagination{
      text-align: right;
      margin-top: $width
    }
  }

  .el-dialog {
    .el-dialog__header {
      border-bottom: 1px solid #ddd;
      span {
        font-weight: normal;
      }
    }

    .el-dialog__body {

      &>.el-row {
        &>.el-col:nth-child(1),.el-col:nth-child(3) {
          width: 436px;
          height: 369px;
          overflow-x: hidden;
          border: 1px solid #D6D9DE;
          border-radius: 5px;
        }
        &>.el-col:nth-child(2) {
          line-height: 369px;
          text-align: center;
        }

        &>.el-col {
          &>div {
            &>p:nth-child(1) {
              line-height: 40px;
              border-bottom: 1px solid #ddd;
              background: #EBEEF7;
              text-align: center;
              font-size: 16px;
            }
          }
        }

        .old-one,.new-one{
          .el-row{
            margin-top: $width*0.7;
            font-size: 15px;
            .el-col:first-child{
              // text-align: right;
              padding-left: $width;
            }
          }
        }
        .old-two,.new-two{

          &>div>.el-row{
            margin-top: $width*0.7;
            padding-left: 20px;
            font-size: 15px;
            // font-size: 16px;
            // .el-col:first-child{
            //   text-align: right;
            //   padding-right: $width;
            // }
          }
        }
      }
      .el-textarea {
        resize: none;
        margin-top: 20px;
      }

      .circle-point{
        width: calc(100% - 0);
        margin-top: $width;
        text-align: center;
        span{
          display: inline-block;
          border: 1px solid #ddd;
          border-radius: 50%;
          width: 10px;
          height: 10px;
          margin-left: $width;
          cursor: pointer;
          &:hover{
            background: #5295EB;
          }
        }
        .active{
          background: #5295EB;
          border: 1px solid #5295EB;
        }
      }
    }

    .el-dialog__footer {
      text-align: center;
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
      }
    }
  }
}
</style>
