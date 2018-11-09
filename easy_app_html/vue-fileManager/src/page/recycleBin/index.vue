<template>
  <div class="recycling">
    <header>
      <h4>回收站</h4>
    </header>
    <div class="operation">
      <div>
        <el-button @click="empty">清空回收站</el-button>
        <el-button @click="thoroughly">彻底删除</el-button>
      </div>
      <div>
        <el-input  placeholder="请输入文件名称关键字" v-model="keyword" @keydown.enter.native='search'></el-input>
        <el-button v-for="(item, index) in viewTypeList" :key="index" @click="ViewAccording(item)"><img :src="item.icon"></el-button>
      </div>
    </div>
    <section class="mainBody">
      <fileList v-if="viewType === 0" v-on:refresh='refresh' :folderList='folderList' v-on:fileList='filesList' ></fileList>
      <file-card v-else v-on:refresh='refresh' :folderList='folderList' v-on:fileList='filesList'></file-card>
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
import card from '@/assets/image/card.png'
import list from '@/assets/image/list.png'
import fileList from './components/fileList'
import fileCard from './components/fileCard'
export default {
  name: 'recycling',
  data () {
    return {
      currentPage: 1,
      allTotal: 10,
      pageSize: 10,
      viewTypeList: [{type: 0, icon: list}, {type: 1, icon: card}],
      folderList: [],
      pageNo: 1,
      selectFold: [],
      viewType: 0,
      keyword: ''
    }
  },
  components: {
    fileList,
    fileCard
  },
  methods: {
    search () {
      this.$store.dispatch('searchRecycle', this.keyword)
      this.folderList = this.$store.state.recycle.recycleList.list
    },
    async handleCurrentChange (val) {
      this.pageNo = val
      await this.$store.dispatch('getRecye', {
        pageNo: this.pageNo,
        pageSize: 10
      })
      this.allTotal = this.$store.state.recycle.recycleList.totalCount
      this.folderList = this.$store.state.recycle.recycleList.list
    },
    ViewAccording (data) {
      this.viewType = data.type
      if (this.folderList.length) {
        this.folderList.forEach(item => {
          item.show = false
          item.check = false
        })
      }
    },
    filesList (item) {
      this.selectFold = item
    },
    async thoroughly () {
      if (this.selectFold.length) {
        var fileIds = []
        var folderIds = []
        this.selectFold.forEach(item => {
          if (item.show) {
            if (!item.fileId) {
              folderIds.push(item.folderId)
            } else {
              fileIds.push(item.fileId)
            }
          }
        })
        await this.$store.dispatch('thoroughly', {
          fileIds: fileIds.join(','),
          folderIds: folderIds.join(',')
        })
        this.refresh()
      }
    },
    async refresh () {
      await this.$store.dispatch('getRecye', {
        pageNo: this.pageNo,
        pageSize: 10
      })
      this.allTotal = this.$store.state.recycle.recycleList.totalCount
      this.folderList = this.$store.state.recycle.recycleList.list
    },
    empty () {
      this.$confirm(`<span style='color:red'>是否清空回收站？</span>`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('empty')
        this.refresh()
      })
    }
  },
  async mounted () {
    await this.$store.dispatch('getRecye', {
      pageNo: 1,
      pageSize: 10
    })
    this.allTotal = this.$store.state.recycle.recycleList.totalCount
    this.folderList = this.$store.state.recycle.recycleList.list
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
    height: calc(100% - 155px);
    overflow: auto;
  }
  footer {
    width: 100%;
    border-top: 1px solid #E3E3E3;
    height: 49px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 30px;
  }
}
</style>
