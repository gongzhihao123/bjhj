<template>
    <div class="common">
        <el-amap ref="map" vid="amapDemo" :amap-manager="amapManager" :center="center" :zoom="zoom" :events="events" class="amap-demo">
          <el-amap-marker v-for="(marker, index) in markers" :key="index" :icon="marker.icon" :position="marker.position" :events="marker.events" :vid="index"></el-amap-marker>
        </el-amap>

        <div class="common-left">
          <el-row>
             <el-col :span="12">
              挂牌督导
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="mySchool" @change="changeMySchool">只看我的责任学校</el-checkbox>
            </el-col>
          </el-row>

          <!-- 学校列表 -->
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item @click.native="clickSchool(item, index)" v-for="(item, index) in schoolList" :key="index" :name="item.name">
               <template slot="title">
                 <div class="blue-icon">
                   <span>{{ index + 1 }}</span>
                 </div>
                   {{ item.name }}
              </template>
              <div>
                <span @click.stop="supervisionProcess">督导过程 ({{ schoolRecord.ddgcCount }})</span>
                <span @click.stop="supervisionRecord">督导记录 ({{ schoolRecord.ddjlCount }})</span>
                <span @click.stop="feedback">整改与反馈 ({{ schoolRecord.zgyfkCount }})</span>
                <span @click.stop="schoolSituation">学校情况 ({{ schoolRecord.xxqkCount }})</span>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <transition name="slide-left" mode="out-in">
          
          <!-- 督导过程 -->
          <div class="right-box" v-if="processBoxShow">
            <div v-if="listShow && !ddgcDetailShow" class="process">
              <p>
                <i @click="close" class="el-icon-close"></i>
                <span>督导过程</span>
              </p>

              <el-row>
                <el-col v-if="mySchoolId" :span="12">
                  <el-button type="primary" @click="processAdd">新增</el-button>
                  <el-button @click="deleteDdgx('ddgc')">删除</el-button>
                </el-col>
                <el-col :span="12">
                  <el-select v-model="schoolYear" placeholder="请选择" @change="ddgcSchoolChange">
                    <el-option
                      v-for="item in schoolYearOptions"
                      :key="item.schoolYear"
                      :label="item.schoolYearName"
                      :value="item.schoolYear">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>

              <template>
                <el-table
                  :data="processList"
                  border
                  @selection-change="ddgcChange"
                  style="width: 100%">
                  <el-table-column
                    type="selection"
                    label-class-name="head"
                    width="35">
                  </el-table-column>
                  <el-table-column
                    label="标题"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head"
                    width="180">
                    <template slot-scope="scope">
                      <span class="cursor-pointer" @click="lookDdgc(scope.row)">
                        {{ scope.row.title }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="ddDate"
                    label="督导时段"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    prop="userName"
                    label="责任督学"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head">
                  </el-table-column>
                  <el-table-column
                    prop="createdDate"
                    label="上传日期"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    v-if="mySchoolId"
                    label="操作"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head"
                    width="180">
                    <template slot-scope="scope">
                      <span class="cursor-pointer blue-color" @click="getDdgxDetails(scope.row)">编辑</span>
                      <span class="cursor-pointer red-color" @click="deleteDdgx(scope.row)">删除</span>
                    </template>
                  </el-table-column>
                </el-table>
              </template>

              <el-pagination
                v-if="ddgcTotalCount !== 0"
                @size-change="ddgcHandleSizeChange"
                @current-change="ddgcHandleCurrentChange"
                :current-page="ddgcPageNo"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="ddgcPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="ddgcTotalCount">
              </el-pagination> 
            </div>

            <div v-if="!listShow && !ddgcDetailShow" class="process-after">
              <p>
                <i @click="close" class="el-icon-close"></i>
                <span>新增督导过程</span>
              </p>

              <el-form :model="processContentData" ref="processContentData" label-width="100px" class="demo-ruleForm">
                <el-row>
                  <el-col :span="12">
                    <span> 学期：</span>
                    <el-form-item
                      prop="section"
                      :rules="[
                        { required: true, message: '学期不能为空'},
                      ]"
                    >
                      <el-select v-model="processContentData.section" placeholder="请选择学期">
                        <el-option
                          v-for="item in schoolSemesterOptions"
                          :key="item.schoolYearName"
                          :label="item.schoolYearName"
                          :value="item.schoolYearName">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <span> 责任督学：</span>
                    <el-form-item
                      prop="name"
                      :rules="[
                        { required: false, message: '姓名不能为空'},
                      ]"
                    >
                      <span>{{ user ? user.name : '' }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <span> 督导学校：</span>
                    <el-form-item
                      prop="school"
                      :rules="[
                        { required: true, message: '督导学校不能为空'},
                      ]"
                    >
                      <el-select v-model="processContentData.school" placeholder="请选择督导学校">
                        <el-option
                          v-for="item in ddgcSchoolList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-row>
                      <el-col :span="17">
                        <span> 督导时段：</span>
                        <el-form-item
                          prop="date"
                          style="width: 150px;"
                          :rules="[
                            { required: true, message: '日期不能为空'},
                          ]"
                        >
                          <el-date-picker
                            style="width: 150px;"
                            v-model="processContentData.date"
                            type="date"
                            :picker-options="pickerOptions"
                            placeholder="请选择日期">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="7">
                        <el-form-item
                          prop="time"
                          :rules="[
                            { required: true, message: '时段不能为空'},
                          ]"
                        >
                          <el-select style="width: 100px;" v-model="processContentData.time" placeholder="时段">
                            <el-option
                              v-for="item in timeList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <span> 标题：</span>
                    <el-form-item
                      prop="title"
                      :rules="[
                        { required: true, message: '标题不能为空'},
                      ]"
                    >
                      <el-input v-model.trim="processContentData.title" :maxlength="50"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="content">
                  <el-col :span="24">
                    <span> 督导计划及主要内容：</span>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      prop="planAndContent"
                      :rules="[
                        { required: true, message: '督导计划及主要内容不能为空'},
                      ]"
                    >
                      <el-input type="textarea" :rows="4" :maxlength="1000" v-model.trim="processContentData.planAndContent"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="content">
                  <el-col :span="24">
                    <span> 督导过程记录：</span>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      prop="record"
                      :rules="[
                        { required: true, message: '督导过程记录不能为空'},
                      ]"
                    >
                      <el-input type="textarea" :rows="4" :maxlength="10000" v-model.trim="processContentData.record"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="content">
                  <el-col :span="24">
                  </el-col>
                  <el-col :span="24">
                    <el-upload
                      class="upload-demo"
                      :action="ddgcAction"
                      :auto-upload="false"
                      :before-upload="ddgcBeforeUpload"
                      :file-list="ddgcHasUploadList"
                      :on-change="ddgcHasUploadChange"
                      :on-remove="ddgcRemove"
                      name="uploadFile"
                      ref="ddgcUpload"
                      :on-success="ddgcSuccess"
                      multiple>
                      <i class="el-icon-plus">插入附件</i>
                      <span>（请上传.jpg .png .doc .docx .pdf 格式且大小不超过20M的文件）</span>
                    </el-upload>
                  </el-col>
                </el-row>

                <el-row class="content">
                  <el-col :span="24"></el-col>
                  <el-col :span="24">
                    <el-button type="primary" size="small" :disabled="ddgcCanConfirm" @click="submitForm('processContentData')">确定</el-button>
                    <el-button size="small" @click="listShow = true">取消</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            
            <!-- 督导到过程查看 -->
            <div class="process-after" v-if="!listShow && ddgcDetailShow">
              <p>
                <i @click="close" class="el-icon-close"></i>
                <span>督导过程详情</span>
              </p>
              <div class="confirm">
                <el-row>
                  <el-col :span="5">学期</el-col>
                  <el-col :span="19">{{ ddgcDetail.schoolYear - 1 + '-' + (ddgcDetail.schoolYear) + '年 第' + ddgcDetail.semester + '学期'}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">责任督学</el-col>
                  <el-col :span="19">{{ ddgcDetail.userName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导学校</el-col>
                  <el-col :span="19">{{ ddgcDetail.schoolName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导时段</el-col>
                  <el-col :span="19">{{ ddgcDetail.ddDate | dateFormat('yyyy-MM-dd') }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">标题</el-col>
                  <el-col :span="19">{{ ddgcDetail.title }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导计划及主要内容</el-col>
                  <el-col :span="19">{{ ddgcDetail.ddProcess }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导过程记录</el-col>
                  <el-col :span="19">{{ ddgcDetail.ddProject }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">附件</el-col>
                  <el-col :span="19">
                    <p v-for="(item, index) in ddgcDetail.fileList" :key="index">
                      {{ item.name }}
                      <span class="cursor-pointer blue-color" @click="route(item)">预览</span>
                      <span class="cursor-pointer blue-color" @click="downloadFile(item)">下载({{ (item.size / 1024 / 1024).toFixed(2) }})MB</span>
                    </p>
                  </el-col>
                </el-row>
              </div>
              <el-row class="content">
                <el-col :span="24">
                  <el-button type="primary" size="small" style="margin: 20px 0;" @click="ddgcBack">返回</el-button>
                </el-col>
              </el-row>
            </div>
          </div>

          <!-- 督导记录 -->
          <div class="right-box" v-if="recordBoxShow">
            <div v-if="listShow && !ddgcDetailShow" class="process">
              <p>
                <i @click="close" class="el-icon-close"></i>
                <span>督导记录</span>
              </p>

              <el-row>
                <el-col v-if="mySchoolId" :span="12">
                  <el-button type="primary" @click="recordAdd">新增</el-button>
                  <el-button @click="deleteDdjl('ddjl')">删除</el-button>
                </el-col>
                <el-col :span="12">
                  <el-select v-model="schoolYear" placeholder="请选择" @change="ddjlSchoolYearChange">
                    <el-option
                      v-for="item in schoolYearOptions"
                      :key="item.schoolYear"
                      :label="item.schoolYearName"
                      :value="item.schoolYear">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>

              <template>
                <el-table
                  :data="recordList"
                  border
                  @selection-change="ddjlChange"
                  style="width: 100%">
                  <el-table-column
                    type="selection"
                    label-class-name="head"
                    width="35">
                  </el-table-column>
                  <el-table-column
                    label="标题"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head"
                    width="180">
                    <template slot-scope="scope">
                      <span class="cursor-pointer" @click="lookDdjl(scope.row)">
                        {{ scope.row.title }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="ddDate"
                    label="督导时段"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    prop="userName"
                    label="责任督学"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head">
                  </el-table-column>
                  <el-table-column
                    prop="createdDate"
                    label="上传日期"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    v-if="mySchoolId"
                    label="操作"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head"
                    width="180">
                    <template slot-scope="scope">
                      <span class="cursor-pointer blue-color"  @click="getDdjlDetails(scope.row)">编辑</span>
                      <span class="cursor-pointer red-color" @click="deleteDdjl(scope.row)">删除</span>
                    </template>
                  </el-table-column>
                </el-table>
              </template>

              <el-pagination
                v-if="ddjlTotalCount !== 0"
                @size-change="ddjlHandleSizeChange"
                @current-change="ddjlHandleCurrentChange"
                :current-page="ddjlPageNo"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="ddjlPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="ddjlTotalCount">
              </el-pagination> 
            </div>

            <div v-if="!listShow && !ddgcDetailShow" class="process-after">
              <p>
                <i @click="close" class="el-icon-close"></i>
                <span>新增督导记录</span>
              </p>

              <el-form :model="recordContentData" ref="recordContentData" label-width="100px" class="demo-ruleForm">
                <el-row>
                  <el-col :span="12">
                    <span> 学期：</span>
                    <el-form-item
                      prop="section"
                      :rules="[
                        { required: true, message: '学期不能为空'},
                      ]"
                    >
                      <el-select v-model="recordContentData.section" placeholder="请选择学期" @change="ddjlSchoolChange">
                        <el-option
                          v-for="item in schoolSemesterOptions"
                          :key="item.schoolYearName"
                          :label="item.schoolYearName"
                          :value="item.schoolYearName">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <span> 责任督学：</span>
                    <el-form-item
                      prop="name"
                      :rules="[
                        { required: false, message: '姓名不能为空'},
                      ]"
                    >
                      <span>{{ user ? user.name : '' }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <span> 督导学校：</span>
                    <el-form-item
                      prop="school"
                      :rules="[
                        { required: true, message: '督导学校不能为空'},
                      ]"
                    >
                      <el-select v-model="recordContentData.school" placeholder="请选择督导学校" @change="ddjlSchoolChange">
                        <el-option
                          v-for="item in ddgcSchoolList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-row>
                      <el-col :span="17">
                        <span> 督导时段：</span>
                        <el-form-item
                          prop="date"
                          style="width: 150px;"
                          :rules="[
                            { required: true, message: '日期不能为空'},
                          ]"
                        >
                          <el-date-picker
                            style="width: 150px;"
                            v-model="recordContentData.date"
                            type="date"
                            placeholder="请选择日期">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="7">
                        <el-form-item
                          prop="time"
                          :rules="[
                            { required: true, message: '时段不能为空'},
                          ]"
                        >
                          <el-select style="width: 100px;" v-model="recordContentData.time" placeholder="时段">
                            <el-option
                              v-for="item in timeList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <span> 督导过程：</span>
                    <el-form-item
                      prop="supervisionProcess"
                      :rules="[
                        { required: true, message: '督导过程不能为空'},
                      ]"
                    >
                      <el-select :disabled="recordContentData.school === '' || this.recordContentData.section === ''" v-model="recordContentData.supervisionProcess" placeholder="请选择督导过程">
                        <el-option
                          v-for="item in allDdgcList"
                          :key="item.id"
                          :label="item.title"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <span> 同行人员：</span>
                    <el-form-item
                      prop="user"
                      :rules="[
                        { required: true, message: '同行人员不能为空'},
                      ]"
                    >
                      <el-select v-model="recordContentData.user" multiple collapse-tags placeholder="请选择同行人员">
                        <el-option
                          v-for="item in userList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <span> 督导方式：</span>
                    <el-form-item
                      prop="ddMethod"
                      :rules="[
                        { required: true, message: '督导方式不能为空'},
                      ]"
                    >
                      <el-select v-model="recordContentData.ddMethod" multiple collapse-tags placeholder="请选择督导方式">
                        <el-option
                          v-for="item in ddMethodList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <span> 标题：</span>
                    <el-form-item
                      prop="title"
                      :rules="[
                        { required: true, message: '标题不能为空'},
                      ]"
                    >
                      <el-input v-model.trim="recordContentData.title" :maxlength="50"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="content">
                  <el-col :span="24">
                    <span> 督导主要内容：</span>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      prop="content"
                      :rules="[
                        { required: true, message: '督导主要内容不能为空'},
                      ]"
                    >
                      <el-input type="textarea" :rows="4" v-model.trim="recordContentData.content" :maxlength="1000"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="content">
                  <el-col :span="24">
                  </el-col>
                  <el-col :span="24">
                    <el-upload
                      class="upload-demo"
                      :action="ddjlAction"
                      :auto-upload="false"
                      :on-change="ddjlHasUploadChange"
                      :before-upload="ddjlBeforeUpload"
                      :file-list="ddjlHasUploadList"
                      :on-remove="ddjlRemove"
                      name="uploadFile"
                      ref="ddjlUpload"
                      :on-success="ddjlSuccess"
                      multiple>
                      <i class="el-icon-plus">插入附件</i>
                      <span>（请上传.jpg .png .doc .docx .pdf 格式且大小不超过20M的文件）</span>
                    </el-upload>
                  </el-col>
                </el-row>

                <el-row class="content">
                  <el-col :span="24"></el-col>
                  <el-col :span="24">
                    <el-button type="primary" size="small" :disabled="ddjlCanConfirm" @click="submitForm('recordContentData')">确定</el-button>
                    <el-button size="small" @click="listShow = true">取消</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <!-- 督导记录查看 -->
            <div class="process-after" v-if="!listShow && ddgcDetailShow">
              <p>
                <i @click="close" class="el-icon-close"></i>
                <span>督导记录详情</span>
              </p>
              <div class="confirm">
                <el-row>
                  <el-col :span="5">学期</el-col>
                  <el-col :span="19">{{ ddgcDetail.schoolYear - 1 + '-' + (ddgcDetail.schoolYear) + '年 第' + ddgcDetail.semester + '学期'}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">责任督学</el-col>
                  <el-col :span="19">{{ ddgcDetail.userName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导学校</el-col>
                  <el-col :span="19">{{ ddgcDetail.schoolName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导时段</el-col>
                  <el-col :span="19">{{ ddgcDetail.ddDate | dateFormat('yyyy-MM-dd') }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导过程</el-col>
                  <el-col :span="19">{{ ddgcDetail.ddgxName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">同行人员</el-col>
                  <el-col :span="19">
                    <span v-for="(item, index) in ddgcDetail.userList" :key="index">
                      {{ item.peerUserName }}
                    </span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导方式</el-col>
                  <el-col :span="19">
                    <span v-for="(item, index) in ddgcDetail.ddMethod" :key="index">
                      {{ item.name }}
                    </span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">标题</el-col>
                  <el-col :span="19">{{ ddgcDetail.title }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导主要内容</el-col>
                  <el-col :span="19">{{ ddgcDetail.ddContent }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">附件</el-col>
                  <el-col :span="19">
                    <p v-for="(item, index) in ddgcDetail.fileList" :key="index">
                      {{ item.name }}
                      <span class="cursor-pointer blue-color"  @click="route(item)">预览</span>
                      <span class="cursor-pointer blue-color" @click="downloadFile(item)">下载({{ (item.size / 1024 / 1024).toFixed(2) }})MB</span>
                    </p>
                  </el-col>
                </el-row>
              </div>
              <el-row class="content">
                <el-col :span="24">
                  <el-button type="primary" size="small" style="margin: 20px 0;" @click="ddgcBack">返回</el-button>
                </el-col>
              </el-row>
            </div>
          </div>

          <!-- 整改与反馈 -->
          <div class="right-box" v-if="feedbackBoxShow">
            <div v-if="listShow && !confirmBox" class="process">
              <p>
                <i @click="close" class="el-icon-close"></i>
                <span>整改与反馈</span>
              </p>

              <el-row>
                <el-col :span="6" v-if="mySchoolId && mySchoolId">
                  <el-button type="primary" @click="feedbackAdd">新增</el-button>
                  <el-button @click="deleteZgyfk('zgyfk')">删除</el-button>
                </el-col>
                <el-col :span="18">
                  <el-select v-model="schoolYear" placeholder="请选择" @change="getZgyfkPage">
                    <el-option
                      v-for="item in schoolYearOptions"
                      :key="item.schoolYear"
                      :label="item.schoolYearName"
                      :value="item.schoolYear">
                    </el-option>
                  </el-select>
                  <el-select v-model="zgyfkState" placeholder="请选择" @change="getZgyfkPage">
                    <el-option
                      v-for="item in zgyfkStateList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>

              <template>
                <el-table
                  :data="feedbackList"
                  border
                  @selection-change="zgyfkChange"
                  style="width: 100%">
                  <el-table-column
                    type="selection"
                    label-class-name="head"
                    width="35">
                  </el-table-column>
                  <el-table-column
                    prop="code"
                    label="整改编号"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head"
                    width="150">
                  </el-table-column>
                  <el-table-column
                    label="标题"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head">
                    <template slot-scope="scope">
                      <span class="cursor-pointer" @click="lookZgyfk(scope.row)">
                        {{ scope.row.title }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="limitDate"
                    label="整改期限"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    prop="createdDate"
                    label="反馈日期"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    prop="state"
                    label="状态"
                    align='center'
                    show-overflow-tooltip
                    width="100"
                    label-class-name="head">
                  </el-table-column>
                  <el-table-column
                    v-if="mySchoolId"
                    label="操作"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head"
                    width="100">
                    <template slot-scope="scope">
                      <span class="cursor-pointer red-color" @click="deleteZgyfk(scope.row)">删除</span>
                      <span class="cursor-pointer blue-color" v-if="mySchoolId && scope.row.state === '已整改'" @click="getZgyfkDetails(scope.row)">确认</span>
                    </template>
                  </el-table-column>
                </el-table>
              </template>

              <el-pagination
                v-if="zgyfkTotalCount !== 0"
                @size-change="zgyfkHandleSizeChange"
                @current-change="zgyfkHandleCurrentChange"
                :current-page="zgyfkPageNo"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="zgyfkPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="zgyfkTotalCount">
              </el-pagination> 
            </div>

            <div v-if="!listShow && !confirmBox && !ddgcDetailShow" class="process-after">
              <p>
                <i @click="close" class="el-icon-close"></i>
                <span>新增整改与反馈</span>
              </p>

              <el-form :model="feedbackContentData" ref="feedbackContentData" label-width="100px" class="demo-ruleForm">
                <el-row>
                  <el-col :span="12">
                    <span> 学期：</span>
                    <el-form-item
                      prop="section"
                      :rules="[
                        { required: true, message: '学期不能为空'},
                      ]"
                    >
                      <el-select v-model="feedbackContentData.section" placeholder="请选择学期" @change="zgyfkSemesterChange">
                        <el-option
                          v-for="item in schoolSemesterOptions"
                          :key="item.schoolYearName"
                          :label="item.schoolYearName"
                          :value="item.schoolYearName">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <span> 责任督学：</span>
                    <el-form-item
                      prop="name"
                      :rules="[
                        { required: false, message: '姓名不能为空'},
                      ]"
                    >
                      <span>{{ user ? user.name : ''}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <span> 督导学校：</span>
                    <el-form-item
                      prop="school"
                      :rules="[
                        { required: true, message: '督导学校不能为空'},
                      ]"
                    >
                      <el-select v-model="feedbackContentData.school" placeholder="请选择督导学校" @change="zgyfkSchoolChange">
                        <el-option
                          v-for="item in ddgcSchoolList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <span> 督导记录：</span>
                    <el-form-item
                      prop="record"
                      :rules="[
                        { required: true, message: '督导记录不能为空'},
                      ]"
                    >
                      <el-select :disabled="feedbackContentData.school === '' || feedbackContentData.section === ''" v-model="feedbackContentData.record" placeholder="请选择督导学校">
                        <el-option
                          v-for="item in zgyfkDdjlList"
                          :key="item.id"
                          :label="item.title"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <span> 整改标题：</span>
                    <el-form-item
                      prop="title"
                      :rules="[
                        { required: true, message: '整改标题不能为空'},
                      ]"
                    >
                      <el-input v-model.trim="feedbackContentData.title" :maxlength="50"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <span> 整改期限：</span>
                    <el-form-item
                      prop="deadline"
                      :rules="[
                        { required: true, message: '整改期限不能为空'},
                      ]"
                    >
                      <el-date-picker
                        style="width: 150px;"
                        v-model="feedbackContentData.deadline"
                        :picker-options="pickerOptions"
                        type="date"
                        placeholder="请选择日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="content">
                  <el-col :span="3">
                    <span> 问题描述：</span>
                  </el-col>
                  <el-col :span="21" style="padding-left: 0px;margin-top: 0px;">
                    <el-form-item
                      prop="question"
                      :rules="[
                        { required: true, message: '问题描述不能为空'},
                      ]"
                    >
                      <el-input type="textarea" :rows="4" v-model.trim="feedbackContentData.question" :maxlength="1000"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="content">
                  <el-col :span="24">
                  </el-col>
                  <el-col :span="24">
                    <el-upload
                      class="upload-demo"
                      :action="zgyfkAction"
                      :auto-upload="false"
                      :before-upload="zgyfkBeforeUpload"
                      name="uploadFile"
                      ref="zgyfkUpload"
                      :on-success="zgyfkSuccess"
                      multiple>
                      <i class="el-icon-plus">插入附件</i>
                      <span>（请上传.jpg .png .doc .docx .pdf 格式且大小不超过20M的文件）</span>
                    </el-upload>
                  </el-col>
                </el-row>

                <el-row class="content">
                  <el-col :span="24"></el-col>
                  <el-col :span="24">
                    <el-button type="primary" size="small"  @click="submitForm('feedbackContentData')">确定</el-button>
                    <el-button size="small" @click="listShow = true">取消</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <div class="process-after" v-if="confirmBox">
              <p>
                <i @click="close" class="el-icon-close"></i>
                <span>确认整改与反馈</span>
              </p>
              <div class="confirm">
                <el-row>
                  <el-col :span="4">学期</el-col>
                  <el-col :span="20">{{ zgyfkConfirmDetail.schoolYear + '-' + (zgyfkConfirmDetail.schoolYear - 1) + '年 第' + zgyfkConfirmDetail.semester + '学期'}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">责任督学</el-col>
                  <el-col :span="20">{{ zgyfkConfirmDetail.userName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">督导学校</el-col>
                  <el-col :span="20">{{ zgyfkConfirmDetail.schoolName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">整改编号</el-col>
                  <el-col :span="20">{{ zgyfkConfirmDetail.rectificationCode }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">督导记录</el-col>
                  <el-col :span="20">督导记录</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">整改标题</el-col>
                  <el-col :span="20">{{ zgyfkConfirmDetail.title }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">通知日期</el-col>
                  <el-col :span="20">{{ zgyfkConfirmDetail.createdDate | dateFormat('yyyy-MM-dd') }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">整改期限</el-col>
                  <el-col :span="20">{{ zgyfkConfirmDetail.limitDate | dateFormat('yyyy-MM-dd') }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">问题描述</el-col>
                  <el-col :span="20">
                    {{ zgyfkConfirmDetail.remark }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">附件</el-col>
                  <el-col :span="20">
                    <p v-for="(item, index) in zgyfkConfirmDetail.fileList" :key="index">
                      {{ item.name }}
                      <span class="cursor-pointer blue-color"  @click="route(item)">预览</span>
                      <span class="cursor-pointer blue-color" @click="downloadFile(item)">下载({{ (item.size / 1024 / 1024).toFixed(2) }})MB</span>
                    </p>
                  </el-col>
                </el-row>
              </div>
              <div class="confirm" v-for="(item, index) in zgyfkConfirmDetail.feedBackList" :key="index">
                <el-row>
                  <el-col :span="4">反馈人</el-col>
                  <el-col :span="20">{{ item.userName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">反馈时间</el-col>
                  <el-col :span="20">{{ item.createdDate | dateFormat('yyyy-MM-dd') }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">反馈</el-col>
                  <el-col :span="20">
                    {{ item.feedback }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">附件</el-col>
                  <el-col :span="20">
                    <p v-for="(n, index) in item.fileList" :key="index">
                      {{ n.name }}
                      <span class="cursor-pointer blue-color"  @click="route(n)">预览</span>
                      <span class="cursor-pointer blue-color" @click="downloadFile(n)">下载({{ (n.size / 1024 / 1024).toFixed(2) }})MB</span>
                    </p>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">督学意见</el-col>
                  <el-col :span="20">
                    <span v-if="item.dxOpinion === 1">整改措施到位</span>
                    <span v-if="item.dxOpinion === 2">整改不到位，需要继续整改</span>
                    <span v-if="!item.dxOpinion"></span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">备注</el-col>
                  <el-col :span="20">
                    {{ item.remark }}
                  </el-col>
                </el-row>
              </div>

              <el-form :model="feedbackConfirmContentData" ref="feedbackConfirmContentData" label-width="100px" class="demo-ruleForm">

                <el-row>
                  <el-col :span="24">
                    <span> 督学意见：</span>
                    <el-form-item
                      prop="advice"
                      :rules="[
                        { required: true, message: '督学意见不能为空'},
                      ]"
                    >
                      <el-radio-group v-model="feedbackConfirmContentData.advice">
                        <el-radio :label="1">整改措施到位</el-radio>
                        <el-radio :label="2">整改不到位，需要继续整改</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="content">
                  <el-col :span="3">
                    <span style="padding-left: 35px"> 内容：</span>
                  </el-col>
                  <el-col :span="21" style="padding-left: 0px;margin-top: 0px;">
                    <el-form-item
                      prop="content"
                      :rules="[
                        { required: true, message: '内容不能为空'},
                      ]"
                    >
                      <el-input type="textarea" :rows="4" v-model.trim="feedbackConfirmContentData.content" :maxlength="1000"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="content">
                  <el-col :span="24"></el-col>
                  <el-col :span="24">
                    <el-button type="primary" size="small" :disabled="zgyfkConfirmCanSave" @click="submitForm('feedbackConfirmContentData')">确定</el-button>
                    <el-button size="small" @click="zgyfkCancel">取消</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <!-- 督导记录查看 -->
            <div class="process-after" v-if="ddgcDetailShow">
              <p>
                <i @click="close" class="el-icon-close"></i>
                <span>整改与反馈详情</span>
              </p>
              <div class="confirm">
                <el-row>
                  <el-col :span="5">学期</el-col>
                  <el-col :span="19">{{ ddgcDetail.schoolYear + '-' + (ddgcDetail.schoolYear - 1) + '年 第' + ddgcDetail.semester + '学期'}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">责任督学</el-col>
                  <el-col :span="19">{{ ddgcDetail.userName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导学校</el-col>
                  <el-col :span="19">{{ ddgcDetail.schoolName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导记录</el-col>
                  <el-col :span="19">{{ ddgcDetail.recordTitle }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导编号</el-col>
                  <el-col :span="19">{{ ddgcDetail.rectificationCode }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">整改标题</el-col>
                  <el-col :span="19">{{ ddgcDetail.title }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">整改期限</el-col>
                  <el-col :span="19">{{ ddgcDetail.limitDate | dateFormat('yyyy-MM-dd') }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">问题描述</el-col>
                  <el-col :span="19">{{ ddgcDetail.remark }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">附件</el-col>
                  <el-col :span="19">
                    <p v-for="(item, index) in ddgcDetail.fileList" :key="index">
                      {{ item.name }}
                      <span class="cursor-pointer blue-color"  @click="route(item)">预览</span>
                      <span class="cursor-pointer blue-color" @click="downloadFile(item)">下载({{ (item.size / 1024 / 1024).toFixed(2) }})MB</span>
                    </p>
                  </el-col>
                </el-row>
              </div>

              <ul>
                  <li v-for="(item, index) in List" :key="index">
                    <!-- 反馈意见 -->
                    <div class="confirm">
                      <el-row>
                        <el-col :span="5">反馈人</el-col>
                        <el-col :span="19">{{item.userName}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="5">反馈时间</el-col>
                        <el-col :span="19">{{ item.createdDate | dateFormat('yyyy-MM-dd')}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="5">反馈</el-col>
                        <el-col :span="19">{{ item.feedback }}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="5">附件</el-col>
                        <el-col :span="19">
                          <p v-for="(m, index) in item.fileList" :key="index">
                            {{ m.name }}
                            <span class="cursor-pointer blue-color" @click="route(m)">预览</span>
                            <span class="cursor-pointer blue-color" @click="downloadFile(m)">下载({{ (m.size / 1024 / 1024).toFixed(2) }})MB</span>
                          </p>
                        </el-col>
                      </el-row>
                    </div>
                    <!-- 督导意见 -->
                    <div class="confirm">
                      <el-row>
                        <el-col :span="5">督学人员</el-col>
                        <el-col :span="19">{{ddgcDetail.userName}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="5">督学时间</el-col>
                        <el-col :span="19">{{item.remarkDate | dateFormat('yyyy-MM-dd')}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="5">督导意见</el-col>
                        <el-col :span="19">{{item.remark}}</el-col>
                      </el-row>
                    </div>            
                  </li>
              </ul>
              <el-row class="content">
                <el-col :span="24">
                  <el-button type="primary" size="small" style="margin: 20px 0;" @click="ddgcBack">返回</el-button>
                </el-col>
              </el-row>
            </div>
          </div>

          <!-- 学校情况 -->
          <div class="right-box" v-if="schoolSituationBoxShow">
            <div v-if="listShow && !ddgcDetailShow" class="process">
              <p>
                <i @click="close" class="el-icon-close"></i>
                <span>学校情况</span>
              </p>

              <el-row>
                <el-col :span="6" v-if="mySchoolId">
                  <el-button type="primary" @click="schoolSituationAdd">新增</el-button>
                  <el-button @click="deleteXxqk('xxqk')" >删除</el-button>
                </el-col>
                <el-col :span="18">
                  <el-select v-model="schoolYear" placeholder="请选择" @change="getXxqkPage">
                    <el-option
                      v-for="item in schoolYearOptions"
                      :key="item.schoolYear"
                      :label="item.schoolYearName"
                      :value="item.schoolYear">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>

              <template>
                <el-table
                  :data="schoolSituationList"
                  @selection-change="xxqkChange"
                  border
                  style="width: 100%">
                  <el-table-column
                    type="selection"
                    label-class-name="head"
                    width="35">
                  </el-table-column>
                  <el-table-column
                    label="标题"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head">
                    <template slot-scope="scope">
                      <span class="cursor-pointer" @click="lookXxqk(scope.row)">
                        {{ scope.row.title }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="userName"
                    label="责任督学"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head"
                    width="130">
                  </el-table-column>
                  <el-table-column
                    prop="createdDate"
                    label="上传日期"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    v-if="mySchoolId"
                    label="操作"
                    align='center'
                    show-overflow-tooltip
                    label-class-name="head"
                    width="180">
                    <template slot-scope="scope">
                      <span class="cursor-pointer blue-color" @click="getXxqkDetails(scope.row)">编辑</span>
                      <span class="cursor-pointer red-color" @click="deleteXxqk(scope.row)">删除</span>
                    </template>
                  </el-table-column>
                </el-table>
              </template>

              <el-pagination
                v-if="xxqkTotalCount !== 0"
                @size-change="xxqkHandleSizeChange"
                @current-change="xxqkHandleCurrentChange"
                :current-page="xxqkPageNo"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="xxqkPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="xxqkTotalCount">
              </el-pagination> 
            </div>

            <div v-if="!listShow && !ddgcDetailShow" class="process-after">
              <p>
                <i @click="close" class="el-icon-close"></i>
                <span>新增学校情况</span>
              </p>

              <el-form :model="schoolSituationContentData" ref="schoolSituationContentData" label-width="100px" class="demo-ruleForm">
                <el-row>
                  <el-col :span="12">
                    <span> 学期：</span>
                    <el-form-item
                      prop="section"
                      :rules="[
                        { required: true, message: '学期不能为空'},
                      ]"
                    >
                      <el-select v-model="schoolSituationContentData.section" placeholder="请选择学期">
                        <el-option
                          v-for="item in schoolSemesterOptions"
                          :key="item.schoolYearName"
                          :label="item.schoolYearName"
                          :value="item.schoolYearName">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <span> 学校：</span>
                    <el-form-item
                      prop="school"
                      :rules="[
                        { required: true, message: '学校不能为空'},
                      ]"
                    >
                      <el-select v-model="schoolSituationContentData.school" placeholder="请选择学校">
                        <el-option
                          v-for="item in ddgcSchoolList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <span> 责任督学：</span>
                    <el-form-item
                      :rules="[
                        { required: true, message: '督导学校不能为空'},
                      ]"
                    >
                      <span>{{ user ? user.name : '' }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <span> 标题：</span>
                    <el-form-item
                      prop="title"
                      :rules="[
                        { required: true, message: '标题不能为空'},
                      ]"
                    >
                      <el-input v-model.trim="schoolSituationContentData.title" :maxlength="50"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="content">
                  <el-col :span="3">
                    <span> 学校情况：</span>
                  </el-col>
                  <el-col :span="21" style="padding-left: 0px;margin-top: 0px;">
                    <el-form-item
                      prop="situation"
                      :rules="[
                        { required: true, message: '学校情况不能为空'},
                      ]"
                    >
                      <el-input type="textarea" :rows="4" v-model.trim="schoolSituationContentData.situation" :maxlength="1000"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="content">
                  <el-col :span="24"></el-col>
                  <el-col :span="24">
                    <el-button type="primary" size="small" :disabled="xxqkCanSave" @click="submitForm('schoolSituationContentData')">确定</el-button>
                    <el-button size="small" @click="listShow = true">取消</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            
            <!-- 学校详情查看 -->
            <div class="process-after" v-if="!listShow && ddgcDetailShow">
              <p>
                <i @click="close" class="el-icon-close"></i>
                <span>学校情况详情</span>
              </p>
              <div class="confirm">
                <el-row>
                  <el-col :span="5">学期</el-col>
                  <el-col :span="19">{{ ddgcDetail.schoolYear + '-' + (ddgcDetail.schoolYear - 1) + '年 第' + ddgcDetail.semester + '学期'}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">责任督学</el-col>
                  <el-col :span="19">{{ ddgcDetail.userName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">督导学校</el-col>
                  <el-col :span="19">{{ ddgcDetail.schoolName }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">标题</el-col>
                  <el-col :span="19">{{ ddgcDetail.title }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">学校情况</el-col>
                  <el-col :span="19">{{ ddgcDetail.situation }}</el-col>
                </el-row>
              </div>
              <el-row class="content">
                <el-col :span="24">
                  <el-button type="primary" size="small" style="margin: 20px 0;" @click="ddgcBack">返回</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </transition>
    </div>
</template>
<script>
import { amapManager } from 'vue-amap'
import { mapGetters } from 'vuex'
import server from '../../utils/axios'
import { success, notice } from '../../api/index'
import { dateFormat } from '../../filters/index.js'
import icon from '../../assets/images/Location A Green Copy 3.png'
import iconRed from '../../assets/images/Location A Green Copy 6.png'
export default {
  name: 'common',
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      },
      // 督导过程**************************
      ddgcIsChange: false,
      ddgcCanConfirm: false,
      List: [],
      ddgcPageNo: 1,
      ddgcPageSize: 10,
      ddgcTotalCount: 0,
      schoolYear: '',
      schoolId: '',
      ddgcSchoolList: '',
      ddgcFileIds: [],
      ddgcEditId: '',
      ddgcFileNumber: 0,
      ddgcHasUploadList: [],
      ddgcHasUploadListOther: [],
      ddgcDelList: [],
      ddgcDetailShow: false,
      ddgcDetail: '',
      timeList: [
        { label: '上午', value: 1 },
        { label: '下午', value: 2 },
        { label: '全天', value: 3 }
      ],
      processContentData: {
        section: '',
        school: '',
        date: '',
        time: '',
        title: '',
        planAndContent: '',
        record: ''
      },
      processList: [],
      // 督导记录********************************************
      ddjlIsChange: false,
      ddjlPageNo: 1,
      ddjlPageSize: 10,
      ddjlTotalCount: 0,
      ddjlHasUploadList: [],
      ddjlDetail: '',
      ddjlHasUploadListOther: [],
      ddjlEditId: '',
      ddjlDelList: [],
      allDdgcList: [],
      ddjlFileIds: [],
      ddjlFileNumber: 0,
      userList: [],
      ddjlCanConfirm: false,
      ddMethodList: [
        { name: '随机听课', id: 1 },
        { name: '查阅资料', id: 2 },
        { name: '列席会议', id: 3 },
        { name: '座谈走访', id: 4 },
        { name: '问卷调查', id: 5 },
        { name: '校园巡视', id: 6 },
        { name: '访谈家长', id: 7 }
      ],
      recordContentData: {
        section: '',
        school: '',
        date: '',
        time: '',
        ddMethod: '',
        supervisionProcess: '',
        user: '',
        title: '',
        content: ''
      },
      recordList: [],
      // 整改与反馈***************************************
      zgyfkPageNo: 1,
      zgyfkPageSize: 10,
      zgyfkTotalCount: 0,
      zgyfkDelList: [],
      zgyfkDdjlList: [],
      zgyfkFileIds: [],
      zgyfkFileNumber: 0,
      zgyfkStateList: [
        { name: '全部', id: '' },
        { name: '整改中', id: 1 },
        { name: '已整改', id: 2 },
        { name: '已确认', id: 3 }
      ],
      zgyfkState: '',
      feedbackContentData: {
        section: '',
        school: '',
        title: '',
        question: '',
        deadline: '',
        record: ''
      },
      feedbackList: [],
      feedbackConfirmContentData: {
        advice: 1,
        content: ''
      },
      zgyfkConfirmDetail: '',
      checkZgId: '',
      zgyfkConfirmCanSave: false,
      // 学校情况*****************************************
      schoolSituationList: [],
      schoolSituationContentData: {
        section: '',
        school: '',
        title: '',
        situation: ''
      },
      xxqkCanSave: false,
      xxqkEditId: '',
      xxqkPageNo: 1,
      xxqkPageSize: 10,
      xxqkTotalCount: 0,
      xxqkDelList: [],
      // ***********************************************
      schoolRecord: {
        ddgcCount: 0,
        ddjlCount: 0,
        zgyfkCount: 0,
        xxqkCount: 0
      },
      mySchool: false,
      icon: icon,
      iconRed: iconRed,
      schoolYearOptions: [],
      schoolSemesterOptions: [],
      listShow: true,
      processBoxShow: false,
      recordBoxShow: false,
      feedbackBoxShow: false,
      schoolSituationBoxShow: false,
      confirmBox: false,
      activeName: '',
      schoolList: [],
      mySchoolId: '',
      // 地图
      markers: [],
      amapManager,
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
      }
    }
  },
  methods: {
    // 点击展开左侧学校列表
    clickSchool (item, index) {
      this.markers = this.markers.map(item => ({...item, icon: this.icon}))
      // this.markers[index].icon = this.iconRed
      if (item.longitude) {
        this.markers.filter(n => n.position[0] === item.longitude)[0].icon = this.iconRed
      }
      this.schoolId = item.id
      if (!this.activeName) {
        this.markers = this.markers.map(item => ({...item, icon: this.icon}))
      }
      this.getSchoolRecord(item)
      this.mySchoolId = item.mySchoolId
    },
    // 确定
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'processContentData') {
            if (this.ddgcEditId) {
              if (this.ddgcIsChange) {
                this.$refs['ddgcUpload'].submit()
                return
              }
              this.updateDdgx()
            } else {
              if (this.ddgcIsChange) {
                this.$refs['ddgcUpload'].submit()
                return
              }
              this.addDdgc()
            }
          } else if (formName === 'recordContentData') {
            if (this.ddjlEditId) {
              if (this.ddjlIsChange) {
                this.$refs['ddjlUpload'].submit()
                return
              }
              this.updateDdjl()
            } else {
              if (this.ddjlIsChange) {
                this.$refs['ddjlUpload'].submit()
                return
              }
              this.addDdjl()
            }
          } else if (formName === 'feedbackContentData') {
            if (this.$refs.zgyfkUpload.uploadFiles.length !== 0) {
              this.$refs['zgyfkUpload'].submit()
              return
            }
            this.addZgyfk()
          } else if (formName === 'feedbackConfirmContentData') {
            this.addZgyfkConfirm()
          } else if (formName === 'schoolSituationContentData') {
            if (this.xxqkEditId) {
              this.updateXxqk()
            } else {
              this.addXxqk()
            }
          }
        } else {
          return false
        }
      })
    },
    // 关闭按钮
    close () {
      this.processBoxShow = false
      this.recordBoxShow = false
      this.feedbackBoxShow = false
      this.schoolSituationBoxShow = false
    },
    // 督导过程**********************************************************
    // 督导过程按钮
    ddgcHandleSizeChange (val) {
      this.ddgcPageSize = val
      this.getDdgxPage()
    },
    ddgcHandleCurrentChange (val) {
      this.ddgcPageNo = val
      this.getDdgxPage()
    },
    supervisionProcess () {
      this.recordBoxShow = false
      this.feedbackBoxShow = false
      this.schoolSituationBoxShow = false
      setTimeout(() => {
        this.listShow = true
        this.ddgcDetailShow = false
        this.processBoxShow = true
      }, 100)
      this.getDdgxPage()
    },
    // 督导过程新增按钮
    processAdd () {
      this.listShow = false
      this.ddgcEditId = ''
      this.ddgcIsChange = false
      this.processContentData = {
        section: '',
        school: '',
        date: '',
        time: '',
        title: '',
        planAndContent: '',
        record: ''
      }
      this.ddgcFileIds = []
      this.ddgcFileNumber = 0
      this.ddgcHasUploadList = []
      this.getDdgcSchoolList()
      this.getSchoolYearAndSemeter()
      this.getAllDdgx()
    },
    // 获取学年列表
    getAllSchoolYear () {
      server.get(`/ddgcController/getAllSchoolYear`)
      .then(res => {
        if (res.data.code === 1) {
          this.schoolYear = res.data.result.schoolYearSemesterToWebDto.schoolYear
          this.schoolYearOptions = res.data.result.schoolYearSemesterList
        } else {
          notice(res.data.message)
        }
      })
    },
    // 督导过程学年筛选
    ddgcSchoolChange () {
      this.getDdgxPage()
    },
    // 查询督导过程列表
    getDdgxPage () {
      server.get(`/ddgcController/getDdgcPage?pageNo=${this.ddgcPageNo}` +
                                            `&pageSize=${this.ddgcPageSize}` +
                                            `&schoolYear=${this.schoolYear}` +
                                            `&schoolId=${this.schoolId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.processList = res.data.result.list.map(item => ({
            ...item,
            createdDate: dateFormat(item.createdDate, 'yyyy-MM-dd'),
            ddDate: dateFormat(item.ddDate, 'yyyy-MM-dd')
          }))
          this.ddgcTotalCount = res.data.result.totalCount
          this.getMyChargeSchool()
        } else {
          notice(res.data.message)
        }
      })
    },
    ddgcHasUploadChange () {
      this.ddgcIsChange = true
    },
    // 督导过程上传附件之前
    ddgcBeforeUpload (file) {
      return new Promise((resolve, reject) => {
        let arr = file.name.split('.')
        if (arr[arr.length - 1] === 'JPG' || arr[arr.length - 1] === 'jpg' || arr[arr.length - 1] === 'PNG' || arr[arr.length - 1] === 'png' || arr[arr.length - 1] === 'PDF' || arr[arr.length - 1] === 'pdf' || arr[arr.length - 1] === 'doc' || arr[arr.length - 1] === 'docx') {
          if (file.size <= 20971520) {
            this.ddgcIsChange = true
            resolve()
          } else {
            this.ddgcIsChange = false
            this.$message.error('请上传20M以内的文件')
            reject(arr)
          }
        } else {
          this.ddgcIsChange = false
          this.$message.error('请上传正确的文件格式')
          reject(arr)
        }
      })
    },
    // 督导过程上传附件成功
    ddgcSuccess (res, file, fileList) {
      this.ddgcFileIds.push(res)
      this.ddgcFileNumber += 1
      if ((this.ddgcFileNumber + this.ddgcHasUploadListOther.length) === fileList.length) {
        if (this.ddgcEditId) {
          this.updateDdgx()
        } else {
          this.addDdgc()
        }
      }
    },
    // 督导过程删除附件
    ddgcRemove (file, fileList) {
      this.ddgcHasUploadListOther = fileList.filter(item => item.id)
    },
    // 添加督导过程
    addDdgc () {
      this.ddgcCanConfirm = true
      server.post(`/ddgcController/addDdgc`, {
        schoolYear: this.schoolSemesterOptions.filter(item => this.processContentData.section === item.schoolYearName)[0].schoolYear,
        schoolId: this.processContentData.school,
        semester: this.schoolSemesterOptions.filter(item => this.processContentData.section === item.schoolYearName)[0].semester,
        ddDate: dateFormat(this.processContentData.date, 'yyyy-MM-dd HH:mm:ss'),
        ddDateType: this.processContentData.time,
        title: this.processContentData.title,
        ddProject: this.processContentData.planAndContent,
        ddProcess: this.processContentData.record,
        fileIds: this.ddgcFileIds.map(item => item.result).join(',')
      })
      .then(res => {
        if (res.data.code === 1) {
          success('添加督导过程成功')
          this.listShow = true
          this.getDdgxPage()
        } else {
          notice(res.data.message)
        }
        this.ddgcCanConfirm = false
      })
    },
    // 编辑督导过程
    updateDdgx () {
      this.ddgcCanConfirm = true
      server.post('/ddgcController/updateDdgc', {
        id: this.ddgcEditId,
        schoolYear: this.schoolSemesterOptions.filter(item => this.processContentData.section === item.schoolYearName)[0].schoolYear,
        schoolId: this.processContentData.school,
        semester: this.schoolSemesterOptions.filter(item => this.processContentData.section === item.schoolYearName)[0].semester,
        ddDate: dateFormat(this.processContentData.date, 'yyyy-MM-dd HH:mm:ss'),
        ddDateType: this.processContentData.time,
        title: this.processContentData.title,
        ddProject: this.processContentData.planAndContent,
        ddProcess: this.processContentData.record,
        fileIds: this.ddgcFileIds.concat(this.ddgcHasUploadListOther).map(item => item.result).join(',')
      })
      .then(res => {
        if (res.data.code === 1) {
          this.listShow = true
          this.getDdgxPage()
          success('编辑督导过程成功')
        } else {
          notice(res.data.message)
        }
        this.ddgcCanConfirm = false
      })
    },
    // 督导过程返回
    ddgcBack () {
      this.listShow = true
      this.ddgcDetailShow = false
    },
    // 查看督导过程
    lookDdgc (val) {
      server.get(`/ddgcController/getDdgcDetails?ddgcId=${val.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.listShow = false
          this.ddgcDetailShow = true
          this.ddgcDetail = res.data.result
        } else {
          notice(res.data.message)
        }
      })
    },
    // 查询督导过程详情
    getDdgxDetails (item) {
      server.get(`/ddgcController/getDdgcDetails?ddgcId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.listShow = false
          let data = res.data.result
          this.ddgcEditId = data.id
          this.ddgcIsChange = false
          if (res.data.result.fileList) {
            this.ddgcHasUploadList = res.data.result.fileList.map(item => ({...item, result: item.id}))
            this.ddgcHasUploadListOther = this.ddgcHasUploadList
          }
          this.processContentData = {
            section: `${data.schoolYear}-${Number(data.schoolYear) + 1}学年 第${data.semester}学期`,
            school: data.schoolId,
            date: data.ddDate,
            time: data.ddDateType,
            title: data.title,
            planAndContent: data.ddProject,
            record: data.ddProcess
          }
          this.ddgcFileIds = []
          this.ddgcFileNumber = 0
          this.getDdgcSchoolList()
          this.getSchoolYearAndSemeter()
        } else {
          notice(res.data.message)
        }
      })
    },
    // 多选框改变
    ddgcChange (val) {
      this.ddgcDelList = val
    },
    // 删除督导过程
    deleteDdgx (val) {
      let ids
      if (val === 'ddgc') {
        ids = this.ddgcDelList.map(item => item.id).join(',')
        if (ids === '') {
          notice('请先选择要删除的督导过程')
          return
        }
      } else {
        ids = val.id
      }
      server.post(`/ddgcController/deleteDdgc?ids=${ids}`)
      .then(res => {
        if (res.data.code === 1) {
          success('删除成功')
          this.getDdgxPage()
        } else {
          notice(res.data.message)
        }
      })
    },
    // 获取我的督导学校
    getDdgcSchoolList () {
      server.get(`/ddgcController/getMyChargeSchool?myChargeState=${1}`)
      .then(res => {
        console.log(1)
        if (res.data.code === 1) {
          this.ddgcSchoolList = res.data.result
          if (res.data.result.length !== 0) {
            this.processContentData.school = res.data.result[0].id
            this.recordContentData.school = res.data.result[0].id
            this.feedbackContentData.school = res.data.result[0].id
            this.schoolSituationContentData.school = res.data.result[0].id
          }
          console.log(this.recordContentData.school)
        } else {
          notice(res.data.message)
        }
      })
    },
    // 督导记录**************************************************************
    // 督导记录按钮
    ddjlHandleSizeChange (val) {
      this.ddjlPageSize = val
      this.getDdjlPage()
    },
    ddjlHandleCurrentChange (val) {
      this.ddjlPageNo = val
      this.getDdjlPage()
    },
    supervisionRecord () {
      this.processBoxShow = false
      this.feedbackBoxShow = false
      this.schoolSituationBoxShow = false
      setTimeout(() => {
        this.recordBoxShow = true
        this.ddgcDetailShow = false
        this.listShow = true
      }, 100)
      this.getDdjlPage()
    },
    // 督导记录新增按钮
    async recordAdd () {
      this.listShow = false
      this.ddjlEditId = ''
      this.ddjlIsChange = false
      this.ddjlFileIds = []
      this.ddjlFileNumber = 0
      this.ddjlHasUploadList = []
      this.recordContentData = {
        section: '',
        school: '',
        date: '',
        time: '',
        ddMethod: '',
        supervisionProcess: '',
        user: '',
        title: '',
        content: ''
      }
      await this.getDdgcSchoolList()
      await this.getSchoolYearAndSemeter()
      await this.getAllUser()
      await this.getAllDdgx()
    },
    // 督导记录学年筛选
    ddjlSchoolYearChange () {
      this.getDdjlPage()
    },
    // 分页查询督导记录
    getDdjlPage () {
      server.get(`/ddjlController/getDdjlPage?pageNo=${this.ddjlPageNo}` +
                                            `&pageSize=${this.ddjlPageSize}` +
                                            `&schoolYear=${this.schoolYear}` +
                                            `&schoolId=${this.schoolId}`)
      .then(res => {
        if (res.data.code === 1) {
          this.recordList = res.data.result.list.map(item => ({
            ...item,
            createdDate: dateFormat(item.createdDate, 'yyyy-MM-dd'),
            ddDate: dateFormat(item.ddDate, 'yyyy-MM-dd')
          }))
          this.ddjlTotalCount = res.data.result.totalCount
          this.getMyChargeSchool()
        } else {
          notice(res.data.message)
        }
      })
    },
    // 多选框改变
    ddjlChange (val) {
      this.ddjlDelList = val
    },
    // 删除督导记录
    deleteDdjl (val) {
      let ids
      console.log(this.ddjlDelList)
      if (val === 'ddjl') {
        if (this.ddjlDelList.length) {
          ids = this.ddjlDelList.map(item => item.id).join(',')
        } else {
          this.$notify({
            title: '警告',
            message: '请先选择要删除的督导记录',
            type: 'warning'
          })
          return
        }
      } else {
        ids = val.id
      }
      server.post(`/ddjlController/deleteDdjl?ids=${ids}`)
      .then(res => {
        if (res.data.code === 1) {
          success('删除成功')
          this.getDdjlPage()
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    // change督导学校
    ddjlSchoolChange () {
      this.recordContentData.supervisionProcess = ''
      this.getAllDdgx()
    },
    // 查询督导过程
    async getAllDdgx () {
      console.log(this.recordContentData.school)
      await server.get(`ddjlController/getAllDdgc?schoolId=${this.recordContentData.school}&schoolYear=${this.schoolSemesterOptions.filter(item => item.schoolYearName === this.recordContentData.section)[0].schoolYear}`)
      .then(res => {
        console.log(4)
        if (res.data.code === 1) {
          this.allDdgcList = res.data.result
        } else {
          notice(res.data.message)
        }
      })
    },
    // 查询所有人员
    async getAllUser () {
      await server.get(`ddjlController/getAllUser`)
      .then(res => {
        console.log(3)
        if (res.data.code === 1) {
          this.userList = res.data.result
        } else {
          notice(this, res.data.message, 2000)
        }
      })
    },
    ddjlBeforeUpload (file) {
      return new Promise((resolve, reject) => {
        let arr = file.name.split('.')
        if (arr[arr.length - 1] === 'JPG' || arr[arr.length - 1] === 'jpg' || arr[arr.length - 1] === 'PNG' || arr[arr.length - 1] === 'png' || arr[arr.length - 1] === 'PDF' || arr[arr.length - 1] === 'pdf' || arr[arr.length - 1] === 'doc' || arr[arr.length - 1] === 'docx') {
          if (file.size <= 20971520) {
            this.ddjlIsChange = true
            resolve()
          } else {
            this.ddjlIsChange = false
            this.$message.error('请上传20M以内的文件')
            reject(arr)
          }
        } else {
          this.ddjlIsChange = false
          this.$message.error('请上传正确的文件格式')
          reject(arr)
        }
      })
    },
    ddjlHasUploadChange () {
      this.ddjlIsChange = true
    },
    // 督导记录上传附件成功
    ddjlSuccess (res, file, fileList) {
      this.ddjlFileIds.push(res)
      this.ddjlFileNumber += 1
      if ((this.ddjlFileNumber + this.ddjlHasUploadListOther.length) === fileList.length) {
        if (this.ddjlEditId) {
          this.updateDdjl()
        } else {
          this.addDdjl()
        }
      }
    },
    // 督导记录删除附件
    ddjlRemove (file, fileList) {
      this.ddjlHasUploadListOther = fileList.filter(item => item.id)
    },
    // 督导记录详情查看
    lookDdjl (val) {
      server.get(`/ddjlController/getDdjlDetails?id=${val.id}`)
      .then(res => {
        this.listShow = false
        this.ddgcDetailShow = true
        this.ddgcDetail = res.data.result
        let data = []
        res.data.result.ddMethod.split(',').forEach(item => {
          data.push(this.ddMethodList[Number(item) - 1])
        })
        this.ddgcDetail.ddMethod = data
      })
    },
    // 查询督导记录详情
    async getDdjlDetails (val) {
      await server.get(`/ddjlController/getDdjlDetails?id=${val.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.listShow = false
          this.ddjlFileNumber = 0
          let data = res.data.result
          this.ddjlEditId = data.id
          this.ddjlIsChange = false
          this.ddjlFileIds = []
          let ddMethodArr = []
          if (res.data.result.fileList) {
            this.ddjlHasUploadList = res.data.result.fileList.map(item => ({...item, result: item.id}))
            this.ddjlHasUploadListOther = this.ddjlHasUploadList
          }
          data.ddMethod.split(',').forEach(item => {
            ddMethodArr.push(Number(item))
          })
          let userArr = []
          data.peerUserIds.split(',').forEach(item => {
            userArr.push(Number(item))
          })
          this.recordContentData = {
            section: `${data.schoolYear}-${Number(data.schoolYear) + 1}学年 第${data.semester}学期`,
            school: data.ddSchoolId,
            date: data.ddDate,
            time: data.ddDateType,
            ddMethod: ddMethodArr,
            supervisionProcess: data.processId,
            user: userArr,
            title: data.title,
            content: data.ddContent
          }
        } else {
          notice(res.data.message)
        }
      })
      this.getAllUser()
      this.getDdgcSchoolList()
      await this.getSchoolYearAndSemeter()
      await this.getAllDdgx()
    },
    // 编辑督导记录
    updateDdjl () {
      this.ddjlCanConfirm = true
      server.post(`/ddjlController/updateDdjl`, {
        id: this.ddjlEditId,
        schoolYear: this.schoolSemesterOptions.filter(item => this.recordContentData.section === item.schoolYearName)[0].schoolYear,
        schoolId: this.recordContentData.school,
        semester: this.schoolSemesterOptions.filter(item => this.recordContentData.section === item.schoolYearName)[0].semester,
        ddDate: dateFormat(this.recordContentData.date, 'yyyy-MM-dd HH:mm:ss'),
        ddDateType: this.recordContentData.time,
        ddgxId: this.recordContentData.supervisionProcess,
        peerUserIds: this.recordContentData.user.join(','),
        ddMethod: this.recordContentData.ddMethod.join(','),
        title: this.recordContentData.title,
        ddContent: this.recordContentData.content,
        fileIds: this.ddjlFileIds.concat(this.ddjlHasUploadListOther).map(item => item.result).join(',')
      })
      .then(res => {
        if (res.data.code === 1) {
          success('修改督导过程成功')
          this.listShow = true
          this.getDdjlPage()
        } else {
          notice(res.data.message)
        }
        this.ddjlCanConfirm = false
      })
    },
    // 新增督导记录
    addDdjl () {
      this.ddjlCanConfirm = true
      server.post(`/ddjlController/addDdjl`, {
        schoolYear: this.schoolSemesterOptions.filter(item => this.recordContentData.section === item.schoolYearName)[0].schoolYear,
        schoolId: this.recordContentData.school,
        semester: this.schoolSemesterOptions.filter(item => this.recordContentData.section === item.schoolYearName)[0].semester,
        ddDate: dateFormat(this.recordContentData.date, 'yyyy-MM-dd HH:mm:ss'),
        ddDateType: this.recordContentData.time,
        ddgxId: this.recordContentData.supervisionProcess,
        peerUserIds: this.recordContentData.user.join(','),
        ddMethod: this.recordContentData.ddMethod.join(','),
        title: this.recordContentData.title,
        ddContent: this.recordContentData.content,
        fileIds: this.ddjlFileIds.map(item => item.result).join(',')
      })
      .then(res => {
        if (res.data.code === 1) {
          success('添加督导过程成功')
          this.listShow = true
          this.getDdjlPage()
        } else {
          notice(res.data.message)
        }
        this.ddjlCanConfirm = false
      })
    },
    // 整改与反馈**************************************************************
    // 整改与反馈取消按钮
    zgyfkCancel () {
      this.listShow = true
      this.confirmBox = false
    },
    // 整改与反馈按钮
    feedback () {
      this.processBoxShow = false
      this.recordBoxShow = false
      this.schoolSituationBoxShow = false
      this.confirmBox = false
      setTimeout(() => {
        this.listShow = true
        this.ddgcDetailShow = false
        this.feedbackBoxShow = true
      }, 100)
      this.getZgyfkPage()
    },
    // 整改与反馈新增按钮
    async feedbackAdd () {
      this.listShow = false
      this.zgyfkFileIds = []
      this.zgyfkFileNumber = 0
      this.feedbackContentData = {
        section: '',
        school: '',
        title: '',
        question: '',
        deadline: '',
        record: ''
      }
      await this.getDdgcSchoolList()
      await this.getSchoolYearAndSemeter()
      await setTimeout(() => {
        this.getAllDdjlList()
      }, 600)
    },
    // change督导学校
    zgyfkSchoolChange () {
      this.feedbackContentData.record = ''
      this.getAllDdjlList()
    },
    // change学期
    zgyfkSemesterChange () {
      this.feedbackContentData.record = ''
      this.getAllDdjlList()
    },
    zgyfkHandleSizeChange (val) {
      this.zgyfkPageSize = val
      this.getZgyfkPage()
    },
    zgyfkHandleCurrentChange (val) {
      this.zgyfkPageNo = val
      this.getZgyfkPage()
    },
    zgyfkBeforeUpload (file) {
      return new Promise((resolve, reject) => {
        let arr = file.name.split('.')
        if (arr[arr.length - 1] === 'JPG' || arr[arr.length - 1] === 'jpg' || arr[arr.length - 1] === 'PNG' || arr[arr.length - 1] === 'png' || arr[arr.length - 1] === 'PDF' || arr[arr.length - 1] === 'pdf' || arr[arr.length - 1] === 'doc' || arr[arr.length - 1] === 'docx') {
          if (file.size <= 20971520) {
            resolve()
          } else {
            this.$message.error('请上传20M以内的文件')
            reject(arr)
          }
        } else {
          this.$message.error('请上传正确的文件格式')
          reject(arr)
        }
      })
    },
    zgyfkSuccess (res, file, fileList) {
      this.zgyfkFileIds.push(res)
      this.zgyfkFileNumber += 1
      if (this.zgyfkFileNumber === fileList.length) {
        this.addZgyfk()
      }
    },
    // 多选框改变
    zgyfkChange (val) {
      this.zgyfkDelList = val
    },
    // 删除整改与反馈
    deleteZgyfk (val) {
      let ids
      if (val === 'zgyfk') {
        ids = this.zgyfkDelList.map(item => item.id).join(',')
        if (ids === '') {
          notice('请先选择要删除的整改与反馈')
          return
        }
      } else {
        ids = val.id
      }
      server.post(`/zgyfkController/deleteZgyfk?ids=${ids}`)
      .then(res => {
        if (res.data.code === 1) {
          success('删除成功')
          this.getZgyfkPage()
        } else {
          notice(res.data.message)
        }
      })
    },
    // 分页查询整改与反馈
    getZgyfkPage () {
      server.get(`/zgyfkController/getZgyfkPage?schoolId=${this.schoolId}` +
                  `&schoolYear=${this.schoolYear}` +
                  `&pageNo=${this.zgyfkPageNo}` +
                  `&pageSize=${this.zgyfkPageSize}` +
                  `&state=${this.zgyfkState}`)
      .then(res => {
        if (res.data.code === 1) {
          this.feedbackList = res.data.result.list.map(item => ({
            ...item,
            createdDate: dateFormat(item.createdDate, 'yyyy-MM-dd'),
            limitDate: dateFormat(item.limitDate, 'yyyy-MM-dd'),
            state: item.state === 1 ? '整改中' : (item.state === 2 ? '已整改' : '已确认')
          }))
          this.zgyfkTotalCount = res.data.result.totalCount
          this.getMyChargeSchool()
        } else {
          notice(res.data.message)
        }
      })
    },
    // 查询所有督导记录
    async getAllDdjlList () {
      await server.get(`/zgyfkController/getAllDdjlList?schoolId=${this.feedbackContentData.school}&schoolYear=${this.schoolSemesterOptions.filter(item => item.schoolYearName === this.feedbackContentData.section)[0].schoolYear}`)
      .then(res => {
        if (res.data.code === 1) {
          this.zgyfkDdjlList = res.data.result
        } else {
          notice(res.data.message)
        }
      })
    },
    // 新增整改与反馈
    addZgyfk () {
      server.post(`/zgyfkController/addZgyfk`, {
        schoolYear: this.schoolSemesterOptions.filter(item => this.feedbackContentData.section === item.schoolYearName)[0].schoolYear,
        schoolId: this.feedbackContentData.school,
        semester: this.schoolSemesterOptions.filter(item => this.feedbackContentData.section === item.schoolYearName)[0].semester,
        title: this.feedbackContentData.title,
        ddjlId: this.feedbackContentData.record,
        limitDate: dateFormat(this.feedbackContentData.deadline, 'yyyy-MM-dd HH:mm:ss'),
        describe: this.feedbackContentData.question,
        fileIds: this.zgyfkFileIds.map(item => item.result).join(',')
      })
      .then(res => {
        if (res.data.code === 1) {
          this.getZgyfkPage()
          this.listShow = true
        } else {
          notice(res.data.message)
        }
      })
    },
    // 整改与反馈查看
    lookZgyfk (val) {
      server.get(`/zgyfkController/getZgyfkDetails?id=${val.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.listShow = false
          this.ddgcDetailShow = true
          this.ddgcDetail = res.data.result
          res.data.result.feedBackList ? this.List = res.data.result.feedBackList : this.List = []
        }
      })
    },
    // 查询整改与反馈详情
    getZgyfkDetails (val) {
      server.get(`/zgyfkController/getZgyfkDetails?id=${val.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.feedbackConfirmContentData = {
            advice: 1,
            content: ''
          }
          res.data.result.feedBackList ? this.List = res.data.result.feedBackList : this.List = []
          this.zgyfkConfirmDetail = res.data.result
          this.checkZgId = res.data.result.id
          this.listShow = false
          this.confirmBox = true
        } else {
          notice(res.data.message)
        }
      })
    },
    // 整改与反馈确定
    addZgyfkConfirm () {
      this.zgyfkConfirmCanSave = true
      server.post(`/zgyfkController/checkZg?id=${this.checkZgId}&feedBackId=${this.zgyfkConfirmDetail.feedBackList[this.zgyfkConfirmDetail.feedBackList.length - 1].id}&checkState=${this.feedbackConfirmContentData.advice}&remark=${this.feedbackConfirmContentData.content}`)
      .then(res => {
        if (res.data.code === 1) {
          this.listShow = true
          this.confirmBox = false
          this.getZgyfkPage()
        } else {
          notice(res.data.message)
        }
        this.zgyfkConfirmCanSave = false
      })
    },
    // 学校情况******************************************************************
    // 学校情况按钮
    schoolSituation () {
      this.processBoxShow = false
      this.recordBoxShow = false
      this.feedbackBoxShow = false
      setTimeout(() => {
        this.listShow = true
        this.ddgcDetailShow = false
        this.schoolSituationBoxShow = true
      }, 100)
      this.getXxqkPage()
    },
    // 学校情况新增按钮
    schoolSituationAdd () {
      this.listShow = false
      this.xxqkEditId = ''
      this.schoolSituationContentData = {
        section: '',
        school: '',
        title: '',
        situation: ''
      }
      this.getDdgcSchoolList()
      this.getSchoolYearAndSemeter()
    },
    xxqkHandleSizeChange (val) {
      this.xxqkPageSize = val
      this.getXxqkPage()
    },
    xxqkHandleCurrentChange (val) {
      this.xxqkPageNo = val
      this.getXxqkPage()
    },
    // 多选框改变
    xxqkChange (val) {
      this.xxqkDelList = val
    },
    // 删除学校情况
    deleteXxqk (val) {
      let ids
      if (val === 'xxqk') {
        ids = this.xxqkDelList.map(item => item.id).join(',')
        if (ids === '') {
          notice('请先选择要删除的学校情况')
          return
        }
      } else {
        ids = val.id
      }
      server.post(`/xxqkGpddController/deleteXxqk`, {
        ids: ids
      })
      .then(res => {
        if (res.data.code === 1) {
          success('删除成功')
          this.getXxqkPage()
        } else {
          notice(res.data.message)
        }
      })
    },
    // 分页查询学校情况
    getXxqkPage () {
      server.get(`/xxqkGpddController/getXxqkPage?schoolId=${this.schoolId}` +
                  `&schoolYear=${this.schoolYear}` +
                  `&pageNo=${this.xxqkPageNo}` +
                  `&pageSize=${this.xxqkPageSize}`)
      .then(res => {
        if (res.data.code === 1) {
          this.schoolSituationList = res.data.result.list.map(item => ({
            ...item,
            createdDate: dateFormat(item.createdDate, 'yyyy-MM-dd')
          }))
          this.xxqkTotalCount = res.data.result.totalCount
          this.getMyChargeSchool()
        } else {
          notice(res.data.message)
        }
      })
    },
    // 学校情况查看
    lookXxqk (val) {
      server.get(`/xxqkGpddController/getXxqkDetails?id=${val.id}`)
      .then(res => {
        this.listShow = false
        this.ddgcDetailShow = true
        this.ddgcDetail = res.data.result
      })
    },
    // 查询学校情况详情
    getXxqkDetails (val) {
      server.get(`/xxqkGpddController/getXxqkDetails?id=${val.id}`)
      .then(res => {
        if (res.data.code === 1) {
          this.listShow = false
          let data = res.data.result
          this.xxqkEditId = data.id
          this.schoolSituationContentData = {
            section: `${data.schoolYear}-${Number(data.schoolYear) + 1}学年 第${data.semester}学期`,
            school: data.ddSchoolId,
            title: data.title,
            situation: data.situation
          }
          this.getDdgcSchoolList()
          this.getSchoolYearAndSemeter()
        } else {
          notice(res.data.message)
        }
      })
    },
    // 编辑学校详情
    updateXxqk () {
      this.xxqkCanSave = true
      server.post(`/xxqkGpddController/updateXxqk`, {
        id: this.xxqkEditId,
        schoolYear: this.schoolSemesterOptions.filter(item => this.schoolSituationContentData.section === item.schoolYearName)[0].schoolYear,
        schoolId: this.schoolSituationContentData.school,
        semester: this.schoolSemesterOptions.filter(item => this.schoolSituationContentData.section === item.schoolYearName)[0].semester,
        title: this.schoolSituationContentData.title,
        situation: this.schoolSituationContentData.situation
      })
      .then(res => {
        if (res.data.code === 1) {
          this.listShow = true
          success('编辑成功')
          this.getXxqkPage()
        } else {
          notice(res.data.message)
        }
        this.xxqkCanSave = false
      })
    },
    // 新增学校情况
    addXxqk () {
      this.xxqkCanSave = true
      server.post('/xxqkGpddController/addXxqk', {
        schoolYear: this.schoolSemesterOptions.filter(item => this.schoolSituationContentData.section === item.schoolYearName)[0].schoolYear,
        schoolId: this.schoolSituationContentData.school,
        semester: this.schoolSemesterOptions.filter(item => this.schoolSituationContentData.section === item.schoolYearName)[0].semester,
        title: this.schoolSituationContentData.title,
        situation: this.schoolSituationContentData.situation
      })
      .then(res => {
        if (res.data.code === 1) {
          this.listShow = true
          success('添加成功')
          this.getXxqkPage()
        } else {
          notice(res.data.message)
        }
        this.xxqkCanSave = false
      })
    },
    // ************************************************************************
    // 只看我负责人的学校
    async changeMySchool () {
      await this.getMyChargeSchool()
      if (this.schoolList.length !== 0) {
        this.mySchoolId = this.schoolList[0].mySchoolId
      }
    },
    // 获取学校列表
    async getMyChargeSchool () {
      await server.get(`/ddgcController/getMyChargeSchool?myChargeState=${this.mySchool ? 1 : 2}`)
      .then(res => {
        if (res.data.code === 1) {
          this.schoolList = res.data.result
          this.markers = []
          this.schoolList.forEach((item, index) => {
            if (item.longitude) {
              this.markers.push({
                icon: this.icon,
                position: [item.longitude, item.latitude],
                events: {
                  click: (e) => {
                    this.markers = this.markers.map(n => ({...n, icon: this.icon}))
                    this.markers.filter(n => n.position[0] === item.longitude)[0].icon = this.iconRed
                    this.activeName = item.name
                    this.getSchoolRecord(item)
                  }
                }
              })
            }
          })
          if (this.schoolId) {
            this.activeName = this.schoolList.filter(item => item.id === this.schoolId)[0].name
            if (this.markers.filter(n => n.position[0] === (this.schoolList.filter(item => item.id === this.schoolId)[0].longitude)).length !== 0) {
              this.markers.filter(n => n.position[0] === (this.schoolList.filter(item => item.id === this.schoolId)[0].longitude))[0].icon = this.iconRed
            }
            this.getSchoolRecord(this.schoolList.filter(item => item.id === this.schoolId)[0])
          } else {
            if (this.schoolList.length !== 0) {
              this.activeName = this.schoolList[0].name
              this.markers[0].icon = this.iconRed
              this.getSchoolRecord(this.schoolList[0])
              this.schoolId = this.schoolList[0].id
            }
          }
          // if (res.data.result.length !== 0) {
          //   this.mySchoolId = res.data.result[0].mySchoolId
          // }
        } else {
          notice(res.data.message)
        }
      })
    },
    // 查询指定学校的记录
    getSchoolRecord (item) {
      server.get(`/ddgcController/getSchoolRecord?schoolId=${item.id}`)
      .then(res => {
        if (res.data.code === 1) {
          setTimeout(_ => {
            this.schoolRecord = {
              ddgcCount: res.data.result.ddgcCount,
              ddjlCount: res.data.result.ddjlCount,
              zgyfkCount: res.data.result.zgyfkCount,
              xxqkCount: res.data.result.xxqkCount
            }
          }, 100)
        } else {
          notice(res.data.message)
        }
      })
    },
    // 获取当前学年和学期
    async getSchoolYearAndSemeter () {
      await server.get(`/ddgcController/getSchoolYearAndSemeter`)
      .then(res => {
        console.log(2)
        if (res.data.code === 1) {
          this.schoolSemesterOptions = res.data.result.schoolYearSemesterList
          this.processContentData.section = res.data.result.schoolYearSemesterToWebDto.schoolYearName
          this.recordContentData.section = res.data.result.schoolYearSemesterToWebDto.schoolYearName
          this.feedbackContentData.section = res.data.result.schoolYearSemesterToWebDto.schoolYearName
          this.schoolSituationContentData.section = res.data.result.schoolYearSemesterToWebDto.schoolYearName
        } else {
          notice(res.data.message)
        }
      })
    },
    // 预览
    route (val) {
      let url
      url = `${this.previewUrl}${this.rootUrl}${this.previewInterface}?attachmentId=${val.id}`
      window.open(`#/file/fileInfo?id=${val.id}&url=${url}&size=${val.size}`)
    },
    // 下载
    downloadFile (val) {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/zgyfkController/downloadFileById?fileId=${val.id}`
    }
  },
  computed: {
    ddgcAction () {
      const path = document.querySelector('#contextPath').value
      return `${path}/ddgcController/uploadFile`
    },
    ddjlAction () {
      const path = document.querySelector('#contextPath').value
      return `${path}/ddjlController/uploadFile`
    },
    zgyfkAction () {
      const path = document.querySelector('#contextPath').value
      return `${path}/zgyfkController/uploadFile`
    },
    ...mapGetters([
      'user',
      'previewUrl',
      'rootUrl',
      'previewInterface'
    ])
  },
  mounted () {
    setTimeout(async () => {
      await this.getMyChargeSchool()
      if (this.schoolList.length !== 0) {
        this.mySchoolId = this.schoolList[0].mySchoolId
      }
      this.getAllSchoolYear()
    }, 500)
  }
}
</script>
<style lang="scss">
@import '../../assets/scss/variable.scss';
@import '../../assets/scss/mixin.scss';
.common {
  position: relative;
  .amap-demo {
    height: calc(100vh - 50px);
  }

  .common-left {
    position: absolute;
    top: 17px;
    left: 20px;
    bottom: 20px;
    width: 360px;
    overflow-x: hidden;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0px 0px 4px 0 rgba(0,0,0,0.28);
    padding: 20px;
    box-sizing: border-box;
    &>.el-row {
      .el-col:nth-child(1) {
        font-size: 15px;
        font-weight: bold;
      }
      .el-col:nth-child(2) {
        text-align: right;
        span{
          font-weight: bold;
        }
      }
    }

    &>.el-collapse {
      margin-top: 20px;
      border: 0;
      .el-collapse-item {
        margin-top: 5px;
        border: 1px solid #E6EBF5;
        .el-collapse-item__header {
          border: 0;
          padding: 0 5px;
          min-height: 44px;
          .blue-icon {
            display: inline-block;
            vertical-align: middle;
            margin-right: 10px;
            width: 21px;
            height: 35px;
            background: url('../../assets/images/Location A Green Copy 3.png');
            background-size: cover;
            text-align: center;
            line-height: 30px;
            span {
              color: #fff;
            }
          }
          i {
            display: none;
          }
        }
        .el-collapse-item__wrap {
          border: 0;
          span{
            display: inline-block;
            width: 139px;
            height: 36px;
            border: 1px solid #EEEEEE;
            border-radius: 3px;
            margin: 0 0 3px 7px;
            text-align: center;
            line-height: 36px;
            background: #fff;
            cursor: pointer;
            &:hover {
              color: #21A0FF;
              border: 1px solid #21A0FF;
            }
          }
          .el-collapse-item__content {
            padding-bottom: 10px;
          }
        }
      }
      .is-active {
        border: #ddd;
        .blue-icon {
          background: url('../../assets/images/Location A Green Copy 6.png') !important;
          background-size: cover !important;
        }
        .el-collapse-item__wrap,.el-collapse-item__header {
          background: #F5F5F5;
        }
      }
    }
  }

  .right-box {
    position: fixed;
    z-index: 1;
    right: 0;
    top: 50px;
    width: 720px;
    height: calc(100vh - 50px);
    // height: 600px;
    padding: 20px;
    background: #fff;
    border: 1px solid #E6E6E6;
    box-sizing: border-box;
    box-shadow: 0px 0px 4px 0 rgba(0,0,0,0.28);
    overflow-x: hidden;

    // 督导过程
    .process {
      &>p {
        span {
          font-weight: bold;
          font-size: 16px;
        }
        i {
          font-size: 20px;
          cursor: pointer;
          font-weight: bold;
          float: right;
        }
      }
      &>.el-row {
        margin-top: 20px;
        .el-col:nth-child(2) {
          text-align: right;
        }
      }
      .el-table {
        margin-top: 20px;
      }
      .el-pagination {
        margin: 20px;
        text-align: right;
      }
    }

    .process-after {
      &>p {
        span {
          font-weight: bold;
          font-size: 16px;
        }
        i {
          font-size: 20px;
          cursor: pointer;
          font-weight: bold;
          float: right;
        }
      }
      
      .el-form {
        margin-top: $width;
        .el-row {
          .el-col {
            position: relative;
            &>span {
              display: inline-block;
              width: 80px;
              text-align: right;
            }
            .el-form-item {
              width: 65%;
              display: inline-block;
              .el-form-item__content {
                margin-left: 0 !important;
              }
              .el-checkbox {
                margin-left: 10px;
              }
            }
          }
        }
        .content {
          .el-col {
            &>span {
              width: 180px;
              text-align: left;
            }
          }
          .el-col:nth-child(2) {
            padding-left: 80px;
            margin-top: 10px;
            .el-textarea {
              width: 600px;
            }
          }
          .el-upload {
            i {
              color: #20A0FF;
            }
          }
          .el-button {
            margin-top: $width;
          }
        }
      }

      .confirm {
        margin-top: $width;
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
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .blue-color {
    color: #3FADFF;
  }

  .red-color {
    color: #FF6464;
  }

  // .height {
  //   .el-select__tags {
  //     height: 40px !important;
  //     overflow-x: hidden !important;
  //   }
  //   .el-tag--small {
  //     height: 32px;
  //     line-height: 32px;
  //   }
  //   input {
  //     height: 40px !important;
  //   }
  // }
}
</style>

