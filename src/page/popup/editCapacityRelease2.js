import React, { Component, Fragment } from 'react'
import Axios from "./../../utils/axiosInterceptors";
import { store } from "../../store";

import emitter from "../../utils/events";
import moment from 'moment';
import { Radio, TimePicker, Checkbox, Select, DatePicker, Menu, Dropdown, Icon, Modal, Button, Spin } from 'antd';

import style from './../../static/css/popup/editCapacityRelease.scss';

import SailingtimeComponent from '../../components/sailingtimeComponent/sailingtimeComponent';
import DateChoose from "../../components/dateChoose/dateChoose";
import AirportSearch from '../../components/search/airportSearch';
import AllAirportSearch from './../../components/search/allAirportSearch';

const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD';
const format = 'HH:mm';//定义antd时间组件格式;

export default class EditCapacityRelease extends Component {
    constructor(props) {
        super(props);
        this.firstResponse = this.firstResponse.bind(this);
        this.state = {
            role: '',
            demandId: '',
            id: null,
            editType: '',//表单类型
            loading: true,//数据加载动画
            alertShow: false,//显示弹层

            airline: 0,//0 直飞,1 经停 ,2 甩飞//TODO:有问题
            quoteType: '',
            quotedPrice: '',
            projectIndex: -1,  // 用来确定是第几个方案（-1：默认“新增方案”）
            state: 0,  // 测算状态(0-正常，1-删除，2-测算中，3-测算完成)
            // 出进港时刻
            dptLevel: '',
            pstEnter: '',
            pstLevel: '',
            arrvEnter: '',
            arrvLevel: '',
            pstBackEnter: '',
            pstBackLevel: '',
            dptEnter: '',

            searchText2: '',
            searchText2Bus: '',
            dpt: '',
            showAirportSearch2: false,

            // date: {
            //     valid: false,//是否合规,
            //     value: [
            //         { name: '1', type: false },
            //         { name: '2', type: false },
            //         { name: '3', type: false },
            //         { name: '4', type: false },
            //         { name: '5', type: false },
            //         { name: '6', type: false },
            //         { name: '7', type: false },
            //     ],
            //     error: '',
            // },
            date: [
                { name: '1', type: false },
                { name: '2', type: false },
                { name: '3', type: false },
                { name: '4', type: false },
                { name: '5', type: false },
                { name: '6', type: false },
                { name: '7', type: false },
            ],
            demandDpt: '',
            demandDptNm: '',
            demandPst: '',
            demandPstNm: '',
            demandArrv: '',
            demandArrvNm: '',

            // 输入框中
            searchText2: '',//始发三字码
            searchText2Bus: '',
            dpt: '',
            searchText3: '',  // 经停输入框文字
            searchText3Bus: '',  // 经停输入框存储
            pst: '',  // 经停三字码
            searchText4: '',
            searchText4Bus: '',
            arrv: '',
            alertShow: false,

            demandtype: '',//需求类型
            days: '',//拟开班期
            performShift: '',//计划执行班次
            periodValidity: '',//方案有效期
            sailingtime: '整年',//计划执行周期
            timeRequirements: 0,//时刻要求（0-白班，1-晚班，2-都接受）
            contact: '',//联系人
            ihome: '',//联系电话
            remark: '',//其他说明
            title: '',//标题
            responsePlans: [],//响应方案

            planMsg: '',

        }
    }
    componentWillMount() {
        this.initialize(this.props)
        // this.getUpdate(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.initialize(this.props)

        // this.getUpdate(nextProps);
    }
    componentDidMount() {
    }
    // 初始化必要数据
    initialize = (props) => {
        this.loadingFn();
        let role = store.getState().role.role;
        let transmit = props.popupMes.transmit;
        let { demandId, editType, id = null } = transmit;
        this.setState({
            role,
            demandId,
            id,
            editType,
        }, () => {
            console.log(this.state.editType)
            this.getUpdate();
        })
    }
    // 获取数据
    getUpdate = () => {
        let { demandId, editType, role } = this.state;

        if ((editType === 1 || editType === 2) && role === '1') { // 响应或重新编辑
            Axios({
                method: 'post',
                url: '/queryDraftResponse',
                params: {  // 一起发送的URL参数
                    demandId,
                },
                dataType: 'json',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then((response) => {
                if (response.data.opResult === '0') {
                    this.initEdit(response.data, editType);
                } else if (response.data.opResult === '1') {
                    this.firstResponse(response.data)
                }
            })
        } else {

        }
        // let editType = this.props.popupMes.transmit.editType;
    }
    initEdit = (response, editType) => {
        let {
            demandPlan = {},
            obj = {},
            releaseDemandPoint,
            releaseDemandPointNm,
            targetPoint,
            targetPointNm
        } = response;

        let {
            dpt: demandDpt, dptNm: demandDptNm, pst: demandPst, pstNm: demandPstNm, arrv: demandArrv, arrvNm: demandArrvNm,
            areaType, routeType = '0',
            mandatoryDesignation,//到达强制:"0"非强制,"1"强制
            pstMandatoryDesignation,
        } = demandPlan;

        let {
            demandId,//需求id
            demandtype,//需求类型
            days = '',//拟开班期
            performShift = '',//计划执行班次
            periodValidity = '',//方案有效期
            sailingtime = '整年',//计划执行周期
            timeRequirements = 0,//时刻要求（0-白班，1-晚班，2-都接受）
            contact = '',//联系人
            ihome = '',//联系电话
            remark = '',//其他说明
            title = '',//标题
            responsePlans = [],//响应方案
            id = '',//响应id
        } = obj;

        let { date } = this.state;

        if (days && days != '') {  // 拟开班期
            let tempArray = days.split('/');
            tempArray.map((value) => {
                // date.value[Number(value) - 1].type = true
                date[Number(value) - 1].type = true
            })
        }

        timeRequirements = Number(timeRequirements);

        let searchText2 = demandDptNm,
            searchText2Bus = demandDptNm,
            dpt = demandDpt,
            searchText3 = demandPstNm,
            searchText3Bus = demandPstNm,
            pst = demandPst,
            searchText4 = demandArrvNm,
            searchText4Bus = demandArrvNm,
            arrv = demandArrv;
        // 当响应机场不是需求中的始发或者意向航点
        if (!(targetPoint == demandDpt || targetPoint == demandArrv)) {
            if (mandatoryDesignation == "0") {//若强制到达则代入需求到达点,否则代入响应机场名
                searchText4 = targetPointNm;
                searchText4Bus = targetPointNm;
                arrv = targetPoint;
            }
        }

        this.setState(() => {
            return {
                demandtype,//需求类型
                days,//拟开班期
                performShift,//计划执行班次
                periodValidity,//方案有效期
                sailingtime,//计划执行周期
                timeRequirements,//时刻要求（0-白班，1-晚班，2-都接受）
                contact,//联系人
                ihome,//联系电话
                remark,//其他说明
                title,//标题
                responsePlans,//响应方案
                date,//班期
                id,//响应id

                // 航线设计类型
                airline: parseInt(routeType),

                targetPoint,//响应方机场三字码
                targetPointNm,
                // 需求中三字码及机场
                demandDpt,
                demandDptNm,
                demandPst,
                demandPstNm,
                demandArrv,
                demandArrvNm,
                mandatoryDesignation,
                pstMandatoryDesignation,

                // 输入框中
                searchText2,//始发三字码
                searchText2Bus,
                dpt,
                searchText3,  // 经停输入框文字
                searchText3Bus,  // 经停输入框存储
                pst,  // 经停三字码
                searchText4,
                searchText4Bus,
                arrv,
            }
        }, () => {
            this.chooseDateEvent(date)
        })
    }

    firstResponse(response = {}) {
        let contact = store.getState().role.concat;
        let ihome = store.getState().role.phone;
        let {
            days,
            demand = {},
            // demandPlan,
            msg,
            // periodValidity,
            releaseDemandPoint,
            releaseDemandPointNm,

            targetPoint,//响应方机场三字码
            targetPointNm,
            title,
        } = response;

        let {
            demandPlans = [],
            periodValidity = "", //需求有效期
            sailingtime = "", //计划执行周期
            demandtype = '',
        } = demand.obj;

        let {
            dpt: demandDpt, dptNm: demandDptNm, pst: demandPst, pstNm: demandPstNm, arrv: demandArrv, arrvNm: demandArrvNm,
            areaType, routeType = '0',
            mandatoryDesignation,//到达强制:"0"非强制,"1"强制
            pstMandatoryDesignation,
        } = demandPlans[0] || {};

        // 班期
        let { date } = this.state;
        if (days && days != '') {  // 拟开班期
            let tempArray = days.split('/');
            tempArray.map((value) => {
                // date.value[Number(value) - 1].type = true
                date[Number(value) - 1].type = true
            })
        }
        let searchText2 = demandDptNm,
            searchText2Bus = demandDptNm,
            dpt = demandDpt,
            searchText3 = demandPstNm,
            searchText3Bus = demandPstNm,
            pst = demandPst,
            searchText4 = demandArrvNm,
            searchText4Bus = demandArrvNm,
            arrv = demandArrv;
        // 当响应机场不是需求中的始发或者意向航点
        if (!(targetPoint == demandDpt || targetPoint == demandArrv)) {
            if (mandatoryDesignation == "0") {//若强制到达则代入需求到达点,否则代入响应机场名
                searchText4 = targetPointNm;
                searchText4Bus = targetPointNm;
                arrv = targetPoint;
            }
        }


        console.log(routeType)
        this.setState(() => {
            return {
                days,//计划执行班次结果字符串
                date,//计划执行班次数据
                periodValidity,//需求有效期
                sailingtime,//计划执行周期
                title,//标题
                contact,//联系人
                ihome,//联系电话号码
                demandtype,//需求类型

                // 航线设计类型
                airline: parseInt(routeType),

                targetPoint,//响应方机场三字码
                targetPointNm,
                // 需求中三字码及机场
                demandDpt,
                demandDptNm,
                demandPst,
                demandPstNm,
                demandArrv,
                demandArrvNm,
                mandatoryDesignation,
                pstMandatoryDesignation,

                // 输入框中
                searchText2,//始发三字码
                searchText2Bus,
                dpt,
                searchText3,  // 经停输入框文字
                searchText3Bus,  // 经停输入框存储
                pst,  // 经停三字码
                searchText4,
                searchText4Bus,
                arrv,
                designRadioValue: 1,
                alertShow: true,
            }
        }, () => {
            this.chooseDateEvent(date)
        })
    }
    // 开始加载动画
    loadingFn = () => {
        this.setState({
            loading: true,
        })
    }
    // 停止加载动画
    unLoadingFn = () => {
        this.setState({
            loading: false,
        })
    }
    success(mes) {
        Modal.success({
            title: mes,
        });
    }
    info(mes) {
        Modal.info({
            title: mes,
        });
    }
    error(mes) {
        Modal.error({
            title: mes,
        });
    }

    // TODO: 始发运力对应的事件
    searchTextChangeFn2(e) {  //输入框输入内容改变
        let target = e.target;
        let val = target.value.replace(/(^\s*)|(\s*$)/g, "");  // 去除空格
        if (val == '') {
            this.setState({
                searchText2: target.value,
                searchText2Bus: '',
                dpt: '',
                showAirportSearch2: false,
            })
        } else {
            this.setState({
                showAirportSearch2: true,
                searchText2: target.value,
            })
        }
        this.setState({
            update: true,
        }, () => {
            setTimeout(() => {
                this.setState({
                    update: false,
                })
            })
        })
    }
    inputClickFn2(e) {  // 输入框焦点事件
        let target = e.target;
        let val = target.value.replace(/(^\s*)|(\s*$)/g, "");  // 去除空格
        let showAirportSearch2 = false;
        if (val == '') {
            showAirportSearch2 = false;
        } else {
            showAirportSearch2 = true;
        }
        this.setState(() => {
            return {
                showAirportSearch2: false,
                airlineWarnShow: false,
                airline1WarnShow: false,
                airline2WarnShow: false,
            }
        })
    }
    airportData2(data) {  // 接受下拉框传来的数据
        this.setState((prev) => {
            if (data.name == prev.searchText3 || data.name == prev.searchText4) {
                return {
                    searchText2: '',
                    searchText2Bus: '',
                    dpt: '',  // 始发三字码
                    showAirportSearch2: false,
                    alertShow: true,
                }
            } else {
                return {
                    searchText2: data.name,
                    searchText2Bus: data.name,
                    dpt: data.code,  // 始发三字码
                    showAirportSearch2: false,
                    alertShow: true,
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
                searchText3: target.value,
                searchText3Bus: '',
                pst: '',
                showAirportSearch3: false,
            })
        } else {
            this.setState({
                showAirportSearch3: true,
                searchText3: target.value,
            })
        }
        this.setState({
            update: true,
        }, () => {
            setTimeout(() => {
                this.setState({
                    update: false,
                })
            })
        })
    }
    inputClickFn3(e) {  // 输入框焦点事件
        let target = e.target;
        let val = target.value.replace(/(^\s*)|(\s*$)/g, "");  // 去除空格
        let showAirportSearch3 = false;
        if (val == '') {
            showAirportSearch3 = false;
        } else {
            showAirportSearch3 = true;
        }
        this.setState(() => {
            return {
                showAirportSearch3: false,
                airlineWarnShow: false,
                airline1WarnShow: false,
                airline2WarnShow: false,
                airlineQiangzhiWarnShow: false,
            }
        })
    }
    airportData3(data) {  // 接受下拉框传来的数据
        this.setState((prev) => {
            if (data.name == prev.searchText2 || data.name == prev.searchText4) {
                return {
                    searchText3: '',
                    searchText3Bus: '',
                    pst: '',
                    showAirportSearch3: false,
                    alertShow: true,
                }
            } else {
                return {
                    searchText3: data.name,
                    searchText3Bus: data.name,
                    pst: data.code,
                    showAirportSearch3: false,
                    alertShow: true,
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
                searchText4: target.value,
                searchText4Bus: '',
                arrv: '',
                showAirportSearch4: false,
            })
        } else {
            this.setState(() => {
                // this.state.group_arrv.arrvNm = target
                return {
                    showAirportSearch4: true,
                    searchText4: target.value,
                    // group_arrv: this.state.group_arrv,
                }
            })
        }
        this.setState({
            update: true,
        }, () => {
            setTimeout(() => {
                this.setState({
                    update: false,
                })
            })
        })
    }
    inputClickFn4(e) {  // 输入框焦点事件
        let target = e.target;
        let val = target.value.replace(/(^\s*)|(\s*$)/g, "");  // 去除空格
        let showAirportSearch4 = false;
        if (val == '') {
            showAirportSearch4 = false;
        } else {
            showAirportSearch4 = true;
        }
        this.setState(() => {
            return {
                showAirportSearch4: false,
                airlineWarnShow: false,
                airline1WarnShow: false,
                airline2WarnShow: false,
                airlineQiangzhiWarnShow: false,
            }
        })
    }
    airportData4(data) {  // 接受下拉框传来的数据
        this.setState((prev) => {
            if (data.name == prev.searchText2 || data.name == prev.searchText3) {
                return {
                    searchText4: '',
                    searchText4Bus: '',
                    arrv: '',
                    showAirportSearch4: false,
                    alertShow: true,
                }
            } else {
                return {
                    searchText4: data.name,
                    searchText4Bus: data.name,
                    arrv: data.code,
                    showAirportSearch4: false,
                    alertShow: true,
                }
            }
        })
    }

    // 转换时间格式
    mountTime = (time) => {
        return time ? moment(time, 'hh/mm') : null;
    }
    dptLevel(e, time) {
        this.setState({
            dptLevel: time,
        })
    }
    dptEnter(e, time) {
        this.setState({
            dptEnter: time,
        })
    }
    pstLevel(e, time) {
        this.setState({
            pstLevel: time,
        })
    }
    pstEnter(e, time) {
        this.setState({
            pstEnter: time,
        })
    }
    arrvLevel(e, time) {
        this.setState({
            arrvLevel: time,
        })
    }
    arrvEnter(e, time) {
        this.setState({
            arrvEnter: time,
        })
    }
    pstBackLevel(e, time) {
        this.setState({
            pstBackLevel: time,
        })
    }
    pstBackEnter(e, time) {
        this.setState({
            pstBackEnter: time,
        })
    }
    // 报价方式下拉列表 点击事件
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

    airlineChangeFn = (e) => {
        let value = e.target.value;
        this.setState({
            airline: value,
        })
    }
    // 时刻要求
    timeRadioChangeFn(e) {  // 时刻要求（0-白班，1-晚班，2-不限）
        this.setState({
            timeRequirements: e.target.value,
            alertShow: true,
        })
    }
    // TODO: 拟开班期 ，向DateChoose组件传递方法
    chooseDateEvent = (value) => {
        // let date = this.state.date;
        // date.value = value;
        this.setState({
            data: value,
            daysWarnShow: false,
            alertShow: true,
        }, () => {
            this.changeEvent(this.state.sailingtime)
        })
        // console.log(data)
    }
    // 计划执行时间
    changeEvent(date) {
        let performShift = 0;
        switch (date) {
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
                performShift = this.calculateUnset(date);  // 传字符串
                break;
        };
        this.setState({
            performShift
        })
        console.log(performShift)
    }
    //固定计划执行班次计算方法
    calculateFixation(num) {
        let performShift;
        let date = this.state.date;
        let dateTrueNum = [];//选择执飞日期
        for (let i = 0; i < date.length; i++) {
            if (date[i].type == true) {
                if (i == 6) {
                    dateTrueNum.push("0")
                } else {
                    dateTrueNum.push(date[i].name)
                }
            }
        };
        performShift = parseInt(num / 7) * dateTrueNum.length;//整周所含执行班次
        for (let i = 0; i < num % 7; i++) {
            for (let j = 0; j < dateTrueNum.length; j++) {
                if (i == dateTrueNum[j]) {
                    performShift = 1 + performShift;
                }
            }
        };
        return performShift;
    }
    textChangeFn(e) {  // 其他说明改变
        let target = e.target;
        this.setState({
            remark: target.value,
            textNum: e.target.value.length,
            alertShow: true,
        })
    }
    contactFocusFn() {
        this.setState({
            contactWarnShow: false
        })
    }
    contactChangeFn(e) {  // 联系人失焦事件
        let target = e.target;
        let val = target.value.replace(/(^\s*)|(\s*$)/g, "");
        this.setState({
            contact: val,
            alertShow: true,
        })
    }
    ihomeChangeFn(e) {  // 联系方式input事件
        let target = e.target;
        let val = target.value.replace(/\D/g, '');
        this.setState({
            ihome: val,
            ihomeWarnShow: false,
            alertShow: true,
        })
    }
    ihomeBlurFn(e) {  // 联系方式失焦事件
        let target = e.target;
        let val = target.value.replace(/(^\s*)|(\s*$)/g, "");
        if (!(/^1[3|4|5|8][0-9]\d{8}$/.test(val)) && (val != '')) {
            this.setState({
                ihomeWarnShow: true
            })
        }
    }
    disabledDate(current) {
        return current && current < moment().subtract(1, 'd').add(1, "M")
    }
    periodValidityOpenFn(periodValidity, status) {  // 需求有效期打开
        if (status) {
            if (!periodValidity) {
                this.setState({
                    periodValidity: moment().add(1, 'M').format(dateFormat)
                })
            }
        }
    }
    periodValidityChangeFn(dates, dateString) {  // 需求有效期
        this.setState({
            periodValidity: dateString,
            periodValidityWarnShow: false,
            alertShow: true,
            periodValidity3WarnShow: false,
        })
    }
    // 关闭表单
    closePopup = () => {
        emitter.emit('openPopup', {
            popupType: 0,
            popupMes: {},
        })
    }
    // 关闭表单前判断
    closeFn = () => {  // 点击“取消”
        this.closePopup()
        return;
        let { editType } = this.state;
        if (editType === 2 || editType === 3 || editType === 4) {
            this.closePopup();
        } else {
            if (this.state.alertShow) {
                this.setState({
                    showSaveOrNotSave: true,
                });
            } else {
                this.closePopup();
            }
        }
    }

    // 检查航点
    checkAirPoint = () => {
        let {
            dpt,
            pst,
            arrv,
            airline,//航路设计
            areaType,//

            targetPoint,//本场
            targetPointNm,

            demandDpt,//需求中始发
            demandDptNm,
            demandPst,
            demandPstNm,
            demandArrv,
            demandArrvNm,
            mandatoryDesignation,//需求中强制到达
            pstMandatoryDesignation,//需求中强制经停

        } = this.state;
        console.log(targetPoint)
        let bool = false, tip = '';
        if (dpt == '') {
            bool = false; tip = '始发航点不能为空';
        } else if (dpt != demandDpt) {
            bool = false; tip = '始发航点必须为' + demandDptNm;
        } else {
            if (pst == '' && airline != 0) { //当不为直飞时经停航点不能为空
                bool = false; tip = '经停航点不能为空';
            } else if (arrv == '') {
                bool = false; tip = '到达航点不能为空';
            } else {
                if (dpt == targetPoint || pst == targetPoint || arrv == targetPoint) {
                    if (mandatoryDesignation == '1') {
                        if (airline == 0) {
                            if (arrv == demandArrv || dpt == demandArrv) {
                                bool = true; tip = '';
                            } else {
                                bool = false; tip = '到达点强制必须为' + demandArrvNm;
                            }
                        } else if (airline == 1) {
                            // 当为经停航线时经停点必须为强制经停航点,且本场只能位于始发或到达
                            if (pst == demandArrv && arrv != targetPoint) {
                                bool = true; tip = '';
                            } else if (pst != demandArrv) {
                                bool = false; tip = '经停点强制必须为' + demandArrvNm;
                            } else if (arrv == targetPoint) {
                                bool = false; tip = '本场只能在始发或经停,或者可以选择合适的航路'
                            }
                        } else if (airline == 2) {
                            if (pst != demandArrv) {//经停为强制到达点时满足
                                bool = false; tip = '经停点强制必须为' + demandArrvNm;
                            } else {
                                bool = true; tip = '';
                            }
                        }

                    } else if (pstMandatoryDesignation == '1') {
                        if (airline == 0) {
                            bool = false; tip = '请填写符合航司要求的强制经停航线'
                        } else if (airline == 1) {
                            if (pst == demandPst) {
                                bool = true; tip = '';
                            } else {
                                bool = false; tip = '经停点强制必须为' + demandPstNm;
                            }
                        } else if (airline == 2) {
                            if (pst != demandArrv) {//经停为强制到达点时满足
                                bool = false; tip = '经停点强制必须为' + demandArrvNm;
                            } else {
                                bool = true; tip = false;
                            }
                        }

                    } else if (airline == 0) {
                        bool = true; tip = '';
                    } else if (airline == 1) {
                        if (pst == targetPoint || dpt == targetPoint) {
                            bool = true; tip = '';
                        } else {
                            bool = false; tip = '经停点必须为' + targetPointNm;
                        }
                    } else if (airline == 2) {
                        if (arrv == targetPoint || dpt == targetPoint) {
                            bool = true; tip = '';
                        } else {
                            bool = false; tip = '到达点必须为' + targetPointNm;
                        }
                    }

                } else {
                    bool = false; tip = '必须包含本场';
                }

            }
        }
        this.setState({
            planMsg: tip,
        })
        return {
            bool, tip
        }
    }
    // 检查报价方式
    checkPrice = () => {
        // 判断合作方式是否有值
        let { quoteType, quotedPrice } = this.state;
        let quoteMsg = '';
        if (quoteType == '' || !quoteType) {
            quoteMsg = '请填写合作方式';
        } else if (quoteType != '0' && Number(quotedPrice) <= 0) {
            quoteMsg = '请填写报价'
        } else if ((quoteType != '0' && Number(quotedPrice) > 0) || quoteType == '0') {
            quoteMsg = '';
        }
        if (quoteMsg != '') {
            this.setState({
                planMsg: quoteMsg,
            })
            return false;
        } else {
            return true;
        }
    }
    // 新增方案
    saveProject = () => {
        let {
            searchText2Bus: dptNm,
            searchText3Bus: pstNm,
            searchText4Bus: arrvNm,
            dpt,
            pst,
            arrv,
            quoteType,
            quotedPrice,
            projectIndex,

            airline,

            responsePlans = [],

            targetPoint,
            targetPointNm,

            demandDpt,
            demandDptNm,
            demandPst,
            demandPstNm,
            demandArrv,
            demandArrvNm,
            mandatoryDesignation,
            pstMandatoryDesignation,

            id: responseId,//responseId

        } = this.state;

        responsePlans = responsePlans ? responsePlans : [];

        // 检查航点
        let { bool, tip } = this.checkAirPoint();
        if (bool == false) {
            return;
        }
        // 检查报价方式
        let res = this.checkPrice();
        if (res == false) {
            return;
        }

        let calculationId = null, calculationState = null, click = 0, id = null, state = 0;
        let index = Number(projectIndex);
        let routeType = String(airline);
        if (index > 2) {//index 大于2,最大方案数三条 0,1,2
            return;
        }
        if (index === -1) {//等于-1表示新增方案
            quotedPrice = Number(quotedPrice);
            if (responsePlans && responsePlans.length <= 3) {
                responsePlans.push({
                    calculationId,
                    calculationState,
                    click,
                    id,
                    responseId,
                    state,
                    dpt,
                    dptNm,
                    pst,
                    pstNm,
                    arrv,
                    arrvNm,
                    quoteType,
                    quotedPrice,
                    state,
                    routeType,
                })
                this.setState(() => {
                    return {
                        responsePlans,
                        // searchText2: '',//始发三字码
                        // searchText2Bus: '',
                        // dpt: '',
                        searchText3: '',  // 经停输入框文字
                        searchText3Bus: '',  // 经停输入框存储
                        pst: '',  // 经停三字码
                        searchText4: '',
                        searchText4Bus: '',
                        arrv: '',
                        quoteType: '',
                        quotedPrice: '',
                    }
                })
            }

        } else {
            responsePlans
            this.setState((prv, a) => {
                let { responsePlans } = prv;
                Object.assign(responsePlans[index], {
                    dpt,
                    pst,
                    arrv,
                    dptNm,
                    pstNm,
                    arrvNm,
                    quoteType,
                    quotedPrice,
                    routeType,
                })
                console.log(responsePlans);
                return {
                    responsePlans,
                    searchText3Bus:'',
                    searchText4Bus:'',
                    searchText3:'',
                    searchText4:'',
                    pst:'',
                    arrv:'',
                    quoteType:'',
                    quotedPrice:'',
                    airline: Number(airline),
                    projectIndex: -1,

                }
            })
        }
    }
    collectData = (type) => {
        let {
            delResponsePlanIds = '',
            demandId,
            demandtype,
            id,
            days,
            performShift,
            periodValidity,
            timeRequirements,
            contact,
            ihome,
            remark,
            responsePlans,
        } = this.state;
        responsePlans = responsePlans && responsePlans.length ? responsePlans : [];
        let employeeId = store.getState().role.id;
        return {
            delResponsePlanIds,
            demandId,
            demandtype,
            employeeId,
            id,
            days,
            performShift,
            periodValidity,
            timeRequirements,
            contact,
            ihome,
            remark,
            responsePlans,
            savatype: type,
        }
    }
    // 保存草稿
    saveSendDataFn = (type, index, item) => {
        let demand = this.collectData(type);
        console.log(demand)
        Axios({
            method: 'post',
            url: '/responseAdd',
            data: JSON.stringify(demand),
            dataType: 'json',
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        }).then((response) => {
            console.log(response)
            let { opResult, msg } = response.data;
            if (opResult === '0') {
                this.success('已为您保存草稿，请在下次点开后操作');
                this.getUpdate();
            } else {
                this.error(msg)
            }
        })
    }
    editPlan = (index) => {
        console.log(index)
        let { responsePlans = [] } = this.state;
        console.log(/^[012]$/.test(index))
        if (!(/^[012]$/.test(index)) || responsePlans == null || responsePlans == undefined || responsePlans.length <= 0) {
            return
        } else {
            let {
                dptNm = '',
                pstNm = '',
                arrvNm = '',
                dpt = '',
                pst = '',
                arrv = '',

                quoteType,
                quotedPrice,
                projectIndex,

                routeType: airline,

                targetPoint,
                targetPointNm,

                demandDpt,
                demandDptNm,
                demandPst,
                demandPstNm,
                demandArrv,
                demandArrvNm,
                mandatoryDesignation,
                pstMandatoryDesignation,

                id,//方案id

            } = responsePlans[index];
            let searchText2 = dptNm,
                searchText2Bus = dptNm;
            let searchText3 = pstNm,
                searchText3Bus = pstNm;
            let searchText4 = arrvNm,
                searchText4Bus = arrvNm;

            this.setState({
                searchText2Bus,
                searchText3Bus,
                searchText4Bus,
                searchText2,
                searchText3,
                searchText4,
                dpt,
                pst,
                arrv,
                quoteType,
                quotedPrice,
                airline: Number(airline),
                projectIndex: index,
            })
        }
    }
    delPlan = (index) => {
        console.log(index)
    }
    // 方案节点
    plansEle = () => {
        let { responsePlans, editType } = this.state;
        if ((editType == 1 || editType == 2) && responsePlans && responsePlans.length) {
            return responsePlans.map((value, index) => {
                let {
                    dpt, dptNm = '',
                    pst, pstNm = '',
                    arrv, arrvNm = '',
                    quoteType = '', quotedPrice = '',
                } = value;
                let quoteTypeStr = '', quotedPriceStr = '';
                switch (Number(quoteType)) {
                    case 0: quoteTypeStr = '待议'; break;
                    case 1: quoteTypeStr = '定补'; quotedPriceStr = quotedPrice + '万/班'; break;
                    case 2: quoteTypeStr = '保底'; quotedPriceStr = quotedPrice + '万/时'; break;
                }

                return (
                    <div className={style['plan-item']} key={index}>
                        <div className={style['plan-item-title']}>方案{index + 1}:</div>
                        <div className={style['plan-item-body']}>
                            <div className={style['airline']}>
                                <div className={style['point']}>
                                    <span>始发</span>
                                    <span>{dptNm}</span>
                                </div>
                                {
                                    pst ? (
                                        <Fragment>
                                            <div className={style['point']}>
                                                <i className={`${style['flight-icon']} iconfont`}>&#xe672;</i>
                                            </div>
                                            <div className={style['point']}>
                                                <span>经停</span>
                                                <span>{pstNm}</span>
                                            </div>
                                            <div className={style['point']}>
                                                <i className={`${style['flight-icon']} iconfont`}>&#xe672;</i>
                                            </div>
                                        </Fragment>
                                    ) : (
                                            <div className={style['point']}>
                                                <i className={`${style['flight-icon']} iconfont`}>&#xe672;</i>
                                            </div>
                                        )
                                }
                                <div className={style['point']}>
                                    <span>到达</span>
                                    <span>{arrvNm}</span>
                                </div>
                            </div>
                            <div className={style['price']}>
                                <span>报价</span>
                                <span>{quoteTypeStr} {quotedPriceStr}</span>
                            </div>
                            <div className={style['handle']}>
                                <div className={style['calculate']}>申请测算</div>
                                <div className={style['handle-btn-con']}>
                                    <span className={`${style['handle-btn']} iconfont`} onClick={this.editPlan.bind(this, index)}>&#xe645;</span>
                                    <span className={`${style['handle-btn']} iconfont`} onClick={this.delPlan.bind(this, index)}>&#xe67a;</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
        }
        return '';
    }

    render() {
        let { editType, airline, quoteType, quotedPrice, periodValidity } = this.state;

        let axis = {  // 下拉搜索样式
            position: 'absolute',
            top: '40px',
            right: '0',
            maxHeight: '220px',
            width: '230px',
            overflowY: 'scroll',
            background: 'white',
            zIndex: 22,
            boxShadow: '0 2px 11px rgba(85,85,85,0.1)'
        };
        let dptAirportSearch = this.state.countryType == 0
            ? <AirportSearch
                update={this.state.update}
                axis={axis}
                resData={this.airportData2.bind(this)}
                searchText={this.state.searchText2 || ''} />
            : <AllAirportSearch
                update={this.state.update}
                axis={axis}
                resData={this.airportData2.bind(this)}
                searchText={this.state.searchText2 || ''} />;
        let pstAirportSearch = this.state.countryType == 0
            ? <AirportSearch
                update={this.state.update}
                axis={axis}
                resData={this.airportData3.bind(this)}
                searchText={this.state.searchText3 || ''} />
            : <AllAirportSearch
                update={this.state.update}
                axis={axis}
                resData={this.airportData3.bind(this)}
                searchText={this.state.searchText3 || ''} />;
        let arrvAirportSearch = this.state.countryType == 0
            ? <AirportSearch
                update={this.state.update}
                axis={axis}
                resData={this.airportData4.bind(this)}
                searchText={this.state.searchText4 || ''} />
            : <AllAirportSearch
                update={this.state.update}
                axis={axis}
                resData={this.airportData4.bind(this)}
                searchText={this.state.searchText4 || ''} />;

        const menu = (
            <Menu onClick={this.menuClickFn.bind(this)}>
                <Menu.Item key="2">保底</Menu.Item>
                <Menu.Item key="1">定补</Menu.Item>
                <Menu.Item key="0">待议</Menu.Item>
            </Menu>
        );
        return (
            <div className={style['container']}>
                <div className={style['content']}>
                    <div className={style['title']}>
                        <h3>您想如何使用该运力</h3>
                        <span className={'iconfont'} onClick={this.closeFn}>&#xe62c;</span>
                    </div>
                    <div className={style['body']}>
                        <div className={style['grey-bg']}>
                            {/* 航路设计 */}
                            <div className={style['route-type']}>
                                <span>航路设计</span>
                                <RadioGroup name="radiogroup"
                                    value={this.state.airline}
                                    onChange={this.airlineChangeFn.bind(this)}>
                                    <Radio value={0} style={{ fontSize: '1.2rem' }}>直飞</Radio>
                                    <Radio value={1} style={{ fontSize: '1.2rem' }}>经停</Radio>
                                    <Radio value={2} style={{ fontSize: '1.2rem', display: editType === 1 || editType === 2 ? '' : 'none' }}>甩飞</Radio>
                                </RadioGroup>
                                {this.state.planMsg}
                            </div>
                            {/* 航点 */}
                            <div className={style['airpoint']}>
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
                                                onClick={(e) => { e.stopPropagation() }}
                                                onChange={this.searchTextChangeFn2.bind(this)}
                                                onFocus={this.inputClickFn2.bind(this)}
                                                placeholder={'请输入始发航点'}
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
                                {airline != 0 &&
                                    <div className={style['col-item']}>
                                        {/*经停*/}
                                        <div className={style['common-style']}>
                                            <div>
                                                <i className={'iconfont'}>&#xe6ad;</i>
                                                <span>经停</span>
                                            </div>
                                            <div>
                                                <input type="text" maxLength="20"
                                                    value={this.state.searchText3}
                                                    onClick={(e) => { e.stopPropagation() }}
                                                    onChange={this.searchTextChangeFn3.bind(this)}
                                                    onFocus={this.inputClickFn3.bind(this)}
                                                    placeholder={'请输入经停航点'}
                                                />
                                                <div className={style['drop-list']}>
                                                    {
                                                        this.state.showAirportSearch3 && pstAirportSearch
                                                    }
                                                </div>
                                            </div>
                                            <span className={style['msg']}>
                                                {/* {this.checkDpt('dpt')} */}
                                            </span>
                                        </div>
                                    </div>
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
                                                onClick={(e) => { e.stopPropagation() }}
                                                onChange={this.searchTextChangeFn4.bind(this)}
                                                onFocus={this.inputClickFn4.bind(this)}
                                                placeholder={'请输入到达航点'}
                                            />
                                            <div className={style['drop-list']}>
                                                {
                                                    this.state.showAirportSearch4 && arrvAirportSearch
                                                }
                                            </div>
                                        </div>
                                        <span className={style['msg']}>
                                            {/* {this.checkDpt('dpt')} */}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* 时刻 */}
                            {
                                (editType == 3 || editType == 4) &&
                                <div className={style['time-container']}>
                                    {/* 始发时刻 */}
                                    <div className={`${style['time-col']}`}>
                                        <div className={style['time-box']}>
                                            {/* 始发出港时刻 */}
                                            <div className={`${style['common-style']} ${style['time-item']}`}>
                                                <div>
                                                    <span className={style['bgColorBlue']}>出</span>
                                                </div>
                                                <div>
                                                    <span className={"ant-time-picker-icon"}></span>
                                                    <div className={style['drop-list-time']}>
                                                        <TimePicker format={format} placeholder={'请选择出港时刻'} onChange={this.dptLevel.bind(this)} value={this.mountTime(this.state.dptLevel)} />
                                                    </div>
                                                </div>
                                                <span className={style['msg']} >
                                                    {/* {this.checkTime('dptLevel')} */}
                                                </span>
                                                <span className={style['ident']} style={{ color: '#4172f4' }}>去程</span>
                                            </div>
                                            {/* 始发进港时刻 */}
                                            <div className={`${style['common-style']} ${style['time-item']}`}>
                                                <div>
                                                    <span className={style['bgColorYellow']}>进</span>
                                                </div>
                                                <div>
                                                    <input type="text" maxLength="20" />
                                                    <span className={"ant-time-picker-icon"}></span>
                                                    <div className={style['drop-list-time']}>
                                                        <TimePicker format={format} placeholder={'请选择进港时刻'} onChange={this.dptEnter.bind(this)} value={this.mountTime(this.state.dptEnter)}
                                                            disabled={this.state.airline == 0 ? (this.state.arrvLevel ? false : true) : (this.state.pstBackLevel ? false : true)} />
                                                    </div>
                                                </div>
                                                <span className={style['msg']}>
                                                    {/* {this.checkTime('dptEnter')} */}
                                                </span>
                                                <span className={style['ident']} style={{ color: '#ceac30' }}>返程</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/*  */}

                                    {
                                        airline != 0 ? (
                                            /* 1:经停 经停时刻 */
                                            <div className={style['time-col']}>
                                                <div className={style['time-col-items']}>
                                                    <div className={style['time-col-icon']}>
                                                        <span className={'iconfont'}>&#xe6ad;</span>
                                                    </div>
                                                    <div className={style['time-col-center']}>
                                                        {/* 经停进港时刻 */}
                                                        <div className={`${style['common-style']} ${style['time-item']} ${style['small-time-item']}`}>
                                                            <div>
                                                                <span className={style['bgColorBlue']}>进</span>
                                                            </div>
                                                            <div>
                                                                <span className={"ant-time-picker-icon"}></span>
                                                                <div className={style['drop-list-time']}>
                                                                    <TimePicker format={format} placeholder={'进港时刻'} onChange={this.pstEnter.bind(this)} value={this.mountTime(this.state.pstEnter)} disabled={this.state.dptLevel ? false : true} />
                                                                </div>
                                                            </div>
                                                            <span className={style['msg']}>
                                                                {/* {this.checkTime('pstEnter')} */}
                                                            </span>
                                                        </div>
                                                        {/* 经停出港时刻 */}
                                                        <div className={`${style['common-style']} ${style['time-item']} ${style['small-time-item']}`}>
                                                            <div>
                                                                <span className={style['bgColorBlue']}>出</span>
                                                            </div>
                                                            <div>
                                                                <span className={"ant-time-picker-icon"}></span>
                                                                <div className={style['drop-list-time']}>
                                                                    <TimePicker format={format} placeholder={'出港时刻'} onChange={this.pstLevel.bind(this)} value={this.mountTime(this.state.pstLevel)} disabled={this.state.pstEnter ? false : true} />
                                                                </div>
                                                            </div>
                                                            <span className={style['msg']}>
                                                                {/* {this.checkTime('pstLevel')} */}
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
                                                                <span className={style['bgColorYellow']}>出</span>
                                                            </div>
                                                            <div>
                                                                <span className={"ant-time-picker-icon"}></span>
                                                                <div className={style['drop-list-time']}>
                                                                    <TimePicker format={format} placeholder={'出港时刻'} onChange={this.pstBackLevel.bind(this)} value={this.mountTime(this.state.pstBackLevel)} disabled={this.state.pstBackEnter ? false : true} />
                                                                </div>
                                                            </div>
                                                            <span className={style['msg']}>
                                                                {/* {this.checkTime('pstBackLevel')} */}
                                                            </span>
                                                        </div>
                                                        {/* 返回经停进港时刻 */}
                                                        <div className={`${style['common-style']} ${style['time-item']} ${style['small-time-item']}`}>
                                                            <div>
                                                                <span className={style['bgColorYellow']}>进</span>
                                                            </div>
                                                            <div>
                                                                <span className={"ant-time-picker-icon"}></span>
                                                                <div className={style['drop-list-time']}>
                                                                    <TimePicker format={format} placeholder={'进港时刻'} onChange={this.pstBackEnter.bind(this)} value={this.mountTime(this.state.pstBackEnter)} disabled={this.state.arrvLevel ? false : true} />
                                                                </div>
                                                            </div>
                                                            <span className={style['msg']}>
                                                                {/* {this.checkTime('pstBackEnter')} */}
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
                                            {/* 到达进港时刻 */}
                                            <div className={`${style['common-style']} ${style['time-item']}`}>
                                                <div>
                                                    <span className={style['bgColorBlue']}>进</span>
                                                </div>
                                                <div>
                                                    <input type="text" maxLength="20" />
                                                    <span className={"ant-time-picker-icon"}></span>
                                                    <div className={style['drop-list-time']}>
                                                        <TimePicker format={format} placeholder={'请选择进港时刻'} onChange={this.arrvEnter.bind(this)} value={this.mountTime(this.state.arrvEnter)}
                                                            disabled={this.state.airline == 0 ? (this.state.dptLevel ? false : true) : (this.state.pstLevel ? false : true)} />
                                                    </div>
                                                </div>
                                                <span className={style['msg']}>
                                                    {/* {this.checkTime('arrvEnter')} */}
                                                </span>
                                            </div>
                                            {/* 到达出港时刻 */}
                                            <div className={`${style['common-style']} ${style['time-item']}`}>
                                                <div>
                                                    <span className={style['bgColorYellow']}>出</span>
                                                </div>
                                                <div>
                                                    <input type="text" maxLength="20" />
                                                    <span className={"ant-time-picker-icon"}></span>
                                                    <div className={style['drop-list-time']}>
                                                        <TimePicker format={format} placeholder={'请选择出港时刻'} onChange={this.arrvLevel.bind(this)} value={this.mountTime(this.state.arrvLevel)} disabled={this.state.arrvEnter ? false : true} />
                                                    </div>
                                                </div>
                                                <span className={style['msg']}>
                                                    {/* {this.checkTime('arrvLevel')} */}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/*  */}
                                </div>
                            }
                            {/* 合作 + 新增方案 */}
                            {
                                (editType == 1 || editType == 2) &&
                                <div className={style['cooperation']}>
                                    <div className={style['common-style']} style={{ flexDirection: 'row', height: '40px' }}>
                                        <div style={{ flex: 1, padding: '0 8px' }}>
                                            <span>合作方式</span>
                                        </div>
                                        <div>
                                            <Dropdown overlay={menu} trigger={['click']}>
                                                <div className={`${style['col-text']} ${style['flex']}`} style={{ textIndent: '7px', width: '77px' }}>
                                                    <div style={{ width: '47px' }}>{quoteType === "0" ? '待议' : ''}{quoteType === "1" ? '定补' : ''}{quoteType === "2" ? '保底' : ''}</div>
                                                    <Icon type="caret-down" />
                                                </div>
                                            </Dropdown>
                                            <input style={{ width: '60px', height: '70%', borderLeft: '1px solid #ddd' }} type="text"
                                                value={quotedPrice}
                                                disabled={quoteType === '0' ? true : false}
                                                onChange={this.priceChangeFn.bind(this)} />
                                            <span>万</span>
                                        </div>
                                        <span className={style['msg']}>
                                            {/* {this.checkPrice('quote')} */}
                                        </span>
                                    </div>
                                    <div className={style['addNewPlan']} onClick={this.saveProject}>
                                        {this.state.projectIndex == '-1' ? '新增方案' : '编辑方案'}
                                    </div>
                                </div>
                            }
                        </div>
                        {/* 方案容器 */}
                        <div className={style['plans-con']}>
                            {/* 方案 */}
                            {this.plansEle()}


                        </div>
                        <div className={style['other-items-con']}>
                            <div className={style['other-item']}>
                                <span>时刻要求</span>
                                <div className={style['right-item']}>
                                    <RadioGroup name="radiogroup"
                                        defaultValue={0}
                                        value={this.state.timeRequirements}
                                        onChange={this.timeRadioChangeFn.bind(this)}>
                                        <Radio value={2} style={{ fontSize: '1rem', margin: '0' }}>不限</Radio>
                                        <Radio value={0} style={{ fontSize: '1rem', margin: '0' }}>白班</Radio>
                                        <Radio value={1} style={{ fontSize: '1rem', margin: '0' }}>晚班</Radio>
                                    </RadioGroup>
                                </div>
                            </div>
                            <div className={style['common-style']} style={{ background: '#f6f6f6', width: '31%' }}>
                                <div>
                                    <span>方案有效期</span>
                                </div>
                                <div className={style['date']}>
                                    <DatePicker
                                        value={periodValidity ? moment(periodValidity, "YYYY/MM/DD") : null}
                                        format="YYYY-MM-DD"
                                        placeholder={""}
                                        disabledDate={this.disabledDate}
                                        onChange={this.periodValidityChangeFn.bind(this)}
                                        onOpenChange={this.periodValidityOpenFn.bind(this, periodValidity)}
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
                                    {/* {this.checkPeriodValidity('periodValidity')} */}
                                </span>
                            </div>
                            <div className={style['other-item']}>
                                <span>拟开班期</span>
                                <div className={style['right-item']}>
                                    <DateChoose data={this.state.date} chooseDate={(data) => this.chooseDateEvent(data)} />
                                </div>
                            </div>

                        </div>
                        <div className={`${style['seventh']} ${style['flex']}`}>
                            其他说明
                                <textarea className={style['text-area']} maxLength="200"
                                value={this.state.remark}
                                onKeyDown={(e) => { if (e.keyCode == 13) e.preventDefault() }}
                                onChange={this.textChangeFn.bind(this)}
                            ></textarea>
                            <span className={style['row-border']} style={{ top: '26px' }}></span>
                            <span className={style['row-border']} style={{ top: '52px' }}></span>
                            <span className={style['row-border']} style={{ top: '78px' }}></span>
                            <span className={style['row-border']} style={{ top: '104px' }}></span>
                            <span className={style['row-border']} style={{ top: '130px' }}></span>
                            {/* <span className={style['row-border']} style={{ top: '156px' }}></span> */}
                            <span style={{ position: 'absolute', bottom: '5px', right: '25px' }}>{200 - this.state.remark.length}/200</span>
                        </div>
                        <div className={style['contact-info']}>
                            <div className={style['common-style']} style={{ width: '32%', background: '#f6f6f6', marginRight: '10px' }}>
                                <div>
                                    <span>联系人</span>
                                </div>
                                <div>
                                    <input type="text" maxLength="20" placeholder="请输入联系人名"
                                        value={this.state.contact}
                                        onFocus={this.contactFocusFn.bind(this)}
                                        onChange={this.contactChangeFn.bind(this)}
                                        disabled={editType === 3 || editType === 4 ? true : false}
                                    // onChange={this.handleSeatingChange} 
                                    />
                                </div>
                                <span className={style['msg']}>
                                    {/* {this.checkSeating('seating')} */}
                                </span>
                            </div>
                            <div className={style['common-style']} style={{ width: '32%', background: '#f6f6f6' }}>
                                <div>
                                    <span>移动电话</span>
                                </div>
                                <div>
                                    <input type="text" maxLength="20" placeholder="请输入联系电话"
                                        value={this.state.ihome}
                                        onChange={this.ihomeChangeFn.bind(this)}
                                        onBlur={this.ihomeBlurFn.bind(this)}
                                        disabled={editType === 3 || editType === 4 ? true : false}
                                    // onChange={this.handleSeatingChange} 
                                    />
                                </div>
                                <span className={style['msg']}>
                                    {/* {this.checkSeating('seating')} */}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style['footer']}>
                    <div className={`${style['submit-btn']} ${style['saveDraft']}`} onClick={this.saveSendDataFn.bind(this, '3')}>保存草稿</div>
                    <div className={`${style['submit-btn']} ${style['confirm']}`} >确认提交航线方案</div>
                    <div className={`${style['submit-btn']} ${style['cancel']}`}>取消</div>
                </div>
            </div>
        )
    }
}