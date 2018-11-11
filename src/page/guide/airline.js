import React, { Component } from 'react';
import classNames from 'classnames';
import style from './../../static/css/guide/guide.scss';


export default class AirLine extends Component{
    constructor(props){
        super(props);
        this.state = {
            step:0
        }
    }
    componentDidMount(){
    }
    guide(){
        return(
            <div className={style['guide-btn-w']} onClick={this.changeStep.bind(this,"")}>跳过引导</div>
        )
    };
    changeStep(step){
        if(step === ""){
            this.props.changeStep(step)
        }else{
            this.setState({
                step
            })
        }
    }
    render(){
        return (
            <div className={style['content']}>
                <div className={classNames({[style['resp']]:true,[style["showDisplay"]]:(this.state.step === 0)})}>
                    <img src={require("./../../static/img/guide/airLine/1.png")} alt=""/>
                    <div className={style['resp-btn-box']}>
                        <div className={style['guide-btn-b']} onClick={this.changeStep.bind(this,1)}>下一条</div>
                        {this.guide()}
                    </div>
                </div>
                <div className={classNames({[style['demand']]:true,[style["showDisplay"]]:(this.state.step === 1)})}>
                    <img src={require("./../../static/img/guide/airLine/2.png")} alt=""/>
                    <div className={style['demand-btn-box']}>
                        <div className={style['guide-btn-b']} onClick={this.changeStep.bind(this,2)}>下一条</div>
                        {this.guide()}
                    </div>
                </div>
                <div className={classNames({[style['opinion']]:true,[style["showDisplay"]]:(this.state.step === 2)})}>
                    <img src={require("./../../static/img/guide/airLine/3.png")} alt=""/>
                    <div className={style['opinion-btn-box']}>
                        <div className={style['guide-btn-b']} onClick={this.changeStep.bind(this,3)}>下一条</div>
                        {this.guide()}
                    </div>
                </div>
                <div className={classNames({[style['gj']]:true,[style["showDisplay"]]:(this.state.step === 3)})}>
                    <img src={require("./../../static/img/guide/airLine/4.png")} alt=""/>
                    <div className={style['gj-btn-box']}>
                        <div className={style['guide-btn-b']} onClick={this.changeStep.bind(this,4)}>下一条</div>
                        {this.guide()}
                    </div>
                </div>
                <div className={classNames({[style['tx']]:true,[style["showDisplay"]]:(this.state.step === 4)})}>
                    <img src={require("./../../static/img/guide/airLine/5.png")} alt=""/>
                    <div className={style['tx-btn-box']}>
                        <div className={style['guide-btn-b']} onClick={this.changeStep.bind(this,"")}>开始使用</div>
                    </div>
                </div>
            </div>
        )
    }
}