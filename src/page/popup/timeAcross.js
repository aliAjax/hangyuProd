import React, { Component } from 'react';
import style from './../../static/css/popup/timeAcross.scss';

class TimeAcross extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFocus: false,
            mouseInContainer: false,
            returnTime: props.returnTime,

            defaultH: '',
            defaultM: '',
            confineH: '',
            confineM: '',
        }
    }
    componentWillMount() {
        console.log('willMount')
        this.init(this.props);
    }
    componentWillReceiveProps(nextProps) {
        console.log('willReceiveProps')
        this.init(nextProps);
    }
    componentDidMount() {
        window.addEventListener('click', () => {

        })
    }
    init = (props) => {
        let [defaultH, defaultM] = props.defaultTime ? props.defaultTime.split(':') : [false, false];
        let [confineH, confineM] = props.confineTime ? props.confineTime.split(':') : [false, false];
        let returnTime = props.returnTime || function () { };
        // let defaultH = '+01';//默认时间 小时
        // let defaultM = '20';//默认时间 分钟
        // let confineH = '18';//限制时间 小时
        // let confineM = '30';//限制时间 分钟 字符串
        let hBool = /00/.test(defaultH);
        let mBool=/00/.test(defaultM);
        let bool = this.judgeTime(defaultH) * 60 + this.judgeTime(defaultM) > this.judgeTime(confineH) * 60 + this.judgeTime(confineM);//比较大小

        this.setState({
            // 限制时间
            defaultH: bool ? defaultH : hBool ? defaultH : '',
            defaultM: bool ? defaultM : mBool ? defaultM : '',
            confineH,
            confineM,
            returnTime,
        }, () => {
        })
    }
    // 清除默认(用户输入)时间
    clearTime = () => {
        this.setState({
            defaultH: false,
            defaultM: false,
        })
    }
    //将字符串转换为数字
    transTime = () => {
        let { defaultH, defaultM, confineH, confineM } = this.state;
        let temp = {
            defaultH: this.judgeTime(defaultH),
            defaultM: this.judgeTime(defaultM),
            confineH: this.judgeTime(confineH),
            confineM: this.judgeTime(confineM),
        };
        return temp;
    }
    //判断计算时间是否跨天,并返回小时数
    judgeTime = (timeStr) => {
        if (timeStr) {
            let range = timeStr && timeStr.toString().match(/^\+\d{2}/) ? true : false;
            let num = range ? (24 + parseInt(timeStr)) : parseInt(timeStr);
            return num;
        } else {
            return false;
        }
    }
    //小时滚动
    houresScroll = () => {
        let { defaultH, defaultM, confineH, confineM } = this.transTime();
        let hoursContainer = this.refs['hours-container'];
        hoursContainer.scrollTop = 32 * parseInt(defaultH - confineH);
    }
    //分钟滚动
    minutesScroll = () => {
        let { defaultH, defaultM, confineH, confineM } = this.transTime();
        let minutesContainer = this.refs['minutes-container'];
        let temp = 0;
        if (defaultH == confineH) {
            temp = Math.abs(defaultM - confineM)
        } else {
            temp = defaultM
        }
        minutesContainer.scrollTop = 32 * temp;
    }
    //拼接时间字符串
    jointTimeString = () => {
        let { defaultH, defaultM, confineH, confineM } = this.state;
        console.log(this.state);
        let time = defaultH + ":" + defaultM;
        // if (defaultH==confineH&&defaultM==confineM){
        //     nextTime
        // }
        let nextTime = confineH == false && confineM == false ? '' : defaultH + ":" + defaultM;
        this.props.returnTime(time, nextTime)
    }
    // 小时项 点击事件
    hourClick = (time) => {
        let { defaultH, defaultM, confineH, confineM } = this.transTime();
        // let newDefaultH = defaultH || 0;
        let newDefaultM = defaultM ? ((defaultM < 10 ? '0' : '') + defaultM) : '00';
        this.setState({
            'defaultH': time,
            'defaultM': parseInt(time) == confineH ? (confineM > defaultM ? (confineM < 10 ? '0' : '') + confineM : newDefaultM) : newDefaultM,
        }, () => {
            console.log(this.state)
            this.houresScroll();
            console.log(this.state)
            this.jointTimeString()
        })
    }
    // 分钟项 点击事件
    minuteClick = (time) => {
        let { confineH, defaultH } = this.state
        this.setState({
            'defaultH': defaultH ? defaultH : confineH || '00',
            defaultM: time
        }, () => {
            this.minutesScroll();
            console.log(this.state)
            this.jointTimeString()
        })
    }
    minutesOnScroll = (e) => {

    }
    // 小时列表
    hourItem = () => {
        let { defaultH, defaultM, confineH, confineM } = this.transTime();
        let initI = confineH === false ? 0 : confineH;
        let arr = [];

        for (let i = initI; i <= initI + 24; i++) {
            arr.push(i);
        }
        return arr.map((value, index) => {
            let str = '';
            if (parseInt(value / 24) <= 1) {
                let symbol = "";
                if (parseInt(value / 24)) {
                    symbol = "+"
                }
                str = symbol + ((value % 24) < 10 ? '0' : '') + (value % 24);
                return <div key={index} className={`${style['drop-item']} ${value === defaultH ? 'active' : ''}`} onClick={this.hourClick.bind(this, str)}>{str}</div>
            }
        })
    }
    // 分钟列表
    minuteItem = () => {
        let { defaultH, defaultM, confineH, confineM } = this.transTime();
        let arr = [], tempM = 0;

        if (defaultH == confineH) {//当默认时间(选中时间)等于限制时间时设置分的时间限制
            tempM = confineM==false ? 0 : confineM+1;
        } else {
            tempM = 0;
        }

        for (let i = tempM; i < 60; i++) {
            arr.push(i)
        }
        return arr.map((value, index) => {
            let str = (value < 10 ? '0' : '') + value;
            return <div key={index} className={`${style['drop-item']} ${value === defaultM ? style['active'] : ''}`} onClick={this.minuteClick.bind(this, str)}>{str}</div>
        })
    }

    timeFocus = () => {
        this.setState({
            isFocus: true
        }, () => {
            this.houresScroll();
            this.minutesScroll();
        })
    }
    timeBlur = () => {
        this.setState({
            isFocus: false
        })
        if (this.state.mouseInContainer) {
            return;
        } else {
            this.setState({
                isFocus: false
            })
        }

    }
    mouseInCon = () => {
        clearInterval(this.setTimer)
        this.setState({
            mouseInContainer: true,
        })
    }
    mouseLevelCon = () => {
        this.setTimer = setTimeout(() => {
            // debugger;
            this.setState({
                mouseInContainer: false,
            })
        }, 500)

    }
    containerState = () => {
        // setTimeout(() => {
        let bool = false;
        if (this.state.isFocus || this.state.isFocus == false && this.state.mouseInContainer) {
            bool = true;
        } else {
            bool = false;
        }
        return { display: bool ? '' : 'none' }
        // }, 1000)

    }
    timeChange(value) {

    }
    timeValue = () => {
        let defaultH = this.state.defaultH;
        let defaultM = this.state.defaultM;
        let tempTime = defaultH && defaultM ? defaultH + ":" + defaultM : '';
        // console.log(this.state)
        return tempTime
    }
    render() {
        // console.log(this.props)
        return (
            <div className={style['across-container']}>
                <div className={style['across-value']}>
                    <input type="text" onFocus={this.timeFocus} onBlur={this.timeBlur} value={this.timeValue()} onChange={this.timeChange.bind(this)} />
                    <span className={`${style['close']} iconfont`} onClick={this.clearTime} style={this.containerState()}>&#xe659;</span>
                </div>
                <div className={style['across-time']} style={this.containerState()} onMouseOver={this.mouseInCon} onMouseLeave={this.mouseLevelCon} onMouseMove={this.mouseInCon}>
                    <div className={style['time-container']} ref={'hours-container'}>
                        {this.hourItem()}
                    </div>
                    <div className={style['time-container']} ref={'minutes-container'} onScroll={e => { this.minutesOnScroll(e) }}>
                        {this.minuteItem()}
                    </div>

                </div>

            </div>
        );
    }
}

export default TimeAcross;
