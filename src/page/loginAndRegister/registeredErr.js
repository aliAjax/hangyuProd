import React, { Component } from 'react';

import style from '../../static/css/loginAndRegister/public.scss';
import {sy} from "../bmap/bmapResources";


export default class RegisteredErr extends  Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className={style["loginErr-box"]}>
                <h3 className={style["loginErr-title"]}>(⊙ˍ⊙)因为某种神秘力量<br/>您的申请提交失败</h3>
                <p className={style["loginErr-mes"]}>请稍后再试或者拨打客服热线</p>
                <div style={{textAlign:'center'}}>客服热线：028-65733800</div>
            </div>
        )
    }
}
