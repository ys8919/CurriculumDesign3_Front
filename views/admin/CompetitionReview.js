import apiUrl from '../Global.js'
Vue.use(apiUrl);
var table = layui.table;
var vmuserList = new Vue({
    el: '#CompetitionReview',
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
                        elem: '#CompetitionReviewTable'
                        ,height: 'full-10   '
                        ,loading:true
                        ,url:apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryCompetitionVague.action' //数据接口
                        ,headers: {token:sessionStorage.getItem('token') ||'' }
                        ,where:{}
                        ,method:'post'
                        ,page: true //开启分页
                        ,id:'CompetitionReviewTable'
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
                    table.on('tool(CompetitionReviewTableTest)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
                        var data = obj.data; //获得当前行数据
                        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）

                        if(layEvent === 'competitionReviewState'){ //认证
                            //do somehing
                            let loading

                            if(data.state===1){
                                layer.open({
                                    title: '提示',
                                    content: '审核：'+data.competitionName,
                                    btn: ['通过', '不通过'],
                                    btnAlign: 'c',
                                    yes: function(index, layero) {
                                        layer.msg('通过');
                                        loading=layer.load(2, {
                                            shade: false,
                                            time: 60*1000
                                        });
                                        axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/competitionExamine.action',
                                            {
                                                competitionId:data.competitionId,
                                                state:2,
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
                                                        table.reload('CompetitionReviewTable',{
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
                                    },
                                    btn2: function(index, layero) {
                                        layer.prompt({
                                            formType: 2,
                                            value: '',
                                            title: '审核不通过原因',
                                            area: ['300px', '100px'] //自定义文本域宽高
                                        }, function(value, index, elem){
                                            loading=layer.load(2, {
                                                shade: false,
                                                time: 60*1000
                                            });
                                            axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/competitionExamine.action',
                                                {
                                                    competitionId:data.competitionId,
                                                    auditeason:value,
                                                    state:999,
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
                                                            table.reload('CompetitionReviewTable',{
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


                                        layer.close(index);
                                    },
                                });


                            }else{
                                layer.msg('不允许操作');
                            }
                            //layer.msg('查看');
                        } else if(layEvent === 'noCompetitionReviewState'){ //取消认证
                            let loading

                            if(data.state===2){
                                layer.prompt({
                                    formType: 2,
                                    value: '',
                                    title: '撤销审核原因',
                                    area: ['300px', '100px'] //自定义文本域宽高
                                }, function(value, index, elem){
                                    loading=layer.load(2, {
                                        shade: false,
                                        time: 60*1000
                                    });
                                    axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/competitionExamine.action',
                                        {
                                            competitionId:data.competitionId,
                                            auditeason:value,
                                            state:999,
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
                                                    table.reload('CompetitionReviewTable',{
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
                            }else{
                                layer.msg('不允许操作');
                            }
                        }  else if(layEvent === 'LAYTABLE_TIPS'){
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
            table.reload('CompetitionReviewTable',{
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


