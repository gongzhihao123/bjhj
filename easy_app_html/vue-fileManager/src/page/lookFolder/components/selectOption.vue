<template>
  <div class="selectOption">
    <div class="inputKey">
      <el-input v-model="keyword" @focus="listView" @keydown.native.enter="search" placeholder="请输入关键字"></el-input>
    </div>
    <el-select v-model="type" @focus="listView" @change="typeChange" placeholder="按类型筛选" clearable>
      <el-option
          v-for="item in typeOption"
          :key="item.id"
          :label="item.content"
          :value="item.id">
        </el-option>
    </el-select>
    <el-select v-model="users" @focus="listView" @change="peopleChange" placeholder="按操作人筛选" clearable>
      <el-option
          v-for="item in userOption"
          :key="item.id"
          :label="item.content"
          :value="item.id">
        </el-option>
    </el-select>
    <el-button v-for="(item, index) in viewTypeList" :key="index" @click="ViewAccording(item)"><img :src="item.icon"></el-button>
  </div>
</template>
<script>
import card from '@/assets/image/card.png'
import list from '@/assets/image/list.png'
export default {
  name: '',
  data () {
    return {
      keyword: '',
      type: '',
      users: '',
      typeOption: [{id: 0, content: '文档文件'}, {id: 1, content: '多媒体文件'}, {id: 2, content: '图片文件'}, {id: 3, content: '压缩文件'}, {id: 4, content: '其他类型文件'}],
      userOption: [{id: 0, content: '我操作的'}, {id: 1, content: '他人操作的'}],
      viewType: '',
      viewTypeList: [{type: 0, icon: list}, {type: 1, icon: card}]
    }
  },
  methods: {
    ViewAccording (item) {
      this.$emit('viewType', item.type)
    },
    typeChange () {
      this.$store.dispatch('changeType', this.type)
    },
    peopleChange () {
      this.$store.dispatch('peopleType', this.users)
    },
    search () {
      this.type = ''
      this.users = ''
      this.$store.dispatch('search', {
        keyword: this.keyword
      })
    },
    listView () {
      this.$parent.sameLevel.$emit('listViews')
    }
  },
  mounted () {
    this.$parent.sameLevel.$on('enterThe', value => {
      this.type = ''
      this.users = ''
      this.keyword = ''
    })
  }
}
</script>
<style lang='scss' scoped>
  .selectOption {
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      margin-left: 5px;
      margin-right: 5px;
    }
    button {
      padding: 0;
      margin-left: 10px;
      width: 40px;
      height: 40px;
      img {
        width: 20px;
        height: 20px;
      }
    }
    .inputKey {
      width: 150px;
    }
  }
</style>
