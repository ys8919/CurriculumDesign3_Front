
import apiUrl from './Global.js'
Vue.use(apiUrl);
var vmindex = new Vue({
    el: '#index',
    data:{
        userName:'',
        data:[],
    }, created(){
        this.indexOnclick();
    },mounted(){
        this.VerifyLogin();//登录验证
        this.indexOnclick();
    },
    methods: {
        indexOnclick: function() {
            this.userName= sessionStorage.getItem('userName')
            var $ = layui.$;
            var that=this;
            this.$nextTick(function () {
                window. layui.config({
                    base: 'views/index/'
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

                var that=this
                let loading
                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryCompetitionVague.action',
                    {
                        limit:5,
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
                        that.data=response.data.data
                        console.log(that.data)
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

        }
    }

});

