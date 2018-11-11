import React,{Component} from 'react';
import classNames from 'classnames';
import Base64 from './../../../static/js/base64';
import {store} from './../../../store/index';
import Prompt from './../../../utils/prompt';
import Axios from './../../../utils/axiosInterceptors';
import stylep from './../../../static/css/loginAndRegister/public.scss';
import style from './payPwd.scss';
import styles from '../../../static/css/components/dealPwd.scss'
import stylerRed from './../../../static/css/loginAndRegister/registered.scss';
import {assemblyAction as an} from "../../../utils/assemblyAction";

function err() {
    return (
        <div style={{paddingTop:"40px"}}>
            <h3 className={stylep["loginErr-title"]}>(⊙ˍ⊙)密码设置失败</h3>
            <p className={style["loginErr-mes"]}>请稍后重试或者拨打客服热线</p>
        </div>
    )
}
function success() {
    return (
        <div style={{paddingTop:"40px"}}>
            <h3 className={stylep["loginErr-title"]}>(^▽^)密码设置成功</h3>
            <p className={style["loginErr-mes"]}>3s后自动关闭</p>
        </div>
    )
}


export default class SetPwdAg extends Component{
    constructor(props){
        super(props);
        this.pas = ["","","","","",""];
        this.state = {
            steps:0,
            pwdLength: 0,  // 输入的密码长度
            pwdValue: '',  // 输入的密码
        }
    }
    componentDidMount(){
        this.ulClickFn();
    }
    ulClickFn() {
        this.refs.pwd.focus();
    }
    inputChangeFn(e) {
        e.target.value = e.target.value.replace(/\D/g,'');
        this.setState({
            pwdLength: e.target.value.length,
            pwdValue: e.target.value,
        })
        this.refs["inputYZM"].tip("");
    }
    validationGS(){
        if(this.state.pwdLength === 6 && this.state.pwdValue === this.props.pas){
            this.refs["inputYZM"].tip("");
            let base64 = new Base64();
            let basePay = base64.encode(this.state.pwdValue + '@');
            Axios({
                method: 'post',
                url: store.getState().role.payPassword == "false" ? '/setPayPassword' : '/updatePayPassword',
                params:{  // 一起发送的URL参数
                    payPassword:basePay
                },
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then((response)=>{
                if(response.data.opResult === "0"){
                    let role = JSON.parse(JSON.stringify(store.getState().role));
                    role.payPassword = "true";
                    store.dispatch(an('ROLE',role));
                    this.setState({
                        steps:1
                    },()=>{
                        setTimeout(()=>{
                            this.props.changeModel('');
                        },3000);
                    })
                }else{
                    this.refs["inputYZM"].tip(response.data.msg);
                }
            })
        }else{
            if(this.state.pwdLength !== 6){
                this.refs["inputYZM"].tip("请输入交易密码");
            }else if(this.state.pwdValue !== this.props.pas){
                this.refs["inputYZM"].tip("两次密码不一致");
            }
        }
    }
    close(){
        this.props.modelm(1);
    }
    sets(){
        return(
            <div>
                <div style={{lineHeight:"24px"}}>再次确认密码</div>
                <div className={style["input-list"]}>
                    <input ref="pwd"
                           style={{position: 'absolute', top: '-9999px'}}
                           type="text"
                           maxLength="6"
                           onBlur={this.ulClickFn.bind(this)}
                           disabled={this.state.isLocked}
                           onChange={this.inputChangeFn.bind(this)}/>
                    <div>
                        <div className={styles['first']}>
                            <ul className={`${styles['ul-style']} ${this.state.isLocked ? styles['isLocked'] : ''}`} onClick={this.ulClickFn.bind(this)}>
                                <li className={classNames({[styles["set-c"]]:(this.state.pwdLength === 1 || this.state.pwdLength === 0)})}>{this.state.pwdLength >= 1 && '*'}</li>
                                <li className={classNames({[styles["set-c"]]:this.state.pwdLength === 2})}>{this.state.pwdLength >= 2 && '*'}</li>
                                <li className={classNames({[styles["set-c"]]:this.state.pwdLength === 3})}>{this.state.pwdLength >= 3 && '*'}</li>
                                <li className={classNames({[styles["set-c"]]:this.state.pwdLength === 4})}>{this.state.pwdLength >= 4 && '*'}</li>
                                <li className={classNames({[styles["set-c"]]:this.state.pwdLength === 5})}>{this.state.pwdLength >= 5 && '*'}</li>
                                <li className={classNames({[styles["set-c"]]:this.state.pwdLength === 6})}>{this.state.pwdLength == 6 && '*'}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <Prompt ref='inputYZM' style={{top:"-22px"}}>
                    <div className={stylerRed['stylerRed-btn']} style={{"padding":0,marginTop:"63px"}}>
                        <div className={classNames({"may-btn":true})} ref={'resetPwd'} onClick={this.validationGS.bind(this)}>完成</div>
                        <div className={classNames({"may-btn-gary":true})} onClick={this.close.bind(this)}>返回上一步</div>
                    </div>
                </Prompt>
            </div>
        )
    }
    rendm(){
        switch (this.state.steps){
            case 0:
                return this.sets();
                break;
            case 1:
                return success();
                break;
            case 2:
                return err();
                break;
        }
    }
    render(){
        return(
            <div ref={"pasSet"} style={{position:"relative"}} className={classNames({[style["input-box"]]:true})}>
                {this.rendm()}
                <div style={{width:"280px",textAlign:'center',height:'30px',bottom:"0px",position:"absolute"}}>客服电话：028-65733800</div>
            </div>
        )
    }
}