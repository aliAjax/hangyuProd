import React,{Component} from 'react';
import {store} from './../../store/index';

import style from './../../static/css/from/myReceivedScheme.scss';

import RsTime from './rsTime.js';
import RsAirline from './rsAirline.js';
import PlanInfo from './planInfo.js';

import { Tabs ,Collapse} from 'antd';

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;


export default class myReceivedScheme extends Component {
	constructor(props){
		super(props);
		this.state={

		}
	}
    airportRSHeader(){
        return (
            <div className={`${style['filter']} ${style['airport-mrs-filter-item']}`}>
                <div>
                    <span>价格</span>
                    <div className={style['filter-item-time']}>
                        <button>
                            <i className={'iconfont'}>&#xe605;</i>
                        </button>
                        <button>
                            <i className={'iconfont'}>&#xe605;</i>
                        </button>
                    </div>
                </div>
                <div>
                    <span>更新时间</span>
                </div>
                <div>
                    <span>方案编号</span>
                </div>
                <div>
                    <span>航线航点</span>
                </div>
                <div>
                    <span>时刻</span>
                </div>
                <div>
                    <span>报价</span>
                </div>
            </div>
        )
    }
    airlineRSHeader(){
        return (
            <div className={`${style['filter']} ${style['airline-mrs-filter-item']}`}>
                <div>
                    <span>更新时间</span>
                </div>
                <div>
                    <span>意向方</span>
                </div>
                <div>
                    <span>航线</span>
                </div>
                <div>
                    <span>报价</span>
                    <div className={style['filter-item-time']}>
                        <button>
                            <i className={'iconfont'}>&#xe605;</i>
                        </button>
                        <button>
                            <i className={'iconfont'}>&#xe605;</i>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    airportReceivedScheme(){
        let customPanelStyle={
            background:'none',
            borderRadius:8,
            border:'none',
            padding:0
        }
        // 原始代码
        // const items=(<div className={style['rs-item']} onClick={this.handleClick}>
        //     <div>20w</div>
        //     <div>2017.04.13</div>
        //     <div>方案一</div>
        //     <div>成都-天津-通辽 <span><i className={'iconfont'}>&#xe602;</i></span></div>
        //     <div>08:00时段</div>
        //     <div>定补<i className={'iconfont'}>&#xe60a;</i></div>
        // </div>);

        let rs=this.props.rs;
        let result=rs.map((value,index)=>{
            console.log(value)
            let {id , info , scheme , schemeIndex , title} = value;
            let {price , time , schemeStr , airline , flights , priceType} = title;

            let items=(
                <div className={`${style['rs-item']} ${style['airport-mrs-filter-item']}`} onClick={this.handleClick}>
                    <div>{price+'w'}</div>
                    <div>{time}</div>
                    <div>{schemeStr}</div>
                    <div>
                        {airline}
                        <span className={style['active']}>
                            <i className={'iconfont'}>&#xe602;</i>
                        </span>
                    </div>
                    <div>{flights}</div>
                    <div>{priceType}<i className={'iconfont'}>&#xe60a;</i></div>
                </div>
            );
            return (
                <Panel showArrow={false} key={index} style={customPanelStyle}
                    header={items}>
                    <div className={style['rs-scheme']}>
                        <RsTime scheme={this.props.rs[index].scheme} />
                        <PlanInfo info={this.props.rs[index].info} />
                    </div>
                </Panel>
            )
        })
        return result;
    }
    airlineReceivedScheme(){
        let customPanelStyle={
            background:'none',
            borderRadius:8,
            border:'none',
            padding:0
        }
        let rs=this.props.rs;
        let result=rs.map((value,index)=>{
            let {info , scheme , schemeIndex , title} =value;
            let {time , intention , airline , priceType, price} = title;
            let items=(
                <div className={`${style['rs-item']} ${style['airline-mrs-filter-item']}`}>
                    <div>{time}</div>
                    <div>{intention}
                        <span className={style['active']}>
                            <i className={'iconfont'}>&#xe602;</i>
                        </span>
                    </div>
                    <div>{airline}</div>
                    <div>{`${priceType} ${price} 万/班`}</div>
                </div>
            );
            return (
                <Panel showArrow={false} key={index} style={customPanelStyle}
                    header={items}>
                    <RsAirline rss={scheme} />
                    <PlanInfo info={info} />
                </Panel>
            )
        })

        return result;
    }
    render(){
        let header = store.getState().role.role === "1" ? this.airportRSHeader() : this.airlineRSHeader();
        let result = store.getState().role.role === "1" ? this.airportReceivedScheme() : this.airlineReceivedScheme();
    	return (
			// {/*机场我的航线收到的方案*/}
            <div className={style['my-received-scheme']}>
                {header}
                <div className={`${style['rs-body-2']} scroll`}>
                    <Collapse bordered={false} accordion>
                        {result}
                    </Collapse>
                </div>
            </div>
    	)
    }   
}