<template>
  <div class="addActivity">

    <div class="back">
      <el-button type="text" @click="$router.push('/dManage/activity')">返回</el-button>
    </div>

    <el-tabs v-model="activeName" type="card">

      <!-- 基础设置 -->
      <el-tab-pane label="基础设置" name="first">
        <el-form :model="baseForm" ref="baseForm" label-width="150px" label-position="left">
          <el-form-item label="活动名称："
                        prop="name"
                        :rules="[
                          { required: true, message: '请输入活动名称', trigger: 'blur' }
                        ]">
            <el-input v-model="baseForm.name" :maxlength="50" placeholder="请输入活动名称" :disabled="!activeState || activeState === 0"></el-input>
          </el-form-item>
          <el-form-item label="选课逻辑：" >
            <el-radio-group v-model="baseForm.logic" @change="logicChange" :disabled="!activeState || activeState === 0">
              <el-radio :label="1">先到先得</el-radio>
              <el-radio :label="2">优先级选课</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="学生可否重选：">
            <el-radio-group v-model="baseForm.studentRepick" :disabled="!activeState || activeState === 0">
              <el-radio :label="true">可以重选</el-radio>
              <el-radio :label="false">不可以重选</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="教师可否录取学生：">
            <el-radio-group v-model="baseForm.teacherPick" :disabled="baseForm.logic === 1 || (!activeState || activeState === 0)">
              <el-radio :label="true">可以录取学生</el-radio>
              <el-radio :label="false">不可以录取学生</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button type="danger" @click="$router.push('/dManage/activity')">取消</el-button>
          <el-button 
          :plain="true" 
          type="primary" 
          @click="submit('baseForm')"
          :disabled="!activeState || activeState === 0">
          保存
          </el-button>
        </div>
      </el-tab-pane>

      <!-- 开设年级 -->
      <el-tab-pane label="开设年级" name="second" :disabled="id === ''">
        <div class="add-btn">
          <el-button type="success" @click="addGrad" :disabled="!activeState || activeState === 0">新增</el-button>
        </div>
        <el-table
          :data="gradData"
          class="display-table"
          style="width: 100%"
          stripe>
          <el-table-column
            prop="gradeName"
            label="年级"
            label-class-name="head">
            <template scope="scope">
              {{scope.row.sectionName}} {{ scope.row.gradeName }}
            </template>
          </el-table-column>
          <el-table-column
            :label="baseForm.logic === 1 ? '选课课程数' : '报名志愿数'"
            label-class-name="head">
            <template scope="scope">
              {{ baseForm.logic === 1 ? scope.row.courseNum : scope.row.wishNum }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="130"
            label-class-name="head">
            <template scope="scope">
              <el-tooltip  effect="dark" content="编辑" placement="right">
                <el-button size="small" type="success" @click="editGrad(scope.row)" :disabled="!activeState || activeState === 0"><i class="iconfont icon-edit" ></i></el-button>
              </el-tooltip>
              <el-popover 
                placement="top"
                width="140"
                trigger="click"
                v-model="scope.row.pop"
                :disabled="!activeState || activeState === 0">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.pop = false" >取消</el-button>
                  <el-button type="primary" size="mini" @click="deleGrad(scope.row)" >确定</el-button>
                </div>
                <span scope="reference">
                  <el-tooltip effect="dark" content="删除" placement="right">
                    <el-button size="small" type="danger" :disabled="!activeState || activeState === 0"> <i class="iconfont icon-delete"></i></el-button>
                  </el-tooltip>
                </span>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 开设教程类型 -->
      <el-tab-pane label="开设课程类型" name="third" :disabled="id === ''">
        <div class="add-btn">
          <el-button type="success" @click="downloadButton" :disabled="!activeState || activeState === 0">下载导入模板</el-button>
          <el-button style="margin-left: 0;" type="success" @click="addType" :disabled="!activeState || activeState === 0">新增</el-button>
          <!-- <el-button type="primary" @click="">导入</el-button> -->
        <el-upload
          class="upload-demo"
          :action="action"
          name="file"
          :data="{'activityId': id}"
          :show-file-list="false"
          :before-upload="handleBefore"
          :on-success="handleSuccess"
          style="display: inline"
          :disabled="!activeState || activeState === 0">
          <el-button type="primary" :class="{'no-allow': !activeState || activeState === 0}">导入</el-button>
        </el-upload>
        </div>
        <el-table
          :data="typeData"
          class="display-table"
          style="width: 100%"
          stripe>
          <el-table-column
            prop="name"
            label="课程类型"
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="limitNum"
            label="限报门数"
            label-class-name="head">
          </el-table-column>
          <el-table-column
            label="操作"
            width="130"
            label-class-name="head">
            <template scope="scope">
              <el-tooltip  effect="dark" content="编辑" placement="right">
                <el-button size="small" type="success" @click="editType(scope.row)" :disabled="!activeState || activeState === 0"><i class="iconfont icon-edit" ></i></el-button>
              </el-tooltip>
              <el-popover
                placement="top"
                width="140"
                trigger="click"
                v-model="scope.row.pop"
                :disabled="!activeState || activeState === 0">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.pop = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleType(scope.row)">确定</el-button>
                </div>
                <span slot="reference">
                  <el-tooltip effect="dark" content="删除" placement="right">
                    <el-button size="small" type="danger"  :disabled="!activeState || activeState === 0"><i class="iconfont icon-delete"></i></el-button>
                  </el-tooltip>
                </span>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>


      <!-- 上课时间 -->
      <el-tab-pane label="上课时间" name="fourth" :disabled="id === ''">
        <div class="add-btn">
          <el-button type="success" @click="addTime"  :disabled="!activeState || activeState === 0">新增</el-button>
        </div>
        <el-table
          :data="timeData"
          class="display-table"
          style="width: 100%"
          stripe>
          <el-table-column
            prop="time"
            label="上课时间"
            label-class-name="head">
            <template scope="scope">
              星期{{ scope.row.week | num }} 第{{ scope.row.section | num }}节
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="130"
            label-class-name="head">
            <template scope="scope">
              <el-tooltip  effect="dark" content="编辑" placement="right">
                <el-button size="small" type="success"  @click="editTime(scope.row)"  :disabled="!activeState || activeState === 0"><i class="iconfont icon-edit"></i></el-button>
              </el-tooltip>
              <el-popover
                placement="top"
                width="140"
                trigger="click"
                v-model="scope.row.pop"
                 :disabled="!activeState || activeState === 0">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.pop = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleTime(scope.row)">确定</el-button>
                </div>
                <span slot="reference">
                  <el-tooltip effect="dark" content="删除" placement="right">
                    <el-button size="small" type="danger"  :disabled="!activeState || activeState === 0"><i class="iconfont icon-delete"></i></el-button>
                  </el-tooltip>
                </span>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>


      <el-tab-pane label="选课时间" name="five" :disabled="id === ''">
        <el-form 
          :model="selectForm"
          ref="selectForm"
          label-width="100px"
          class="select-form">

          <!-- 选课时间 -->
          <el-form-item label="学生选课时间">
            <el-col :span="11">
              <el-form-item prop="primaryStartTime"
                            :rules="[
                              { required: true, type: 'date', message: '请选择开始时间', trigger: 'change' }
                            ]">
                <el-date-picker
                  v-model="selectForm.primaryStartTime"
                  type="datetime"
                  placeholder="选择开始时间"
                  :picker-options="pickerOptionsStartTime"
                  format="yyyy-MM-dd HH:mm"
                   :disabled="!activeState || activeState === 0">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="line">-</el-col>
            <el-col :span="11">
              <el-form-item prop="primaryEndTime"
                            :rules="[
                              { required: true, type: 'date', message: '请选择结束时间', trigger: 'change' }
                            ]">
                <el-date-picker
                  popper-class="date-class"
                  v-model="selectForm.primaryEndTime"
                  type="datetime"
                  placeholder="选择结束时间"
                  :disabled="selectForm.primaryStartTime === '' || !activeState || activeState === 0"
                  :picker-options="pickerOptionsEndTime"
                  format="yyyy-MM-dd HH:mm"
                  >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>

          <!-- 复选课时间 -->
          <el-form-item label="候补选课时间">
            <el-col :span="11">
              <el-form-item prop="secondStartTime"
                            >
                <el-date-picker
                  popper-class="date-class"
                  v-model="selectForm.secondStartTime"
                  type="datetime"
                  placeholder="选择开始时间"
                  :disabled="selectForm.primaryEndTime === '' || !activeState || activeState === 0"
                  :picker-options="pickerOptionsSStartTime"
                  format="yyyy-MM-dd HH:mm">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="line">-</el-col>
            <el-col :span="11">
              <el-form-item prop="secondEndTime"
                            >
                <el-date-picker
                  popper-class="date-class"
                  v-model="selectForm.secondEndTime"
                  type="datetime"
                  placeholder="选择结束时间"
                  :disabled="selectForm.secondStartTime === '' || !activeState || activeState === 0"
                  :picker-options="pickerOptionsSEndTime"
                  format="yyyy-MM-dd HH:mm">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button type="danger" @click="$router.push('/dManage/activity')">取消</el-button>
          <el-button :plain="true" type="primary" @click="submit('selectForm')" :disabled="!activeState || activeState === 0">保存</el-button>
        </div>
      </el-tab-pane>

    </el-tabs>

    <!-- gradDialog -->
    <el-dialog :title="gradForm.title" :visible.sync="gradDialog" size="small">
        <el-form
          :model="gradForm" 
          label-width="90px"
          ref="gradForm" 
          v-if="gradDialog">
          <el-form-item label="学期">
            <div>{{ nowSemester.semesterName }}</div>
          </el-form-item>
          <el-form-item label="学段"
                        prop="section"
                        :rules="[
                          { required: true, type: 'object', message: '请选择学段', trigger: 'change' }
                        ]">
            <el-select v-model="gradForm.section" value-key="id" style="width: 100%" @change="sectionChage">
              <el-option 
                v-for="item in sectionList"
                :key="item.id"
                :label="item.name"
                :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年级"
                        prop="grad"
                        :rules="[
                          { required: true, type: 'object', message: '请选择年级', trigger: 'change' }
                        ]">
            <el-select v-model="gradForm.grad" value-key="id" style="width: 100%">
              <el-option 
                v-for="item in gradList"
                :key="item.id"
                :label="item.name"
                :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
                        prop="num">
            <div slot="label">{{ baseForm.logic === 1 ? '选课课程数' : '报名志愿数' }}</div>
            <el-input-number  v-model="gradForm.num" :min="0" :max="20" ></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="danger" @click="gradDialog = false">取消</el-button>
          <el-button :plain="true" type="primary" @click="submit('gradForm')" :disabled="baseForm.logic !== 1 && gradForm.num === 0" >保存</el-button>
        </div>
    </el-dialog>

    <!-- typeDialog -->
    <el-dialog :title="typeForm.title" :visible.sync="typeDialog" size="small">
        <el-form
        :model="typeForm"
        label-width="100px" 
        ref="typeForm"
        v-if="typeDialog">
          <el-form-item label="课程类型"
                        prop="name"
                        :rules="[
                          { required: true, message: '请输入课程类型', trigger: 'change' }
                        ]">
            <el-input v-model="typeForm.name" :maxlength="20" ></el-input>
          </el-form-item>
          <el-form-item label="限报门数" prop="limitNum">
            <el-input-number  v-model="typeForm.limitNum" :min="0" :max="20" @focus="prompts"></el-input-number> <br>
            <span style="font-size:13px; color:red;" >0表示不限制学生报名门数</span>
            <!-- <el-input v-model="typeForm.num"></el-input> -->
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="danger" @click="typeDialog = false" >取消</el-button>
          <el-button :plain="true" type="primary" @click="submit('typeForm')">保存</el-button>
        </div>
    </el-dialog>

    <!-- timeDialog -->
    <el-dialog :title="timeForm.title" :visible.sync="timeDialog" size="small">
        <el-form
            :model="timeForm"
            label-width="100px"
            ref="timeForm"
            v-if="timeDialog" 
            :inline="true">
          <el-form-item label="上课时间"
                        prop="week"
                        :rules="[
                          { required: true, type: 'number', message: '请选择星期', trigger: 'change' }
                        ]">
            <el-select v-model.number="timeForm.week" style="width: 150px" placeholder="请选择星期">
              <el-option  v-for="item in weekList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item 
                        prop="section"
                        :rules="[
                          { required: true, type: 'number', message: '请选择课节', trigger: 'change' }
                        ]">
          <el-select v-model="timeForm.section" style="width: 150px" placeholder="请选择课节">
            <el-option  v-for="item in lessonList" 
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"></el-option>
            </el-select>
          </el-form-item>

        </el-form>
        <div slot="footer">
          <el-button type="danger" @click="timeDialog = false">取消</el-button>
          <el-button :plain="true" type="primary" @click="submit('timeForm')">保存</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import edit from '../../components/edit'
import server from '../../utils/axios'
import { notice, success } from '../../api/index'
import { dateFormat } from '../../filters'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'addActivity',

  components: { edit },

  data () {
    return {
      activeName: 'first',
      gradDialog: false,
      typeDialog: false,
      timeDialog: false,
      id: '', // 选课活动id
      baseForm: {
        name: '',
        logic: 1, // 1 先到先得 2 优先选课
        studentRepick: true, // 学生是否可以重选
        teacherPick: false // 教师是否可以录取学生
      },
      gradForm: {
        id: '',
        title: '',
        semesterId: '',
        section: '',
        grad: '',
        num: ''
      },
      typeForm: {
        title: '',
        name: '',
        limitNum: ''
      },
      timeForm: {
        title: '',
        week: '',
        section: ''
      },
      selectForm: {
        primaryStartTime: '',
        primaryEndTime: '',
        secondStartTime: '',
        secondEndTime: ''
      },
      pickerOptionsStartTime: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      pickerOptionsEndTime: {
        disabledDate: time => {
          return time.getTime() < this.selectForm.primaryStartTime.getTime()
        }
      },
      pickerOptionsSStartTime: {
        disabledDate: time => {
          return time.getTime() < this.selectForm.primaryEndTime.getTime()
        }
      },
      pickerOptionsSEndTime: {
        disabledDate: time => {
          return time.getTime() < this.selectForm.secondStartTime.getTime()
        }
      },
      gradList: [],
      gradData: [],
      typeData: [],
      timeData: [],
      weekList: [
        { name: '星期一', id: 1 },
        { name: '星期二', id: 2 },
        { name: '星期三', id: 3 },
        { name: '星期四', id: 4 },
        { name: '星期五', id: 5 },
        { name: '星期六', id: 6 },
        { name: '星期日', id: 7 }
      ],
      lessonList: [
        { name: '第一节', id: 1 },
        { name: '第二节', id: 2 },
        { name: '第三节', id: 3 },
        { name: '第四节', id: 4 },
        { name: '第五节', id: 5 },
        { name: '第六节', id: 6 },
        { name: '第七节', id: 7 },
        { name: '第八节', id: 8 },
        { name: '第九节', id: 9 },
        { name: '第十节', id: 10 }
      ]
    }
  },

  computed: {
    ...mapGetters([
      'sectionList'
    ]),

    ...mapState({
      activeState: state => state.dManage.activeState
    }),

    nowSemester () {
      return { ...this.$store.getters.semesterList.filter(item => item.state === 1)[0] }
    },

    action () {
      const path = document.querySelector('#contextPath').value
      return `${path}/dActivityTypeController/importType`
    }
  },

  watch: {
    activeName (val) {
      val === 'second' && this.getGread()
      val === 'third' && this.getType()
      val === 'fourth' && this.getTimeList()
    },
    activeState (val) {
    }
  },

  methods: {
    prompts () {
      console.log(2)
    },
    logicChange (val) {
      // 1 先到先的
      // 2 优先选课
      if (val === 1) {
        this.baseForm.teacherPick = false
      }
    },

    addGrad () {
      this.gradDialog = true
      this.gradForm = Object.assign({}, {
        title: '新增年级',
        semesterId: '',
        section: null,
        grad: null,
        num: ''
      })
    },

    async editGrad (row) {
      this.gradDialog = true
      this.gradForm = {
        id: row.id,
        title: '编辑年级',
        grad: {
          id: row.gradeId,
          name: row.gradeName
        },
        section: {
          id: row.sectionId,
          name: row.sectionName
        },
        num: this.baseForm.logic === 1 ? row.courseNum : row.wishNum
      }
      this.sectionChage()
    },

    async deleGrad (row) {
      const { data } = await server.post('/dActivityGradeController/deleteGrade', {
        id: row.id,
        activityId: this.id
      })
      if (data.code !== 1) notice(this, data.message, 2000)
      else this.getGread()
    },

    async sectionChage (e) {
      if (!this.gradForm.section) return
      if (e) this.gradForm.grad = null
      const { data } = await server.get(`/common/selectGradeClassList?semesterId=${this.nowSemester.semesterId}` +
                                    `&sectionId=${this.gradForm.section.id}`)
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        this.gradList = [...data.result]
      }
    },

    addType () {
      this.typeDialog = true
      this.typeForm = Object.assign({}, {
        title: '新增教程类型',
        name: '',
        limitNum: ''
      })
    },

    downloadButton () {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/dActivityTypeController/downloadModel`
    },

    editType (row) {
      this.typeDialog = true
      this.typeForm = { ...row, title: '编辑类型' }
    },

    async deleType (row) {
      const { data } = await server.post('/dActivityTypeController/deleteType', {
        typeId: row.id
      })
      if (data.code !== 1) notice(this, data.message, 2000)
      else this.getType()
    },

    handleBefore (file) {
      const type = file.name.split('.')[file.name.split('.').length - 1].toLowerCase()
      if (type !== 'xls') {
        this.$message.error('请上传格式为xls格式的文件')
        return false
      }
      return true
    },

    handleSuccess (res) {
      if (res.code !== 1) notice(this, res.message, 2000)
      else {
        success(this, res.message, 2000)
        this.getType()
      }
    },

    addTime () {
      this.timeDialog = true
      this.timeForm = Object.assign({}, {
        title: '新增上课时间',
        week: '',
        section: ''
      })
    },

    editTime (row) {
      this.timeDialog = true
      this.timeForm = { ...row, title: '编辑时间' }
    },

    async deleTime (row) {
      const { data } = await server.post('/dActivityLessontimeController/DeleteLessonTime', {
        id: row.id
      })
      if (data.code !== 1) notice(this, data.message, 2000)
      else this.getTimeList()
    },

    async getGread () {
      const { data } = await server.get(`/dActivityGradeController/getGradeList?activityId=${this.id}`)
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        this.gradData = [...data.result.map(item => ({ ...item, pop: false }))]
      }
    },

    async getType () {
      const { data } = await server.get(`/dActivityTypeController/getTypeList?activityId=${this.id}`)
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        console.log(data.result)
        var arr = data.result.map(item => ({ ...item, pop: false }))
        arr.forEach(element => {
          for (var i in element) {
            if (i === 'limitNum') {
              if (element[i] === 0) {
                element[i] = '不限'
              }
            }
          }
        })
        this.typeData = arr
        console.log(this.typeData)
      }
    },

    async getTimeList () {
      const { data } = await server.get(`/dActivityLessontimeController/getLessonTimeList?activityId=${this.id}`)
      if (data.code !== 1) notice(this, data.message, 2000)
      else {
        this.timeData = [...data.result.map(item => ({ ...item, pop: false }))]
      }
    },

    submit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 添加基础设置
          if (this.id === '') {
            const { data } = await server.post('/dActivityController/addActivityBaseSetting', {
              ...this.baseForm
            })
            if (data.code !== 1) notice(this, data.message, 2000)
            else {
              this.id = data.result
              this.activeName = 'second'
            }
            return
          }

          // 修改基础设置
          if (formName === 'baseForm') {
            this.activeName = 'second'
            const { data } = await server.post('dActivityController/updateActivityBaseSettingAndTime', {
              id: this.id,
              ...this.baseForm,
              primaryStartTime: dateFormat(this.selectForm.primaryStartTime, 'yyyy-MM-dd HH:mm'),
              primaryEndTime: dateFormat(this.selectForm.primaryEndTime, 'yyyy-MM-dd HH:mm'),
              secondStartTime: dateFormat(this.selectForm.secondStartTime, 'yyyy-MM-dd HH:mm'),
              secondEndTime: dateFormat(this.selectForm.secondEndTime, 'yyyy-MM-dd HH:mm')
            })
            if (data.code !== 1) notice(this, data.message, 2000)
          }
          if (formName === 'selectForm') {
            const { data } = await server.post('dActivityController/updateActivityBaseSettingAndTime', {
              id: this.id,
              ...this.baseForm,
              primaryStartTime: dateFormat(this.selectForm.primaryStartTime, 'yyyy-MM-dd HH:mm'),
              primaryEndTime: dateFormat(this.selectForm.primaryEndTime, 'yyyy-MM-dd HH:mm'),
              secondStartTime: dateFormat(this.selectForm.secondStartTime, 'yyyy-MM-dd HH:mm'),
              secondEndTime: dateFormat(this.selectForm.secondEndTime, 'yyyy-MM-dd HH:mm')
            })
            if (data.code !== 1) notice(this, data.message, 2000)
            else {
              success(this, '操作成功', 2000)
              this.$router.push('/dManage/activity')
            }
          }

          // 年级相关
          if (formName === 'gradForm') {
            let url
            let para = {
              activityId: this.id,
              logic: this.baseForm.logic,
              gradeId: this.gradForm.grad.id,
              gradeName: this.gradForm.grad.name,
              sectionId: this.gradForm.section.id,
              sectionName: this.gradForm.section.name,
              semesterId: this.nowSemester.semesterId
            }
            this.baseForm.logic === 1
            ? para.courseNum = this.gradForm.num
            : para.wishNum = this.gradForm.num
            if (this.gradForm.id) {
              url = '/dActivityGradeController/updateGrade'
              para.id = this.gradForm.id
            } else {
              url = '/dActivityGradeController/addGrade'
            }
            const { data } = await server.post(url, para)
            if (data.code !== 1) notice(this, data.message, 2000)
            else {
              success(this, '操作成功', 2000)
              this.gradDialog = false
              this.getGread()
            }
            return
          }

          // 类型相关
          if (formName === 'typeForm') {
            let url
            let para = { ...this.typeForm, activityId: this.id, typeId: this.typeForm.id }
            if (!this.typeForm.id) url = '/dActivityTypeController/addType'
            else {
              url = '/dActivityTypeController/editType'
            }
            const { data } = await server.post(url, para)
            if (data.code !== 1) notice(this, data.message, 2000)
            else {
              success(this, '操作成功', 2000)
              this.typeDialog = false
              this.getType()
            }
          }

          // 上课时间相关
          if (formName === 'timeForm') {
            let url
            let para = { ...this.timeForm, activityId: this.id }
            delete para.title
            if (!this.timeForm.id) url = '/dActivityLessontimeController/SaveLessonTime'
            else url = 'dActivityLessontimeController/UpdateLessonTime'
            const { data } = await server.post(url, para)
            if (data.code !== 1) notice(this, data.message, 2000)
            else {
              this.timeDialog = false
              this.getTimeList()
            }
          }
        } else {
          return false
        }
      })
    }
  },

  async created () {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      const { data } = await server.get(`/dActivityController/getActivityBaseSetting?id=${this.id}`)
      if (data.code === 1) {
        this.baseForm = Object.assign({}, {
          name: data.result.name,
          logic: data.result.logic,
          studentRepick: data.result.studentRepick,
          teacherPick: data.result.teacherPick
        })
        this.selectForm = Object.assign({}, {
          primaryStartTime: data.result.primaryStartTime ? new Date(data.result.primaryStartTime) : '',
          primaryEndTime: data.result.primaryEndTime ? new Date(data.result.primaryEndTime) : '',
          secondStartTime: data.result.secondStartTime ? new Date(data.result.secondStartTime) : '',
          secondEndTime: data.result.secondEndTime ? new Date(data.result.secondEndTime) : ''
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';

.addActivity {
  height: 100%;
  position: relative;

  .back {
    position: absolute;
    right: $width;
    top: 4px;
    z-index: 999;
  }

  .el-tabs {
    height: 100%;

    .el-tabs__header {
      margin: 0;
      padding: 0 2rem;
      border: 0;


      .el-tabs__item {
        border: 0;
        outline: none;
      }
    }

    .is-active {
      border: 0 !important;
      background: $white;
    }

    .is-disabled {
      cursor: not-allowed;
    }

    .el-tabs__content {
      height: calc(100% - 83px);
      padding: $width;
      background: $white;
      @include border-radius(4px);

      >.el-tab-pane {
        position: relative;
        height: 100%;

        >.el-form {
          width: 60%;
        }

        >.el-form.select-form {
          width: 520px;
          padding: $xlg-pad;

          >.select-time {
            display: flex;
            justify-content: space-between;
          }
        }

        >.btn {
          position: absolute;
          right: 0;
          bottom: $width;
        }

        >.add-btn {
          text-align: right;
          margin-bottom: $width;
        }
      }
    }
  }

  .no-allow {
    cursor: not-allowed;
  }
}

// 选课时间 第2,3,4日期选择器  此刻按钮消失
.date-class{
  .el-picker-panel__link-btn{
    display: none;
  }
}
</style>
