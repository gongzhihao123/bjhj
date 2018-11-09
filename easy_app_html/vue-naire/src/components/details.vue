<template>
  <div id="commonDetails" v-if="details">
    <!--<slot name="header"></slot>-->
    <h3 class="h3" style="text-align:center;">{{ details.title }}
      <!--<el-button type="success">导出</el-button>-->
      <slot name="button"></slot>
    </h3>

    <header class="details-header">
      <p>　发布人：<span>{{details.createdUserName}}</span></p>
      <p>截止时间：<span>{{details.endTime | dateFormat('yyyy-MM-dd hh:mm')}}</span></p>
      <p>问卷题数：<span>{{details.qNum}}题</span></p>
      <slot name="header"></slot>
      <slot name="image"></slot>
    </header>

    <!--段落说明-->
    <article class="article">
      <!--{{article}}-->
    </article>

    <main class="details-main">
      <section v-for="(item, i) in details.questions" :key="i">
        <!--单选题、-->
        <div class="radio" v-show="item.questionType == 1">
          <p>{{item.sorts}}.{{item.name}}</p>
          <ul style="list-style:none;">
            <li v-for="(items, index) in item.options" :key="index">
              <span v-if="!details.print">{{(index + 1) | options}} {{items.radioboxName}}</span>
              <span v-else>
                <el-radio class="radio" v-model="item.checked" :label="index" :disabled="able == 1">{{items.radioboxName}}</el-radio>
              </span>
            </li>
          </ul>
        </div>
        
        <!--多选题-->
        <div class="checkbox radio" v-show="item.questionType == 2">
          <p>{{item.sorts}}.{{item.name}}</p>
          <ul style="list-style:none;">
            <li v-for="(items, index) in item.options" :key="index">
              <span v-if="!details.print">{{(index + 1) | options}} {{items.checkboxName}}</span>
              <span v-else>
                <el-checkbox v-model="items.checked" :disabled="able == 1">{{items.checkboxName}}</el-checkbox>
              </span>
              
            </li>
          </ul>
        </div>

        <!--问答题-->
        <div class="question radio" v-show="item.questionType == 3">
          <p>{{item.sorts}}.{{item.name}}</p>
          <el-input
           :disabled="able == 1"
            v-show="details.print"
            type="textarea"
            :rows="3"
            v-model="item.answer">
          </el-input>
          <div style="height:50px;" v-show="!details.print"></div>
        </div>

        <!--段落说明-->
        <div class="question radio" v-show="item.questionType == 4">
          <p>{{ item.name }}</p>
          <!--<el-input
            type="textarea"
            :rows="3"
            v-model="item.name">
          </el-input>-->
        </div>

      </section>
    </main>


  </div>
</template>

<script>
import {dateFormat} from '../filters/index.js'
export default {
  name: 'commonDetails',
  data () {
    return {
      name: '',
      createdName: '',
      createdTime: '',
      queryNum: 4,
      needNum: 100,
      answerNum: 99,
      awaitNum: 1,
      radio: '',
      questList: [
      ],
      article: ''
    }
  },
  props: ['details', 'able'],
  mounted () {
  },
  watch: {
    details () {
      if (typeof this.details.endTime === 'number') {
        this.details.endTime = dateFormat(this.details.endTime, 'yyyy-MM-dd hh:mm')
      } else {
        if (this.details.endTime.split('-').length !== 0) return
        this.details.endTime = dateFormat(this.details.endTime, 'yyyy-MM-dd hh:mm')
      }
    }
  },
  filters: {
    options (val) {
      let obj = {
        1: 'A',
        2: 'B',
        3: 'C',
        4: 'D',
        5: 'E',
        6: 'F',
        7: 'G',
        8: 'H',
        9: 'I',
        10: 'J',
        11: 'K',
        12: 'L',
        13: 'M',
        14: 'N',
        15: 'O',
        16: 'P',
        17: 'Q',
        18: 'R'
      }
      return obj[val]
    }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/main.scss';
@media screen and (max-width: 1250px) {
  #commonDetails {
    background: $white;
    position: relative;
    padding: 15px;
    text-align: left;
    .h3 {
      text-align: center;
      line-height: 50px;
      font-size: 1.5rem;

      .el-button {
        float: right;
        margin: 0 !important;
      }
    }
    .details-header {
      background: $background;
      border: 1px solid $border;
      padding: 0 10px;
      p {
        line-height: 36px;
        color: #666;
        font-size: .9rem;
        .span {
          color: #53a7ef;
          cursor: pointer;
        }
        span {
          color: #333;
        }
      }
    }
    .article {
      padding-top: 20px;
    }
    .details-main {
      margin: 20px 0;
      p {
        font-size: 1rem;
        line-height: 40px;
      }
      ul {
        li {
          overflow: hidden;
          
          line-height: 40px;;
          box-sizing: border-box;
          min-height: 40px;
          position: relative;
          padding-left: 20px;
        }
      }
      .question {
        textarea {
          resize: none;
        }
      }
    }
  }
}
@media screen and (min-width: 1250px) {
  #commonDetails {
    background: $white;
    position: relative;
    padding: 15px;
    text-align: left;
    .h3 {
      text-align: center;
      line-height: 50px;
      font-size: 20px;

      .el-button {
        float: right;
        margin: 0 !important;
      }
    }
    .details-header {
      background: $background;
      border: 1px solid $border;
      padding: 0 10px;
      p {
        line-height: 36px;
        color: #666;
        .span {
          color: #53a7ef;
          cursor: pointer;
        }
        span {
          color: #333;
        }
      }
    }
    .article {
      padding-top: 20px;
    }
    .details-main {
      margin: 20px 0;
      p {
        line-height: 40px;
      }
      ul {
        li {
          overflow: hidden;
          
          line-height: 40px;;
          box-sizing: border-box;
          min-height: 40px;
          position: relative;
          padding-left: 20px;
        }
      }
      .question {
        textarea {
          resize: none;
        }
      }
    }
  }
}
</style>
