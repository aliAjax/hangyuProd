import React, { Component } from 'react';
import { Checkbox } from 'antd';
import Axios from "./../../utils/axiosInterceptors";
import {assemblyAction as an} from "../../utils/assemblyAction";
import MesTip from './../../utils/messageTip';
import classNames from 'classnames';
import {store} from "../../store";
import style from './../../static/css/loginAndRegister/loginMain.scss';
import LoginInputText from './../../components/input/loginInputText';

export default class Login extends Component{
    constructor(props){
        super(props);
        let u = '',p = '',r = false;
        if(localStorage.getItem("remember") === 'true'){
                r = true;
            if(localStorage.getItem("saveMes") !== null){
                let saveMes = JSON.parse(localStorage.getItem("saveMes"));
                u = saveMes.username;
                p = saveMes.password;
            }
        }
        this.state = {
            username:u,
            password:p,
            remember:r
        }
        // this.login();

    }
    componentWillMount(){

    }
    componentDidMount(){

    }
    // 账号输入后续
    querData(e){
        e.target.value = e.target.value.replace(/[\u4e00-\u9fa5]/g,'');
        this.state.username = e.target.value;
        if(this.state.username !== ''){
            if(this.userInput !== undefined){
                this.userInput.changeText('');
            }
        }
    }
    // 密码输入后续
    querDataPas(e){
        e.target.value = e.target.value.replace(/[\u4e00-\u9fa5]/g,'');
        this.state.password = e.target.value;
        if(this.state.password !== ''){
            if(this.pasInput !== undefined){
                this.pasInput.changeText('');
            }
        }
    }
    // 登录
    login(){
        if(this.state.username === ''){
            this.tipUserInput();
        }else if(this.state.password === ''){
            this.tipPasInput();
        }else{
            Axios({
                url:"login",
                method: 'post',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    username:this.state.username,
                    password:this.state.password
                }
            }).then((response) => {
                if(response.data.obj != undefined){
                    if(localStorage.getItem("remember") === 'true'){
                        localStorage.setItem("saveMes",JSON.stringify({username:this.state.username,password:this.state.password}));
                    }else{
                        localStorage.removeItem("saveMes");
                    };
                    store.dispatch(an('ROLE',response.data.obj));
                }else{
                    if(response.data.opResult == '1'){
                        this.tipPasErr();
                    }
                }
            });
        }
    }
    /**
     * 提示账号输入框的警告信息
     * */
    tipUserInput(){
        if(!this.hasOwnProperty('userInput')){
            this.userInput = new MesTip(this.refs.userInput.refs.userInput);
            this.userInput.addNode();
        };
        this.userInput.changeText('请输入账号!');
    }
    /**
     * 提示密码输入框的警告信息
     * */
    tipPasInput(){
        if(!this.hasOwnProperty('pasInput')){
            this.pasInput = new MesTip(this.refs.pasInput.refs.pasInput);
            this.pasInput.addNode();
        };
        this.pasInput.changeText('请输入密码!');
    }
    /**
     * 登录密码错误信息
     *
     * */
    tipPasErr(){
        if(!this.hasOwnProperty('pasErr')){
            this.pasErr = new MesTip(this.refs['loginBth']);
            this.pasErr.setCorrectionY(-74);
            this.pasErr.addNode();
        };
        this.pasErr.changeText('账号或密码错误请重新输入!');
        setTimeout(()=>{
            this.pasErr.changeText('');
        },1500);
    }
    /**
     * 登录异常后台报错
     * */
    /**
     * 记住密码的改变事件
     * */
    onChange(e){
        localStorage.setItem("remember",JSON.stringify(e.target.checked));
    }
    /**
     * 卸载组件的时候移除实例
     * */
    componentWillUnmount(){
        if(this.hasOwnProperty('userInput')){
            this.userInput.removeNode();
            delete this.userInput;
        };
        if(this.hasOwnProperty('pasInput')){
            this.pasInput.removeNode();
            delete this.pasInput;
        }
        if(this.hasOwnProperty('pasErr')){
            this.pasErr.removeNode();
            delete this.pasErr;
        }
    }
    test(){
        this.props.changeModel(1);
    }
    enter(){
        this.login();
    }
    render(){
        return(
            <div className={classNames({[style['login-box']]:true,[style['login-h']]:true})}>
                <div className={style['login-context']}>
                    <div className={style['login-title']}>聚焦航线开通</div>
                    <div className={style['login-zs']}>Imagine flying through countless places</div>
                    <div className={style['login-input']}>
                        <LoginInputText enter={this.enter.bind(this)} defaultValue={this.state.username} type={'input'} ref='userInput' refId={'userInput'} validation={true} querData={this.querData.bind(this)} className={style['input-margin']} placeholder="请输入手机号或者邮箱登录" />
                        <LoginInputText enter={this.enter.bind(this)} defaultValue={this.state.password} type={'password'} ref='pasInput' refId={'pasInput'} validation={true} querData={this.querDataPas.bind(this)} className={style['input-margin']} placeholder="请输入登录密码" />
                    </div>
                    <div className={style['login-itme']}>
                        <Checkbox defaultChecked={this.state.remember} onChange={this.onChange.bind(this)}>记住密码</Checkbox>
                        <div className={style['forget-pas']} onClick={this.props.changeModel.bind(this,2)}>忘记密码？</div>
                    </div>
                    <div ref={'loginBth'} onClick={this.login.bind(this)} className={classNames({"may-btn":true,[style["login-btn"]]:true})}>登录</div>
                </div>
                <div className={style['login-mes']}>
                    <div onClick={this.props.changeModel.bind(this,1)}>申请账号</div>
                    <div>客服热线：028-65733800</div>
                </div>
            </div>
        )
    }
}
