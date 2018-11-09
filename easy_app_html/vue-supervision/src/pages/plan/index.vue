<template>
    <div class="plan-index">
        <p>计划总结</p>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="个人计划总结" name="1">
            <div class="person">
              <div class="box">
                  <el-button type="primary" :disabled="role !== 2 && role !== 4" @click.stop="add">新增计划</el-button>
                  <el-button type="primary" :disabled="role !== 2 && role !== 4" @click.stop="sumdia">新增总结</el-button>
                  <el-button @click.stop="deletePlan('del')" :disabled="mlength === 0 || role !== 2">删除</el-button>
                  <div class="choose">
                    <span>类型：</span>
                    <el-select v-model="value1" @change="typeChange" placeholder="请选择">
                        <el-option
                          v-for="item in types"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <span>学年：</span>
                      <el-select v-model="year" placeholder="请选择">
                        <el-option
                          v-for="item in schools"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <span>督学人员:</span>
                      <el-select v-model="value3" placeholder="请选择">
                        <el-option
                          v-for="(item, index) in supervisors"
                          :key="item.userId + index"
                          :label="item.userName"
                          :value="item.userId">
                        </el-option>
                      </el-select> 
                      <el-button @click="getList">搜索</el-button> 
                  </div> 
              </div>                        
              <el-table
                ref="multipleTable1"
                border
                :data="tableData"
                v-loading="tableloading"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  align="center"
                  width="100">
                </el-table-column>
                <el-table-column
                  label="标题"
                  show-overflow-tooltip
                  align="center">
                  <template slot-scope="scope"><span class="title-click" @click="look(scope.row.id)">{{ scope.row.title }}</span></template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="类型"
                  align="center"
                  width="200">
                  <template slot-scope="scope">
                    <span v-if="scope.row.type === 1">个人计划</span>
                    <span v-if="scope.row.type === 2">个人总结</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createdUserName"
                  label="责任督学"
                  width="200"
                  align="center"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="上传日期"
                  align="center"
                  width="200"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.createdDate | dateFormat('yyyy-MM-dd')}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="300"
                  align="center">
                  <template slot-scope="scope">
                    <el-button type="text" :disabled="scope.row.createdUserName === userName ? false : role !== 2 && scope.row.createdUserId !== userId" class="dealedit" @click="editPlan(scope.row.id)" icon="el-icon-edit">编辑</el-button>
                    <el-button type="text" :disabled="scope.row.createdUserName === userName ? false : role !== 2 && scope.row.createdUserId !== userId" class="dealdelete" @click="deletePlan(scope.row.id)" icon="el-icon-delete">删除</el-button>
                  </template>
                </el-table-column>                            
              </el-table>                         
            </div>
          </el-tab-pane>
          <el-tab-pane label="责任区计划总结" name="2">
            <div class="area">
              <div class="box">
                  <el-button type="primary" :disabled="!leader" @click.stop="resadd">新增计划</el-button>
                  <el-button type="primary" :disabled="!leader" @click.stop="ressum">新增总结</el-button>
                  <el-button @click.stop="deletePlan('del')" :disabled="mlength === 0 || !leader">删除</el-button>
                  <div class="choose">
                    <span>类型：</span>
                    <el-select v-model="value1" placeholder="请选择">
                        <el-option
                          v-for="item in dutyTypes"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <span>学年：</span>
                      <el-select v-model="year" placeholder="请选择">
                        <el-option
                          v-for="item in schools"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <span>责任区:</span>
                      <el-select v-model="zrarea" placeholder="请选择" :disabled="role !== 4">
                        <el-option
                          v-for="item in zrAreas"
                          :key="item.areaId"
                          :label="item.areaName"
                          :value="item.areaId">
                        </el-option>
                      </el-select> 
                      <el-button @click="getList" :disabled="zrarea === '无数据'">搜索</el-button> 
                  </div> 
              </div>                        
              <el-table
                ref="multipleTable2"
                border
                v-loading="tableloading"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  align="center"
                  width="100">
                </el-table-column>
                <el-table-column
                  label="标题"
                  show-overflow-tooltip
                  align="center">
                  <template slot-scope="scope"><span class="title-click" @click="look(scope.row.id)">{{ scope.row.title }}</span></template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="类型"
                  align="center"
                  width="200">
                  <template slot-scope="scope">
                    <span v-if="scope.row.type === 3">责任区计划</span>
                    <span v-if="scope.row.type === 4">责任区总结</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="areaName"
                  label="责任区"
                  width="200"
                  align="center"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="createdUserName"
                  label="制定人"
                  width="200"
                  align="center"
                  show-overflow-tooltip>
                </el-table-column>                
                <el-table-column
                  prop="address"
                  label="上传日期"
                  align="center"
                  width="200"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.createdDate | dateFormat('yyyy-MM-dd')}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="200"
                  align="center">
                  <template slot-scope="scope">
                    <el-button type="text" :disabled="scope.row.createdUserName === userName ? false : !leader || role !== 2" class="dealedit" @click="editPlan(scope.row.id)" icon="el-icon-edit">编辑</el-button>
                    <el-button type="text" :disabled="scope.row.createdUserName === userName ? false : !leader || role !== 2" class="dealdelete" @click="deletePlan(scope.row.id)" icon="el-icon-delete">删除</el-button>
                  </template>
                </el-table-column>                            
              </el-table>              
            </div>
          </el-tab-pane>
          <el-tab-pane label="督导室计划总结" name="3">
            <div class="super">
              <div class="box">
                <el-button type="primary" :disabled="role !== 4" @click.stop="ddAdd">新增计划</el-button>
                <el-button type="primary" :disabled="role !== 4" @click.stop="ddSum">新增总结</el-button>
                <el-button @click.stop="deletePlan('del')" :disabled="mlength === 0 || role !== 4">删除</el-button>
                <div class="choose">
                  <span>类型：</span>
                  <el-select v-model="value1" placeholder="请选择">
                      <el-option
                        v-for="item in supTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <span v-if="activeName !== '3'">责任区:</span>
                    <el-select v-model="value3" placeholder="请选择" v-if="activeName !== '3'">
                      <el-option
                        v-for="(item, index) in supervisors"
                        :key="item.userId + index"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select> 
                    <el-button @click="getList">搜索</el-button> 
                </div> 
            </div>                        
            <el-table
              ref="multipleTable3"
              border
              v-loading="tableloading"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                align="center"
                width="100">
              </el-table-column>
              <el-table-column
                label="文件名称"
                show-overflow-tooltip
                align="center">
                <template slot-scope="scope"><span class="title-click" @click="look(scope.row.id)">{{ scope.row.title }}</span></template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="类型"
                align="center"
                width="200">
                <template slot-scope="scope">
                    <span v-if="scope.row.type === 5">督导室计划</span>
                    <span v-if="scope.row.type === 6">督导室总结</span>
                  </template>
              </el-table-column>
              <el-table-column
                label="上传日期"
                align="center"
                width="200"
                show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.createdDate | dateFormat('yyyy-MM-dd')}}</span>
              </template>
              </el-table-column>              
              <el-table-column
                prop="createdUserName"
                label="制定人"
                width="200"
                align="center"
                show-overflow-tooltip>
              </el-table-column>                
              <el-table-column
                label="操作"
                width="300"
                align="center">
                <template slot-scope="scope">
                  <el-button type="text" :disabled="role !== 4" class="dealedit" @click="editPlan(scope.row.id)" icon="el-icon-edit">编辑</el-button>
                  <el-button type="text" class="dealview"  @click="look(scope.row.id)" icon="el-icon-view" v-if="scope.row.fileId">预览</el-button>
                  <el-button type="text" class="deal" @click="download(scope.row.fileId)" icon="el-icon-download" v-if="scope.row.fileId">下载</el-button>
                  <el-button type="text" :disabled="role !== 4" class="dealdelete" @click="deletePlan(scope.row.id)" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>                            
            </el-table>              
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>         
        <!-- 责任区的新增计划 -->
        <transition name="slide-left" mode="out-in">
          <div class="newplan"  v-click-outside="hide" v-if="sumVisible" v-loading="grloading">
            <div class="header">
              <p v-if="sum === 3 && edit === ''">新增责任区计划</p>
              <p v-if="sum === 4 && edit === ''">新增责任区总结</p>
              <p v-if="edit === 2">编辑责任区计划</p>
              <p v-if="edit === 3">编辑责任区总结</p>
              <i class="el-icon-close" @click="sumVisible = false"></i>
            </div>
            <ul>
              <li>
                <span v-if="sum === 3 && edit === '' ? true : edit === 2 ? true : false">计划类别:</span>
                <el-select v-model="plan" placeholder="请选择" v-if="sum === 3 && edit === '' ? true : edit === 2 ? true : false">
                    <el-option
                      v-for="item in plantypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <span v-if="sum === 4 && edit === '' ? true : edit === 3 ? true : false">总结类别:</span>
                  <el-select v-model="sumplan" placeholder="请选择" v-if="sum === 4 && edit === '' ? true : edit === 3 ? true : false">
                      <el-option
                        v-for="item in sumplans"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>                                    
                  <span>学年:</span>
                  <el-select v-model="year" placeholder="请选择">
                    <el-option
                      v-for="item in schools"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>

                  <span v-if="sumplan !== '1' || plan !== '1'">学期:</span>
                  <el-select v-model="semester" placeholder="请选择" v-if="sumplan !== '1' || plan !== '1'">
                    <el-option
                      v-for="item in semesters"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <span>责任区:</span>
                  <el-select v-model="zrarea" placeholder="请选择" :disabled="true">
                    <el-option
                      v-for="item in zrAreas"
                      :key="item.areaId"
                      :label="item.areaName"
                      :value="item.areaId">
                    </el-option>
                  </el-select>                   
                  <span>制定人:</span>
                  <el-select v-model="value3" placeholder="请选择" :disabled="true">
                    <el-option
                      v-for="(item, index) in supervisors"
                      :key="item.userId + index"
                      :label="item.userName"
                      :value="item.userId">
                    </el-option>
                  </el-select>                                    
              </li>
              <li>
                编写方式: 
                <el-radio v-model="radio" label="1" @click.native="reset" :disabled="disflag">在线编写</el-radio>
                <el-radio v-model="radio" label="2" @click.native="reset" :disabled="disflag">上传文档</el-radio>
              </li>
            </ul>
            <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" :rules="rules" ref="formLabelAlign2" v-show="radio === '1'">
              <el-form-item label="标题:" prop="title">
                <el-input v-model="formLabelAlign.title"></el-input>
              </el-form-item>
              <el-form-item label="主要内容:" prop="content">
                <el-input
                  type="textarea"
                  :rows="20"
                  v-model="formLabelAlign.content">
                </el-input>
              </el-form-item>
              <el-form-item size="large">
                <el-button type="primary" @click="onSubmit('formLabelAlign2')">确定</el-button>
                <el-button @click="back">返回</el-button>
              </el-form-item>              
            </el-form>
            <el-form :model="form" :rules="rulename" ref="form2" v-show="radio === '2'" class="upload">
              <el-form-item label="标题:" prop="rename">
                <el-input v-model="form.rename" style="width: 352px; height: 35px;"></el-input>
              </el-form-item>
              <el-form-item label-width="200px">
                  <el-upload
                    class="upload-demo"
                    :action="action"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    multiple
                    :auto-upload="false"
                    ref="upload2"
                    :limit="1"
                    name="file"
                    :on-success="Success"
                    :on-change="beforeUpload"
                    :on-exceed="handleExceed"
                    :file-list="fileList">
                    <el-button type="text" icon="el-icon-plus">点击上传</el-button>
                    <span slot="tip" class="el-upload__tip">(只能上传doc/docx，且大小不超过20M)</span>
                  </el-upload>              
              </el-form-item>
              <el-form-item size="large">
                <el-button type="primary" @click="Submit('form2')">确定</el-button>
                <el-button @click="back">返回</el-button>
              </el-form-item>               
            </el-form>
          </div>
        </transition>
        <!-- 个人的新增 -->
        <transition name="slide-left" mode="out-in">
            <div class="newplan" v-if="planVisible" v-click-outside="hide" v-loading="grloading">
              <div class="header">
                <p v-if="sum === 0 && edit === ''">新增个人计划</p>
                <p v-if="sum === 1 && edit === ''">新增个人总结</p>
                <p v-if="edit === 0">编辑个人计划</p>
                <p v-if="edit === 1">编辑个人总结</p>
                <i class="el-icon-close" @click="planVisible = false"></i>
              </div>
              <ul>
                <li>
                  <span v-if="sum === 0 && edit === '' ? true : edit === 0 ? true : false">计划类别:</span>
                  <el-select v-model="plan" placeholder="请选择" v-if="sum === 0 && edit === '' ? true : edit === 0 ? true : false">
                      <el-option
                        v-for="item in plantypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select> 
                    <span v-if="sum === 1 && edit === '' ? true : edit === 1 ? true : false">总结类别:</span>
                    <el-select v-model="sumplan" placeholder="请选择" v-if="sum === 1 && edit === '' ? true : edit === 1 ? true : false">
                        <el-option
                          v-for="item in sumplans"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>                   
                    <span>学年:</span>
                    <el-select v-model="year" placeholder="请选择">
                      <el-option
                        v-for="item in schools"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
  
                    <span v-if="plan !== '1' || sumplan !== '1'" >学期:</span>
                    <el-select v-model="semester" placeholder="请选择" v-if="plan !== '1' || sumplan !== '1'">
                      <el-option
                        v-for="item in semesters"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </li>
                <li>
                  <span>编写方式: </span>
                  <el-radio v-model="radio" label="1" @click.native="reset" :disabled="disflag">在线编写</el-radio>
                  <el-radio v-model="radio" label="2" @click.native="reset" :disabled="disflag">上传文档</el-radio>
                </li>
                <li  v-show="radio === '1'">
                    <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" :rules="rules" ref="formLabelAlign1">
                        <el-form-item label="标题:" prop="title">
                          <el-input v-model="formLabelAlign.title"></el-input>
                        </el-form-item>
                        <el-form-item label="主要内容:" prop="content">
                          <el-input
                            type="textarea"
                            :rows="20"
                            v-model="formLabelAlign.content">
                          </el-input>
                        </el-form-item>
                        <el-form-item size="large">
                          <el-button type="primary" @click="onSubmit('formLabelAlign1')">确定</el-button>
                          <el-button @click="back">返回</el-button>
                        </el-form-item>              
                      </el-form>                  
                </li>
                <li v-show="radio === '2'">
                    <el-form :model="form" :rules="rulename" ref="form1" class="upload">
                        <el-form-item label="标题:" prop="rename">
                          <el-input v-model="form.rename" style="width: 352px; height: 35px;"></el-input>
                        </el-form-item>
                        <el-form-item label-width="200px">
                            <el-upload
                              class="upload-demo"
                              :action="action"
                              :on-preview="handlePreview"
                              :on-remove="handleRemove"
                              multiple
                              :auto-upload="false"
                              :limit="1"
                              name="file"
                              ref="upload1"
                              :on-success="Success"
                              :on-change="beforeUpload"
                              :on-exceed="handleExceed"
                              :file-list="fileList">
                              <el-button type="text" icon="el-icon-plus">点击上传</el-button>
                              <span slot="tip" class="el-upload__tip">(只能上传doc/docx，且大小不超过20M)</span>
                            </el-upload>              
                        </el-form-item>
                        <el-form-item size="large">
                          <el-button type="primary" @click="Submit('form1')">确定</el-button>
                          <el-button @click="back">返回</el-button>
                        </el-form-item>               
                      </el-form>
                </li>
              </ul>
            </div>
        </transition>
         <!--督导室新增  -->
         <transition name="slide-left" mode="out-in">
          <div class="newplan"  v-click-outside="hide" v-if="ddRoomVisible" v-loading="grloading">
            <div class="header">
              <p v-if="sum === 5 && edit === ''">新增督导室计划</p>
              <p v-if="sum === 6 && edit === ''">新增督导室总结</p>
              <p v-if="edit === 4">编辑督导室计划</p>
              <p v-if="edit === 5">编辑督导室总结</p>
              <i class="el-icon-close" @click="ddRoomVisible = false"></i>
            </div>
            <ul>
              <li>
                <span v-if="sum === 5 && edit === '' ? true : edit === 4 ? true : false">计划类别:</span>
                <el-select v-if="sum === 5 && edit === '' ? true : edit === 4 ? true : false" v-model="plan" placeholder="请选择">
                    <el-option
                      v-for="item in plantypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <span v-if="sum === 6 && edit === '' ? true : edit === 5 ? true : false">总结类别:</span>
                  <el-select v-if="sum === 6 && edit === '' ? true : edit === 5 ? true : false" v-model="sumplan" placeholder="请选择" >
                      <el-option
                        v-for="item in sumplans"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>                                   
                    <span>学年:</span>
                    <el-select v-model="year" placeholder="请选择">
                      <el-option
                        v-for="item in schools"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>

                  <span v-if="plan !== '1' || sumplan !== '1'">学期:</span>
                  <el-select v-model="semester" placeholder="请选择" v-if="plan !== '1' || sumplan !== '1'">
                    <el-option
                      v-for="item in semesters"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>          
                  <span>制定人:</span>
                  <el-select v-model="value3" placeholder="请选择" :disabled="true">
                    <el-option
                      v-for="(item, index) in supervisors"
                      :key="item.userId + index"
                      :label="item.userName"
                      :value="item.userId">
                    </el-option>
                  </el-select>                           
              </li>
              <li>
                编写方式: 
                <el-radio v-model="radio" label="1" @click.native="reset" :disabled="disflag">在线编写</el-radio>
                <el-radio v-model="radio" label="2" @click.native="reset" :disabled="disflag">上传文档</el-radio>
              </li>
            </ul>
            <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" :rules="rules" ref="formLabelAlign3" v-show="radio === '1'">
              <el-form-item label="标题:" prop="title">
                <el-input v-model="formLabelAlign.title"></el-input>
              </el-form-item>
              <el-form-item label="主要内容:" prop="content">
                <el-input
                  type="textarea"
                  :rows="20"
                  v-model="formLabelAlign.content">
                </el-input>
              </el-form-item>
              <el-form-item size="large">
                <el-button type="primary" @click="onSubmit('formLabelAlign3')">确定</el-button>
                <el-button @click="back">返回</el-button>
              </el-form-item>              
            </el-form>
            <el-form :model="form" :rules="rulename" ref="form3" v-show="radio === '2'" class="upload">
              <el-form-item label-width="200px">
                  <el-form-item label="标题:" prop="rename">
                    <el-input v-model="form.rename" style="width: 352px; height: 35px;"></el-input>
                  </el-form-item>
                  <el-upload
                    class="upload-demo"
                    :action="action"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    multiple
                    :limit="1"
                    name="file"
                    :auto-upload="false"
                    ref="upload3"
                    :on-success="Success"
                    :on-change="beforeUpload"
                    :on-exceed="handleExceed"
                    :file-list="fileList">
                    <el-button type="text" icon="el-icon-plus">点击上传</el-button>
                    <span slot="tip" class="el-upload__tip">(只能上传doc/docx，且大小不超过20M)</span>
                  </el-upload>              
              </el-form-item>
              <el-form-item size="large">
                <el-button type="primary" @click="Submit('form3')">确定</el-button>
                <el-button @click="back">返回</el-button>
              </el-form-item>               
            </el-form>
          </div>
        </transition>         
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import server from '../../utils/axios'
import { notice, success } from '../../api/index'
export default {
  name: 'plan-index',
  data () {
    return {
      leader: false,
      disflag: false,
      role: '',
      userId: '',
      mlength: 0,
      grloading: false,
      tableloading: false,
      id: '',
      sum: '',
      edit: '',
      zrarea: '',
      fileFlag: 1,
      pageSize: 10,
      currentPage: 1,
      itemInfo: {},
      totalCount: 0,
      zrAreas: [],
      userName: '',
      labelPosition: 'right',
      fileList: [],
      sumVisible: false,
      ddRoomVisible: false,
      attachmentId: '',
      fileList3: [],
      fileList2: [],
      formLabelAlign: {
        title: '',
        content: ''
      },
      form: {
        rename: ''
      },
      rulename: {
        rename: [
          { required: true, message: '文件名称不能为空', trigger: 'blur' }
        ]
      },
      rules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' },
          { max: 50, message: '可输入最大字数为50字', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '主要内容不能为空', trigger: 'blur' },
          { max: 10000, message: '可输入的最大字数为10000字', trigger: 'blur' }
        ]
      },
      radio: '1',
      planVisible: false,
      semesters: [
        {value: '1', label: '第一学期'},
        {value: '2', label: '第二学期'}
      ],
      semester: '1',
      tableData: [],
      activeName: '1',
      plantypes: [
        {value: '1', label: '学年计划'},
        {value: '2', label: '学期计划'}
      ],
      plan: '1',
      sumplans: [
        {value: '1', label: '学年总结'},
        {value: '2', label: '学期总结'}
      ],
      sumplan: '1',
      types: [
        {value: '', label: '全部'},
        {value: '1', label: '个人计划'},
        {value: '2', label: '个人总结'}
      ],
      dutyTypes: [
        {value: '', label: '全部'},
        {value: '4', label: '责任区总结'},
        {value: '3', label: '责任区计划'}
      ],
      supTypes: [
        {value: '', label: '全部'},
        {value: '6', label: '督导室总结'},
        {value: '5', label: '督导室计划'}
      ],
      value1: '',
      schools: [],
      year: '',
      supervisors: [],
      value3: ''
    }
  },
  methods: {
    typeChange () {
      this.getList()
    },
    look (id) {
      sessionStorage.id = id
      sessionStorage.activeName = this.activeName
      if (this.activeName === '2') {
        sessionStorage.areaName = this.tableData.filter(item => item.id === id)[0].areaName
      }
      if (this.activeName === '2' || this.activeName === '3') {
        sessionStorage.createdUserName = this.tableData.filter(item => item.id === id)[0].createdUserName
      }
      this.$router.push('/plan/fileLook')
    },
    Change (fileList) {
      this.form.rename = fileList.name
    },
    download (id) {
      const path = document.querySelector('#contextPath').value
      window.location.href = `${path}/common/readAttachment?attachmentId=${id}`
    },
    view (id) {
      let url
      url = `${this.previewUrl}${this.rootUrl}${this.previewInterface}?attachmentId=${id}`
      sessionStorage.fileId = id
      sessionStorage.url = url
      this.$router.push('/plan/fileLook')
    },
    deletePlan (item) {
      if (this.activeName === '1') {
        server.post(`/grjhzjController/deletePlan`, {
          planIds: item === 'del' ? this.multipleSelection.map(item => item.id).join(',') : item
        })
        .then(res => {
          if (res.data.code === 1) {
            success(res.data.message)
            this.getList()
          } else {
            notice(res.data.message)
          }
        })
      } else if (this.activeName === '2') {
        server.post(`/zrqjhzjController/deletePlan`, {
          planIds: item === 'del' ? this.multipleSelection.map(item => item.id).join(',') : item
        })
        .then(res => {
          if (res.data.code === 1) {
            success(res.data.message)
            this.getList()
          } else {
            notice(res.data.message)
          }
        })
      } else if (this.activeName === '3') {
        server.post(`/ddsjhzjController/deletePlan`, {
          planIds: item === 'del' ? this.multipleSelection.map(item => item.id).join(',') : item
        })
        .then(res => {
          if (res.data.code === 1) {
            success(res.data.message)
            this.getList()
          } else {
            notice(res.data.message)
          }
        })
      }
    },
    editPlan (id) {
      this.disflag = true
      this.itemInfo = this.tableData.filter(item => item.id === id)[0]
      this.id = id
      this.fileList = []
      this.clear()
      if (this.activeName === '1') {
        if (this.itemInfo.type === 1) {
          // 编辑个人计划
          this.edit = 0
          this.planVisible = true
        } else if (this.itemInfo.type === 2) {
          // 编辑个人总结
          this.edit = 1
          this.planVisible = true
        }
        server.get(`/grjhzjController/getPlan?planId=${id}`)
        .then(res => {
          if (res.data.code === 1) {
            let data = res.data.result
            data.attachment ? this.attachmentId = data.attachment.id : this.attachmentId = ''
            this.semester = String(data.semester)
            this.year = data.schoolYear
            data.type === 1 ? this.plan = String(data.planType) : this.sumplan = String(data.planType)
            if (data.attachment === null) {
              this.radio = '1'
              this.formLabelAlign.title = data.title
              this.formLabelAlign.content = data.content
            } else {
              this.radio = '2'
              this.form.rename = data.title
              this.formLabelAlign.title = ''
              this.formLabelAlign.content = ''
              let obj = {
                name: data.attachment.name,
                url: data.attachment.path
              }
              this.fileList.push(obj)
              this.fileList2 = this.fileList
              this.fileList3 = this.fileList
            }
          } else {
            notice(res.data.message)
          }
        })
      } else if (this.activeName === '2') {
        server.get(`/zrqjhzjController/getPlan?planId=${id}`)
        .then(res => {
          if (res.data.code === 1) {
            let data = res.data.result
            data.attachment ? this.attachmentId = data.attachment.id : this.attachmentId = ''
            this.formLabelAlign.title = data.title
            this.formLabelAlign.content = data.content
            this.semester = String(data.semester)
            this.year = data.schoolYear
            data.type === 3 ? this.plan = String(data.planType) : this.sumplan = String(data.planType)
            if (data.attachment === null) {
              this.radio = '1'
              this.formLabelAlign.title = data.title
              this.formLabelAlign.content = data.content
            } else {
              this.radio = '2'
              this.form.rename = data.title
              this.formLabelAlign.title = ''
              this.formLabelAlign.content = ''
              let obj = {
                name: data.attachment.name,
                url: data.attachment.path
              }
              this.fileList.push(obj)
              this.fileList2 = this.fileList
              this.fileList3 = this.fileList
            }
          } else {
            notice(res.data.message)
          }
        })
        if (this.itemInfo.type === 3) {
          // 编辑责任区计划
          this.edit = 2
          this.sumVisible = true
        } else if (this.itemInfo.type === 4) {
          // 编辑责任区总结
          this.edit = 3
          this.sumVisible = true
        }
      } else if (this.activeName === '3') {
        console.log(1)
        server.get(`/ddsjhzjController/getPlan?planId=${id}`)
        .then(res => {
          if (res.data.code === 1) {
            let data = res.data.result
            data.attachment ? this.attachmentId = data.attachment.id : this.attachmentId = ''
            this.formLabelAlign.title = data.title
            this.formLabelAlign.content = data.content
            this.semester = String(data.semester)
            this.year = data.schoolYear
            data.type === 5 ? this.plan = String(data.planType) : this.sumplan = String(data.planType)
            if (data.attachment === null) {
              this.radio = '1'
              this.formLabelAlign.title = data.title
              this.formLabelAlign.content = data.content
            } else {
              this.radio = '2'
              this.form.rename = data.title
              this.formLabelAlign.title = ''
              this.formLabelAlign.content = ''
              let obj = {
                name: data.attachment.name,
                url: data.attachment.path
              }
              this.fileList.push(obj)
              this.fileList2 = this.fileList
              this.fileList3 = this.fileList
            }
          } else {
            notice(res.data.message)
          }
        })
        if (this.itemInfo.type === 5) {
          // 编辑督导室计划
          this.edit = 4
          this.ddRoomVisible = true
        } else if (this.itemInfo.type === 6) {
          // 编辑督导室总结
          this.edit = 5
          this.ddRoomVisible = true
        }
      }
      this.year = this.itemInfo.schoolYear
      this.semester = this.itemInfo.semester
    },
    Success (response, fileList) {
      this.attachmentId = response.result
      if (this.activeName === '1') {
          // 个人计划总结
          // 新建
        if (this.edit === '') {
          server.post(`/grjhzjController/savePlan`, {
            type: this.sum === 0 ? 1 : 2,
            planType: this.sum === 0 ? this.plan : this.sumplan,
            schoolYear: this.year,
            semester: this.semester,
            title: this.form.rename,
            content: '',
            attachmentId: this.attachmentId
          })
          .then(res => {
            if (res.data.code === 1) {
              success(res.data.message)
              this.planVisible = false
              this.getList()
            } else {
              notice(res.data.message)
            }
            this.grloading = false
          })
        } else {
            // 编辑
          server.post(`/grjhzjController/editPlan`, {
            type: this.itemInfo.type,
            planType: this.sum === 0 ? this.plan : this.sumplan,
            schoolYear: this.year,
            semester: this.semester,
            title: this.form.rename,
            content: this.formLabelAlign.content,
            attachmentId: this.attachmentId,
            planId: this.id
          })
          .then(res => {
            if (res.data.code === 1) {
              success(res.data.message)
              this.planVisible = false
              this.getList()
            } else {
              notice(res.data.message)
            }
            this.grloading = false
          })
        }
      } else if (this.activeName === '2') {
        // 责任区计划总结
        // 新建
        if (this.edit === '') {
          server.post(`/zrqjhzjController/savePlan`, {
            type: this.sum === 3 ? 3 : 4,
            planType: this.sum === 3 ? this.plan : this.sumplan,
            schoolYear: this.year,
            semester: this.semester,
            title: this.form.rename,
            content: '',
            attachmentId: this.attachmentId,
            areaId: this.zrarea
          })
          .then(res => {
            if (res.data.code === 1) {
              success(res.data.message)
              this.sumVisible = false
              this.getList()
            } else {
              notice(res.data.message)
            }
          })
        } else {
          // 编辑
          server.post(`/zrqjhzjController/editPlan`, {
            type: this.itemInfo.type,
            planType: this.sum === 3 ? this.plan : this.sumplan,
            schoolYear: this.year,
            semester: this.semester,
            title: this.form.rename,
            content: this.formLabelAlign.content,
            attachmentId: this.attachmentId,
            areaId: this.zrarea,
            planId: this.id

          })
          .then(res => {
            if (res.data.code === 1) {
              success(res.data.message)
              this.sumVisible = false
              this.getList()
            } else {
              notice(res.data.message)
            }
          })
        }
      } else if (this.activeName === '3') {
        // 督导室计划总结
        // 新建
        if (this.edit === '') {
          server.post(`/ddsjhzjController/savePlan`, {
            type: this.sum === 5 ? 5 : 6,
            planType: this.sum === 5 ? this.plan : this.sumplan,
            schoolYear: this.year,
            semester: this.semester,
            title: this.form.rename,
            content: '',
            attachmentId: this.attachmentId
          })
          .then(res => {
            if (res.data.code === 1) {
              success(res.data.message)
              this.ddRoomVisible = false
              this.getList()
            } else {
              notice(res.data.message)
            }
          })
        } else {
          // 编辑
          server.post(`/ddsjhzjController/editPlan`, {
            type: this.itemInfo.type,
            planType: this.sum === 5 ? this.plan : this.sumplan,
            schoolYear: this.year,
            semester: this.semester,
            title: this.form.rename,
            content: this.formLabelAlign.content,
            attachmentId: this.attachmentId,
            planId: this.id
          })
          .then(res => {
            if (res.data.code === 1) {
              success(res.data.message)
              this.ddRoomVisible = false
              this.getList()
            } else {
              notice(res.data.message)
            }
          })
        }
      }
    },
    hide () {
      this.sumVisible = false
      this.planVisible = false
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getList()
    },
    beforeUpload (file, fileList) {
      return new Promise((resolve, reject) => {
        let arr = file.name.split('.')
        if (arr[arr.length - 1] === 'doc' || arr[arr.length - 1] === 'docx') {
          if (this.form.rename === '') {
            this.form.rename = file.name
          }
          this.fileList2 = fileList
          resolve()
        } else {
          this.fileList = []
          notice('请上传正确格式文件')
          reject(arr)
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.mlength = this.multipleSelection.length
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleRemove (file, fileList) {},
    handlePreview (file) {
    },
    handleClick () {
      this.currentPage = 1
      this.pageSize = 10
      this.planVisible = false
      this.sumVisible = false
      this.ddRoomVisible = false
      this.currentPage = 1
      this.value1 = ''
      this.radio = '1'
      if (this.activeName === '1' || '2') {
        this.getSchoolYear()
      }
      this.getList()
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 个人计划总结
          if (this.activeName === '1') {
            // 新建
            if (this.edit === '') {
              let para = {
                type: this.sum === 0 || this.sum === '' ? 1 : 2,
                planType: this.sum === 0 || this.sum === '' ? this.plan : this.sumplan,
                schoolYear: this.year,
                semester: this.semester,
                title: this.formLabelAlign.title,
                content: this.formLabelAlign.content,
                attachmentId: ''
              }
              server.post(`/grjhzjController/savePlan`, para)
              .then(res => {
                if (res.data.code === 1) {
                  success(res.data.message)
                  this.planVisible = false
                  this.getList()
                } else {
                  notice(res.data.message)
                }
              })
            } else {
              // 编辑
              server.post(`/grjhzjController/editPlan`, {
                type: this.itemInfo.type,
                planType: Number(this.radio),
                schoolYear: this.year,
                semester: this.semester,
                title: this.formLabelAlign.title,
                content: this.formLabelAlign.content,
                attachmentId: this.attachmentId,
                planId: this.id
              })
              .then(res => {
                if (res.data.code === 1) {
                  this.disflag = false
                  success(res.data.message)
                  this.planVisible = false
                  this.getList()
                } else {
                  notice(res.data.message)
                }
              })
            }
          } else if (this.activeName === '2') {
            // 责任区计划总结
            // 新建
            if (this.edit === '') {
              server.post(`/zrqjhzjController/savePlan`, {
                type: this.sum === 3 ? 3 : 4,
                planType: this.sum === 3 ? this.plan : this.sumplan,
                schoolYear: this.year,
                semester: this.semester,
                title: this.formLabelAlign.title,
                content: this.formLabelAlign.content,
                attachmentId: '',
                areaId: this.zrarea
              })
              .then(res => {
                if (res.data.code === 1) {
                  success(res.data.message)
                  this.sumVisible = false
                  this.getList()
                } else {
                  notice(res.data.message)
                }
              })
            } else {
              // 编辑
              server.post(`/zrqjhzjController/editPlan`, {
                type: this.itemInfo.type,
                planType: this.sum === 3 ? this.plan : this.sumplan,
                schoolYear: this.year,
                semester: this.semester,
                title: this.formLabelAlign.title,
                content: this.formLabelAlign.content,
                attachmentId: this.attachmentId,
                areaId: this.zrarea,
                planId: this.id

              })
              .then(res => {
                if (res.data.code === 1) {
                  this.disflag = false
                  success(res.data.message)
                  this.sumVisible = false
                  this.getList()
                } else {
                  notice(res.data.message)
                }
              })
            }
          } else if (this.activeName === '3') {
            // 督导室计划总结
            // 新建
            if (this.edit === '') {
              server.post(`/ddsjhzjController/savePlan`, {
                type: this.sum === 5 ? 5 : 6,
                planType: this.sum === 5 ? this.plan : this.sumplan,
                schoolYear: this.year,
                semester: this.semester,
                title: this.formLabelAlign.title,
                content: this.formLabelAlign.content,
                attachmentId: ''
              })
              .then(res => {
                if (res.data.code === 1) {
                  success(res.data.message)
                  this.ddRoomVisible = false
                  this.getList()
                } else {
                  notice(res.data.message)
                }
              })
            } else {
              console.log(this.edit)
              server.post(`/ddsjhzjController/editPlan`, {
                type: this.itemInfo.type,
                planType: this.edit !== 5 ? this.plan : this.sumplan,
                schoolYear: this.year,
                semester: this.semester,
                title: this.formLabelAlign.title,
                content: this.formLabelAlign.content,
                attachmentId: this.attachmentId,
                planId: this.id
              })
              .then(res => {
                if (res.data.code === 1) {
                  this.disflag = false
                  success(res.data.message)
                  this.ddRoomVisible = false
                  this.getList()
                } else {
                  notice(res.data.message)
                }
              })
            }
          }
        } else {
          return false
        }
      })
    },
    Submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.fileList2.length === 0) {
            notice('请先上传文件')
            return
          }
          if (this.form.rename !== this.fileList2[0].name && this.edit !== '' && this.fileList2 === this.fileList3) {
            if (this.activeName === '1') {
            // 个人计划总结
            // 编辑
              server.post(`/grjhzjController/editPlan`, {
                type: this.itemInfo.type,
                planType: Number(this.radio),
                schoolYear: this.year,
                semester: this.semester,
                title: this.form.rename,
                content: this.formLabelAlign.content,
                attachmentId: this.attachmentId,
                planId: this.id
              })
              .then(res => {
                if (res.data.code === 1) {
                  this.disflag = false
                  success(res.data.message)
                  this.planVisible = false
                  this.getList()
                } else {
                  notice(res.data.message)
                }
                this.grloading = false
              })
            } else if (this.activeName === '2') {
          // 责任区计划总结
          // 编辑
              server.post(`/zrqjhzjController/editPlan`, {
                type: this.itemInfo.type,
                planType: this.sum === 3 ? this.plan : this.sumplan,
                schoolYear: this.year,
                semester: this.semester,
                title: this.form.rename,
                content: this.formLabelAlign.content,
                attachmentId: this.attachmentId,
                areaId: this.zrarea,
                planId: this.id
              })
              .then(res => {
                if (res.data.code === 1) {
                  this.disflag = false
                  success(res.data.message)
                  this.sumVisible = false
                  this.getList()
                } else {
                  notice(res.data.message)
                }
              })
            } else if (this.activeName === '3') {
            // 督导室计划总结
              // 编辑
              server.post(`/ddsjhzjController/editPlan`, {
                type: this.itemInfo.type,
                planType: this.sum === 5 ? this.plan : this.sumplan,
                schoolYear: this.year,
                semester: this.semester,
                title: this.form.rename,
                content: this.formLabelAlign.content,
                attachmentId: this.attachmentId,
                planId: this.id
              })
              .then(res => {
                if (res.data.code === 1) {
                  this.disflag = false
                  success(res.data.message)
                  this.ddRoomVisible = false
                  this.getList()
                } else {
                  notice(res.data.message)
                }
              })
            }
          } else {
            if (this.activeName === '1') {
              this.grloading = true
              this.$refs.upload1.submit()
            } else if (this.activeName === '2') {
              this.$refs.upload2.submit()
            } else {
              this.$refs.upload3.submit()
            }
          }
        } else {
          return false
        }
      })
    },
    reset () {
      if (this.$refs.form1) {
        this.$refs.form1.resetFields()
      }
      if (this.$refs.form2) {
        this.$refs.form2.resetFields()
      }
      if (this.$refs.form3) {
        this.$refs.form3.resetFields()
      }
      if (this.$refs.formLabelAlign1) {
        this.$refs.formLabelAlign1.resetFields()
      }
      if (this.$refs.formLabelAlign2) {
        this.$refs.formLabelAlign2.resetFields()
      }
      if (this.$refs.formLabelAlign3) {
        this.$refs.formLabelAlign3.resetFields()
      }
    },
    clear () {
      if (this.$refs.form1) {
        this.$refs.form1.clearValidate()
      }
      if (this.$refs.form2) {
        this.$refs.form2.clearValidate()
      }
      if (this.$refs.form3) {
        this.$refs.form3.clearValidate()
      }
      if (this.$refs.formLabelAlign1) {
        this.$refs.formLabelAlign1.clearValidate()
      }
      if (this.$refs.formLabelAlign2) {
        this.$refs.formLabelAlign2.clearValidate()
      }
      if (this.$refs.formLabelAlign3) {
        this.$refs.formLabelAlign3.clearValidate()
      }
    },
    add () {
      this.edit = ''
      this.sum = 0
      this.plan = '1'
      this.sumplan = '1'
      this.disflag = false
      this.getSchoolYear()
      // this.year = this.schoolYear.schoolYear
      this.semester = String(this.schoolYear.semester)
      this.planVisible = true
      this.radio = '1'
      this.form.rename = ''
      this.formLabelAlign.title = ''
      this.formLabelAlign.content = ''
      this.fileList = []
    },
    sumdia () {
      this.disflag = false
      this.edit = ''
      this.getSchoolYear()
      this.sumplan = '1'
      // this.year = this.schoolYear.schoolYear
      this.semester = String(this.schoolYear.semester)
      this.sum = 1
      this.plan = '1'
      this.radio = '1'
      this.planVisible = true
      this.form.rename = ''
      this.formLabelAlign.title = ''
      this.formLabelAlign.content = ''
      this.fileList = []
    },
    resadd () {
      this.disflag = false
      this.edit = ''
      this.getSchoolYear()
      // this.year = this.schoolYear.schoolYear
      this.semester = String(this.schoolYear.semester)
      this.radio = '1'
      this.form.rename = ''
      this.formLabelAlign.title = ''
      this.formLabelAlign.content = ''
      this.sumVisible = true
      this.sum = 3
      this.plan = '1'
      this.sumplan = '1'
      this.fileList = []
    },
    ressum () {
      this.disflag = false
      this.plan = '1'
      this.sumplan = '1'
      this.edit = ''
      this.getSchoolYear()
      // this.year = this.schoolYear.schoolYear
      this.semester = String(this.schoolYear.semester)
      this.radio = '1'
      this.form.rename = ''
      this.formLabelAlign.title = ''
      this.formLabelAlign.content = ''
      this.sumVisible = true
      this.sum = 4
      this.fileList = []
    },
    ddAdd () {
      this.disflag = false
      this.plan = '1'
      this.sumplan = '1'
      this.edit = ''
      this.getSchoolYear()
      // this.year = this.schoolYear.schoolYear
      this.semester = String(this.schoolYear.semester)
      this.radio = '1'
      this.form.rename = ''
      this.formLabelAlign.title = ''
      this.formLabelAlign.content = ''
      this.sum = 5
      this.ddRoomVisible = true
      this.fileList = []
    },
    ddSum () {
      this.disflag = false
      this.plan = '1'
      this.sumplan = '1'
      this.edit = ''
      this.getSchoolYear()
      // this.year = this.schoolYear.schoolYear
      this.semester = String(this.schoolYear.semester)
      this.radio = '1'
      this.form.rename = ''
      this.formLabelAlign.title = ''
      this.formLabelAlign.content = ''
      this.sum = 6
      this.ddRoomVisible = true
      this.fileList = []
    },
    back () {
      if (this.activeName === '1') {
        this.planVisible = false
      } else if (this.activeName === '2') {
        this.sumVisible = false
      } else if (this.activeName === '3') {
        this.ddRoomVisible = false
      }
    },
    // 获取责任区
    getAreaList () {
      this.zrAreas = []
      server.get(`/zrqjhzjController/getAreaList?schoolYear=${this.year}`)
      .then(res => {
        if (res.data.code === 1) {
          if (res.data.result.length === 0) {
            this.zrAreas = []
            this.zrarea = '无数据'
          } else {
            res.data.result ? this.zrAreas = res.data.result : this.zrAreas = []
            let obj = {
              areaId: '',
              areaName: '全部'
            }
            if (this.zrAreas.length !== 0) {
              this.zrAreas.push(obj)
              this.zrarea = this.areaId
            }
          }
        }
      })
    },
    // 学年
    getSchoolYear () {
      this.schools = []
      if (this.activeName === '1') {
        // (个人计划)
        server.get(`/grjhzjController/getSchoolYear`)
        .then(async res => {
          if (res.data.code === 1) {
            if (res.data.result) {
              if (res.data.result.length) {
                let arr = [-5, -4, -3, -2, -1, 1]
                for (var i = 0; i < arr.length; i++) {
                  let m = String(Number(res.data.result[0]) + arr[i])
                  res.data.result.push(m)
                }
                for (var j = 0; j < res.data.result.length; j++) {
                  let obj = {}
                  obj.label = res.data.result[j] + '-' + (Number(res.data.result[j]) + 1) + '学年'
                  obj.value = res.data.result[j]
                  this.schools.push(obj)
                }
                this.year = this.schools[0].value
              } else {
                this.schools = []
              }
            } else {
              this.schools = []
            }
            await this.getUserList()
          } else {
            notice(res.data.message)
          }
        })
      } else if (this.activeName === '2') {
        // (责任区)
        server.get(`/zrqjhzjController/getSchoolYear`)
        .then(async res => {
          if (res.data.code === 1) {
            // 获取责任区
            await this.getAreaList()
            if (res.data.result) {
              if (res.data.result.length) {
                let arr = [-5, -4, -3, -2, -1, 1]
                for (var i = 0; i < arr.length; i++) {
                  let m = String(Number(res.data.result[0]) + arr[i])
                  res.data.result.push(m)
                }
                for (var j = 0; j < res.data.result.length; j++) {
                  let obj = {}
                  obj.label = res.data.result[j] + '-' + (Number(res.data.result[j]) + 1) + '学年'
                  obj.value = res.data.result[j]
                  this.schools.push(obj)
                }
                this.year = this.schools[0].value
              } else {
                this.schools = []
              }
            } else {
              this.schools = []
            }
          } else {
            notice(res.data.message)
          }
        })
      } else if (this.activeName === '3') {
        // (督导室计划总结)
        server.get(`/ddsjhzjController/getSchoolYear`)
        .then(res => {
          if (res.data.code === 1) {
            if (res.data.result) {
              if (res.data.result.length) {
                let arr = [-5, -4, -3, -2, -1, 1]
                for (var i = 0; i < arr.length; i++) {
                  let m = String(Number(res.data.result[0]) + arr[i])
                  res.data.result.push(m)
                }
                for (var j = 0; j < res.data.result.length; j++) {
                  let obj = {}
                  obj.label = res.data.result[j] + '-' + (Number(res.data.result[j]) + 1) + '学年'
                  obj.value = res.data.result[j]
                  this.schools.push(obj)
                }
                this.year = this.schools[0].value
              } else {
                this.schools = []
              }
            } else {
              this.schools = []
            }
          } else {
            notice(res.data.message)
          }
        })
      }
    },
    // 用户(个人计划)
    getUserList () {
      this.supervisors = []
      server.get(`/grjhzjController/getUserList?schoolYear=${this.year}`)
      .then(res => {
        if (res.data.code === 1) {
          if (!res.data.result) {
            let obj = {
              userId: this.userId,
              userName: this.userName
            }
            this.supervisors.push(obj)
          } else {
            res.data.result ? this.supervisors = res.data.result : this.supervisors = []
            let obj = {
              userId: '',
              userName: '全部'
            }
            this.supervisors.push(obj)
            if (this.supervisors.some(item => item.userId === this.user.id)) {
              this.value3 = this.supervisors.filter(item => item.userId === this.user.id)[0].userId
            } else {
              this.value3 = ''
            }
          }
        } else {
          notice(res.data.message)
        }
      })
    },
    // 获取列表
    getList () {
      this.tableloading = true
      setTimeout(() => {
        if (this.activeName === '1') {
        // (个人计划)
          server.get(`/grjhzjController/getPage?pageNo=${this.currentPage}&pageSize=${this.pageSize}&schoolYear=${this.year}&type=${this.value1}&selectUserId=${this.value3}`)
          .then(res => {
            if (res.data.code === 1) {
              this.totalCount = res.data.result.totalCount
              res.data.result.list ? this.tableData = res.data.result.list : this.tableData = []
            } else {
              notice(res.data.message)
            }
            this.tableloading = false
          })
        } else if (this.activeName === '2') {
          if (this.role === 4 && this.areaId === '') {
            this.zrarea = ''
          }
          // (责任区)
          server.get(`/zrqjhzjController/getPage?pageNo=${this.currentPage}&pageSize=${this.pageSize}&schoolYear=${this.year}&type=${this.value1}&areaId=${this.zrarea}`)
          .then(res => {
            if (res.data.code === 1) {
              this.totalCount = res.data.result.totalCount
              res.data.result.list ? this.tableData = res.data.result.list : this.tableData = []
            } else {
              notice(res.data.message)
            }
            this.tableloading = false
          })
        } else if (this.activeName === '3') {
          // (督导室)
          if (this.role === 4 && this.areaId === '') {
            this.zrarea = ''
          }
          server.get(`/ddsjhzjController/getPage?pageNo=${this.currentPage}&pageSize=${this.pageSize}&type=${this.value1}`)
          .then(res => {
            if (res.data.code === 1) {
              this.totalCount = res.data.result.totalCount
              res.data.result.list ? this.tableData = res.data.result.list : this.tableData = []
              if (this.tableData.length !== 0) {
                this.tableData.map(item => {
                  if (item.attachment) {
                    item.fileId = item.attachment.id
                  }
                })
              }
            } else {
              notice(res.data.message)
            }
            this.tableloading = false
          })
        }
      }, 1000)
    }
  },
  computed: {
    action () {
      const path = document.querySelector('#contextPath').value
      if (this.activeName === '1') {
        // 个人计划总结
        return `${path}/grjhzjController/uploadAttachment`
      } else if (this.activeName === '2') {
        // 责任区计划总结
        return `${path}/zrqjhzjController/uploadAttachment`
      } else if (this.activeName === '3') {
        // 督导室计划总结
        return `${path}/ddsjhzjController/uploadAttachment`
      }
    },
    ...mapGetters([
      'schoolYear',
      'user',
      'previewUrl',
      'rootUrl',
      'previewInterface',
      'leaderFlag',
      'areaId'
    ])
  },
  async created () {
    await this.getSchoolYear()
    // this.getUserList()
    this.tableloading = true
    if (sessionStorage.activeName !== '') {
      this.activeName = sessionStorage.activeName
      sessionStorage.activeName = ''
    }
    setTimeout(async () => {
      this.semester = String(this.schoolYear.semester)
      await this.getList()
      // this.getAreaList()
      this.role = this.user.userRole
      this.leader = this.leaderFlag
      this.userId = this.user.id
      this.userName = this.user.name
      if (this.role === 2 && this.leader) {
        this.zrarea = this.areaId
      } else {
        this.zrarea = ''
      }
    }, 500)
  },
  watch: {
    year () {
      if (this.activeName === '1') {
        this.getUserList()
      }
      if (this.activeName === '2') {
        this.getAreaList()
      }
    }
  }
}
</script>
<style lang="scss">
.plan-index {
  margin: 20px;
  padding: 20px;
  background: #fff;
  position: relative;


  .title-click {
    cursor: pointer;
    &:hover {
      color: #20A0FF;
    }
  }

  .el-button--text {
    padding: 0px;
  } 


  .dealedit {
    color: #20A0FF;
  }
  .deal {
    padding: 0px !important;
    color: #20A0FF;
  }
  .dealview {
    padding: 0px !important;
    color: #13CE66;   
  }
  .dealdelete {
    color: #FF4949;
    padding: 0px !important;   
  }
    &>.el-pagination   {
      margin-top: 20px;
      margin-right: 20px;
      text-align: right;
    }

  .newplan {
    width: 720px;
    height: calc(100vh - 50px);
    box-sizing: border-box;
    position: absolute;
    overflow-x: hidden;
    top: -20px;
    right: -20px;
    z-index: 100;
    padding: 20px;
    background: #F5F5F5;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.20);

    &>ul {
      padding-left: 10px;

      &>li {
        &>span {
          display: inline-block;
          width: 66px;
          text-align: right;
          margin-bottom: 15px;
          margin-left: 10px;
        }
        .el-radio {
          margin-left: 5px;
        }
        .el-select {
          width: 220px;
          margin-right: 10px;
          margin-bottom: 15px;
        }
        line-height: 44px;
        margin-bottom: 15px;
      }
    }

    .header {
      margin-bottom: 25px;

      &:after {
        display: block;
        content: '';
        clear: both;
        overflow: hidden;
      }
      &>p, &>i {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #333333;
        font-weight: bold;       
      }
      i {
        float: right;
        &:hover {
          cursor: pointer;
        }
      }
      p {
        float: left;
        width: 300px;
      }
    }
    .el-form {
      .el-textarea__inner {
        resize: none;
      }
    }
    .upload {
      padding-left: 11%;

      .el-form-item__content {
        margin-left: 0px !important;
      }
      .el-upload__tip {
        margin-left: 10px;
      }
      .el-form-item__error {
        margin-left: 10%;
      }
    }
  }

  &>p {
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #333333;
    margin-bottom: 20px;
  } 
  .person, .area, .super {
    .el-select>.el-input {
      width: 200px;
    }
    .el-select {
      margin-right: 10px;
    }
    .box {
      &>.el-button {
        float: left;
      }
      &>.choose {
        float: right;
        width: 900px;
        text-align: right;
      }
      &:after {
        display: block;
        content: '';
        clear: both;
        overflow: hidden;
      }      
    }
  }
  .el-table {
    margin-top: 20px;


    .el-button.is-disabled {
    color: #c0c4cc !important;
  }
  }

}
</style>

