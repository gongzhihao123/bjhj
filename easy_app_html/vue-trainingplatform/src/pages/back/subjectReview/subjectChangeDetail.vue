<template>
  <div class="subject-change-detail">
    <header>
      课题变更审批
      <el-button @click="$router.push('/subjectReview/backSubjectChange')" size="small">返回</el-button>
    </header>

    <main>

      <el-row class="change-detail" v-if="change.changeType === 1">
        <el-col :span="12">

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
        <el-col :span="12">

          <!-- 现课题内容 -->
          <div v-if="oneShow" class="new-one">
            <p>现课题内容</p>
            <img src="../../../assets/images/new.png" alt="">
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
            <img src="../../../assets/images/new.png" alt="">
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
            <img src="../../../assets/images/new.png" alt="">
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

      <div class="circle-point" v-if="change.changeType === 1">
        <span v-for="(item, index) in pointList" :key="index" :class="{active: activeNum === index}" @click="jump(item, index)"></span>
      </div>

      <p style="font-size: 16px;font-weight: bold; clear: both;">{{ change.changeType === 1 ? '变更原因' : '撤项原因' }}： {{ changeReason || '无' }} </p>

      <footer>
        <el-input type="textarea" :rows="3" placeholder="理由" v-model="value"></el-input>
        <p>
          <el-button type="danger" @click="checkTopicChange(2)">不通过</el-button>
          <el-button type="success" @click="checkTopicChange(1)">通过</el-button>
        </p>
      </footer>
    </main>

  </div>
</template>

<script>
import server from '../../../utils/axios'
import { notice } from '../../../api/index'
export default {
  name: 'subject-change-detail',
  data () {
    return {
      change: {},
      value: '',
      oneShow: true,
      twoShow: false,
      threeShow: false,
      oldOne: '',
      newOne: '',
      oldTwo: '',
      newTwo: '',
      oldThree: [],
      newThree: [],
      activeNum: 0,
      changeReason: '',
      options: [
        { label: '专著', value: 1 },
        { label: '译著', value: 2 },
        { label: '研究报告', value: 3 },
        { label: '工具书', value: 4 },
        { label: '电脑软件', value: 5 },
        { label: '其他', value: 6 }
      ],
      pointList: [
        { name: '' },
        { name: '' },
        { name: '' }
      ]
    }
  },
  methods: {
    // 获取变更内容
    getChangeDetail () {
      server.get(`/backChangeCheckController/getChangeDetail?changeId=${JSON.parse(this.$route.query.para).changeId}&topicId=${JSON.parse(this.$route.query.para).topicId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.change = res.data.result.change
          let data = res.data.result
          this.changeReason = this.change.changeReason
          this.oldOne = data.oldTopic
          this.newOne = data.newTopic
          this.oldTwo = data.oldStepTwo
          this.newTwo = data.newStepTwo
          this.oldThree = data.oldStepNine
          this.newThree = data.newStepNine
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
    // 审核
    checkTopicChange (val) {
      server.post(`/backChangeCheckController/checkTopicChange`, {
        changeId: JSON.parse(this.$route.query.para).changeId,
        checkState: val,
        checkReason: this.value
      })
      .then(res => {
        if (res.data.code === 1) {
          this.$router.push('/subjectReview/backSubjectChange')
        }
      })
    }
  },
  created () {
    this.getChangeDetail()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.subject-change-detail{
  padding-bottom: $width;
  header{
    line-height: 56px;
    font-size: 18px;
    &>.el-button{
      float: right;
      margin-top: $width / 1.8;
    }
  }

  main{
    background: #fff;
    padding: $width;

    .change-detail{
      clear: both;
      width: calc(100% - 0);
      &>.el-col{
        &:first-child{
          padding-right: 15px;
        }
        &:last-child{
          padding-left: 15px;
        }
        &>div{
          border: 1px solid #ddd;
          height: 490px;
          overflow-x: hidden;
          padding: 30px 40px;
          position: relative;
          p{
            text-align: center;
            font-size: 20px;
            font-weight: bold;
          }
          img{
            position: absolute;
            top: 0;
            left: 0;
          }
        }
        .old-one,.new-one{
          .el-row{
            margin-top: $width*1.5;
            font-size: 15px;
            .el-col:first-child{
              // text-align: right;
              padding-left: $width;
            }
          }
        }
        .old-two,.new-two{

          &>div>.el-row{
            margin-top: $width*1.5;
            font-size: 15px;
            // font-size: 16px;
            // .el-col:first-child{
            //   text-align: right;
            //   padding-right: $width;
            // }
          }
        }
      }
    }

    .circle-point{
      width: calc(100% - 0);
      margin-top: $width;
      text-align: center;
      span{
        display: inline-block;
        border: 1px solid #ddd;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        margin-left: $width;
        cursor: pointer;
        &:hover{
          background: #E1E1E1;
        }
      }
      .active{
        background: #E1E1E1;
      }
    }

    footer{
      &>.el-textarea{
        margin-top: $width;
        width: calc(100% - 100px);
      }

      p{
        text-align: center;
        margin-top: $width;
      }
    }
    
  }
}
</style>
