<template>
  <div id="square">
      <div class="head">
        <ul>
          <li v-for="(item, index) in nav" :key="item"><a :class="{'active': activeInd === index, 'space': activeInd === 1}" @click="link(item, index)">{{item.name}}</a></li>
        </ul>
      </div>
      <!--分类-->
      <div class="type">
        <div class="peroid">
          <span>学段：</span>
          <span v-for="(item, i) in peroid" :key="i" :class="{'nav-list-span': true, 'active': peroidInd === i}" @click="peroidClick(item, i)">{{item.name}}</span>
        </div>
        <div class="grade">
          <span>年级：</span>
          <span v-for="(item, i) in grade" :key="i" :class="{'nav-list-span': true, 'active': gradeInd === i}" @click="gradeClick(item, i)">{{item.name}}</span>
        </div>
        <div class="subject">
          <span>学科：</span>
          <span v-for="(item, i) in subject" :key="i" :class="{'nav-list-span': true, 'active': subjectInd === i}" @click="subjectClick(item, i)">{{item.name}}</span>
        </div>                
      </div>

      <!--搜索和排序-->
      <div class="search">
        <ul class="type-choose">
          <li v-for="(sort, index) in sorts" :key="index" @click="sort">
            {{sort.name}}
            <img src="../../assets/images/sort.png" >
            <img src="../../assets/images/sort-active.png">
            <img src="../../assets/images/sortup.png">
            <img src="../../assets/images/sortup-active.png">
          </li>
          <li class="search-pic"  @mouseenter="show = true" @mouseout="show = false" @click="showinputs()"> 
            <img src="../../assets/images/search.png" v-if="!show && showinput === false">
            <img src="../../assets/images/search-active.png" v-if="show && showinput === false" class="search-active">

            <div class="input-box" v-if="showinput === true">
              <img src="../../assets/images/search-icon.png" v-if="inputflag" @click="gosearch()">
              <img src="../../assets/images/search-icon-input.png" v-if="!inputflag" @click="gosearch()">
              <input type="text" v-model="content" @focus="showhot()" @blur="hidehot()">
              <ul class="hot-search" v-if="hot">
                <li class="title" >热门搜索</li>
                <li v-for="(hot, index) in hotsearch" :key="index" class="hot-content" @click="hotcontent(hot, index)">{{hot.title}}</li>
              </ul>
            </div>
          </li>
        </ul>
      </div>

      <!--教案列表-->
      <div class="planlist" v-if="activeInd === 0">
        <ul class="list-ul">
          <li v-for="(plan, index) in plans" :key="index" class="list-li">
            《{{plan.title}}》
            <div class="intro">
              <span>学科：{{plan.subject}}</span>
              <span>年级：{{plan.grade}}</span>
              <span>作者：{{plan.author}}</span>
              <span>发表时间：{{plan.createdTime}}</span>
            </div>
            <div class="num">
              <span class="num-li"><img src="../../assets/images/comment.png"><i>评论: {{plan.comment}}</i></span>
              <span class="num-li"><img src="../../assets/images/collect.png"><i>收藏: {{plan.collect}}</i></span>
              <span class="num-li"><img src="../../assets/images/score.png"><i>评分: {{plan.score}}</i></span>
            </div>
          </li>
        </ul>
      </div>

      <!--优秀教案-->
      <div class="excellentplan" v-if="activeInd === 1">
        <ul>
          <li v-for="(eplan, index) in eplans" :key="eplan">
            <img src="">
            <p class="title">《{{eplan.title}}》</p>
            <p>学科：{{eplan.subject}}</p>
            <p>年级:{{eplan.grade}}</p>
            <p>作者:{{eplan.author}}</p>
            <p>发表时间:{{eplan.createdTime}}</p>
          </li>
        </ul>
      </div>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="100"
        layout="total, prev, pager, next"
        :total="1000">
      </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'square',
  data () {
    return {
      nav: [
        {name: '全部教案'},
        {name: '优秀教案'}
      ],
      activeInd: 0,
      peroidInd: -1,
      gradeInd: -1,
      subjectInd: -1,
      flag: false,
      show: false,
      hot: true,
      showinput: false,
      inputflag: false,
      currentPage: 1,
      content: '请输入关键字检索',
      navInfo: [
        {},
        {},
        {}
      ],
      peroid: [
        {name: '全部'},
        {name: '小学'},
        {name: '初中'},
        {name: '高中'}
      ],
      grade: [
        {name: '全部'},
        {name: '一年级'},
        {name: '二年级'},
        {name: '三年级'},
        {name: '四年级'},
        {name: '五年级'},
        {name: '六年级'}
      ],
      subject: [
        {name: '全部'},
        {name: '语文'},
        {name: '数学'},
        {name: '英语'},
        {name: '思品'},
        {name: '信息'},
        {name: '科学'},
        {name: '品德与科学'},
        {name: '品德与社会'}
      ],
      sorts: [
        {name: '发表时间'},
        {name: '评分'},
        {name: '收藏'}
      ],
      hotsearch: [
        {title: '农夫与蛇'},
        {title: '老人与海'}
      ],
      plans: [
        {title: '梁秋实', subject: '语文', grade: '二年级', author: '高瑜', createdTime: '2017-05-24', comment: 12, collect: 16, score: 4.5},
        {title: '梁秋实', subject: '语文', grade: '二年级', author: '高瑜', createdTime: '2017-05-24', comment: 12, collect: 16, score: 4.5},
        {title: '梁秋实', subject: '语文', grade: '二年级', author: '高瑜', createdTime: '2017-05-24', comment: 12, collect: 16, score: 4.5},
        {title: '梁秋实', subject: '语文', grade: '二年级', author: '高瑜', createdTime: '2017-05-24', comment: 12, collect: 16, score: 4.5},
        {title: '梁秋实', subject: '语文', grade: '二年级', author: '高瑜', createdTime: '2017-05-24', comment: 12, collect: 16, score: 4.5}
      ],
      eplans: [
        {title: '梁秋实', subject: '语文', grade: '小学-二年级', author: '高瑜', createdTime: '2017-05-22'},
        {title: '从百草园到三味书屋', subject: '语文', grade: '小学-二年级', author: '高瑜', createdTime: '2017-05-22'},
        {title: '春雨', subject: '语文', grade: '小学-二年级', author: '高瑜', createdTime: '2017-05-22'},
        {title: '三角函数', subject: '语文', grade: '小学-二年级', author: '高瑜', createdTime: '2017-05-22'},
        {title: '春雨', subject: '语文', grade: '小学-二年级', author: '高瑜', createdTime: '2017-05-22'},
        {title: '夜', subject: '语文', grade: '小学-二年级', author: '高瑜', createdTime: '2017-05-22'},
        {title: '父亲', subject: '语文', grade: '小学-二年级', author: '高瑜', createdTime: '2017-05-22'},
        {title: '从百草园到三味书屋', subject: '语文', grade: '小学-二年级', author: '高瑜', createdTime: '2017-05-22'},
        {title: '梁秋实', subject: '语文', grade: '小学-二年级', author: '高瑜', createdTime: '2017-05-22'},
        {title: '从百草园到三味书屋', subject: '语文', grade: '小学-二年级', author: '高瑜', createdTime: '2017-05-22'},
        {title: '春雨', subject: '语文', grade: '小学-二年级', author: '高瑜', createdTime: '2017-05-22'},
        {title: '三角函数', subject: '语文', grade: '小学-二年级', author: '高瑜', createdTime: '2017-05-22'},
        {title: '春雨', subject: '语文', grade: '小学-二年级', author: '高瑜', createdTime: '2017-05-22'},
        {title: '夜', subject: '语文', grade: '小学-二年级', author: '高瑜', createdTime: '2017-05-22'},
        {title: '父亲', subject: '语文', grade: '小学-二年级', author: '高瑜', createdTime: '2017-05-22'}
      ]
    }
  },
  methods: {
    link (item, index) {
      this.activeInd = index
    },
    peroidClick (item, i) {
      if (this.peroidInd === i) {
        this.peroidInd = -1
        this.navInfo[0] = ''
        console.log(this.navInfo)
      } else {
        this.peroidInd = i
        this.navInfo[0] = item
        console.log(this.navInfo)
      }
    },
    gradeClick (item, i) {
      if (this.gradeInd === i) {
        this.gradeInd = -1
        this.navInfo[1] = ''
      } else {
        this.gradeInd = i
        this.navInfo[1] = item
        console.log(this.navInfo)
      }
    },
    subjectClick (item, i) {
      if (this.subjectInd === i) {
        this.subjectInd = -1
        this.navInfo[2] = ''
      } else {
        this.subjectInd = i
        this.navInfo[2] = item
        console.log(this.navInfo)
      }
    },
    sort () {},
    showinputs () {
      this.showinput = true
    },
    hotcontent (hot, index) {
      console.log(111)
      this.content = hot.title
    },
    gosearch () {
      this.hot = false
      console.log('搜索喽~~')
    },
    handleSizeChange () {},
    handleCurrentChange () {},
    showhot () {
      this.inputflag = true
      this.hot = false
    },
    hidehot () {
      this.inputflag = false
      this.hot = true
    }
  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#square {
  width: 100%;
  margin: 0px !important;
  padding: 0px !important;
  position: relative;
  
  .head {
    width: 100%;
    ul {
      width: auto;
      height: 40px;
      background: #DDE6EF;
      padding-left: 30px;
      margin: 0px;
      border-bottom: 1px solid#DAE2ED;
      li {
        float: left;
        list-style-type: none;
        margin-left: 35px;

        a {
          color: #636C7B;
          width: 90px;
          height: 31px;
          border-radius: 10px 10px 0px 0px;
          display: block;
          margin-top: 10px;
          text-align: center;
          font-size: 14px;
          line-height: 31px;
          border-bottom: 1px solid #fff;

        }
        .active {
          background: #fff;
          color: #408EE6;
        }
        a:hover {
          cursor: default;
        }
      }
    }
  }
  .type {
    padding: 25px 0px 25px 70px;
    border-bottom: 1px solid #DDE6EF;
    .peroid,.grade,.subject {
      /*margin-top: 25px;*/
      padding: 12px 0px;
      span {
        font-size: 14px;
        color: #636C7B;
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
      }
      .search-pic {
        position: absolute;
        margin-left: 36%;

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
              cursor: default;
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
  .planlist {
    padding: 0px 60px 0px 65px;
    border-bottom: none;

    .list-ul {
      margin: 0px;
      padding-left: 20px;
      padding-bottom: 120px;
      .list-li {
        color: #A8B0BD; 
        list-style-type:disc inside;
        margin-top: 24px;
        border-bottom: 1px dashed #DAE2ED;

        &:last-child {
          border-bottom: none;
        }
        .intro {
          margin: 10px 32px 20px 8px;
          span {
            color: #A2AAB8;
            padding-left: 0px;
            margin-right: 24px;
          }
        }
      }
    }, 
    .num {
      padding-bottom: 10px;
      
      .num-li {
        line-height: 24px;
        padding-left: 8px;
        vertical-align: middle;

        img {
          margin-right: 10px;
          vertical-align: middle;
        }

        i {
          font-style: normal;
          margin-right: 30px;
        }
      }
    }
  }

  .el-pagination  {
    float: right;
    margin-right: 60px;
    margin-bottom: 30px;
  }

}

</style>
