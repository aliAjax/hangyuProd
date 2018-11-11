/* eslint-disable */
import React, {Component} from 'react';
import styles from '../../static/css/components/applyMeasuring.scss'
import Axios from "./../../utils/axiosInterceptors";
import { store } from '../../store/index'
import { Modal } from 'antd';
import Btn from "../button/btn";
import DealPwd from '../dealPwd/dealPwd';

export default class ApplyMeasuring extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDealPwd: false,
            data: {},
            noMsgCesuan: false,
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
    sendSure() {
        let employeeId = store.getState().role.id;
        Axios({
            method: 'post',
            url: '/reduceIntentionMoneyForSailing',
            params:{  // 一起发送的URL参数
                demandId: this.state.data.demandId,
                employeeId: employeeId,
                demandPlanId: this.state.data.planId,
                responsePlanId: null,
                number: this.state.data.calculateMoney
            },
            // data: JSON.stringify(demand),
            dataType:'json',
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        }).then((response)=>{
            if(response.data.opResult === '0') {
                let msg = '申请测算成功，方案已保存至个人中心-草稿箱，测算结果将在一个工作日内发送至个人中心-测算记录。';
                if(this.props.daizhifu) {
                    msg = '申请测算成功，方案已保存，测算结果将在一个工作日内发送至个人中心-测算记录。';
                }
                this.success(msg);
                this.props.close('1');
                this.props.renewData(response.data.obj);
            }else {
                try {
                    this.error(response.data.msg);
                    this.props.close('2', this.state.data.cesuanIndex);
                }catch(e) {

                }

            }
        })
    }
    dealCloseFn(i) {  // 交易密码关闭
        if(i == 1) {  // 1:验证成功-关闭，2：点击“取消”关闭
            this.sendSure();
        }else {
            this.closeClickFn();
        }
    }
    forgetPwd() {  // 忘记密码

    }
    sureClickFn() {
        this.setState({
            showDealPwd: true,
        });
    }
    closeClickFn() {
        this.props.close('2', this.state.data.cesuanIndex);
    }
    componentDidMount() {
        if(this.props.data) {
            this.setState({
                data: this.props.data
            })
        }
    }
    render() {
        return (
            <div className={styles['measuring-wrapper']}>
                {this.state.showDealPwd
                    ? <DealPwd close={this.dealCloseFn.bind(this)}
                               forgetPwd={this.forgetPwd.bind(this)}/>
                    : <div className={styles['container']}>
                        <div className={styles['top']}>
                            <span>申请测算</span>
                        </div>
                        <div className={styles['content']}>
                            <div>
                                测算价格为：{this.state.data.calculateMoney}/次
                            </div>
                            <div>
                                预计一天后给出预算结果，是否确认申请测算？
                            </div>
                        </div>
                        <div className={styles['buttons']}>
                            <div>
                                <Btn text='确认'
                                     btnType="1"
                                     otherText="申请中"
                                     isDisable={this.state.noMsgCesuan}
                                     styleJson={{ width: "190px" }}
                                     onClick={()=> { this.sureClickFn()} } />
                            </div>
                            {/*<div className={'btn-b'} onClick={this.sureClickFn.bind(this)}>确认</div>*/}
                            <div className={'btn-w'} onClick={this.closeClickFn.bind(this)}>取消</div>
                        </div>
                        <div className={styles['tips']}>
                            <div>*该功能针对此航线报价，进行价格评估，为您减少不必要的费用支出，节约成本。</div>
                            <div style={{textIndent: '5px'}}>
                                测算样例：<a href="/downCalculationsRecordExample" target="_blank">杭州=承德=大连测算报告</a>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}
