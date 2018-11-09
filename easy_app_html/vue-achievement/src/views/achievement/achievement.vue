<template>
  <div class="achievement">
    <div class="common-css">
      <div class="left-menu">
        <el-tree  :data="tree"
                  :props="defaultProps"
                  highlight-current
                  accordion
                  @node-click="handleClick"
                  node-key="id"
                  :render-content="renderContent"
                  :default-expanded-keys="def"
                  :current-node-key="defId"></el-tree>
      </div>

      <div class="right">
        <div class="title">
          <span>成绩分析</span>
          <i class="el-icon-arrow-right"></i>
          <span>{{ parentName }}</span>
          <i class="el-icon-arrow-right" v-if="name"></i>
          <span>{{ name }}</span>   
        </div>

        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'achievement',

  data () {
    return {
      tree: [
        {
          label: '教科研中心分析报告',
          id: 1,
          children: [
            { label: '总分分布分析', path: '/achievement/1/1', id: 11 },
            { label: '学生总分查询', path: '/achievement/1/2', id: 12 },
            { label: '总分分数段学校人数分布表', path: '/achievement/1/3', id: 13 },
            { label: '总分等级分布', path: '/achievement/1/4', id: 14 },
            { label: '分档上线人数学科分布', path: '/achievement/1/5', id: 15 },
            { label: '学校学科水平分析', path: '/achievement/1/6', id: 16 },
            { label: '学校学科平均分分析', path: '/achievement/1/7', id: 17 },
            { label: '学科优良等级分析', path: '/achievement/1/8', id: 18 },
            { label: '重点群体分析', path: '/achievement/1/9', id: 19 },
            { label: '重点群体学科水平的学校分布', path: '/achievement/1/10', id: 110 },
            { label: '总分等级人数分布发展变化', path: '/achievement/1/11', id: 111 },
            { label: '总体学科水平发展变化', path: '/achievement/1/12', id: 112 },
            { label: '学校教学增值分析', path: '/achievement/1/13', id: 113 }
          ]
        },
        {
          label: '学科教研员',
          id: 2,
          children: [
            { label: '学科难度曲线图', path: '/achievement/2/1', id: 21 },
            { label: '学科（试题结构）分析指标明细表', path: '/achievement/2/2', id: 22 },
            { label: '学科总分分布', path: '/achievement/2/3', id: 23 },
            { label: '学生学科总分查阅', path: '/achievement/2/4', id: 24 },
            { label: '学科分档上线人数分布', path: '/achievement/2/5', id: 25 },
            { label: '学科分档上线群体的学校水平分析', path: '/achievement/2/6', id: 26 },
            { label: '学科优良等级学校分布', path: '/achievement/2/7', id: 27 },
            { label: '学校学科水平结构分析', path: '/achievement/2/8', id: 28 },
            { label: '学校学科平均分分析', path: '/achievement/2/9', id: 29 },
            { label: '学科总体的结构分析', path: '/achievement/2/10', id: 210 },
            { label: '学科试题分析', path: '/achievement/2/11', id: 211 },
            { label: '试题区分度难度坐标图（学校表现）', path: '/achievement/2/12', id: 212 },
            { label: '学校学科水平发展变化', path: '/achievement/2/13', id: 213 },
            { label: '学校学科内在结构水平的发展变化', path: '/achievement/2/14', id: 214 },
            { label: '学科考试诊断分析要点', path: '/achievement/2/15', id: 215 }
          ]
        },
        {
          label: '学校分析',
          id: 3,
          children: [
            { label: '学校分档上线人数分布表', path: '/achievement/3/1', id: 31 },
            { label: '学校总分分布表', path: '/achievement/3/2', id: 32 },
            { label: '学校学生学科总分查阅', path: '/achievement/3/3', id: 33 },
            { label: '学校学科水平分析', path: '/achievement/3/4', id: 34 },
            { label: '学校学科优良等级分析', path: '/achievement/3/5', id: 35 },
            { label: '学校重点群体分析', path: '/achievement/3/6', id: 36 },
            { label: '学校分档上线人数发展变化', path: '/achievement/3/7', id: 37 },
            { label: '学校考试诊断分析要点', path: '/achievement/3/8', id: 38 },
            { label: '学科（试题结构）分析指标明细表', path: '/achievement/3/9', id: 39 }
          ]
        },
        {
          label: '班级分析',
          id: 4,
          children: [
            { label: '班级分档上线人数分布表', path: '/achievement/4/1', id: 41 },
            { label: '班级总分分布表', path: '/achievement/4/2', id: 42 },
            { label: '班级学生学科总分查阅', path: '/achievement/4/3', id: 43 },
            { label: '班级学科水平分析', path: '/achievement/4/4', id: 44 },
            { label: '班级重点群体分析', path: '/achievement/4/5', id: 45 },
            { label: '班级分档上线人数发展变化', path: '/achievement/4/6', id: 46 },
            { label: '班级考试诊断分析要点', path: '/achievement/4/7', id: 47 }
          ]
        },
        {
          label: '学生分析报告',
          id: 5,
          children: [
            { label: '总分及学科均衡分析', path: '/achievement/5/1', id: 51 },
            { label: '学科水平内在结构分析', path: '/achievement/5/2', id: 52 },
            { label: '学科均衡发展变化', path: '/achievement/5/3', id: 53 },
            { label: '学科内在结构水平的发展变化', path: '/achievement/5/4', id: 54 }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      def: [],
      defId: '',
      parentName: '教科研中心分析报告',
      name: '总分分布分析'
    }
  },

  computed: {
    ...mapGetters([
      'leftMenu'
    ])
  },

  methods: {
    handleClick (data, node) {
      if (data.path) {
        this.name = data.label
        this.$router.push(data.path)
        this.parentName = node.parent.data.label
      }
    },

    renderContent (h, { node, data, store }) {
      const pop = (
        <el-popover
          placement="bottom"
          width="100"
          trigger="hover">
          <p tyle="color: #808080">{ data.label }</p>
          <span slot="reference">{ data.label.slice(0, 13) + '...' }</span>
        </el-popover>
      )
      return (
        <span>
          { data.label.length >= 14 ? pop : data.label }
        </span>
      )
    }
  },

  async mounted () {
    await this.$store.dispatch('init')
    this.leftMenu.forEach(item => {
      console.log(1)
      if (item.path === '/achievement') {
        console.log(1)
        console.log(item.childList)
        let childList = item.childList.map(_ => _.name)
        let tree = new Set(this.tree.filter(_ => childList.toString().indexOf(_.label) > -1))
        this.tree = [...tree]
      }
    })
    const path = this.tree[0].children[0].path
    this.$router.push(path)
    const parentId = path.split('/')[2]
    const childId = path.split('/')[3]
    this.def[0] = Number(parentId)
    this.parentName = this.tree[0].label
    this.name = this.tree[0].children[childId - 1].label
    this.defId = Number(`${parentId}${childId}`)
    sessionStorage.PARAMS_EXAMID = null
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';


.achievement {
  height: calc(100% - 20px);

  >.common-css {

    >.right {
      width: 100%;
      // min-width: 1000px;
      overflow-y: auto;
      overflow-x: hidden;
      padding: $width;

      >.title {
        // height: 66px;
        line-height: 30px;
        font-weight: bold;
        >i {
          transform: scale(.7);
        }
      }

      >.content {
        margin-top: $width;
        padding: $width;
        background: $white;
      }
    }
  }


  .qhlcp {
    width: 100%;

    td, th {
      line-height: 40px;
      border: 1px solid #dfe6ec;
      padding: 0 10px;

    }
    th {
      background: #eef1f6;
    }
  }

  .el-popover {
    min-width: 100px !important;
  }
  .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
    color: #333 !important;
  }
}

</style>

