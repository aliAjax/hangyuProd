import React, { Component } from 'react';
import classNames from 'classnames';
import { Steps } from 'antd';
import Axios from "./../../utils/axiosInterceptors";
import MesTip from './../../utils/messageTip';
import {assemblyAction as an} from "../../utils/assemblyAction";
import LoginInputText from './../../components/input/loginInputText';
import style from './../../static/css/loginAndRegister/loginMain.scss';
import stylerRed from './../../static/css/loginAndRegister/registered.scss';
import {store} from "../../store/index";

const Step = Steps.Step;
export default class VertifyEmail extends  Component{
    constructor(props){
        super(props);
        this.state = {
            pas:this.props.email,  // 邮箱
            code: '', // 验证码
            sureBtnShow: false,
            sendVetrifyShow: false,  // 是否显示倒计时
            second: 60, // 倒计时显示的数字
        }
    }

    /**
     *
     * */
    querDataLXFS(e){
        // e.target.value = e.target.value.replace(/\D/g,'');
        this.setState({
            pas: e.target.value
        });
    }
    querDataLXFS2(e){
        e.target.value = e.target.value.replace(/[\u4e00-\u9fa5]/g,'');
        let sureBtnShow = false;
        if(e.target.value == '') {
            sureBtnShow = false;
        }else {
            sureBtnShow = true;
        }
        this.setState({
            code: e.target.value,
            sureBtnShow: sureBtnShow
        });
    }
    /** 警告开始 **/
    /**
     *
     * */
    tipInputPas(text){
        if(!this.hasOwnProperty('inputPas')){
            this.inputPas = new MesTip(this.refs.inputPas.refs.inputPas);
            this.inputPas.addNode();
        };
        this.inputPas.changeText(text);
    }

    sendVetrifyFn() {  // 获取验证码
        Axios({
            method: 'GET',
            url: '/getValidCode',
            params:{
                contactWay: this.state.pas
            }
        }).then((response)=>{
            if(response.data.opResult == 4) {
                this.tipInputPas('请求次数过多！');
            }else {
                this.setState({
                    sendVetrifyShow: true
                },()=>{
                    this.timeInterval();
                })
            }
        })
    }
    validationGS(){    //验证码判断
        let that = this,flag = false;
        let np = this.state.pas, code = this.state.code;
       Axios({
            method: 'GET',
            url: '/bindMail',
            params:{
                email: np,
                validStr: code
            }
        }).then(res=>{
           if(res.data.opResult === '0'){
               let role = JSON.parse(JSON.stringify(store.getState().role));
               role.email = np;
               store.dispatch(an('ROLE',role));
               this.props.changeModel(13);
           }else{
               this.tipInputPas('验证失败！');
           }
        }).catch(err=>{
           this.props.changeModel(14);
        })
    }

    timeFunction() {

    }
    timeInterval() {  // 60s倒计时
        let that = this;
        let time = setInterval(() => {
            that.setState((prev) => {
                if(prev.second <= 0) {
                    clearInterval(time);
                    return ({
                        second: 60,
                        sendVetrifyShow: false
                    })
                }else {
                    return ({
                        second: prev.second - 1,
                    })
                }
            })
        }, 1000);
    }
    componentDidMount() {

    }
    componentWillUnmount() {
        if(this.hasOwnProperty('inputPas')){
            this.inputPas.removeNode();
            delete this.inputPas;
        }
    }
    render(){
        return(
            <div className={classNames({[stylerRed['login-box']]:true,[style['login-h']]:true})} style={{height:"422px"}}>
                <Steps size="small" current={2} style={{display: 'flex', alignItems:'center', margin: '0 auto',paddingTop: '15px', width: '270px', height: '100px'}} >
                    <Step title="输入密码" />
                    <Step title="输入邮箱" />
                    <Step title="邮箱验证" />
                    <Step title="完成" />
                </Steps>
                <div className={stylerRed['box']} style={{height:"205px"}}>
                    <LoginInputText disabled defaultValue={this.props.email} type={'text'} ref='inputPas' refId={'inputPas'} querData={this.querDataLXFS.bind(this)} className={style['input-margin']} maxLength={'11'} placeholder="请输入新邮箱"/>
                    <div style={{position: 'relative'}}>
                        <LoginInputText type={'text'} ref='inputPas2' refId={'inputPas'} querData={this.querDataLXFS2.bind(this)} className={style['input-margin']} maxLength={'10'} placeholder="输入验证码"/>
                        {
                            this.state.sendVetrifyShow
                                ? <div style={{position: 'absolute', top:'4px', right:'0',width: '110px', height:'30px',textAlign: 'center',whiteSpace:'nowrap', lineHeight:'30px',borderLeft:'1px solid #D8D8D8', cursor:'pointer'}}
                                           >{this.state.second}'后重新发送</div>
                                : <div style={{position: 'absolute', top:'4px', right:'0',width: '110px', height:'30px',textAlign: 'center',whiteSpace:'nowrap', lineHeight:'30px',borderLeft:'1px solid #D8D8D8', cursor:'pointer'}}
                                           onClick={this.sendVetrifyFn.bind(this)}>点击发送验证码</div>
                        }
                    </div>
                </div>
                <div className={style['login-itme']} style={{justifyContent: 'flex-end', margin: '10px 0'}}>
                    <div className={style['forget-pas']}> </div>
                </div>
                <div className={stylerRed['stylerRed-btn']}>
                    {
                        this.state.sureBtnShow
                            ? <div className={classNames({"may-btn":true})} ref={'resetPwd'} onClick={this.validationGS.bind(this)}>确认</div>
                            : <div className={classNames({"may-btn-gary":true})}>确认</div>
                    }
                    <div className={classNames({"may-btn-gary":true})} onClick={this.props.changeModel.bind(this, 11)}>返回上一步</div>
                </div>
                <div style={{textAlign:'center',height:'30px'}}>客服热线：028-65733800</div>
            </div>
        )
    }
}
