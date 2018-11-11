import Axios from 'axios';

let open = false;
Axios.defaults.method = "post";
Axios.interceptors.request.use( (config)=> {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

Axios.interceptors.response.use(
    data => {
        if(data.headers.code === "false"){
            if(open === false){
                alert("登录失效，即将跳转到登录界面");
            }
            open = true;
            sessionStorage.removeItem("role");
            window.location.reload();
        }
        return data;
    },
    error => {
        return Promise.reject(error)
    }
);

export default Axios;
