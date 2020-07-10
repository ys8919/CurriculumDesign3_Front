import apiUrl from './Global.js'

var vmLogin = new Vue({
    el: '#login',
    data:{
        loginShow:true,
        registerShow:false,
        passwordShow:false,
        userId:'1002',
        password:'123456',
        registerUsername: '',
        registerPassword1: '',
        registerPassword2: '',
        registerEmail:'',
        registerTel:'',
        pwdUserId: '',
        pwdPassword1: '',
        pwdPassword2: '',
        pwdEmail:'',
        pwdTel:'',
        loginMsg:'',
        registerMsg:'',
        pwdMsg:'',
    },
    methods: {
        /**
         * 登录
         */
        loginOnclick: function() {
            let loading

            if(this.userId!==""&&this.password!==""){
                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                //console.log(user)
                var that =this
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/login.action',
                    {
                        userId:this.userId,
                        passwd:this.password,
                    }, {
                        'Content-Type':'application/json'  //如果写成contentType会报错
                    })
                    .then(response => {
                        layer.close(loading);
                        /*layer.open({
                            title: '提示',
                            content: response.data.msg
                        });

                         */
                        if (response.data.flag ) {
                            sessionStorage.token = response.data.token    //将返回的token储存在sessionStorage里面
                            sessionStorage.setItem('userId', response.data.userId)
                            sessionStorage.setItem('userName', response.data.userName)
                            sessionStorage.setItem('jurisdiction', response.data.jurisdiction)
                            sessionStorage.setItem('userState', response.data.state)
                            if(response.data.jurisdiction===3||response.data.jurisdiction===4){
                                window.location.href='adminIndex.html';
                            }else{
                                window.location.href='index.html';
                            }
                        }else{
                            that.loginMsg="用户名或密码错误"
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
        },
        /**
         * 注册
         */
        registerOnclick: function() {
            let loading
            if(this.registerUsername!==""&&this.registerPassword1!==""&&this.registerPassword2!==""&&this.registerEmail!==""&&this.registerTel!==""&&this.registerPassword1===this.registerPassword2){
                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                //console.log(user)
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/register.action',
                    {
                        userName:this.registerUsername,
                        passwd:this.registerPassword1,
                        email:this.registerEmail,
                        tel:this.registerTel,
                    }, {
                        'Content-Type':'application/json'  //如果写成contentType会报错
                    })
                    .then(response => {
                        layer.close(loading);
                        var that=this
                        layer.open({
                            title: '提示',
                            content: response.data.msg,
                            yes: function(index, layero) {
                                that.userId=response.data.userId
                                that.password=''
                                that.registerURLReturn()
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
        },
        /**
         * 修改密码
         */
        pwdOnclick: function() {
            let loading
            if(this.pwdUserId!==""&&this.pwdPassword1!==""&&this.pwdPassword2!==""&&this.pwdEmail!==""&&this.pwdTel!==""&&this.pwdPassword1===this.pwdPassword2){
                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                //console.log(user)
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/forgetPassword.action',
                    {
                        userId:this.pwdUserId,
                        passwd:this.pwdPassword1,
                        email:this.pwdEmail,
                        tel:this.pwdTel,
                    }, {
                        'Content-Type':'application/json'  //如果写成contentType会报错
                    })
                    .then(response => {
                        layer.close(loading);
                        layer.open({
                            title: '提示',
                            content: response.data.msg,
                            yes: function(index, layero) {
                                that.userId=response.data.userId
                                that.password=''
                                that.passwordReturn()
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
        },


        registerURLOnclick: function () {

            this.loginShow=false
            this.registerShow=true

        },
        registerURLReturn: function () {

            this.loginShow=true
            this.registerShow=false

        },

        passwordOnclick: function () {

            this.loginShow=false
            this.passwordShow=true

        },
        passwordReturn: function () {

            this.loginShow=true
            this.passwordShow=false

        },

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
            if($('input[name=registerPasswd]').val() !== value){
                return '两次输入的密码不一致'
            }
        },
        confirmPass1:function(value, item){
            if($('input[name=pwdPasswd]').val() !== value){
                return '两次输入的密码不一致'
            }
        },
    });
});
