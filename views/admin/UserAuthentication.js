import apiUrl from '../Global.js'
Vue.use(apiUrl);
var vmuserList = new Vue({
    el: '#UserAuthentication',
    data:{
        userId:'',
        userName:'',
        userSchoolName:'',
        userStuNumber:'',
        userRealName:'',
        userEducation:'',
        userState:'',
        userStateInfo:'',
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
            this.userId=sessionStorage.getItem('userId');
            this.userName=sessionStorage.getItem('userName');
            var that=this
            let loading
            loading=layer.load(2, {
                shade: false,
                time: 60*1000
            });
            axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryUser.action',
                {
                    userId:this.userId,
                    limit:1,
                    page:1
                }, {
                    headers: {
                        TOKEN:sessionStorage.getItem('token') ||'',
                        //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                    },
                    'Content-Type':'application/json'
                })
                .then(response => {
                    layer.close(loading);
                    that.userSchoolName=response.data.data[0].schoolName
                    that.userStuNumber=response.data.data[0].stuNumber
                    that.userRealName=response.data.data[0].realName
                    that.userEducation=response.data.data[0].education
                    that.userState=response.data.data[0].state
                    switch (response.data.data[0].state) {
                        case 1:
                            that.userStateInfo='未认证'
                            break;
                        case 2:
                            that.userStateInfo='认证待审核'
                            break;
                        case 3:
                            that.userStateInfo='已审核'
                            break;
                        case 999:
                            that.userStateInfo='未通过认证'
                            break;
                    }

                    console.log(response.data.data[0].state)


                })
                .catch(error => {
                    layer.close(loading);
                    layer.open({
                        title: '失败',
                        content:'服务器请求失败'
                    });
                });
        },
        UserAuthenticationUpdate:function(){
            let loading
            if(this.userSchoolName!==""&&this.userStuNumber!==""&&this.userRealName!==""&&this.userEducation!==""){
                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                //console.log(user)
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/authentication.action',
                    {
                        userId:this.userId,
                        schoolName:this.userSchoolName,
                        stuNumber:this.userStuNumber,
                        realName:this.userRealName,
                        education:this.userEducation,
                    }, {
                        headers: {
                            TOKEN:sessionStorage.getItem('token') ||'',
                            //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                        },
                        'Content-Type':'application/json'  //如果写成contentType会报错
                    })
                    .then(response => {
                        layer.close(loading);
                        layer.open({
                            title: '提示',
                            content: response.data.msg,
                            /* yes: function(index, layero) {
                                 that.userId=response.data.userId
                                 that.password=''
                                 that.passwordReturn()
                                 layer.close(index);
                             },*/
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



    }

});


