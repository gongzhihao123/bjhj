<template>
  <div class="add">
    <div class="container">
      <div class="add-box"  v-if="oneMore === 0" >
        <div class="excel">
          <img src="../../assets/images/excel.png" alt="">          
        </div>
        <p class="title">直接上传你日常使用的工资表</p>
        <p class="notice">注意：第一行作为表头，不要留空或合并单元格</p>
        <p class="mouth">
          <span>发薪月份</span>
          <el-select v-model="year" placeholder="请选择">
            <el-option
              v-for="item in yearList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-select v-model="month" placeholder="请选择" style="margin-left: 8px;">
            <el-option
              v-for="item in monthList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
        <p class="btn">
          <!-- <button><img src="../../assets/images/add-upload.png" alt="">上传工资表</button> -->
          <el-upload
            class="upload-demo"
            :action="urlFile"
            :on-success="handleSuccess"
            :data='updates'
            accept="application/msexcel, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            :before-upload="handeBefore"
            :show-file-list="false">
            <button :disabled='wait'>
              <span v-if="!wait">
                <img src="../../assets/images/add-upload.png" alt="">上传工资表
              </span>
              <span v-else class="waitLoading">
                <i class="el-icon-loading"></i>
              </span>
            </button>
          </el-upload>
        </p>
      </div>
      <div class="add-box" v-else-if="oneMore === 1">
        <div class="excel">
          <i class="el-icon-circle-check"></i>          
        </div>
        <p class="title">发送成功</p>
        <button class="iconHand" @click="history"><span>前往查看</span><img  src="../../assets/images/hand.png" alt=""></button>
      </div>
       <div class="add-box" v-else-if="oneMore === 2">
        <div class="excel">
          <i class="el-icon-circle-check"></i>          
        </div>
        <p class="title">发送时间设置成功</p>
        <p class="notice">{{ date }}</p>
        <button class="iconHand" @click="history"><span>前往查看</span><img  src="../../assets/images/hand.png" alt=""></button>
      </div>
    </div>

    <!--  姓名列 or 实发金额列-->
    <el-dialog
      :visible.sync="totalDia"
      custom-class="total-dialog"
      width="600px">
      <span slot="title" class="el-dialog__title">
        <span>{{peopleFlag ? '请选择姓名列' : '请选择实发金额列' }}</span>
        <br/>
        <span class="tip">请在上传的表头中选择与‘{{ peopleFlag ? '姓名' : '实发金额' }}’匹配的选项</span>
      </span>
      <div class="list-box">
        <li 
          v-for="(item,index) in totalList" 
          :key="index" 
          class="item" 
          @click="select(item)"
          :class="{'select-item': item.select}">
          <span>{{ item.name }} </span>
          <p>{{ item.content }}</p>
          <i :class="{'selected': item.select}"></i>
        </li>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="nameClick()" :disabled="disName" >确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="姓名匹配出错 （请手动匹配）"
      :visible.sync="nameDia"
      custom-class="name-dialog"
      width="780px">
      <div class="people">
        <div class="excel-people">
          <p class="title">您上传表格中有重名姓名 请进行手动匹配</p>
          <div class="people-list" v-if="excelPeople.length">
            <li 
              v-for="(item,index) in excelPeople" 
              :key="index" 
              @click="selectPeople(excelPeople, item)"
              :class="{'select-people': item.select }">
              <span>{{ item.name }}</span>
              <span class="content">{{ item.content }}</span>
            </li>
          </div>
        </div>
        <div class="org-people" v-if="orgPeople.length">
          <p class="title">系统组织架构中还未匹配人员名单信息：</p>
          <div class="people-list">
            <li 
              v-for="(item,index) in orgPeople" 
              :key="index" 
              @click="selectPeople(orgPeople, item)"
              :class="{'select-people': item.select }">
              <span class="name">
                <img :src='item.userface' alt="" wdith="25" height="25" v-if="item.userface">
                <img src='../../assets/images/people.png' alt="" wdith="25" height="25" v-else>
                <span>{{ item.name }}</span>
              </span>
              <span class="grade">{{ item.position }}</span>
            </li>
          </div>
        </div>
        <div class="org-people" v-else>
          <p class="title">系统组织架构中还未匹配人员名单信息：</p>
          <div class="people-list">
            <li>无数据</li>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="match()" :disabled="disPeoBtn">确 定</el-button>
      </div>  
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="configuration"
      width="422px"
      top="300px">
      <span>是否沿用上一次的配置</span>
      <span slot="footer" class="dialog-footer">
        <div>
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" :disabled="!waitRepeat" @click="determines">
            <span>确 定</span>
          </el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as config from '@/config.js'
// 逻辑判断基本完成 先使用索引代替列名 无人员代码  只有 列表号
export default {
  name: 'add',

  data () {
    return {
      year: '',
      month: '',
      yearList: [],
      monthList: [],
      excelList: [],
      architecture: [],
      peopleFlag: true, // 姓名列
      totalFlag: false, // 实发金额匹配
      totalList: [],
      excelPeople: [],
      orgPeople: [],
      infoArr: [],
      totalDia: false,
      nameDia: false,
      disPeoBtn: true,
      disName: true,
      nameColumn: '姓名',
      amount: '实发金额',
      column: [],
      configuration: false,
      falseName: '',
      falseColumn: '',
      lastTime: false, // 是否沿用上一次工资
      wait: false,
      waitRepeat: true,
      firstFlag: false // 是否第一次上传
    }
  },
  computed: {
    updates () {
      return {
        month: this.year.toString() + (this.month >= 10 ? this.month.toString() : '0' + this.month.toString())
      }
    },
    oneMore () {
      return this.$store.state.release.oneMore
    },
    date () {
      return this.$store.state.release.date
    },
    urlFile () {
      return config.API_ROOT + '/manager/salarySave'
    }
  },
  methods: {
    handleSuccess (res, file) {
      this.wait = false
      this.excelList = res.result.parseExcel
      this.infoArr = res.result.selectOptionList
      this.column = res.result.salaryUserList
      this.firstFlag = res.result.firstFlag
      if (res.result.firstFlag) {
        if (res.result.parseExcel[0][this.nameColumn]) {
          if (res.result.parseExcel[0][this.amount]) {
            this.determine()
            // 在这里面进行重名的操作
          } else {
            this.nameJudgment('实发金额列', false)
            this.peopleFlag = false
          }
        } else {
          this.nameJudgment('姓名列', true)
        }
      } else {
        this.configuration = true
      }
      this.falseName = res.result.settingName
      this.falseColumn = res.result.settingTotal
    },
    cancel () {
      this.lastTime = true
      this.waitRepeat = false
      if (this.excelList[0][this.nameColumn]) {
        if (this.excelList[0][this.amount]) {
          this.determine()
          // 在这里面进行重名的操作
        } else {
          this.nameJudgment('实发金额列', false)
          this.peopleFlag = false
        }
      } else {
        this.nameJudgment('姓名列', true)
      }
      this.configuration = false
    },
    determines () {
      this.lastTime = false
      this.nameColumn = this.falseName
      this.amount = this.falseColumn
      this.configuration = false
      this.waitRepeat = false
      this.determine()
    },
    // 这是判断表头的函数
    nameJudgment (name, bool) {
      this.$alert(`<p style="color:red">系统未能在您的表单中自动检测到${name}，需要您进行手动匹配.</p>`, '系统提示', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.totalList = []
        for (let i in this.excelList[0]) {
          if (i === 'rowNo') {
            continue
          }
          this.totalList.push({name: i, content: '', select: false})
        }
        for (let i = 0; i < this.totalList.length; i++) {
          for (var j = 0; j < this.excelList.length; j++) {
            this.totalList[i].content += this.excelList[j][this.totalList[i].name] + ','
          }
        }
        this.peopleFlag = bool
        this.totalDia = true
      })
    },

    handeBefore (file) {
      this.wait = true
      var reg = new RegExp(/[.xlsx.xls.XLSX.XLS]$/)
      if (!reg.test(file.name)) {
        this.$alert(`<p style="color:red">请上传xlsx文件或者xls文件</p>`, '系统提示', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        })
      }
      this.updates.uploadFile = file
      // this.$store.dispatch('update')
    },

    select (item) {
      this.totalList.forEach(item => { item.select = false })
      item.select = true
      this.disName = false
    },

    selectPeople (list, item) {
      list.forEach(item => { item.select = false })
      item.select = true
      const exPeo = this.excelPeople.find(item => !!item.select)
      const orgPeo = this.orgPeople.find(item => !!item.select)
      if (exPeo && orgPeo) this.disPeoBtn = false
    },

    nameClick () {
      if (this.peopleFlag) {
        this.nameColumn = this.totalList.filter((item) => item.select === true)[0].name
        this.totalDia = false
        if (this.excelList[0][this.amount]) {
          this.determine()
          // 这里面存放判断是否重名的操作
        } else {
          this.totalDia = false
          this.peopleFlag = false
          this.nameJudgment('实发金额列', false)
        }
      } else {
        this.amount = this.totalList.filter((item) => item.select === true)[0].name
        this.totalDia = false
        this.determine()
      }
    },
    // 这是判读重名
    determine () {
      if (this.lastTime) {
        this.excelPeople = []
        this.orgPeople = []
        this.excelList.forEach((item, index) => {
          if (item[this.nameColumn]) {
            let excal = JSON.parse(JSON.stringify(this.excelList))
            let repeats = this.infoArr.filter(data => data.name === item[this.nameColumn])
            excal.splice(index, 1)
            let repeat = excal.filter(data => data[this.nameColumn] === item[this.nameColumn])
            if (repeat.length !== 0) {
              this.excelList.forEach((data, index) => {
                if (data[this.nameColumn] === item[this.nameColumn]) {
                  this.excelList.splice(index, 1)
                }
              })
              if (repeats.length) {
                this.orgPeople.push(...repeats)
              }
              this.excelPeople.push(...repeat, item)
            }
          }
        })
        this.excelList = this.excelList.filter(item => Boolean(item[this.nameColumn]))
        this.infoArr.forEach((item, index) => {
          let infoPeo = JSON.parse(JSON.stringify(this.infoArr))
          infoPeo.splice(index, 1)
          let repeat = infoPeo.filter(data => data.name === item.name)
          if (repeat.length !== 0) {
            this.infoArr.forEach((data, index) => {
              if (data.name === item.name) {
                this.infoArr.splice(index, 1)
              }
            })
            let excel = this.excelPeople.filter(data => data[this.nameColumn] === item.name)
            if (!excel.length) {
              this.excelList.forEach((data, index) => {
                if (data[this.nameColumn] === item.name) {
                  this.excelPeople.push(data)
                }
              })
            }
            let columnPeople = this.orgPeople.filter(data => data.name === item.name)
            if (!columnPeople.length) {
              this.orgPeople.push(...repeat, item)
            }
          }
        })
        this.excelPeople.forEach((item, index) => {
          var content = []
          for (let i in item) {
            if (i !== this.nameColumn) {
              content.push(item[i])
            }
          }
          this.excelPeople[index] = {
            name: item[this.nameColumn],
            content: content.join(','),
            select: false,
            numbering: index
          }
        })
        if (this.excelPeople.length) {
          this.waitRepeat = true
          this.nameDia = true
        } else {
          this.$store.dispatch('payBill', {
            excal: this.excelList,
            info: this.infoArr,
            name: this.nameColumn,
            amount: this.amount,
            id: this.excalId,
            months: this.updates.month
          })
          this.$router.push({path: '/release'})
        }
      } else {
        this.waitRepeat = true
        const excalHeader = []
        this.excelList.forEach(item => {
          if (item[this.nameColumn] || item[this.nameColumn] === 0) {
            console.log(this.nameColumn)
            console.log(item)
            excalHeader.push(true)
          } else {
            excalHeader.push(false)
          }
          let match = this.column.filter(data => data.userName === item[this.nameColumn] && data.rowNo === item.rowNo)
          if (match.length) {
            item.userId = match[0].userId
          }
        })
        if (excalHeader.includes(false)) {
          if (!this.firstFlag) {
            this.$alert(`<p style="color:red">您这次上传的工资单与上次不符 请重新进行配置</p>`, '系统提示', {
              confirmButtonText: '确定',
              dangerouslyUseHTMLString: true
            })
          } else {
            this.$store.dispatch('payBill', {
              excal: this.excelList,
              info: this.infoArr,
              name: this.nameColumn,
              amount: this.amount,
              id: this.excalId,
              months: this.updates.month
            })
            this.$router.push({path: '/release'})
          }
        } else {
          this.$store.dispatch('payBill', {
            excal: this.excelList,
            info: this.infoArr,
            name: this.nameColumn,
            amount: this.amount,
            id: this.excalId,
            months: this.updates.month
          })
          this.$router.push({path: '/release'})
        }
      }
    },

    match () {
      // 这是匹配是否有重名的函数  在这一步的思路有 当每点击一对的时候要给上传的excel表中的数据加上系统上的的人员代码属性
      // 现在是要进行向
      if (this.excelPeople.length === 1) {
        this.nameDia = false
        this.waitRepeat = true
        this.$store.dispatch('payBill', {
          excal: this.excelList,
          info: this.infoArr,
          name: this.nameColumn,
          amount: this.amount,
          id: this.excalId,
          months: this.updates.month
        })
        this.$router.push({path: '/release'})
      }
      this.excelPeople.forEach((i, ind) => {
        if (i.select) {
          this.orgPeople.forEach((item, index) => {
            if (item.select) {
              this.excelList.forEach((value, key) => {
                if (key === i.numbering) {
                  this.excelList[key].userId = item.numbering
                }
              })
              this.orgPeople.splice(index, 1)
            }
          })
          this.excelPeople.splice(ind, 1)
        }
      })
    },
    // 跳转到历史管理的页面
    history () {
      this.$router.push({path: '/history', query: {months: this.$store.state.release.publishSelect.month}})
    }
  },

  created () {
    this.year = new Date().getFullYear()
    this.yearList = [this.year - 1, this.year, this.year + 1]
    this.month = new Date().getMonth() + 1
    for (let i = 0; i < 12; i++) {
      this.monthList.push({ name: `第${i + 1}月`, id: i + 1 })
    }
  }
}
</script>
<style lang="scss">

@import "../../assets/scss/variable.scss";
@import "../../assets/scss/mixin.scss";

.add {
  position: absolute;
  top: 50px;
  bottom: 0;
  width: 100%;
  overflow: hidden;

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    margin: 20px;
    background: $white;

    > .add-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: -100px;
      text-align: center;

      .excel {
        margin-top: 50px;
        width: 178px;
        height: 178px;
        line-height: 178px;
        background: #f9fafc;
        border: 1px solid #c0ccda;
        border-radius: 4px;

        > i {
          line-height: 178px;
          color:#449d44;
          font-size: 75px;
        }
      }

      > .iconHand {
        margin-top: 10px;
        background:#f7f7f7;
        border:1px solid #e8e8e8;
        border-radius:4px;
        width:148px;
        height:35px;
        text-align:center;
        > span {
          vertical-align: middle;
          font-family:MicrosoftYaHei;
          font-size:14px;
          color:#449d44;
          letter-spacing:0px;
        }
        > img {
          vertical-align: middle;
          width: 24px;
          height: 16px;
          margin-left: 5px;
        }
      }

      > .title {
        margin-top: 20px;
        font-size: 20px;
        color: #4a4a4a;
      }

      > .notice {
        margin-top: 16px;
        font-size: 14px;
        color: #757575;
      }

      > .mouth {
        margin-top: 40px;
        font-size: 14px;
        color: #5e6d82;

        > span {
          margin-right: 14px;            
        }
      }

      > .btn {
        margin-top: 50px;

        button {
          span {
            display: flex;
            align-items: center;
            justify-content: center;
            &.waitLoading {
              font-size: 25px;
            }
          }
          width: 210px;
          height: 38px;
          padding: 0;
          line-height: 38px;
          text-align: center;
          color: white;
          background: rgba(8,43,70,0.90);
          border-color: rgba(8,43,70,0.90);

          &:hover {
            background: lighten(rgba(8,43,70,0.90), 5%);
          }

          img {
            margin-right: 10px;
          }
        }
      }
    }
  }

.el-dialog.total-dialog {

  .el-dialog__header {
    padding-bottom: 0;
    margin-bottom: 10px;

    .tip {
      margin-top: 10px;
      color: #757575;
      line-height: 16px;
      font-size: 12px;
      font-weight: normal;
    }
  }

  .el-dialog__body {
    max-height: 400px;
    overflow: auto;
    padding: 0;

    > .list-box {
      border-top: 1px solid #efeff4;
      
      > .item {
        position: relative;
        display: flex;
        align-items: center;
        height: 46px;
        border-bottom: 1px solid #efeff4;
        cursor: pointer;

        &.select-item,
        &:hover {
          background: $theme;
          color: $white;

          span {
            color: $white;
          }

          p {
            color: $white;
          }
        }

        > span {
          display: block;
          width: 100px;
          margin-left: 26px;
          font-size: 14px;
          color: #1f2d3d;
          @include text-overflow();
        }

        > p {
          margin-left: 10px;
          font-size: 12px;
          color: #999999;
          width: 340px;
          @include text-overflow();
        }

        > i {
          display: block;
          position: absolute;
          top: 50%;
          right: 40px;
          z-index: 20;
          width: 16px;
          height: 16px;
          cursor: pointer;	
          @include transform(translateY(-50%));

          &:before, &:after {
            @include def;
            right: 1px;
            height: 2px;
            width: 0px;
            border-radius: 1px;
            @include transition(all .25s ease);
          }

          &:before {
            top: 0px;
            background-color: $white;
            @include transform(rotate(-45deg));
            @include transform-origin(top right);
            @include transition-delay(.1s);
          }

          &:after {
            bottom: 0px;
            background-color: $white;
            @include transform(rotate(45deg));
            @include transform-origin(bottom right);
            @include transition-delay(0s);
          }

          &.selected {
            right: 40px;

            &:before, &:after {
              width: 15px;
            }

            &:before {
              top: 2px;
              right: 0;
              @include transition-delay(.25s);
            }

            &:after {
              right: 10px;
              bottom: 2px;
              width: 8px;
              @include transition-delay(.3s);
            }
          }
          }
        }
      }
    }
  }

  .el-dialog.name-dialog {

    > .el-dialog__header {
      padding: 20px 20px 0 20px;
    }

    .el-dialog__body {
      padding: 20px;

      > .people {
        display: flex;
        justify-content: space-between;

        >.excel-people {
          p {
            margin-bottom: 37px;
          }
        }

        > div {
          width: 350px;

          > .title {
            color: #475669;
          }

          > .title-tip {
            font-size: 13px;
            color: #449d44;
          }

          > .people-list {
            margin-top: 10px;
            padding: 6px 0;
            border: 1px solid #d3dce6;
            box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.12), 0px 0px 6px 0px rgba(0,0,0,0.04);
            border-radius: 4px;
            max-height: 360px;
            overflow: auto;

            > li {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 4px 14px;
              line-height: 36px;
              height: 36px;
              cursor: pointer;

              > span {
                display: block;
                width: 90px;
                color: #475669;
                @include text-overflow();
              }

              > span.content {
                display: block;
                width: 200px;
                color: #8492a6;
                @include text-overflow();
              }

              &:hover,
              &.select-people {
                background: $theme;

                span {
                  color: white !important;
                }
              }
            }
          }

          &.org-people {

            > .people-list {
              margin-top: 36px;

              .name {
                display: flex;
                align-items: center;
                width: 120px;

                > span {
                  display: block;
                  color: #475669;
                  @include text-overflow();
                }

                img {
                  border-radius: 50%;
                  margin-right: 8px;
                }
              }

              .grade {
                width: 120px;
                @include text-overflow();
              }
            }
          }
        }
      }
    }
  }
}
</style>
