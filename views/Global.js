
//线上接口地址
//const apiUrl='http://192.168.1.106:8080';
//const apiUrl='http://134.175.222.24:8080';
const apiUrl='http://127.0.0.1:8080';
function VerifyLogin () {
    if(!('token' in  sessionStorage)){
        layer.open({
            title: '未登录',
            content:'请登录',
            closeBtn: 0,
            yes: function(index, layero) {
                top.location.href='login.html';
            },
        });
    }

}

function BackgroundLogin (res) {
    if(('loginFlag' in res.data)){
        layer.open({
            title: '提示',
            content: res.data.msg,
            yes: function(index, layero) {
                top.location.href='login.html';
            },
        });
        sessionStorage.clear()
    }

}

function authenticationInfo (res) {
    var info
    switch (res) {
        case 1:
            info='未认证'
            break;
        case 2:
            info='认证待审核'
            break;
        case 3:
            info='已审核'
            break;
        case 999:
            info='未通过认证'
            break;
    }
    return info
}

function jurisdictionInfo (res) {
    var info
    switch (res) {
        case 1:
            info='普通用户'
            break;
        case 2:
            info='竞赛发布者'
            break;
        case 3:
            info='管理员'
            break;

    }
    return info
}
export default{
    apiUrl,
    install: function (Vue) {
        Vue.prototype.VerifyLogin = () => VerifyLogin();
        Vue.prototype.BackgroundLogin= (res) => BackgroundLogin(res);
        Vue.prototype.authenticationInfo= (res) => authenticationInfo(res);
        Vue.prototype.jurisdictionInfo= (res) => jurisdictionInfo(res);
    }

}
