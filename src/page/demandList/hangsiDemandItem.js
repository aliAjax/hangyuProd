
// author:wangli time:2018-05-24 content:首页航司视角-市场信息-单条数据模块
import React, { Component } from 'react';
import style from './../../static/css/demandList/demandList.scss';
import emitter from '../../utils/events';
const winType=(window.screen.width>1366)?1:0;//适配屏幕，1为大屏 0为笔记本

export default class HangsiDemandItem extends Component {

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
        this.props.changeCollect(collectType, demandId, this.props.index)
    }

    componentWillReceiveProps(nextProps) {  // Props发生改变
    }
    //点击显示具体信息
    handleClick(transmit) {//transmit：展开详情参数
        //需要id
        console.log('航司-市场 点击', transmit)
        let o = {
            openFrom: true,
            fromType: 3,
            fromMes: {
                transmit: transmit,
            }
        }
        emitter.emit('openFrom', o);
    }


    render() {
        const { id, releasetime, demandprogress,invalidResponseCount, title, browsingVolume, days, collectType, aircrfttyp, isResponseDemand, subsidypolicyStr, fixedSubsidyPrice, bottomSubsidyPrice, timeRequirements, recivedResponseCount } = this.props.data;
        var aircrfttypText="暂无数据";
        if(winType==1){
            aircrfttypText = aircrfttyp.split("");
            let num = 0;
            let sub = 0;
            for (let i = 0; i < aircrfttypText.length; i++) {//机型长度过宽换行处理
                if (aircrfttypText[i] == "/") {
                    num++;
                    if (num == 2) {
                        sub = i
                    }
                }
            };
            if (num >= 2) {
                aircrfttypText.splice(sub + 1, 0, "<br/>")
            };
            aircrfttypText = aircrfttypText.join("");
        }else {
            let newArr=aircrfttyp.split("/");
            if(newArr.length>3){
                newArr.length=3;
                newArr[2]=newArr[2]+"...";
                // newArr.push("...")
            };
            aircrfttypText=newArr.join("<br/>")
        }
        //时刻需求
        let allTime = "";
        if (timeRequirements == 0) {
            allTime = "白班"
        } else if (timeRequirements == 1) {
            allTime = "晚班"
        } else {
            allTime = "都接受"
        }
        //参考报价
        let typeText = "暂无报价";
        let typeTextTitle = "暂无报价";
        if(winType==1){
            if (subsidypolicyStr != null && subsidypolicyStr != "") {//报价换行处理
                typeText = subsidypolicyStr;
                typeTextTitle = subsidypolicyStr.split("<br/>").join(";");
                typeText=typeText.split("<br/>");
                if(typeText.length>2){//缩写处理
                    typeText[2]="···"
                };
                typeText=typeText.join("<br/>");
            }
        }else {
            let newArr1=subsidypolicyStr.split("<br/>");
            typeTextTitle = subsidypolicyStr.split("<br/>").join(";");
            for(let i=0;i<newArr1.length;i++){
                if(newArr1[i].length==12){
                    let newS = newArr1[i].split("");
                    newS.length=9;
                    newArr1[i]=newS.join("");
                    newArr1[i]=newArr1[i]+"...";
                    //newArr1[i].replace(/`万/班`<!--//)-->
                }
            };
            typeText=newArr1;
            if(typeText.length>2){//缩写处理
                typeText[2]="···"
            };
            typeText=typeText.join("<br/>");
        }

        //判断是否已收藏
        let icon, collectHover;
        if (collectType) {
            icon = "&#xe637;"
            collectHover = <div className={style['demand-item-tag-box-hover1']}>取消收藏</div>
        } else {
            icon = "&#xe634;"
            collectHover = <div className={style['demand-item-tag-box-hover1']}>点击收藏</div>
        }
        //收到的方案量
        let recivedResponseNum = "";
        if (recivedResponseCount == undefined) {
            recivedResponseNum = 0
        } else if (recivedResponseCount == null) {
            recivedResponseNum = 0
        } else {
            recivedResponseNum = recivedResponseCount
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
        let transmit = {
            id,
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
                    <div>
                        <div>时刻需求</div>
                        <div>{allTime}</div>
                    </div>
                    <div style={{ marginLeft: 7, marginRight: 8 }}>
                        <div>机型</div>
                        <div dangerouslySetInnerHTML={{ __html: aircrfttypText }} title={aircrfttyp}></div>
                    </div>
                    <div style={{ marginLeft: 0, marginRight: "15px" }} className={style['reference']}>
                        <div>
                            参考报价(￥)
                        </div>
                        <div style={{ "color": "#f98c34", fontWeight: "bold", whiteSpace: "nowrap" }}>
                            <div style={{ color: "#f98c34",whiteSpace: "nowrap", textOverflow:"ellipsis",overflow:"hidden"}} dangerouslySetInnerHTML={{ __html: typeText }} title={typeTextTitle}></div>
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