import React, { Component } from 'react';
import Axios from './../../utils/axiosInterceptors';
import {Select,Checkbox} from 'antd';
import classNames from 'classnames';
import Prompt from './../../utils/prompt';
import Validation from './../../components/validation/validation';
import LoginInputText from './../../components/input/loginInputText';
import style from './../../static/css/loginAndRegister/loginMain.scss';
import stylerRed from './../../static/css/loginAndRegister/registered.scss';

const Option = Select.Option;


export default class Registered extends Component {
    constructor(props){
        super(props);
        this.state = {
            showQt:false,
            userType: '航司',    // 航司
            concat: "",          // 联系人
            companyName: "",    //单位名称
            tel: "",              // 电话
            department: "",     // 部门
            position: "",       // 职位
            email: "",           // 邮箱
            companyAddr: "",     // 地址
            comment: "",          // 备注
            validCode: ""       // 验证码参数
        }
    }
    changeQt(e){
        this.setState({
            showQt:e.target.checked
        })
    }
    changeSelect(value){
        this.setState({
            userType:value
        });
    }

    /**
     * 获取联系人
     *
     * */
    querDataLXR(e){
        this.setState({
            concat:e.target.value
        });
        if(e.type === 'blur'){
            if(this.state.concat !== ''){
                this.tipInputLXR('');
            }
        }
    }
    /**
     * 获取单位全称
     * */
    querDataDWQC(e){
        this.setState({
            companyName:e.target.value
        });
        if(e.type === 'blur'){
            if(e.target.value !== ''){
                this.tipInputDWQC('');
            }
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
        let type = /^1[34578]\d{9}$/.test(e.target.value);
        if(e.type === 'blur'){
            if(type){
                this.tipInputLXFS('');
            }else{
                this.tipInputLXFS('请输入正确的手机号!');
            }
        }
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
    /**
     * 获取部门
     * */
    querDataBM(e){
        this.setState({
            department:e.target.value
        });
    }

    /**
     * 获取职位
     * */
    querDataZW(e){
        this.setState({
            position:e.target.value
        });
    }
    /**
     * 获取邮箱
     * */
    querDataYX(e){
        this.setState({
            email:e.target.value
        });
    }
    /**
     * 获取地址
     * */
    querDataDZ(e){
        this.setState({
            companyAddr:e.target.value
        });
    }
    /**
     * 获取备注说明
     * */
    querDataBZSM(e){
        this.setState({
            comment:e.target.value
        });
    }

    /** 警告开始 **/
    /**
     * 联系人输入框的警告信息
     * */
    tipInputLXR(text){
        this.refs["inputLXR"].tip(text);
    }
    /**
     * 单位全称输入框的警告信息
     * */
    tipInputDWQC(text){
        this.refs["inputDWQC"].tip(text);
    }
    /**
     * 联系方式输入框的警告信息
     * */
    tipInputLXFS(text){
        this.refs["inputLXFS"].tip(text);
    }
    /**
     * 短信验证码输入框的警告信息
     * */
    tipInputYZM(text){
        this.refs["inputYZM"].tip(text);
    }

    /** 警告结束 **/
    /**
     * 注册
     * */
    send(){
       Axios({
            method: 'post',
            url: '/register',
            params: this.state,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        })
            .then((response) => {
                if (response.data.opResult == "0") {
                    this.props.changeModel(3);
                }else{
                    this.props.changeModel(4);
                };
            })
            .catch((error) => {
                    console.log(error);
                }
            );
    }

    /**
     * 整合验证格式
     * */
    validationGS(){
        if(this.state.concat === ''){
            this.tipInputLXR("请输入联系人！");
        }else if(this.state.companyName === ''){
            this.tipInputDWQC("请输入单位全称！");
        }else if(this.state.tel === ''){
            this.tipInputLXFS('请输入联系电话！');
        }else if(!/^1[34578]\d{9}$/.test(this.state.tel)){
            this.tipInputLXFS('请输入正确的联系电话！');
        }else if(this.state.validCode === ''){
            this.tipInputYZM('请输入短信验证码！');
        }else{
            this.send();
        }
    }

    /**
     * 卸载组件的时候移除实例
     * */
    componentWillUnmount(){

    }
    wheel(event){
        event.stopPropagation()
    }
    render(){
        return(
            <div className={classNames({[stylerRed['login-box']]:true,[style['login-h']]:true})} onWheel={this.wheel.bind(this)}>
                <div className={stylerRed['box']}>
                    <Select
                        defaultValue="航司"
                        dropdownClassName="scroll"
                        className={'cover-ant-select-selection'}
                        onChange={this.changeSelect.bind(this)}
                    >
                        <Option value={'航司'}>航司</Option>
                        <Option value={'政府/机场'}>政府/机场</Option>
                        <Option value={'包机商'}>包机商</Option>
                        <Option value={'其它'}>其它</Option>
                    </Select>
                    <Prompt ref='inputLXR' style={{bottom:"0px"}}>
                        <LoginInputText type={'text'} refId={'inputLXR'} querData={this.querDataLXR.bind(this)}  className={style['input-margin']} placeholder="联系人" />
                    </Prompt>
                    <Prompt ref='inputDWQC' style={{bottom:"0px"}}>
                        <LoginInputText type={'text'} refId={'inputDWQC'} querData={this.querDataDWQC.bind(this)}  className={style['input-margin']} placeholder="单位全称" />
                    </Prompt>
                    <Prompt ref='inputLXFS' style={{bottom:"0px"}}>
                        <LoginInputText type={'text'}  refId={'inputLXFS'} querData={this.querDataLXFS.bind(this)}  className={style['input-margin']} placeholder="联系方式（请输入电话）"/>
                    </Prompt>
                    {
                        /^1[34578]\d{9}$/.test(this.state.tel) ?
                            <Prompt ref='inputYZM' style={{bottom:"-17px"}}>
                                <Validation validType={'0'} refId={'inputYZM'} defaultValue={this.state.tel} inputCode={this.inputCode.bind(this)}/>
                            </Prompt>
                           : ''
                    }
                    {
                        this.state.showQt ? <LoginInputText ref='inputBM' refId={'inputBM'} querData={this.querDataBM.bind(this)} className={style['input-margin']} type={'text'} placeholder="部门" /> : ''
                    }
                    {
                        this.state.showQt ? <LoginInputText ref='inputZW' refId={'inputZW'} querData={this.querDataZW.bind(this)} className={style['input-margin']} type={'text'} placeholder="职位" /> : ''
                    }
                    {
                        this.state.showQt ? <LoginInputText ref='inputYX' refId={'inputYX'} querData={this.querDataYX.bind(this)} className={style['input-margin']} type={'text'} placeholder="邮箱" /> : ''
                    }
                    {
                        this.state.showQt ? <LoginInputText ref='inputDZ' refId={'inputDZ'} querData={this.querDataDZ.bind(this)} className={style['input-margin']} type={'text'} placeholder="地址" /> : ''
                    }
                    {
                        this.state.showQt ? <LoginInputText ref='inputBZSM' refId={'inputBZSM'} querData={this.querDataBZSM.bind(this)} className={style['input-margin']} type={'text'} placeholder="备注说明" /> : ''
                    }
                </div>
                <div style={{paddingLeft:'25px'}}>
                    <Checkbox onChange={this.changeQt.bind(this)}>展开可选填内容，填写完整表单</Checkbox>
                </div>
                <div className={stylerRed['stylerRed-btn']}>
                    <div className={classNames({"may-btn":true})} onClick={this.validationGS.bind(this)}>确认</div>
                    <div className={classNames({"may-btn-gary":true})} onClick={this.props.changeModel.bind(this,0)}>返回登录</div>
                </div>
            </div>
        )
    }
}