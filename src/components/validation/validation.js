import React, { Component } from 'react';
import { message } from 'antd';
import Axios from './../../utils/axiosInterceptors';
import style from '../../static/css/loginAndRegister/public.scss';

export default class Validation extends Component {
    constructor(props){
        super(props);
        this.state = {
            defaultValue:this.props.defaultValue,
            title:"发送验证码",
            sendIng:false,  // 是否验证码在发送中
            validType:this.props.validType
        }

    }
    sendCode(e){
        if(this.state.sendIng){
            return;
        };
        let v = this.state.defaultValue.includes("@") ? 'validEmail':'validPhone';
        let params = this.state.defaultValue.includes("@") ? {email:this.state.defaultValue,validType:this.state.validType} : {phone:this.state.defaultValue,validType:this.state.validType};
        Axios({
            method: 'GET',
            url: v,
            params,
        }).then((response)=>{
            if(response.data.opResult === "0"){
                Axios({
                    method: 'post',
                    url: '/getValidCode',
                    params:{
                        contactWay:this.state.defaultValue
                    },
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then((response) => {
                        if(response.data.opResult  == '0'){
                            this.setTimeCode(60);
                        }else{
                            message.error('发送验证码失败，请稍后再试！');
                        }
                    })
                    .catch((error) => {
                            console.log(error);
                        }
                    );
            }else{
                if(this.state.defaultValue.includes("@")){
                    if(this.state.validType === '0'){
                        message.error('邮箱已经存在请重新输入！');
                    }else{
                        message.error('邮箱不存在请重新输入！');
                    }
                }else{
                    if(this.state.validType === '0'){
                        message.error('手机号码已经存在请重新输入！');
                    }else{
                        message.error('手机号码不存在请重新输入！');
                    }
                }
            }
        })

    }
    setTimeCode(time){
        let title = '发送验证码',sendIng = false;
        if(time > 1){
            time --;
            title = `${time}'后重新发送`;
            sendIng = true;
            setTimeout(()=>{
                this.setTimeCode(time);
            },1000)
        }else{

        };
        this.setState({
            title,
            sendIng
        });
    }
    render(){
        return(
            <div className={style["user-input"]}  ref={this.props.refId === undefined ? '' : this.props.refId}>
                <input placeholder={"请输入验证码"} type="text" maxLength="6" onBlur={this.props.inputCode.bind(this,this.state.defaultValue)} />
                <span className={'user-tip'}></span>
                <div className="btn" onClick={this.sendCode.bind(this)}>{this.state.title}</div>
            </div>
        )
    }
}