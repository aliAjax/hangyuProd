import React, { Component } from 'react';
import Axios from './../../utils/axiosInterceptors';
import classNames from 'classnames';
import MesTip from '../../utils/messageTip';
import Validation from '../../components/validation/validation';
import LoginInputText from '../../components/input/loginInputText';
import style from '../../static/css/loginAndRegister/loginMain.scss';
import stylerRed from '../../static/css/loginAndRegister/registered.scss';

export default class BackPas extends  Component{
    constructor(props){
        super(props);
        this.state = {
            url:"validCode",
            tel: "",              // 电话
            validCode: "",       // 验证码参数
            emailSet:false,
            email:"",
            phone:"",
            validType:1
        }
    }

    /**
     * 获取联系电话
     * */
    querDataLXFS(e){
        e.target.value = e.target.value.replace(/[\u4e00-\u9fa5]/g,'');
        this.setState({
            tel:e.target.value
        });
        if(e.target.value.includes("@")){
            this.setState({
                contactWay:e.target.value,
                emailSet:false
            });
            let type = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(e.target.value);
            if(e.type === 'blur'){
                if(type){
                    this.setState({
                        emailSet:true
                    });
                    this.tipInputLXFS('');
                }else{
                    this.tipInputLXFS('请输入正确的格式!');
                }
            }
        }else{
            this.setState({
                contactWay:e.target.value
            });
            let type = /^1[34578]\d{9}$/.test(e.target.value);
            if(e.type === 'blur'){
                if(type){
                    this.tipInputLXFS('');
                }else{
                    this.tipInputLXFS('请输入正确的格式!');
                }
            }
        };

    }
    /**
     *  设置手机验证码
     * */
    inputCode(p,e){
        if(p === this.state.tel){
            this.setState({
                validCode:e.target.value
            });
            if(e.type === 'blur'){
                if(e.target.value !== ''){
                    this.tipInputYZM('');
                }
            }

        }
    }
    /** 警告开始 **/
    /**
     * 联系方式输入框的警告信息
     * */
    tipInputLXFS(text){
        if(!this.hasOwnProperty('inputLXFS')){
            this.inputLXFS = new MesTip(this.refs.inputLXFS.refs.inputLXFS);
            this.inputLXFS.addNode();
        };
        this.inputLXFS.changeText(text);
    }
    /**
     * 短信验证码输入框的警告信息
     * */
    tipInputYZM(text){
        if(!this.hasOwnProperty('inputYZM')){
            this.inputYZM = new MesTip(this.refs.inputYZM.refs.inputYZM);
            this.inputYZM.addNode();
        };
        this.inputYZM.changeText(text);
    }
    /**
     * 确认密码警告
     * */
    tipResetPwd(text){
        if(!this.hasOwnProperty('resetPwd')){
            this.resetPwd = new MesTip(this.refs.resetPwd);
            this.resetPwd.setCorrectionY(-70);
            this.resetPwd.addNode();
        };
        this.resetPwd.changeText(text);
    }

    /** 警告结束 **/

    validationGS(){
       if(this.state.tel === ''){
            this.tipInputLXFS('请输入账号绑定的手机号或者邮箱！');
        }else if(this.state.validCode === ''){
           if(this.state.tel.includes('@')){
               this.tipInputYZM('请输入邮箱验证码！');
           }else{
               this.tipInputYZM('请输入短信验证码！');
           }
        }else{
           Axios({
               method: 'post',
               url: this.state.url,
               params: this.state,
               headers: {
                   'Content-type': 'application/x-www-form-urlencoded'
               }
           })
               .then((response) => {
                   if(response.data.opResult  == '0'){
                       sessionStorage.setItem("tel",this.state.tel);
                       this.props.changeModel(2);
                   }else{
                       if(this.state.tel.includes('@')){
                           this.tipResetPwd("邮箱账号不存在！");
                       }else{
                           this.tipResetPwd("手机号码不存在！");
                       }
                   }
               })
               .catch((error) => {
                       console.log(error);
                   }
               );

        }
    }

    componentWillUnmount() {
        if(this.hasOwnProperty('inputLXFS')){
            this.inputLXFS.removeNode();
            delete this.inputLXFS;
        };
        if(this.hasOwnProperty('inputYZM')){
            this.inputYZM.removeNode();
            delete this.inputYZM;
        };
        if(this.hasOwnProperty('resetPwd')){
            this.resetPwd.removeNode();
            delete this.resetPwd;
        };
    }
    render(){
        return(
            <div className={classNames({[stylerRed['login-box']]:true,[style['login-h']]:true})}>
                <div className={stylerRed['box']}>
                    <LoginInputText type={'text'} ref='inputLXFS' refId={'inputLXFS'} querData={this.querDataLXFS.bind(this)}  className={style['input-margin']} placeholder="请输入账号绑定的邮箱或者手机号码"/>
                    {
                        /^1[34578]\d{9}$/.test(this.state.tel) ? <Validation validType={'1'} ref='inputYZM' refId={'inputYZM'} defaultValue={this.state.tel} inputCode={this.inputCode.bind(this)}/> : ''
                    }
                    {
                        /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(this.state.tel) && this.state.emailSet ? <Validation validType={'1'} ref='inputYZM' refId={'inputYZM'} defaultValue={this.state.tel} inputCode={this.inputCode.bind(this)}/> : ''
                    }
                </div>
                <div className={stylerRed['stylerRed-btn']}>
                    <div className={classNames({"may-btn":true})} ref={'resetPwd'} onClick={this.validationGS.bind(this)}>确认</div>
                    <div className={classNames({"may-btn-gary":true})} onClick={this.props.changeModel.bind(this,0)}>返回上一步</div>
                </div>
            </div>
        )
    }
}
