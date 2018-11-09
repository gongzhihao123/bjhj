<template>
  <div id="metericalview">
    <div class="head">
        <span>备课管理>教材及编目设置</span>
        <router-link to="/set/lessonset">
        <i class="back"></i>
        返回上一层</router-link>
    </div>   
    <!--分类-->
      <div class="type" v-loading="cardloading">

        <div class="term">
          <span>学期：</span>
          <el-select v-model="valuecontent" placeholder="请选择" @change="clearSearch">
            <el-option
              v-for="item in options"
              :key="item.semesterId"
              :label="item.semesterName"
              :value="item.semesterId">
            </el-option>
          </el-select>
        </div>
        <div class="peroid">
          <span>学段：</span>
          <span v-for="(item, i) in peroid" :key="i" :class="{'nav-list-span': true, 'active': peroidInd === i}" @click="peroidClick(item, i)">{{item.name}}</span>
        </div>
        <transition name="list" class="tag-list" tag="span">        
        <div class="grade" v-if="grade.length">
          <span>年级：</span>
          <div class="grade-box">
              <span v-for="(item, i) in grade" :key="i" :class="{'nav-list-span': true, 'active': gradeInd === i}" @click="gradeClick(item, i)">{{item.name}}</span>              
          </div>
        </div>
        </transition>
        <transition name="list" class="tag-list" tag="span">        
        <div class="subject" v-if="subject.length">
          <span>学科：</span>
          <div class="sub-box">
            <span v-for="(item, i) in subject" :key="i" :class="{'nav-list-span': true, 'active': subjectInd === i}" @click="subjectClick(item, i)">{{item.curriculumName}}</span>            
          </div>
        </div>
        </transition>  
    </div>
     <div class="courseplan">
          <el-tabs v-model="activeName" type="card">
              <div class="buttons" v-if="cate && tableDataa.length > 0">
                <el-button @click="importMeterical = true" v-if="data2[0].children">导入</el-button>
                <el-upload
                  v-if="!data2[0].children"
                  class="upload"
                  ref="upload"
                  :action="actionimport"
                  :on-exceed="handleExceed"
                  name="uploadFile"
                  :show-file-list="false"
                  :on-success="successimport"
                  :on-preview="handlePreview">
                  <el-button>
                    导入
                </el-button>
              </el-upload>
                <el-button @click.native="exportbook(tableDataa[activeName].id)" v-if="tableDataa.length !== 0">导出</el-button>
                <el-button @click.native="download">下载模板</el-button>
              </div> 
              <p class="tip" v-if="cate && tableDataa.length > 0">（导入的目录文件格式只能是xlsx/xls）</p>           
              <el-tab-pane v-for="(item, index) in tableDataa" :key="index" :label="item.name" :value="index" v-loading="treeloading">
                <el-tree
                :data="data2"
                :props="defaultProps"
                default-expand-all
                node-key="id"
                :expand-on-click-node="false"
                :render-content="renderContent"
                v-if="listlength !== 0 || catalog === true">
                </el-tree>
                <el-button @click="createInfo" v-if="listlength === 0 && catalog === false" class="createnew" >创建教材编目</el-button>
            </el-tab-pane> 
        </el-tabs>
        <div class="button-group">
            <el-button @click.native="addMeterial">添加教材</el-button>
        </div>
     </div>

     <el-dialog
        title="教材管理"
        :visible.sync="dialogVisible"
        size="tiny"
        :close-on-click-modal="false">
        <el-button @click.native="add">新增</el-button>
        <el-table
            :data="tableDataa"
            border
            style="width: 100%"
            v-loading="loading">
            <el-table-column
            label="名称"
            width="100">
            <template scope="scope">
                <el-input v-if="scope.row.edit" v-model="scope.row.name"  placeholder="新添加教材名称" :maxlength="100" class="me-input"></el-input>
                <span v-show="!scope.row.edit" @click="rename(scope.$index, scope.row)">{{scope.row.name}}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="操作"
            width="100">
              <template scope="scope">
                <span @click="handleDelete(scope.$index, scope.row)" v-show="!scope.row.edit"><i></i>删除</span>
                <span @click="rename(scope.$index, scope.row)" v-show="!scope.row.edit"><i></i>重命名</span>
                <span @click="cancel(scope.$index, scope.row)" v-show="scope.row.edit"><i></i>取消</span>
                <span @click="save(scope.row)" v-show="scope.row.edit"><i></i>保存</span>
              </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showtabs()">完 成</el-button>
        </span>
    </el-dialog>

    <!-- 导入 -->
    <el-dialog
    class="importBox"
      title="提示"
      :visible.sync="importMeterical"
      width="30%">
      <span>请确认是否删除已存在的教材目录</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importMeterical = false" class="cancel">取 消</el-button>
        <el-upload
          class="upload"
          ref="upload"
          :action="actionimport"
          :on-exceed="handleExceed"
          name="uploadFile"
          :show-file-list="false"
          :on-success="successimport"
          :on-preview="handlePreview">
          <el-button v-if="tableDataa.length !== 0" @click="importMeterical = false">
            确定
          </el-button>
        </el-upload>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import querystring from 'querystring'
import { TreeMenu } from '../../../api/tree'
import { error, notice, success } from '../../../api/index.js'
export default {
  name: 'metericalview',
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  data () {
    return {
      importMeterical: false,
      cate: false,
      activeInd: 0,
      peroidInd: 0,
      valuecontent: '',
      gradeInd: 0,
      subjectInd: 0,
      searchCount: 0,
      weeks: 5,
      times: 3,
      activeName: 0,
      textbookId: '',
      bookId: '',
      indexnum: 0,
      treeloading: false,
      showtab: false,
      dialogVisible: false,
      loading: false,
      n: 1,
      m: 1,
      sectionId: '',
      gradeId: '',
      courseId: '',
      rewname: '',
      semesterName: '',
      sectionName: '',
      gradeName: '',
      subjectName: '',
      navInfo: [],
      flag: false,
      addFlag: true,
      edit: false,
      catalog: false,
      listlength: '',
      node: false,
      peroid: [],
      grade: [],
      subject: [],
      nullflag: false,
      names: [],
      options: [
        {semesterId: ''}
      ],
      value: '',
      tableDataa: [],
      // tableMeterical: [],
      data2: [{
        id: 1,
        name: '课本目录',
        parentId: 0,
        stata: false,
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      childId: '',
      dis: false
    }
  },
  methods: {
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handlePreview (file) {
      return new Promise((resolve, reject) => {
        let arr = file.name.split('.')
        if (arr[arr.length - 1] === 'xlsx' || arr[arr.length - 1] === 'xls') {
          resolve()
        } else {
          notice(this, '请上传正确格式文件', 2000)
          reject(arr)
        }
      })
    },
    successimport (res) {
      if (res.code === 1) {
        success(this, '导入成功', 2000)
        this.showList()
      } else {
        notice(this, res.message, 2000)
      }
    },
    add () {
      this.treeloading = false
      // this.loading = true
      this.rewname = ''
      setTimeout(() => {
        const obj = {name: '', edit: true}
        this.tableDataa.push(obj)
      }, 200)
      if (this.tableDataa.length === 0) {
        this.data2 = []
      }
      this.loading = false
    },
    exportbook (id) {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/lessonSet/exportExcel?textbookId=${id}`
    },
    download () {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/lessonSet/downloadExcel`
    },
    addMeterial () {
      if (!this.sectionId || !this.valuecontent || !this.courseId || !this.gradeId) {
        success(this, '请选择设置要添加教材的学期、学段、年级、学科', 3000)
        return
      }
      this.dialogVisible = true
      this.catalog = false
      this.getBookList()
    },
    handleDelete (index, row) {
      this.$https.post(`/lessonSet/bookDelete`, querystring.stringify({bookId: row.id}))
      .then(res => {
        if (res.data.code === 1) {
          success(this, res.data.message, 3000)
          this.getBookList()
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    rename (index, row) {
      row.edit = true
      if (row.name === '') {
        this.rewname = ''
      } else {
        this.rewname = row.name
      }
    },
    cancel (index, row) {
      if (!row.id) {
        this.loading = true
        setTimeout(() => {
          this.tableDataa.pop()
          this.loading = false
        }, 300)
      }
      if (this.rewname === '') {
        row.name = ''
      } else {
        row.name = this.rewname
      }
      row.edit = false
    },
    save (row) {
      row.edit = false
      this.options.forEach((item, index) => {
        if (item.semesterId === this.valuecontent) {
          this.semesterName = item.semesterName
        }
      })
      if (!row.name) {
        row.edit = true
        notice(this, '名称不能为空', 2000)
        return
      } else {
        row.edit = true
        let names = [...this.tableDataa]
        for (let i = 0; i < this.tableDataa.length; i++) {
          if (this.tableDataa[i].name === row.name) {
            names.splice(i, 1)
          }
        }
        for (let j = 0; j < names.length; j++) {
          if (names[j].name === row.name) {
            notice(this, '该教材名称已经存在！', 2000)
            return
          }
        }
      }
      if (!row.id) {
        this.$https.post(`/lessonSet/bookAdd`, querystring.stringify({semesterId: this.valuecontent, semesterName: this.semesterName, sectionId: this.sectionId, sectionName: this.sectionName, gradeId: this.gradeId, gradeName: this.gradeName, subjectId: this.courseId, subjectName: this.subjectName, name: row.name, id: row.id}))
        .then(res => {
          if (res.data.code === 1) {
            success(this, res.data.message, 3000)
            this.getBookList()
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
        })
        .catch(res => {
          notice(this, res.message, 2000)
        })
      } else {
        this.$https.post(`/lessonSet/bookUpdate`, querystring.stringify({semesterId: this.valuecontent, semesterName: this.semesterName, sectionId: this.sectionId, sectionName: this.sectionName, gradeId: this.gradeId, gradeName: this.gradeName, subjectId: this.courseId, subjectName: this.subjectName, name: row.name, id: row.id}))
        .then(res => {
          if (res.data.code === 1) {
            success(this, res.data.message, 3000)
            this.getBookList()
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
        })
        .catch(res => {
          notice(this, res.message, 2000)
        })
      }
    },
    createInfo () {
      this.catalog = true
      this.cate = true
    },
    showtabs () {
      if (!this.tableDataa) {
        notice(this, '您还没有添加教材！', 2000)
        return
      }
      for (var i = 0; i < this.tableDataa.length; i++) {
        if (!this.tableDataa[i].name) {
          notice(this, '教材名称不能为空！', 3000)
          return
        }
        if (this.tableDataa[i].edit) {
          notice(this, '请保存教材名称！', 3000)
          return
        }
      }
      this.dialogVisible = false
      this.getBookList()
      this.showList()
    },
    showList () {
      if (this.tableDataa.length === 0) {
        return
      }
      if (!this.tableDataa[this.activeName]) {
        this.data2 = []
        this.cate = false
        return
      }
      if (!this.tableDataa[this.activeName].id && !this.tableDataa[this.activeName]) {
        return
      } else {
        setTimeout(() => {
          this.$https.get(`/lessonSet/bookCatalogList?textbookId=${this.tableDataa[this.activeName].id}`)
          .then(res => {
            this.data2 = [{id: 1, name: '课本目录', parentId: 0, children: []}]
            if (res.data.code === 1) {
              this.data2 = this.data2.concat(res.data.result)
              this.data2 = this.data2.map(item => ({...item, stata: false}))
              this.data2 = this.data2.filter(item => item.name)
              this.data2 = new TreeMenu(this.data2).init(0)
              if (this.data2 && this.data2[0].children.length > 0) {
                this.cate = true
              } else {
                this.cate = false
              }
              this.listlength = this.data2[0].children.length
              this.dis = false
            } else if (res.data.code === -2) {
              error(this)
            } else {
              notice(this, res.data.message, 3000)
            }
            this.treeloading = false
          })
          .catch(res => {
            notice(this, res.message, 2000)
          })
        }, 500)
      }
    },
    append (store, data, node) {
      if (this.dis) {
        return
      }
      if (node && node.parent && node.parent.parent && node.parent.parent.parent && node.parent.parent.parent.parent && !node.parent.parent.parent.parent.parent) {
        notice(this, '课本目录只能创建到三层', 2000)
        return
      }
      this.$https.post(`/lessonSet/bookCatalogAdd`, querystring.stringify({textbookId: this.tableDataa[this.activeName].id, name: '', parentId: data.id}))
      .then(res => {
        if (res.data.code === 1) {
          this.childId = res.data.result
          store.append({ id: this.childId, label: '', children: [], stata: true }, data)
          setTimeout(() => {
            document.getElementsByClassName(this.childId)[0].focus()
          }, 300)
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    remove (store, data) {
      console.log(store)
      this.$confirm('此操作将删除该目录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dis = false
        this.$https.post(`/lessonSet/bookCatalogDelete`, querystring.stringify({id: data.id}))
        .then(res => {
          if (res.data.code === 1) {
            this.showList()
            this.$notify.info({
              title: '消息',
              message: res.data.message
            })
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
        }).catch(res => {
          notice(this, res.message, 2000)
        })
      }).catch(() => {
        notice(this, '取消删除', 2000)
      })
    },
    editw (store, data, ele) {
      setTimeout(() => {
        for (let i = 0; i < document.getElementsByClassName(ele).length; i++) {
          document.getElementsByClassName(ele)[i].focus()
        }
      }, 300)
      data.stata = true
    },
    addnext (store, data, node) {
      if (this.dis) {
        return
      }
      const parent = node.parent
      this.$https.post(`/lessonSet/bookCatalogAdd`, querystring.stringify({textbookId: this.tableDataa[this.activeName].id, name: '', parentId: parent.data.id}))
      .then(res => {
        if (res.data.code === 1) {
          this.childId = res.data.result
          parent.store.append({ id: this.childId, label: '', children: [], stata: true }, parent.data)
          setTimeout(() => {
            document.getElementsByClassName(this.childId)[0].focus()
          }, 300)
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
    },
    blur (store, data, node) {
      data.stata = false
      if (!data.name) {
        notice(this, '教材编目名称不能为空！', 3000)
        this.addFlag = false
        data.stata = true
        this.dis = true
        return
      }
      this.dis = false
      this.$https.post(`/lessonSet/bookCatalogUpdate`, querystring.stringify({textbookId: this.tableDataa[this.activeName].id, name: data.name, id: data.id}))
      .then(res => {
        if (res.data.code === 1) {
          success(this, '编辑成功', 3000)
          this.showList()
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    renderContent (h, { node, data, store }) {
      return (
         <span>
            <span>
              <span class="node">
                { data.stata
                  ? <input
                      on-blur = { () => this.blur(store, data, node) }
                      on-input = {e => {
                        data.name = e.target.value
                      }}
                      value = {data.name}
                      placeholder="请输入教材编目名称"
                      maxlength="100"
                      class={`${data.id}`}/>
                  : node.label}
              </span>
            </span>
            <span style="margin-left: 10px">
            {data.parentId === 0 ? <i on-click={ () => this.append(store, data) } class="append"></i>
            : <span>
              <i on-click={ () => this.append(store, data, node) } class="append"></i>
              <i on-click={ () => this.editw(store, data, data.id) } class="edit"></i>
              <i on-click={ () => this.remove(store, data) } class="del"></i>
              <i on-click={ () => this.addnext(store, data, node) } class="addnext"></i>
            </span>
            }
            </span>
          </span>)
    },
    clearSearch () {
      this.searchCount = 0
      this.navInfo = []
      this.peroidInd = 0
      this.gradeInd = 0
      this.subjectInd = 0
      this.sectionId = ''
      this.semesterId = ''
      this.courseId = ''
      this.gradeId = ''
      this.sectionName = ''
      this.semesterName = ''
      this.gradeName = ''
      this.subjectName = ''
      this.showtab = false
      this.getBookList()
      this.tableDataa = []
      this.data2 = []
      this.cate = false
    },
    link (item, index) {
      this.activeInd = index
      localStorage.activeInd = this.activeInd
      this.type = this.activeInd + 1
      this.clearSearch()
    },
    peroidClick (item, i) {
      if (this.peroidInd === i) {
        this.peroidInd = i
        this.navInfo[0] = ''
        this.searchCount = 0
        this.clearSearch()
      } else {
        this.peroidInd = i
        this.navInfo[0] = item.name
        this.sectionId = item.id
        this.sectionName = item.name
        this.searchCount = 1
        this.gradeId = ''
        this.navInfo[1] = ''
        this.navInfo[2] = ''
        this.gradeInd = -1
        this.subjectInd = -1
        this.showtab = false
        this.tableDataa = []
        this.data2 = []
        this.getSelectGradeClassList()
      }
    },
    gradeClick (item, i) {
      if (this.gradeInd === i) {
        this.gradeInd = i
        this.navInfo[1] = ''
        this.searchCount--
        this.gradeId = ''
      } else {
        this.gradeInd = i
        this.gradeId = item.id
        this.subjectInd = -1
        this.gradeName = item.name
        this.navInfo[1] = item.name
        this.navInfo[2] = ''
        this.searchCount++
        this.showtab = false
        this.tableDataa = []
        this.data2 = []
        this.getSelectCourseList()
      }
    },
    subjectClick (item, i) {
      this.activeName = String(0)
      this.treeloading = true
      this.catalog = false
      if (this.subjectInd === i) {
        this.subjectInd = i
        this.navInfo[2] = ''
        this.searchCount--
        this.courseId = ''
      } else {
        this.subjectInd = i
        this.showtab = false
        this.navInfo[2] = item.curriculumName
        this.courseId = item.id
        this.subjectName = item.curriculumName
        this.searchCount++
        this.getBookList()
        setTimeout(() => {
          this.showtabs()
        }, 1000)
      }
    },
    getSelectSemesterList () {
      // 获取学期信息列表
      this.cardloading = true
      setTimeout(() => {
        this.$https.get(`/common/selectSemesterList`)
        .then(res => {
          if (res.data.code === 1) {
            this.options = res.data.result
            if (this.options.length !== 0) {
              this.valuecontent = this.options.filter(item => item.state === 1)[0].semesterId
            }
            this.getSectionList()
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
          this.cardloading = false
        })
        this.cardloading = false
      }, 0)
    },
    getSectionList () {
      // 获取学段
      this.$https.get(`/common/sectionList`)
      .then(res => {
        if (res.data.code === 1) {
          this.peroid = res.data.result
          this.peroid[this.peroidInd] ? this.sectionId = this.peroid[this.peroidInd].id : this.sectionId = ''
          this.getSelectGradeClassList()
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
    },
    getSelectGradeClassList () {
      // 获取年级
      this.$https.get(`/common/selectGradeClassList?sectionId=${this.sectionId}&semesterId=${this.valuecontent}`)
      .then(res => {
        if (res.data.code === 1) {
          this.grade = res.data.result
          this.grade[this.gradeInd] ? this.gradeId = this.grade[this.gradeInd].id : this.gradeId = ''
          this.getSelectCourseList()
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.data.message, 2000)
      })
    },
    getSelectCourseList () {
      // 获取学科信息列表
      this.$https.get(`/common/selectCourseList?sectionId=${this.sectionId}&semesterId=${this.valuecontent}&gradeId=${this.gradeId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.subject = res.data.result
          this.subject[this.subjectInd] ? this.courseId = this.subject[this.subjectInd].id : this.courseId = ''
          this.getBookList()
          setTimeout(() => {
            this.showtabs()
          }, 1000)
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 3000)
        }
      })
      .catch(res => {
        notice(this, res.message, 2000)
      })
    },
    getBookList () {
      // 获取教材列表
      this.loading = true
      if (!this.sectionId || !this.valuecontent || !this.courseId || !this.gradeId) {
        return
      }
      setTimeout(() => {
        this.$https.get(`/lessonSet/bookList?sectionId=${this.sectionId}&semesterId=${this.valuecontent}&gradeId=${this.gradeId}&subjectId=${this.courseId}`)
        .then(res => {
          if (res.data.code === 1) {
            if (!res.data.result) {
              this.tableDataa = []
              return
            }
            this.tableDataa = res.data.result.map(item => ({...item, edit: false, catalog: false}))
            if (this.activeName && this.tableDataa.length !== 0 && this.tableDataa[this.activeName]) {
              this.textbookId = this.tableDataa[this.activeName].id
            }
          } else if (res.data.code === -2) {
            error(this)
          } else {
            notice(this, res.data.message, 3000)
          }
          this.loading = false
        })
        .catch(res => {
          notice(this, res.message, 2000)
        })
      }, 200)
    },
    scrollTop () {
      window.scrollTo(0, 0)
    }
  },
  computed: {
    actionimport () {
      const path = document.querySelector('#contextPath').value
      return `${path}/lessonSet/importExcel?textbookId=${this.textbookId}`
    }
  },
  created () {
    this.getSelectSemesterList()
    this.scrollTop()
  },
  watch: {
    activeName () {
      this.treeloading = true
      setTimeout(() => {
        this.showList()
      }, 500)
      this.catalog = false
      if (this.tableDataa[this.activeName] && this.tableDataa.length !== 0) {
        this.textbookId = this.tableDataa[this.activeName].id
      }
    },
    data2 () {
      if (this.data2.length === 0) {
        this.cate = false
      }
    },
    dialogVisible () {
      this.getBookList()
    }
  }
}
</script>

<style  lang="scss">   
#metericalview {
    width: 100%;
    margin: 0px;
    padding: 0px;
    background: #fff;
    /*border: 1px solid #E3EAF4;*/
    min-width: 1025px;
    border-radius: 8px;

    .head {
      width: auto;
      height: 40px;
      background: #DDE6EF;
      padding-left: 20px;
      border-bottom: 1px solid #E1E8F1;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;      

      span {
        color: #636C7B;
        font-size: 14px;
        line-height: 40px;
        color: #636C7B;
        letter-spacing: 2px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;        
      }

      .publish {
        margin-left: 28px;
      }
      a {
        text-decoration: none;
        line-height: 40px;
        float: right;
        margin-right: 20px;
        position: relative;
        &:visited {
          color: #88909D;
        }
        color: #88909D;        

        .back {
          width: 24px;
          height: 24px;
          display: block;
          vertical-align: middle;
          right: 85px;
          vertical-align: middle;
          position: absolute;
          top: 8px;
          background: url(../../../assets/images/back.png) no-repeat;

        }
      }

      a:hover {
        color: #408EE6;
        cursor: pointer;

        .back {
          background: url(../../../assets/images/back-active.png) no-repeat;
        }
      }

    }
  .type {
    padding: 25px 0px 25px 70px;
    border-bottom: 1px solid #DDE6EF;

    .grade {
      &:after {
        display: block;
        content: '';
        height: 0;
        clear: both;
        overflow: hidden;
        visibility: hidden;
      }
      &>.grade-box {
        margin-left: 62px;
        /* float: left; */
      }
      &>span {
        float: left;
      }
    }

    .subject {
      &>span {
        float: left;
      }
      &>.sub-box {
        &>.nav-list-span {
          margin-bottom: 20px;
          display: inline-block;
        }
      }
    }
    .peroid,.grade,.subject,.term ,.search{
      /*margin-top: 25px;*/
      padding: 12px 0px;
      span {
        font-size: 14px;
        color: #4792E7;
        margin-right: 20px;
      }
      .nav-list-span {
        font-size: 14px;
        padding: 3px 17px;
        margin: 0 15px 0px 0px;
        cursor: default;
        color: #636C7B;
        border: 1px solid #fff;
        border-radius: 16px;
      }
      .nav-list-span:hover {
        border: 1px solid #408EE6;
        border-radius: 16px;
        cursor: pointer;
      }
      .active {
        color: #fff;
        background: #408EE6;
        border-radius: 16px;
        border: 1px solid #408EE6;
      }
    }
  }
  .search {
     padding: 40px 60px 12px 65px;

    .tag-list {
        div {
          color: #999;
          display: inline-block;
          /*width: 100px;*/
          height: 26px;
          line-height: 26px;
          border-radius: 13px;
          vertical-align: middle;
          border: 1px solid ;
          padding: 0 10px;
          margin-right: 8px;
          &:first-child {
            margin-left: 10px;
          }
          i {
            font-size: 12px;
            margin-left: 5px;
            cursor: pointer;
            transform: scale(0.8);
            &:hover {
              &:before {
              background: #FF6C60;
              color: #fff;
              }
            }
            &:before {
              border-radius: 100%;
              padding: 5px;
              font-size: 12px;
            }
          }
        }   
        span {
          &:hover {
            cursor: pointer;
          }
        }     
      }
    .type-choose {
      height: 40px;
      background: #DDE6EF;
      border-radius: 6px;
      padding-left: 16px;

      li {
        list-style-type: none;
        float: left;
        font-size: 14px;
        color: #636C7B;
        height: 40px;
        line-height: 40px;
        margin-right: 37px;

        img {
          margin-left: 10px;
          margin-top: 5px;
        }

        &:hover {
          cursor: pointer;
        }
      }
      .search-pic {
        margin-left: 36%;

        img {
            margin-left: 0px;
            margin-top: 0px;
        }

        .input-box {
          img {
              margin-right: 15px;
              vertical-align: middle;
          }
          input {
            outline: none;
            background: #DDE6EF;
            border-left: 1px solid #9EA7B4;
            border-top: none;
            border-right: none;
            border-bottom: none;
            text-indent: 1em;
            color: #B2BAC7;
            width: 218px;
          }
          .hot-search {
            width: 400px;
            height: 180px;
            border: 1px solid #DDE6EF;
            display: block;
            border-radius: 8px;
            box-shadow: 0px 2px 5px #DDE6EF;
            background: #fff;
            position: absolute;
            padding-left: 16px;

            .hot-title {
              color: #D4D8DF;
            }
            .hot-content {
              color: #A2AAB8;
              list-style-type: none;
              width: inherit;
              margin-right: 0px;
            }
            li:hover {
              cursor: pointer;
            }
          }
        }
      }
    }
    .type-choose:after {
      content: " ";
      clear: both;
    }
  }
  .subject {
    .sub-box {
      margin-left: 62px;
    }
  }
    .courseplan {
        padding: 80px 60px 0px 66px;
        position: relative;

        .el-tabs {
            padding: 5px 30px 20px 37px;
            margin-bottom: 40px;
            position: relative;
            .el-tabs__header {
                margin: 0px;
                z-index: 20;
                border: none;
                height: 43px;

                .el-tabs__nav-wrap {
                    .el-tabs__nav-scroll {
                        .el-tabs__nav {

                            .el-tabs__item {
                                border-left: 1px solid #ccc;
                                border-right: 1px solid #ccc;
                                border-top: 1px solid #ccc;
                                background: #DDE6EF;
                                width: 129px;
                                height: 40px;
                                border-top-left-radius: 8px;
                                border-top-right-radius: 8px;
                                box-shadow: 0px 0px 5px #E1E5EB;        
                                text-align: center;    
                                overflow: hidden; 
                                white-space: nowrap; 
                                text-overflow: ellipsis;                                                        
                            }
                            .is-active {
                                background: #fff;
                            }
                        }
                    }
                }
            }
            .el-tabs__content {
                /* position: absolute;
                left: -24px; */
                min-height: 800px;
                margin-top: -4px;
                width: 100%;
                overflow-x: hidden;
                border-top: 1px solid #ccc;
                border-left: 1px solid #ccc;
                border-right: 1px solid #ccc;
                border-bottom: 1px solid #ccc;
                z-index:　10;
                border-radius: 4px;
                /* top: 44px; */

                .tip {
                  position: absolute;
                  height: 30px;
                  line-height: 30px;
                  right: 45px;
                  top: 35px;
                  color: #666;
                  z-index: 999;
                }
                .buttons {
                      position: absolute;
                      top: 12px;
                      right: 20px;   

                      .upload {
                        float: left;
                        margin-right: 15px;
                        position: relative;

                        &>.el-upload {
                          position: absolute;
                          right: 0px;
                        }
                      }  
                      .el-button {
                          background: #fff;
                          border: 1px solid #408EE6;
                          margin-left: 20px;
                          span {
                              color: #408EE6;
                          }
                          &:hover {
                              background: #408EE6;

                              span {
                                  color: #fff;
                              }
                          }
                      } 
                    }                
                .el-tab-pane {
                    
                    width: inherit;
                    min-height: 800px;
                    /* position: relative; */

                    .createnew {
                        position: absolute;
                        top: 35%;
                        left: 40%;
                        width: 360px;
                        height: 60px;
                        background: #fff;
                        border: 1px solid #9FD35D;

                        span {
                            color: #9FD35D;
                            font-size: 15px;
                        }

                        &:hover {
                            background: #9FD35D;
                            cursor: pointer;

                            span {
                                color: #fff;
                            }
                        }
                    
                    }

                    .el-tree {
                        padding: 0px 20px;
                        overflow-y: auto;
                        margin: 50px 0px 0px 38px;
                        border: none;
                        padding-right: 20px;
                        /* height: calc(100vh - 600px); */
                        /*transition:all 10s linear;*/
                        i {
                            width: 24px;
                            height: 24px;
                            display: block;
                            margin-left: 10px;
                            float: left;
                            margin-top: 8px;
                        }
                        .node {
                            color: #636C7B;
                            position: relative;
                            .editinput {
                              position: absolute;
                              width: 80px;
                              left: 0px;
                              top: 6px;
                            }
                        }
                        .nodelist {
                            min-width: 90px;
                            height: 30px;
                        }
                        .append {
                          width: 18px;
                          height: 18px;
                          /*display: none;*/
                          background: url(../../../assets/images/append.png) no-repeat;
                            &:hover {
                                background: url(../../../assets/images/append-active.png) no-repeat;
                            }
                        }
                        .edit {
                          width: 18px;
                          height: 18px;
                          /*display: none;*/
                          background: url(../../../assets/images/edit.png) no-repeat;
                            &:hover {
                                background: url(../../../assets/images/edit-active.png) no-repeat;
                            }                            
                        }
                        .del {
                          width: 18px;
                          height: 18px; 
                          /*display: none;                         */
                            background: url(../../../assets/images/del-icon.png) no-repeat;
                            &:hover {
                                background: url(../../../assets/images/del-icon-active.png) no-repeat;
                            }                            
                        }
                        .addnext {
                          width: 18px;
                          height: 18px;
                          /*display: none;*/
                          background: url(../../../assets/images/appendnext.png) no-repeat;
                            &:hover {
                                background: url(../../../assets/images/appendnext-active.png) no-repeat;
                            }
                        }                        
                        .el-tree-node {
                          /*&:hover {
                            .append, .edit, .del {
                              display: block;
                            }
                          }*/
                            .el-tree-node__content {
                                    font-size: 16px;
                                .el-tree-node__expand-icon {
                                    display: none;
                                }
                                span {
                                    &:first-child {
                                        float: left;
                                        margin-right: 20px;
                                    }

                                    &:last-child {
                                        span {
                                            &:first-child {
                                                span {
                                                    color:　#636C7B !important;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            .el-tree-children {
                                .el-tree-node {
                                    .el-tree__content {
                                    }
                                    &:last-child {
                                        .el-tree-node__content {
                                            span {
                                                &:last-child {
                                                    span {
                                                        &:last-child {
                                                            .append {
                                                                position: static;
                                                            }
                                                            .delete {
                                                                position: static;
                                                            }
                                                            .el-button {
                                                                width: 24px;
                                                                height: 24px;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .button-group {
         position: absolute;
         top: 40px;
         right: 62px;   

         .upload {
           float: left;
           margin-right: 15px;
           position: relative;

           &>.el-upload {
             position: absolute;
             right: 0px;
           }
         }  
         .el-button {
             background: #fff;
             border: 1px solid #408EE6;
             span {
                 color: #408EE6;
             }
             &:hover {
                 background: #408EE6;

                 span {
                     color: #fff;
                 }
             }
         }       
        }
    }

    .importBox {
      .el-dialog  {
        width: 450px !important;
      }
      .el-dialog__title {
        width: 100% !important;
        height: 40px;
        line-height: 40px;
      }
      .el-dialog__body {
        padding: 40px 60px !important;
      }

      .dialog-footer {
        width: 100%;
        display: block;
        text-align: center;

        &:after {
          display: block;
          content: '';
          clear: both;
          overflow: hidden;
        }
      }
      .cancel {
        border: 1px solid  #FF6C60 !important;
        
        span {
          color: #FF6C60 !important;
        }
      }
      .el-button {
        float: left;
        margin-left: 23%;
      }
      .upload {
        width: 90px;
        float: left;
        margin-left: 20px;
      }
    }
    .el-dialog__wrapper {
        .el-dialog {
            margin: 0px;
            width: 680px;
            background: url(../../../assets/images/add-border.png) no-repeat;
            background-color: #fff;
            border-radius: 15px;

            .el-dialog__header  {
                position: relative;
                padding: 30px 60px 0;
                span {
                    width: 578px;
                    height: 60px;
                    display: block;
                    line-height: 60px;
                    text-align: center;
                    border-bottom: 1px solid #DAE2ED;
                    color: #408EE6;
                    font-weight: normal;
                }
                .el-dialog__headerbtn {
                    position: absolute;
                    right: 13px;
                    top: 15px;
                    width: 22px;
                    height: 22px;
                    background: url(../../../assets/images/dialog-close.png) no-repeat;

                    &:hover {
                      background: url(../../../assets/images/dialog-close-hover.png) no-repeat;
                    }
                    i {
                    padding: 2px;
                    &:before {
                      content: '';
                    }
                  }
                }
            }
            .el-dialog__body {
                padding: 20px 60px;
                .el-button {
                    margin-bottom: 20px;
                    width: 80px;
                    height: 30px;
                    border: 1px solid #9FD35D;
                    background: #fff;
                    position: relative;

                    span {
                        color: #9FD35D;
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        width: 80px;
                        text-align: center;
                        height: 30px;
                        line-height: 30px;
                    }

                    &:hover {
                        background: #9FD35D;
                        span {
                            color: #fff;
                        }
                    }
                }

                .el-table {
                     border-radius: 8px;
                     max-height: 368px;
                     overflow: auto;
                     overflow-x: hidden;
                     margin-bottom: 90px;
                    .el-table__header-wrapper {
                        table {
                            width: 100% !important;
                            thead {
                                tr {
                                    th {
                                        .cell {
                                            text-align: center;
                                            color: #636C7B;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    .el-table__body-wrapper {
                        table {
                            width: 100% !important;
                            tbody {
                                tr {
                                    &:last-child {
                                        td {
                                        .cell {
                                          border-radius-bottom-left: 4px !important;
                                            .el-input {
                                              .el-input__inner {
                                                border-radius-bottom-left: 4px !important;
                                              }
                                            }
                                          }
                                        }
                                        }
                                    td {
                                        padding: 0px 20px;
                                        &:first-child {
                                            padding: 0px;
                                            .cell{
                                            padding: 0px;

                                            span {
                                                padding-left: 10px;
                                                width: 275px;
                                                height: 40px;
                                                display: block;
                                                line-height: 40px;
                                            }
                                            .el-input {
                                                input {
                                                    border: 1px solid #408EE6;
                                                    /*outline: none;*/
                                                    padding: 0px 0px 0px 10px;
                                                }
                                                .el-input__inner {
                                                  height: 40px;
                                                  border-radius: 0px;
                                                }
                                            }
                                            }                                            
                                        }

                                        &:nth-child(2) {
                                            .cell {
                                                span {
                                                  float: left;
                                                  &:after {
                                                      content: '';
                                                      display: block;
                                                      clear: both;
                                                      color: #636C7B;
                                                  }
                                                  &:hover {
                                                      cursor: pointer;
                                                  }
                                                  i {
                                                      width: 24px;
                                                      height: 24px;
                                                      display: block;
                                                      float: left;
                                                      margin-right: 10px;
                                                  } 
                                                  &:first-child {
                                                      margin-right: 36px;
                                                  i {
                                                    background: url(../../../assets/images/delete-icon.png);
                                                  } 
                                                  &:hover {
                                                      i {
                                                          background: url(../../../assets/images/delete-icon-active.png);
                                                      }
                                                      color: #FF6C60;
                                                  }
                                                  }
                                                  &:nth-child(2) {
                                                      i {
                                                      background: url(../../../assets/images/rename.png);
                                                      }
                                                      &:hover {
                                                          i {
                                                          background: url(../../../assets/images/rename-active.png);
                                                          }
                                                          color: #408EE6;
                                                      }
                                                  }
                                                  &:nth-child(3) {
                                                      margin-right: 36px;
                                                      i {
                                                          background: url(../../../assets/images/cancel.png)
                                                      }
                                                      &:hover {
                                                          i{
                                                              background: url(../../../assets/images/cancel-active.png)
                                                          }
                                                          color: #FF6C60;
                                                      }
                                                  }
                                                  &:last-child {
                                                      i {
                                                          background: url(../../../assets/images/save.png)
                                                      }
                                                      &:hover {
                                                          i {
                                                          background: url(../../../assets/images/save-active.png)
                                                          }
                                                          color: #FCB323;
                                                      }
                                                  }

                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                .el-table__empty-block {
                    width: 100% !important;
                }
            }
            .el-dialog__footer {
                text-align: center;
                .el-button {
                    width: 90px;
                    height: 30px;
                    border: 1px solid #408EE6;
                    background: #fff;
                    line-height: 30px;
                    padding: 0px;

                    span {
                        color: #408EE6;
                    }
                }
            }
            
        }
    }
}

</style>
