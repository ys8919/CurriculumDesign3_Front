import apiUrl from '../Global.js'
Vue.use(apiUrl);
var vmuserList = new Vue({
    el: '#userInfo',
    data:{
        userId:'',
        userName:'',
        userEmail:'',
        userTel:'',
        loginMsg:''

    },
    created(){
        //自动加载indexs方法
        //this.userInfo();
    },mounted(){
        this.$nextTick(function () {
            //自动加载indexs方法
            //this.VerifyLogin();//登录验证
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
            var that=this
            let loading
            loading=layer.load(2, {
                shade: false,
                time: 60*1000
            });
            axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryUserMyself.action',
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
                    that.userEmail=response.data.data.email
                    that.userTel=response.data.data.tel

                })
                .catch(error => {
                    layer.close(loading);
                    layer.open({
                        title: '失败',
                        content:'服务器请求失败'
                    });
                });
        },
        updateUserInfo:function(){
            let loading
            if(this.userId!==""&&this.userName!==""&&this.userEmail!==""&&this.userTel!==""){
                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                //console.log(user)
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/modifyUser.action',
                    {
                        userId:this.userId,
                        userName:this.userName,
                        email:this.userEmail,
                        tel:this.userTel,
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


window.layui.use('element', function(){
    var element =  window.layui.element;
    element.init();
    element.on('nav(bigData)',function (elem) {
        console.log(elem);
    });
});
