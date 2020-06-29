import apiUrl from '../Global.js'
Vue.use(apiUrl);
var vmuserList = new Vue({
    el: '#userList',
    data:{
        userName:'',
        query:'',
    },
    created(){
        //自动加载indexs方法
        this.userList();
    },mounted(){
        //自动加载indexs方法
        //this.VerifyLogin();//登录验证
        this.userList();
    },
    methods: {
        userList:function () {
            var $ = layui.$;
            var that=this;
            this.$nextTick(function () {
                window.layui.use(['table','element'], function(){
                    var table = layui.table;
                    //第一个实例
                    table.render({
                        elem: '#userListTable'
                        ,height: 'full-10   '
                        ,loading:true
                        ,url:apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryUser.action' //数据接口
                        ,headers: {token:sessionStorage.getItem('token') ||'' }
                        ,method:'post'
                        ,page: true //开启分页
                        ,limits:[10,20,30,40]
                        ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                        ,contentType: 'application/json'
                        ,cols: [[ //表头
                            {type: 'checkbox', fixed: 'left'}
                            ,{field: 'userId', title: 'ID', width:80, sort: true, fixed: 'left'}
                            ,{field: 'userName', title: '用户名', width:80}
                            ,{field: 'email', title: '邮箱', width:80,}
                            ,{field: 'tel', title: '手机', width:80}
                            ,{field: 'schoolName', title: '学校', width: 150}
                            ,{field: 'stuNumber', title: '学号', width: 150,sort: true}
                            ,{field: 'realName', title: '真名', width: 100, }
                            ,{field: 'education', title: '学历', width: 80}
                            ,{field: 'jurisdiction', title: '权限', width: 80, sort: true}
                            ,{field: 'state', title: '状态', width: 80, sort: true}
                            ,{fixed: 'right', width: 170, align:'center', toolbar: '#barDemo'}
                        ]],
                        done: function(res, curr, count){

                            that.BackgroundLogin(res);  //后台是否登录回调
                        }
                        /*,cols: [[ //表头


                            ,{field: 'competitionId', title: 'ID', width:150, sort: true}
                            ,{field: 'competitionName', title: '竞赛标题', width:150}
                            ,{field: 'chargePersonId', title: '负责人', width:80,}
                            ,{field: 'competitionInfo', title: '竞赛信息', width:200}
                            ,{field: 'releaseTime', title: '生成时间', width: 150}
                            ,{field: 'CompetitionTime', title: '比赛时间', width: 150,sort: true}
                            ,{field: 'RegistrationTimeStart', title: '报名开始时间', width: 100, }
                            ,{field: 'RegistrationTimeEnd', title: '报名开始时间', width: 80}
                            ,{field: 'CheckUser', title: '是否审核报名信息', width: 80, sort: true}
                            ,{field: 'type', title: '类型', width: 80, sort: true}
                            ,{field: 'auditeason', title: '竞赛审核结果', width: 80, sort: true}
                            ,{field: 'state', title: '状态', width: 80, sort: true}
                        ]]*/
                    });

                });
            });

        },


    }

});


