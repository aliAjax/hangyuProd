import React,{Component} from "react";
import {Tooltip} from "antd";
import style from "../../static/css/IconInfo/IconInof.scss";

export default class IconInfo extends Component{

    constructor(props){
        super(props);
        this.state={
            styleJson:"",
        }
    }

    render(){
        let {placement="top",title}=this.props;
        if(!placement){
            placement="top"
        };
        return (
                <Tooltip  placement={placement} title={title} overlayClassName={style['card']}>
                    <span className={`iconfont ${style['icon']}`}>&#xe6f8;</span>
                </Tooltip>
        )
    }

}