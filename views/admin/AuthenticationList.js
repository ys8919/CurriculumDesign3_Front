import apiUrl from '../Global.js'
Vue.use(apiUrl);
var vmuserList = new Vue({
    el: '#AuthenticationList',
    data:{
        userName:'',
        query:'',
    },
    created(){
        //自动加载indexs方法
        this.userList();
    },mounted(){
        //自动加载indexs方法
        //this.VerifyLogin();//登录验证
        this.userList();
    },
    methods: {
        userList:function () {
            var $ = layui.$;
            var that=this;
            this.$nextTick(function () {
                window.layui.use(['table','element'], function(){
                    var table = layui.table;
                    //第一个实例
                    table.render({
                        elem: '#userListTable'
                        ,height: 'full-10   '
                        ,loading:true
                        ,url:apiUrl.apiUrl+'/CurriculumDesign3_Back/Controller/queryUser.action' //数据接口
                        ,headers: {token:sessionStorage.getItem('token') ||'' }
                        ,method:'post'
                        ,page: true //开启分页
                        ,limits:[10,20,30,40]
                        ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                        ,contentType: 'application/json'
                        ,cols: [[ //表头
                            {type: 'checkbox', fixed: 'left',align:'center'}
                            ,{field: 'userId', title: 'ID', width:120, sort: true, fixed: 'left',align:'center'}
                            ,{field: 'userName', title: '用户名', width:120,align:'center'}

                            ,{field: 'schoolName', title: '学校', width: 100,align:'center'}
                            ,{field: 'stuNumber', title: '学号', width: 100,sort: true,align:'center'}
                            ,{field: 'realName', title: '真名', width: 100,align:'center', }
                            ,{field: 'education', title: '学历', width: 80,align:'center'}

                            ,{field: 'state', title: '状态', width: 120,align:'center', sort: true,
                                templet: function(d){
                                    //将数字转成字符模式显示
                                    return  that.authenticationInfo(d.state)
                                }}
                            ,{fixed: 'right', width: 70, align:'center', toolbar: '#barDemo'}
                        ]],
                        done: function(res, curr, count){

                            that.BackgroundLogin(res);  //后台是否登录回调
                        }
                    });

                });
            });

        },


    }

});


