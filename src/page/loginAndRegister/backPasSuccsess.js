import React, { Component } from 'react';
import classNames from 'classnames';
import style from './../../static/css/loginAndRegister/public.scss';
import {sy} from "../bmap/bmapResources";


export default class BackPasSuccsess extends  Component{
    constructor(props){
        super(props);
    }
    componentWillMount(){

    }
    componentDidMount() {
        setTimeout(()=>{
            this.props.changeModel(0);
        },3000)
    }
    componentWillUnmount() {

    }
    componentWillReceiveProps(nextProps){

    }

    render(){
        return(
            <div className={style["loginErr-box"]}>
                <h3 className={style["loginErr-title"]}>(^▽^)修改成功</h3>
                <p className={style["loginErr-mes"]} style={{paddingBottom:'160px'}}>3s后自动返回登录</p>
                <div className={classNames({"may-btn":true,[style["login-btn"]]:true})} onClick={this.props.changeModel.bind(this,0)}>返回登录</div>
                <div style={{textAlign:'center',height:"44px",lineHeight:"44px"}} >客服热线：028-65733800</div>
            </div>
        )
    }
}
