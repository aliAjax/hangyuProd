// author:wangli time:2018-05-16 content:航司运力发布
/* eslint-disable */
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import AirportSearch from "../../components/search/airportSearch";
import TargetArea from "../../components/targetArea/targetArea";
import ProvinceSearch from "../../components/provinceSearch/provinceSearch";
import DimAir from "../../components/dimAir/dimAir";
import SailingtimeComponent from '../../components/sailingtimeComponent/sailingtimeComponent';
import IconInfo from '../../components/IconInfo/IconInfo';
import DealPwd from "../../components/dealPwd/dealPwd";
import { store } from "../../store";
import Axios from "./../../utils/axiosInterceptors";
import DateChoose from "../../components/dateChoose/dateChoose";
import { Radio, Select, Input, Checkbox, Button, DatePicker, TimePicker, Modal, Menu, Dropdown,Tooltip } from 'antd';
import style from '../../static/css/fromBox/capacityRelease.scss';
import emitter from "../../utils/events";
import TimeComponent from "../../components/timeComponent/timeComponent";
import CapacityPoint from "../../components/capacityPoint/capacityPoint";
import Btn from "../../components/button/btn";
import HourTimer from "../../components/timeComponent/hourTimer";
import 'moment/locale/zh-cn';//antd时间组件中文包

const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const format = 'HH:mm';//定义antd时间组件格式;
const concatDefault = store.getState().role.concat;//带入联系人
const iHomeDefault = store.getState().role.phone;//带入联系人
const daysString = "";//拟开航班默认字符串

export default class CapacityRelease extends Component {
    constructor(props) {
        super(props);
        this.handleChangefixedSubsidyPrice = this.handleChangefixedSubsidyPrice.bind(this);
        this.handleChangebottomSubsidyPrice = this.handleChangebottomSubsidyPrice.bind(this);
        this.seating = this.seating.bind(this);
        this.performShift = this.performShift.bind(this);
        this.contact = this.contact.bind(this);
        this.iHome = this.iHome.bind(this);
        this.other = this.other.bind(this);
        this.dpt = this.dpt.bind(this);
        this.aircrfttypOnBlur = this.aircrfttypOnBlur.bind(this);
        this.areaType = this.areaType.bind(this);
        this.periodValidityDisabledDate = this.periodValidityDisabledDate.bind(this);
        this.periodValidity = this.periodValidity.bind(this);
        this.sailingtimeDisabledDate = this.sailingtimeDisabledDate.bind(this);
        // this.sailingtime = this.sailingtime.bind(this);
        this.affirmSubmit = this.affirmSubmit.bind(this);
        this.saveDraft = this.saveDraft.bind(this);
        this.judgeDraft = this.judgeDraft.bind(this);
        this.outTimeOpen = this.outTimeOpen.bind(this);
        this.iHomeChange = this.iHomeChange.bind(this);
        this.outTimeEvent = this.outTimeEvent.bind(this);
        this.inTimeEvent = this.inTimeEvent.bind(this);
        this.setStop = this.setStop.bind(this);
        this.transitEvent = this.transitEvent.bind(this);
        this.jiltFlyEvent = this.jiltFlyEvent.bind(this);
        this.jiltFlyData = this.jiltFlyData.bind(this);
        this.transitData = this.transitData.bind(this);
        this.state = {
            url: "",//发布表单地址
            demand: "",//发布表单的数据
            demandId:"",//草稿表单id
            bianjiAgain:false,//是否重新编辑
            titleText: "",//二次确认始发机场简称
            demandtype: "1",//发布需求选择 1为运力投放 4为运力委托
            checked:false,//发布类型checkbox false代表未点击
            aircrfttyp: "",//拟飞机型
            seating: "",//座位数布局
            dpt: "",//运力始发
            pst:"",//经停点
            arrv: "",//目标区域或航点
            dptTime: "",//出港时间
            arrvTime: "",//进航时间
            intimeType: true,//进航输入框是否显示
            days: daysString,//拟开航班
            sailingtime: "整年",//计划执行周期
            disableSailingTime: "",//运力有效期禁用时间节点
            performShift: "",//计划执行班次
            userPerformShift: "",//用户输入计划执行班次
            periodValidity: "",//运力有效期
            contact: store.getState().role.concat,//联系人
            iHome: store.getState().role.phone,//移动电话
            fixedSubsidyPrice: "",//定补价格
            bottomSubsidyPrice: "",//保底价格
            fixedSubsidyPriceType: false,//定补类型 --用于判断报价是否填写数据
            bottomSubsidyPriceType: false,//保底类型 --同上
            otherType: false,//其他类型
            remark: "",//其他说明
            dptSearchText: '', // 始发输入框组件输入的内容
            arrvSearchText: '', // 目标航点输入框组件输入的内容
            arrvAreaSearchText: '', // 目标区域输入框组件输入的内容
            arrvProvinceSearchText: '', // 目标省份输入框组件输入的内容
            dptShowAirportSearch: false,  // 始发下拉框是否显示
            arrvShowAirportSearch: false,  // 目标航点下拉框是否显示
            arrvAreaShowAirportSearch: false,  // 目标区域下拉框是否显示
            arrvProvinceShowAirportSearch: false,  // 目标省份下拉框是否显示
            areaType: "1",//目标区域或者航点 1航点 2省份 3区域
            textNum: "0",//其他说明输入字数
            air: [],//机型数据
            cancelType: false,//点击取消显示保存草稿弹出层 false未不显示
            doubleAffirm: false,//二次确认提示弹出层提示 false未不显示
            // demandDraftData: {},//返回的需求草稿数据
            // entrustDraftData: {},//返回的委托草稿数据
            draftData:{},//请求回的草稿数据
            defaultData: {},//默认的值
            aircrfttypTypeSearchText: "",//拟飞机型模糊匹配
            judgeStylesType: {//输入框格式验证
                iHome: false, //电话格式
                seating: false,//座位数布局格式
                fixedSubsidyPrice: false,//定补价格格式
                bottomSubsidyPrice: false//保底价格格式
            },
            hintText: {//验证提示语
                aircrfttyp: "",
                dpt: "",
                pst:"",
                arrv: "",
                seating: "",
                dptTime: "",
                arrvTime: "",
                offer: "",
                iHome: "",
                sailingtime: "",
                periodValidity: "",
                performShift: "",
                contact: "",
                data: ""
            },
            data: [{//拟飞班期数据
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
            }],
            offerMode: [//报价方式按钮
                {
                    name: "fixedSubsidyPrice",
                    type: true,
                }, {
                    name: "bottomSubsidyPrice",
                    type: true,
                }, {
                    name: "other",
                    type: true
                },
            ],
            aircrfttypShowType: false,//拟飞机型下拉选择框是否显示 false为不显示
            aircrfttypBox: [],//拟飞机型下拉框数据
            noMsg:false,//无数据保存表单
            fixed:false,//固定定位显示判断 false 为不显示
            payShow:false,//密码弹层显示
            stopType:"noStop",//直飞或经停 noStop 直飞 transit 经停
            pstAreaType:"1",//经停航点类型 1-机场三字码 2-省份 3-区域
            pstMandatoryDesignation:"0",//经停是否强制指定 0：否 1：是
            mandatoryDesignation:"0",//目标航点或甩飞航点是否强制指定 0：否 1：是
        }
    }

    //设置发布类型
    // setDemandtypeStr = (e) => {
    //     if (e.target.value == "entrust") {
    //         if (this.state.entrustDraftData.id) {
    //             this.draftEvent(this.state.entrustDraftData);
    //         } else {
    //             this.initializeEvent();
    //         };
    //         this.setState({
    //             demandtype: "4"
    //         });
    //     } else if (e.target.value = "demand") {
    //         if (this.state.demandDraftData.id) {
    //             this.draftEvent(this.state.demandDraftData);
    //         } else {
    //             this.initializeEvent();
    //         };
    //         this.setState({
    //             demandtype: "1"
    //         });
    //     }
    // }

    //运力始发输入框输入内容改变
    dptSearchTextChangeFn(e) {
        let target = e.target;
        let dpt = this.state.dpt;
        let hintText = this.state.hintText;
        let dptShowAirportSearch=true;
        if (target.value == "") {
            dpt = "";
            hintText.dpt = "* 请选择运力始发";
            dptShowAirportSearch=false
        };
        this.setState({
            dptSearchText: target.value,
            dpt,
            hintText,
            dptShowAirportSearch,
        })
    };
    //目标航点输入框输入内容改变
    arrvSearchTextChangeFn(e) {
        let target = e.target;
        let arrv = this.state.arrv;
        let dpt = this.state.dpt;
        let hintText = this.state.hintText;
        let arrvShowAirportSearch= true;
        if (target.value == "") {
            arrvShowAirportSearch=false;
            arrv = "";
            hintText.arrv = "* 请选择目标区域或航点"
        };
        if (dpt != "") {
            hintText.dpt = ""
        }
        this.setState({
            arrvShowAirportSearch,
            arrvSearchText: target.value,
            arrv,
            hintText
        })
    };
    //目标区域输入框输入内容改变
    arrvAreaSearchTextChangeFn(e) {
        let target = e.target;
        let arrvAreaShowAirportSearch=true;
        if(!target.value){
            arrvAreaShowAirportSearch=false;
        };
        this.setState({
            arrvAreaShowAirportSearch,
            arrvAreaSearchText: target.value,
            arrv: ""
        })
    };
    //目标省份输入框输入内容改变
    arrvProvinceSearchTextChangeFn(e) {//目标省份输入框
        let target = e.target;
        let  arrvProvinceShowAirportSearch=true;
        if(!target.value){
            arrvProvinceShowAirportSearch=false;
        };
        this.setState({
            arrvProvinceShowAirportSearch,
            arrvProvinceSearchText: target.value,
            arrv: ""
        })
    };
    // 输入框焦点事件:需求更改，功能暂时取消
    dptInputFocusFn() {
        this.setState(() => {
            return {
                dptShowAirportSearch: true,
            }
        })
    }

    arrvInputFocusFn() {
        this.setState(() => {
            return {
                arrvShowAirportSearch: true,
            }
        })
    }
    arrvProvinceInputFocusFn() {
        this.setState({
            arrvProvinceShowAirportSearch: true,
        })
    }

    arrvAreaInputFocusFn() {
        this.setState(() => {
            return {
                arrvAreaShowAirportSearch: true,
            }
        })
    }

    /*
    *运力始发&&目标航点等输入框失焦事件
    */
    dptInputBlurFn() {
        let that = this;
        setTimeout(() => {
            that.setState(() => {
                return {
                    dptShowAirportSearch: false,
                }
            })
        }, 150)
    };

    arrvInputBlurFn() {
        let that = this;
        setTimeout(() => {
            that.setState(() => {
                return {
                    arrvShowAirportSearch: false,
                }
            })
        }, 150)
    };
    arrvProvinceInputBlurFn() {
        let that = this;
        setTimeout(() => {
            that.setState(() => {
                return {
                    arrvProvinceShowAirportSearch: false,
                }
            })
        }, 150)
    };

    arrvAreaInputBlurFn() {
        let that = this;
        setTimeout(() => {
            that.setState(() => {
                return {
                    arrvAreaShowAirportSearch: false,
                }
            })
        }, 150)
    };

    //移动电话输入事件
    iHomeChange(e) {
        let judgeStylesType = this.state.judgeStylesType;
        var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;//正则验证规则
        if (phoneReg.test(e.target.value)) {
            judgeStylesType.iHome = true;
            this.setState({
                iHome: e.target.value,
                judgeStylesType
            })
        } else {
            judgeStylesType.iHome = false;
            this.setState({
                iHome: e.target.value,
                judgeStylesType
            })
        }
    };

    //发布类型
    changeType(e){
        let demandtype;
        if(e.target.checked){
            demandtype=4;
        }else {
            demandtype=1
        };
        this.setState({
            demandtype
        })
    };

    // 始发接受下拉框传来的数据
    //data:返回数据对象
    dptAirportData(data) {
        let dpt = data.code;
        let {arrv,pst} = this.state;
        let hintText = this.state.hintText;
        // let dptSearchText=data.name;
        hintText.dpt = "";
        if(dpt){
			if (dpt == arrv&&dpt==pst) {
				hintText.dpt = "* 运力始发、经停航点和甩飞航点不能相同";
				hintText.pst="";
				hintText.arrv="";
			}else if(dpt==pst&&dpt!=arrv){
			    hintText.dpt="* 运力始发和经停航点不能相同";
				hintText.pst="";
				hintText.arrv="";
            }else if(dpt==arrv&&dpt!=pst){
				hintText.dpt="* 运力始发和甩飞航点不能相同";
				hintText.pst="";
				hintText.arrv="";
            }else if(dpt!=arrv&&arrv==pst&&arrv){
				hintText.dpt="";
				hintText.pst="* 经停航点和甩飞航点不能相同";
				hintText.arrv="";
            }
        };
        this.setState({
            hintText,
            dptSearchText: data.name,
            dptShowAirportSearch: false,
            dpt
        })
    };

    //目标航点组件返回数据
    arrvAirportData(data) {
        let arrv = data.code;
        let dpt = this.state.dpt;
        let hintText = this.state.hintText;
        hintText.arrv = "";
        if (dpt == arrv) {
            hintText.dpt = "* 运力始发和目标航点或甩飞航点不能相同";
            arrv = ""
        } else {
            hintText.dpt = "";
        };
        this.setState({
            hintText,
            arrvSearchText: data.name,
            arrvShowAirportSearch: false,
            arrv
        })
    };

    //目标区域组件返回数据
    arrvAreaAirportData(data) {//目标区域
        let hintText = this.state.hintText;
        hintText.arrv = "";
        hintText.dpt = "";
        this.setState({
            arrvAreaSearchText: data,
            arrvAreaShowAirportSearch: false,
            arrv: data,
            hintText
        })
    };

    //目标省份组件返回数据
    arrvProvinceAirportData(data) {//目标省份
        let hintText = this.state.hintText;
        hintText.arrv = "";
        hintText.dpt = "";
        this.setState({
            arrvProvinceSearchText: data,
            arrvProvinceShowAirportSearch: false,
            arrv: data,
            hintText
        })
    };
    //进出港样式
    outTimeOpen() {
        this.setState({
            outTimeType: true
        })
    }

    //DateChoose组件传递方法
    chooseDateEvent(data) {//data：班期对象
        let days=null;
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
        let hintText = this.state.hintText;
        let newData = data;
        // if (dataType && !this.state.userPerformShift) {//用户优先
        if (dataType) {//计算优先
            hintText.data = "";
            this.changeEvent(this.state.sailingtime,[]);
            //当计划执行周期有值时
            // if (this.state.sailingtime) {
            //     //计算执行班次
            //     let performShift = '';
            //     let dataTrueNum = [];//选择执飞日期
            //     let dateStart = this.state.sailingtime.split(",")[0].split("-");
            //     let dateEnd = this.state.sailingtime.split(",")[1].split("-");
            //     let dateS = new Date(dateStart[0], dateStart[1], dateStart[2]);
            //     let dateE = new Date(dateEnd[0], dateEnd[1], dateEnd[2]);
            //     let daysNum = parseInt(Math.abs(dateS - dateE)) / 1000 / 60 / 60 / 24;//相差天数
            //     daysNum += 1;
            //     for (let i = 0; i < data.length; i++) {
            //         if (data[i].type == true) {
            //             if (i == 6) {
            //                 dataTrueNum.push("0")
            //             } else {
            //                 dataTrueNum.push(data[i].name)
            //             }
            //         }
            //     };
            //     if (dataTrueNum.length != 0) {
            //         if (daysNum % 7 == 0) {
            //             performShift = parseInt(daysNum / 7) * dataTrueNum.length;
            //         } else {
            //             performShift = parseInt(daysNum / 7) * dataTrueNum.length;
            //             let startWeek = parseInt(moment(this.state.sailingtime.split(",")[0], "YYYY/MM/DD").format("d"));
            //             let endWeek = parseInt(moment(this.state.sailingtime.split(",")[1], "YYYY/MM/DD").format("d"));
            //             let num = endWeek - startWeek;
            //             if (startWeek <= endWeek) {
            //                 for (let i = 0; i < num + 1; i++) {
            //                     for (let j = 0; j < dataTrueNum.length; j++) {
            //                         if (startWeek + i == dataTrueNum[j]) {
            //                             performShift = 1 + performShift;
            //                         }
            //                     }
            //                 }
            //             } else {
            //                 for (let i = 0; i < dataTrueNum.length; i++) {
            //                     if (startWeek <= parseInt(dataTrueNum[i])) {
            //                         performShift += 1
            //                     } else if (endWeek >= parseInt(dataTrueNum[i])) {
            //                         performShift += 1
            //                     }
            //                 };
            //             }
            //         };
            //         let hintText = this.state.hintText;
            //         hintText.performShift = "";
            //         this.setState({
            //             performShift,
            //             hintText
            //         })
            //     };
            // }
            // this.setState({
            //     hintText,
            //     data: newData
            // })
        // } else if (dataType && this.state.userPerformShift) {
        //     this.setState({
        //         data: newData
        //     })
        } else {
            hintText.data = "* 请至少选择一天拟开航班";
            this.setState({
                data: newData,
                performShift: ""
            })
        }
    }

    //出港时刻
    dptTime(date, dateString) {//date:选中时间对象 dateString：选中时间字符串
        let hintText = this.state.hintText;
        hintText.dptTime = "";
        this.setState({
            dptTime: dateString,
            hintText,
            intimeType: dateString == "" ? true : false
        })
    }

    //进航时刻
    arrvTime(date, dateString) {//date:选中时间对象 dateString：选中时间字符串
        let hintText = this.state.hintText;
        hintText.arrvTime = "";
        this.setState({
            arrvTime: dateString,
            hintText
        })
    }

    //保存草稿
    saveDraft() {
        //保存草稿前数据组装
        let _this=this;
        const { demandtype, data, offerMode, bottomSubsidyPrice, arrvTime, areaType,pstAreaType, seating,stopType, contact, remark, dptTime, iHome, performShift, sailingtime, fixedSubsidyPrice, aircrfttyp, arrv, pst,dpt, periodValidity,otherType,fixedSubsidyPriceType,bottomSubsidyPriceType,mandatoryDesignation,pstMandatoryDesignation } = this.state;
        let days = "";
        let routeType=1;
        if(this.state.stopType=="noStop"){
            routeType=0;
        };
        for (var i = 0; i < 7; i++) {
            if (data[i].type) {
                days = days + "/" + data[i].name
            }
        };
        days = days.slice(1);
        let subsidypolicy = "";
        if (!offerMode[0].type || !offerMode[1].type) {
            subsidypolicy = "1"
        } else if (!offerMode[2].type) {
            subsidypolicy = "0"
        }
        var plans = new Array();
        var plan = {};
        plan["dpt"] = dpt;
        plan["arrv"] = arrv;
        plan["fixedSubsidyPrice"] = fixedSubsidyPrice;
        plan["bottomSubsidyPrice"] = bottomSubsidyPrice;
        plan["areaType"] = areaType;
        plan["pst"] = pst;
        plan["routeType"] = routeType;
        plan["pstAreaType"] = pstAreaType;
        plan["mandatoryDesignation"] = mandatoryDesignation;
        plan["pstMandatoryDesignation"] = pstMandatoryDesignation;
        plans.push(plan);
        var demand = {};
        demand.periodValidity = periodValidity;
        demand.demandtype = demandtype;
        demand.seating = seating;
        demand.arrv = arrv;
        demand.areaType = areaType;
        demand.dpt = dpt;
        demand.arrvTime = arrvTime;
        demand.dptTime = dptTime;
        demand.performShift = performShift;
        demand.aircrfttyp = aircrfttyp;
        demand.remark = remark;
        demand.sailingtime = sailingtime;
        demand.subsidypolicy = subsidypolicy;
        demand.bottomSubsidyPrice = bottomSubsidyPrice;
        demand.fixedSubsidyPrice = fixedSubsidyPrice;
        demand.contact = contact;
        demand.iHome = iHome;
        demand.days = days;
        demand.plans = JSON.stringify(plans);
        let url = "/saveDraftDemand";
            if (this.state.draftData.id) {
                demand.id = this.state.draftData.id;
            }
        let state = this.state;
            //判断是否填写表单，如未填写则给出相应提示
        if (state.pst==""&&state.aircrfttyp == "" && state.seating == "" && state.dptTime == "" && (state.days == daysString || state.days == "") && state.sailingtime == "整年" && state.contact == concatDefault && state.iHome == iHomeDefault && state.periodValidity == "" && state.remark == "" && !state.performShift && state.fixedSubsidyPrice == "" && state.bottomSubsidyPrice == "" && state.dpt == "" && state.arrv == ""&&!bottomSubsidyPriceType&&!fixedSubsidyPriceType&&!otherType) {
            Modal.error({
                title: '信息提示：',
                content: '请填写表单后再保存草稿',
                onOk() {
                    _this.setState({
                        noMsg:false
                    })
                },
                className: "test"
            });
        }else if(stopType=="transit"){
            if(!pst||!arrv){
                Modal.error({
                    title: '信息提示：',
                    content: '经停需填写经停点和甩飞点方可保存草稿',
                    onOk() {
                        _this.setState({
                            noMsg:false
                        })
                    },
                    className: "test"
                });
            }else {
                Axios({
                    method: 'post',
                    url,
                    data: JSON.stringify(demand),
                    dataType: 'json',
                    headers: {
                        'Content-type': 'application/json; charset=utf-8'
                    }
                }).then((response) => {
                    if (response.data.opResult == "0") {
                        Modal.success({
                            title: '信息提示：',
                            content: '保存草稿成功，请进入个人中心-草稿箱查看',
                            onOk() {
                                emitter.emit('openFrom', { openFrom: false });
                            },
                            className: "test"
                        });
                        emitter.emit('renewCaogaoxiang');
                    } else {
                        let erMsg="";
                        if(response.data.msg){
                            erMsg=response.data.msg
                        }else {
                            erMsg="请重新操作"
                        };
                        Modal.error({
                            title: '信息提示：',
                            content: '保存草稿失败' + "," + erMsg,
                            onOk() {
                                emitter.emit('openFrom', { openFrom: false });
                            },
                            className: "test"
                        });
                    }
                })
            }
        }else {
            Axios({
                method: 'post',
                url,
                data: JSON.stringify(demand),
                dataType: 'json',
                headers: {
                    'Content-type': 'application/json; charset=utf-8'
                }
            }).then((response) => {
                if (response.data.opResult == "0") {
                    Modal.success({
                        title: '信息提示：',
                        content: '保存草稿成功，请进入个人中心-草稿箱查看',
                        onOk() {
                            emitter.emit('openFrom', { openFrom: false });
                        },
                        className: "test"
                    });
                    emitter.emit('renewCaogaoxiang');
                } else {
					let erMsg="";
					if(response.data.msg){
						erMsg=response.data.msg
					}else {
						erMsg="请重新操作"
					};
                    Modal.error({
                        title: '信息提示：',
                        content: '保存草稿失败' + "," + erMsg,
                        onOk() {
                            emitter.emit('openFrom', { openFrom: false });
                        },
                        className: "test"
                    });
                }
            })
        }
    }

    //确认发布
    affirmSubmit() {
        let hintText = this.state.hintText;
        let comparisonTime = false;//运力有效期跟当前时间比较
        let comparisonSailingTime = true;//计划时间跟当前时间比较
        let { demandtype, data, offerMode, areaType,doubleAffirm,stopType,pstAreaType, bottomSubsidyPrice, arrvTime, seating, contact, remark, dptTime, iHome, performShift, sailingtime, fixedSubsidyPrice, aircrfttyp, arrv,pst, dpt, periodValidity,mandatoryDesignation,pstMandatoryDesignation,payShow } = this.state;
        //航点信息提示
        //座位数布局提示
        let seatingReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,8}$/;
        if (!seating) {
            hintText.seating = "* 请输入座位数布局";
            this.setState({
                hintText,
            })
        };
        //拟飞机型提示
        if (!aircrfttyp) {
            hintText.aircrfttyp = "* 请选择拟飞机型";
            this.setState({
                hintText
            })
        };
        //运力始发
        if (!dpt) {
            hintText.dpt = "* 请选择运力始发";
            this.setState({
                hintText
            })
        };
        //目标区域
        if (!arrv) {
            if(stopType=="noStop") {
				hintText.arrv = "* 请选择目标区域或航点";
			}else {
				hintText.arrv = "* 请选择甩飞区域或航点";
            }
            this.setState({
                hintText
            })
        };

        //经停数据判断
        if(stopType=="transit"&&!pst){
            hintText.pst = "* 请选择经停区域或航点";
            this.setState({
                hintText
            })
        }

        //出港时刻
        if (!dptTime) {
            hintText.dptTime = "* 请选择出港时刻";
            this.setState({
                hintText
            })
        };

        //进航时刻
        if (!arrvTime) {
            hintText.arrvTime = "* 请选择进航时刻";
            this.setState({
                hintText
            })
        };

        //报价提示
        let priceType = false;
        if (offerMode[0].type && offerMode[1].type && offerMode[2].type) {
            hintText.offer = "* 请选择报价方式";
            this.setState({
                hintText
            })
        };
        if(!offerMode[2].type){
            priceType=true;
        }else {
            if(!offerMode[0].type&&fixedSubsidyPrice&&fixedSubsidyPrice!=0&&offerMode[1].type){
                hintText.offer="";
                priceType=true;
            }else if(!offerMode[1].type&&bottomSubsidyPrice&&bottomSubsidyPrice!=0&&offerMode[0].type){
                hintText.offer="";
                priceType=true;
            }else if(!offerMode[0].type&&fixedSubsidyPrice&&fixedSubsidyPrice!=0&&!offerMode[1].type&&bottomSubsidyPrice&&bottomSubsidyPrice!=0){
                hintText.offer="";
                priceType=true
            }else if(!offerMode[0].type&&!fixedSubsidyPrice){
                hintText.offer="* 请输入报价价格";
            }else if(!offerMode[1].type&&!bottomSubsidyPrice){
                hintText.offer="* 请输入报价价格"
            };
            this.setState({
                hintText
            });
        };

        //价格验证
        let priceAll=false;
        if(!offerMode[2].type){
            priceAll=true
        }else if(!offerMode[0].type&&this.state.judgeStylesType.fixedSubsidyPrice&&offerMode[1].type){
            priceAll=true
        }else if(!offerMode[1].type&&this.state.judgeStylesType.bottomSubsidyPrice&&offerMode[0].type){
            priceAll=true
        }else if(!offerMode[0].type&&this.state.judgeStylesType.fixedSubsidyPrice&&!offerMode[1].type&&this.state.judgeStylesType.bottomSubsidyPrice){
            priceAll=true
        }

        //拟开航班提示
        for (let i = 0; i < 7; i++) {
            hintText.data = "* 请至少选择一天拟开航班";
            if (data[i].type == true) {
                hintText.data = "";
                break;
            }
        };

        //计划执行时间提示
        if (!sailingtime) {
            hintText.sailingtime = "* 请选择计划执行周期";
            this.setState({
                hintText
            })
        };

        //计划执行班次提示
        if (!performShift) {
            hintText.performShift = "* 请输入计划执行班次";
            this.setState({
                hintText
            })
        };

        //运力有效期提示
        if (!periodValidity) {
            hintText.periodValidity = "* 请选择运力有效期";
            this.setState({
                hintText
            })
        } else if (periodValidity) {
            let chooseTime = periodValidity.split("-").join("");
            let nowTime = moment().add(1,"months").format("YYYY-MM-DD").split("-").join("");
            if (parseInt(chooseTime) >= parseInt(nowTime)) {
                comparisonTime = true;
            } else {
                hintText.periodValidity = "* 请选择当前日期一个月后的日期";
                this.setState({
                    hintText
                });
            }
        };

        //联系人提示
        if (!contact) {
            hintText.contact = "* 请输入联系人姓名";
            this.setState({
                hintText
            })
        };

        //移动电话提示
        if (!iHome) {
            hintText.iHome = "* 请输入移动电话";
            this.setState({
                hintText
            })
        }else {
            var phoneReg = /^[1][3,4,5,7,8,9][0-9]{9}$/;//验证规则
            if(!phoneReg.test(iHome)){
                let {judgeStylesType,hintText}=this.state;
                judgeStylesType.iHome = false;
                hintText.iHome="* 请输入正确的电话号码"
                this.setState({
                    judgeStylesType,
                    hintText
                })
            };
        };

        //判断拟开航班是否有值
        let dataType = false;
        for (var i = 0; i < 7; i++) {
            if (data[i].type) {
                dataType = true;
                break;
            }
        };
        //判断运力有效期是否小于计划执行周期
        // let timeType = true;//测试要求
        let timeType = false;
        if (sailingtime!="整年"&&sailingtime!="冬春航季"&&sailingtime!="夏秋航季" && periodValidity) {
            let hintText = this.state.hintText;
            let sailingtimeString = sailingtime.split(",")[0].split("-").join("");
            let periodValidityString = periodValidity.split("-").join("");
            if (parseInt(sailingtimeString) - parseInt(periodValidityString) > 0) {
                timeType = true
            } else {
                hintText.periodValidity = "* 请选择在计划执行周期之前的日期";
                this.setState({
                    hintText
                })
            }
        }else if(sailingtime=="整年"||sailingtime=="冬春航季"||sailingtime=="夏秋航季" ){
            timeType=true;
        };

        //判断运力始发和目标航点是否相同
        let siteType = false;
        if(this.state.stopType=="noStop"){//noStop 直飞 transit 经停
            if (arrv && dpt) {
                let hintText = this.state.hintText;
                if (arrv == dpt) {
                    hintText.dpt = "* 运力始发和目标航点不能相同";
                    hintText.arrv = "";
                    this.setState({
                        hintText
                    })
                } else {
                    hintText.dpt = "";
                    hintText.arrv = "";
                    this.setState({
                        hintText
                    })
                    siteType = true
                }
            };
        }else {
            if(arrv&&dpt&&pst){
                let hintText = this.state.hintText;
                if(arrv==dpt&&dpt!=pst){
                    hintText.dpt = "* 运力始发和甩飞航点不能相同";
                    hintText.arrv = "";
                    this.setState({
                        hintText
                    })
                }else if(arrv!=dpt&&dpt==pst){
                    hintText.dpt = "* 运力始发和经停航点不能相同";
                    hintText.arrv = "";
                    hintText.pst = ""
                    this.setState({
                        hintText
                    })
                }else if(arrv==dpt&&dpt==pst){
                    hintText.dpt = "* 运力始发、经停航点和甩飞航点不能相同";
                    hintText.arrv = "";
                    hintText.pst = ""
                    this.setState({
                        hintText
                    })
                }else if(dpt!=arrv&&dpt!=pst&&areaType==1&&pstAreaType==1&&pst==arrv){
					hintText.dpt = "";
					hintText.arrv = "* 经停航点和甩飞航点不能相同";
					hintText.pst = ""
					this.setState({
						hintText
					})
                }else {
                    hintText.dpt = "";
                    hintText.arrv = "";
                    hintText.pst = "";
                    this.setState({
                        hintText
                    })
                    siteType = true
                }
            }
        }

        //发布运力信息，对数据进行验证
        if (comparisonTime && comparisonSailingTime && dataType && arrvTime && priceAll && this.state.hintText.performShift == ""&& arrv && dpt && seating && seatingReg.test(seating) && contact && dptTime && /^[1][3,4,5,7,8][0-9]{9}$/.test(iHome) && performShift && aircrfttyp && siteType && timeType && priceType) {
            let routeType=1;
            if(this.state.stopType=="noStop"){
                routeType=0;
            };
            //拟开班期数据组装
            let days = "";
            for (var i = 0; i < 7; i++) {
                if (data[i].type) {
                    days = days + "/" + data[i].name
                }
            };
            days = days.slice(1);
            let subsidypolicy = "";
            if (!offerMode[0].type || !offerMode[1].type) {
                subsidypolicy = "1"
            } else if (!offerMode[2].type) {
                subsidypolicy = "0"
            };
            //发布数据组装
            var plans = new Array();
            var plan = {};
            plan["dpt"] = dpt;
            plan["arrv"] = arrv;
            plan["areaType"] = areaType;
            plan["fixedSubsidyPrice"] = fixedSubsidyPrice;
            plan["bottomSubsidyPrice"] = bottomSubsidyPrice;
            plan["pst"] = pst;
            plan["routeType"] = routeType;
            plan["pstAreaType"] = pstAreaType;
            plan["mandatoryDesignation"] = mandatoryDesignation;
            plan["pstMandatoryDesignation"] = pstMandatoryDesignation;
            plans.push(plan);
            var demand = {};
            demand.periodValidity = periodValidity;
            demand.demandtype = demandtype;
            demand.seating = seating;
            demand.arrv = arrv;
            demand.areaType = areaType;
            demand.dpt = dpt;
            demand.arrvTime = arrvTime;
            demand.dptTime = dptTime;
            demand.performShift = performShift;
            demand.aircrfttyp = aircrfttyp;
            demand.remark = remark;
            demand.sailingtime = sailingtime;
            demand.subsidypolicy = subsidypolicy;
            demand.bottomSubsidyPrice = bottomSubsidyPrice;
            demand.fixedSubsidyPrice = fixedSubsidyPrice;
            demand.contact = contact;
            demand.iHome = iHome;
            demand.days = days;
            demand.plans = JSON.stringify(plans);
            let url;
            // if (this.state.demandtype == 1) {
            //     if (this.state.demandDraftData.id) {
            //         url = "/demandUpdate";
            //         demand.id = this.state.demandDraftData.id;
            //         demand.demandprogress = "";
            //     } else {
            //         url = "/demandAdd"
            //     };
            // } else {
            //     if (this.state.entrustDraftData.id) {
            //         url = "/demandUpdate";
            //         demand.id = this.state.entrustDraftData.id;
            //         demand.demandprogress = "";
            //     } else {
            //         url = "/demandAdd";
            //     };
            // };
            //根据不同的打开方式，调用不同接口
            if (this.state.draftData.id&&!this.state.bianjiAgain) {//草稿箱打开时
                url = "/demandUpdate";
                demand.id = this.state.draftData.id;
                demand.demandprogress = "";
            }else
            if(this.state.bianjiAgain){//运力发布超过3天重新编辑时
                url="/demandUpdate";
                demand.id=this.state.demandId;
                let releasetime=moment().format().split("T").join(" ").split("+")[0];
                demand.releasetime=releasetime;
            }else {//直接点击发布表单时
                url = "/demandAdd"
            };
            //获取始发机场简称
            let airList = store.getState().airList;
            let titleText = "";
            for (let i = 0; i < airList.length; i++) {
                if (airList[i].iata == dpt) {
                    titleText = airList[i].airlnCd;
                    break;
                };
            };
            if(demandtype==4){
                payShow=true;
				doubleAffirm=false;
            }else{
                payShow=false;
                doubleAffirm=true
            };
            this.setState({
                url,
                demand,
                titleText,
                payShow,
                doubleAffirm
            })
        }
    };

    //取消
    cancel() {
        let state = this.state;
        if(this.state.bianjiAgain){
            emitter.emit('openFrom', { openFrom: false });
        };
        if (state.demandtype=="1"&&state.aircrfttyp == "" && state.seating == "" && state.dptTime == "" && (state.days == daysString || state.days == "") && state.sailingtime == "整年" && state.contact == concatDefault && state.iHome == iHomeDefault && state.periodValidity == "" && state.remark == "" && !state.performShift && state.fixedSubsidyPrice == "" && state.bottomSubsidyPrice == "" && state.dpt == "" && state.arrv == ""&&!state.otherType&&!state.bottomSubsidyPriceType&&!state.fixedSubsidyPriceType) {
            emitter.emit('openFrom', { openFrom: false });
        } else {
            this.setState({
                cancelType: true
            })
        };
    };

    //选择报价方式
    offerMode(data) {
        let offerMode = this.state.offerMode;
        let judgeStylesType = this.state.judgeStylesType;
        let hintText = this.state.hintText;
        let bottomSubsidyPrice = this.state.bottomSubsidyPrice;
        let fixedSubsidyPrice = this.state.fixedSubsidyPrice;
        switch (data) {//data:不同报价方式
            case "fixedSubsidyPrice"://定补
                if (offerMode[0].type) {
                    offerMode[0].type = !offerMode[0].type;
                    offerMode[2].type = true;
                    hintText.offer = "";
                    this.setState({
                        offerMode,
                        hintText,
                        otherType: false
                    })
                } else {
                    offerMode[0].type = !offerMode[0].type;
                    offerMode[2].type = true;
                    judgeStylesType.fixedSubsidyPrice = false;
                    hintText.offer = "";
                    this.setState({
                        fixedSubsidyPrice: "",
                        offerMode,
                        judgeStylesType,
                        hintText,
                        otherType: false
                    })
                }
                break;
            case "bottomSubsidyPrice"://保底
                if (offerMode[1].type) {
                    offerMode[1].type = !offerMode[1].type;
                    offerMode[2].type = true;
                    hintText.offer = "";
                    this.setState({
                        offerMode,
                        hintText,
                        otherType: false
                    })
                } else {
                    offerMode[1].type = !offerMode[1].type;
                    offerMode[2].type = true;
                    judgeStylesType.bottomSubsidyPrice = false;
                    hintText.offer = "";
                    this.setState({
                        bottomSubsidyPrice: "",
                        offerMode,
                        judgeStylesType,
                        hintText,
                        otherType: false
                    });
                }
                break;
            case "other"://待议
                if (offerMode[2].type) {
                    offerMode[0].type = true;
                    offerMode[1].type = true;
                    offerMode[2].type = !offerMode[2].type;
                    judgeStylesType.bottomSubsidyPrice = false;
                    judgeStylesType.fixedSubsidyPrice = false;
                    fixedSubsidyPrice = "";
                    bottomSubsidyPrice = "";
                    hintText.offer="";
                    this.setState({
                        offerMode,
                        judgeStylesType,
                        fixedSubsidyPrice,
                        bottomSubsidyPrice,
                        otherType: true,
                        hintText
                    })
                } else if (!offerMode[2].type) {
                    offerMode[2].type = !offerMode[2].type;
                    hintText.offer="* 请选择报价方式"
                    this.setState({
                        offerMode,
                        otherType: false,
                        hintText
                    })
                };
                break;
            default:
                break;
        }
    };

    //修改定补价格
    handleChangefixedSubsidyPrice(event) {
        let fixedSubsidyPrice = event.target.value;
        let judgeStylesType = this.state.judgeStylesType;
        let fixedSubsidyPriceReg = /^(?:0|[1-9]\d{0,2})(?:\.\d{1,2})?$/;//验证规则
        if (fixedSubsidyPriceReg.test(fixedSubsidyPrice)) {
            if (fixedSubsidyPrice == 0) {
                judgeStylesType.fixedSubsidyPrice = false;
            } else {
                judgeStylesType.fixedSubsidyPrice = true;
            };
            this.setState({
                fixedSubsidyPrice,
                judgeStylesType
            })
        } else {
            judgeStylesType.fixedSubsidyPrice = false;
            this.setState({
                fixedSubsidyPrice,
                judgeStylesType
            })
        }
    };

    //修改保底价格
    handleChangebottomSubsidyPrice(event) {
        let bottomSubsidyPrice = event.target.value;
        let judgeStylesType = this.state.judgeStylesType;
        let bottomSubsidyPriceReg = /^(?:0|[1-9]\d{0,2})(?:\.\d{1,2})?$/;////验证规则
        if (bottomSubsidyPriceReg.test(bottomSubsidyPrice)) {
            if (bottomSubsidyPrice == 0) {
                judgeStylesType.bottomSubsidyPrice = false;
            } else {
                judgeStylesType.bottomSubsidyPrice = true;
            };
            this.setState({
                bottomSubsidyPrice,
                judgeStylesType
            })
        } else {
            judgeStylesType.bottomSubsidyPrice = false;
            this.setState({
                bottomSubsidyPrice,
                judgeStylesType
            })
        }
    };

    //座位布局
    seating(event) {
        let seating = event.target.value;
        let judgeStylesType = this.state.judgeStylesType;
        let seatingReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,8}$/;//验证规则
        if (seatingReg.test(seating)) {
            judgeStylesType.seating = true;
            this.setState({
                seating,
                judgeStylesType
            })
        } else {
            judgeStylesType.seating = false;
            this.setState({
                seating,
                judgeStylesType
            })
        }
    };

    //计划执行班次
    performShift(event) {
        let performShift = event.target.value;
        let performShiftReg = /^[1-9][0-9]{0,}$/;//验证规则
        let hintText = this.state.hintText;
        if (performShiftReg.test(performShift)) {
            hintText.performShift = "";
            this.setState({
                hintText,
                performShift,
                userPerformShift: performShift
            });
        } else {
            hintText.performShift = "请输入正确的执行班次";
            this.setState({
                hintText,
                performShift
            });
        }
    };

    //联系人
    contact(event) {
        let contact = event.target.value;
        let hintText = this.state.hintText;
        hintText.contact = "";
        this.setState({
            contact,
            hintText
        })
    };

    //移动电话
    iHome(event) {
        let iHome = event.target.value;
        let judgeStylesType = this.state.judgeStylesType;
        var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;//验证规则
        if (phoneReg.test(iHome)) {
            judgeStylesType.iHome = true;
            this.setState({
                iHome,
                judgeStylesType
            })
        } else {
            judgeStylesType.iHome = false;
            this.setState({
                iHome,
                judgeStylesType
            })
        }
    };

    //其他说明
    other(event) {
        let remark = event.target.value;
        let textNum = remark.length;
        this.setState({
            remark,
            textNum
        })
    };

    // 选择报价类型
    setPriceClick() {
        let fixedSubsidyPriceType = this.state.fixedSubsidyPriceType;
        fixedSubsidyPriceType = !fixedSubsidyPriceType;
        this.setState({
            fixedSubsidyPriceType,
            otherType: false
        })
    };

    guaranteeClick() {
        let bottomSubsidyPriceType = this.state.bottomSubsidyPriceType;
        bottomSubsidyPriceType = !bottomSubsidyPriceType;
        this.setState({
            bottomSubsidyPriceType,
            otherType: false
        })
    };

    otherClick() {
        let bottomSubsidyPriceType = false;
        let fixedSubsidyPriceType = false;
        let otherType = this.state.otherType;
        otherType = !otherType
        this.setState({
            fixedSubsidyPriceType,
            bottomSubsidyPriceType,
            otherType
        })
    };

    //拟飞机型返回数据
    dimEvent(data) {//data:机型
        let hintText = this.state.hintText;
        hintText.aircrfttyp = "* 请选择拟飞机型";
        if (data) {
            hintText.aircrfttyp = "";
        };
        // this.airTypeInput.input.value = data;
        this.setState({
            aircrfttyp: data,
            hintText
        })
    };

    aircrfttypOnBlur() {//拟飞机型失去焦点事件
        setTimeout(() => {
            this.setState({
                aircrfttypShowType: false
            })
        }, 150)
    };

    //运力始发
    dpt(value) {
        let hintText = this.state.hintText;
        hintText.dpt = "";
        this.setState({
            dpt: value,
            hintText
        })
    };

    //目标区域或航点
    areaType(value) {
        this.setState({
            areaType: value,
            arrvSearchText: '', // 目标航点输入框组件输入的内容
            arrvAreaSearchText: '', // 目标区域输入框组件输入的内容
            arrvProvinceSearchText: '', // 目标省份输入框组件输入的内容
        })
    };

    // 计划执行时间并计算默认执行班次
    changeEvent(data,date){//data:组件返回时间  date:组件返回时间对象
        let performShift = 0;
        let hintText = this.state.hintText;
        let periodValidity = this.state.periodValidity;
        switch (data){
            case "整年":
                performShift=this.calculateFixation(365);
                hintText.sailingtime = "";
                hintText.periodValidity = "";
                hintText.performShift="";
                break;
            case "冬春航季":
                performShift=this.calculateFixation(153);
                hintText.sailingtime = "";
                hintText.periodValidity = "";
                hintText.performShift="";
                break;
            case "夏秋航季":
                performShift=this.calculateFixation(216);
                hintText.sailingtime = "";
                hintText.periodValidity = "";
                hintText.performShift="";
                break;
            default:
                performShift=this.calculateUnset(data);
                // let dateStart = data.split(",")[0].split("-");
                // let newDate = new Date(dateStart[0], dateStart[1], dateStart[2]);
                if(date.length!=0){
                    let newDate=date[0].clone();
                    periodValidity=newDate.subtract(1, "days").format().split("T")[0];
                };
                hintText.sailingtime = "";
                hintText.periodValidity = "";
                hintText.performShift="";
                break;
        };
        if (this.state.periodValidity) {
            this.setState({
                disableSailingTime: periodValidity,
                sailingtime:data,
                hintText,
                performShift
            })
        } else {
            this.setState({
                disableSailingTime: periodValidity,
                periodValidity,
                sailingtime:data,
                hintText,
                performShift
            })
        }
    };

    //密码输入组件返回事件
    dealCloseFn(i){
        if(i == 1) {  // 1:验证成功-关闭，2：点击“取消”关闭
            this.affirmForm();
        }else {
            this.setState({
                payShow:false
            })
        }
    };

    //忘记密码点击保存事件
    forgetPwd(){
        this.saveDraft();
    };

    //固定计划执行班次计算方法
    calculateFixation(num){//num:数值
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
        performShift=parseInt(num/7)* dataTrueNum.length;//整周所含执行班次
        for (let i = 0; i < num%7; i++) {
            for (let j = 0; j < dataTrueNum.length; j++) {
                if (i== dataTrueNum[j]) {
                    performShift = 1 + performShift;
                }
            }
        };
        return performShift;
    };

    //不固定时间计划执行班次计算方法
    calculateUnset(dateString){
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
    };

    onCalendarChange(dates, dateStrings) {
        if (dates.length == 1) {
            let a = moment(dates[0]).format('YYYY-MM-DD');
            let b = moment(dates[0]).add(1, 'y').format('YYYY-MM-DD');
            let sailingtime = a + "," + b;
            this.setState({
                sailingtime
            })
        }
    }

    //计划执行周期禁选时间段
    sailingtimeDisabledDate(current) {
        let disText = current && current < moment().add(1,"months").endOf("days");//默认当前一个月以后之前都禁选
        if (this.state.periodValidity) {
            let startTime = moment(this.state.periodValidity, "YYYY/MM/DD");//运力有效期之前的时间全部禁选
            disText = current && current < startTime.endOf("days");
        };
        return disText;
    }

    //运力有效期
    periodValidity(date, dateString) {//date:组件返回时间对象  dateString:组件返回时间字符串
        let hintText = this.state.hintText;
        if (dateString != "") {
            let periodValidity = dateString;
            hintText.periodValidity = "";
            this.setState({
                hintText,
                periodValidity
            })
        } else {
            this.setState({
                periodValidity: dateString
            })
        }
    }

    //运力有效期禁选时间
    periodValidityDisabledDate(current) {
        let disText = current && current < moment().add(1,"months").subtract(1, "days");//正式版 -T1 默认当前一个月以后之前的时间禁选
        // let disText = current && current < moment().subtract(1, "days");//测试要求版
        if (this.state.sailingtime&&this.state.sailingtime!="整年"&&this.state.sailingtime!="冬春航季"&&this.state.sailingtime!="夏秋") {//根据运力有效期禁选
            let startTime = moment(this.state.disableSailingTime, "YYYY/MM/DD");
            disText = (current && current < moment().add(1,"months").subtract(1, "days")) || current > startTime;//正式版 -T1
            // disText = (current && current < moment().subtract(1, "days") || current > startTime);//测试要求版
        };
        return disText;
    }

    //打开组件跳转对应月份
    openDatePicker(){
        let {periodValidity,hintText}=this.state;
        if(!periodValidity){
            periodValidity=moment().add(1,"months").format("L").split("/").join("-");
            hintText.periodValidity="";
        };
        this.setState({
            periodValidity,
            hintText
        })
    }

    //关闭弹出层
    closeCancelDiv() {
        this.setState({
            cancelType: false
        })
    }

    closeDoubleDiv() {
        this.setState({
            doubleAffirm: false
        })
    }

    //关闭表单
    closeFrom() {
        emitter.emit('openFrom', { openFrom: false })
    }
    //取消按钮触发保存草稿事件
    judgeDraft() {
        this.setState({
            cancelType: false
        });
        this.saveDraft()
    }
    //显示密码弹层
    payShow=()=>{
        this.setState({
            payShow:true,
            doubleAffirm:false
        })
    }

    //发布表单
    affirmForm() {
        let demand = this.state.demand;
        let {url}=this.state;
        Axios({
            method: 'post',
            url,
            data: JSON.stringify(this.state.demand),
            dataType: 'json',
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            }
        }).then((response) => {
            emitter.emit('openFrom', { openFrom: false });
            if (response.data.opResult == 0) {
                Modal.success({
                    title: `${this.state.titleText}${this.state.aircrfttyp}运力${this.state.demandtype == 1 ? "投放" : "委托"}${this.state.bianjiAgain?'编辑':''}成功！`,
                    content: '',
                    onOk() {
                        emitter.emit('againMap');
                        emitter.emit('openFrom', { openFrom: false });
                        emitter.emit('renewWodefabu');
                    },
                    className: "test"
                });
                emitter.emit('renewCaogaoxiang');
            } else {
                if (this.state.demandtype == 1) {
                    if (this.state.draftData.id) {
                        demand.id = this.state.draftData.id;
                    }
                } else {
                    if (this.state.draftData.id) {
                        demand.id = this.state.draftData.id;
                    }
                };
                Axios({
                    method: 'post',
                    url: "/saveDraftDemand",
                    data: JSON.stringify(demand),
                    dataType: 'json',
                    headers: {
                        'Content-type': 'application/json; charset=utf-8'
                    }
                }).then((response) => { });
                Modal.error({
                    title: '信息提示：',
                    content:response.data.msg,
                    onOk() {
                        emitter.emit('openFrom', { openFrom: false });
                        emitter.emit('renewCaogaoxiang');
                    },
                    className: "test"
                });
            }
        })
    }

    //TODO：无草稿初始化页面事件
    initializeEvent() {
        let contact = store.getState().role.concat;
        this.setState({
            demandtype: "1",//发布需求选择
            aircrfttyp: "",//拟飞机型
            seating: "",//座位数布局
            dpt: "",//运力始发
            arrv: "",//目标区域或航点
            dptTime: "",//出港时间
            arrvTime: "",//进航时间
            days: "",//拟开航班
            sailingtime: "",//计划执行周期
            performShift: "",//计划执行班次
            userPerformShift: "",//用户输入计划执行班次
            periodValidity: "",//运力有效期
            contact,//联系人
            iHome: store.getState().role.phone,//移动电话
            fixedSubsidyPrice: "",//定补价格
            bottomSubsidyPrice: "",//保底价格
            fixedSubsidyPriceType: false,//定补类型
            bottomSubsidyPriceType: false,//保底类型
            otherType: false,//其他类型
            remark: "",//其他说明
            dptSearchText: '', // 始发输入框组件输入的内容
            arrvSearchText: '', // 目标航点输入框组件输入的内容
            arrvAreaSearchText: '', // 目标区域输入框组件输入的内容
            dptShowAirportSearch: false,  // 始发下拉框是否显示
            arrvShowAirportSearch: false,  // 目标航点下拉框是否显示
            arrvAreaShowAirportSearch: false,  // 目标区域下拉框是否显示
            areaType: "1",//目标区域或者航点
            textNum: "0",//其他说明输入字数
            cancelType: false,//点击取消显示弹出层
            judgeStylesType: {//验证
                iHome: true,
                seating: false,
                fixedSubsidyPrice: false,
                bottomSubsidyPrice: false
            },
            hintText: {//提示语
                aircrfttyp: "",
                dpt: "",
                arrv: "",
                seating: "",
                dptTime: "",
                arrvTime: "",
                offer: "",
                iHome: "",
                sailingtime: "",
                periodValidity: "",
                performShift: "",
                contact: "",
                data: ""
            },
            data: [ //拟开航班默认数据
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
            ],
            offerMode: [//报价方式
                {
                    name: "fixedSubsidyPrice",
                    type: true,
                }, {
                    name: "bottomSubsidyPrice",
                    type: true,
                }, {
                    name: "other",
                    type: true
                },
            ]
        })
    }

    //从子组件获取出港时刻
    outTimeEvent(data) {//data:出港时刻
        let arrvTime=this.state.arrvTime;
        try {
            if(parseInt(data.split(":")[0])>parseInt(arrvTime.split(":")[0])&&arrvTime.split("")[0]!="+"){
                arrvTime=""
            };
        }catch (e) {

        };
        let hintText = this.state.hintText;
        hintText.dptTime = "";
        this.setState({
            dptTime: data,
            hintText,
            arrvTime
        })
    };
    //从子组件获取进港时刻
    inTimeEvent(data) {//data:进港时刻
        let hintText = this.state.hintText;
        hintText.arrvTime = "";
        this.setState({
            arrvTime: data,
            hintText
        });
    }

    //直飞或者经停类型选择
    setStop(e){
        // console.info(e.target.value);
        let hintText=this.state.hintText;
        // this.state.pstMandatoryDesignation
        hintText.dpt="";
        hintText.pst="";
        this.setState({
            stopType:e.target.value,
            hintText,
            pst:"",
            arrv:"",
            areaType:"1",
            pstAreaType:"1",
            mandatoryDesignation:0,
            pstMandatoryDesignation:0
        })
    }

    //草稿数据绑定表单事件
    draftEvent(defaultData,num) {//num:0 草稿 num:1  重新上架 2:重新编辑 defaultData:草稿数据
        let { aircrfttyp, seating,demandPlans:[{arrv="",dpt="",areaType="1",pst="",pstAreaType="1",mandatoryDesignation=0,pstMandatoryDesignation=0}], demandtype, dptTime, arrvTime, days, sailingtime, performShift, subsidypolicy, periodValidity, contact, remark, iHome, fixedSubsidyPrice, bottomSubsidyPrice } = defaultData;
        let judgeStylesType = this.state.judgeStylesType;
        // let demandPlans=defaultData.demandPlans;
        //直飞或经停判断
        let stopType="noStop";
        if(!!pst){
            stopType="transit"
        };
        let hintText = this.state.hintText;
        //报价按钮是否已点击判断及提示
        let fixedSubsidyPriceType = this.state.fixedSubsidyPriceType;
        let bottomSubsidyPriceType = this.state.bottomSubsidyPriceType;
        let otherType = this.state.otherType;
        let offerMode = this.state.offerMode;
        if (fixedSubsidyPrice) {
            hintText.offer="";
            fixedSubsidyPriceType = true;
            offerMode[0].type = false;
            let fixedSubsidyPriceReg = /^(?:0|[1-9]\d{0,2})(?:\.\d{1,2})?$/;
            if (fixedSubsidyPriceReg.test(fixedSubsidyPrice)) {
                judgeStylesType.fixedSubsidyPrice = true;
            }
        } else {
            offerMode[0].type = true;
            fixedSubsidyPriceType = false;
        };
        if (bottomSubsidyPrice) {
            hintText.offer="";
            bottomSubsidyPriceType = true;
            offerMode[1].type = false;
            let bottomSubsidyPriceReg = /^(?:0|[1-9]\d{0,2})(?:\.\d{1,2})?$/;
            if (bottomSubsidyPriceReg.test(bottomSubsidyPrice)) {
                judgeStylesType.bottomSubsidyPrice = true;
            }
        } else {
            offerMode[1].type = true;
            bottomSubsidyPriceType = false;
        };
        if (subsidypolicy == "0") {
            offerMode[2].type = false;
            otherType = true;
            hintText.offer="";
        } else {
            otherType = false
        };
        //手机号判断
        var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (phoneReg.test(iHome)) {
            judgeStylesType.iHome = true
        } else {
            judgeStylesType.iHome = false
        }
        //计划执行班次判断
        if (performShift) {
            hintText.performShift = ""
        };
        if(aircrfttyp){
          hintText.aircrfttyp="";
        };
        //拟开航班组件渲染判断
        let day = [
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
        if(days){
            hintText.data="";
        };
        day.map((item, index) => {
            for (let i = 0; i < days.split("/").length; i++) {
                if (item.name == days.split("/")[i]) {
                    item.type = true
                }
            };
            return item;
        });
        if(dpt){
            hintText.dpt=""
        };
        //座位数布局提示判断
        let seatingReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,8}$/;
        if (seating && seatingReg.test(seating)) {
            judgeStylesType.seating = true;
            hintText.seating="";
        };
        //始发区域显示文字判断
        let allAirList = store.getState().allAirList;//始发点
        let dptSearchText = "";
        for (let i = 0; i < allAirList.length; i++) {
            if (allAirList[i].iata == dpt) {
                dptSearchText = allAirList[i].airlnCdName;
                break
            }
        };
        // //目标地点
        // let arrvSearchText = "";
        // let arrvAreaSearchText = "";
        // let arrvProvinceSearchText = "";
        // if (arrv) {
        //     if (areaType == "1") {
        //         //机场匹配查询
        //         for (let i = 0; i < allAirList.length; i++) {
        //             if (allAirList[i].iata == arrv) {
        //                 arrvSearchText = allAirList[i].airlnCdName;
        //                 break
        //             }
        //         };
        //     } else if (areaType == "2") {
        //         arrvProvinceSearchText = arrv
        //     } else if (areaType == "3") {
        //         arrvAreaSearchText = arrv
        //     } else {
        //         areaType = "1"
        //     };
        //     hintText.arrv="";
        // } else {
        //     areaType = "1"
        // };

        let disableSailingTime = "";
        if (sailingtime) {
            let sDate = sailingtime.split(",");
            disableSailingTime = moment(sDate[0], "YYYY/MM//DD").subtract(1, "days");
            hintText.sailingtime="";
        };
        if(num==1){
            periodValidity="";
            if(sailingtime!="整年"&&sailingtime!="冬春航季"&&sailingtime!="夏秋航季"){
                sailingtime="";
            };
        };
        if(periodValidity){
            hintText.periodValidity="";
        };
        if(arrvTime){
            hintText.arrvTime="";
        };
        if(dptTime){
            hintText.dptTime="";
        };
        this.setState({
            stopType,
            aircrfttyp,
            demandtype,
            seating,
            pst,
            dpt,
            arrv,
            areaType,
            dptTime,
            arrvTime,
            days,
            data: day,
            sailingtime,
            disableSailingTime,
            performShift,
            userPerformShift: performShift,
            periodValidity,
            contact,
            iHome,
            fixedSubsidyPrice,
            bottomSubsidyPrice,
            remark,
            defaultData,
            subsidypolicy,
            fixedSubsidyPriceType,
            bottomSubsidyPriceType,
            otherType,
            judgeStylesType,
            // arrvSearchText,
            // arrvAreaSearchText,
            // arrvProvinceSearchText,
            dptSearchText,
            hintText,
            pstAreaType,
            mandatoryDesignation,
            pstMandatoryDesignation
        });
    }

    componentWillMount() {  // 将要渲染
        let air = store.getState().air;//获取机型列表
        let iHome = parseInt(store.getState().role.phone);
        let contact = store.getState().role.concat;
        let judgeStylesType = this.state.judgeStylesType;
        judgeStylesType.iHome = true;
        this.setState({
            air,
            iHome,
            contact,
            judgeStylesType,
            sailingtime:"整年"
        });
        let demandId = '';
        let reDemandId = '';
        let bianjiAgain=false;
        if(this.props.caogaoxiang){
            ({demandId=""}=this.props.caogaoxiang);
        }else if(this.props.chongxinshangjia){
            ({demandId:reDemandId=""}=this.props.chongxinshangjia);
        }else if(this.props.bianjiAgain){
            if(this.props.bianjiAgain.bianjiAgain){
                ({demandId:reDemandId=""}=this.props.bianjiAgain);
                bianjiAgain=true;
            }else {
                if(this.props.bianjiAgain.new){
                    this.setState({
                        demandtype:"4"
                    })
                }
            }
        };
        if(demandId){
            Axios({  //草稿箱打开表单
                method: 'post',
                url: '/queryDraftDemandDetail',
                params: {
                    demandId
                },
                headers: {
                    'Content-type': 'application/json; charset=utf-8'
                }
            }).then((response) => {
                if (response.data.opResult == 0) {
                    let draftData = response.data.obj;
                    this.setState({
                        draftData
                    });
                    // let demandDraftData = this.state.demandDraftData;//运力需求草稿
                    // let entrustDraftData = this.state.entrustDraftData;//运力委托草稿
                    // for (let i = 0; i < draftData.length; i++) {
                    //     if (draftData[i].demandtype == 1) {
                    //         demandDraftData = draftData[i]
                    //     } else {
                    //         entrustDraftData = draftData[i]
                    //     }
                    // };
                    // let defaultData = this.state.defaultData;
                    // if (demandDraftData.id) {
                    //     defaultData = demandDraftData;
                    // } else if (entrustDraftData.id && !demandDraftData.id) {
                    //     defaultData = entrustDraftData;
                    // };
                    // this.setState({
                    //     demandDraftData,
                    //     entrustDraftData
                    // })
                    this.draftEvent(draftData,0);
                } else {
                    this.setState({
                        iHome: store.getState().role.phone,
                        demandId
                    })
                }
            });
        };
        if(reDemandId){
            Axios({  //重新上架表单
                method: 'post',
                url: '/republishDemand',
                params: {
                    demandId:reDemandId
                },
                headers: {
                    'Content-type': 'application/json; charset=utf-8'
                }
            }).then((response) => {
                if (response.data.opResult == 0) {
                    let draftData = response.data.demand;
                    this.setState({
                        draftData,
                        bianjiAgain,
                        demandId:reDemandId
                    });
                    // let demandDraftData = this.state.demandDraftData;//运力需求草稿
                    // let entrustDraftData = this.state.entrustDraftData;//运力委托草稿
                    // for (let i = 0; i < draftData.length; i++) {
                    //     if (draftData[i].demandtype == 1) {
                    //         demandDraftData = draftData[i]
                    //     } else {
                    //         entrustDraftData = draftData[i]
                    //     }
                    // };
                    // let defaultData = this.state.defaultData;
                    // if (demandDraftData.id) {
                    //     defaultData = demandDraftData;
                    // } else if (entrustDraftData.id && !demandDraftData.id) {
                    //     defaultData = entrustDraftData;
                    // };
                    // this.setState({
                    //     demandDraftData,
                    //     entrustDraftData
                    // })
                    this.draftEvent(draftData,!bianjiAgain?1:2);
                } else {
                }
            });
        };
    };

    componentWillReceiveProps(nextProps){
        let {demandId=""}=nextProps.caogaoxiang;
        if(demandId){
            Axios({  //获取草稿内容
                method: 'post',
                url: '/queryDraftDemandDetail',
                params: {
                    demandId
                },
                headers: {
                    'Content-type': 'application/json; charset=utf-8'
                }
            }).then((response) => {
                if (response.data.opResult == 0) {
                    let draftData = response.data.obj;
                    this.setState({
                        draftData
                    });
                    // let demandDraftData = this.state.demandDraftData;//运力需求草稿
                    // let entrustDraftData = this.state.entrustDraftData;//运力委托草稿
                    // for (let i = 0; i < draftData.length; i++) {
                    //     if (draftData[i].demandtype == 1) {
                    //         demandDraftData = draftData[i]
                    //     } else {
                    //         entrustDraftData = draftData[i]
                    //     }
                    // };
                    // let defaultData = this.state.defaultData;
                    // if (demandDraftData.id) {
                    //     defaultData = demandDraftData;
                    // } else if (entrustDraftData.id && !demandDraftData.id) {
                    //     defaultData = entrustDraftData;
                    // };
                    // this.setState({
                    //     demandDraftData,
                    //     entrustDraftData
                    // })
                    this.draftEvent(draftData,0);
                } else {
                    this.setState({
                        iHome: store.getState().role.phone,
                        demandId
                    })
                }
            });
        }
    }

    componentDidMount() {   // 加载渲染完成
        let _this=this;
        setTimeout(function () {
            _this.setState({
                fixed:true
            })
        },500)
    }

    //经停是否锁定事件
    transitEvent(data){
        // console.info(data);
        this.setState({
            pstMandatoryDesignation:data
        })
    }
    //甩飞是否锁定事件
    jiltFlyEvent(data){
        // console.info(data);
        this.setState({
            mandatoryDesignation:data
        })
    }

    //经停数据
    transitData(data){
        let pst=data.pointData;
        let hintText=this.state.hintText;
        if(pst){
			hintText.arrv="";
			hintText.dpt="";
			hintText.pst="";
        };
        this.setState({
            pstAreaType:data.areaType,
            pst,
            hintText
            // pstMandatoryDesignation:data.lockType
        })
    }
    //甩飞数据
    jiltFlyData(data){//  stopType:"noStop",//直飞或经停 noStop 直飞 transit 经停
        let {stopType,dpt,pst,hintText}=this.state;
		let arrv=data.pointData;
        let hint="目标航点";
        if(stopType=="transit"){
            hint="甩飞航点"
        };
        if(stopType=="noStop"){//直飞的情况
          if(arrv&&arrv!=dpt){
              hintText.arrv="";
              hintText.dpt="";
              hintText.pst="";
          }
        }else {//经停的情况
            if(arrv){
				hintText.arrv="";
				hintText.dpt="";
				hintText.pst="";
            }
        };
        this.setState({
            areaType:data.areaType,
            arrv,
            hintText
        })
    }

    render() {
        let defaultData = this.state.defaultData;
        const { dptTime, arrvTime } = this.state;
        let dptAxis = {  // 始发下拉搜索样式
            position: 'absolute',
            width:'245px',
            top: '40px',
            right: '0',
            maxHeight: '220px',
            overflowY: 'scroll',
			boxShadow: '0 2px 11px rgba(85,85,85,0.1)',
            background: 'white',
            zIndex: 222
        };
        let arrvAxis = {  // 目标航点下拉搜索样式
            position: 'absolute',
            top: '40px',
			width:'245px',
            right: '0',
            maxHeight: '220px',
			boxShadow: '0 2px 11px rgba(85,85,85,0.1)',
            overflowY: 'scroll',
            background: 'white',
            zIndex: 22
        };
        let arrvAreaAxis = {  // 目标航点下拉搜索样式
            position: 'absolute',
            top: '40px',
            right: '0',
			width:'245px',
            maxHeight: '220px',
			boxShadow: '0 2px 11px rgba(85,85,85,0.1)',
            overflowY: 'scroll',
            background: 'white',
            zIndex: 22
        };
        //移动电话正则验证提示
        let iHomeText = "";
        let iHomeType = this.state.judgeStylesType.iHome;
        let iHomeNoText = this.state.hintText.iHome;
        if (!iHomeType && this.state.iHome != "") {
            iHomeText = "* 请输入正确的手机号"
            iHomeNoText = "";
        } else if (iHomeType) {
            iHomeNoText = "";
            iHomeText = ""
        }
        //座位数布局提示
        let seatingText = "";
        let seatingType = this.state.judgeStylesType.seating;
        let seatingNoText = this.state.hintText.seating;
        if (!seatingType && this.state.seating != "") {
            seatingText = "* 请输入正确的座位数布局";
            seatingNoText = ""
        } else if (seatingType) {
            seatingNoText = "",
                seatingText = ""
        };
        let hintText = this.state.hintText;
        //拟飞机型
        let aircrfttypText = hintText.aircrfttyp;
        //运力始发
        let dptText = hintText.dpt;
        //目标区域
        let arrvText = hintText.arrv;
        //出港时刻
        let dptTimeText = hintText.dptTime;
        //进航时刻
        let arrvTimeText = hintText.arrvTime;
        //报价
        let offerMode = this.state.offerMode;
        //无
        let offerText = hintText.offer;
        //格式错误
        let offerErrorText = "";
        let fixedSubsidyPriceType = this.state.judgeStylesType.fixedSubsidyPrice;
        let bottomSubsidyPriceType = this.state.judgeStylesType.bottomSubsidyPrice;
        if (!fixedSubsidyPriceType && this.state.fixedSubsidyPrice != "") {
            offerErrorText = "* 请输入正确价格";
            offerText = ""
        } else if (!bottomSubsidyPriceType && this.state.bottomSubsidyPrice != "") {
            offerErrorText = "* 请输入正确价格";
            offerText = ""
        } ;
        // else if (!this.state.offerMode[2].type || bottomSubsidyPriceType || fixedSubsidyPriceType) {
        //     offerErrorText = "";
        //     offerText = ""
        // };
        //拟开航班
        let dataText = hintText.data;
        //计划执行班次
        let performShiftText = hintText.performShift;
        //计划执行周期
        let sailingtimeText = hintText.sailingtime;
        //运力有效期
        let periodValidityText = hintText.periodValidity;
        //联系人
        let contactText = hintText.contact;
        let periodValidity = this.state.periodValidity;
        //点击取消显示弹出层
        let cancelShow = "";
        if (this.state.cancelType) {
            cancelShow = style['show']
        } else {
            cancelShow = style['hidden']
        };
        //点击显示再次确认弹层
        let doubleDiv = "";
        if (this.state.doubleAffirm) {
            doubleDiv = style['show']
        } else {
            doubleDiv = style['hidden']
        };
        //点击显示密码支付弹层
        let payStyle = "";
        if (this.state.payShow) {
            payStyle = style['show']
        } else {
            payStyle = style['hidden']
        };
        // //草稿获取计划周期渲染事件
        // let cycleDefault = [];
        // if (this.state.sailingtime != "") {
        //     cycleDefault = [moment(this.state.sailingtime.split(",")[0], "YYYY/MM/DD"), moment(this.state.sailingtime.split(",")[1], "YYYY/MM/DD")];
        // }
        //草稿获取渲染出进港时刻事件
        let outTimeDefault = null;
        let inTimeDefault = null;
        if (dptTime != "") {
            outTimeDefault = moment(dptTime, format);
        };
        if (arrvTime != "") {
            inTimeDefault = moment(arrvTime, format);
        };
        //运力有效期
        let periodValidityTime = this.state.periodValidity;
        let periodValidityTimeText = null;
        if (periodValidityTime != "") {
            periodValidityTimeText = moment(this.state.periodValidity, 'YYYY-MM-DD')
        };
        let _this = this;
        let timerA = false;
        let timerD = false;
        let timerJ = false;
        let timerAD = false;
        try {
            this.iHomeInput.input.value = this.state.iHome
        } catch (e) {

        };
        return (
            <div className={style['capacity-release']}>
                {/*<div className={style['capacity-release-filter']}>*/}
                    {/*/!*需求类型模块*!/*/}
                    {/*<div>*/}
                        {/*<div className={style['capacity-release-title']}>发布需求</div>*/}
                        {/*<div className={style['capacity-release-filter-checkbox']}>*/}
                            {/*<RadioGroup onChange={this.setDemandtypeStr} value={demandTypeRadio}>*/}
                                {/*<Radio value={'demand'}>运力投放</Radio>*/}
                                {/*<Radio value={'entrust'}>运力委托</Radio>*/}
                            {/*</RadioGroup>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}
                <div className={style['capacity-release-content']}>
                    {/*表单主要信息模块*/}
                    <div style={{ position: "relative",height:"-webkit-fill-available"}}>
                        <div className={style['contentTop']}>
                            <div className={style['capacity-release-content-name']}>我有一个运力需要快速飞起来！</div>
                            <div className={style['stopStyle']}>
                                <RadioGroup onChange={this.setStop} value={this.state.stopType}>
                                    <Radio value={'noStop'}>直飞</Radio>
                                    <Radio value={'transit'}>经停</Radio>
                                </RadioGroup>
                            </div>
                        </div>
                        {/*<Button className={`iconfont ${style['close-btn']}`} onClick={this.cancel.bind(this)}>&#xe62c;</Button>*/}
                        <div className={`${style['capacity-release-content-flex']} ${style['testMargin']}`}>
                            <div className={style['capacity-release-content-box']} style={{ position: "relative" }}>
                                <div className={style['capacity-release-content-filter-type']}>
                                    拟飞机型
                                    {/*title:hover时显示文字 placement:hover时文字显示位置（不传默认为top,可选 top left right bottom topLeft topRight bottomLeft bottomRight leftTop leftBottom rightTop rightBottom）*/}
                                    {/*<IconInfo title={"请输入您的运力机型"}/>*/}
                                </div>
                                {/*  dimEvent:返回的择中机型  defaultData:草稿中保存的机型 airType:0 航司 1 机场*/}
                                <DimAir airType="1" placeholder="请输入拟飞机型" defaultData={this.state.aircrfttyp} dimEvent={(data) => this.dimEvent(data)} />
                                <span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 43 }}>{aircrfttypText}</span>
                            </div>
                            <div className={style['capacity-release-content-box']} style={{ position: "relative" }}>
                                <div className={style['capacity-release-content-filter-type']}>座位数布局</div>
                                <Input style={{ width: 135, marginLeft: 10, paddingRight: 0 }} value={this.state.seating} className={style['capacity-release-input-hover']} onChange={this.seating} maxLength="8" placeholder="例：F8Y160" />
                                <span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 43 }}>{seatingText}</span>
                                <span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 43 }}>{seatingNoText}</span>
                            </div>
                        </div>
                        <div className={style['capacity-release-content-flex']}>
                            <div className={style['capacity-release-content-box']}>
                                <div className={style['capacity-release-content-filter-type']}>运力始发</div>
                                <input type="text"
                                    className={style['role-search-input']}
                                    maxLength="20"
                                    placeholder="请输入运力始发点"
                                    value={this.state.dptSearchText}
                                    onChange={this.dptSearchTextChangeFn.bind(this)}
                                    // onFocus={this.dptInputFocusFn.bind(this)}
                                    onBlur={this.dptInputBlurFn.bind(this)}
                                />
                                {
                                    this.state.dptShowAirportSearch &&
                                    <AirportSearch axis={dptAxis}
                                        resData={this.dptAirportData.bind(this)}
                                        searchText={this.state.dptSearchText} />
                                }
                                <span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 43 }}>{dptText}</span>
                            </div>
                            {/*日期：8-13，需求变更*/}
                            {/*<div className={style['capacity-release-content-box']}>*/}
                                {/*<div className={style['newIcon']}>*/}
                                    {/*<Select className={style['capacity-release-content-new']} value={this.state.areaType} defaultValue="1"  onChange={this.areaType}>*/}
                                        {/*<Option value="1" style={{ color: "#3979ff" }}>目标航点</Option>*/}
                                        {/*<Option value="2" style={{ color: "#3979ff" }}>目标省份</Option>*/}
                                        {/*<Option value="3" style={{ color: "#3979ff" }}>目标区域</Option>*/}
                                    {/*</Select>*/}
                                    {/*<IconInfo placement={"top"} title={"请选择您的目标航点或者省份区域"}/>*/}
                                {/*</div>*/}
                                {/*{arrvBox}*/}
                                {/*<span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 43 }}>{arrvText}</span>*/}
                            {/*</div>*/}
                        </div>
                        <div className={style['arrv_time']} style={{display: "flex",justifyContent:"space-between"}}>
                            <div className={style['inOut']}>
                                <div className={style['borderline']} style={{ width: 10, border: "1px solid #3e76fb", borderRight: "0px", marginTop: 11 }}></div>
                                <div>
                                    <div className={style['capacity-release-content-box']} style={{ width: 224, position: "relative" }}>
                                        <div className={style['capacity-release-content-filter-type']}><span className={style['capacity-release-content-span']}>出</span>出港时段</div>
                                        {/*<TimePicker format={format} value={outTimeDefault} popupClassName={style['test']} placeholder={""} onChange={this.dptTime.bind(this)}/>*/}
                                        {/*time:禁选条件，“”未没有，如有：格式2018-06-01  showArrow:是否显示下拉箭头 defaultTime：草稿数据  outTimeEvent:组件返回获取的时间*/}
                                        <HourTimer time="" type={false} defaultTime={this.state.dptTime} outTimeEvent={(data) => this.outTimeEvent(data)} />
                                        <span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top:43}}>{dptTimeText}</span>
                                    </div>
                                    <div className={style['capacity-release-content-box']} style={{ width: 224, position: "relative" }}>
                                        <div className={style['capacity-release-content-filter-type']}><span className={style['capacity-release-content-span']}>进</span>进港时段</div>
                                        {/*<TimePicker format={format} value={inTimeDefault} popupClassName={style['test']} placeholder={""} onChange={this.arrvTime.bind(this)}/>*/}
                                        {/*<div className={style['timeComponent']}>*/}
                                        {/*<TimeComponent inTimeEvent={(data) => this.inTimeEvent(data)} intimeStyle={this.state.intimeType} defaultTime={this.state.arrvTime} time="05:15" />*/}
                                        {/*</div>*/}
                                        <HourTimer time={this.state.dptTime} type={this.state.dptTime ? false : true} defaultTime={this.state.arrvTime} inTimeEvent={(data) => this.inTimeEvent(data)} />
                                        <span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 43 }}>{arrvTimeText}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={style['point']}>
                                {
                                    this.state.stopType=="noStop"
                                        ?<CapacityPoint textType={'目标'} areaType={this.state.areaType} arrv={this.state.arrv} lockType={this.state.mandatoryDesignation} dpt={this.state.dpt} hintObj={this.state.hintText} lockEvent={(data)=>this.jiltFlyEvent(data)} dataObj={(data)=>this.jiltFlyData(data)}/>
                                        :<Fragment>
                                            <div>
                                                {/*显示文案类型:textType 目标 经停 甩飞*/}
                                                <CapacityPoint textType={'经停'}  pstAreaType={this.state.pstAreaType} pst={this.state.pst} lockType={this.state.pstMandatoryDesignation}  dpt={this.state.dpt} arrv={this.state.arrv} hintObj={this.state.hintText} lockEvent={(data)=>this.transitEvent(data)} dataObj={(data)=>this.transitData(data)}/>
                                            </div>
                                            <div>
                                                <CapacityPoint  textType={'甩飞'}  areaType={this.state.areaType} arrv={this.state.arrv} lockType={this.state.mandatoryDesignation} dpt={this.state.dpt} pst={this.state.pst} hintObj={this.state.hintText} lockEvent={(data)=>this.jiltFlyEvent(data)} dataObj={(data)=>this.jiltFlyData(data)}/>
                                            </div>
                                        </Fragment>
                                }

                            </div>
                        </div>
                        <div className={style['capacity-release-content-flex']} style={{ marginTop: 17 }}>
                            <div className={style['capacity-release-content-offer']}>
                                <div style={{ marginRight: 12, paddingTop: 11,paddingLeft:5 }}>报价</div>
                                <div style={{ position: "relative",backgroundColor:"#f6f6f6"}}>
                                    <div className={style['capacity-release-content-box']} style={{ backgroundColor: "#f6f6f6", display: 'flex', width: 200,padding:0,height:31,justifyContent:"flex-start" }}>
                                        <Checkbox onChange={this.offerMode.bind(this, "fixedSubsidyPrice")} onClick={this.setPriceClick.bind(this)} checked={this.state.fixedSubsidyPriceType}>
                                            定补
                                        </Checkbox>
                                        <input type="text" style={{backgroundColor:"#ffffff",width:92,margin:0,padding:0,textIndent:`4px`,height:23}} className={style['capacity-release-input']} maxLength={6} value={this.state.fixedSubsidyPrice} disabled={this.state.offerMode[0].type} ref={(el) => this.fixedSubsidyPrice = el} onChange={this.handleChangefixedSubsidyPrice} placeholder="" />
                                        <span  style={{ color: 'rgba(0,0,0,.65)',marginLeft:7 }}>万/班</span>
                                    </div>
                                    <div className={style['capacity-release-content-box']} style={{ backgroundColor: "#f6f6f6", display: 'flex', width: 200,padding:0,height:31,justifyContent:"flex-start"  }}>
                                        <Checkbox onChange={this.offerMode.bind(this, "bottomSubsidyPrice")} onClick={this.guaranteeClick.bind(this)} checked={this.state.bottomSubsidyPriceType}>
                                            保底
                                        </Checkbox>
                                        <input type="text" style={{backgroundColor:"#ffffff",width:92,margin:0,padding:0,textIndent:`4px`,height:23}} className={style['capacity-release-input']} maxLength={6} value={this.state.bottomSubsidyPrice} disabled={this.state.offerMode[1].type} ref={(el) => this.bottomSubsidyPrice = el} onChange={this.handleChangebottomSubsidyPrice} placeholder="" />
                                        {/*<span className={style['capacity-release-span']} style={{ color: 'rgba(0,0,0,.65)' }}>万/时</span>*/}
                                        <span style={{ color: 'rgba(0,0,0,.65)',marginLeft:7 }}>万/时</span>
                                    </div>
                                    <div style={{width:200,display:"flex",height:31}}>
                                        <Checkbox onChange={this.offerMode.bind(this, "other")} onClick={this.otherClick.bind(this)} checked={this.state.otherType}>待议</Checkbox>
                                    </div>
                                    <span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 65, right: 40,fontSize:12 }}>{offerText}</span>
                                    <span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 65, right: 40,fontSize:12 }}>{offerErrorText}</span>
                                </div>
                            </div>
                            <div>
                                <div className={style['capacity-release-content-date']} style={{ position: "relative" }}>
                                    拟开班期
                                    <Fragment >
                                        <DateChoose data={this.state.data} chooseDate={(data) => this.chooseDateEvent(data)} />
                                    </Fragment>
                                    <span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 21, left: 0 }}>{dataText}</span>
                                </div>
                                <div className={style['capacity-release-content-box']}>
                                    <div className={style['capacity-release-content-filter-type']}>
                                        运力有效期
                                        <IconInfo title={"请选择您在平台发布此运力投放的有效期，有效期之内您的运力信息都将在平台展示"}/>
                                    </div>
                                    <DatePicker
                                        value={this.state.periodValidity ? moment(this.state.periodValidity, "YYYY/MM/DD") : null}
                                        onChange={this.periodValidity}
                                        placeholder={""}
                                        format="YYYY-MM-DD"
                                        disabledDate={this.periodValidityDisabledDate}
                                        dropdownClassName={style['antd']}
                                        onOpenChange={this.openDatePicker.bind(this)}
                                        placeholder={"请选择运力有效期"}
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
                                    <span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 43 }}>{periodValidityText}</span>
                                </div>
                            </div>
                        </div>
                        <div className={style['capacity-release-content-flex']}>
                            <div className={style['capacity-release-content-cycle']}>
                                <SailingtimeComponent sailingtimeText={sailingtimeText} sailingtime={this.state.sailingtime} periodValidity={this.state.periodValidity} changeEvent={(data,date)=>this.changeEvent(data,date)}/>
                            </div>
                            <div className={style['capacity-release-content-box']}>
                                <div className={style['capacity-release-content-filter-type']}>计划执行班次</div>
                                <Input style={{ width: 110 }} className={style['capacity-release-input-hover']} value={this.state.performShift} onChange={this.performShift}></Input>
                                <span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 43 }}>{performShiftText}</span>
                            </div>
                        </div>
                        <div className={style['capacity-release-content-other']} style={{ position: "relative" }}>
                            <div style={{color:"#3c78ff"}}>其他说明</div>
                            <textarea style={{ width: 440, height: 65, border: 0, outline: "none", fontSize: 14, paddingTop: 3 }} value={this.state.remark} maxLength="80" onChange={this.other}></textarea>
                            <span className={style['row-border']} style={{ top: '22px' }}></span>
                            <span className={style['row-border']} style={{ top: '44px' }}></span>
                            <span className={style['row-border']} style={{ top: '66px' }}></span>
                            <span style={{ position: 'absolute', bottom: '0px', right: '10px' }}>{this.state.textNum}/80</span>
                        </div>
                        <div className={style['capacity-release-content-flex']} style={{marginTop:20}}>
                            <div className={style['capacity-release-content-box']}>
                                <div className={style['capacity-release-content-filter-type']}>联系人</div>
                                <Input className={style['capacity-release-input-hover']} maxLength={20} value={this.state.contact} onChange={this.contact}></Input>
                                <span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 43 }}>{contactText}</span>
                            </div>
                            <div className={style['capacity-release-content-box']} style={{ position: "relative" }}>
                                <div className={style['capacity-release-content-filter-type']}>移动电话</div>
                                <Input ref={(data) => this.iHomeInput = data} className={style['capacity-release-input-hover']} onBlur={this.iHome} maxLength="11" onChange={this.iHomeChange}></Input>
                                <span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 52 }}>{iHomeText}</span>
                                <span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 52 }}>{iHomeNoText}</span>
                            </div>
                        </div>
                        <div ref={(data)=>this.transition=data} className={this.state.fixed?style['capacity-release-content-button']:style['hidden']}>
                            <div className={style['ninth']}>
                                <div>
                                    <Checkbox className={style['check-box']} onChange={this.changeType.bind(this)} checked={this.state.demandtype==4}>
                                        全权委托平台帮我运营这个运力
                                        <IconInfo placement={"top"} title={"全权委托航遇平台来帮您投放此运力，专业，省心。"}/>
                                    </Checkbox>
                                    {/*<img src={require('../../static/img/12.jpg')} alt="省时、省钱、省心"/>*/}
                                </div>
                            </div>
                           <div style={{paddingLeft:63,paddingRight:63}}>
                               {
                                   this.state.bianjiAgain?'':
                                       <Btn text='保存草稿' btnType="0" otherText="保存中" isDisable={this.state.noMsg} styleJson={{ width: "100px",padding:0 }}
                                            onClick={function () {//防止连续点击
                                                       clearTimeout(timerD);
                                                       timerD = setTimeout(function () {
                                                           _this.saveDraft()
                                                       }, 300)
                                        }} />
                               }
                               <Btn text='确认发布运力信息' otherText="表单验证中" btnType="1" styleJson={{ width: "250px" ,padding:0}} onClick={function () {//防止连续点击
                                   clearTimeout(timerA);
                                   timerA = setTimeout(function () {
                                       _this.affirmSubmit()
                                   }, 300)
                               }} />
                               <Btn text='取消' btnType="0" styleJson={{ width: "100px", height: "32px",padding:0 }} onClick={this.cancel.bind(this)} />
                           </div>
                        </div>
                        {/*双重确认弹层*/}
                        <div className={doubleDiv} style={{ width: 1920, height: 947, backgroundColor: "rgba(185,185,185,0.4)", position: "fixed", left: 0, top: 0 }}>
                            <div style={{ width: 540, height: 290, backgroundColor: "#FFFFFF", position: "fixed", left: "39%", top: "31%" }}>
                                <div className={style['cancel-box']}>
                                    <span className={`iconfont ${style['close-icon']}`}
                                          onClick={this.closeDoubleDiv.bind(this)}>&#xe62c;</span>
                                    {/*<Button className={`iconfont ${style['divBtn']}`} onClick={this.closeDoubleDiv.bind(this)}>&#xe62c;</Button>*/}
                                </div>
                                <div className={style['cancel-content']}>
                                    <div style={{ marginBottom: 55 }}>
                                        <div style={{ marginBottom: 15, fontWeight: "bold" }}><span style={{maxWidth:450,textAlign:`center`}}>确认发布{this.state.titleText}{this.state.aircrfttyp}运力{this.state.demandtype == 1 ? "投放" : "委托"}</span></div>
                                        <div style={{ fontSize: 16, color: "#65637F" }}>发布后将不可修改，请确保内容无误</div>
                                    </div>
                                    <div className={style['cancel-btn']}>
                                        <Btn text='确认' btnType="1" otherText="发布中" styleJson={{ width: "192px", marginLeft: "110px", height: "32px",padding:0 }} onClick={()=>{//防止连续点击
                                            if(this.state.demandtype==4){
                                                clearTimeout(timerAD);
                                                timerAD = setTimeout(function () {
                                                    _this.affirmForm()
                                                }, 300)
                                            }else {
                                                _this.payShow()
                                            };
                                        }} />
                                        <Btn text='取消' btnType="2" styleJson={{ width: "90px", marginLeft: "20px",padding:0 }} onClick={this.closeDoubleDiv.bind(this)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*取消按钮弹出层，再次确认是否关闭模块*/}
                        <div className={cancelShow} style={{ width: 1920, height: 947, backgroundColor: "rgba(185,185,185,0.4)", position: "fixed", left: 0, top: 0 }}>
                            <div style={{ width: 540, height: 290, backgroundColor: "#FFFFFF", position: "fixed", left: "39%", top: "31%" }}>
                                <div className={style['cancel-box']}>
                                    <span className={`iconfont ${style['close-icon']}`}
                                          onClick={this.closeCancelDiv.bind(this)}>&#xe62c;</span>
                                    {/*<Button className={`iconfont ${style['divBtn']}`} onClick={this.closeCancelDiv.bind(this)}>&#xe62c;</Button>*/}
                                </div>
                                <div className={style['cancel-content']}>
                                    <div style={{ marginBottom: 55 }}>
                                        <div style={{ marginBottom: 15, fontWeight: "bold" }}><span>是否保存为草稿?</span></div>
                                        <div style={{ fontSize: 16, color: "#65637F" }}>存为草稿后，可在个人中心-草稿箱查看。</div>
                                    </div>
                                    <div className={style['cancel-btn']}>
                                        <Btn text='存为草稿' otherText="保存中" btnType="1" styleJson={{ width: "192px", marginLeft: "110px", height: "32px" }} onClick={function () {//防止连续点击
                                            clearTimeout(timerJ);
                                            timerJ = setTimeout(function () {
                                                _this.judgeDraft()
                                            }, 300)
                                        }} />
                                        <Btn text='取消' btnType="0" styleJson={{ width: "90px", marginLeft: "20px",padding:0,position:"relative",zIndex:100 }} onClick={this.closeFrom.bind(this)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${payStyle} ${style['payStyle']}`} style={{ width: 1920, height:"100%", backgroundColor: "rgba(185,185,185,0.4)", position: "fixed", left: 0, top: 0 }}>
                            {   this.state.payShow?<DealPwd close={this.dealCloseFn.bind(this)} forgetPwd={this.forgetPwd.bind(this)}/>:"" }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}