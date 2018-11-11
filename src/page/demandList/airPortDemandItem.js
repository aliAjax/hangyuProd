// author:wangli time:2018-05-19 content:首页机场视角-市场信息-单条数据
import React, { Component } from 'react';
import style from './../../static/css/demandList/demandList.scss';
import emitter from '../../utils/events';
const winType=(window.screen.width>1366)?1:0;//适配屏幕，1为大屏 0为笔记本
export default class AirPortDemandItem extends Component {

    //点击收藏事件
    //向父组件传改变的参数
    changeCollect(e) {
        e.stopPropagation();
        let collectType = this.props.data.collectType;
        let demandId = this.props.data.id;
        if (collectType == 0) {
            collectType = 1
        } else {
            collectType = 0
        }
        this.props.changeCollect(collectType, demandId, this.props.index);//1:收藏参数 2：当前需求ID 3:当前所在位置
    };

    componentWillReceiveProps(nextProps) {  // Props发生改变
    };

    //参数对应汉字转换
    demandPro(demandprogress) {//demandprogress:状态参数
        let str = '';
        switch (Number(demandprogress)) {//根据状态参数显示不同文案
            case -1:
                str = '待支付';
                break;
            case 0:
                str = '需求发布';
                break;
            case 1:
                str = '意向征集';
                break;
            case 2:
                str = '订单确认';
                break;
            case 3:
                str = '关闭';
                break;
            case 4:
                str = '订单完成';
                break;
            case 5:
                str = '佣金支付';
                break;
            case 6:
                str = '交易完成';
                break;
            case 7:
                str = '待处理';
                break;
            case 8:
                str = '已接受';
                break;
            case 9:
                str = '处理中';
                break;
            case 10:
                str = '已拒绝';
                break;
            case 11:
                str = '草稿';
                break;
            default:
                str = '错误'
                break;
        }
        return str
    };
    //点击显示具体信息
    handleClick(transmit) {//transmit:需求对象数据
        //需要id
        let o = {
            openFrom: true,
            fromType: 3,
            fromMes: {
                transmit: transmit,
            }
        }
        emitter.emit('openFrom', o);
    };
    render() {
        const { id, releasetime, demandprogress,invalidResponseCount, title, browsingVolume, days, collectType, dptTime, arrvTime, aircrfttyp, isResponseDemand, subsidypolicyStr, fixedSubsidyPrice, bottomSubsidyPrice, recivedResponseCount } = this.props.data;
        const index = this.props.index;
        let aircrfttypText = aircrfttyp.split("");
        let num = 0;
        let sub = 0;
        for (let i = 0; i < aircrfttypText.length; i++) {//机型过长时，通过“/”换行机型
            if (aircrfttypText[i] == "/") {
                num++;
                if (num == 2) {
                    sub = i
                }
            }
        };
        if (num >= 2) {//添加换行符"<br/>"
            aircrfttypText.splice(sub + 1, 0, "<br/>")
        };
        aircrfttypText = aircrfttypText.join("");
        //参考报价
        let typeText = "暂无报价";
        let price = "";
        if (subsidypolicyStr != null && subsidypolicyStr != "") {
            typeText = subsidypolicyStr;
            if (fixedSubsidyPrice != null) {
                price = fixedSubsidyPrice
            };
            if (bottomSubsidyPrice != null) {
                price = bottomSubsidyPrice
            }
        };
        // let typeText = "暂无报价";
        // let typeTextTitle = "暂无报价";
        // if(winType==1){
        //     if (subsidypolicyStr != null && subsidypolicyStr != "") {//报价换行处理
        //         typeText = subsidypolicyStr;
        //         typeTextTitle = subsidypolicyStr.split("<br/>").join(";");
        //         typeText=typeText.split("<br/>");
        //         if(typeText.length>2){//缩写处理
        //             typeText[2]="···"
        //         };
        //         typeText=typeText.join("<br/>");
        //     }
        // }else {
        //     let newArr1=subsidypolicyStr.split("<br/>");
        //     typeTextTitle = subsidypolicyStr.split("<br/>").join(";");
        //     for(let i=0;i<newArr1.length;i++){
        //         if(newArr1[i].length==12){
        //             let newS = newArr1[i].split("");
        //             newS.length=9;
        //             newArr1[i]=newS.join("");
        //             newArr1[i]=newArr1[i]+"...";
        //             //newArr1[i].replace(/`万/班`<!--//)-->
        //         }
        //     };
        //     typeText=newArr1;
        //     if(typeText.length>2){//缩写处理
        //         typeText[2]="···"
        //     };
        //     typeText=typeText.join("<br/>");
        // }
        //收到的方案量
        let recivedResponseNum = "";
        if (recivedResponseCount == null || recivedResponseCount == undefined) {
            recivedResponseNum = 0
        } else {
            recivedResponseNum = recivedResponseCount
        };
        //判断是否已收藏
        let icon, collectHover;
        if (collectType != "0") {
            icon = "&#xe637;"
            collectHover = <div className={style['demand-item-tag-box-hover1']}>取消收藏</div>
        } else {
            icon = "&#xe634;"
            collectHover = <div className={style['demand-item-tag-box-hover1']}>点击收藏</div>
        };
        //图标和文字判断
        let logText="";
        let logTitle="";
        if(!!isResponseDemand){
            logText=`&#xe674;`;
            logTitle="响应过的需求";
        }else if(!!invalidResponseCount){
            logText=`&#xe65c;`;
            logTitle="已存草稿方案的需求";
        };
        // 构建对象传递数据
        let demandprogressStr = this.demandPro(demandprogress);
        let transmit = {
            id
        };
        return (
            <div className={`${style["demand-item"]} ${style['demand-list-padding']}`} onClick={this.handleClick.bind(this, transmit)}>
                <div className={style['demand-item-head']}>
                    <div className={style['demand-item-head-title-box']}>
                        <div style={{ width: 11, height: 21, position: "relative" }}>
                            {/*<span className={`iconfont ${cancelShow}`}>&#xe674;*/}
                            <span className={` ${style['demand-item-head-tag']}`}>
                                <span className={'iconfont'} dangerouslySetInnerHTML={{__html:logText}}></span>
                                <div className={style['demand-item-tag-box-need']}>{logTitle}</div>
                            </span>
                        </div>
                        <span className={style['demand-item-head-title']} title={title}>{title}</span>
                    </div>
                    <div>
                        <ul className={style["demand-item-tag-box"]}>
                            <li className={style['demand-item-tag-box-item0']}>
                                <span className={`iconfont ${style['demand-item-tag']}`}> &#xe64c;</span><span className={style['font']}>{browsingVolume}</span>
                                <div className={style['demand-item-tag-box-hover']} >浏览量：{browsingVolume}次</div>
                            </li>
                            <li className={style['demand-item-tag-box-item0']} style={{ marginLeft: 8 }}>
                                <span className={`iconfont ${style['demand-item-tag']}`}> &#xe6e7;</span>
                                <span className={style['font']}>{recivedResponseNum}</span>
                                <div className={style['demand-item-tag-box-hover']}>已收到方案量：{recivedResponseNum}条</div>
                            </li>
                            <li className={style['demand-item-tag-box-item1']}
                                onClick={(e) => { return (this.changeCollect(e)) }}
                            >
                                <span dangerouslySetInnerHTML={{ __html: icon }} className={`iconfont ${style['demand-item-tag']}`} style={{ marginLeft: 7 }} />
                                {collectHover}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={style['demand-item-mes']}>
                    <div className={style['demand-time']} style={{ width: 93 }}>
                        <div className={style['demand-out-in']}></div>
                        <div className={style['demand-time-style']} style={{ padding: '2px 0px' }}>
                            <div className={style['demand-time-style-font']}>出</div>
                            <div className={style['demand-time-style-font']}>进</div>
                        </div>
                        <div className={style['demand-time-style']} style={{ paddingLeft: 2 }}>
                            <div><span>{dptTime}时段</span></div>
                            <div><span>{arrvTime}时段</span></div>
                        </div>
                    </div>
                    <div style={{ marginLeft: 7, marginRight: 8 }}>
                        <div>机型</div>
                        <div dangerouslySetInnerHTML={{ __html: aircrfttypText }}></div>
                    </div>
                    <div style={{ marginLeft: 0, marginRight: "15px" }} className={style['reference']}>
                        <div>
                            参考报价(￥)
                        </div>
                        <div style={{ "color": "#f98c34", fontWeight: "bold" }}>
                            <div title={subsidypolicyStr.split('<br/>')} style={{ color: "#f98c34", whiteSpace: "nowrap", textOverflow:"ellipsis",overflow:"hidden"}} dangerouslySetInnerHTML={{ __html: typeText }}></div>
                        </div>
                    </div>
                    <div>
                        <div>
                            班期
                        </div>
                        <div>
                            {days}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}