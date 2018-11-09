<template>
  <div id="square">
   <!-- card -->
   <div class="card" v-loading="cardloading">
    <div class="peroid">
     <span>学段：</span>
     <div class="span-box">
      <span v-for="(item, i) in peroid" :key="i" :class="{'nav-list-span': true, 'active': peroidInd === i}" @click="peroidClick(item, i)">{{item.name}}</span>
     </div>
    </div>
    <div class="grade">
     <span>年级：</span>
     <div class="span-box">
      <span v-for="(item, i) in grade" :key="i" :class="{'nav-list-span': true, 'active': gradeInd === i}" @click="gradeClick(item, i)">{{item.name}}</span>
     </div>
    </div>
    <div class="subject">
     <span>学科：</span>
     <div class="span-box">
      <span v-for="(item, i) in subject" :key="i" :class="{'nav-list-span': true, 'active': subjectInd === i}" @click="subjectClick(item, i)">{{item.curriculumName}}</span>
     </div>
    </div>
   </div>

  <!-- 筛选条件 -->
   <div class="choose">
    <ul>
     <li v-for="(item, index) in selectList" :key="index" :class="{selactive: selectInd === index}" @click="selectInd = index">{{item}}</li>
    </ul>
    <el-input placeholder="请输入微课或简介或上传者姓名" v-model="inputvalue" class="input-box">
     <el-button slot="append" icon="el-icon-search" @click="getCourseList"></el-button>
    </el-input>
   </div>

   <!-- 微课列表 -->
   <div class="list" v-loading="loading">
    <div class="list-content" v-for="(item, index) in list" :key="index" @click="lookDetail(item)">
     <img :src="item.imageUrl">
     <!-- <iframe :src="item.imageUrl" width="260" height="150" scrolling="no" frameborder="0"></iframe> -->
      <el-popover
        placement="top"
        width="200"
        trigger="hover"
        v-if="item.microclassName.length > 12"
        :content="item.microclassName">
        <p slot="reference">{{item.microclassName.slice(0, 11) + '...'}}</p>
      </el-popover>
     <p v-if="item.microclassName.length <= 12">{{item.microclassName}}</p>
     <ul>
      <li>{{item.uploadUserName}}</li>
      <li>浏览:  <span>{{item.visitCount}}</span></li>
      <li>评论: <span>{{item.commentCount}}</span></li>
     </ul>
    </div>

    <!--分页  -->
    <el-pagination
    v-if="totalCount !== 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[15, 20, 25, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount">
    </el-pagination>
   </div>
  </div>
</template>
<script>
// import { error, notice } from './../../api/index.js'
export default {
  name: 'square',
  data () {
    return {
      pageSize: 15,
      loading: false,
      cardloading: false,
      inputvalue: '',
      selectInd: 0,
      selectList: ['最新', '浏览量'],
      currentPage: 1,
      totalCount: 0,
      peroidInd: 0,
      gradeInd: 0,
      subjectInd: 0,
      semesterId: '',
      peroid: [],
      grade: [],
      subject: [],
      list: []
    }
  },
  methods: {
    lookDetail (item) {
      sessionStorage.path = '/square'
      let bread = {
        routeName: '首页',
        id: item.id,
        path: '/square',
        peroid: item.sectionName,
        grade: item.gradeName.replace(item.sectionName, ''),
        subject: item.courseName,
        title: item.microclassName,
        author: item.uploadUserName,
        uploadUser: item.uploadUser
      }
      let obj = {
        peroidInd: this.peroidInd,
        gradeInd: this.gradeInd,
        subjectInd: this.subjectInd,
        inputvalue: this.inputvalue,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        selectInd: this.selectInd
      }
      sessionStorage.cho = JSON.stringify(obj)
      sessionStorage.bread = JSON.stringify(bread)
      this.$router.push('/course')
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getCourseList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getCourseList()
    },
    peroidClick (item, i) {
      this.peroidInd = i
      this.getCourseList()
    },
    gradeClick (item, i) {
      this.gradeInd = i
      this.getCourseList()
    },
    subjectClick (item, i) {
      this.subjectInd = i
      this.getCourseList()
    },
    async getPeroid () {
      const data = await this.$store.dispatch('getPeroid')
      this.semesterId = data[0].semesterId
    },
    async getSection () {
      this.peroid = await this.$store.dispatch('getSection')
    },
    async getGrade () {
      const data = await this.$store.dispatch('getGrade', {
        sectionId: this.peroid[this.peroidInd].id,
        semesterId: this.semesterId
      })
      let obj = {
        name: '全部',
        id: ''
      }
      data.unshift(obj)
      this.grade = data
    },
    async getSubject () {
      this.cardloading = false
      const data = await this.$store.dispatch('getSubject')
      let obj = {
        curriculumName: '全部',
        curriculumId: ''
      }
      data.unshift(obj)
      this.subject = data
    },
    async getCourseList () {
      this.loading = true
      const data = await this.$store.dispatch('getCourseList', {
        courseId: this.subject[this.subjectInd].curriculumId,
        sectionId: this.peroid[this.peroidInd].id,
        gradeId: this.grade[this.gradeInd].id,
        keyword: this.inputvalue,
        state: this.selectInd === 0 ? 1 : 2,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      })
      this.loading = false
      this.list = data.list
      const path = document.getElementById('contextPath').value
      this.list.map(item => {
        item.imageUrl = path + '/common/imageView/' + item.id
      })
      console.log(this.list)
      this.totalCount = data.totalCount
    }
  },
  watch: {
    selectInd () {
      this.getCourseList()
    },
    peroidInd () {
      this.getCourseList()
    },
    gradeInd () {
      this.getCourseList()
    },
    subjectInd () {
      this.getCourseList()
    }
  },
  async created () {
    this.cardloading = true
    if (sessionStorage.cho) {
      let obj = JSON.parse(sessionStorage.cho)
      this.peroidInd = obj.peroidInd
      this.gradeInd = obj.gradeInd
      this.subjectInd = obj.subjectInd
      this.selectInd = obj.selectInd
      this.currentPage = obj.pageNo
      this.pageSize = obj.pageSize
      this.inputvalue = obj.inputvalue
      sessionStorage.cho = ''
    }
    await this.getPeroid()
    await this.getSection()
    await this.getGrade()
    await this.getSubject()
    setTimeout(async () => {
      await this.getCourseList()
    }, 300)
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/index.scss';
#square {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  background: #fff;
  border-radius: 8px;
  position: relative;

  .selactive {
    color: #408EE6;
  }

  .card {
   padding: 20px;
   border-bottom: 1px solid #DAE2ED;
   min-height: 142px;
    .peroid,.grade,.subject,.term ,.search{

      @extend .clearfix;
      /* padding: 12px 0px; */
      &>span {
        font-size: 14px;
        color: #636C7B;
        margin-right: 20px;
        float: left;
      }

      .span-box {
        width: 90%;
        float: left;
      }
      .nav-list-span {
        font-size: 14px;
        padding: 3px 17px;
        margin: 0 15px 20px 0px;
        display: inline-block;
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

  .choose {
    width: 95%;
    margin: 40px auto 0px auto;
    background:#DDE6EF;
    border-radius: 4px;
    @extend .clearfix;
    height: 50px;
    line-height: 50px;
    position: relative;

    ul {
     width: 40%;
     float: left;
     @extend .clearfix;
     padding: 0px;
     margin: 0px;

     li {
      cursor: pointer;
      float: left;
      width: 100px;
      list-style-type: none;
      text-align: center;
      &>span {
        color: #636C7B;
      }
     }
    }
    .el-input {
     width: 400px;
     vertical-align: middle;
     position: absolute;
     right: 20px;
     top: 5px;
    }
  }

  .list {
    // display: flex;
    // flex-wrap: wrap;
    // justify-content: space-around;
    // align-content: flex-start;
    width: 95%;
    margin: 30px auto;
    @extend .clearfix;
    min-height: calc(100vh - 480px);
    position: relative;

   .list-content {
    margin-bottom: 30px;
    // margin-right: 1%;
    padding: 15px;
    border-radius: 4px;
    float: left;
    &:hover {
      background: #EAEFF8;
    }

     img {
      width: 260px;
      height: 150px;
      display: inline-block;
      cursor: pointer;
     }
     p {
       margin: 0px;
       padding: 5px 0px;
       cursor: pointer;
       color: #636C7B;
       height: 19px;
     }

     &>ul {
       @extend .clearfix;
       margin: 0px;
       padding: 0px;

      &>li {
       float: left;
       list-style-type: none;
       margin-right: 20px;
       padding: 5px 0px;
       color: #636C7B;
       &>span {
         color: #636C7B;
       }
      }
     }
   }

   .el-pagination {
    /* text-align: right;
    margin-top: 30px;
    clear: both; */
    position: absolute;
    bottom: 0px;
    right: 20px;
   }
  }
}

</style>
