import React,{Component} from 'react';
import {store} from './../../store/index';

import style from './../../static/css/from/rsTime.scss';


export default class CapacityScheme extends Component {
	constructor(props){
		super(props);
		this.state={

		}
	}
    render(){
    	let {duration,levelTime,enterTime,fixed,minimum,airline,schedule} = this.props.rs;
    	return (
			// {/*飞行计划*/}
			<div className={style['mrs-scheme-con']}>
				<div className={style['title']}>
	                <span>方案</span>
	                <span>申请测算</span>
	            </div>
		        <div className={style['capacity-detail']}>
		            <div className={style['wireframe']}>
		                <div className={style['circle']}>
		                	{duration}h
		                </div>
		            </div>
		            <div className={style['level-or-enter-time']}>
		                <div>
		                    <span>出港时刻</span>
		                    <span>
		                    	{levelTime}时刻
		                    </span>
		                </div>
		                <div>
		                    <span>进港时刻</span>
		                    <span>
		                    	{enterTime}时刻
		                    </span>
		                </div>
		            </div>
		            <div className={style['quoted']}>
		                <div>
		                    <span>参考合作方式</span>
		                    <div>
		                        <span>定补<span>{fixed}</span>万</span>
		                        <span>保底<span>{minimum}</span>万/小时</span>
		                    </div>
		                </div>
		                <div>
		                    <span>航线</span>
		                    <div>
		                        <span>{airline}</span>
		                    </div>
		                </div>
		            </div>
		            <div className={style['schedule']}>
		                <div>
		                    <span>班期:</span>
		                    <span>
		                    	{schedule}
		                    </span>
		                </div>
		            </div>
		        </div>
	        </div>
    	)
    }   
}