import React, {Component} from 'react';
import Axios from "./../../../utils/axiosInterceptors";
import emitter from "../../../utils/events";
import styles from '../../../static/css/fromBox/accountOperation/withdraw.scss'
import WithdrawFlow from './withdrawFlow'

export default class Withdraw extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            symbol: '',  // 显示“+”、“-”、“ ”
            warnShow: false,  // 警告是否显示
            current: 0,  // 步骤条-第几步
            bigImgShow: false,
        };
    }

    applyClickFn() {  // 点击“申请电子凭证”按钮
        Axios({
            method: 'post',
            url: '/userApplicationForElectronicVoucher',
            dataType:'json',
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            },
            params: {
                id: this.state.data.id
            }
        }).then((response)=>{
            let opResult = Number(response.data.opResult);
            if(opResult === 0) {
               alert(`申请成功！`);
               this.closeFormBox();
            }else {
               alert(`申请失败!`);
            }
        })
    }
    closeFormBox() {  // 关闭formBox
        let obj = {};
        obj.openFrom = false;
        obj.fromType = '';
        obj.fromMe = '';
        emitter.emit('openFrom', obj);
    }
    imgClickFn() {  // 图片点击事件
        this.setState({
            bigImgShow: true,
        })
    }
    setData(data) {
        let current = 0;
        if(data.phase === '2'){ // 判断页面显示的内容
            current = 2;
        }else if(data.phase === '00'){
            current = 2;
        }else if(data.phase === '1'){
            current = 1;
        }else {
            current = 0;
        }
        this.setState({
            data: data,
            current
        });
    }
    componentWillReceiveProps(nextProps) {  // 获取数据
        this.setData(nextProps.data);
    }
    componentDidMount() {
        this.setData(this.props.data);
    }
    render() {
        return (
            <div>
                <div className={styles['plan-wrapper']}>
                    <header>
                        <div className={`${styles['top-til']} ${styles['font-gray']}`}>
                            流水详情
                            <span className={'iconfont'} onClick={this.closeFormBox.bind(this)}>&#xe62c;</span>
                        </div>
                        <div className={styles['head-til']}>{this.state.data.discription1}</div>
                        <div className={styles['header-num']}>
                            <div className={styles['top']}>账户金额</div>
                            <div className={styles['bottom']}>
                                <span>{this.state.data.number}</span>
                            </div>
                        </div>
                        <div className={styles['withdraw-flow']}>
                            <WithdrawFlow current={this.state.current} />
                        </div>
                    </header>
                    <div className={styles['ard-container']}>
                        <div className={styles['ard-item']}>
                            <div className={`${styles['left']} ${styles['font-gray']}`}>创建时间</div>
                            <div className={styles['right']}>{this.state.data.dateComplete}</div>
                        </div>
                        <div className={styles['ard-item']}>
                            <div className={`${styles['left']} ${styles['font-gray']}`}>交易流水号</div>
                            <div className={styles['right']}>{this.state.data.serialNumber}</div>
                        </div>
                    </div>
                    {
                        ((this.state.data.phase == 2 || this.state.data.phase === '00') && !this.state.data.wetherJpg) && <div className={styles['ard-button']}>
                            {
                                this.state.data.phase === '00'
                                    ? <div className={'btn-disable'}>电子凭证申请中</div>
                                    : <div className={'btn-b'} onClick={this.applyClickFn.bind(this)}>申请电子凭证</div>
                            }
                        </div>
                    }
                    {
                        this.state.data.wetherJpg && <div className={styles['ard-certificate']}>
                            <div className={`${styles['ardc-left']} ${styles['font-gray']}`}>电子凭证</div>
                            <div className={styles['ardc-right']}>
                                <img src={`/seeTransactionRecordJpg?id=${this.state.data.id}&type=${this.state.data.type}`}
                                     alt="电子凭证"
                                     onClick={this.imgClickFn.bind(this)} />
                            </div>
                        </div>
                    }
                </div>
                {
                    this.state.bigImgShow && (
                        <div style={{position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: 'rgba(0, 0, 0, 0.5)',
                                zIndex: '100'}}
                             onClick={()=>{this.setState({bigImgShow: false,})}}>
                            <img src={`/seeTransactionRecordJpg?id=${this.state.data.id}&type=${this.state.data.type}`}
                                 alt="电子凭证"
                                 style={{maxHeight: '800px', width: 'auto'}} />
                        </div>
                    )
                }
                {/*<transition-group name="fade">
                    <applySuccess v-show="applySuccessShow" @closeThis="closeApplySuccessFn" :key="0"></applySuccess>
                    <certificateImg v-show="certificateImgShow" :srcImg="src" @closeThis="closeCertificateImgFn" :key="1"></certificateImg>
                </transition-group>*/}
            </div>
        )
    }
}
