
import apiUrl from './Global.js'

var vmindex = new Vue({
    el: '#index',
    data:{
        userId:'1001',
        password:'1234',

    },
    methods: {
        indexOnclick: function() {
            let loading
            if(this.userId!==""&&this.password!==""){

                //console.log(user)
                axios.post(apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/releaseCompetition.action',
                    {
                        userId:this.userId,
                        passwd:this.password,
                    }, {
                        headers: {
                            TOKEN:sessionStorage.getItem('token') ||'',
                            //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                        },
                        'Content-Type':'application/json'  //如果写成contentType会报错
                    })
                    .then(response => {
                        if(('loginFlag' in response.data)){
                                layer.open({
                                    title: '提示',
                                    content: response.data.msg,
                                    yes: function(index, layero) {
                                        window.location.href='login.html';
                                    },
                                });
                            sessionStorage.clear()
                        }else {
                            layer.open({
                                title: '提示',
                                content: response.data.msg
                            });
                        }
                        console.log(response.data);

                        console.log(sessionStorage.getItem('token'));
                    })
                   .catch(error => {
                        layer.open({
                            title: '失败',
                            content:'服务器请求失败'
                        });
                    });
            }


        },

    }

});

