import React, { Component } from 'react';
import classNames from 'classnames';
import style from './../../static/css/loginAndRegister/public.scss';


export default class BackPasSuccsess extends  Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className={style["loginErr-box"]}>
                <h3 className={style["loginErr-title"]}>(⊙ˍ⊙)修改失败</h3>
                <p className={style["loginErr-mes"]} style={{paddingBottom:'160px'}}>请稍后重试或者拨打客服热线</p>
                <div className={classNames({"may-btn":true,[style["login-btn"]]:true})} onClick={this.props.changeModel.bind(this,0)}>返回登录</div>
                <div style={{textAlign:'center',height:"44px",lineHeight:"44px"}}>客服热线：028-65733800</div>
            </div>
        )
    }
}
