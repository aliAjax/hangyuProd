import React, { Component } from 'react';
import {store} from "../../store";
import styles from './../../static/css/loginAndRegister/boxes.scss';

import Exhibition from './exhibition';
import Login from './login';
import Registered from './registered';
import RegisteredSuccess from './registeredSuccess';  // 注册成功
import RegisteredErr from './registeredErr';  // 注册失败
import BackPas from './backPas';  // 找回密码
import NewPas from './newPas';
import BackPasSuccsess from './backPasSuccsess';
import BackPasErr from './backPasErr';

class Boxes extends Component{
    constructor(props){
        super(props);
        this.state = {
            model:0, // 默认为0，即登录
            title:"航线交易，可遇可求。"
        }
    }
    componentWillMount(){

    }
    woListScrollMes(e){
        this.refs['exhibition'].wheel(e,this)
    }
    changeModel(t){
        let title = '';
        switch (t){
            case 0:
                title = "航线交易，可遇可求。";
                break;
            case 1:
                title = "注册账号";
                break;
            case 2:
                title = "找回密码";
                break;
            default:
                title = "航线交易，可遇可求。";
                break;
        };
        this.setState({
            model:t,
            title
        });
    }
    /**
     * 动态渲染组件  0、登录，1、注册，2、忘记密码, 3、注册成功 4 、注册失败 5、设置新密码 6、修改密码成功 7、修改密码失败
     * */
    renderModel(){
        switch (this.state.model){
            case 0:
                return(<Login changeModel={this.changeModel.bind(this)}/>);
                break;
            case 1:
                return(<Registered changeModel={this.changeModel.bind(this)}/>);
                break;
            case 2:
                return(<BackPas changeModel={this.changeModel.bind(this)}/>);
                break;
            case 3:
                return(<RegisteredSuccess changeModel={this.changeModel.bind(this)}/>);
                break;
            case 4:
                return(<RegisteredErr changeModel={this.changeModel.bind(this)}/>);
                break;
            case 5:
                return(<NewPas changeModel={this.changeModel.bind(this)}/>);
                break;
            case 6:
                return(<BackPasSuccsess changeModel={this.changeModel.bind(this)}/>);
                break;
            case 7:
                return(<BackPasErr changeModel={this.changeModel.bind(this)}/>);
                break;

        };
    }

    /**
     * 登录注册切换
     *
     * */
    changeMl(n){
        this.setState({model:n})
    }
    render(){
        if(store.getState().role !== null){
            return null;
        };
        return(
            <div style={{overflowY:'hidden'}} className={'context'} onWheel={this.woListScrollMes.bind(this)}>
                <div className={styles['loginZc']}>
                    <span onClick={this.changeModel.bind(this,0)}>登录</span>/<span onClick={this.changeModel.bind(this,1)}>注册</span>
                </div>
                <Exhibition ref={'exhibition'} />
                {
                    this.state.model !== '' ?  <div className={styles['box']}>
                            <div className={styles['login-close']}>
                                <span>{this.state.title}</span>
                                <div className={"btn-w"} onClick={this.changeMl.bind(this,'')}>&#xe62c;</div>
                            </div>
                            {
                                this.renderModel()
                            }
                        </div>
                        :
                        ""
                }
            </div>
        )
    }
}
export default Boxes;