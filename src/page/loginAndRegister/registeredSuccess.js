import React, { Component } from 'react';

import style from './../../static/css/loginAndRegister/public.scss';
import {sy} from "../bmap/bmapResources";


export default class RegisteredSuccess extends  Component{
    constructor(props){
        super(props);
    }
    componentWillMount(){

    }
    componentDidMount() {

    }
    componentWillUnmount() {

    }
    componentWillReceiveProps(nextProps){

    }

    render(){
        return(
            <div className={style["loginErr-box"]}>
                <h3 className={style["loginErr-title"]}>(^▽^)申请提交成功</h3>
                <p className={style["loginErr-mes"]}>审核结果将以短信方式发送，情注意查收</p>
                <div style={{textAlign:'center'}}>客服热线：028-65733800</div>
            </div>
        )
    }
}
