
import React, { Component } from 'react';


export default class test extends Component{
    constructor(props){
        super(props);
        this.state = {
            // sortText:props.
        }
    }
    componentWillMount(){  // 将要渲染

    }
    componentDidMount() {   // 加载渲染完成

    }
    componentWillReceiveProps(nextProps){  // Props发生改变

    }
    componentWillUnmount(){  // 卸载组件
        
    }
    render(){
        return(
            <div>
                <div>报价从低到高</div>
                <div>接收时间</div>
                <div>航线</div>
                <div>报价</div>
            </div>
        )
    }
}