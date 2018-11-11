import React, {Component, Fragment} from 'react';
import {store} from "../../../store/index";
import emitter from "../../../utils/events";
import styles from '../../../static/css/userCenter/companyAccount/companyRecharge.scss'
import { CSSTransition } from 'react-transition-group';
import Axios from "./../../../utils/axiosInterceptors";
import { Modal, Spin } from 'antd';

export default class CompanyRecharge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            transition: false,
            spinShow: true,
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

    closeFn() {  // 点击关闭
        this.props.close();
    }
    openChat() {  // 打开聊天框
        let obj = {};
        obj.fromNameId = store.getState().role.id;
        obj.toNameId = 1;
        obj.responsePlanId = null;
        emitter.emit('openChat', obj);
    }
    getData() {
        Axios({
            method: 'post',
            url: '/accountRecharge',
            dataType:'json',
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        }).then((response)=>{
            if(response.data.cardMessage) {
                this.error(response.data.cardMessage);
                this.setState({
                    data: null,
                    spinShow: false,
                })
            }else {
                this.setState({
                    data: response.data.card,
                    spinShow: false,
                })
            }
        })
    }
    componentDidMount() {
        this.setState({
            transition: true,
        });
        this.getData();
    }
    render() {
        return (
            <CSSTransition
                in={this.state.transition}
                timeout={500}
                classNames="confirmations"
                unmountOnExit
            >
                <div className={styles['mcar-wrapper']}>
                    <div className={styles['myCompanyAccountRecharge']}>
                        <div className={`${styles['top']} ${styles['items']}`}>
                            <div className={styles['left']}>
                                充值账户
                            </div>
                            <div className={styles['right']}>
                                <div className={`${styles['title']} ${styles['font-gray']}`}>如有疑问，请联系客服</div>
                                <div className={styles['anew-publish']} onClick={this.openChat.bind(this)}>
                                    联系客服<span className={`iconfont ${styles['icon-item']}`}>&#xe720;</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles['line']}></div>
                        <div className={`${styles['bottom']} ${styles['items']}`}>
                            {
                                this.state.spinShow
                                    ? <Spin size="large" style={{width: '100%', zIndex: 100}} />
                                    : <Fragment>
                                        {
                                            this.state.data ? <Fragment>
                                                <div className={`${styles['title']} ${styles['font-gray']}`}>请转账至以下账户，我们的工作人员会为您处理</div>
                                                <div className={styles['account-mes']}>
                                                    <div className={`${styles['left']} ${styles['items']}`}>
                                                        <div className={`${styles['item-height']} ${styles['font-gray']}`}>开户名</div>
                                                        <div className={`${styles['item-height']} ${styles['font-gray']}`}>开户账户</div>
                                                        <div className={`${styles['item-height']} ${styles['font-gray']}`}>开户银行</div>
                                                    </div>
                                                    <div className={`${styles['right']} ${styles['items']}`}>
                                                        <div className={`${styles['item-height']} ${styles['item-with']}`}>{this.state.data.cardPerson}</div>
                                                        <div className={`${styles['item-height']} ${styles['item-with']}`}>{this.state.data.cardNumber}</div>
                                                        <div className={`${styles['item-height']} ${styles['item-with']}`}>{this.state.data.cardName}</div>
                                                    </div>
                                                </div>
                                                <div className={styles['button']}>
                                                    <div className={'btn-b'} onClick={this.closeFn.bind(this)}>确认</div>
                                                    <div className={'btn-w'} onClick={this.closeFn.bind(this)}>取消</div>
                                                </div>
                                            </Fragment> : <div style={{textAlign: 'center', color: '#939298'}}>
                                                暂无银行卡数据，请联系客服或刷新重试!
                                            </div>
                                        }

                                    </Fragment>
                            }
                        </div>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}
