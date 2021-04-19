$.ajaxPrefilter(function(options) {
    // 拼接字符串
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
        // 统一为有权限的接口设置headers的请求头       
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局统一挂载complete回调函数
    options.complete = function(res) {
        console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1、强制清空token
            localStorage.removeItem('token')
                // 2、强制跳转到登录页面
            location.href = '/login.html'
        }
    }
})