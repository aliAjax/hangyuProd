import React, { Component } from 'react';
import style from './../../static/css/loginAndRegister/public.scss';


export default class Success extends  Component{
    constructor(props){
        super(props);
        if(this.props.text === ''){
            throw "err"
        }
    }
    componentWillMount(){

    }
    componentDidMount() {
        setTimeout(()=>{
            this.props.changeModel('');
        },3000)
    }
    componentWillUnmount() {

    }
    componentWillReceiveProps(nextProps){

    }

    render(){
        return(
            <div className={style["loginErr-box"]}>
                <h3 className={style["loginErr-title"]}>{this.props.text}</h3>
                <p className={style["loginErr-mes"]} style={{paddingBottom:'160px'}}>
                    {
                        this.props.tip === "" ? "3s后关闭关闭弹框" : this.props.tip
                    }
                </p>
                <div style={{textAlign:'center',height:"44px",lineHeight:"44px"}} >客服热线：028-65733800</div>
            </div>
        )
    }
}
