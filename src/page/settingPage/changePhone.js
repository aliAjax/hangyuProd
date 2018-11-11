import React, { Component } from 'react';
import classNames from 'classnames';
import { Steps,message } from 'antd';
import MesTip from './../../utils/messageTip';
import LoginInputText from './../../components/input/loginInputText';
import style from './../../static/css/loginAndRegister/loginMain.scss';
import stylerRed from './../../static/css/loginAndRegister/registered.scss';
import {store} from "../../store/index";
import Axios from "../../utils/axiosInterceptors";

const Step = Steps.Step;
export default class ChangePhone extends  Component{
    constructor(props){
        super(props);
        this.state = {
            code:"",
            disCode:0
        }
    }

    /**
     * 获取验证码
     * */
    querDataYZM(e){
        e.target.value = e.target.value.replace(/[\u4e00-\u9fa5]/g,'');
        this.setState({
            code:e.target.value
        });
        if(e.target.type === 'blur'){
            if(e.target.value !== ''){
                this.tipInputPas('');
            }
        }
    }
    /** 警告开始 **/
    /**
     * 联系方式输入框的警告信息
     * */
    tipInputPas(text){
        if(!this.hasOwnProperty('inputPas')){
            this.inputPas = new MesTip(this.refs.inputPas.refs.inputPas);
            this.inputPas.addNode();
        };
        this.inputPas.changeText(text);
    }


    /** 警告结束 **/

    validationGS(){
        if(this.state.pas === ''){
            this.tipInputPas('请输入验证码！');
        }else{
            Axios({
                method: 'post',
                url: '/validCode',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params:{
                    contactWay:store.getState().role.phone,
                    validCode:this.state.code
                }
            })
                .then((response) => {
                    if(response.data.opResult === "0"){
                        this.props.changeModel(21, '');
                    }else{
                        this.tipInputPas('验证码错误！');
                    }
                })
                .catch((error) => {
                        console.log(error);
                    }
                );

        }
    }
    componentWillUnmount() {
        if(this.hasOwnProperty('inputPas')){
            this.inputPas.removeNode();
            delete this.inputPas;
        };
    }
    updata(){
        this.props.changeIsForget();
        this.props.changeModel(1)
    }
    ti(){
        setTimeout(()=>{
            if(this.state.disCode > 0){
                this.setState({
                    disCode:this.state.disCode - 1
                },()=>{
                    this.ti()
                })
            }
        },1000);
    }
    queryYzm(){
        Axios({
            method: 'post',
            url: '/getValidCode',
            params:{
                contactWay:store.getState().role.phone
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        })
            .then((response) => {

                if(response.data.opResult  == '0'){
                    this.setState({
                        disCode:60
                    });
                    this.ti();
                }else{
                    message.error('发送验证码失败，请稍后再试！');
                }
            })
            .catch((error) => {
                    console.log(error);
                }
            );
    }
    render(){
        let ph = store.getState().role.phone;
        return(
            <div className={classNames({[stylerRed['login-box']]:true,[style['login-h']]:true})} style={{height:"422px"}}>
                <Steps size="small" current={0} style={{display: 'flex', alignItems:'center', margin: '0 auto',paddingTop: '15px', width: '270px', height: '100px'}} >
                    <Step title="验证旧手机" />
                    <Step title="输入新手机" />
                    <Step title="手机验证" />
                    <Step title="完成" />
                </Steps>
                <div className={stylerRed["reg-phone"]}>
                    <div className={stylerRed["reg-phone-text"]}>{ph.substr(0,4)}****{ph.substr(7,4)}</div>
                    <button className={classNames({[stylerRed["reg-phone-button"]]:this.state.disCode === 0,[stylerRed["reg-phone-button-disable"]]:this.state.disCode > 0})} onClick={this.queryYzm.bind(this)}>{this.state.disCode > 0 ? `${this.state.disCode}S` : "发送验证码"}</button>
                </div>
                <div className={stylerRed['box']} style={{height:"205px",display:"flex",flexFlow:"row",alignItems:"center"}}>
                    <LoginInputText type={'number'} ref='inputPas' refId={'inputPas'} querData={this.querDataYZM.bind(this)} className={style['input-margin']} placeholder="请输入验证码"/>
                </div>
                <div className={style['login-itme']} style={{justifyContent:'flex-end',margin:'10px 0'}}>
                    <div className={style['forget-pas']} onClick={this.updata.bind(this)}>忘记密码？</div>
                </div>
                <div className={stylerRed['stylerRed-btn']}>
                    <div className={classNames({"may-btn":true})} ref={'resetPwd'} onClick={this.validationGS.bind(this)}>下一步</div>
                    <div className={classNames({"may-btn-gary":true})} onClick={this.props.changeModel.bind(this,'')}>取消</div>
                </div>
                <div style={{textAlign:'center',height:'30px'}}>客服热线：028-65733800</div>
            </div>
        )
    }
}
