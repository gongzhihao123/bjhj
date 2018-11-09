<template>
  <div class="back-my-subject">

    <div class="nav-name">
      <img src="../../../assets/images/backSubjectChange-icon.png" alt="">
      课题评审
    </div>

    <header>
      我负责的课题审核
    </header>

    <main>
      <p>
        <el-select v-model="stageValue" placeholder="请选择课题阶段" @change="stageChange">
          <el-option
            v-for="item in stageOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="stateValue" placeholder="请选择是否审核" @change="stateChange">
          <el-option
            v-for="item in stateOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </p>

      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="课题名称"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="classificationName"
          label="课题分类"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="leadUserName"
          label="负责人"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="单位"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          prop="phasesName"
          label="当前阶段"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            {{ scope.row.phasesSort === 5 && scope.row.checkState === 1 ? '已结题' : scope.row.phasesName }}
          </template>
        </el-table-column>
        <el-table-column
          label="立项日期"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            {{ scope.row.checkedTime | dateFormat('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="score"
          label="得分"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="签署状态"
          align='center'
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span v-if="scope.row.checkState === 1" style="color: #90D886">通过</span>
            <span v-if="scope.row.checkState === 3" style="color: #F47564">建议修改</span>
            <span v-if="scope.row.checkState === 2" style="color: #F47564">不通过</span>
            <span v-if="scope.row.checkState === 0" style="color: #7DACEF;">未签署</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align='center'
          show-overflow-tooltip
          width="160"
          label-class-name="head">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :enterable="false" content="评分" placement="top">
              <el-button type="primary" size="small" @click="score(scope.row)" v-if="scope.row.checkState === 0" :disabled="scope.row.reportFlag === 0"><i class="iconfont icon-score"></i></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :enterable="false" content="评分" placement="top">
              <el-button type="primary" size="small" @click="score(scope.row)" v-if="scope.row.checkState !== 0" :disabled="scope.row.score !== null"> <i class="iconfont icon-score"></i></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :enterable="false" content="签署" placement="top">
              <el-button v-if="scope.row.userType === 1" type="primary" size="small"  :disabled="scope.row.checkState !== 0 || scope.row.reportFlag === 0" @click="signed(scope.row)"><i class="iconfont icon-signed"></i></el-button>
            </el-tooltip>
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

    <!-- 结题弹出框 -->
    <el-dialog
      :visible.sync="overDialogVisible"
      class="over-dialog"
      width="600px">
      <p slot="title">{{ detail.topicName }}</p>
      
        <!-- 內層弹出框 -->
        <el-dialog
          :title="isEdit ? '编辑' : '新增'"
          :visible.sync="overInnerDialogVisible"
          append-to-body
          width="600px">
          
          <el-form :model="dialogData" ref="dialogData" label-width="100px" class="demo-ruleForm" v-if="overInnerDialogVisible">
            <el-row>
              <el-col :span="4" class="text-right">结题鉴定人：</el-col>
              <el-col :span="20">
                <el-form-item
                  prop="name"
                  :rules="[
                    { required: true, message: '结题鉴定人不能为空'},
                  ]"
                >
                  <el-input v-model.trim="dialogData.name" :maxlength="10"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row>
              <el-col :span="4" class="text-right">角色：</el-col>
              <el-col :span="20">
                <el-form-item
                  prop="role"
                  :rules="[
                    { required: true, message: '角色不能为空'},
                  ]"
                >
                  <el-input v-model.trim="dialogData.role" :maxlength="20"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="4" class="text-right">所属单位：</el-col>
              <el-col :span="20">
                <el-form-item
                  prop="company"
                  :rules="[
                    { required: true, message: '所属单位不能为空'},
                  ]"
                >
                  <el-input v-model.trim="dialogData.company" :maxlength="30"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="overInnerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="overInnerSubmitFormDialog('dialogData')">确 定</el-button>
          </span>
        </el-dialog>

      <div class="data-list">
        <el-table
          :data="overTableData"
          border
          stripe>
          <el-table-column
            prop="name"
            label="结题鉴定人"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="role"
            label="角色"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="company"
            label="所属单位"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            label="操作"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
            <template slot-scope="scope">
              <el-button size="small" @click="edit(scope.row, scope.$index)"> 编辑 </el-button>
              <el-button size="small" @click="del(scope.row, scope.$index)"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="add">新增</el-button>
      </div>

      <div class="signed-type signed-advice">
        <!-- 结题方式 -->
        <span>
          结题方式：
        </span>
        <el-select v-model="overTypeValue" placeholder="请选择">
          <el-option
            v-for="item in overOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="signed-type signed-advice">
        <!-- 结题方式 -->
        <span>
          结题鉴定书：
        </span>
        <el-upload
          class="upload-demo"
          :action="action"
          :on-success="success"
          :show-file-list="false"
          :before-upload="beforeUpload">
          <el-button type="primary">选择文件</el-button>
          <span slot="tip" class="el-upload__tip" style="margin-left: 20px;font-size: 16px;">  {{ fileName ? fileName : '未选择文件' }}</span>
        </el-upload>
      </div>

      <div class="signed-advice">
        <!-- 结题申请 -->
        <span>
          是否同意结题：
        </span>
        <el-radio-group v-model="overRadioValue">
          <el-radio :label="1">同意</el-radio>
          <el-radio :label="2">不同意</el-radio>
          <el-radio :label="3">建议修改</el-radio>
        </el-radio-group>
      </div>

      <el-form v-if="overDialogVisible" :model="overContentData" :rules="rules" ref="overContentData" label-width="100px" class="demo-ruleForm signed-time">
        <el-row v-if="overRadioValue === 3">
          <span>再次提交期限：</span>
          <el-form-item
            prop="dateValue"
          >
            <el-date-picker
              v-model="overContentData.dateValue"
              type="date"
              :picker-options="pickerOptions"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-row>
        
      </el-form>
      
      <div class="signed-advice">
        <!-- 结题申请 -->
        <span>
          鉴定意见：
        </span>
        <el-input type="textarea" :maxlength="30" v-model="overOpinion" :rows="3"></el-input>
      </div>

      <footer>
        <el-button type="primary" size="small" @click="overSubmitForm('overContentData')">提交</el-button>
        <el-button size="small" @click="overDialogVisible = false">返回</el-button>
      </footer>
    </el-dialog>

    <!-- 评分弹出框 -->
    <el-dialog
      :visible.sync="scoreDialogVisible"
      class="score-dialog"
      width="922px">
      <p slot="title">{{ detail.topicName }}</p>
      <div>
        <p>
          <span>内部评审人：</span>
          <i style="font-style: normal;" v-for="(item, index) in userList" :key="index"> {{ item.userName }} </i>
          <br>
          <span>评 审 专 家：</span>
          <i style="font-style: normal;" v-for="(item, index) in expertsList" :key="index"> {{ item.userName }} </i>
        </p>
      </div>
      <div>
        <iframe :src="url" class="score-content" width="870" height="400"></iframe>
      </div>

      <div class="data-list">
        <el-button-group>
          <el-button @click="getPhasesReport">阶段报告</el-button>
          <el-button @click="getDatumList">课题资料</el-button>
          <el-button @click="getLogList">研究日志</el-button>
          <el-button @click="getActivityList">研究活动</el-button>
        </el-button-group>

        <!-- 阶段报告列表 -->
        <el-table
          v-if="show[0]"
          :data="reportData"
          @row-click='rowClick'
          border
          stripe>
          <el-table-column
            prop="reportName"
            label="报告名称"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="phasesName"
            label="报告类型"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="createdTime"
            label="上传时间"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="state"
            label="审核状态"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
        </el-table>

        <!-- 课题资料列表 -->
        <el-table
          v-if="show[1]"
          :data="datumData"
          @row-click='rowClick'
          border
          stripe>
          <el-table-column
            prop="name"
            label="资料名称"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="createdUserName"
            label="上传人"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="companyName"
            label="所属单位"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="datumType"
            label="资料类型"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="createdTime"
            label="上传时间"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
        </el-table>

        <!-- 日志资料列表 -->
        <el-table
          v-if="show[2]"
          :data="logData"
          @row-click='viewList'
          border
          stripe>
          <el-table-column
            prop="name"
            label="日志名称1"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="createdUserName"
            label="编写人"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="companyName"
            label="所属单位"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="createdTime"
            label="上传时间"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
        </el-table>

        <!-- 活动列表 -->
        <el-table
          v-if="show[3]"
          :data="activityData"
          @row-click='activeRow'
          border
          stripe>
          <el-table-column
            prop="name"
            label="活动名称"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="responsibleUser"
            label="活动发起人"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="开始时间"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
            <!-- <template slot-scope="scope">
              {{ scope.row.startTime | dateFormat('yyyy-MM-dd') }}
            </template> -->
          </el-table-column>
          <el-table-column
            prop="stopTime"
            label="结束时间"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
            <!-- <template slot-scope="scope">
              {{ scope.row.stopTime | dateFormat('yyyy-MM-dd') }}
            </template> -->
          </el-table-column>
        </el-table>
      </div>

      <el-form :model="contentData" ref="contentData" label-width="100px" class="demo-ruleForm">

        <div class="score-scoring">
          <span>得分：</span>
          <el-form-item
            prop="score"
            :rules="[
              { required: true, message: '评分不能为空'},
            ]"
          >
            <el-input placeholder="满分为100分，请输入" type="number" max="100" min="0" v-model="contentData.score"></el-input>
          </el-form-item>
        </div>
      </el-form>

      <div class="score-appraise">
        <p>评价：</p>
        <el-input type="textarea" v-model="comment" :rows="3" :maxlength="30" placeholder="请输入评价内容"></el-input>
      </div>

      <footer>
        <el-button type="primary" size="small" @click="scoreSubmitForm('contentData')">提交</el-button>
        <el-button size="small" @click="scoreDialogVisible = false">返回</el-button>
      </footer>

      <ul class="progress">
        <li v-for="(item, index) in navList" :key="index" :class="{active: item.time}">
          <span>
            {{ item.name }} <br>
            {{ item.time }}
          </span>
          <i></i>
        </li>
      </ul>
    </el-dialog>

    <!-- 签署弹出框 -->
    <el-dialog
      :visible.sync="signedDialogVisible"
      class="signed-dialog"
      width="600px">
      <p slot="title">
        {{ detail.topicName }}
      </p>
      <div>
        <p>
          <span>单  位：</span>
          <i style="font-style: normal;"> {{ detail.companyName }} </i>
        </p>
      </div>

      
      <div class="data-list">
        <el-button-group>
          <el-button @click="getPhasesReport">阶段报告</el-button>
          <el-button @click="getDatumList">课题资料</el-button>
          <el-button @click="getLogList">研究日志</el-button>
          <el-button @click="getActivityList">研究活动</el-button>
        </el-button-group>

        <!-- 阶段报告列表 -->
        <el-table
          v-if="show[0]"
          :data="reportData"
          @row-click='rowClick'
          border
          stripe>
          <el-table-column
            prop="reportName"
            label="报告名称"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="phasesName"
            label="报告类型"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="createdTime"
            label="上传时间"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="state"
            label="审核状态"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
        </el-table>

        <!-- 课题资料列表 -->
        <el-table
          v-if="show[1]"
          :data="datumData"
          @row-click='rowClick'
          border
          stripe>
          <el-table-column
            prop="name"
            label="资料名称"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="createdUserName"
            label="上传人"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="companyName"
            label="所属单位"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="datumType"
            label="资料类型"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="createdTime"
            label="上传时间"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
        </el-table>

        <!-- 日志资料列表 -->
        <el-table
          v-if="show[2]"
          :data="logData"
          @row-click='viewList'
          border
          stripe>
          <el-table-column
            prop="name"
            label="日志名称"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="createdUserName"
            label="编写人"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="companyName"
            label="所属单位"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="createdTime"
            label="上传时间"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
            <!-- <template slot-scope="scope">
              {{ scope.row.createdTime | dateFormat('yyyy-MM-dd') }}
            </template> -->
          </el-table-column>
        </el-table>

        <!-- 活动列表 -->
        <el-table
          v-if="show[3]"
          :data="activityData"
          @row-click='activeRow'
          border
          stripe>
          <el-table-column
            prop="name"
            label="活动名称"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="responsibleUser"
            label="活动发起人"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="开始时间"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
            <!-- <template slot-scope="scope">
              {{ scope.row.startTime | dateFormat('yyyy-MM-dd') }}
            </template> -->
          </el-table-column>
          <el-table-column
            prop="stopTime"
            label="结束时间"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
            <!-- <template slot-scope="scope">
              {{ scope.row.stopTime | dateFormat('yyyy-MM-dd') }}
            </template> -->
          </el-table-column>
        </el-table>
      </div>

      <div class="signed-detail" style="margin-top: 20px;">
        <span>
          评审详细信息：
        </span>

        <el-table
          :data="signedTableData"
          border
          stripe>
          <el-table-column
            prop="userName"
            label="评审人"
            align='center'
             width="200"
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            label="评审意见"
            align='center'
             width="200"
            show-overflow-tooltip
            label-class-name="head">
            <template slot-scope="scope">
              {{ scope.row.score ? scope.row.score >= 60 ? '通过' : '不通过' : '' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="score"
            label="评分"
            align='center'
             width="200"
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="comment"
            label="评语"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
        </el-table>
      </div>

      <div class="signed-synthesise">
        <span>
          评审综合信息：
        </span>

        <el-table
          :data="signedTotalData"
          border
          stripe>
          <el-table-column
            prop="allCount"
            label="评审组人数"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="realityCount"
            label="实际评审人数"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="agreement"
            label="同意立项"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="disagreement"
            label="不同意立项"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="averageScore"
            label="平均得分"
            align='center'
            show-overflow-tooltip
            label-class-name="head">
          </el-table-column>
        </el-table>
      </div>
      <div class="signed-advice" v-if="detail.phasesSort !== 4">
        <!-- 阶段报告 -->
        <span>
          评审组长意见：
        </span>
        <el-radio-group v-model="signedRadioValue">
          <el-radio :label="1">同意</el-radio>
          <el-radio :label="2">不同意</el-radio>
          <el-radio :label="3">建议修改</el-radio>
        </el-radio-group>
      </div>
      
      <div class="signed-advice" v-if="detail.phasesSort === 4">
        <!-- 结题申请 -->
        <span>
          结题申请是否通过：
        </span>
        <el-radio-group v-model="signedRadioValue">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="2">不通过</el-radio>
          <el-radio :label="3">建议修改</el-radio>
        </el-radio-group>
      </div>

      <el-form :model="signedContentData" :rules="rules" ref="signedContentData" label-width="100px" class="demo-ruleForm signed-time">
        <el-row v-if="signedRadioValue === 3">
          <span>再次提交期限：</span>
          <el-form-item
            prop="dateValue"
          >
            <el-date-picker
              v-model="signedContentData.dateValue"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-row>
        
      </el-form>
      
      <div class="signed-advice">
        <!-- 结题申请 -->
        <span>
          详情：
        </span>
        <el-input v-model="signedComment" type="textarea" :maxlength="30" :rows="3"></el-input>
      </div>

      <footer>
        <el-button type="primary" size="small" @click="signedSubmitForm('signedContentData')">提交</el-button>
        <el-button size="small" @click="signedDialogVisible = false">返回</el-button>
      </footer>

      <ul class="progress">
        <li v-for="(item, index) in navList" :key="index" :class="{active: item.time}">
          <span>
            {{ item.name }} <br>
            {{ item.time }}
          </span>
          <i></i>
        </li>
      </ul>
    </el-dialog>
    <!--文件预览-->
    <el-dialog
      class="signed-dialog"
      width="922px"
      title="文件预览"
      :visible.sync="fileView">
      <iframe :src="fileUrl" class="score-content" width="870" height="630"></iframe>
    </el-dialog>
    <!--活动审核-->
    <el-dialog :visible.sync="peopleManageDialog" class="active-dialog" top="5%">
      <div>
        <p class="dialogP">
          <span class="label-span">活动名称：</span>
          <el-input class="levelInput" :disabled="true" v-model="activeName"></el-input>
        </p>
        <p class="dialogP">
          <span class="label-span">活动负责人：</span>
          <el-input class="levelInput" :disabled="true" v-model="activeEading"></el-input>
        </p>
        <p class="dialogP">
          <span class="label-span">活动目标：</span>
          <el-input class="levelInput" :disabled="true" v-model="activeTarget"></el-input>
        </p>
        <p class="dialogP">
          <span class="label-span">参与人：</span>
          <el-input class="levelInput" :disabled="true" v-model="activePeople"></el-input>
        </p>
        <p class="dialogP">
          <span class="label-span">活动时间：</span>
          <el-date-picker
            :disabled="true"
            class="levelInput"
            v-model="activeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </p>
        <p class="dialogP">
          <span class="label-span">记录人员：</span><el-input :disabled="true" class="small-input" v-model="keepPerson"></el-input>
          <span>观察分工：</span><el-input :disabled="true" class="small-input" v-model="watchAllot"></el-input>
        </p>
        <p class="dialogP">
          <span class="label-span">录像人员：</span><el-input :disabled="true" class="small-input" v-model="videoPerson"></el-input>
          <span>主持人员：</span><el-input :disabled="true" class="small-input" v-model="managePerson"></el-input>
        </p>
        <p style="margin-top: 10px;">
          <span class="label-span" style=" vertical-align: top;">活动记录：</span>
          <textarea cols="69"  rows="3" :disabled="true" v-model="activeKeeping"></textarea>
        </p>
        <section style="margin-top: 10px;" ref="imgs">
          <span class="label-span" style=" vertical-align: top;">精彩瞬间：</span>
          <div class="photos">
            <el-upload
              :disabled="true"
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              ref="img"
              :file-list="imgList"
              name="file"
              :auto-upload="false">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </section>
        <div class="dialogP" ref="files" style="margin-top: 10px;">
          <span class="label-span" style="margin-right: 10px;">附件:</span>
          <span v-for="(item, index) in filesList" @click="viewFile(item)" :key="index">{{item.fileName}}</span>
        </div>
      </div>
    </el-dialog>
    <!--日志内容-->
    <el-dialog
      class="signed-dialog"
      width="922px"
      title="日志内容"
      :visible.sync="fileList">
      <div>
        {{ viewDetail }}
      </div>
    </el-dialog>
  </div>
</template>

<script>
import server from '../../../utils/axios'
import { notice } from '../../../api/index'
import { dateFormat } from '../../../filters/index.js'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'back-my-subject',
  data () {
    return {
      num: '',
      fileView: false,
      fileUrl: '',
      isEdit: true,
      dialogData: {
        name: '',
        role: '',
        company: ''
      },
      overInnerDialogVisible: false,
      fileName: '',
      fileId: '',
      overOpinion: '',
      overRadioValue: 1,
      overContentData: {
        dateValue: ''
      },
      overOptions: [
        { label: '会议结题', value: 1 },
        { label: '通讯结题', value: 2 }
      ],
      overTypeValue: '',
      overTableData: [],
      action: '',
      overDialogVisible: false,
      rules: {
        dateValue: [
          { required: true, message: '再次提交期限不能为空' }
        ]
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      },
      signedContentData: {
        dateValue: ''
      },
      signedRadioValue: 1,
      signedComment: '',
      signedTotalData: [],
      signedTableData: [],
      show: [true, false, false, false],
      reportData: [],
      datumData: [],
      logData: [],
      activityData: [],
      url: '',
      expertsList: [],
      userList: [],
      scoreDialogVisible: false,
      signedDialogVisible: false,
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      stageValue: '',
      stageOption: [
        { label: '全部', value: '' },
        { label: '开题阶段', value: 2 },
        { label: '中期研究阶段', value: 3 },
        { label: '中期总结阶段', value: 4 },
        { label: '结题阶段', value: 5 }
      ],
      stateValue: '',
      stateOption: [
        { label: '全部', value: '' },
        { label: '未签署', value: 0 },
        { label: '通过', value: 1 },
        { label: '建议修改', value: 3 },
        { label: '不通过', value: 2 }
      ],
      navList: [
        { name: '立项申请', time: '' },
        { name: '开题阶段', time: '' },
        { name: '中期研究阶段', time: '' },
        { name: '中期总结阶段', time: '' },
        { name: '结题阶段', time: '' }
      ],
      topicId: '',
      tableData: [],
      detail: {},
      comment: '',
      contentData: {
        score: ''
      },
      peopleManageDialog: false,
      activeName: '',
      activeEading: '',
      activeTarget: '',
      activePeople: '',
      activeDate: [],
      keepPerson: '',
      watchAllot: '',
      videoPerson: '',
      managePerson: '',
      activeKeeping: '',
      filesList: [],
      imgList: [],
      dialogVisible: false,
      fileList: false,
      viewDetail: ''
    }
  },
  methods: {
    ...mapActions([
      'remind'
    ]),
    viewList (item) {
      this.fileList = true
      this.viewDetail = item.content
    },
    viewFile (item) {
      this.fileUrl = `${this.previewUrl}${this.staticUrl}?filepath=${item.filePath}`
      this.fileView = true
    },
    activeRow (item) {
      console.log(this.staticUrl)
      this.infoId = item.id
      this.activeName = item.name
      if (item.imgPath) {
        this.imgList = (item.imgPath || '').split(',').map((item, i) => {
          return {
            name: 'img',
            index: i,
            url: `${this.staticUrl}?filepath=${item}`
          }
        })
      } else {
        this.imgList = []
      }
      this.activeEading = item.responsibleUser
      this.activeTarget = item.activityAim
      this.activePeople = item.participationUser
      this.imgData = item.imgIds ? item.imgIds.split(',') : []
      this.activeDate = []
      this.activeDate[0] = item.startTime
      this.activeDate[1] = item.stopTime
      this.keepPerson = item.recordUser
      this.watchAllot = item.observeUser
      this.videoPerson = item.videoUser
      this.managePerson = item.directUser
      this.activeKeeping = item.content
      this.peopleManageDialog = true
      this.filesList = []
      if (item.fileIds) {
        server.get(`/frontTopicManageController/researchActivityListFiles?fileIds=${item.fileIds}`)
        .then(res => {
          if (res.data.code === 1) {
            this.filesList = res.data.result
          } else {
            notice(this, res.data.message || '获取失败', 2000)
          }
        })
      }
    },
    // 点击单元格预览
    rowClick (row) {
      this.fileUrl = `${this.previewUrl}${this.staticUrl}?filepath=${row.filePath}`
      this.fileView = true
    },
    // 結題彈出框內層
    overInnerSubmitFormDialog (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.overTableData.splice(this.num, 1, { name: this.dialogData.name, role: this.dialogData.role, company: this.dialogData.company })
          } else {
            this.overTableData.push({ name: this.dialogData.name, role: this.dialogData.role, company: this.dialogData.company })
          }
          this.overInnerDialogVisible = false
        } else {
          return false
        }
      })
    },
    // 审核签署意见
    overSavePhasesSign () {
      server.post(`/backPhaseCheckController/savePhasesSign`, {
        phasesId: this.detail.phasesId,
        checkId: this.detail.checkId,
        topicId: this.topicId,
        checkState: this.overRadioValue,
        opinion: this.overOpinion,
        submitTime: this.overContentData.dateValue ? dateFormat(this.overContentData.dateValue + 86399000, 'yyyy-MM-dd HH:mm:ss') : ''
      })
      .then(res => {
        if (res.data.code === 1) {
          this.remind('1')
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 保存结题内容
    overSaveConclusion () {
      server.post(`/backPhaseCheckController/saveConclusion`, {
        topicId: this.topicId,
        appraiser: JSON.stringify(this.overTableData),
        conclusionType: this.overTypeValue,
        fileId: this.fileId
      })
      .then(res => {
        if (res.data.code === 1) {
          this.overDialogVisible = false
          this.getTopicScoreList()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    overSubmitForm (formName) {
      if (this.overRadioValue !== 3) {
        this.rules.dateValue[0].required = false
      } else {
        this.rules.dateValue[0].required = true
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.overSavePhasesSign()
          this.overSaveConclusion()
        } else {
          return false
        }
      })
    },
    // 上传之前的钩子
    beforeUpload (file) {
      if (file.name.indexOf('doc') === -1) {
        this.$message.error('请上传word文档')
        return false
      }
    },
    // 上传成功的钩子
    success (res, file) {
      this.fileId = res.result.fileId
      this.fileName = file.name
    },
    // 结题添加评审人
    add () {
      this.overInnerDialogVisible = true
      this.isEdit = false
      this.dialogData = {
        name: '',
        role: '',
        company: ''
      }
    },
    edit (val, index) {
      this.num = index
      this.isEdit = true
      this.overInnerDialogVisible = true
      this.dialogData = {
        name: val.name,
        role: val.role,
        company: val.company
      }
    },
    del (val, index) {
      this.overTableData.splice(index, 1)
    },
    // 审核签署意见
    savePhasesSign () {
      server.post(`/backPhaseCheckController/savePhasesSign?`, {
        checkId: this.detail.checkId,
        topicId: this.topicId,
        checkState: this.signedRadioValue,
        opinion: this.signedComment,
        phasesId: this.detail.phasesId,
        submitTime: this.signedContentData.dateValue ? dateFormat(this.signedContentData.dateValue + 86399000, 'yyyy-MM-dd HH:mm:ss') : ''
      })
      .then(res => {
        if (res.data.code === 1) {
          this.remind('1')
          this.signedDialogVisible = false
          this.getTopicScoreList()
        }
      })
    },
    signedSubmitForm (formName) {
      if (this.signedRadioValue !== 3) {
        this.rules.dateValue[0].required = false
      } else {
        this.rules.dateValue[0].required = true
      }
      console.log(formName)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.savePhasesSign()
        } else {
          return false
        }
      })
    },
    scoreSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.savePhasesCheckScore()
        } else {
          return false
        }
      })
    },
    // 保存评分信息
    savePhasesCheckScore () {
      if (this.contentData.score > 100 || this.contentData.score < 0) {
        notice(this, '评分应在0-100之间', 2000)
        return
      }
      server.post(`/backPhaseCheckController/savePhasesCheckScore`, {
        checkId: this.detail.checkId,
        score: Math.round(this.contentData.score),
        comment: this.comment
      })
      .then(res => {
        if (res.data.code === 1) {
          this.remind('1')
          this.getTopicScoreList()
          this.scoreDialogVisible = false
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取评分详情
    async getTopicScoreDetail () {
      await server.get(`/backPhaseCheckController/getTopicScoreDetail?topicId=${this.topicId}`)
      .then(res => {
        if (res.data.code === 1) {
          console.log(res.data.result)
          this.detail = res.data.result
          this.url = `${this.previewUrl}${this.staticUrl}?filepath=${res.data.result.previewUrl}`
          this.expertsList = this.detail.checkUsers.filter(item => item.userType === 3)
          this.userList = this.detail.checkUsers.filter(item => item.userType !== 3)
          this.navList[Number(this.detail.phasesSort) - 1].time = this.detail.phasesTime.substring(0, 11)
          this.contentData.score = this.detail.checkScore
          this.comment = this.detail.checkComment
          this.getPhasesReport()
          if (!res.data.result.checkScore) {
            if (this.$refs['contentData']) {
              this.$refs['contentData'].resetFields()
            }
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取阶段报告
    getPhasesReport () {
      // if (this.show[0] === false) {
      //   this.pageSize = 10
      //   this.pageNo = 1
      // }
      this.show = [true, false, false, false]
      server.get(`/backPhaseCheckController/getPhasesReport?topicId=${this.topicId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.reportData = res.data.result
          this.reportData.forEach((item) => {
            item.createdTime = dateFormat(item.createdTime, 'yyyy-MM-dd')
            if (item.checkState === 0) item.state = '未审核'
            if (item.checkState === 1) item.state = '通过'
            if (item.checkState === 2) item.state = '不通过'
            if (item.checkState === 3) item.state = '建议修改'
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取阶段课题资料
    getDatumList () {
      // if (this.show[1] === false) {
      //   this.pageSize = 10
      //   this.pageNo = 1
      // }
      this.show = [false, true, false, false]
      server.get(`/backPhaseCheckController/getDatumList?topicId=${this.topicId}&pageSize=${200}&pageNo=${1}`)
      .then(res => {
        if (res.data.code === 1) {
          this.datumData = res.data.result.list
          this.totalCount = res.data.result.totalCount
          this.datumData.forEach((item) => {
            item.createdTime = dateFormat(item.createdTime, 'yyyy-MM-dd')
            if (item.datumType === 1) item.datumType = '开题资料'
            if (item.datumType === 2) item.datumType = '中期资料'
            if (item.datumType === 3) item.datumType = '结题资料'
            if (item.datumType === 4) item.datumType = '研究成果'
            if (item.datumType === 5) item.datumType = '其他'
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取阶段日志资料
    getLogList () {
      // if (this.show[2] === false) {
      //   this.pageSize = 10
      //   this.pageNo = 1
      // }
      this.show = [false, false, true, false]
      server.get(`/backPhaseCheckController/getLogList?topicId=${this.topicId}&pageSize=${200}&pageNo=${1}`)
      .then(res => {
        if (res.data.code === 1) {
          this.logData = res.data.result.list
          this.logData.forEach((item) => {
            item.createdTime = dateFormat(item.createdTime, 'yyyy-MM-dd')
          })
          this.totalCount = res.data.result.totalCount
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取阶段活动资料
    getActivityList () {
      // if (this.show[3] === false) {
      //   this.pageSize = 10
      //   this.pageNo = 1
      // }
      this.show = [false, false, false, true]
      server.get(`/backPhaseCheckController/getActivityList?topicId=${this.topicId}&pageSize=${200}&pageNo=${1}`)
      .then(res => {
        if (res.data.code === 1) {
          this.activityData = res.data.result.list
          this.activityData.forEach((item) => {
            item.startTime = dateFormat(item.startTime, 'yyyy-MM-dd')
            item.stopTime = dateFormat(item.stopTime, 'yyyy-MM-dd')
          })
          this.totalCount = res.data.result.totalCount
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 选择课题阶段
    stageChange () {
      this.getTopicScoreList()
    },
    // 选择是否审核
    stateChange () {
      this.getTopicScoreList()
    },
    // 评分
    async score (val) {
      // this.$router.push({ path: '/subjectReview/backMySubjectScore', query: { id: val } })
      this.topicId = val.id
      await this.getTopicScoreDetail()
      await server.get(`/backPhaseCheckController/getPhasesReport?topicId=${this.topicId}`)
      .then(res => {
        if (res.data.code === 1) {
          server.get(`/backPhaseCheckController/getPreviewPath?fileId=${res.data.result.filter(item => item.phasesId === this.detail.phasesId)[0].fileId}`)
          .then(res => {
            // `${this.previewUrl}${this.staticUrl}?filepath=${res.data.result.filePath}`
            // this.url = `${this.previewUrl}${this.staticUrl}?filepath=${res.data.result.filePath}`
            this.scoreDialogVisible = true
          })
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // /////////////////////////////////////////////////////////////////////////////////////////////////
    // 签署
    signed (val) {
      this.topicId = val.id
      this.getTopicSigenedDetail()
      if (val.phasesSort === 5) {
        // this.$router.push({ path: '/subjectReview/backMySubjectOver', query: { id: val.id } })
        this.overDialogVisible = true
        this.overTableData = []
        this.overTypeValue = ''
        this.overOpinion = ''
        this.overRadioValue = 1
        this.overContentData = {
          dateValue: ''
        }
      } else {
        // this.$router.push({ path: '/subjectReview/backMySubjectSigned', query: { id: val.id } })
        this.signedDialogVisible = true
      }
    },
    // 获取签署详情
    getTopicSigenedDetail () {
      server.get(`/backPhaseCheckController/getTopicScoreDetail?topicId=${this.topicId}`)
      .then(res => {
        if (res.data.code === 1) {
          // this.getSignedPhasesReport()
          this.url = `${this.previewUrl}${this.staticUrl}?filepath=${res.data.result.previewUrl}`
          this.detail = res.data.result
          this.signedContentData.score = this.detail.checkScore
          this.signedComment = this.detail.checkOpinion
          this.signedTableData = res.data.result.checkUsers
          this.navList[Number(this.detail.phasesSort) - 1].time = this.detail.phasesTime.substring(0, 11)
          this.getPhasesReport()
          let averageScore = 0
          let realityCount = 0
          this.signedTableData.forEach((item, index) => {
            if (item.score) {
              averageScore += item.score
              realityCount += 1
            }
          })
          this.signedTableData.forEach(item => {
            console.log(item.score)
          })
          this.signedTotalData = [
            { allCount: this.tableData.length, realityCount: realityCount, agreement: this.signedTableData.filter(item => item.score >= 60).length, disagreement: this.signedTableData.filter(item => item.score && item.score < 60).length, averageScore: (averageScore / (realityCount === 0 ? 1 : realityCount)).toFixed(0) }
          ]
          if (!res.data.result.checkScore) {
            this.$refs['contentData'].resetFields()
          }
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // 获取课题列表
    getTopicScoreList () {
      server.get(`/backPhaseCheckController/getTopicScoreList` +
                                              `?pageNo=${this.pageNo}` +
                                              `&pageSize=${this.pageSize}` +
                                              `&phasesSort=${this.stageValue}` +
                                              `&checkState=${this.stateValue}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result.list
          this.totalCount = res.data.result.totalCount
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getTopicScoreList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getTopicScoreList()
    }
  },
  computed: {
    ...mapGetters([
      'staticUrl',
      'previewUrl'
    ])
  },
  mounted () {
    var path = document.getElementById('contextPath').value
    this.action = `${path}/frontTopicDeclareController/uploadImage`
  },
  created () {
    this.getTopicScoreList()
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/variable.scss';
@import '../../../assets/scss/mixin.scss';
.back-my-subject{
  padding-bottom: $width;

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
    padding: $width;

    .el-table {
      .el-button {
        background: #A1ADCC;
        border-color: #A1ADCC; 
        padding: 6px 10px;

        &:nth-child(1):hover {
          background: #FFB035;
          border-color: #FFB035; 
        }

        &:nth-child(2):hover {
          background: #5295EB;
          border-color: #5295EB; 
        }
      }
    }

    // 分页
    .el-pagination{
      text-align: right;
      margin-top: $width
    }
  }

  // 结题弹出框
  .over-dialog {
    .el-dialog {
      .el-dialog__header {
        border-bottom: 1px solid #ddd;
      }

      .el-dialog__body {
        padding-top: 15px;

        // 列表
        .data-list{
          .el-button {
            margin: 10px 0;
          }
        }

        .signed-advice{
          margin-bottom: $width;
          &>span{
            display: inline-block;
            width: 120px;
            vertical-align: top;
          }
          .el-radio-group{
            margin-left: $width;
          }
          .el-textarea{
            width: 400px;
            margin-left: $width;
          }
        }

        .signed-type{
          .el-select{
            margin-left: $width;
          }
          .upload-demo{
            display: inline-block;
            margin-left: $width;
            .el-button {
              padding: 5px 10px;
              background: #A1ADCC;
              border: 1px solid #A1ADCC;
            }
          }
        }

        .signed-time{
          .el-row{
            &>span{
              display: inline-block;
              width: 120px;
            }
            .el-form-item{
              display: inline-block;
              .el-form-item__content{
                margin-left: $width !important;
              }
            }
          }
        }

        footer{
          margin-top: $width;
          text-align: center;
        }
      }
    }
  }

  // 评分弹出框
  .score-dialog {
    .el-dialog {
      .el-dialog__header {
        border-bottom: 1px solid #ddd;
      }

      .el-dialog__body {
        padding-top: 15px;

        // 列表
        .data-list{
          margin-bottom: $width;
          text-align: center;
        }

        .score-scoring{
          .el-form-item{
            display: inline-block;
            .el-form-item__content{
              margin-left: 0 !important;
            }
          }
          .el-input {
            width: 877px;
          }
        }

        // 评价部分
        .score-appraise{
          p{
            display: inline-block;
            margin-bottom: $width/2;
            vertical-align: top;
          }
          .el-textarea {
            width: 877px;
          }
        }

        footer {
          margin-top: 20px;
          text-align: center;
        }
      }
    }
  }

  // 签署弹出框
  .signed-dialog {
    .el-dialog {
      .el-dialog__header {
        border-bottom: 1px solid #ddd;
      }

      .el-dialog__body {
        padding-top: 15px;

        // 列表
        .data-list{
          margin-top: $width;
          text-align: center;
        }

        .signed-detail,.signed-synthesise,.signed-advice{
          margin-bottom: $width / 2;
          &>span{
            display: inline-block;
            width: 120px;
          }
        }

        .signed-advice{
          span {
            vertical-align: top;
          }
          .el-textarea{
            width: 400px;
            .el-textarea__inner{
              // width: 900px;
            }
          }
        }

        .signed-time{
          .el-row{
            &>span{
              display: inline-block;
              width: 120px;
            }
            .el-form-item{
              display: inline-block;
              .el-form-item__content{
                margin-left: 0 !important;
              }
            }
          }
        }

        footer{
          margin-top: $width;
          text-align: center;
        }
      }
    }
  }

  .progress {
    position: absolute;
    left: -149px;
    top: 0;
    padding: 10px;
    box-sizing: border-box;
    width: 150px;
    height: 100%;
    background: #fff;
    overflow: hidden;
    li {
      height: 142px;
      position: relative;
    }
    li span {
      display: inline-block;
      width: 100px;
      height: 50px;
      position: absolute;
      top: 44px;
      left: 0px;
      background: url(../../../assets/images/gray-bg.png) no-repeat 14px 8px;
      color: #9C9C9C;
      padding: 8px 18px;
      font-size: 12px;
      background-size: 73%;
      color: #000;
    }
    li i {
      content: '';
      display: inline-block;
      width: 40px;
      height: 142px;
      position: absolute;
      top: 0px;
      left: 100px;
      background: url(../../../assets/images/gray-point.png) no-repeat 15px -20px;
    }
    li.active span {
      top: 40px;
      height: 60px;
      color: #fff;
      background: url(../../../assets/images/blue-bg.png) no-repeat 0px 8px;
      font-size: 12px;
      background-size: 85%;
    }
    li.active i {
      background: url(../../../assets/images/blue-point.png) no-repeat 15px -20px;
    }
  }

  .el-dialog__body {
    height: 623px;
    overflow-x: hidden;
  }

  // 弹出框关闭按钮
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
  .active-dialog {
      .el-dialog {
      width: 700px;

      .el-dialog__header {
        border-bottom: 1px solid #E4E9ED;
        padding: 20px;
      }    
      .el-dialog__title {
        font-weight: normal;
      }
      .el-dialog__headerbtn {
        top: -55px;
        right: -55px;
      }
      .dialog-footer {
        text-align: center;
        &>.el-button {
          padding: 10px 28px;
          background: #5295EB;
          border: 1px solid #5295EB;
          &>span {
            color: #fff !important;
          }
          &:hover {
            &>span {
              color: #fff !important;
            }
          }
        }
        .cancel {
          background: #FF6C60 !important;
          border: 1px solid #FF6C60 !important;
        }
      }
      .el-dialog__headerbtn .el-dialog__close {
        border: 2px solid #fff;
        border-radius: 100%;
        font-weight: bold;
        padding: 5px;
        &:hover {
          background: #FF6C60;
          .el-icon-close:before {
            color: #fff;
          }        
        }
      }
      .el-icon-close:before {
        color: #fff;
      }     
      .dialogP {
        height: 50px;
        line-height: 50px;
      }
      .label-span {
        display: inline-block;
        width: 110px;
        text-align: right;
      }
      .levelInput {
        width: 500px;
        margin-left: 10px;
      }
      .small-input {
        width: 193px;
        margin-right: 18px;
        margin-left: 16px;
      }
      .datePicker {
        margin-left: 6px;
        width: 144px;
      }
      .upload-demo {
        width: 500px;
        display: inline-block;
        margin-left: 10px;
        margin-top: -20px;
      }
      textarea {
        border-color: #d8dce5;
        margin-left: 10px;
        resize: none;
      }
      .el-upload-list {
        // width: 300px;
        // margin-left: -20px;
        // margin-top: 20px;
        float: right;
        li {
          overflow-x: auto;
          width: 439px;
        }
      }
      .tiptle {
        color: #ccc;
        font-size: 12px;
        margin-left: 10px;
      }
      .photos {
        width: 500px;
        height: 120px;
        display: inline-block;
        margin-left: 12px;
        border: 1px solid #ccc;
        
        > div {
          height: 100px;
          padding: 10px;

          .el-upload--picture-card {
            display: none;
            height: 100px;
            width: 100px;
            line-height: 100px;
          }

          li {
            height: 100px;
            width: 100px;
            margin: 0;
            overflow: hidden;
          }
          ul {
            width: 480px;
            height: 100px;
            overflow: auto;
          }
        }
      }
    }
  }
}
</style>
