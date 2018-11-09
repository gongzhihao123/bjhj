<template>
  <div class='asset-list'>
    <!-- 头部搜索 -->
    <header>
      <el-input v-model="searchName" :maxlength="20" placeholder="输入名称"></el-input>

      <el-input v-model="searchCode" :maxlength="20" placeholder="输入编号"></el-input>

      <el-select v-model="searchValue" placeholder="请选择类型">
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
      <el-row >
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
              <el-button style="margin: 0 5px;" type="primary" size="small">批量导入</el-button>
            </el-upload>
            <el-button type="primary" size="small" @click="downloadTemplate">下载导入模板</el-button>
          </el-col>
        </el-row>
      <el-table
        ref="multipleTable"
        :data="tableData"
        @selection-change="tableDataSelectionChange"
        tooltip-effect="dark"
        style="width: 100%">
        <!-- <el-table-column
          type="selection"
          label-class-name="head"
          width="55">
        </el-table-column> -->
        <el-table-column
          show-overflow-tooltip
          label="物品编号"
          label-class-name="head"
          width="120">
          <template slot-scope="scope">{{ scope.row.code }}</template>
        </el-table-column>
        <el-table-column
          label="物品名称"
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
          label="物品类型"
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
          label="入库人"
          label-class-name="head"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作"
          label-class-name="head"
          width="380"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="warning" size="small" @click="storageButton(scope.row)">入库</el-button>
            <el-button type="primary" size="small" @click="receiveButton(scope.row)">领用</el-button>
            <el-button type="warning" size="small" @click="scrapButton(scope.row)">报废</el-button>
            <!-- <el-button type="primary" size="small" @click="returnButton(scope.row)">归还</el-button> -->
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
              :page-size="20"
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
            <span> <i style="color: red;"> * </i> 物品名称：</span>
            <el-form-item
              prop="name"
              :rules="[
                { required: true, message: '物品名称不能为空'},
              ]"
            >
              <el-input v-model.trim="contentData.name" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <span>  <i style="color: red;"> * </i> 物品编号：</span>
            <el-form-item
              prop="number"
              :rules="[
                { required: true, message: '物品编号不能为空'},
              ]"
            >
              <el-input :disabled="!addOrEdit" v-model.trim="contentData.number" placeholder="请输入数字或字母" :maxlength="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" class="text-right">
            <span>  <i style="color: red;"> * </i>物品类别：</span>
            <el-form-item
              prop="type"
              :rules="[
                { required: true, message: '物品类别不能为空'},
              ]"
            >
              <el-select :disabled="!addOrEdit" v-model="contentData.type" placeholder="请选择物品类型">
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
            <span> 物品规格：</span>
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
            <span> 物品品牌：</span>
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
            <span> 物品单价：</span>
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
      title="报废"
      :visible.sync="scrapDialogVisible"
      width="650px">

      <el-form v-if="scrapDialogVisible" :model="scrapContentData" ref="scrapContentData" label-width="100px" class="demo-ruleForm">
        <!-- <el-row>
          <el-col :span="24" class="text-right">
            <span> 选择资产：</span>
            <el-form-item
              prop="asset"
              :rules="[
                { required: false, message: ''},
              ]"
            >
              <el-button @click="scrapChooseAsset" class="text-button" type="success" size="small" icon="el-icon-plus"></el-button>
              <ul>
                <li v-for="(item, index) in scrapList" :key="index">
                  <span style="display: inline-block; width: 100px;">
                    {{ item.name }}
                  </span>
                  <i @click="scrapList.splice(index, 1)" class="el-icon-delete" style="color: red; margin: 0 5px; cursor: pointer;"></i>
                  <el-input-number v-model="item.modelCount" :min="0" :max="item.restNum" style="width: 200px"></el-input-number>
                </li>
              </ul>
            </el-form-item>
          </el-col>
        </el-row> -->

        <el-row>
          <el-col :span="24" class="text-right">
            <span> 数量：</span>
            <el-form-item
              prop="number"
              :rules="[
                { required: true, message: '数量不能为空'},
              ]"
            >
              <el-input-number v-model="scrapContentData.number" :min="0" :max="maxNum" style="width: 200px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

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
            <span> 报废原因：</span>
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

      <el-dialog
        width="650px"
        title="物品列表"
        :visible.sync="scrapInnerDialogVisible"
        append-to-body>
        <el-table
          ref="scrap"
          v-if="scrapInnerDialogVisible"
          :data="scrapTableData"
          @selection-change="scrapSelectionChange"
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
          <el-button size="small" type="primary" @click="scrapInnerDialogVisible = false">确定</el-button>
        </span>
      </el-dialog>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="scrapDialogVisible = false">关闭</el-button>
        <el-button size="small" :disabled="canAdd" type="primary" @click="scrapSubmitForm('scrapContentData')">确认</el-button>
      </span>
    </el-dialog>

    <!-- 领用弹出框 -->
    <el-dialog
      title="领用"
      :visible.sync="receiveDialogVisible"
      width="650px">

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
          <el-col :span="24" class="text-right">
            <span> 数量：</span>
            <el-form-item
              prop="number"
              :rules="[
                { required: true, message: '数量不能为空'},
              ]"
            >
              <el-input-number v-model="receiveContentData.number" :min="0" :max="maxNum" style="width: 200px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

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
                <el-option
                  v-for="item in peopleOptions"
                  :key="item.userId"
                  :label="item.name"
                  :value="item.userId">
                </el-option>
                <!-- <el-option-group
                  v-for="group in peopleOptions"
                  :key="group.userId"
                  :label="group.name">
                  <el-option
                    v-for="item in group.children"
                    :key="item.userId"
                    :label="item.name"
                    :value="item.userId">
                  </el-option>
                </el-option-group> -->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="text-right">
            <span> 领用类型：</span>
            <el-form-item
              prop="depts"
              :rules="[
                { required: true, message: '领用类型不能为空'},
              ]"
            >
              <el-radio v-model="radio" label="1" @change="className">个人</el-radio>
              <el-radio v-model="radio" label="2" @change="className">班级</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="classNameFlag">
            <el-col :span="12" class="text-right">
              <span> 领用班级：</span>
              <el-form-item
                prop="deptClass"
                :rules="[
                  { required: true, message: '领用班级不能为空'},
                ]"
              >
                <el-select v-model="value7" placeholder="请选择领用班级">
                  <el-option-group v-for="group in options3" :key="group.label" :label="group.label">
                    <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
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

      <el-dialog
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
      </el-dialog>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="receiveDialogVisible = false">关闭</el-button>
        <el-button size="small" type="primary" @click="receiveSubmitForm('receiveContentData')">确认</el-button>
      </span>
    </el-dialog>

    <!-- 归还弹出框 -->
    <el-dialog
      title="归还"
      :visible.sync="returnDialogVisible"
      width="650px">

      <span slot="title" class="dialog-title">
        <span style="fontSize: 18px;">
          归还
        </span>
        <el-input placeholder="请输入领用人" :maxlength="20" v-model="returnSearchValue" class="input-with-icon">
          <el-button slot="append" icon="el-icon-search" @click="returnSearch"></el-button>
        </el-input>
      </span>

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

      <el-dialog
        width="650px"
        title="您是否确认归还以下物品？"
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
        <el-button size="small" type="primary" @click="returnConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { dateFormatT } from '@/filters/index'
import { notice, success } from '@/utils/index'
// import { TreeMenu } from '@/utils/tree'
import { mapGetters } from 'vuex'
export default {
  name: 'asset-list',
  data () {
    return {
      swit: true,
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
      receiveInnerDialogVisible: false,
      returnTableData: [],
      returnInnerTableData: [],
      returnInnerDialogVisible: false,
      returnDialogVisible: false,
      maxNum: '',
      receiveContentData: {
        number: '',
        scrap: '',
        people: '',
        dept: '',
        depts: 1,
        deptClass: '',
        receiveTime: '',
        count: '',
        note: ''
      },
      radio: '1',
      classNameFlag: false,
      receiveList: [],
      receiveDialogVisible: false,
      scrapContentData: {
        number: 0,
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
      consumId: '',
      scrapList: [],
      receiveUser: [],
      receiveDept: [],
      batchList: [],
      standbyTableData: []
    }
  },
  methods: {
    // 个人/班级切换
    className () {
      this.classNameFlag = !this.classNameFlag
      if (this.classNameFlag) {
        console.log(1)
      } else {
        console.log(2)
      }
    },
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
      window.location.href = `${path}/consum/template`
    },
    // 下载管理
    qrcode (val) {
      const path = document.querySelector('#contextPath').value
      window.open(`${path}/asset/qrcode?consumId=${val.id}`)
    },
    // 归还确认
    returnInnerConfirm () {
      if (this.returnInnerTableData.length === 0) {
        notice('请添加要归还的物品')
        return
      }
      for (let i = 0; i < this.returnInnerTableData.length; i++) {
        if (this.returnInnerTableData[i].modelNum === 0) {
          notice('归还数量为0的物品，请添加数量')
          return
        }
      }
      this.canAdd = true
      this.returnInnerTableData.forEach(async (item) => {
        await this.$store.dispatch('totalOperation', {
          consumId: this.consumId,
          number: item.modelNum,
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
    returnConfirm () {
      this.returnInnerDialogVisible = true
      this.returnInnerTableData = this.returnTableData.filter(item => Number(item.modelNum) !== 0)
    },
    // 领用按钮
    async receiveButton (val) {
      this.receiveDialogVisible = true
      this.maxNum = val.restNum
      this.consumId = val.id
      this.receiveContentData = {
        number: 0,
        scrap: '',
        people: '',
        dept: '',
        receiveTime: '',
        count: '',
        note: ''
      }
      const data = await this.$store.dispatch('assetList', {
        typeId: '',
        name: '',
        code: '',
        userName: '',
        startDate: null,
        endDate: null,
        pageNo: 1,
        pageSize: 5000
      })
      this.receiveTableData = [ ...data.list ].map(item => ({...item, modelCount: 0}))
      this.getUser()
    },
    // 报废按钮
    async scrapButton (val) {
      this.consumId = val.id
      this.scrapDialogVisible = true
      this.canAdd = false
      this.maxNum = val.restNum
      this.scrapContentData = {
        number: 0,
        asset: '',
        scrapTime: '',
        note: ''
      }
      const data = await this.$store.dispatch('assetList', {
        typeId: '',
        name: '',
        code: '',
        userName: '',
        startDate: null,
        endDate: null,
        pageNo: 1,
        pageSize: 5000
      })
      this.scrapTableData = [ ...data.list ].map(item => ({...item, modelCount: 0}))
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
      this.consumId = val.id
      this.returnSearchValue = ''
      this.returnDialogVisible = true
      this.canAdd = false
      let data = await this.$store.dispatch('returnList', { consumId: val.id })
      this.returnTableData = data.map(item => ({...item, modelNum: 0, number: 0 - Number(item.number)}))
      this.standbyTableData = this.returnTableData
    },
    // 入库按钮
    storageButton (val) {
      this.consumId = val.id
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
          let user = this.$store.state.user.loginUser
          let data = []
          data = [{ consumId: this.consumId, number: this.storageContentData.count }]
          await this.$store.dispatch('totalOperation', {
            consumId: data[0].consumId,
            number: data[0].number,
            operation: 1,
            date: dateFormatT(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss'),
            reason: '',
            userId: user.id,
            userName: user.name,
            userDeptName: user.deptName
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
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.receiveContentData.number === 0) {
            notice('领用数量不能为0')
            return
          }
          await this.$store.dispatch('totalOperation', {
            consumId: this.consumId,
            number: this.receiveContentData.number,
            operation: 3,
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
          if (this.maxNum === 0) {
            notice('要报废数量不能为0')
            return
          }
          this.canAdd = true
          await this.$store.dispatch('totalOperation', {
            consumId: this.consumId,
            number: this.scrapContentData.number,
            operation: 2,
            date: dateFormatT(this.scrapContentData.scrapTime.getTime(), 'yyyy-MM-dd hh:mm:ss'),
            reason: this.scrapContentData.note,
            userId: user.id,
            userName: user.name,
            userDeptName: user.deptName
          })
          this.scrapList = []
          this.scrapDialogVisible = false
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
      this.consumId = val.id
      const data = await this.$store.dispatch('assetDetail', { consumId: val.id })
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
    // 跳转详情
    routeDetail (val) {
      sessionStorage.CONSUMID = val.id
      sessionStorage.ASSETNAME = val.name
      const path = document.querySelector('#contextPath').value
      window.open(`${path}/#/assetManager/assetDetail`)
    },
    // 搜索
    async search () {
      await this.getList()
    },
    async del (val) {
      this.$confirm('删除该物品,是否继续?', '提示', {
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
            notice('物品编号应为字母或数字')
            return
          }
          if (this.contentData.price && !(/^[0-9]+([.]{1}[0-9]{1})?$/).test(this.contentData.price)) {
            notice('物品单价应为正整数或包含一位小数')
            return
          }
          this.canAdd = true
          if (!this.addOrEdit) {
            await this.$store.dispatch('assetEdit', {
              consumId: this.consumId,
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
        endDate: this.searchDateValue ? dateFormatT(this.searchDateValue[1].getTime(), 'yyyy-MM-dd hh:mm:ss') : null,
        pageNo: this.pageNo,
        pageSize: 20
      })
      this.tableData = data.list
      this.totalCount = data.totalCount
    },
    // 获取领用人
    async getUser () {
      let data = await this.$store.dispatch('deptUserList')
      this.receiveDept = [...data.depts].map(item => ({...item, userId: item.id}))
      this.receiveUser = [...data.users].map(item => ({...item, parentId: item.deptId}))
      this.peopleOptions = this.receiveUser
    }
  },
  computed: {
    ...mapGetters([
      'watchStorage'
    ])
  },
  mounted () {
    var path = document.getElementById('contextPath').value
    this.action = `${path}/consum/batch`
  },
  watch: {
    watchStorage () {
      console.log(1)
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

}
</style>
