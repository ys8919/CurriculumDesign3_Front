import apiUrl from '../Global.js'
Vue.use(apiUrl);
var table = layui.table;
var vmuserList = new Vue({
    el: '#AdminRegistrationManagementInterface',
    data:{
        userName:'',
        query:'',
    },
    created(){
        //自动加载indexs方法
        this.userList();
    },mounted(){
        //自动加载indexs方法
        this.VerifyLogin();//登录验证
        this.userList();
    },
    methods: {
        userList:function () {
            var $ = layui.$;
            var that=this;
            this.$nextTick(function () {
                window.layui.use(['table','element'], function(){

                    //第一个实例
                    table.render({
                        elem: '#AdminRegistrationManagement'
                        ,height: 'full-10   '
                        ,loading:true
                        ,url:apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryCompetitionVague.action' //数据接口
                        ,headers: {token:sessionStorage.getItem('token') ||'' }
                        ,where:{}
                        ,method:'post'
                        ,page: true //开启分页
                        ,id:'AdminRegistrationManagement'
                        ,limits:[10,20,30,40]
                        ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                        ,contentType: 'application/json'
                        ,cols: [[ //表头
                            {type: 'checkbox', fixed: 'left',align:'center'}
                            ,{field: 'competitionId', title: 'ID', width:150, sort: true,align:'center'}
                            ,{field: 'competitionName', title: '竞赛标题', width:150,align:'center'}
                            ,{field: 'chargePersonName', title: '负责人', width:80,align:'center'}
                            ,{field: 'competitionInfo', title: '竞赛信息', width:200,align:'center'}
                            ,{field: 'releaseTime', title: '生成时间', width: 150,align:'center',sort: true}
                            ,{field: 'competitionTime', title: '比赛时间', width: 150,sort: true,align:'center'}
                            ,{field: 'registrationTimeStart', title: '报名开始时间', width: 100,align:'center',sort: true }
                            ,{field: 'registrationTimeEnd', title: '报名开始时间', width: 80,align:'center',sort: true}
                            ,{field: 'checkUser', title: '是否审核报名信息', width: 80, sort: true,align:'center' ,
                                templet: function(d){
                                    //将数字转成字符模式显示
                                    return  that.CompetitionCheckUserInfo(d.checkUser)
                                }}
                            ,{field: 'type', title: '竞赛类型', width: 80, sort: true,align:'center', templet: function(d){
                                    //将数字转成字符模式显示
                                    return  that.CompetitionTypeInfo(d.type)
                                }}

                            ,{field: 'state', title: '状态', width: 120,align:'center', sort: true,
                                templet: function(d){
                                    //将数字转成字符模式显示
                                    return  that.CompetitionStatusInfo(d.state)
                                }}
                            ,{field: 'auditeason', title: '竞赛审核结果', width: 80, sort: true,align:'center'}
                            ,{fixed: 'right', width: 170, align:'center', toolbar: '#barDemo'}
                        ]],
                        done: function(res, curr, count){

                            that.BackgroundLogin(res);  //后台是否登录回调
                        }
                    });
                    table.on('tool(AdminRegistrationManagement)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
                        var data = obj.data; //获得当前行数据
                        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）

                        if(layEvent === 'competitionReviewState'){ //认证
                            layer.open({
                                type: 0,
                                id: 'Layer',
                                title: data.competitionName+' 的报名信息',
                                area: ['940px', '500px'],
                                shade: 0,
                                anim: -1,
                                content: '<div class="table" lay-filter="openTable"></div>'+
                                    '<script type="text/html" id="barDemoUser">\n' +
                               '    {{#  if('+data.type+'===1){ }}\n' +
                                    '   <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="kickOut">查看队员信息</a>\n' +
                                    '    {{#  } }}\n'+
                                '</script>' ,
                                success: function(layero, index) {
                                    var colsList = [
                                        [
                                            {field: 'registrationId', title: '报名ID', width:150, sort: true,align:'center'}
                                            ,{field: 'applicantId', title: '报名人/团队ID', width:200,align:'center'}
                                            ,{field: 'applicantName', title: '参赛名/队名', width:200,align:'center'}
                                            ,{field: 'registrationTime', title: '报名时间', width: 200,align:'center',sort: true}
                                            ,{fixed: 'right', align:'center', toolbar: '#barDemoUser'}
                                        ]
                                    ];

                                    table.render({
                                        elem: layero.find('.table'),
                                        id: 'Message'
                                        ,loading:true
                                        ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                                        ,url:apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryRegistration.action' //数据接口
                                        ,headers: {token:sessionStorage.getItem('token') ||'' }
                                        ,where: {competitionId: data.competitionId}
                                        ,method:'post'
                                        ,contentType: 'application/json'
                                        ,cols: colsList,
                                        //limit: 8,
                                        //page: true,
                                    });
                                    table.on('tool(openTable)', function(obj){
                                        var data = obj.data; //获得当前行数据
                                        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                                        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
                                        let loading
                                        // var that=this;
                                        if(layEvent === 'kickOut'){
                                            layer.close(index);
                                            layer.open({
                                                type: 0,
                                                id: 'Layer1',
                                                title: data.applicantId+' 的团队成员',
                                                area: ['940px', '500px'],
                                                shade: 0,
                                                anim: 1,
                                                content: '<div class="table"></div>' ,
                                                success: function(layero, index) {
                                                    var colsList = [
                                                        [
                                                            { field: 'userId', title: '队员id' },
                                                            { field: 'userName', title: '队员名字' },
                                                            { field: 'realName', title: '真名' },
                                                            { field: 'schoolName', title: '学校' },
                                                            { field: 'stuNumber', title: '学号' },
                                                            { field: 'education', title: '学历' },
                                                            { field: 'tel', title: '电话' },
                                                            { field: 'email', title: '邮箱' },
                                                        ]
                                                    ];
                                                    table.render({
                                                        elem: layero.find('.table'),
                                                        id: 'Message'
                                                        ,loading:true
                                                        ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                                                        ,url:apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryMembers.action' //数据接口
                                                        ,headers: {token:sessionStorage.getItem('token') ||'' }
                                                        ,where: {teamId: data.applicantId}
                                                        ,method:'post'
                                                        ,contentType: 'application/json'
                                                        ,cols: colsList,
                                                        //limit: 8,
                                                        //page: true,
                                                    });

                                                },
                                                yes: function(index, layero) {
                                                    layer.close(index);
                                                    location.reload();
                                                },
                                            });
                                        }
                                    })
                                    table.on('toolbar(.table)', function(obj){
                                        var checkStatus = table.checkStatus(obj.config.id);
                                        switch(obj.event){
                                            case 'add':
                                                layer.msg('此功能尚未启用');
                                                break;
                                            case 'delete':
                                                layer.msg('此功能尚未启用');
                                                break;
                                            case 'update':
                                                layer.msg('此功能尚未启用');
                                                break;
                                        };
                                    });
                                },
                                yes: function(index, layero) {
                                    layer.close(index);
                                    location.reload();
                                },
                            });
                        }   else if(layEvent === 'LAYTABLE_TIPS'){
                            layer.alert('Hi，头部工具栏扩展的右侧图标。');
                        }
                    });
                    table.on('toolbar(CompetitionReviewTableTest)', function(obj){
                        var checkStatus = table.checkStatus(obj.config.id);
                        switch(obj.event){
                            case 'add':
                                layer.msg('此功能尚未启用');
                                break;
                            case 'delete':
                                layer.msg('此功能尚未启用');
                                break;
                            case 'update':
                                layer.msg('此功能尚未启用');
                                break;
                        };
                    });

                });
            });

        },
        searchUser:function () {

            table.reload('AdminRegistrationManagement',{
                where: { //设定异步数据接口的额外参数，任意设
                    value:this.query,
                }
                , page: {
                    curr: 1 //重新从第 1 页开始
                }
            })
        }

    },



});


