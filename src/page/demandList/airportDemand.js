
import React, { Component } from 'react';
import style from './../../static/css/demandList/roleDemandCommon.scss';
import RoleDemandChild from '../../components/roleDemand/roleDemandChild';

export default class AirportDemand extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:null,
            info:{
                demand:{
                    currType:0,
                    isShow:false,
                    list:[
                        {type:0,text:'全部需求'},
                        {type:1,text:'航线需求'},
                        {type:2,text:'委托航线需求'}
                    ]
                },
                status:{
                    currType:0,
                    isShow:false,
                    list:[
                        {type:0,text:'全部状态'},
                        {type:1,text:'意向征集'},
                        {type:2,text:'订单确认'},
                        {type:3,text:'审核未通过'},
                        {type:4,text:'佣金支付'},
                        {type:5,text:'过期'},
                        {type:6,text:'已完成'},
                        {type:7,text:'交易完成'}
                    ]
                }
            }
        }

    }
    componentWillMount(){  // 将要渲染
        
    }
    componentWillReceiveProps(nextProps){  // Props发生改变
    }
    
    render(){
        return(
            <div className={style['role-demand-common']}>
                <RoleDemandChild info={this.state.info} data={this.props.data}/>
            </div>
        )
    }
}