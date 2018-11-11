import React, { Component } from "react";
import { Select } from 'antd'
import style from "../../static/css/fromBox/hourTimer.scss";
const Option = Select.Option;

export default class HourTimer extends Component {

    constructor(props) {
        super(props);
        this.clickEvent=this.clickEvent.bind(this);
        this.state = {
            time: this.props.time,//下拉数据有无筛选 ''为无
            defaultTime: '',//草稿获取的时间
            data: '',//选择的时间
            hours: [],//可选时刻数组
            type: "",//是否禁用
            showArrow:true,//是否显示下拉箭头
            placeText:"",//提示文字
        }
    }
    //TODO:选择时刻
    chooseHour(value) {
        let data = value;
        this.setState({
            data
        });
        try {
            this.props.outTimeEvent(data)
        } catch (e) {

        };
        try {
            this.props.inTimeEvent(data)
        } catch (e) {

        }
    }

    clickEvent(e){
        console.log("aaaaaaaaaaaaaaaaaa")
        // e.preventDefault();
        e.stopPropagation();
    }

    componentWillMount() {
        let placeText="请选择出港时段";
        if(this.state.type){
            placeText="请选择出港时段";
        };
        //显示时钟列表
        let hours = [];
        for (let i = 0; i < 24; i++) {
            if (i < 10) {
                hours.push(`0${i}:00`)
            } else {
                hours.push(`${i}:00`)
            }
        };
        this.setState({
            defaultTime:this.props.defaultTime,
            data:this.props.defaultTime,
            time:this.props.time,
            hours,
            placeText
        });
    };

    componentWillReceiveProps(nextProps) {
        let firstStr = nextProps.time.split("")[0];
        let time = parseInt(nextProps.time.split(":")[0]);
        let showArrow=true;
        try{
            showArrow=nextProps.showArrow
        }catch (e) {

        };
        let hours = this.state.hours;
        if (firstStr == "+") {//当筛选条件为第二天时
            hours = [];
            try {
                for (let i = time + 1; i < 24; i++) {
                    if (i < 10) {
                        hours.push(`+0${i}:00`)
                    } else {
                        hours.push(`+${i}:00`)
                    }
                };
            } catch (e) {

            }
        } else {
            if (time || time == 0) {
                hours = [];
                try {
                    for (let i = time + 1; i < 24; i++) {
                        if (i < 10) {
                            hours.push(`0${i}:00`)
                        } else {
                            hours.push(`${i}:00`)
                        }
                    };
                    for (let j = 0; j < 24; j++) {
                        if (j < 10) {
                            hours.push(`+0${j}:00`)
                        } else {
                            hours.push(`+${j}:00`)
                        }
                    };
                } catch (e) {

                };
            };
        };
        //再次选择出港时间时，进港时刻是否改变
        let data = nextProps.defaultTime;
        if (nextProps.defaultTime.split("")[0] != "+" && nextProps.defaultTime.split(":")[0] <= time) {
            data = "";
        };
        this.setState({
            defaultTime: nextProps.defaultTime,//草稿获取的时间
            data,//选择的时间
            type: nextProps.type,
            hours,
            showArrow
        })
    }

    render() {
        return (
            <div className={style['hours']}>
                <Select value={this.state.data} style={{ width: 120, marginLeft: 4 }} showArrow={this.state.showArrow} disabled={this.state.type ? true : false} dropdownClassName={style['dropDown']} onChange={this.chooseHour.bind(this)}>
                    {
                        this.state.hours.map((item, index) => {
                            return <Option value={`${item}`} key={index}>{item}</Option>
                        })
                    }
                </Select>
                {/*<div onClick={this.clickEvent} className={style['mes']}>{this.state.placeText}</div>*/}
                {
                    this.state.type ? <div className={style['mes']}>请先选出港时段</div> : ""
                }
            </div>
        )
    }
}