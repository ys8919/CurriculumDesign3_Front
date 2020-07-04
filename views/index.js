
import apiUrl from './Global.js'
Vue.use(apiUrl);
var vmindex = new Vue({
    el: '#index',
    data:{
        userName:'',
        data:[],
        count:0,
        limit:5,
        query:'',
        jurisdiction:1,

    }, created(){
        //this.indexOnclick();
    },mounted(){
        this.VerifyLogin();//登录验证
        this.indexOnclick();
    },
    methods: {
        indexOnclick: function() {
            this.userName= sessionStorage.getItem('userName')
            this.jurisdiction= sessionStorage.getItem('jurisdiction')
            var $ = layui.$;
            var that=this;
            let loading
            loading=layer.load(2, {
                shade: false,
                time: 60*1000
            });
            this.$nextTick(function () {
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/fuzzyQueryByState.action',
                    {
                        limit:that.limit,
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
                        //that.BackgroundLogin(response.data);
                        that.count=response.data.count
                        that.data=response.data.data
                    })
                    .catch(error => {
                        layer.close(loading);
                        layer.open({
                            title: '失败',
                            content:'服务器请求失败'
                        });
                    });

                window. layui.config({
                    base: 'views/index/'
                }).use(['element','laypage','jquery','menu'],function(){
                   var element = layui.element,
                        laypage = layui.laypage,
                        $ = layui.$,
                        menu = layui.menu;
                    console.log('count:'+that.count)
                    laypage.render({
                        elem: 'demo'
                        ,count: that.count //数据总数，从服务端得到
                        ,limit:that.limit
                        ,jump: function(obj, first){
                            //obj包含了当前分页的所有参数，比如：
                            console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                            console.log(obj.limit); //得到每页显示的条数
                            axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/fuzzyQueryByState.action',
                                {
                                    limit:obj.limit,
                                    page:obj.curr
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
                                    that.data=response.data.data
                                    that.count=response.data.count
                                })
                                .catch(error => {
                                    layer.close(loading);
                                    layer.open({
                                        title: '失败',
                                        content:'服务器请求失败'
                                    });
                                });
                            //首次不执行
                            if(!first){
                                //do something
                            }
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
        btnInfo:function(res){
            console.log(res)
            window.location.href="index/CompetitionDetails.html?competitionId="+res;
        },
        searchUser:function () {
            var that=this;
            let loading
            loading=layer.load(2, {
                shade: false,
                time: 60*1000
            });
            axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/fuzzyQueryByState.action',
                {
                    limit:that.limit,
                    page:1,
                    value:this.query,
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
                    that.data=response.data.data
                    that.count=response.data.count
                })
                .catch(error => {
                    layer.close(loading);
                    layer.open({
                        title: '失败',
                        content:'服务器请求失败'
                    });
                });
        }
    }

});

