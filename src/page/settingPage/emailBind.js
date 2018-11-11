import Axios from './../../utils/axiosInterceptors';


function unbindEmail() {
    return new Promise(function (resolve,reject) {

        Axios({
            method: 'GET',
            url: '/unbindMail',
        }).then(res=>{
            if(res.data.opResult === '0'){
                resolve();
            }else{
                reject();
            }
        }).catch(err=>{

        })
    })
}

export {unbindEmail}