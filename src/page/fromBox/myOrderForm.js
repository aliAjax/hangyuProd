import React, { Component } from 'react';
import Axios from "./../../utils/axiosInterceptors";
import emitter from "../../utils/events";
import { store } from './../../store/index';
import { Modal, Button } from 'antd';
import style from './../../static/css/from/itemDetailForm.scss';

import HeaderInfo from './headerInfo.js';
import Plan from './plan.js';
import Received from './received.js';
import PlanInfo from './planInfo.js';
import PayEarnestMoney from '../../components/payEarnestMoney/payEarnestMoney'

import MainInfo from './mainInfo.js';


import { Tabs } from 'antd';
import { inherits } from 'util';

const TabPane = Tabs.TabPane;

export default class MyOrderForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            outofId: '',
            role: store.getState().role.role,
            // 从上个组件传递过来
            tabType: props.fromMes.tabType, //tab类型
            transmit: null,

            collectType: 0,
            headerTitle: null,
            mainTitle: null,
            //页面请求
            planList: null,//收到的方案列表
            demandPlans: null,//方案列表
            planInfo: null,//方案详情

            loading: false,
            visible: false,
            showPayEarnestMoney: false,  // 支付意向金是否显示
            payData: {},  // 向支付意向金组件传递的数据
            demandId: '',  // 方案id
            isMarket: true,
            serIng: false,
            responseProgress:null,//响应进度
        };
    }
    componentWillMount() {  // 将要渲染
        this.getUpdate(this.props)
    }
    componentWillReceiveProps(nextProps) {  // Props发生改变
        let transmit = nextProps.fromMes.transmit;
        let tabType = nextProps.fromMes.tabType;
        this.setState(() => {
            return {
                transmit: transmit,
                tabType: tabType,
            }
        })
        this.getUpdate(nextProps)
    }
    componentDidMount() {
        let main = this.refs.main;
        let child = main.childNodes;
        let title = child[0];
        let body = child[1];
        let footer = child[2];
        body.style.height = main.offsetHeight - title.offsetHeight - (footer ? footer.offsetHeight : 0);
    }
    //三字码获取城市名
    getCityName = (code) => {
        let cityList = store.getState().cityList;
        let city = cityList.filter((value) => {
            return value.cityIcao == code
        })
        return city[0].cityName;
    }
    getAirlineType = (airlineType) => {
        let str;
        switch (Number(airlineType)) {
            case 0:
                str = '全服务航空';
                break;
            case 1:
                str = '低成本航空';
                break;
            case 2:
                str = '都接受';
                break;
            default:
                str = '未获取到数据'
                break;
        }
        return str;
    }
    getTimeRequirements = (timeRequirements) => {
        let str;
        switch (Number(timeRequirements)) {
            case 0:
                str = '白班';
                break;
            case 1:
                str = '晚班';
                break;
            case 2:
                str = '都接受';
                break;
            default:
                str = '未获取到数据'
                break;
        }
        return str;
    }
    findName = (dpt, pst, arrv) => {
        let cityList = store.getState().cityList;
        let arr = {};
        let city = cityList.filter((value) => {
            if (value.cityIcao == dpt) {
                arr.dptNm = value.cityName;
            } else if (value.cityIcao == pst) {
                arr.pstNm = value.cityName;
            } else if (value.cityIcao == arrv) {
                arr.arrvNm = value.cityName;
            }
        })
        return arr;
    }
    getUpdate = (props) => {
        let param = props.fromMes;
        if (param && param.transmit.id) {
            let main = this.getMain(param.transmit.id);
            this.setState({
                demandId: param.transmit.id,
            })
        }
    }
    upSort = () => {
        return function (obj1, obj2) {
            return Number(obj1.quotedPrice) > Number(obj2.quotedPrice) ? 1 : -1;
        }
    }
    // 获取数据
    getMain = (id) => {
        let _this = this;
        // 获取(我的-需求)详情
        // this.setState
        Axios({
            url: '/getResponseOfMineInfo',
            method: 'get',
            params: {
                demandId: id,
            },
        }).then((response) => {
            if (response.data.opResult === "0") {
                let data = response.data.obj;
                let collectId,
                    collectType, //是否收藏
                    headerTitle, //顶部标题
                    mainTitle, //主体标题
                    planList,//收到的方案列表
                    demandPlans, //方案
                    planInfo,//方案信息
                    contact,
                    payload;
                // 顶部基本信息
                this.setState({
                    responseProgress:data.responseProgress,
                    isMarket: data.employeeId !== store.getState().role.id
                });
                collectId = data.collectId;
                collectType = data.collectType;
                headerTitle = {
                    releasetime: data.releasetime,
                    browsingVolume: data.browsingVolume,
                    demandprogress: data.demandprogress,
                    recivedResponseCount: data.recivedResponseCount,
                }
                // 主体内容标题数据
                mainTitle = {
                    id: data.id,
                    collectId: data.collectId,
                    collectType: data.collectType,
                    title: data.title,
                    isResponseDemand: data.isResponseDemand,
                    isWithdrawResponse: data.isWithdrawResponse,//是否撤回响应 1-已撤回,0-未撤回
                    demandprogress: data.demandprogress,
                    closeReason: data.closeReason,
                    identifier: data.identifier,
                    releaseDemandAirport: data.releaseDemandAirport,//当前发布需求的机场三字码
                    targetPoint: data.targetPoint,//当前发布需求的意向航点机场三字码
                    closeReason: data.closeReason,//关闭原因
                }

                // 收到的方案列表
                // let expect = data.demandtype;//0:航线需求-机场,1:运力需求-航司,
                planList = data.planList;
                if (planList && planList.length) {
                    planList.map((plan) => {
                        plan.employeeId = data.employeeId;
                    })
                }

                // if (planList && planList.length) {
                // 	let arr1 = [], arr2 = [], result = [];
                // 	planList.map((plan) => {
                // 		if (plan.quoteType == '1') {//定补
                // 			arr1.push(plan);
                // 		} else if (plan.quoteType == '2') {//保底
                // 			arr2.push(plan)
                // 		}
                // 	})

                // 	arr1.sort(this.upSort())
                // 	arr2.sort(this.upSort())
                // 	if (expect == '0') {//机场
                // 		arr1.reverse()
                // 		arr2.reverse();
                // 		result.concat(arr1, arr2)
                // 	} else if (expect == '1') {
                // 		result = [
                // 			...arr2,
                // 			...arr1
                // 		]
                // 	}
                // 	planList = result;
                // }

                // 联系方式
                contact = data.isResponseDemand === 1 || this.state.isMarket == false ? [
                    { name: '联系人', value: data.contact },
                    { name: '联系电话', value: data.iHome },
                ] : null;
                // 需求详情

                if (_this.state.role === '1') {// 机场
                    if (_this.props.fromMes && this.state.isMarket) {// 机场-市场-运力详情-方案 (方案详情 后台返回数据是数组) 数据组装
                        let [demandPlan] = data.demandPlans;
                        let temp = {
                            subsidypolicy: data.subsidypolicy,
                            bottomSubsidyPrice: data.bottomSubsidyPrice,
                            fixedSubsidyPrice: data.fixedSubsidyPrice,
                            dptTime: data.dptTime,
                            arrvTime: data.arrvTime,
                            days: data.days,
                            ...demandPlan
                        }
                        demandPlans = [];
                        demandPlans.push(temp);

                        payload = {
                            id: null,
                            isMarket: this.state.isMarket,
                            sailingtime: data.sailingtime,
                            periodValidity: data.periodValidity,
                        }

                        // 机场-市场-运力详情-方案详细
                        planInfo = [
                            { name: '机型', value: data.aircrfttyp },
                            { name: '座位布局', value: data.seating },
                            { name: '运力始发', value: temp.dptNm },
                            { name: '航司类型', value: this.getAirlineType(data.airlineType) },
                            { name: '计划执行时间', value: data.sailingtime },
                            { name: '计划执行班次', value: data.performShift},
                            { name: '运力有效期', value: data.periodValidity },
                            { name: '其他说明', value: data.remark ? data.remark : '无' },
                        ]

                    } else { // 机场-我的
                        // 机场-我的-需求详情-方案列表
                        demandPlans = data.demandPlans;

                        payload = {
                            id: null,
                            isMarket: this.state.isMarket,
                            sailingtime: data.sailingtime,
                            periodValidity: data.periodValidity,
                        }
                        // 机场-我的-需求详情-详细信息
                        planInfo = [
                            { name: '航司要求', value: this.getAirlineType(data.airlineType) },//航司要求
                            { name: '机型', value: data.aircrfttyp },//机型
                            { name: '时刻要求', value: this.getTimeRequirements(data.timeRequirements) },//时刻要求
                            { name: '班期', value: data.days },//班期,
                            { name: '计划执行时间', value: data.sailingtime },//计划执行时间
                            { name: '计划执行班次', value: data.performShift},//执行班次
                            { name: '需求有效期', value: data.periodValidity, edit: true},//需求有效期
                            { name: '其他说明', value: data.remark ? data.remark : '无' }//其他说明
                        ];
                    }
                } else {// 航司
                    if (_this.props.fromMes && this.state.isMarket) {//市场
                        // 航司-市场-需求详情-方案列表
                        // let [demandPlan] = data.demandPlans;
                        // let temp = {
                        // 	airlineType:data.airlineType,
                        // 	...demandPlan
                        // }
                        // demandPlans = [];
                        // demandPlans.push(temp);
                        let releaseDemandAirport = data.releaseDemandAirport;
                        if (data.demandPlans) {
                            demandPlans = data.demandPlans.map((value, index) => {
                                return {
                                    ...value,
                                    releaseDemandAirport,
                                }
                            })
                        }
                        // releaseDemandAirport
                        // demandPlans = data.demandPlans
                        // 航司-市场-需求详情-详细信息
                        planInfo = [
                            { name: '航司要求', value: this.getAirlineType(data.airlineType) },//航司要求
                            { name: '机型', value: data.aircrfttyp },//机型
                            { name: '时刻要求', value: this.getTimeRequirements(data.timeRequirements) },//时刻要求
                            { name: '班期', value: data.days },//班期,
                            { name: '计划执行时间', value: data.sailingtime },//计划执行时间
                            { name: '计划执行班次', value: data.performShift },//执行班次
                            { name: '需求有效期', value: data.periodValidity },//需求有效期
                            { name: '其他说明', value: data.remark ? data.remark : '无' }//其他说明
                        ];
                    } else {//我的
                        // 航司-我的-运力详情-方案
                        // 重新构建数据
                        let [demandPlan] = data.demandPlans;
                        let temp = {
                            subsidypolicy: data.subsidypolicy,
                            bottomSubsidyPrice: data.bottomSubsidyPrice,
                            fixedSubsidyPrice: data.fixedSubsidyPrice,
                            dptTime: data.dptTime,
                            arrvTime: data.arrvTime,
                            days: data.days,
                            ...demandPlan
                        }
                        demandPlans = [];
                        demandPlans.push(temp);

                        payload = {
                            id: null,
                            isMarket: this.state.isMarket,
                            sailingtime: data.sailingtime,
                            periodValidity: data.periodValidity,
                        }
                        // 航司-我的-运力详情-方案详细
                        planInfo = [
                            { name: '机型', value: data.aircrfttyp },
                            { name: '座位布局', value: data.seating },
                            { name: '运力始发', value: demandPlan.dptNm },
                            { name: '航司类型', value: this.getAirlineType(data.airlineType) },
                            { name: '计划执行时间', value: data.sailingtime },
                            { name: '计划执行班次', value: data.performShift },
                            { name: '运力有效期', value: data.periodValidity, edit: true},
                            { name: '其他说明', value: data.remark ? data.remark : '无' },
                        ]
                    }
                }
                _this.setState(() => {
                    return {
                        collectId: collectId,
                        collectType: collectType,
                        headerTitle: headerTitle,
                        mainTitle: mainTitle,
                        demandPlans: demandPlans,
                        planInfo: planInfo,
                        planList: planList,
                        contact: contact,
                        payload: payload,
                    }
                }, () => {

                })

            }

        })
    }
    // 响应 弹出层
    respond(transmit) {
        let popupType = 0;
        if (this.state.isMarket) {
            if (this.state.role === '1') {
                popupType = 2;
            } else {
                popupType = 1;
            }
        }
        emitter.emit('openPopup', {
            popupType: popupType,
            popupMes: {
                transmit,
            }
        })
    }
    payAndPush() {  // 支付意向金并发布
        Axios({
            method: 'post',
            url: '/selectSingleReleaseRoutefreezMargin',
            /* params:{  // 一起发送的URL参数
                 demandId: demandId,
                 employeeId: employeeId
             },*/
            // data: JSON.stringify(demand),
            dataType: 'json',
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        }).then((response) => {
            if (response.data.opResult === '0') {
                let payData = {};
                let { title } = this.state.mainTitle;
                payData.title = title;
                payData.intentionMoney = response.data.singleReleaseRoutefreezMargin;
                payData.demandId = this.state.demandId;
                this.setState({
                    showPayEarnestMoney: true,
                    payData: payData,
                })
            } else {
                alert('您的余额或剩余次数不足！');
            }
        })
    }
    closeMoneyFn() {  // 关闭意向金组件
        this.setState({
            showPayEarnestMoney: false,
        })
    }
    reEdit(item) {
        if (item.demandId) {
            let obj = {};
            let transmit = {};
            transmit.demandId = item.demandId;
            transmit.bianjiAgain = true;
            obj.openFrom = true;
            obj.fromType = 0;
            obj.fromMes = {
                transmit: transmit,
            };
            emitter.emit('openFrom', obj);
        } else {
            alert('出错了！')
        }
    }
    // tab1 内容文本 根据tabType来判断显示
    getTabFirstName = () => {
        return this.state.isMarket ? '他' : '';
    }
    // tab2 内容文本 根据role来判断显示
    getTabSecondName = () => {
        let bool = this.state.isMarket;
        if (this.state.role === '1') {
            return bool ? '运力' : '需求';
        } else {
            return bool ? '需求' : '运力';
        }
    }
    // ---maintitle---
    getCollectIcon = () => {
        // return '';
        return {
            __html: this.state.collectType == 0 ? '&#xe634;' : '&#xe637;'
        }
    }
    collecting = (id) => {
        let _this = this;
        if (Number(this.state.collectType) === 1) {//已收藏过 ->取消收藏
            Axios({
                url: 'delCollect',
                method: 'post',
                params: {
                    collectId: _this.state.collectId,//收藏id
                }
            }).then((response) => {
                if (response.data.opResult === '0') {
                    _this.setState({
                        collectType: !_this.state.collectType
                    })
                    alert('取消收藏')
                } else {
                    alert(response.data.msg)
                }
            })
        } else if (Number(this.state.collectType) === 0) {//为收藏过 ->添加收藏
            Axios({
                url: 'addCollect',
                method: 'post',
                params: {
                    demandIds: id//需求id
                }
            }).then((response) => {
                if (response.data.opResult === '0') {
                    _this.setState({
                        collectId: response.data.list[0].val,
                        collectType: !_this.state.collectType
                    })
                    alert('收藏成功');
                } else {
                    alert(response.data.msg)
                }
            })
        }
    }

    //点击确定
    handleOk = () => {
        this.setState({ loading: true });
        Axios({
            url: 'closeDemandById',
            method: 'post',
            params: {
                id: this.state.outofId,
                closeReason: '运力调整'
            }
        }).then((response) => {
            this.setState({ loading: false, visible: false });
            if (response.data.opResult === '0') {
                alert('需求下架成功')
            } else {
                alert(response.data.msg)
            }
        })
    }
    //取消
    handleCancel = () => {
        this.setState({ visible: false });
    }
    // 需求下架处理事件
    outof = (transmit) => {
        emitter.emit('openPopup', {
            popupType: 4,
            popupMes: {
                transmit,
            }
        })
        // this.setState({
        // 	visible: true,
        // 	outofId: id,
        // });
    }
    // onClick = { this.handleSchemeBtnClick.bind(this, transmit) }
    handleSchemeBtnClick(transmit) {
        let popupType = 0;
        if (store.getState().role.role === '1') {//机场
            popupType = 1;
        } else {
            popupType = 2
        }
        transmit.bianjiOrNot = true;  // 是否是点击“重新编辑”true：重新编辑，false：我要洽谈
        emitter.emit('openPopup', {
            popupType: popupType,
            popupMes: {
                transmit,
            }
        })
    }
    tabChange = (activeKey) => {

    }
    // 头部标题 及其按钮
    titleFun = () => {
        if (this.state.mainTitle) {
            let { id, title, collectId, collectType, tabType, demandprogress, isResponseDemand, identifier } = this.state.mainTitle;
            let role = store.getState().role.role;
            let btn;
            let transmit = {
                id, title, identifier
            }
            if (this.state.tabType == 'mine') {
                if (demandprogress === "3") {
                    btn = '需求已下架';
                } else if (demandprogress === "4" || demandprogress === "3") {
                    btn = '';
                } else if (demandprogress === "6") {
                    btn = '交易已完成';
                } else {
                    btn = (
                        <span className={style['out-of']} onClick={this.outof.bind(this, transmit)}>{role == '1' ? '需求下架' : '运力下架'}</span>
                    )
                }

            } else {
                btn = (
                    <button onClick={this.collecting.bind(this, id, collectId)}>
                        <i className={'iconfont'} dangerouslySetInnerHTML={this.getCollectIcon()}></i>
                    </button>
                )
            };
            let resText="";
            switch (this.state.responseProgress){
                case "0":
                case "1":
                case "3":
                case "5":
                case "6":
                    resText=<span>我已提交方案</span>;
                    break;
                case "4":
                    resText=<span style={{background:"#b4b4b4"}}>落选</span>;
                    break;
                default:
                    break;
            }
            return (
                <div className={style['detail-title']}>
                    <div>
                        <h3>{title}</h3>
                        {/* 显示是否提交方案 */}
                        {resText}
                    </div>
                    <div>
                        {/* 对话框按钮 TODO:未添加事件 */}
                        {/*{isResponseDemand === 1 ? <button><i className={'iconfont'}>&#xe602;</i></button> : ''}*/}
                        {/* 按钮 市场->收藏按钮  我的->(需求/运力)下架按钮*/}
                        {btn}
                    </div>
                </div>
            )
        } else {
            return '';
        }
    }
    // tab节点 收到的方案/需求详情
    tabFun = () => {
        let tab1, tab2;
        let type = 0, tabType = this.state.isMarket;
        if(this.state.isMarket){
            emitter.emit("addLines", {v: null,t: false});
        }
        if (this.state.role === '1') {
            type = this.state.isMarket ? 1 : 2;
        } else {
            type = this.state.isMarket ? 3 : 4;
        }
        tab1 = <Received type={type} tab={tabType} rs={this.state.planList} demandId={this.state.mainTitle} />;
        tab2 = (
            <div style={{ height: '100%', overflow: 'scroll' }}>
                <Plan tab={tabType} role={this.state.role} demandPlans={this.state.demandPlans} />
                <PlanInfo info={this.state.planInfo} payload={this.state.payload} contact={this.state.contact} isMarket={this.state.isMarket} />
            </div>
        )
        return { tab1, tab2 };
    }
    // 响应 我要洽谈/我有运力
    chatFun = () => {
        let mainTitle = this.state.mainTitle;
        let demandId = mainTitle ? mainTitle.id : null;
        let releaseDemandAirport = mainTitle ? mainTitle.releaseDemandAirport : null;//当前发布需求的机场三字码
        let targetPoint = mainTitle ? mainTitle.targetPoint : null;
        let closeReason = mainTitle ? mainTitle.closeReason : '';

        let demandPlans = this.state.demandPlans;
        let bool = demandPlans && demandPlans.length;

        let dpt = bool ? demandPlans[0].dpt : '';
        let dptNm = bool ? demandPlans[0].dptNm : '';
        let pst = bool ? demandPlans[0].pst : '';
        let pstNm = bool ? demandPlans[0].pstNm : '';
        let arrv = bool ? demandPlans[0].arrv : '';
        let arrvNm = bool ? demandPlans[0].arrvNm : '';
        let editType = 1;//编辑/响应 1:响应,2:重新编辑
        let transmit = {
            demandId,
            editType,
            dpt, dptNm, pst, pstNm, arrv, arrvNm,
            myAirport: dpt,
            releaseDemandAirport,
            targetPoint,
        }
        if (mainTitle && mainTitle.demandprogress === '3') {
            return (
                <div className={style['user-operation']}>
                    关闭原因:{closeReason}
                </div>
            )
        }
        if (this.state.isMarket) {
            // if (mainTitle && mainTitle.isResponseDemand === 0 ){
            // 	return (
            // 		<div className={style['user-operation']}>
            // 			<button className={style['btn-blue-plus']} onClick={this.respond.bind(this, transmit)}>
            // 				{this.state.role === '1' ? '我要洽谈' : '我有运力'}
            // 			</button>
            // 		</div>
            // 	)
            // }else{
            // 	return ''
            // }
            if ((mainTitle && mainTitle.isResponseDemand === 0) || (mainTitle && mainTitle.isResponseDemand === 1 && mainTitle.isWithdrawResponse === 1)) {//未响应过
                return (
                    <div className={style['user-operation']}>
                        <button className={style['btn-blue-plus']} onClick={this.respond.bind(this, transmit)}>
                            {this.state.role === '1' ? '我要洽谈' : '我有运力'}
                        </button>
                    </div>
                )
            } else {
                return '';
            }
        } else {
            if (mainTitle && mainTitle.demandprogress === '-1') {
                return (
                    <div className={style['user-operation']}>
                        <button className={style['btn-blue-plus']} onClick={this.payAndPush.bind(this)}>
                            {this.state.role === '1' ? '支付意向金并发布' : ''}
                        </button>
                        <button className={style['btn-gray']} onClick={this.reEdit.bind(this, transmit)}>
                            <i className={'iconfont'}>&#xe645;</i>重新编辑
                        </button>
                    </div>
                )
            } else {
                return ''
            }
        }
    }
    onTabClick = (obj) => {
    }
    render() {
        let tab = this.tabFun();
        return (
            <div className={style['item-detail-con']}>
                {
                    this.state.showPayEarnestMoney && <PayEarnestMoney
                        data={this.state.payData}
                        close={this.closeMoneyFn.bind(this)} />
                }
                <HeaderInfo headerTitle={this.state.headerTitle} />
                <div className={style['main-detail-info']} ref={'main'}>
                    <div className={style['detail-title-con']}>
                        {this.titleFun()}
                    </div>
                    <div className={style['detail-body']} ref='body'>
                        <Tabs defaultActiveKey="2" onChange={this.tabChange} onTabClick={this.onTabClick}>
                            <TabPane tab={this.getTabFirstName() + "收到的方案"} key="1">
                                {/*他/我收到的方案*/}
                                {tab.tab1}
                            </TabPane>
                            <TabPane tab={this.getTabSecondName() + '详情'} key="2">
                                {/*运力/需求详情*/}
                                {tab.tab2}
                            </TabPane>
                        </Tabs>
                    </div>
                    {this.chatFun()}
                </div>
            </div>
        )
    }
}