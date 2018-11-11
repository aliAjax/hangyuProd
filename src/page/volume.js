import React, { Component } from 'react';
import {Route,HashRouter as Router } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import Loadable from "react-loadable";
import { message, Button } from 'antd';

import emitter from '../utils/events';
import {store} from "./../store/index"
import {assemblyAction as an} from "../utils/assemblyAction";
import {Loading} from "./../components/loading/loginTest"
import bg from './../static/img/login/bg.jpg';
import BrowserMatch from "../utils/getWindow";
import IeErr from './index/ieErr';

const Boxes = Loadable({
    loader: () =>import('./loginAndRegister/boxes'),
    loading: Loading,
});
const Index = Loadable({
    loader: () =>import('./index/index'),
    loading: Loading,
});


class Volume extends  Component{
     constructor(props){
         super(props);
         let role = null;
         if(sessionStorage.getItem("role") != null){
             role = JSON.parse(sessionStorage.getItem("role"));
         }
         store.dispatch(an('ROLE',role));
     }
    componentWillMount(){
        // let role = JSON.parse(sessionStorage.getItem("role"));
        // store.dispatch(an('ROLE',role));
        this.props.history.listen((location, action) => {
            // location is an object like window.location
        });
    }
    componentDidMount() {
        // online网络连接事件
        window.addEventListener("online",function() {
            window.location.reload();
        });
        // offline网络连接事件
        window.addEventListener("offline",function() {
            message.warning('网络断开连接');
        });

        // 组件装载完成以后声明一个自定义事件
        let off = null;
        window.onresize = ()=>{
            if(off != null){
                clearTimeout(off);
            }
            off = setTimeout(()=>{
                emitter.emit('changeWindow');
            },200);
        };
    }
    componentWillUnmount() {

    }
    componentWillReceiveProps(nextProps){

    }
    changeLink(props){
         let t = store.getState().role === null ? false : true;
         if(!t){
             window.location.href = "#/";
             return <Boxes {...props}/>;
         }else{
             return <Index {...props}/>;
         }
    }
    render(){
        return(<div className='context' style={{backgroundImage:"url("+bg+")",backgroundSize:"100% 100%"}} onClick={()=>{emitter.emit("closeFloatingLayer")}}>
            {
                BrowserMatch.browser === "IE" ? <IeErr/> :   <Router>
                    <Route path="/" render={this.changeLink.bind(this)}/>
                </Router>
            }
        </div>)
    }
}
export default hot(module)(Volume);
