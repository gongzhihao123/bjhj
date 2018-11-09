<template>
  <div class="response">
      <el-amap ref="map" vid="amapDemo" :amap-manager="amapManager" :center="center" :zoom="zoom"  :events="events" class="amap-demo">
          <el-amap-marker v-for="(marker, index) in markers" :key="index" :icon="marker.icon" :position="marker.position" :events="marker.events" :vid="index"></el-amap-marker>
      </el-amap>
      <div class="coordinates" v-if="buttonShow" :style="{top: coordinatesTop, left: coordinatesLeft}">
        <!-- N:{{ coordinatesX }} E: {{ coordinatesY }} -->
        <p>{{schoolName}}</p>
        <ul>
          <li><a class="add">将该学校添加到：</a></li>
          <li v-for="(item, index) in area" @click="uploadArea(item.id)" :key="index"><span :class="{active: area.filter(item => item.name === areaName).length !== 0 && item.name === areaName}">{{item.name}}</span></li>
        </ul>
      </div>  
      <div class="search-box">
          <el-autocomplete
          class="inline-input"
          v-model="state1"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect"
        ></el-autocomplete>
          <el-button @click="search">搜索</el-button>          
      </div>
      <div class="common-left">
        <el-row>
           <el-col :span="24">
            <a @click="add">+新增责任区</a>
          </el-col>
          <el-col :span="24">
            <el-collapse v-model="activeName" accordion @change="getAreaDetails">
              <el-collapse-item :title="item.name" :name="index" v-for="(item, index) in area" :key="index" v-loading="detailLoading && activeName === index">
                  <template slot="title">
                      <span>{{item.name}}</span>
                      <a @click.stop="deleteRes" v-if="activeName === index">删除责任区</a>
                  </template>
                <ul>
                    <li>
                      <span>责任区组长：</span>
                      <span class="headman" @click="lookInfo(areaInfo.areaheadId)">{{areaInfo.areaheader}}</span>
                      <a @click="setheader(true)">设置</a>
                      </li>
                      <li>
                        <span>责任区督学：</span>
                        <div class="schools">
                          <span class="super" @click="lookInfo(item.userId)" v-for="(item, index) in areaInfo.areasupers" :key="index">{{item.userName}}</span>
                        </div>
                        <a @click="setsuper(true)">设置</a>
                      </li>
                      <li>
                        <span>责任学校：</span>
                        <div class="schools">
                            <span v-for="(i, index) in areaInfo.schoolList" :key="index">{{i.schoolName}}&nbsp;</span>
                        </div>
                        <a @click="setschool(true)">设置</a>
                    </li>                   
                </ul>
                <div class="buttons">
                    <el-button @click="record(1)">督导记录<span v-if="areaInfo.recordNum">({{areaInfo.recordNum}})</span><span v-else>(0)</span></el-button>
                    <el-button @click="record(2)">督导过程<span v-if="areaInfo.processNum">({{areaInfo.processNum}})</span><span v-else>(0)</span></el-button>
                    <el-button @click="record(3)">整改与反馈<span v-if="areaInfo.rectificationNum">({{areaInfo.rectificationNum}})</span><span v-else>(0)</span></el-button>
                    <el-button @click="record(4)">学校情况<span v-if="areaInfo.situationNum">({{areaInfo.situationNum}})</span><span v-else>(0)</span></el-button>
                  </div>                
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </div>

      <!-- 个人信息 -->
      <transition name="slide-left" mode="out-in">
        <div class="Info" v-if="personInfo">
            <div class="header">
              <p>{{area[activeName].name}}>个人信息</p>
              <i class="el-icon-close" @click="personInfo = false"></i>
            </div>
            <div class="info-content">
              <div class="info-head">
                <img :src="perInfo.userFace" v-if="perInfo.userFace">
                <span class="img-show" v-else>
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
                  <th>{{perInfo.companyName}}</th>
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
      <!-- 新增责任区 -->
      <transition name="slide-left" mode="out-in">
        <div class="content" v-if="newVisible">
          <div class="header">
            <p>新增责任区</p>
            <i class="el-icon-close" @click="newVisible = false"></i>
          </div>
            <ul>
              <li v-for="(item, index) in areas" :key="index">
                <p @click="item.showinput = true" v-if="!item.showinput">{{item.name}}</p>
                <el-input type="text" v-model="areas[index].name" v-focus="true" :maxlength="20" v-if="item.showinput" @blur="judgetitle(item.name, index)"></el-input>
              </li>
              <li>
                <el-input type="text" v-model.trim="Areaname" v-focus="true" :maxlength="20" @blur="judge(Areaname)"></el-input>
                <a @click="judge(Areaname)">+新增责任区</a>
              </li>
            </ul>
            <div class="buttons">
              <el-button @click="newVisible = false">取 消</el-button>  
              <el-button type="primary" @mousedown.native="save">保 存</el-button>  
            </div>                                 
        </div>
      </transition>

      <!-- 设置责任区组长 -->
      <transition name="slide-left" mode="out-in">
        <div class="resheader" v-if="headerVisible">
            <div class="header">
              <p>{{area[activeName].name}}>责任区组长</p>
              <i class="el-icon-close" @click="headerVisible = false"></i>
            </div>
            <div class="header-content">
              <p>{{area[activeName].name}}组长： {{areaInfo.areaheader}}</p> 
              <span>全部人员</span>
              <div class="choose">
                <el-input v-model="searchName" placeholder="请输入姓名">
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="setheader(false)"></i>                  
                </el-input>                  
                <el-radio-group v-model="radioValue">
                    <el-radio :label="m.userId" v-for="(m, index) in radios" :key="index">{{m.userName}}</el-radio>
                </el-radio-group>               
              </div> 
              <div class="button-box">
                  <el-button @click="headerVisible = false">取 消</el-button>  
                  <el-button type="primary" @click="saveheader">保 存</el-button>  
              </div>              
            </div>        
        </div>
      </transition>

      <!-- 设置责任区督学 -->
      <transition name="slide-left" mode="out-in">
        <div class="ressuper" v-if="superVisible">
            <div class="header">
              <p>{{area[activeName].name}}>责任区督学</p>
              <i class="el-icon-close" @click="superVisible = false"></i>
            </div>
            <div class="super-content">
              <ul>
                <li>
                  <span>已选择： </span>  
                  <div class="select">
                    <span v-for="(sel, index) in person" :key="index">{{sel}} <i class="el-icon-close" @click="remove(index)"></i></span>
                  </div>
                </li>
                <li>
                  <span>全部人员：</span>
                  <div class="select">
                      <el-input v-model="searchName" placeholder="请输入姓名">
                          <i slot="suffix" class="el-input__icon el-icon-search" @click="setsuper(false)"></i>                  
                      </el-input>                       
                      <el-checkbox-group 
                        v-model="person">
                        <el-checkbox v-for="(member, index) in members" :label="member.userName" :key="index">{{member.userName}}</el-checkbox>
                      </el-checkbox-group>                                    
                  </div>
                </li>
              </ul> 
              <div class="button-box">
                  <el-button @click="superVisible = false">取 消</el-button>  
                  <el-button type="primary" @click="savesuper">保 存</el-button>  
                </div>                
            </div>       
        </div>        
      </transition>

      <!-- 设置责任区责任学校 -->
        <transition name="slide-left" mode="out-in">
          <div class="schoolsuper" v-if="schoolVisible">
              <div class="header">
                <p>{{area[activeName].name}}>责任学校</p>
                <i class="el-icon-close" @click="schoolVisible = false"></i>
              </div>
              <div class="super-content">
                <ul>
                  <li>
                    <span>已选择： </span>  
                    <div class="select">
                      <span v-for="(sel, index) in organize" :key="index">{{sel}} <i class="el-icon-close" @click="removed(index)"></i></span>
                    </div>
                  </li>
                  <li>
                    <span>所有学校：</span>
                    <div class="select">
                        <el-input v-model="searchName" placeholder="请输入学校名称">
                            <i slot="suffix" class="el-input__icon el-icon-search" @click="setschool(false)"></i>                  
                        </el-input>                       
                        <el-checkbox-group 
                          v-model="organize">
                          <el-checkbox v-for="(school, index) in schools" :label="school.name" :key="index">{{school.name}}</el-checkbox>
                        </el-checkbox-group>                                    
                    </div>
                  </li>
                </ul> 
                <div class="button-box">
                    <el-button @click="schoolVisible = false">取 消</el-button>  
                    <el-button type="primary" @click="saveschool">保 存</el-button>  
                  </div>                
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
                  <span>责任区:</span>
                  <el-select v-model="value3" placeholder="请选择">
                    <el-option
                      v-for="item in area"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select> 
                  <el-button @click="getTableList(flag)">搜索</el-button>                               
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
                      <span @click="lookDetail(scope.row.id)" class="title-click">{{scope.row.title}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="schoolname"
                    label="督导学校"
                    align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.schoolName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"                  
                    label="督导时间段">
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
                    <span>{{scope.row.rectificationCode}}</span>
                  </template>
                </el-table-column>            
                <el-table-column
                  show-overflow-tooltip
                  align="center"
                    label="标题">
                  <template slot-scope="scope">
                    <span @click="lookDetail(scope.row.id)" class="title-click">{{scope.row.title}}</span>
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
                  label="督导学校">
                  <template slot-scope="scope">
                    <span>{{scope.row.schoolName}}</span>
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
                        <span @click="lookDetail(scope.row.id)" class="title-click">{{scope.row.title}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="schoolname"
                      label="督导学校"
                      align="center">
                      <template slot-scope="scope">
                        <span>{{scope.row.schoolName}}</span>
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
          </div>   
        </transition>
      <!--督导记录，督导过程，整改通知，学校情况 详情信息-->
        <transition name="slide-left" mode="out-in">
          <div class="Info" v-if="detailView">
            <div class="header">
              <p v-if="flag === 1">督导记录详情</p>
              <p v-if="flag === 2">督导过程详情</p>
              <p v-if="flag === 3">整改与反馈详情</p>
              <p v-if="flag === 4">学校情况详情</p>
              <i class="el-icon-close" @click="detailView = false"></i>
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
      <!-- 删除确认框 -->
      <el-dialog title="提示" :visible.sync="deleteDialog" class="deleteDia">
        <img src="../../assets/images/warn.png"/>
        <ul>
          <li><span>确定删除该责任区么？</span></li>
          <li><span>该操作也会把责任区下所有关联内容删除，不可恢复。</span></li>
        </ul>
        <div slot="footer" class="dialog-footer">
            <el-button @click="deleteDialog = false">取 消</el-button>
            <el-button type="primary" @click="deleteSubmit">确 定</el-button>
          </div>       
      </el-dialog>

      <!-- 保存提示 -->
        <el-dialog title="提示" :visible.sync="saveDialog" class="saveDia">
          <img src="../../assets/images/warn.png"/>
          <ul>
            <li><span>保存后，责任区名称不可修改，确定要保存么？</span></li>
          </ul>
          <div slot="footer" class="dialog-footer">
              <el-button @click="saveDialog = false">取 消</el-button>
              <el-button type="primary" @click="saveSubmit">确 定</el-button>
            </div>       
        </el-dialog>      
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import server from '../../utils/axios'
import { notice, success } from '../../api/index.js'
import icon from '../../assets/images/Location A Green Copy 3.png'
import iconRed from '../../assets/images/Location A Green Copy 6.png'
import { amapManager } from 'vue-amap'
export default {
  name: 'response',
  data () {
    return {
      icon,
      iconRed,
      perInfo: {},
      markers: [],
      schoolName: '',
      areaName: '',
      Areaname: '',
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
      detailLoading: false,
      loading: false,
      pageSize: 20,
      currentPage: 1,
      totalCount: 0,
      restaurants: [],
      coordinatesX: '',
      coordinatesY: '',
      buttonShow: false,
      coordinatesTop: 0,
      coordinatesLeft: 0,
      buttonTop: 0,
      buttonLeft: 0,
      organize: [],
      state1: '',
      tableData: [],
      areaInfo: {},
      school: [
        {value: '1', label: '2017-2018年'},
        {value: '2', label: '2016-2017年'},
        {value: '3', label: '2015-2016年'}
      ],
      value2: '1',
      supervisors: [
        {value: '1', label: '我的'},
        {value: '2', label: '所有人员'},
        {value: '3', label: '各督学姓名'}
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
      value3: '1',
      recordVisible: false,
      schoolVisible: false,
      flag: '',
      organizes: [],
      schools: [],
      members: [],
      persons: [],
      person: [],
      activeName: 0,
      selections: [],
      superVisible: false,
      radios: [],
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
      schoolYear: '',
      longitude: '',
      schoolStr: '',
      semester: '',
      clickflag: true,
      headerVisible: false,
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
        'movestart': () => {
          this.buttonShow = false
        },
        'zoomchange': () => {
        },
        'click': (e) => {
          // alert('map clicked')
        }
      },
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
      }],
      detailView: false,
      DdjlDetails: '',
      DdgcDetails: '',
      ZgyfkDetails: '',
      XxqkDetails: ''

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
    uploadArea (id) {
      server.post(`/ddzrqController/updateSchoolByArea`, {
        schoolId: this.areaInfo.schoolList ? this.areaInfo.schoolList.filter(item => item.schoolName === this.schoolName)[0].schoolId : '',
        areaId: id
      })
      .then(res => {
        if (res.data.code === 1) {
          success(res.data.message)
          this.search()
          this.selectAreaList()
        } else {
          notice(res.data.message)
        }
      })
    },
    search () {
      this.longitude = ''
      if (this.markers.length !== 0) {
        if (this.markers.filter(n => n.icon === this.iconRed)[0]) {
          this.markers.filter(n => n.icon === this.iconRed)[0].icon = this.icon
        }
      }
      server.get(`/ddzrqController/searchSchool?SchoolName=${this.state1}`)
      .then(res => {
        if (res.data.code === 1) {
          if (res.data.result) {
            this.area.map((item, index) => {
              if (item.id === res.data.result[0].areaId) {
                this.activeName = index
              }
            })
            this.getAreaDetails()
          }
          this.longitude = res.data.result[0].longitude
          if (res.data.result[0].longitude) {
            this.schoolName = res.data.result[0].name
            this.areaName = res.data.result[0].areaName
            this.center = [res.data.result[0].longitude, res.data.result[0].latitude]
          } else {
            notice('您搜索的地点还没有设置经纬度，无法显示')
          }
        } else {
          notice(res.data.message)
        }
      })
    },
     // 详情
    lookDetail (id) {
      // sessionStorage.id = id
      // sessionStorage.flag = this.flag
      // sessionStorage.type = 2
      // this.$router.push('/supervisor/fileDetail')
      console.log(this.flag)
      if (this.flag === 1) {
        server.get(`/ddzrqController/getDdjlDetails?id=${id}`).then(res => {
          if (res.data.code === 1) {
            this.DdjlDetails = res.data.result
            console.log(res.data.result)
          }
        })
      } else if (this.flag === 2) {
        server.get(`/ddzrqController/getDdgcDetails?id=${id}`).then(res => {
          if (res.data.code === 1) {
            this.DdgcDetails = res.data.result
            console.log(res.data.result)
          }
        })
      } else if (this.flag === 3) {
        server.get(`/ddzrqController/getZgyfkDetails?id=${id}`).then(res => {
          if (res.data.code === 1) {
            this.ZgyfkDetails = res.data.result
            console.log(res.data.result)
          }
        })
      } else if (this.flag === 4) {
        server.get(`/ddzrqController/getXxqkDetails?id=${id}`).then(res => {
          if (res.data.code === 1) {
            this.XxqkDetails = res.data.result
            console.log(res.data.result)
          }
        })
      }
      this.recordVisible = false
      this.detailView = true
    },
    // 下载详情
    downloadFile (val) {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/ddzrqController/downloadFileById?fileId=${val.id}`
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
    async record (flag) {
      this.detailView = false
      await this.getSchoolYearAndSemeter()
      this.value3 = this.area[this.activeName].id
      this.getTableList(flag)
      this.flag = flag
      this.recordVisible = true
      this.newVisible = false
      this.headerVisible = false
      this.superVisible = false
      this.schoolVisible = false
      this.personInfo = false
    },
    getTableList (flag) {
      this.loading = true
      if (flag === 1) {
        // 督导记录
        server.get(`/ddzrqController/selectAreaRecord?areaId=${this.value3}&schoolYear=${this.value2}`)
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
        server.get(`/ddzrqController/selectAreaProcess?areaId=${this.value3}&schoolYear=${this.value2}`)
        .then(res => {
          if (res.data.code === 1) {
            res.data.result ? this.tableData = res.data.result : this.tableData = []
          } else {
            notice(res.data.message)
          }
          this.loading = false
        })
      } else if (flag === 3) {
        // 整改通知与反馈
        server.get(`/ddzrqController/selectAreaRectification?areaId=${this.value3}&schoolYear=${this.value2}`)
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
        server.get(`/ddzrqController/selectAreaSchoolSituation?areaId=${this.value3}&schoolYear=${this.value2}&pageNo=${this.currentPage}&pageSize=${this.pageSize}`)
        .then(res => {
          if (res.data.code === 1) {
            res.data.result ? this.tableData = res.data.result.list : this.tableData = []
            this.totalCount = res.data.result.totalCount
          } else {
            notice(res.data.message)
          }
          this.loading = false
        })
      }
    },
    async getSchoolYearAndSemeter () {
      await server.get(`/ddzrqController/getSchoolYearAndSemeter`)
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
    lookInfo (id) {
      server.get(`/ddzrqController/selectUserById?id=${id}`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result ? this.perInfo = res.data.result[0] : this.perInfo = {}
        } else {
          notice(res.data.message)
        }
      })
      this.personInfo = true
      this.recordVisible = false
      this.newVisible = false
      this.headerVisible = false
      this.superVisible = false
      this.schoolVisible = false
    },
    setschool (bool) {
      if (!this.areaInfo.areaheader) {
        notice('请先设置责任区的组长，之后才可设置责任学校')
        return
      }
      if (bool) {
        if (this.areaInfo.schoolList) {
          this.organize = this.areaInfo.schoolList.map(item => item.schoolName)
        } else {
          this.organize = []
        }
      }
      server.get(`/ddzrqController/selectAllSchool?keyword=${this.searchName}`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result ? this.schools = res.data.result : this.schools = []
        } else {
          notice(res.data.message)
        }
      })
      this.headerVisible = false
      this.newVisible = false
      this.superVisible = false
      this.schoolVisible = true
      this.personInfo = false
      this.recordVisible = false
    },
    savesuper () {
      this.persons = []
      if (this.person.length !== 0) {
        this.person.map(item => {
          if (this.members.filter(n => n.userName === item).length !== 0) {
            this.persons.push(this.members.filter(n => n.userName === item)[0])
          }
        })
        let str = this.persons.map(item => item.userId).join(',')
        server.post(`/ddzrqController/appointSuperintendent`, {
          areaId: this.area[this.activeName].id,
          userIds: str
        })
        .then(res => {
          if (res.data.code === 1) {
            success(res.data.message)
            this.superVisible = false
            this.getAreaDetails()
          } else {
            notice(res.data.message)
          }
        })
      } else {
        notice('您还没有选择该责任区的责任督学！')
      }
    },
    remove (index) {
      this.person.splice(index, 1)
    },
    removed (index) {
      this.schoolStr = ''
      let arr = []
      this.organize.splice(index, 1)
      this.organize.map(item => {
        if (this.areaInfo.schoolList.filter(m => m.schoolName === item)) {
          arr.push(this.areaInfo.schoolList.filter(m => m.schoolName === item)[0].schoolId)
        }
      })
      this.schoolStr = arr.join(',')
    },
    setsuper (bool) {
      this.superVisible = true
      this.schoolVisible = false
      this.personInfo = false
      this.recordVisible = false
      this.newVisible = false
      this.headerVisible = false
      if (bool) {
        this.areaInfo.areasupers ? this.persons = this.areaInfo.areasupers : this.persons = []
        this.person = this.persons.map(item => item.userName)
      }
      server.get(`/ddzrqController/selectAllUser?keyword=${this.searchName}&areaId=${this.area[this.activeName].id}`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result ? this.members = res.data.result : this.members = []
        } else {
          notice(res.data.message)
        }
      })
    },
    saveheader () {
      server.post(`/ddzrqController/updateAreaLeader`, {
        areaId: this.area[this.activeName].id,
        userId: this.radioValue
      })
      .then(res => {
        if (res.data.code === 1) {
          success(res.data.message)
          this.headerVisible = false
          this.selectAreaList()
        } else {
          notice(res.data.message)
        }
      })
    },
    add () {
      this.newVisible = true
      this.areas = []
      this.clickflag = true
      this.Areaname = ''
    },
    judgetitle (name, index) {
      if (name === '') {
        this.areas.splice(index, 1)
        this.clickflag = false
      } else {
        this.areas[index].showinput = false
      }
    },
    judge (Areaname) {
      if (Areaname === '') {
        this.clickflag = false
      } else {
        this.areas.push({
          name: Areaname,
          showinput: false
        })
        this.Areaname = ''
        this.clickflag = false
      }
    },
    newArea () {
      this.newVisible = true
      this.superVisible = false
      this.schoolVisible = false
      this.personInfo = false
      this.recordVisible = false
      this.headerVisible = false
    },
    set () {},
    handleOpen () {},
    handleClose () {},
    deleteArea () {},
    addArea () {},
    deleteRes () {
      this.deleteDialog = true
    },
    deleteSubmit () {
      this.deleteDialog = false
      server.post(`/ddzrqController/deleteArea`, {
        areaId: this.area[this.activeName].id})
      .then(res => {
        if (res.data.code === 1) {
          success(res.data.message)
          this.selectAreaList()
        } else {
          notice(res.data.message)
        }
      })
    },
    save () {
      setTimeout(() => {
        if (this.areas.length !== 0 && this.areas.every(item => item.name !== '')) {
          for (var i = 0; i < this.areas.length - 1; i++) {
            if (this.areas[i].name === this.areas[i + 1].name) {
              notice('新建责任区名称存在重复')
              return
            }
          }
          let a = 0
          this.areas.map(item => {
            if (this.area.some(m => m.name === item.name)) {
              a = 1
            }
          })
          if (a === 1) {
            let arr = []
            this.areas.map(m => {
              this.area.map(item => {
                if (item.name === m.name) {
                  arr.push(item.name)
                }
              })
            })
            arr = arr.map(item => item).join(',')
            notice(`新建责任区名称${arr}已经存在`)
            return
          }
          this.saveDialog = true
        } else {
          if (this.areas.length !== 0) {
          } else {
            notice('您还没有新建责任区名称')
          }
          this.saveDialog = false
        }
      }, 50)
    },
    saveSubmit () {
      server.post(`/ddzrqController/addArea`, {
        names: this.areas.map(item => item.name).join(',')
      })
      .then(res => {
        if (res.data.code === 1) {
          success(res.data.message)
          this.saveDialog = false
          this.newVisible = false
          this.selectAreaList()
        } else {
          notice(res.data.message)
        }
      })
    },
    setheader (bool) {
      // 查询接口
      if (bool) {
        this.radioValue = this.areaInfo.areaheader
      }
      server.get(`/ddzrqController/setAreaLeader?keyword=${this.searchName}&areaId=${this.area[this.activeName].id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.radios = res.data.result
          if (bool) {
            if (this.areaInfo && this.radios.length !== 0) {
              if (this.radios.filter(item => item.userId === this.areaInfo.areaheadId).length !== 0) {
                this.radioValue = this.radios.filter(item => item.userId === this.areaInfo.areaheadId)[0].userId
              }
            }
          }
        } else {
          notice(res.data.message)
        }
      })
      this.headerVisible = true
      this.newVisible = false
      this.superVisible = false
      this.schoolVisible = false
      this.personInfo = false
      this.recordVisible = false
    },
    saveschool () {
      this.organizes = []
      if (this.organize.length !== 0) {
        this.organize.map(item => {
          if (this.schools.filter(n => n.name === item).length !== 0) {
            this.organizes.push(this.schools.filter(n => n.name === item)[0])
          }
        })
        let str = this.schoolStr + ',' + this.organizes.map(item => item.id).join(',')
        server.post(`/ddzrqController/setAreaSchool`, {
          areaId: this.area[this.activeName].id,
          schoolIds: str
        })
        .then(res => {
          if (res.data.code === 1) {
            success(res.data.message)
            this.schoolVisible = false
            this.schoolStr = ''
            this.getAreaDetails()
          } else {
            notice(res.data.message)
          }
        })
      } else {
        notice('该责任区没有设置责任学校!')
      }
    },
    selectAreaList () {
      server.get(`/ddzrqController/selectAreaList`)
      .then(res => {
        if (res.data.code === 1) {
          res.data.result ? this.area = res.data.result : this.area = []
          if (this.area.length !== 0 && this.activeName) {
            this.value3 = this.area[this.activeName].id
          }
          this.getAreaDetails()
        } else {
          notice(res.data.message)
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData(4)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getData(4)
    },
    getSum (arr) {
      var sum = 0
      for (var i = 0; i < arr.length; i++) {
        sum += parseInt(arr[i])
      }
      if (arr.length === 0) {
        sum = 0
      }
      return sum
    },
    getAreaDetails () {
      this.superVisible = false
      this.schoolVisible = false
      this.personInfo = false
      this.recordVisible = false
      this.newVisible = false
      this.headerVisible = false
      this.detailLoading = true
      this.buttonShow = false
      this.markers = []
      setTimeout(() => {
        server.get(`/ddzrqController/getAreaDetails?areaId=${this.area[this.activeName].id}`)
        .then(res => {
          if (res.data.code === 1) {
            if (res.data.result.length === 0) {
              this.areaInfo = {}
              this.markers = []
            } else {
              this.areaInfo = {
                areaheader: res.data.result.filter(item => item.leaderFlag === 1).length !== 0 ? res.data.result.filter(item => item.leaderFlag === 1)[0].userName : '',
                areaheadId: res.data.result.filter(item => item.leaderFlag === 1).length !== 0 ? res.data.result.filter(item => item.leaderFlag === 1)[0].userId : '',
                areasupers: res.data.result.filter(item => item.leaderFlag === 0).length !== 0 ? res.data.result.filter(item => item.leaderFlag === 0) : '',
                schoolList: res.data.result[0].ddzrqSchoolList.length !== 0 ? res.data.result[0].ddzrqSchoolList : [],
                processNum: res.data.result[0].ddzrqSchoolList.map(item => item.processNum).length !== 0 ? this.getSum(res.data.result[0].ddzrqSchoolList.map(item => item.processNum)) : 0,
                recordNum: res.data.result[0].ddzrqSchoolList.map(item => item.recordNum).length !== 0 ? this.getSum(res.data.result[0].ddzrqSchoolList.map(item => item.recordNum)) : 0,
                rectificationNum: res.data.result[0].ddzrqSchoolList.map(item => item.rectificationNum).length !== 0 ? this.getSum(res.data.result[0].ddzrqSchoolList.map(item => item.rectificationNum)) : 0,
                situationNum: this.getSum(res.data.result[0].ddzrqSchoolList.map(item => item.situationNum))
              }
              if (this.areaInfo.schoolList.length !== 0) {
                this.schoolStr = this.areaInfo.schoolList.map(item => item.schoolId).join(',')
                this.areaInfo.schoolList.forEach((item, index) => {
                  if (item.longitude) {
                    this.markers.push({
                      icon: this.icon,
                      position: [item.longitude ? item.longitude : 0, item.latitude ? item.latitude : 0],
                      events: {
                        click: (e) => {
                          if (this.markers.filter(n => n.icon === this.iconRed).length !== 0) {
                            this.markers.filter(n => n.icon === this.iconRed)[0].icon = this.icon
                          }
                          this.markers.filter(n => n.position[0] === item.longitude)[0].icon = this.iconRed
                          this.schoolName = item.schoolName
                          this.areaName = this.area[this.activeName].name
                          this.buttonShow = true
                          this.buttonTop = e.pixel.y + 'px'
                          this.buttonLeft = e.pixel.x + 'px'
                          this.coordinatesTop = e.pixel.y + 'px'
                          this.coordinatesLeft = e.pixel.x + 'px'
                          this.coordinatesX = String(e.lnglat.M).slice(0, 10)
                          this.coordinatesY = String(e.lnglat.O).slice(0, 10)
                          this.markers[0].visible = true
                        }
                      }
                    })
                  }
                })
                if (this.markers[0]) {
                  this.center = [this.markers[0].position[0], this.markers[0].position[1]]
                }
                if (this.longitude) {
                  if (this.markers.filter(n => n.position[0] === String(this.longitude)).length !== 0) {
                    this.markers.filter(n => n.position[0] === String(this.longitude))[0].icon = this.iconRed
                    this.state1 = ''
                  }
                  this.longitude = ''
                }
              } else {
                this.schoolStr = ''
              }
            }
          } else {
            notice(res.data.message)
          }
          this.detailLoading = false
        })
      }, 300)
    }
  },
  mounted () {
    // 查询责任区列表
    setTimeout(async () => {
      await this.selectAreaList()
      this.restaurants = []
      await server.get(`/ddzrqController/searchSchool?SchoolName=${this.state1}`)
        .then(res => {
          if (res.data.code === 1) {
            if (res.data.result.length !== 0) {
              let obj = {}
              res.data.result.map(item => {
                obj = {
                  value: item.name,
                  areaName: item.areaName
                }
                this.restaurants.push(obj)
                return this.restaurants
              })
            } else {
              let obj = {}
              obj = {
                value: '没有找到相关机构/区域'
              }
              this.restaurants.push(obj)
            }
          } else {
            notice(res.data.message)
          }
        })
    }, 500)
  },
  computed: {
    ...mapGetters([
      'staticUrl',
      'previewUrl',
      'rootUrl',
      'previewInterface'
    ])
  }
}
</script>
<style lang="scss">
.response {
  position: relative;

  .el-input__icon, .el-icon-close {
    cursor: pointer;
  }

  .add {
    font-weight: bold;
    }

  .active {
    color: #48B2EC
  }

  .coordinates {
    position: absolute;

    &>p {
      background: #fff;
      font-weight: bold;
      padding: 10px 0px 0px 10px;
      margin-top: 6px;
      margin-left: 6px;
    }

    &>ul {
      background: #fff;
      width: 150px;
      padding: 10px;
      margin-left: 6px;
      &>li {
        line-height: 40px;
        border-bottom: 1px solid #ccc;
        cursor: pointer;

        &>span {
          font-weight: bold;
          &:hover {
            color: #48B2EC;
          }
        }
        .active {
          color: #48B2EC;
        }
      }
    }
  }
  .title-click {
    cursor: pointer;
    &:hover {
      color: #48B2EC;      
    }
  }

  .padding-box {
    padding: 20px;
  }

  .headman, .super {
    color: #48B2EC;
    cursor: pointer;
  }
  .super {
    margin-right: 10px;
  }
  .button-box {
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
    max-height: calc(100vh - 200px);
    overflow-y: auto;
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
      overflow-y: auto;
      border: 1px solid #DDDDDD;

      &>.el-radio-group {
        clear: both;
        width: 100%;
      }

      &>.el-input {
        margin-bottom: 20px;
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
        overflow-y: auto;


        &>.el-checkbox-group {
          clear: both;
          padding-left: 10px;
        }
        .el-checkbox {
          margin-left: 10px;
          margin-bottom: 10px;
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
          max-width: 130px;
          padding: 0px 10px;
          height: 24px;
          display: block;
          margin-bottom: 10px;
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

      .info-head {
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
        .img-show {
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
                font-weight: bold;
              }
            }
          }
        }
      }
      &>table {
        width: 518px;
        tr {
          th {
            &:first-child {
              width: 130px;
              text-align: right;
              line-height: 40px;
            }
            border: 1px solid #eee;
            &:nth-child(2) {
              padding-left: 10px;
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

    .el-pagination {
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
  .resheader, .ressuper, .schoolsuper, .super-button {
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
    ul {
        &>li {
          &:after {
            display: block;
            content: '';
            clear: both;
            overflow: hidden;
            visibility: hidden;            
          }
          .el-input {
            width: 70%;
            float: left;
          }
          &>a {
            float: left;
            line-height: 40px;
            margin-left: 10px;
            &:hover {
              cursor: pointer;
              color: #20A0FF;
            }
          }
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
        p {
          margin-bottom: 10px;
          font-size: 16px;
          cursor: pointer;
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
    top: 17px;
    left: 20px;
    bottom: 20px;
    overflow-y: auto;
    width: 360px;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0px 0px 4px 0 rgba(0,0,0,0.28);
    padding: 20px;
    box-sizing: border-box;

    .el-collapse{
      margin-top: 20px;
      border: 0;
      .el-collapse-item{
        position: relative;
        margin-top: 5px;
        border: 1px solid #E6EBF5;
        .el-collapse-item__header{
          border: 0;
          padding: 5px 10px;
          min-height: 44px;
          position: relative;
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

          &:after {
            display: block;
            content: '';
            height: 0;
            clear: both;
            overflow: hidden;
            visibility: hidden;            
          }

          &:first-child {
            height: 30px;
             line-height: 30px;
             diaplay: block;
          }

          &>a {
            margin-top: -2px;
            float: right;
            font-family: PingFang-SC-Regular;
            font-size: 14px;
            color: #48B2EC;
            cursor: pointer;
          }

          &:last-child, &:nth-child(2) {
            &>span {
              float: left;
            }
            .schools {
              float: left;
              width: 170px;
            }
            &>a {
              float: right;
            }
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
        padding-bottom: 20px;
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
  .cursor-pointer {
    cursor: pointer;
  }

  .blue-color {
    color: #3FADFF;
  }
}
</style>

