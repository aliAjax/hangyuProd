import React, { Component } from "react";
import Btn from "../../components/button/btn";
import style from "../../static/css/fromBox/capacityRelease.scss";
import emitter from "../../utils/events";

export default class TimeComponent extends Component {
    constructor(props) {
        super(props);
        this.chooseHours = this.chooseHours.bind(this);
        this.chooseMinute = this.chooseMinute.bind(this);
        this.eEvent = this.eEvent.bind(this);
        this.state = {
            intimeStyle: this.props.intimeStyle,//input框是否可点击 false为能
            defaultTime: this.props.defaultTime,//草稿储存时间
            time: this.props.time,//限制时间
            timeDivType: "",//是否显示时间组件 false为不能
            minuteNum: "",//分钟数
            hourNum: "",//时刻数
            returnTime: "",//选择时间
            returnData:"",
            newHours:[],
            minuteArr:[]

        }
    };

    componentWillMount() {
        //当天小时拼接
        let hours = [];
        let otherHours = [];
        let newHours=[];
        if(this.state.time.split("")[0]=="+"){
            for(let i=parseInt(this.state.time.split(":")[0]);i<23;i++){
                if (i < 10) {
                    newHours.push(`+0${i}`)
                } else {
                    newHours.push(`+${i}`)
                }
            }
        }else {
            try {
                for (let i = parseInt(this.state.time.split(":")[0]); i < 24; i++) {
                    if (i < 10) {
                        hours.push(`0${i}`)
                    } else {
                        hours.push(i)
                    }
                };
            } catch (e) {

            }
            //第二天小时数据拼接
            for (let i = 0; i < 24; i++) {
                if (i < 10) {
                    otherHours.push(`+0${i}`)
                } else {
                    otherHours.push(`+${i}`)
                }
            };
            newHours = [...hours, ...otherHours];
        }

        //分钟拼接
        let minuteArr = [];
        if(this.state.defaultTime.split(":")[0]==this.state.time.split(":")[0]||!this.state.defaultTime){
            for (let i = parseInt(this.state.time.split(":")[1])+1; i < 60; i++) {
                if (i < 10) {
                    minuteArr.push(`0${i}`)
                } else {
                    minuteArr.push(i)
                }
            };
        }else{
            for (let i = 0; i < 60; i++) {
                if (i < 10) {
                    minuteArr.push(`0${i}`)
                } else {
                    minuteArr.push(i)
                }
            };
        }

        this.setState({
            minuteNum: this.props.defaultTime.split(":")[0],//分钟数
            hourNum: this.props.defaultTime.split(":")[0],//时刻数
            returnTime:this.props.defaultTime,//选择时间
            returnData:this.props.defaultTime,
            newHours,
            minuteArr
        });
    };

    componentWillReceiveProps(nextProps) {
        this.hoursDiv.scrollTop = 0;
        this.minuteDiv.scrollTop = 0;
        let minuteArr = [];
        if(nextProps.defaultTime.split(":")[0]==nextProps.time.split(":")[0]||!nextProps.defaultTime){
            for (let i = parseInt(this.state.time.split(":")[1])+1; i < 60; i++) {
                if (i < 10) {
                    minuteArr.push(`0${i}`)
                } else {
                    minuteArr.push(i)
                }
            };
        }else{
            for (let i = 0; i < 60; i++) {
                if (i < 10) {
                    minuteArr.push(`0${i}`)
                } else {
                    minuteArr.push(i)
                }
            };
        };
        this.setState({
            defaultTime: nextProps.defaultTime,
            returnTime:nextProps.defaultTime,
            time: nextProps.time,
            hourNum:nextProps.defaultTime.split(":")[0],
            minuteNum:nextProps.defaultTime.split(":")[1],
            returnData:nextProps.defaultTime,
            minuteArr
        });
        if (nextProps.intimeStyle != this.state.intimeStyle) {
            this.setState({
                intimeStyle: nextProps.intimeStyle
            })
        };
        if (this.state.timeDivType) {
            document.querySelector("#show").focus();
            this.show.focus()
        };
        if (nextProps.defaultTime != this.state.defaultTime) {
            this.setState({

            })
        };
        if (nextProps.intimeStyle == true) {
            this.setState({
                timeDivType: false
            })
        };
    };

    componentDidMount() {   // 加载渲染完成
        let _this=this;
        this.closeFloatingLayer = emitter.addEventListener('closeFloatingLayer', (message) => {
            // 监听浮沉关闭
            _this.closeShowBox();
        });
        if (this.minuteDiv) {
            this.minuteDiv.addEventListener('scroll',this.onScrollHandle.bind(this));
        };

        // document.getElementById("minuteDiv").scrollTop=200;
        // console.log(document.getElementById("minuteDiv").scrollTop)
    };

    onScrollHandle(e){
        // console.log(e.target.scrollTop)
    }

    componentWillUnmount() {
        emitter.removeEventListener(this.closeFloatingLayer);
    }

    //获取INPUT焦点事件
    showBox() {
        this.hoursDiv.scrollTop = 0;
        this.minuteDiv.scrollTop = 0;
        let _this=this;
        this.setState({
            timeDivType: true
        },()=>{
            let { hourNum,newHours } = _this.state;
            let newNum=newHours[0];
            if(hourNum.split("")[0]=="+"){
                hourNum=parseInt(hourNum.slice(1,3))+24;
            }else {
                hourNum=parseInt(hourNum.split(":")[0])
            };
            if(newNum.split("")[0]=="+"){
                newNum=parseInt(newNum.slice(1,3))+24;
            }else {
                newNum=parseInt(newNum.split(":")[0])
            };
            _this.minuteDiv.scrollTop =(parseInt(_this.state.minuteNum)-parseInt(_this.state.minuteArr[0]))*32;
            _this.hoursDiv.scrollTop =(parseInt(hourNum)-parseInt(newNum))*32;
        });
        this.show.value = this.state.defaultTime;
    }
    //关闭时刻
    closeShowBox(){

        let minuteArr = [];
        if(this.state.returnData.split(":")[0]==this.state.time.split(":")[0]||this.state.returnData==""){
            for (let i = parseInt(this.state.time.split(":")[1])+1; i < 60; i++) {
                if (i < 10) {
                    minuteArr.push(`0${i}`)
                } else {
                    minuteArr.push(i)
                }
            };
        }else{
            for (let i = 0; i < 60; i++) {
                if (i < 10) {
                    minuteArr.push(`0${i}`)
                } else {
                    minuteArr.push(i)
                }
            };
        }
        this.hoursDiv.scrollTop = 0;
        this.minuteDiv.scrollTop = 0;
        this.setState({
            minuteArr,
            returnTime:this.state.returnData,
            hourNum: this.state.returnData.split(":")[0],
            minuteNum: this.state.returnData.split(":")[1],
            timeDivType: false
        })
    };

    clearShowBox() {
        this.hoursDiv.scrollTop = 0;
        this.minuteDiv.scrollTop = 0;
        try {
            for (let i = 0; i < document.getElementsByClassName(`minuteLi`).length; i++) {
                document.getElementsByClassName(`minuteLi`)[i].style.background = "#ffffff";
            };
        } catch (e) {

        };
        try {
            for (let i = 0; i < document.getElementsByClassName(`hoursLi`).length; i++) {
                document.getElementsByClassName(`hoursLi`)[i].style.background = "#ffffff";
            };
        } catch (e) {

        };
        this.setState({
            timeDivType: false,
            hourNum: "",
            minuteNum: "",
            returnTime: ""
        });
        this.props.inTimeEvent("");
    }

    //确认时刻
    affirmSubmit() {
        let { hourNum, minuteNum, returnTime } = this.state;
        if (hourNum && minuteNum!="") {
            returnTime = hourNum + ":" + minuteNum;
            this.setState({
                returnTime,
                returnData:returnTime
            });
            this.show.value = returnTime;
            this.showTime.value = returnTime;
            this.props.inTimeEvent(returnTime);
        } else {
            let minuteArr=[];
            if(this.state.returnData.split(":")[0]!=this.state.time.split(":")[0]){
                for (let i = 0; i < 60; i++) {
                    if (i < 10) {
                        minuteArr.push(`0${i}`)
                    } else {
                        minuteArr.push(i)
                    }
                };
            }else {
                for (let i = parseInt(this.state.time.split(":")[1])+1; i < 60; i++) {
                    if (i < 10) {
                        minuteArr.push(`0${i}`)
                    } else {
                        minuteArr.push(i)
                    }
                };
            };
            this.setState({
                minuteArr
            })
        };
        this.closeShowBox();
    }

    //TODO:小时选择
    chooseHours(e) {
        e.stopPropagation();
        //分钟数组
        let hourNum = e.target.textContent;
        let minuteArr = [];
        if(hourNum==this.state.time.split(":")[0]){
            for (let i = parseInt(this.state.time.split(":")[1])+1; i < 60; i++) {
                if (i < 10) {
                    minuteArr.push(`0${i}`)
                } else {
                    minuteArr.push(i)
                }
            };
        }else{
            for (let i = 0; i < 60; i++) {
                if (i < 10) {
                    minuteArr.push(`0${i}`)
                } else {
                    minuteArr.push(i)
                }
            };
        };
        let type = e.target.style.background;
        try {
            for (let i = 0; i < document.getElementsByClassName(`hoursLi`).length; i++) {
                document.getElementsByClassName(`hoursLi`)[i].style.background = "#ffffff"
            };
            if (type != `rgb(233, 233, 233)`) {
                e.target.style.background = "#e9e9e9";
            } else {
                e.target.style.background = "#ffffff";
            };
        } catch (e) {

        };
        if (hourNum == this.state.hourNum) {
            hourNum = "";
        };
        let returnTime=this.state.returnTime;
        if(typeof returnTime=="object"){
            returnTime=returnTime.join(":")
        };
        let minuteNum=this.state.minuteNum;
        try {
            if(e.target.textContent==this.state.time.split(":")[0]&&returnTime.split(":")[1]<=this.state.time.split(":")[1]){
                minuteNum="";
                returnTime=e.target.textContent+":"
            }else {
                returnTime=e.target.textContent+":"+minuteNum;
            };
        }catch (e) {

        };
        this.setState({
            minuteArr,
            minuteNum,
            returnTime,
            hourNum,
            timeDivType:true
        });

    };

    eEvent(e){
        e.stopPropagation();
    }

    //TODO:分钟选择
    chooseMinute(e) {
        e.stopPropagation();
        let type = e.target.style.background;
        let minuteNum = e.target.textContent;
        if (minuteNum == this.state.minuteNum) {
            minuteNum = "";
        };

        let returnTime=this.state.returnTime;
        try {
            returnTime=returnTime.split(":");
            returnTime[1]=minuteNum;
            returnTime.join(":");
        }catch (e) {

        }

        this.setState({
            returnTime,
            minuteNum,
            timeDivType:true
        });
        try {
            for (let i = 0; i < document.getElementsByClassName(`minuteLi`).length; i++) {
                document.getElementsByClassName(`minuteLi`)[i].style.background = "#ffffff";
            };
        } catch (e) {

        };
        if (type != `rgb(233, 233, 233)`) {
            e.target.style.background = "#e9e9e9";
        };

    }
    render() {
        let timerA = false;
        let _this = this;
        try {
            this.showTime.value = this.state.defaultTime;
        } catch (e) {

        };
        let returnTime=this.state.returnTime;
        try{
            for (let i = 0; i < document.getElementsByClassName(`hoursLi`).length; i++) {
                if(document.getElementsByClassName(`hoursLi`)[i].textContent==returnTime.split(":")[0]){
                    document.getElementsByClassName(`hoursLi`)[i].style.background = "#e9e9e9";
                }else {
                    document.getElementsByClassName(`hoursLi`)[i].style.background = "#ffffff";
                }
            };
        }catch (e) {

        }
        try{
            for (let i = 0; i < document.getElementsByClassName(`minuteLi`).length; i++) {
                if(document.getElementsByClassName(`minuteLi`)[i].textContent==returnTime.split(":")[1]){
                    document.getElementsByClassName(`minuteLi`)[i].style.background = "#e9e9e9";
                }else {
                    document.getElementsByClassName(`minuteLi`)[i].style.background = "#ffffff";
                }
            };
        }catch (e) {

        }
        return (
            <div style={{ position: "relative" }}>
                <input ref={(data) => this.showTime = data} onFocus={this.showBox.bind(this)} className={style['timeInput']} readOnly={true} type="text" disabled={!this.state.intimeStyle || this.props.time ? false : true} placeholder={!this.state.intimeStyle || this.props.time ? "" : "出航时刻"} />
                <div id="show" className={this.state.timeDivType ? style['showDiv'] : style['noShow']} onClick={this.eEvent}>
                    <div className={style['showBoxTop']}>
                        <input ref={(data) => this.show = data} readOnly={true} type="text" />
                        <span className={`iconfont ${style['showDivIcon']}`} onClick={this.clearShowBox.bind(this)} style={{ position: "absolute", fontSize: "20px", right: "7px", top: "6px" }}>&#xe656;</span>
                    </div>
                    <div className={style['showUl']} >
                        <div ref={(data) => this.hoursDiv = data} style={{ position: "relative", height: "640px", overflowY: "scroll" }}>
                            <ul style={{ borderLeft: "none" }}>
                                {
                                    this.state.newHours.map((item, index) => {
                                        return <li className="hoursLi"  key={index} value={`${item}`} onClick={this.chooseHours}>{item}</li>
                                    })
                                }
                            </ul>
                        </div>
                        <div ref={(data) => this.minuteDiv = data} id={"minuteDiv"} className={`scroll`} style={{ overflowY: "scroll" }}>
                            <ul >
                                {
                                    this.state.minuteArr.map((item, index) => {
                                        let test=<li className='minuteLi' style={{background:"#ffffff"}} onClick={this.chooseMinute} value={`${item}`} key={index}>{item}</li>;
                                        try {
                                            if(item==this.state.returnTime.split(":")[1]){
                                                test=<li className='minuteLi' style={{background:"#e9e9e9"}} onClick={this.chooseMinute} value={`${item}`} key={index}>{item}</li>
                                            };
                                        }catch (e) {

                                        };
                                        return test
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className={style['timeBtn']}>
                        <Btn text='确定' btnType="1" onClick={function () {//防止连续点击
                            clearTimeout(timerA);
                            timerA = setTimeout(function () {
                                _this.affirmSubmit()
                            }, 300)
                        }} />
                        <Btn text='关闭' btnType="2" onClick={this.closeShowBox.bind(this)} />
                    </div>
                </div>
                <span className="iconfont" style={{ position: "absolute", right: "6px", top: "-2px", fontSize: "24px", color: "rgba(0,0,0,.25)" }}>&#xe63b;</span>
            </div>
        )
    }
}