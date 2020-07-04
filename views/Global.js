
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
                top.location.href='/CurriculumDesign3_Front/login.html';
            },
        });
    }

}

function BackgroundLogin (res) {
    if(('loginFlag' in res)){
        layer.open({
            title: '提示',
            content: res.msg,
            yes: function(index, layero) {
                top.location.href='/CurriculumDesign3_Front/login.html';
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

function CompetitionStatusInfo (res) {
    var info
    switch (res) {
        case 1:
            info='待审核'
            break;
        case 2:
            info='已审核'
            break;
        case 3:
            info='停止报名'
            break;
        case 999:
            info='比赛结束'
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
        case 4:
            info='申请发布竞赛'
            break;

    }
    return info
}
function CompetitionCheckUserInfo (res) {
    var info
    switch (res) {
        case 1:
            info='是'
            break;
        case 0:
            info='否'
            break;
    }
    return info
}
function CompetitionTypeInfo (res) {
    var info
    switch (res) {
        case 1:
            info='团队赛'
            break;
        case 0:
            info='个人赛'
            break;
    }
    return info
}

function teamTypeInfo (res) {
    var info
    switch (res) {
        case 1:
            info='团队成员'
            break;
        case 0:
            info='队长'
            break;
    }
    return info
}
function teamStateInfo (res) {
    var info
    switch (res) {
        case 1:
            info='待加入'
            break;
        case 2:
            info='已加入'
            break;
    }
    return info
}
function registrationStateInfo (res) {
    var info
    switch (res) {
        case 1:
            info='待审核'
            break;
        case 2:
            info='报名成功'
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
        Vue.prototype.CompetitionStatusInfo= (res) => CompetitionStatusInfo(res);
        Vue.prototype.CompetitionCheckUserInfo= (res) => CompetitionCheckUserInfo(res);
        Vue.prototype.CompetitionTypeInfo= (res) => CompetitionTypeInfo(res);
        Vue.prototype.teamTypeInfo= (res) => teamTypeInfo(res);
        Vue.prototype.teamStateInfo= (res) => teamStateInfo(res);
        Vue.prototype.registrationStateInfo= (res) => registrationStateInfo(res);
    }

}
