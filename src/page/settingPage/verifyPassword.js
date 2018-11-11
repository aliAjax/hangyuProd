import React, { Component } from 'react';
import classNames from 'classnames';
import MesTip from './../../utils/messageTip';
import LoginInputText from './../../components/input/loginInputText';
import style from './../../static/css/loginAndRegister/loginMain.scss';
import stylerRed from './../../static/css/loginAndRegister/registered.scss';
import {store} from "../../store/index";
import {unbindEmail} from './emailBind';

export default class VerifyPassword extends  Component{
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
        e.target.value = e.target.value.replace(/[\u4e00-\u9fa5]/g,'');
        this.setState({
            pas:e.target.value
        });
        if(e.type === 'blur'){
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
            this.tipInputPas('请输入登录密码！');
        }else{
            if(this.state.pas === store.getState().role.password){
                this.updata1();
            }else{
                this.tipInputPas('密码错误！');
            }
        }
    }
    componentWillUnmount() {
        if(this.hasOwnProperty('inputPas')){
            this.inputPas.removeNode();
            delete this.inputPas;
        };
    }
    updata(){
        this.props.changeIsForget(true);
        this.props.changeModel(1)
    }
    updata1(){
        this.props.changeIsForget(false);
        if(this.props.emailcL !== undefined){
            this.props.emailcL();
        }else{
            this.props.changeModel(2);
        }
    }
    render(){
        return(
            <div className={classNames({[stylerRed['login-box']]:true,[style['login-h']]:true})} style={{height:"377px"}}>
                <div className={stylerRed['box']} style={{height:"205px"}}>
                    <LoginInputText type={'text'} ref='inputPas' refId={'inputPas'} querData={this.querDataLXFS.bind(this)}  className={style['input-margin']} placeholder="请输入登录密码"/>
                </div>
                <div className={style['login-itme']} style={lsStyle.item1}>
                    <div className={style['forget-pas']} onClick={this.updata.bind(this)}>忘记密码？</div>
                </div>
                <div className={stylerRed['stylerRed-btn']}>
                    <div className={classNames({"may-btn":true})} ref={'resetPwd'} onClick={this.validationGS.bind(this)}>确认</div>
                    <div className={classNames({"may-btn-gary":true})} onClick={this.props.changeModel.bind(this,'')}>取消</div>
                </div>
                <div style={{textAlign:'center',height:'30px'}}>客服热线：028-65733800</div>
            </div>
        )
    }
}
let lsStyle = {
    item1:{justifyContent:'flex-end',margin:'10px 0'}
};
