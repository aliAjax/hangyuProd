
import React, { Component } from 'react';

import style from './../../static/css/demandList/demandFilter.scss';
import DropDownList from './../dropDownList/dropDownList';

export default class DemandFilter extends Component{
    constructor(props){
        super(props);
        this.state = {
            time:props.time,//1:最近时间,0:最晚时间
            info:props.info,
        }
    }
    // 获取时间排序当前状态time
    getTimeClass=(type)=>{
        return type == this.state.time ? style['active'] : '';
    }
    // 处理时间排序点击事件并触发父方法
    handleTimeClick=(time)=>{
        this.setState({
            time : time
        })
        this.props.sort(time);
    }
    // 根据值获取当前需求类型
    getTypeText=(name)=>{
        let typeText = name == 'demand' ? '全部需求' : '全部状态';
        let list = this.state.info[name].list;
        let currType = this.state.info[name].currType;
        for(let i=0;i<list.length;i++){
            if(list[i].type==currType){
                typeText = list[i].text;
                break;
            }
        }
        return typeText;
    }
    // 显示子菜单
    handleShowList = (name)=>{
        let info = this.state.info;
        for(let item in info){
            info[item].isShow = item==name ? (!info[name].isShow) : false;
        }
        this.setState({
            info:info
        })
    }
    // 点击子项修改typeText值;
    changeTypeText=(type,name)=>{
        this.state.info[name].currType = type;
        this.state.info[name].isShow = false;
        this.setState({
            info : this.state.info
        })
    }
    //子菜单点击触发事件 type:'类型' name:'目标集合名'
    itemClick=(type,name)=>{
        this.changeTypeText(type,name);
        this.props.filter(type,name)
    }

    render(){
        return(
            <div>
                <div className={style['filter']}>
                    <div className={style['filter-item']}>
                        <span>发布时间</span>
                        <div className={style['filter-item-time']}>
                            <button
                                className={this.getTimeClass(1)}
                                onClick={this.handleTimeClick.bind(null,1)} >
                                <i className={'iconfont'}>&#xe605;</i>
                            </button>
                            <button
                                className={this.getTimeClass(0)}
                                onClick={this.handleTimeClick.bind(null,0)}>
                                <i className={'iconfont'}>&#xe605;</i>
                            </button>
                        </div>
                    </div>
                    <div className={style['filter-item']}>
                        <span onClick={this.handleShowList.bind(null,'demand')}>
                            {this.getTypeText('demand')}
                            <i className={'iconfont'}>&#xe605;</i>
                        </span>
                        {/*子组件:全部需求*/}
                        <DropDownList
                            info = {this.state.info.demand}
                            name = {'demand'}
                            itemClick={this.itemClick}>
                        </DropDownList>
                    </div>
                    <div className={style['filter-item']}>
                        <span>发布标题</span>
                    </div>
                    <div className={style['filter-item']}>
                        <span onClick={this.handleShowList.bind(null,'status')}>
                            {this.getTypeText('status')}
                            <i className={'iconfont'}>&#xe605;</i>
                        </span>
                        {/*子组件:全部状态*/}
                        <DropDownList
                            info = {this.state.info.status}
                            name ={'status'}
                            itemClick={this.itemClick}>
                        </DropDownList>
                    </div>
                </div>
            </div>
        )
    }
}