
import React, { Component } from 'react';
import {Switch,Route,HashRouter as Router ,Redirect} from 'react-router-dom';
import Axios from './../../utils/axiosInterceptors';
import emitter from '../../utils/events';
import {store} from "../../store";


import Maps from './../../page/bmap/maps'
import DemandList from './../../page/demandList/demandList'
import Nav from '../nav/nav';
import FromBox from './../fromBox/fromBox';
import Popup from './../popup/index';
import RouteNetwork from './../independenceComponents/routeNetwork';
import InfPanel from './../bmap/infPanel';
import UserCenterBox from './../userCenter/userCenterBox';
import Setting from './../settingPage/setting';

import AirPortGui from './../guide/airport'
import AirLineGui from './../guide/airline'
import InformationQuery from './../InformationQuery/InformationQuery';
import TimeDistribution from './../timeDistribution/timeDistribution';
import TimeDistributionAirport from './../timeDistribution/timeDistributionAirport';
import PublicOpinion from "./../publicOpinion/publicOpinion";
import TimelyCommunication from "./../timelyCommunication/timelyCommunication";
import AllAirport from './../InformationQuery/allAirport'
import AllAirline from './../InformationQuery/allAirline'
import AllCity from './../InformationQuery/allCity'
import Airport from './../InformationQuery/airport'
import Airline from './../InformationQuery/airline'
import City from './../InformationQuery/city'

import {assemblyAction as an} from "../../utils/assemblyAction";


export default class Index extends Component{
    constructor(props){
        super(props);
        this.state = {
            renderType:false, // 未加载完成初始化数据不能渲染
            openFrom:false, // 发布表单
            fromType:'',   // 0、发布航线表单，1、发布运力表单，2,、...
            fromMes:"",   // 传递进入表单数据
            popupType:0, //0:初始值,为空,1:航司运力编辑/响应;
            popupMes:'',
            // steps:store.getState().role.lastLoginTime == null ? 1 : ""
            steps:localStorage.getItem("lastLoginTime") === null ? 1 : ""
        };
        let role = JSON.parse(JSON.stringify(store.getState().role));
        role.lastLoginTime = "非第一次登陆";
        store.dispatch(an('ROLE',role));
    }
    componentDidMount(){
        this.initData();
    }
    componentWillUnmount() {
    }
    initData(){
        let airList = new Promise(function (resolve, reject) {
            let at = sessionStorage.getItem("airList");
            if(at !== null){
                try{
                    let atData = JSON.parse(at);
                    resolve(atData);
                }catch (e) {
                    console.log(e)
                }
            };
            Axios({
                method: 'post',
                url: '/airList',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            })
                .then((response) => {
                    resolve(response.data.mes);
                    sessionStorage.setItem("airList",JSON.stringify(response.data.mes))
                })
                .catch((error) => {
                        console.log(error);
                    }
                );
        });
        let cityAllList = new Promise(function (resolve, reject) {
            Axios({
                method: 'post',
                url: '/getCityAllList',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            })
                .then((response) => {
                    resolve(response.data.list);
                })
                .catch((error) => {
                        console.log(error);
                    }
                );
        });
        let airCompenyList = new Promise(function (resolve, reject) {
            Axios({
                method: 'post',
                url: '/airCompenyList',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            })
                .then((response) => {
                    resolve(response.data.list);
                })
                .catch((error) => {
                        console.log(error);
                    }
                );
        });
        let air = new Promise(function (resolve, reject) {
            Axios({
                method: 'post',
                url: '/getPlaneModel_list',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                        console.log(error);
                    }
                );
        });
        Promise.all([airList,cityAllList,airCompenyList,air]).then((results)=>{
        // Promise.all([cityAllList,airCompenyList,air]).then((results)=>{
            this.openFrom = emitter.addEventListener('openFrom',(value)=>{
                this.setState(function (a,b) {
                    return{
                        openFrom:value.openFrom,
                        fromType:value.fromType,
                        fromMes:value.fromMes
                    }
                });
            });
            this.openPopup = emitter.addEventListener('openPopup',(value)=>{
                this.setState(function (a,b) {
                    return{
                        popupType:value.popupType,
                        popupMes:value.popupMes
                    }
                });
            });
            store.dispatch(an('INITDATA',results));
            this.setState({
                renderType:true
            },()=>{
                // let transmit = {
                //     iata: 'ctu'
                // }
                // emitter.emit('openPopup', {
                //     popupType: 2,
                //     popupMes: {
                //         transmit,
                //     }
                // })
            });
        })

    }

    renderStep(){
        if(this.state.steps === ""){
            return("");
        };
        if(store.getState().role.role === "0"){
            return<AirLineGui changeStep={this.changeStep.bind(this)}/>;
        }
        if(store.getState().role.role === "1"){
            return<AirPortGui changeStep={this.changeStep.bind(this)}/>;
        }
    }
    changeStep(steps){
        this.setState({
            steps
        },()=>{
            localStorage.setItem("lastLoginTime","true");
        });
    }
    render(){
        if(!this.state.renderType){ return null}
        return(
            <div className='context'>
                {/*地图*/}
                <Maps/>
                {/*导航栏目*/}
                <Nav/>
                {/*需求列表*/}
                <DemandList />
                {/*各种表单容器*/}
                <FromBox openFrom={this.state.openFrom} fromType={this.state.fromType} fromMes={this.state.fromMes} />
                {/*图例模式控件*/}
                <RouteNetwork/>
                {/*展示机场信息数据*/}
                <InfPanel/>
                <Popup popupType={this.state.popupType} popupMes={this.state.popupMes}/>
                {/*交易洽谈*/}
                <TimelyCommunication/>
                {/*用户中心*/}
                {/*<UserCenterBox/>*/}
                {/*扩展页面*/}
                {
                    this.renderStep()
                }
                <Router>
                    <Switch>
                        <Route path="/userCenter" component={UserCenterBox}></Route>
                        <Route path="/setting/:type" component={Setting}></Route>
                        <Route path="/informationQuery" component={InformationQuery}></Route>
                        <Route path="/timeDistribution" component={TimeDistribution}></Route>
                        <Route path="/timeDistributionAirport/:iata" component={TimeDistributionAirport}></Route>
                        <Route path="/publicOpinion/:iata/:codeType" component={PublicOpinion}></Route>
                        <Route path="/allAirport" component={AllAirport}></Route>
                        <Route path="/allAirline" component={AllAirline}></Route>
                        <Route path="/allCity" component={AllCity}></Route>
                        <Route path="/airport" component={Airport}></Route>
                        <Route path="/airline" component={Airline}></Route>
                        <Route path="/city" component={City}></Route>
                        {/*<Redirect from="/" to="/"/>*/}
                    </Switch>
                </Router>
            </div>
        )
    }
};
