/* http://localhost:9110/elective/common/initPage */
const message = {
  "code": 1,
  "message": null,
  "result": {
    "rightList": [
      // 教务主任
      {
        "id": 1,
        "name": "选课管理",
        "resources": [{
            "name": "选课设置",
            "urlPath": "/dManage/activity",
          },
          {
            "name": "课程管理",
            "urlPath": "/dManage/lesson",
          }
        ]
      },
      {
        "name": "选课调整",
        "resources": [{
            "name": "选课调整",
            "urlPath": "/dAdjust/adjust",
          },
          {
            "name": "落选学生",
            "urlPath": "/dAdjust/failed",
          }
        ]
      },
      {
        "name": "选课状况",
        "resources": [{
            "name": "学生选课状况",
            "urlPath": "/dSituation/student",
          },
          {
            "name": "课程报名状况",
            "urlPath": "/dSituation/lesson",
          }
        ]
      },
      {
        "name": "选课结果",
        "resources": [{
            "name": "选课结果",
            "urlPath": "/dResult/result"
          },
          {
            "name": "选课记录",
            "urlPath": "/dResult/record",
          }
        ]
      },
      {
        "name": "基础设置",
        "resources": [{
          "name": "开课申请单",
          "urlPath": "/dBase/template",
        }]
      },
      // 学生
      {
        "name": "课程列表",
        "urlPath": '/s/lesson',
      },
      {
        "name": "选课结果",
        "urlPath": '/s/result',
      },
      {
        "name": "选课记录",
        "urlPath": '/s/record',
      },
      // 任课教师
      {
        "name": "开课申请",
        "resources": [{
          "name": "开课申请",
          "urlPath": "/tApply/apply",
        }]
      },
      {
        "name": "学生管理",
        "resources": [{
            "name": "录取学生",
            "urlPath": "/tManage/recruit",
          },
          {
            "name": "学生名单",
            "urlPath": "/tManage/student",
          },
          {
            "name": "学生名单",
            "urlPath": "/tManage/score",
          }
        ]
      },
      // 班主任
      {
        "name": "选课状况",
        "resources": [{
          "name": "不参加选课",
          "urlPath": "/htSituation/notjoin",
        },
        {
            "name": "选课不合格",
            "urlPath": "/htSituation/unqualified",
        },
        {
            "name": "已选课学生",
            "urlPath": "/htSituation/student",
        }]
      },
      {
        "name": "选课结果",
        "resources": [{
          "name": "选课结果",
          "urlPath": "/htResult/result",
        },
        {
            "name": "选课记录",
            "urlPath": "/htResult/record",
        }]
      }
    ],
    "loginUser": {
      "id": 90,
      "name": "开发管理员",
      "userFace": null,
      "companyId": 100004,
      "adminFlag": true,
      "companyName": "皇家开发学院",
      "userRole": [
        "dean"
      ],
      "rights": [
        "/dManage/activity",
        "/dSituation/student",
        "/dBase/template",
        "",
        "/dAdjust/adjust",
        "/dResult/result",
        "/dManage/lesson",
        "/dSituation/lesson",
        "/dAdjust/failed",
        "/dResult/record",
        "",
        "",
        "",
        ""
      ]
    }
  }
}

export default message

