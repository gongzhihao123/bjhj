<template>
  <div class='asset-list'>
    <!-- 头部搜索 -->
    <header>
      <el-input v-model="searchName" :maxlength="20" placeholder="输入资产名称"></el-input>

      <el-input v-model="searchCode" :maxlength="20" placeholder="输入资产编号"></el-input>

      <el-select v-model="searchValue" placeholder="请选择资产类型">
        <el-option
          v-for="item in searchOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <el-date-picker
        v-model="searchDateValue"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>

      <el-input placeholder="输入入库人" v-model="searchUserName" :maxlength="20"></el-input>

      <el-button size="small" type="success" icon="el-icon-search" @click="search">搜索</el-button>
    </header>

    <!-- 列表主体 -->
    <main>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" size="small" @click="addButton">新增</el-button>
          <!-- <el-button type="primary" size="small" @click="scrapButton">报废</el-button> -->
          <!-- <el-button type="primary" size="small" @click="receiveButton">领用</el-button> -->

          <el-upload
            style="display: inline-block;"
            class="upload-demo"
            :action="action"
            :show-file-list="false"
            :on-success="success"
            :before-upload="beforeUpload">
            <el-button style="margin: 0 5px;" type="primary" size="small">批量导入资产</el-button>
          </el-upload>

          <el-button type="primary" size="small" @click="downloadTemplate">下载导入资产模板</el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <span style="color: #EA644A;">
            资产总数：{{ statisticTotalCount }}
          </span>
        </el-col>
        <el-col :span="6" v-for="(item, index) in statistic" :key="index">
          <span style="color: #38B07A;" v-if="item.state === 1">
            在库资产总数: {{ item.number }}
          </span>
          <span style="color: #F1A325;" v-if="item.state === 2">
            报废资产总数: {{ item.number }}
          </span>
          <span style="color: #03B8CF;" v-if="item.state === 3">
            借出资产总数: {{ item.number }}
          </span>
        </el-col>
        <!-- <el-col :span="6">
          <span style="color: #F1A325;">
            借出资产总数：12302
          </span>
        </el-col>
        <el-col :span="6">
          <span style="color: #33B8D3;">
            报废资产总数：12302
          </span>
        </el-col> -->
      </el-row>

      <el-table
        ref="multipleTable"
        stripe
        :data="tableData"
        @selection-change="tableDataSelectionChange"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          show-overflow-tooltip
          label="编号"
          label-class-name="head"
          width="120">
          <template slot-scope="scope">{{ scope.row.code }}</template>
        </el-table-column>
        <el-table-column
          label="名称"
          show-overflow-tooltip
          label-class-name="head">
          <template slot-scope="scope">
            <span style="cursor: pointer;" @click="routeDetail(scope.row)">
              {{ scope.row.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="typeName"
          label="类型"
          label-class-name="head"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="totalNum"
          label="总数"
          label-class-name="head"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="restNum"
          label="库存"
          label-class-name="head"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="创建人"
          label-class-name="head"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作"
          label-class-name="head"
          width="450"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="warning" size="small" @click="storageButton(scope.row)">入库</el-button>
            <el-button type="danger" size="small" @click="scrapButton(scope.row)">报废</el-button>
            <el-button type="warning" size="small" @click="receiveButton(scope.row)">领用</el-button>
            <el-button type="primary" size="small" @click="returnButton(scope.row)">归还</el-button>
            <el-button type="success" size="small" @click="editButton(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="del(scope.row)">删除</el-button>
            <!-- <el-button type="primary" size="small" @click="qrcode(scope.row)">二维码</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <footer>
        <el-row>
          <el-col :span="24">
            <el-pagination
              v-if="totalCount !== 0"
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
              :current-page.sync="pageNo"
              :page-size="10"
              :total="totalCount">
            </el-pagination>
          </el-col>
        </el-row>
      </footer>
    </main>

    <!-- 入库弹出框 -->
    <el-dialog
      title="入库"
      :visible.sync="storageDialogVisible"
      width="600px">

      <el-form v-if="storageDialogVisible" :model="storageContentData" ref="storageContentData" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col :span="24" class="text-right">
            <span> <i style="color: red;"> * </i> 数量：</span>
            <el-form-item
              prop="count"
              :rules="[
                { required: true, message: '数量不能为空'},
              ]"
            >
              <el-input-number style="width: 200px;" :min="1" v-model.trim="storageContentData.count" :maxlength="20"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="storageDialogVisible = false">关闭</el-button>
        <el-button size="small" :disabled="canAdd" type="primary" @click="storageSubmitForm ('storageContentData')">保存</el-button>
      </span>
    </el-dialog>

    <!-- 新增弹出框 -->
    <el-dialog
      :title="addOrEdit ? '新增' : '编辑'"
      :visible.sync="addDialogVisible"
      width="650px">

      <el-form v-if="addDialogVisible" :model="contentData" ref="contentData" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col :span="12" class="text-right">
            <span> <i style="color: red;"> * </i> 资产名称：</span>
            <el-form-item
              prop="name"
              :rules="[
                { required: true, message: '资产名称不能为空'},
              ]"
            >
              <el-input v-model.trim="contentData.name" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <span>  <i style="color: red;"> * </i> 资产编号：</span>
            <el-form-item
              prop="number"
              :rules="[
                { required: true, message: '资产编号不能为空'},
              ]"
            >
              <el-input v-model.trim="contentData.number" placeholder="请输入数字或字母" :maxlength="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" class="text-right">
            <span>  <i style="color: red;"> * </i> 资产类别：</span>
            <el-form-item
              prop="type"
              :rules="[
                { required: true, message: '资产类别不能为空'},
              ]"
            >
              <el-select v-model="contentData.type" placeholder="请选择资产类型">
                <el-option
                  v-for="item in searchOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <span> 资产规格：</span>
            <el-form-item
              prop="specification"
              :rules="[
                { required: false, message: ''},
              ]"
            >
              <el-input v-model.trim="contentData.specification" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" class="text-right">
            <span> 资产品牌：</span>
            <el-form-item
              prop="brand"
              :rules="[
                { required: false, message: ''},
              ]"
            >
              <el-input v-model.trim="contentData.brand" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <span> 资产单价：</span>
            <el-form-item
              prop="price"
              :rules="[
                { required: false, message: ''},
              ]"
            >
              <el-input v-model.trim="contentData.price" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" class="text-right">
            <span> 供应商：</span>
            <el-form-item
              prop="vendor"
              :rules="[
                { required: false, message: ''},
              ]"
            >
              <el-input v-model.trim="contentData.vendor" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" class="text-right">
            <span> 备注：</span>
            <el-form-item
              prop="note"
              :rules="[
                { required: false, message: ''},
              ]"
            >
              <el-input type="textarea" v-model.trim="contentData.note" :maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="addDialogVisible = false">关闭</el-button>
        <el-button size="small" :disabled="canAdd" type="primary" @click="addSubmitForm ('contentData')">保存</el-button>
      </span>
    </el-dialog>

    <!-- 报废弹出框 -->
    <el-dialog
      title="资产列表"
      class="scrap-out-dialog"
      :visible.sync="scrapDialogVisible"
      width="650px">
      <div>
        <el-table
          :data="scrapTableData"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            prop="code"
            show-overflow-tooltip
            width="240"
            label="编号"
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="createdUserName"
            show-overflow-tooltip
            label="入库人"
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="createdDate"
            show-overflow-tooltip
            label="入库时间"
            label-class-name="head">
              <template slot-scope="scope">
                {{ scope.row.createdDate | dateFormat('yyyy-MM-dd') }}
              </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="操作"
            width="100"
            label-class-name="head">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="scrapInnerButton(scope.row)">报废</el-button>
              </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        v-if="scrapTotalCount !== 0"
        layout="prev, pager, next"
        @current-change="scrapHandleCurrentChange"
        :current-page.sync="scrapPageNo"
        :page-size="10"
        :total="scrapTotalCount">
      </el-pagination>

      <el-dialog
        width="650px"
        title="报废"
        class="scrap-dialog"
        :visible.sync="scrapInnerDialogVisible"
        append-to-body>

        <el-form v-if="scrapInnerDialogVisible" :model="scrapContentData" ref="scrapContentData" label-width="100px" class="demo-ruleForm">

          <el-row>
            <el-col :span="24" class="text-right">
              <span> 报废时间：</span>
              <el-form-item
                prop="scrapTime"
                :rules="[
                  { required: true, message: '报废时间不能为空'},
                ]"
              >
                <el-date-picker
                  style="width: 200px"
                  v-model="scrapContentData.scrapTime"
                  type="datetime"
                  placeholder="选择报废时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24" class="text-right">
              <span> 报废备注：</span>
              <el-form-item
                prop="note"
                :rules="[
                  { required: false, message: ''},
                ]"
              >
                <el-input type="textarea" v-model.trim="scrapContentData.note"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button size="small" :disabled="canAdd" type="primary" @click="scrapSubmitForm('scrapContentData')">确认</el-button>
        </span>
      </el-dialog>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="scrapDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 领用弹出框 -->
    <el-dialog
      title="领用"
      class="receive-dialog"
      :visible.sync="receiveDialogVisible"
      width="650px">

      <div>
        <el-table
          ref="receive"
          :data="receiveTableData"
          @selection-change="receiveSelectionChange"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            type="selection"
            label-class-name="head"
            width="55">
          </el-table-column>
          <el-table-column
            prop="code"
            show-overflow-tooltip
            width="240"
            label="编号"
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="createdUserName"
            show-overflow-tooltip
            label="入库人"
            label-class-name="head">
          </el-table-column>
          <el-table-column
            prop="createdDate"
            show-overflow-tooltip
            label="入库时间"
            label-class-name="head">
              <template slot-scope="scope">
                {{ scope.row.createdDate | dateFormat('yyyy-MM-dd') }}
              </template>
          </el-table-column>
        </el-table>
        <el-button v-if="receiveTableData.length < receiveTotalCount" @click="receiveMore">加载更多</el-button>
      </div>

      <!-- <p v-else>没有更多了</p> -->
      <!-- <el-pagination
        v-if="receiveTotalCount !== 0"
        layout="prev, pager, next"
        @current-change="receiveHandleCurrentChange"
        :current-page.sync="receivePageNo"
        :page-size="10"
        :total="receiveTotalCount">
      </el-pagination> -->

      <el-form v-if="receiveDialogVisible" :model="receiveContentData" ref="receiveContentData" label-width="100px" class="demo-ruleForm">
        <!-- <el-row>
          <el-col :span="24" class="text-right">
            <span> 选择资产：</span>
            <el-form-item
              prop="scrap"
              :rules="[
                { required: false, message: ''},
              ]"
            >
              <el-button @click="receiveChooseAsset" class="text-button" type="success" size="small" icon="el-icon-plus"></el-button>
              <ul>
                <li v-for="(item, index) in receiveList" :key="index">
                  <span style="display: inline-block; width: 100px;">
                    {{ item.name }}
                  </span>
                  <i @click="receiveList.splice(index, 1)" class="el-icon-delete" style="color: red; margin: 0 5px; cursor: pointer;"></i>
                  <el-input-number v-model="item.modelCount" :min="0" :max="item.restNum" style="width: 200px"></el-input-number>
                </li>
              </ul>
            </el-form-item>
          </el-col>
        </el-row> -->

        <el-row>
          <el-col :span="12" class="text-right">
            <span> 领用人：</span>
            <el-form-item
              prop="people"
              :rules="[
                { required: true, message: '领用人不能为空'},
              ]"
            >
              <el-select filterable @change="userChange" v-model="receiveContentData.people" placeholder="请选择领用人">
                <!-- <el-option
                  v-for="item in peopleOptions"
                  :key="item.userId"
                  :label="item.name"
                  :value="item.userId">
                </el-option> -->
                <el-option-group
                  v-for="group in peopleOptions"
                  :key="group.userId"
                  :label="group.name">
                  <el-option
                    v-for="item in group.children"
                    :key="item.userId"
                    :label="item.name"
                    :value="item.userId">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="text-right">
            <span> 领用部门：</span>
            <el-form-item
              prop="dept"
              :rules="[
                { required: true, message: '领用部门不能为空'},
              ]"
            >
            <el-input placeholder="请输入领用部门" disabled v-model="receiveContentData.dept"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" class="text-right">
            <span> 领用时间：</span>
            <el-form-item
              prop="receiveTime"
              :rules="[
                { required: true, message: '领用时间不能为空'},
              ]"
            >
              <el-date-picker
                style="width: 200px"
                v-model="receiveContentData.receiveTime"
                type="datetime"
                placeholder="选择领用时间">
              </el-date-picker>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="24" class="text-right">
            <span> 备注信息：</span>
            <el-form-item
              prop="note"
              :rules="[
                { required: false, message: ''},
              ]"
            >
              <el-input type="textarea" v-model="receiveContentData.note"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- <el-dialog
        width="650px"
        title="列表"
        :visible.sync="receiveInnerDialogVisible"
        append-to-body>
        <el-table
          ref="receive"
          :data="receiveTableData"
          v-if="receiveInnerDialogVisible"
          @selection-change="receiveSelectionChange"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            type="selection"
            label-class-name="head"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name"
            show-overflow-tooltip
            label="名称"
            label-class-name="head">
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="receiveInnerDialogVisible = false">确定</el-button>
        </span>
      </el-dialog> -->

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="receiveDialogVisible = false">关闭</el-button>
        <el-button size="small" type="primary" @click="receiveSubmitForm('receiveContentData')">确认</el-button>
      </span>
    </el-dialog>

    <!-- 归还弹出框 -->
    <el-dialog
      title="归还"
      :visible.sync="returnDialogVisible"
      class="return-dialog"
      width="650px">

      <span slot="title" class="dialog-title">
        <span style="fontSize: 18px;">
          归还
        </span>
        <el-input placeholder="请输入领用人" :maxlength="20" v-model="returnSearchValue" class="input-with-icon">
          <el-button slot="append" icon="el-icon-search" @click="returnSearch"></el-button>
        </el-input>
      </span>

      <div class="table">
        <template>
          <el-table
            :data="returnTableData"
            style="width: 100%">
            <el-table-column
              prop="userName"
              label="领用人">
            </el-table-column>
            <el-table-column
              prop="userDeptName"
              label="领用部门">
            </el-table-column>
            <el-table-column
              prop="code"
              width="260"
              label="编号">
            </el-table-column>
            <el-table-column
              label="操作"
              width="100px">
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="returnConfirm(scope.row)">归还</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>

      <el-pagination
        v-if="returnTotalCount !== 0"
        layout="prev, pager, next"
        @current-change="returnHandleCurrentChange"
        :current-page.sync="returnPageNo"
        :page-size="10"
        :total="returnTotalCount">
      </el-pagination>

      <el-dialog
        width="650px"
        title="您是否确认归还以下资产？"
        :visible.sync="returnInnerDialogVisible"
        append-to-body>
        <template>
          <el-table
            :data="returnInnerTableData"
            style="width: 100%">
            <el-table-column
              prop="userName"
              label="领用人">
            </el-table-column>
            <el-table-column
              prop="userDeptName"
              label="领用部门">
            </el-table-column>
            <el-table-column
              prop="number"
              label="领用数量">
            </el-table-column>
            <el-table-column
              label="归还数量"
              width="180px">
              <template slot-scope="scope">
                <el-input-number :min="0" :max="scope.row.number" v-model="scope.row.modelNum" size="mini"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="returnInnerDialogVisible = false">关闭</el-button>
          <el-button size="small" :disabled="canAdd" type="primary" @click="returnInnerConfirm">确认</el-button>
        </span>
      </el-dialog>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="returnDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { dateFormatT } from '@/filters/index'
import { notice, success } from '@/utils/index'
import { TreeMenu } from '@/utils/tree'
import { mapGetters } from 'vuex'
export default {
  name: 'asset-list',
  data () {
    return {
      // 统计
      statistic: [],
      statisticTotalCount: 0,
      returnSearchValue: '',
      action: '',
      peopleOptions: [],
      receiveTableData: [],
      scrapTableData: [],
      storageDialogVisible: false,
      storageContentData: {
        count: 0
      },
      addOrEdit: true,
      scrapInnerDialogVisible: false,
      canAdd: false,
      pageNo: 1,
      totalCount: 0,
      receivePageNo: 1,
      receiveTotalCount: 0,
      scrapPageNo: 1,
      scrapTotalCount: 0,
      returnPageNo: 1,
      returnTotalCount: 0,
      receiveInnerDialogVisible: false,
      returnTableData: [],
      returnInnerTableData: [],
      returnInnerDialogVisible: false,
      returnDialogVisible: false,
      receiveContentData: {
        scrap: '',
        people: '',
        dept: '',
        receiveTime: '',
        count: '',
        note: ''
      },
      receiveList: [],
      receiveDialogVisible: false,
      scrapContentData: {
        asset: '',
        scrapTime: '',
        note: ''
      },
      scrapDialogVisible: false,
      contentData: {
        name: '',
        number: '',
        type: '',
        specification: '',
        brand: '',
        price: '',
        vendor: '',
        note: ''
      },
      addDialogVisible: false,
      tableData: [],
      searchName: '',
      searchCode: '',
      searchUserName: '',
      searchDateValue: '',
      searchValue: '',
      searchOptions: [],
      assetId: '',
      scrapList: [],
      receiveUser: [],
      receiveDept: [],
      batchList: [],
      standbyTableData: [],
      scrapAssetItemId: ''
    }
  },
  methods: {
    receiveChooseAsset () {
      this.receiveInnerDialogVisible = true
      setTimeout(() => {
        this.receiveList.forEach((item) => {
          this.receiveTableData.forEach((child, index) => {
            if (item.id === child.id) {
              this.$refs.receive.toggleRowSelection(this.receiveTableData[index], true)
            }
          })
        })
      }, 100)
    },
    scrapChooseAsset () {
      this.scrapInnerDialogVisible = true
      setTimeout(() => {
        this.scrapList.forEach((item) => {
          this.scrapTableData.forEach((child, index) => {
            if (item.id === child.id) {
              console.log(index)
              this.$refs.scrap.toggleRowSelection(this.scrapTableData[index], true)
            }
          })
        })
      }, 100)
    },
    returnSearch () {
      this.returnTableData = this.standbyTableData.filter(item => item.userName.indexOf(this.returnSearchValue) !== -1)
    },
    success (res) {
      if (res.code === 1) {
        success('导入成功')
        this.getList()
      } else {
        notice(res.message)
      }
    },
    beforeUpload (file) {
      if (file.name.indexOf('xls') === -1) {
        this.$message.error('请上传指定的excel文件')
        return false
      }
    },
    // 下载批量入库模板
    downloadTemplate () {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/asset/template`
    },
    // 下载管理
    qrcode (val) {
      const path = document.querySelector('#contextPath').value
      window.open(`${path}/asset/qrcode?assetId=${val.id}`)
    },
    // 归还确认
    returnInnerConfirm () {
      if (this.returnInnerTableData.length === 0) {
        notice('请添加要归还的资产')
        return
      }
      for (let i = 0; i < this.returnInnerTableData.length; i++) {
        if (this.returnInnerTableData[i].modelNum === 0) {
          notice('归还数量为0的资产，请添加数量')
          return
        }
      }
      this.canAdd = true
      this.returnInnerTableData.forEach(async (item) => {
        await this.$store.dispatch('totalOperation', {
          assetString: JSON.stringify([{ assetId: this.assetId, number: item.modelNum }]),
          operation: 4,
          date: dateFormatT(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss'),
          reason: '',
          userId: item.userId,
          userName: item.userName,
          userDeptName: item.userDeptName
        })
      })
      this.returnInnerDialogVisible = false
      this.returnDialogVisible = false
      this.canAdd = false
      setTimeout(async () => {
        await this.getList()
      }, 400)
    },
    // 归还确定
    returnConfirm (val) {
      this.$confirm('归还该资产,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('back', {
          assetId: this.assetId,
          assetItemId: val.id
        })
        let data = await this.$store.dispatch('backList', {
          assetId: this.assetId,
          pageNo: this.returnPageNo,
          pageSize: 10
        })
        this.returnTableData = data.list.map(item => ({...item, modelNum: 0, number: 0 - Number(item.number)}))
        this.returnTotalCount = data.totalCount
        this.standbyTableData = this.returnTableData
        await this.getList()
      })
    },
    // 领用按钮
    async receiveButton (val) {
      this.receiveDialogVisible = true
      this.receiveTableData = []
      this.receiveContentData = {
        scrap: '',
        people: '',
        dept: '',
        receiveTime: '',
        count: '',
        note: ''
      }
      this.assetId = val.id
      const data = await this.$store.dispatch('returnList', {
        assetId: this.assetId,
        pageNo: 1,
        pageSize: 10
      })
      this.receivePageNo = 1
      this.receiveTotalCount = data.totalCount
      this.receiveTableData = data.list
      this.getUser()
    },
    // 报废按钮
    async scrapButton (val) {
      this.scrapDialogVisible = true
      this.canAdd = false
      this.scrapContentData = {
        asset: '',
        scrapTime: '',
        note: ''
      }
      this.assetId = val.id
      const data = await this.$store.dispatch('returnList', {
        assetId: this.assetId,
        pageNo: this.scrapPageNo,
        pageSize: 10
      })
      this.scrapTotalCount = data.totalCount
      this.scrapTableData = data.list
    },
    // 弹框中的报废按钮
    scrapInnerButton (val) {
      this.scrapInnerDialogVisible = true
      this.scrapAssetItemId = val.id
      this.scrapContentData.scrapTime = ''
      this.scrapContentData.note = ''
      this.canAdd = false
    },
    tableDataSelectionChange (val) {
      this.scrapList = [ ...val ].map(item => ({...item, modelCount: 0}))
      this.receiveList = [ ...val ].map(item => ({...item, modelCount: 0}))
      this.batchList = [ ...val ]
    },
    receiveSelectionChange (val) {
      this.receiveList = val
    },
    // 报废
    scrapSelectionChange (val) {
      this.scrapList = val
    },
    // 归还按钮
    async returnButton (val) {
      this.assetId = val.id
      this.returnSearchValue = ''
      this.returnDialogVisible = true
      this.canAdd = false
      let data = await this.$store.dispatch('backList', {
        assetId: val.id,
        pageNo: this.returnPageNo,
        pageSize: 10
      })
      this.returnTableData = data.list.map(item => ({...item, modelNum: 0, number: 0 - Number(item.number)}))
      this.returnTotalCount = data.totalCount
      this.standbyTableData = this.returnTableData
    },
    // 入库按钮
    storageButton (val) {
      this.assetId = val.id
      this.canAdd = false
      this.storageDialogVisible = true
      this.storageContentData.count = 1
    },
    // 入库确定
    storageSubmitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (this.storageContentData.count === 0) {
          notice('请输入入库数量')
          return
        }
        if (valid) {
          this.canAdd = true
          await this.$store.dispatch('putIn', {
            assetId: this.assetId,
            number: this.storageContentData.count
          })
          this.storageDialogVisible = false
          this.canAdd = false
          await this.getList()
        } else {
          return false
        }
      })
    },
    // 领用人
    userChange (val) {
      let data = this.receiveUser.filter(item => item.userId === val)[0].deptId
      this.receiveContentData.dept = this.receiveDept.filter(item => item.id === data)[0].name
    },
    // 领用确认
    receiveSubmitForm (formName) {
      if (this.receiveList.length === 0) {
        notice('请选择要领用的资产')
        return
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch('borrow', {
            assetId: this.assetId,
            assetItemIds: this.receiveList.map(item => item.id).join(','),
            date: dateFormatT(this.receiveContentData.receiveTime.getTime(), 'yyyy-MM-dd hh:mm:ss'),
            reason: this.receiveContentData.note,
            userId: this.receiveContentData.people,
            userName: this.receiveUser.filter(item => item.userId === this.receiveContentData.people)[0].name,
            userDeptName: this.receiveContentData.dept
          })
          this.receiveDialogVisible = false
          this.receiveList = []
          await this.getList()
        } else {
          return false
        }
      })
    },
    // 报废确认
    scrapSubmitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let user = this.$store.state.user.loginUser
          this.canAdd = true
          await this.$store.dispatch('putOut', {
            assetId: this.assetId,
            assetItemId: this.scrapAssetItemId,
            date: dateFormatT(this.scrapContentData.scrapTime.getTime(), 'yyyy-MM-dd hh:mm:ss'),
            reason: this.scrapContentData.note,
            userId: user.id,
            userName: user.name,
            userDeptName: user.deptName
          })
          const data = await this.$store.dispatch('returnList', {
            assetId: this.assetId,
            pageNo: this.scrapPageNo,
            pageSize: 10
          })
          this.scrapTotalCount = data.totalCount
          this.scrapTableData = data.list
          this.scrapInnerDialogVisible = false
          this.canAdd = false
          await this.getList()
        } else {
          return false
        }
      })
    },
    // 新增按钮
    addButton () {
      this.addOrEdit = true
      this.contentData = {
        name: '',
        number: '',
        type: '',
        specification: '',
        brand: '',
        price: '',
        vendor: '',
        note: ''
      }
      this.addDialogVisible = true
      this.canAdd = false
    },
    // 编辑按钮
    async editButton (val) {
      this.addOrEdit = false
      this.assetId = val.id
      const data = await this.$store.dispatch('assetDetail', { assetId: val.id })
      this.contentData = {
        name: data.name,
        number: data.code,
        type: data.typeId,
        specification: data.spec,
        brand: data.brand,
        price: data.price,
        vendor: data.supplier,
        note: data.remark
      }
      this.addDialogVisible = true
      this.canAdd = false
    },
    // 分页
    handleCurrentChange (val) {
      this.pageNo = val
      this.getList()
    },
    // 领用加载更多
    receiveMore () {
      this.receivePageNo++
      this.receiveHandleCurrentChange()
    },
    // 领用分页
    async receiveHandleCurrentChange (val) {
      const data = await this.$store.dispatch('returnList', {
        assetId: this.assetId,
        pageNo: this.receivePageNo,
        pageSize: 10
      })
      this.receiveTotalCount = data.totalCount
      data.list.forEach((item) => {
        this.receiveTableData.push(item)
      })
    },
    // 报废分页
    async scrapHandleCurrentChange (val) {
      this.scrapPageNo = val
      const data = await this.$store.dispatch('returnList', {
        assetId: this.assetId,
        pageNo: this.scrapPageNo,
        pageSize: 10
      })
      this.scrapTotalCount = data.totalCount
      this.scrapTableData = data.list
    },
    // 归还分页
    async returnHandleCurrentChange (val) {
      this.returnPageNo = val
      const data = await this.$store.dispatch('backList', {
        assetId: this.assetId,
        pageNo: this.returnPageNo,
        pageSize: 10
      })
      this.returnTotalCount = data.totalCount
      this.returnTableData = data.list
    },
    // 跳转详情
    routeDetail (val) {
      sessionStorage.ASSETID = val.id
      sessionStorage.ASSETNAME = val.name
      const path = document.querySelector('#contextPath').value
      window.open(`${path}/#/assetManager/assetDetail`)
    },
    // 搜索
    async search () {
      await this.getList()
    },
    async del (val) {
      this.$confirm('删除该资产,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('assetDel', val)
        await this.getList()
      })
    },
    // 新增确认
    addSubmitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (!(/^[0-9a-zA-Z]+$/).test(this.contentData.number)) {
            notice('资产编号应为字母或数字')
            return
          }
          if (this.contentData.price && !(/^[0-9]+([.]{1}[0-9]{1})?$/).test(this.contentData.price)) {
            notice('资产单价应为正整数或包含一位小数')
            return
          }
          this.canAdd = true
          if (!this.addOrEdit) {
            await this.$store.dispatch('assetEdit', {
              assetId: this.assetId,
              typeId: this.contentData.type,
              name: this.contentData.name,
              code: this.contentData.number,
              spec: this.contentData.specification,
              brand: this.contentData.brand,
              price: this.contentData.price,
              supplier: this.contentData.vendor,
              remark: this.contentData.note
            })
          } else {
            await this.$store.dispatch('assetAdd', {
              typeId: this.contentData.type,
              name: this.contentData.name,
              code: this.contentData.number,
              spec: this.contentData.specification,
              brand: this.contentData.brand,
              price: this.contentData.price,
              supplier: this.contentData.vendor,
              remark: this.contentData.note
            })
          }
          this.addDialogVisible = false
          await this.getList()
        } else {
          return false
        }
      })
    },
    // 获取资产类型列表
    async getTypeList () {
      this.searchOptions = await this.$store.dispatch('assetType')
      // this.searchOptions.unshift({ name: '全部', id: '' })
    },
    // 获取资产列表
    async getList () {
      const data = await this.$store.dispatch('assetList', {
        typeId: this.searchValue,
        name: this.searchName,
        code: this.searchCode,
        userName: this.searchUserName,
        startDate: this.searchDateValue ? dateFormatT(this.searchDateValue[0].getTime(), 'yyyy-MM-dd hh:mm:ss') : null,
        endDate: this.searchDateValue ? dateFormatT(this.searchDateValue[1].getTime(), 'yyyy-MM-dd') + ' 23:59:59' : null,
        pageNo: this.pageNo,
        pageSize: 10
      })
      this.tableData = data.page.list
      this.totalCount = data.page.totalCount
      this.statistic = data.statistic
      this.statisticTotalCount = 0
      data.statistic.forEach(item => {
        this.statisticTotalCount += item.number
      })
    },
    // 获取领用人
    async getUser () {
      let data = await this.$store.dispatch('getUser')
      this.receiveDept = [...data.depts].map(item => ({...item, userId: item.id}))
      this.receiveUser = [...data.users].map(item => ({...item, parentId: item.deptId}))
      this.peopleOptions = new TreeMenu(this.receiveDept.concat(this.receiveUser)).init(0)[0].children
    }
  },
  computed: {
    ...mapGetters([
      'watchStorage'
    ])
  },
  mounted () {
    var path = document.getElementById('contextPath').value
    this.action = `${path}/asset/batch`
  },
  watch: {
    watchStorage () {
    }
  },
  async created () {
    await this.getTypeList()
    await this.getList()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.asset-list {
  header {
    .el-input {
      width: 150px;
    }
  }

  main {
    margin-top: 20px;
    padding: 20px;
    background: #fff;

    .el-row:nth-child(2) {
      margin: 20px 0;
      font-size: 18px;
    }

    .el-table {
      th {
        &:nth-child(8){
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }

  .el-dialog {
    .el-dialog__body {
      .el-form{
        .el-row{
          .el-col{
            &>span{
              display: inline-block;
              width: 90px;
              text-align: left;
              vertical-align: top;
            }
            .el-form-item{
              width: 65%;
              display: inline-block;
              .el-form-item__content{
                margin-left: 0 !important;
              }
            }

            .el-input {
              width: 200px;
            }
            .el-textarea {
              width: 470px;
            }
          }
        }
      }
      ul {
        max-height: 150px;
        overflow-x: hidden;
      }
    }

    .input-with-icon {
      width: 250px;
      margin-left: 20px;
      .el-input__inner {
        height: 30px;
      }
    }
  }
  .return-dialog {
    .el-dialog__body {
      &>.table {
        height: 650px;
        overflow-x: hidden;
      }
    }
  }
  .receive-dialog {
    .el-dialog__body {
      padding-top: 10px;
      &>div:nth-child(1) {
        max-height: 400px;
        overflow-x: hidden;
        margin-bottom: 20px;
      }
      .el-button {
        margin: 15px;
        margin-left: 240px;
        padding: 10px 50px;
      }
      .el-pagination {
        margin-bottom: 20px;
      }
    }
  }

}
.scrap-out-dialog {
  .el-dialog__body{
    &>div:nth-child(1) {
      height: 650px;
      overflow-x: hidden;
    }
  }
}
.scrap-dialog {
  .el-form-item {
    display: inline-block;
    vertical-align: top;
    width: 500px;
    .el-form-item__content {
      margin-left: 10px !important;
    }
  }
}
</style>
