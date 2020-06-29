
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
                window.location.href='login.html';
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
                window.location.href='login.html';
            },
        });
        sessionStorage.clear()
    }

}
export default{
    apiUrl,
    install: function (Vue) {
        Vue.prototype.VerifyLogin = () => VerifyLogin();
        Vue.prototype.BackgroundLogin= (res) => BackgroundLogin(res);
    }

}
