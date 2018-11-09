<template>
  <div class="subject-lists">
    <header>
        <img src="../../../../src/assets/images/courseManager/manager-iocn.png"><span>课题管理</span>
    </header>
    <main>
      <p><img src="../../../assets/images/circle-icon.png">课题列表</p>
      <div class="button-group">
        <ul>
          <li>
            <span>课题名称:</span>
            <el-input v-model="courseTitle" placeholder="请输入关键字"></el-input>
          </li>
          <li>
            <span>负责人:</span>
            <el-input v-model="header" placeholder="请输入关键字"></el-input>
          </li>
          <li>
            <span>立项时间：</span>
            <el-date-picker
              v-model="value6"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </li>
          <li>
            <span>课题类别:</span>
            <el-select v-model="typeValue" placeholder="请选择">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
          </li>
          <li>
            <span>进展进度:</span>
            <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>            
          </li>
          <li>
            <span>课题状态：</span>
            <el-select v-model="typeState" placeholder="请选择">
                <el-option
                  v-for="item in stateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </li>
          <li>
              <el-button @click="getData"><img src="../../../assets/images/courseManager/search-btn.png">搜索</el-button>              
          </li>
        </ul>
      </div>
      <div class="table-box">
        <el-table
        :data="tableData"
        stripe
        @select-all="selectAll"
        @select="choose"
        style="width: 100%">
        <el-table-column
          type="selection"
          align='center'
          show-overflow-tooltip
          label-class-name="head"
          width="50">
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
          label="课题名称"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="classificationName"
          label="课题分类"
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="leadUserName"
          label="课题负责人"
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="单位"
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="立项时间"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span>{{scope.row.checkedTime | dateFormat('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="进展阶段"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            {{ scope.row.phasesSort === 5 && scope.row.checkState === 1 ? '已结题' : scope.row.phasesName }}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span v-if="scope.row.phasesSort === 5 && scope.row.checkState === 1" class="green">完成</span>
            <span v-else-if="scope.row.state === 1" class="green">正常</span>
            <span v-else-if="scope.row.state === 2" class="orange">延期</span>
            <span v-else-if="scope.row.state === 3" class="red">撤项</span>
          </template>
        </el-table-column>        
        <el-table-column
          label="立项申请评审"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 1)[0]">
              <span v-if="scope.row.phasesSort > 1" @click="getDetail(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 1)[0].phasesId)">{{scope.row.checkUserList.filter(item => item.phasesSort === 1)[0].userName}}<span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 1)[0].userCount > 1">(组)</span></span>
              <span v-if="scope.row.phasesSort === 1"  class="(scope.row.score === 1 || scope.row.checkState !== 0) ? '' : changelist">
                <span @click="scope.row.score === 1 || scope.row.checkState !== 0 ? getDetail(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 1)[0].phasesId) : change(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 1)[0].phasesId, 1)">{{scope.row.checkUserList.filter(item => item.phasesSort === 1)[0].userName}}<span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 1)[0].userCount > 1">(组)</span></span>
              </span>
              <span v-if="scope.row.phasesSort < 1"  class="changelist" @click="change(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 1)[0].phasesId, 1)">{{scope.row.checkUserList.filter(item => item.phasesSort === 1)[0].userName}}<span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 1)[0].userCount > 1">(组)</span></span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="开题评审"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 2)[0]">
                <span v-if="scope.row.phasesSort > 2" @click="getDetail(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 2)[0].phasesId)">{{scope.row.checkUserList.filter(item => item.phasesSort === 2)[0].userName}}<span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 2)[0].userCount > 1">(组)</span></span>
                <span v-if="scope.row.phasesSort === 2" class="(scope.row.score === 1 || scope.row.checkState !== 0) ? '' : changelist">
                  <span  @click="scope.row.score === 1 || scope.row.checkState !== 0 ? getDetail(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 2)[0].phasesId) : change(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 2)[0].phasesId, 2)">{{scope.row.checkUserList.filter(item => item.phasesSort === 2)[0].userName}}<span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 2)[0].userCount > 1">(组)</span></span>
                </span>
                <span v-if="scope.row.phasesSort < 2" class="changelist"  @click="change(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 2)[0].phasesId, 2)">{{scope.row.checkUserList.filter(item => item.phasesSort === 2)[0].userName}}<span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 2)[0].userCount > 1">(组)</span></span>
              </span>  
          </template>
        </el-table-column>
        <el-table-column
          label="中期研究评审"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
              <span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 3)[0]">
                  <span v-if="scope.row.phasesSort > 3" @click="getDetail(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 3)[0].phasesId)">{{scope.row.checkUserList.filter(item => item.phasesSort === 3)[0].userName}}<span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 3)[0].userCount > 1">(组)</span></span>
                  <span v-if="scope.row.phasesSort === 3" class="(scope.row.score === 1 || scope.row.checkState !== 0) ? '' : changelist">
                    <span  @click="scope.row.score === 1 || scope.row.checkState !== 0 ? getDetail(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 3)[0].phasesId) : change(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 3)[0].phasesId, 3)">{{scope.row.checkUserList.filter(item => item.phasesSort === 3)[0].userName}}<span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 3)[0].userCount > 1">(组)</span></span>
                  </span>
                  <span v-if="scope.row.phasesSort < 3" class="changelist" @click="change(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 3)[0].phasesId, 3)">{{scope.row.checkUserList.filter(item => item.phasesSort === 3)[0].userName}}<span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 3)[0].userCount > 1">(组)</span></span>
                </span>            
          </template>
        </el-table-column>
        <el-table-column
          label="中期总结评审"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
              <span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 4)[0]">
                  <span v-if="scope.row.phasesSort > 4" @click="getDetail(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 4)[0].phasesId)">{{scope.row.checkUserList.filter(item => item.phasesSort === 4)[0].userName}}<span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 4)[0].userCount > 1">(组)</span></span>
                  <span v-if="scope.row.phasesSort === 4" class="(scope.row.score === 1 || scope.row.checkState !== 0) ? '' : changelist">
                    <span @click="scope.row.score === 1 || scope.row.checkState !== 0 ? getDetail(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 4)[0].phasesId) : change(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 4)[0].phasesId, 4)">{{scope.row.checkUserList.filter(item => item.phasesSort === 4)[0].userName}}<span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 4)[0].userCount > 1">(组)</span></span>
                  </span>
                  <span class="changelist" v-if="scope.row.phasesSort < 4" @click="change(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 4)[0].phasesId, 4)">{{scope.row.checkUserList.filter(item => item.phasesSort === 4)[0].userName}}<span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 4)[0].userCount > 1">(组)</span></span>
                </span>             
          </template>
        </el-table-column>
        <el-table-column
          label="结题评审"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
              <span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 5)[0]">
                  <span v-if="scope.row.phasesSort > 5" @click="getDetail(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 5)[0].phasesId, 5)">{{scope.row.checkUserList.filter(item => item.phasesSort === 5)[0].userName}}<span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 5)[0].userCount > 1">(组)</span></span>
                  <span v-if="scope.row.phasesSort === 5" class="(scope.row.score === 1 || scope.row.checkState !== 0) ? '' : changelist">
                    <span @click="scope.row.score === 1 || scope.row.checkState !== 0 ? getDetail(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 5)[0].phasesId, 5) : change(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 5)[0].phasesId, 5)">{{scope.row.checkUserList.filter(item => item.phasesSort === 5)[0].userName}}<span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 5)[0].userCount > 1">(组)</span></span>
                  </span>
                  <span class="changelist" v-if="scope.row.phasesSort < 5" @click="change(scope.row, scope.row.checkUserList.filter(item => item.phasesSort === 5)[0].phasesId, 5)">{{scope.row.checkUserList.filter(item => item.phasesSort === 5)[0].userName}}<span v-if="scope.row.checkUserList.filter(item => item.phasesSort === 5)[0].userCount > 1">(组)</span></span>
                </span>
          </template>
        </el-table-column>                                                
      </el-table>
      </div>
    </main>


    <div class="buttons">
        <el-button  @click="exportlist"><img src="../../../assets/images/courseManager/edit-btn.png">导出名单</el-button>
        <el-button  @click="cancalTopic" :disabled="count === 0"><img src="../../../assets/images/courseManager/cancel-btn.png">撤项</el-button>
        <el-button  @click="Refer" :disabled="count === 0"><img src="../../../assets/images/courseManager/communiate-btn.png">推介交流</el-button>
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
      title="评审详情"
      :visible.sync="dialogVisible"
      width="655px">
      <ul>
        <li>
          <span>课题名称：</span>
          <span>{{detail.title}}</span>
        </li>
        <li>
          <span>单位:</span>
          <span>{{detail.companyName}}</span>
        </li>
        <li>
          <span>评审详细信息:</span>
          <el-table
            :data="detail.checkUserList"
            border
            style="width: 100%">
            <el-table-column
              label="评审人"
              align="center"
              width="200">
              <template slot-scope="scope">
                <span>{{scope.row.userName}} <span v-if="scope.row.userType === 3">(专家)</span></span>
              </template>
            </el-table-column>
            <el-table-column
              prop="score"
              label="评分"
              align="center"
              width="200">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="评语">
              <template slot-scope="scope">
                <span>{{scope.row.comment}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            border
            :data="detail.tableData3"
            style="width: 100%">
            <el-table-column
              label="评审组人数"
              prop="checkUserCount"
              align="center"
              width="120">
            </el-table-column>
            <el-table-column
              label="实评审人数"
              align="center"
              prop="judgeCount"
              width="120">
            </el-table-column>
            <el-table-column
              align="center"
              width="120"
              prop="agreeCount"
              label="同意立项">           
            </el-table-column>
            <el-table-column
              align="center"
              width="120"
              prop="notAgreeCount"
              label="不同意立项">              
            </el-table-column>
            <el-table-column
              align="center"
              prop="avgScort"
              label="平均得分">             
            </el-table-column>                        
          </el-table>                   
        </li>
        <li>
          <span>评审组长意见:</span>
          <span v-if="detail.leadCheckUserDto.checkState === 0">未签署</span>
          <span v-if="detail.leadCheckUserDto.checkState === 1">同意</span>
          <span v-if="detail.leadCheckUserDto.checkState === 2">不同意</span>
          <p>{{detail.leadCheckUserDto.opinion}}</p>
        </li>
      </ul>
    </el-dialog>


    <el-dialog
    title="评审详情"
    :visible.sync="endDialogVisible"
    class="detail"
    width="655px">
    <el-table
      :data="appraiser"
       border
      style="width: 100%">
      <el-table-column
        label="结题鉴定人"
        align="center"
        width="200">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="role"
        label="角色"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column
        prop="company"
        show-overflow-tooltip
        align="center"
        label="所属单位">
      </el-table-column>
    </el-table>    
    <ul class="endList">
      <li>
        结题方式：
        <a v-if="endInfo.conclusionType === 1">会议结题</a>
        <a v-if="endInfo.conclusionType === 2">通讯结题</a>
      </li>
      <li>
        结题鉴定书： 
       <a @click="look" class="book">{{endInfo.fileName}}</a>
      </li>
      <li>是否同意结题：
        <a v-if="endInfo.checkState === 1">同意</a>
        <a v-if="endInfo.checkState === 2">不同意</a>
      </li>
      <li>鉴定意见：<span class="opinion">{{endInfo.opinion}}</span></li>      
    </ul>
  </el-dialog>
      
    <el-dialog
      title="更换评审"
      :visible.sync="changeVisible"
      width="655px">
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
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="startCheck">确定更换</el-button>
      <el-button @click="changeVisible = false">取 消</el-button>
    </span>
  </el-dialog>    
  <el-dialog
    title="确定推介交流"
    :visible.sync="referdialog"
    width="30%"
    center>
    <span>您确认将此课题进行交流展示么？</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="referdialog = false">取 消</el-button>
    </span>
  </el-dialog>
  </div>  
</template>

<script>
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import service from '../../../utils/axios.js'
import { notice, success } from '../../../api/index.js'
import { dateFormat } from '../../../filters/index'
export default {
  name: 'subject-lists',
  components: {
    draggable
  },
  data () {
    return {
      currentPage: 1,
      endDialogVisible: false,
      totalCount: 0,
      pageSize: 10,
      hasSelectedByAssessment: [],
      endInfo: {},
      appraiser: [],
      detail: {
        checkUserList: [],
        leadCheckUserDto: {},
        tableData3: []
      },
      count: 0,
      dialogVisible: false,
      changeVisible: false,
      value: '',
      courseTitle: '',
      time: '',
      state: '',
      header: '',
      value6: [],
      tableData: [],
      options: [
        { value: '1', label: '立项申请阶段' },
        { value: '2', label: '开题阶段' },
        { value: '3', label: '中期研究阶段' },
        { value: '4', label: '中期总结阶段' },
        { value: '5', label: '结题阶段' }
      ],
      typeValue: '',
      typeState: '',
      typeOptions: [],
      phasesSort: 0,
      stateOptions: [
        { value: '1', label: '正常' },
        { value: '2', label: '延期' },
        { value: '3', label: '撤项' }
      ],
      filterText: '',
      referdialog: false,
      data2: [{
        id: '',
        name: '专家',
        children: []
      }, {
        id: '',
        name: '用户',
        children: []
      }],
      selection: [],
      ids: '',
      id: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    look () {
      console.log(this.previewUrl)
      let url
      url = `${this.staticUrl}?filepath=${this.endInfo.filePath}`
      window.open(url)
    },
    exportlist () {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/backTopicListController/postExcel?topicName=${this.courseTitle}` +
                  `&leadUserName=${this.header}&classificationId=${this.typeValue}&phasesName=${this.value}` +
                  `&startTime=${dateFormat(this.value6[0], 'yyyy-MM-dd HH:mm')}&endTime=${dateFormat(this.value6[1], 'yyyy-MM-dd HH:mm')}&state=${this.typeState}`
    },
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
    handleCurrentChange (val) {
      this.currentPage = val
      this.getData()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    Refer () {
      this.referdialog = true
    },
    getDetail (row, phasesId, flag) {
      if (flag === 5) {
        this.endDialogVisible = true
        service.get(`backTopicListController/getConclusion?topicId=${row.id}&phasesId=${phasesId}`)
        .then(res => {
          if (res.data.code !== 1) {
            notice(this, res.data.message, 2000)
          } else {
            res.data.result ? this.endInfo = res.data.result : this.endInfo = {}
            this.appraiser = JSON.parse(res.data.result.appraiser)
          }
        })
      } else {
        this.dialogVisible = true
        this.detail.tableData3 = []
        service.get(`backTopicListController/getPhasesCheckDetails?topicId=${row.id}&phasesId=${phasesId}`)
        .then(res => {
          if (res.data.code !== 1) {
            notice(this, res.data.message, 2000)
          } else {
            this.detail.title = row.name
            this.detail.companyName = row.companyName
            this.detail.checkUserList = res.data.result.checkUserList
            this.detail.leadCheckUserDto = res.data.result.leadCheckUserDto
            let obj = {}
            obj.checkUserCount = res.data.result.checkUserCount
            obj.judgeCount = res.data.result.judgeCount
            obj.agreeCount = res.data.result.agreeCount
            obj.notAgreeCount = res.data.result.notAgreeCount
            obj.avgScort = res.data.result.avgScort
            this.detail.tableData3.push(obj)
          }
        })
      }
    },
    async change (row, phasesId, phasesSort) {
      this.changeVisible = true
      this.phasesSort = phasesSort
      await this.getDept()
      this.hasSelectedByAssessment = []
      this.id = row.id
      await service.get(`backTopicListController/getCheckUserDetails?topicId=${row.id}&phasesId=${phasesId}`)
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
    async getDept () {
      await service.get(`backTopicListController/getAllExpertAndUser`)
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          this.data2[0].children = [...res.data.result.expertList]
          this.data2[1].children = [...res.data.result.userList]
        }
      })
    },
    startCheck () {
      if (this.hasSelectedByAssessment[0].state === 3) {
        notice(this, '专家不能作为组长', 2000)
        return
      }
      this.changeVisible = false
      if (!this.editflag) {
        service.post(`backTopicListController/updateChechUser`, {
          topicId: this.id,
          checkUserIds: this.hasSelectedByAssessment.map(item => item.id).join(','),
          checkUserNames: this.hasSelectedByAssessment.map(item => item.name).join(','),
          userState: this.hasSelectedByAssessment.map(item => item.state).join(','),
          phasesSort: this.phasesSort
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
    submit () {
      this.referdialog = false
      service.post(`backTopicListController/referrals`, {
        ids: this.ids
      })
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          success(this, res.data.message, 2000)
          this.getData()
          this.ids = ''
          this.count = 0
        }
      })
    },
    cancalTopic () {
      service.post(`backTopicListController/cancalTopic`, {
        ids: this.ids
      })
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          success(this, res.data.message, 2000)
          this.ids = ''
          this.count = 0
          this.getData()
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    choose (selection, row) {
      this.count = selection.length
      this.ids = selection.map(n => n.id).join(',')
      this.selection = [...selection]
    },
    selectAll (selection) {
      this.count = selection.length
      this.ids = selection.map(n => n.id).join(',')
    },
    getData () {
      service.get(`backTopicListController/getTopicList?pageNo=${this.currentPage}&pageSize=${this.pageSize}&topicName=${this.courseTitle}` +
                  `&leadUserName=${this.header}&classificationId=${this.typeValue}&phasesType=${this.value}` +
                  `&startTime=${dateFormat(this.value6[0], 'yyyy-MM-dd HH:mm')}&endTime=${dateFormat(this.value6[1], 'yyyy-MM-dd HH:mm')}&state=${this.typeState}`)
        .then(res => {
          if (res.data.code !== 1) {
            notice(this, res.data.message, 2000)
          } else {
            this.tableData = res.data.result.list
            this.totalCount = res.data.result.totalCount
            this.courseTitle = ''
            this.header = ''
            this.typeValue = ''
            this.value = ''
            this.value6 = []
            this.typeState = ''
          }
        })
    },
    getType () {
      service.get(`backTopicListController/getAllType`)
      .then(res => {
        if (res.data.code !== 1) {
          notice(this, res.data.message, 2000)
        } else {
          this.typeOptions = res.data.result
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'staticUrl'
    ])
  },
  created () {
    this.getType()
    this.getData()
  },
  watch: {
    filterText (val) {
      this.$refs.data2.filter(val)
    }
  }
}
</script>

<style lang="scss" scope="scoped">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.subject-lists{
  padding-bottom: $width; 
  position: relative;

  .changelist {
    background: #E0EEFD !important;
    color:#73C3EB !important;
  }
  .red {
    color: #F47564;
  }
    .green {
    color: #87D57C;
  }
    .orange {
    color: #FEB760;
  }

  .buttons {
    margin-top: 20px;
    &>span {
      margin-left: 10px;
    }
    &>.el-button {
      padding: 10px 15px;
      color: #fff;

      &>span {
        &>img {
          margin-right: 13px;
          vertical-align: middle;
        }
      }

      &:nth-child(1) {
        background: #9AD692;
        border: 1px solid #9AD692;

        &:hover {
          background: #87D57C;
          border: 1px solid #87D57C;
        }
      }
      &:nth-child(2) {
        background: #FF857A;
        border: 1px solid #FF857A;

        &:hover {
          background: #FF6C60;
          border: 1px solid #FF6C60;
        }
      }
      &:nth-child(3) {
        background: #59A1FF;
        border: 1px solid #59A1FF;

        &:hover {
          background: #59A1FF;
          border: 1px solid #59A1FF;
        }
      }
    }
      // 分页
    .el-pagination{
      float: right;
    }       
  }

  .line {
    position: absolute;
    width: 100%;
    border: 1px solid #EBEEF7;
    top: 129px;
  }

  .book {
    color: #1AB3F7;
    &:hover {
      cursor: pointer;
    }
  }

  header {
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

  .el-table::before {
    display: none;
  }
  tr {
    td {
      &:nth-child(10),&:nth-child(11),&:nth-child(12),&:nth-child(13),&:last-child {
        .cell {
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
  .el-table__body-wrapper{
    overflow: auto !important;
  }
  main{
    background: #fff;
    overflow: hidden;
    .table-box {
      padding: $width;
      margin-top: 0px;
    }


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
           &:nth-child(14){
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
          .cell {
            &>span {
              &>span {
                padding: 5px 10px;
                background: #73C3EB;
                color: #fff;
              }
            }
          }
          &:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
          }
          &:nth-child(14){
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
    p {
      font-size: 16px;
      padding: $width;
      border-bottom: 1px solid #EBEEF7;
      img {
        margin-right: 10px;
      }
    }

    .button-group{
      padding: $width;


      &:after {
        @include clearfloat;
      }

      .buttons {

        &>span {
          margin-left: 10px;

        }
      }

      &>ul {
        margin-top: 20px;
        float: left;
        min-width: 1295px;

        li {
          text-align: center;
          float: left;
          margin-right: 45px;
          margin-bottom: 20px;

          &>.el-button {
            padding: 10px 15px;                                                                                                                                                                                                                                                                   
            color: #fff;
            background: #87D57C;
            border: 1px solid #87D57C;
            img {
              margin-right: 13px;
              vertical-align: middle;
            }
          }

          &>span {
            float: left;
            line-height: 40px;
          }

          .el-input {
            width: 146px;
            margin-left: 10px;
          }
          .el-range-editor {
            .el-range-input {
            }
            margin-left: 10px;
            span {
              float: none !important;
            }
          }
          .el-select{
            float: right;
            width: 150px;
          }     
        }
      }

    }

  }
  .detail {
    .el-table {
      margin-bottom: 15px;
      max-height: 150px;
      overflow: auto;
    }
    .el-dialog__body {
      &:after {
        @include clearfloat;        
      }  

      .endList {
        width: 100%;
        display: block;
        padding-left: 20px;

        li {
          .opinion {
            width: 85%;
            max-height: 200px;
            overflow-y: auto;
            text-align: left;
            float: none !important;
            margin-right: 0px;
            margin-left: 75px;
            margin-top: -23px;
            font-size: 14px;
          }
        }
      }
    }
  }
  // 新增弹出框
  .el-dialog{
    &>.el-dialog__body{

      .el-table__empty-block {
        span {
          text-align: center !important;
        }
      }      
      .el-table {
        &:first-child {
          .el-table__body-wrapper {
            max-height:　200px;
            overflow-y: auto;
          }
        }
        max-height: 200px;
        overflow-y: auto;        
      }
      .el-table__body-wrapper{
        overflow-x: hidden !important;
      }      
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
            overflow-x: hidden;
            &>li {
            // text-indent: 2em;
            &>span {
              &>li {
                line-height: 30px;
                &:hover {
                  cursor: move;
                }
                &>i {
                  width: 20px;
                  float: right;
                  line-height: 30px;
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

      &>ul {
        &>li {
          margin-bottom: 20px;
          &:after {
            @include clearfloat;
          }
          &>span {
            &:first-child {
              font-size: 16px;
              width: 120px;
              text-align: right;
              display: block;
              float: left;
              margin-right: 10px;
            }
          }
          .el-table {
            margin-top: 20px;
          }
          &>p {
            margin-left: 122px;
          }
        }
      }

    }
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
