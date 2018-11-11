import React, { Component, Fragment } from 'react'
import Axios from "./../../utils/axiosInterceptors";
import { store } from "../../store";

import moment from 'moment';

import { Radio, TimePicker, Select, DatePicker, Dropdown, Icon,Menu} from 'antd';

import style from './../../static/css/popup/chooseAirlineRelease.scss'

import emitter from "../../utils/events";
// import EditCapacityRelease from './editCapacityRelease';
// import EditAirLineRelease from './editAirLineRelease';
import DateChoose from "../../components/dateChoose/dateChoose";
import AirportSearch from './../../components/search/airportSearch';
import AllAirportSearch from './../../components/search/allAirportSearch';

const RadioGroup = Radio.Group;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const format = 'HH:mm';//定义antd时间组件格式;

export default class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {
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

            airlineType: 0,//0 直飞,1 经停 //TODO:有问题
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
            quoteType: '',//报价类型
            quotedPrice:'',//价格
            quoteWarnShow: false,  // 报价警告

            aircrfttyp: "",//拟飞机型
            seating: "",//座位数布局
            days: "",//拟开航班
            sailingtime: "",//计划执行周期
            sailingtimeMoment: [],
            performShift: "",//计划执行班次
            periodValidity: "",//运力有效期
            contact: "",//联系人
            ihome: "",//移动电话
            fixedSubsidyPrice: "",//定补价格
            bottomSubsidyPrice: "",//保底价格
            timeRequirements: "2",//// 时刻要求（0-白班，1-晚班，2-不限）

            fixedSubsidyPriceType: false,//定补类型
            bottomSubsidyPriceType: false,//保底类型
            otherType: false,//其他类型
            remark: "",//其他说明

            sailingtimeStart: '',
            sailingtimeEnd: '',
            // 出入港时刻
            dptLevel: '00:00',
            pstEnter: '00:00',
            pstLevel: '00:00',
            arrvEnter: '00:00',
            arrvLevel: '00:00',
            pstBackEnter: '00:00',
            pstBackLevel: '00:00',
            dptEnter: '00:00',
        };
    }
    componentDidMount() {
        let air = store.getState().air;//获取机型列表
        let periodValidity = moment().format().split("T")[0];
        this.setState({
            air,
            periodValidity
        })
    }
    componentWillUnmount() {
    }
    componentWillMount() {
        this.getUpdate(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.getUpdate(nextProps);
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
                let searchText2 = prev.searchText2.replace(/(^\s*)|(\s*$)/g, "");  // 去除空格
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
                let searchText4 = prev.searchText4.replace(/(^\s*)|(\s*$)/g, "");  // 去除空格
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
    getSiteTimeStyle() {
        return this.state.airlineType ? 'space-between' : 'space-around';
    }

    // 选择航线类型
    radioChangeFn(e) {
        let target = e.target;
        this.setState({
            airlineType: Number(target.value),//0 直飞,1 经停
        })
    }
    // 时刻
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
    // TODO：报价方式下拉列表 点击事件
    menuClickFn({ key }) {
        console.info(key);
        this.setState({
            quoteType: key,
            quoteWarnShow: false,
        })
    }
    priceChangeFn(e) {  // 报价-价格改变事件
        let target = e.target;
        let val = target.value.replace(/[^\d\.]/g, '');  // 只允许输入数字和浮点数
        this.setState({
            quotedPrice: val,
            quoteWarnShow: false,
        })
    }
    timeRadioChangeFn(e) {  // 时刻要求（0-白班，1-晚班，2-不限）
        console.info(e.target.value);
        this.setState({
            timeRequirements: e.target.value
        })
    }
    //拟开航班 向DateChoose组件传递方法
    chooseDateEvent(data) {
        let dataType = false;
        for (let i = 0; i < 7; i++) {
            if (data[i].type == true) {
                dataType = true
            }
        }
        let newData = data;
        if (dataType) {
            this.setState({
                data: newData
            })
        } else {
            this.setState({
                data: newData
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
        this.setState({
            contact: event.target.value
        })
    }

    // 手机号码
    phoneChange(event) {
        if (event.target.value.match(/^[\d]*$/)) {
            this.setState({
                ihome: event.target.value
            })
        }
    }
    //关闭弹出层 
    cancel = () => {
        this.closePopup()
    }
    // 确认提交方案
    confirm = () => {
        this.collectData(2);
    }
    // 保存草稿
    saveScheme = () => {
        this.collectData(3);
    }
    // 获取数据,检查是否存在数据
    getUpdate(props) {
        console.info('---打开---编辑---', props.popupMes)
        let _this = this;
        let popupMes = props.popupMes;
        let demandId = props.popupMes.demandId;
        let editType = popupMes.transmit.editType;
        let currentId = store.getState().role.id;//当前登录用户id
        if (editType == 3) {
            let responsePlanId = popupMes.transmit.id;
            console.log('我要洽谈/我有运力')
            Axios({
                url: 'queryResponsePlanForEdit',
                method: 'post',
                params: {
                    responsePlanId: responsePlanId,
                    employeeId: currentId
                }
            })
            .then((response) => {
                console.log('数据->', response)
                console.log('id,', response.data.opResult)
                if (response.data.opResult === '0') {
                    console.log(123)
                    let {
                        demandId,
                        employeeId,//意向方用户id
                        dptTime, // 始发时刻
                        pstTime, // 经停时刻
                        pstTimeBack, // 经停返回时刻
                        arrvTime, // 到达时刻
                        days, // 班期
                        remark, // 其他说明
                        contact, // 联系人
                        ihome,  //移动电话
                        responsePlans, // 响应方案
                        timeRequirements, //时刻要求（0-白班，1-晚班，2-不限）
                        demandtype, //需求类型
                        periodValidity,
                    } = response.data.reResponse;

                    let { id, responseId, dpt, dptNm, pst, pstNm, arrv, arrvNm, state, quoteType, quotedPrice} = responsePlans[0];

                    let dptLevel = dptTime ? dptTime.split(',')[0] : '00:00',
                        dptEnter = dptTime ? dptTime.split(',')[1] : '00:00',
                        pstEnter = pstTime ? pstTime.split(',')[0] : '00:00',
                        pstLevel = pstTime ? pstTime.split(',')[1] : '00:00',
                        arrvEnter = arrvTime ? arrvTime.split(',')[0] : '00:00',
                        arrvLevel = arrvTime ? arrvTime.split(',')[1] : '00:00',
                        pstBackEnter = pstTimeBack ? pstTimeBack.split(',')[0] : '00:00',
                        pstBackLevel = pstTimeBack ? pstTimeBack.split(',')[1] : '00:00';

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
                    timeRequirements = timeRequirements ? timeRequirements : 2,
                    console.log(data)

                    this.setState(() => {
                        return {
                            responseId,
                            demandId,
                            editType,
                            airlineType: pst ? 1 : 0,
                            dptLevel,// 出入港时刻
                            pstEnter,
                            pstLevel,
                            arrvEnter,
                            arrvLevel,
                            pstBackEnter,
                            pstBackLevel,
                            dptEnter,
                            
                            employeeId, id, dpt, dptNm, pst, pstNm, arrv, arrvNm, quoteType,
                            quotedPrice, days, contact, ihome, remark,
                            responsePlans,
                            data,
                            ...{ searchText2: dptNm, searchText3: pstNm, searchText4: arrvNm, },
                            timeRequirements,// 时刻要求（0-白班，1-晚班，2-不限）
                        }
                    })
                    console.log(this.state)
                }else{
                    console.log('sdfsdlfsdf')
                }

            })
        }
    }
    // TODO：报价方式下拉列表 点击事件
    menuClickFn({ key }) {
        console.info(key);
        this.setState({
            quoteType: key,
            quoteWarnShow: false,
        })
    }
    // 收集数据 发送
    collectData = (savaType) => {
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
                responseId: null,
                dpt: this.state.dpt,
                pst: this.state.pst,
                arrv: this.state.arrv,
            }];
        } else {
            responsePlans = this.state.responsePlans.map((value) => {
                value.dpt = _this.state.dpt;
                value.pst = _this.state.airlineType == 1 ? _this.state.pst : '';//判断后传参
                value.arrv = _this.state.arrv;
                return value
            });
        }
        // 构建总数据
        let formData = {
            id: this.state.responseId,
            demandId: this.state.demandId,
            employeeId: this.state.employeeId,
            demandtype: this.state.demandtype,

            dptTime: this.state.dptLevel + ',' + this.state.dptEnter,
            pstTime: this.state.airlineType == 1 ? (this.state.pstLevel + ',' + this.state.pstEnter) : '',//判断后传参
            arrvTime: this.state.arrvLevel + ',' + this.state.arrvEnter,
            pstTimeBack: this.state.airlineType == 1 ? this.state.pstBackLevel + ',' + this.state.pstBackEnter : '',

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
            delResponsePlanIds: null,

            timeRequirements:this.state.timeRequirements,
            quoteType: this.state.quoteType,
            quotedPrice: this.state.quotedPrice,
        }
        console.log('保存/提交方案数据', formData)
        if (this.props.popupMes.transmit.editType == 3){
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
                console.log(response)
            })
        }
        // if (this.props.popupMes.transmit.editType == 2) {
        //     console.log('重新编辑提交方案')
        //     Axios({
        //         url: 'responseUpdateV2',
        //         method: 'post',
        //         data: JSON.stringify(formData),
        //         dataType: 'json',
        //         headers: {
        //             'Content-type': 'application/json;charset=utf-8'
        //         }
        //     })
        //         .then((response) => {
        //             console.log(response)
        //         })
        // } else {
        //     Axios({
        //         url: 'responseAdd',
        //         method: 'post',
        //         data: JSON.stringify(formData),
        //         dataType: 'json',
        //         headers: {
        //             'Content-type': 'application/json;charset=utf-8'
        //         }
        //     })
        //         .then((response) => {
        //             console.log(response)
        //         })
        // }

    }
    // 经停节点 根据航线类型对应显示 1:直飞,0:经停
    render() {
        const menu = (
            <Menu onClick={this.menuClickFn.bind(this)}>
                <Menu.Item key="保底">保底</Menu.Item>
                <Menu.Item key="定补">定补</Menu.Item>
            </Menu>
        );
        console.info(this.state.countryType == 0);
        let axis = {  // 下拉搜索样式
            position: 'absolute',
            right: 0,
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
                        <div style={{ fontWeight: 'bold', fontSize: '2rem' }}>您想如何使用该运力?</div>
                        <div>
                            <RadioGroup name="radiogroup" defaultValue={0} value={this.state.airlineType} onChange={this.radioChangeFn.bind(this)}>
                                <Radio value={0} style={{ fontSize: '1.2rem' }}>直飞</Radio>
                                <Radio value={1} style={{ fontSize: '1.2rem' }}>经停</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    {/* 航点和时刻 */}
                    <div className={style['site-time-con']} style={{ justifyContent: this.getSiteTimeStyle }}>
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
                            </div>
                            {/*始发时刻*/}
                            <div className={style['time-con']}>
                                <div className={style['time-box']}>
                                    <div className={style['time-item']}>
                                        <div>
                                            <span>出</span>
                                            <span>出港时刻</span>
                                        </div>
                                        <div>
                                            <input type="text" maxLength="20" />
                                            <span class="ant-time-picker-icon"></span>
                                            <div className={style['drop-list-time']}>
                                                <TimePicker format={format} placeholder={""} onChange={this.dptLevel.bind(this)}
                                                    value={moment(this.state.dptLevel, 'hh/mm')} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style['time-item']}>
                                        <div>
                                            <span>进</span>
                                            <span>进港时刻</span>
                                        </div>
                                        <div>
                                            <input type="text" maxLength="20" />
                                            <span class="ant-time-picker-icon"></span>
                                            <div className={style['drop-list-time']}>
                                                <TimePicker format={format} placeholder={''} onChange={this.dptEnter.bind(this)}
                                                    value={moment(this.state.dptEnter, 'hh/mm')} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/**/}
                        </div>

                        {
                            this.state.airlineType == 1 ? (<div className={style['col-item']}>
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
                                </div>
                                {/*经停时刻*/}
                                <div className={style['time-con']}>
                                    <div className={style['time-box']}>
                                        <div className={style['time-item']}>
                                            <div>
                                                <span>出</span>
                                                <span>出港时刻</span>
                                            </div>
                                            <div>
                                                <input type="text" maxLength="20" />
                                                <div className={style['drop-list-time']}>
                                                    <TimePicker format={format} placeholder={""} onChange={this.pstLevel.bind(this)}
                                                        value={moment(this.state.pstLevel, 'hh/mm')} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={style['time-item']}>
                                            <div>
                                                <span>进</span>
                                                <span>进港时刻</span>
                                            </div>
                                            <div>
                                                <input type="text" maxLength="20" />
                                                <div className={style['drop-list-time']}>
                                                    <TimePicker format={format} placeholder={""} onChange={this.pstEnter.bind(this)}
                                                        value={moment(this.state.pstEnter, 'hh/mm')} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style['time-box']}>
                                        <div className={style['time-item']}>
                                            <div>
                                                <span>出</span>
                                                <span>进港时刻</span>
                                            </div>
                                            <div>
                                                <input type="text" maxLength="20" />
                                                <div className={style['drop-list-time']}>
                                                    <TimePicker format={format} placeholder={""} onChange={this.pstBackLevel.bind(this)}
                                                        value={moment(this.state.pstBackLevel, 'hh/mm')} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={style['time-item']}>
                                            <div>
                                                <span>进</span>
                                                <span>进港时刻</span>
                                            </div>
                                            <div>
                                                <input type="text" maxLength="20" />
                                                <div className={style['drop-list-time']}>
                                                    <TimePicker format={format}
                                                        placeholder={""}
                                                        onChange={this.pstBackEnter.bind(this)}
                                                        value={moment(this.state.pstBackEnter, 'hh/mm')} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>) : ''
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
                            </div>
                            {/*到达时刻*/}
                            <div className={style['time-con']}>
                                <div className={style['time-box']}>
                                    <div className={style['time-item']}>
                                        <div>
                                            <span>出</span>
                                            <span>出港时刻</span>
                                        </div>
                                        <div>
                                            <input type="text" maxLength="20" />
                                            <div className={style['drop-list-time']}>
                                                <TimePicker format={format} placeholder={""} onChange={this.arrvLevel.bind(this)}
                                                    value={moment(this.state.arrvLevel, 'hh/mm')} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style['time-item']}>
                                        <div>
                                            <span>进</span>
                                            <span>进港时刻</span>
                                        </div>
                                        <div>
                                            <input type="text" maxLength="20" />
                                            <div className={style['drop-list-time']}>
                                                <TimePicker format={format} placeholder={""} onChange={this.arrvEnter.bind(this)}
                                                    value={moment(this.state.arrvEnter, 'hh/mm')} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/**/}
                        </div>
                    </div>
                    {/* 飞行计划信息 */}
                    <div className={style['flight-info']}>
                        {/*航班信息*/}

                        <div className={style['flight-info-con']}>
                            <div className={style['common-style']}>
                                <div style={{flex:1,padding:'0 8px'}}>
                                    <span>合作方式</span>
                                </div>
                                <div>
                                    <Dropdown overlay={menu} trigger={['click']}>
                                        <div className={`${style['col-text']} ${style['flex']}`} style={{ textIndent: '7px', width: '77px' }}>
                                            <div style={{ width: '47px' }}>{this.state.quoteType}</div>
                                            <Icon type="caret-down" />
                                        </div>
                                    </Dropdown>
                                    <input style={{ width: '60px' }} type="text" 
                                        value={this.state.quotedPrice}
                                        onChange={this.priceChangeFn.bind(this)}/>
                                    <span>万</span>
                                </div>
                            </div>
                            <div className={style['common-style']}>
                                <div style={{padding:'0 8px'}}>
                                    <span>时刻要求</span> 
                                </div>
                                <div>
                                    <RadioGroup name="radiogroup"
                                        className={style['flex']}
                                        defaultValue={0} 
                                        value={this.state.timeRequirements}
                                        onChange={this.timeRadioChangeFn.bind(this)}>
                                        <Radio value={2} style={{ fontSize: '1.2rem' }}>不限</Radio>
                                        <Radio value={0} style={{ fontSize: '1.2rem' }}>白班</Radio>
                                        <Radio value={1} style={{ fontSize: '1.2rem' }}>晚班</Radio>
                                    </RadioGroup> 
                                </div>
                                
                            </div>
                            {/*拟开航班*/}
                            <div className={style['common-style']}>
                                <div>
                                    <span>拟开航班</span>
                                </div>
                                <div className={style['days']}>
                                    <Fragment >
                                        <DateChoose data={this.state.data} chooseDate={(data) => this.chooseDateEvent(data)} />
                                    </Fragment>
                                </div>
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
                                <textarea value={this.state.remark} onChange={this.remarkChange.bind(this)}></textarea>
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
                                        onChange={this.contactChange.bind(this)} />
                                </div>
                            </div>
                            <div className={style['common-style']}>
                                <div>
                                    <span>联系电话</span>
                                </div>
                                <div>
                                    <input type="text" maxLength="20"
                                        value={this.state.ihome}
                                        onChange={this.phoneChange.bind(this)} />
                                </div>
                            </div>
                            <div className={style['common-style']}>

                            </div>
                        </div>
                    </div>

                </div>
                <div className={style['handle']}>
                    {this.state.editType == 2 ? '' : <button onClick={this.saveScheme}>保存方案</button>}
                    <button className={style['confirm']} onClick={this.confirm}>确认提交运2力方案</button>
                    <button onClick={this.cancel}>取消</button>
                </div>
            </div>
        )
    }
}