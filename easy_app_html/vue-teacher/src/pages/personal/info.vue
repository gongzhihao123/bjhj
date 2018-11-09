<template>
  <div class="info">
    <div class="header">个人信息</div>
    <div class="main">
      <basic></basic>
      <learning></learning>
      <contineEducation></contineEducation>
      <experience></experience>
      <job-title></job-title>
    </div>
  </div>
</template>
<script>
import basic from './../../components/info/basic'
import learning from './../../components/info/learning'
import contineEducation from './../../components/info/contineEducation'
import experience from './../../components/info/experience'
import jobTitle from './../../components/info/jobTitle'
export default {
  name: 'personal',
  components: {
    basic,
    learning,
    contineEducation,
    experience,
    jobTitle
  }
}
</script>
<style lang='scss' scoped>
.info {
  padding: 22px;
  > .header {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    &::before {
      height: 15px;
      width: 3px;
      content: '';
      display: block;
      background: #4c73eb;
      margin-top: 2px;
      margin-right: 10px;
    }
  }
}
</style>
