import React, { Component } from 'react';
import {store,components} from "./../store/index"
import {assemblyAction as an} from "./../utils/assemblyAction";
import emitter from '../utils/events';
import Example from "./testTransition2"

// import  "./../static/css/main.scss"
import styles from "../static/css/main.css"
export default class Test extends  Component{
    constructor(props){
        super(props);
        store.dispatch(an('CHANGE_TEXT',{ddd:66}));
        this.state = {
            name : props.namess
        }
    }
    handleClick = (message) => {
        emitter.emit('changeMessage', message);
    };
    componentWillReceiveProps(nextProps){
        this.forceUpdate();
    }
    render(){
        let namessssss = this.props.namess;
        return(
            <div className={styles.ssdiv} onClick={this.handleClick.bind(this,"666666666666666666666666666")}>
                {namessssss}
                <Example></Example>
                <img src={require("../static/img/zzpic10964_s.jpg")} alt=""/>
                懒加载，代码分割
            </div>
        )
    }
}