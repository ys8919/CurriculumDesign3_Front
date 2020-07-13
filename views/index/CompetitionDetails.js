
import apiUrl from '../Global.js'
Vue.use(apiUrl);
var form=layui.form;
var vmindex = new Vue({
    el: '#CompetitionDetails',
    data:{
        userId:'',
        userName:'',
        data:'',
        count:0,
        limit:5,
        query:'',
        jurisdiction:1,
        competitionId:'',
        checkUser:0,
        competitionType:0,
        competitionState:0,
        userState:0,
        teamList:[],
        selectTeamId:'',
        HaveSignedUp:false,
    }, created(){
        //this.indexOnclick();
    },mounted(){
        this.VerifyLogin();//登录验证
        this.indexOnclick();
    },
    methods: {
        indexOnclick: function() {
            this.userId= sessionStorage.getItem('userId')
            this.userName= sessionStorage.getItem('userName')
            this.jurisdiction= sessionStorage.getItem('jurisdiction')
            this.userState=sessionStorage.getItem('userState')
            var url = window.location.href ;
            this.competitionId=url.split('?')[1].split('=')[1];
            var $ = layui.$;
            var that=this;
            let loading

            this.$nextTick(function () {
                var util;
                var element;

                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryCompetition.action',
                    {
                        limit:1,
                        page:1,
                        competitionId:that.competitionId
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
                        that.count=response.data.count
                        that.data=response.data.data[0]
                        that.checkUser=response.data.data[0].checkUser
                        that.competitionType=response.data.data[0].type
                        that.competitionState=response.data.data[0].state
                        console.log( that.data.state)
                    })
                    .catch(error => {
                        layer.close(loading);
                        layer.open({
                            title: '失败',
                            content:'服务器请求失败'
                        });
                    });
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryIsJoinCompetition.action', //查询是否已经报名
                    {

                        competitionId:that.competitionId,
                        userId:that.userId
                    }, {
                        headers: {
                            token:sessionStorage.getItem('token') ||'',
                            //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                        },
                        'Content-Type':'application/json'
                    })
                    .then(response => {
                        if(!response.data.flag){
                            that.HaveSignedUp=true;
                        }
                        console.log(that.HaveSignedUp)
                        console.log(response.data.flag)
                    })
                /* .catch(error => {
                     layer.open({
                         title: '失败',
                         content:'服务器请求失败'
                     });
                 });*/
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryIsTeamLearder.action', //我的团队
                    {
                        memberId:that.userId
                    }, {
                        headers: {
                            token:sessionStorage.getItem('token') ||'',
                            //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                        },
                        'Content-Type':'application/json'
                    })
                    .then(response => {
                       that.teamList=response.data.data;

                    })
                   /* .catch(error => {
                        layer.open({
                            title: '失败',
                            content:'服务器请求失败'
                        });
                    });*/

                window. layui.config({
                    base: '../views/index/'
                }).use(['element','laypage','jquery','menu','util'],function(){
                    var element = layui.element,
                        laypage = layui.laypage,
                        $ = layui.$,
                        menu = layui.menu;
                    element.init();
                    menu.init();
                    util = layui.util;
                    if(that.data.state===2){
                        console.log('serverTime')
                        var endTime = new Date(that.data.registrationTimeStart).getTime() //假设为结束日期
                            ,serverTime = new Date().getTime(); //假设为当前服务器时间，这里采用的是本地时间，实际使用一般是取服务端的

                        util.countdown(endTime, serverTime, function(date, serverTime, timer){
                            var str = date[0] + '天' + date[1] + '时' +  date[2] + '分' + date[3] + '秒';
                            //console.log('serverTime:'+str)
                            layui.$('#countDown').html('距离报名时间还有：'+ str);
                        });
                    }else if(that.data.state===5){
                        var str=that.data.competitionTime.split('~');
                        var competitionStartTime=str[0]
                        console.log('serverTime')
                        var endTime = new Date(competitionStartTime).getTime() //假设为结束日期
                            ,serverTime = new Date().getTime(); //假设为当前服务器时间，这里采用的是本地时间，实际使用一般是取服务端的

                        var endTime1 = new Date(that.data.registrationTimeEnd).getTime() //假设为结束日期
                            ,serverTime1 = new Date().getTime(); //假设为当前服务器时间，这里采用的是本地时间，实际使用一般是取服务端的

                        util.countdown(endTime, serverTime, function(date, serverTime, timer){
                            var str = date[0] + '天' + date[1] + '时' +  date[2] + '分' + date[3] + '秒';
                            //console.log('serverTime:'+str)
                            layui.$('#countDown1').html('距离比赛时间还有：'+ str);
                        });
                        util.countdown(endTime1, serverTime1, function(date, serverTime, timer){
                            var str = date[0] + '天' + date[1] + '时' +  date[2] + '分' + date[3] + '秒';
                            layui.$('#countDown').html('距离报名结束时间还有：'+ str);
                        });
                    }
                    //示例

                })
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
        CompetitionDetailsOnclick:function () {
            var that=this;
            let loading
            if(this.competitionType===0){
                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/registration.action',
                    {
                        applicantId:this.userId,
                        competitionId:this.competitionId,
                        checkUser:this.checkUser,
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
                                location.reload();
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
            }else if(this.competitionType===1){
                var teamVal=''
                that.teamList.forEach(item =>{
                    teamVal+='<option value="'+item.teamId+'">'+item.teamName+'</option>'

                })

                layer.open({
                    title: '提示',
                    area: ['500px', '300px'],
                    btn: ['确定', '创建团队'],
                    btnAlign: 'c',
                     content: '<div class="layui-form-item layui-form ">' +
                '<label class="layui-form-label">选择团队</label>' +
                '<div class="layui-input-block">' +
                '<select name="range" id="range" lay-filter="selectTeam">' +
                '<option value="">请选择</option>' +
                         teamVal+
                /*'<option value=""></option>' +*/
                '</select>' +
                '</div>' +
                '</div>'
                    ,success: function(index, layero) {
                        window. layui.config({
                            base: '../views/index/'
                        }).use(['form'],function(){
                            var form=layui.form;
                            form.render();
                            form.on('select(selectTeam)', function(data){
                                console.log(data.value); //得到被选中的值
                                that.selectTeamId=data.value
                            });
                        })

                    },
                    yes: function(index, layero) {

                        axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/registration.action',
                            {
                                applicantId:that.selectTeamId,
                                competitionId:that.competitionId,
                                checkUser:that.checkUser,
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
                                    title: '团队报名',
                                    content: response.data.msg,
                                    yes: function(index, layero) {
                                        location.reload();
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
                        window.location.href='/CurriculumDesign3_Front/index/createTeam.html';
                        layer.close(index);
                    },
                });


            }

            }


    }

});

