<template>
  <div class="history">
    <div class="container">

      <!-- 左侧导航 -->
      <div class="nav">
        <ul class="mune">
          <li
            class="mune-item" 
            v-for="(item,index) in mouth" 
            :key="index" 
            @click="open(item, index)"
            :class="{ 'open': index === activeId }">
            {{ item.name }}
            <img src="../assets/images/mune-arrow.png" alt="" class="mune-arrow">
            <el-collapse-transition>
              <ul class="submune" v-show="index === activeId">
                <li
                  class="submune-item"
                  v-for="(submune, n) in item.children"
                  :key="n"
                  @click="subMune(submune, n, item)"
                  :class="{ 'time': submune.timeDate, 'active': submune.node === subActiveId }">
                  {{ submune.name }}
                </li>
              </ul>
            </el-collapse-transition>
          </li>
        </ul>
      </div>
      <div class="nav-right">

        <!-- 人员名单 -->
        <div class="people-list">
          <div>
          <div class="title">
            <div>
              <span>人员名单 <span class="num">共{{ total }}人</span></span>
              <a href="javascript:;" v-if="timeLine" @click="timeDelay"><img src="../assets/images/people-time.png" alt="">定时发送</a>
            </div>
            <div class="info">
              <span class="create-time">创建：{{ createTime }}</span>
              <span class="release-time" v-if="timeLine">发送：{{ releaseTime }}</span>
            </div>
          </div>
          <div class="search">
            <el-input placeholder="请输入姓名查找" v-model="keyword" size="small">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
          <div 
            class="list people-list-box" 
            ref="peopleList"
            :class="{'bit': showFoot}">
            <ul class="scroller">
              <li
                v-for="(item,index) in nPeopleList" 
                :key="index"
                class="people-item item"
                :class="index==itemclick?'itemclicks':''"
                @mouseover="mouseover(item)"
                @mouseout="mouseout(item)"
                @click="selectPeo(item,index)">
                {{ index + 1 }}
                <span class="name">{{ item.name }}</span>
                <transition name="slide-down">
                  <transition-group>
                    <el-checkbox 
                      key="1"
                      v-model="item.checked"
                      v-if="item.showCheck"
                      @change="check(item)"
                      class="item-right">
                    </el-checkbox>
                    <span v-if="item.revoke" key="2" class="item-right">已撤回</span>
                  </transition-group>  
                </transition>
              </li>
            </ul>
          </div>
          <transition name="slide-down" mode="">
            <transition-group name="slide-down" class="list-footer" v-show="showFoot" tag="div">
              <div class="check-foot" key="1" v-if="!revoke">
                <span @click="clearSelect" class="clear">取消选择</span>
                <span @click="submitSelect" class="submit">撤回已选</span>
              </div>
              <div class="revoke-foot" key="2" v-else>
                <span @click="releaseAgain"><img src="../assets/images/send-g.png" alt="">再次发送</span>
              </div>
            </transition-group>
          </transition>
          </div>
        </div>


        <!-- 工资详情 -->
        <div class="people-descript">
          <h3 class="title">
            <span>{{ name }}工资单</span>
            <transition name="fade" mode="">
              <el-button v-show="showBtn" @click="preservation">保存</el-button>
            </transition>
          </h3>
          <div class="list" ref="peopleDescript">
            <ul class="scroller">
              <li 
                v-for="(item,index) in wagesList" 
                :key="index" 
                class="peopleDes-item item"
                @click="item.revoke ? item.show = true : item.show = false; item.revoke ? showBtn = true : showBtn = false">
                <span>{{ item.name }}</span>
                <transition name="slide-down" mode="out-in">
                  <span v-if="!item.show">{{ item.num }}</span>
                  <el-input
                    v-else 
                    v-model.number="item.num" 
                    type="number" 
                    size="small" 
                    v-focus @blur="submit(item)"></el-input>                 
                </transition>

              </li>
            </ul>
          </div>
        </div>

        <!-- 左侧通知 -->
        <div class="notice">
          <a class="download" :download="downloadpPayroll" :href="downloadpPayroll">
            <img src="../assets/images/download.png" alt="download">
            <p>下载工资单</p>
          </a>
          <div class="dele" @click="dele()">
            <img src="../assets/images/delete.png" alt="delete">
            <p><span v-if="timeLine">撤回并</span>删除本工资表</p>
          </div>
          <div class="notice-foot">
            <h3 class="title">公告</h3>
            <div class="notice-content">
              <el-input type="textarea" v-model="content" @blur="submitContent" :maxlength="1000"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="修改发送时间"
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
        <el-button type="primary" @click="historyTime">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import IScroll from 'iscroll/build/iscroll.js'
import { success } from '../utils/handle'
import * as timesDate from '../filters/index'
export default {
  name: 'history',

  data () {
    return {
      activeId: 0,
      subActiveId: 0,
      nPeopleList: [],
      peopleList: [],
      historyDate: [],
      name: '',
      descript: [],
      notice: '',
      total: '',
      keyword: '',
      timeLine: false,
      showFoot: false,
      timeDialog: false,
      revoke: false,
      showBtn: false,
      date: '',
      time: '',
      wagesList: [],
      mouth: [],
      itemclick: 0,
      withdraw: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() <= Date.now()
        }
      },
      myPeoScroll: '',
      myPeoDesScroll: '',
      historytimes: '',
      historyId: '',
      bool: false,
      booa: false,
      prompt: false,
      content: ''
    }
  },
  computed: {
    createTime () {
      return timesDate.format(this.$store.state.history.createdTime, 'yyyy-MM-dd hh:mm')
    },
    releaseTime () {
      return timesDate.format(this.$store.state.history.publishTime, 'yyyy-MM-dd hh:mm')
    },
    downloadpPayroll () {
      if (this.$store.state.history.month.length !== 0) {
        return document.querySelector('#contextPath').value + '/manager/exportSalary?id=' + this.$store.state.history.payroll
      }
    }
  },
  methods: {

    // 一级菜单事件
    open (item, index) {
      // if (this.activeId === index) this.activeId = -1
      // else
      this.activeId = index
    },

    // 二级菜单事件
    async subMune (item, n, index) {
      if (item.timeDate) {
        this.timeLine = true
      } else {
        this.timeLine = false
      }
      var months = ''
      var reg = new RegExp(/['(',')','月']/g)
      var regs = new RegExp(/['(',')']/g)
      if (!regs.test(item.name)) {
        months = index.name + (Number(item.name.replace(reg, '')) > 10 ? Number(item.name.replace(reg, '')) + '1' : '0' + Number(item.name.replace(reg, '')) + '1')
      } else {
        months = index.name + (Number(item.name.replace(reg, '')) > 100 ? Number(item.name.replace(reg, '')) : '0' + Number(item.name.replace(reg, '')))
      }
      this.historytimes = months
      await this.$store.dispatch('enquiries', {month: months})
      this.keyword = ''
      this.content = this.$store.state.history.remark
      this.historyDate = this.$store.state.history.historyDate
      this.total = this.$store.state.history.historyDate.length
      this.peopleList = []
      this.wagesList = []
      this.historyId = this.$store.state.history.historyId
      for (var i = 0; i < this.historyDate.length; i++) {
        var json = {}
        json.name = this.historyDate[i].userName
        json.showCheck = false
        json.checked = false
        json.revoke = this.historyDate[i].state === 2 ? 1 : 0
        this.peopleList.push(json)
      }
      if (this.historyDate.length !== 0) {
        var josn = this.historyDate[0].payroll.replace(/'/g, '"')
        for (var j in JSON.parse(josn)) {
          if (j !== 'rowNo') {
            this.wagesList.push({name: j, num: JSON.parse(josn)[j], show: false})
          }
        }
        this.wagesList.unshift({name: '实发工资', num: this.historyDate[0].totalMoney, show: false})
      }
      this.nPeopleList = this.peopleList
      this.subActiveId = item.node
      this.initPeoScroll()
    },

    // 人员名单，鼠标移出
    mouseout (item) {
      if (!item.checked) item.showCheck = false
    },
    // 人员名单，鼠标移入
    mouseover (itema) {
      this.mouth.map(item => {
        item.children.map(items => {
          if (!items.timeDate && items.node === this.subActiveId) {
            itema.showCheck = true
          }
        })
      })
      if (this.bool) {
        if (!itema.revoke) {
          itema.showCheck = false
        }
      }
      if (this.booa) {
        if (itema.revoke) {
          itema.showCheck = false
        }
      }
      if (!this.bool && !this.booa) {
        itema.showCheck = true
      }
    },

    // 工资详情,
    submit (item) {
      this.historyDate.forEach((items, index) => {
        if (items.userName === this.name) {
          var detail = JSON.parse(items.payroll.replace(/'/g, '"'))
          detail[item.name] = item.num + ''
          items.payroll = JSON.stringify(detail)
        }
      })
      this.showBtn = false
      item.show = false
    },

    // 选择
    check (item) {
      if (item.checked && item.revoke && this.withdraw) {
        this.bool = true
      }
      if (!item.checked && item.revoke && this.withdraw) {
        (this.nPeopleList.map(item => item.checked) || []).includes(true) ? this.bool = true : this.bool = false; this.booa = false
      }
      if (item.checked && !item.revoke && this.withdraw) {
        this.booa = true
      }
      if (!item.checked && !item.revoke && this.withdraw) {
        (this.nPeopleList.map(item => item.checked) || []).includes(true) ? this.booa = true : this.booa = false; this.bool = false
      }
      if (item.checked && item.revoke) {
        this.revoke = true
        setTimeout(() => {
          this.showFoot = (this.nPeopleList.map(item => item.checked) || []).includes(true)
        }, 0)
      } else {
        var arr = []
        this.nPeopleList.forEach((item) => {
          if (item.checked && item.revoke) {
            arr.push(true)
          } else {
            arr.push(false)
          }
        })
        if (arr.includes(true)) {
          this.revoke = true
        } else {
          this.revoke = false
        }
        this.showFoot = (this.nPeopleList.map(item => item.checked) || []).includes(true)
      }
    },

    // 选择人员
    selectPeo (item, index) {
      console.log(item.revoke)
      this.itemclick = index
      this.showBtn = false
      this.name = item.name
      this.wagesList = []
      for (var i = 0; i < this.historyDate.length; i++) {
        if (this.historyDate[i].userName === item.name) {
          var info = this.historyDate[i].payroll.replace(/'/g, '"')
          for (var j in JSON.parse(info)) {
            if (j !== 'rowNo') {
              var num = JSON.parse(info)[j] === '' ? '0' : JSON.parse(info)[j]
              this.wagesList.push({name: j, num: num, show: false, revoke: item.revoke})
            }
          }
          this.wagesList.unshift({name: '实发工资', num: this.historyDate[i].totalMoney, show: false, revoke: item.revoke})
        }
      }
    },

    // 清空选择
    clearSelect () {
      this.nPeopleList.forEach(item => {
        // 没有撤回时，取消选择
        item.showCheck = item.checked = false
      })
      this.revoke = (this.nPeopleList.map(item => item.revoke) || []).includes(true)
      this.showFoot = this.revoke
    },

    // 删除
    dele () {
      if (this.myPeoScroll) this.myPeoScroll.destroy()
      if (this.myPeoDesScroll) this.myPeoDesScroll.destroy()
      this.$confirm('确定删除此工资表吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (this.$store.state.history.payroll) {
          await this.$store.dispatch('dele', {id: this.$store.state.history.payroll})
          success('删除成功')
          this.mouth = []
          this.nPeopleList = []
          this.wagesList = []
          this.monted()
        }
      }).catch(() => {
        this.initPeoScroll()
        this.initPeoDesScroll()
      })
    },

    // 撤回
    submitSelect (item) {
      this.bool = this.booa = false
      if (this.myPeoScroll) this.myPeoScroll.destroy()
      if (this.myPeoDesScroll) this.myPeoDesScroll.destroy()
      this.$confirm('确定撤回人员的工资单吗？', ' 提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.revoke = false
        this.showFoot = false
        this.withdraw = true
        this.infoWithdraw(2, '撤回成功', true)
      }).catch(() => {
        this.initPeoScroll()
        this.initPeoDesScroll()
      })
    },
    // 进行信息的发送 还是撤回
    async infoWithdraw (state, info, revoke) {
      var ids = []
      this.nPeopleList.forEach(item => {
        if (item.checked) {
          this.historyDate.forEach(items => {
            if (items.userName === item.name) {
              ids.push(items.id)
            }
          })
          item.revoke = revoke
        }
        item.checked = item.showCheck = false
      })
      await this.$store.dispatch('withdraw', {ids: ids.join(','), state: state})
      success(info)
    },
    // 再次发送
    releaseAgain () {
      this.bool = this.booa = false
      this.$confirm('确定再次发送吗？', ' 提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.revoke = false
        this.showFoot = false
        this.withdraw = false
        this.infoWithdraw(1, '发送成功', false)
      }).catch(() => {})
    },

    // textarea
    async submitContent () {
      if (this.content) {
        var json = {}
        json.id = this.historyId
        json.remark = this.content
        await this.$store.dispatch('historyTime', json)
        success(this.$store.state.history.messageTime)
      }
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
    // 信息保存的函数
    async preservation () {
      const json = {}
      json.payroll = {}
      for (var i = 0; i < this.wagesList.length; i++) {
        if (this.wagesList[i].name !== '实发工资') {
          json.payroll[this.wagesList[i].name] = this.wagesList[i].num
        } else {
          json.totalMoney = this.wagesList[i].num
        }
      }
      json.payroll = JSON.stringify(json.payroll).replace(/"/g, "'")
      this.historyDate.forEach((item, index) => {
        if (item.userName === this.name) {
          json.id = item.id
        }
      })
      await this.$store.dispatch('preservation', json)
      success(this.$store.state.history.preserV)
      this.showBtn = false
      // 判段 是否保存成功 然后调用utils中的handle状态函数！！
    },
    // 延时定时发送
    async historyTime () {
      if (this.myPeoDesScroll) this.myPeoDesScroll.destroy()
      if (this.myPeoScroll) this.myPeoScroll.destroy()
      var str = this.date + this.time
      var date = timesDate.format(new Date().getTime(), 'yyyy:MM:ddhh:mm')
      if (Number(str.split('-').join('').split(':').join('')) < Number(date.split(':').join(''))) {
        this.time = ''
        this.date = ''
        this.timeDialog = false
        this.prompt = true
        this.$alert('请正确输入定时的时间', '提示', {
          confirmButtonText: '确定'
        }).then(() => {
          this.prompt = false
          this.timeDialog = true
        })
      }
      if (this.timeDialog) {
        var timeDate = this.date + ' ' + this.time
        var json = {}
        json.id = this.historyId
        json.publishTime = timeDate
        await this.$store.dispatch('historyTime', json)
        success(this.$store.state.history.messageTime)
        this.timeDialog = false
      }
    },
    // 重新进行数据获取的函数
    async monted () {
      await this.$store.dispatch('search')
      this.mouth = []
      if (this.$store.state.history.month.length !== 0) {
        var month = this.$store.state.history.month.sort((a, b) => {
          return (Number(b.month.toString().substr(0, 4)) * 100 + Number(b.month.toString().substr(4, 2))) - (Number(a.month.toString().substr(0, 4)) * 100 + Number(a.month.toString().substr(4, 2)))
        })
        var arr = []
        month.forEach((item, index) => {
          arr.push(item.month.toString().substr(0, 4))
        })
        arr = Array.from(new Set(arr))
        arr = arr.sort((a, b) => {
          return Number(b) - Number(a)
        })
        var sorting = []
        arr.forEach((item, index) => {
          sorting.push([])
          month.forEach(items => {
            if (item === items.month.toString().substr(0, 4)) {
              sorting[index].push(items)
            }
          })
        })
        month = []
        sorting.forEach((item) => {
          item.sort((a, b) => {
            return (Number(Number(b.month.toString().substr(4, b.month.toString().length)))) - (Number(Number(a.month.toString().substr(4, b.month.toString().length))))
          })
          item.forEach(item => {
            month.push(item)
          })
        })
        const months = this.$route.query.months ? this.$route.query.months : month[0].month
        this.historytimes = months
        for (var s = 0; s < arr.length; s++) {
          this.mouth.push({name: arr[s], children: []})
        }
        console.log(this.mouth)
        month.forEach((item, index) => {
          this.mouth.forEach((value, ind) => {
            if (value.name === item.month.toString().substr(0, 4)) {
              value.children.push({
                name: Number(item.month.toString().substr(4, 2)) + '月' + (Number(item.month.toString().substr(6, item.month.toString().length)) === 1 ? '' : '(' + Number(item.month.toString().substr(6, item.month.toString().length)) + ')'),
                id: 1,
                timeDate: item.publishTime > new Date().getTime() + 60000 ? 1 : 0,
                node: index })
            }
          })
        })
        if (this.$route.query.months) {
          month.forEach((item, index) => {
            if (item.month === Number(this.$route.query.months)) {
              this.subActiveId = index
            }
          })
        } else {
          this.subActiveId = 0
        }
        await this.$store.dispatch('enquiries', {month: months})
        this.content = this.$store.state.history.remark
        if (month[0].publishTime > new Date().getTime()) {
          this.timeLine = true
        } else {
          this.timeLine = false
        }
        this.total = this.$store.state.history.historyDate.length
        this.historyDate = this.$store.state.history.historyDate
        if (this.historyDate.length !== 0) {
          for (var i = 0; i < this.historyDate.length; i++) {
            var json = {}
            json.name = this.historyDate[i].userName
            json.id = this.historyDate[i].id
            json.showCheck = false
            json.checked = false
            json.revoke = this.historyDate[i].state === 2 ? 1 : 0
            this.peopleList.push(json)
            if (this.historyDate[i].state === 2) {
              this.withdraw = true
            }
          }
          this.historyId = this.$store.state.history.historyId
          var detail = JSON.parse(this.historyDate[0].payroll.replace(/'/g, '"'))
          this.name = this.historyDate[0].userName
          for (var j in detail) {
            if (j !== 'rowNo') {
              var num = detail[j] === '' ? '0' : detail[j]
              this.wagesList.push({name: j, num: num, show: false})
            }
          }
          this.wagesList.unshift({name: '实发工资', num: this.historyDate[0].totalMoney, show: false})
          this.nPeopleList = this.peopleList
          this.initPeoScroll()
          this.initPeoDesScroll()
        }
      } else {
        if (this.myPeoDesScroll) this.myPeoDesScroll.destroy()
        if (this.myPeoScroll) this.myPeoScroll.destroy()
      }
    },
    timeDelay () {
      if (this.myPeoDesScroll) this.myPeoDesScroll.destroy()
      if (this.myPeoScroll) this.myPeoScroll.destroy()
      this.timeDialog = true
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

  watch: {
    keyword (val) {
      this.nPeopleList = this.peopleList.filter(item => item.name.indexOf(val) !== -1)
      if (this.nPeopleList.length === 0) {
        this.nPeopleList = [{name: '抱歉，搜索不到'}]
      }
      this.initPeoScroll()
    },
    timeDialog () {
      if (this.timeDialog === false) {
        if (!this.prompt) {
          this.initPeoScroll()
          this.initPeoDesScroll()
        }
      }
    }
  },

  mounted () {
    this.monted()
  }
}
</script>

<style lang="scss">

@import "../assets/scss/variable.scss";

.history {
  position: absolute;
  top: 50px;
  bottom: 0;
  width: 100%;

  .container {
    display: flex;
    margin: 20px;
    height: calc(100% - 40px);

    > .nav {
      margin-left: 20px;
      width: 180px;
      min-width: 180px;
      max-height: 100%;
      overflow: auto;
      background: transparent;

      > .mune {
        position: relative;
        margin-top: 20px;
        padding-left: 20px;
        padding-right: 10px;

        &::before {
          content: "";
          width: 2px;
          position: absolute;
          left: 20px;
          top: 10px;
          bottom: 20px;
          background-color: rgba(8, 43, 70, 0.15);
        }

        > .mune-item {
          position: relative;
          margin-left: 20px;
          line-height: 36px;
          font-size: 16px;
          color: #1f2d3d;
          cursor: pointer;

          .mune-arrow {
            position: absolute;
            left: -26px;
            top: 10px;
          }

          &.open {
            .mune-arrow {
              transform: rotate(180deg);
            }
          }
        }

        .submune-item {
          position: relative;
          padding-left: 10px;
          margin: 4px 0;
          line-height: 36px;
          font-size: 16px;
          color: #1f2d3d;
          border-radius: 46px;
          cursor: pointer;

          &::before {
            content: '';
            display: block;
            position: absolute;
            top: 14px;
            left: -22px;
            width: 7px;
            height: 7px;
            background: url('../assets/images/submune.png');
          }

          &.time {
            color: #475669;
            font-weight: bold;

            &::before {
              width: 10px;
              height: 10px;
              left: -24px;
              background: url('../assets/images/mune-time.png');
            }

          }

          &.active,
          &:hover {
            background: $theme;
            color: $white;
          }
        }
      }
    }

    .nav-right {
      display: flex;
      margin-left: $width;
      width: 100%;
      min-width: 1100px;
      height: 100%;
      border: 1px solid #d8d8d8;
      border-radius: 5px;
      overflow-y: auto;

      > div {
        padding: 13px;
        border-right: 1px solid #d8d8d8;

        .title {
          height: 60px;
          padding: 7px 14px;
          font-size: 16px;
          font-weight: bold;
          color: rgba(8, 43, 69, 0.9);
          border-bottom: 1px solid rgba(8, 43, 70, 0.15);
          border-radius: 5px 5px 0 0;
          background: #e8e8e8;

          > div {
            display: flex;
            justify-content: space-between;
            align-items: center;

            &:nth-child(1) {
              margin-top: 6px;

              a {
                display: flex;
                align-items: center;
                font-weight: normal;
                color: rgba(8, 43, 69, 0.9);
                font-size: 14px;

                img {
                  margin-right: 8px;
                }
              }
            }

            &.info {
              margin-top: 4px;
              font-size: 12px;
              font-weight: normal;
              color: #5e6d82;
            }
          }

          span.num {
            font-size: 12px;
            color: #5e6d82;
          }
        }

        .search {
          padding: 4px;
          text-align: center;
          background: $white;

          .el-input__inner {
            text-align: center;
          }

          .el-input-group__append {
            background: #f7f7f7;
          }

          button {
            margin: 1px 0;
            padding: 0;
          }
        }
      }

      > div.people-list,
      > div.people-descript {
        box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04);
        position: relative;
        width: 38%;
        overflow: hidden;
      }

      .people-lis > div {
        height: 100%;
        background: white;
      }


      .list {
        position: absolute;
        width: calc(100% - 25px);
        bottom: 13px;
        margin-bottom: 32px;
        top: 110px;
        overflow: hidden;
        background: $white;
        box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04);


        .scroller {
          position: absolute;
          z-index: 1;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          width: calc(100%);
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
            position: relative;
            height: 36px;
            line-height: 36px;
            padding-left: 20px;
            color: #1f2d3d;
            border-bottom: 1px solid #e8e8e8;
            cursor: pointer;

            &:hover {
              background: #f7f7f7;
            }

            span.name {
              position: absolute;
              left: 190px;
            }

            .item-right {
              position: absolute;
              top: 2px;
              right: 20px;
            }

            span.item-right {
              right: 40px;
              top: 0;
              color: rgba(8, 43, 69, 0.9);
            }
          }
        }
      }

      .itemclicks {
        background: #f7f7f7;
      }

      .list-footer {
        position: absolute;
        bottom: 13px;
        height: 38px;
        width: calc(100% - 26px);
        padding: 0 15px;
        line-height: 38px;
        background: #e8e8e8;
        z-index: 999;
        text-align: right;

        span {
          cursor: pointer;
        }

        > .check-foot {

          > .clear {
            color: #757575;
            margin-right: 10px;
          }

          > .submit {
            color: rgba(8, 43, 69, 0.9);
          }
        }

        > .revoke-foot {
          font-size: 16px;
          color: #449d44;
          text-align: center;

          > span {
            display: flex;
            align-items: center;
            justify-content: center;

            > img {
              margin-right: 10px;
            }
          }
        }
      }

      > .people-descript {

        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 50px;

          > button {
            padding: 4px 14px;
            height: 36px;
          }
        }

        .list {
          top: 73px;
          margin: 0;

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

      > .notice {
        width: 24%;
        border: 0;

        > .download,
        > .dele {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          height: 26%;
          color: white;
          background: rgba(8, 43, 70, 0.9);
          border-radius: 4px;
          box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04);
          margin-bottom: 20px;
          cursor: pointer;

          &:hover {
            background: lighten(rgba(8, 43, 70, 0.9), 5%);
          }

          > p {
            margin-top: 3%;
            font-size: 18px;
            color: rgba(255, 255, 255, .71);
          }
        }

        > .notice-foot {
          height: calc(100% - 26% - 26% - 40px);

          > .title {
            height: 36px;
            line-height: 22px;
          }

          > .notice-content {
            height: calc(100% - 36px);
            box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04);
            background: white;
            overflow: auto;
            font-size: 13px;
            color: #475669;
            line-height: 20px;

            .el-textarea {
              height: 100%;
            }

            textarea {
              border: 0;
              height: 100%;
            }

          }
        }
      }
    }
  }
}
</style>
