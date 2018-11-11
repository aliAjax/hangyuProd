import React, { Component } from 'react';
import classNames from 'classnames';
import Axios from './../../utils/axiosInterceptors';
import {store} from './../../store/index';
import {assemblyAction as an} from "../../utils/assemblyAction";
import LoginInputText from './../../components/input/loginInputText';
import MesTip from './../../utils/messageTip';
import style from './../../static/css/loginAndRegister/loginMain.scss';
import stylerRed from './../../static/css/loginAndRegister/registered.scss';


export default class NewPas extends  Component{
    constructor(props){
        super(props);
        this.state = {
            pas1:"",
            pas2:""
        }
    }

    /**
     * 获取初次输入密码
     *
     * */
    querDataPas1(e){
        this.setState({
            pas1:e.target.value
        });
        if(e.type === 'blur'){
            if(this.state.pas1 !== '' && (this.state.pas1.length >= 6 && this.state.pas1.length <= 16)){
                this.tipInputPas1('');
            }
        }
    }

    /**
     * 获取确认密码
     *
     * */
    querDataPas2(e){
        this.setState({
            pas2:e.target.value
        });
        if(e.type === 'blur'){
            if(this.state.pas2 !== '' && (this.state.pas2.length >= 6 || this.state.pas2.length <= 16)){
                this.tipInputPas2('');
            }
        }
    }

    /**
     * 警告开始
     * */

    /**
     * 初次输入密码警告
     * */
    tipInputPas1(text){
        if(!this.hasOwnProperty('inputPas1')){
            this.inputPas1 = new MesTip(this.refs.inputPas1.refs.inputPas1);
            this.inputPas1.addNode();
        };
        this.inputPas1.changeText(text);
    }
    /**
     * 确认密码警告
     * */
    tipInputPas2(text){
        if(!this.hasOwnProperty('inputPas2')){
            this.inputPas2 = new MesTip(this.refs.inputPas2.refs.inputPas2);
            this.inputPas2.addNode();
        };
        this.inputPas2.changeText(text);
    }
    /**
     * 确认密码警告
     * */
    tipResetPwd(text){
        if(!this.hasOwnProperty('resetPwd')){
            this.resetPwd = new MesTip(this.refs.resetPwd);
            this.resetPwd.addNode();
        };
        this.resetPwd.changeText(text);
    }
    /** 警告结束 **/
    validationGS(){
        if(this.state.pas1 === ''){
            this.tipInputPas1('请输入新密码！');
        }if(this.state.pas1.length < 6 || this.state.pas1.length > 16){
            this.tipInputPas1('密码格式错误，密码长度应该在6-16位之间');
        }else if(this.state.pas2 === ''){
            this.tipInputPas2('请输入确认新密码！');
        }else if(this.state.pas2.length < 6 || this.state.pas2.length > 16){
            this.tipInputPas2('密码格式错误，密码长度应该在6-16位之间');
        }else if(this.state.pas2 !== this.state.pas1){
            this.tipInputPas2('两次密码不一致');
        }else{
           Axios({
                method: 'post',
                url: '/updateEmployee',
                params:{
                    id:store.getState().role.id,
                    password :this.state.pas2
                },
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            })
                .then((response) => {
                    if(response.data.opResult == "0"){
                        this.props.changeModel(6);
                        setTimeout(()=>{
                            sessionStorage.setItem("role",null);
                            store.dispatch(an('ROLE', null));
                        },3000)
                    }else if(response.data.opResult == "4"){
                        this.tipResetPwd("新旧密码不能旧密码相同");
                        setTimeout(()=>{
                            this.tipResetPwd("");
                        },1500)
                    }else{
                        this.props.changeModel(7);
                    }
                })
                .catch((error) => {
                        console.log(error);
                    }
                );
        }
    }


    componentWillMount(){

    }
    componentDidMount() {

    }
    componentWillUnmount() {
        if(this.hasOwnProperty('inputPas1')){
            this.inputPas1.removeNode();
            delete this.inputPas1;
        };
        if(this.hasOwnProperty('inputPas2')){
            this.inputPas2.removeNode();
            delete this.inputPas2;
        };
        if(this.hasOwnProperty('resetPwd')){
            this.resetPwd.removeNode();
            delete this.resetPwd;
        };
    }
    componentWillReceiveProps(nextProps){

    }

    render(){
        return(
            <div className={classNames({[stylerRed['login-box']]:true,[style['login-h']]:true})}>
                <div className={stylerRed['box']}>
                    <LoginInputText  type={'password'} ref='inputPas1' refId={'inputPas1'} querData={this.querDataPas1.bind(this)}  className={style['input-margin']} placeholder="请输入新密码"/>
                    <LoginInputText  type={'password'} ref='inputPas2' refId={'inputPas2'} querData={this.querDataPas2.bind(this)}  className={style['input-margin']} placeholder="请再次确认新密码"/>
                </div>
                <div className={stylerRed['stylerRed-btn']}>
                    <div className={classNames({"may-btn":true})}  ref={'resetPwd'} onClick={this.validationGS.bind(this)}>确认</div>
                    <div className={classNames({"may-btn-gary":true})} onClick={this.props.changeModel.bind(this,this.props.isForget ? 1 : 0)}>返回上一步</div>
                </div>
                <div style={{textAlign:'center',height:'30px'}}>客服热线：028-65733800</div>
            </div>
        )
    }
}
