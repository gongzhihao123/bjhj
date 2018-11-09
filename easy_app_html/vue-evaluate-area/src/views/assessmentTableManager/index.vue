<template>
  <div id="assessment-table-manager">
    <header>
      测评审核设置
    </header>
    <p class="add-button">
      <el-button type="primary" @click="add" icon="el-icon-plus"><i class="el-icon-plus"></i>&nbsp;新增测评表</el-button>
    </p>

    <!-- 测评表列表 -->
    <div class="manager-list">
      <el-row>
        <el-col :span="Number(item.num)" v-for="(item, index) in listTitle" :key="index">{{item.name}}</el-col>
      </el-row>
      <transition-group name="slide-left" mode="out-in">
        <el-row class="list-body" v-for="(item, index) in listBody" :key="index">
          <el-col :span="2">{{index + 1}}</el-col>
          <el-col :span="7">
            <el-popover
              placement="top"
              width="200"
              v-if="item.name.length >= 18" 
              trigger="hover"
              :content="item.name">
              <span slot="reference">{{item.name.slice(0, 18) + '...'}}</span>
            </el-popover>
            <span v-if="item.name.length < 18" >
              {{item.name}}
            </span>
          </el-col>
          <el-col :span="4">{{item.createTime | dateFormatT('yyyy-MM-dd hh:mm:ss')}}</el-col>
          <el-col :span="5">
            <img v-if="item.state === 1" src="../../assets/images/green-point.png">
            <img v-else src="../../assets/images/red-point.png">
            <span v-if="item.state === 0">禁用</span>
            <span v-if="item.state === 1">启用</span>
          </el-col>
          <el-col :span="6">
            <el-button :type="item.state === 1 ? 'warning' : 'success'" @click="startOrEnd(item)">
              <span v-if="item.state === 1">禁用</span>
              <span  v-else>启用</span>
            </el-button>
            <el-button type="primary" @click="edit(item)">编辑</el-button>
            <el-button type="danger" @click="del(item)">删除</el-button>
          </el-col>
        </el-row>
      </transition-group>
      
    </div>
  </div>
</template>

<script>
import querystring from 'querystring'
import { notice, success, error } from '../../api/index'
export default {
  name: 'assessmentTableManager',
  data () {
    return {
      listTitle: [
        {name: '序号', num: '2'},
        {name: '测评表名称', num: '7'},
        {name: '创建日期', num: '4'},
        {name: '状态', num: '5'},
        {name: '操作', num: '6'}
      ],
      listBody: []
    }
  },
  methods: {
    // 编辑
    edit (item) {
      sessionStorage.tableId = item.id
      this.$router.push('/assessmentTableManager/addTable')
    },
    // 删除评测表
    del (item) {
      this.$confirm('此操作将永久删除该测评表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$https.post('/table/delete', querystring.stringify({
          id: item.id
        }))
        .then(res => {
          if (res.data.code === 1) {
            success(this, '删除成功', 1000)
            this.getList()
          } else if (res.data.code === -2) {
            notice(this, res.data.message, 2000)
          }
        })
      })
    },
    // 新增测评表
    add () {
      sessionStorage.tableId = ''
      this.$router.push('/assessmentTableManager/addTable')
      // this.$https.post('/table/add', querystring.stringify({
      //   tabelName: '测评表3'
      // }))
    },
    // 禁用或者启用
    startOrEnd (item) {
      this.$https.post('/table/edit', querystring.stringify({
        id: item.id,
        tableName: '',
        state: item.state === 1 ? 0 : 1
      }))
      .then(res => {
        if (res.data.code === 1) {
          if (item.state === 0) {
            success(this, '启用成功', 1000)
          } else {
            success(this, '禁用成功', 1000)
          }
          this.getList()
        } else if (res.data.code === -2) {
          notice(this, res.data.message, 2000)
        }
      })
    },
    getList () {
      this.$https.get(`/table/list?pageNo=${1}&pageSize=${1000}`)
      .then(res => {
        if (res.data.code === 1) {
          this.listBody = res.data.result.list
        } else if (res.data.code === -2) {
          error(this)
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/main.scss';
#assessment-table-manager{
  header{
    padding: 18px;
    padding-bottom: 13px;
    color: #484848;
    border-bottom: 2px solid #DDD;
    font-size: 14px;
  }

  &>.add-button{
    padding: $width;
    .el-button{
      font-size: 14px;
      span{
        margin-left: 0;
        i{
          margin-right: 10px;
        }
      }
    }
  }

  // 测评表列表
  .manager-list{
    padding-bottom: $width * 5;

    .el-row{
      line-height: 48px;
      border-bottom: 1px solid #E6E6E6;
      color: #333333;
      font-size: 14px;

      img{
        margin-right: $width/2;
      }

      .el-col{
        padding-left: 50px;
        &:last-child,&:first-child{
          text-align: center;
        }
      }
    }

    .list-body:hover{
      background: #F7F7F7;
    }
    
    .el-button{
      font-size: 14px;
    }
  }
}
</style>
