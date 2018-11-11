// author:wangli time:2018-05-21 content:按钮组件
import React, { Component, Fragment } from "react";
import style from '../../static/css/button/btn.scss';
import {Button,Icon} from 'antd';
export default class DimAir extends Component {
    constructor(props){
        super(props);
        this.state={
            text:"",//按钮名称
            btnType:"0",//收藏类：0  确认类：1  取消类:2
            isDisable:false,//是否禁点 true为禁点
            styleJson:{},//样式
            otherText:"",//点击后显示文字
        }
    }

    componentWillReceiveProps(nextProps){
        let {text,styleJson,btnType,isDisable=false,otherText=""}=nextProps;
        try{
            if(isDisable){
                isDisable=true;
            }
        }catch (e) {

        }
        this.setState({
            text,
            styleJson,
            btnType,
            isDisable,
            otherText
        })
    }

    componentDidMount(){
        let { text, styleJson, btnType, isDisable=false, otherText="" } = this.props;
        try{
            if(isDisable){
                isDisable=true;
            }
        }catch (e) {

        }
        this.setState({
            text,
            styleJson,
            btnType,
            isDisable,
            otherText
        })
    }

    // 点击事件
    clickEvent(){
        if(!this.state.isDisable){//判断是否是禁点组件
            this.props.onClick()
        };
        this.setState({
            isDisable:true,
            text:""
        })
    }

    render(){
        let styleBtn;
        if(this.state.isDisable){//判断组件样式
            styleBtn=style['disable']
        }else {
            switch (this.state.btnType){
                case "0":
                    styleBtn=style['btn0']
                    break;
                case "1":
                    styleBtn=style['btn1']
                    break;
                case "2":
                    styleBtn=style['btn2']
                    break;
                default:
                    break;
            };
        };
        return(
            <Fragment>
                <button style={this.state.styleJson} className={styleBtn} onClick={this.clickEvent.bind(this)}>
                    {this.state.isDisable?<Fragment>{this.state.otherText}{this.props.noIcon ? '' : <Icon type="loading" />}</Fragment>:this.state.text}
                </button>
            </Fragment>
        )
    }
}