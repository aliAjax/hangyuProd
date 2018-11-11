import React,{Component} from 'react';
import classNames from 'classnames';
import Prompt from './../../../utils/prompt';
import {store} from './../../../store/index';
import Axios from './../../../utils/axiosInterceptors';
import Validation from './../../../components/validation/validation';
import style from './payPwd.scss';
import stylerRed from './../../../static/css/loginAndRegister/registered.scss';
export default class InputPayPwd extends Component{
    constructor(props){
        super(props);
        this.state = {
            tel:store.getState().role.phone,
            code:""
        }
    }
    inputCode(p,e){
        if(p === this.state.tel){
            this.setState({
                code:e.target.value
            });
            if(e.type === 'blur'){
                if(e.target.value !== ''){
                    this.refs["inputYZM"].tip("");
                }
            }
        }
    }
    validationGS(){
        if(this.state.code != ""){
            Axios({
                method: 'post',
                url: '/validCode',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params:{
                    contactWay:this.state.tel,
                    validCode:this.state.code
                }
            })
                .then((response) => {
                    if(response.data.opResult === "0"){
                        this.props.modelm(1);
                    }else{
                        this.refs["inputYZM"].tip("验证码有误，请重新输入");
                    }
                })
                .catch((error) => {
                        console.log(error);
                    }
                );
        }else{
            this.refs["inputYZM"].tip("请输入验证码！");
        }
    }
    close(){
        this.props.changeModel('');
    }
    render(){
        return(
            <div className={classNames({[style["input-box"]]:true})}>
                <div style={{lineHeight:"24px"}}>请输入手机验证码</div>
                <Validation validType={'1'} ref='inputYZM' refId={'inputYZM'} defaultValue={this.state.tel}  inputCode={this.inputCode.bind(this)}/>
                <Prompt ref='inputYZM' style={{top:"-22px"}}>
                    <div className={stylerRed['stylerRed-btn']} style={{"padding":0,marginTop:"83px"}}>
                        <div className={classNames({"may-btn":true})} ref={'resetPwd'} onClick={this.validationGS.bind(this)}>下一步</div>
                        <div className={classNames({"may-btn-gary":true})} onClick={this.close.bind(this)}>取消</div>
                    </div>
                </Prompt>
                <div style={{textAlign:'center',height:'30px',marginTop:"40px"}}>客服电话：028-65733800</div>
            </div>
        )
    }
}