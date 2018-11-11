
import React, { Component } from 'react';
import style from './../../static/css/demandList/roleDemandChild.scss';
import RoleDemandList from '../../components/roleDemand/roleDemandList';
import DemandFilter from '../../components/roleDemand/demandFilter';

export default class RoleDemandChild extends Component{
    constructor(props){
        super(props);
        this.state = {
            demandLists:null,
            time:1,// 默认为 1，1:降序,0:升序
            condition:{
                demand:0,
                status:0
            }
        }
    }
    // 降序 时间从近到远 从上到下
    upSort=()=>{
        return function(obj1,obj2){
            return Number(obj1.id) < Number(obj2.id) ? 1 : -1;
        }
    }
    // 升序 时间由远到近 从下到上
    downSort=()=>{
        return function(obj1,obj2){
            return Number(obj1.id) > Number(obj2.id) ? 1 : -1;
        }
    }
    // 时间排序
    sortListTime=(time,data)=>{
        if(time){
           data.sort(this.upSort());
        }else{
           data.sort(this.downSort());
        }
        return data;
    }
    // 传递给子组件的方法，触发时调用
    sort=(time)=>{
        this.setState({
            time : time,
            demandLists:this.sortListTime(time,this.state.demandLists)
        });
    }
    // 传递给子组件的方法,触发时调用
    filter=(type,name)=>{
        this.state.condition[name]=type;
        this.setState({
            condition:this.state.condition
        })
        this.filterDemandList();
    }
    // 过滤数据操作
    filterDemandList=()=>{
        let time=this.state.time;
        let demand=this.state.condition.demand;
        let status=this.state.condition.status;
        let filtered;
        if(demand || status){
            filtered=this.props.data.filter((item)=>{
                if(demand && status){
                    return item.demandType == demand && item.statusType == status;
                }else if(demand){
                    return item.demandType == demand;
                }else if(status){
                    return item.statusType == status;
                }
            })
        }else{
            filtered=this.props.data
        }
        this.setState({
            'demandLists':this.sortListTime(time,filtered)
        })
    }
    // 加载渲染完成时 按照默认时间排序 初始化数据 
    componentWillMount() {
        this.setState(()=>({
            demandLists:this.sortListTime(this.state.time,this.props.data)
        }))
    }
    componentWillReceiveProps(nextProps){  // Props发生改变
        this.setState(()=>({
           demandLists:this.sortListTime(this.state.time,nextProps.data)
        }))
    }
    //TODO: 不同类型角色对应不用的title,待完成
    render(){
        return(
            <div className={style['role-demand-child']}>
                <DemandFilter 
                    info={this.props.info}
                    time={this.state.time} 
                    filter={this.filter} 
                    sort={this.sort}>
                </DemandFilter>
                <RoleDemandList demandLists={this.state.demandLists}/>
            </div>
        )
    }
}