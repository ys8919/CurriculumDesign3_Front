
import apiUrl from './Global.js'

var vmLogin = new Vue({
    el: '#login',
    data:{
        loginShow:true,
        registerShow:false,
        passwordShow:false,
        userId:'1001',
        password:'1234',
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
        loginOnclick: function() {
            let loading
            if(this.userId!==""&&this.password!==""){
                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                //console.log(user)
                sendPost(this.userId,this.password);
            }
            function sendPost(username,password) {
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/login.action',
                    {
                        userId:username,
                        passwd:password,
                    }, {
                        'Content-Type':'application/json'  //如果写成contentType会报错
                    })
                    .then(response => {
                        layer.close(loading);
                        layer.open({
                            title: '提示',
                            content: response.data.msg
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

        registerOnclick: function() {
            let loading
            if(this.registerUsername!==""&&this.registerPassword1!==""&&this.registerPassword2!==""&&this.registerEmail!==""&&this.registerTel!==""){
                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                //console.log(user)
                sendPost1(this.registerUsername,this.registerPassword1,this.registerEmail,this.registerTel);
            }
            function sendPost1(username,password,Email,Tel) {
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/register.action',
                    {
                        userName:username,
                        passwd:password,
                        email:Email,
                        tel:Tel,
                    }, {
                        'Content-Type':'application/json'  //如果写成contentType会报错
                    })
                    .then(response => {
                        layer.close(loading);
                        layer.open({
                            title: '提示',
                            content: response.data.msg
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

        pwdOnclick: function() {
            let loading
            if(this.pwdUserId!==""&&this.pwdPassword1!==""&&this.pwdPassword2!==""&&this.pwdEmail!==""&&this.pwdTel!==""){
                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                //console.log(user)
                sendPost1(this.pwdUserId,this.pwdPassword1,this.pwdEmail,this.pwdTel);
            }
            function sendPost1(id,password,Email,Tel) {
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/login.action',
                    {
                        userId:id,
                        passwd:password,
                        email:Email,
                        tel:Tel,
                    }, {
                        'Content-Type':'application/json'  //如果写成contentType会报错
                    })
                    .then(response => {
                        layer.close(loading);
                        layer.open({
                            title: '提示',
                            content: response.data.msg
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

        }
    }

});

