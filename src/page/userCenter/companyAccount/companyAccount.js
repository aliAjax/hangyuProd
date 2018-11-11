import React, { Component } from 'react';
import styles from '../../../static/css/userCenter/companyAccount/companyAccount.scss'
import Axios from "./../../../utils/axiosInterceptors";
import emitter from "../../../utils/events";
import CompanyRecharge from './companyRecharge'
import {store} from "../../../store/index";
import { Modal, Spin } from 'antd';

export default class CompanyAccount extends Component{
    constructor(props){
        super(props);
        this.state = {
            spinShow: true,  // 加载中是否展示
            account: {},  // 账户
            card: {},   // 银行卡
            transactionRecords: [],  // 交易记录
            showCompanyRecharge: false,  // 充值账户是否显示
            companyRechargeData: {},  // 点击“充值账户”获取并传递的参数
            releaseAndResponse: {},  // 用户已使用次数及剩余次数
        }
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
    closeFormBox() {  // 关闭formBox
        let obj = {};
        obj.openFrom = false;
        obj.fromType = '';
        obj.fromMe = '';
        emitter.emit('openFrom', obj);
    }
    openChat() {  // 打开聊天框
        let obj = {};
        obj.fromNameId = store.getState().role.id;
        obj.toNameId = 1;
        obj.responsePlanId = null;
        emitter.emit('openChat', obj);
    }
    rechargeClickFn() {  // 点击“充值”
        this.setState({
            showCompanyRecharge: true,
        })
    }
    closeCompanyRecharge() {  // 点击关闭充值账户详情
        this.setState({
            showCompanyRecharge: false,
        })
    }
    accountDetailFn(item) {  // 点击列表，查看交易详情
        let obj = {};
        obj.openFrom = true;
        obj.fromType = 2;  // 充值/提现详情
        obj.fromMes = item;
        emitter.emit('openFrom', obj);
    }
    needDetailClickFn(item, e) {   // 点击需求发布标题，展示需求详情
        e.stopPropagation();
        let id = item.demandId;
        let obj = {};
        let tabType = Number(item.isOwnDemand) === 0 ? 'mine' : 'market';  // 是否是自己发布的需求：0-是；1-不是
        let transmit = {};
        transmit.id = id;
        obj.openFrom = true;
        obj.fromType = 3;
        obj.fromMes = {
            transmit: transmit,
            tabType: tabType
        };
        emitter.emit('openFrom', obj);
    };
    releaseClickFn() {  // 点击“已发布需求 数字”
        if(Number(store.getState().role.role) === 0) {  // 0 航司  1 机场
            this.props.jumpTo(1, 1);  // 下标 + 需求类型 0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托
        }else {
            this.props.jumpTo(1, 0);  // 下标 + 需求类型 0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托
        }
    }
    intentionClickFn() {  // 点击“已响应意向 数字”
        this.props.jumpTo(2, '');  // 下标 + 需求类型 0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托
    }
    componentWillMount(){  // 将要渲染

    }
    componentDidMount() {   // 加载渲染完成
        this.setState({
            spinShow: true,
        }, ()=>{
            Axios({
                method: 'post',
                url: '/perSonNalCompanyAccountList',
                dataType:'json',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then((response)=>{
                let data = response.data;
                let account = {},
                    card = {},
                    transactionRecords = [],
                    releaseAndResponse = {};
                if(data.account) {
                    account = data.account;
                }else {
                    this.error('无账户信息');
                }
                if(data.card) {
                    card = data.card;
                }else {
                    this.error('无银行卡信息');
                }
                if(data.transactionRecords) {
                    transactionRecords = data.transactionRecords;
                }
                if(data.releaseAndResponse) {
                    releaseAndResponse = data.releaseAndResponse;
                }
                this.setState({
                    account,
                    card,
                    transactionRecords,
                    releaseAndResponse,
                    spinShow: false,
                })
            })
        });
    }
    componentWillReceiveProps(nextProps){  // Props发生改变

    }
    componentWillUnmount(){  // 卸载组件
        this.closeFormBox();
    }
    render(){
        const noData = <div style={{padding: '0 40px', color: '#939298', textAlign: 'center'}}>暂无数据！</div>;
        let item = this.state.transactionRecords.map((item, index) => {
            return (
                <div className={`${styles['row']} ${styles['item']}`} key={index} onClick={this.accountDetailFn.bind(this, item)}>
                    <div>{item.date}</div>
                    <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'eclipse'}}>
                        {
                            (item.demandId === '' && item.demandId === null) ? (
                                <span>{item.discription1}</span>
                            ) : (
                                <span>
                                    {item.discription1}
                                    <span title={`${item.demandTitle}${(item.type == '0701' || item.type == '0702' || item.type == '0801' || item.type == '0802') ? item.demandTypeStr : ''}`}
                                          style={{color: '#3c78ff', cursor: 'pointer'}}
                                          onClick={this.needDetailClickFn.bind(this, item)}>
                                        {item.demandTitle}
                                        {(item.type == '0701' || item.type == '0702' || item.type == '0801' || item.type == '0802')
                                            ? (<span>{item.demandTypeStr}</span>)
                                            : ''
                                        }
                                    </span>
                                </span>
                            )
                        }
                    </div>
                    <div>{item.discription2}</div>
                    <div>
                        查看详情
                        <span className={'iconfont'} style={{height: '20px', color: '#597EC2'}}>&#xe686;</span>
                    </div>
                </div>
            )
        });
        return(
            <div className={styles['company-account']}>
                {
                    this.state.showCompanyRecharge && <CompanyRecharge data={this.state.companyRechargeData}
                                                                       close={this.closeCompanyRecharge.bind(this)} />
                }
                <div className={styles['top']}>
                    <div className={styles['user-mes']}>
                        <div>
                            当前账户金额（元）
                        </div>
                        <div className={styles['number']}>
                            <div>{this.state.account.totalNumber || ''}</div>
                            <div>（含冻结金额{this.state.account.freezeNumber || ''}元）</div>
                        </div>
                        <div className={styles['times']}>
                            <div>
                                已发布需求：<a onClick={this.releaseClickFn.bind(this)}>{this.state.releaseAndResponse ? this.state.releaseAndResponse.releaseNum : 0}</a>
                            </div>
                            <div>
                                已响应意向：<a onClick={this.intentionClickFn.bind(this)}>{this.state.releaseAndResponse ? this.state.releaseAndResponse.responseNum : 0}</a>
                            </div>
                            <div>
                                剩余需求发布及意向响应次数：{this.state.releaseAndResponse ? this.state.releaseAndResponse.availableNum : ''}
                            </div>
                        </div>
                        <div className={styles['btns']}>
                            <div className={'btn-b'} onClick={this.rechargeClickFn.bind(this)}>充值</div>
                            <div className={'btn-w'} onClick={this.openChat.bind(this)}>
                                提现请点此联系客服
                                <span className={'iconfont'}>&#xe720;</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles['card']}>
                        <div>
                            {
                                this.state.card.cardName || ''
                            }
                        </div>
                        <div>
                            {
                                this.state.card.cardNumber ? this.state.card.cardNumber.replace(/\s/g, '').replace(/(.{4})/g, "$1 ") : ''
                            }
                        </div>
                    </div>
                </div>
                <div className={styles['container']}>
                    <div className={`${styles['row']}`}>
                        <div>时间</div>
                        <div>操作内容</div>
                        <div>账户状态</div>
                    </div>
                    <div className={`scroll ${styles['items']}`} style={{fontSize: '1.4rem'}}>
                        {
                            this.state.spinShow && <Spin size="large" style={{width: '100%', zIndex: 100}} />
                        }
                        {
                            (!this.state.spinShow &&
                                (this.state.transactionRecords == null || this.state.transactionRecords.length == 0)) ? noData : item
                        }
                    </div>
                </div>
            </div>
        )
    }
}