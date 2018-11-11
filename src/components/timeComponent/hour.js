import React,{ Component } from "react";
import {Input} from 'antd'
import style from "../../static/css/fromBox/hours.scss";

export default class Hours extends Component {

    constructor(props){
        super(props);
        this.showDiv=this.showDiv.bind(this);
        this.chooseHour=this.chooseHour.bind(this);
        this.state={
            showType:false,//是否显示下拉滚动条 false为不显示
            time:this.props.time,//下拉有无限制 ''为无
            data:"",//选择的时间
            hours:[],//时间下拉框内容
        }
    }

    //Input焦点事件
    showDiv(){
        this.setState({
            showType:true
        })
    }

    //Input失焦事件
    closeDiv(){
        setTimeout(()=>{
            this.setState({
                showType:false
            })
        },150)
    }

    //TODO:选择时间
    chooseHour(e){
        e.stopPropagation();
        this.setState({
            data:e.target.innerHTML
        });
        this.hours.input.value=e.target.innerHTML;
        this.props.outTimeEvent(e.target.innerHTML)
    }

    componentWillMount(){
        //显示时钟列表
        let hours=[];
        if(this.state.time){

        }else {
            for(let i=0;i<24;i++){
                if(i<10){
                    hours.push(`0${i}:00`)
                }else {
                    hours.push(`${i}:00`)
                }
            }
        };
        this.setState({
            hours
        })
    };

    render(){

        let showType=this.state.showType?"":style['noShow'];

        return(
            <div className={style['hours']}>
                <Input ref={(data)=>this.hours=data} type="text" onFocus={this.showDiv} onBlur={this.closeDiv.bind(this)}/>
                <div className={`scroll ${showType}`}>
                    {
                        this.state.hours.map((item,index)=>{
                            return <div key={index} onClick={this.chooseHour}>{item}</div>
                        })
                    }
                </div>
            </div>
        )
    }
}