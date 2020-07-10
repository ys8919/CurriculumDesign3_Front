import apiUrl from '../Global.js'
Vue.use(apiUrl);
var table = layui.table;
var vmuserList = new Vue({
    el: '#myTeam',
    data:{
        userName:'',
        userId:'',
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
            this.userId= sessionStorage.getItem('userId')
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
                        ,url:apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryJoinTeam.action' //数据接口
                        ,headers: {token:sessionStorage.getItem('token') ||'' }
                        ,where: {memberId: sessionStorage.getItem('userId')}
                        ,method:'post'
                        ,page: true //开启分页
                        ,id:'userListTable'
                        ,limits:[10,20,30,40]
                        ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                        ,contentType: 'application/json'
                        ,cols: [[ //表头
                            {type: 'checkbox', fixed: 'left',align:'center'}
                            ,{field: 'teamId', title: 'ID', width:150, sort: true,align:'center'}
                            ,{field: 'teamName', title: '团队名称', width:150,align:'center'}
                            ,{field: 'type', title: '团队位置', width: 150, sort: true,align:'center', templet: function(d){
                                    //将数字转成字符模式显示
                                    return  that.teamTypeInfo(d.type)
                                }}
                            ,{field: 'state', title: '状态', width: 120,align:'center', sort: true,
                                templet: function(d){
                                    //将数字转成字符模式显示
                                    return  that.teamStateInfo(d.state)
                                }}
                            ,{fixed: 'right', width: 300, align:'center', toolbar: '#barDemo'}
                        ]],
                        done: function(res, curr, count){

                            that.BackgroundLogin(res);  //后台是否登录回调
                        }
                    });
                    table.on('tool(userListTableTest)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
                        var data = obj.data; //获得当前行数据
                        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
                        let loading
                        var that=this;
                        if(layEvent === 'invitation'){ //邀请成员
                            layer.prompt({
                                formType: 2,
                                value: '',
                                title: '邀请成员',
                                area: ['200px', '50px'] //自定义文本域宽高
                            }, function(value, index, elem){
                                loading=layer.load(2, {
                                    shade: false,
                                    time: 60*1000
                                });

                                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/inviteMembers.action',
                                    {
                                        //memberId:{menber:value},
                                        memberId:[value],
                                        teamId:data.teamId
                                    }, {
                                        headers: {
                                            token:sessionStorage.getItem('token') ||'',
                                            //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                                        },
                                        'Content-Type':'application/json'  //如果写成contentType会报错
                                    })
                                    .then(response => {
                                        layer.close(loading);
                                        layer.open({
                                            title: '提示',
                                            content: response.data.msg,
                                            yes: function(index, layero) {
                                                table.reload('userListTable',{
                                                    where: { //设定异步数据接口的额外参数，任意设
                                                    }
                                                    , page: {
                                                        curr: 1 //重新从第 1 页开始
                                                    }
                                                })
                                                layer.close(index);
                                            },
                                        });
                                        console.log(response.data);
                                    })
                                    .catch(error => {
                                        layer.close(loading);
                                        layer.open({
                                            title: '失败',
                                            content:'服务器请求失败'
                                        });
                                    });
                                layer.close(index);
                            });
                        } else if(layEvent === 'del'){ //删除
                            layer.msg('暂未开放');
                            /* layer.confirm('真的删除行么', function(index){
                                 //obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                                // layer.close(index);
                                 //向服务端发送删除指令

                             });*/
                        } else if(layEvent === 'see'){ //查看成员
                            var that=that
                            layer.open({
                                type: 0,
                                id: 'Layer',
                                title: data.teamName+' 的团队成员',
                                area: ['1040px', '500px'],
                                shade: 0,
                                anim: -1,
                                content: '<div class="table" lay-filter="openTable"></div>' +
                                    '<script type="text/html" id="barDemoUser" >\n' +
                                    '    {{#  if('+data.type+' === 0 && d.joinTeamState===2 && d.type!=0){ }}\n' +
                                    '   <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="kickOut">踢出队员</a>\n' +
                                    '    {{#  } }}\n' +
                                    '    {{#  if(d.joinTeamState === 1){ }}\n' +
                                    '    <a class="layui-btn  layui-btn-xs layui-disabled" lay-event="" >此用户未加入</a>\n' +
                                    '    {{#  } }}\n' +
                                    '</script>' ,
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
                                            {field: 'type', title: '团队位置', width: 150, sort: true,align:'center', templet: function(d){
                                                //将数字转成字符模式显示
                                                //return  this.teamTypeInfo(d.teamIdentity)
                                                    switch (d.teamIdentity) {
                                                        case 1:
                                                            return '团队成员'
                                                            break;
                                                        case 0:
                                                            return '队长'
                                                            break;
                                                    }
                                            }},
                                            {fixed: 'right', align:'center', width: 200, toolbar: '#barDemoUser'},
                                        ]
                                    ];

                                    table.render({
                                        elem: layero.find('.table'),
                                        id: 'Message'
                                        ,loading:true,
                                        url:apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryMembers.action' //数据接口
                                        ,headers: {token:sessionStorage.getItem('token') ||'' }
                                        ,where: {teamId: data.teamId}
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
                                            loading=layer.load(2, {
                                                shade: false,
                                                time: 60*1000
                                            });

                                            axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/exitTeam.action',
                                                {

                                                    id:data.id,
                                                }, {
                                                    headers: {
                                                        token:sessionStorage.getItem('token') ||'',
                                                        //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                                                    },
                                                    'Content-Type':'application/json'  //如果写成contentType会报错
                                                })
                                                .then(response => {
                                                    layer.close(loading);
                                                    layer.open({
                                                        title: '提示',
                                                        content: response.data.msg,
                                                        yes: function(index, layero) {
                                                            obj.del();
                                                            layer.close(index);
                                                        },
                                                    });
                                                })
                                                .catch(error => {
                                                    layer.close(loading);
                                                    layer.open({
                                                        title: '失败',
                                                        content:'服务器请求失败'
                                                    });
                                                });
                                            layer.close(index);
                                        }
                                    })
                                },
                                yes: function(index, layero) {
                                    layer.close(index);
                                    location.reload();
                                },
                            });
                        }else if(layEvent === 'JoinTeam'){
                            axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/joinTeam.action',
                                {
                                    //memberId:{menber:value},
                                    id:data.id,
                                }, {
                                    headers: {
                                        token:sessionStorage.getItem('token') ||'',
                                        //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                                    },
                                    'Content-Type':'application/json'  //如果写成contentType会报错
                                })
                                .then(response => {
                                    layer.close(loading);
                                    layer.open({
                                        title: '提示',
                                        content: response.data.msg,
                                        yes: function(index, layero) {
                                            table.reload('userListTable',{
                                                where: { //设定异步数据接口的额外参数，任意设
                                                }
                                                , page: {
                                                    curr: 1 //重新从第 1 页开始
                                                }
                                            })
                                            layer.close(index);
                                        },
                                    });
                                    console.log(response.data);
                                })
                                .catch(error => {
                                    layer.close(loading);
                                    layer.open({
                                        title: '失败',
                                        content:'服务器请求失败'
                                    });
                                });
                        }
                       /* else if(layEvent === 'kickOut'){ //踢出队员
                            //do something
                            layer.msg('暂未开放');
                            /!* layer.confirm('真的删除行么', function(index){
                                 //obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                                // layer.close(index);
                                 //向服务端发送删除指令

                             });*!/
                        }*/
                        else if(layEvent === 'LAYTABLE_TIPS'){
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


