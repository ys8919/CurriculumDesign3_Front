import apiUrl from '../Global.js'
Vue.use(apiUrl);
var table = layui.table;
var vmuserList = new Vue({
    el: '#AuthenticationList',
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

                    //第一个实例
                    table.render({
                        elem: '#userListTable'
                        ,height: 'full-10   '
                        ,loading:true
                        ,url:apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/fuzzyQueryUser.action' //数据接口
                        ,headers: {token:sessionStorage.getItem('token') ||'' }
                        ,method:'post'
                        ,page: true //开启分页
                        ,id:'userListTable'
                        ,limits:[10,20,30,40]
                        ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                        ,contentType: 'application/json'
                        ,cols: [[ //表头
                            {type: 'checkbox', fixed: 'left',align:'center'}
                            ,{field: 'userId', title: 'ID', width:200, sort: true, fixed: 'left',align:'center'}
                            ,{field: 'userName', title: '用户名', width:200,align:'center'}
                            ,{field: 'schoolName', title: '学校', width: 200,align:'center'}
                            ,{field: 'stuNumber', title: '学号', width: 200,sort: true,align:'center'}
                            ,{field: 'realName', title: '真名', width: 200,align:'center', }
                            ,{field: 'education', title: '学历', width: 200,align:'center'}

                            ,{field: 'state', title: '状态', width: 200,align:'center', sort: true,
                                templet: function(d){
                                    //将数字转成字符模式显示
                                    return  that.authenticationInfo(d.state)
                                }}
                            ,{fixed: 'right', width: 150, align:'center', toolbar: '#barDemo'}
                        ]],
                        done: function(res, curr, count){

                            that.BackgroundLogin(res);  //后台是否登录回调
                        }
                    });

                    table.on('tool(userListTableTest)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
                        var data = obj.data; //获得当前行数据
                        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）

                        if(layEvent === 'Authentication'){ //认证
                            //do somehing
                            let loading
                            loading=layer.load(2, {
                                shade: false,
                                time: 60*1000
                            });
                            if(data.state===2){
                                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/userExamine.action',
                                    {
                                        userId:data.userId,
                                        state:3,
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
                            }else{
                                layer.msg('不允许操作');
                            }
                            //layer.msg('查看');
                        } else if(layEvent === 'noAuthentication'){ //取消认证
                            let loading
                            loading=layer.load(2, {
                                shade: false,
                                time: 60*1000
                            });
                            if(data.state===3){
                                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/userExamine.action',
                                    {
                                        userId:data.userId,
                                        state:1,
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
                            }else{
                                layer.msg('不允许操作');
                            }
                        }  else if(layEvent === 'LAYTABLE_TIPS'){
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


    }

});


