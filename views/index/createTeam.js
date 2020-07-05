import apiUrl from '../Global.js'
Vue.use(apiUrl);
var vmuserList = new Vue({
    el: '#createTeam',
    data:{
        userId:'',
        userName:'',
        userEmail:'',
        userTel:'',
        teamName:'',
        teamUser:'',
        inviteMembers:'',
        loginMsg:'',
        jurisdiction:0,
        Invited:'',
        InvitedId:[],
    },
    created(){
        //自动加载indexs方法
        //this.userInfo();
    },mounted(){
        this.$nextTick(function () {
            //自动加载indexs方法
            this.VerifyLogin();//登录验证
            this.userInfo();
        })
    },
    methods: {
        userInfo:function () {
            /* var $ = layui.$;
             var that=this;
             this.$nextTick(function () {
                 window.layui.use(['table','element'], function(){
                     var table = layui.table;
                     //第一个实例


                 });
             });*/
            this.$nextTick(function () {
                window. layui.config({
                    base: '../views/index/'
                }).use(['element','laypage','jquery','menu'],function(){
                    var element = layui.element,
                        laypage = layui.laypage,
                        $ = layui.$,
                        menu = layui.menu;
                    element.init();
                    laypage.render({
                        elem: 'demo'
                        ,count: 70 //数据总数，从服务端得到
                    });
                    menu.init();
                    /* element.on('nav(filter1)', function(elem){
                         if(elem.attr("href")!=="javascript:;"){
                             that.VerifyLogin();//登录验证
                             top.location.href='/CurriculumDesign3_Front/login.html';
                             //$("#iframeMain").attr("src",elem.attr("href"));
                             console.log(elem)
                         }

                     });*/
                })

            });
            this.userId=sessionStorage.getItem('userId');
            this.userName=sessionStorage.getItem('userName');
            this.jurisdiction= sessionStorage.getItem('jurisdiction')
            var that=this
            let loading
            /*loading=layer.load(2, {
                shade: false,
                time: 60*1000
            });
            axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/.action',
                {
                    userId:this.userId,
                    limit:1,
                    page:1
                }, {
                    headers: {
                        token:sessionStorage.getItem('token') ||'',
                        //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                    },
                    'Content-Type':'application/json'
                })
                .then(response => {
                    layer.close(loading);
                    that.BackgroundLogin(response.data);
                    that.userEmail=response.data.data.email
                    that.userTel=response.data.data.tel

                })
                .catch(error => {
                    layer.close(loading);
                    layer.open({
                        title: '失败',
                        content:'服务器请求失败'
                    });
                });*/
        },
        inviteMember:function(){
            let loading
            var that=this;
            if(this.inviteMembers!==""){
                if(this.inviteMembers!==this.userId){
                    loading=layer.load(2, {
                        shade: false,
                        time: 60*1000
                    });
                    //console.log(user)
                    axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryUser.action',
                        {
                            userId:this.inviteMembers,
                            limit:1,
                            page:1,
                        }, {
                            headers: {
                                token:sessionStorage.getItem('token') ||'',
                                //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                            },
                            'Content-Type':'application/json'  //如果写成contentType会报错
                        })
                        .then(response => {
                            console.log(response.data);
                            layer.close(loading);
                            if(response.data.count>0){
                                that.Invited+="  "+response.data.data[0].userName;
                                that.InvitedId.push(response.data.data[0].userId)
                                console.log("Invited"+that.Invited)
                                console.log("InvitedId"+that.InvitedId)
                            }else{
                                layer.open({
                                    title: '提示',
                                    content: '用户不存在',
                                    yes: function(index, layero) {
                                        layer.close(index);
                                    },
                                });
                            }
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
                    layer.msg("不能邀请自己");
                }

            }else{
                layer.msg("请输入用户ID");
            }
        },
        createTeamClick:function(){
            let loading
            if(this.teamName!==""){
                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                //console.log(user)
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/createTeam.action',
                    {

                        teamName:this.teamName,
                        memberId:this.userId,
                    }, {
                        headers: {
                            token:sessionStorage.getItem('token') ||'',
                            //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                        },
                        'Content-Type':'application/json'  //如果写成contentType会报错
                    })
                    .then(response => {
                        layer.close(loading);
                        if(response.data.flag){
                            var teamId=response.data.teamId
                            console.log()
                            axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/inviteMembers.action',
                                {
                                    teamId:teamId,
                                    memberId:this.InvitedId,
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
                                        content: '队伍id：'+teamId+'\n'+response.data.msg,
                                        yes: function(index, layero) {
                                            //  location.reload();
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
                        }else{
                            layer.open({
                                title: '创建队伍失败',
                                content: response.data.msg,
                                yes: function(index, layero) {
                                    //  location.reload();
                                    layer.close(index);
                                },
                            });
                        }


                    })
                    .catch(error => {
                        layer.close(loading);
                        layer.open({
                            title: '失败',
                            content:'服务器请求失败'
                        });
                    });
            }
        }, Logout:function () {

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

        }

    }

});

