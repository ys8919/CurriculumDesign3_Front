import apiUrl from '../Global.js'
Vue.use(apiUrl);
var table = layui.table;
var vmuserList = new Vue({
    el: '#myPostCompetition',
    data:{
        userName:'',
        query:'',
        jurisdiction:0,
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
            this.jurisdiction= sessionStorage.getItem('jurisdiction')
            this.userName= sessionStorage.getItem('userName')
            var $ = layui.$;
            var that=this;
            this.$nextTick(function () {
                window.layui.use(['table','element'], function(){
                    //第一个实例
                    var element = window.layui.element;
                    element.init();
                    table.render({
                        elem: '#userListTable'
                        ,height: 'full-10   '
                        ,loading:true
                        ,url:apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryCompetitionVague.action' //数据接口
                        ,headers: {token:sessionStorage.getItem('token') ||'' }
                        ,where: {chargePersonId: sessionStorage.getItem('userId')}
                        ,method:'post'
                        ,page: true //开启分页
                        ,id:'userListTable'
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
                    table.on('tool(userListTableTest)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
                        var data = obj.data; //获得当前行数据
                        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）

                        if(layEvent === 'detail'){ //查看
                            //do somehing
                            layer.msg('暂未开放');
                        } else if(layEvent === 'del'){ //删除
                            layer.msg('暂未开放');
                            /* layer.confirm('真的删除行么', function(index){
                                 //obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                                // layer.close(index);
                                 //向服务端发送删除指令

                             });*/
                        } else if(layEvent === 'edit'){ //编辑
                            //do something
                            layer.msg('暂未开放');
                            //同步更新缓存对应的值
                            /* obj.update({
                                 username: '123'
                                 ,title: 'xxx'
                             });*/
                        } else if(layEvent === 'LAYTABLE_TIPS'){
                            layer.alert('Hi，头部工具栏扩展的右侧图标。');
                        }
                    });
                    table.on('toolbar(userListTableTest)', function(obj){
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
        Logout:function () {

            axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/logout.action',
                {
                }, {
                    headers: {
                        token:sessionStorage.getItem('token') ||'',
                        //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                    },
                    'Content-Type':'application/json'
                });
            sessionStorage.clear()
            window.location.href='/CurriculumDesign3_Front/login.html';

        },
        searchUser:function () {
            table.reload('userListTable',{
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


