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
import DealPwd from '../../components/dealPwd/dealPwd';

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
            timer: null,
            update: true,
            role: store.getState().role.role,//当前用户角色
            currentEmployeedId: store.getState().role.id,//当前用户id
            airList: store.getState().airList,//城市
            visible_response: false,//响应 二次确认框
            visible_affirm: false,//确认选择方案 二次确认框
            loading: false,

            data: [ //拟开航班默认数据
                { name: "1", type: true },
                { name: "2", type: true },
                { name: "3", type: true },
                { name: "4", type: true },
                { name: "5", type: true },
                { name: "6", type: true },
                { name: "7", type: true }
            ],
            editType: 1, //编辑/响应 1:响应,2:重新编辑
            air: [],//机型
            releaseDemandPoint: '',// 发布需求的机场的本场三字码
            releaseDemandPointNm: '',
            targetPoint: '',
            targetPointNm: '',

            employeeId: 0,

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
            // 出进港时刻
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

            visible_response: false,
            visible_reEdit: false,
            visible_affirm: false,
            visible_afterAffirmReEdit: false,
            showDealPwd: false,
            uploading: false,
        };
    }
    componentWillMount() {
        this.getUpdate(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.getUpdate(nextProps);
    }
    componentDidMount() {
        let air = store.getState().air;//获取机型列表
        let periodValidity = moment().format().split("T")[0];
        this.setState({
            air,
            periodValidity
        });

    }

    // 获取数据,检查是否存在数据
    getUpdate(props) {
        this.loadingFn();
        let {
            id,//方案id
            responseId, //响应id
            demandId, //需求id
            dpt, //始发
            editType,//表单类型
        } = props.popupMes.transmit;

        let { role, currentEmployeedId } = this.state;

        this.setState({
            editType, demandId
        })
        if ((editType === 1 && role === '0') || (editType === 2 && role === '0')) {//航司来响应
            Axios({
                url: 'queryDraftResponse',
                method: 'post',
                params: {
                    demandId: demandId
                }
            }).then((response) => {
                if (response.data.opResult == '0') {
                    this.initEdit(response.data, editType);
                } else if (response.data.opResult === '1') {
                    this.firstResponse(response.data);
                } else {
                    this.unLoadingFn();
                }
            })
        } else if ((editType === 3 && role === '1') || (editType === 4 && role === '1')) {//机场去确认
            Axios({
                url: 'queryResponsePlanForEdit',
                method: 'post',
                params: {
                    responsePlanId: id,
                    employeeId: currentEmployeedId,
                }
            }).then((response) => {
                if (response.data.opResult == '0') {
                    this.initEdit(response.data, editType)
                } else {
                    this.unLoadingFn();
                }

            })
        }
    }
    // 第一次响应时
    firstResponse = (response) => {
        let {
            periodValidity = '',//运力有效期
            days = '',//拟开班期
            releaseDemandPoint = '',//发布航的机场三字码
            releaseDemandPointNm = '',//发布航线的机场名字
            targetPoint = '',//意向机场的三字码
            targetPointNm = '',//意向机场的名字
            title = '',//标题
            demand = {},//需求
        } = response;

        let { obj, opResult } = demand;
        let flightPlan;
        if (opResult === '0') {
            flightPlan = obj.demandPlans && obj.demandPlans.length ? obj.demandPlans[0] : {};
        }
        let { dpt = '', dptNm = '', pst = '', pstNm = '', arrv = '', arrvNm = '' } = flightPlan || {};
        let internationalAirline = obj.internationalAirline;

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
                internationalAirline,//航线类型
                existDraft: 1,//1:重来没有响应过,2:有草稿

                releaseDemandPoint,// 发布需求的机场的本场三字码
                releaseDemandPointNm,//布需求的机场的本场机场名
                targetPoint,//发布需求的机场的意向航点三字码
                targetPointNm,//发布需求的机场的意向航点机场名
                periodValidity,//需求有效期
                title,

                searchText2: dptNm,  // 始发运力输入框文字
                searchText2Bus: dptNm,  // 始发运力输入框存储
                dpt: dpt,  // 始发三字码

                searchText3: pstNm,  // 始发运力输入框文字
                searchText3Bus: pstNm,  // 始发运力输入框存储
                pst: pst,  // 始发三字码

                searchText4: arrvNm,  // 到达输入框文字
                searchText4Bus: arrvNm,  // 到达输入框存储
                arrv: arrv,  // 到达三字码

                data,//拟开班期
                airline: pst ? 1 : 0,//航路设计 默认直飞

                // employeeId: employeeId,
                sailingtime: '整年',
                sailingtimeStart: '',
                sailingtimeEnd: '',
                contact: store.getState().role.concat,
                ihome: store.getState().role.phone,
            }
        }, () => {
            this.changeEvent(this.state.sailingtime, []);
            this.unLoadingFn();
        })
    }
    // 响应过/重新编辑/确认选择方案/确认选择后重新编辑
    initEdit = (response, editType) => {
        let {
            releaseDemandPoint = '',//发布航的机场三字码
            releaseDemandPointNm = '',//发布航线的机场名字
            targetPoint = '',//意向机场的三字码
            targetPointNm = '',//意向机场的名字
            obj = null,//查出的方案数据(1,2)
            reResponse = null,//(不同接口获取道德字段名不一样 3.4)
        } = response;
        let {
            id: yId = '',//响应id(意向id)
            demandId = '',//需求id
            employeeId = 0,//
            responseProgress = '',//响应状态
            demandtype = '0',//需求类型
            airlineType = '0',//航司类型
            aircrfttyp = '',//拟飞机型
            dptTime = '',//始发航点时刻
            pstTime = '',//经停航点时刻
            arrvTime = '',//达到航点时刻
            pstTimeBack = '',//经停航点返航时刻
            days = '',//拟开班期
            performShift = '',//计划执行班次
            sailingtime = '',//计划执行周期
            periodValidity = '',//需求有效期
            seating = '',//座位布局
            contact = '',//联系人
            ihome = '',//联系电话
            remark = '',//其他说明
            title = '',//标题
            responsePlans = null,//响应方案
            internationalAirline,//航线类型(国际,国内)
        } = obj || reResponse;

        let {
            id: planId = '',//响应方案id(意向方案id)
            dpt = '',//始发航点三字码
            dptNm = '',//始发航点名字
            pst = '',//经停航点三字码
            pstNm = '',//经停航点名字
            arrv = '',//到达航点三字码
            arrvNm = '',//到达航点名字
            quoteType = '',//报价类型
            quotedPrice = '',//报价价格
            state = '',//状态
        } = responsePlans ? responsePlans[0] : {};

        let [sailingtimeStart = '', sailingtimeEnd = ''] = sailingtime ? sailingtime.split(',') : [];

        let [dptLevel = '', dptEnter = ''] = dptTime ? dptTime.split(',') : ['', ''];
        let [pstLevel = '', pstEnter = ''] = pstTime ? pstTime.split(',') : ['', ''];
        let [arrvLevel = '', arrvEnter = ''] = arrvTime ? arrvTime.split(',') : ['', ''];
        let [pstBackLevel = '', pstBackEnter = ''] = pstTimeBack ? pstTimeBack.split(',') : ['', ''];

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

        let airline = 0;
        if (editType === 1 || editType === 2) {
            airline = (pst == releaseDemandPoint || arrv == releaseDemandPoint) ? 1 : 0;
        } else if (editType === 3 || editType === 4) {
            airline = pst == releaseDemandPoint ? 1 : airline;
            airline = arrv == releaseDemandPoint ? 2 : airline;
        }

        this.setState(() => {
            return {
                yId,
                releaseDemandPoint,// 发布需求的机场的本场三字码
                releaseDemandPointNm,//布需求的机场的本场机场名
                targetPoint,//发布需求的机场的意向航点三字码
                targetPointNm,//发布需求的机场的意向航点机场名

                searchText2: responseProgress == '2' ? releaseDemandPointNm : dptNm,  // 始发运力输入框文字
                searchText2Bus: responseProgress == '2' ? releaseDemandPointNm : dptNm,  // 始发运力输入框存储
                dpt: responseProgress == '2' ? releaseDemandPoint : dpt,  // 始发三字码

                searchText3: responseProgress == '2' ? '' : pstNm,  // 始发运力输入框文字
                searchText3Bus: responseProgress == '2' ? '' : pstNm,  // 始发运力输入框存储
                pst: responseProgress == '2' ? '' : pst,  // 始发三字码

                searchText4: responseProgress == '2' ? targetPointNm : arrvNm,  // 到达输入框文字
                searchText4Bus: responseProgress == '2' ? targetPointNm : arrvNm,  // 到达输入框存储
                arrv: responseProgress == '2' ? targetPoint : arrv,  // 到达三字码

                airline,

                sailingtimeStart,
                sailingtimeEnd,
                // 出进港时刻
                dptLevel,
                pstEnter,
                pstLevel,
                arrvEnter,
                arrvLevel,
                pstBackEnter,
                pstBackLevel,
                dptEnter,

                employeeId,
                planId,
                dptNm, pstNm, arrvNm, aircrfttyp, seating, days, sailingtime, performShift, periodValidity, contact, ihome, remark,
                responsePlans, state, responseProgress,
                quoteType, quotedPrice,
                data, title,
                internationalAirline,

                // group_dpt: { dpt, dptNm, dptLevel, dptEnter },
                // group_pst: { pst, pstNm, pstLevel, pstEnter },
                // group_pstBack: { pst, pstNm, pstBackLevel, pstBackEnter },
                // group_arrv: { arrv, arrvNm, arrvLevel, arrvEnter },
            }
        }, () => {
            console.log(this.state)
            this.unLoadingFn();
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
    // 关闭弹出层
    closePopup = () => {
        let o = {
            popupType: 0,
            popupMes: '',
        }
        emitter.emit('openPopup', o);
    }
    // 关闭对话框
    hideModal = () => {
        this.setState({
            // visible: false,
            visible_response: false,
            visible_reEdit: false,
            visible_affirm: false,
            visible_afterAffirmReEdit: false,
        });
    }
    // 根据航路设计值选择相应样式
    getSiteTimeStyle = () => {
        return { justifyContent: this.state.airline ? 'space-between' : 'space-around' };
    }
    // 转换时间格式
    mountTime = (time) => {
        return time ? moment(time, 'hh/mm') : null;
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


    inputTimeout() {  // 输入框延时
        this.setState({
            update: false,
        })
        // this.setState({
        //     update: true,
        // }, () => {
        //     clearInterval(window.timer);
        //     window.timer=setTimeout(() => {
        //         this.setState({
        //             update: false,
        //         })
        //     },0);
        // });
    }
    // TODO: 始发运力对应的事件
    searchTextChangeFn2(e) {  //输入框输入内容改变
        let target = e.target;
        let val = target.value.replace(/(^\s*)|(\s*$)/g, "");  // 去除空格
        if (val == '' || !val) {
            console.log('执行了')
            this.setState({
                searchText2: target.value,
                searchText2Bus: '',
                dpt: '',
                update: true,
                showAirportSearch2: false,
            })
        } else {
            this.setState({
                showAirportSearch2: true,
                searchText2: target.value,
                update: true,
            })
        }
        this.inputTimeout();
    }
    inputClickFn2(e) {  // 输入框焦点事件
        e.stopPropagation();
        this.setState(() => {
            return {
                showAirportSearch2: false,
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
                return {
                    searchText2Bus: data.name,
                    dpt: data.code,  // 始发三字码
                    showAirportSearch2: false,
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
                showAirportSearch3: true,
                searchText3: target.value,
            })
        }
        this.inputTimeout();
    }
    inputClickFn3(e) {  // 输入框焦点事件
        e.stopPropagation();
        this.setState(() => {
            return {
                showAirportSearch3: false,
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
                showAirportSearch4: true,
                searchText4: target.value,
            })
        }
        this.inputTimeout();
    }
    inputClickFn4(e) {  // 输入框焦点事件
        e.stopPropagation();
        this.setState(() => {
            return {
                showAirportSearch4: false,
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
    // 选择航线类型
    radioChangeFn(e) {
        let value = Number(e.target.value);
        let releaseDemandPoint = this.state.releaseDemandPoint || '';
        let releaseDemandPointNm = this.state.releaseDemandPointNm || '';
        let targetPoint = this.state.targetPoint || '';
        let targetPointNm = this.state.targetPointNm || '';
        this.setState({
            airline: value,//0 直飞,1 经停,2 甩飞
        })
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
                searchText4Bus: targetPointNm || '',
                // airline: value,//0 直飞,1 经停

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
                searchText4Bus: targetPointNm || '',
                // airline: value,//0 直飞,1 经停

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
        } else if (value == 2) {
            this.setState({
                dpt: '',
                searchText2: '',
                searchText2Bus: '',

                pst: targetPoint || '',
                searchText3: targetPointNm || '',
                searchText3Bus: targetPointNm || '',

                arrv: releaseDemandPoint || '',
                searchText4: releaseDemandPointNm || '',
                searchText4Bus: releaseDemandPointNm || '',
                // airline: value,//0 直飞,1 经停

                // dptLevel: '',
                // dptEnter: '',
                // pstLevel: this.state.dptLevel,
                // pstBackEnter: this.state.dptEnter,
            })
        }
    }
    dptLevel(e, time) {
        // this.state.group_dpt.dptLevel = time;
        this.setState(() => {
            return {
                dptLevel: time,
                // group_dpt: this.state.group_dpt,
            }
        })
    }
    dptEnter(e, time) {
        // this.state.group_dpt.dptEnter = time;
        this.setState(() => {
            return {
                dptEnter: time,
                // group_dpt: this.state.group_dpt,
            }
        })
    }
    pstLevel(e, time) {
        // this.state.group_pst.pstLevel = time;
        this.setState(() => {
            return {
                pstLevel: time,
                // group_dpt: this.state.group_pst,
            }
        })
    }
    pstEnter(e, time) {
        // this.state.group_pst.pstEnter = time;
        this.setState(() => {
            return {
                pstEnter: time,
                // group_dpt: this.state.group_pst,
            }
        })
    }
    arrvLevel(e, time) {
        // this.state.group_arrv.arrvLevel = time;
        this.setState(() => {
            return {
                arrvLevel: time,
                group_dpt: this.state.group_arrv,
            }
        })
    }
    arrvEnter(e, time) {
        // this.state.group_arrv.arrvEnter = time;
        this.setState(() => {
            return {
                arrvEnter: time,
                // group_dpt: this.state.group_arrv,
            }
        })
    }
    pstBackLevel(e, time) {
        // this.state.group_pstBack.pstBackLevel = time;
        this.setState(() => {
            return {
                pstBackLevel: time,
                // group_dpt: this.state.group_pstBack,
            }
        })
    }
    pstBackEnter(e, time) {
        // this.state.group_pstBack.pstBackEnter = time;
        this.setState(() => {
            return {
                pstBackEnter: time,
                // group_dpt: this.state.group_pstBack,
            }
        })
    }
    // 选择拟飞机型
    aircrfttyp = (value) => {
        this.setState({
            aircrfttyp: value,
        })
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
    sailingtimeDisabledDate(current) {
        let disText = current && current < moment().endOf("days");
        if (this.state.periodValidity) {
            let startTime = moment(this.state.periodValidity, "YYYY/MM/DD")
            disText = current && current < startTime.endOf("days")
        };
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

    // 收集数据 发送
    collectData = (annexation = {}) => {
        // 清理班期,组装为字符串
        let {
            data, yId = null, dpt, pst, arrv, quoteType, quotedPrice, responsePlans, airline, pstBackLevel, pstBackEnter, pstLevel, pstEnter, dptLevel, dptEnter, arrvLevel, arrvEnter, demandId, employeeId, demandtype, aircrfttyp, seating, sailingtime, periodValidity, performShift, remark, contact, ihome
        } = this.state;
        data = data.filter((value) => {
            if (value.type) {
                return value;
            }
        })
        data = data.map((value) => {
            return value.name;
        })
        let days = data.join('/');

        //组装响应方案数据,响应的时候,第一次保存方案的时候只需要传入航点三字码,没有id和responseId
        // let responsePlans = [];
        if (!responsePlans) {
            responsePlans = [
                {
                    id: null, responseId: yId, dpt, pst, arrv, quoteType, quotedPrice,
                }
            ];
        } else {
            responsePlans = responsePlans.map((value) => {
                value.dpt = dpt;
                value.pst = airline != 0 ? pst : '';//判断后传参
                value.arrv = arrv;
                value.quoteType = quoteType;
                value.quotedPrice = quotedPrice;
                return value
            });
        }
        // 构建总数据
        let pstTimeBack = '';
        if (!(pstBackLevel == '' || pstBackEnter == '') && airline != 0) {
            pstTimeBack = pstBackLevel + ',' + pstBackEnter;
        }
        let pstTime = '';
        if (!(pstLevel == '' || pstEnter == '') && airline != 0) {
            pstTime = pstLevel + ',' + pstEnter;
        }
        let dptTime = dptLevel + ',' + dptEnter;
        let arrvTime = arrvLevel + ',' + arrvEnter;


        let formData = {
            id: yId,
            demandId,
            employeeId,
            demandtype,

            dptTime,
            pstTime,
            arrvTime,
            pstTimeBack,

            aircrfttyp,
            seating,
            days,
            sailingtime,
            periodValidity,
            performShift,
            remark,
            contact,
            ihome,
            responsePlans,
            delResponsePlanIds: null,
            ...annexation,//将附加属性添加到构建的数据中
        }

        return formData;

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



    //保存草稿操作
    saveDraft = () => {
        this.loadingFn();

        //需要额外传递的数据,annexation会合并到构建的数据之中
        let annexation = {
            savatype: '3',
        }

        let formData = this.collectData(annexation);
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
                Modal.success({
                    title: '已为您保存草稿。',
                    content: '',
                });
                this.getUpdate(this.props)
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
    // 显示支付组件
    showPay = () => {
        this.setState(() => {
            return {
                showDealPwd: true,
            }
        })
    }
    // 隐藏支付组件
    hidePay = () => {
        this.setState(() => {
            return {
                showDealPwd: false,
            }
        })
    }
    // 输入密码提交后的返回结果
    dealCloseFn = (i) => {
        let { editType } = this.state;
        if (i == 1) {  // 1:验证成功-关闭，2：点击“取消”关闭
            if (editType == 1) {
                this.option_response();
            } else if (editType == 3) {
                this.option_affirm();
            }
        } else if (i == 2) {
            this.hidePay();
        }
    }
    // 忘记密码
    forgetPwd = () => {  // 忘记密码

    }

    //响应提交方案 显示二次确认框
    showReconfirm_response = () => {
        this.setState({
            isInit: 0
        })
        let verifyResult = this.verifyForm();
        if (verifyResult) {
            this.setState(() => {
                return {
                    visible_response: true,
                }
            })
        } else {
            console.log('验证不通过', this.state)
        }
    }
    //响应提交方案 关闭二次确认框
    hideReconfirm_response = () => {
        this.setState(() => {
            return {
                visible_response: false,
            }
        })
    }
    // 二次确认框点击确认按钮
    responseAction = () => {
        this.hideReconfirm_response();
        this.showPay();
    }
    //响应提交方案
    option_response = () => {
        let verifyResult = this.verifyForm();
        if (verifyResult) {
            this.setState(() => {
                return {
                    uploading: true,
                }
            }, () => {
                this.loadingFn();
                let annexation = {
                    savatype: '2',
                }
                let formData = this.collectData(annexation);

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
                        Modal.success({
                            title: '提交方案成功',
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
                    this.setState(() => {
                        return {
                            uploading: false,
                        }
                    })

                })
            })
        }
    }

    //重新编辑提交方案 显示二次确认框
    showReconfirm_reEdit = () => {
        this.setState({
            isInit: 0
        })
        let verifyResult = this.verifyForm();
        if (verifyResult) {
            this.setState(() => {
                return {
                    visible_reEdit: true,
                }
            })
        } else {
            console.log('验证不通过', this.state)
        }
    }
    //重新编辑提交方案
    option_reEdit = () => {
        let verifyResult = this.verifyForm();
        if (verifyResult) {
            this.setState(() => {
                return {
                    uploading: true,
                }
            }, () => {
                this.loadingFn();
                let formData = this.collectData();
                Axios({
                    url: 'responseUpdateV2',
                    method: 'post',
                    data: JSON.stringify(formData),
                    dataType: 'json',
                    headers: {
                        'Content-type': 'application/json;charset=utf-8'
                    }
                }).then((response) => {
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
                    this.setState(() => {
                        return {
                            uploading: false,
                        }
                    })
                })
            })
        }
    }

    affirmAction = () => {
        this.hideReconfirm_affirm();
        this.showPay();
    }
    //确认选择方案 显示二次确认框
    showReconfirm_affirm = () => {
        this.setState({
            isInit: 0
        })
        let verifyResult = this.verifyForm();
        if (verifyResult) {
            this.setState(() => {
                return {
                    visible_affirm: true,
                }
            })
        } else {
            console.log('验证不通过', this.state)
        }
    }
    // 确认选择方案,关闭二次确认框
    hideReconfirm_affirm = () => {
        this.setState(() => {
            return {
                visible_affirm: false,
            }
        })
    }
    // 二次确认框点击确认
    affirmAction = () => {
        this.showPay();
        this.hideReconfirm_affirm();
    }

    //确认选择方案
    option_affirm = () => {
        let verifyResult = this.verifyForm();
        if (verifyResult) {
            this.setState(() => {
                return {
                    uploading: true,
                }
            }, () => {
                this.loadingFn();
                let formData = this.collectData();
                Axios({
                    url: 'releaseCheck',
                    method: 'post',
                    data: JSON.stringify(formData),
                    dataType: 'json',
                    headers: {
                        'Content-type': 'application/json;charset=utf-8'
                    }
                }).then((response) => {
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
                    this.setState(() => {
                        return {
                            uploading: false,
                        }
                    })
                })
            })
        }
    }

    //确认选定方案后重新编辑 显示二次确认框
    showReconfirm_afterAffirmReEdit = () => {
        this.setState({
            isInit: 0
        })
        let verifyResult = this.verifyForm();
        if (verifyResult) {
            this.setState(() => {
                return {
                    visible_afterAffirmReEdit: true,
                }
            })
        } else {
            console.log('验证不通过', this.state)
        }
    }
    //确认选定方案后重新编辑
    option_afterAffirmReEdit = () => {
        let verifyResult = this.verifyForm();
        if (verifyResult) {
            this.setState(() => {
                return {
                    uploading: true,
                }
            }, () => {
                this.loadingFn();
                let formData = this.collectData();
                Axios({
                    url: 'responseUpdateV2',
                    method: 'post',
                    data: JSON.stringify(formData),
                    dataType: 'json',
                    headers: {
                        'Content-type': 'application/json;charset=utf-8'
                    }
                }).then((response) => {
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
                    this.setState(() => {
                        return {
                            uploading: false,
                        }
                    })
                })
            })
        }
    }

    //创建提交数据按钮
    btnEle = () => {
        let editType = this.props.popupMes.transmit.editType;
        if (editType === 1) {//响应
            return (
                <button className={style['confirm']} onClick={this.showReconfirm_response}>确认提交运力方案</button>
            )
        } else if (editType === 2) {//编辑
            return (
                <button className={style['confirm']} onClick={this.showReconfirm_reEdit}>确认修改运力方案</button>
            )
        } else if (editType === 3) {//选择方案
            return (
                <button className={style['confirm']} onClick={this.showReconfirm_affirm}>确认选择该方案</button>
            )
        } else if (editType === 4) {//选择后的重新编辑
            return (
                <button className={style['confirm']} onClick={this.showReconfirm_afterAffirmReEdit}>确认修改运力方案</button>
            )
        }
    }
    //保存草稿方案
    btnSaveDraftEle = () => {
        return this.state.editType === 1 ? <button onClick={this.saveDraft.bind(this)}>保存方案</button> : ''
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
            airline = this.state.airline,
            editType = this.state.editType;

        // if (editType === 1 || editType === 2) {
        if (airline == 0) {//直飞
            if (dpt == '') {
                tip = '请选择始发航点'; bool = false;
            } else if (arrv == '') {
                tip = '请选择到达航点'; bool = false;
            } else {
                if (dpt != releaseDemandPoint) {
                    tip = '始发航点请选择' + releaseDemandPointNm; bool = false;
                } else if (targetPoint != '' && arrv != targetPoint) {
                    tip = '到达航点请选择' + targetPointNm; bool = false;
                } else {
                    tip = ''; bool = true;
                }
            }
        } else {//经停
            if (dpt == '') {
                tip = '请选择始发航点'; bool = false;
            } else if (pst == '') {
                tip = '请选择经停航点'; bool = false;
            } else if (arrv == '') {
                tip = '请选择到达航点'; bool = false;
            } else {
                if ((editType === 1 || editType === 2) && airline == 1) {
                    if (pst != releaseDemandPoint && arrv != releaseDemandPoint) {
                        tip = '经停或到达航点请选择' + releaseDemandPointNm; bool = false;
                    } else if (!(dpt == targetPoint || arrv == targetPoint || pst == targetPoint)) {
                        tip = '请包含' + targetPointNm;
                    } else {
                        tip = ''; bool = true;
                    }
                } else if ((editType === 3 || editType === 4) && airline == 1) {
                    if (pst != releaseDemandPoint) {
                        tip = '经停航点请选择' + releaseDemandPointNm; bool = false;
                    } else if (!(dpt == targetPoint || arrv == targetPoint)) {
                        tip = '请包含' + targetPointNm
                    } else {
                        tip = ''; bool = true;
                    }
                } else if ((editType === 3 || editType === 4) && airline == 2) {
                    if (arrv != releaseDemandPoint) {
                        tip = '到达航点请选择' + releaseDemandPointNm; bool = false;
                    } else if (!(dpt == targetPoint || pst == targetPoint)) {
                        tip = '请包含' + targetPointNm
                    } else {
                        tip = ''; bool = true;
                    }
                }

            }
        }

        // if (airline == 0) {//直飞
        //     if (dpt == '') {
        //         tip = '请选择始发航点';
        //         bool = false;
        //     } else if (arrv == '') {
        //         tip = '请选择到达航点';
        //         bool = false;
        //     } else {
        //         if (dpt != releaseDemandPoint) {
        //             tip = '始发航点请选择' + releaseDemandPointNm;
        //             bool = false;
        //         } else if (targetPoint !== '' && arrv != targetPoint) {
        //             tip = '到达航点请选择' + targetPointNm;
        //             bool = false;
        //         } else {
        //             tip = '';
        //             bool = true;
        //         }
        //     }
        // } else if (airline == 1) {//经停
        //     if (dpt == '') {
        //         tip = '请选择始发航点'; bool = false;
        //     } else if (pst == '') {
        //         tip = '请选择经停航点'; bool = false;
        //     } else if (arrv == '') {
        //         tip = '请选择到达航点'; bool = false;
        //     } else {
        //         if (pst != releaseDemandPoint) {
        //             tip = '经停航点请选择' + releaseDemandPointNm; bool = false;
        //         } else if (!(dpt == targetPoint || arrv == targetPoint)) {
        //             tip = '请包含' + targetPointNm
        //         } else {
        //             tip = ''; bool = true;
        //         }
        //     }
        // }
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
        return this.state.isInit == 1 ? '' : tip;
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

            let current = new Date();
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
            tip = ''; bool = true;
        } else {
            tip = '计划执行周期不能为空'; bool = false;
        }

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
        // const editType = this.props.popupMes.transmit.editType;
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
        console.log(this.state.internationalAirline)
        console.log(typeof this.state.internationalAirline)
        let dptAirportSearch = this.state.internationalAirline == '1'
            ? <AirportSearch
                update={this.state.update}
                axis={axis}
                resData={this.airportData2.bind(this)}
                searchText={this.state.searchText2} />
            : <AllAirportSearch
                update={this.state.update}
                axis={axis}
                resData={this.airportData2.bind(this)}
                searchText={this.state.searchText2} />;
        let pstAirportSearch = this.state.internationalAirline == '1'
            ? <AirportSearch
                update={this.state.update}
                axis={axis}
                resData={this.airportData3.bind(this)}
                searchText={this.state.searchText3} />
            : <AllAirportSearch
                update={this.state.update}
                axis={axis}
                resData={this.airportData3.bind(this)}
                searchText={this.state.searchText3} />;
        let arrvAirportSearch = this.state.internationalAirline == '1'
            ? <AirportSearch
                update={this.state.update}
                axis={axis}
                resData={this.airportData4.bind(this)}
                searchText={this.state.searchText4} />
            : <AllAirportSearch
                update={this.state.update}
                axis={axis}
                resData={this.airportData4.bind(this)}
                searchText={this.state.searchText4} />;

        let { editType, airline, quoteType, quotedPrice, periodValidity, sailingtime, performShift, remark, contact, ihome, title, visible_response, visible_reEdit, visible_affirm, visible_afterAffirmReEdit, uploading, showDealPwd } = this.state;

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
                            <RadioGroup name="radiogroup" defaultValue={airline} value={airline} onChange={this.radioChangeFn.bind(this)}>
                                <Radio value={0} style={{ fontSize: '1.2rem' }}>直飞</Radio>
                                <Radio value={1} style={{ fontSize: '1.2rem' }}>经停</Radio>
                                <Radio value={2} style={{ fontSize: '1.2rem', display: editType === 3 || editType === 4 ? '' : 'none' }}>甩飞</Radio>
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

                        {
                            airline != 0 ? (<div className={style['col-item']}>
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
                                            placeholder={'请输入经停航点'}
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
                                        placeholder={'请输入到达航点'}
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
                                        {this.checkTime('dptLevel')}
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
                                        {this.checkTime('dptEnter')}
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
                                                    {this.checkTime('pstEnter')}
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
                                                    <span className={style['bgColorYellow']}>出</span>
                                                </div>
                                                <div>
                                                    <span className={"ant-time-picker-icon"}></span>
                                                    <div className={style['drop-list-time']}>
                                                        <TimePicker format={format} placeholder={'出港时刻'} onChange={this.pstBackLevel.bind(this)} value={this.mountTime(this.state.pstBackLevel)} disabled={this.state.pstBackEnter ? false : true} />
                                                    </div>
                                                </div>
                                                <span className={style['msg']}>
                                                    {this.checkTime('pstBackLevel')}
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
                                        {this.checkTime('arrvEnter')}
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
                                    <DimAir placeholder={'请选择拟飞机型'} airType="1" defaultData={this.state.aircrfttyp} dimEvent={(data) => this.dimEvent(data)} />
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
                                            <div style={{ width: '47px' }}>{quoteType === "0" ? '待议' : ''}{quoteType === "1" ? '定补' : ''}{quoteType === "2" ? '保底' : ''}</div>
                                            <Icon type="caret-down" />
                                        </div>
                                    </Dropdown>
                                    <input style={{ width: '60px' }} type="text"
                                        value={quotedPrice}
                                        disabled={quoteType === '0' ? true : false}
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
                                        value={periodValidity ? moment(periodValidity, "YYYY/MM/DD") : null}
                                        onChange={this.periodValidity.bind(this)}
                                        placeholder={""}
                                        format="YYYY-MM-DD"
                                        disabledDate={this.periodValidityDisabledDate.bind(this)}
                                        disabled={editType == 3 || editType == 4}
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
                                    <SailingtimeComponent edit={true} sailingtimeText={''} sailingtime={sailingtime} periodValidity={periodValidity} changeEvent={(data, date) => this.changeEvent(data, date)} />
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
                                        value={performShift}
                                        onChange={this.performShiftChange.bind(this)}
                                    />
                                    <span>班</span>
                                </div>
                                <span className={style['msg']}>
                                    {this.checkShift('performShift')}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* 其他说明 */}
                    <div className={style['other-info']}>
                        <div className={style['explan']}>
                            <div>
                                其他说明:
                            </div>
                            <div>
                                <textarea value={remark} onChange={this.remarkChange.bind(this)} maxLength="200"></textarea>
                                <div className={style['textarea-msg']}>
                                    {Number(remark.length)}/200
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
                                        value={contact}
                                        onChange={this.contactChange.bind(this)}
                                        disabled={editType == 3 || editType == 4}
                                        style={{ cursor: editType == 3 || editType == 4 ? 'not-allowed' : 'default' }} />
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
                                        value={ihome}
                                        onChange={this.phoneChange.bind(this)}
                                        disabled={editType == 3 || editType == 4}
                                        style={{ cursor: editType == 3 || editType == 4 ? 'not-allowed' : 'default' }} />
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
                    {/* {editType === 1 ? <button onClick={this.saveScheme.bind(this, editType)}>保存方案</button> : ''} */}
                    {/* <button className={style['confirm']} onClick={this.confirm}>
                        {this.btnFun()}
                    </button> */}
                    {this.btnSaveDraftEle()}
                    {this.btnEle()}
                    <button onClick={this.closePopup}>取消</button>
                </div>
                <div className={style['shade']} style={{ display: this.state.loading ? '' : 'none' }}>
                    <Spin tip='loading...' />
                </div>
                {/* <Confirmations
                    title={this.state.title}
                    subTitle={this.state.subTitle}
                    tipText={this.state.tipText}
                    visible={this.state.visible}
                    onOk={this.onConfirm}
                    onCancel={this.hideModal} /> */}
                {/* 响应 */}
                <Confirmations title={'需求响应'} subTitle={'确认响应' + title} tipText={''} visible={visible_response} onOk={this.responseAction} onCancel={this.hideModal} uploading={uploading} />
                {/* 重新编辑意向方案 */}
                <Confirmations title={'方案编辑'} subTitle={'确认修改该方案'} tipText={''} visible={visible_reEdit} onOk={this.option_reEdit} onCancel={this.hideModal} uploading={uploading} />
                {/* 方案选择 */}
                <Confirmations title={'确认方案'} subTitle={'确认选择该方案'} tipText={'选定后将不可选择其他方案,请确认无误'} visible={visible_affirm} onOk={this.affirmAction} onCancel={this.hideModal} uploading={uploading} />
                {/* 重新编辑选择的方案 */}
                <Confirmations title={'方案编辑'} subTitle={'确认修改该方案'} tipText={''} visible={visible_afterAffirmReEdit} onOk={this.option_afterAffirmReEdit} onCancel={this.hideModal} uploading={uploading} />
                {/* <DealPwd></DealPwd> */}
                {showDealPwd ? <div className={style['pay-box']}>
                    <DealPwd close={this.dealCloseFn} forgetPwd={this.forgetPwd} />
                </div> : ''}
            </div>
        )
    }
}