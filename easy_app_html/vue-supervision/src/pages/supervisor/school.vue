<template>
    <div class="school">
        <p>
          学校管理
        </p>

        <main>
          <p>
            <el-row>
              <el-col :span="12">
                <el-button size="small" type="primary" :disabled="updateButton" @click="update">更新学校信息</el-button>
              </el-col>
              <el-col :span="12">
                <el-input v-model="keyword" placeholder="请输入关键字" :maxlength="20" @keyup.enter.native="search">
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
                label="学校"
                align='center'
                show-overflow-tooltip
                label-class-name="head">
              </el-table-column>
              <el-table-column
                prop="sectionName"
                label="学段"
                align='center'
                show-overflow-tooltip
                label-class-name="head">
              </el-table-column>
              <el-table-column
                label="状态"
                align='center'
                show-overflow-tooltip
                label-class-name="head">
                <template slot-scope="scope">
                  {{ scope.row.state === 1 ? '正常' : '不正常' }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align='center'
                show-overflow-tooltip
                label-class-name="head"
                width="180">
                <template slot-scope="scope">
                  <span @click="look(scope.row)" class="look" v-if="scope.row.latitude">查看位置</span>
                  <span @click="edit(scope.row)" class="edit">编辑位置</span>
                </template>
              </el-table-column>
            </el-table>
          </template>

          <el-dialog
            :visible.sync="boxShow"
            :show-close="false"
            width="950px">
            <el-amap-search-box v-if="searchBoxShow" class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
            <el-amap ref="map" vid="amapDemo" :amap-manager="amapManager" :center="center" :zoom="zoom" :events="events" class="amap-demo">
              <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :visible="marker.visible" :vid="index"></el-amap-marker>
            </el-amap>

            <div class="coordinates" v-if="buttonShow" :style="{top: coordinatesTop, left: coordinatesLeft}">
              N:{{ coordinatesX }} E: {{ coordinatesY }}
            </div>
            <div @click="confirm" class="button-group" v-if="buttonShow" :style="{top: buttonTop, left: buttonLeft + 'px'}">
              确定
            </div>
            <div @click="cancle" class="button-group" v-if="buttonShow" :style="{top: buttonTop, left: buttonLeft + 60 + 'px'}">
              取消
            </div>
            <div class="close">
              <span @click="boxShow = false" class="icon el-icon-circle-close"></span>
            </div>
          </el-dialog>

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
import server from '../../utils/axios.js'
import { amapManager } from 'vue-amap'
import { notice, success } from '../../api/index'
export default {
  name: 'school',
  data () {
    return {
      schoolId: '',
      lookOrEdit: false,
      updateButton: false,
      coordinatesX: '',
      coordinatesY: '',
      buttonShow: false,
      coordinatesTop: 0,
      coordinatesLeft: 0,
      buttonTop: 0,
      buttonLeft: 0,
      boxShow: false,
      searchBoxShow: false,
      keyword: '',
      pageSize: 10,
      pageNo: 1,
      totalCount: 0,
      tableData: [],
      amapManager,
      searchOption: {
        city: '北京',
        citylimit: true
      },
      markers: [
        {
          position: [116.62, 40.32],
          visible: false
        }
      ],
      zoom: 12,
      center: [116.62, 40.32],
      events: {
        init: (o) => {},
        'moveend': () => {
          if (this.lookOrEdit) {
            this.buttonShow = false
            this.markers[0].visible = false
          }
        },
        'zoomchange': () => {
        },
        'click': (e) => {
          if (this.lookOrEdit) {
            this.buttonShow = true
            this.buttonTop = e.pixel.y + 'px'
            this.buttonLeft = e.pixel.x
            this.coordinatesTop = e.pixel.y - 60 + 'px'
            this.coordinatesLeft = e.pixel.x - 30 + 'px'
            this.coordinatesX = String(e.lnglat.O).slice(0, 10)
            this.coordinatesY = String(e.lnglat.M).slice(0, 10)
            this.markers[0].position = [e.lnglat.M, e.lnglat.O]
            this.markers[0].visible = true
          }
        }
      }
    }
  },
  methods: {
    onSearchResult (pois) {
      var coordinates = pois[0]
      this.center = [coordinates.lng, coordinates.lat]
    },
    // 取消
    cancle () {
      this.markers[0].visible = false
      this.buttonShow = false
    },
    // 编辑位置确定
    confirm () {
      server.post(`/xxglController/editSchoolLocation`, {
        schoolId: this.schoolId,
        longitude: this.coordinatesY,
        latitude: this.coordinatesX
      })
      .then(res => {
        if (res.data.code === 1) {
          success('设置成功')
          this.getSchoolList()
          this.boxShow = false
        } else {
          notice(res.data.message)
        }
      })
    },
    // 更新学校信息
    update () {
      this.updateButton = true
      server.get(`/xxglController/updateSchool`)
      .then(res => {
        if (res.data.code === 1) {
          this.getSchoolList()
          success('更新学校信息成功')
          this.updateButton = false
        } else {
          notice(res.data.message)
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getSchoolList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getSchoolList()
    },
    // 查看位置
    look (val) {
      this.buttonShow = false
      this.boxShow = !this.boxShow
      this.searchBoxShow = false
      this.lookOrEdit = false
      this.markers[0].position = [val.longitude, val.latitude]
      this.center = [val.longitude, val.latitude]
      this.markers[0].visible = true
    },
    // 编辑位置
    edit (val) {
      this.buttonShow = false
      this.boxShow = !this.boxShow
      this.searchBoxShow = true
      this.schoolId = val.id
      if (val.longitude) {
        this.markers[0].position = [val.longitude, val.latitude]
        this.markers[0].visible = true
      } else {
        this.markers[0].visible = false
      }
      this.lookOrEdit = true
    },
    search () {
      this.getSchoolList()
    },
    // 获取学校列表
    getSchoolList () {
      server.get(`/xxglController/getSchoolPage?pageNo=${this.pageNo}&pageSize=${this.pageSize}&keyword=${this.keyword}`)
      .then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.result.list
          this.totalCount = res.data.result.totalCount
        } else {
          notice(res.data.message)
        }
      })
    }
  },
  created () {
    this.getSchoolList()
  }
}
</script>
<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.school {
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
      .edit {
        color: #409EFF;
        cursor: pointer;
      }
      .look {
        color: #08D775;
        cursor: pointer;
      }
    }

    .el-dialog {
      margin-top: 80px !important;
      margin-bottom: 30px !important;
      height: 85%;
      min-height: 600px;
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 0;
        height: 100%;
        div.button-group,.coordinates {
          border: 1px solid #ddd;
          padding: 0 10px;
          background: #fff;
          position: absolute;
          cursor: pointer;
        }
        .coordinates {
          width: 200px;
        }

         .search-box {
          position: absolute;
          top: 25px;
          left: 20px;
        }

        .close {
          position: absolute;
          top: -25px;
          right: -30px;

          span {
            font-size: 26px;
            color: #FCF9F2;
            cursor: pointer;
          }
        }
      }
      .amap-demo {
        height: 100%;
      }
    }

    .el-pagination {
      margin: 20px;
      text-align: right;
    }
  }
}
</style>

