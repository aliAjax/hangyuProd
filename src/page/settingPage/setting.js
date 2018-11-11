import React,{Component} from 'react';
import classNames from 'classnames';
import {Modal} from "antd";
import Axios from './../../utils/axiosInterceptors'
import BackPas from './backPasSetting';  // 找回密码
import NewPas from './newPas';
import VerifyPassword from './verifyPassword';
import PayPas from './payPwd/payPas';
import Err from './Err';
import Success from './Success';
// import Email from './emailbund';
import upload from './../../utils/upload';
import {store} from './../../store/index';
import {assemblyAction as an} from "../../utils/assemblyAction";
import style from './../../static/css/setting/setting.scss';
import styles from './../../static/css/loginAndRegister/boxes.scss';

import ChangePhone from './changePhone';
import NewPhone from './newPhone';
import VertifyPhone from './vertifyPhone';

import ChangeEmail from './changeEmail';
import NewEmail from './newEmail';
import VertifyEmail from './vertifyEmail';
import {unbindEmail} from "./emailBind";
export default class Setting extends Component{
    constructor(props){
        super(props);
        this.state = {
            positionDisabled:true,  // 职位禁用
            departmentDisabled:false,   // 部门禁用
            concatDisabled:false,   // 姓名禁用,
            title:"",
            tip:"",
            model:'',
            process:'',   // 流程
            text:"",
            email:"",
            phone:"",
            steps:0,
            isForget:false,
            settingSubShow: false,  // 按钮是否显示
            concat: store.getState().role.concat,  // 姓名
            department: store.getState().role.department,  // 部门
        }
    }
    componentDidMount(){
        if(this.props.match.params.type != 'false'){
            this.changeModel(3);
        }
    }
    /**
     * 更换头像
     * */
    upload(e){
        upload(this.refs['male']).then(function (reader) {
            let data = {
                suffix:reader.result.split(";")[0].split("/")[1],
                imageStr:reader.result.split(",")[1]
            };
            let formData = new FormData();
            formData.append('suffix',data.suffix);
            formData.append('imageStr',data.imageStr);
            Axios({
                method: 'post',
                url: '/upload',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:formData
            }).then((response)=>{
                let role = JSON.parse(JSON.stringify(store.getState().role));
                if(response.data.opResult === "0"){
                    role.headPortrait = response.data.path;
                    store.dispatch(an("ROLE",role))
                }
            }).catch(function (e) {
                console.log(e)
            })
        }).catch(function (e) {
            console.log(e)
        })


    }
    /**
     * 修改密码
     * */
    changePwd(){

    }
    /**
     * 切换模式
     * */
    async changeModel(t,num){
        let title = '';
        let text = '';
        if(t === 0){
            t = this.state.steps
        };
        switch (t){
            case 0:
                title = "验证密码";
                break;
            case 1:
                title = "找回密码";
                break;
            case 2:
                title = "输入新密码";
                break;
            case 3:
                title = store.getState().role.payPassword === "false" ? "设置交易密码" : "修改交易密码";
                break;
            case 6:
                title = "修改成功";
                text = "(^▽^)修改成功！";
                this.setState({
                    tip:"3s后自动跳转到登录页"
                });
                break;
            case 7:
                title = "修改失败";
                text = "(⊙ˍ⊙)修改失败！";
                break;
            case 9:
                title = "解绑邮箱";
                break;
            case 10 :
                title = "绑定邮箱";
                this.setState({
                    email:num
                });
                break;
            case 11 :
                title = "绑定邮箱";
                break;
            case 12:
                title = "绑定邮箱";
                this.setState({
                    email:num
                });
                break;
            case 13:
                t = 6;
                title = "绑定邮箱";
                text = '(^▽^)更换邮箱成功';
                break;
            case 14:
                t = 7;
                title = "绑定邮箱";
                text = '(⊙v⊙)更换邮箱失败';
                break;
            case 20:
                title = "更换手机";
                this.setState({
                    phone:num
                });
                break;
            case 21:
                title = "更换手机";
                this.setState({
                    phone:num
                });
            case 22:
                title = "更换手机";
                this.setState({
                    phone:num
                });
                break;
            case 23:
                t = 6;
                title = "更换手机";
                this.setState({
                    phone:num
                });
                text = '(^▽^)更换手机成功';
                break;
            case 24:
                t = 7;
                title = "更换手机";
                this.setState({
                    phone:num
                });
                text = '(⊙v⊙)更换手机失败';
                break;
            default:
                title = "航线交易，可遇可求。";
                break;
        };
        this.setState(()=>{
            return{
                model:t,
                title,
                text
            }
        })
    }
    // ''、关闭  0、验证密码，1、找回密码 2、新密码 3、 4、6、修改密码成功 7、修改密码失败 9、解绑邮箱验证密码 10 、绑定邮箱
    // 20、更换手机-验证密码 21、输入新手机号 22、输入验证码
    async emailcL(){
        let t = 6;
        try{
            await unbindEmail();
            this.state.title = "解绑邮箱";
            this.state.text = "(^▽^)邮箱解绑成功！";
            t = 6;
            let role = JSON.parse(JSON.stringify(store.getState().role));
                role.email = null;
                store.dispatch(an("ROLE",role));
        }catch (e) {
            this.state.title = "解绑邮箱";
            this.state.text = "(⊙ˍ⊙)邮箱解绑失败！";
            t = 7;
        }
        this.setState(()=>{
            return{
                model:t
            }
        })
    }
    renderModel(){
        switch (this.state.model){
            case 0:
                return(<VerifyPassword changeIsForget={this.changeIsForget.bind(this)} changeModel={this.changeModel.bind(this)}/>);
                break;
            case 1:
                return(<BackPas changeModel={this.changeModel.bind(this)}/>);
                break;
            case 2:
                return(<NewPas isForget={this.state.isForget} changeModel={this.changeModel.bind(this)}/>);
                break;
            case 3:
                return(<PayPas isForget={this.state.isForget} changeModel={this.changeModel.bind(this)}/>);
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                return(<Success tip={this.state.tip} text={this.state.text} changeModel={this.changeModel.bind(this)}/>);
                break;
            case 7:
                return(<Err text={this.state.text} changeModel={this.changeModel.bind(this)}/>);
                break;
            case 8:
                // return(<Email changeModel={this.changeModel.bind(this)}/>);
            case 9:
                return(<VerifyPassword emailcL={this.emailcL.bind(this)} steps={0} changeIsForget={this.changeIsForget.bind(this,true)} changeModel={this.changeModel.bind(this)}/>);
                break;
            case 10:
                return(<ChangeEmail changeIsForget={this.changeIsForget.bind(this,true)} changeModel={this.changeModel.bind(this)}/>);
                break;
            case 11:
                return(<NewEmail email={this.state.email} changeModel={this.changeModel.bind(this)}/>);
                break;
            case 12:
                return(<VertifyEmail email={this.state.email} changeModel={this.changeModel.bind(this)}/>);
                break;
            case 20:
                return(<ChangePhone changeIsForget={this.changeIsForget.bind(this,true)} changeModel={this.changeModel.bind(this)}/>);
                break;
            case 21:
                return(<NewPhone changeModel={this.changeModel.bind(this)} phone={this.state.phone} />);
                break;
            case 22:
                return(<VertifyPhone changeModel={this.changeModel.bind(this)} phone={this.state.phone} />);
                break;
        };
    }
    changePhone(){
        this.setState({
            steps:20
        },function () {
            this.changeModel(20);
        });
    }
    
    changePas(){
        this.setState({
            steps:0
        },function () {
            this.changeModel(0);
        });
    }
    changePayPas(){
        this.setState({
            steps:0
        },function () {
            this.changeModel(3);
        });
    }
    changeEmail(){
        let role = store.getState().role;
        let s = (role.email === null || role.email === '') ? 10 : 9;
        this.setState({
            steps: s
        }, ()=> {
            this.changeModel(s);
        });
    }
    changeIsForget(isForget){
        this.setState({
            isForget
        })
    }
    /*
    * 按键
    * */
    concatChangeFn(e) {  // 联系人是否更改
        e.target.value = e.target.value.replace(/ /g,'');
        let role = store.getState().role;
        this.setState({
            concat: e.target.value,
        },()=>{
            if(this.state.department == role.department && this.state.concat == role.concat) {
                this.setState({
                    settingSubShow: false
                })
            }else {
                this.setState({
                    settingSubShow: true
                })
            }
        })
    }
    departmentChangeFn(e) {  // 部门是否修改
        e.target.value = e.target.value.replace(/ /g,'');
        let role = store.getState().role;
        this.setState({
            department: e.target.value,
        },()=>{
            if(this.state.department == role.department && this.state.concat == role.concat) {
                this.setState({
                    settingSubShow: false
                })
            }else {
                this.setState({
                    settingSubShow: true
                })
            }
        })
    }
    doEdit() {  // 确定修改
        Axios({
            method: 'POST',
            url: '/updateEmployee',
            params:{
                id: store.getState().role.id,
                concat: this.state.concat,
                department: this.state.department,
            }
        }).then(res=>{
            if(res.data.opResult === '0'){
                //修改对应vuex
                store.dispatch(an('CHANGEROLE',{
                    concat: this.state.concat,
                    department: this.state.department,
                }));
                this.setState({
                    settingSubShow:false
                });
                Modal.success({
                    content: '修改成功！',
                });
            }else{
                Modal.error({
                    content: '修改失败！',
                });
            }
        })
    }
    cancel() {  // 点击“取消”，将内容还原
        this.setState({
            concat: store.getState().role.concat,
            department: store.getState().role.department,
            settingSubShow: false,
        })
    }
    render(){
        let role = store.getState().role;
        return(
            <div className={style['settingBox']}>
                {/*蒙层*/}
                {
                    this.state.model === '' ? '' :
                        <div className={style['setting-mc']}>
                            <div style={{margin:'150px auto 0',width:"350px",borderRadius:'15px',overflow:"hidden",backgroundColor:'white'}}>
                                <div className={styles['login-close']} style={{background:"white"}}>
                                    <span>{this.state.title}</span>
                                    <div className={"btn-w"} onClick={this.changeModel.bind(this,'')}>&#xe62c;</div>
                                </div>
                                {
                                    this.renderModel()
                                }
                            </div>
                        </div>
                }
                <div className={style['setting-context']}>
                    <div className={style['setting-title']}>设置</div>
                    <ul className={style['setting-item-box']}>
                        <li className={style['setting-item']}>
                            <span>头像</span>
                            <div className={style['setting-item1']}>
                                <img style={{width:'40px',height:"40px",borderRadius:'20px',overflow:"hidden"}} src={store.getState().role.headPortrait} alt=""/>
                                <input style={{display:"none"}} onChange={this.upload.bind(this)} id="male" ref='male' name="sex" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"/>
                                <label htmlFor="male"><div className={style['setting-btn']}>更换头像</div></label>
                            </div>
                        </li>
                        <li>
                            <span>关联手机</span>
                            <div className={style['setting-item1']}>
                                <div>{role.phone}</div>
                                <button className={style['setting-btn']} onClick={this.changePhone.bind(this)}>更换手机</button>
                            </div>
                        </li>
                        <li>
                            <span>登录密码</span>
                            <div className={style['setting-item1']}>
                                <div>*******</div>
                                <button className={style['setting-btn']} onClick={this.changePas.bind(this)}>修改登录密码</button>
                            </div>
                        </li>
                        <li>
                            <span>支付密码</span>
                            <div className={style['setting-item1']}>
                                <div>{role.payPassword == "false" ? "" : "*******"}</div>
                                <button className={style['setting-btn']} onClick={this.changePayPas.bind(this)}>{role.payPassword == "false" ? "设置支付密码" : "修改支付密码"}</button>
                            </div>
                        </li>
                        <li>
                            <span>邮箱</span>
                            <div className={style['setting-item1']}>
                                <div>{role.email}</div>
                                <button className={style['setting-btn']} onClick={this.changeEmail.bind(this)}>{(role.email === null || role.email  === "") ? '绑定邮箱' : '解绑邮箱'}</button>
                            </div>
                        </li>
                        <li>
                            <span>账号</span>
                            <div>{role.username}</div>
                        </li>
                        <li>
                            <span>姓名</span>
                            <div>
                                <input disabled={this.state.concatDisabled}
                                       className={classNames({
                                            [style['setting-input']]:true,
                                            [style['setting-input-disabled']]:this.state.concatDisabled
                                       })}
                                       defaultValue={role.concat}
                                       maxLength={20}
                                       type="text"
                                       value={this.state.concat}
                                       onChange={this.concatChangeFn.bind(this)}/>
                            </div>
                        </li>
                        <li>
                            <span>公司</span>
                            <div>{role.companyName}</div>
                        </li>
                        <li>
                            <span>部门</span>
                            <div>
                                <input disabled={this.state.departmentDisabled}
                                       className={classNames({
                                            [style['setting-input']]:true,
                                            [style['setting-input-disabled']]:this.state.departmentDisabled
                                       })}
                                       defaultValue={role.department}
                                       maxLength={20}
                                       type="text"
                                       value={this.state.department}
                                       onChange={this.departmentChangeFn.bind(this)}/>
                            </div>
                        </li>
                        <li>
                            <span>职务</span>
                            <div>
                                <input disabled={this.state.positionDisabled} className={classNames({
                                    [style['setting-input']]:true,
                                    [style['setting-input-disabled']]:this.state.positionDisabled
                                })} defaultValue={role.position} maxLength={20} type="text"/>
                            </div>
                        </li>
                    </ul>
                    {
                        this.state.settingSubShow && (<div className={style['setting-sub']}>
                            <div className={classNames({[style['setting-determine']]:true,[style['setting-btn']]:true})}
                                 onClick={this.doEdit.bind(this)}>确定修改</div>
                            <div className={style['setting-cancel']} onClick={this.cancel.bind(this)}>取消</div>
                        </div>)
                    }
                </div>
            </div>
        )
    }
}