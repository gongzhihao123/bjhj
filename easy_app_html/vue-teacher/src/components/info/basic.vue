<template>
  <div class="basic">
    <div class="header">
      <span>个人基本信息</span>
      <el-button size="small" type="success" :disabled="audit === 0" @click="save"><i class="iconfont">&#xe62e;</i>保存</el-button>
    </div>
    <div class="content" v-loading='loading'>
      <div class="more"  @click="more=!more">点击<p v-if="more">隐藏</p><p v-else>显示更多</p><span :class=" more ? 'moretop' : 'morebot'"></span></div>
      <div class="userFace">
        <div>
          <el-upload
            :before-upload="beforeUp"
            :action="uploadPath"
            :on-success="success"
            class="upload"
            :show-file-list="false">
            <img :src="info.teacherFace ? info.teacherFace : userFace" width="200px" height="200px">
          </el-upload>
        </div>
        <p>{{ info.userName }}</p>
        <p>{{ info.occupation }}</p>
      </div>
      <div class="userInfo" :class=" more ? 'activity' : 'userInfo'">
        <ul>
          <li @click="infoState.userName = !infoState.userName">
            <span>姓名：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.userName">
                <el-tooltip v-if="before && before.userName"  class="item" effect="dark" :content="before.userName + ''" placement="top">
                  <span>{{ info.userName }}</span>
                </el-tooltip>
                <span v-else>{{ info.userName ? info.userName : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.userName" @blur="infoState.userName = !infoState.userName" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.userNative = !infoState.userNative">
            <span>籍贯：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.userNative">
                <el-tooltip v-if="before && before.userNative"  class="item" effect="dark" :content="before.userNative + ''" placement="top">
                  <span>{{ info.userNative }}</span>
                </el-tooltip>
                <span v-else >{{ info.userNative ? info.userNative : '请填写信息' }}</span>
              </div>
              <el-input :maxlength="20" v-else v-model="info.userNative" @blur="infoState.userNative = !infoState.userNative" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.maxEducation = !infoState.maxEducation">
            <span>最高学历：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.maxEducation">
                <el-tooltip v-if="before && before.maxEducation"  class="item" effect="dark" :content="before.maxEducation" placement="top">
                  <span>{{ info.maxEducation }}</span>
                </el-tooltip>
                <span v-else >{{ info.maxEducation ? info.maxEducation : '请填写信息' }}</span>
              </div>
              <el-select v-else v-model="info.maxEducation" @visible-change='change' placeholder="请选择">
                <el-option
                  v-for="(item, index) in education"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </transition>
          </li>
           <li  @click="infoState.userCode = !infoState.userCode">
            <span>教育ID：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.userCode">
                <el-tooltip v-if="before && before.userCode"  class="item" effect="dark" :content="before.userCode + ''" placement="top">
                  <span>{{ info.userCode }}</span>
                </el-tooltip>
                <span v-else >{{ info.userCode ? info.userCode : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.userCode" @blur="infoState.userCode = !infoState.userCode" v-focus ></el-input>
            </transition>
          </li>
           <li @click="infoState.teachTitle = !infoState.teachTitle">
            <span>职称：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.teachTitle">
                <el-tooltip v-if="before && before.teachTitle"  class="item" effect="dark" :content="before.teachTitle + ''" placement="top">
                  <span>{{ info.teachTitle }}</span>
                </el-tooltip>
                <span v-else >{{ info.teachTitle ? info.teachTitle : '请填写信息' }}</span>
              </div>
              <el-select v-else v-model="info.teachTitle" @visible-change='change' placeholder="请选择">
                <el-option
                  v-for="(item, index) in teachTitles"
                  :key="index+1"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </transition>
          </li>
          <li @click="infoState.maxEducationMajor = !infoState.maxEducationMajor">
            <span>最高学历专业：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.maxEducationMajor">
                <el-tooltip v-if="before && before.maxEducationMajor"  class="item" effect="dark" :content="before.maxEducationMajor" placement="top">
                  <span>{{ info.maxEducationMajor }}</span>
                </el-tooltip>
                <span v-else >{{ info.maxEducationMajor ? info.maxEducationMajor : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.maxEducationMajor" @blur="infoState.maxEducationMajor = !infoState.maxEducationMajor" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.nation = !infoState.nation">
            <span>民族：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.nation">
                <el-tooltip v-if="before && before.nation"  class="item" effect="dark" :content="before.nation + ''" placement="top">
                  <span>{{ info.nation }}</span>
                </el-tooltip>
                <span  v-else >{{ info.nation ? info.nation : '请填写信息'}}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.nation" @blur="infoState.nation = !infoState.nation" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.occupation = !infoState.occupation">
            <span>岗位：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.occupation">
                <el-tooltip v-if="before && before.occupation"  class="item" effect="dark" :content="before.occupation + ''" placement="top">
                  <span>{{ info.occupation }}</span>
                </el-tooltip>
                <span v-else >{{ info.occupation ? info.occupation : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.occupation" @blur="infoState.occupation = !infoState.occupation" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.marriage = !infoState.marriage">
            <span>婚姻状况：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.marriage">
                <el-tooltip v-if="before && before.marriage"  class="item" effect="dark" :content="before.marriage + ''" placement="top">
                  <span>{{ Number(info.marriage) === 1 ? '已婚' : '未婚' }}</span>
                </el-tooltip>
                <span v-else >{{ info.marriage ? info.marriage : '请填写信息' }}</span>
              </div>
              <el-select v-else v-model="info.marriage" @visible-change='change' placeholder="请选择">
                <el-option
                  v-for="(item, index) in marriageType"
                  :key="index+1"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </transition>
          </li>
          <li @click="infoState.sex = !infoState.sex">
            <span >性别：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.sex">
                <el-tooltip v-if="before && before.sex"  class="item" effect="dark" :content="before.sex + ''" placement="top">
                  <span>{{ Number(info.sex) === 1 ? '男' : '女' }}</span>
                </el-tooltip>
                <span v-else >{{ Number(info.sex) === 1 ? '男' : '女' }}</span>
              </div>
              <el-select v-else v-model="info.sex" @visible-change='change' placeholder="请选择">
                <el-option
                  v-for="(item, index) in sexType"
                  :key="index"
                  :label="item"
                  :value="index + 1">
                </el-option>
              </el-select>
            </transition>
          </li>
          <li @click="infoState.politicsFace = !infoState.politicsFace">
            <span>政治面貌：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.politicsFace">
                <el-tooltip v-if="before && before.politicsFace"  class="item" effect="dark" :content="before.politicsFace + ''" placement="top">
                  <span>{{ info.politicsFace ? face[info.politicsFace] : '请填写信息' }}</span>
                </el-tooltip>
                <span v-else >{{ info.politicsFace ? face[info.politicsFace - 1] : '请填写信息' }}</span>
              </div>
              <el-select v-else v-model="info.politicsFace" @visible-change='change' placeholder="请选择">
                <el-option
                  v-for="(item, index) in face"
                  :key="index"
                  :label="item"
                  :value="index + 1">
                </el-option>
              </el-select>
            </transition>
          </li>
          <li @click="infoState.health = !infoState.health">
            <span>健康状况：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.health">
                <el-tooltip v-if="before && before.health"  class="item" effect="dark" :content="before.health + ''" placement="top">
                  <span>{{ info.health }}</span>
                </el-tooltip>
                <span v-else >{{ info.health ? info.health : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.health" @blur="infoState.health = !infoState.health" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.englishName = !infoState.englishName">
            <span>英文名：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.englishName">
                 <el-tooltip v-if="before && before.englishName"  class="item" effect="dark" :content="before.englishName + ''" placement="top">
                  <span>{{ info.englishName }}</span>
                </el-tooltip>
                <span v-else>{{ info.englishName ? info.englishName : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.englishName" @blur="infoState.englishName = !infoState.englishName" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.namePinyin = !infoState.namePinyin">
            <span>名字拼音：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.namePinyin">
                <el-tooltip v-if="before && before.namePinyin"  class="item" effect="dark" :content="before.namePinyin + ''" placement="top">
                  <span>{{ info.namePinyin }}</span>
                </el-tooltip>
                <span v-else >{{ info.namePinyin ? info.namePinyin : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.namePinyin" @blur="infoState.namePinyin = !infoState.namePinyin + ''" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.oldName = !infoState.oldName">
            <span>曾用名：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.oldName">
                <el-tooltip v-if="before && before.oldName"  class="item" effect="dark" :content="before.oldName + ''" placement="top">
                  <span>{{ info.oldName }}</span>
                </el-tooltip>
                <span v-else >{{ info.oldName ? info.oldName : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.oldName" @blur="infoState.oldName = !infoState.oldName" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.bloodType = !infoState.bloodType">
            <span>血型：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.bloodType">
                <el-tooltip v-if="before && before.bloodType"  class="item" effect="dark" :content="before.bloodType + ''" placement="top">
                  <span>{{ info.bloodType }}</span>
                </el-tooltip>
                <span v-else >{{ info.bloodType ? info.bloodType : '请填写信息' }}</span>
              </div>
              <el-select v-else v-model="info.bloodType" @visible-change='change' placeholder="请选择">
                <el-option
                  v-for="(item, index) in bloodType"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </transition>
          </li>
          <li @click="infoState.documentType = !infoState.documentType">
            <span>证件类型：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.documentType">
                <el-tooltip v-if="before && before.documentType"  class="item" effect="dark" :content="before.documentType + ''" placement="top">
                  <span>{{ info.documentType }}</span>
                </el-tooltip>
                <span v-else >{{ info.documentType ? info.documentType : '请填写信息' }}</span>
              </div>
              <el-select v-else v-model="info.documentType" @visible-change='change' placeholder="请选择">
                <el-option
                  v-for="(item, index) in documentType"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </transition>
          </li>
          <li @click="infoState.certificatesNumber = !infoState.certificatesNumber">
            <span>证件号码：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.certificatesNumber">
                <el-tooltip v-if="before && before.certificatesNumber"  class="item" effect="dark" :content="before.certificatesNumber + ''" placement="top">
                  <span>{{ info.certificatesNumber }}</span>
                </el-tooltip>
                <span v-else >{{ info.certificatesNumber ? info.certificatesNumber : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.certificatesNumber" @blur="infoState.certificatesNumber = !infoState.certificatesNumber" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.documentValidity = !infoState.documentValidity">
            <span>证件有效期：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.documentValidity">
                <el-tooltip v-if="before && before.documentValidity"  class="item" effect="dark" :content="before.documentValidity  | format('yyyy年MM月dd日')" placement="top">
                  <span>{{ info.documentValidity | format('yyyy年MM月dd日') }}</span>
                </el-tooltip>
                <span v-else >{{ info.documentValidity ? new Date(info.documentValidity).getFullYear() + '年' + (new Date(info.documentValidity).getMonth() + 1) + '月' + new Date(info.documentValidity).getDate() + '日' : '请填写信息' }}</span>
              </div>
              <el-date-picker
                @change="infoState.documentValidity = !infoState.documentValidity"
                v-else
                v-model="info.documentValidity"
                type="date"
                value-format="timestamp"
                v-focus
                placeholder="选择日期">
              </el-date-picker>
            </transition>
          </li>
          <li @click="infoState.gat = !infoState.gat">
            <span>港澳台：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.gat">
                <el-tooltip v-if="before && before.gat"  class="item" effect="dark" :content="before.gat + ''" placement="top">
                  <span>{{ Number(before.gat) === 1 ? '香港' : Number(before.gat) === 2 ? '澳门' : Number(before.gat) === 3 ? '台湾' : ''  }}</span>
                </el-tooltip>
                <span v-else >{{ Number(info.gat) === 1 ? '香港' : Number(info.gat) === 2 ? '澳门' : Number(info.gat) === 3 ? '台湾' : '请填写信息' }}</span>
              </div>
              <el-select v-else v-model="info.gat" @visible-change='change' placeholder="请选择">
                <el-option
                  v-for="(item, index) in gat"
                  :key="index"
                  :label="item"
                  :value="index + 1">
                </el-option>
              </el-select>
            </transition>
          </li>
          <li  @click="infoState.nowAddress = !infoState.nowAddress">
            <span>现住址：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.nowAddress">
                <el-tooltip v-if="before && before.nowAddress"  class="item" effect="dark" :content="before.nowAddress + ''" placement="top">
                  <span>{{ info.nowAddress }}</span>
                </el-tooltip>
                <span v-else >{{ info.nowAddress ? info.nowAddress : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.nowAddress" @blur="infoState.nowAddress = !infoState.nowAddress" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.registeredNature = !infoState.registeredNature">
            <span>户口性质：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.registeredNature">
                <el-tooltip v-if="before && before.registeredNature"  class="item" effect="dark" :content="before.registeredNature + ''" placement="top">
                  <span>{{ info.registeredNature }}</span>
                </el-tooltip>
                <span v-else >{{ info.registeredNature ? info.registeredNature : '请填写信息' }}</span>
              </div>
              <el-select v-else v-model="info.registeredNature" @visible-change='change' placeholder="请选择">
                <el-option
                  v-for="(item, index) in registeredNature"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </transition>
          </li>
          <li @click="infoState.registeredLocation = !infoState.registeredLocation">
            <span>户籍所在地：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.registeredLocation">
                <el-tooltip v-if="before && before.registeredLocation"  class="item" effect="dark" :content="before.registeredLocation + ''" placement="top">
                  <span>{{ info.registeredLocation }}</span>
                </el-tooltip>
                <span v-else >{{ info.registeredLocation ? info.registeredLocation : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.registeredLocation" @blur="infoState.registeredLocation = !infoState.registeredLocation + ''" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.phone = !infoState.phone">
            <span>联系电话：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.phone">
                <el-tooltip v-if="before && before.phone"  class="item" effect="dark" :content="before.phone + ''" placement="top">
                  <span>{{ info.phone }}</span>
                </el-tooltip>
                <span v-else >{{ info.phone ? info.phone : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.phone" @blur="infoState.phone = !infoState.phone" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.email = !infoState.email">
            <span>电子邮箱：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.email">
                <el-tooltip v-if="before && before.email"  class="item" effect="dark" :content="before.email + ''" placement="top">
                  <span>{{ info.email }}</span>
                </el-tooltip>
                <span v-else >{{ info.email ? info.email : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.email" @blur="infoState.email = !infoState.email" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.joinWorkTime = !infoState.joinWorkTime">
            <span>参加工作年月：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.joinWorkTime">
                <el-tooltip v-if="before && before.joinWorkTime"  class="item" effect="dark" :content="before.joinWorkTime  | format('yyyy年MM月dd日')" placement="top">
                  <span>{{ info.joinWorkTime | format('yyyy年MM月dd日') }}</span>
                </el-tooltip>
                <span v-else >{{ info.joinWorkTime ? new Date(info.joinWorkTime).getFullYear() + '年' + (new Date(info.joinWorkTime).getMonth() + 1) + '月' + new Date(info.joinWorkTime).getDate() + '日' : '请填写信息' }}</span>
              </div>
              <el-date-picker
                @change="infoState.joinWorkTime = !infoState.joinWorkTime"
                v-else
                v-model="info.joinWorkTime"
                type="date"
                value-format="timestamp"
                v-focus
                placeholder="选择日期">
              </el-date-picker>
            </transition>
          </li>
          <li @click="infoState.teachTime = !infoState.teachTime">
            <span>从教年月：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.teachTime">
                <el-tooltip v-if="before && before.teachTime"  class="item" effect="dark" :content="before.teachTime  | format('yyyy年MM月dd日')" placement="top">
                  <span>{{ info.teachTime | format('yyyy年MM月dd日') }}</span>
                </el-tooltip>
                <span v-else >{{ info.teachTime ? new Date(info.teachTime).getFullYear() + '年' + (new Date(info.teachTime).getMonth() + 1) + '月' + new Date(info.teachTime).getDate() + '日'  : '请填写信息' }}</span>
              </div>
              <el-date-picker
                @change="infoState.teachTime = !infoState.teachTime"
                v-else
                v-model="info.teachTime"
                type="date"
                value-format="timestamp"
                v-focus
                placeholder="选择日期">
              </el-date-picker>
            </transition>
          </li>
          <li @click="infoState.archivesNumber = !infoState.archivesNumber">
            <span>档案编号：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.archivesNumber">
                <el-tooltip v-if="before && before.archivesNumber"  class="item" effect="dark" :content="before.archivesNumber + ''" placement="top">
                  <span>{{ info.archivesNumber }}</span>
                </el-tooltip>
                <span v-else >{{ info.archivesNumber ? info.archivesNumber : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.archivesNumber" @blur="infoState.archivesNumber = !infoState.archivesNumber" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.archives = !infoState.archives">
            <span>档案文本：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.archives">
                <el-tooltip v-if="before && before.archives"  class="item" effect="dark" :content="before.archives + ''" placement="top">
                  <span>{{ info.archives }}</span>
                </el-tooltip>
                <span v-else >{{ info.archives ? info.archives : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.archives" @blur="infoState.archives = !infoState.archives" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.titleType = !infoState.titleType">
            <span>教师资格类型：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.titleType">
                <el-tooltip v-if="before && before.titleType"  class="item" effect="dark" :content="before.titleType + ''" placement="top">
                  <span>{{ info.titleType }}</span>
                </el-tooltip>
                <span v-else >{{ info.titleType ? info.titleType : '请填写信息' }}</span>
              </div>
              <el-select v-else v-model="info.titleType" @visible-change='change' placeholder="请选择">
                <el-option
                  v-for="(item, index) in titleTypes"
                  :key="index+1"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </transition>
          </li>
          <li @click="infoState.nationalityCode = !infoState.nationalityCode">
            <span>国籍地区码：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.nationalityCode">
                <el-tooltip v-if="before && before.nationalityCode"  class="item" effect="dark" :content="before.nationalityCode + ''" placement="top">
                  <span>{{ info.nationalityCode }}</span>
                </el-tooltip>
                <span v-else >{{ info.nationalityCode ? info.nationalityCode : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.nationalityCode" @blur="infoState.nationalityCode = !infoState.nationalityCode + ''" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.birthdate = !infoState.birthdate">
            <span>出生日期：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.birthdate">
                <el-tooltip v-if="before && before.birthdate"  class="item" effect="dark" :content="before.birthdate | format('yyyy年MM月dd日')" placement="top">
                  <span>{{ info.birthdate | format('yyyy年MM月dd日') }}</span>
                </el-tooltip>
                <span v-else >{{ info.birthdate ? new Date(info.birthdate).getFullYear() + '年' + (new Date(info.birthdate).getMonth() + 1) + '月' + new Date(info.birthdate).getDate() + '日'  : '请填写信息' }}</span>
              </div>
              <el-date-picker
                @change="infoState.birthdate = !infoState.birthdate"
                v-else
                v-model="info.birthdate"
                type="date"
                value-format="timestamp"
                v-focus
                placeholder="选择日期">
              </el-date-picker>
            </transition>
          </li>
          <li @click="infoState.faith = !infoState.faith">
            <span>信仰：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.faith">
                <el-tooltip v-if="before && before.faith"  class="item" effect="dark" :content="before.faith + ''" placement="top">
                  <span>{{ info.faith }}</span>
                </el-tooltip>
                <span v-else >{{ info.faith ? info.faith : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.faith" @blur="infoState.faith = !infoState.faith" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.homeAddress = !infoState.homeAddress">
            <span>家庭住址：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.homeAddress">
                <el-tooltip v-if="before && before.homeAddress"  class="item" effect="dark" :content="before.homeAddress + ''" placement="top">
                  <span>{{ info.homeAddress }}</span>
                </el-tooltip>
                <span v-else >{{ info.homeAddress ? info.homeAddress : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.homeAddress" @blur="infoState.homeAddress = !infoState.homeAddress" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.organizationType = !infoState.organizationType">
            <span>编制类别：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.organizationType">
                <el-tooltip v-if="before && before.organizationType"  class="item" effect="dark" :content="before.organizationType + ''" placement="top">
                  <span>{{ info.organizationType }}</span>
                </el-tooltip>
                <span v-else >{{ info.organizationType ? info.organizationType : '请填写信息' }}</span>
              </div>
              <el-select v-else v-model="info.organizationType" @visible-change='change' placeholder="请选择">
                <el-option
                  v-for="(item, index) in organizationType"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </transition>
          </li>
          <li @click="infoState.communicationAddress = !infoState.communicationAddress">
            <span>通讯地址：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.communicationAddress">
                <el-tooltip v-if="before && before.communicationAddress"  class="item" effect="dark" :content="before.communicationAddress + ''" placement="top">
                  <span>{{ info.communicationAddress }}</span>
                </el-tooltip>
                <span v-else >{{ info.communicationAddress ? info.communicationAddress : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.communicationAddress" @blur="infoState.communicationAddress = !infoState.communicationAddress + ''" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.education = !infoState.education">
            <span>原始学历：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.education">
                <el-tooltip v-if="before && before.education"  class="item" effect="dark" :content="before.education" placement="top">
                  <span>{{ info.education }}</span>
                </el-tooltip>
                <span v-else >{{ info.education ? info.education : '请填写信息' }}</span>
              </div>
              <el-select v-else v-model="info.education" @visible-change='change' placeholder="请选择">
                <el-option
                  v-for="(item, index) in education"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </transition>
          </li>
          <li @click="infoState.educationMajor = !infoState.educationMajor">
            <span>原始学历专业：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.educationMajor">
                <el-tooltip v-if="before && before.educationMajor"  class="item" effect="dark" :content="before.educationMajor" placement="top">
                  <span>{{ info.educationMajor }}</span>
                </el-tooltip>
                <span v-else >{{ info.educationMajor ? info.educationMajor : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.educationMajor" @blur="infoState.educationMajor = !infoState.educationMajor" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.postalCode = !infoState.postalCode">
            <span>邮政编码：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.postalCode">
                <el-tooltip v-if="before && before.postalCode"  class="item" effect="dark" :content="before.postalCode + ''" placement="top">
                  <span>{{ info.postalCode }}</span>
                </el-tooltip>
                <span v-else >{{ info.postalCode ? info.postalCode : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.postalCode" @blur="infoState.postalCode = !infoState.postalCode" v-focus ></el-input>
            </transition>
          </li>
          <li  @click="infoState.homepageAddress = !infoState.homepageAddress">
            <span>主页地址：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.homepageAddress">
                <el-tooltip v-if="before && before.homepageAddress"  class="item" effect="dark" :content="before.homepageAddress + ''" placement="top">
                  <span>{{ info.homepageAddress }}</span>
                </el-tooltip>
                <span v-else >{{ info.homepageAddress ? info.homepageAddress : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.homepageAddress" @blur="infoState.homepageAddress = !infoState.homepageAddress" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.comeSchoolTime = !infoState.comeSchoolTime">
            <span>来校年月：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.comeSchoolTime">
                <el-tooltip v-if="before && before.comeSchoolTime"  class="item" effect="dark" :content="before.comeSchoolTime  | format('yyyy年MM月dd日')" placement="top">
                  <span>{{ info.comeSchoolTime | format('yyyy年MM月dd日') }}</span>
                </el-tooltip>
                <span v-else >{{ info.comeSchoolTime ? new Date(info.comeSchoolTime).getFullYear() + '年' + (new Date(info.comeSchoolTime).getMonth() + 1) + '月' + new Date(info.comeSchoolTime).getDate() + '日'  : '请填写信息' }}</span>
              </div>
              <el-date-picker
                @change="infoState.comeSchoolTime = !infoState.comeSchoolTime"
                v-else
                v-model="info.comeSchoolTime"
                type="date"
                value-format="timestamp"
                v-focus
                placeholder="选择日期">
              </el-date-picker>
            </transition>
          </li>
          <li @click="infoState.specialty = !infoState.specialty">
            <span>特长：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.specialty">
                <el-tooltip v-if="before && before.specialty"  class="item" effect="dark" :content="before.specialty + ''" placement="top">
                  <span>{{ info.specialty }}</span>
                </el-tooltip>
                <span v-else >{{ info.specialty ? info.specialty : '请填写信息' }}</span>
              </div>
              <el-input  :maxlength="20" v-else v-model="info.specialty" @blur="infoState.specialty = !infoState.specialty + ''" v-focus ></el-input>
            </transition>
          </li>
          <li @click="infoState.teachSection = !infoState.teachSection">
            <span>主要任课学段：</span>
            <transition name="slide-left" mode="out-in">
              <div v-if="infoState.teachSection">
                <el-tooltip v-if="before && before.teachSection"  class="item" effect="dark" :content="before.teachSection + ''" placement="top">
                  <span>{{ info.teachSection }}</span>
                </el-tooltip>
                <span v-else >{{ info.teachSection ? info.teachSection : '请填写信息' }}</span>
              </div>
              <el-select v-else v-model="info.teachSection" @visible-change='change' placeholder="请选择">
                <el-option
                  v-for="(item, index) in teachSection"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </transition>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import userFace from './../../assets/img/userFace.jpeg'
import { error } from './../../utils/handle.js'
export default {
  name: 'basic',
  data () {
    return {
      userFace,
      user: '',
      professional: '',
      name: false,
      more: false,
      historyInfo: '',
      info: {
        teacherFace: '',
        userName: '',
        englishName: '',
        userNative: '',
        bloodType: '',
        birthAddress: '',
        documentType: '',
        gat: '',
        registeredNature: '',
        phone: '',
        joinWorkTime: '',
        archives: '',
        userCode: '',
        oldName: '',
        birthdate: '',
        marriage: '',
        certificatesNumber: '',
        homeAddress: '',
        communicationAddress: '',
        postalCode: '',
        comeSchoolTime: '',
        specialty: '',
        sex: '',
        nation: '',
        place: '',
        health: '',
        documentValidity: '',
        nowAddress: '',
        registeredLocation: '',
        email: '',
        teachTime: '',
        occupation: '',
        teachTitle: '',
        titleType: '',
        namePinyin: '',
        nationalityCode: '',
        faith: '',
        politicsFace: '',
        organizationType: '',
        education: '',
        educationMajor: '',
        maxEducation: '',
        maxEducationMajor: '',
        homepageAddress: '',
        archivesNumber: '',
        teachSection: ''
      },
      infoState: {
        userName: true,
        englishName: true,
        userNative: true,
        bloodType: true,
        documentType: true,
        gat: true,
        registeredNature: true,
        phone: true,
        joinWorkTime: true,
        archives: true,
        userCode: true,
        oldName: true,
        birthdate: true,
        marriage: true,
        certificatesNumber: true,
        homeAddress: true,
        communicationAddress: true,
        postalCode: true,
        comeSchoolTime: true,
        specialty: true,
        sex: true,
        nation: true,
        place: true,
        health: true,
        documentValidity: true,
        nowAddress: true,
        registeredLocation: true,
        email: true,
        teachTime: true,
        occupation: true,
        teachTitle: true,
        titleType: true,
        namePinyin: true,
        nationalityCode: true,
        faith: true,
        politicsFace: true,
        organizationType: true,
        education: true,
        educationMajor: true,
        maxEducation: true,
        maxEducationMajor: true,
        homepageAddress: true,
        archivesNumber: true,
        teachSection: true
      },
      bloodType: [
        'A血型', 'B血型', 'O血型', 'AB血型', 'RH阳性血型', 'RH阴性血型', 'HLA血型', '未知血型', '其他血型'
      ],
      documentType: [
        '居民身份证', '军官证', '士兵证', '文职干部证', '队伍离退休证', '香港特区护照/身份证明', '澳门特区护照/身份证明', '台湾居民来往大陆通行证', '境外永久居住证', '护照', '户口簿', '其他'
      ],
      marriageType: [
        '已婚', '未婚', '初婚', '再婚', '复婚', '丧偶', '离婚', '未说明'
      ],
      teachTitles: [
        '正高级', '高级', '一级', '二级', '三级'
      ],
      titleTypes: [
        '幼儿园', '小学', '初中', '高中', '大学'
      ],
      organizationType: [
        '专任教师', '行政人员', '教辅人员', '工勤人员', '校办企业职工', '代课教师', '兼任（职）教师', '其他'
      ],
      registeredNature: [
        '未落常住户口', '非农业家庭户口', '农业家庭户口', '非农业集体户口', '农业集体户口', '自理口粮户口', '寄住户口', '暂住户口', '其他'
      ],
      face: [
        '中共党员', '中共预备党员', '共青团员', '民革党员', '民盟盟员', '民建会员', '民进会员', '农工党党员', '致公党党员', '九三学社社员', '台盟盟员', '无党派人士', '普通居民'
      ],
      education: [
        '研究生教育', '博士研究生毕业', '博士研究生结业', '博士研究生肄业', '硕士研究生毕业', '硕士研究生结业', '硕士研究生肄业', '研究生班毕业', '研究生班结业', '研究生班肄业', '大学本科教育', '大学本科毕业', '大学本科结业', '大学本科肄业', '大学普通班毕业', '大学专科教育', '大学专科毕业', '大学专科结业', '大学专科肄业', '中等职业教育', '中等专科毕业', '中等专科结业', '中等专科肄业', '职业高中毕业', '职业高中结业', '职业高中肄业', '技工学校毕业', '技工学校结业', '技工学校肄业', '普通高级中学教育', '普通高中毕业', '普通高中结业', '普通高中肄业', '初级中学教育', '初中毕业', '初中肄业', '小学教育', '小学毕业', '小学肄业', '其他'
      ],
      teachSection: [
        '学前教育', '小学', '普通初中', '普通高中', '职业初中', '职业高中', '成人中等专业学校', '成人中学', '特殊教育', '其他'
      ],
      stu: [
        '学习机构', '学习课程', '学习证明人', '学习备注', '操作'
      ],
      work: [
        '工作单位', '工作内容', '曾任党政职务', '曾任专业技术', '工作证明人', '工作备注', '操作'
      ],
      edu: [
        '毕业学校', '学制', '获得学位', '授学位单位', '获学位专业', '学位证书号', '操作'
      ],
      gat: [
        '香港', '澳门', '台湾'
      ],
      sexType: [
        '男', '女'
      ],
      audit: 0,
      before: {},
      loading: false
    }
  },
  computed: {
    uploadPath () {
      const routePath = document.querySelector('#contextPath').value
      return window.location.origin + routePath + '/common/teacherUpload'
    }
  },
  methods: {
    beforeUp (file) {
      const reg = new RegExp(/[.jpg.JPG.png.PNG]$/)
      this.beforeUpload = true
      if (!reg.test(file.name)) {
        error('请上传jpg 或 png 图片')
        this.beforeUpload = false
        return false
      }
    },
    success (data) {
      if (data.code === 1) {
        this.info.teacherFace = data.result.fileUrl
      }
    },
    change (item) {
      if (!item) {
        for (let i in this.infoState) {
          this.infoState[i] = true
        }
      }
    },
    async infoContent () {
      this.loading = true
      await this.$store.dispatch('TeachInfo')
      this.audit = this.$store.state.teacherInfo.checkState
      this.info = this.$store.state.teacherInfo.teacherInfo
      this.historyInfo = JSON.stringify(this.info)
      if (this.$store.state.teacherInfo.teacherEditRecord) {
        this.before = JSON.parse(this.$store.state.teacherInfo.teacherEditRecord)
      } else {
        this.before = this.$store.state.teacherInfo.teacherEditRecord
      }
      this.loading = false
    },
    async save () {
      if (this.historyInfo !== JSON.stringify(this.info)) {
        await this.$store.dispatch('saveTeachInfo', {
          id: this.info.id,
          teacherJson: JSON.stringify(this.info)
        })
        this.infoContent()
        this.audit = 0
      } else {
        error('请更改信息后 再保存')
      }
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
  mounted () {
    this.infoContent()
  }
}
</script>
<style lang='scss' scoped>
.basic {
  width: 100%;
  background: #fff;
  margin-top: 20px;
  border-radius: 5px;
  > .header {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    color: #85a4ff;
    font-weight: bold;
    border-bottom: 1px solid #e5e5e5;
  }
  > .content {
    width: 100%;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    > .more {
      position: absolute;
      right:40%;bottom: 8px;
      cursor: pointer;
      p {
        display: inline-block;
      }
       .moretop {
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 5px;
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-bottom-color:#000;/*top箭头向下 bottom箭头向上*/
      }
      .morebot {
        display: inline-block;
        vertical-align: middle;
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-top-color:#000;/*top箭头向下 bottom箭头向上*/
      }
    }
    > .userFace {
      text-align: center;
      line-height: 1.7;
      margin-right: 30px;
      div {
        width: 270px;
        height: 272px;
        margin-bottom: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    > .userInfo {
      width: 100%;
      height: 224px;
      overflow: hidden;
      ul {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        // flex-direction: column;
        li {
          width: 33%;
          height: 56px;
          padding-right: 2%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          span {
            &:nth-child(1) {
              min-width: 110px;
            }
          }
        }
      }
    }
    .activity {
              width: 100%;
              height: 880px;
              overflow: auto;
          }
  }
}
</style>
