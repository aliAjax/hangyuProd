
import React, { Component } from 'react';
import emitter from '../../utils/events';
import RoleDemandItem from './roleDemandItem';
import style from './../../static/css/demandList/roleDemandList.scss';
export default class roleDemandList extends Component{
    constructor(props){
        super(props);
        this.state = {
           
        }
    }
    handleScroll=(e)=>{
        let clientHeight = this.refs.roleDemandList.clientHeight; //可视区域高度
        let scrollTop  = this.refs.roleDemandList.scrollTop;  //滚动条滚动高度
        let scrollHeight = this.refs.roleDemandList.scrollHeight; //滚动内容高度
        if((clientHeight+scrollTop)>=(scrollHeight)){
            emitter.emit('roleDemandScrollBottom');
        }  
        
    }
    componentWillMount(){  // 将要渲染

    }
    componentWillUpdate(){
        
    }
    componentDidMount() {   // 加载渲染完成

    }
    componentWillReceiveProps(nextProps){  // Props发生改变
        
    }
    render(){
        let item=null;
        if(this.props.demandLists){
            item=this.props.demandLists.map((value,index)=>{
                return <RoleDemandItem key={index} demandInfo={value}/>
            })
        }
        return(
            <div className={`${style['role-demand-list']} scroll`} ref='roleDemandList' onScroll={this.handleScroll}>
                <div>
                    {item}
                </div>
            </div>
        )
    }
}