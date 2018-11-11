import React, { Component } from 'react';
import classNames from 'classnames';
import { Steps } from 'antd';
import Axios from "./../../utils/axiosInterceptors";
import MesTip from './../../utils/messageTip';
import LoginInputText from './../../components/input/loginInputText';
import style from './../../static/css/loginAndRegister/loginMain.scss';
import stylerRed from './../../static/css/loginAndRegister/registered.scss';
import {store} from "../../store/index";
import {assemblyAction as an} from "../../utils/assemblyAction";

const Step = Steps.Step;
export default class NewPhone extends  Component{
    constructor(props){
        super(props);
        this.state = {
            pas:""
        }
    }

    /**
     * 获取联系电话
     * */
    querDataLXFS(e){
        e.target.value = e.target.value.replace(/\D/g,'');
        this.setState({
            pas: e.target.value
        });
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


    returnPrev() {  // 返回上一步
        this.props.changeModel(20, '');
    }

    /** 警告结束 **/

    validationGS(){
        if(this.state.pas === ''){
            this.tipInputPas('请输入手机号码！');
        }else if(!(/^1[3|4|5|8][0-9]\d{8}$/.test(this.state.pas))) {
            this.tipInputPas('请输入正确手机号！');
        }else {
            let phone = this.state.pas;
            Axios({
                method: 'post',
                url: '/validPhone',
                params:{  // 一起发送的URL参数
                    phone,
                    validType: 0
                },
                dataType:'json',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then((response)=>{
                if(response.data.opResult== '0'){
                    this.props.changeModel(22, phone);
                }else{
                    this.tipInputPas('*该手机号已绑定!');
                }
            })
        }
    }
    componentDidMount() {
        let newPhone = this.props.phone ? this.props.phone : '';
        this.setState({
            pas: newPhone,
        })
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
                <Steps size="small" current={1} style={{display: 'flex', alignItems:'center', margin: '0 auto',paddingTop: '15px', width: '270px', height: '100px'}} >
                    <Step title="输入密码" />
                    <Step title="输入新手机" />
                    <Step title="手机验证" />
                    <Step title="完成" />
                </Steps>
                <div className={stylerRed['box']} style={{height:"205px"}}>
                    <LoginInputText defaultValue={this.props.phone} type={'text'} ref='inputPas' refId={'inputPas'} querData={this.querDataLXFS.bind(this)} className={style['input-margin']} maxLength={'11'} placeholder="请输入新手机"/>
                </div>
                <div className={style['login-itme']} style={{justifyContent: 'flex-end', margin: '10px 0'}}>
                    <div className={style['forget-pas']}> </div>
                </div>
                <div className={stylerRed['stylerRed-btn']}>
                    <div className={classNames({"may-btn":true})} ref={'resetPwd'} onClick={this.validationGS.bind(this)}>下一步</div>
                    <div className={classNames({"may-btn-gary":true})} onClick={this.returnPrev.bind(this)}>返回上一步</div>
                </div>
                <div style={{textAlign:'center',height:'30px'}}>客服热线：028-65733800</div>
            </div>
        )
    }
}
