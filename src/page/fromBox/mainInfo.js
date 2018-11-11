import React,{Component} from 'react';
import {store} from './../../store/index';
import emitter from "../../utils/events";

import style from './../../static/css/from/mainInfo.scss';

// import MyReceiveScheme from './myReceiveScheme.js';
import Received from './received.js';

import CapacityPlan from './capacityPlan.js';
import FlightScheme from './flightScheme.js';

import PlanInfo from './planInfo.js';

import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;



export default class DetailMainInfo extends Component {
	constructor(props){
		super(props);
		this.state={
            collectType:0,
        }
        console.log(props)
	}
    

    judgeRole(){
        // 机场角色代码:1 如果是机场返回true,否则返回false;
        return this.props.role === '1' ? true : false;
    }
    judgeTab(){
        // 当前选项卡是否是'market' 是返回true,否则返回false;
        return this.props.tabType == 'market' ? true : false;
    }
    getTitle(){
        return this.judgeTab() ? this.props.mainInfo['market'].title : this.props.mainInfo['myDemand'].title
    }
    // tab1 内容文本 根据tabType来判断显示 
    getTabFirstName=()=>{
        return this.judgeTab() ? '他' : '';
    }
    // tab2 内容文本 根据role来判断显示
    getTabSecondName=()=>{
        if(this.judgeRole()){
            return this.judgeTab() ? '运力' : '需求';
        }else{
            return this.judgeTab() ? '需求' : '运力';
        }
    }
    getCollectIcon=()=>{
        // return '';
        return{
            __html: this.state.collectType == 0 ? '&#xe634;' : '&#xe637;'
        }
    }
    collecting=(id)=>{
        this.setState({
            collectType:!this.state.collectType
        })
    }
    // 需求下架处理事件
    outof=(id)=>{
    }
    // 标题节点
    titleFun=()=>{
        if(this.props.mainTitle){
            let { id , title , collectType , tabType} = this.props.mainTitle;
            let role=store.getState().role.role;
            let btn;

            if(tabType == 'mine'){
                btn = (
                    <span className={style['out-of']} onClick={this.outof.bind(this,id)}>{role == '1' ? '需求下架' : '运力下架'}</span>
                )
            }else{
                btn = (
                    <button onClick={this.collecting.bind(this, id)}>
                        <i className={'iconfont'} dangerouslySetInnerHTML={this.getCollectIcon()}></i>
                    </button>
                )
            }
            return (
                <div className={style['detail-title']}>
                    <div>
                        <h3>{title}</h3>
                        {/* 显示是否提交方案 */}
                        {/* {collectType == 0 ? (<span>我已提交方案</span>) : '' } */}
                    </div>
                    <div>
                        {/* 对话框按钮 */}
                        {/* <button>
                            <i className={'iconfont'}>&#xe602;</i>
                        </button> */}
                        {/* 按钮 市场->收藏按钮  我的->(需求/运力)下架按钮*/}
                        {btn}
                    </div>
                </div>
            )
        }else{
            return '';
        }
    }
    // TODO: 待优化
    // tab节点
    tabFun=()=>{
        let mainInfo = this.props.mainInfo , tab1 , tab2 ;

        if(this.judgeRole()){
            tab1 = this.judgeTab() ? 
                // 机场-市场-收到的方案 
                <Received type={1} tab={this.judgeTab()} rs={this.props.planList}/> :
                // 机场-我的-收到的方案
                <Received type={2} tab={this.judgeTab()} rs={this.props.planList}/>;
            tab2 = (<div>
                {
                    this.judgeTab() ?
                        <CapacityPlan scheme={this.props.demandPlans}/> : 
                        <FlightScheme scheme={this.props.demandPlans}/>
                }
                <PlanInfo info={this.props.planInfo}/>
            </div>)
            
        }else{
            tab1 = this.judgeTab() ?
                <Received type={3} tab={this.judgeTab()} rs={this.props.planList}/> : 
                <Received type={4} tab={this.judgeTab()} rs={this.props.planList}/>;
            tab2 = (<div>
                {
                    this.judgeTab() ? 
                        // 航司-市场-需求详情-飞行方案 
                        <FlightScheme scheme={this.props.demandPlans}/> : 
                        // 航司-我的-运力详情-飞行时刻
                        <CapacityPlan scheme={this.props.demandPlans}/>
                        
                }
                {/*该运/航线详细信息*/}
                <PlanInfo info={this.props.planInfo}/>
            </div>)
        }
        return {tab1 , tab2};
    }
    chatFun=()=>{
        if(this.props.mainTitle && this.props.mainTitle.isResponseDemand){
            return '';
        }else{
            let id = this.props.mainTitle ? this.props.mainTitle.id : null;
            return (
                <div className={style['detail-char']}>
                    <span onClick={this.respond.bind(this, id)}>
                        {this.props.role === '1' ? '我要洽谈' : '我有运力'}
                    </span>
                </div>
            )
        }
    }
    getUpdate(props){
        if (props.mainTitle){
            let collectType=props.mainTitle.collectType;
            this.setState(()=>{
                return {
                    collectType,
                }
            })
        }
    }
    componentWillMount(){
        this.getUpdate(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.getUpdate(nextProps);
    }
    componentDidMount(){
        let body=this.refs.body;
        let parent=body.parentNode.offsetHeight;
        let header=body.previousSibling.offsetHeight;
        let footer=body.nextElementSibling.offsetHeight;
        body.style.height = (parent-header-footer) + 'px';
    }
    respond(id){
        emitter.emit('openPopup',{
            popupType:1,
            popupMes:{
                transmit:{
                    id,
                }
            }
        })
    }
    render(){
        
        let tabs=this.tabFun();
        let title=this.titleFun();

        function callback(key) {
        }
        
    	return (
			<div className={style['main-detail-info']}>
                <div className={style['detail-title-con']}>
                    {title}
                </div>
                <div className={style['detail-body']} ref={'body'}>
                    <Tabs defaultActiveKey="2" onChange={callback}>
                        <TabPane tab={this.getTabFirstName() +"收到的方案"} key="1">
                            {/*他/我收到的方案*/}
                            {tabs.tab1}
                        </TabPane>
                        <TabPane tab={this.getTabSecondName() +'详情'} key="2">
                            {/*运力/需求详情*/}
                            {tabs.tab2}
                        </TabPane>
                    </Tabs>
                </div>
                {this.chatFun()}
            </div>
    	)
    }   
}