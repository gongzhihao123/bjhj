<template>
  <div class="release">
    <div class="container">
      <div class="people-list">
        <h3 class="title">人员名单 <span>共{{ total }}人</span></h3>
        <div class="search">
          <el-input placeholder="请输入姓名进行查找" v-model="keyword" size="small" :maxlength="20">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <div class="list people-list-box" ref="peopleList">
          <ul class="scroller">
            <li 
              v-for="(item,index) in nPeopleList" 
              :key="index" 
              @click="personnel(item,index)"
              class="people-item item">
              {{ item.rowNo }}
              <span :style="{color: item.userId ? '' : 'red' }">{{ item[$store.state.documents.name] }}</span>
              <span v-if="!item.userId" class="Match" @click="MatchBtn(item, index)">匹配</span>
              <span v-else class="Matchs"></span>
            </li>
          </ul>
        </div>
      </div>
      <div class="people-descript" >
        <h3 class="title">{{ name }}工资单</h3>
        <div class="list" ref="peopleDescript">
          <ul class="scroller">
            <li 
              v-for="(item,index) in wagesList" 
              :key="index" 
              class="peopleDes-item item"
              @click="item.show = true">
              <span>{{ item.name }}</span>
              <transition name="slide-down" mode="out-in">
                <span v-if="!item.show">{{ item.num }}</span>
                  <el-input
                    v-else 
                    v-model.number="item.num" 
                    type="number" 
                    size="small" 
                    v-focus @blur="submit(item)"></el-input>          
                <!-- <el-input v-else v-model="item.num" size="small" v-focus @blur="submit(item)"></el-input> -->
              </transition>
            </li>
          </ul>
        </div>
      </div>
      <div class="notice">
        <div class="notice-head">
          <h3 class="title">公告</h3>
          <div class="text-area">
            <el-input 
              type="textarea"
              placeholder="请输入需要公告的内容，不超过1000字"
              :rows="14"
              :maxlength="1000"
              v-model="textarea"
              ></el-input>
          </div>
        </div>
        <div class="notice-btn">
          <el-button type="primary" :disabled="disab" @click="timeNow">现在发送</el-button>
          <br/>
          <button class="time-release" @click="timingDialog"><i class="el-icon-time"></i>定时发送</button>
          <br/>
          <button
            class="back"
            @click="complementary"><img src="../../assets/images/back.png" alt=""> 返回重新上传工资表</button>
        </div>
      </div>

      <el-dialog
        title="定时发送"
        :visible.sync="timeDialog"
        width="400px">
        <p>请选择预约发送时间：</p>
        <div class="select-time">
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
          <el-time-picker
            v-model="time"
            placeholder="任意时间点"
            format="HH:mm"
            value-format="HH:mm">
          </el-time-picker>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="timeDialog = false">取 消</el-button>
          <el-button type="primary" :disabled="ban" @click="timing">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="姓名匹配出错 （请手动匹配）" :visible.sync="MatchDialog" width="350px">
        <p class="title" style="border:0;text-align: center; padding:0;">表格中有未匹配的人员，请手动匹配</p>
        <ul class="MatchDialogList">
          <li v-for="(item, index) in infoPeo" :key="index" :class="selectUser === index ? 'MatchSelect' : ''" @click="selectUser = index">
            <span>
              <img :src='item.userface' alt="" wdith="25" height="25" v-if="item.userface">
              <img src='../../assets/images/people.png' alt="" wdith="25" height="25" v-else>
              <span>{{ item.name }}</span>
            </span>
            <span class="grade">{{ item.companyName }}</span>
          </li>
        </ul>
        <div slot="footer">
          <el-button @click="MatchDialog = false">取消</el-button>
          <el-button type="primary" @click="deteMatch" >确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as timesDate from '@/filters/index'
import IScroll from 'iscroll/build/iscroll.js'
export default {
  name: 'release',
  data () {
    return {
      nPeopleList: [],
      name: '',
      peopleList: [],
      wagesList: [],
      descript: [],
      notice: '',
      total: '',
      keyword: '',
      timeDialog: false,
      date: '',
      time: '',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() + 600 * 60 * 24 <= Date.now()
        }
      },
      myPeoScroll: '',
      myPeoDesScroll: '',
      nameColum: '',
      amount: '',
      textarea: '',
      disab: false,
      ban: false,
      month: '',
      excalPeo: [],
      infoPeo: [],
      MatchDialog: false,
      MatchSelect: '',
      selectUser: '',
      matchUser: ''
    }
  },

  watch: {
    keyword (val) {
      this.nPeopleList = this.peopleList.filter(item => item[this.nameColum].indexOf(val) !== -1)
      if (this.nPeopleList.length === 0) {
        this.nPeopleList = [{[this.nameColum]: '抱歉，搜索不到'}]
      }
      this.initPeoScroll()
    },
    timeDialog () {
      if (this.timeDialog === false) {
        this.initPeoScroll()
        this.initPeoDesScroll()
      } else {
        if (this.myPeoDesScroll) this.myPeoDesScroll.destroy()
        if (this.myPeoScroll) this.myPeoScroll.destroy()
      }
    }
  },

  methods: {
    timingDialog () {
      if (this.excalPeo.length) {
        this.$confirm('目前表格中还有未匹配的人员 确定继续发送吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.timeDialog = true
        })
      } else {
        this.timeDialog = true
      }
    },
    deteMatch () {
      this.nPeopleList[this.MatchSelect].userId = this.infoPeo[this.selectUser].code
      this.excalPeo.forEach((item, index) => {
        if (item[this.nameColum] === this.matchUser[this.nameColum]) {
          this.excalPeo.splice(index, 1)
        }
      })
      this.infoPeo.splice(this.selectUser, 1)
      this.MatchDialog = false
    },
    MatchBtn (item, index) {
      this.MatchDialog = true
      this.MatchSelect = index
      this.matchUser = item
    },
    submit (item) {
      for (var i = 0; i < this.peopleList.length; i++) {
        for (var j in this.peopleList[i]) {
          if (this.peopleList[i][j] === this.name) {
            this.peopleList[i][item.name] = item.num
          }
        }
      }
      item.show = false
    },
    initPeoScroll () {
      let el
      if (this.myPeoScroll) this.myPeoScroll.destroy()
      setTimeout(() => {
        el = this.$refs.peopleList
        this.myPeoScroll = new IScroll(el, {
          mouseWheel: true,
          scrollbars: true,
          freeScroll: true,
          preventDefault: false,
          interactiveScrollbars: true
        })
      }, 0)
    },

    initPeoDesScroll () {
      let el
      if (this.myPeoDesScroll) this.myPeoDesScroll.destroy()
      setTimeout(() => {
        el = this.$refs.peopleDescript
        this.myPeoDesScroll = new IScroll(el, {
          mouseWheel: true,
          scrollbars: true,
          freeScroll: true,
          preventDefault: false,
          interactiveScrollbars: true
        })
      }, 0)
    },

    personnel (item, index) {
      this.name = item[this.nameColum]
      this.wagesList = []
      for (var i in item) {
        if (i === this.nameColum || i === 'userId' || i === 'rowNo') {
          continue
        } else {
          var json = {}
          if (i === this.amount) {
            json.name = i
            json.num = item[i]
            json.show = false
            this.wagesList.unshift(json)
          } else {
            json.name = i
            json.num = item[i]
            json.show = false
            this.wagesList.push(json)
          }
        }
      }
    },
    //  现在发送的函数
    timeNow () {
      if (this.excalPeo.length) {
        this.$confirm('目前表格中还有未匹配的人员 确定继续发送吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.sendOut()
        })
      } else {
        this.sendOut()
      }
    },

    // 定时发送的函数
    timing () {
      var str = this.date + this.time
      var date = timesDate.format(new Date().getTime(), 'yyyy:MM:ddhh:mm')
      if (Number(str.split('-').join('').split(':').join('')) < Number(date.split(':').join(''))) {
        this.time = ''
        this.date = ''
        this.timeDialog = false
        this.$alert('请正确输入定时的时间', '提示', {
          confirmButtonText: '确定'
        }).then(() => {
          this.timeDialog = true
        })
      }
      if (this.timeDialog) {
        var timDate = this.date + ' ' + this.time
        this.ban = true
        this.sendOut(timDate)
      }
    },
   // 这是发送的函数
    async sendOut (timing) {
      var arr = []
      for (var i = 0; i < this.peopleList.length; i++) {
        if (this.peopleList[i].userId) {
          var json = {}
          json.userId = this.peopleList[i].userId
          json.userName = this.peopleList[i][this.nameColum]
          json.totalMoney = this.peopleList[i][this.amount]
          json.rowNo = this.peopleList[i].rowNo
          json.payroll = {}
          for (var j in this.peopleList[i]) {
            if (j !== this.amount && j !== this.nameColum && j !== 'userId') {
              json.payroll[j] = this.peopleList[i][j]
            }
          }
          json.payroll = JSON.stringify(json.payroll).replace(/"/g, "'")
          arr.push(json)
        }
      }
      this.disab = true
      await this.$store.dispatch('timeNow', {
        salaryUsers: JSON.stringify(arr),
        month: this.month,
        remark: this.textarea,
        publishTime: timing,
        settingName: this.nameColum,
        settingTotal: this.amount
      })
      this.disab = false
      this.ban = false
      this.$router.push({path: '/addWages'})
    },
    // 放回上一步操作的提示
    complementary () {
      this.$confirm('是否要放弃编辑本次工资单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$router.push({path: '/addWages'})
      }).catch(() => {
      })
    }
  },

  directives: {
    focus: {
      inserted: function (el, option) {
        var defClass = 'el-input'
        var defTag = 'input'
        var value = option.value || true
        if (typeof value === 'boolean') {
          value = { cls: defClass, tag: defTag, foc: value }
        } else {
          value = { cls: value.cls || defClass, tag: value.tag || defTag, foc: value.foc || false }
        }
        if (el.classList.contains(value.cls) && value.foc) {
          el.getElementsByTagName(value.tag)[0].focus()
        }
      }
    }
  },

  mounted () {
    this.nameColum = this.$store.state.documents.name
    this.amount = this.$store.state.documents.amount
    this.wagesList = []
    if (this.$store.state.documents.excal) {
      let excalList = this.$store.state.documents.excal
      let infoUser = this.$store.state.documents.info
      var arr = []
      excalList.forEach(item => {
        if (item[this.nameColum]) {
          let info = infoUser.filter(data => data.name === item[this.nameColum])
          if (info.length && !item.userId) {
            item.userId = info[0].code
          }
          if (!info.length) {
            this.excalPeo.push(item)
          }
          if (item.userId) {
            arr.push(true)
          }
        }
      })
      let noUserId = []
      let TheUser = []
      excalList.forEach((item, index) => {
        if (!item.userId && item[this.nameColum] !== 0) {
          noUserId.push(item)
        } else {
          if (item[this.nameColum] !== 0) {
            TheUser.push(item)
          }
        }
      })
      if (arr.length === excalList.length) {
        this.excalPeo = []
      }
      infoUser.forEach(item => {
        let excal = excalList.filter(data => data[this.nameColum] === item.name)
        let infoId = excalList.filter(data => data.userId + '' === item.code)
        if (!excal.length && !infoId.length) {
          this.infoPeo.push(item)
        }
      })
      this.total = excalList.length
      for (var i in excalList[0]) {
        if (i === this.$store.state.documents.name) {
          this.name = excalList[0][i]
          continue
        } else if (i === 'userId' || i === 'rowNo') {
          continue
        } else {
          var json = {}
          if (i === this.amount) {
            json.name = i
            json.num = excalList[0][i]
            json.show = false
            this.wagesList.unshift(json)
          } else {
            json.name = i
            json.num = excalList[0][i]
            json.show = false
            this.wagesList.push(json)
          }
        }
      }
      this.peopleList = [...noUserId, ...TheUser]
      this.month = this.$store.state.documents.months
      this.nPeopleList = this.peopleList
    }
    this.initPeoScroll()
    this.initPeoDesScroll()
  }
}
</script>

<style lang="scss">

@import "../../assets/scss/variable.scss";

.release {
  position: absolute;
  top: 50px;
  bottom: 0;
  width: 100%;
  overflow: hidden;

  .container {
    display: flex;
    margin: 20px auto;
    width: 1200px;
    height: calc(100% - 40px);

    > div {
      background: $white;
      padding: 10px;
      margin-right: 20px;

      .title {
        padding-left: 16px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        font-weight: bold;
        color: rgba(8, 43, 69, 0.9);
        border-bottom: 1px solid rgba(8, 43, 70, 0.15);

        span {
          font-size: 12px;
          color: #5e6d82;
        }
      }

      > .search {
        margin: 8px;
        text-align: center;

        .el-input__inner {
          text-align: center;
        }

        button {
          margin: 1px 0;
          padding: 0;
        }
      }
    }

    > div.people-list,
    > div.people-descript {
      position: relative;
      width: 460px;
    }

    .list {
      position: absolute;
      width: calc(100% - 20px);
      bottom: 0;
      top: 100px;
      overflow: hidden;

      .scroller {
        position: absolute;
        z-index: 1;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        width: calc(100% - 18px);
        -webkit-transform: translateZ(0);
        -moz-transform: translateZ(0);
        -ms-transform: translateZ(0);
        -o-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-text-size-adjust: none;
        -moz-text-size-adjust: none;
        -ms-text-size-adjust: none;
        -o-text-size-adjust: none;
        text-size-adjust: none;

        > .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 36px;
          line-height: 36px;
          padding-left: 20px;
          margin-left: 10px;
          color: #1f2d3d;
          border-bottom: 1px solid #e8e8e8;
          cursor: pointer;

          &:hover {
            background: #f7f7f7;
          }
          .Match {
            display: block;
            height: 25px;
            line-height: 25px;
            padding: 0px 10px;
            background: #F56C6C;
            color: #fff;
            font-size: 10px;
          }
          .Matchs {
            padding: 2px 23px;
          }
        }
      }
    }

    .people-descript {
      .list {
        top: 56px;

        .peopleDes-item {
          display: flex;
          justify-content: space-between;
          padding: 0 20px;

          span {
            position: static;
          }

          .el-input {
            width: 100px;
            line-height: 32px;
            height: 32px;
          }
        }

        .peopleDes-item:nth-child(1) {
          color: #449d44;
          font-weight: bold;
        }
      }
    }

    .notice {
      background: transparent;
      padding: 0;
      > .notice-head {
        width: 260px;
        padding: 10px;
        background: white;

        > .text-area {
          margin-top: 10px;
          textarea {
            height: 150px;
          }
        }
      }

      > .notice-btn {
        margin-top: 40px;

        > button {
          display: block;
          width: 100%;
        }

        button.time-release {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 38px;
          padding: 0;
          line-height: 38px;
          text-align: center;
          color: white;
          background: rgba(8, 43, 70, 0.9);
          border-color: rgba(8, 43, 70, 0.9);

          &:hover {
            background: lighten(rgba(8, 43, 70, 0.9), 5%);
          }

          i {
            margin-right: 6px;
          }
        }

        button.back {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          color: rgba(8, 43, 69, 0.9);

          &:hover {
            color: darken(rgba(8, 43, 69, 0.9), 5%);
          }

          img {
            margin-right: 6px;
          }
        }
      }
    }

    .el-dialog__wrapper {
      padding: 0;
      margin: 0;
      background: transparent;
    }
  }
}
.v-modal {
  z-index: 9999 !important;
}
.el-dialog__wrapper {
  z-index: 99999 !important;
}
.el-message-box__wrapper {
  z-index: 99999 !important;
}
.el-popper {
  z-index: 99999 !important;
}
.MatchDialogList {
  width: 300px;
  height: 230px;
  overflow: auto;
  border: 1px solid #E3E3E3;
  margin: 0px auto;
  padding: 5px;
  margin-top: 10px;
  li {
    padding: 2px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      border-radius: 50%;
      margin-right: 10px;
    }
    &:hover {
      background: $theme;
      color:#fff;
    }
    &.MatchSelect {
      background: $theme;
      color:#fff;
    }
  }
}

</style>
