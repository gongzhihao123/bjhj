<template>
  <div class="organization">
      <el-amap ref="map" vid="amapDemo" :amap-manager="amapManager" :center="center" :zoom="zoom"  :events="events" class="amap-demo">
          <el-amap-marker v-for="(marker, index) in markers" :key="index" :icon="marker.icon" :position="marker.position" :events="marker.events" :vid="index"></el-amap-marker>
      </el-amap>
      <div class="top-left">
          <ul>
            <li v-for="(item, index) in state" :class="{ active : activeIndex === index}" @click="chooseschool(index)" :key="index"><span>{{item.name}}</span></li>
          </ul>
      </div>
      <div class="search-box">
          <el-autocomplete
          class="inline-input"
          v-model="state1"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          :trigger-on-focus="true"
          @select="handleSelect"
        ></el-autocomplete>
          <el-button @click="search">搜索</el-button>          
      </div>        
      <div class="common-left">
        <el-row>
            <el-col :span="24">
            <span>共{{area.length}}所</span>
            <a @click="daochu">导出</a>
          </el-col>
          <el-col :span="24">
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item :title="item.name" :name="index" v-for="(item, index) in area" :key="index" @click.native="getSchoolDetail(area[activeName].id)" v-loading="detailLoading && activeName === index">
                <template slot="title">
                    <div class="blue-icon">
                      <span>{{ index + 1 }}</span>
                    </div>
                    <span class="title">{{item.name}}</span>
                  </template>
                <ul>
                    <li>
                      <span>责任区：</span>
                      <span>{{details.areaName}}</span>
                      <a @click.stop="setheader(details.areaid, details.areaName)" v-if="details.areaName">责任区信息>></a>
                      </li>
                      <li>
                        <span>挂牌督学：</span>
                        <span>{{details.supername}}</span>
                        <a @click.stop="lookInfo(details.superid)" v-if="details.supername">个人信息>></a>
                      </li>
                      <li>
                        <span>联系人：</span>
                        <span>{{details.callname}}</span>
                    </li>
                    <li>
                        <span>联系电话：</span>
                        <span>{{details.callphone}}</span>
                    </li>                       
                </ul>
                <div class="buttons">
                    <el-button @click.stop="record(2)">督导过程({{details.processNum}})</el-button>
                    <el-button @click.stop="record(1)">督导记录({{details.recordNum}})</el-button>
                    <el-button @click.stop="record(3)">整改与反馈({{details.rectificationNum}})</el-button>
                    <el-button @click.stop="record(4)">学校情况({{details.situationNum}})</el-button>
                </div>                
                <el-button type="primary" class="edit" @click.stop="edit">编辑</el-button>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </div>

      <!-- 个人信息 -->
      <transition name="slide-left" mode="out-in">
        <div class="Info" v-if="personInfo">
            <div class="header">
              <p>个人信息</p>
              <i class="el-icon-close" @click="personInfo = false"></i>
            </div>
            <div class="info-content">
              <div class="info-head">
                <img :src="perInfo.userFace" v-if="perInfo.userFace">
                <span v-else class="img-box">
                  {{perInfo.name ? perInfo.name.substring(perInfo.name.length-2, perInfo.name.length) : ''}}
                </span>
                <ul>
                  <li>{{perInfo.name}}</li>
                  <li><span>挂牌督导</span><span v-if="perInfo.leaderFlag === 1">,责任区组长</span></li>
                </ul>
              </div>
              <table>
                <tr>
                  <th>所属区域：</th>
                  <th>{{perInfo.areaName}}</th>
                </tr>
                <tr>
                  <th>督导学校：</th>
                  <th class="schoolList">
                    <ul>
                      <li v-for="(item, index) in perInfo.schoolList" :key="index">
                        {{ item.name }}
                      </li>
                    </ul>
                  </th>
                </tr>
                <tr>
                  <th>性别：</th>
                  <th><span v-if="perInfo.sex === 1">男</span><span v-if="perInfo.sex === 2">女</span></th>
                </tr>
                <tr>
                  <th>手机号码：</th>
                  <th>{{perInfo.mobileNumber}}</th>
                </tr>
                <tr>
                  <th>通讯地址：</th>
                  <th>{{perInfo.address}}</th>
                </tr>
                <tr>
                  <th>民族：</th>
                  <th><span>{{perInfo.nation ? peoplesList.filter(item => item.value === perInfo.nation)[0].label : ''}}</span></th>
                </tr>
                <tr>
                  <th>出生年月：</th>
                  <th>{{perInfo.birthday | dateFormat('yyyy-MM-dd')}}</th>
                </tr>
                <tr>
                  <th>政治面貌：</th>
                  <th><span v-if="perInfo.politicalFace === 1">中共党员</span>
                    <span v-if="perInfo.politicalFace === 2">民主党派</span>
                    <span v-if="perInfo.politicalFace === 3">群众</span>
                  </th>
                </tr>
                <tr>
                  <th>人员类型：</th>
                  <th>
                    <span v-if="perInfo.type === 1">责任督学</span>
                    <span v-if="perInfo.type === 2">督学联系员</span>
                  </th>
                </tr>
                <tr>
                  <th>是否在职：</th>
                  <th>
                    <span v-if="perInfo.jobState === 1">是</span>
                    <span v-if="perInfo.jobState === 2">否</span>
                  </th>
                </tr>
                <tr>
                  <th>从教年月：</th>
                  <th><span>{{perInfo.beginTeachingDate | dateFormat('yyyy-MM')}}</span></th>
                </tr>
                <tr>
                  <th>从教督导时间：</th>
                  <th><span>{{perInfo.beginTeachingDate | dateFormat('yyyy-MM')}}</span></th>
                </tr>
                <tr>
                  <th>督导类别：</th>
                  <th>
                    <span v-if="perInfo.userType === '1'">督政</span>
                    <span v-if="perInfo.userType === '2'">督学</span>
                    <span v-if="perInfo.userType === '3'">评估监测</span>                      
                  </th>
                </tr>
                <tr>
                  <th>督导分类：</th>
                  <th>
                    <span v-if="perInfo.jobType === 1">专职</span>
                    <span v-if="perInfo.jobType === 2">兼职</span>
                  </th>
                </tr>                                                                                                                                                                                                            
              </table>
            </div>       
        </div>        
      </transition>
      <!-- 编辑责任区 -->
      <transition name="slide-left" mode="out-in">
        <div class="content" v-if="newVisible">
          <div class="header">
            <p>编辑</p>
            <i class="el-icon-close" @click="newVisible = false"></i>
          </div>
            <ul>
              <li><span class="title-name">单位名称:</span> <span>{{area[activeName].name}}</span></li>
              <li>
                <span class="title-name">所属责任区:</span>
                <el-select v-model="areaId" placeholder="请选择" @change="selectAreaUser">
                    <el-option
                      v-for="item in superAreas"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>                  
              </li>
              <li>
                <span class="title-name">挂牌督学:</span>
                <el-select v-model="userId" placeholder="请选择">
                    <el-option
                      v-for="item in superpersons"
                      :key="item.id"
                      :label="item.areaName"
                      :value="item.id">
                    </el-option>
                  </el-select>                  
              </li>
              <li>
                <span class="title-name">联系人:</span>
                <el-select v-model="contactId" placeholder="请选择">
                    <el-option
                      v-for="item in contacts"
                      :key="item.id"
                      :label="item.areaName"
                      :value="item.id">
                    </el-option>
                  </el-select>                  
              </li>              
            </ul>
            <div class="buttons">
              <el-button @click="newVisible = false">取 消</el-button>  
              <el-button type="primary" @click="save">保 存</el-button>  
            </div>                                 
        </div>
      </transition>

      <!-- 查看责任区 -->
      <transition name="slide-left" mode="out-in">
        <div class="resheader" v-if="headerVisible">
            <div class="header">
              <p>责任区信息</p>
              <i class="el-icon-close" @click="headerVisible = false"></i>
            </div>
            <div class="header-content">
              <table>
                <tr>
                  <th>责任区名称：</th>  
                  <th>{{resName}}</th>
                </tr>
                <tr>
                  <th>责任区组长：</th>  
                  <th>{{resInfo.filter(item => item.leaderFlag === 1)[0] ? resInfo.filter(item => item.leaderFlag === 1)[0].userName : ''}}</th>
                </tr>
                <tr>
                  <th>责任区督学：</th>  
                  <th><span>{{resInfo.filter(item => item.leaderFlag === 0) ? resInfo.filter(item => item.leaderFlag === 0).map(item => item.userName).join(',') : ''}}</span></th>
                </tr>
                <tr>
                  <th>责任区学校：</th>  
                  <th><span>{{schoolList.map(item => item.name).join(',')}}</span></th>
                </tr>                                         
              </table>         
            </div>        
        </div>
      </transition>

      <!--督导记录，督导过程，整改通知，学校情况  -->
        <transition name="slide-left" mode="out-in">
            <div class="super-button" v-if="recordVisible">
                <div class="header">
                  <p v-if="flag === 1">督导记录</p>
                  <p v-if="flag === 2">督导过程</p>
                  <p v-if="flag === 3">整改与反馈</p>
                  <p v-if="flag === 4">学校情况</p>
                  <i class="el-icon-close" @click="recordVisible = false"></i>
                </div>
                <div class="select-box">
                    <span>学年：</span>
                    <el-select v-model="value2" placeholder="请选择">
                      <el-option
                        v-for="item in school"
                        :key="item.schoolYear"
                        :label="item.schoolYearName"
                        :value="item.schoolYear">
                      </el-option>
                    </el-select>
                    <span>学校:</span>
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in supervisors"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select> 
                    <el-button @click="getData(flag)">搜索</el-button>                               
                </div>
                <div class="padding-box">
                    <el-table
                    v-if="flag === 1 || flag === 2"
                    :data="tableData"
                    border
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                    show-overflow-tooltip
                    align="center"
                      label="标题">
                      <template slot-scope="scope">
                        <span class="title-click" @click="lookDetail(scope.row.id, flag)">{{scope.row.title}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"                  
                      label="督导时段">
                      <template slot-scope="scope">
                        <span>{{scope.row.createdDate | dateFormat('yyyy-MM-dd')}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                    align="center"                  
                    label="责任督学">
                    <template slot-scope="scope">
                      <span>{{scope.row.userName}}</span>
                    </template>
                    </el-table-column>                  
                  </el-table>
                  <el-table
                      v-if="flag === 3"
                      :data="tableData"
                      border
                      v-loading="loading"
                      style="width: 100%">
                    <el-table-column
                      show-overflow-tooltip
                      align="center"
                        label="整改编号">
                      <template slot-scope="scope">
                        <span class="title-click" @click="lookDetail(scope.row.id, flag)">{{scope.row.rectificationCode}}</span>
                      </template>
                    </el-table-column>            
                    <el-table-column
                      show-overflow-tooltip
                      align="center"
                        label="标题">
                      <template slot-scope="scope">
                        <span>{{scope.row.title}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="整改期限"
                      align="center">
                      <template slot-scope="scope">
                        <span>{{scope.row.limitDate | dateFormat('yyyy-MM-dd')}}</span>  
                      </template>              
                    </el-table-column>
                    <el-table-column
                      align="center"                  
                      label="状态">
                      <template slot-scope="scope">
                        <span v-if="scope.row.state === 1">整改中</span>
                        <span v-if="scope.row.state === 2">已整改</span>
                        <span v-if="scope.row.state === 3">已确认</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"                  
                      label="反馈日期">
                      <template slot-scope="scope">
                        <span>{{scope.row.feedbackDate | dateFormat('yyyy-MM-dd')}}</span>
                      </template>
                      </el-table-column>
                      <el-table-column
                        align="center"                  
                        label="责任督学">
                        <template slot-scope="scope">
                          <span>{{scope.row.userName}}</span>
                        </template>
                        </el-table-column>                        
                  </el-table>
                  <el-table
                    v-if="flag === 4"
                    :data="tableData"
                    border
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                    show-overflow-tooltip
                    align="center"
                      label="标题">
                      <template slot-scope="scope">
                        <span class="title-click" @click="lookDetail(scope.row.id, flag)">{{scope.row.title}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                    align="center"                  
                    label="责任督学">
                    <template slot-scope="scope">
                      <span>{{scope.row.userName}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="center"                  
                    label="上传时间">
                    <template slot-scope="scope">
                      <span>{{scope.row.createdDate | dateFormat('yyyy-MM-dd')}}</span>
                    </template>
                    </el-table-column>                                
                  </el-table>  
                </div>
                <el-pagination 
                  v-if="flag === 4"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPage"
                  :page-size="pageSize"
                  layout="total, prev, pager, next"
                  :total="totalCount">
                </el-pagination>                                                       
            </div>   
        </transition>
        <!--督导记录，督导过程，整改通知，学校情况 详情信息-->
        <transition name="slide-left" mode="out-in">
          <div class="Info" v-if="detailsView">
            <div class="header">
              <p v-if="flag === 1">督导记录详情</p>
              <p v-if="flag === 2">督导过程详情</p>
              <p v-if="flag === 3">整改与反馈详情</p>
              <p v-if="flag === 4">学校情况详情</p>
              <i class="el-icon-close" @click="detailsView = false"></i>
            </div>
            <div>
              <div class="confirm" v-if="flag === 1">
                <el-row>
                  <el-col :span="5">学期</el-col>
                  <el-col :span="19">{{ DdjlDetails.schoolYear - 1 + '-' + (DdjlDetails.schoolYear) + '年 第' + DdjlDetails.semester + '学期'}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">责任督学</el-col>
                  <el-col :span="19">{{ DdjlDetails.userName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导学校</el-col>
                  <el-col :span="19">{{ DdjlDetails.schoolName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导时段</el-col>
                  <el-col :span="19">{{ DdjlDetails.ddDate | dateFormat('yyyy-MM-dd') }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导过程</el-col>
                  <el-col :span="19">{{ DdjlDetails.ddgxName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">同行人员</el-col>
                  <el-col :span="19">
                    <span v-for="(item, index) in DdjlDetails.userList" :key="index">
                      {{ item.peerUserName }}
                    </span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导方式</el-col>
                  <el-col :span="19">
                    <span v-for="(item, index) in DdjlDetails.ddMethod.split(',')" :key="index">
                      {{ ddMethodList[item - 1].name }}
                    </span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">标题</el-col>
                  <el-col :span="19">{{ DdjlDetails.title }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导主要内容</el-col>
                  <el-col :span="19">{{ DdjlDetails.ddContent }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">附件</el-col>
                  <el-col :span="19">
                    <p v-for="(item, index) in DdjlDetails.fileList" :key="index">
                      {{ item.name }}
                      <span class="cursor-pointer blue-color"  @click="route(item)">预览</span>
                      <span class="cursor-pointer blue-color" @click="downloadFile(item)">下载({{ (item.size / 1024 / 1024).toFixed(2) }})MB</span>
                    </p>
                  </el-col>
                </el-row>
              </div>
              <div class="confirm" v-if="flag === 2">
                <el-row>
                  <el-col :span="5">学期</el-col>
                  <el-col :span="19">{{ DdgcDetails.schoolYear - 1 + '-' + (DdgcDetails.schoolYear) + '年 第' + DdgcDetails.semester + '学期'}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">责任督学</el-col>
                  <el-col :span="19">{{ DdgcDetails.userName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导学校</el-col>
                  <el-col :span="19">{{ DdgcDetails.schoolName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导时段</el-col>
                  <el-col :span="19">{{ DdgcDetails.ddDate | dateFormat('yyyy-MM-dd') }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">标题</el-col>
                  <el-col :span="19">{{ DdgcDetails.title }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导计划及主要内容</el-col>
                  <el-col :span="19">{{ DdgcDetails.ddProcess }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导过程记录</el-col>
                  <el-col :span="19">{{ DdgcDetails.ddProject }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">附件</el-col>
                  <el-col :span="19">
                    <p v-for="(item, index) in DdgcDetails.fileList" :key="index">
                      {{ item.name }}
                      <span class="cursor-pointer blue-color" @click="route(item)">预览</span>
                      <span class="cursor-pointer blue-color" @click="downloadFile(item)">下载({{ (item.size / 1024 / 1024).toFixed(2) }})MB</span>
                    </p>
                  </el-col>
                </el-row>
              </div>
              <div class="confirm" v-if="flag === 3">
                <el-row>
                  <el-col :span="4">学期</el-col>
                  <el-col :span="20">{{ ZgyfkDetails.schoolYear + '-' + (ZgyfkDetails.schoolYear - 1) + '年 第' + ZgyfkDetails.semester + '学期'}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">责任督学</el-col>
                  <el-col :span="20">{{ ZgyfkDetails.userName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">督导学校</el-col>
                  <el-col :span="20">{{ ZgyfkDetails.schoolName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">整改编号</el-col>
                  <el-col :span="20">{{ ZgyfkDetails.rectificationCode }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">督导记录</el-col>
                  <el-col :span="20">督导记录</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">整改标题</el-col>
                  <el-col :span="20">{{ ZgyfkDetails.title }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">通知日期</el-col>
                  <el-col :span="20">{{ ZgyfkDetails.createdDate | dateFormat('yyyy-MM-dd') }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">整改期限</el-col>
                  <el-col :span="20">{{ ZgyfkDetails.limitDate | dateFormat('yyyy-MM-dd') }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">问题描述</el-col>
                  <el-col :span="20">
                    {{ ZgyfkDetails.remark }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">附件</el-col>
                  <el-col :span="20">
                    <p v-for="(item, index) in ZgyfkDetails.fileList" :key="index">
                      {{ item.name }}
                      <span class="cursor-pointer blue-color"  @click="route(item)">预览</span>
                      <span class="cursor-pointer blue-color" @click="downloadFile(item)">下载({{ (item.size / 1024 / 1024).toFixed(2) }})MB</span>
                    </p>
                  </el-col>
                </el-row>
              </div>
              <div class="confirm" v-if="flag === 4">
                <el-row>
                  <el-col :span="5">学期</el-col>
                  <el-col :span="19">{{ XxqkDetails.schoolYear + '-' + (XxqkDetails.schoolYear - 1) + '年 第' + XxqkDetails.semester + '学期'}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">责任督学</el-col>
                  <el-col :span="19">{{ XxqkDetails.userName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导学校</el-col>
                  <el-col :span="19">{{ XxqkDetails.schoolName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">标题</el-col>
                  <el-col :span="19">{{ XxqkDetails.title }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">学校情况</el-col>
                  <el-col :span="19">{{ XxqkDetails.situation }}</el-col>
                </el-row>
              </div>
            </div>
          </div>
        </transition>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { notice, success } from '../../api/index'
import server from '../../utils/axios'
import { amapManager } from 'vue-amap'
import icon from '../../assets/images/Location A Green Copy 3.png'
import iconRed from '../../assets/images/Location A Green Copy 6.png'
export default {
  name: 'organization',
  data () {
    return {
      superAreas: [],
      contactId: '',
      contacts: [],
      areaId: '',
      userId: '',
      loading: false,
      detailLoading: false,
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      peoplesList: [
        { label: '汉族', value: '01' },
        { label: '壮族', value: '02' },
        { label: '回族', value: '03' },
        { label: '满族', value: '04' },
        { label: '维吾尔族', value: '05' },
        { label: '苗族', value: '06' },
        { label: '彝族', value: '07' },
        { label: '土家族', value: '08' },
        { label: '藏族', value: '09' },
        { label: '蒙古族', value: '10' },
        { label: '侗族', value: '11' },
        { label: '布依族', value: '12' },
        { label: '瑶族', value: '13' },
        { label: '白族', value: '14' },
        { label: '朝鲜族', value: '15' },
        { label: '哈尼族', value: '16' },
        { label: '黎族', value: '17' },
        { label: '哈萨克族', value: '18' },
        { label: '傣族', value: '19' },
        { label: '畲族', value: '20' },
        { label: '傈僳族', value: '21' },
        { label: '东乡族', value: '22' },
        { label: '仡佬族', value: '23' },
        { label: '拉祜族', value: '24' },
        { label: '佤族', value: '25' },
        { label: '水族', value: '26' },
        { label: '纳西族', value: '27' },
        { label: '羌族', value: '28' },
        { label: '土族', value: '29' },
        { label: '仫佬族', value: '30' },
        { label: '锡伯族', value: '31' },
        { label: '柯尔克孜族', value: '32' },
        { label: '景颇族', value: '33' },
        { label: '达斡尔族', value: '34' },
        { label: '撒拉族', value: '35' },
        { label: '布朗族', value: '36' },
        { label: '毛南族', value: '37' },
        { label: '塔吉克族', value: '38' },
        { label: '普米族', value: '39' },
        { label: '阿昌族', value: '40' },
        { label: '怒族', value: '41' },
        { label: '鄂温克族', value: '42' },
        { label: '京族', value: '43' },
        { label: '基诺族', value: '44' },
        { label: '德昂族', value: '45' },
        { label: '保安族', value: '46' },
        { label: '俄罗斯族', value: '47' },
        { label: '裕固族', value: '48' },
        { label: '乌孜别克族', value: '49' },
        { label: '门巴族', value: '50' },
        { label: '鄂伦春族', value: '51' },
        { label: '独龙族', value: '55' },
        { label: '赫哲族', value: '53' },
        { label: '高山族', value: '54' },
        { label: '珞巴族', value: '55' },
        { label: '塔塔尔族', value: '56' }
      ],
      icon,
      iconRed,
      restaurants: [],
      state1: '',
      details: {
        areaid: ''
      },
      userList: [],
      markers: [],
      schoolList: [],
      tableData: [],
      perInfo: {},
      activeIndex: 0,
      resInfo: [],
      state: [],
      school: [],
      value2: '',
      supervisors: [],
      schoolYear: '',
      semester: '',
      value3: '',
      recordVisible: false,
      flag: '',
      organizes: ['一幼', '二幼'],
      schools: ['一幼', '二幼', '三幼', '四幼'],
      members: ['上海', '北京', '广州', '深圳'],
      persons: ['上海'],
      activeName: 0,
      selections: [],
      radios: [
        {value: '1', name: '张三'},
        {value: '2', name: '李四'},
        {value: '3', name: '王五'},
        {value: '4', name: '赵六'},
        {value: '5', name: '111'},
        {value: '6', name: '张222三'},
        {value: '7', name: '33'},
        {value: '8', name: '张三44'}
      ],
      ddMethodList: [
        { name: '随机听课', id: 1 },
        { name: '查阅资料', id: 2 },
        { name: '列席会议', id: 3 },
        { name: '座谈走访', id: 4 },
        { name: '问卷调查', id: 5 },
        { name: '校园巡视', id: 6 },
        { name: '访谈家长', id: 7 }
      ],
      radioValue: '',
      deleteDialog: false,
      saveDialog: false,
      ruleForm: {
        name: ''
      },
      item: {},
      rules: {
        name: [
          { required: true, message: '责任区名称不能为空', trigger: 'blur' }
        ]
      },
      newVisible: false,
      clickflag: true,
      headerVisible: false,
      superpersons: [],
      defaultPath: '0',
      key: [],
      searchName: '',
      areas: [],
      area: [],
      amapManager,
      personInfo: false,
      zoom: 12,
      center: [116.62, 40.32],
      events: {
        init: (o) => {},
        'moveend': () => {
        },
        'zoomchange': () => {
        },
        'click': (e) => {
        }
      },
      detailsView: false,
      DdjlDetails: '',
      DdgcDetails: '',
      ZgyfkDetails: '',
      XxqkDetails: '',
      plugin: [{
        pName: 'ToolBar',
        // defaultType: 0,
        ruler: false,
        direction: false,
        locate: false,
        events: {
          init (o) {
          }
        }
      }]
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
  methods: {
    route (val) {
      let url
      url = `${this.previewUrl}${this.rootUrl}${this.previewInterface}?attachmentId=${val.id}`
      window.open(`#/file/fileInfo?id=${val.id}&url=${url}&size=${val.size}`)
    },
    search () {
      if (this.markers.length !== 0) {
        if (this.markers.filter(n => n.icon === this.iconRed)[0]) {
          this.markers.filter(n => n.icon === this.iconRed)[0].icon = this.icon
        }
      }
      server.get(`/zrxxController/searchSchool?SchoolName=${this.state1}`)
      .then(res => {
        if (res.data.code === 1) {
          if (res.data.result) {
            this.area.map((item, index) => {
              if (item.id === res.data.result[0].id) {
                this.activeName = index
              }
            })
          }
          if (res.data.result[0].longitude) {
            this.center = [res.data.result[0].longitude, res.data.result[0].latitude]
            if (this.markers.filter(n => n.position[0] === res.data.result[0].longitude).length !== 0) {
              this.markers.filter(n => n.position[0] === res.data.result[0].longitude)[0].icon = this.iconRed
              this.state1 = ''
            }
          } else {
            notice('您搜索的地点还没有设置经纬度，无法显示')
          }
        } else {
          notice(res.data.message)
        }
      })
    },
    // 详情
    lookDetail (id, flag) {
      if (this.flag === 1) {
        server.get(`/zrxxController/getDdjlDetails?id=${id}`).then(res => {
          if (res.data.code === 1) {
            this.DdjlDetails = res.data.result
            console.log(res.data.result)
          }
        })
      } else if (this.flag === 2) {
        server.get(`/zrxxController/getDdgcDetails?id=${id}`).then(res => {
          if (res.data.code === 1) {
            this.DdgcDetails = res.data.result
            console.log(res.data.result)
          }
        })
      } else if (this.flag === 3) {
        server.get(`/zrxxController/getZgyfkDetails?id=${id}`).then(res => {
          if (res.data.code === 1) {
            this.ZgyfkDetails = res.data.result
            console.log(res.data.result)
          }
        })
      } else if (this.flag === 4) {
        server.get(`/zrxxController/getXxqkDetails?id=${id}`).then(res => {
          if (res.data.code === 1) {
            this.XxqkDetails = res.data.result
            console.log(res.data.result)
          }
        })
      }
      this.recordVisible = false
      this.detailsView = true
    },
    // 下载
    downloadFile (val) {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/zrxxController/downloadFileById?fileId=${val.id}`
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData(4)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getData(4)
    },
    handleSelect () {},
    querySearch (queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    chooseschool (index) {
      this.newVisible = false
      this.headerVisible = false
      this.personInfo = false
      this.recordVisible = false
      this.activeIndex = index
      this.activeName = 0
      this.getSchoolList(this.state[this.activeIndex].id)
    },
    async record (flag) {
      this.detailsView = false
      this.flag = flag
      this.value3 = this.area[this.activeName].id
      await this.getSchoolYearAndSemeter()
      await this.getCompanyList()
      this.getData(flag)
      this.headerVisible = false
      this.recordVisible = true
      this.newVisible = false
      this.personInfo = false
    },
    getData (flag) {
      this.loading = true
      setTimeout(() => {
        if (flag === 1) {
          // 督导记录
          server.get(`/zrxxController/selectSchoolRecord?schoolId=${this.value3}&schoolYear=${this.value2}`)
          .then(res => {
            if (res.data.code === 1) {
              res.data.result ? this.tableData = res.data.result : this.tableData = []
            } else {
              notice(res.data.message)
            }
            this.loading = false
          })
        } else if (flag === 2) {
          // 督导过程
          server.get(`/zrxxController/selectSchoolProcess?schoolId=${this.value3}&schoolYear=${this.value2}`)
          .then(res => {
            if (res.data.code === 1) {
              res.data.result ? this.tableData = res.data.result : this.tableData = []
            } else {
              notice(res.data.message)
            }
            this.loading = false
          })
        } else if (flag === 3) {
          // 整改与反馈
          server.get(`/zrxxController/selectSchoolRectification?schoolId=${this.value3}&schoolYear=${this.value2}`)
          .then(res => {
            if (res.data.code === 1) {
              res.data.result ? this.tableData = res.data.result : this.tableData = []
            } else {
              notice(res.data.message)
            }
            this.loading = false
          })
        } else if (flag === 4) {
          // 学校情况
          server.get(`/zrxxController/selectSchoolSituation?schoolId=${this.value3}&schoolYear=${this.value2}&pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
          .then(res => {
            if (res.data.code === 1) {
              this.totalCount = res.data.result.totalCount
              res.data.result.list ? this.tableData = res.data.result.list : this.tableData = []
            } else {
              notice(res.data.message)
            }
            this.loading = false
          })
        }
      }, 300)
    },
    async getSchoolYearAndSemeter () {
      await server.get(`zrxxController/getSchoolYearAndSemeter`)
      .then(res => {
        if (res.data.code === 1) {
          this.school = res.data.result.schoolYearSemesterList.filter(item => item.semester === 1).map(item => ({...item, schoolYearName: item.schoolYearName.slice(0, 11)}))
          this.schoolYear = res.data.result.schoolYearSemesterToWebDto.schoolYear
          this.semester = res.data.result.schoolYearSemesterToWebDto.semester
          this.value2 = this.schoolYear
        } else {
          notice(res.data.message)
        }
      })
    },
    async getCompanyList () {
      await server.get(`/zrxxController/getCompanyList`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result ? this.supervisors = res.data.result : this.supervisors = []
        } else {
          notice(res.data.message)
        }
      })
    },
    lookInfo (id) {
      server.get(`/zrxxController/selectUserById?id=${id}`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result ? this.perInfo = res.data.result[0] : this.perInfo = {}
        } else {
          notice(res.data.message)
        }
      })
      this.headerVisible = false
      this.personInfo = true
      this.recordVisible = false
      this.newVisible = false
    },
    remove (index) {
      this.persons.splice(index, 1)
    },
    removed (index) {
      this.organizes.splice(index, 1)
    },
    edit () {
      this.headerVisible = false
      this.personInfo = false
      this.recordVisible = false
      this.newVisible = true
      this.selectAreaAll()
      this.selectContact()
    },
    selectContact () {
      server.get(`/zrxxController/selectAssociateUser?schoolId=${this.area[this.activeName].id}`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result ? this.contacts = res.data.result : this.contacts = []
        } else {
          notice(res.data.message)
        }
      })
    },
    selectAreaAll () {
      server.get(`/zrxxController/selectAreaAll`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result ? this.superAreas = res.data.result : this.superAreas = []
          this.areaId = this.details.areaid
          if (this.areaId === null) {
            return false
          } else {
            this.selectAreaUser()
          }
        } else {
          notice(res.data.message)
        }
      })
    },
    selectAreaUser () {
      server.get(`/zrxxController/selectAreaUser?areaId=${this.areaId}`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result ? this.superpersons = res.data.result : this.superpersons = []
          if (this.superpersons.some(item => item.id === this.details.superid)) {
            this.userId = this.details.superid
          } else {
            this.userId = ''
          }
        } else {
          notice(res.data.message)
        }
      })
    },
    set () {},
    handleOpen () {},
    handleClose () {},
    deleteArea () {},
    addArea () {
      if (this.clickflag) {
        this.areas.push({name: '', edit: true})
      } else {
        return false
      }
    },
    save () {
      if (!this.userId) {
        notice('请选择挂牌督导')
        return
      }
      if (!this.contactId) {
        notice('请选择联系人')
        return
      }
      if (!this.areaId) {
        notice('请选择责任区')
        return
      }
      server.post(`/zrxxController/updateAreaMessage`, {
        schoolId: this.area[this.activeName].id,
        areaId: this.areaId,
        userId: this.userId,
        contactUserId: this.contactId
      }).then(res => {
        if (res.data.code === 1) {
          success(res.data.message)
          this.newVisible = false
          this.getSchoolList(this.state[this.activeIndex].id)
        } else {
          notice(res.data.message)
        }
      })
    },
    setheader (id, name) {
      this.resName = name
      server.get(`/zrxxController/selectAreaMessage?id=${id}`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result ? this.resInfo = res.data.result : this.resInfo = []
          if (this.resInfo.length !== 0) {
            this.schoolList = this.resInfo[0].schoolList
          }
        } else {
          notice(res.data.message)
        }
      })
      this.headerVisible = true
      this.newVisible = false
      this.personInfo = false
      this.recordVisible = false
    },
    getSchoolList (id) {
      server.get(`/zrxxController/selectSchoolList?sectionId=${id}`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result ? this.area = res.data.result : this.area = []
          this.markers = []
          this.area.forEach((item, index) => {
            if (item.longitude) {
              this.markers.push({
                icon: this.icon,
                position: [item.longitude ? item.longitude : 0, item.latitude ? item.latitude : 0],
                events: {
                  click: (e) => {
                    this.markers = this.markers.map(n => ({...n, icon: this.icon}))
                    this.markers.filter(n => n.position[0] === item.longitude)[0].icon = this.iconRed
                    this.activeName = index
                  }
                }
              })
            }
          })
          if (this.markers.length !== 0) {
            this.markers.filter(n => n.position[0] === this.area[this.activeName].longitude).icon = this.iconRed
          }
          if (this.area[this.activeName]) {
            this.getSchoolDetail(this.area[this.activeName].id)
          }
        } else {
          notice(res.data.message)
        }
      })
    },
    getSchoolDetail (id) {
      if (this.markers.length !== 0) {
        this.markers = this.markers.map(item => ({...item, icon: this.icon}))
        if (this.markers[this.activeName]) {
          this.markers[this.activeName].icon = this.iconRed
        }
      }
      this.headerVisible = false
      this.newVisible = false
      this.personInfo = false
      this.recordVisible = false
      this.detailLoading = true
      setTimeout(() => {
        server.get(`/zrxxController/selectSchoolDetails?schoolId=${id}`)
        .then(res => {
          if (res.data.code === 1) {
            let data = res.data.result[0]
            if (data) {
              this.details = {
                areaid: data.id,
                areaName: data.areaName,
                superid: data.userList.length !== 0 && data.userList.filter(item => item.type === 1).length !== 0 ? data.userList.filter(item => item.type === 1)[0].userId : '',
                supername: data.userList.length !== 0 && data.userList.filter(item => item.type === 1).length !== 0 ? data.userList.filter(item => item.type === 1)[0].userName : '',
                callname: data.userList.length !== 0 && data.userList.filter(item => item.type === 2).length !== 0 ? data.userList.filter(item => item.type === 2)[0].userName : '',
                callphone: data.userList.length !== 0 && data.userList.filter(item => item.type === 2).length !== 0 ? data.userList.filter(item => item.type === 2)[0].mobileNumber : '',
                processNum: data.processNum,
                recordNum: data.recordNum,
                situationNum: data.situationNum,
                rectificationNum: data.rectificationNum
              }
              data.userList.length !== 0 && data.userList.filter(item => item.type === 2).length !== 0 ? this.contactId = data.userList.filter(item => item.type === 2)[0].userId : this.contactId = ''
            }
          } else {
            notice(res.data.message)
          }
          this.detailLoading = false
        })
      }, 300)
    },
    getSemester () {
      server.get(`zrxxController/selectAllSection`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result ? this.state = res.data.result : this.state = []
          this.getSchoolList(this.state[this.activeIndex].id)
        } else {
          notice(res.data.message)
        }
      })
    },
    daochu () {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/zrxxController/exportAreaMessage?sectionId=${this.state[this.activeIndex].id}`
    }
  },
  computed: {
    ...mapGetters([
      'staticUrl',
      'previewUrl',
      'rootUrl',
      'previewInterface'
    ])
  },
  mounted () {
    setTimeout(async () => {
      await this.getSemester()
      this.restaurants = []
      await server.get(`/zrxxController/searchSchool?SchoolName=${this.state1}`)
        .then(res => {
          if (res.data.code === 1) {
            if (res.data.result) {
              let obj = {}
              res.data.result.map(item => {
                obj = {
                  value: item.name,
                  areaName: item.areaName
                }
                this.restaurants.push(obj)
                return this.restaurants
              })
            }
          } else {
            notice(res.data.message)
          }
        })
    }, 500)
  },
  watch: {
    activeName () {
      if (this.activeName === '') {
        this.markers.filter(item => item.icon === this.iconRed)[0].icon = this.icon
      }
    }
  }
}
</script>
<style lang="scss">
.organization {
  position: relative;

  .el-icon-close {
    cursor: pointer;
  }

  .title-click {
    cursor: pointer;
    &:hover {
      color: #20A0FF;      
    }
  }

  .edit {
    margin-left: 35% !important;
    width: 85px !important;
    height: 38px;
    background: #20A0FF;
    border-radius: 4px;      
  }

  .top-left {
    width: 360px;
    height: 50px;
    background: #FFFFFF;
    position: absolute;
    top: 20px;
    left: 24px;
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.22);
    border-radius: 4px;

    ul {
          &:after {
            display: block;
            content: '';
            height: 0;
            clear: both;
            overflow: hidden;
            visibility: hidden;
            
          }
          li {
            height: 50px;
            line-height: 50px;
            float: left;
            text-align: center;
            cursor: pointer;
          
            span {
              border-right: 1px solid #ccc; 
              padding: 0px 28px;               
            }

            &:last-child {
              span {
                border-right: none;
              }
            }

          }
          .active {
            span {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #48B2EC;                
            }
          }
        }      
  }

  .padding-box {
    padding: 20px;
  }

  .headman, .super {
    color: #48B2EC;
    cursor: pointer;
  }

  .button-box {
    width: 100%;
    height: 40px;
    padding-left: 12.5%;
    margin-top: 20px;
    clear: both;
  }

  .deleteDia, .saveDia {
      .el-dialog {
        width: 390px;
        height:　202px;

        &>.el-dialog__body {
          padding: 20px 20px;

          &:after {
            display: block;
            content: '';
            clear: both;
            overflow: hidden;
            visibility: hidden;            
          }
        }
        img {
          width: 40px;
          height: 40px;
          float: left;
          margin-right: 10px;
        }
        ul {
          float: left;
          li {
            width: 296px;
          }
        }
      }
    }  
  .amap-demo {
    height: calc(100vh - 70px);
  }
  .header-content {
    &>table {
        width: 340px;
        margin: 20px auto;
        background: #fff;
        tr {
          border: 1px solid #eee;
          padding-left: 10px;            
          th {
            &:first-child {
              width: 100px;
              text-align: right;
              line-height: 40px;
            }
          }
        }
      }      
    &>p {
      padding: 20px;
      font-weight: bold;
    }
    &>span {
      float: left;
      margin-left: 20px;
      margin-right: 10px;
    }
    &>.choose {
      float: left;
      margin: 0px auto 15px auto;
      background: #fff;
      width: 575px;
      padding: 15px;
      height: 477px;
      // overflow-y: auto;
      border: 1px solid #DDDDDD;      

      &>.el-input {
        margin-bottom: 25px;
        float: right;
        width: 180px;

        &>.el-input__inner {
          width: 180px;
          height: 35px;
        }
      }

      .el-radio {
        margin-left: 0px;
        margin-right: 15px;
        margin-bottom: 15px;
        width: 80px;
      }
    }
  }
  .ressuper, .schoolsuper {

    .super-content {
      margin-top: 10px;
      padding: 20px;

      &>ul {

        &>li {
          margin-bottom: 20px;

          &:after {
            display: block;
            content: '';
            clear: both;
            overflow: hidden;
            visibility: hidden;            
          }

          &>span {
            float: left;
            width: 75px;
            height: 24px;
            display: block;
            font-family: PingFang-SC-Regular;
            font-size: 14px;
            color: #333333;            
          }          
        }
      }

      .select {
        background: #fff;
        float: left;
        width: 575px;
        height: 230px;
        border: 1px solid #DDDDDD;
        padding: 10px;


        &>.el-checkbox-group {
          clear: both;
          padding-left: 10px;
        }

        &>.el-input {
        margin-bottom: 20px;
        float: right;
        width: 252px;

        &>.el-input__inner {
          width: 252px;
          height: 35px;
        }
      }        
        
        &>span {
          width: 73px;
          height: 24px;
          display: block;
          background: rgba(32,160,255,0.10);
          border: 1px solid rgba(32,160,255,0.20);
          border-radius: 4px;
          font-family: MicrosoftYaHei;
          font-size: 12px;
          color: #20A0FF;
          letter-spacing: 0;
          line-height: 14px; 
          text-align: center;
          line-height: 24px;
          float: left;
          margin-right: 20px;
          
          &>i {
            cursor: pointer;
          }
        }
      }
    }
  }
  .Info {
    width: 598px !important;

    &>.info-content {
      padding: 20px;
      background: #fff;
      margin: 20px;
      // max-height: calc(100vh - 70px);
      // overflow-y: auto;

      .info-head {
        // height: 217px;
        margin-bottom: 30px;

        &:after {
          display: block;
          content: '';
          height: 0;
          clear: both;
          overflow: hidden;
          visibility: hidden;          
        }

        img {
          width: 100px;
          height: 100px;
          margin-right: 20px;
          float: left;
        }
        .img-box {
          width: 100px;
          height: 100px;
          line-height: 100px;
          background-color: #71EAC2;
          color: #fff;
          font-size: 16px;
          text-align: center;
          display: block;
          float: left;
          margin-right: 20px;
        }
        ul {
          max-width: 337px;
          float: left;

          li {
            line-height: 40px;
            &:first-child {
              font-family: PingFangSC-Medium;
              font-size: 18px;
              color: #333333;
              font-weight: bold;
            }
            &:last-child {
              span {
                font-family: PingFang-SC-Regular;
                font-size: 18px;
                color: #333333;
              }
            }
          }
        }
      }
      &>table {
        width: 518px;
        tr {
          th {
            border: 1px solid #eee;
            &:first-child {
              width: 130px;
              text-align: right;
              line-height: 40px;
            }
            &:last-child {
              padding-left: 20px;
            }
            &.schoolList {
              line-height: 2.3;
            }
          }
        }
      }
    }
    .confirm {
      margin-top: 20px;
      border: 1px solid #DADADA;
      border-bottom: 0;
      .el-row {
        border-bottom: 1px solid #DADADA;
      }
      .el-col {
        border-left: 1px solid #DADADA;
        padding: 8px 5px;
        min-height: 35px;
      }
      .el-col:nth-child(1) {
        text-align: center;
        border-left: 0;
      }
      .el-col:nth-child(2) {
      }
    }
  }
  .super-button {

    &>.el-pagination {
      margin-top: 20px;
      text-align: right;
      margin-right: 20px;
    }

    .select-box {

      margin-top: 20px;
      text-align: right;
      margin-right: 10px;

      .el-select>.el-input {
        width: 150px;
      }
      .el-select {
        margin-right: 10px;
      }      
    }
  }
  .resheader {
    width: 360px !important;
  }
  .ressuper, .schoolsuper, .super-button {
    width: 720px !important;
  }
  .resheader, .content, .ressuper, .schoolsuper, .Info, .super-button {
    width: 450px;
    background: #F5F5F5;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15);
    position: absolute;
    right: 0px;
    top: 0px;
    bottom: 0px;
    overflow-y: auto;
    
    .header {
      padding: 20px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 20px;
            
      &:after {
        display: block;
        content: '';
        clear: both;
        overflow: hidden;
      }
      p {
        float: left;
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #333333;
        font-weight: bold;
      }
      i {
        float: right;
        font-size: 18px;
        font-weight: bold;
      }
    }    
  }
  .content {
    &>.el-form {
      margin-top: 30%;
    }

    .header {
      padding: 20px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 20px;
            
      &:after {
        display: block;
        content: '';
        clear: both;
        overflow: hidden;
      }
      p {
        float: left;
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #333333;
        font-weight: bold;
      }
      i {
        float: right;
        font-size: 18px;
        font-weight: bold;
      }
    }
    .el-input {
      margin-bottom: 10px;
    }
    ul {
      width: 80%;
      padding: 20px;
      margin: 0 auto;
      li {
        line-height: 50px;
        height: 50px;

        .title-name {
          width: 120px;
          text-align: right;
          display: block;
          float: left;
          margin-right: 10px
        }
        p {
          margin-bottom: 10px;
          font-size: 16px;
        }
        &:last-child {
          p {
            height: 40px;
            border: 2px dashed #ccc;
            font-size: 16px;
            line-height: 40px;
            text-align: center;
            cursor: pointer;
          }
        }
      }
    }
    .buttons {
      width: 90%;
      margin: 30px auto;
      text-align: center;
      .el-button {
        margin-right: 20px;
      }
    }
  }
  .search-box {
    position: absolute;
    right: 20px;
    top: 20px;

    .el-input {
      width: 360px;
      height: 36px;
    }
  }    
  .common-left{
    position: absolute;
    overflow-y: auto;
    top: 85px;
    left: 20px;
    bottom: 20px;
    width: 360px;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0px 0px 4px 0 rgba(0,0,0,0.28);
    padding: 20px;
    box-sizing: border-box;
      
    .el-collapse{
      margin-top: 20px;
      border: 0;

      .blue-icon{
          width: 24px;
          height: 37px;
          background: url('../../assets/images/Location A Green Copy 3.png');
          background-size: cover;
          text-align: center;
          line-height: 30px;
          margin-top: 5px;
          float: left;
          span{
            color: #fff;
            margin-left: 2px;              
          }
        } 
        
        .title {
          float: left;
          margin-left: 9px;
        }
      .el-collapse-item{
        position: relative;
        margin-top: 5px;
        border: 1px solid #E6EBF5;
        .el-collapse-item__header{
          border: 0;
          padding: 5px 10px;
          min-height: 44px;
          position: relative;

          .blue-icon{
            width: 24px;
            height: 37px;
            background: url('../../assets/images/Location A Green Copy 3.png');
            background-size: cover;
            text-align: center;
            line-height: 30px;
            span{
              color: #fff;
            }
          }            
          &>a {
            position: absolute;
            right: 10px;
            top: 5px;
          }
          i{
            display: none;
          }
        }
        .el-collapse-item__wrap{
          border: 0;
          padding: 10px;
          .el-collapse-item__content{
            padding-bottom: 10px;
            margin-bottom: 0px;
          }
        }
      }
      .is-active{
        border: #ddd;
        .blue-icon{
          background: url('../../assets/images/Location A Green Copy 6.png') !important;
          background-size: cover !important;
        }       
        .el-collapse-item__wrap,.el-collapse-item__header{
          background: #F5F5F5;
        }
      }
    }

    .el-collapse-item__content {
      margin-bottom: 10px;
      &>ul {
        li {
          padding-left: 10px;
          line-height: 30px;

          &:first-child {
            height: 30px;
              line-height: 30px;
              diaplay: block;
          }

          &>a {
            float: right;
            font-family: PingFang-SC-Regular;
            font-size: 14px;
            color: #48B2EC;
            cursor: pointer;
          }
        }         
      }
      .el-button {
        margin-left: 5%;
        margin-top: 10px;
        width: 124px;
      }
    }

    &>.el-row{
      .el-col:nth-child(1){
        text-align: right;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #ccc;          

        span {
          float: left;
        }

        a {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #48B2EC;
          cursor: pointer; 
        }
      }
      /* .el-col:nth-child(2){
        text-align: right;
        span{
          font-weight: bold;
        }
      } */
    }
  }
  .blue-color {
    color: #3FADFF;
  }

  .red-color {
    color: #FF6464;
  }
}
</style>
  
  