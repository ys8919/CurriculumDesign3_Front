
import apiUrl from '../Global.js'
Vue.use(apiUrl);
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
            loading=layer.load(2, {
                shade: false,
                time: 60*1000
            });
            this.$nextTick(function () {
                var util;
                var element;
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

                    //示例
                    var endTime = new Date(that.data.registrationTimeEnd).getTime() //假设为结束日期
                        ,serverTime = new Date().getTime(); //假设为当前服务器时间，这里采用的是本地时间，实际使用一般是取服务端的

                    util.countdown(endTime, serverTime, function(date, serverTime, timer){
                        var str = date[0] + '天' + date[1] + '时' +  date[2] + '分' + date[3] + '秒';
                        layui.$('#countDown').html('距离比赛时间还有：'+ str);
                    });
                })
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
                    })
                    .catch(error => {
                        layer.close(loading);
                        layer.open({
                            title: '失败',
                            content:'服务器请求失败'
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
        CompetitionDetailsOnclick:function () {

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

            }

            }


    }

});

