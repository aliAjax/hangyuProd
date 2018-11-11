import React, { Component } from 'react';
import Axios from "./../../utils/axiosInterceptors";
import { store } from './../../store/index';
import emitter from '../../utils/events';
import style from './../../static/css/from/received.scss';

import Confirmations from './../../components/confirmations/confirmations';


import { Collapse, Modal } from 'antd';

import PlanInfo from './planInfo.js';
import RsAirline from './rsAirline.js';
import RsTime from './rsTime.js';
import DealPwd from '../../components/dealPwd/dealPwd';

import { inherits } from 'util';
// import { isMaster } from 'cluster';

const Panel = Collapse.Panel;

const customPanelStyle = {
    background: 'none',
    borderRadius: 8,
    border: 'none',
    padding: 0
}
export default class received extends Component {
    constructor(props) {
        super(props);
        this.state = {
            demandId: '',
            isMarket: '',
            updateDetail: () => { },

            visible: false,
            uploading: false,
            transmit: null,

            showDealPwd: false,
            defaultActiveKey: '',
        }
    }
    componentWillMount() {
        this.setState(() => {
            return {
                role: this.props.role,
                isMarket: this.props.isMarket,
                planList: this.props.planList,
                demandId: this.props.demandId,
                updateDetail: this.props.updateDetail,
                defaultActiveKey: this.props.defaultActiveKey,
                visible_reCall: false,
                visible_affirm: false,
                visible_rejectAndReCall: false,
                visible_repeal: false,
                // visible_scheme_
            }
        })
        this.init();
    }
    componentWillReceiveProps(nextprops) {

        this.setState(() => {
            return {
                role: nextprops.role,
                isMarket: nextprops.isMarket,
                planList: nextprops.planList,
                demandId: nextprops.demandId,
                updateDetail: nextprops.updateDetail,
                defaultActiveKey: nextprops.defaultActiveKey,
                visible_reCall: false,
                visible_affirm: false,
                visible_rejectAndReCall: false,
                visible_repeal: false,
            }
        })
        // this.setState({
        //     defaultActiveKey: " ",
        // })
        let rsCon = this.refs['rs-con'];
        let rsTitle = this.refs['rs-title'];
        let rsBody = this.refs['rs-body'];
        rsBody.style.height = (rsCon.offsetHeight - rsTitle.offsetHeight) + 'px';
    }
    componentDidMount() {
        let rsCon = this.refs['rs-con'];
        let rsTitle = this.refs['rs-title'];
        let rsBody = this.refs['rs-body'];
        rsBody.style.height = (rsCon.offsetHeight - rsTitle.offsetHeight) + 'px';
    }
    getUpdate = () => {
        let { id } = this.props.demandId || {};
        if (id) {
            let transmit = { id };
            emitter.emit('openFrom', {
                openFrom: true,
                fromType: 3,
                fromMes: {
                    transmit: transmit
                }
            });
        }
    }
    success = (info = {}) => {
        let { title, content } = info;
        Modal.success({
            title: title || '',
            content: content || '',
        });
        this.props.updateDetail();
    }
    error = (info = {}) => {
        let { title, content } = info;
        Modal.error({
            title: title || '',
            content: content || '',
        });
    }
    // 根据type参数判断 收到的方案需使用那个header
    init() {
        return {
            style: 'airport-market-rs-item',
            params: [
                { name: '排名' },
                { name: '接收时间' },
                { name: '航线' },
                { name: '报价' },
            ]
        };
    }
    //匹配城市名
    findName = (dpt, pst, arrv) => {
        let cityList = store.getState().allAirList;
        let arr = {};
        let city = cityList.filter((value) => {
            if (value.iata == dpt) {
                arr.dptNm = value.city;
                arr.dptAirlnCd = value.airlnCd;
            } else if (value.iata == pst) {
                arr.pstNm = value.city;
                arr.pstAirlnCd = value.airlnCd;
            } else if (value.iata == arrv) {
                arr.arrvNm = value.city;
                arr.arrvAirlnCd = value.airlnCd;
            }
        })
        return arr;
    }

    // 重新编辑
    reEditPlan = (transmit) => {
        // let transmit = this.state.transmit || {};
        let { role, isMarket } = this.state;
        let popupType = 0;
        if ((role === '1' && isMarket) || (role === '0' && !isMarket)) {//机场
            popupType = 2;
        } else if ((role === '1' && !isMarket) || (role === '0' && isMarket)) {//航司
            popupType = 1;
        }
        transmit.bianjiOrNot = true;  // 是否是点击“重新编辑”true：重新编辑，false：我要洽谈
        emitter.emit('openPopup', {
            popupType: popupType,
            popupMes: {
                transmit,
            }
        })
        this.hideModal();
    }
    // 选定后重新编辑
    affirmReEdit = (transmit) => {
        this.hideModal();
        // let transmit = this.state.transmit || {};
        let { role, isMarket } = this.state;
        let popupType = 0;
        if ((role === '1' && isMarket) || (role === '0' && !isMarket)) {//机场
            popupType = 2;
        } else if ((role === '1' && !isMarket) || (role === '0' && isMarket)) {//航司
            popupType = 1;
        }
        transmit.bianjiOrNot = true;  // 是否是点击“重新编辑”true：重新编辑，false：我要洽谈
        emitter.emit('openPopup', {
            popupType: popupType,
            popupMes: {
                transmit,
            }
        })
    }
    // 选择方案点击事件
    affirmSelect = (transmit) => {
        this.hideModal();
        // let transmit = this.state.transmit || {};
        let { role, isMarket } = this.state;
        let popupType = 0;
        if ((role === '1' && isMarket) || (role === '0' && !isMarket)) {//机场
            popupType = 2;
        } else if ((role === '1' && !isMarket) || (role === '0' && isMarket)) {//航司
            popupType = 1;
        }
        transmit.bianjiOrNot = true;  // 是否是点击“重新编辑”true：重新编辑，false：我要洽谈
        emitter.emit('openPopup', {
            popupType: popupType,
            popupMes: {
                transmit,
            }
        })
    }


    // 需求发布方取消选定方案
    releaseUnCheck() {
        this.hideModal();
        let transmit = this.state.transmit
        Axios({
            url: 'releaseUnCheck',
            method: 'post',
            params: {
                planId: transmit.id
            },
            timeout: 10000,
        }).then((response) => {
            if (response.data.opResult === '0') {
                this.success({
                    title: '取消选定方案成功',
                })
            } else {
                this.error({
                    title: response.data.msg,
                })
            }
        })
    }
    // 响应方确认方案
    responseCheck() {
        this.hideModal();
        let transmit = this.state.transmit
        Axios({
            url: 'responseCheck',
            method: 'post',
            params: {
                planId: transmit.id
            },
            timeout: 10000,
        }).then((response) => {
            if (response.data.opResult === '0') {
                let { demandId } = this.state;
                Modal.success({
                    title: '确认选择方案成功，已生成订单，请联系对方签约！',
                    onOk() {
                        window.location.href = `#/userCenter/demandId=${demandId}`;
                    }
                });
                this.props.updateDetail();
            } else {
                this.error({
                    title: response.data.msg,
                })
            }
        })
    }
    // 拒绝并撤回
    responseRefuseAndWithDraw() {
        this.hideModal();
        let transmit = this.state.transmit
        Axios({
            url: 'responseRefuseAndWithDraw',
            method: 'post',
            params: {
                planId: transmit.id
            },
            timeout: 10000,
        }).then((response) => {
            if (response.data.opResult === '0') {
                this.success({
                    title: '拒绝并撤回方案成功',
                })
                emitter.emit('renewDataFn');
            } else {
                this.error({
                    title: response.data.msg,
                })
            }
        })
    }
    // 撤回选定前的方案/意向
    recall() {
        this.hideModal();
        let transmit = this.state.transmit;
        let role = store.getState().role.role;
        if (role === "1") {//机场撤回意向
            Axios({
                url: 'withdrawResponsePlanByAirPort',
                method: 'post',
                params: {
                    planId: transmit.id
                },
                timeout: 10000,
            }).then((response) => {
                if (response.data.opResult === '0') {
                    this.success({
                        title: '成功撤回该方案',
                    })
                    emitter.emit('renewDataFn');
                } else {
                    this.error({
                        title: response.data.msg,
                    })
                }
            })
        } else if (role === "0") {//航司撤回意向
            Axios({
                url: 'withdrawResponseByHangsi',
                method: 'post',
                params: {
                    id: transmit.responseId
                },
                timeout: 10000,
            }).then((response) => {
                if (response.data.opResult === '0') {
                    this.success({
                        title: '撤回方案成功',
                    })
                    emitter.emit('renewDataFn');
                } else {
                    this.error({
                        title: response.data.msg,
                    })
                }
            })
        }
    }
    // 显示对话框
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    // 关闭对话框
    hideModal = () => {
        this.setState({
            visible: false,
        });
    }
    // 对话框确认按钮
    onConfirm = (transmit) => {
        let tipType = this.state.tipType;
        if (tipType == 1) {//重新编辑
            // this.reEditPlan();
        } else if (tipType == 2) {//撤回
            this.recall();
        } else if (tipType == 3) {
            this.responseCheck();
        } else if (tipType == 4) {
            this.responseRefuseAndWithDraw();
        } else if (tipType == 5) {
            this.releaseUnCheck()
        } else if (tipType == 6) {
            // this.affirmReEdit();//选定后重新编辑
        } else if (tipType == 7) {
            this.affirmSelect();//确认选择
        }
    }
    // 设置提示信息
    modalFn = (tipType, transmit) => {
        let title = '--', subTitle = '--', tipText = '--';
        switch (tipType) {
            case 1:
                title = '方案编辑';
                subTitle = '确认修改该方案';
                tipText = '';
                break;
            case 2:
                title = '撤回方案';
                subTitle = '确认撤回此方案';
                tipText = '您将撤回此方案，可重新发起新的方案，请确认无误';
                break;
            case 3:
                title = '确认方案';
                subTitle = '确认方案并生成订单';
                tipText = '确认后将不可撤回，请确认无误';
                break;
            case 4:
                title = '拒绝方案';
                subTitle = '拒绝并撤回方案';
                tipText = '您将拒绝并撤回此方案，可重新发起新的方案，请确认无误';
                break;
            case 5:
                title = '撤销方案';
                subTitle = '撤销选择该方案';
                tipText = '您将撤销选择此方案，撤销后可选择其他方案，请确认无误';
                break;
            case 6:
                title = '方案重新编辑';
                subTitle = '确认重新编辑该方案';
                tipText = '';
                break;
            case 7:
                title = '方案选择';
                subTitle = '确认选择该方案';
                tipText = '选定后将不可选择其他方案';
                break;
        }
        this.setState(() => {
            return {
                tipType,
                transmit,
                title,
                subTitle,
                tipText,
            }
        }, () => {
            this.showModal();
        })
    }
    // 用户操作按钮 onClick={this.affirmSelect.bind(this, transmit)} //this.recall.bind(this, transmit
    btnEle(state, responseProgress, isCurrentUserResponsePlan, transmit, demandprogress) {
        if (isCurrentUserResponsePlan === "1") {//意向方按钮 市场
            // 0 - 落选，1 - 正常，2 - 选中，3 - 已撤回，4 - 已删除
            if (state === '1' && responseProgress === '0') {//方案正常,意向征集
                return (
                    <div className={style['user-operation']}>
                        <button className={style['btn-gray']} onClick={this.showVisible_reCall.bind(this, transmit)}>
                            <i className={'iconfont'}>&#xe64a;</i>撤回
                        </button>
                        <button className={style['btn-blue']} onClick={this.reEditPlan.bind(this, transmit)}>
                            <i className={'iconfont'}>&#xe645;</i>重新编辑
                        </button>
                    </div>
                )
            } else if (state === '2' && responseProgress === '1') {// 方案选中 订单确认
                return (
                    <div className={style['user-operation']}>
                        <button className={style['btn-blue-plus']} onClick={this.showVisible_affirm.bind(this, transmit)}>
                            确认方案
                        </button>
                        <button className={style['btn-gray']} onClick={this.showVisible_rejectAndReCall.bind(this, transmit)}>
                            <i className={'iconfont'}>&#xe64a;</i>拒绝并撤回
                        </button>
                    </div>
                )
            }
        } else if (isCurrentUserResponsePlan === "0") {//需求发布方 我的
            // 0 - 落选，1 - 正常，2 - 选中，3 - 已撤回，4 - 已删除
            if (state === '1' && responseProgress === '0' && demandprogress === '1') {//方案正常,意向征集
                return (
                    <div className={style['user-operation']}>
                        <button className={style['btn-blue']} onClick={this.affirmSelect.bind(this, transmit)}>
                            确认选择该方案
                        </button>
                    </div>
                )
            } else if (state === '1' && demandprogress === '2') {
                return (
                    <div className={style['user-operation']}>
                        <button className={style['btn-gray']} style={{ cursor: 'not-allowed' }}>
                            已选定其他方案
                        </button>
                    </div>
                )

            } else if (state === '2' && responseProgress === '1') {// 方案选中 订单确认
                return (
                    <div className={style['user-operation']}>
                        <button className={style['btn-blue']} onClick={this.affirmReEdit.bind(this, transmit)}>
                            重新编辑该方案
                        </button>
                        <button className={style['btn-gray']} onClick={this.showVisible_repeal.bind(this, transmit)}>
                            <i className={'iconfont'}>&#xe64a;</i>撤销选定
                        </button>
                    </div>
                )
            }

        }
    }
    // 时刻要求
    timeRequireStr = (timeRequirements) => {
        let str = '';
        switch (Number(timeRequirements)) {
            case 0: str = '白班'; break;
            case 1: str = '晚班'; break;
            case 2: str = '都接受'; break;
        }
        return str;
    }
    // 航司类型
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
    // 排名图标
    iconColor = (index) => {
        let color = '';
        switch (index) {
            case 0:
                color = '#b9a568'
                break;
            case 1:
                color = '#cccccc'
                break;
            case 2:
                color = '#c38f72'
                break;
            default:
                color = ''
                break;
        }
        return color;
    }
    // 打开聊天窗口
    chatPanel = (fromNameId, toNameId, responsePlanId, event) => {
        emitter.emit('openChat', {
            fromNameId, toNameId, responsePlanId
        });
        event.preventDefault();
        event.stopPropagation();
    }

    // 创建方案折叠面板节点
    createPanelEle() {

        try {
            
        

        let { isMarket, role, demandprogress, planList, demandId } = this.props;

        if (!(planList && planList.length)) {
            let str = '';
            if (role === '1') {
                // if(demandprogress==='3'){
                //     str='需求已关闭'
                // }
                str = isMarket ? '该运力信息暂无响应' : '您提交的航线需求，目前暂无航空公司响应';
            } else if (role === '0') {
                str = isMarket ? '该航线需求暂无响应' : '您提交的运力投放，目前暂无机场响应';
            }
            // str = '暂无方案'
            //暂未收到方案
            return <div style={{ height: '80px', textAlign: 'center', lineHeight: '80px' }}>{str}</div>;
        }
        let c = this.init().style;

        return planList.map((value, index) => {
            let editType = 2;//编辑/响应 1:响应,2:重新编辑,3:确认选择方案,4选择方案后编辑
            //id:意向id responsePlanId:意向方案id,responseId:意向id
            let { id, responseId, airlineType, employeeId, releaseTime, dpt, pst, arrv, fixedSubsidyPrice, bottomSubsidyPrice, airCrftTyp, isCurrentUserResponsePlan, state, responseProgress, canChat, dptTime, pstTime, pstBackTime, arrvTime, quoteType, quotedPrice, contact, iHome, demandprogress, unReadMessageCount, responseEmployeeId, calculationId, calculationRoute, calculationState } = value;

            // 获取航点信息
            let { dptNm, pstNm, arrvNm, dptAirlnCd, pstAirlnCd, arrvAirlnCd } = this.findName(dpt, pst, arrv);

            // 解析时刻对
            let [dptLevel, dptEnter] = dptTime ? dptTime.split(',') : [];
            let [pstLevel, pstEnter] = pstTime ? pstTime.split(',') : [];
            let [arrvLevel, arrvEnter] = arrvTime ? arrvTime.split(',') : [];
            let [pstBackLevel, pstBackEnter] = pstBackTime ? pstBackTime.split(',') : [];

            // 时间
            let time = { dptLevel, dptEnter, pstEnter, pstLevel, arrvEnter, arrvLevel, pstBackEnter, pstBackLevel, dptNm, pstNm, arrvNm, dpt, pst, arrv }

            //属于'我'发布的,或者不属于我发的但我选定了它,可以查看价格
            let mine = (isCurrentUserResponsePlan === '1' && isMarket) || state === '2' ? style['mine'] : '';

            let airline = `${dptNm ? dptNm : ''}-${pstNm ? pstNm + '-' : ''}${arrvNm ? arrvNm : ''}`;

            let price = isCurrentUserResponsePlan === '1' || !isMarket ? ((quoteType === '0' ? '待议' : '') || (quoteType === "1" ? '定补' + quotedPrice + '万/班' : '') || (quoteType === "2" ? '保底' + quotedPrice + '万/时' : '')) : '**';

            // item中需要显示的数据
            let payload = (isCurrentUserResponsePlan === '1' || !isMarket) ? {
                msgicon: '&#xe602;', msgNum: Number(unReadMessageCount), fromNameId: store.getState().role.id, toNameId: '', responsePlanId: id,
            } : {};

            if (isCurrentUserResponsePlan === '1' || isMarket) payload.toNameId = employeeId;

            if (!isMarket) payload.toNameId = responseEmployeeId;

            // 图标排序颜色
            let icon = '', color = '';
            switch (index) {
                case 0: icon = '&#xe66a;'; color = '#e43838'; break;
                case 1: icon = '&#xe66b;'; color = '#f7742e'; break;
                case 2: icon = '&#xe66c;'; color = '#ffb527'; break;
                default: icon = '', color = '';
                    break;
            }

            let filter = {
                style: c,
                params: [
                    { name: 'NO.' + (index + 1), icon: icon, color: color },
                    { name: releaseTime },
                    { name: airline },
                    { name: price, msg: { ...payload } }
                ]
            }


            // 方案中需要的数据
            let scheme = { id, dpt, pst, arrv, dptTime, pstTime, arrvTime, pstBackTime, dptNm, pstNm, arrvNm, price, demandId, responseId, quoteType, quotedPrice, calculationId, calculationRoute, calculationState, responseProgress }
            // 方案详情中的数据
            let info, plans;
            if (role === '1' && isMarket) {
                info = [
                    { name: '机型', value: value.airCrftTyp },
                    { name: '班期', value: value.days },
                    { name: '计划开航时间', value: value.sailingTime },
                    { name: '计划执行', value: value.performShift },
                    { name: '方案有效期', value: value.periodValidity },
                    { name: '时刻要求', value: this.timeRequireStr(value.timeRequirements) },
                    { name: '其他说明', value: value.remark || '无' },
                ]
                plans = <RsAirline rs={scheme} calculate={true} updateDetail={this.props.updateDetail} />

            } else if (role === '1' && !isMarket) {
                if (responseProgress === "0") {
                    editType = 3;
                } else if (responseProgress === "1") {
                    editType = 4;
                }

                info = [
                    { name: '机型', value: value.airCrftTyp },
                    { name: '座位布局', value: value.seating },
                    { name: '运力始发', value: dptAirlnCd },
                    { name: '航司类型', value: this.getAirlineType(airlineType) },
                    { name: '计划开航时间', value: value.sailingTime },
                    { name: '计划执行', value: value.performShift },
                    { name: '方案有效期', value: value.periodValidity },
                    { name: '其他说明', value: value.remark || '无' },
                ]

                plans = <RsTime rs={scheme} calculate={true} updateDetail={this.props.updateDetail} />

            } else if (role === '0' && isMarket) {
                info = [
                    { name: '机型', value: value.airCrftTyp },
                    { name: '座位布局', value: value.seating },
                    { name: '运力始发', value: dptAirlnCd },
                    { name: '航司类型', value: this.getAirlineType(airlineType) },
                    { name: '计划开航时间', value: value.sailingTime },
                    { name: '计划执行', value: value.performShift },
                    { name: '方案有效期', value: value.periodValidity },
                    { name: '班期', value: value.days },
                    { name: '其他说明', value: value.remark || '无' },
                ]
                plans = <RsTime rs={scheme} calculate={false} />

            } else if (role === '0' && !isMarket) {
                if (responseProgress === "0") {
                    editType = 3;
                } else if (responseProgress === "1") {
                    editType = 4;
                }

                info = [
                    { name: '机型', value: value.airCrftTyp },
                    { name: '班期', value: value.days },
                    { name: '计划开航时间', value: value.sailingTime },
                    { name: '计划执行', value: value.performShift },
                    { name: '方案有效期', value: value.periodValidity },
                    { name: '时刻要求', value: this.timeRequireStr(value.timeRequirements) },
                    { name: '其他说明', value: value.remark || '无' },
                ]
                plans = <RsAirline rs={scheme} calculate={false} />

            }

            // 联系方式
            let contactInfo = isCurrentUserResponsePlan === '1' || !isMarket ? [
                { name: '联系人', value: contact },
                { name: '联系电话', value: iHome },
            ] : null;

            let transaction = (responseProgress === '5' || responseProgress === '6' || responseProgress === '7') && state === '2' ? true : false;//交易完成//订单完成//佣金支付
            let affirmWord = responseProgress === '1' && state === '2' ? true : false;//订单确认


            let transmit = {
                id,//方案id
                responseId, //响应id
                demandId, //需求id
                dpt, //始发
                editType,//表单类型
            }

            let items = this.createItem(filter, mine, transaction, affirmWord);

            let disabled = (isCurrentUserResponsePlan === "1" && isMarket) || (isCurrentUserResponsePlan === "0" && !isMarket);

            let airlineTime = (role === '1' && isMarket) || (role === '0' && !isMarket) ? true : false;// 机场-市场/航司-我的 显示时间
            // id + "" + 
            return (
                <Panel showArrow={false} style={customPanelStyle} key={id + "" + index} disabled={!(disabled ? true : false)} header={items}
                >
                    {
                        disabled ?
                            (
                                <div className={style['rs-scheme']}>
                                    {plans}
                                    <PlanInfo
                                        info={info}
                                        time={airlineTime && isCurrentUserResponsePlan && state === '2' ? time : null}
                                        contact={contactInfo} />
                                    {this.btnEle(state, responseProgress, isCurrentUserResponsePlan, transmit, demandprogress)}
                                </div>
                            ) : ''
                    }
                </Panel>
            );
        })
        } catch (error) {
            console.log(error)
        }

    }
    // 创建子项节点
    createItem(filter, classname, transaction = false, affirmWord = false) {
        let c = style[filter.style];//获取样式
        function createMarkup(msg) {
            if (!msg) {
                return;
            }
            return { __html: msg }
        }
        return (
            <div className={`${style['rs-item']} ${style['common-item']} ${classname}`}>
                {
                    filter.params.map((value, index) => {
                        let { name, icon, color, msg = {} } = value;
                        let { msgicon, msgNum, fromNameId, toNameId, responsePlanId } = msg;

                        let span = <span>{name ? name : ''}</span>;
                        // 根据参数 创建图标 msg:是否有通知,icon:图标代码 site:图标位置
                        let iEle = color ? (
                            <span style={{ zIndex: 50 }}>

                                <i className={'iconfont'} dangerouslySetInnerHTML={createMarkup(icon)} style={{ color: color }}></i>
                            </span>
                        ) : '';
                        let iMsgEle = msgicon ? (
                            <span style={{ zIndex: 50, position: 'absolute', right: 0 }} className={msgNum ? style['active'] : ''} onClick={this.chatPanel.bind(this, fromNameId, toNameId, responsePlanId)}>
                                <i className={'iconfont'} dangerouslySetInnerHTML={createMarkup(msgicon)}></i>
                            </span>
                        ) : '';
                        return (
                            <div key={index}> {iEle} {span} {iMsgEle} </div>
                        )
                    })
                }
                {
                    transaction ? <span className={`iconfont ${style['tip-icon']}`}>&#xe662;</span> : ''
                }
                {
                    affirmWord && <span className={`iconfont ${style['tip-icon']}`}>&#xe661;</span>
                }
            </div>
        )
    }

    // 折叠面板点击切换后,激活对应卡片
    panelChange = (key) => {
        this.setState({
            defaultActiveKey: key,
        })
        // 调用父组件的方法 更新key
        this.props.upPanelKey(key)
    }

    // 设置transmit于state中
    setTransmit = (transmit, callback) => {
        this.setState(() => {
            return {
                transmit
            }
        }, () => {
            callback()
        })
    }
    // 关闭loading动画
    unLoadingFn = () => {
        this.setState(() => {
            return {
                uploading: false,
            }
        })
    }
    // 开启loading动画
    uploadingFn = (callback) => {
        this.setState(() => {
            return {
                uploading: true,
            }
        }, () => {
            callback()
        })
    }

    //显示撤回二次确认框
    showVisible_reCall = (transmit) => {
        this.setTransmit(transmit, () => {
            this.setState(() => {
                return {
                    visible_reCall: true,
                }
            })
        })

    }
    //隐藏撤回二次确认框
    hideVisible_reCall = () => {
        this.setState(() => {
            return {
                visible_reCall: false,
            }
        })
    }
    // 确认撤回执行
    option_reCall = () => {
        console.log('撤回')
        // return;
        this.uploadingFn(() => {
            let transmit = this.state.transmit;
            let role = store.getState().role.role;
            if (role === "1") {//机场撤回意向
                Axios({
                    url: 'withdrawResponsePlanByAirPort',
                    method: 'post',
                    params: {
                        planId: transmit.id
                    },
                    timeout: 10000,
                }).then((response) => {
                    this.unLoadingFn()

                    if (response.data.opResult === '0') {
                        this.success({
                            title: '成功撤回该方案',
                        })
                        emitter.emit('renewDataFn');
                    } else {
                        this.error({
                            title: response.data.msg,
                        })
                    }
                })
            } else if (role === "0") {//航司撤回意向
                Axios({
                    url: 'withdrawResponseByHangsi',
                    method: 'post',
                    params: {
                        id: transmit.responseId
                    },
                    timeout: 10000,
                }).then((response) => {
                    this.unLoadingFn();

                    if (response.data.opResult === '0') {
                        this.success({
                            title: '撤回方案成功',
                        })
                        emitter.emit('renewDataFn');
                    } else {
                        this.error({
                            title: response.data.msg,
                        })
                    }
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
        if (i == 1) {  // 1:验证成功-关闭，2：点击“取消”关闭
            this.option_affirm();
        } else if (i == 2) {
            this.hidePay();
        }
    }
    // 忘记密码
    forgetPwd = () => {  // 忘记密码

    }
    affirmAction = () => {
        this.showPay();
        this.hideVisible_affirm();
    }
    //显示确认方案二次确认框
    showVisible_affirm = (transmit) => {
        this.setTransmit(transmit, () => {
            this.setState(() => {
                return {
                    visible_affirm: true,
                }
            })
        })

    }
    //隐藏确认方案二次确认框
    hideVisible_affirm = () => {
        this.setState(() => {
            return {
                visible_affirm: false,
            }
        })
    }
    option_affirm = () => {
        console.log('确认方案');
        // return;
        this.hidePay();
        this.uploadingFn(() => {

            let transmit = this.state.transmit
            Axios({
                url: 'responseCheck',
                method: 'post',
                params: {
                    planId: transmit.id
                },
                timeout: 10000,
            }).then((response) => {

                this.unLoadingFn();

                if (response.data.opResult === '0') {
                    let { demandId } = this.state;
                    Modal.success({
                        title: '确认选择方案成功，已生成订单，请联系对方签约！',
                        onOk() {
                            window.location.href = `#/userCenter/demandId=${demandId}`;
                        }
                    });
                    this.props.updateDetail();
                } else {
                    this.error({
                        title: response.data.msg,
                    })
                }
            })

        })
    }

    //显示 拒绝并撤回 方案二次确认框
    showVisible_rejectAndReCall = (transmit) => {
        this.setTransmit(transmit, () => {
            this.setState(() => {
                return {
                    visible_rejectAndReCall: true,
                }
            })
        })

    }
    //隐藏 拒绝并撤回 方案二次确认框
    hideVisible_rejectAndReCall = () => {
        this.setState(() => {
            return {
                visible_rejectAndReCall: false,
            }
        })
    }
    option_rejectAndReCall = () => {
        console.log('拒绝并撤回');
        // return;

        this.uploadingFn(() => {
            let transmit = this.state.transmit
            Axios({
                url: 'responseRefuseAndWithDraw',
                method: 'post',
                params: {
                    planId: transmit.id
                },
                timeout: 10000,
            }).then((response) => {

                this.unLoadingFn();

                if (response.data.opResult === '0') {
                    this.success({
                        title: '拒绝并撤回方案成功',
                    })
                    emitter.emit('renewDataFn');
                } else {
                    this.error({
                        title: response.data.msg,
                    })
                }
            })

        })
    }


    //显示撤销方案二次确认框
    showVisible_repeal = (transmit) => {
        this.setTransmit(transmit, () => {
            this.setState(() => {
                return {
                    visible_repeal: true,
                }
            })
        })

    }
    //隐藏撤销方案二次确认框
    hideVisible_repeal = () => {
        this.setState(() => {
            return {
                visible_repeal: false,
            }
        })
    }
    option_repeal = () => {
        console.log('撤销方案');
        // return;
        this.uploadingFn(() => {
            let transmit = this.state.transmit
            Axios({
                url: 'releaseUnCheck',
                method: 'post',
                params: {
                    planId: transmit.id
                },
                timeout: 10000,
            }).then((response) => {
                this.unLoadingFn();

                if (response.data.opResult === '0') {
                    this.success({
                        title: '取消选定方案成功',
                    })
                } else {
                    this.error({
                        title: response.data.msg,
                    })
                }
            })

        })
    }


    render() {
        return (
            <div className={style['received-scheme']} ref={'rs-con'}>
                {/* table头部 */}
                <div ref={'rs-title'}>
                    {this.createItem(this.init())}
                </div>

                {/* table内容 */}
                <div className={`${style['rs-con']} scroll`} ref={'rs-body'}>
                    <Collapse accordion bordered={false} defaultActiveKey={this.state.defaultActiveKey} activeKey={this.state.defaultActiveKey} onChange={this.panelChange} style={{ overflowY: 'auto', height: 'inherit' }}>
                        {this.createPanelEle()}
                    </Collapse>
                </div>

                {/* <Confirmations
                    title={this.state.title} subTitle={this.state.subTitle} tipText={this.state.tipText}
                    visible={this.state.visible} onOk={this.onConfirm} onCancel={this.hideModal} /> */}

                <Confirmations
                    title={'撤回方案'} subTitle={'确认撤回此方案'} tipText={'您将撤回此方案，可重新发起新的方案，请确认无误'}
                    visible={this.state.visible_reCall}
                    onOk={this.option_reCall}
                    onCancel={this.hideVisible_reCall}
                    uploading={this.state.uploading} />
                <Confirmations
                    title={'确认方案'} subTitle={'确认方案并生成订单'} tipText={'确认后将不可撤回，请确认无误'}
                    visible={this.state.visible_affirm}
                    onOk={this.affirmAction}
                    onCancel={this.hideVisible_affirm}
                    uploading={this.state.uploading} />
                <Confirmations
                    title={'拒绝方案'} subTitle={'拒绝并撤回方案'} tipText={'您将拒绝并撤回此方案，可重新发起新的方案，请确认无误'}
                    visible={this.state.visible_rejectAndReCall}
                    onOk={this.option_rejectAndReCall}
                    onCancel={this.hideVisible_rejectAndReCall}
                    uploading={this.state.uploading} />
                <Confirmations
                    title={'撤销方案'} subTitle={'撤销选择该方案'} tipText={'您将撤销选择此方案，撤销后可选择其他方案，请确认无误'}
                    visible={this.state.visible_repeal}
                    onOk={this.option_repeal}
                    onCancel={this.hideVisible_repeal}
                    uploading={this.state.uploading} />

                {this.state.showDealPwd ? <div style={{
                    height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, background: 'rgba(0, 0, 0, 0.2)', zIndex: 300
                }}>
                    <DealPwd close={this.dealCloseFn} forgetPwd={this.forgetPwd} />
                </div> : ''}

            </div>
        )
    }
}