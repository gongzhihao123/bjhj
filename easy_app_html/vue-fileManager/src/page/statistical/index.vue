<template>
  <div class="recycling">
    <header>
      <h4>文件统计</h4>
    </header>
    <div class="selectFileList">
      <div>
        <el-cascader
          :options="foldList"
          :props="props"
          clearable
          filterable
          @change='selectFold'
          :change-on-select='true'>
        </el-cascader>
      </div>
    </div>
    <div class='pie'>
      <div>
        <file-number :fileNum='this.fileList' ></file-number>
      </div>
      <div>
        <file-size :fileNum='this.fileList'></file-size>
      </div>
    </div>
    <div class="tablesList">
      <table>
        <thead>
          <tr>
            <td>文件类型</td>
            <td>文件数量</td>
            <td>文件大小</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in fileList" :key="index">
            <td>{{ item.type === 1 ? '图片' :  item.type === 2 ? '文档' : item.type === 3 ? '视频' : item.type === 4 ? '音乐' : item.type === 5 ? '其他' : '' }}</td>
            <td>{{ item.count }}</td>
            <td>{{ item.size | SizeOf }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import fileNumber from './components/fileNumberpie'
import fileSize from './components/fileSizePie'
import { Tree } from './../../utils/tree'
export default {
  name: 'statistical',
  data () {
    return {
      currentPage: 1,
      allTotal: 10,
      pageSize: 20,
      pageNo: 1,
      recordList: '',
      fileList: [],
      list: [
        {
          count: 1,
          size: 1203,
          type: 1,
          typeStr: null
        },
        {
          count: 3,
          size: 1200,
          type: 2,
          typeStr: null
        },
        {
          count: 1,
          size: 10000,
          type: 3,
          typeStr: null
        },
        {
          count: 1,
          size: 1000,
          type: 4,
          typeStr: null
        },
        {
          count: 1,
          size: 1203,
          type: 5,
          typeStr: null
        }
      ],
      foldList: [],
      props: {
        children: 'children',
        label: 'name',
        value: 'id'
      }
    }
  },
  components: {
    fileNumber,
    fileSize
  },
  methods: {
    async selectFold (item) {
      await this.$store.dispatch('getStatistics', {
        folderId: item[item.length - 1]
      })
      this.fileList = this.$store.state.statistics.dataStatistics
    }
  },
  async mounted () {
    await this.$store.dispatch('getStatistics')
    this.fileList = this.$store.state.statistics.dataStatistics
  },
  async beforeCreate () {
    await this.$store.dispatch('folderList')
    this.foldList = new Tree(this.$store.state.foldList).comprehensive(0)
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
  .selectFileList {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content:flex-start ;
    align-content: center;
    padding: 10px;
    border-bottom: 1px solid #E3E3E3;
  }
  .pie {
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    > div {
      width: 40%;
    }
  }
  .tablesList {
    width: 100%;
    height: calc(100% - 505px);
    overflow: auto;
    table {
      width: 100%;
      thead {
        user-select:none;
        tr {
          td {
            padding: 10px;
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
}
</style>
