import apiUrl from '../Global.js'
Vue.use(apiUrl);
var vmuserList = new Vue({
    el: '#competitionRelease',
    data:{
        userId:'',
        userName:'',
        checkUser:0,
        competitionInfo:'',
        competitionName:'',
        competitionTime:'',
        registrationTimeEnd:'',
        registrationTimeStart:'',
        type:0,
        loginMsg:'',
        jurisdiction:0,

    },
    created(){
        //自动加载indexs方法
        //this.userInfo();
    },mounted(){
        //自动加载indexs方法
        this.VerifyLogin();//登录验证
        this.userInfo();
    },
    methods: {
        userInfo:function () {
            this.userId=sessionStorage.getItem('userId');
            this.userName=sessionStorage.getItem('userName');
            this.jurisdiction= sessionStorage.getItem('jurisdiction')
            var that=this
            let loading
            this.$nextTick(function () {
                window. layui.config({
                    base: '../views/index/'
                }).use(['element','laypage','jquery','menu','form','laydate'],function(){
                    var element = layui.element,
                        laypage = layui.laypage,
                        $ = layui.$,
                        menu = layui.menu;
                    var form =layui.form
                    element.init();

                    form.render();
                    var laydate = layui.laydate;
                    var laydate1 = layui.laydate;
                    form.on('switch(checkbox1)', function(data){

                        if(data.elem.checked){
                            that.checkUser=1
                        }else if(!data.elem.checked){
                            that.checkUser=0
                        }

                    });
                    form.on('radio(radio1)', function(data){
                        that.type=data.value
                    });
                    //执行一个laydate实例
                    laydate.render({
                        elem: '#competitionTime' //指定元素
                        ,type: 'datetime'
                        ,format: 'yyyy-MM-dd HH:mm:ss' //可任意组合
                        ,range: `~` //或 range: '~' 来自定义分割字符
                        ,trigger: 'click'
                        ,done: function(value, date, endDate){
                            that.competitionTime=value
                        }
                    });

                    laydate1.render({
                        elem: '#registrationTime' //指定元素
                        ,type: 'datetime'
                        ,format: 'yyyy-MM-dd HH:mm:ss' //可任意组合
                        ,range: `~` //或 range: '~' 来自定义分割字符
                        ,trigger: 'click'
                        ,done: function(value, date, endDate){
                            var str=value.split('~');
                             that.registrationTimeEnd=str[1];
                             that.registrationTimeStart=str[0];
                        }
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

        },
        CompetitionReleaseInsert:function(){
            let loading
            console.log(this.competitionName)
            console.log(this.checkUser)
            console.log(this.competitionInfo)
            console.log(this.competitionTime)
            console.log(this.registrationTimeEnd.toString())
            console.log(this.registrationTimeStart)
            console.log(this.type)
            console.log(this.userId)
            if(this.competitionName!==""&&this.checkUser!==""&&this.competitionInfo!==""&&
                this.competitionTime!==""&&this.registrationTimeEnd!==""&&this.registrationTimeStart!==""&&this.type!==""){
                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                //console.log(user)
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/releaseCompetition.action',
                    {
                        competitionName:this.competitionName,
                        chargePersonId:this.userId,
                        competitionInfo:this.competitionInfo,
                        competitionTime:this.competitionTime,
                        registrationTimeStart:this.registrationTimeStart,
                        registrationTimeEnd:this.registrationTimeEnd,
                        checkUser:this.checkUser,
                        type:this.type,

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
                                layer.close(index);
                                window.location.href='myPostCompetition.html';
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

        }



    }

});


