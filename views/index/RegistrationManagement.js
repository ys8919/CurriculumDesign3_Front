import apiUrl from '../Global.js'
Vue.use(apiUrl);
var table = layui.table;
var form=layui.form;
var element=layui.element;
var $ = layui.$;
const competitionDataList= new Map()
var vmuserList = new Vue({
    el: '#RegistrationManagement',
    data:{
        userId:'',
        userName:'',
        query:'',
        jurisdiction:0,
        selectCompetitionId:'',
        competitionData:[],
        timeState:0,
        competitionCheckUser:'',
        competitionType:'',
        competitionDataList:{},
    },
    created(){
        //自动加载indexs方法
        //this.userList();
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
            let loading


            this.$nextTick(function () {
                /*
                    * 查询竞赛信息
                    * */
                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryCompetitionVague.action',
                    {
                        limit:100,
                        page:1,
                        chargePersonId:that.userId,
                    }, {
                        headers: {
                            token:sessionStorage.getItem('token') ||'',
                            //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                        },
                        'Content-Type':'application/json'
                    })
                    .then(response => {
                        layer.close(loading);
                        //that.BackgroundLogin(response.data);
                        that.competitionData=response.data.data
                        response.data.data.forEach(item =>{
                            competitionDataList.set(item.competitionId,item)
                        })
                        form.render();
                    })
                    .catch(error => {
                        form.render();
                        layer.close(loading);
                        layer.open({
                            title: '失败',
                            content:'服务器请求失败'
                        });
                    });
                window.layui.use(['table','element','form'], function(){
                    //第一个实例
                    //form = window.layui.form;
                    form.render();
                    //element = window.layui.element;
                    element.init();
                    form.on('select(selectCompetition)', function(data){
                        form.render();
                        //console.log(data.value); //得到被选中的值
                        that.selectCompetitionId=data.value
                        that.competitionCheckUser=competitionDataList.get(data.value).checkUser
                        that.competitionType=competitionDataList.get(data.value).type
                        console.log(competitionDataList.get(data.value))
                        console.log( that.competitionCheckUser)
                        console.log( that.competitionType)
                        table.reload('userListTable',{
                            where: { //设定异步数据接口的额外参数，任意设
                                competitionId:that.selectCompetitionId
                            }
                            , page: {
                                curr: 1 //重新从第 1 页开始
                            }
                        })
                    });

                    table.render({
                        elem: '#userListTable'
                        ,height: 'full-10   '
                        ,loading:true
                        ,url:apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryRegistration.action' //数据接口
                        ,headers: {token:sessionStorage.getItem('token') ||'' }
                        ,where: { competitionId:'0'}
                        ,method:'post'
                        ,page: true //开启分页
                        ,id:'userListTable'
                        ,limits:[10,20,30,40]
                        ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                        ,contentType: 'application/json'
                        ,cols: [[ //表头
                            {type: 'checkbox', fixed: 'left',align:'center'}
                            ,{field: 'registrationId', title: 'ID', width:150, sort: true,align:'center'}
                            ,{field: 'applicantName', title: '参赛名/队名', width:150,align:'center'}
                            ,{field: 'registrationTime', title: '生成时间', width: 200,align:'center',sort: true}
                            ,{field: 'state', title: '状态', width: 120,align:'center', sort: true,
                                templet: function(d){
                                    //将数字转成字符模式显示
                                    return  that.registrationStateInfo(d.state)
                                }}
                            ,{field: 'auditeason', title: '报名审核结果', width: 200, sort: true,align:'center',
                                templet: function(d){//将数字转成字符模式显示
                                    if(that.competitionCheckUser===0){
                                        return  '审核通过'
                                    }else {
                                        return d.auditeason ||''
                                    }
                            }}
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

                        if(layEvent === 'detail'){ //查看团队
                            //do somehing
                            if(that.competitionType===0){
                                layer.msg('个人赛没有团队');
                            }else if(that.competitionType===1){
                                layer.open({
                                    type: 0,
                                    id: 'Layer',
                                    title: data.teamName+' 的团队成员',
                                    area: ['840px', '500px'],
                                    shade: 0,
                                    anim: -1,
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

                        } else if(layEvent === 'del'){ //审核
                            layer.msg('暂未开放');
                            /* layer.confirm('真的删除行么', function(index){
                                 //obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                                // layer.close(index);
                                 //向服务端发送删除指令

                             });*/
                        } else if(layEvent === 'edit'){ //查看团队
                            if(that.competitionCheckUser===0){
                                layer.msg('无需审核');
                            }else if(that.competitionCheckUser===1){
                                layer.open({
                                    title: '提示',
                                    content: '审核：'+data.applicantName,
                                    btn: ['通过', '不通过'],
                                    btnAlign: 'c',
                                    yes: function(index, layero) {
                                        layer.msg('通过');
                                        loading=layer.load(2, {
                                            shade: false,
                                            time: 60*1000
                                        });
                                        axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/registrationExamine.action',
                                            {
                                                registrationId:data.registrationId,
                                                auditeason:'审核通过',
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
                                            axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/registrationExamine.action',
                                                {
                                                    registrationId:data.registrationId,
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


                                        layer.close(index);
                                    },
                                });
                            }


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
        },
        onclickSelect:function () {
            console.log("222")
            form.render('select');
        }

    },



});


 $("#selectCompetition").on('click',function () {
     //console.log("11111")
     form.render('select');
 });
