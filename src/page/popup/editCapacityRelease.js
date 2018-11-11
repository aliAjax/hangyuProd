import React, { Component } from 'react';
import Axios from "./../../utils/axiosInterceptors";
import styles from '../../static/css/from/airLineNeedChen.scss'
import AirportSearch from '../../components/search/airportSearch'
import PayEarnestMoneyChen from '../../components/payEarnestMoney/payEarnestMoneyChen'
import SaveOrNot from '../../components/saveOrNot/saveOrNotChen'
import EditOrNot from '../../components/saveOrNot/editOrNot'
import DeleteOrNot from '../../components/saveOrNot/deleteOrNot'
import ApplyMeasuringChen from '../../components/applyMeasuring/applyMeasuringChen'
import DateChoose from "../../components/dateChoose/dateChoose";
import { store } from '../../store'
import emitter from "../../utils/events";
import Btn from "../../components/button/btn";

import DealPwd from '../../components/dealPwd/dealPwd';
import AllAirportSearch from './../../components/search/allAirportSearch';
import HourTimer from './../../components/timeComponent/hourTimer';

import Confirmations from './../../components/confirmations/confirmations';

import moment from 'moment';
import { Radio, Menu, Dropdown, Icon, DatePicker, TimePicker, Modal, Tooltip, Spin } from 'antd';
import { relative } from 'upath';
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const format = 'HH:mm';//定义antd时间组件格式;

export default class EditCapacityRelease extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            demand: {},  // 10.10 增加，用来板寸机场-重新编辑的demand对象
            airlineQiangzhiWarnShow: false,  // 8.16 增加 强制执行-机场警告
            qiangzhiPst: '',  // 8.16 增加 强制执行-经停三字码
            qiangzhiArrv: '',  // 8.16 增加 强制执行-到达三字码
            arrvProOrArea: '',  // 8.16 增加 航路设计是否禁止选择
            pstProOrArea: '',  // 8.16 增加 航路设计是否禁止选择
            designRadioDisable: false,  // 8.16 增加 航路设计是否禁止选择
            demandPlan: {},  // 8.16 增加
            mandatoryDesignation: null,  // 8.16 增加 目标航点或甩飞航点是否强制指定（0-否，1-是）
            pstMandatoryDesignation: null,  // 8.16 增加 经停点是否强制指定（0-否，1-是）
            pstAreaType: null,  // 8.16 增加 经停航点类型（1-机场三字码，2-省份，3区域）
            areaType: null,  // 8.16 增加 甩飞或目标航点类型（1-机场三字码，2-省份，3区域）

            editItem: {},  // 7.25增加，用来判断方案是否更改
            responseProgress: '',  // 7.25增加-意向的progress，用于判断 我要洽谈-申请测算时是否需要保存草稿,8 -1 时保存草稿
            sailingtime: '',  // '整年'、‘冬春航季’。。。
            visible_reEdit: false,  // 机场-我的意向-重新编辑，二次确认框
            update: true,
            noMsgCesuan: false,  // 申请测算
            noMsgXuanze: false,  // 确认选择该方案
            noMsgXiugai: false,  // 确认修改航线方案
            noMsgTijiao: false,  // 确认提交航线方案
            noMsgCaogao: false,  // 保存草稿
            periodValidity3WarnShow: false,  // 方案有效期晚于当前时间至少一个月警告
            daysWarnShow: false,  // 班期警告
            dateOpen: false,  // datePicker日历是否显示
            bianjiOrNot: false,  // 是否是点击“重新编辑”true：重新编辑，false：我要洽谈
            saveSendDataShow: true,  // “保存草稿”按钮是否显示
            id: null,  // 意向id
            demandId: '',  // 本表单特有的参数，从父组件获取的
            saveDraftId: '',  // 保存草稿成功后返回的id
            remark: '',  // 其他说明
            textNum: 0,  // 其他说明字数
            timeRequirements: 0,  // 时刻要求（0-白班，1-晚班，2-不限）
            periodValidity: '',  // 需求有效期
            showPayEarnestMoney: false,  // 支付意向金是否显示
            payData: {},  // 传递给支付意向金的数据
            showApplyMeasuring: false,  // 申请测算是否显示
            applyMeasuringData: {},  // 向申请测算弹出框传递的数据
            showSaveOrNotSave: false,  // 是否保存为草稿是否显示
            showEditOrNot: false,  // 编辑方案是否显示
            editProjectObj: {},  // 向编辑方案组件传递的数据
            showDeleteOrNot: false,  // 删除方案是否显示
            deleteOrNotIndex: '',  // 向方案删除组件传递的index
            btnText: '新增方案',  // 文字显示“编辑方案”还是“新增方案”
            showPassInput: false,  // 经停是否显示 为false:不显示 为true:显示
            designRadioValue: 1,  // 1:直飞，2：经停，3：甩飞
            delResponsePlanIds: [],  // 删除的方案id
            delResponsePlanId: '', // 对应的单条id
            date: [ //拟开航班默认数据
                {
                    name: "1",
                    type: true
                }, {
                    name: "2",
                    type: true
                }, {
                    name: "3",
                    type: true
                }, {
                    name: "4",
                    type: true
                }, {
                    name: "5",
                    type: true
                }, {
                    name: "6",
                    type: true
                }, {
                    name: "7",
                    type: true
                }
            ],
            // TODO: 填写方案
            planId: null,
            responseId: null,
            myCode: '',  // 本机场三字码
            myName: '',  // 本机场名
            myDptNm: '',  // 从父组件获取的始发名
            myDpt: '',  // 从父组件获取的始发三字码
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
            quoteType: '',  // 报价-方式
            quotedPrice: '',   // 报价-价格
            responsePlans: [],  // 方案数据，planId: null 方案id，responseId：null 意向id(只有之前保存过方案才有此参数)  始发：dptNm, 经停：pstNm，到达：arrvNm，报价：price{方式：type，价格：num}
            projectIndex: '-1',  // 用来确定是第几个方案（-1：默认“新增方案”）
            state: 0,  // 测算状态(0-正常，1-删除，2-测算中，3-测算完成)

            // TODO:表单验证
            contact: '',  // 联系人
            contactWarnShow: false, // 联系人警告是否显示
            ihome: '',  // 联系方式
            ihomeWarnShow: false,  // 联系方式警告是否显示
            airlineWarnShow: false,  // 始发、经停、到达警告
            airline1WarnShow: false, // 为经停、甩飞时，必须全部填写警告
            airline2WarnShow: false, // 始发、到达同时填写
            airline3WarnShow: false,  // 始发航点必须是始发机场警告
            quoteWarnShow: false,  // 报价警告
            periodValidityWarnShow: false,  // 需求有效期警告
            saveProjectWarnShow: false,  // 新增方案警告

            // 出入港时刻
            dptLevel: '',
            pstEnter: '',
            pstLevel: '',
            arrvEnter: '',
            arrvLevel: '',
            pstBackEnter: '',
            pstBackLevel: '',
            dptEnter: '',
            // TODO：增加当保存草稿后，直接关闭，不弹框
            alertShow: false,  // 关闭 是否弹窗

            msg: {
                point: false,

                dptLevel: false,
                dptEnter: false,
                pstLevel: false,
                pstEnter: false,
                pstBackLevel: false,
                pstBackEnter: false,
                arrvLevel: false,
                arrvEnter: false,
                quote: false,
                date: false,
                contact: false,//联系人
                ihome: false,//移动电话

            },
            airport: false,

            performShift: 0,

            visible_response: false,
            visible_reEdit: false,
            visible_affirm: false,
            visible_afterAffirmReEdit: false,
            uploading: false,
            showDealPwd: false,

            // group_dpt: { dpt: '', dptLevel: '', dptEnter: '' },
            // group_pst: { pst: '', pstLevel: '', pstEnter: '' },
            // group_pstBack: { pst: '', pstBackLevel: '', pstBackEnter: '' },
            // group_arrv: { pst: '', arrvLevel: '', arrvEnter: '' },

            // airPointGroup: {
            //     group_dpt: { dpt: '', dptLevel: '', dptEnter: '' },
            //     group_pst: { pst: '', pstLevel: '', pstEnter: '' },
            //     group_pstBack: { pst: '', pstBackLevel: '', pstBackEnter: '' },
            //     group_arrv: { pst: '', arrvLevel: '', arrvEnter: '' },
            // }
        };
    }
    startLoading = () => {
        this.setState({
            isLoading: true
        })
    }
    stopLoading = () => {
        this.setState({
            isLoading: false
        })
    }
    closePopup = () => {
        emitter.emit('openPopup', {
            popupType: 0,
            popupMes: {}
        })
    }
    success(mes) {
        Modal.success({
            title: mes,
        });
        // this.closePopup();
    }
    info(mes) {
        Modal.info({
            title: mes,
        });
        // this.closePopup();
    }
    error(mes) {
        Modal.error({
            title: mes,
        });
        // this.closePopup();
    }
    dptLevel(e, time) {
        this.setState({
            dptLevel: time
        })
    }
    dptEnter(e, time) {
        this.setState({
            dptEnter: time
        })
    }
    pstLevel(e, time) {
        this.setState({
            pstLevel: time
        })
    }
    pstEnter(e, time) {
        this.setState({
            pstEnter: time
        })
    }
    arrvLevel(e, time) {
        this.setState({
            arrvLevel: time
        })
    }
    arrvEnter(e, time) {
        this.setState({
            arrvEnter: time
        })
    }
    pstBackLevel(e, time) {
        this.setState({
            pstBackLevel: time
        })
    }
    pstBackEnter(e, time) {
        this.setState({
            pstBackEnter: time
        })
    }
    designRadioChangeFn2(e) {  // 1:直飞，2：经停，3：甩飞
        let value = e.target.value;
        this.setState({
            designRadioValue: value
        }, () => {
            this.bindAreaType();
            '切换绑定'
        })
    }
    bindAreaType = () => {
        let value = this.state.designRadioValue, myDptNm, myDpt, targetPoint, searchText1Bus;
        console.log(value, '航路设计值')

        let pstAreaType = this.state.demandPlan.pstAreaType;  // 经停航点类型（1-机场三字码，2-省份，3区域）
        let areaType = this.state.demandPlan.areaType;  // 甩飞或目标航点类型（1-机场三字码，2-省份，3区域）
        let pstMandatoryDesignation = this.state.demandPlan.pstMandatoryDesignation; // 经停点是否强制指定（0-否，1-是）
        let mandatoryDesignation = this.state.demandPlan.mandatoryDesignation;  // 目标航点或甩飞航点是否强制指定（0-否，1-是）
        let routeType = this.state.demandPlan.routeType;  // 运力类型 0-直飞，1-经停
        let pstProOrArea = '';
        let arrvProOrArea = '';
        if (pstAreaType != 1) {
            pstProOrArea = this.state.demandPlan.pst;
        }
        if (areaType != 1) {
            arrvProOrArea = this.state.demandPlan.arrv;
        }
        if (store.getState().role.role == 0) {//航司
            let responsePlan = this.state.responsePlans[0];
            myDptNm = this.state.releaseDemandPointNm; // 始发机场名
            myDpt = this.state.releaseDemandPoint;
            targetPoint = this.state.targetPoint;  // 目标航点三字码
            searchText1Bus = this.state.targetPointNm;  // 目标航点输入框存储
        } else {  // 机场
            myDptNm = this.state.myDptNm; // 始发机场名
            myDpt = this.state.myDpt;
            targetPoint = this.state.myCode;  // 目标航点三字码
            searchText1Bus = this.state.myName;  // 目标航点输入框存储
            // TODO:9.20号新增↓↓↓↓↓↓↓↓↓
            if (pstMandatoryDesignation == 1) {  // 强制执行-经停
                if (pstAreaType == 1) {  //强制-机场，无需改变

                } else { //强制-区域/省份
                    targetPoint = '';  // 本厂三字码
                    searchText1Bus = '';  // 本厂输入框存储
                }
            }
            if (mandatoryDesignation == 1) {  // 强制执行-甩飞
                if (areaType == 1) {  //强制-机场，无需改变

                } else { //强制-区域/省份
                    targetPoint = '';  // 本厂三字码
                    searchText1Bus = '';  // 本厂输入框存储
                }
            }
            // TODO:9.20号新增↑↑↑↑↑↑↑↑↑
        }
        if (targetPoint == myDpt) {
            targetPoint = '';
            searchText1Bus = '';
        }
        if (value == 1) {  // 选中了“直飞”没有“经停输入框”
            this.setState({
                showPassInput: false,
                searchText3: '',  // 经停输入框文字
                searchText3Bus: '',  // 经停输入框存储
                pst: '',  // 经停三字码
                searchText2: myDptNm,  // 始发
                searchText2Bus: myDptNm,
                dpt: myDpt,
                searchText4: pstAreaType == '1' && areaType == '1' ? searchText1Bus : '',
                searchText4Bus: pstAreaType == '1' && areaType == '1' ? searchText1Bus : '',
                arrv: pstAreaType == '1' && areaType == '1' ? targetPoint : '',
                alertShow: true,
                pstAreaType,
                areaType,
                pstProOrArea,
                arrvProOrArea,
                pstMandatoryDesignation,
                mandatoryDesignation,
                airlineWarnShow: false,
                airline1WarnShow: false,
                airline2WarnShow: false,
                airline3WarnShow: false,
                airlineQiangzhiWarnShow: false,
            })
        } else if (value == 2) { // 2：经停
            if (routeType === '0' && mandatoryDesignation == 1 && areaType != 1) {  // 航司直飞、强制到达省份/区域
                pstAreaType = areaType;
                areaType = null;
                pstProOrArea = arrvProOrArea;
                arrvProOrArea = '';
                pstMandatoryDesignation = mandatoryDesignation;
                mandatoryDesignation = null;
            }
            this.setState({
                showPassInput: true,
                searchText3: pstAreaType == '1' && areaType == '1' ? searchText1Bus : '',  // 经停输入框文字
                searchText3Bus: pstAreaType == '1' && areaType == '1' ? searchText1Bus : '',  // 经停输入框存储
                pst: pstAreaType == '1' && areaType == '1' ? targetPoint : '',  // 经停三字码
                searchText2: myDptNm,  // 始发
                searchText2Bus: myDptNm,
                dpt: myDpt,
                searchText4: '', // 到达
                searchText4Bus: '',
                arrv: '',
                alertShow: true,
                pstAreaType,
                areaType,
                pstProOrArea,
                arrvProOrArea,
                pstMandatoryDesignation,
                mandatoryDesignation,
                airlineWarnShow: false,
                airline1WarnShow: false,
                airline2WarnShow: false,
                airline3WarnShow: false,
                airlineQiangzhiWarnShow: false,
            })
        } else if (value == 3) {  // 3：甩飞
            if (routeType === '0' && mandatoryDesignation == 1 && areaType != 1) {  // 航司直飞、强制到达省份/区域
                pstAreaType = areaType;
                areaType = null;
                pstProOrArea = arrvProOrArea;
                arrvProOrArea = '';
                pstMandatoryDesignation = mandatoryDesignation;
                mandatoryDesignation = null;
            }
            this.setState({
                showPassInput: true,
                searchText3: '',  // 经停输入框文字
                searchText3Bus: '',  // 经停输入框存储
                pst: '',  // 经停三字码
                searchText2: myDptNm,  // 始发
                searchText2Bus: myDptNm,
                dpt: myDpt,
                searchText4: pstAreaType == '1' && areaType == '1' ? searchText1Bus : '',  // 到达
                searchText4Bus: pstAreaType == '1' && areaType == '1' ? searchText1Bus : '',
                arrv: pstAreaType == '1' && areaType == '1' ? targetPoint : '',
                alertShow: true,
                pstAreaType,
                areaType,
                pstProOrArea,
                arrvProOrArea,
                pstMandatoryDesignation,
                mandatoryDesignation,
                airlineWarnShow: false,
                airline1WarnShow: false,
                airline2WarnShow: false,
                airline3WarnShow: false,
                airlineQiangzhiWarnShow: false,
            })
        }
    }
    designRadioChangeFn(e) {  // 1:直飞，2：经停，3：甩飞
        let value, myDptNm, myDpt, targetPoint, searchText1Bus;

        let pstAreaType = this.state.demandPlan.pstAreaType;  // 经停航点类型（1-机场三字码，2-省份，3区域）
        let areaType = this.state.demandPlan.areaType;  // 甩飞或目标航点类型（1-机场三字码，2-省份，3区域）
        let pstMandatoryDesignation = this.state.demandPlan.pstMandatoryDesignation; // 经停点是否强制指定（0-否，1-是）
        let mandatoryDesignation = this.state.demandPlan.mandatoryDesignation;  // 目标航点或甩飞航点是否强制指定（0-否，1-是）
        let routeType = this.state.demandPlan.routeType;  // 运力类型 0-直飞，1-经停
        let pstProOrArea = '';
        let arrvProOrArea = '';
        if (pstAreaType != 1) {
            pstProOrArea = this.state.demandPlan.pst;
        }
        if (areaType != 1) {
            arrvProOrArea = this.state.demandPlan.arrv;
        }
        if (store.getState().role.role == 0) {//航司
            let responsePlan = this.state.responsePlans[0];
            myDptNm = this.state.releaseDemandPointNm; // 始发机场名
            myDpt = this.state.releaseDemandPoint;
            targetPoint = this.state.targetPoint;  // 目标航点三字码
            searchText1Bus = this.state.targetPointNm;  // 目标航点输入框存储
        } else {  // 机场
            myDptNm = this.state.myDptNm; // 始发机场名
            myDpt = this.state.myDpt;
            targetPoint = this.state.myCode;  // 目标航点三字码
            searchText1Bus = this.state.myName;  // 目标航点输入框存储
            // TODO:9.20号新增↓↓↓↓↓↓↓↓↓
            if (pstMandatoryDesignation == 1) {  // 强制执行-经停
                if (pstAreaType == 1) {  //强制-机场，无需改变

                } else { //强制-区域/省份
                    targetPoint = '';  // 本厂三字码
                    searchText1Bus = '';  // 本厂输入框存储
                }
            }
            if (mandatoryDesignation == 1) {  // 强制执行-甩飞
                if (areaType == 1) {  //强制-机场，无需改变

                } else { //强制-区域/省份
                    targetPoint = '';  // 本厂三字码
                    searchText1Bus = '';  // 本厂输入框存储
                }
            }
            // TODO:9.20号新增↑↑↑↑↑↑↑↑↑
        }
        if (targetPoint == myDpt) {
            targetPoint = '';
            searchText1Bus = '';
        }
        value = e.target.value;
        if (value == 1) {  // 选中了“直飞”没有“经停输入框”
            this.setState({
                showPassInput: false,
                searchText3: '',  // 经停输入框文字
                searchText3Bus: '',  // 经停输入框存储
                pst: '',  // 经停三字码
                searchText2: myDptNm,  // 始发
                searchText2Bus: myDptNm,
                dpt: myDpt,
                searchText4: searchText1Bus,
                searchText4Bus: searchText1Bus,
                arrv: targetPoint,
                designRadioValue: 1,
                alertShow: true,
                pstAreaType,
                areaType,
                pstProOrArea,
                arrvProOrArea,
                pstMandatoryDesignation,
                mandatoryDesignation,
                airlineWarnShow: false,
                airline1WarnShow: false,
                airline2WarnShow: false,
                airline3WarnShow: false,
                airlineQiangzhiWarnShow: false,
            })
        } else if (value == 2) { // 2：经停
            if (routeType === '0' && mandatoryDesignation == 1 && areaType != 1) {  // 航司直飞、强制到达省份/区域
                pstAreaType = areaType;
                areaType = null;
                pstProOrArea = arrvProOrArea;
                arrvProOrArea = '';
                pstMandatoryDesignation = mandatoryDesignation;
                mandatoryDesignation = null;
            }
            this.setState({
                showPassInput: true,
                searchText3: searchText1Bus,  // 经停输入框文字
                searchText3Bus: searchText1Bus,  // 经停输入框存储
                pst: targetPoint,  // 经停三字码
                searchText2: myDptNm,  // 始发
                searchText2Bus: myDptNm,
                dpt: myDpt,
                searchText4: '', // 到达
                searchText4Bus: '',
                arrv: '',
                designRadioValue: 2,
                alertShow: true,
                pstAreaType,
                areaType,
                pstProOrArea,
                arrvProOrArea,
                pstMandatoryDesignation,
                mandatoryDesignation,
                airlineWarnShow: false,
                airline1WarnShow: false,
                airline2WarnShow: false,
                airline3WarnShow: false,
                airlineQiangzhiWarnShow: false,
            })
        } else if (value == 3) {  // 3：甩飞
            if (routeType === '0' && mandatoryDesignation == 1 && areaType != 1) {  // 航司直飞、强制到达省份/区域
                pstAreaType = areaType;
                areaType = null;
                pstProOrArea = arrvProOrArea;
                arrvProOrArea = '';
                pstMandatoryDesignation = mandatoryDesignation;
                mandatoryDesignation = null;
            }
            this.setState({
                showPassInput: true,
                searchText3: '',  // 经停输入框文字
                searchText3Bus: '',  // 经停输入框存储
                pst: '',  // 经停三字码
                searchText2: myDptNm,  // 始发
                searchText2Bus: myDptNm,
                dpt: myDpt,
                searchText4: searchText1Bus,  // 到达
                searchText4Bus: searchText1Bus,
                arrv: targetPoint,
                designRadioValue: 3,
                alertShow: true,
                pstAreaType,
                areaType,
                pstProOrArea,
                arrvProOrArea,
                pstMandatoryDesignation,
                mandatoryDesignation,
                airlineWarnShow: false,
                airline1WarnShow: false,
                airline2WarnShow: false,
                airline3WarnShow: false,
                airlineQiangzhiWarnShow: false,
            })
        }
    }
    timeRadioChangeFn(e) {  // 时刻要求（0-白班，1-晚班，2-不限）
        this.setState({
            timeRequirements: e.target.value,
            alertShow: true,
        })
    }
    textChangeFn(e) {  // 其他说明改变
        let target = e.target;
        this.setState({
            remark: target.value,
            textNum: e.target.value.length,
            alertShow: true,
        })
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
            alertShow: true,
        })
    }
    // 航点输入搜索延时
    inputTimeout() {  // 输入框延时
        this.setState({
            update: true,
        }, () => {
            clearInterval(window.timer);
            window.timer = setTimeout(() => {
                this.setState({
                    update: false,
                })
            }, 200);
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
        this.inputTimeout();
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
                airline3WarnShow: false,
                airlineQiangzhiWarnShow: false,
            }
        })
    }
    /*inputBlurFn2() {  //input失焦事件
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
    }*/
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
        this.inputTimeout();
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
                airline3WarnShow: false,
                airlineQiangzhiWarnShow: false,
            }
        })
    }
    /*inputBlurFn3() {  //input失焦事件
        let that = this;
        setTimeout(() => {
            that.setState((prev) => {
                let searchText3 = prev.searchText3.replace(/(^\s*)|(\s*$)/g, "");  // 去除空格
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
    }*/
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
        this.inputTimeout();
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
                airline3WarnShow: false,
                airlineQiangzhiWarnShow: false,
            }
        })
    }
    /*inputBlurFn4() {  //input失焦事件
        let that = this;
        setTimeout(() => {
            that.setState((prev) => {

                let searchText4 = prev.searchText4 ? prev.searchText4.replace(/(^\s*)|(\s*$)/g, "") : '';  // 去除空格
                let searchText4Bus = prev.searchText4Bus ? prev.searchText4Bus : '';
                if (searchText4 == '' && searchText4Bus == '') {  // 输入为空时，三字码为空，输入框显示的为空
                    return {
                        searchText4: '',
                        arrv: '',  // 到达三字码
                        showAirportSearch4: false,
                    }
                } else {
                    return {
                        searchText4: searchText4Bus,
                        showAirportSearch4: false,
                    }
                }
            })
        }, 150)
    }*/
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

    priceChangeFn(e) {  // 报价-价格改变事件
        let target = e.target;
        let val = target.value.replace(/[^\d\.]*/g, '');  // 只允许输入数字和浮点数
        // let num = parseInt(val) ? val : '';
        this.setState({
            quotedPrice: val,
            quoteWarnShow: false,
            alertShow: true,
        })

    }

    // TODO: 拟开班期 ，向DateChoose组件传递方法
    chooseDateEvent(date) {
        this.setState({
            date: date,
            daysWarnShow: false,
            alertShow: true,
        }, () => {
            this.changeEvent(this.state.sailingtime)
        })
    }
    // 计划执行时间
    changeEvent(date) {
        let performShift = 0;
        // let hintText = this.state.hintText;
        // let periodValidity = this.state.periodValidity;
        // this.setState({
        //     sailingtime:data
        // });
        switch (date) {
            case "整年":
                performShift = this.calculateFixation(365);
                // hintText.sailingtime = "";
                // hintText.periodValidity = "";
                // hintText.performShift = "";
                break;
            case "冬春航季":
                performShift = this.calculateFixation(153);
                // hintText.sailingtime = "";
                // hintText.periodValidity = "";
                // hintText.performShift = "";
                break;
            case "夏秋航季":
                performShift = this.calculateFixation(216);
                // hintText.sailingtime = "";
                // hintText.periodValidity = "";
                // hintText.performShift = "";
                break;
            default:
                performShift = this.calculateUnset(date);  // 传字符串
                // let dateStart = data.split(",")[0].split("-");
                // let newDate = new Date(dateStart[0], dateStart[1], dateStart[2]);
                // if (date.length != 0) {
                //     let newDate = date[0].clone();
                //     periodValidity = newDate.subtract(1, "days").format().split("T")[0];
                // };
                // hintText.sailingtime = "";
                // hintText.periodValidity = "";
                // hintText.performShift = "";
                break;
        };
        this.setState({
            performShift
        })
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
    //不固定时间计划执行班次计算方法
    calculateUnset(dateString) {
        // if (!this.state.userPerformShift) {//用户输入优先
        let performShift = 0;
        if (dateString) {//自动计算优先
            //计算执行班次
            let date = this.state.date;
            let dateTrueNum = [];//选择执飞日期
            let dateStart = dateString.split(",")[0].split("-");
            let dateEnd = dateString.split(",")[1].split("-");
            let dateS = new Date(dateStart[0], dateStart[1], dateStart[2]);
            let dateE = new Date(dateEnd[0], dateEnd[1], dateEnd[2]);
            let daysNum = parseInt(Math.abs(dateS - dateE)) / 1000 / 60 / 60 / 24;//相差天数
            daysNum += 1;
            for (let i = 0; i < date.length; i++) {
                if (date[i].type == true) {
                    if (i == 6) {
                        dateTrueNum.push("0")
                    } else {
                        dateTrueNum.push(date[i].name)
                    }
                }
            };
            if (dateTrueNum.length != 0) {
                if (daysNum % 7 == 0) {
                    performShift = parseInt(daysNum / 7) * dateTrueNum.length;
                } else {
                    performShift = parseInt(daysNum / 7) * dateTrueNum.length;
                    let startWeek = parseInt(moment(dateString.split(",")[0], "YYYY/MM/DD").format("d"));
                    let endWeek = parseInt(moment(dateString.split(",")[1], "YYYY/MM/DD").format("d"));
                    let num = endWeek - startWeek;
                    if (startWeek <= endWeek) {
                        for (let i = 0; i < num + 1; i++) {
                            for (let j = 0; j < dateTrueNum.length; j++) {
                                if (startWeek + i == dateTrueNum[j]) {
                                    performShift = 1 + performShift;
                                }
                            }
                        }
                    } else {
                        for (let i = 0; i < dateTrueNum.length; i++) {
                            if (startWeek <= parseInt(dateTrueNum[i])) {
                                performShift += 1
                            } else if (endWeek >= parseInt(dateTrueNum[i])) {
                                performShift += 1
                            }
                        };
                    }
                };
            };
        };
        return performShift
    }

    // TODO: 方案的“增、删、改”：点击“新增方案”、“编辑方案”、“+”、“编辑图标”、“删除图标”

    saveProject() {  // TODO: 点击“新增方案”、“编辑方案”
        let obj = {};  //始发：dptNm, 经停：pstNm，到达：arrvNm，方式：quoteType，价格：quotedPrice
        obj.dptNm = this.state.searchText2Bus;
        obj.pstNm = this.state.searchText3Bus;
        obj.arrvNm = this.state.searchText4Bus;
        obj.dpt = this.state.dpt;  // 始发三字码.
        obj.pst = this.state.pst;  // 经停三字码
        obj.arrv = this.state.arrv;  // 到达三字码
        obj.quoteType = this.state.quoteType;  // quoteType,定补，保底
        if (obj.quoteType == 0) {
            obj.quotedPrice = '';
        } else {
            obj.quotedPrice = this.state.quotedPrice;
        }
        obj.state = this.state.state;  // 测算状态(0-正常，1-删除，2-测算中，3-测算完成)
        obj.click = 0;  // 申请测算是否点击 0：未点击， 1：点击
        obj.calculationId = null;
        obj.calculationState = null;
        let index = Number(this.state.projectIndex);
        let myCode = this.state.myCode; // 本机场三字码
        let myDpt = this.state.myDpt;  // 始发机场三字码
        let dpt = this.state.dpt;  // 始发航点三字码
        let pst = this.state.pst;  // 经停航点三字码
        let arrv = this.state.arrv;  // 到达航点三字码
        let qiangzhiPst = this.state.qiangzhiPst;  // 强制执行-经停三字码
        let qiangzhiArrv = this.state.qiangzhiArrv;  // 强制执行-到达三字码
        let myRef = this.refs['myRef'];
        let showPassInput = this.state.showPassInput;  // 经停输入框是否显示
        let routeType = this.state.demandPlan.routeType;  // 运力类型 0-直飞，1-经停
        this.setState({
            saveProjectWarnShow: false,
        });
        if (this.state.pstMandatoryDesignation == 1) {  // 强制执行-经停
            if (this.state.pstAreaType == 1) {  //机场
                if (qiangzhiPst != pst) {
                    this.setState({
                        showAirportSearch2: false,
                        airlineWarnShow: false,
                        airline1WarnShow: false,
                        airline2WarnShow: false,
                        airline3WarnShow: false,
                        airlineQiangzhiWarnShow: true
                    });
                    return false
                }
            } else {  // 9.20新增，强制执行-省份/区域
                if (!showPassInput) {
                    this.setState({
                        showAirportSearch2: false,
                        airlineWarnShow: false,
                        airline1WarnShow: false,
                        airline2WarnShow: false,
                        airline3WarnShow: false,
                        airlineQiangzhiWarnShow: true
                    });
                    return false
                }
            }
        }
        if (this.state.mandatoryDesignation == 1) {  // 强制执行-甩飞
            if (routeType == 1 && !showPassInput) {
                this.setState({
                    showAirportSearch2: false,
                    airlineWarnShow: false,
                    airline1WarnShow: false,
                    airline2WarnShow: false,
                    airline3WarnShow: false,
                    airlineQiangzhiWarnShow: true
                });
                return false
            }
            if (this.state.areaType == 1) {  //机场
                if (showPassInput) {  // 经停或甩飞
                    if ((routeType == 0 && qiangzhiArrv != pst) || (routeType == 1 && qiangzhiArrv != arrv)) {
                        this.setState({
                            showAirportSearch2: false,
                            airlineWarnShow: false,
                            airline1WarnShow: false,
                            airline2WarnShow: false,
                            airline3WarnShow: false,
                            airlineQiangzhiWarnShow: true
                        });
                        return false
                    }
                } else {  // 直飞
                    if (qiangzhiArrv != arrv) {
                        this.setState({
                            showAirportSearch2: false,
                            airlineWarnShow: false,
                            airline1WarnShow: false,
                            airline2WarnShow: false,
                            airline3WarnShow: false,
                            airlineQiangzhiWarnShow: true
                        });
                        return false
                    }
                }
            }
        }
        if (myDpt && myCode) {
            if (myDpt != dpt) {  // TODO:10.15更改，始发航点必须为始发机场
                this.setState({
                    airline3WarnShow: true
                });
                return false
            }
            if ((myCode != dpt && myCode != pst && myCode != arrv)
                || (myDpt != dpt && myDpt != pst && myDpt != arrv)) {
                this.setState({
                    airlineWarnShow: true
                });
                return false
            }
        } else {
            if (myDpt != dpt) {  // TODO:10.15更改，始发航点必须为始发机场
                this.setState({
                    airline3WarnShow: true
                });
                return false
            }
            /*if (myDpt != dpt && myDpt != pst && myDpt != arrv) {
                this.setState({
                    airlineWarnShow: true
                });
                return false
            }*/
        }
        if (this.state.designRadioValue == 1 && (dpt == '' || arrv == '')) {
            this.setState({
                airline2WarnShow: true
            });
            return false
        } else if (this.state.designRadioValue != 1 && (dpt == '' || pst == '' || arrv == '')) {
            this.setState({
                airline1WarnShow: true
            });
            return false
        } else if (obj.quoteType === '') {
            this.setState({
                quoteWarnShow: true
            });
            return false
        } else if (obj.quoteType != 0 && (obj.quotedPrice == '' || obj.quotedPrice == 0)) {
            this.setState({
                quoteWarnShow: true
            });
            return false
        } else {
            if (index === -1) {  // “新增方案”
                if (this.state.responsePlans != null && this.state.responsePlans.length < 3) {
                    obj.id = null;
                    obj.responseId = this.state.responseId;
                    this.state.responsePlans.push(obj);
                    this.setState((prev) => {
                        return {
                            searchText2: '',  // 始发运力输入框
                            searchText3: '',  // 经停输入框
                            searchText4: '',  // 到达输入框
                            dpt: '',  // 始发三字码
                            pst: '',  // 经停三字码
                            arrv: '',  // 到达三字码
                            quoteType: '',  // 报价-方式
                            quotedPrice: '',   // 报价-价格
                            // projectIndex: index,  // 用来确定是第几个方案
                            responsePlans: prev.responsePlans,
                            alertShow: true,
                            airlineWarnShow: false,
                            airline1WarnShow: false,
                            quoteWarnShow: false,
                            airline2WarnShow: false,
                            airline3WarnShow: false,
                        }
                    })
                } else {
                    this.error('最多保存三条数据！');
                }
            } else {  // “编辑方案”
                let editItem = this.state.editItem;
                try {
                    if (obj.dpt == editItem.dpt && obj.pst == editItem.pst && obj.arrv == editItem.arrv && obj.quoteType == editItem.quoteType && obj.quotedPrice == editItem.quotedPrice) {
                        obj.calculationState = editItem.calculationState;
                    }
                } catch (e) {

                }
                obj.id = this.state.planId;
                obj.responseId = this.state.responseId;  // TODO: 若之前已经保存草稿，即有意向ID，传意向id，否则传null。
                this.state.responsePlans.splice(index, 1, obj);
                this.setState((prev) => {
                    return {
                        searchText2: '',  // 始发运力输入框
                        searchText3: '',  // 经停输入框
                        searchText4: '',  // 到达输入框
                        dpt: '',  // 始发三字码
                        pst: '',  // 经停三字码
                        arrv: '',  // 到达三字码
                        quoteType: '',  // 报价-方式
                        quotedPrice: '',   // 报价-价格
                        projectIndex: -1,  // 默认“新增方案”
                        responsePlans: prev.responsePlans,
                        btnText: '新增方案',
                        alertShow: true,
                        airlineWarnShow: false,
                        airline1WarnShow: false,
                        quoteWarnShow: false,
                        airline2WarnShow: false,
                        airline3WarnShow: false,
                    }
                })
            }
        }
    }
    editProjectClickFn(item, index) {  // TODO: 点击“编辑”
        let state = Number(item.state);
        /*if(state !== 0) {  //state（0-正常，1-删除，2-测算中，3-测算完成）
            let obj = {};
            obj.item = item;
            obj.index = index;
            this.setState({
                editProjectObj: obj,  // 向“是否编辑”组件传递的数据
                showEditOrNot: true,
            })
        }else {*/
        this.refs.myRef.scrollTop = 0;
        this.editProject(item, index);
        // }
    }
    editProject(item, index) {  // 编辑方案
        // this.state.responsePlans[index].state = 0;  // 测算状态(0-正常，1-删除，2-测算中，3-测算完成)
        if (item.pst) {
            if (item.pst == this.state.myCode) {
                this.state.designRadioValue = 2;
            } else {
                this.state.designRadioValue = 3;
            }
            this.setState((prev) => {
                return ({
                    showPassInput: true,
                    designRadioValue: prev.designRadioValue,
                })
            })
        } else {
            this.setState({
                showPassInput: false,
                designRadioValue: 1,
            })
        }
        this.setState((prev) => {
            return {
                editItem: item,
                id: item.responseId,
                planId: item.id,
                responseId: item.responseId,
                searchText2: item.dptNm,  // 始发运力输入框
                searchText2Bus: item.dptNm,  // 始发运力输入框Bus
                searchText3: item.pstNm == null ? '' : item.pstNm,  // 经停输入框
                searchText3Bus: item.pstNm == null ? '' : item.pstNm,  // 经停输入框Bus
                searchText4: item.arrvNm,  // 到达输入框
                searchText4Bus: item.arrvNm,  // 到达输入框Bus
                dpt: item.dpt,  // 始发三字码
                pst: item.pst,  // 经停三字码
                arrv: item.arrv,  // 到达三字码
                quoteType: item.quoteType,  // 报价-方式
                quotedPrice: item.quotedPrice,   // 报价-价格
                projectIndex: index,  // 用来确定是第几个方案
                responsePlans: prev.responsePlans,
                btnText: '编辑方案',
                alertShow: true,
            }
        });
    }
    deleteProjectClickFn(item, index) {
        let state = item.state ? Number(item.state) : '';
        /*if (state !== 0) {  //state（0-正常，1-删除，2-测算中，3-测算完成）
            this.setState((prev) => {
                return ({
                    deleteOrNotIndex: index,
                    showDeleteOrNot: true,
                    delResponsePlanId: item.id,
                    alertShow: true,
                });
            })
        } else {*/
        this.deleteProject(index);
        this.state.delResponsePlanIds.push(item.id);
        // }
    }
    deleteOrNotSaveFn(index, delResponsePlanId) {  // 点击“删除方案”组件-确认删除按钮
        this.deleteProject(index);
        this.setState({
            showDeleteOrNot: false
        })
        this.state.delResponsePlanIds.push(delResponsePlanId);
    }
    deleteOrNotCancelFn() {  // 点击“删除方案”组件-取消按钮
        this.setState({
            showDeleteOrNot: false
        })
    }
    deleteProject(index) {  // 点击“删除”
        let projectIndex = this.state.projectIndex;
        if (index == this.state.projectIndex) {
            projectIndex = -1;
        }
        this.state.responsePlans.splice(index, 1);
        this.setState((prev) => {
            return {
                responsePlans: prev.responsePlans,
                alertShow: true,
                projectIndex: projectIndex,
            }
        })
    }

    disabledDate(current) {
        // Can not select days before today and today
        // return current && current < moment().endOf('day');
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

    closeFn() {  // 点击“取消”
        if (this.props.popupMes.transmit.editType === 2
            || this.props.popupMes.transmit.editType === 3
            || this.props.popupMes.transmit.editType === 4) {
            this.closeFormBox();
        } else {
            if (this.state.alertShow) {
                this.setState({
                    showSaveOrNotSave: true,
                });
            } else {
                this.closeFormBox();
            }
        }
    }
    save() {  // 提交的数据
        let days = [];
        this.state.date.forEach((val) => {
            if (val.type) {
                days.push(val.name)
            }
        });
        let responsePlans = this.state.responsePlans;
        if (responsePlans != null && responsePlans.length != '') {
            responsePlans.forEach((val, index, arr) => {
                if (val.dpt == '' && val.pst == '' && val.arrv == '' && val.quoteType == '' && val.quotedPrice == '') {
                    responsePlans.splice(index, 1);
                }
            });
        } else {
            responsePlans = [];
        }
        this.setState({
            responsePlans: responsePlans
        });
        let demand = {};
        demand.demandtype = 1;  // 0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托
        demand.timeRequirements = this.state.timeRequirements;  // 时刻要求（0-白班，1-晚班，2-不限）
        demand.days = days.join('/');  // 拟开班期
        demand.periodValidity = this.state.periodValidity;  // 需求有效期
        demand.contact = this.state.contact;  // 联系人
        demand.ihome = this.state.ihome;   // 联系方式
        demand.remark = this.state.remark;  // 其他说明
        demand.id = this.state.id;  // TODO：此处需要从ajax数据获取或为null
        demand.employeeId = store.getState().role.id;
        demand.demandId = this.state.demandId;
        demand.responsePlans = responsePlans;   // 保存方案 responsePlans：JSON字符串
        demand.performShift = this.state.performShift;  // 计划执行班次
        return demand;
    }
    saveSendDataFn(type, index, item) {   //TODO： type: 1 保存草稿， type: 2 发布运力信息, type: 3 申请测算-保存草稿, type: 4 保存-是否保存为草稿组件
        //TODO: 保存类型(1-保存方案(会成为待支付)，2-正式提交，3-保存草稿，4-机场申请测算时先保存草稿)
        let demand = this.save();
        let contact = this.state.contact; // 联系人
        let ihome = this.state.ihome;  // 联系方式
        let ihomeWarnShow = this.state.ihomeWarnShow;  // 联系方式警告
        let periodValidity = this.state.periodValidity; // 需求有效期
        let responsePlans = this.state.responsePlans;  // 方案
        let myRef = this.refs['myRef'];
        /*if (responsePlans.length == 0) {
            this.setState({
                saveProjectWarnShow: true,
            });
            myRef.scrollTop = 0;
            return false
        } else */
        if (demand.days == '') {
            this.setState({
                daysWarnShow: true,
            });
            myRef.scrollTop = 200;
            return false
        } else if (contact == '' || contact == null) {
            myRef.scrollTop = 320;
            this.setState({
                contactWarnShow: true
            });
            return false
        } else if (ihomeWarnShow || ihome == '' || ihome == null) {
            this.setState({
                ihomeWarnShow: true
            });
            myRef.scrollTop = 320;
            return false
        } else if (periodValidity == '' || periodValidity == null) {
            this.setState({
                periodValidityWarnShow: true
            });
            return false
        }
        else {
            let responsePlans = this.responsePlansFn(demand.responsePlans);
            demand.responsePlans = responsePlans;
            demand.delResponsePlanIds = [];
            if (type == 3) {  // type: 1 保存草稿，type: 3 申请测算-保存草稿, type: 4 保存-保存为草稿组件
                demand.savatype = '4';  // 1-保存方案(会成为待支付)，2-正式提交，3-保存草稿，4-机场申请测算时先保存草稿
            } else if (type == 1 || type == 4) {
                demand.savatype = '3';  // 1-保存方案(会成为待支付)，2-正式提交，3-保存草稿，4-机场申请测算时先保存草稿
            }
            if (type == 3 && this.state.id) {  // 申请测算且有id
                if (this.state.responseProgress == 8 || this.state.responseProgress == '-1' || this.state.responseProgress == '2') {  // 8：草稿， -1：待支付, 2:已撤回
                    // (item.id == '' || item.id == null)
                    demand.delResponsePlanIds = this.state.delResponsePlanIds.join(',');
                    Axios({
                        method: 'post',
                        url: '/responseAdd',
                        /*params:{  // 一起发送的URL参数
                            page:1
                        },*/
                        data: JSON.stringify(demand),
                        dataType: 'json',
                        headers: {
                            'Content-type': 'application/json;charset=utf-8'
                        }
                    }).then((response) => {
                        this.setState({
                            noMsgCesuan: false,
                        });
                        if (response.data.opResult === '0') {
                            let data = {};
                            data.OnceSailingMeasurePrice = response.data.OnceSailingMeasurePrice;
                            data.demandId = this.state.demandId;
                            if (response.data.responsePlanId) {
                                data.responsePlanId = response.data.responsePlanId;
                            } else {
                                data.responsePlanId = item.id;
                            }
                            this.setState({
                                saveDraftId: response.data.demandId,
                                applyMeasuringData: data,
                                showApplyMeasuring: true
                            });
                        } else {
                            this.state.responsePlans[index].click = 0;  // 申请测算是否点击 0：未点击， 1：点击
                            this.error('申请测算失败！');
                        }
                    })
                } else {
                    delete demand.savatype;
                    delete demand.delResponsePlanIds;
                    Axios({
                        method: 'post',
                        url: '/responseUpdateV2',
                        /*params:{  // 一起发送的URL参数
                            demandId: demandId,
                            employeeId: employeeId
                        },*/
                        data: JSON.stringify(demand),
                        dataType: 'json',
                        headers: {
                            'Content-type': 'application/json;charset=utf-8'
                        }
                    }).then((response) => {
                        this.setState({
                            noMsgCesuan: false,
                        });
                        if (response.data.opResult == 0) {
                            let data = {};
                            data.OnceSailingMeasurePrice = response.data.OnceSailingMeasurePrice;
                            data.demandId = this.state.demandId;
                            data.responsePlanId = response.data.responsePlanId;
                            this.setState({
                                applyMeasuringData: data,
                                showApplyMeasuring: true
                            })
                        } else {
                            this.error('申请测算失败！');
                        }
                    })
                }

            } else {
                if (type == 3) {  // type: 1 保存草稿，type: 3 申请测算-保存草稿, type: 4 保存-保存为草稿组件
                    demand.delResponsePlanIds = this.state.delResponsePlanIds.join(',');
                    Axios({
                        method: 'post',
                        url: '/responseAdd',
                        /*params:{  // 一起发送的URL参数
                            page:1
                        },*/
                        data: JSON.stringify(demand),
                        dataType: 'json',
                        headers: {
                            'Content-type': 'application/json;charset=utf-8'
                        }
                    }).then((response) => {
                        this.setState({
                            noMsgCesuan: false,
                        });
                        if (response.data.opResult === '0') {
                            let data = response.data;
                            data.demandId = this.state.demandId;
                            this.setState({
                                saveDraftId: response.data.demandId,
                                applyMeasuringData: data,
                                showApplyMeasuring: true
                            });
                        } else {
                            this.state.responsePlans[index].click = 0;  // 申请测算是否点击 0：未点击， 1：点击
                            this.error('申请测算失败！');
                        }
                    })
                } else {
                    this.setState({
                        noMsgCaogao: true,
                    }, () => {
                        demand.delResponsePlanIds = this.state.delResponsePlanIds.join(',');
                        Axios({
                            method: 'post',
                            url: '/responseAdd',
                            /*params:{  // 一起发送的URL参数
                                page:1
                            },*/
                            data: JSON.stringify(demand),
                            dataType: 'json',
                            headers: {
                                'Content-type': 'application/json;charset=utf-8'
                            }
                        }).then((response) => {
                            if (type == 1) {
                                if (response.data.opResult === '0') {
                                    this.success('已为您保存草稿，请在下次点开后操作');
                                    this.setState({
                                        saveDraftId: response.data.demandId,
                                        delResponsePlanIds: [],
                                        alertShow: false,
                                        saveProjectWarnShow: false,
                                    });
                                    this.closeFormBox();
                                    this.responseData();
                                } else {
                                    this.error('保存草稿失败！');
                                    this.state.delResponsePlanIds = [];
                                    this.closeFormBox();
                                }
                            }
                            if (type == 4) {
                                if (response.data.opResult === '0') {
                                    this.success('已为您保存草稿，请在下次点开后操作');
                                    this.setState({
                                        saveDraftId: response.data.demandId,
                                    });
                                    this.closeFormBox();
                                } else {
                                    this.error('保存草稿失败！');
                                }
                            }
                        })
                    });
                }
            }
        }
    }
    // 数据验证
    verifyForm = (form) => {
        let editType = this.props.popupMes.transmit.editType;
        let msg = this.state.msg;

        if (this.state.designRadioValue == 1) {//当为直飞的时候,经停点为true
            msg.pst = true;
            msg.pstEnter = true;
            msg.pstLevel = true;
            msg.pstBackLevel = true;
            msg.pstBackEnter = true;
        }

        let verifyResult = true;
        if (msg) {
            for (let m in msg) {
                verifyResult = verifyResult && msg[m];
            }
        }
        return verifyResult
    }

    sendDataFn() {   //TODO：确认提交航线方案。
        let demand = this.save();
        let contact = this.state.contact; // 联系人
        let ihome = this.state.ihome;  // 联系方式
        let ihomeWarnShow = this.state.ihomeWarnShow;  // 联系方式警告
        let periodValidity = this.state.periodValidity; // 需求有效期
        let responsePlans = this.state.responsePlans;  // 方案
        let myRef = this.refs['myRef'];
        if (periodValidity != null && periodValidity != '') {
            let p = moment(periodValidity);   // 需求有效期
            // let n = moment().endOf('day').format(dateFormat);  // 当前时间
            let n = moment().subtract(1, 'd').add(1, "M");  // 当前时间后延一个月
            if (moment.min(n, p) == p) {
                this.setState({
                    periodValidity3WarnShow: true
                });
                myRef.scrollTop = 500;
                return false;
            }
        }
        if (demand.days == '') {
            this.setState({
                daysWarnShow: true,
            });
            myRef.scrollTop = 200;
            return false
        } else if (responsePlans.length == 0) {
            this.setState({
                saveProjectWarnShow: true,
            });
            myRef.scrollTop = 0;
            return false
        } else if (contact == '' || contact == null) {
            myRef.scrollTop = 320;
            this.setState({
                contactWarnShow: true
            });
            return false
        } else if (ihomeWarnShow || ihome == '' || ihome == null) {
            this.setState({
                ihomeWarnShow: true
            });
            myRef.scrollTop = 320;
            return false
        } else if (periodValidity == '' || periodValidity == null) {
            this.setState({
                periodValidityWarnShow: true
            });
            return false
        } else {
            this.setState({
                noMsgTijiao: true,
            }, () => {
                let responsePlans = this.responsePlansFn(demand.responsePlans);
                demand.responsePlans = responsePlans;
                demand.savatype = 2;  // 保存类型(1-保存方案(会成为待支付)，2-正式提交，3-保存草稿，4-机场申请测算时先保存草稿)
                demand.delResponsePlanIds = this.state.delResponsePlanIds.join(',');
                Axios({
                    method: 'post',
                    url: '/selectSingleResponseCapacityFreezeMargin',
                    dataType: 'json',
                    headers: {
                        'Content-type': 'application/json;charset=utf-8'
                    }
                }).then((response) => {
                    if (response.data.opResult === '0') {
                        demand.intentionMoney = response.data.singleResponseCapacityFreezeMargin;
                        this.setState({
                            showPayEarnestMoney: true,
                            payData: demand
                        })
                    } else {
                        this.error('发布失败！');
                    }
                })
            });
        }
    }
    responsePlansFn(data) {
        let responsePlans = JSON.parse(JSON.stringify(data));
        for (let i = responsePlans.length - 1; i >= 0; i--) {
            if (responsePlans[i].calculationState === '0') {
                responsePlans.splice(i, 1);
            }
        }
        if (responsePlans.length === 0 || responsePlans === null) {
            responsePlans = [];
        } else {
            responsePlans.map((val) => {
                delete val.calculationId;
                delete val.calculationState;
                return val;
            })
        }
        return responsePlans;
    }
    sendData2Fn(editType) {
        let demand = this.save();
        let _this = this;
        editType == 3 || editType == 4 ? demand.employeeId = this.state.employeeId : '';
        if (editType == 3 || editType == 4) {
            this.setState({
                isInit: 0
            })
            if (!this.verifyForm()) {
                return;
            }
            demand.responsePlans = demand.responsePlans.map((value) => {
                value.dpt = _this.state.dpt;
                value.pst = _this.state.designRadioValue != 1 ? _this.state.pst : '';//判断后传参
                value.arrv = _this.state.arrv;
                value.quoteType = _this.state.quoteType;
                value.quotedPrice = _this.state.quotedPrice;
                return value
            });
            demand.dptTime = this.state.dptLevel + ',' + this.state.dptEnter;
            demand.pstTime = this.state.designRadioValue != 1 ? (this.state.pstLevel + ',' + this.state.pstEnter) : '';//判断后传参
            demand.arrvTime = this.state.arrvLevel + ',' + this.state.arrvEnter;
            demand.pstTimeBack = this.state.designRadioValue != 1 ? this.state.pstBackLevel + ',' + this.state.pstBackEnter : '';
        }
        demand.delResponsePlanIds = this.state.delResponsePlanIds.join(',');
        let contact = this.state.contact; // 联系人
        let ihome = this.state.ihome;  // 联系方式
        let ihomeWarnShow = this.state.ihomeWarnShow;  // 联系方式警告
        let periodValidity = this.state.periodValidity; // 需求有效期
        let myRef = this.refs['myRef'];
        if (periodValidity != null && periodValidity != '') {
            let p = moment(periodValidity);   // 需求有效期
            // let n = moment().endOf('day').format(dateFormat);  // 当前时间
            let n = moment().subtract(1, 'd').add(1, "M");  // 当前时间后延一个月
            if (moment.min(n, p) == p) {
                this.setState({
                    periodValidity3WarnShow: true
                });
                myRef.scrollTop = 500;
                return false;
            }
        }
        /* if (this.state.responsePlans.length == 0) {
             this.setState({
                 saveProjectWarnShow: true,
             });
             myRef.scrollTop = 0;
             return false
         } else */
        if (demand.days == '') {
            this.setState({
                daysWarnShow: true,
            });
            myRef.scrollTop = 200;
            return false
        } else if (contact == '' || contact == null) {
            myRef.scrollTop = 320;
            this.setState({
                contactWarnShow: true
            });
            return false
        } else if (ihomeWarnShow || ihome == '' || ihome == null) {
            this.setState({
                ihomeWarnShow: true
            });
            myRef.scrollTop = 320;
            return false
        } else if (periodValidity == '' || periodValidity == null) {
            this.setState({
                periodValidityWarnShow: true
            });
            return false
        }
        else {
            this.setState({
                visible_reEdit: true,
                demand: demand,
            });
        }
    }
    sendData3Fn() {
        this.setState({
            uploading: true,
        }, () => {
            let responsePlans = this.responsePlansFn(this.state.demand.responsePlans);
            this.state.demand.responsePlans = responsePlans;
            Axios({
                method: 'post',
                url: '/responseUpdateV2',
                /*params:{  // 一起发送的URL参数
                    demandId: demandId,
                    employeeId: employeeId
                },*/
                data: JSON.stringify(this.state.demand),
                dataType: 'json',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then((response) => {
                if (response.data.opResult == 0) {
                    this.success('修改成功！');
                    this.closeFormBox();
                } else {
                    this.info('此方案状态有变,不可修改,请刷新');
                    // this.error('修改失败！');
                    this.closeFormBox();
                }
                this.setState({
                    uploading: false,
                })
            })
        })
    }

    closeMoneyFn(i) {  // 关闭支付意向金 1:成功  2：失败
        if (i == 1) {
            this.setState({
                showPayEarnestMoney: false
            });
            this.closeFormBox();
        } else {
            this.setState({
                showPayEarnestMoney: false
            })
            this.closeFormBox();
        }
    }
    closeMeasuringFn(i) {  // 关闭申请测算  1:成功  2：失败
        if (i == 1) {
            this.setState({
                showApplyMeasuring: false
            })
            // this.responseData();
        } else {
            this.setState({
                showApplyMeasuring: false
            })
        }
        this.responseData();
    }
    measuringClickFn(item, index) {  // 点击“申请测算”
        this.state.responsePlans[index].click = 1;  // 申请测算是否点击 0：未点击， 1：点击
        this.setState({
            noMsgCesuan: true,
            projectIndex: -1,
        }, () => {
            this.saveSendDataFn(3, index, item);  // TODO：type: 1 保存草稿， type: 2 发布运力信息, type: 3 申请测算-保存草稿, type: 4 保存-保存为草稿组件
        });
    }

    saveOrNotSaveFn() {  // 保存-是否保存为草稿组件
        this.setState({
            showSaveOrNotSave: false,
        });
        this.saveSendDataFn(4)  //type: 1 保存草稿， type: 2 发布运力信息, type: 3 申请测算-保存草稿，type: 4 保存-是否保存为草稿组件
    }
    saveOrNotCancelFn() {  // 取消-保存为草稿组件
        this.closeFormBox();
    }
    editOrNotSaveFn(item, index) {  // 确认修改-修改方案组件
        this.editProject(item, index);
        this.setState({
            showEditOrNot: false
        })
    }
    editOrNotCancelFn() {  // 取消-修改方案组件
        this.setState({
            showEditOrNot: false
        })
    }
    closeFormBox() {
        let o = {
            popupType: 0,
            popupMes: '',
        }
        emitter.emit('openPopup', o);
    }
    closeIconClickFn() {
        this.closeFn();
    }
    initData(editType, data) {  // 查询成功-方案存在   editType: 1:响应,2:重新编辑
        if (!data) return;
        // 时刻
        let textNum = 0;   // 其他说明字数
        let date = [ //拟开航班默认数据
            { name: "1", type: true },
            { name: "2", type: true },
            { name: "3", type: true },
            { name: "4", type: true },
            { name: "5", type: true },
            { name: "6", type: true },
            { name: "7", type: true }
        ];
        if (data.days == '') {  // 拟开班期
            date.forEach((v, i) => {
                date[i].type = false
            })
        } else {
            let days = data.days.split('/');
            date.forEach((v, i) => {
                date[i].type = false
            });
            for (let day of days) {
                date.forEach((val, index) => {
                    if (day == val.name) {
                        date[index].type = true;
                    }
                })
            }
        }
        if (data.remark) {  // 其他说明字数
            textNum = data.remark.length;
        }
        let responsePlans = [];  // 方案
        if (data.responsePlans != null && data.responsePlans.length != 0) {
            data.responsePlans.forEach((val) => {
                let obj = {};  //始发：dptNm, 经停：pstNm，到达：arrvNm，方式：quoteType，价格：quotedPrice
                obj.dptNm = val.dptNm;  // 始发文字
                obj.pstNm = val.pstNm;   // 经停文字
                obj.arrvNm = val.arrvNm; // 到达文字
                obj.dpt = val.dpt;  // 始发三字码
                obj.pst = val.pst;  // 经停三字码
                obj.arrv = val.arrv;  // 到达三字码
                obj.quoteType = val.quoteType;  // quoteType,1:定补，2:保底
                obj.quotedPrice = val.quotedPrice;  // 报价
                obj.state = val.state;  // 测算状态(0-正常，1-删除，2-测算中，3-测算完成)
                obj.id = val.id;  // TODO:方案id，只有在数据初始化时才有此参数
                obj.responseId = val.responseId;  // 响应id
                obj.click = val.click === null ? 0 : val.click;  //TODO：此处有bug，需要后台将click传回  申请测算是否点击 0：未点击， 1：点击
                obj.calculationId = val.calculationId;
                obj.calculationState = val.calculationState;
                responsePlans.push(obj);
            });
        }
        if (editType == 1) {  // 1:响应
            this.setState({
                responseProgress: data.responseProgress,  // 7.25增加-意向的progress，用于判断 我要洽谈-申请测算时是否需要保存草稿
                id: data.id,  // 意向id
                responseId: data.id,  // 意向id
                remark: data.remark,  // 其他说明
                textNum: textNum,  // 其他说明字数
                //TODO:有错、待修改
                timeRequirements: Number(data.timeRequirements),  // 时刻要求（0-白班，1-晚班，2-不限）

                periodValidity: data.periodValidity,  // 需求有效期
                date: date,  // 拟开班期
                // TODO: 填写方案
                responsePlans: responsePlans,  // 方案数据，始发：dptNm, 经停：pstNm，到达：arrvNm，报价：price{方式：type，价格：num}
                // TODO:表单验证
                contact: data.contact,  // 联系人
                ihome: data.ihome,  // 联系方式
                saveDraftId: data.id,  // TODO：自己添加的“保存草稿的id”
                sailingtime: data.sailingtime,  // 计划通航时间
            }, () => {
                this.changeEvent(this.state.sailingtime);
            });
        } else if (editType == 2) {  // 2:重新编辑
            let myId = this.props.popupMes.transmit.demandId;
            let searchText2 = '',
                dpt = '',
                searchText3 = '',
                pst = '',
                searchText4 = '',
                arrv = '',
                quoteType = '',
                quotedPrice = '',
                showPassInput = false,
                projectIndex = -1,
                btnText = '新增方案',
                designRadioValue = 1,
                planId = null;
            this.setState({
                responseProgress: data.responseProgress,  // 7.25增加-意向的progress，用于判断 我要洽谈-申请测算时是否需要保存草稿
                planId: planId,
                designRadioValue: designRadioValue,
                searchText2: searchText2,  // 始发运力输入框文字
                searchText2Bus: searchText2,  // 始发运力输入框存储
                dpt: dpt,  // 始发三字码
                searchText3: searchText3,  // 经停输入框文字
                searchText3Bus: searchText3,  // 经停输入框存储
                pst: pst,  // 经停三字码
                searchText4: searchText4,  // 到达输入框文字
                searchText4Bus: searchText4,  // 到达输入框存储
                arrv: arrv,  // 到达三字码
                quoteType: quoteType,  // 报价-方式
                quotedPrice: quotedPrice,   // 报价-价格
                showPassInput: showPassInput,
                btnText: btnText,
                projectIndex: projectIndex,

                id: data.id,  // 意向id
                responseId: data.id,  // 意向id
                remark: data.remark,  // 其他说明
                textNum: textNum,  // 其他说明字数
                //TODO:有错、待修改
                timeRequirements: Number(data.timeRequirements),  // 时刻要求（0-白班，1-晚班，2-不限）

                periodValidity: data.periodValidity,  // 需求有效期
                date: date,  // 拟开班期
                // TODO: 填写方案
                responsePlans: responsePlans,  // 方案数据，始发：dptNm, 经停：pstNm，到达：arrvNm，报价：price{方式：type，价格：num}
                // TODO:表单验证
                contact: data.contact,  // 联系人
                ihome: data.ihome,  // 联系方式
                saveDraftId: data.id,  // TODO：自己添加的“保存草稿的id”
                sailingtime: data.sailingtime,  // 计划通航时间
            }, () => {
                this.changeEvent(this.state.sailingtime);
            });
        }

    }
    // 确认选择方案,数据初始化
    initEdit3(editType, obj) {
        let data = obj.reResponse;
        let demandPlan = obj.demandPlan;
        if (!data) return;
        let { dptTime, pstTime, arrvTime, pstTimeBack, performShift = 0 } = data;
        // 时刻
        let dptLevel = dptTime ? dptTime.split(',')[0] : '',
            dptEnter = dptTime ? dptTime.split(',')[1] : '',
            pstLevel = pstTime ? pstTime.split(',')[0] : '',
            pstEnter = pstTime ? pstTime.split(',')[1] : '',
            arrvLevel = arrvTime ? arrvTime.split(',')[0] : '',
            arrvEnter = arrvTime ? arrvTime.split(',')[1] : '',
            pstBackLevel = pstTimeBack ? pstTimeBack.split(',')[0] : '',
            pstBackEnter = pstTimeBack ? pstTimeBack.split(',')[1] : '';
        let textNum = 0;   // 其他说明字数
        let date = [ //拟开航班默认数据
            { name: "1", type: true },
            { name: "2", type: true },
            { name: "3", type: true },
            { name: "4", type: true },
            { name: "5", type: true },
            { name: "6", type: true },
            { name: "7", type: true }
        ];

        let releaseDemandPoint = obj.releaseDemandPoint,
            releaseDemandPointNm = obj.releaseDemandPointNm,
            targetPoint = obj.targetPoint,
            targetPointNm = obj.targetPointNm;

        if (data.days == '') {  // 拟开班期
            date.forEach((v, i) => {
                date[i].type = false
            })
        } else {
            let days = data.days.split('/');
            date.forEach((v, i) => {
                date[i].type = false
            })
            for (let day of days) {
                date.forEach((val, index) => {
                    if (day == val.name) {
                        date[index].type = true;
                    }
                })
            }
        }
        if (data.remark) {  // 其他说明字数
            textNum = data.remark.length;
        }
        let { dpt = '', pst = '', arrv = '', dptNm = '', pstNm = '', arrvNm = '', quoteType = '', quotedPrice = '', pstAreaType } = data.responsePlans[0];

        let showPassInput = false;
        if (pst || arrv) {
            showPassInput = true;
        } else {
            showPassInput = false;
        }

        let designRadioValue = 1;
        if (pst) {
            // designRadioValue = 2;
            if (demandPlan.pstMandatoryDesignation == '1' && demandPlan.mandatoryDesignation == '1') {
                designRadioValue = 3;
            } else if (demandPlan.pstMandatoryDesignation == '1') {
                designRadioValue = 2;
            } else if (demandPlan.mandatoryDesignation == '1' && demandPlan.pstMandatoryDesignation=='0') {
                designRadioValue = 2
            } else if (demandPlan.mandatoryDesignation == '1') {
                designRadioValue = 3
            } else {
                designRadioValue = 2;
            }
        } else {
            designRadioValue = 1;
        }
        this.setState({
            designRadioValue,
        }, () => {
            this.bindAreaType()
        })
        this.setState({
            editType,
            designRadioValue: designRadioValue,//初始化直飞或者经停
            isInit: 1,
            searchText2: dptNm,
            searchText2Bus: dptNm,
            dpt: dpt,  // 到达三字码
            searchText3: pstNm,
            searchText3Bus: pstNm,
            pst: pst,  // 到达三字码
            searchText4: arrvNm,
            searchText4Bus: arrvNm,
            arrv: arrv,  // 到达三字码

            id: data.id,  // 意向id
            employeeId: data.employeeId,
            demandId: data.demandId,
            remark: data.remark,  // 其他说明
            textNum: textNum,  // 其他说明字数
            //TODO:有错、待修改
            timeRequirements: Number(data.timeRequirements),  // 时刻要求（0-白班，1-晚班，2-不限）
            date: date,  // 拟开班期
            // TODO: 填写方案
            // TODO:表单验证
            contact: data.contact,  // 联系人
            ihome: data.ihome,  // 联系方式
            periodValidity: data.periodValidity,
            quoteType,
            quotedPrice,
            dptLevel, dptEnter, pstLevel, pstEnter, pstBackLevel, pstBackEnter, arrvLevel, arrvEnter,
            responsePlans: data.responsePlans,
            releaseDemandPoint,
            releaseDemandPointNm,
            targetPoint,
            targetPointNm,
            performShift,

            // group_dpt: { dpt, dptNm, dptLevel, dptEnter },
            // group_pst: { pst, pstNm, pstLevel, pstEnter },
            // group_pstBack: { pst, pstNm, pstBackLevel, pstBackEnter },
            // group_arrv: { arrv, arrvNm, arrvLevel, arrvEnter },
        }, () => {
            console.log(this.state.designRadioValue)
            this.stopLoading();
        })
    }
    mountTime = (time) => {
        if (time) {
            return moment(time, 'hh/mm')
        }
        return null;
    };
    setDpt(data) {  // 机场设置始发、意向航点
        let myDpt = data.releaseDemandPoint,
            myDptNm = data.releaseDemandPointNm,
            myCode = data.targetPoint,
            myName = data.targetPointNm,
            demandPlan = data.demandPlan;
        let searchText2,
            searchText2Bus,
            dpt,
            searchText3,
            searchText3Bus,
            pst,
            searchText4,
            searchText4Bus,
            arrv;
        let qiangzhiPst,
            qiangzhiArrv;
        let mandatoryDesignation = demandPlan.mandatoryDesignation;  // 目标航点或甩飞航点是否强制指定（0-否，1-是）
        let pstMandatoryDesignation = demandPlan.pstMandatoryDesignation; // 经停点是否强制指定（0-否，1-是）
        let pstAreaType = demandPlan.pstAreaType;  // 经停航点类型（1-机场三字码，2-省份，3区域）
        let areaType = demandPlan.areaType;  // 甩飞或目标航点类型（1-机场三字码，2-省份，3区域）
        let showPassInput = false;
        let designRadioValue = 1;  // 航路设计1:直飞，2：经停，3：甩飞
        let designRadioDisable = false;  // 航路设计是否禁止选中
        let arrvProOrArea,
            pstProOrArea;

        if (myDpt == myCode) {
            myCode = '';
            myName = '';
        }
        searchText2 = myDptNm;  // 始发
        searchText2Bus = myDptNm;
        dpt = myDpt;
        searchText3 = '';  // 经停输入框文字
        searchText3Bus = '';  // 经停输入框存储
        pst = '';  // 经停三字码
        searchText4 = myName;
        searchText4Bus = myName;
        arrv = myCode;
        if (demandPlan.routeType === '0') {  // 航线类型：0-直飞，1-经停，2-甩飞
            if (mandatoryDesignation == 1) {
                if (areaType == 1) {  //机场
                    searchText4 = demandPlan.arrvNm;
                    searchText4Bus = demandPlan.arrvNm;
                    arrv = demandPlan.arrv;
                    qiangzhiArrv = demandPlan.arrv;  // 强制执行-到达三字码
                } else {  // 省份、区域
                    searchText4 = '';
                    searchText4Bus = '';
                    arrv = '';
                    arrvProOrArea = demandPlan.arrv;
                }
                designRadioDisable = true;
            }
        } else {
            if (pstMandatoryDesignation == 1) {  // 强制执行-经停
                if (pstAreaType == 1) {  //机场
                    searchText3 = demandPlan.pstNm;  // 经停输入框文字
                    searchText3Bus = demandPlan.pstNm;  // 经停输入框存储
                    pst = demandPlan.pst;  // 经停三字码
                    qiangzhiPst = demandPlan.pst; // 强制执行-经停三字码
                    if (qiangzhiPst == myCode) {  // TODO:9.20新增
                        myCode = '';
                        myName = '';
                        searchText4 = myName;
                        searchText4Bus = myName;
                        arrv = myCode;
                    }
                } else {  // 省份、区域
                    searchText3 = '';  // 经停输入框文字
                    searchText3Bus = '';  // 经停输入框存储
                    pst = '';  // 经停三字码
                    pstProOrArea = demandPlan.pst;
                }
                showPassInput = true;
                designRadioValue = 2;
                designRadioDisable = true;
            }
            if (mandatoryDesignation == 1) {  // 强制执行-甩飞
                if (areaType == 1) {  //机场
                    searchText4 = demandPlan.arrvNm;
                    searchText4Bus = demandPlan.arrvNm;
                    arrv = demandPlan.arrv;
                    qiangzhiArrv = demandPlan.arrv;  // 强制执行-到达三字码
                    if (qiangzhiArrv == myCode) {  // TODO:9.20新增
                        myCode = '';
                        myName = '';
                        searchText3 = myName;
                        searchText3Bus = myName;
                        pst = myCode;
                    }
                } else {  // 省份、区域
                    searchText4 = '';
                    searchText4Bus = '';
                    arrv = '';
                    arrvProOrArea = demandPlan.arrv;
                }
                showPassInput = true;
                designRadioValue = 2;
                designRadioDisable = true;
            }
        }
        this.setState({
            qiangzhiPst,
            qiangzhiArrv,
            arrvProOrArea,
            pstProOrArea,
            // designRadioDisable,
            demandPlan,  // 8.16 zeng
            mandatoryDesignation,  // 8.16 zeng
            pstMandatoryDesignation,  // 8.16 zeng
            pstAreaType,  // 8.16 zeng
            areaType,  // 8.16 zeng
            showPassInput,  // 8.16 zeng
            designRadioValue,  // 8.16 zeng
            myDpt,
            myDptNm,
            myCode,
            myName,
            searchText2,  // 始发
            searchText2Bus,
            dpt,
            searchText3,  // 经停输入框文字
            searchText3Bus,  // 经停输入框存储
            pst,  // 经停三字码
            searchText4,
            searchText4Bus,
            arrv,
        })
    }
    responseData() {  // 数据绑定
        let role = store.getState().role.role;
        let editType = this.props.popupMes.transmit.editType;  // 1:响应,2:重新编辑
        if (editType === 1 && role === "1") {//响应 //机场角色
            Axios({
                method: 'post',
                url: '/queryDraftResponse',
                params: {  // 一起发送的URL参数
                    demandId: this.state.demandId
                },
                dataType: 'json',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then((response) => {
                if (response.status == 200) {
                    this.setDpt(response.data);
                }
                if (Number(response.data.opResult) === 0) {  // 查询成功-方案存在，申请测算方式不同
                    this.initData(editType, response.data.obj);
                } else {
                    let date = [
                        {
                            name: "1",
                            type: false
                        }, {
                            name: "2",
                            type: false
                        }, {
                            name: "3",
                            type: false
                        }, {
                            name: "4",
                            type: false
                        }, {
                            name: "5",
                            type: false
                        }, {
                            name: "6",
                            type: false
                        }, {
                            name: "7",
                            type: false
                        }
                    ];
                    date.map((item, index) => {
                        for (let i = 0; i < response.data.days.split("/").length; i++) {
                            if (item.name == response.data.days.split("/")[i]) {
                                item.type = true
                            }
                        }
                        return item;
                    });
                    try {
                        let sailingtime = response.data.demand.obj.sailingtime;
                        this.setState({
                            date,
                            periodValidity: response.data.periodValidity,
                            sailingtime,
                        }, () => {
                            this.changeEvent(this.state.sailingtime)
                        })
                    } catch (e) {

                    }
                }
            })
        } else if (editType === 2 && role === "1") { //编辑
            Axios({
                method: 'post',
                url: '/queryDraftResponse',
                params: {  // 一起发送的URL参数
                    demandId: this.state.demandId
                },
                dataType: 'json',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            })
                .then((response) => {
                    if (response.status == 200) {
                        this.setDpt(response.data);
                    }
                    if (Number(response.data.opResult) === 0) {  // 查询成功-方案存在
                        this.initData(editType, response.data.obj);
                    } else if (Number(response.data.opResult) === 1) {  // 查询成功-用户还没有该需求下的意向
                        this.error('用户还没有该需求下的意向！');
                    }
                })
        } else if (editType === 3 && role === "0") { //确认选择方案 航司
            Axios({
                method: 'post',
                url: '/queryResponsePlanForEdit',
                params: {  // 一起发送的URL参数
                    responsePlanId: this.state.id,
                    employeeId: store.getState().role.id
                },
                dataType: 'json',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then((response) => {
                this.setDpt(response.data);
                if (Number(response.data.opResult) === 0) {  // 查询成功-方案存在
                    this.initEdit3(editType, response.data)
                } else if (Number(response.data.opResult) === 1) {  // 查询成功-用户还没有该需求下的意向
                    this.error('错误！用户还没有该需求下的意向！');
                } else {
                    this.error('获取数据失败！');
                }
            })

        } else if (editType === 4 && role === "0") { //选定方案后重新编辑 航司
            Axios({
                method: 'post',
                url: '/queryResponsePlanForEdit',
                params: {  // 一起发送的URL参数
                    responsePlanId: this.state.id,
                    employeeId: store.getState().role.id
                },
                dataType: 'json',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then((response) => {
                this.setDpt(response.data);
                if (Number(response.data.opResult) === 0) {  // 查询成功-方案存在
                    this.initEdit3(editType, response.data)
                } else if (Number(response.data.opResult) === 1) {  // 查询成功-用户还没有该需求下的意向
                    this.error('错误！用户还没有该需求下的意向！');
                }
            })
        } else {
            this.error('错误！');
        }
        // if(this.state.bianjiOrNot) {  // 是否是点击“重新编辑”true：重新编辑，false：我要洽谈
        //     Axios({
        //         method: 'post',
        //         url: '/queryResponsePlanForEdit',
        //         params:{  // 一起发送的URL参数
        //             responsePlanId: this.state.id,
        //             employeeId: store.getState().role.id
        //         },
        //         dataType:'json',
        //         headers: {
        //             'Content-type': 'application/json;charset=utf-8'
        //         }
        //     }).then((response)=>{
        //         if(Number(response.data.opResult) === 0) {  // 查询成功-方案存在
        //             this.initData(response.data.reResponse)
        //         }else if(Number(response.data.opResult) === 1) {  // 查询成功-用户还没有该需求下的意向
        //             alert('错误！用户还没有该需求下的意向');
        //         }else {
        //             alert('获取数据失败！');
        //         }
        //     })
        // }else {  // 我要洽谈
        //     Axios({
        //         method: 'post',
        //         url: '/queryDraftResponse',
        //         params:{  // 一起发送的URL参数
        //             demandId: this.state.demandId
        //         },
        //         dataType:'json',
        //         headers: {
        //             'Content-type': 'application/json;charset=utf-8'
        //         }
        //     }).then((response)=>{
        //         if(Number(response.data.opResult) === 0) {  // 查询成功-方案存在，申请测算方式不同
        //             this.initData(response.data.obj)
        //         }else if(Number(response.data.opResult) === 1) {  // 查询成功-用户还没有改需求下的意向，申请测算方式不同
        //             this.initData2();
        //         }else {
        //             alert('获取数据失败！');
        //         }
        //     })
        // }

    }
    airlineRole() {  // 航司角色登录
        let transmit = this.props.popupMes.transmit;
        let id;
        let editType = this.props.popupMes.transmit.editType;
        if (editType === 2 || editType === 3 || editType === 4) {
            id = transmit.id;
        } else {
            id = null;
        }
        this.setState({
            id: id,  // 意向id
        }, () => {
            this.responseData();
        });
    }
    airportRole() {  // 机场角色登录
        let transmit = this.props.popupMes.transmit;
        // let myCode = store.getState().role.airlineretrievalcondition; // 本机场三字码/本航司二字码
        let demandId = '', id = null;
        /*store.getState().airList.forEach((val) => {
            if (val.iata == myCode) {
                myName = val.airlnCdName;  // 本机场名字
            }
            if (val.iata == transmit.dpt && transmit.dpt != store.getState().role.airlineretrievalcondition) {
                myDpt = transmit.dpt;  // 运力始发三字码
                myDptNm = val.airlnCdName;   // 运力始发机场名
            }
        });*/
        let editType = this.props.popupMes.transmit.editType;
        if (editType === 2 || editType === 3 || editType === 4) {  // 1：我要洽谈，  2:重新编辑， 3：确认选择方案， 4：确认选择方案-重新编辑
            demandId = this.props.popupMes.transmit.demandId;
            id = transmit.id;
        } else {
            demandId = this.props.popupMes.transmit.demandId;
            id = null;
        }
        this.setState({
            bianjiOrNot: transmit.bianjiOrNot,  // 是否是点击“重新编辑”true：重新编辑，false：我要洽谈
            saveSendDataShow: !transmit.bianjiOrNot,  // “保存草稿”按钮是否显示
            demandId: demandId,  // 需求id
            id: id,  // 意向id
            showPassInput: false,
            contact: store.getState().role.concat,
            ihome: store.getState().role.phone,
        }, () => {
            this.responseData();
        });
    }
    componentWillReceiveProps(nexProps) {

    }
    componentDidMount() {
        if (store.getState().role.role == 0) {//航司
            this.airlineRole();
        } else {
            this.airportRole();
        }
        this.closeFloatingLayer = emitter.addEventListener('closeFloatingLayer', (message) => {
            // 监听浮沉关闭
            this.setState({
                showAirportSearch2: false,  // 始发运力是否显示
                showAirportSearch3: false,  // 经停是否显示
                showAirportSearch4: false,  // 到达是否显示
            })
        });
        this.bindAreaType();
        console.log('初次绑定')
    }
    componentWillUnmount() {
        emitter.removeEventListener(this.closeFloatingLayer);
        // this.startLoading();
    }
    // 用户操作按钮
    btnEle = () => {
        let editType = this.props.popupMes.transmit.editType;
        if (editType === 1) {//响应
            return (
                <div style={{ padding: '0' }}>
                    <Btn text='确认提交航线方案'
                        btnType="1"
                        otherText="提交中"
                        isDisable={this.state.noMsgTijiao}
                        styleJson={{ width: "250px", padding: '0' }}
                        onClick={() => { this.sendDataFn() }} />
                </div>
                /*<div className={'btn-b'} style={{ width: '250px' }}
                    onClick={this.sendDataFn.bind(this)}>确认提交航线方案</div>*/
            )
        } else if (editType === 2) {//机场-市场运力-重新编辑
            return (
                <Btn text='确认修改航线方案'
                    btnType="1"
                    otherText="修改中"
                    isDisable={this.state.noMsgXiugai}
                    styleJson={{ width: "250px", padding: '0' }}
                    onClick={this.sendData2Fn.bind(this)} />
                /*<div className={'btn-b'} style={{ width: '250px' }}
                    onClick={this.sendData2Fn.bind(this)}>确认修改航线方案</div>*/
            )

        } else if (editType === 3) {//确认选择方案
            return (
                <Btn text='确认选择该方案'
                    btnType="1"
                    otherText="确认中"
                    isDisable={this.state.noMsgXuanze}
                    styleJson={{ width: "250px", padding: '0' }}
                    onClick={this.showReconfirm_affirm} />
                // onClick={() => { this.sendFn(editType) }} />
                // <div className={'btn-b'} style={{ width: '250px' }}
                //     onClick={this.sendFn.bind(this, editType)}>确认选择该方案</div>
            )

        } else if (editType === 4) {//选择方案后重新编辑
            return (
                <Btn text='确认修改航线方案'
                    btnType="1"
                    otherText="修改中"
                    isDisable={this.state.noMsgXiugai}
                    styleJson={{ width: "250px", padding: '0' }}
                    onClick={this.showReconfirm_afterAffirmReEdit} />
                // <div className={'btn-b'} style={{ width: '250px' }}
                //     onClick={this.sendData2Fn.bind(this, editType)}>确认修改航线方案</div>
            )

        }
    }


    // 隐藏对话框
    hideModal = () => {
        this.setState({
            visible_response: false,
            visible_reEdit: false,
            visible_affirm: false,
            visible_afterAffirmReEdit: false,
        });
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
            if (editType == 3) {
                this.option_affirm();
            } else if (editType == 3) {
                // this.option_affirm();
            }
        } else if (i == 2) {
            this.hidePay();
        }
    }
    // 忘记密码
    forgetPwd = () => {  // 忘记密码

    }
    // 二次确认框点击确认按钮
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
            // console.log('验证不通过', this.state)
        }
    }
    //响应提交方案 关闭二次确认框
    hideReconfirm_affirm = () => {
        this.setState(() => {
            return {
                visible_affirm: false,
            }
        })
    }
    // 确认选择方案 提交数据
    option_affirm = () => {
        let editType = this.props.popupMes.transmit.editType;
        this.setState({
            isInit: 0
        })
        if (!this.verifyForm()) {
            return;
        }
        let _this = this;
        let data = this.state.date.filter((value) => {
            if (value.type) {
                return value;
            }
        })
        data = data.map((value) => {
            return value.name;
        })
        let days = data.join('/');

        let responsePlans = this.state.responsePlans.map((value) => {
            value.dpt = _this.state.dpt;
            value.pst = _this.state.designRadioValue != 1 ? _this.state.pst : '';//判断后传参
            value.arrv = _this.state.arrv;
            value.quoteType = _this.state.quoteType;
            value.quotedPrice = _this.state.quotedPrice;
            return value
        });
        let formData = {
            id: this.state.id,
            employeeId: this.state.employeeId,
            demandId: this.state.demandId,
            demandtype: this.state.demandtype,
            timeRequirements: this.state.timeRequirements,
            days: days,
            dptTime: this.state.dptLevel + ',' + this.state.dptEnter,
            pstTime: this.state.designRadioValue != 1 ? (this.state.pstLevel + ',' + this.state.pstEnter) : '',//判断后传参
            arrvTime: this.state.arrvLevel + ',' + this.state.arrvEnter,
            pstTimeBack: this.state.designRadioValue != 1 ? this.state.pstBackLevel + ',' + this.state.pstBackEnter : '',
            remark: this.state.remark,//说明
            contact: this.state.contact,//联系人
            ihome: this.state.ihome,//移动电话
            responsePlans: responsePlans,
            performShift: this.state.performShift,//计划执行班次

        }
        if (editType === 3) {
            this.setState({
                noMsgXuanze: true,
            }, () => {
                Axios({
                    url: 'releaseCheck',
                    method: 'post',
                    data: JSON.stringify(formData),
                    dataType: 'json',
                    headers: {
                        'Content-type': 'application/json;charset=utf-8'
                    }
                }).then((response) => {
                    if (response.data.opResult === '0') {
                        this.success('确认选择方案成功！');
                        this.closePopup();
                    } else {
                        this.error(response.data.msg);
                        this.closePopup();
                    }
                    this.setState(() => {
                        return {
                            uploading: false,
                        }
                    })
                })
            });
        }
    };

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
            // console.log('验证不通过', this.state)
        }
    }


    option_afterAffirmReEdit = () => {
        this.setState({
            isInit: 0
        })
        if (!this.verifyForm()) {
            return;
        }
        this.setState(() => {
            return {
                uploading: true,
            }
        }, () => {
            let editType = this.props.popupMes.transmit.editType;
            let {
                responsePlans = [],
                timeRequirements,// 时刻要求（0-白班，1-晚班，2-不限）
                periodValidity,// 需求有效期
                contact,// 联系人
                ihome,// 联系方式
                remark,// 其他说明
                id,// TODO：此处需要从ajax数据获取或为null
                demandId,//
                employeeId,
                date,//拟开班期

                dpt,
                pst,
                arrv,
                designRadioValue,
                quoteType,
                quotedPrice,
                performShift,

                dptLevel, dptEnter, pstLevel, pstEnter, arrvLevel, arrvEnter, pstBackLevel, pstBackEnter,

                delResponsePlanIds = '',

                ihomeWarnShow

            } = this.state;

            let dptTime = dptLevel + ',' + dptEnter;
            let pstTime = designRadioValue != 1 ? (pstLevel + ',' + pstEnter) : '';
            let arrvTime = arrvLevel + ',' + arrvEnter;
            let pstTimeBack = designRadioValue != 1 ? (pstBackLevel + ',' + pstBackEnter) : '';

            // 日期
            let tempDate = [];
            date.forEach((val) => {
                if (val.type) {
                    tempDate.push(val.name)
                }
            });
            let days = tempDate.join('/');

            // 方案
            if (responsePlans && responsePlans.length) {
                responsePlans = responsePlans.map((value) => {
                    value.dpt = dpt;
                    value.pst = designRadioValue != 1 ? pst : '';//判断后传参
                    value.arrv = arrv;
                    value.quoteType = quoteType;
                    value.quotedPrice = quotedPrice;
                    return value
                });
            }


            let demand = {
                timeRequirements,
                periodValidity,
                days,
                contact,
                ihome,
                remark,
                id,
                demandId,
                employeeId,
                responsePlans,
                dptTime,
                pstTime,
                arrvTime,
                pstTimeBack,
                performShift,
            }

            if (editType === 4) {
                Axios({
                    method: 'post',
                    url: '/responseUpdateV2',
                    /*params:{  // 一起发送的URL参数
                        demandId: demandId,
                        employeeId: employeeId
                    },*/
                    data: JSON.stringify(demand),
                    dataType: 'json',
                    headers: {
                        'Content-type': 'application/json;charset=utf-8'
                    }
                }).then((response) => {
                    if (response.data.opResult == 0) {
                        this.success('修改成功！');
                        this.closeFormBox();
                    } else {
                        this.error('此方案状态有变,不可修改,请刷新');
                        // this.error('修改失败！');
                        this.closeFormBox();
                    }
                    this.setState(() => {
                        return {
                            uploading: false,
                        }
                    })
                })
            }

        })

    }


    menu() {
        return (
            <Menu onClick={this.menuClickFn.bind(this)}>
                <Menu.Item key="2">保底</Menu.Item>
                <Menu.Item key="1">定补</Menu.Item>
                <Menu.Item key="0">待议</Menu.Item>
            </Menu>
        )
    }
    projectState(item, index) { // 测算状态(null-正常，0-测算中，1-测算完成)
        let calculationState = item.calculationState;
        // return (
        //     <div className={'btn-w'}
        //         style={{ padding: '5px 13px', borderRadius: '20px', margin: '0 30px', color: '#5772BF', whiteSpace: 'nowrap' }}
        //         onClick={this.measuringClickFn.bind(this, item, index)}>申请测算</div>
        // )
        if (calculationState === null) {
            return (
                <Btn text='申请测算'
                    btnType="0"
                    otherText="申请中"
                    isDisable={this.state.noMsgCesuan}
                    styleJson={{ margin: '0 30px', padding: '5px 13px', height: '28px', borderRadius: '20px', color: '#5772BF', fontSize: '1.2rem', whiteSpace: 'nowrap' }}
                    onClick={() => { this.measuringClickFn(item, index) }} />
                // <div className={'btn-w'}
                //      style={{ padding: '5px 13px', borderRadius: '20px', margin: '0 30px', color: '#5772BF', whiteSpace: 'nowrap' }}
                //      onClick={this.measuringClickFn.bind(this, item, index)}>申请测算</div>
            )
        } else if (calculationState === '0') {
            return (
                <div style={{ padding: '5px 13px', borderRadius: '20px', margin: '0 30px', color: '#5772BF' }}>测算中</div>
            )
        } else if (calculationState === '1') {
            return (
                <a className={'btn-w'}
                    style={{ padding: '5px 13px', borderRadius: '20px', margin: '0 30px', color: '#5772BF', whiteSpace: 'nowrap' }}
                    href={`downloadCalculationsRecord?id=${item.calculationId}`}>测算完成</a>
                // <div style={{ padding: '5px 13px', borderRadius: '20px', margin: '0 30px', color: '#5772BF' }}>测算完成</div>
            )
        }
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

    // 联系人检查
    checkContact = (name) => {
        let { editType } = this.state;
        // if (editType != 3 || editType != 4) {
        //     return '';
        // }
        if (editType == 3 || editType == 4) {
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
    }
    // 联系电话检查
    checkIHome = (name) => {
        let { editType } = this.state;
        // if (editType != 3 || editType != 4) {
        //     return '';
        // }
        if (editType == 3 || editType == 4) {
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
    }
    checkDate = (name) => {
        let { editType } = this.state;
        // if (editType != 3 || editType != 4) {
        //     return '';
        // }
        if (editType == 3 || editType == 4) {
            let bool, tip, msg = this.state.msg, date = this.state.date;
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
    }
    // 合作方式检查
    checkPrice = (name) => {
        let { editType } = this.state;
        // if (editType != 3 || editType != 4) {
        //     return '';
        // }
        if (editType == 3 || editType == 4) {
            let bool, tip;
            let { msg, quoteType, quotedPrice } = this.state;
            if (quoteType == '' || quoteType === null) {
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
                    tip = '请刷新页面'; bool = false;
                }
            }
            msg[name] = bool;
            this.setState(() => {
                msg
            })
            return this.state.isInit == 1 ? '' : tip;
        }
    }
    // 检查时刻
    checkTime = (name) => {
        let { editType } = this.state;
        // if (editType != 3 || editType != 4) {
        //     return '';
        // }
        if (editType == 3 || editType == 4) {
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
    }
    returnCheckAirpointResult(name, bool, tip) {
        let { msg } = this.state;
        msg[name] = bool;
        this.setState(() => {
            msg
        })
        return this.state.isInit == 1 ? '' : tip;
    }
    // 检查航点
    checkAirPoint = (name) => {
        let currReturnCheckAirpointResult = this.returnCheckAirpointResult.bind(this, name);
        let { editType } = this.state;
        // if (editType != 3 || editType != 4) {
        //     return '';
        // }
        if (editType == 3 || editType == 4) {
            let bool = false, tip = '错误';
            let { demandPlan = {}, msg, targetPoint, targetPointNm, dpt, pst, arrv, designRadioValue } = this.state;
            let {
                dpt: demand_dpt,
                dptNm: demand_dptNm,
                pst: demand_pst,
                pstNm: demand_pstNm,
                arrv: demand_arrv,
                arrvNm: demand_arrvNm,
                pstMandatoryDesignation,//string 经停强制
                mandatoryDesignation,//string 到达强制
                areaType,//string 甩飞或目标航点类型（1-机场三字码，2-省份，3区域）
                pstAreaType,//string 经停航点类型（1-机场三字码，2 - 省份，3区域）
            } = demandPlan;
            let airline = 0;//0直飞,1经停
            if (demand_pst) {
                airline = 1;
            }

            // 此表单直飞经停甩飞123,航司响应表单直飞经停甩飞012,但逻辑相同,遂减一
            designRadioValue -= 1;

            if (dpt == '') {
                bool = false; tip = '始发航点不能为空';
                return currReturnCheckAirpointResult(bool, tip);
            } else if (dpt != demand_dpt) {
                bool = false; tip = '始发航点必须为' + demand_dptNm;
                return currReturnCheckAirpointResult(bool, tip);
            } else {
                if (pst == '' && designRadioValue != 0) { //当不为直飞时经停航点不能为空
                    bool = false; tip = '经停航点不能为空';
                    return currReturnCheckAirpointResult(bool, tip);
                } else if (arrv == '') {
                    bool = false; tip = '到达航点不能为空';
                    return currReturnCheckAirpointResult(bool, tip);
                } else if (dpt == targetPoint || pst == targetPoint || arrv == targetPoint) {//航点中必定包含了本场

                    // if (designRadioValue == 0) {
                    //     if (arrv == targetPoint || dpt == targetPoint) {
                    //         bool = true; tip = '';
                    //     } else {
                    //         bool = false; tip = '请填写符合航司要求的方案'
                    //     }
                    //     // 不满足条件
                    //     if (!bool) {
                    //         return currReturnCheckAirpointResult(bool, tip);
                    //     }
                    // }
                    // if (designRadioValue == 1) {
                    //     if (pst == targetPoint || dpt == targetPoint || arrv==targetPoint) {
                    //         bool = true; tip = '';
                    //     } else {
                    //         bool = false; tip = '请填写符合航司要求的方案'
                    //     }
                    //     // 不满足条件
                    //     if (!bool) {
                    //         return currReturnCheckAirpointResult(bool, tip);
                    //     }
                    // }
                    // if (designRadioValue == 2) {
                    //     if (arrv == targetPoint || dpt == targetPoint || pst == targetPoint) {
                    //         bool = true; tip = '';
                    //     } else {
                    //         bool = false; tip = '请填写符合航司要求的方案'
                    //     }
                    //     // 不满足条件
                    //     if (!bool) {
                    //         return currReturnCheckAirpointResult(bool, tip);
                    //     }
                    // } else {
                    //     // 不满足条件

                    // }
                    if (mandatoryDesignation == '1') {//强制到达
                        if (airline === 0) { //需求直飞
                            if (areaType == '1') {//航点
                                if ((designRadioValue == 0 && arrv == demand_arrv) || (designRadioValue != 0 && pst == demand_arrv)) {//强制点必须为 需求强制点
                                    bool = true; tip = '';
                                } else {
                                    bool = false; tip = '请填写符合航司要求的方案';
                                }
                            } else {//非航点
                                bool = true; tip = '';
                            }
                        } else { //需求经停
                            if (areaType == '1') {//航点
                                if ((arrv == demand_arrv) && pst) {
                                    bool = true; tip = '';
                                } else {
                                    bool = false; tip = '请填写符合航司要求的方案';
                                }
                            } else {//非航点
                                bool = true; tip = '';
                            }
                        }
                        // 不满足条件
                        if (!bool) {
                            return currReturnCheckAirpointResult(bool, tip);
                        }
                    }
                    if (pstMandatoryDesignation == '1') {
                        if (pstAreaType == '1') {
                            if (designRadioValue != 0 && pst == demand_pst) {
                                bool = true; tip = '';
                            } else {
                                bool = false; tip = '请填写符合航司要求的方案';
                            }
                        } else {
                            bool = true; tip = '';
                        }
                        // 不满足条件
                        if (!bool) {
                            return currReturnCheckAirpointResult(bool, tip);
                        }
                    }
                    return currReturnCheckAirpointResult(true, '');

                } else {
                    bool = false; tip = '请包含' + targetPointNm;
                    return currReturnCheckAirpointResult(bool, tip);
                }


            }
        }
    };
    quoteNumText(n) { // 1-定补，2-保底
        switch (n) {
            case '1':
                return '万/班';
                break;
            case '2':
                return '万/时';
                break;
            default:
                return '';
                break;
        }
    }
    showDeleteProject(editType, calculationState, item, index) {
        if (editType != 2) {
            if (calculationState === '0') {
                return (<Tooltip title="测算完成后方可删除">
                    <span className={'iconfont'} style={{ cursor: 'auto' }}>&#xe67a;</span>
                </Tooltip>)
            } else {
                return (<span className={'iconfont'} style={{ cursor: 'pointer' }}
                    onClick={this.deleteProjectClickFn.bind(this, item, index)}>&#xe67a;</span>)
            }
        } else {
            return false;
        }
    }
    render() {
        let axis = {  // 下拉搜索样式
            position: 'absolute',
            top: '40px',
            left: '-10px',
            maxHeight: '220px',
            width: '220px',
            overflowY: 'scroll',
            background: 'white',
            zIndex: 22,
            boxShadow: '0 2px 11px rgba(85,85,85,0.1)'
        };
        let editType = this.props.popupMes.transmit.editType;
        let _this = this;
        let propjectItem = (_this.state.responsePlans != null && _this.state.responsePlans.length != '')
            ? (_this.state.responsePlans.map((item, index) => {  // 我发出的方案
                return (
                    <div className={`${styles['third']}`} key={index}>
                        <div style={{ padding: '12px 0', textIndent: '20px', fontWeight: 'bold' }}>方案{index + 1}：</div>
                        <div className={`${styles['flex']} ${styles['my-project']}`}>
                            <div className={styles['flex']}>
                                <div>
                                    <div className={styles['marginBottom']}>始发（运力）</div>
                                    <div className={styles['text-height']}>
                                        <span className={styles['bold']}>{item.dptNm}</span>
                                    </div>
                                </div>
                                <span className={'iconfont'} style={{ fontSize: '30px' }}>&#xe672;</span>
                                {
                                    item.pstNm && (<div>
                                        <div className={styles['marginBottom']}>经停</div>
                                        <div className={styles['text-height']}>
                                            <span className={styles['bold']}>{item.pstNm}</span>
                                        </div>
                                    </div>)
                                }
                                {
                                    item.pstNm && <span className={'iconfont'} style={{ fontSize: '30px' }}>&#xe672;</span>
                                }
                                <div>
                                    <div className={styles['marginBottom']}>到达</div>
                                    <div className={styles['text-height']}>
                                        <span className={styles['bold']}>{item.arrvNm}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles['border']} style={{ marginLeft: '25px' }}></div>
                            <div style={{ width: '130px', paddingLeft: '25px', boxSizing: 'border-box' }}>
                                <div className={styles['marginBottom']}>报价</div>
                                <div className={`${styles['bold']} ${styles['text-height']}`}>
                                    <span style={{ display: 'inline-block', minWidth: '30px' }}>
                                        {/* 修改使用报价类型代码代替文字 */}
                                        {
                                            item.quoteType === "1" ? "定补" : ''
                                        }
                                        {
                                            item.quoteType === "2" ? "保底" : ''
                                        }
                                        {
                                            item.quoteType === "0" ? "待议" : ''
                                        }
                                        {item.quotedPrice}
                                    </span>
                                    {
                                        (item.quoteType != '' || item.quotedPrice != '') && this.quoteNumText(item.quoteType)
                                    }
                                </div>
                            </div>
                            <div className={styles['border']}></div>
                            <div className={styles['flex']} style={{ width: '180px' }}>
                                {_this.projectState(item, index)}
                                <div style={{ fontSize: '20px', color: '#627AB6', userSelect: 'none' }}>
                                    {
                                        item.calculationState === '0'
                                            ? (<Tooltip title="测算完成后方可编辑">
                                                <span className={'iconfont'} style={{ cursor: 'auto' }}>&#xe645;</span>
                                            </Tooltip>)
                                            : (<span className={'iconfont'} style={{ cursor: 'pointer' }}
                                                onClick={_this.editProjectClickFn.bind(_this, item, index)}>&#xe645;</span>)
                                    }
                                    {
                                        this.showDeleteProject(this.props.popupMes.transmit.editType, item.calculationState, item, index)
                                        /*<span className={'iconfont'} style={{ cursor: 'pointer' }}
                                            onClick={_this.deleteProjectClickFn.bind(_this, item, index)}>&#xe67a;</span>*/
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })) : '';

        // 拟开班期警告
        let daysWarn = <div style={{ position: 'absolute', top: '40px', left: '0', color: 'red' }}>
            请选择拟开班期！
        </div>;
        // 强制执行-机场警告
        let airlineQiangzhiWarn = <div style={{ position: 'absolute', top: '40px', left: '0', color: 'red' }}>
            请提交符合该航司要求的方案！
        </div>;
        // 始发、经停、到达警告
        let airlineWarn = <div style={{ position: 'absolute', top: '40px', left: '0', color: 'red' }}>
            必须同时含有本机场和始发航点！
        </div>;
        // 始发、经停、到达警告
        let airline2Warn = <div style={{ position: 'absolute', top: '40px', left: '0', color: 'red' }}>
            请填写始发和到达机场！
        </div>;
        let airline3Warn = <div style={{ position: 'absolute', top: '40px', left: '0', color: 'red' }}>
            始发航点必须为始发机场！
        </div>;
        // 为经停、甩飞时三个输入框必须全填的警告
        let airline1Warn = <div style={{ position: 'absolute', top: '40px', left: '0', color: 'red' }}>
            请填写始发、经停、到达机场！
        </div>;
        // 报价警告
        let quoteWarn = <div style={{ position: 'absolute', top: '100px', left: '0', color: 'red' }}>
            请填写报价方式及金额！
        </div>;
        // 需求有效期警告
        let periodValidityWarn = <div style={{ position: 'absolute', top: '45px', left: '0', color: 'red' }}>
            请选择需求有效期！
        </div>;
        let periodValidity3Warn = <div style={{ position: 'absolute', top: '45px', left: '0', color: 'red', whiteSpace: 'nowrap' }}>
            方案有效期至少晚于当前时间一个月！
        </div>;
        // 保存方案警告
        let saveProjectWarn = <div style={{ position: 'absolute', bottom: '0', right: '300px', color: 'red', fontSize: '1.8rem' }}>
            请先新增方案！
        </div>;


        // 联系方式警告
        let ihomeWarn = <div style={{ position: 'absolute', top: '40px', left: '-55px', color: 'red' }}>
            请输入正确的联系方式！
        </div>;
        // 联系人警告
        let contactWarn = <div style={{ position: 'absolute', top: '40px', left: '-55px', color: 'red' }}>
            请输入联系人！
        </div>;

        // 需求有效期默认展示
        let periodValidity = (this.state.periodValidity == '' || this.state.periodValidity == null)
            ? null
            : moment(this.state.periodValidity, dateFormat);
        let passInput = this.state.showPassInput
            ? <div className={styles['col-box']} style={{ marginBottom: '20px' }}>
                <div className={styles['col-text']}>
                    <span className={'iconfont'} style={{ fontSize: '20px' }}>&#xe6ad;</span>
                </div>
                <div className={styles['col-input']}>
                    <input type="text"
                        style={{ width: '180px' }}
                        maxLength="20"
                        placeholder="请输入航点"
                        value={this.state.searchText3}
                        onClick={(e) => { e.stopPropagation() }}
                        onChange={this.searchTextChangeFn3.bind(this)}
                        onFocus={this.inputClickFn3.bind(this)} />
                    {
                        this.state.showAirportSearch3 && <AirportSearch
                            axis={axis}
                            qiangzhizhixing={this.state.pstMandatoryDesignation}
                            areaType={this.state.pstAreaType}
                            provinceOrArea={this.state.pstProOrArea}
                            resData={this.airportData3.bind(this)}
                            searchText={this.state.searchText3} />
                    }
                </div>
            </div>
            : <div className={styles['col-box']} style={{ marginBottom: '20px', background: 'transparent' }}></div>
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
        return (
            <div className={styles['new-demand-screen-change']}>
                {
                    <Confirmations title={'方案编辑'} subTitle={'确认修改该方案'} tipText={''} visible={this.state.visible_reEdit} onOk={this.sendData3Fn.bind(this)} onCancel={() => { this.setState({ visible_reEdit: false }) }} uploading={this.state.uploading} />
                }
                {
                    this.state.isLoading && (editType === 3 || editType === 4) ? <div style={{ height: '100%', width: '100%', position: 'absolute', background: 'rgba(0,0,0,0)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Spin tip='loading...' />
                    </div> : ''
                }

                <div className={`scroll ${styles['airline-need']}`}
                    style={{ top: '0', height: '100%' }}
                    ref="myRef">
                    <h2>您想如何使用该运力?</h2>
                    <span className={`${'iconfont'} ${styles['closeIcon']}`}
                        onClick={this.closeIconClickFn.bind(this)}>&#xe62c;</span>
                    {
                        this.state.showPayEarnestMoney && <PayEarnestMoneyChen
                            data={this.state.payData}
                            close={this.closeMoneyFn.bind(this)} />
                    }
                    {
                        this.state.showApplyMeasuring && <ApplyMeasuringChen
                            data={this.state.applyMeasuringData}
                            close={this.closeMeasuringFn.bind(this)} />
                    }
                    {
                        this.state.showSaveOrNotSave && <SaveOrNot
                            save={this.saveOrNotSaveFn.bind(this)}
                            cancel={this.saveOrNotCancelFn.bind(this)} />
                    }
                    {
                        this.state.showEditOrNot && <EditOrNot
                            data={this.state.editProjectObj}
                            save={this.editOrNotSaveFn.bind(this)}
                            cancel={this.editOrNotCancelFn.bind(this)} />
                    }
                    {
                        this.state.showDeleteOrNot && <DeleteOrNot
                            index={this.state.deleteOrNotIndex}
                            delResponsePlanId={this.state.delResponsePlanId}
                            save={this.deleteOrNotSaveFn.bind(this)}
                            cancel={this.deleteOrNotCancelFn.bind(this)} />
                    }
                    {
                        <div>
                            <div className={`${styles['second']}`}>
                                {
                                    this.state.saveProjectWarnShow && saveProjectWarn
                                }
                                <div className={styles['flex']} style={{ marginBottom: '35px' }}>
                                    <span style={{ marginRight: '25px' }}>航路设计</span>
                                    <RadioGroup name="radiogroup"
                                        className={styles['flex']}
                                        defaultValue={1}
                                        value={this.state.designRadioValue}
                                        disabled={this.state.designRadioDisable}
                                        onChange={this.designRadioChangeFn2.bind(this)}>
                                        <Radio value={1} style={{ fontSize: '1.2rem' }}>直飞</Radio>
                                        <Radio value={2} style={{ fontSize: '1.2rem' }}>经停</Radio>
                                        <Radio value={3} style={{ fontSize: '1.2rem' }}>甩飞</Radio>
                                    </RadioGroup>
                                </div>
                                {/* 确认选择方案 增加时刻 判断显示相应 */}
                                {editType === 3 || editType === 4 ?
                                    (
                                        <div className={styles['time-con']}>
                                            <div className={styles['site-time-con']} style={{ justifyContent: this.getSiteTimeStyle }}>
                                                <div className={styles['col-item']}>
                                                    {/*始发运力*/}
                                                    <div className={styles['common-style']}>
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
                                                                placeholder={'请输入始发航点'} />
                                                            <div className={styles['drop-list']}>
                                                                {
                                                                    this.state.showAirportSearch2 && <AirportSearch
                                                                        axis={axis}
                                                                        resData={this.airportData2.bind(this)}
                                                                        searchText={this.state.searchText2} />
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/**/}
                                                </div>
                                                {
                                                    this.state.designRadioValue != 1 ? (<div className={styles['col-item']}>
                                                        {/*经停运力*/}
                                                        <div className={styles['common-style']}>
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
                                                                    placeholder={'请输入经停航点'} />
                                                                <div className={styles['drop-list']}>
                                                                    {
                                                                        this.state.showAirportSearch3 && <AirportSearch
                                                                            axis={axis}
                                                                            qiangzhizhixing={this.state.pstMandatoryDesignation}
                                                                            areaType={this.state.pstAreaType}
                                                                            provinceOrArea={this.state.pstProOrArea}
                                                                            resData={this.airportData3.bind(this)}
                                                                            searchText={this.state.searchText3} />
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>) : ''
                                                }
                                                <div className={styles['col-item']}>
                                                    {/*到达*/}
                                                    <div className={styles['common-style']}>
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
                                                                placeholder={'请输入到达航点'} />
                                                            <div className={styles['drop-list']}>
                                                                {
                                                                    this.state.showAirportSearch4 && <AirportSearch
                                                                        axis={axis}
                                                                        qiangzhizhixing={this.state.mandatoryDesignation}
                                                                        areaType={this.state.areaType}
                                                                        provinceOrArea={this.state.arrvProOrArea}
                                                                        resData={this.airportData4.bind(this)}
                                                                        searchText={this.state.searchText4} />
                                                                }
                                                            </div>
                                                        </div>
                                                        <span className={styles['msg']}>
                                                            {this.checkAirPoint('point')}
                                                            {
                                                                this.state.airlineWarnShow && airlineWarn
                                                            }
                                                            {
                                                                this.state.airlineQiangzhiWarnShow && airlineQiangzhiWarn
                                                            }
                                                            {
                                                                this.state.airline1WarnShow && airline1Warn
                                                            }
                                                            {
                                                                this.state.airline2WarnShow && airline2Warn
                                                            }
                                                            {
                                                                this.state.airline3WarnShow && airline3Warn
                                                            }
                                                            {
                                                                this.state.quoteWarnShow && quoteWarn
                                                            }
                                                        </span>
                                                    </div>
                                                    {/**/}
                                                </div>
                                            </div>
                                            {/* 飞行时刻 */}
                                            <div className={styles['time-container']}>
                                                {/* 始发时刻 */}
                                                <div className={`${styles['time-col']}`}>
                                                    <div className={styles['time-box']}>
                                                        {/* 始发出港时刻 */}
                                                        <div className={`${styles['common-style']} ${styles['time-item']}`}>
                                                            <div>
                                                                <span className={styles['bgColorBlue']}>出</span>
                                                            </div>
                                                            <div>
                                                                <span className={"ant-time-picker-icon"}></span>
                                                                <div className={styles['drop-list-time']}>
                                                                    {/* <HourTimer showArrow={false} time={""} type={false} defaultTime={this.state.dptLevel} outTimeEvent={(data, timeStr) => this.outTimeEvent(data, 'dptLevel')} /> */}
                                                                    <TimePicker format={format} placeholder={"请选择出港时刻"} onChange={this.dptLevel.bind(this)} value={this.mountTime(this.state.dptLevel)} />

                                                                </div>
                                                            </div>
                                                            <span className={styles['msg']} >
                                                                {this.checkTime('dptLevel')}
                                                            </span>
                                                            <span className={styles['ident']} style={{ color: '#4172f4' }}>去程</span>
                                                        </div>
                                                        {/* 始发入港时刻 */}
                                                        <div className={`${styles['common-style']} ${styles['time-item']}`}>
                                                            <div>
                                                                <span className={styles['bgColorYellow']}>进</span>
                                                            </div>
                                                            <div>
                                                                <span className={"ant-time-picker-icon"}></span>
                                                                <div className={styles['drop-list-time']}>
                                                                    {/* <HourTimer showArrow={false} time={this.state.designRadioValue == 1 ? this.state.arrvLevel : this.state.pstBackLevel} type={false} defaultTime={this.state.dptEnter} outTimeEvent={(data, timeStr) => this.outTimeEvent(data, 'dptEnter')} /> */}
                                                                    <TimePicker format={format} placeholder={'请选择进港时刻'} onChange={this.dptEnter.bind(this)} value={this.mountTime(this.state.dptEnter)}
                                                                        disabled={this.state.designRadioValue == 1 ? (this.state.arrvLevel ? false : true) : (this.state.pstBackLevel ? false : true)} />
                                                                </div>
                                                            </div>
                                                            <span className={styles['msg']}>
                                                                {this.checkTime('dptEnter')}
                                                            </span>
                                                            <span className={styles['ident']} style={{ color: '#ceac30' }}>返程</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/*  */}

                                                {
                                                    this.state.designRadioValue != 1 ? (
                                                        /* 1:经停 经停时刻 */
                                                        <div className={styles['time-col']}>
                                                            <div className={styles['time-col-items']}>
                                                                <div className={styles['time-col-icon']}>
                                                                    <span className={'iconfont'}>&#xe6ad;</span>
                                                                </div>
                                                                <div className={styles['time-col-center']}>
                                                                    {/* 经停入港时刻 */}
                                                                    <div className={`${styles['common-style']} ${styles['time-item']} ${styles['small-time-item']}`}>
                                                                        <div>
                                                                            <span className={styles['bgColorBlue']}>进</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className={"ant-time-picker-icon"}></span>
                                                                            <div className={styles['drop-list-time']}>
                                                                                {/* <HourTimer showArrow={false} time={this.state.dptLevel} type={false} defaultTime={this.state.pstEnter} outTimeEvent={(data, timeStr) => this.outTimeEvent(data, 'pstEnter')} /> */}
                                                                                <TimePicker format={format} placeholder={'进港时刻'} onChange={this.pstEnter.bind(this)} value={this.mountTime(this.state.pstEnter)} disabled={this.state.dptLevel ? false : true} />
                                                                            </div>
                                                                        </div>
                                                                        <span className={styles['msg']}>
                                                                            {this.checkTime('pstEnter')}
                                                                        </span>
                                                                    </div>
                                                                    {/* 经停出港时刻 */}
                                                                    <div className={`${styles['common-style']} ${styles['time-item']} ${styles['small-time-item']}`}>
                                                                        <div>
                                                                            <span className={styles['bgColorBlue']}>出</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className={"ant-time-picker-icon"}></span>
                                                                            <div className={styles['drop-list-time']}>
                                                                                {/* <HourTimer showArrow={false} time={this.state.pstEnter} type={false} defaultTime={this.state.pstLevel} outTimeEvent={(data, timeStr) => this.outTimeEvent(data, 'pstLevel')} /> */}
                                                                                <TimePicker format={format} placeholder={'出港时刻'} onChange={this.pstLevel.bind(this)} value={this.mountTime(this.state.pstLevel)} disabled={this.state.pstEnter ? false : true} />
                                                                            </div>
                                                                        </div>
                                                                        <span className={styles['msg']}>
                                                                            {this.checkTime('pstLevel')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className={styles['time-col-icon']}>
                                                                    <span className={'iconfont'}>&#xe6ad;</span>
                                                                </div>
                                                            </div>
                                                            <div className={styles['time-col-items']}>
                                                                <div className={`${styles['time-col-icon']} ${styles['reverse']}`}>
                                                                    <span className={'iconfont'}>&#xe6ad;</span>
                                                                </div>
                                                                <div className={styles['time-col-center']}>
                                                                    {/* 返回经停出港时刻 */}
                                                                    <div className={`${styles['common-style']} ${styles['time-item']} ${styles['small-time-item']}`}>
                                                                        <div>
                                                                            <span className={styles['bgColorYellow']}>出</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className={"ant-time-picker-icon"}></span>
                                                                            <div className={styles['drop-list-time']}>
                                                                                {/* <HourTimer showArrow={false} time={this.state.pstBackLevel} type={false} defaultTime={this.state.pstBackLevel} outTimeEvent={(data, timeStr) => this.outTimeEvent(data, 'pstBackLevel')} /> */}
                                                                                <TimePicker format={format} placeholder={'出港时刻'} onChange={this.pstBackLevel.bind(this)} value={this.mountTime(this.state.pstBackLevel)} disabled={this.state.pstBackEnter ? false : true} />
                                                                            </div>
                                                                        </div>
                                                                        <span className={styles['msg']}>
                                                                            {this.checkTime('pstBackLevel')}
                                                                        </span>
                                                                    </div>
                                                                    {/* 返回经停入港时刻 */}
                                                                    <div className={`${styles['common-style']} ${styles['time-item']} ${styles['small-time-item']}`}>
                                                                        <div>
                                                                            <span className={styles['bgColorYellow']}>进</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className={"ant-time-picker-icon"}></span>
                                                                            <div className={styles['drop-list-time']}>
                                                                                {/* <HourTimer showArrow={false} time={this.state.arrvLevel} type={false} defaultTime={this.state.pstBackEnter} outTimeEvent={(data, timeStr) => this.outTimeEvent(data, 'pstBackEnter')} /> */}
                                                                                <TimePicker format={format} placeholder={'进港时刻'} onChange={this.pstBackEnter.bind(this)} value={this.mountTime(this.state.pstBackEnter)} disabled={this.state.arrvLevel ? false : true} />
                                                                            </div>
                                                                        </div>
                                                                        <span className={styles['msg']}>
                                                                            {this.checkTime('pstBackEnter')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className={`${styles['time-col-icon']} ${styles['reverse']}`}>
                                                                    <span className={'iconfont'}>&#xe6ad;</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        /*  */
                                                    ) : (
                                                            /* 0:直飞 没有经停时刻 */
                                                            <div className={styles['no-pst']}>
                                                                <div className={styles['time-col-items']}>
                                                                    <div className={styles['time-col-icon']}>
                                                                        <span className={'iconfont'}>&#xe6ad;</span>
                                                                    </div>
                                                                </div>
                                                                <div className={styles['time-col-items']}>
                                                                    <div className={`${styles['time-col-icon']} ${styles['reverse']}`}>
                                                                        <span className={'iconfont'}>&#xe6ad;</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                }

                                                {/* 到达时刻 */}
                                                <div className={styles['time-col']}>
                                                    <div className={styles['time-box']}>
                                                        {/* 到达入港时刻 */}
                                                        <div className={`${styles['common-style']} ${styles['time-item']}`}>
                                                            <div>
                                                                <span className={styles['bgColorBlue']}>进</span>
                                                            </div>
                                                            <div>
                                                                <input type="text" maxLength="20" />
                                                                <span className={"ant-time-picker-icon"}></span>
                                                                <div className={styles['drop-list-time']}>
                                                                    {/* <HourTimer showArrow={false} time={this.state.designRadioValue == 1 ? this.state.dptLevel : this.state.pstLevel} type={false} defaultTime={this.state.arrvEnter} outTimeEvent={(data, timeStr) => this.outTimeEvent(data, 'arrvEnter')} /> */}
                                                                    <TimePicker format={format} placeholder={'请选择进港时刻'} onChange={this.arrvEnter.bind(this)} value={this.mountTime(this.state.arrvEnter)} disabled={this.state.designRadioValue == 1 ? (this.state.dptLevel ? false : true) : (this.state.pstLevel ? false : true)} />

                                                                </div>
                                                            </div>
                                                            <span className={styles['msg']}>
                                                                {this.checkTime('arrvEnter')}
                                                            </span>
                                                        </div>
                                                        {/* 到达出港时刻 */}
                                                        <div className={`${styles['common-style']} ${styles['time-item']}`}>
                                                            <div>
                                                                <span className={styles['bgColorYellow']}>出</span>
                                                            </div>
                                                            <div>
                                                                <input type="text" maxLength="20" />
                                                                <span className={"ant-time-picker-icon"}></span>
                                                                <div className={styles['drop-list-time']}>
                                                                    {/* <HourTimer showArrow={false} time={this.state.arrvEnter} type={false} defaultTime={this.state.arrvLevel} outTimeEvent={(data, timeStr) => this.outTimeEvent(data, 'arrvLevel')} /> */}
                                                                    <TimePicker format={format} placeholder={'请选择出港时刻'} onChange={this.arrvLevel.bind(this)} value={this.mountTime(this.state.arrvLevel)} disabled={this.state.arrvEnter ? false : true} />
                                                                </div>
                                                            </div>
                                                            <span className={styles['msg']}>
                                                                {this.checkTime('arrvLevel')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/*  */}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={styles['flex']} style={{ flexWrap: 'wrap', position: 'relative', justifyContent: 'space-between' }}>
                                            <div className={styles['col-box']} style={{ marginBottom: '20px' }}>
                                                <div className={styles['col-text']}>
                                                    <span className={'iconfont'} style={{ fontSize: '20px' }}>&#xe6ad;</span>
                                                </div>
                                                <div className={styles['col-input']}>
                                                    <input type="text"
                                                        style={{ width: '183px' }}
                                                        maxLength="20"
                                                        placeholder="请输入航点"
                                                        value={this.state.searchText2}
                                                        onClick={(e) => { e.stopPropagation() }}
                                                        onChange={this.searchTextChangeFn2.bind(this)}
                                                        onFocus={this.inputClickFn2.bind(this)} />
                                                    {
                                                        this.state.showAirportSearch2 && <AirportSearch
                                                            axis={axis}
                                                            resData={this.airportData2.bind(this)}
                                                            searchText={this.state.searchText2} />
                                                    }
                                                </div>
                                            </div>
                                            {passInput}
                                            <div className={styles['col-box']} style={{ marginBottom: '20px' }}>
                                                <div className={styles['col-text']}>
                                                    <span className={'iconfont'} style={{ fontSize: '20px' }}>&#xe672;</span>
                                                </div>
                                                <div className={styles['col-input']}>
                                                    <input type="text"
                                                        style={{ width: '180px' }}
                                                        maxLength="20"
                                                        placeholder="请输入航点"
                                                        value={this.state.searchText4}
                                                        onClick={(e) => { e.stopPropagation() }}
                                                        onChange={this.searchTextChangeFn4.bind(this)}
                                                        onFocus={this.inputClickFn4.bind(this)} />
                                                    {
                                                        this.state.showAirportSearch4 && <AirportSearch
                                                            axis={axis}
                                                            qiangzhizhixing={this.state.mandatoryDesignation}
                                                            areaType={this.state.areaType}
                                                            provinceOrArea={this.state.arrvProOrArea}
                                                            resData={this.airportData4.bind(this)}
                                                            searchText={this.state.searchText4} />
                                                    }
                                                </div>
                                            </div>
                                            <div className={styles['col-box']}>
                                                <div className={styles['col-text']} style={{ marginLeft: '7px', width: '40px' }}>报价</div>
                                                <Dropdown overlay={this.menu()} trigger={['click']}>
                                                    <div className={`${styles['col-text']} ${styles['flex']}`} style={{ textIndent: '7px', width: '77px' }}>
                                                        <div style={{ width: '47px' }}>{(this.state.quoteType === "1" ? '定补' : '') || (this.state.quoteType === "2" ? '保底' : '') || (this.state.quoteType === "0" ? '待议' : '')}</div>
                                                        <Icon type="caret-down" />
                                                    </div>
                                                </Dropdown>
                                                {
                                                    this.state.quoteType != 0 && (
                                                        <div className={styles['col-input']}>
                                                            <input type="text" style={{ width: '57px' }}
                                                                value={this.state.quotedPrice}
                                                                maxLength={5}
                                                                onChange={this.priceChangeFn.bind(this)} />
                                                            <span style={{ whiteSpace: 'nowrap' }}>{this.quoteNumText(this.state.quoteType)}</span>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className={styles['save-box']}>
                                                <div className={'btn-b'}
                                                    style={{ padding: '5px 30px', borderRadius: '20px', marginRight: '15px', fontSize: '15px' }}
                                                    onClick={this.saveProject.bind(this)}>
                                                    {this.state.projectIndex == '-1' ? '新增方案' : '编辑方案'}
                                                </div>
                                                {/*<Icon type="plus-circle"
                                            style={{color: '#477BE9', fontSize: '30px', cursor: 'pointer'}}
                                            onClick={this.addProject.bind(this)}/>*/}
                                            </div>
                                            {
                                                this.state.airlineWarnShow && airlineWarn
                                            }
                                            {
                                                this.state.airlineQiangzhiWarnShow && airlineQiangzhiWarn
                                            }
                                            {
                                                this.state.airline1WarnShow && airline1Warn
                                            }
                                            {
                                                this.state.airline2WarnShow && airline2Warn
                                            }
                                            {
                                                this.state.airline3WarnShow && airline3Warn
                                            }
                                            {
                                                this.state.quoteWarnShow && quoteWarn
                                            }
                                        </div>
                                    )
                                }

                            </div>
                            {/* 当为选择方案的时候不显示 */}
                            {
                                editType === 3 || editType === 4 ? '' : (
                                    <div className={'scroll'} style={{ maxHeight: '420px', overflowY: 'scroll' }}>
                                        {
                                            (this.state.responsePlans != null
                                                && this.state.responsePlans.length != 0)
                                            && propjectItem
                                        }
                                    </div>
                                )
                            }
                            <div className={`${styles['fourth']} ${styles['flex']}`} style={{ padding: '20px 0px 20px 20px' }}>
                                <div className={styles['flex']}>
                                    <span style={{ marginRight: '5px' }}>时刻要求</span>
                                    <RadioGroup name="radiogroup"
                                        className={styles['flex']}
                                        defaultValue={0}
                                        value={this.state.timeRequirements}
                                        onChange={this.timeRadioChangeFn.bind(this)}>
                                        <Radio value={2} style={{ fontSize: '1.2rem' }}>不限</Radio>
                                        <Radio value={0} style={{ fontSize: '1.2rem' }}>白班</Radio>
                                        <Radio value={1} style={{ fontSize: '1.2rem' }}>晚班</Radio>
                                    </RadioGroup>
                                </div>
                                {/* 根据editType类型显示报价价格或有效期 */}
                                {
                                    editType === 3 || editType === 4 ?
                                        (
                                            <div className={styles['col-box']} style={{ position: 'relative', background: '#f6f6f6', padding: '5px' }}>
                                                <div className={styles['col-text']} style={{ marginLeft: '7px', width: '40px' }}>报价</div>
                                                <Dropdown overlay={this.menu()} trigger={['click']}>
                                                    <div className={`${styles['col-text']} ${styles['flex']}`} style={{ textIndent: '7px', width: '77px' }}>
                                                        <div style={{ width: '47px' }}>{(this.state.quoteType === "1" ? '定补' : '') || (this.state.quoteType === "2" ? '保底' : '') || (this.state.quoteType === "0" ? '待议' : '')}</div>
                                                        <Icon type="caret-down" />
                                                    </div>
                                                </Dropdown>
                                                <div className={styles['col-input']}>
                                                    <input type="text" style={{ width: '67px' }}
                                                        value={this.state.quotedPrice}
                                                        disabled={this.state.quoteType === '0' ? true : false}
                                                        onChange={this.priceChangeFn.bind(this)} />
                                                    万
                                                </div>
                                                <span className={styles['msg']} style={{ position: 'absolute', color: 'red', top: '100%', right: '10px', }}>
                                                    {this.checkPrice('quote')}
                                                </span>
                                            </div>
                                        ) :
                                        (
                                            <div className={styles['col-box']} style={{ position: 'relative', padding: '0 0 0 9px', width: '200px', background: '#F6F6F6' }}>
                                                <div className={styles['col-text']}>方案有效期</div>
                                                <div onClick={(e) => { e.stopPropagation() }}>
                                                    <DatePicker className={styles['range-picker2']}
                                                        format="YYYY-MM-DD"
                                                        placeholder="截止日期"
                                                        disabledDate={this.disabledDate}
                                                        value={periodValidity}
                                                        onChange={this.periodValidityChangeFn.bind(this)}
                                                        onOpenChange={this.periodValidityOpenFn.bind(this, periodValidity)}
                                                        locale={{
                                                            "lang": {
                                                                "yearFormat": "YYYY" + "年",
                                                                "monthSelect": "选择月份",
                                                                "yearSelect": "选择年份",
                                                                "previousMonth": "上个月",
                                                                "nextMonth": "下个月",
                                                                "previousYear": "上一年",
                                                                "nextYear": "下一年"
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                {
                                                    this.state.periodValidityWarnShow && periodValidityWarn
                                                }
                                                {
                                                    this.state.periodValidity3WarnShow && periodValidity3Warn
                                                }
                                            </div>
                                        )
                                }

                                {/*  */}
                                <div className={`${styles['flex']} ${styles['capacity-release-content-date']}`} style={{ position: 'relative' }}>
                                    拟开班期
                                    <DateChoose data={this.state.date} chooseDate={(data) => this.chooseDateEvent(data)} />
                                    {
                                        this.state.daysWarnShow && daysWarn
                                    }
                                    <span className={styles['msg']} style={{ position: 'absolute', color: 'red', top: '100%', right: '10px', }}>
                                        {this.checkDate('date')}
                                    </span>
                                </div>
                            </div>
                            <div className={`${styles['seventh']} ${styles['flex']}`}>
                                其他说明
                                <textarea className={styles['text-area']} maxLength="200"
                                    value={this.state.remark}
                                    onKeyDown={(e) => { if (e.keyCode == 13) e.preventDefault() }}
                                    onChange={this.textChangeFn.bind(this)}></textarea>
                                <span className={styles['row-border']} style={{ top: '26px' }}></span>
                                <span className={styles['row-border']} style={{ top: '52px' }}></span>
                                <span className={styles['row-border']} style={{ top: '78px' }}></span>
                                <span className={styles['row-border']} style={{ top: '104px' }}></span>
                                <span className={styles['row-border']} style={{ top: '130px' }}></span>
                                <span className={styles['row-border']} style={{ top: '156px' }}></span>
                                <span style={{ position: 'absolute', bottom: '5px', right: '25px' }}>{this.state.textNum}/200</span>
                            </div>
                            <div className={`${styles['eighth']} ${styles['flex']}`}>
                                <div className={styles['col-box']} style={{ background: '#F6F6F6' }}>
                                    <div className={styles['col-text']}>联系人</div>
                                    <div className={styles['col-input']}>
                                        <input type="text" style={{ width: '155px' }}
                                            value={this.state.contact}
                                            maxLength="20"
                                            onFocus={this.contactFocusFn.bind(this)}
                                            onChange={this.contactChangeFn.bind(this)}
                                            disabled={editType === 3 || editType === 4 ? true : false} />
                                        {
                                            this.state.contactWarnShow && contactWarn
                                        }
                                    </div>
                                    <span className={styles['msg']} style={{ position: 'absolute', color: 'red', top: '100%', right: '10px', }}>
                                        {this.checkContact('contact')}
                                    </span>
                                </div>
                                <div className={styles['col-box']} style={{ background: '#F6F6F6' }}>
                                    <div className={styles['col-text']}>移动电话</div>
                                    <div className={styles['col-input']}>
                                        <input type="text" style={{ width: '144px' }}
                                            maxLength={'20'}
                                            value={this.state.ihome}
                                            onChange={this.ihomeChangeFn.bind(this)}
                                            onBlur={this.ihomeBlurFn.bind(this)}
                                            disabled={editType === 3 || editType === 4 ? true : false} />
                                        {
                                            this.state.ihomeWarnShow && ihomeWarn
                                        }
                                    </div>
                                    <span className={styles['msg']} style={{ position: 'absolute', color: 'red', top: '100%', right: '10px', }}>
                                        {this.checkIHome('ihome')}
                                    </span>
                                </div>
                                <div className={styles['col-box']} style={{ background: 'transparent' }}></div>
                            </div>
                        </div>
                    }
                    <div style={{ height: '80px' }}></div>
                </div>
                <div className={`${styles['buttons']} ${styles['flex']}`}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        borderBottomRightRadius: '8px',
                        borderBottomLeftRadius: '8px',
                        boxShadow: '0 2px 11px rgba(85, 85, 85, 0.1)'
                    }}>
                    {
                        (editType === 2
                            || editType === 3
                            || editType === 4)
                            ? ''
                            : <div style={{ padding: '0' }}>
                                <Btn text='保存草稿'
                                    btnType="0"
                                    otherText="保存中"
                                    isDisable={this.state.noMsgCaogao}
                                    styleJson={{ width: "100px", padding: 0 }}
                                    onClick={() => { this.saveSendDataFn(1) }} />
                            </div>
                        /*<div className={'btn-w'} style={{ width: '100px' }}
                        onClick={this.saveSendDataFn.bind(this, 1)}>保存草稿</div>*/
                    }
                    {this.btnEle()}
                    <div className={'btn-w'} style={{ width: '100px' }} onClick={this.closeFn.bind(this)}>取消</div>
                </div>
                {/* 方案选择 */}
                <Confirmations title={'确认方案'} subTitle={'确认选择该方案'} tipText={'选定后将不可选择其他方案,请确认无误'} visible={this.state.visible_affirm} onOk={this.affirmAction} onCancel={this.hideModal} uploading={this.state.uploading} />
                <Confirmations title={'方案编辑'} subTitle={'确认修改该方案'} tipText={''} visible={this.state.visible_afterAffirmReEdit} onOk={this.option_afterAffirmReEdit} onCancel={this.hideModal} uploading={this.state.uploading} />
                {this.state.showDealPwd ? <div style={{
                    height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', background: 'rgba(0, 0, 0, 0.1)'
                }}>
                    <DealPwd close={this.dealCloseFn} forgetPwd={this.forgetPwd} />
                </div> : ''}
            </div>
        )
    }
}
