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
import { inherits } from 'util';

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
            defaultActiveKey: " ",
            transmit: null,
        }
    }
    componentWillMount() {
        this.init();
    }
    componentWillReceiveProps(nextprops) {
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
            let transmit = {
                id
            };
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
        this.props.getThis.updateData();
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
    handleSchemeBtnClick = () => {
        this.hideModal();
        let transmit = this.state.transmit || {};
        let popupType = 0;
        if (store.getState().role.role === '1') {//机场
            if (this.props.tab) {//市场
                popupType = 2;
            } else {//我的
                popupType = 1;
            }
        } else {//航司
            if (this.props.tab) {
                popupType = 1;
            } else {
                popupType = 2;
            }
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
    reEditBtnClick = () => {
        let transmit = this.state.transmit || {};
        let popupType = 0;
        if (store.getState().role.role === '1') {//机场
            if (this.props.tab) {//市场
                popupType = 2;
            } else {//我的
                popupType = 1;
            }
        } else {//航司
            if (this.props.tab) {
                popupType = 1;
            } else {
                popupType = 2;
            }
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
    handleSchemeBtnClick = (transmit) => {
        let popupType = 0;
        if (store.getState().role.role === '1') {//机场
            if (this.props.tab) {//市场
                popupType = 2;
            } else {//我的
                popupType = 1;
            }
        } else {//航司
            if (this.props.tab) {
                popupType = 1;
            } else {
                popupType = 2;
            }
        }
        transmit.bianjiOrNot = true;  // 是否是点击“重新编辑”true：重新编辑，false：我要洽谈
        emitter.emit('openPopup', {
            popupType: popupType,
            popupMes: {
                transmit,
            }
        })
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
    // 需求发布方取消选定方案需求发布方取消选定方案
    releaseUnCheck() {
        let transmit = this.state.transmit
        Axios({
            url: 'releaseUnCheck',
            method: 'post',
            params: {
                planId: transmit.id
            }
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
        let transmit = this.state.transmit
        Axios({
            url: 'responseCheck',
            method: 'post',
            params: {
                planId: transmit.id
            }
        }).then((response) => {
            if (response.data.opResult === '0') {
                this.success({
                    title: '确认选择方案成功，已生成订单，请及时联系对方签约！',
                })
            } else {
                this.error({
                    title: response.data.msg,
                })
            }
        })
        this.hideModal();
    }
    // 拒绝并撤回
    responseRefuseAndWithDraw(transmit) {
        Axios({
            url: 'responseRefuseAndWithDraw',
            method: 'post',
            params: {
                planId: this.state.transmit.id
            }
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
        this.hideModal();
    }
    // 撤回选定前的方案/意向
    recall() {
        let transmit = this.state.transmit;
        let role = store.getState().role.role;
        if (role === "1") {//机场撤回意向
            Axios({
                url: 'withdrawResponsePlanByAirPort',
                method: 'post',
                params: {
                    planId: transmit.id
                }
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
            this.hideModal();
        } else if (role === "0") {//航司撤回意向
            Axios({
                url: 'withdrawResponseByHangsi',
                method: 'post',
                params: {
                    id: transmit.responseId
                }
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
                this.hideModal();
            })
        }
        this.hideModal();
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
        let tipType = this.state.tipType;
        if (tipType == 1) {//重新编辑
            this.reEditBtnClick();
        } else if (tipType == 2) {//撤回
            this.recall();
        } else if (tipType == 3) {
            this.responseCheck();
        } else if (tipType == 4) {
            this.responseRefuseAndWithDraw();
        } else if (tipType == 5) {
            this.releaseUnCheck()
        }
    }
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
                subTitle = '撤销选定方案';
                tipText = '您将撤销选定此方案，撤销后可重新选择其他方案，请确认无误';
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
    // 用户操作按钮 onClick={this.handleSchemeBtnClick.bind(this, transmit)} //this.recall.bind(this, transmit
    btnEle(state, responseProgress, isCurrentUserResponsePlan, transmit, demandprogress) {
        if (isCurrentUserResponsePlan === "1") {//意向方按钮 市场
            // 0 - 落选，1 - 正常，2 - 选中，3 - 已撤回，4 - 已删除
            if (state === '1' && responseProgress === '0') {//方案正常,意向征集
                return (
                    <div className={style['user-operation']}>
                        <button className={style['btn-gray']} onClick={this.modalFn.bind(this, 2, transmit)}>
                            <i className={'iconfont'}>&#xe64a;</i>撤回
                        </button>
                        <button className={style['btn-blue']} onClick={this.modalFn.bind(this, 1, transmit)}>
                            <i className={'iconfont'}>&#xe645;</i>重新编辑
                        </button>
                    </div>
                )
            } else if (state === '2' && responseProgress === '1') {// 方案选中 订单确认
                return (
                    <div className={style['user-operation']}>
                        <button className={style['btn-blue-plus']} onClick={this.modalFn.bind(this, 3, transmit)}>
                            确认方案
                        </button>
                        <button className={style['btn-gray']} onClick={this.modalFn.bind(this, 4, transmit)}>
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
                        <button className={style['btn-blue']} onClick={this.handleSchemeBtnClick.bind(this, transmit)}>
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
                        <button className={style['btn-blue']} onClick={this.handleSchemeBtnClick.bind(this, transmit)}>
                            重新编辑该方案
                        </button>
                        <button className={style['btn-gray']} onClick={this.modalFn.bind(this, 5, transmit)}>
                            <i className={'iconfont'}>&#xe64a;</i>撤销选定
                        </button>
                    </div>
                )
            }

        }
    }
    chatPanel(fromNameId, toNameId, responsePlanId, event) {
        emitter.emit('openChat', {
            fromNameId, toNameId, responsePlanId
        });
        event.preventDefault();
        event.stopPropagation();
    }
    // 创建子项节点
    createItem(filter, classname) {
        let c = style[filter.style];//获取样式
        function createMarkup(msg) {
            if (!msg) {
                return;
            }
            return { __html: msg }
        }
        let btn = (
            <div className={style['sort-item']}>
                <button>
                    <i className={'iconfont'}>&#xe605;</i>
                </button>
                <button>
                    <i className={'iconfont'}>&#xe605;</i>
                </button>
            </div>
        )
        return (
            <div className={`${style['rs-item']} ${style['common-item']} ${classname}`}>
                {
                    filter.params.map((value, index) => {
                        let { name, sort, icon, msg, site, color, fromNameId, toNameId, responsePlanId } = value;

                        // TODO: 不显示未读消息数
                        msg = false;

                        let span = <span>{name ? name : ''}</span>;
                        // 根据参数 创建图标 msg:是否有通知,icon:图标代码 site:图标位置
                        let iEle = color != '' ? (
                            <span onClick={this.chatPanel.bind(this, fromNameId, toNameId, responsePlanId)} className={msg ? style['active'] : ''} style={{ zIndex: 1000 }}>
                                <i className={'iconfont'}
                                    dangerouslySetInnerHTML={createMarkup(icon)} style={{ color: color }}></i>
                            </span>
                        ) : '';
                        return (
                            <div key={index}>
                                {icon && site == 'before' ? iEle : ''}
                                {span}
                                {sort ? btn : ''}
                                {icon && site == 'after' ? iEle : ''}
                            </div>
                        )
                    })
                }
            </div>
        )
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
    // 创建方案折叠面板节点
    createPanel() {
        if (!(this.props.rs && this.props.rs.length)) return;

        let demandId = this.props.demandId.id;//需求id
        // 样式类型
        let type = this.props.type;
        // 使用样式
        let c = this.init().style;

        let cityList = store.getState().cityList;

        let editType = 2;//编辑/响应 1:响应,2:重新编辑,3:确认选择方案,4选择方案后编辑

        if (type == 1) {// 机场-市场-收到的方案
            return this.props.rs.map((value, index) => {
                // 结构获得的数据
                //id:意向id
                let { id, responseId, employeeId, releaseTime, dpt, pst, arrv, fixedSubsidyPrice, bottomSubsidyPrice, airCrftTyp, isCurrentUserResponsePlan, state, responseProgress, canChat, dptTime, pstTime, pstBackTime, arrvTime, quoteType, quotedPrice, contact, iHome, demandprogress, unReadMessageCount } = value;

                let { dptNm, pstNm, arrvNm } = this.findName(dpt, pst, arrv);

                let dptLevel = dptTime ? dptTime.split(',')[0] : '',
                    dptEnter = dptTime ? dptTime.split(',')[1] : '',
                    pstLevel = pstTime ? pstTime.split(',')[0] : '',
                    pstEnter = pstTime ? pstTime.split(',')[1] : '',
                    arrvLevel = arrvTime ? arrvTime.split(',')[0] : '',
                    arrvEnter = arrvTime ? arrvTime.split(',')[1] : '',
                    pstBackLevel = pstBackTime ? pstBackTime.split(',')[0] : '',
                    pstBackEnter = pstBackTime ? pstBackTime.split(',')[1] : '';

                let time = { dptLevel, dptEnter, pstEnter, pstLevel, arrvEnter, arrvLevel, pstBackEnter, pstBackLevel, dptNm, pstNm, arrvNm, dpt, pst, arrv }

                let mine = isCurrentUserResponsePlan === '1' ? style['mine'] : '';

                let airline = `${dptNm ? dptNm : ''}-${pstNm ? pstNm + '-' : ''}${arrvNm ? arrvNm : ''}`;

                let price = isCurrentUserResponsePlan === '1' ? ((quoteType === '0' ? '待议' : '') || (quoteType === "1" ? '定补' + quotedPrice + '万/班' : '') || (quoteType === "2" ? '保底' + quotedPrice + '万/时' : '')) : '**';

                // item中需要显示的数据
                let payload = isCurrentUserResponsePlan === '1' ? {
                    icon: '&#xe602;', msg: Number(unReadMessageCount), site: 'after', fromNameId: store.getState().role.id, toNameId: employeeId, responsePlanId: id,
                } : {};
                let filter = {
                    style: c,
                    params: [
                        { name: 'NO.' + (index + 1), icon: '&#xe63f;', site: 'before', color: this.iconColor(index) },
                        { name: releaseTime },
                        { name: airline, ...payload },
                        { name: price }
                    ]
                }
                // 方案中需要的数据
                let scheme = { id, dpt, dptNm, pst, pstNm, arrv, arrvNm, price, demandId, responseId }
                // 方案详情中的数据
                let info = [
                    { name: '机型', value: value.airCrftTyp },
                    { name: '班期', value: value.days },
                    { name: '计划开航时间', value: value.sailingTime },
                    { name: '计划执行', value: value.performShift },
                    { name: '方案有效期', value: value.periodValidity },
                    { name: '时刻要求', value: this.timeRequireStr(value.timeRequirements) },
                    { name: '待议说明', value: value.remark || '无' },
                ]
                // 联系方式
                let contactInfo = isCurrentUserResponsePlan === '1' ? [
                    { name: '联系人', value: contact },
                    { name: '联系电话', value: iHome },
                ] : null;

                let transmit = {
                    id, demandId, dpt, editType,

                }

                let items = this.createItem(filter, mine);
                let tab = this.props.tab //'market' || 'mine'
                return (
                    <Panel showArrow={false} style={customPanelStyle} key={id + "" + index}
                        header={items}
                        disabled={!((isCurrentUserResponsePlan === "1" && this.props.tab) ? true : false)}>
                        {
                            isCurrentUserResponsePlan === "1" && this.props.tab ?
                                (
                                    <div className={style['rs-scheme']}>
                                        <RsAirline rs={scheme} calculate={true} />
                                        <PlanInfo
                                            info={info}
                                            time={isCurrentUserResponsePlan && state === '2' ? time : null}
                                            contact={contactInfo} />
                                        {this.btnEle(state, responseProgress, isCurrentUserResponsePlan, transmit)}
                                    </div>
                                ) : ''
                        }
                    </Panel>
                );
            })
        } else if (type == 2) {// 机场-我的-收到的方案
            return this.props.rs.map((value, index) => {
                let { id, responseId, responseEmployeeId, releaseTime, dpt, pst, arrv, fixedSubsidyPrice, bottomSubsidyPrice, airCrftTyp, isCurrentUserResponsePlan, state, responseProgress, canChat, dptTime, pstTime, pstBackTime, arrvTime, quoteType, quotedPrice, contact, iHome, demandprogress, unReadMessageCount } = value;

                let { dptNm, pstNm, arrvNm } = this.findName(dpt, pst, arrv);

                let dptLevel = dptTime ? dptTime.split(',')[0] : '',
                    dptEnter = dptTime ? dptTime.split(',')[1] : '',
                    pstLevel = pstTime ? pstTime.split(',')[0] : '',
                    pstEnter = pstTime ? pstTime.split(',')[1] : '',
                    arrvLevel = arrvTime ? arrvTime.split(',')[0] : '',
                    arrvEnter = arrvTime ? arrvTime.split(',')[1] : '',
                    pstBackLevel = pstBackTime ? pstBackTime.split(',')[0] : '',
                    pstBackEnter = pstBackTime ? pstBackTime.split(',')[1] : '';

                let time = { dptLevel, dptEnter, pstEnter, pstLevel, arrvEnter, arrvLevel, pstBackEnter, pstBackLevel, dptNm, pstNm, arrvNm, dpt, pst, arrv }

                // isCurrentUserResponsePlan='1';

                let mine = isCurrentUserResponsePlan === '1' || state === '2' ? style['mine'] : '';

                let airline = `${dptNm ? dptNm : ''}-${pstNm ? pstNm + '-' : ''}${arrvNm ? arrvNm : ''}`;

                let price = '';

                if (this.props.tab) {
                    price = isCurrentUserResponsePlan === '1' ? ((quoteType === '0' ? '待议' : '') || (quoteType === "1" ? '定补' + quotedPrice + '万/班' : '') || (quoteType === "2" ? '保底' + quotedPrice + '万/时' : '')) : '**';
                } else {
                    price = (quoteType === '0' ? '待议' : '') || (quoteType === "1" ? '定补' + quotedPrice + '万/班' : '') || (quoteType === "2" ? '保底' + quotedPrice + '万/时' : '');
                }

                let filter = {
                    style: c,
                    params: [
                        { name: 'NO.' + (index + 1), icon: '&#xe63f;', site: 'before', color: this.iconColor(index) },
                        { name: releaseTime },
                        { name: airline, icon: '&#xe602;', site: 'after', msg: Number(unReadMessageCount), fromNameId: store.getState().role.id, toNameId: responseEmployeeId, responsePlanId: id },
                        { name: price }
                    ]
                }
                // 方案中需要的数据
                let scheme = {
                    dpt, pst, arrv, dptTime, pstTime, arrvTime, pstBackTime, price, dptNm, pstNm, arrvNm, demandId, responseId, id
                }
                // let scheme = { id, dpt, dptNm, pst, pstNm, arrv, arrvNm, fixedSubsidyPrice, bottomSubsidyPrice, }
                // 方案详情中的数据
                let info = [
                    { name: '机型', value: value.airCrftTyp },
                    { name: '班期', value: value.days },
                    { name: '计划开航时间', value: value.sailingTime },
                    { name: '计划执行', value: value.performShift },
                    { name: '方案有效期', value: value.periodValidity },
                    { name: '时刻要求', value: this.timeRequireStr(value.timeRequirements) },
                    { name: '其他说明', value: value.remark || '无' },
                ]

                // 联系方式
                let contactInfo = [
                    { name: '联系人', value: contact },
                    { name: '联系电话', value: iHome },
                ] || null;

                // 根据响应状态判断类型
                if (responseProgress === "0") {
                    editType = 3;
                } else if (responseProgress === "1") {
                    editType = 4;
                }
                // 构建需要传递的数据
                // let responseId = id;
                let transmit = {
                    id, responseId, dpt, editType,
                }

                let items = this.createItem(filter, mine);
                return (
                    <Panel showArrow={false} style={customPanelStyle} key={id + "" + index}
                        header={items} disabled={!(!this.props.tab ? true : false)}>
                        {
                            !this.props.tab ?
                                (
                                    <div className={style['rs-scheme']}>
                                        <RsTime rs={scheme} calculate={true} />
                                        <PlanInfo info={info}
                                            // time={isCurrentUserResponsePlan && responseProgress === '6' ? time : null}
                                            contact={contactInfo} />
                                        {this.btnEle(state, responseProgress, isCurrentUserResponsePlan, transmit, demandprogress)}
                                    </div>
                                ) : ''
                        }
                    </Panel>
                );
            })
        } else if (type == 3) {// 航司-市场-收到的方案
            return this.props.rs.map((value, index) => {
                let { id, responseId, employeeId, dpt, pst, arrv, releaseTime, fixedSubsidyPrice, bottomSubsidyPrice, isCurrentUserResponsePlan, airlineType, state, responseProgress, canChat, dptTime, pstTime, pstBackTime, arrvTime, quoteType, quotedPrice, contact, iHome, unReadMessageCount } = value;

                let { dptNm, pstNm, arrvNm, dptAirlnCd, pstAirlnCd, arrvAirlnCd } = this.findName(dpt, pst, arrv);

                let dptLevel = dptTime ? dptTime.split(',')[0] : '',
                    dptEnter = dptTime ? dptTime.split(',')[1] : '',
                    pstLevel = pstTime ? pstTime.split(',')[0] : '',
                    pstEnter = pstTime ? pstTime.split(',')[1] : '',
                    arrvLevel = arrvTime ? arrvTime.split(',')[0] : '',
                    arrvEnter = arrvTime ? arrvTime.split(',')[1] : '',
                    pstBackLevel = pstBackTime ? pstBackTime.split(',')[0] : '',
                    pstBackEnter = pstBackTime ? pstBackTime.split(',')[1] : '';

                let time = { dptLevel, dptEnter, pstEnter, pstLevel, arrvEnter, arrvLevel, pstBackEnter, pstBackLevel, dptNm, pstNm, arrvNm, dpt, pst, arrv }

                let mine = isCurrentUserResponsePlan === '1' ? style['mine'] : '';

                let airline = `${dptNm ? dptNm : ''}-${pstNm ? pstNm + '-' : ''}${arrvNm ? arrvNm : ''}`;

                let price = isCurrentUserResponsePlan === '1' ? ((quoteType === '0' ? '待议' : '') || (quoteType === "1" ? '定补' + quotedPrice + '万/班' : '') || (quoteType === "2" ? '保底' + quotedPrice + '万/时' : '')) : '**';

                // item中需要显示的数据
                let payload = isCurrentUserResponsePlan === '1' ? {
                    icon: '&#xe602;', msg: Number(unReadMessageCount), site: 'after', fromNameId: store.getState().role.id, toNameId: employeeId, responsePlanId: id,
                } : {};
                let filter = {
                    style: c,
                    params: [
                        { name: 'NO.' + (index + 1), icon: '&#xe63f;', site: 'before', color: this.iconColor(index) },
                        { name: releaseTime },
                        { name: airline, ...payload },
                        { name: price }
                    ]
                }
                let transmit = {
                    id, dpt, editType, demandId, responseId,
                }

                let items = this.createItem(filter, mine);
                let info = [
                    { name: '机型', value: value.airCrftTyp },
                    { name: '座位布局', value: value.seating },
                    { name: '运力始发', value: dptAirlnCd },
                    { name: '航司类型', value: this.getAirlineType(airlineType) },
                    { name: '计划开航时间', value: value.sailingTime },
                    { name: '计划执行', value: value.performShift },
                    { name: '运力有效期', value: value.periodValidity },
                    { name: '班期', value: value.days },
                    { name: '其他说明', value: value.remark || '无' },
                ]
                // 联系方式
                let contactInfo = isCurrentUserResponsePlan === "1" ? [
                    { name: '联系人', value: contact },
                    { name: '联系电话', value: iHome },
                ] : null;

                let scheme = { id, dpt, pst, arrv, dptTime, pstTime, arrvTime, pstBackTime, demandId, responseId, price, quoteType, quotedPrice }

                return (
                    <Panel showArrow={false} style={customPanelStyle} key={id + "" + index}
                        header={items}
                        disabled={!((isCurrentUserResponsePlan === "1" && this.props.tab) ? true : false)}>
                        {
                            isCurrentUserResponsePlan === "1" && this.props.tab ?
                                (
                                    <div className={style['rs-scheme']}>
                                        <RsTime rs={scheme} calculate={false} />
                                        <PlanInfo info={info}
                                            // time={isCurrentUserResponsePlan && responseProgress === '6' ? time : null}
                                            contact={contactInfo} />
                                        {this.btnEle(state, responseProgress, isCurrentUserResponsePlan, transmit)}
                                    </div>
                                ) : ''
                        }
                    </Panel>
                );
            })
        } else if (type == 4) {// 航司-我的-收到的方案
            let demandId = this.props.demandId.id;//需求id
            return this.props.rs.map((value, index) => {
                let { id, responseId, responseEmployeeId, releaseTime, dpt, pst, arrv, fixedSubsidyPrice, bottomSubsidyPrice, airCrftTyp, isCurrentUserResponsePlan, state, responseProgress, canChat, dptTime, pstTime, pstBackTime, arrvTime, quoteType, quotedPrice, contact, iHome, demandprogress, unReadMessageCount } = value;


                let { dptNm, pstNm, arrvNm } = this.findName(dpt, pst, arrv);

                let dptLevel = dptTime ? dptTime.split(',')[0] : '',
                    dptEnter = dptTime ? dptTime.split(',')[1] : '',
                    pstLevel = pstTime ? pstTime.split(',')[0] : '',
                    pstEnter = pstTime ? pstTime.split(',')[1] : '',
                    arrvLevel = arrvTime ? arrvTime.split(',')[0] : '',
                    arrvEnter = arrvTime ? arrvTime.split(',')[1] : '',
                    pstBackLevel = pstBackTime ? pstBackTime.split(',')[0] : '',
                    pstBackEnter = pstBackTime ? pstBackTime.split(',')[1] : '';
                let time = { dptLevel, dptEnter, pstEnter, pstLevel, arrvEnter, arrvLevel, pstBackEnter, pstBackLevel, dptNm, pstNm, arrvNm, dpt, pst, arrv }

                // isCurrentUserResponsePlan = '1';

                let mine = isCurrentUserResponsePlan === '1' || state === '2' ? style['mine'] : '';

                let airline = `${dptNm ? dptNm : ''}-${pstNm ? pstNm + '-' : ''}${arrvNm ? arrvNm : ''}`;

                let price = '';

                if (this.props.tab) {
                    price = isCurrentUserResponsePlan === '1' ? ((quoteType === '0' ? '待议' : '') || (quoteType === "1" ? '定补' + quotedPrice + '万/班' : '') || (quoteType === "2" ? '保底' + quotedPrice + '万/时' : '')) : '**';
                } else {
                    price = (quoteType === '0' ? '待议' : '') || (quoteType === "1" ? '定补' + quotedPrice + '万/班' : '') || (quoteType === "2" ? '保底' + quotedPrice + '万/时' : '');
                }

                // let price = isCurrentUserResponsePlan === '1' ? `${(quoteType === '1' ? '定补' : '') || (quoteType === '2' ? '保底' : '')} ${quotedPrice ? quotedPrice + ' 万' : ''}` : '***';

                let filter = {
                    style: c,
                    params: [
                        { name: 'NO.' + (index + 1), icon: '&#xe63f;', site: 'before', color: this.iconColor(index) },
                        { name: releaseTime },
                        { name: airline, icon: '&#xe602;', site: 'after', msg: Number(unReadMessageCount), fromNameId: store.getState().role.id, toNameId: responseEmployeeId, responsePlanId: id },
                        { name: price }
                    ]
                }
                // 方案中需要的数据
                let scheme = {
                    dpt, pst, arrv, dptTime, pstTime, arrvTime, pstBackTime, price, dptNm, pstNm, arrvNm
                }
                // 方案详情中的数据
                let info = [
                    { name: '机型', value: value.airCrftTyp },
                    { name: '班期', value: value.days },
                    { name: '计划开航时间', value: value.sailingTime },
                    { name: '计划执行', value: value.performShift },
                    { name: '方案有效期', value: value.periodValidity },
                    { name: '时刻要求', value: this.timeRequireStr(value.timeRequirements) },
                    { name: '其他说明', value: value.remark || '无' },
                ]
                // 联系方式
                let contactInfo = [
                    { name: '联系人', value: contact },
                    { name: '联系电话', value: iHome },
                ] || null;
                // 根据响应状态判断类型
                if (responseProgress === "0") {
                    editType = 3;
                } else if (responseProgress === "1") {
                    editType = 4;
                }
                // 构建需要传递的数据
                let transmit = {
                    id, dpt, editType, demandId, responseId
                }

                let items = this.createItem(filter, mine);

                return (
                    <Panel showArrow={false} style={customPanelStyle} key={id + "" + index}
                        header={items} disabled={!(!this.props.tab ? true : false)}>
                        {
                            !this.props.tab ?
                                (
                                    <div className={style['rs-scheme']}>
                                        <RsAirline rs={scheme} calculate={false} />
                                        <PlanInfo info={info}
                                            time={isCurrentUserResponsePlan && state === '2' && (responseProgress === '1' || responseProgress === '6' || responseProgress === '7' || responseProgress === '5') ? time : null}
                                            contact={contactInfo} />
                                        {this.btnEle(state, responseProgress, isCurrentUserResponsePlan, transmit, demandprogress)}
                                    </div>
                                ) : ''
                        }
                    </Panel>
                );
            })
        }


    }
    // 创建收到方案节点
    createPlanEle() {
        if (this.props.rs) {
            // this.createItem(this.init())
            return (
                <div className={style['received-scheme']}>
                    {/* table头部 */}
                    {this.createItem(this.init())}
                    {/* table内容 */}
                    <div className={`${style['rs-con']} scroll`}>
                        <Collapse accordion bordered={false}>
                            {this.item()}
                        </Collapse>
                    </div>
                </div>
            )
        } else {
            return '';
        }

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
                    <Collapse accordion bordered={false} defaultActiveKey={this.state.defaultActiveKey} style={{ overflowY: 'auto', height: 'inherit' }}>
                        {this.createPanel()}
                    </Collapse>
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