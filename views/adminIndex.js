import apiUrl from './Global.js'

var vmAdminIndex = new Vue({
    el: '#adminIndex',
    data:{
        userName:'',
        query:'',
    },
    created(){
        //自动加载indexs方法
        this.userNameList();
    },mounted(){
        //自动加载indexs方法
        this.userNameList();
    },
    methods: {
        userNameList:function () {
            this.userName= sessionStorage.getItem('userName')
            this.$nextTick(function () {
                window.layui.use(['table','element'], function(){
                    var table = layui.table;
                    var element = window.layui.element;
                    element.init();
                    //第一个实例
                    table.render({
                        elem: '#demo'
                        ,height: 'full-10   '
                        ,url:apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryCompetition.action' //数据接口
                        ,headers: {token:sessionStorage.getItem('token') ||'' }
                        ,method:'post'
                        ,page: true //开启分页
                        ,limits:[10,20,30,40]
                        ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                        ,contentType: 'application/json'
                        ,cols: [[ //表头
                            {type: 'checkbox', fixed: 'left'}
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
                            ,{fixed: 'right', width: 170, align:'center', toolbar: '#barDemo'}
                        ]],
                        done: function(res, curr, count){
                            //如果是异步请求数据方式，res即为你接口返回的信息。
                            //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                            if(('loginFlag' in res.data)){
                                layer.open({
                                    title: '提示',
                                    content: res.data.msg,
                                    yes: function(index, layero) {
                                        window.location.href='login.html';
                                    },
                                });
                                sessionStorage.clear()
                            }
                        }
                        /*,cols: [[ //表头
                            {field: 'userId', title: 'ID', width:80, sort: true, fixed: 'left'}
                            ,{field: 'userName', title: '用户名', width:80}
                            ,{field: 'email', title: '邮箱', width:80,}
                            ,{field: 'tel', title: '手机', width:80}
                            ,{field: 'schoolName', title: '学校', width: 150}
                            ,{field: 'stuNumber', title: '学号', width: 150,sort: true}
                            ,{field: 'realName', title: '真名', width: 100, }
                            ,{field: 'education', title: '学历', width: 80}
                            ,{field: 'jurisdiction', title: '权限', width: 80, sort: true}
                            ,{field: 'state', title: '状态', width: 80, sort: true}
                        ]]*/
                    });

                });
            });

        },
        Logout:function () {
            sessionStorage.clear()
            window.location.href='login.html';
        }
        /*indexOnclick: function() {
            let loading
            if(this.userId!==""&&this.password!==""){

                //console.log(user)
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/releaseCompetition.action',
                    {
                        userId:this.userId,
                        passwd:this.password,
                    }, {
                        headers: {
                            TOKEN:sessionStorage.getItem('token') ||'',
                            //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                        },
                        'Content-Type':'application/json'  //如果写成contentType会报错
                    })
                    .then(response => {
                        if(('loginFlag' in response.data)){
                            layer.open({
                                title: '提示',
                                content: response.data.msg,
                                yes: function(index, layero) {
                                    window.location.href='login.html';
                                },
                            });
                            sessionStorage.clear()
                        }else {
                            layer.open({
                                title: '提示',
                                content: response.data.msg
                            });
                        }
                        console.log(response.data);

                        console.log(sessionStorage.getItem('token'));
                    })
                    .catch(error => {
                        layer.open({
                            title: '失败',
                            content:'服务器请求失败'
                        });
                    });
            }


        },*/

    }

});

window.layui.use('element', function(){
    var element =  window.layui.element;
    element.init();
    element.on('nav(bigData)',function (elem) {
        console.log(elem);
    });
});
