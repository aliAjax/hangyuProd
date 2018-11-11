import Axios from './../utils/axiosInterceptors';
import {conversions,conversionsCity,conversionsCompany} from './conversions'
import {assemblyAction as an} from "./assemblyAction";
import {store} from "../store";
/**
 * 获取机场数据
 *
 * */
function airList() {
    Axios({
        method: 'post',
        url: '/airList',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        }
    })
        .then((response) => {

        })
        .catch((error) => {
                console.log(error);
            }
        );
}

/**
 * 获取城市数据
 * */
function cityList() {
    Axios({
        method: 'post',
        url: '/getCityAllList',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        }
    })
        .then((response) => {
            // console.log(conversionsCity(response.data.list));
            store.dispatch(an('CITYLIST',conversionsCity(response.data.list)));
        })
        .catch((error) => {


            }
        );
}


export {cityList,airList}
