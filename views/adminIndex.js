import apiUrl from './Global.js'
Vue.use(apiUrl);
var vmAdminIndex = new Vue({
    el: '#adminIndex',
    data:{
        userName:'',
        userJurisdiction:'',
        query:'',
    },
    created(){
        this.userNameList();
    },mounted(){
        this.VerifyLogin();//登录验证
        this.userNameList();
    },
    methods: {
        userNameList:function () {
            this.userName= sessionStorage.getItem('userName')
            this.userJurisdiction= sessionStorage.getItem('jurisdiction')
            var $ = layui.$;
            var that=this;
            this.$nextTick(function () {
                window.layui.use(['table','element'], function(){
                    var table = layui.table;
                    var element = window.layui.element;
                    element.init();
                    element.on('nav(filter)', function(elem){
                        that.VerifyLogin();//登录验证
                        $("#iframeMain").attr("src",elem.attr("href"));
                    });
                    element.on('nav(filter1)', function(elem){
                        if(elem.attr("href")!=="javascript:;"){
                            that.VerifyLogin();//登录验证
                            $("#iframeMain").attr("src",elem.attr("href"));
                        }

                    });
                    //第一个实例


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
