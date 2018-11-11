import React, {Component} from 'react';
import styles from '../../static/css/components/dealPwd.scss'
import Btn from '../button/btn'
import randomWord from '../../static/js/encryption';
import base64 from '../../static/js/base64';
import Axios from "./../../utils/axiosInterceptors";
import { Modal } from 'antd';
import emitter from "../../utils/events";
import classNames from 'classnames';

export default class DealPwd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noMsgQueren: false,
            pwdLength: 0,  // 输入的密码长度
            pwdValue: '',  // 输入的密码
            isLocked: false,  // 是否是密码锁定状态；按钮-是否禁止选中、是否转圈、是否显示文字；密码输入框是否是红色；input是否禁止输入
            payPassword: false,  // 是否已设定交易密码
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
    ulClickFn() {
        try {
            this.refs.pwd.focus();
        }catch (e) {

        }
    }
    inputChangeFn(e) {
        e.target.value = e.target.value.replace(/\D/g,'');
        this.setState({
            pwdLength: e.target.value.length,
            pwdValue: e.target.value,
        })
    }
    onKeyDownFn(e) {
        if(e.keyCode === 13 && !this.state.noMsgQueren) {  // 按下Enter键
            this.sendDataFn();
        }
        if(e.keyCode === 37 || e.keyCode === 39) {  // 阻止左右箭头移动焦点
            e.preventDefault();
        }
    }
    sendDataFn() {
        this.setState({
            noMsgQueren: true
        }, ()=>{
            let base = new base64();
            let word = randomWord();
            Axios({
                method: 'post',
                url: '/validPayPassword',
                params:{  // 一起发送的URL参数
                    payPassword: base.encode(`${this.state.pwdValue}@${word}`)
                },
                // data: JSON.stringify(demand),
                dataType:'json',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then((response)=>{
                try {
                    if (response.data.opResult == 0) {
                        this.props.close(1);  // 1:验证成功-关闭，2：点击“取消”关闭
                    } else {
                        this.setState({
                            noMsgQueren: false,
                        },() => {
                            this.error(response.data.msg);
                        })
                    }
                }catch(e) {

                }
            })
        })
    }
    isSetPayPassword() {   // 是否设置支付密码
        Axios({
            method: 'post',
            url: '/isSetPayPassword',
            params:{  // 一起发送的URL参数
                // payPassword: ''
            },
            // data: JSON.stringify(demand),
            dataType:'json',
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        }).then((response)=>{
            try {
                if(response.data.opResult === '0') {
                    if(response.data.isSetPayPassword) {
                        this.isLockedPayPassword();
                    }else {
                        this.error(response.data.msg);
                        this.setState({
                            isLocked: true,
                            payPassword: true,
                        })
                    }
                }else {
                    this.error(response.data.msg);
                }
            }catch (e) {

            }
        })
    }
    isLockedPayPassword() {  // 查询支付密码是否锁定
        Axios({
            method: 'post',
            url: '/isLockedPayPassword',
            params:{  // 一起发送的URL参数
                // payPassword: ''
            },
            // data: JSON.stringify(demand),
            dataType:'json',
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        }).then((response)=>{
            try {
                if(response.data.opResult === '0') {
                    this.setState({
                        isLocked: response.data.isLocked,
                        payPassword: false,
                    })
                }else {
                    this.error(response.data.msg);
                    this.setState({
                        isLocked: true,
                        payPassword: false,
                    })
                }
            }catch (e) {

            }
        })
    }
    closeFormBox() {
        let obj = {};
        obj.openFrom = false;
        obj.fromType = '';
        obj.fromMe = '';
        emitter.emit('openFrom', obj);
    }
    closePopup() {
        let o = {
            popupType: 0,
            popupMes: '',
        };
        emitter.emit('openPopup', o);
    }
    forgetPwd() {
        window.location.href = "#/setting/false";
        this.closeFormBox();
        this.closePopup();
        if(this.props.forgetPwd()) {  // 忘记密码
            this.props.forgetPwd();
        }
    }
    componentDidMount() {
        this.isSetPayPassword();
        this.ulClickFn();
    }
    render() {
        let _this = this;
        return (
            <div>
                <input ref="pwd"
                       type="text"
                       maxLength="6"
                       disabled={this.state.isLocked}
                       onBlur={()=>{setTimeout(()=>{_this.ulClickFn()}, 0)}}
                       style={{position: 'absolute', top: '-9999px'}}
                       onKeyDown={this.onKeyDownFn.bind(this)}
                       onChange={this.inputChangeFn.bind(this)}/>
                <div className={styles['container']}>
                    <div>交易密码</div>
                    <div>
                        <div className={styles['first']}>
                            <div>请输入6位交易密码</div>
                            <ul className={`${styles['ul-style']} ${this.state.isLocked ? styles['isLocked'] : ''}`} onClick={this.ulClickFn.bind(this)}>
                                <li className={classNames({[styles["set-c"]]:(this.state.pwdLength === 1 || this.state.pwdLength === 0)})}>{this.state.pwdLength >= 1 && '*'}</li>
                                <li className={classNames({[styles["set-c"]]:this.state.pwdLength === 2})}>{this.state.pwdLength >= 2 && '*'}</li>
                                <li className={classNames({[styles["set-c"]]:this.state.pwdLength === 3})}>{this.state.pwdLength >= 3 && '*'}</li>
                                <li className={classNames({[styles["set-c"]]:this.state.pwdLength === 4})}>{this.state.pwdLength >= 4 && '*'}</li>
                                <li className={classNames({[styles["set-c"]]:this.state.pwdLength === 5})}>{this.state.pwdLength >= 5 && '*'}</li>
                                <li className={classNames({[styles["set-c"]]:this.state.pwdLength === 6})}>{this.state.pwdLength == 6 && '*'}</li>
                            </ul>
                            <div>
                                <span style={{cursor: 'pointer'}} onClick={this.forgetPwd.bind(this)}>
                                    {
                                        this.state.payPassword ? '您尚未设置交易密码，点此设置' : '忘记密码?'
                                    }
                                </span>
                            </div>
                        </div>
                        <div className={styles['buttons']}>
                            <div style={{padding: '0'}}>
                                <Btn text='确认'
                                     btnType="1"
                                     otherText={this.state.isLocked ? '确认' : ''}
                                     noIcon={this.state.isLocked}
                                     isDisable={this.state.noMsgQueren || this.state.isLocked}
                                     styleJson={{ width: "150px", padding: '0' }}
                                     onClick={()=> { this.sendDataFn()} } />
                            </div>
                            <div className={`btn-w`} onClick={()=>{this.props.close(2)}}>取消</div>
                        </div>
                        <div className={styles['phone']}>
                            客服热线：028-65733800
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
