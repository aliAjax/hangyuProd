import React, { Component, Fragment } from 'react';
import Axios from "./../../../utils/axiosInterceptors";
import styles from '../../../static/css/from/airLineNeed.scss'
import AirportSearch from '../../../components/search/airportSearch'
import InternationalAirportSearch from '../../../components/search/internationalAirportSearch'
import AllAirportSearch from '../../../components/search/allAirportSearch'
import PayEarnestMoney from '../../../components/payEarnestMoney/payEarnestMoney'
import SaveOrNot from '../../../components/saveOrNot/saveOrNot'
import EditOrNot from '../../../components/saveOrNot/editOrNot'
import DeleteOrNot from '../../../components/saveOrNot/deleteOrNot'
import ApplyMeasuring from '../../../components/applyMeasuring/applyMeasuring'
import DateChoose from "../../../components/dateChoose/dateChoose";
import Btn from "../../../components/button/btn";
import { store } from '../../../store'
import emitter from "../../../utils/events";
import DimAir from "../../../components/dimAir/dimAirFzz";
import moment from 'moment';
import { Radio, Menu, Dropdown, Icon, DatePicker, Modal, Checkbox, Button } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import IconInfo from '../../../components/IconInfo/IconInfo';
import DealPwd from '../../../components/dealPwd/dealPwd';

const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

export default class AirLineNeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSmall: false,  // 8.06 新增，是否是1366分辨率
            saveDemand: {},  // 7.27增加，用来保存progress=12，demand
            showDealPwd: false,  // 7.27 增加，重新编辑-demandprogress=12，支付交易密码
            demandprogress: '',  // 7.23 增加，用来判断是否是“需求发布”时的“重新编辑”；若是，则不弹出缴纳意向金窗口
            update: true,
            noMsgFabu: false,  // 表单发布
            noMsgCesuan: false,  // 申请测算
            noMsgCaogao: false,  // 保存草稿按钮
            performShift: 0,  // 航班次数
            sailingtimeRadioValue: '整年',  // 判断计划执行周期单选按钮哪个选中
            hangjiDisabled: true,  // 计划执行周期，日期选择是否禁止选中
            demandtype: 0,  // 需求类型  0:航线需求、3:航线委托
            disableOrNot: false,  // 目标航点是否禁用
            savedData: {},  // 点击保存草稿后，保存数据用来对比数据是否发生变化
            saveDraftId: '',  // 保存草稿成功后返回的id
            myHeight: '', // 表单高度
            internationalAirline: 1,  // 国内航线：1，国际航线：2
            detailShow: false, // 详细内容是否显示
            showAirportSearch1: false,  // 目标航点下拉框是否显示
            searchText1: '',  // 目标航点输入框
            searchText1Bus: '',  // 目标航点输入框存储
            targetPoint: '',  // 目标航点三字码
            remark: '',  // 其他说明
            textNum: 0,  // 其他说明字数
            aircrfttyp: '',  // 机型
            airlineType: 2,  // 航司类型 0-全服务航空，1-低成本航空，2-都接受
            timeRequirements: 0,  // 时刻要求（0-白班，1-晚班，2-不限）
            sailingtime: '整年', // 计划执行周期
            sailingtimeValue: [],  // 计划执行周期的value
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
            btnText: '新增方案',  //projectIndex=-1：新增方案， 其余：编辑方案
            showPassInput: false,  // 经停是否显示
            designRadioValue: 1,  // 1:直飞，2：经停，3：甩飞
            daysWarnShow: false,  // 拟开班期警告是否显示
            date: [ //拟开航班默认数据
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
            // TODO: 填写方案
            myCode: '',  // 本机场三字码
            myName: '',  // 本机场名
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
            quoteType: '',  // 报价-方式 1-定补，2-保底
            quotedPrice: '',   // 报价-价格
            plans: [],  // 方案数据，始发：dptNm, 经停：pstNm，到达：arrvNm，报价：price{方式：type，价格：num}
            projectIndex: '-1',  // 用来确定是第几个方案（-1：默认“新增方案”）
            state: 0,  // 测算状态(0-正常，1-删除，2-测算中，3-测算完成)
            planId: '',  // 方案id

            // TODO:表单验证
            contact: '',  // 联系人
            contactWarnShow: false, // 联系人警告是否显示
            iHome: '',  // 联系方式
            iHomeWarnShow: false,  // 联系方式警告是否显示
            targetPointWarnShow: false,  // 目标航点警告
            targetPointWarn1Show: false, // 目标航点不能与本机场相同
            airlineWarnShow: false,  // 始发、经停、到达警告
            airline1WarnShow: false, // 为经停、甩飞时，必须全部填写警告
            quoteWarnShow: false,  // 报价警告
            aircrfttypWarnShow: false,  // 适航机型警告
            sailingtimeWarnShow: false,  // 计划执行周期警告
            periodValidityWarnShow: false,  // 需求有效期警告
            periodValidity2WarnShow: false,  // 需求有效期必须早于计划执行周期警告
            periodValidity3WarnShow: false,  // 需求有效期必须晚于当前时间
            saveProjectWarnShow: false,  // 新增方案警告
            // TODO：增加当保存草稿后，直接关闭，不弹框
            alertShow: false,  // 关闭 是否弹窗
        };
    }
    success(mes) {
        Modal.success({
            title: mes,
        });
    }
    error(mes) {
        Modal.error({
            title: mes,
        });
    }
    radioChangeFn(e) {  // value  0:国内航线，1:国际航线
        let target = e.target;
        this.setState({
            internationalAirline: target.value,
            searchText1: '',  // 目标航点输入框
            searchText1Bus: '',  // 目标航点输入框存储
            targetPoint: '',  // 目标航点三字码
            searchText2: '',  // 始发运力输入框文字
            searchText2Bus: '',  // 始发运力输入框存储
            dpt: '',  // 始发三字码
            searchText3: '',  // 经停输入框文字
            searchText3Bus: '',  // 经停输入框存储
            pst: '',  // 经停三字码
            searchText4: '',  // 到达输入框文字
            searchText4Bus: '',  // 到达输入框存储
            arrv: '',  // 到达三字码
            alertShow: true,
        })
    }
    designRadioChangeFn(e) {  // 1:直飞，2：经停，3：甩飞
        let value = e.target.value;
        let myCode = this.state.myCode; // 本机场三字码
        let myName = this.state.myName;
        let targetPoint = this.state.targetPoint;  // 目标航点三字码
        let searchText1Bus = this.state.searchText1Bus;  // 目标航点输入框存储
        let myRef = this.refs['myRef'];
        if (targetPoint == '') {
            this.setState({
                targetPointWarnShow: true
            });
            myRef.scrollTop = 0;
            return false
        } else {
            if (value == 1) {  // 选中了“直飞”没有“经停输入框”
                this.setState({
                    showPassInput: false,
                    searchText3: '',  // 经停输入框文字
                    searchText3Bus: '',  // 经停输入框存储
                    pst: '',  // 经停三字码
                    searchText2: myName,  // 始发
                    searchText2Bus: myName,
                    dpt: myCode,
                    searchText4: searchText1Bus,
                    searchText4Bus: searchText1Bus,
                    arrv: targetPoint,
                    designRadioValue: 1,
                })
            } else if (value == 2) {  // 经停
                this.setState({
                    showPassInput: true,
                    searchText3: myName,  // 经停输入框文字
                    searchText3Bus: myName,  // 经停输入框存储
                    pst: myCode,  // 经停三字码
                    searchText2: '',  // 始发
                    searchText2Bus: '',
                    dpt: '',
                    searchText4: '', // 到达
                    searchText4Bus: '',
                    arrv: '',
                    designRadioValue: 2,
                })
            } else if (value == 3) {  // 甩飞
                this.setState({
                    showPassInput: true,
                    searchText3: '',  // 经停输入框文字
                    searchText3Bus: '',  // 经停输入框存储
                    pst: '',  // 经停三字码
                    searchText2: '',  // 始发
                    searchText2Bus: '',
                    dpt: '',
                    searchText4: myName,  // 到达
                    searchText4Bus: myName,
                    arrv: myCode,
                    designRadioValue: 3,
                })
            }
        }
    }
    typeRadioChangeFn(e) {  // 航司类型 0-全服务航空，1-低成本航空，2-都接受
        this.setState({
            airlineType: e.target.value,
            alertShow: true,
        })
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
    menuClickFn({ key }) {  //1-定补，2-保底，0-待议
        this.setState({
            quoteType: key,
            quoteWarnShow: false,
            alertShow: true,
        });
    }
    // TODO：适航机型下拉列表 点击事件
    typeMenuClickFn({ key }) {
        this.setState({
            aircrfttyp: key,
            aircrfttypWarnShow: false,
            alertShow: true,
        });
    }
    inputTimeout() {  // 输入框延时
        this.setState({
            update: true,
        }, ()=>{
            setTimeout(()=>{
                this.setState({
                    update: false,
                })
            }, 200);
        });
    }
    // TODO: 目标航点对应的事件
    searchTextChangeFn1(e) {  //输入框输入内容改变
        let target = e.target;
        let val = target.value.replace(/(^\s*)|(\s*$)/g, "");  // 去除空格
        if (val == '') {
            this.setState({
                searchText1: target.value,
                searchText1Bus: '',
                showAirportSearch1: false,
            })
        } else {
            this.setState({
                showAirportSearch1: true,
                searchText1: target.value,
            })
        }
        this.inputTimeout();
    }
    inputClickFn1(e) {  // 输入框焦点事件
        let target = e.target;
        let val = target.value.replace(/(^\s*)|(\s*$)/g, "");  // 去除空格
        let showAirportSearch1 = false;
        if (val == '') {
            showAirportSearch1 = false;
        }else {
            showAirportSearch1 = true;
        }
        this.setState(() => {
            return {
                showAirportSearch1,
                showAirportSearch2: false,
                showAirportSearch3: false,
                showAirportSearch4: false,
                targetPointWarnShow: false,
                alertShow: true,
            }
        })
    }
    /*inputBlurFn1() {  //input失焦事件
        let that = this;
        setTimeout(() => {
            that.setState((prev) => {
                let searchText1 = prev.searchText1.replace(/(^\s*)|(\s*$)/g,"");  // 去除空格
                if(searchText1 == '' && prev.searchText1Bus == '') {  // 输入为空时，三字码为空，输入框显示的为空
                    return {
                        searchText1: '',
                        targetPoint: '',  // 目标航点三字码
                        showAirportSearch1: false,
                    }
                }else {
                    return {
                        searchText1: prev.searchText1Bus,
                        showAirportSearch1: false,
                    }
                }
            })
        }, 150)
    }*/
    airportData1(data) {  // 接受下拉框传来的数据
        let myCode = this.state.myCode; // 本机场三字码
        let myName = this.state.myName;
        if (myCode == data.code) {
            this.setState({
                targetPointWarn1Show: true
            })
        } else {
            this.setState({
                targetPointWarn1Show: false,
                searchText1: data.name,
                searchText1Bus: data.name,
                targetPoint: data.code,  // 目标航点三字码
                showAirportSearch1: false,
                detailShow: true,
                showPassInput: false,
                designRadioValue: 1,
                searchText3: '',  // 经停输入框文字
                searchText3Bus: '',  // 经停输入框存储
                pst: '',  // 经停三字码
                searchText2: myName,  // 始发
                searchText2Bus: myName,
                dpt: myCode,
                searchText4: data.name,
                searchText4Bus: data.name,
                arrv: data.code,
            });
        }
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
        }else {
            showAirportSearch2 = true;
        }
        this.setState(() => {
            return {
                showAirportSearch2,
                showAirportSearch1: false,
                showAirportSearch3: false,
                showAirportSearch4: false,
                airlineWarnShow: false,
                airline1WarnShow: false,
                alertShow: true,
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
                    showAirportSearch2: false
                }
            } else {
                return {
                    searchText2: data.name,
                    searchText2Bus: data.name,
                    dpt: data.code,  // 始发三字码
                    showAirportSearch2: false
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
                searchText3: '',
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
        }else {
            showAirportSearch3 = true;
        }
        this.setState(() => {
            return {
                showAirportSearch3,
                showAirportSearch1: false,
                showAirportSearch2: false,
                showAirportSearch4: false,
                airlineWarnShow: false,
                airline1WarnShow: false,
                alertShow: true,
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
                    showAirportSearch3: false
                }
            } else {
                return {
                    searchText3: data.name,
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
                searchText4: target.value,
                searchText4Bus: '',
                arrv: '',
                showAirportSearch4: false,
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
        let target = e.target;
        let val = target.value.replace(/(^\s*)|(\s*$)/g, "");  // 去除空格
        let showAirportSearch4 = false;
        if (val == '') {
            showAirportSearch4 = false;
        }else {
            showAirportSearch4 = true;
        }
        this.setState(() => {
            return {
                showAirportSearch4,
                showAirportSearch1: false,
                showAirportSearch2: false,
                showAirportSearch3: false,
                airlineWarnShow: false,
                airline1WarnShow: false,
                alertShow: true,
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
                    showAirportSearch4: false
                }
            } else {
                return {
                    searchText4: data.name,
                    searchText4Bus: data.name,
                    arrv: data.code,
                    showAirportSearch4: false
                }
            }
        })
    }

    priceChangeFn(e) {  // 报价-价格改变事件
        let target = e.target;
        let val = target.value.replace(/[^\d\.]/g, '');  // 只允许输入数字和浮点数
        this.setState({
            quotedPrice: val,
            quoteWarnShow: false,
            alertShow: true,
        })
    }

    // TODO: 拟开班期 ，向DateChoose组件传递方法
    chooseDateEvent(data) {
        let newData = data;
        this.setState({
            date: newData,
            daysWarnShow: false,
            alertShow: true,
        }, ()=>{
            this.setChangeEvent();
        })
    }

    dimEvent(data) {
        this.setState({
            aircrfttyp: data,
            aircrfttypWarnShow: false,
        })
    }

    // TODO:新增需求：当方案不为空时，禁用目标航点，方案为空时，可以选择目标航点
    disableOrNotFn() {
        if (this.state.plans == null || this.state.plans.length == 0) {
            this.setState({
                disableOrNot: false,
            })
        } else {
            this.setState({
                disableOrNot: true,
            })
        }
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
        obj.quoteType = this.state.quoteType;  // quoteType,1-定补，2-保底, 0-待议
        if (obj.quoteType == 0) {
            obj.quotedPrice = '';
        }else {
            obj.quotedPrice = this.state.quotedPrice;
        }
        obj.state = this.state.state;  // 测算状态(0-正常，1-删除，2-测算中，3-测算完成)
        obj.click = 0;  // 申请测算是否点击 0：未点击， 1：点击
        obj.areaType = 1;  //目标区域或者航点 1航点 2省份 3区域
        let index = Number(this.state.projectIndex);
        let myCompany = store.getState().role.airlineretrievalcondition; // 本机场三字码
        let targetPoint = this.state.targetPoint;  // 目标航点三字码
        let dpt = this.state.dpt;  // 始发航点三字码
        let pst = this.state.pst;  // 经停航点三字码
        let arrv = this.state.arrv;  // 到达航点三字码
        let myRef = this.refs['myRef'];
        this.setState({
            saveProjectWarnShow: false,
        });
        if (targetPoint == '') {
            this.setState({
                targetPointWarnShow: true
            });
            myRef.scrollTop = 0;
            return false;
        } else if ((myCompany != dpt && myCompany != pst && myCompany != arrv)
            || (targetPoint != dpt && targetPoint != pst && targetPoint != arrv)) {
            this.setState({
                airlineWarnShow: true
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
        }else if (obj.quoteType != 0 && (obj.quotedPrice == '' || obj.quotedPrice == 0)) {
            this.setState({
                quoteWarnShow: true
            });
            return false
        } else {
            if (index === -1) {  // “新增方案”
                if (this.state.plans != null && this.state.plans.length < 3) {
                    this.state.plans.push(obj);
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
                            plans: prev.plans,
                            // projectIndex: index,  // 用来确定是第几个方案
                            plans: prev.plans,
                            alertShow: true,
                            airlineWarnShow: false,
                            airline1WarnShow: false,
                            quoteWarnShow: false,
                        }
                    }, () => {
                        this.disableOrNotFn();
                    })
                } else {
                    this.error('最多保存三条数据！');
                }

            } else {  // “编辑方案”
                obj.id = this.state.planId;
                this.state.plans.splice(index, 1, obj);
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
                        plans: prev.plans,
                        btnText: '新增方案',
                        alertShow: true,
                        airlineWarnShow: false,
                        airline1WarnShow: false,
                        quoteWarnShow: false,
                    }
                })
            }
        }
    }
    editProjectClickFn(item, index) {  // TODO: 点击“编辑”
        let state = Number(item.state);
        if (state !== 0) {  //state（0-正常，1-删除，2-测算中，3-测算完成）
            let obj = {};
            obj.item = item;
            obj.index = index;
            this.setState({
                editProjectObj: obj,  // 向“是否编辑”组件传递的数据
                showEditOrNot: true,
            })
        } else {
            this.editProject(item, index);
        }
    }
    editProject(item, index) {  // 编辑方案
        /*if(item.id) {
            delete this.state.plans[index].id
        }*/
        this.refs.myRef.scrollTop = 0;
        this.state.plans[index].state = 0;  // 测算状态(0-正常，1-删除，2-测算中，3-测算完成)
        if (item.pst) {
            if (item.pst == this.state.targetPoint) {
                this.state.designRadioValue = 3;
            } else {
                this.state.designRadioValue = 2;
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
                planId: item.id ? item.id : null,
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
                plans: prev.plans,
                btnText: '编辑方案',
                alertShow: true,
            }
        });
    }
    deleteProjectClickFn(item, index) {
        let state = Number(item.state);
        if (state !== 0) {  //state（0-正常，1-删除，2-测算中，3-测算完成）
            this.setState({
                deleteOrNotIndex: index,
                showDeleteOrNot: true
            })
        } else {
            this.deleteProject(index);
        }
    }
    deleteOrNotSaveFn(index) {  // 点击“删除方案”组件-确认删除按钮
        this.deleteProject(index);
        this.setState({
            showDeleteOrNot: false
        })
    }
    deleteOrNotCancelFn() {  // 点击“删除方案”组件-取消按钮
        this.setState({
            showDeleteOrNot: false
        })
    }
    deleteProject(index) {  // 点击“删除”
        let projectIndex = this.state.projectIndex;
        if(index == this.state.projectIndex) {
            projectIndex = -1;
        }
        this.state.plans.splice(index, 1);
        this.setState((prev) => {
            return {
                plans: prev.plans,
                alertShow: true,
                projectIndex: projectIndex,
            }
        }, () => {
            this.disableOrNotFn();
        })
    }
    hangjiRadioOnChange(e) {  // 航季单选按钮更改
        let value = e.target.value;
        if(value == '自定义') {
            this.state.hangjiDisabled = false;
            this.state.sailingtimeValue = null;
            this.state.sailingtime = '';
            this.state.sailingtimeRadioValue = '自定义';
        }else {
            this.state.hangjiDisabled = true;
            this.state.sailingtimeValue = null;
            this.state.sailingtime = value;
            this.state.sailingtimeRadioValue = value;
            this.changeEvent(value);
        }
        this.setState((prev)=>{
            return ({
                hangjiDisabled: prev.hangjiDisabled,
                sailingtimeValue: prev.sailingtimeValue,
                sailingtime: prev.sailingtime,
                sailingtimeWarnShow: false,
            })
        });
    }
    sailingtimeOpenFn(sailingtimeValue, status) {  //  计划执行周期打开
        if(status) {
            if(!sailingtimeValue) {
                let a, b;
                if(this.state.periodValidity) {
                    a = moment(this.state.periodValidity).add(1, 'd').format(dateFormat);
                    b = moment(a).add(1, 'y').format(dateFormat);
                }else {
                    a = moment(moment().add(1, 'd').add(1, 'M')).format(dateFormat);
                    b = moment(a).add(1, 'y').format(dateFormat);
                }
                this.setState({
                    sailingtimeValue: [a, b],
                    sailingtime: `${a},${b}`,
                    sailingtimeWarnShow: false,
                });
            }
        }
    }
    onCalendarChange(dates, dateStrings) {
        if (dates.length == 1) {
            let a = moment(dates[0]).format(dateFormat);
            let b = moment(dates[0]).add(1, 'y').format(dateFormat);
            this.setState({
                sailingtimeValue: [a, b],
            });
        }
    }
    sailingtimeChangeFn(dates, dateStrings) {  // 计划执行周期-日历点击事件
        this.setState({
            sailingtime: dateStrings.join(','),
            sailingtimeWarnShow: false,
            periodValidity2WarnShow: false,
            periodValidity3WarnShow: false,
            sailingtimeValue: dateStrings,
            alertShow: true,
        }, ()=>{
            this.changeEvent(this.state.sailingtime);
        })
    }
    dateDisabledDate(current) {  // 需求有效期的禁止选择时间
        // Can not select days before today and today
        if (this.state.sailingtimeValue != null && this.state.sailingtimeValue.length != 0) {
            return current && (current < moment().subtract(1, 'd').add(1, "M") || current > moment(this.state.sailingtimeValue[0]).subtract(1, 'd'));
        } else {
            return current && current < moment().subtract(1, 'd').add(1, "M")
        }
    }
    disabledDate(current) {  // 计划执行周期的禁止选择时间
        // Can not select days before today and today
        if (this.state.periodValidity != '' && this.state.periodValidity != null) {
            return current && current < moment(this.state.periodValidity).add(1, 'd');
        } else {
            return current && current < moment().subtract(1, 'd').add(1, "M")
        }
    }
    periodValidityChangeFn(dates, dateString) {  // 需求有效期
        this.setState({
            periodValidity: dateString,
            periodValidityWarnShow: false,
            periodValidity2WarnShow: false,
            periodValidity3WarnShow: false,
            alertShow: true,
        })
    }
    periodValidityOpenFn(periodValidity, status) {  // 需求有效期打开
        if(status) {
            if(!periodValidity) {
                this.setState({
                    periodValidity: moment().add(1, 'M').format(dateFormat),
                    periodValidityWarnShow: false,
                })
            }
        }
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
    iHomeChangeFn(e) {  // 联系方式input事件
        let target = e.target;
        let val = target.value.replace(/\D/g, '');
        this.setState({
            iHome: val,
            iHomeWarnShow: false,
            alertShow: true,
        })
    }
    iHomeBlurFn(e) {  // 联系方式失焦事件
        let target = e.target;
        let val = target.value.replace(/(^\s*)|(\s*$)/g, "");
        if (!(/^1[3|4|5|8][0-9]\d{8}$/.test(val)) && (val != '')) {
            this.setState({
                iHomeWarnShow: true
            })
        }
    }

    closeFn() {  // 点击“取消”
        if (this.state.alertShow && this.props.data.demandprogress != '12') {  // 需求发布-重新编辑
            this.setState({
                showSaveOrNotSave: true,
            });
        } else {
            this.closeFormBox();
        }
    }
    setChangeEvent() {
        let value = this.state.sailingtime;
        if(value == '整年' || value == '冬春航季' || value == '夏秋航季') {
            this.changeEvent(value);
        }else {
            this.changeEvent(this.state.sailingtime);
        }
    }
    // 计划执行时间
    changeEvent(data,date){
        let performShift = 0;
        switch (data){
            case "整年":
                performShift=this.calculateFixation(365);
                break;
            case "冬春航季":
                performShift=this.calculateFixation(153);
                break;
            case "夏秋航季":
                performShift=this.calculateFixation(216);
                break;
            default:
                performShift=this.calculateUnset(data);
                break;
        };
        this.setState({
            performShift
        })
    }

    //固定计划执行班次计算方法
    calculateFixation(num){
        let performShift;
        let data = this.state.date;
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
    }

    //不固定时间计划执行班次计算方法
    calculateUnset(dateString){
        // if (!this.state.userPerformShift) {//用户输入优先
        let performShift = 0;
        if (dateString) {//自动计算优先
            //计算执行班次
            let data = this.state.date;
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
    entrustFn(e) {  //全权委托平台
        if(e.target.checked) {
            this.state.demandtype = 3;
        }else {
            this.state.demandtype = 0;
        }
        this.setState((prev)=>{
            return ({
                demandtype: prev.demandtype,
            })
        })
    }
    save() {  // 提交的数据
        // let performShift = this.countDateEvent();
        let days = [];
        this.state.date.forEach((val) => {
            if (val.type) {
                days.push(val.name)
            }
        });
        let plans = this.state.plans;
        plans.forEach((val, index) => {
            if (val.dpt == '' && val.pst == '' && val.arrv == '' && val.quoteType == '' && val.quotedPrice == '') {
                plans.splice(index, 1);
            }
        });
        this.setState({
            plans: plans
        });
        let demand = {};
        demand.internationalAirline = this.state.internationalAirline;  // 国内航线、国际航线
        demand.aircrfttyp = this.state.aircrfttyp;  // 机型
        demand.airlineType = this.state.airlineType;  // 航司类型
        demand.demandtype = this.state.demandtype;  // 0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托
        demand.timeRequirements = this.state.timeRequirements;  // 时刻要求（0-白班，1-晚班，2-不限）
        demand.days = days.join('/');  // 拟开班期
        demand.sailingtime = this.state.sailingtime;  // 计划执行周期
        demand.targetPoint = this.state.targetPoint;  // 目标航点三字码
        demand.periodValidity = this.state.periodValidity;  // 需求有效期
        demand.contact = this.state.contact;  // 联系人
        demand.iHome = this.state.iHome;   // 联系方式
        demand.remark = this.state.remark;  // 其他说明
        demand.plans = JSON.stringify(plans);   // 保存方案 plans：JSON字符串
        demand.performShift = this.state.performShift;  // 拟开航班数量
        return demand;
    }
    planEmptyFn() {
        this.setState({
            searchText2: '',  // 始发运力输入框
            searchText3: '',  // 经停输入框
            searchText4: '',  // 到达输入框
            dpt: '',  // 始发三字码
            pst: '',  // 经停三字码
            arrv: '',  // 到达三字码
            quoteType: '',  // 报价-方式
            quotedPrice: '',   // 报价-价格
            projectIndex: -1,  // 默认“新增方案”
            btnText: '新增方案',
            alertShow: true,
            designRadioValue: 1,
        })
    }
    saveSendDataFn(type, index) {   //TODO： type: 1 保存草稿， type: 2 发布运力信息, type: 3 申请测算-保存草稿, type: 4 保存-是否保存为草稿组件
        let demand = this.save();
        let targetPoint = this.state.targetPoint;  // 目标航点三字码
        let contact = this.state.contact; // 联系人
        let iHome = this.state.iHome;  // 联系方式
        let iHomeWarnShow = this.state.iHomeWarnShow;  // 联系方式警告
        let sailingtime = this.state.sailingtime; // 计划执行周期
        let periodValidity = this.state.periodValidity; // 需求有效期
        let plans = this.state.plans;  // 方案
        let aircrfttyp = this.state.aircrfttyp;  // 适航机型
        let myRef = this.refs['myRef'];
        /*if ((sailingtime != null && sailingtime != '整年' && sailingtime != '冬春航季' && sailingtime != '夏秋航季') && sailingtime.length != 0 && periodValidity != null && periodValidity != '') {
        let s = moment(sailingtime.split(',')[0]);  // 计划执行周期的初始时间
        let p = moment(periodValidity);   // 需求有效期
        // let n = moment().endOf('day').format(dateFormat);  // 当前时间
        let n = moment().subtract(1, 'd').add(1, "M");  // 当前时间后延一个月
        if (moment.min(s, p) == s) {
            this.setState({
                periodValidity2WarnShow: true
            });
            return false;
        }
        if (moment.min(n, p) == p) {
            this.setState({
                periodValidity3WarnShow: true
            });
            return false;
        }
    }*/
        if (targetPoint == '') {
            this.setState({
                targetPointWarnShow: true
            });
            myRef.scrollTop = 0;
            return false;
        } /*else if (plans.length == 0) {
        this.setState({
            saveProjectWarnShow: true,
        });
        myRef.scrollTop = 0;
        return false
    }*//* else if (demand.days == '') {
            this.setState({
                daysWarnShow: true,
            });
            myRef.scrollTop = 200;
            return false
        }*/ else if (contact == null || contact == '') {
            this.setState({
                contactWarnShow: true
            });
            myRef.scrollTop = 320;
            return false
        } else if (iHomeWarnShow || iHome == '' || iHome == null) {
            this.setState({
                iHomeWarnShow: true
            });
            myRef.scrollTop = 320;
            return false
        } /*else if (aircrfttyp == null || aircrfttyp == '') {
        this.setState({
            aircrfttypWarnShow: true
        });
        return false
    }else if (periodValidity == null || periodValidity == '') {
        this.setState({
            periodValidityWarnShow: true
        });
        return false
    } else if (sailingtime == null) {
        this.setState({
            sailingtimeWarnShow: true
        });
        return false
    }*/
        else {
            if(this.props.data.demandprogress == '-1') {
                demand.demandprogress = -1;
            }else {
                demand.demandprogress = 11;
            }
            this.setState({
                noMsgCaogao: true
            }, ()=>{
                if (this.state.saveDraftId != '' && this.state.saveDraftId != null) {
                    demand.id = this.state.saveDraftId;
                    try{
                        demand.releasetime = this.props.data.releasetime;
                    }catch (e) {

                    }
                    Axios({
                        method: 'post',
                        url: '/demandUpdate',
                        /*params:{  // 一起发送的URL参数
                            page:1
                        },*/
                        data: JSON.stringify(demand),
                        dataType: 'json',
                        headers: {
                            'Content-type': 'application/json;charset=utf-8'
                        }
                    }).then((response) => {
                        if (type == 1) { // type: 1 保存草稿，type: 3 申请测算-保存草稿, type: 4 保存-保存为草稿组件
                            if (response.data.opResult === '0') {
                                this.success('保存草稿成功，请进入个人中心-草稿箱查看');
                                this.planEmptyFn();
                                this.setState({
                                    alertShow: false,
                                })
                                this.closeFormBox();
                                emitter.emit('renewCaogaoxiang');
                            } else {
                                this.error('保存草稿失败！');
                                this.setState({
                                    noMsgCaogao: false
                                })
                            }
                        }
                        if (type == 4) {
                            if (response.data.opResult === '0') {
                                if(this.props.data.demandprogress == '-1') {
                                    this.success('保存成功，可在下次点击查看！');
                                }else {
                                    this.success('保存草稿成功，请进入个人中心-草稿箱查看！');
                                }
                                this.closeFormBox();
                                emitter.emit('renewCaogaoxiang');
                            } else {
                                if(this.props.data.demandprogress == '-1') {
                                    this.error('保存失败！');
                                }else {
                                    this.error('保存草稿失败！');
                                }
                                this.setState({
                                    noMsgCaogao: false
                                })
                            }
                        }
                    })
                } else {
                    Axios({
                        method: 'post',
                        url: '/demandAdd',
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
                                this.success('保存草稿成功，请进入个人中心-草稿箱查看');
                                this.planEmptyFn();
                                this.setState({
                                    alertShow: false,
                                })
                                this.closeFormBox();
                                emitter.emit('renewCaogaoxiang');
                            } else {
                                this.error('保存草稿失败！');
                                this.setState({
                                    noMsgCaogao: false
                                })
                            }
                        }
                        if (type == 4) {
                            if (response.data.opResult === '0') {
                                if(this.props.data.demandprogress == '-1') {
                                    this.success('保存成功，可在下次点击查看！');
                                }else {
                                    this.success('保存草稿成功，请进入个人中心-草稿箱查看！');
                                }
                                this.setState({
                                    saveDraftId: response.data.demandId,
                                });
                                this.closeFormBox();
                                emitter.emit('renewCaogaoxiang');
                            } else {
                                if(this.props.data.demandprogress == '-1') {
                                    this.error('保存失败！');
                                }else {
                                    this.error('保存草稿失败！');
                                }
                                this.setState({
                                    noMsgCaogao: false
                                })
                            }
                        }
                    })
                }
            })
        }
    }
    sendDataFn() {   //TODO： type: 2 发布运力信息,
        let demand = this.save();
        let targetPoint = this.state.targetPoint;  // 目标航点三字码
        let contact = this.state.contact; // 联系人
        let iHome = this.state.iHome;  // 联系方式
        let iHomeWarnShow = this.state.iHomeWarnShow;  // 联系方式警告
        let sailingtime = this.state.sailingtime; // 计划执行周期
        let periodValidity = this.state.periodValidity; // 需求有效期
        let plans = this.state.plans;  // 方案
        // return false;
        let aircrfttyp = this.state.aircrfttyp;  // 适航机型
        let myRef = this.refs['myRef'];
        if ((sailingtime != null && sailingtime != '整年' && sailingtime != '冬春航季' && sailingtime != '夏秋航季') && sailingtime.length != 0 && periodValidity != null && periodValidity != '') {
            let s = moment(sailingtime.split(',')[0]);  // 计划执行周期的初始时间
            let p = moment(periodValidity);   // 需求有效期
            // let n = moment().endOf('day').format(dateFormat);  // 当前时间
            let n = moment().subtract(1, 'd').add(1, "M");  // 当前时间后延一个月
            if (moment.min(s, p) == s) {
                this.setState({
                    periodValidity2WarnShow: true
                });
                myRef.scrollTop = 400;
                return false;
            }
            if (moment.min(n, p) == p) {
                this.setState({
                    periodValidity3WarnShow: true
                });
                myRef.scrollTop = 400;
                return false;
            }
        }else if((sailingtime == '整年' || sailingtime == '冬春航季' || sailingtime == '夏秋航季') && periodValidity != null && periodValidity != '') {
            let p = moment(periodValidity);   // 需求有效期
            // let n = moment().endOf('day').format(dateFormat);  // 当前时间
            let n = moment().subtract(1, 'd').add(1, "M");  // 当前时间后延一个月
            if (moment.min(n, p) == p) {
                this.setState({
                    periodValidity3WarnShow: true
                });
                myRef.scrollTop = 400;
                return false;
            }
        }
        if (targetPoint == '') {
            this.setState({
                targetPointWarnShow: true
            });
            myRef.scrollTop = 0;
            return false;
        } else if (plans.length == 0) {
            this.setState({
                saveProjectWarnShow: true,
            });
            myRef.scrollTop = 0;
            return false
        } else if (demand.days == '') {
            this.setState({
                daysWarnShow: true,
            });
            myRef.scrollTop = 400;
            return false
        } else if (contact == '' || contact == null) {
            this.setState({
                contactWarnShow: true
            });
            myRef.scrollTop = this.state.myHeight;
            return false
        } else if (iHomeWarnShow || iHome == '' || iHome == null) {
            this.setState({
                iHomeWarnShow: true
            });
            myRef.scrollTop = this.state.myHeight;
            return false
        } else if (aircrfttyp == '' || aircrfttyp == null) {
            this.setState({
                aircrfttypWarnShow: true
            });
            myRef.scrollTop = 400;
            return false
        } else if (periodValidity == '' || periodValidity == null) {
            this.setState({
                periodValidityWarnShow: true
            });
            myRef.scrollTop = 400;
            return false
        }else if (sailingtime == '') {
            this.setState({
                sailingtimeWarnShow: true
            });
            myRef.scrollTop = 400;
            return false
        }
        else {
            if(this.state.demandprogress == 12) {
                if(this.state.demandtype == 3) {
                    demand.demandprogress = '';   // 委托
                }else {
                    demand.demandprogress = 12;  // 航线需求发布
                }
                this.setState({   // 7.27 新增，demandprogress=12时，弹出支付密码
                    showDealPwd: true,
                    saveDemand: demand,  // 7.27 新增
                });
            }else {
                demand.demandprogress = '';  // 航线需求发布
                this.sendChange(demand);
            }
        }
    }
    sendChange(demand) {   // 7.27 根据需求更改，重新编辑时，只弹支付密码
        this.setState({
            noMsgFabu: true
        }, ()=>{
            if (this.state.saveDraftId != '' && this.state.saveDraftId != null) {
                demand.id = this.state.saveDraftId;
                try{
                    demand.releasetime = this.props.data.releasetime;
                }catch (e) {

                }
                Axios({
                    method: 'post',
                    url: '/demandUpdate',
                    /*params:{  // 一起发送的URL参数
                        page:1
                    },*/
                    data: JSON.stringify(demand),
                    dataType: 'json',
                    headers: {
                        'Content-type': 'application/json;charset=utf-8'
                    }
                }).then((response) => {
                    if (response.data.opResult === '0') {
                        let demandtype = Number(this.state.demandtype);
                        let demandprogress = this.state.demandprogress;
                        if (demandtype === 0 && demandprogress != 12) { //0: 航线需求  3: 委托航线
                            this.setState({
                                showPayEarnestMoney: true,
                                payData: response.data
                            });
                        } else {
                            if(demandprogress == 11) {
                                this.success('发布成功！');
                            }else {
                                this.success('更改成功！');
                            }
                            this.closeFormBox();
                        }
                        emitter.emit("againMap");
                        emitter.emit('renewCaogaoxiang');
                        emitter.emit('renewWodefabu');
                    } else {
                        this.error('发布失败！');
                        this.setState({
                            noMsgFabu: false
                        })
                    }
                })
            } else {
                Axios({
                    method: 'post',
                    url: '/demandAdd',
                    /*params:{  // 一起发送的URL参数
                        page:1
                    },*/
                    data: JSON.stringify(demand),
                    dataType: 'json',
                    headers: {
                        'Content-type': 'application/json;charset=utf-8'
                    }
                }).then((response) => {
                    if (response.data.opResult === '0') {
                        let demandtype = Number(this.state.demandtype);
                        if (demandtype === 0) { //0: 航线需求  3: 委托航线
                            this.setState({
                                showPayEarnestMoney: true,
                                payData: response.data
                            });
                        } else {
                            this.success('发布成功！');
                            this.closeFormBox();
                        }
                        emitter.emit('renewCaogaoxiang');
                    } else {
                        this.error('发布失败！');
                        this.setState({
                            noMsgFabu: false
                        })
                    }
                })
            }
        });
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
            });
            this.closeFormBox();
        }
        emitter.emit('renewWodefabu');
    }
    renewData(data) {
        this.setData(data, 'shenqingcesuan');
    }
    closeMeasuringFn(i, index) {  // 关闭申请测算  1:成功  2：失败
        if (i == 1) {
            this.setState({
                showApplyMeasuring: false
            })
        } else {
            this.state.plans[index].click = 0;  // 申请测算是否点击 0：未点击， 1：点击
            this.setState({
                showApplyMeasuring: false,
            })
        }
    }
    measuringClickFn(item, index) {  // 点击“申请测算”
        this.state.plans[index].click = 1;  // 申请测算是否点击 0：未点击， 1：点击
        let demand = this.save();
        let targetPoint = this.state.targetPoint;  // 目标航点三字码
        let contact = this.state.contact; // 联系人
        let iHome = this.state.iHome;  // 联系方式
        let iHomeWarnShow = this.state.iHomeWarnShow;  // 联系方式警告
        let sailingtime = this.state.sailingtime; // 计划执行周期
        let periodValidity = this.state.periodValidity; // 需求有效期
        let plans = this.state.plans;  // 方案
        let aircrfttyp = this.state.aircrfttyp;  // 适航机型
        let myRef = this.refs['myRef'];
        if ((sailingtime != null && sailingtime != '整年' && sailingtime != '冬春航季' && sailingtime != '夏秋航季') && sailingtime.length != 0 && periodValidity != null && periodValidity != '') {
            let s = moment(sailingtime.split(',')[0]);  // 计划执行周期的初始时间
            let p = moment(periodValidity);   // 需求有效期
            // let n = moment().endOf('day').format(dateFormat);  // 当前时间
            let n = moment().subtract(1, 'd').add(1, "M");  // 当前时间后延一个月
            if (moment.min(s, p) == s) {
                this.setState({
                    periodValidity2WarnShow: true
                });
                return false;
            }
            if (moment.min(n, p) == p) {
                this.setState({
                    periodValidity3WarnShow: true
                });
                return false;
            }
        }
        if (targetPoint == '') {
            this.setState({
                targetPointWarnShow: true
            });
            myRef.scrollTop = 0;
            return false;
        } else if (plans.length == 0) {
            this.setState({
                saveProjectWarnShow: true,
            });
            myRef.scrollTop = 0;
            return false
        } else if (demand.days == '') {
            this.setState({
                daysWarnShow: true,
            });
            myRef.scrollTop = 400;
            return false
        } else if (contact == null || contact == '') {
            this.setState({
                contactWarnShow: true
            });
            myRef.scrollTop = this.state.myHeight;
            return false
        } else if (iHomeWarnShow || iHome == '' || iHome == null) {
            this.setState({
                iHomeWarnShow: true
            });
            myRef.scrollTop = this.state.myHeight;
            return false
        } else if (aircrfttyp == null || aircrfttyp == '') {
            this.setState({
                aircrfttypWarnShow: true
            });
            myRef.scrollTop = 400;
            return false
        }else if (periodValidity == null || periodValidity == '') {
            this.setState({
                periodValidityWarnShow: true
            });
            myRef.scrollTop = 400;
            return false
        } else if (sailingtime == null) {
            this.setState({
                sailingtimeWarnShow: true
            });
            myRef.scrollTop = 400;
            return false
        }
        else {
            if(this.props.data.demandprogress == '-1') {
                demand.demandprogress = -1;
            }else {
                demand.demandprogress = 11;
            }
            this.setState({
                noMsgCesuan: true,
                alertShow: true,
            }, ()=>{
                let projectIndex = this.state.projectIndex;
                if (this.state.saveDraftId != '' && this.state.saveDraftId != null) {
                    demand.id = this.state.saveDraftId;
                    try{
                        demand.releasetime = this.props.data.releasetime;
                    }catch (e) {

                    }
                    Axios({
                        method: 'post',
                        url: '/demandUpdate',
                        /*params:{  // 一起发送的URL参数
                            page:1
                        },*/
                        data: JSON.stringify(demand),
                        dataType: 'json',
                        headers: {
                            'Content-type': 'application/json;charset=utf-8'
                        }
                    }).then((response) => { // type: 1 保存草稿，type: 3 申请测算-保存草稿, type: 4 保存-保存为草稿组件
                        if (response.data.opResult === '0') {
                            if(index == this.state.projectIndex) {
                                projectIndex = -1;
                            }
                            let data = response.data;
                            data.demandId = this.state.saveDraftId;
                            data.cesuanIndex = index;
                            this.setState({
                                showApplyMeasuring: true,
                                applyMeasuringData: data,
                                noMsgCesuan: false,
                                projectIndex,
                            })
                        } else {
                            this.state.plans[index].click = 0;  // 申请测算是否点击 0：未点击， 1：点击
                            this.error('申请测算失败！');
                            this.setState({
                                noMsgCesuan: false,
                                projectIndex,
                            });
                        }
                    })
                } else {
                    Axios({
                        method: 'post',
                        url: '/demandAdd',
                        /*params:{  // 一起发送的URL参数
                            page:1
                        },*/
                        data: JSON.stringify(demand),
                        dataType: 'json',
                        headers: {
                            'Content-type': 'application/json;charset=utf-8'
                        }
                    }).then((response) => {
                        if (response.data.opResult === '0') {
                            let data = response.data;
                            data.demandId = response.data.demandId;
                            data.cesuanIndex = index;
                            if(index == this.state.projectIndex) {
                                projectIndex = -1;
                            }
                            this.setState({
                                applyMeasuringData: data,
                                showApplyMeasuring: true,
                                saveDraftId: data.demandId,
                                noMsgCesuan: false,
                                projectIndex,
                            })
                        } else {
                            this.state.plans[index].click = 0;  // 申请测算是否点击 0：未点击， 1：点击
                            this.error('申请测算失败！');
                            this.setState({
                                noMsgCesuan: false,
                                projectIndex,
                            });
                        }
                    })
                }
            });
        }
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
        let obj = {};
        obj.openFrom = false;
        obj.fromType = '';
        obj.fromMe = '';
        emitter.emit('openFrom', obj);
    }
    closeIconClickFn() {
        if (this.state.targetPoint == '') {
            this.closeFormBox();
        } else {
            this.closeFn();
        }
    }

    quoteTypeFn(quoteType) {
        if (quoteType === '') {
            return ''
        } else if (quoteType == '1') {
            return '定补'
        } else if (quoteType == '2') {
            return '保底'
        } else if (quoteType == '0') {
            return '待议'
        }
    }
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
    sailingtimeFn(sailingtime) {
        switch(sailingtime) {
            case '整年':
                return "整年";
                break;
            case '冬春航季':
                return "冬春航季";
                break;
            case '夏秋航季':
                return "夏秋航季";
                break;
            default :
                return "自定义";
                break;
        }
    }
    setData(data, shenqingcesuan) {
        try{
            if (Object.keys(data).length != 0) {
                let targetPoint = data.targetPoint;  // 目标航点三字码
                let searchText1, // 目标航点输入框
                    textNum = 0;   // 其他说明字数
                let demandtype = Number(data.demandtype);
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
                    })
                    for (let day of days) {
                        date.forEach((val, index) => {
                            if (day == val.name) {
                                date[index].type = true;
                            }
                        })
                    }
                }
                if (data.internationalAirline == '2') {  // 1：国内航线，2：国际航线
                    store.getState().allAirList.forEach((val) => {
                        if (val.iata == targetPoint) {
                            searchText1 = val.airlnCdName;
                        }
                    })
                } else {
                    store.getState().airList.forEach((val) => {
                        if (val.iata == targetPoint) {
                            searchText1 = val.airlnCdName;
                        }
                    })
                }
                if (data.remark) {  // 其他说明字数
                    textNum = data.remark.length;
                }
                let periodValidity, sailingtime;
                if(this.props.shangjiaBianji && !shenqingcesuan) {  //TODO：7.23增加,当重新上架、重新编辑时，需求有效期置空，计划执行时间“整年”
                    periodValidity = '';  // 需求有效期
                    sailingtime = '整年';
                }else {
                    periodValidity = data.periodValidity;  // 需求有效期
                    sailingtime = data.sailingtime;
                }
                let sailingtimeValue = [], hangjiDisabled = true;  // 计划执行周期
                if(sailingtime == '整年' || sailingtime == '冬春航季' || sailingtime == '夏秋航季') {
                    sailingtimeValue = [];
                    hangjiDisabled = true;
                }else {
                    sailingtimeValue = data.sailingtime.split(',');  // 计划执行周期数组
                    hangjiDisabled = false;
                }
                let sailingtimeRadioValue = this.sailingtimeFn(sailingtime);  // 计划执行周期单选按钮哪个选中
                let plans = [];  // 方案
                try{
                    data.demandPlans.forEach((val) => {
                        let obj = {};  //始发：dptNm, 经停：pstNm，到达：arrvNm，方式：quoteType，价格：quotedPrice
                        obj.dptNm = val.dptNm;  // 始发文字
                        obj.pstNm = val.pstNm;   // 经停文字
                        obj.arrvNm = val.arrvNm; // 到达文字
                        obj.dpt = val.dpt;  // 始发三字码
                        obj.pst = val.pst;  // 经停三字码
                        obj.arrv = val.arrv;  // 到达三字码
                        obj.quoteType = val.quoteType;  // quoteType,1-定补，2-保底
                        obj.quotedPrice = val.quotedPrice;  // 报价
                        obj.state = val.state;  // 测算状态(0-正常，1-删除，2-测算中，3-测算完成)
                        obj.id = val.id;  // TODO:方案id，只有在数据初始化时才有此参数
                        obj.click = val.click === null ? 0 : val.click;  //TODO：此处有bug，需要后台将click传回  申请测算是否点击 0：未点击， 1：点击
                        obj.areaType = 1;  //目标区域或者航点 1航点 2省份 3区域
                        plans.push(obj);
                    });
                } catch (e) {

                }
                let alertShow = this.state.alertShow;
                if(shenqingcesuan) {
                    alertShow = false;
                }
                this.setState({
                    alertShow,
                    demandprogress: data.demandprogress,
                    hangjiDisabled,
                    demandtype,
                    performShift: data.performShift,
                    internationalAirline: Number(data.internationalAirline),  // 国内航线、国际航线
                    detailShow: true, // 详细内容是否显示
                    searchText1: searchText1,  // 目标航点输入框
                    searchText1Bus: searchText1,  // 目标航点输入框存储
                    targetPoint: data.targetPoint,  // 目标航点三字码
                    remark: data.remark,  // 其他说明
                    textNum: textNum,  // 其他说明字数
                    aircrfttyp: data.aircrfttyp,  // 机型
                    //TODO:有错、待修改
                    timeRequirements: Number(data.timeRequirements),  // 时刻要求（0-白班，1-晚班，2-不限）
                    airlineType: Number(data.airlineType),  // 航司类型 0-全服务航空，1-低成本航空，2-都接受

                    sailingtime: sailingtime, // 计划执行周期
                    sailingtimeValue: sailingtimeValue,  // 显示的计划执行周期
                    sailingtimeRadioValue,
                    periodValidity,  // 需求有效期
                    date: date,  // 拟开班期
                    // TODO: 填写方案
                    plans: plans,  // 方案数据，始发：dptNm, 经停：pstNm，到达：arrvNm，报价：price{方式：type，价格：num}
                    // TODO:表单验证
                    contact: data.contact,  // 联系人
                    iHome: data.iHome,  // 联系方式
                    saveDraftId: data.id,  // TODO：自己添加的“保存草稿的id”
                }, () => {
                    this.disableOrNotFn();
                })
            }
        }catch(e) {

        }
    }
    closeDealPwd() {
        this.setState({
            showDealPwd: false,
        })
    }
    dealCloseFn(i) {  // 7.27增加 交易密码关闭
        if(i == 1) {  // 1:验证成功-关闭，2：点击“取消”关闭
            this.sendChange(this.state.saveDemand);
        }else {
            this.closeDealPwd();
        }
    }
    forgetPwd() {  // 7.27增加 忘记密码

    }
    componentWillReceiveProps(nextProps) {  // TODO: initData  没有草稿了，不需要绑定数据了
        this.setData(nextProps.data);
    }
    componentDidMount() {
        // let mes = <span>llllll啦啦啦啦啦啦啦233 <span style={{color: 'red'}}>span</span></span>;
        // this.success(mes);
        this.setData(this.props.data);
        let clientWidth = document.documentElement.clientWidth;  // 8.06 新增，1366分辨率下，样式改变
        let isSmall = false;
        if(clientWidth <= 1366) {
            isSmall = true;
        }else {
            isSmall = false;
        }
        let myCode = store.getState().role.airlineretrievalcondition; // 本机场三字码
        let myName;
        store.getState().airList.forEach((val) => {  // 本机场名字
            if (val.iata == myCode) {
                myName = val.airlnCdName
            }
        });
        this.setState({
            isSmall,  // 是否是1366分辨率
            myHeight: document.body.clientHeight - 115,
            myCode: myCode,
            myName: myName,
            contact: store.getState().role.concat,  // 联系人
            iHome: store.getState().role.phone,  // 联系方式
        });
        this.closeFloatingLayer = emitter.addEventListener('closeFloatingLayer', (message) => {
            // 监听浮沉关闭
            try {
                this.refs.needInput1.blur();
                this.refs.needInput3.blur();
                this.refs.needInput2.blur();
                this.refs.needInput4.blur();
            } catch (e) {

            }
            this.setState({
                showAirportSearch1: false,  // 目标航点下拉框是否显示
                showAirportSearch2: false,  // 始发运力是否显示
                showAirportSearch3: false,  // 经停是否显示
                showAirportSearch4: false,  // 到达是否显示
            })
        });
    }
    componentWillUnmount() {
        emitter.removeEventListener(this.closeFloatingLayer);
    }
    projectState(item, index) {  // 测算状态(0-正常，1-删除，2-测算中，3-测算完成)
        let _this = this;
        let state = Number(item.state);
        let styleJson = { margin: '0 30px', padding: '5px 13px', height: '28px', borderRadius: '20px', color: '#5772BF', fontSize: '1.2rem', whiteSpace: 'nowrap' };
        let styleJsonSmall = { margin: '0 21px 0 14px', padding: '5px 13px', height: '28px', borderRadius: '20px', color: '#5772BF', fontSize: '1.2rem', whiteSpace: 'nowrap' }
        let style = { padding: '5px 13px', borderRadius: '20px', margin: '0 30px', color: '#5772BF' };
        let styleSmall = { padding: '5px 13px', borderRadius: '20px', margin: '0 21px 0 14px', color: '#5772BF' };
        if (state === 0) {
            return (
                <Btn text='申请测算'
                     btnType="0"
                     otherText="申请中"
                     isDisable={this.state.noMsgCesuan}
                     styleJson={this.state.isSmall ? styleJsonSmall : styleJson}
                     onClick={()=> { _this.measuringClickFn(item, index)} } />
                //<div className={'btn-w'}
                  //  style={{ padding: '5px 13px', borderRadius: '20px', margin: '0 30px', color: '#5772BF', whiteSpace: 'nowrap' }}
                    //onClick={_this.measuringClickFn.bind(_this, item, index)}>申请测算</div>
            )
        } else if (state === 2) {
            return (
                <div style={this.state.isSmall ? styleSmall : style}>测算中</div>
            )
        } else if (state === 3) {
            return (
                <div style={this.state.isSmall ? styleSmall : style}>测算完成</div>
            )
        }
    }
    render() {
        // 1-定补，2-保底
        const menu = (
            <Menu onClick={this.menuClickFn.bind(this)}>
                <Menu.Item key="2">保底</Menu.Item>
                <Menu.Item key="1">定补</Menu.Item>
                <Menu.Item key="0">待议</Menu.Item>
            </Menu>
        );
        /*const typeMenu = (
            <Menu onClick={this.typeMenuClickFn.bind(this)} className={'scroll'} style={{width: '150px', maxHeight: '200px', overflowY: 'scroll'}}>
                {
                    store.getState().air.map((val) => {
                        return (
                            <Menu.Item key={val}>{val}</Menu.Item>
                        )
                    })
                }
            </Menu>
        );*/
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
        let axisLeft = {  // 下拉搜索样式
            position: 'absolute',
            top: '40px',
            left: '-67px',
            maxHeight: '220px',
            width: '220px',
            overflowY: 'scroll',
            background: 'white',
            zIndex: 22,
            boxShadow: '0 2px 11px rgba(85,85,85,0.1)'
        };
        let targetAirportSearch = this.state.internationalAirline == 1
            ? <AirportSearch
                axis={axis}
                update={this.state.update}
                resData={this.airportData1.bind(this)}
                searchText={this.state.searchText1} />
            : <InternationalAirportSearch
                axis={axis}
                update={this.state.update}
                resData={this.airportData1.bind(this)}
                searchText={this.state.searchText1} />;
        let dptAirportSearch = this.state.internationalAirline == 1
            ? <AirportSearch
                axis={axis}
                update={this.state.update}
                resData={this.airportData2.bind(this)}
                searchText={this.state.searchText2} />
            : <AllAirportSearch
                axis={axis}
                update={this.state.update}
                resData={this.airportData2.bind(this)}
                searchText={this.state.searchText2} />;
        let pstAirportSearch = this.state.internationalAirline == 1
            ? <AirportSearch
                axis={axis}
                update={this.state.update}
                resData={this.airportData3.bind(this)}
                searchText={this.state.searchText3} />
            : <AllAirportSearch
                axis={axis}
                update={this.state.update}
                resData={this.airportData3.bind(this)}
                searchText={this.state.searchText3} />;
        let arrvAirportSearch = this.state.internationalAirline == 1
            ? <AirportSearch
                axis={this.state.isSmall ? axisLeft : axis}
                update={this.state.update}
                resData={this.airportData4.bind(this)}
                searchText={this.state.searchText4} />
            : <AllAirportSearch
                axis={this.state.isSmall ? axisLeft : axis}
                update={this.state.update}
                resData={this.airportData4.bind(this)}
                searchText={this.state.searchText4} />;
        let _this = this;
        let propjectItem = (this.state.plans != null && this.state.plans.length != '') ?
            (this.state.plans.map((item, index) => {  // 我发出的方案
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
                            <div className={`${styles['border']} ${styles['border1']}`}></div>
                            <div style={{ width: '130px', boxSizing: 'border-box' }}>
                                <div className={styles['marginBottom']}>报价</div>
                                <div className={`${styles['bold']} ${styles['text-height']}`}>
                                    <span style={{ display: 'inline-block', minWidth: '30px' }}>
                                        {this.quoteTypeFn(item.quoteType)}{item.quotedPrice}
                                    </span>
                                    {
                                        (item.quoteType != '' || item.quotedPrice != '') && this.quoteNumText(item.quoteType)
                                    }
                                </div>
                            </div>
                            <div className={styles['border']}></div>
                            <div className={styles['flex']} style={{ width: '180px' }}>
                                {this.projectState(item, index)}
                                <div style={{ fontSize: '20px', color: '#627AB6' }}>
                                    <span className={'iconfont'} style={{ cursor: 'pointer' }}
                                        onClick={this.editProjectClickFn.bind(this, item, index)}>&#xe645;</span>
                                    <span className={'iconfont'} style={{ cursor: 'pointer' }}
                                        onClick={this.deleteProjectClickFn.bind(this, item, index)}>&#xe67a;</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })) : '';

        // 目标航点警告
        let targetPointWarn = <div style={{ position: 'absolute', top: '35px', left: '-55px', color: 'red' }}>
            请选择目标航点！
        </div>;
        let targetPointWarn1 = <div style={{ position: 'absolute', top: '35px', left: '-55px', color: 'red' }}>
            目标航点不能和本机场相同！
        </div>;
        // 始发、经停、到达警告
        let airlineWarn = <div style={{ position: 'absolute', top: '40px', left: '0', color: 'red' }}>
            必须同时含有本机场和目标航点！
        </div>;
        // 为经停、甩飞时三个输入框必须全填的警告
        let airline1Warn = <div style={{ position: 'absolute', top: '40px', left: '0', color: 'red' }}>
            请填写始发、经停、到达机场！
        </div>;
        // 报价警告
        let quoteWarn = <div style={{ position: 'absolute', top: '100px', left: '0', color: 'red' }}>
            请填写报价方式及金额！
        </div>;
        // 拟开班期警告
        let daysWarn = <div style={{ position: 'absolute', top: '40px', left: '0', color: 'red' }}>
            请选择拟开班期！
        </div>;
        // 适航机型警告
        let aircrfttypWarn = <div style={{ position: 'absolute', top: '40px', left: '-55px', color: 'red' }}>
            请选择适航机型！
        </div>;
        // 计划执行周期警告
        let sailingtimeWarn = <div style={{ position: 'absolute', bottom: '-20px', left: '0', color: 'red' }}>
            请选择计划执行周期！
        </div>;
        // 需求有效期警告
        let periodValidityWarn = <div style={{ position: 'absolute', top: '45px', left: '0', color: 'red' }}>
            请选择需求有效期！
        </div>;
        // 需求有效期警告
        let periodValidity2Warn = <div style={{ position: 'absolute', top: '45px', left: '0', color: 'red' }}>
            需求有效期必须早于计划执行周期！
        </div>;
        // 需求有效期警告
        let periodValidity3Warn = <div style={{ position: 'absolute', top: '45px', left: '0', color: 'red' }}>
            需求有效期至少晚于当前时间一个月！
        </div>;
        // 保存方案警告
        let saveProjectWarn = <div style={{ position: 'absolute', bottom: '0', right: '300px', color: 'red', fontSize: '1.8rem' }}>
            请新增方案！
        </div>;

        // 联系方式警告
        let iHomeWarn = <div style={{ position: 'absolute', top: '40px', left: '-55px', color: 'red' }}>
            请输入正确的联系方式！
        </div>;
        // 联系人警告
        let contactWarn = <div style={{ position: 'absolute', top: '40px', left: '-55px', color: 'red' }}>
            请输入联系人！
        </div>;

        // 计划执行周期 默认展示
        let sailingtimeValue = (this.state.sailingtimeValue != null && this.state.sailingtimeValue.length != 0)
            ? [moment(this.state.sailingtimeValue[0], dateFormat), moment(this.state.sailingtimeValue[1], dateFormat)]
            : null;
        // 需求有效期默认展示
        let periodValidity = (this.state.periodValidity == '' || this.state.periodValidity == null)
            ? null
            : moment(this.state.periodValidity, dateFormat);
        let passInput = this.state.showPassInput
            ? <div className={`${styles['col-box']} ${styles['screen-change-target']}`} style={{ marginBottom: '20px' }}>
                <div className={styles['col-text']}>
                    <span className={'iconfont'} style={{ fontSize: '20px' }}>&#xe6ad;</span>
                </div>
                <div className={styles['col-input']}>
                    <input type="text"
                        ref={'needInput2'}
                        style={ this.state.isSmall ? {width: '130px'} : {width: '185px'} }
                        maxLength="20"
                        placeholder="请输入航点"
                        value={this.state.searchText3}
                        onClick={(e) => { e.stopPropagation() }}
                        onChange={this.searchTextChangeFn3.bind(this)}
                        onFocus={this.inputClickFn3.bind(this)} />
                    {
                        this.state.showAirportSearch3 && pstAirportSearch
                    }
                </div>
            </div>
            : <div className={`${styles['col-box']} ${styles['screen-change-target']}`} style={{ marginBottom: '20px', background: 'transparent' }}></div>
        return (
            <div className={`scroll ${styles['airline-need']}`}
                style={{ height: `${this.state.myHeight}px` }}
                ref="myRef">
                <h2>我有一条航线需要找人来开!</h2>
                <span className={`${'iconfont'} ${styles['closeIcon']}`}
                    onClick={this.closeIconClickFn.bind(this)}>&#xe62c;</span>
                {
                    this.state.showDealPwd && <div style={{position: 'fixed', top: '0', left: '0', bottom: '0', right: '0',display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.4)', zIndex: '30'}}>
                        <DealPwd close={this.dealCloseFn.bind(this)}
                                 forgetPwd={this.forgetPwd.bind(this)} />
                    </div>
                }
                {
                    this.state.showPayEarnestMoney && <PayEarnestMoney
                        data={this.state.payData}
                        close={this.closeMoneyFn.bind(this)} />
                }
                {
                    this.state.showApplyMeasuring && <ApplyMeasuring
                        data={this.state.applyMeasuringData}
                        daizhifu={this.props.data.demandprogress == '-1' ? true : false}
                        renewData={this.renewData.bind(this)}
                        close={this.closeMeasuringFn.bind(this)} />
                }
                {
                    this.state.showSaveOrNotSave && <SaveOrNot
                        daizhifu={this.props.data.demandprogress == '-1' ? true : false}
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
                        save={this.deleteOrNotSaveFn.bind(this)}
                        cancel={this.deleteOrNotCancelFn.bind(this)} />
                }
                <div className={`${styles['first']} ${styles['flex']}`}>
                    <RadioGroup name="radiogroup"
                        className={styles['flex']}
                        defaultValue={1}
                        value={this.state.internationalAirline}
                        onChange={this.radioChangeFn.bind(this)}>
                        <Radio value={1} disabled={this.state.disableOrNot} style={{ fontSize: '1.2rem' }}>国内航线</Radio>
                        <Radio value={2} disabled={this.state.disableOrNot} style={{ fontSize: '1.2rem' }}>国际航线</Radio>
                    </RadioGroup>
                    {
                        this.state.disableOrNot ? (<div className={`${styles['col-box']} ${styles['screen-change-target']}`} style={{ opacity: '0.4' }}>
                            <div className={styles['col-text']} style={{color: '#605e7c'}}>目标航点</div>
                            <div className={styles['col-input']}>
                                <input type="text"
                                    style={ this.state.isSmall ? {width: '110px'} : {width: '154px'} }
                                    placeholder={'请输入目标航点'}
                                    maxLength="20"
                                    value={this.state.searchText1}
                                    disabled={true} />
                            </div>
                        </div>) : (<div className={`${styles['col-box']} ${styles['screen-change-target']}`}>
                            <div className={styles['col-text']}>目标航点</div>
                            <div className={styles['col-input']}>
                                <input type="text"
                                    ref={'needInput4'}
                                    style={ this.state.isSmall ? {width: '110px'} : {width: '154px'} }
                                    placeholder={'请输入目标航点'}
                                    maxLength="20"
                                    value={this.state.searchText1}
                                    onClick={(e) => { e.stopPropagation(); }}
                                    onChange={this.searchTextChangeFn1.bind(this)}
                                    onFocus={this.inputClickFn1.bind(this)} />
                                {
                                    this.state.showAirportSearch1 && targetAirportSearch
                                }
                                {
                                    this.state.targetPointWarnShow && targetPointWarn
                                }
                                {
                                    this.state.targetPointWarn1Show && targetPointWarn1
                                }
                            </div>
                        </div>)
                    }
                    <IconInfo placement={"right"} title={"选择您的目标航点，国际航线包含国家和地区（含港澳台地区）"}/>
                </div>
                {
                    this.state.detailShow && <div>
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
                                    onChange={this.designRadioChangeFn.bind(this)}>
                                    <Radio value={1} style={{ fontSize: '1.2rem' }}>直飞</Radio>
                                    <Radio value={2} style={{ fontSize: '1.2rem' }}>经停</Radio>
                                    <Radio value={3} style={{ fontSize: '1.2rem' }}>甩飞</Radio>
                                </RadioGroup>
                                <IconInfo placement={"right"} title={"根据您选择的目标航点进行航路设计，最多可设计3条"}/>
                            </div>
                            <div className={styles['flex']} style={{ flexWrap: 'wrap', position: 'relative', justifyContent: 'space-between' }}>
                                <div className={styles['col-box']} style={{ marginBottom: '20px' }}>
                                    <div className={styles['col-text']}>
                                        <span className={'iconfont'} style={{ fontSize: '20px' }}>&#xe6ad;</span>
                                    </div>
                                    <div className={styles['col-input']}>
                                        <input type="text"
                                            ref={'needInput1'}
                                            style={{ width: '183px' }}
                                            maxLength="20"
                                            placeholder="请输入航点"
                                            value={this.state.searchText2}
                                            onClick={(e) => { e.stopPropagation() }}
                                            onChange={this.searchTextChangeFn2.bind(this)}
                                            onFocus={this.inputClickFn2.bind(this)} />
                                        {
                                            this.state.showAirportSearch2 && dptAirportSearch
                                        }
                                    </div>
                                </div>
                                {passInput}
                                <div className={`${styles['col-box']} ${styles['screen-change-target']}`} style={{ marginBottom: '20px' }}>
                                    <div className={styles['col-text']}>
                                        <span className={'iconfont'} style={{ fontSize: '20px' }}>&#xe672;</span>
                                    </div>
                                    <div className={styles['col-input']}>
                                        <input type="text"
                                            ref={'needInput3'}
                                            style={ this.state.isSmall ? {width: '130px'} : {width: '185px'} }
                                            maxLength="20"
                                            placeholder="请输入航点"
                                            value={this.state.searchText4}
                                            onClick={(e) => { e.stopPropagation() }}
                                            onChange={this.searchTextChangeFn4.bind(this)}
                                            onFocus={this.inputClickFn4.bind(this)} />
                                        {
                                            this.state.showAirportSearch4 && arrvAirportSearch
                                        }
                                    </div>
                                </div>
                                <div className={styles['col-box']}>
                                    <div className={styles['col-text']} style={{ marginLeft: '7px', width: '40px' }}>报价</div>
                                    <Dropdown overlay={menu} trigger={['click']}>
                                        <div className={`${styles['col-text']} ${styles['flex']}`} style={{ textIndent: '7px', width: '77px' }}>
                                            <div style={{ width: '47px' }}>{this.quoteTypeFn(this.state.quoteType)}</div>
                                            <Icon type="caret-down" />
                                        </div>
                                    </Dropdown>
                                    {
                                        this.state.quoteType != 0 && (
                                            <div className={styles['col-input']}>
                                                <input type="text" style={{ width: '57px' }}
                                                       value={this.state.quotedPrice || ''}
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
                                        onClick={this.saveProject.bind(this)}>{this.state.projectIndex == '-1' ? '新增方案' : '编辑方案'}</div>
                                    {/*<Icon type="plus-circle"
                                          style={{color: '#477BE9', fontSize: '30px', cursor: 'pointer'}}
                                          onClick={this.addProject.bind(this)}/>*/}
                                </div>
                                {
                                    this.state.airlineWarnShow && airlineWarn
                                }
                                {
                                    this.state.airline1WarnShow && airline1Warn
                                }
                                {
                                    this.state.quoteWarnShow && quoteWarn
                                }
                            </div>
                        </div>
                        <div className={'scroll'} style={{ maxHeight: '420px', overflowY: 'scroll' }}>
                            {
                                this.state.plans.length > 0 && propjectItem
                            }
                        </div>
                        <div className={`${styles['fourth']} ${styles['flex']}`}>
                            <div className={styles['flex']}>
                                <span style={{ marginRight: '25px' }}>航司类型</span>
                                <RadioGroup name="radiogroup"
                                    className={styles['flex']}
                                    defaultValue={2}
                                    value={this.state.airlineType}
                                    onChange={this.typeRadioChangeFn.bind(this)}>
                                    <Radio value={0} style={{ fontSize: '1.2rem' }}>全服务航空</Radio>
                                    <Radio value={1} style={{ fontSize: '1.2rem' }}>低成本航空</Radio>
                                    <Radio value={2} style={{ fontSize: '1.2rem' }}>都接受</Radio>
                                </RadioGroup>
                            </div>
                            <div className={`${styles['flex']} ${styles['capacity-release-content-date']}`} style={{ position: 'relative' }}>
                                拟开班期
                                <DateChoose data={this.state.date} chooseDate={(data) => this.chooseDateEvent(data)} />
                                {
                                    this.state.daysWarnShow && daysWarn
                                }
                            </div>
                        </div>
                        <div className={`${styles['fifth']} ${styles['flex']}`}>
                            <div className={`${styles['col-box']} ${styles['screen-change-target']}`} style={{ background: '#F6F6F6' }}>
                                <div className={styles['col-text']}>适航机型</div>
                                <div className={styles['col-input']}>
                                    <DimAir defaultData={this.state.aircrfttyp} dimEvent={this.dimEvent.bind(this)} />
                                    {/*<Dropdown overlay={typeMenu}
                                              trigger={['click']}>
                                        <input type="text" style={{width: '110px'}}
                                               readOnly
                                               value={this.state.aircrfttyp} />
                                    </Dropdown>*/}
                                    {
                                        this.state.aircrfttypWarnShow && aircrfttypWarn
                                    }
                                </div>
                            </div>
                            <div className={`${styles['col-box']} ${styles['screen-change-target']}`} style={{ position: 'relative', background: '#F6F6F6' }}>
                                <div className={styles['col-text']}>需求有效期</div>
                                <div onClick={(e) => { e.stopPropagation() }}>
                                    <DatePicker className={styles['range-picker2']}
                                        format="YYYY-MM-DD"
                                        placeholder="截止日期"
                                        disabledDate={this.dateDisabledDate.bind(this)}
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
                                <IconInfo placement={"bottom"} title={"选择您在平台发布此需求的有效期，有效期之内您的需求信息都将在平台展示"}/>
                                {
                                    this.state.periodValidityWarnShow && periodValidityWarn
                                }
                                {
                                    this.state.periodValidity2WarnShow && periodValidity2Warn
                                }
                                {
                                    this.state.periodValidity3WarnShow && periodValidity3Warn
                                }
                            </div>
                            <div className={styles['col-box']}
                                 style={{ position: 'relative',
                                     alignSelf: 'flex-start',
                                     paddingTop: '10px',
                                     paddingBottom: '10px',
                                     width: '250px',
                                     height: '95px',
                                     background: '#F6F6F6' }}>
                                <div className={styles['col-text']}
                                     style={{alignSelf: 'flex-start',
                                         width: '34px',
                                         height: 'auto',
                                         fontSize: '1.2rem',
                                         whiteSpace: 'normal',
                                         border: '0'}}>计划执行周期</div>
                                {/*TODO:日历-两个*/}
                                <div style={{width: '200px'}}
                                     onClick={(e) => { e.stopPropagation() }}>
                                    <RadioGroup style={{marginBottom: '6px'}}
                                                value={this.state.sailingtimeRadioValue}
                                                onChange={this.hangjiRadioOnChange.bind(this)}>
                                        <div style={{whiteSpace: 'nowrap'}}>
                                            <Radio value={'整年'} className={styles['hangji-radio']}>整年</Radio>
                                            <Radio value={'冬春航季'} className={styles['hangji-radio']}>冬春航季</Radio>
                                            <Radio value={'夏秋航季'} className={styles['hangji-radio']}>夏秋航季</Radio>
                                        </div>
                                        <Radio value={'自定义'} className={styles['hangji-radio']}>自定义</Radio>
                                    </RadioGroup>
                                    <RangePicker className={styles['range-picker1']}
                                         disabled={this.state.hangjiDisabled}
                                         format="YYYY-MM-DD"
                                        disabledDate={this.disabledDate.bind(this)}
                                        placeholder={['开始', '结束']}
                                        value={sailingtimeValue}
                                        onChange={this.sailingtimeChangeFn.bind(this)}
                                        onCalendarChange={this.onCalendarChange.bind(this)}
                                        onOpenChange={this.sailingtimeOpenFn.bind(this, sailingtimeValue)}
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
                                    this.state.sailingtimeWarnShow && sailingtimeWarn
                                }
                            </div>
                        </div>
                        <div className={`${styles['sixth']} ${styles['flex']}`}>
                            <span style={{ marginRight: '25px' }}>时刻要求</span>
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
                                        onChange={this.contactChangeFn.bind(this)} />
                                    {
                                        this.state.contactWarnShow && contactWarn
                                    }
                                </div>

                            </div>
                            <div className={styles['col-box']} style={{ background: '#F6F6F6' }}>
                                <div className={styles['col-text']}>移动电话</div>
                                <div className={styles['col-input']}>
                                    <input type="text" style={{ width: '144px' }}
                                        maxLength={'20'}
                                        value={this.state.iHome}
                                        onChange={this.iHomeChangeFn.bind(this)}
                                        onBlur={this.iHomeBlurFn.bind(this)} />
                                    {
                                        this.state.iHomeWarnShow && iHomeWarn
                                    }
                                </div>
                            </div>
                            <div className={`${styles['col-box']} ${styles['screen-change-target2']}`} style={{ background: 'transparent' }}></div>
                        </div>
                        <div style={{ height: '130px' }}></div>
                        <div className={styles['ninth']}>
                            <div>
                                <Checkbox className={styles['check-box']} checked={this.state.demandtype == 3} onChange={this.entrustFn.bind(this)}>
                                    全权委托平台帮我开通此条航线
                                    <IconInfo placement={"right"} title={"全权委托航遇平台来帮您开通此航线，专业、省心。"}/>
                                </Checkbox>
                                {/*<img src={require('../../../static/img/12.jpg')} alt="省时、省钱、省心"/>*/}
                            </div>
                        </div>
                        <div className={`${styles['buttons']} ${styles['flex']}`}>
                            {
                                (this.props.data.demandprogress != '-1' && this.props.data.demandprogress != '12')
                                && <div style={{padding: '0'}}>
                                    <Btn text='保存草稿'
                                         btnType="0"
                                         otherText="保存中"
                                         isDisable={this.state.noMsgCaogao}
                                         styleJson={{ width: "100px",padding:0 }}
                                         onClick={()=> { _this.saveSendDataFn(1)} } />
                                </div>
                               // <div className={'btn-w'} style={{ width: '100px' }} onClick={this.saveSendDataFn.bind(this, 1)}>保存草稿</div>
                            }
                            <div style={{padding: '0'}}>
                                <Btn text={this.state.demandprogress == 12 ? '确认更改' : '确认发布航线信息'}
                                     btnType="1"
                                     otherText={this.state.demandprogress == 12 ? '更改中' : '发布中'}
                                     isDisable={this.state.noMsgFabu}
                                     styleJson={{ width: "250px", padding: '0' }}
                                     onClick={()=> { _this.sendDataFn()} } />
                            </div>
                            {/*<div className={'btn-b'} style={{ width: '250px' }} onClick={this.sendDataFn.bind(this, 2)}>确认发布航线信息</div>*/}
                            <div className={'btn-w'} style={{ width: '100px',height: '32px'}} onClick={this.closeFn.bind(this)}>取消</div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}
