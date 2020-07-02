import apiUrl from '../Global.js'
Vue.use(apiUrl);
var vmuserList = new Vue({
    el: '#registerUpdate',
    data:{
        userId:'',
        userName:'',
        userPasswd:'',
        userNewPasswd:'',
        userNewPasswd1:'',
        loginMsg:''

    },
    created(){
        //自动加载indexs方法
        //this.userInfo();
    },mounted(){
        //自动加载indexs方法
        //this.VerifyLogin();//登录验证
        this.userInfo();
    },
    methods: {
        userInfo:function () {
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
        },
        registerUpdate:function(){
            let loading
            if(this.userId!==""&&this.userName!==""&&this.userEmail!==""&&this.userTel!==""){
                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                //console.log(user)
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/modifyUserPassword.action',
                    {
                        userId:this.userId,
                        passwd:this.userPasswd,
                        newPasswd:this.userNewPasswd,
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
                            yes:function(index, layero) {
                                if(response.data.flag){
                                    sessionStorage.clear()
                                    top.location.href='../login.html';
                                }else{
                                    layer.close(index);
                                }
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
/**
 *表单认证
 */
var $ = layui.$;
layui.use('form', function(){
    var form = layui.form;
    form.verify({
        username: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                return '用户名不能有特殊字符';
            }
            if(/(^\_)|(\__)|(\_+$)/.test(value)){
                return '用户名首尾不能出现下划线\'_\'';
            }
            if(/^\d+\d+\d$/.test(value)){
                return '用户名不能全为数字';
            }
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        ,pass: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ]

        ,confirmPass:function(value, item){
            if($('input[name=userNewPasswd]').val() !== value){
                return '两次输入的密码不一致'
            }
        },

    });
});

window.layui.use('element', function(){
    var element =  window.layui.element;
    element.init();
    element.on('nav(bigData)',function (elem) {
        console.log(elem);
    });
});
