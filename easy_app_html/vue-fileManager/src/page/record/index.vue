<template>
  <div class="recycling">
    <header>
      <h4>操作记录</h4>
    </header>
    <section class="mainBody">
      <table>
        <thead>
          <tr>
            <td>名称</td>
            <td>所在文件夹</td>
            <td>操作人</td>
            <td>操作</td>
            <td>
              <div class="sortNmae">
                <div>
                  <i class="el-icon-caret-top" @click="TimeRecordTop" :class="ascendTime === true ? 'iclassName' : ''" ></i>
                  <i class="el-icon-caret-bottom" @click="TimeRecordBottom" :class="ascendTime === false ? 'iclassName' : ''"></i>
                </div>
                <div>操作时间</div>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in recordList" :key="index">
            <td>{{ item.fileName}}</td>
            <td>{{ item.folderName ? item.folderName : item.fileName }}</td>
            <td>{{ item.userName }}</td>
            <td>{{ item.operation }}</td>
            <td>{{ item.createdTime | format('yyyy/MM/dd  hh:mm') }}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <footer>
      <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    </footer>
  </div>
</template>
<script>
export default {
  name: 'record',
  data () {
    return {
      currentPage: 1,
      allTotal: 10,
      pageSize: 20,
      pageNo: 1,
      recordList: '',
      ascendTime: ''
    }
  },
  methods: {
    TimeRecordTop () {
      this.ascendTime = true
      this.$store.dispatch('TimeRecord', this.ascendTime)
    },
    TimeRecordBottom () {
      this.ascendTime = false
      this.$store.dispatch('TimeRecord', this.ascendTime)
    },
    async handleCurrentChange (val) {
      this.pageNo = val
      await this.$store.dispatch('getRecord', {
        pageNo: this.pageNo,
        pageSize: 20
      })
      this.allTotal = this.$store.state.record.recordList.totalCount
      this.recordList = this.$store.state.record.recordList.list
    }
  },
  async mounted () {
    await this.$store.dispatch('getRecord', {
      pageNo: this.pageNo,
      pageSize: 20
    })
    this.allTotal = this.$store.state.record.recordList.totalCount
    this.recordList = this.$store.state.record.recordList.list
  }
}
</script>
<style scoped lang='scss'>
.recycling {
  width: 100%;
  height: 100%;
  header {
    width: 100%;
    padding: 10px;
    background: #F0F4F8;
    h4 {
      font-size: 18px;
      margin-left: 5px;
    }
  }
  .operation {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #E3E3E3;
    > div {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    div:nth-child(2) {
      button {
        padding: 0;
        margin-left: 10px;
        width: 55px;
        height: 40px;
        img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  .mainBody {
    width: 100%;
    height: calc(100% - 90px);
    overflow: auto;
    table {
      width: 100%;
      thead {
        user-select:none;
        tr {
          td {
            padding: 20px;
            .sortNmae {
              display: flex;
              align-items: center;
              div:nth-child(1) {
                display: flex;
                flex-direction: column;
                margin-right: 10px;
              }
              i {
                cursor: pointer;
                font-size: 18px;
              }
              .iclassName {
                color: #0099FF;
              }
            }
          }
          border: 1px solid #E3E3E3;
        }
      }
      tbody {
        user-select:none;
        tr {
          border: 1px solid #E3E3E3;
          td {
            padding: 20px;
            img {
              width: 40px;
              height: 40px;
            }
            img + div {
              width: 50%;
              margin-left: 20px;
            }
          }
          &:hover {
            background: #c6e2ff;
          }
        }
      }
    }
  }
  footer {
    width: 100%;
    border-top: 1px solid #E3E3E3;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 30px;
  }
}
</style>
