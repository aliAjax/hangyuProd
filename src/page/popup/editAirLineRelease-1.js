import React, { Component, Fragment } from 'react'
import Axios from "./../../utils/axiosInterceptors";
import { store } from "../../store";

import moment from 'moment';
import { Radio, TimePicker, Checkbox, Select, DatePicker, Menu, Dropdown, Icon, Modal, Button, Spin } from 'antd';

import style from './../../static/css/popup/editAirlineRelease.scss';

import emitter from "../../utils/events";
// import EditCapacityRelease from './editCapacityRelease';
// import EditAirLineRelease from './editAirLineRelease';
import DateChoose from "../../components/dateChoose/dateChoose";
import AirportSearch from './../../components/search/airportSearch';
import AllAirportSearch from './../../components/search/allAirportSearch';
import SailingtimeComponent from '../../components/sailingtimeComponent/sailingtimeComponent';

import HourTimer from './../../components/timeComponent/hourTimer';
import TimeAcross from './timeAcross';

import DimAir from "../../components/dimAir/dimAir";

import Confirmations from './../../components/confirmations/confirmations';


const RadioGroup = Radio.Group;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const format = 'HH:mm';//定义antd时间组件格式;

export default class EditAirLineRelease extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: store.getState().role.role,
            currentEmployeedId: store.getState().role.id,
            employeeId: 0,
            editType: 1, //编辑/响应 1:响应,2:重新编辑
            airList: store.getState().airList,//城市
            air: [],//机型
            data: [ //拟开航班默认数据
                { name: "1", type: true },
                { name: "2", type: true },
                { name: "3", type: true },
                { name: "4", type: true },
                { name: "5", type: true },
                { name: "6", type: true },
                { name: "7", type: true }
            ],
            releaseDemandPoint: '',// 发布需求的机场的本场三字码
            releaseDemandPointNm: '',
            targetPoint: '',
            targetPointNm: '',

            airline: 0,//0 直飞,1 经停 //TODO:有问题
            // countryType: 0,  // 国内航线：0，国际航线：1

            showAirportSearch2: false,  // 始发运力是否显示
            searchText2: '',  // 始发运力输入框文字
            searchText2Bus: '',  // 始发运力输入框存储
            dpt: '',  // 始发三字码
            showAirportSearch3: false,  // 经停是否显示
            searchText3: '',  // 经停输入框文字
            searchText3Bus: '',  // 经停输入框存储
            pst: '',  // 经停三字码
            showAirportSearch4: false,  // 到达是否显示
            searchText4: '',  // 到达输入框文字
            searchText4Bus: '',  // 到达输入框存储
            arrv: '',  // 到达三字码

            aircrfttyp: "",//拟飞机型
            seating: "",//座位数布局
            days: "",//拟开航班
            sailingtime: "",//计划执行周期
            performShift: "",//计划执行班次
            userPerformShift: "",//用户输入计划执行班次
            periodValidity: "",//运力有效期
            contact: "",//联系人
            ihome: "",//移动电话
            fixedSubsidyPrice: "",//定补价格
            bottomSubsidyPrice: "",//保底价格
            title: '',//航线标题

            fixedSubsidyPriceType: false,//定补类型
            bottomSubsidyPriceType: false,//保底类型
            otherType: false,//其他类型
            remark: "",//其他说明

            sailingtimeStart: '',
            sailingtimeEnd: '',

            quoteType: '',
            quotedPrice: '',
            // 出入港时刻
            dptLevel: '',
            pstEnter: '',
            pstLevel: '',
            arrvEnter: '',
            arrvLevel: '',
            pstBackEnter: '',
            pstBackLevel: '',
            dptEnter: '',
            // 数据验证
            isInit: 1,
            msg: {
                point: false,//航点

                dptLevel: false,//始发离开
                dptEnter: false,//始发到达
                pstLevel: false,//经停离开
                pstEnter: false,//经停到达
                pstBackLevel: false,//经停返回离开
                pstBackEnter: false,//经停返回到达
                arrvLevel: false,//到达离开
                arrvEnter: false,//到达到达

                aircrfttyp: false,//机型
                seating: false,//座位布局
                sailingtime: false,//计划执行周期
                performShift: false,//计划执行班次
                periodValidity: false,//运力有效期
                contact: false,//联系人
                ihome: false,//移动电话
                date: false,//拟开班期
                quote: false,//报价
            },

            group_dpt: { dpt: '', dptLevel: '', dptEnter: '' },
            group_pst: { pst: '', pstLevel: '', pstEnter: '' },
            group_pstBack: { pst: '', pstBackLevel: '', pstBackEnter: '' },
            group_arrv: { pst: '', arrvLevel: '', arrvEnter: '' },

            loading: false,
        };
    }
    componentDidMount() {
        let air = store.getState().air;//获取机型列表
        let periodValidity = moment().format().split("T")[0];
        this.setState({
            air,
            periodValidity
        });

    }
    componentWillUnmount() {

    }
    componentWillMount() {
        this.getUpdate(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.getUpdate(nextProps);
    }
    // 开启加载动画
    loadingFn = () => {
        this.setState({
            loading: true,
        })
    }
    // 关闭加载动画
    unLoadingFn = () => {
        this.setState({
            loading: false,
        })
    }
    // 获取数据,检查是否存在数据
    getUpdate(props) {
        this.loadingFn();
        let _this = this;
        let transmit = props.popupMes.transmit;
        let role = store.getState().role.role;
        if (transmit.editType === 1 && role === "0") {//响应 //航司角色
            let demandId = transmit.demandId;//需求id
            Axios({
                url: 'queryDraftResponse',
                method: 'post',
                params: {
                    demandId: demandId
                }
            }).then((response) => {
                let releaseDemandPoint = response.data.releaseDemandPoint;// 发布需求的机场的本场三字码
                let releaseDemandPointNm = response.data.releaseDemandPointNm;//布需求的机场的本场机场名
                let targetPoint = response.data.targetPoint;//发布需求的机场的意向航点三字码
                let targetPointNm = response.data.targetPointNm;//发布需求的机场的意向航点机场名
                let periodValidity = response.data.periodValidity;//需求有效期
                let days = response.data.days;//需求有效期
                let title = response.data.title;//标题

                if (response.data.opResult == '0') {//不是第一次响应时
                    let yId = response.data.obj.id;//意向id
                    let {
                        demandId, // 需求id
                        employeeId, // 响应者id
                        dptTime, // 始发时刻
                        pstTime, // 经停时刻
                        pstTimeBack, // 经停返回时刻
                        arrvTime, // 到达时刻
                        aircrfttyp, // 拟飞机型
                        seating, // 座位布局
                        days, // 班期 
                        sailingtime, // 计划开航时刻
                        periodValidity, // 运力有效期
                        performShift, // 计划班次
                        fixedSubsidyPrice, // 定价 ?
                        bottomSubsidyPrice, // 保底 ?
                        remark, // 其他说明
                        contact, // 联系人
                        ihome,  //移动电话
                        responsePlans, // 响应方案
                        responseProgress, //意向状态
                        title,
                    } = response.data.obj;

                    let { id, responseId, dpt, dptNm, pst, pstNm, arrv, arrvNm, state, isCurrentUserResponsePlan, quoteType, quotedPrice } = (responsePlans ? responsePlans[0] : {});//id:响应id

                    let [sailingtimeStart, sailingtimeEnd] = sailingtime ? sailingtime.split(',') : [];

                    let dptLevel = dptTime ? dptTime.split(',')[0] : '',
                        dptEnter = dptTime ? dptTime.split(',')[1] : '',
                        pstLevel = pstTime ? pstTime.split(',')[0] : '',
                        pstEnter = pstTime ? pstTime.split(',')[1] : '',
                        arrvLevel = arrvTime ? arrvTime.split(',')[0] : '',
                        arrvEnter = arrvTime ? arrvTime.split(',')[1] : '',
                        pstBackLevel = pstTimeBack ? pstTimeBack.split(',')[0] : '',
                        pstBackEnter = pstTimeBack ? pstTimeBack.split(',')[1] : '';

                    let data = [ //拟开航班默认数据
                        { name: "1", type: false },
                        { name: "2", type: false },
                        { name: "3", type: false },
                        { name: "4", type: false },
                        { name: "5", type: false },
                        { name: "6", type: false },
                        { name: "7", type: false }
                    ];
                    days.split('/').map((value) => {
                        data[Number(value) - 1].type = true;
                    });
                    this.setState(() => {
                        return {
                            editType: transmit.editType,
                            existDraft: 2,//1:重来没有响应过,2:有草稿
                            yId,
                            releaseDemandPoint: releaseDemandPoint || '',// 发布需求的机场的本场三字码
                            releaseDemandPointNm: releaseDemandPointNm || '',//布需求的机场的本场机场名
                            targetPoint: targetPoint || '',//发布需求的机场的意向航点三字码
                            targetPointNm: targetPointNm || '',//发布需求的机场的意向航点机场名

                            searchText2: responseProgress == '2' ? releaseDemandPointNm : (dptNm || ''),  // 始发运力输入框文字
                            searchText2Bus: responseProgress == '2' ? releaseDemandPointNm : (dptNm || ''),  // 始发运力输入框存储
                            dpt: responseProgress == '2' ? releaseDemandPoint : (dpt || ''),  // 始发三字码

                            searchText3: responseProgress == '2' ? '' : (pstNm || ''),  // 始发运力输入框文字
                            searchText3Bus: responseProgress == '2' ? '' : (pstNm || ''),  // 始发运力输入框存储
                            pst: responseProgress == '2' ? '' : (pst || ''),  // 始发三字码

                            searchText4: responseProgress == '2' ? targetPointNm : (arrvNm || ''),  // 到达输入框文
                            searchText4Bus: responseProgress == '2' ? targetPointNm : (arrvNm || ''),  // 到达输入框存储
                            arrv: responseProgress == '2' ? targetPoint : (arrv || ''),  // 到达三字码

                            airline: pst ? 1 : 0,
                            fixedSubsidyPriceType: fixedSubsidyPrice ? true : false,
                            bottomSubsidyPriceType: bottomSubsidyPrice ? true : false,
                            sailingtimeStart: sailingtimeStart ? sailingtimeStart : '',
                            sailingtimeEnd: sailingtimeEnd ? sailingtimeEnd : '',
                            // 出入港时刻
                            dptLevel,
                            pstEnter,
                            pstLevel,
                            arrvEnter,
                            arrvLevel,
                            pstBackEnter,
                            pstBackLevel,
                            dptEnter,

                            demandId, responseId, employeeId, id, dptNm, pstNm, arrvNm, aircrfttyp, seating, days, sailingtime,
                            performShift: performShift ? performShift : "",
                            periodValidity,
                            fixedSubsidyPrice, bottomSubsidyPrice, contact, ihome, remark,
                            responsePlans, state, isCurrentUserResponsePlan, responseProgress,
                            quoteType, quotedPrice,
                            data, title,

                            group_dpt: { dpt, dptNm, dptLevel, dptEnter },
                            group_pst: { pst, pstNm, pstLevel, pstEnter },
                            group_pstBack: { pst, pstNm, pstBackLevel, pstBackEnter },
                            group_arrv: { arrv, arrvNm, arrvLevel, arrvEnter },
                        }
                    }, () => {
                        this.unLoadingFn();
                    })
                } else if (response.data.opResult === '1') {//第一次响应时
                    let data = [
                        { name: "1", type: false },
                        { name: "2", type: false },
                        { name: "3", type: false },
                        { name: "4", type: false },
                        { name: "5", type: false },
                        { name: "6", type: false },
                        { name: "7", type: false }
                    ];
                    data.map((item, index) => {
                        for (let i = 0; i < days.split("/").length; i++) {
                            if (item.name == days.split("/")[i]) {
                                item.type = true
                            }
                        }
                        return item;
                    });
                    this.setState(() => {
                        return {
                            existDraft: 1,//1:重来没有响应过,2:有草稿

                            releaseDemandPoint: releaseDemandPoint || '',// 发布需求的机场的本场三字码
                            releaseDemandPointNm: releaseDemandPointNm || '',//布需求的机场的本场机场名
                            targetPoint: targetPoint || '',//发布需求的机场的意向航点三字码
                            targetPointNm: targetPointNm || '',//发布需求的机场的意向航点机场名
                            data,//拟开班期
                            periodValidity: periodValidity || '',

                            searchText2: releaseDemandPointNm || '',  // 始发运力输入框文字
                            searchText2Bus: releaseDemandPointNm || '',  // 始发运力输入框存储
                            dpt: releaseDemandPoint || '',  // 始发三字码

                            searchText3: '',  // 始发运力输入框文字
                            searchText3Bus: '',  // 始发运力输入框存储
                            pst: '',  // 始发三字码

                            searchText4: targetPointNm || '',  // 到达输入框文字
                            searchText4Bus: targetPointNm || '',  // 到达输入框存储
                            arrv: targetPoint || '',  // 到达三字码

                            airline: 0,

                            demandId: demandId,
                            // employeeId: employeeId,
                            sailingtime: '整年',
                            sailingtimeStart: '',
                            sailingtimeEnd: '',
                            contact: store.getState().role.concat,
                            ihome: store.getState().role.phone,
                            title,
                        }
                    }, () => {
                        this.changeEvent(this.state.sailingtime, []);
                        this.unLoadingFn();
                    })
                }

            })

        } else if (transmit.editType === 2 && role === "0") {//编辑 //航司角色
            let demandId = transmit.demandId;//需求id
            Axios({
                url: 'queryDraftResponse',
                method: 'post',
                params: {
                    demandId: demandId
                }
            }).then((response) => {
                if (response.data.opResult === '0') {
                    let releaseDemandPoint = response.data.releaseDemandPoint;// 发布需求的机场的本场三字码
                    let releaseDemandPointNm = response.data.releaseDemandPointNm;//布需求的机场的本场机场名
                    let targetPoint = response.data.targetPoint;//发布需求的机场的意向航点三字码
                    let targetPointNm = response.data.targetPointNm;//发布需求的机场的意向航点机场名

                    let yId = response.data.obj.id;//意向id
                    let {
                        demandId, // 需求id
                        employeeId, // 响应者id
                        dptTime, // 始发时刻
                        pstTime, // 经停时刻
                        pstTimeBack, // 经停返回时刻
                        arrvTime, // 到达时刻
                        aircrfttyp, // 拟飞机型
                        seating, // 座位布局
                        days, // 班期 
                        sailingtime, // 计划开航时刻
                        periodValidity, // 运力有效期
                        performShift, // 计划班次
                        fixedSubsidyPrice, // 定价
                        bottomSubsidyPrice, // 保底
                        remark, // 其他说明
                        contact, // 联系人
                        ihome,  //移动电话
                        responsePlans, // 响应方案
                        responseProgress, //意向状态
                    } = response.data.obj;

                    let { id, responseId, dpt, dptNm, pst, pstNm, arrv, arrvNm, state, isCurrentUserResponsePlan, quoteType = '', quotedPrice = '' } = responsePlans[0];//id:响应id

                    let [sailingtimeStart, sailingtimeEnd] = sailingtime.split(',');

                    let dptLevel = dptTime ? dptTime.split(',')[0] : '',
                        dptEnter = dptTime ? dptTime.split(',')[1] : '',
                        pstLevel = pstTime ? pstTime.split(',')[0] : '',
                        pstEnter = pstTime ? pstTime.split(',')[1] : '',
                        arrvLevel = arrvTime ? arrvTime.split(',')[0] : '',
                        arrvEnter = arrvTime ? arrvTime.split(',')[1] : '',
                        pstBackLevel = pstTimeBack ? pstTimeBack.split(',')[0] : '',
                        pstBackEnter = pstTimeBack ? pstTimeBack.split(',')[1] : '';

                    let data = [ //拟开航班默认数据
                        { name: "1", type: false },
                        { name: "2", type: false },
                        { name: "3", type: false },
                        { name: "4", type: false },
                        { name: "5", type: false },
                        { name: "6", type: false },
                        { name: "7", type: false }
                    ];
                    days.split('/').map((value) => {
                        data[Number(value) - 1].type = true;
                    })

                    this.setState(() => {
                        return {
                            editType: transmit.editType,

                            releaseDemandPoint: releaseDemandPoint || '',// 发布需求的机场的本场三字码
                            releaseDemandPointNm: releaseDemandPointNm || '',//布需求的机场的本场机场名
                            targetPoint: targetPoint || '',//发布需求的机场的意向航点三字码
                            targetPointNm: targetPointNm || '',//发布需求的机场的意向航点机场名

                            yId,
                            searchText2: dptNm || '',  // 始发运力输入框文字
                            searchText2Bus: dptNm || '',  // 始发运力输入框存储
                            dpt: dpt || '',  // 始发三字码

                            searchText3: pstNm || '',  // 始发运力输入框文字
                            searchText3Bus: pstNm || '',  // 始发运力输入框存储
                            pst: pst || '',  // 始发三字码

                            searchText4: arrvNm || '',  // 到达输入框文字
                            searchText4Bus: arrvNm || '',  // 到达输入框存储
                            arrv: arrv || '',  // 到达三字码


                            airline: pst ? 1 : 0,
                            fixedSubsidyPriceType: fixedSubsidyPrice ? true : false,
                            bottomSubsidyPriceType: bottomSubsidyPrice ? true : false,
                            sailingtimeStart: sailingtimeStart ? sailingtimeStart : '',
                            sailingtimeEnd: sailingtimeEnd ? sailingtimeEnd : '',
                            // 出入港时刻
                            dptLevel,
                            pstEnter,
                            pstLevel,
                            arrvEnter,
                            arrvLevel,
                            pstBackEnter,
                            pstBackLevel,
                            dptEnter,

                            demandId, responseId, employeeId, id, dptNm, pstNm, arrvNm, aircrfttyp, seating, days, sailingtime, performShift, fixedSubsidyPrice, bottomSubsidyPrice, contact, ihome, remark,
                            responsePlans, state, isCurrentUserResponsePlan, responseProgress, periodValidity,
                            quoteType, quotedPrice,
                            data,
                        }
                    }, () => {
                        this.unLoadingFn();
                    })
                } else {
                    _this.setState(() => {
                        return {
                            demandId: demandId,
                            // employeeId: employeeId,
                            sailingtimeStart: '',
                            sailingtimeEnd: '',
                        }
                    }, () => {
                        this.unLoadingFn();
                    })
                }

            })
        } else if (transmit.editType === 3 && role === "1") {//确认选择方案 //机场角色
            let responsePlanId = transmit.id;//需求id
            Axios({
                url: 'queryResponsePlanForEdit',
                method: 'post',
                params: {
                    responsePlanId: responsePlanId,
                    employeeId: this.state.currentEmployeedId,
                }
            }).then((response) => {
                if (response.data.opResult === '0') {
                    let releaseDemandPoint = response.data.releaseDemandPoint;// 发布需求的机场的本场三字码
                    let releaseDemandPointNm = response.data.releaseDemandPointNm;//布需求的机场的本场机场名
                    let targetPoint = response.data.targetPoint;//发布需求的机场的意向航点三字码
                    let targetPointNm = response.data.targetPointNm;//发布需求的机场的意向航点机场名
                    let yId = response.data.reResponse.id;//意向id
                    let {
                        demandId, // 需求id
                        employeeId, // 响应者id
                        dptTime, // 始发时刻
                        pstTime, // 经停时刻
                        pstTimeBack, // 经停返回时刻
                        arrvTime, // 到达时刻
                        aircrfttyp, // 拟飞机型
                        seating, // 座位布局
                        days, // 班期 
                        sailingtime, // 计划开航时刻
                        periodValidity, // 运力有效期
                        performShift, // 计划班次
                        fixedSubsidyPrice, // 定价
                        bottomSubsidyPrice, // 保底
                        remark, // 其他说明
                        contact, // 联系人
                        ihome,  //移动电话
                        responsePlans, // 响应方案
                        responseProgress,
                    } = response.data.reResponse;

                    let { id, responseId, dpt, dptNm, pst, pstNm, arrv, arrvNm, state, isCurrentUserResponsePlan, quoteType, quotedPrice } = responsePlans[0];//id:响应id
                    dptNm = dptNm ? dptNm : '';
                    pstNm = pstNm ? pstNm : '';
                    arrvNm = arrvNm ? arrvNm : '';

                    let [sailingtimeStart, sailingtimeEnd] = sailingtime.split(',');

                    let dptLevel = dptTime ? dptTime.split(',')[0] : '',
                        dptEnter = dptTime ? dptTime.split(',')[1] : '',
                        pstLevel = pstTime ? pstTime.split(',')[0] : '',
                        pstEnter = pstTime ? pstTime.split(',')[1] : '',
                        arrvLevel = arrvTime ? arrvTime.split(',')[0] : '',
                        arrvEnter = arrvTime ? arrvTime.split(',')[1] : '',
                        pstBackLevel = pstTimeBack ? pstTimeBack.split(',')[0] : '',
                        pstBackEnter = pstTimeBack ? pstTimeBack.split(',')[1] : '';

                    let data = [ //拟开航班默认数据
                        { name: "1", type: false },
                        { name: "2", type: false },
                        { name: "3", type: false },
                        { name: "4", type: false },
                        { name: "5", type: false },
                        { name: "6", type: false },
                        { name: "7", type: false }
                    ];
                    days.split('/').map((value) => {
                        data[Number(value) - 1].type = true;
                    })
                    this.setState(() => {
                        return {
                            editType: transmit.editType,

                            releaseDemandPoint: releaseDemandPoint || '',// 发布需求的机场的本场三字码
                            releaseDemandPointNm: releaseDemandPointNm || '',//布需求的机场的本场机场名
                            targetPoint: targetPoint || '',//发布需求的机场的意向航点三字码
                            targetPointNm: targetPointNm || '',//发布需求的机场的意向航点机场名

                            periodValidity,
                            yId,
                            airline: pst ? 1 : 0,
                            fixedSubsidyPriceType: fixedSubsidyPrice ? true : false,
                            bottomSubsidyPriceType: bottomSubsidyPrice ? true : false,
                            sailingtimeStart: sailingtimeStart ? sailingtimeStart : '',
                            sailingtimeEnd: sailingtimeEnd ? sailingtimeEnd : '',
                            // 出入港时刻
                            dptLevel,
                            pstEnter,
                            pstLevel,
                            arrvEnter,
                            arrvLevel,
                            pstBackEnter,
                            pstBackLevel,
                            dptEnter,

                            demandId, employeeId, id, responseId, dpt, dptNm, pst, pstNm, arrv, arrvNm, aircrfttyp, seating, days, sailingtime, performShift, fixedSubsidyPrice, bottomSubsidyPrice, contact, ihome, remark,
                            responsePlans,
                            state, isCurrentUserResponsePlan, responseProgress,
                            quoteType, quotedPrice,
                            data,
                            ...{ searchText2: dptNm, searchText3: pstNm, searchText4: arrvNm, searchText2Bus: dptNm, searchText3Bus: pstNm, searchText4Bus: arrvNm },
                        }
                    }, () => {
                        this.unLoadingFn();
                    })
                } else {
                    this.unLoadingFn();
                }
            })
        } else if (transmit.editType === 4 && role === "1") {//确认选择后重新编辑 //机场角色
            let responsePlanId = transmit.id;//需求id
            Axios({
                url: 'queryResponsePlanForEdit',
                method: 'post',
                params: {
                    responsePlanId,
                    employeeId: this.state.currentEmployeedId,
                }
            }).then((response) => {
                if (response.data.opResult === '0') {
                    let releaseDemandPoint = response.data.releaseDemandPoint;// 发布需求的机场的本场三字码
                    let releaseDemandPointNm = response.data.releaseDemandPointNm;//布需求的机场的本场机场名
                    let targetPoint = response.data.targetPoint;//发布需求的机场的意向航点三字码
                    let targetPointNm = response.data.targetPointNm;//发布需求的机场的意向航点机场名
                    let yId = response.data.reResponse.id;//意向id
                    let {
                        demandId, // 需求id
                        employeeId, // 响应者id
                        dptTime, // 始发时刻
                        pstTime, // 经停时刻
                        pstTimeBack, // 经停返回时刻
                        arrvTime, // 到达时刻
                        aircrfttyp, // 拟飞机型
                        seating, // 座位布局
                        days, // 班期 
                        sailingtime, // 计划开航时刻
                        periodValidity, // 运力有效期
                        performShift, // 计划班次
                        fixedSubsidyPrice, // 定价
                        bottomSubsidyPrice, // 保底
                        remark, // 其他说明
                        contact, // 联系人
                        ihome,  //移动电话
                        responsePlans, // 响应方案
                        responseProgress,
                    } = response.data.reResponse;

                    let { id, responseId, dpt, dptNm, pst, pstNm, arrv, arrvNm, state, isCurrentUserResponsePlan, quoteType, quotedPrice } = responsePlans[0];//id:响应id
                    dptNm = dptNm ? dptNm : '';
                    pstNm = pstNm ? pstNm : '';
                    arrvNm = arrvNm ? arrvNm : '';

                    let [sailingtimeStart, sailingtimeEnd] = sailingtime.split(',');

                    let dptLevel = dptTime ? dptTime.split(',')[0] : '',
                        dptEnter = dptTime ? dptTime.split(',')[1] : '',
                        pstLevel = pstTime ? pstTime.split(',')[0] : '',
                        pstEnter = pstTime ? pstTime.split(',')[1] : '',
                        arrvLevel = arrvTime ? arrvTime.split(',')[0] : '',
                        arrvEnter = arrvTime ? arrvTime.split(',')[1] : '',
                        pstBackLevel = pstTimeBack ? pstTimeBack.split(',')[0] : '',
                        pstBackEnter = pstTimeBack ? pstTimeBack.split(',')[1] : '';

                    let data = [ //拟开航班默认数据
                        { name: "1", type: false },
                        { name: "2", type: false },
                        { name: "3", type: false },
                        { name: "4", type: false },
                        { name: "5", type: false },
                        { name: "6", type: false },
                        { name: "7", type: false }
                    ];
                    days.split('/').map((value) => {
                        data[Number(value) - 1].type = true;
                    })
                    this.setState(() => {
                        return {
                            editType: transmit.editType,

                            releaseDemandPoint: releaseDemandPoint || '',// 发布需求的机场的本场三字码
                            releaseDemandPointNm: releaseDemandPointNm || '',//布需求的机场的本场机场名
                            targetPoint: targetPoint || '',//发布需求的机场的意向航点三字码
                            targetPointNm: targetPointNm || '',//发布需求的机场的意向航点机场名

                            yId,
                            airline: pst ? 1 : 0,
                            fixedSubsidyPriceType: fixedSubsidyPrice ? true : false,
                            bottomSubsidyPriceType: bottomSubsidyPrice ? true : false,
                            sailingtimeStart: sailingtimeStart ? sailingtimeStart : '',
                            sailingtimeEnd: sailingtimeEnd ? sailingtimeEnd : '',
                            // 出入港时刻
                            dptLevel,
                            pstEnter,
                            pstLevel,
                            arrvEnter,
                            arrvLevel,
                            pstBackEnter,
                            pstBackLevel,
                            dptEnter,

                            demandId, employeeId, id, responseId, dpt, dptNm, pst, pstNm, arrv, arrvNm, aircrfttyp, seating, days, sailingtime, performShift, fixedSubsidyPrice, bottomSubsidyPrice, contact, ihome, remark,
                            responsePlans,
                            state, isCurrentUserResponsePlan, responseProgress,
                            quoteType, quotedPrice,
                            data,
                            ...{ searchText2: dptNm, searchText3: pstNm, searchText4: arrvNm, searchText2Bus: dptNm, searchText3Bus: pstNm, searchText4Bus: arrvNm },
                        }
                    }, () => {
                        this.unLoadingFn();
                    })
                }
            })
        }


    }


    // 关闭弹出层
    closePopup = () => {
        let o = {
            popupType: 0,
            popupMes: '',
        }
        emitter.emit('openPopup', o);
    }



    // TODO: 始发运力对应的事件
    searchTextChangeFn2(e) {  //输入框输入内容改变
        let target = e.target;
        let val = target.value.replace(/(^\s*)|(\s*$)/g, "");  // 去除空格
        if (val == '') {
            this.setState({
                dpt: '',
                searchText2: target.value,
                searchText2Bus: '',
            })
        } else {
            this.setState({
                searchText2: target.value,
            })
        }
    }
    inputClickFn2(e) {  // 输入框焦点事件
        e.stopPropagation();
        this.setState(() => {
            return {
                showAirportSearch2: true,
                airlineWarnShow: false,
            }
        })
    }
    inputBlurFn2() {  //input失焦事件
        let that = this;
        setTimeout(() => {
            that.setState((prev) => {
                let searchText2 = prev.searchText2 ? prev.searchText2.replace(/(^\s*)|(\s*$)/g, "") : '';  // 去除空格
                if (searchText2 == '' && prev.searchText2Bus == '') {  // 输入为空时，三字码为空，输入框显示的为空
                    return {
                        searchText2: '',
                        dpt: '',  // 始发三字码
                        showAirportSearch2: false,
                    }
                } else {
                    return {
                        searchText2: prev.searchText2Bus,
                        showAirportSearch2: false,
                    }
                }
            })
        }, 150)
    }
    airportData2(data) {  // 接受下拉框传来的数据
        this.setState((prev) => {
            if (data.name == prev.searchText3 || data.name == prev.searchText4) {
                return {
                    searchText2Bus: '',
                    dpt: '',  // 始发三字码
                    showAirportSearch2: false
                }
            } else {
                this.state.group_dpt.dptNm = data.name;
                this.state.group_dpt.dpt = data.code;
                return {
                    searchText2Bus: data.name,
                    dpt: data.code,  // 始发三字码
                    showAirportSearch2: false,
                    group_dpt: this.state.group_dpt,
                }
            }
        })
    }
    // TODO: 经停对应的事件
    searchTextChangeFn3(e) {  //输入框输入内容改变
        let target = e.target;
        let val = target.value.replace(/(^\s*)|(\s*$)/g, "");  // 去除空格
        if (val == '') {
            this.setState({
                pst: '',
                searchText3: target.value,
                searchText3Bus: '',
            })
        } else {
            this.setState({
                searchText3: target.value,
            })
        }
    }
    inputClickFn3(e) {  // 输入框焦点事件
        e.stopPropagation();
        this.setState(() => {
            return {
                showAirportSearch3: true,
                airlineWarnShow: false,
            }
        })
    }
    inputBlurFn3() {  //input失焦事件
        let that = this;
        setTimeout(() => {
            that.setState((prev) => {
                let searchText3 = prev.searchText3 ? prev.searchText3.replace(/(^\s*)|(\s*$)/g, "") : '';  // 去除空格
                if (searchText3 == '' && prev.searchText3Bus == '') {  // 输入为空时，三字码为空，输入框显示的为空
                    return {
                        searchText3: '',
                        pst: '',  // 经停三字码
                        showAirportSearch3: false,
                    }
                } else {
                    return {
                        searchText3: prev.searchText3Bus,
                        showAirportSearch3: false,
                    }
                }
            })
        }, 150)
    }
    airportData3(data) {  // 接受下拉框传来的数据
        this.setState((prev) => {
            if (data.name == prev.searchText2 || data.name == prev.searchText4) {
                return {
                    searchText3Bus: '',
                    pst: '',
                    showAirportSearch3: false
                }
            } else {
                return {
                    searchText3Bus: data.name,
                    pst: data.code,
                    showAirportSearch3: false
                }
            }
        })
    }
    // TODO: 到达对应的事件
    searchTextChangeFn4(e) {  //输入框输入内容改变
        let target = e.target;
        let val = target.value.replace(/(^\s*)|(\s*$)/g, "");  // 去除空格
        if (val == '') {
            this.setState({
                arrv: '',
                searchText4: target.value,
                searchText4Bus: '',
            })
        } else {
            this.setState({
                searchText4: target.value,
            })
        }
    }
    inputClickFn4(e) {  // 输入框焦点事件
        e.stopPropagation();
        this.setState(() => {
            return {
                showAirportSearch4: true,
                airlineWarnShow: false,
            }
        })
    }
    inputBlurFn4() {  //input失焦事件
        let that = this;
        setTimeout(() => {
            that.setState((prev) => {
                let searchText4 = prev.searchText4 ? prev.searchText4.replace(/(^\s*)|(\s*$)/g, "") : '';  // 去除空格
                if (searchText4 == '' && prev.searchText4Bus == '') {  // 输入为空时，三字码为空，输入框显示的为空
                    return {
                        searchText4: '',
                        arrv: '',  // 到达三字码
                        showAirportSearch4: false,
                    }
                } else {
                    return {
                        searchText4: prev.searchText4Bus,
                        showAirportSearch4: false,
                    }
                }
            })
        }, 150)
    }
    airportData4(data) {  // 接受下拉框传来的数据
        this.setState((prev) => {
            if (data.name == prev.searchText2 || data.name == prev.searchText3) {
                return {
                    searchText4Bus: '',
                    arrv: '',
                    showAirportSearch4: false
                }
            } else {
                return {
                    searchText4Bus: data.name,
                    arrv: data.code,
                    showAirportSearch4: false
                }
            }
        })
    }

    // 根据状态选择相应样式
    getSiteTimeStyle = () => {
        return { justifyContent: this.state.airline ? 'space-between' : 'space-around' };
    }

    // 选择航线类型
    radioChangeFn(e) {
        let value = Number(e.target.value);
        let releaseDemandPoint = this.state.releaseDemandPoint || '';
        let releaseDemandPointNm = this.state.releaseDemandPointNm || '';
        let targetPoint = this.state.targetPoint || '';
        let targetPointNm = this.state.targetPointNm || '';
        if (value == 0) {// 直飞
            this.setState({
                dpt: releaseDemandPoint || '',
                searchText2: releaseDemandPointNm || '',
                searchText2Bus: releaseDemandPointNm || '',

                pst: '',
                searchText3: '',
                searchText3Bus: '',

                arrv: targetPoint || '',
                searchText4: targetPointNm || '',
                searchText5Bus: targetPointNm || '',
                airline: value,//0 直飞,1 经停

                // dptLevel: this.state.pstLevel,
                // dptEnter: this.state.pstBackEnter,
                // pstLevel: '',
                // pstBackEnter: '',
            })
            // this.setState(() => {
            //     let { group_dpt, group_pst, group_pstBack, group_arrv } = this.state;
            //     return {
            //         dptLevel: group_pstBack.pstBackLevel,
            //         dptEnter: group_pstBack.pstBackEnter,
            //     }
            // })

        } else if (value == 1) {//经停
            this.setState({
                dpt: '',
                searchText2: '',
                searchText2Bus: '',

                pst: releaseDemandPoint || '',
                searchText3: releaseDemandPointNm || '',
                searchText3Bus: releaseDemandPointNm || '',

                arrv: targetPoint || '',
                searchText4: targetPointNm || '',
                searchText5Bus: targetPointNm || '',
                airline: value,//0 直飞,1 经停

                // dptLevel: '',
                // dptEnter: '',
                // pstLevel: this.state.dptLevel,
                // pstBackEnter: this.state.dptEnter,
            })
            // this.setState(() => {
            //     let { group_dpt, group_pst, group_pstBack, group_arrv } = this.state;
            //     return {
            //         pstBackLevel: group_pstBack.dptLevel,
            //         pstBackEnter: group_pstBack.dptEnter,
            //     }
            // })
        }
    }
    dptLevel(e, time) {
        this.state.group_dpt.dptLevel = time;
        this.setState(() => {
            return {
                dptLevel: time,
                group_dpt: this.state.group_dpt,
            }
        })
    }
    dptEnter(e, time) {
        this.state.group_dpt.dptEnter = time;
        this.setState(() => {
            return {
                dptEnter: time,
                group_dpt: this.state.group_dpt,
            }
        })
    }
    pstLevel(e, time) {
        this.state.group_pst.pstLevel = time;
        this.setState(() => {
            return {
                pstLevel: time,
                group_dpt: this.state.group_pst,
            }
        })
    }
    pstEnter(e, time) {
        this.state.group_pst.pstEnter = time;
        this.setState(() => {
            return {
                pstEnter: time,
                group_dpt: this.state.group_pst,
            }
        })
    }
    arrvLevel(e, time) {
        this.state.group_arrv.arrvLevel = time;
        this.setState(() => {
            return {
                arrvLevel: time,
                group_dpt: this.state.group_arrv,
            }
        })
    }
    arrvEnter(e, time) {
        this.state.group_arrv.arrvEnter = time;
        this.setState(() => {
            return {
                arrvEnter: time,
                group_dpt: this.state.group_arrv,
            }
        })
    }
    pstBackLevel(e, time) {
        this.state.group_pstBack.pstBackLevel = time;
        this.setState(() => {
            return {
                pstBackLevel: time,
                group_dpt: this.state.group_pstBack,
            }
        })
    }
    pstBackEnter(e, time) {
        this.state.group_pstBack.pstBackEnter = time;
        this.setState(() => {
            return {
                pstBackEnter: time,
                group_dpt: this.state.group_pstBack,
            }
        })
    }

    //向DateChoose组件传递方法
    chooseDateEvent(data) {
        let days;
        let newArr = [];
        let dataType = false;
        for (let i = 0; i < 7; i++) {
            if (data[i].type == true) {
                dataType = true;
                newArr.push(data[i].name)
            };
        };
        days = newArr.join("/");
        this.setState({
            days
        });
        let newData = data;
        // if (dataType && !this.state.userPerformShift) {//用户优先
        if (dataType) {//计算优先
            this.changeEvent(this.state.sailingtime, []);
            //当计划执行周期有值时
        } else {
            this.setState({
                data: newData,
                performShift: ""
            })
        }

    }
    dimEvent(data) {
        this.setState({
            aircrfttyp: data
        })
    }
    // 选择拟飞机型
    aircrfttyp = (value) => {
        this.setState({
            aircrfttyp: value,
        })
    }
    // 座位数布局 控件
    handleSeatingChange = (event) => {
        let value = event.target.value;
        let patt = /^[0-9a-zA-Z]*$/;
        if (value.match(patt)) {
            this.setState({
                seating: value
            })
        }
    }

    onCalendarChange(dates, dateStrings) {
        if (dates.length) {
            let a = moment(dates[0]).format('YYYY-MM-DD');
            let b = moment(dates[0]).add(1, 'y').format('YYYY-MM-DD');
            let sailingtime = a + "," + b;
            this.setState({
                sailingtime
            })
        } else {
            this.setState(() => {
                sailingtime: '';
            })
        }

    }

    sailingtime(date, dateString) {
        // if (!this.state.userPerformShift) {//用户输入优先
        if (true) {//自动计算优先
            //计算执行班次
            let performShift = 0;
            let data = this.state.data;
            let dataTrueNum = [];//选择执飞日期
            let dateStart = dateString[0].split("-");
            let dateEnd = dateString[1].split("-");
            let dateS = new Date(dateStart[0], dateStart[1], dateStart[2]);
            let dateE = new Date(dateEnd[0], dateEnd[1], dateEnd[2]);
            let daysNum = parseInt(Math.abs(dateS - dateE)) / 1000 / 60 / 60 / 24;//相差天数
            daysNum += 1;
            for (let i = 0; i < data.length; i++) {
                if (data[i].type == true) {
                    if (i == 6) {
                        dataTrueNum.push("0")
                    } else {
                        dataTrueNum.push(data[i].name)
                    }
                }
            };
            if (dataTrueNum.length != 0) {
                if (daysNum % 7 == 0) {
                    performShift = parseInt(daysNum / 7) * dataTrueNum.length;
                } else {
                    performShift = parseInt(daysNum / 7) * dataTrueNum.length;
                    let startWeek = parseInt(moment(dateString[0], "YYYY/MM/DD").format("d"));
                    let endWeek = parseInt(moment(dateString[1], "YYYY/MM/DD").format("d"));
                    let num = endWeek - startWeek;
                    if (startWeek <= endWeek) {
                        for (let i = 0; i < num + 1; i++) {
                            for (let j = 0; j < dataTrueNum.length; j++) {
                                if (startWeek + i == dataTrueNum[j]) {
                                    performShift = 1 + performShift;
                                }
                            }
                        }
                    } else {
                        for (let i = 0; i < dataTrueNum.length; i++) {
                            if (startWeek <= parseInt(dataTrueNum[i])) {
                                performShift += 1
                            } else if (endWeek >= parseInt(dataTrueNum[i])) {
                                performShift += 1
                            }
                        };
                    }
                };
                this.setState({
                    performShift,
                })
            };
        };
        let sailingtime = dateString[0] + "," + dateString[1];
        let newDate = date[0].clone();
        let periodValidity = newDate.subtract(1, "days").format().split("T")[0];
        if (this.state.periodValidity) {
            this.setState({
                disableSailingTime: periodValidity,
                sailingtime,
            })
        } else {
            this.setState({
                disableSailingTime: periodValidity,
                periodValidity,
                sailingtime,
            })
        }
    }

    //运力有效期
    periodValidity = (date, dateString) => {
        if (dateString == "") {
            let periodValidity = this.state.periodValidity;
            periodValidity = moment().format().split("T")[0];
            this.setState({
                periodValidity
            })
        } else {
            this.setState({
                periodValidity: dateString
            })
        }
    }

    sailingtimeDisabledDate(current) {
        let disText = current && current < moment().endOf("days");
        if (this.state.periodValidity) {
            let startTime = moment(this.state.periodValidity, "YYYY/MM/DD")
            disText = current && current < startTime.endOf("days")
        };
        return disText
    }

    periodValidityDisabledDate = (current) => {
        let disText = current && current < moment().add(1, 'months').subtract(1, "days");
        if (this.state.sailingtime) {
            if (/\d{4}\-\d{2}\-\d{2}\,\d{4}\-\d{2}\-\d{2}/.test(this.state.sailingtime)) {//自定义时间
                let startTime = moment(this.state.disableSailingTime, "YYYY/MM/DD");
                disText = (current && current < moment().add(1, 'months').subtract(1, "days")) || current > startTime
            }
        }
        return disText
    }

    //TODO:计划执行班次
    performShiftChange(event) {
        let performShift = event.target.value;
        if (performShift.match(/^\d*$/) && parseInt(performShift) !== 0) {
            this.setState({
                performShift: performShift ? parseInt(performShift) : '',
                userPerformShift: performShift ? parseInt(performShift) : ''
            })
        }
    }

    // 文本域
    remarkChange(event) {
        this.setState({
            remark: event.target.value
        })
    }

    // 联系人
    contactChange(event) {
        if (this.props.popupMes.transmit.editType == 3 || this.props.popupMes.transmit.editType == 4) {
            return false;
        }
        this.setState({
            contact: event.target.value
        })
    }

    // 手机号码
    phoneChange(event) {
        if (this.props.popupMes.transmit.editType == 3 || this.props.popupMes.transmit.editType == 4) {
            return false;
        }
        if (event.target.value.match(/^[\d]*$/)) {
            this.setState({
                ihome: event.target.value
            })
        }
    }
    // 定补复选框改变事件
    fixedSubsidyPriceCheckboxChange = (e) => {
        this.setState({
            fixedSubsidyPriceType: !this.state.fixedSubsidyPriceType,
            fixedSubsidyPrice: !this.state.fixedSubsidyPriceType ? this.state.fixedSubsidyPrice : '',
        })
    }
    // 定补价格
    fixedSubsidyPriceChange(event) {
        if (this.state.fixedSubsidyPriceType) {
            if (event.target.value.match(/^[\d]*$/)) {
                this.setState({
                    fixedSubsidyPrice: event.target.value
                })
            }
        }
    }
    // 保底复选框改变事件
    bottomSubsidyPriceCheckboxChange = (e) => {
        this.setState({
            bottomSubsidyPriceType: !this.state.bottomSubsidyPriceType,
            bottomSubsidyPrice: !this.state.bottomSubsidyPriceType ? this.state.bottomSubsidyPrice : '',
        })
    }
    // 保底价格
    bottomSubsidyPriceChange(event) {
        if (this.state.bottomSubsidyPriceType) {
            if (event.target.value.match(/^[\d|\.]*$/)) {
                this.setState({
                    bottomSubsidyPrice: event.target.value
                })
            }
        }
    }
    //关闭弹出层 
    cancel = () => {
        this.closePopup()
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    hideModal = () => {
        this.setState({
            visible: false,
        });
    }
    onConfirm = () => {
        this.hideModal();
        this.collectData(2);
    }
    modalFn = () => {
        let tipType = this.state.editType || 1;
        let title = '--', subTitle = '--', tipText = '--';
        switch (tipType) {
            case 1:
                title = '需求响应';
                subTitle = '确认响应' + this.state.title;
                tipText = '';
                break;
            case 3:
                title = '方案选择';
                subTitle = '确认选择该方案';
                tipText = '选定后将不可选择其他方案';
                break;
        }
        this.setState(() => {
            return {
                tipType,
                title,
                subTitle,
                tipText,
            }
        }, () => {
            if (tipType == 1 || tipType == 3) {
                this.showModal();
            } else {
                this.onConfirm();
            }

        })
    }

    // 确认提交方案
    confirm = () => {
        // 构建总数据
        this.setState({
            isInit: 0
        })
        if (this.verifyForm(this.state.msg)) {
            this.modalFn();
        } else {
        }
        // this.collectData(2);
    }
    // 保存草稿
    saveScheme = (editType) => {
        if (editType === 1) {
            this.collectData(3);
        }
    }
    // 数据验证
    verifyForm = (form) => {
        let editType = this.props.popupMes.transmit.editType;
        let msg = this.state.msg;

        if (this.state.airline == 0) {//当为直飞的时候,经停点为true
            msg.pstEnter = true;
            msg.pstLevel = true;
            msg.pstBackLevel = true;
            msg.pstBackEnter = true;
        }
        let count = Object.keys(msg).length;
        if (msg) {
            for (let m in msg) {
                if (msg[m]) {
                    count--;
                }
            }
        }
        return count == 0 ? true : false;
    }
    // 收集数据 发送
    collectData = (savaType) => {
        this.loadingFn();
        let _this = this;
        // 清理班期,组装为字符串
        let data = this.state.data.filter((value) => {
            if (value.type) {
                return value;
            }
        })
        data = data.map((value) => {
            return value.name;
        })
        let days = data.join('/');

        //组装响应方案数据,响应的时候,第一次保存方案的时候只需要传入航点三字码,没有id和responseId
        let responsePlans = [];
        if (!this.state.responsePlans) {
            responsePlans = [{
                id: null,
                responseId: this.state.yId,
                dpt: this.state.dpt,
                pst: this.state.pst,
                arrv: this.state.arrv,
                quoteType: this.state.quoteType,
                quotedPrice: this.state.quotedPrice,
            }];
        } else {
            responsePlans = this.state.responsePlans.map((value) => {

                value.dpt = _this.state.dpt;
                value.pst = _this.state.airline == 1 ? _this.state.pst : '';//判断后传参
                value.arrv = _this.state.arrv;
                value.quoteType = _this.state.quoteType;
                value.quotedPrice = _this.state.quotedPrice;
                return value
            });
        }
        // 构建总数据
        let pstTimeBack = '';
        if (this.state.pstBackLevel && this.state.pstBackEnter) {
            pstTimeBack = this.state.pstBackLevel + ',' + this.state.pstBackEnter;
        } else if (this.state.pstBackLevel || this.state.pstBackEnter) {
            pstTimeBack = this.state.pstBackLevel + ',' + this.state.pstBackEnter;
        }
        let pstTime = '';
        if (this.state.pstLevel && this.state.pstEnter) {
            pstTime = this.state.pstLevel + ',' + this.state.pstEnter;
        } else if (this.state.pstLevel || this.state.pstEnter) {
            pstTime = this.state.pstLevel + ',' + this.state.pstEnter;
        }
        let formData = {
            id: this.state.yId ? this.state.yId : null,
            //responseId:this.state.responseId,
            demandId: this.state.demandId,
            employeeId: this.state.employeeId,
            demandtype: this.state.demandtype,

            dptTime: this.state.dptLevel + ',' + this.state.dptEnter,
            pstTime: this.state.airline == 1 ? pstTime : '',//判断后传参
            arrvTime: this.state.arrvLevel + ',' + this.state.arrvEnter,
            pstTimeBack: this.state.airline == 1 ? pstTimeBack : '',

            aircrfttyp: this.state.aircrfttyp,//拟飞机型
            seating: this.state.seating,//座位布局
            days: days,//班期
            sailingtime: this.state.sailingtime,//计划执行周期
            periodValidity: this.state.periodValidity,//运力有效期
            performShift: this.state.performShift,//计划执行班次

            fixedSubsidyPrice: this.state.fixedSubsidyPrice,//定补价格
            bottomSubsidyPrice: this.state.bottomSubsidyPrice,//保底价格

            remark: this.state.remark,//其他说明
            contact: this.state.contact,//联系人
            ihome: this.state.ihome,//移动电话
            savatype: savaType,
            responsePlans: responsePlans,
            delResponsePlanIds: null
        }
        let editType = this.props.popupMes.transmit.editType;
        if (editType == 1) { //响应
            Axios({
                url: 'responseAdd',
                method: 'post',
                data: JSON.stringify(formData),
                dataType: 'json',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then((response) => {
                this.unLoadingFn();
                if (response.data.opResult === '0') {
                    if (savaType == 2) {
                        Modal.success({
                            title: '提交方案成功',
                            content: '',
                        });
                        emitter.emit('openPopup', {
                            popupType: 0,
                            popupMes: {}
                        })

                    } else if (savaType == 3) {
                        Modal.success({
                            title: '已为您保存草稿。',
                            content: '',
                        });
                        this.getUpdate(this.props)
                    } else {

                    }
                } else {
                    Modal.error({
                        title: response.data.msg,
                        content: '',
                    });
                    emitter.emit('openPopup', {
                        popupType: 0,
                        popupMes: {}
                    })
                }

            })
        } else if (editType == 2) {
            Axios({
                url: 'responseUpdateV2',
                method: 'post',
                data: JSON.stringify(formData),
                dataType: 'json',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            })
                .then((response) => {
                    this.unLoadingFn();
                    if (response.data.opResult === '0') {
                        Modal.success({
                            title: '重新编辑方案成功',
                            content: '',
                        });
                        emitter.emit('openPopup', {
                            popupType: 0,
                            popupMes: {}
                        })
                    } else {
                        Modal.error({
                            title: response.data.msg,
                            content: '',
                        });
                        emitter.emit('openPopup', {
                            popupType: 0,
                            popupMes: {}
                        })
                    }
                })
        } else if (editType == 3) {
            Axios({
                url: 'releaseCheck',
                method: 'post',
                data: JSON.stringify(formData),
                dataType: 'json',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            })
                .then((response) => {
                    this.unLoadingFn();
                    if (response.data.opResult === '0') {
                        Modal.success({
                            title: '选定方案成功，对方确认后生成订单。',
                            content: '',
                        });
                        emitter.emit('openPopup', {
                            popupType: 0,
                            popupMes: {}
                        })
                    } else {
                        Modal.error({
                            title: response.data.msg,
                            content: '',
                        });
                        emitter.emit('openPopup', {
                            popupType: 0,
                            popupMes: {}
                        })
                    }
                })
        } else if (editType == 4) {
            Axios({
                url: 'responseUpdateV2',
                method: 'post',
                data: JSON.stringify(formData),
                dataType: 'json',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            })
                .then((response) => {
                    this.unLoadingFn();
                    if (response.data.opResult === '0') {
                        Modal.success({
                            title: '重新编辑方案成功',
                            content: '',
                        });
                        emitter.emit('openPopup', {
                            popupType: 0,
                            popupMes: {}
                        })
                    } else {
                        Modal.error({
                            title: response.data.msg,
                            content: '',
                        });
                        emitter.emit('openPopup', {
                            popupType: 0,
                            popupMes: {}
                        })
                    }
                })
        }

    }
    btnFun = () => {
        let editType = this.props.popupMes.transmit.editType;
        if (editType === 1) {//响应
            return '确认提交运力方案'
        } else if (editType === 2) {//编辑
            return '确认修改运力方案'

        } else if (editType === 3) {//选择方案
            return '确认选择该方案'

        } else if (editType === 4) {//选择后的重新编辑
            return '确认修改运力方案'

        }

        // let role = this.state.role;
        // let isCurrentUserResponsePlan = this.state.isCurrentUserResponsePlan;
        // let responseProgress = this.state.responseProgress;
        // let state = this.state.state;
        // if (isCurrentUserResponsePlan === "1") {//意向方按钮
        //     // state:0 - 落选，1 - 正常，2 - 选中，3 - 已撤回，4 - 已删除
        //     if (state === '1' && responseProgress === '0') {//方案正常,意向征集
        //         return `确认提交${role === '1' ? '航线' : '运力'}方案`;
        //     } else if (state === '2' && responseProgress === '1') {// 方案选中 订单确认

        //     }
        // } else if (isCurrentUserResponsePlan === "0") {//需求发布方



        //     // 0 - 落选，1 - 正常，2 - 选中，3 - 已撤回，4 - 已删除
        //     if (state === '1' && responseProgress === '0') {//方案正常,意向征集
        //         return '确认选择该方案';
        //     } else if (state === '2' && responseProgress === '1') {// 方案选中 订单确认

        //     }

        // }

    }
    // TODO：报价方式下拉列表 点击事件
    menuClickFn({ key }) {
        let quotedPrice = this.state.quotedPrice;
        if (Number(key) == 0) {
            quotedPrice = '';
        }
        this.setState({
            quoteType: key,
            quotedPrice: quotedPrice,
            quoteWarnShow: false,
        })
    }
    priceChangeFn(e) {  // 报价-价格改变事件
        this.setState({
            quotedPrice: e.target.value,
            quoteWarnShow: false,
        })
    }
    // 转换时间格式
    mountTime = (time) => {
        return time ? moment(time, 'hh/mm') : '';
    }
    findName = (code) => {
        let airList = store.getState().airList;
        let name = '';
        let city = airList.filter((value) => {
            if (value.iata == code) {
                name = value.airlnCd;
            }
        })
        return name;
    }
    // 提示是否显示
    // msgStyle = (name) => {
    //     // let styl = (this.state.isInit == 0 && this.state.msg[name] != 0) ? 'block' : 'none';
    //     if (this.state.isInit == 1) {
    //         return { display: 'none' }
    //     } else if (this.state.isInit == 0) {
    //         return { display: this.state.msg[name] == 0 ? 'none' : 'block' };
    //     }
    //     // return { display: styl }
    // }
    // TODO: 航点逻辑->暂无本场航点数据 未完

    checkDpt = (name) => {
        let bool, tip, msg = this.state.msg;
        if (this.state.dpt == '') {
            tip = '始发不能为空';
            bool = false;
        } else {
            tip = '';
            bool = true;
        }
        msg[name] = bool;
        this.setState(() => {
            msg
        })
        return this.state.isInit == 1 ? '' : tip;
    }
    checkPst = (name) => {
        let bool, tip, msg = this.state.msg;
        if (this.state.pst == '') {
            tip = '经停不能为空';
            bool = false;
        } else {
            tip = '';
            bool = true;
        }
        msg[name] = bool;
        this.setState(() => {
            msg
        })
        return this.state.isInit == 1 ? '' : tip;
    }
    checkArrv = (name) => {
        let bool, tip, msg = this.state.msg;
        if (this.state.arrv == '') {
            tip = '到达不能为空';
            bool = false;
        } else {
            tip = '';
            bool = true;
        }
        msg[name] = bool;
        this.setState(() => {
            msg
        })
        return this.state.isInit == 1 ? '' : tip;
    }
    checkAirPoint = (name) => {
        let bool, tip;
        let releaseDemandPoint = this.state.releaseDemandPoint || '';
        let releaseDemandPointNm = this.state.releaseDemandPointNm || '';
        let targetPoint = this.state.targetPoint || '';
        let targetPointNm = this.state.targetPointNm || '';
        let arr = [releaseDemandPoint, targetPoint];
        let msg = this.state.msg,
            dpt = this.state.dpt,
            pst = this.state.pst,
            arrv = this.state.arrv,
            airline = this.state.airline;

        if (airline == 0) {//直飞
            if (dpt == '') {
                tip = '请选择始发航点';
                bool = false;
            } else if (arrv == '') {
                tip = '请选择到达航点';
                bool = false;
            } else {
                if (dpt != releaseDemandPoint) {
                    tip = '始发航点请选择' + releaseDemandPointNm;
                    bool = false;
                } else if (targetPoint !== '' && arrv != targetPoint) {
                    tip = '到达航点请选择' + targetPointNm;
                    bool = false;
                } else {
                    tip = '';
                    bool = true;
                }
            }

            // if (dpt == '') {
            //     tip = '请选择始发航点';
            //     bool = false;
            // } else if (arrv == '') {
            //     tip = '请选择到达航点';
            //     bool = false;
            // } else if (dpt != '' && arrv != '') {
            //     if (dpt == arrv) {
            //         tip = "始发与到达不可相同"
            //         bool = false;
            //     } else {
            //         let count = 0;
            //         [dpt, arrv].map((value) => {
            //             if (releaseDemandPoint == value || targetPoint == value) {
            //                 count++;
            //             }
            //         });
            //         if (count == 2 || (count == 1 && releaseDemandPoint == targetPoint)) {
            //             tip = '';
            //             bool = true;
            //         } else {
            //             tip = releaseDemandPoint == targetPoint ? `请包含${this.state.releaseDemandPointNm}` : `请包含${this.state.releaseDemandPointNm}和${this.state.targetPointNm}`;
            //             bool = false;
            //         }
            //     }

            // }
        } else if (airline == 1) {//经停
            if (dpt == '') {
                tip = '请选择始发航点'; bool = false;
            } else if (pst == '') {
                tip = '请选择经停航点'; bool = false;
            } else if (arrv == '') {
                tip = '请选择到达航点'; bool = false;
            } else {
                if (pst != releaseDemandPoint) {
                    tip = '经停航点请选择' + releaseDemandPointNm; bool = false;
                } else if (!(dpt == targetPoint || arrv == targetPoint)) {
                    tip = '请包含' + targetPointNm
                } else {
                    tip = ''; bool = true;
                }
            }

            // if (dpt == '') {
            //     tip = '请选择始发航点';
            //     bool = false;
            // } else if (pst == '') {
            //     tip = '请选择经停航点';
            //     bool = false;
            // } else if (arrv == '') {
            //     tip = '请选择到达航点';
            //     bool = false;
            // } else if (dpt != '' && pst != '' && arrv != '') {
            //     if (dpt == arrv) {
            //         tip = "始发与到达不可相同"
            //         bool = false;
            //     } else if (dpt == pst) {
            //         tip = "始发与经停不可相同"
            //         bool = false;
            //     } else if (pst == arrv) {
            //         tip = "经停与到达不可相同"
            //         bool = false;
            //     } else {
            //         let count = 0;
            //         [dpt, pst, arrv].map((value) => {
            //             if (releaseDemandPoint == value || targetPoint == value) {
            //                 count++;
            //             }
            //         });
            //         if (count == 2 || (count == 1 && releaseDemandPoint == targetPoint)) {
            //             tip = ""
            //             bool = true;
            //         } else {
            //             tip = releaseDemandPoint == targetPoint ? `请包含${this.state.releaseDemandPointNm}` : `请包含${this.state.releaseDemandPointNm}和${this.state.targetPointNm}`;
            //             bool = false;
            //         }
            //     }
            // }
        }
        msg[name] = bool;
        this.setState(() => {
            msg
        })
        return this.state.isInit == 1 ? '' : tip;
    }
    checkTime = (name) => {
        let bool, tip, msg = this.state.msg;
        if (this.state.isInit == 0 && this.state[name] == '') {
            tip = '* 时刻不可为空';
            bool = false;
        } else if (this.state.isInit == 1 && this.state[name] == '') {
            tip = '';
            bool = false;
        } else {
            tip = '';
            bool = true;
        }
        msg[name] = bool;
        this.setState(() => {
            msg
        })
        return tip;
    }
    // 时刻验证
    checkDptLevel = (name) => {
        let bool, tip, msg = this.state.msg;
        if (this.state.dptLevel == '') {
            tip = '* 时刻不可为空';
            bool = false;
        } else if (this.state.dptLevel != '') {
            tip = '';
            bool = true;
        }
        msg[name] = bool;
        this.setState(() => {
            msg
        })
        return tip;
    }
    // 时刻验证
    checkpstEnter = (name) => {
        let bool = false, tip = '', msg = this.state.msg, pstEnter = this.state.pstEnter, airline = this.state.airline;
        if (this.state.dptLevel == '') {
            tip = '* 时刻不可为空';
            bool = false;
        } else if (this.state.dptLevel != '') {
            tip = '';
            bool = true;
        }
        msg[name] = bool;
        this.setState(() => {
            msg
        })
        return tip;
    }

    // 联系人检查
    checkContact = (name) => {
        let bool, tip, msg = this.state.msg;
        if (this.state.contact == '') {
            tip = '联系人不能为空';
            bool = false;
        } else {
            tip = '';
            bool = true;
        }
        msg[name] = bool;
        this.setState(() => {
            msg
        })
        return this.state.isInit == 1 ? '' : tip;
    }
    // 联系电话检查
    checkIHome = (name) => {
        let bool, tip, msg = this.state.msg;
        if (this.state.ihome == '') {
            tip = '联系电话不能为空';
            bool = false;
        } else {
            tip = '';
            bool = true;
        }
        msg[name] = bool;
        this.setState(() => {
            msg
        })
        return this.state.isInit == 1 ? '' : tip;
    }
    // 班次检查
    checkShift = (name) => {
        let bool, tip, msg = this.state.msg;
        if (this.state.performShift == '') {
            tip = '计划执行班次不能为空';
            bool = false;
        } else {
            tip = '';
            bool = true;
        }
        msg[name] = bool;
        this.setState(() => {
            msg
        })
        return this.state.isInit == 1 ? '' : tip;
    }
    // 运力有效期检查
    checkPeriodValidity = (name) => {
        let bool, tip, msg = this.state.msg;
        let sailingtime = this.state.sailingtime;
        let periodValidity = this.state.periodValidity;

        if (periodValidity) {
            let periodValidityTime = new Date(periodValidity).getTime();

            let current = new Date().toLocaleDateString();
            let currentTime = new Date(current).getTime();
            if (/\d{4}\-\d{2}\-\d{2}\,\d{4}\-\d{2}\-\d{2}/.test(sailingtime)) {//自定义时间
                let [sailingtimeStart, sailingtimeEnd] = sailingtime.split(',');
                let startTime = new Date(sailingtimeStart).getTime();

                if (periodValidityTime >= currentTime && periodValidityTime < startTime) {
                    tip = '';
                    bool = true;
                } else if (periodValidityTime < currentTime) {
                    tip = '需求有效期必须大于等于当前时间';
                    bool = false;
                } else if (periodValidityTime > startTime) {
                    tip = '需求有效期必须在计划执行周期之前';
                    bool = false;
                } else {
                    tip = '请选择正确的有效期';
                    bool = false;
                }

            } else {//其他时间
                if (periodValidityTime > currentTime) {
                    tip = ''; bool = true;
                } else {
                    tip = '有效期必须大于等于当前时间';
                    bool = false;
                }
            }
        } else {
            tip = '运力有效期不能为空';
            bool = false;
        }

        msg[name] = bool;
        this.setState(() => {
            msg
        }, () => {
        })
        return this.state.isInit == 1 ? '' : tip;
    }
    // 计划执行周期检查
    checkSailingTime = (name) => {
        let bool, tip, msg = this.state.msg;
        let sailingtime = this.state.sailingtime;
        if (sailingtime != '') {
            // if (/\d{4}\-\d{2}\-\d{2}\,\d{4}\-\d{2}\-\d{2}/.test(sailingtime)) {
            // } else {
            //     tip = ''; bool = true;
            // }
            tip = ''; bool = true;
        } else {
            tip = '计划执行周期不能为空'; bool = false;
        }

        // return;
        // let [sailingtimeStart, sailingtimeEnd] = this.state.sailingtime ? this.state.sailingtime.split(',') : []
        // // let sailingtimeStart = this.state.sailingtimeStart;
        // // let sailingtimeEnd = this.state.sailingtimeEnd;
        // let periodValidity = this.state.periodValidity;
        // // let bool, tip, msg = this.state.msg;
        // if (sailingtimeStart == '' || sailingtimeEnd == '') {
        //     tip = '';
        //     bool = false;
        // } else if (sailingtimeStart && sailingtimeEnd) {
        //     let startTime = new Date(sailingtimeStart).getTime();
        //     let endTime = new Date(sailingtimeEnd).getTime();
        //     if (periodValidity) {
        //         let periodValidityTime = new Date(periodValidity).getTime();
        //         if (periodValidityTime < startTime) {
        //             tip = '';
        //             bool = true;
        //         } else {
        //             tip = '计划开航时间必须在运力有效期之后';
        //             bool = false;
        //         }
        //     } else {
        //         let currentTime = new Date().getTime();
        //         if (currentTime < startTime) {
        //             tip = '';
        //             bool = true;
        //         } else {
        //             tip = '计划开航时间必须大于当前日期';
        //             bool = false;
        //         }
        //     }
        // } else {
        //     tip = '请填写计划执行周期';
        //     bool = false;
        // }
        msg[name] = bool;
        this.setState(() => {
            msg
        })
        return this.state.isInit == 1 ? '' : tip;
    }
    // 拟开班期检查
    checkDate = (name) => {
        let bool, tip, msg = this.state.msg, date = this.state.data;
        let count = date.length;
        for (let i = 0; i < date.length; i++) {
            if (date[i].type == false) {
                count -= 1;
            }
        }
        tip = count == 0 ? '请至少选择一天班期' : '';
        bool = count == 0 ? false : true;
        msg[name] = bool;
        this.setState(() => {
            msg
        })
        return this.state.isInit == 1 ? '' : tip;
    }
    // 合作方式检查
    checkPrice = (name) => {
        let bool, tip;
        let { msg, quoteType, quotedPrice } = this.state;
        if (quoteType == '' || quoteType === null || quoteType === undefined) {
            tip = '请选择合作方式'; bool = false;
        } else if ((quoteType === '1' || quoteType === '2') && (quotedPrice === '' || quotedPrice == null)) {
            tip = '请输入价格'; bool = false;
        } else if ((quoteType === '' || quoteType === null) && (quotedPrice === '' || quotedPrice == null)) {
            tip = '请填写合作方式'; bool = false;
        } else {
            if (quoteType === '0') {
                tip = ''; bool = true;
            } else if (quoteType === '1' || quoteType === '2') {
                let fixedSubsidyPriceReg = /^(?:0|[1-9]\d{0,2})(?:\.\d{1,2})?$/;
                if (fixedSubsidyPriceReg.test(this.state.quotedPrice) && this.state.quotedPrice != 0) {
                    tip = ''; bool = true;
                } else {
                    tip = '请输入正确的价格'; bool = false;
                }
            } else {
                tip = ''; bool = false;
            }
        }
        //     let bool, tip, msg = this.state.msg;
        //     if (this.state.quoteType == '' || this.state.quoteType == null) {
        //         tip = '请选择合作方式类型';
        //         bool = false;
        //     } else if (this.state.quotedPrice == '' || this.state.quotedPrice == null) {
        //         tip = '请输入合作方式价格';
        //         bool = false;
        //     } else if (this.state.quoteType == '' && this.state.quotedPrice == '') {
        //         tip = '请填写合作方式';
        //         bool = false;
        //     } else if (this.state.quoteType && this.state.quotedPrice) {
        //         let fixedSubsidyPriceReg = /^(?:0|[1-9]\d{0,2})(?:\.\d{1,2})?$/;
        //         if (fixedSubsidyPriceReg.test(this.state.quotedPrice) && this.state.quotedPrice != 0) {
        //             tip = '';
        //             bool = true;
        //         } else {
        //             tip = '请输入正确的价格';
        //             bool = false;
        //         }
        //     } else {
        //         tip = '请填写合作方式';
        //         bool = false;
        //     }
        msg[name] = bool;
        this.setState(() => {
            msg
        })
        return this.state.isInit == 1 ? '' : tip;
    }
    // 座位检查
    checkSeating = (name) => {
        let bool, tip, msg = this.state.msg;
        if (this.state.seating == '') {
            tip = '座位不能为空';
            bool = false;
        } else {
            tip = '';
            bool = true;
        }
        msg[name] = bool;
        this.setState(() => {
            msg
        })
        return this.state.isInit == 1 ? '' : tip;
    }
    // 拟飞机型检查
    checkAircrfttyp = (name) => {
        let bool, tip, msg = this.state.msg;
        if (this.state.aircrfttyp == '') {
            tip = '机型不能为空';
            bool = false;
        } else {
            tip = '';
            bool = true;
        }
        msg[name] = bool;
        this.setState(() => {
            msg
        })
        return this.state.isInit == 1 ? '' : tip;
    }
    formatTime = (time) => {
        let range = time.match(/^\+[\S]+$/) ? true : false;//true:跨天,false:不跨天
        return range ? (24 + parseInt(time)) : (parseInt(time));
    }
    outTimeEvent(data, timeStr) {
        let obj = {}
        obj[timeStr] = data;
        this.setState(() => {
            return obj
        }, () => {
            let { dptLevel, dptEnter, pstLevel, pstEnter, arrvLevel, arrvEnter, pstBackLevel, pstBackEnter, airline } = this.state;
            let newdptLevel = this.formatTime(dptLevel),
                newdptEnter = this.formatTime(dptEnter),
                newpstLevel = this.formatTime(pstLevel),
                newpstEnter = this.formatTime(pstEnter),
                newarrvLevel = this.formatTime(arrvLevel),
                newarrvEnter = this.formatTime(arrvEnter),
                newpstBackLevel = this.formatTime(pstBackLevel),
                newpstBackEnter = this.formatTime(pstBackEnter);
            if (airline == 0) {//直飞
                if (newdptLevel > newarrvEnter) {
                    newarrvEnter = 0;
                    arrvEnter = '';
                }
                if (newarrvEnter > newarrvLevel) {
                    newarrvLevel = 0;
                    arrvLevel = '';
                }
                if (newarrvLevel > newdptEnter) {
                    newdptEnter = 0;
                    dptEnter = '';
                }
            } else {
                if (newdptLevel > newpstEnter) {
                    newpstEnter = 0;
                    pstEnter = '';
                }
                if (newpstEnter > newpstLevel) {
                    newpstLevel = 0;
                    pstLevel = '';
                }
                if (newpstLevel > newarrvEnter) {
                    newarrvEnter = 0;
                    arrvEnter = '';
                }
                if (newarrvEnter > newarrvLevel) {
                    newarrvLevel = 0;
                    arrvLevel = '';
                }
                if (newarrvLevel > newpstBackEnter) {
                    newpstBackEnter = 0;
                    pstBackEnter = '';
                }
                if (newpstBackEnter > newpstBackLevel) {
                    newpstBackLevel = 0;
                    pstBackLevel = '';
                }
                if (newpstBackLevel > newdptEnter) {
                    newdptEnter = 0;
                    dptEnter = '';
                }
            }
            this.setState({
                dptLevel, dptEnter, pstLevel, pstEnter, arrvLevel, arrvEnter, pstBackLevel, pstBackEnter,
            })
        })
    }
    receivedTime = (time, type) => {
        let temp = {};
        temp[type] = time;

        this.setState(() => {
            return { ...temp }
        }, () => {
        })

    }
    // 计划执行周期
    changeEvent(data, date) {
        let performShift = 0;
        let periodValidity = this.state.periodValidity;
        switch (data) {
            case "整年":
                performShift = this.calculateFixation(365);
                break;
            case "冬春航季":
                performShift = this.calculateFixation(153);
                break;
            case "夏秋航季":
                performShift = this.calculateFixation(216);
                break;
            default:
                performShift = this.calculateUnset(data);
                if (date.length != 0) {
                    let newDate = date[0].clone();
                    periodValidity = newDate.subtract(1, "days").format().split("T")[0];
                };
                break;
        };
        if (this.state.periodValidity) {
            this.setState({
                disableSailingTime: periodValidity,
                sailingtime: data,
                performShift
            })
        } else {
            this.setState({
                disableSailingTime: periodValidity,
                periodValidity,
                sailingtime: data,
                performShift
            })
        }
    }


    //固定计划执行班次计算方法
    calculateFixation(num) {
        let performShift;
        let data = this.state.data;
        let dataTrueNum = [];//选择执飞日期
        for (let i = 0; i < data.length; i++) {
            if (data[i].type == true) {
                if (i == 6) {
                    dataTrueNum.push("0")
                } else {
                    dataTrueNum.push(data[i].name)
                }
            }
        };
        performShift = parseInt(num / 7) * dataTrueNum.length;//整周所含执行班次
        for (let i = 0; i < num % 7; i++) {
            for (let j = 0; j < dataTrueNum.length; j++) {
                if (i == dataTrueNum[j]) {
                    performShift = 1 + performShift;
                }
            }
        };
        return performShift;
    }

    //不固定时间计划执行班次计算方法
    calculateUnset(dateString) {
        // if (!this.state.userPerformShift) {//用户输入优先
        let performShift = 0;
        if (dateString) {//自动计算优先
            //计算执行班次
            let data = this.state.data;
            let dataTrueNum = [];//选择执飞日期
            let dateStart = dateString.split(",")[0].split("-");
            let dateEnd = dateString.split(",")[1].split("-");
            let dateS = new Date(dateStart[0], dateStart[1], dateStart[2]);
            let dateE = new Date(dateEnd[0], dateEnd[1], dateEnd[2]);
            let daysNum = parseInt(Math.abs(dateS - dateE)) / 1000 / 60 / 60 / 24;//相差天数
            daysNum += 1;
            for (let i = 0; i < data.length; i++) {
                if (data[i].type == true) {
                    if (i == 6) {
                        dataTrueNum.push("0")
                    } else {
                        dataTrueNum.push(data[i].name)
                    }
                }
            };
            if (dataTrueNum.length != 0) {
                if (daysNum % 7 == 0) {
                    performShift = parseInt(daysNum / 7) * dataTrueNum.length;
                } else {
                    performShift = parseInt(daysNum / 7) * dataTrueNum.length;
                    let startWeek = parseInt(moment(dateString.split(",")[0], "YYYY/MM/DD").format("d"));
                    let endWeek = parseInt(moment(dateString.split(",")[1], "YYYY/MM/DD").format("d"));
                    let num = endWeek - startWeek;
                    if (startWeek <= endWeek) {
                        for (let i = 0; i < num + 1; i++) {
                            for (let j = 0; j < dataTrueNum.length; j++) {
                                if (startWeek + i == dataTrueNum[j]) {
                                    performShift = 1 + performShift;
                                }
                            }
                        }
                    } else {
                        for (let i = 0; i < dataTrueNum.length; i++) {
                            if (startWeek <= parseInt(dataTrueNum[i])) {
                                performShift += 1
                            } else if (endWeek >= parseInt(dataTrueNum[i])) {
                                performShift += 1
                            }
                        };
                    }
                };
            };
        };
        return performShift
    }

    render() {
        const editType = this.props.popupMes.transmit.editType;
        const menu = (
            <Menu onClick={this.menuClickFn.bind(this)}>
                <Menu.Item key="2">保底</Menu.Item>
                <Menu.Item key="1">定补</Menu.Item>
                <Menu.Item key="0">待议</Menu.Item>
            </Menu>
        );
        //草稿获取计划周期渲染事件
        let cycleDefault = [];
        if (this.state.sailingtime != "") {
            cycleDefault = [moment(this.state.sailingtime.split(",")[0], "YYYY/MM/DD"), moment(this.state.sailingtime.split(",")[1], "YYYY/MM/DD")];
        }
        let axis = {  // 下拉搜索样式
            position: 'absolute',
            right: 0,
            maxWidth: '220px',
            maxHeight: '220px',
            overflowY: 'scroll',
            background: 'white',
            zIndex: 22,
            boxShadow: '0 2px 11px rgba(85,85,85,0.1)'
        };
        let dptAirportSearch = this.state.countryType == 0
            ? <AirportSearch
                axis={axis}
                resData={this.airportData2.bind(this)}
                searchText={this.state.searchText2} />
            : <AllAirportSearch
                axis={axis}
                resData={this.airportData2.bind(this)}
                searchText={this.state.searchText2} />;
        let pstAirportSearch = this.state.countryType == 0
            ? <AirportSearch
                axis={axis}
                resData={this.airportData3.bind(this)}
                searchText={this.state.searchText3} />
            : <AllAirportSearch
                axis={axis}
                resData={this.airportData3.bind(this)}
                searchText={this.state.searchText3} />;
        let arrvAirportSearch = this.state.countryType == 0
            ? <AirportSearch
                axis={axis}
                resData={this.airportData4.bind(this)}
                searchText={this.state.searchText4} />
            : <AllAirportSearch
                axis={axis}
                resData={this.airportData4.bind(this)}
                searchText={this.state.searchText4} />;


        let test = "";
        const periodValidity = this.state.periodValidity;

        return (
            <div className={style['editAirLineRelease']}>
                <div className={style['title']}>
                    <span>填写运力方案</span>
                    <button onClick={this.closePopup}>
                        <i className={'iconfont'}>&#xe62c;</i>
                    </button>
                </div>
                <div className={style['release-main']}>
                    {/* 顶部信息 */}
                    <div className={style['top']}>
                        <div style={{ fontWeight: 'bold', fontSize: '2rem' }}>我可以飞这条航线</div>
                        <div>
                            <RadioGroup name="radiogroup" defaultValue={0} value={this.state.airline} onChange={this.radioChangeFn.bind(this)}>
                                <Radio value={0} style={{ fontSize: '1.2rem' }}>直飞</Radio>
                                <Radio value={1} style={{ fontSize: '1.2rem' }}>经停</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    {/* 航点和时刻 */}
                    <div className={style['site-time-con']} style={this.getSiteTimeStyle()}>
                        <div className={style['col-item']}>
                            {/*始发运力*/}
                            <div className={style['common-style']}>
                                <div>
                                    <i className={'iconfont'}>&#xe6ad;</i>
                                    <span>始发</span>
                                </div>
                                <div>
                                    <input type="text" maxLength="20"
                                        value={this.state.searchText2}
                                        onChange={this.searchTextChangeFn2.bind(this)}
                                        onClick={this.inputClickFn2.bind(this)}
                                        onBlur={this.inputBlurFn2.bind(this)}
                                    />
                                    <div className={style['drop-list']}>
                                        {
                                            this.state.showAirportSearch2 && dptAirportSearch
                                        }
                                    </div>
                                </div>
                                <span className={style['msg']}>
                                    {/* {this.checkDpt('dpt')} */}
                                </span>
                            </div>
                        </div>

                        {
                            this.state.airline == 1 ? (<div className={style['col-item']}>
                                {/*经停运力*/}
                                <div className={style['common-style']}>
                                    <div>
                                        <i className={'iconfont'}>&#xe6ad;</i>
                                        <span>经停</span>
                                    </div>
                                    <div>
                                        <input type="text" maxLength="20"
                                            value={this.state.searchText3}
                                            onChange={this.searchTextChangeFn3.bind(this)}
                                            onClick={this.inputClickFn3.bind(this)}
                                            onBlur={this.inputBlurFn3.bind(this)}
                                        />
                                        <div className={style['drop-list']}>
                                            {
                                                this.state.showAirportSearch3 && pstAirportSearch
                                            }
                                        </div>
                                    </div>
                                    <span className={style['msg']}>
                                        {/* {this.checkPst('pst')} */}
                                    </span>
                                </div>
                            </div>) : (
                                    <div style={{ width: '60px' }}></div>
                                )
                        }

                        <div className={style['col-item']}>
                            {/*到达*/}
                            <div className={style['common-style']}>
                                <div>
                                    <i className={'iconfont'}>&#xe6ad;</i>
                                    <span>到达</span>
                                </div>
                                <div>
                                    <input type="text" maxLength="20"
                                        value={this.state.searchText4}
                                        onChange={this.searchTextChangeFn4.bind(this)}
                                        onClick={this.inputClickFn4.bind(this)}
                                        onBlur={this.inputBlurFn4.bind(this)}
                                    />
                                    <div className={style['drop-list']}>
                                        {
                                            this.state.showAirportSearch4 && arrvAirportSearch
                                        }
                                    </div>
                                </div>
                                <span className={style['msg']}>
                                    {this.checkAirPoint('point')}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* 飞行时刻 */}
                    <div className={style['time-container']}>
                        {/* 始发时刻 */}
                        <div className={`${style['time-col']} ${style['time-line']}`}>
                            <div className={style['time-box']}>
                                {/* 始发出港时刻 */}
                                <div className={`${style['common-style']} ${style['time-item']}`}>
                                    <div>
                                        <span>出</span>
                                    </div>
                                    <div>
                                        <span className={"ant-time-picker-icon"}></span>
                                        <div className={style['drop-list-time']}>
                                            {/* <HourTimer showArrow={false} time={""} type={false} defaultTime={this.state.dptLevel} outTimeEvent={(data, timeStr) => this.outTimeEvent(data, 'dptLevel')} /> */}
                                            <TimePicker format={format} placeholder={""} onChange={this.dptLevel.bind(this)} value={this.mountTime(this.state.dptLevel)} />
                                            {/* <TimeAcross confineTime="" defaultTime={this.state.dptLevel} returnTime={(time) => { this.receivedTime(time, 'dptLevel') }}/> */}
                                        </div>
                                    </div>
                                    <span className={style['msg']} >
                                        {this.checkTime('dptLevel')}
                                    </span>
                                </div>
                                {/* 始发入港时刻 */}
                                <div className={`${style['common-style']} ${style['time-item']}`}>
                                    <div>
                                        <span>进</span>
                                    </div>
                                    <div>
                                        <input type="text" maxLength="20" />
                                        <span className={"ant-time-picker-icon"}></span>
                                        <div className={style['drop-list-time']}>
                                            {/* <HourTimer showArrow={false} time={this.state.airline == 0 ? this.state.arrvLevel : this.state.pstBackLevel} type={false} defaultTime={this.state.dptEnter} outTimeEvent={(data, timeStr) => this.outTimeEvent(data, 'dptEnter')} /> */}
                                            <TimePicker format={format} placeholder={''} onChange={this.dptEnter.bind(this)} value={this.mountTime(this.state.dptEnter)} />
                                            {/* <TimeAcross confineTime={this.state.airline == 0 ? this.state.arrvLevel : this.state.pstBackLevel} defaultTime={this.state.dptEnter} returnTime={(time) => { this.receivedTime(time, 'dptEnter') }}/> */}
                                        </div>
                                    </div>
                                    <span className={style['msg']}>
                                        {this.checkTime('dptEnter')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/*  */}

                        {
                            this.state.airline == 1 ? (
                                /* 1:经停 经停时刻 */
                                <div className={style['time-col']}>
                                    <div className={style['time-col-items']}>
                                        <div className={style['time-col-icon']}>
                                            <span className={'iconfont'}>&#xe6ad;</span>
                                        </div>
                                        <div className={style['time-col-center']}>
                                            {/* 经停入港时刻 */}
                                            <div className={`${style['common-style']} ${style['time-item']} ${style['small-time-item']}`}>
                                                <div>
                                                    <span>进</span>
                                                </div>
                                                <div>
                                                    <span className={"ant-time-picker-icon"}></span>
                                                    <div className={style['drop-list-time']}>
                                                        {/*time:禁选条件，“”未没有，如有：格式2018-06-01   defaultTime：草稿数据  outTimeEvent:组件返回获取的时间*/}
                                                        {/* <HourTimer showArrow={false} time={this.state.dptLevel} type={false} defaultTime={this.state.pstEnter} outTimeEvent={(data, timeStr) => this.outTimeEvent(data, 'pstEnter')} /> */}
                                                        <TimePicker format={format} placeholder={''} onChange={this.pstEnter.bind(this)} value={this.mountTime(this.state.pstEnter)} />
                                                        {/* <TimeAcross confineTime={this.state.dptLevel} defaultTime={this.state.pstEnter} returnTime={(time) => { this.receivedTime(time, 'pstEnter') }} /> */}
                                                    </div>
                                                </div>
                                                <span className={style['msg']}>
                                                    {this.checkTime('pstEnter')}
                                                </span>
                                            </div>
                                            {/* 经停出港时刻 */}
                                            <div className={`${style['common-style']} ${style['time-item']} ${style['small-time-item']}`}>
                                                <div>
                                                    <span>出</span>
                                                </div>
                                                <div>
                                                    <span className={"ant-time-picker-icon"}></span>
                                                    <div className={style['drop-list-time']}>
                                                        {/* <HourTimer showArrow={false} time={this.state.pstEnter} type={false} defaultTime={this.state.pstLevel} outTimeEvent={(data, timeStr) => this.outTimeEvent(data, 'pstLevel')} /> */}
                                                        <TimePicker format={format} placeholder={''} onChange={this.pstLevel.bind(this)} value={this.mountTime(this.state.pstLevel)} />
                                                        {/* <TimeAcross confineTime={this.state.pstEnter} defaultTime={this.state.pstLevel} returnTime={(time) => { this.receivedTime(time, 'pstLevel') }} /> */}
                                                    </div>
                                                </div>
                                                <span className={style['msg']}>
                                                    {this.checkTime('pstLevel')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={style['time-col-icon']}>
                                            <span className={'iconfont'}>&#xe6ad;</span>
                                        </div>
                                    </div>
                                    <div className={style['time-col-items']}>
                                        <div className={`${style['time-col-icon']} ${style['reverse']}`}>
                                            <span className={'iconfont'}>&#xe6ad;</span>
                                        </div>
                                        <div className={style['time-col-center']}>
                                            {/* 返回经停出港时刻 */}
                                            <div className={`${style['common-style']} ${style['time-item']} ${style['small-time-item']}`}>
                                                <div>
                                                    <span>出</span>
                                                </div>
                                                <div>
                                                    <span className={"ant-time-picker-icon"}></span>
                                                    <div className={style['drop-list-time']}>
                                                        {/* <HourTimer showArrow={false} time={this.state.pstBackEnter} type={false} defaultTime={this.state.pstBackLevel} outTimeEvent={(data, timeStr) => this.outTimeEvent(data, 'pstBackLevel')} /> */}
                                                        <TimePicker format={format} placeholder={''} onChange={this.pstBackLevel.bind(this)} value={this.mountTime(this.state.pstBackLevel)} />
                                                        {/* <TimeAcross confineTime={this.state.pstBackEnter} defaultTime={this.state.pstBackLevel} returnTime={(time) => { this.receivedTime(time, 'pstBackLevel') }} /> */}
                                                    </div>
                                                </div>
                                                <span className={style['msg']}>
                                                    {this.checkTime('pstBackLevel')}
                                                </span>
                                            </div>
                                            {/* 返回经停入港时刻 */}
                                            <div className={`${style['common-style']} ${style['time-item']} ${style['small-time-item']}`}>
                                                <div>
                                                    <span>进</span>
                                                </div>
                                                <div>
                                                    <span className={"ant-time-picker-icon"}></span>
                                                    <div className={style['drop-list-time']}>
                                                        {/* <HourTimer showArrow={false} time={this.state.arrvLevel} type={false} defaultTime={this.state.pstBackEnter} outTimeEvent={(data, timeStr) => this.outTimeEvent(data, 'pstBackEnter')} /> */}
                                                        <TimePicker format={format} placeholder={''} onChange={this.pstBackEnter.bind(this)} value={this.mountTime(this.state.pstBackEnter)} />
                                                        {/* <TimeAcross confineTime={this.state.arrvLevel} defaultTime={this.state.pstBackEnter} returnTime={(time) => { this.receivedTime(time, 'pstBackEnter') }} /> */}
                                                    </div>
                                                </div>
                                                <span className={style['msg']}>
                                                    {this.checkTime('pstBackEnter')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`${style['time-col-icon']} ${style['reverse']}`}>
                                            <span className={'iconfont'}>&#xe6ad;</span>
                                        </div>
                                    </div>
                                </div>
                                /*  */
                            ) : (
                                    /* 0:直飞 没有经停时刻 */
                                    <div className={style['no-pst']}>
                                        <div className={style['time-col-items']}>
                                            <div className={style['time-col-icon']}>
                                                <span className={'iconfont'}>&#xe6ad;</span>
                                            </div>
                                        </div>
                                        <div className={style['time-col-items']}>
                                            <div className={`${style['time-col-icon']} ${style['reverse']}`}>
                                                <span className={'iconfont'}>&#xe6ad;</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                        }

                        {/* 到达时刻 */}
                        <div className={style['time-col']}>
                            <div className={style['time-box']}>
                                {/* 到达入港时刻 */}
                                <div className={`${style['common-style']} ${style['time-item']}`}>
                                    <div>
                                        <span>进</span>
                                    </div>
                                    <div>
                                        <input type="text" maxLength="20" />
                                        <span className={"ant-time-picker-icon"}></span>
                                        <div className={style['drop-list-time']}>
                                            {/* <HourTimer showArrow={false} time={this.state.airline == 0 ? this.state.dptLevel : this.state.pstLevel} type={false} defaultTime={this.state.arrvEnter} outTimeEvent={(data, timeStr) => this.outTimeEvent(data, 'arrvEnter')} /> */}
                                            <TimePicker format={format} placeholder={""} onChange={this.arrvEnter.bind(this)} value={this.mountTime(this.state.arrvEnter)} />
                                            {/* <TimeAcross confineTime={this.state.airline == 0 ? this.state.dptLevel : this.state.pstLevel} defaultTime={this.state.arrvEnter} returnTime={(time) => { this.receivedTime(time, 'arrvEnter') }} /> */}
                                        </div>
                                    </div>
                                    <span className={style['msg']}>
                                        {this.checkTime('arrvEnter')}
                                    </span>
                                </div>
                                {/* 到达出港时刻 */}
                                <div className={`${style['common-style']} ${style['time-item']}`}>
                                    <div>
                                        <span>出</span>
                                    </div>
                                    <div>
                                        <input type="text" maxLength="20" />
                                        <span className={"ant-time-picker-icon"}></span>
                                        <div className={style['drop-list-time']}>
                                            {/* <HourTimer showArrow={false} time={this.state.arrvEnter} type={false} defaultTime={this.state.arrvLevel} outTimeEvent={(data, timeStr) => this.outTimeEvent(data, 'arrvLevel')} /> */}
                                            <TimePicker format={format} placeholder={''} onChange={this.arrvLevel.bind(this)} value={this.mountTime(this.state.arrvLevel)} />
                                            {/* <TimeAcross confineTime={this.state.arrvEnter} defaultTime={this.state.arrvLevel} returnTime={(time) => { this.receivedTime(time, 'arrvLevel') }} /> */}
                                        </div>
                                    </div>
                                    <span className={style['msg']}>
                                        {this.checkTime('arrvLevel')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/*  */}
                    </div>
                    {/* 飞行计划信息 */}
                    <div className={style['flight-info']}>
                        {/*航班信息*/}
                        <div className={style['flight-info-con']}>
                            {/*拟飞机型*/}
                            {/* <div className={style['capacity-release-content-box']} style={{ position: "relative" }}>
                                <div className={style['capacity-release-content-filter-type']}>拟飞机型</div>
                                
                            </div> */}
                            <div className={style['common-style']}>
                                <div>
                                    <span>拟飞机型</span>
                                </div>
                                <div>
                                    <DimAir airType="1" defaultData={this.state.aircrfttyp} dimEvent={(data) => this.dimEvent(data)} />
                                </div>
                                <span className={style['msg']}>
                                    {this.checkAircrfttyp('aircrfttyp')}
                                </span>
                            </div>
                            {/*座位数布局*/}
                            <div className={style['common-style']}>
                                <div>
                                    <span>座位数布局</span>
                                </div>
                                <div>
                                    <input type="text" maxLength="20" placeholder="例：F8Y160"
                                        value={this.state.seating}
                                        onChange={this.handleSeatingChange} />
                                </div>
                                <span className={style['msg']}>
                                    {this.checkSeating('seating')}
                                </span>
                            </div>
                            {/* 合作方式 */}
                            <div className={style['common-style']} style={{ flexDirection: 'row', height: '40px' }}>
                                <div style={{ flex: 1, padding: '0 8px' }}>
                                    <span>合作方式</span>
                                </div>
                                <div>
                                    <Dropdown overlay={menu} trigger={['click']}>
                                        <div className={`${style['col-text']} ${style['flex']}`} style={{ textIndent: '7px', width: '77px' }}>
                                            <div style={{ width: '47px' }}>{this.state.quoteType === "0" ? '待议' : ''}{this.state.quoteType === "1" ? '定补' : ''}{this.state.quoteType === "2" ? '保底' : ''}</div>
                                            <Icon type="caret-down" />
                                        </div>
                                    </Dropdown>
                                    <input style={{ width: '60px' }} type="text"
                                        value={this.state.quotedPrice}
                                        disabled={this.state.quoteType === '0' ? true : false}
                                        onChange={this.priceChangeFn.bind(this)} />
                                    <span>万</span>
                                </div>
                                <span className={style['msg']}>
                                    {this.checkPrice('quote')}
                                </span>
                            </div>
                            {/*拟开航班*/}
                            <div className={style['common-style']} style={{ width: '66%' }}>
                                <div>
                                    <span>拟开班期</span>
                                </div>
                                <div className={style['days']}>
                                    <Fragment >
                                        <DateChoose data={this.state.data} chooseDate={(data) => this.chooseDateEvent(data)} />
                                    </Fragment>
                                </div>
                                <span className={style['msg']}>
                                    {this.checkDate('date')}
                                </span>
                            </div>

                            {/*计划开航*/}
                            <div className={style['common-style']}>
                                <div>
                                    <span>运力有效期</span>
                                </div>
                                <div className={style['date']}>
                                    <DatePicker
                                        value={this.state.periodValidity ? moment(this.state.periodValidity, "YYYY/MM/DD") : null}
                                        onChange={this.periodValidity.bind(this)}
                                        placeholder={""}
                                        format="YYYY-MM-DD"
                                        disabledDate={this.periodValidityDisabledDate.bind(this)}
                                        disabled={this.props.popupMes.transmit.editType == 3 || this.props.popupMes.transmit.editType == 4}
                                        dropdownClassName={style['antd']}
                                        locale={{
                                            "lang": {
                                                "yearFormat": "YYYY" + "年",
                                                "monthSelect": "选择月份",
                                                "yearSelect": "选择年份",
                                                "previousMonth": "上个月 (PageUp)",
                                                "nextMonth": "下个月 (PageDown)",
                                                "previousYear": "上一年 (Control + left)",
                                                "nextYear": "下一年 (Control + right)",
                                                "today": "今天",
                                            }
                                        }}
                                    />
                                </div>
                                <span className={style['msg']}>
                                    {this.checkPeriodValidity('periodValidity')}
                                </span>
                            </div>
                            {/*计划执行周期*/}
                            <div className={style['common-style']} style={{ width: '66%', height: '80px', }}>
                                <div>
                                    <span>计划执行周期</span>
                                </div>
                                <div className={style['date']}>

                                    <SailingtimeComponent edit={true} sailingtimeText={''} sailingtime={this.state.sailingtime} periodValidity={this.state.periodValidity} changeEvent={(data, date) => this.changeEvent(data, date)} />
                                    {/* <RangePicker
                                        key={this.state.demandtype}
                                        style={{ display: 'flex', alignItems: 'center' }}
                                        placeholder={["开始", "结束"]}
                                        value={cycleDefault}
                                        allowClear={false}
                                        onChange={this.sailingtime.bind(this)}
                                        format="YYYY-MM-DD"
                                        disabledDate={this.sailingtimeDisabledDate.bind(this)}
                                        dropdownClassName={style['antd']}
                                        onCalendarChange={this.onCalendarChange.bind(this)}
                                        locale={{
                                            "lang": {
                                                "yearFormat": "YYYY" + "年",
                                                "monthSelect": "选择月份",
                                                "yearSelect": "选择年份",
                                                "previousMonth": "上个月 (PageUp)",
                                                "nextMonth": "下个月 (PageDown)",
                                                "previousYear": "上一年 (Control + left)",
                                                "nextYear": "下一年 (Control + right)"
                                            }
                                        }}
                                    /> */}
                                </div>
                                <span className={style['msg']}>
                                    {this.checkSailingTime('sailingtime')}
                                </span>
                            </div>
                            {/*计划执行班次*/}
                            <div className={style['common-style']}>
                                <div>
                                    <span>计划执行班次</span>
                                </div>
                                <div className={style['date']}>
                                    <input type="text" maxLength="20"
                                        value={this.state.performShift}
                                        onChange={this.performShiftChange.bind(this)}
                                    />
                                    <span>班</span>
                                </div>
                                <span className={style['msg']}>
                                    {this.checkShift('performShift')}
                                </span>
                            </div>
                        </div>
                        {/*航班报价（编辑和响应有区别）*/}
                        {/*<div className={style['flight-info-price']}>
                            <div className={style['common-style']} style={{ flexDirection: 'row', height: '40px' }}>
                                <div style={{ flex: 1, padding: '0 8px' }}>
                                    <span>合作方式</span>
                                </div>
                                <div>
                                    <Dropdown overlay={menu} trigger={['click']}>
                                        <div className={`${style['col-text']} ${style['flex']}`} style={{ textIndent: '7px', width: '77px' }}>
                                            <div style={{ width: '47px' }}>{this.state.quoteType === "1" ? '定补' : ''}{this.state.quoteType === "2" ? '保底' : ''}</div>
                                            <Icon type="caret-down" />
                                        </div>
                                    </Dropdown>
                                    <input style={{ width: '60px' }} type="text"
                                        value={this.state.quotedPrice}
                                        onChange={this.priceChangeFn.bind(this)} />
                                    <span>万</span>
                                </div>
                            </div>
                             <div>报价:</div>
                            <div>
                                <div className={style['price-item']}>
                                    <Checkbox 
                                        checked={this.state.fixedSubsidyPriceType}
                                        onClick={this.fixedSubsidyPriceCheckboxChange}></Checkbox>
                                    <span>定补</span>
                                    <div> 
                                        <input type = "text"
                                        value = {this.state.fixedSubsidyPrice}
                                        onChange={this.fixedSubsidyPriceChange.bind(this)}
                                        />
                                        <span>万/班</span>
                                    </div>
                                </div>
                                <div className={style['price-item']}>
                                    <Checkbox 
                                        checked={this.state.bottomSubsidyPriceType}
                                        onClick={this.bottomSubsidyPriceCheckboxChange}></Checkbox>
                                    <span>保底</span>
                                    <div>
                                        <input type="text"
                                            value={this.state.bottomSubsidyPrice}
                                            onChange={this.bottomSubsidyPriceChange.bind(this)}/>
                                        <span>万/h</span>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                    </div>
                    {/* 其他说明 */}
                    <div className={style['other-info']}>
                        <div className={style['explan']}>
                            <div>
                                其他说明:
                            </div>
                            <div>
                                <textarea value={this.state.remark} onChange={this.remarkChange.bind(this)} maxLength="200"></textarea>
                                <div className={style['textarea-msg']}>
                                    {Number(this.state.remark.length)}/200
                                </div>
                            </div>
                        </div>
                        <div className={style['contact']}>
                            <div className={style['common-style']}>
                                <div>
                                    <span>联系人</span>
                                </div>
                                <div>
                                    <input type="text" maxLength="20"
                                        value={this.state.contact}
                                        onChange={this.contactChange.bind(this)}
                                        disabled={this.props.popupMes.transmit.editType == 3 || this.props.popupMes.transmit.editType == 4}
                                        style={{ cursor: this.props.popupMes.transmit.editType == 3 || this.props.popupMes.transmit.editType == 4 ? 'not-allowed' : 'default' }} />
                                </div>
                                <span className={style['msg']}>
                                    {this.checkContact('contact')}
                                </span>
                            </div>
                            <div className={style['common-style']}>
                                <div>
                                    <span>联系电话</span>
                                </div>
                                <div>
                                    <input type="text" maxLength="20"
                                        value={this.state.ihome}
                                        onChange={this.phoneChange.bind(this)}
                                        disabled={this.props.popupMes.transmit.editType == 3 || this.props.popupMes.transmit.editType == 4}
                                        style={{ cursor: this.props.popupMes.transmit.editType == 3 || this.props.popupMes.transmit.editType == 4 ? 'not-allowed' : 'default' }} />
                                </div>
                                <span className={style['msg']}>
                                    {this.checkIHome('ihome')}
                                </span>
                            </div>
                            <div className={style['common-style']}>

                            </div>
                        </div>
                    </div>

                </div>
                <div className={style['handle']}>
                    {editType === 1 ? <button onClick={this.saveScheme.bind(this, editType)}>保存方案</button> : ''}
                    <button className={style['confirm']} onClick={this.confirm}>
                        {this.btnFun()}
                    </button>
                    <button onClick={this.cancel}>取消</button>
                </div>
                <div className={style['shade']} style={{ display: this.state.loading ? '' : 'none' }}>
                    <Spin tip='loading...' />
                </div>
                <Confirmations
                    title={this.state.title}
                    subTitle={this.state.subTitle}
                    tipText={this.state.tipText}
                    visible={this.state.visible}
                    onOk={this.onConfirm}
                    onCancel={this.hideModal} />

            </div>
        )
    }
}