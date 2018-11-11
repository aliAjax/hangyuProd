// author:wangli time:2018-06-24 content:运力发布表单-计划执行周期模块
import React, { Component, Fragment } from "react";
import classNames from 'classnames';
import { DatePicker, Radio } from 'antd';
import moment from 'moment';
import style from '../../static/css/sailingtimeComponent/sailingtimeComponent.scss';
import { height } from "window-size";

const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;

export default class SailingtimeComponent extends Component {
    constructor(props) {
        super(props);
        this.onChangeRadio = this.onChangeRadio.bind(this)
        this.state = {
            edit: false,//是否可编辑 false：不能
            sailingtimeText: "",//提示信息
            sailingtime: "",//计划执行时间
            periodValidity: "",//运力有效期--用于禁选计划执行时间段
            radioValue: 0,//单选框 0 整年 1 冬春航季 2 夏秋航季 3 自定义
            disabledRadio: true,//时间组件是否禁用
        }
    }

    //默认跳转到下一年事件
    onCalendarChange(dates, dateStrings) {//dates：时间对象数组 dateStrings:时间字符串数组
        // console.log(dates,dateStrings)
        if (dates.length == 1) {
            let a = moment(dates[0]).format('YYYY-MM-DD');
            let b = moment(dates[0]).add(1, 'y').format('YYYY-MM-DD');
            let sailingtime = a + "," + b;
            this.setState({
                sailingtime
            })
        }
    }

    //计划执行时间
    sailingtime(date, dateString) {//date：时间对象 dateString:时间字符串
        let sailingtime = dateString[0] + "," + dateString[1];
        this.setState({
            sailingtime,
        });
        this.props.changeEvent(sailingtime, date);//sailingtime：选中的时间字符串 date:时间对象
    }

    //禁选时间
    sailingtimeDisabledDate(current) {
        let disText = current && current < moment().add(1, "months").endOf("days");//默认当前时间之后一个月禁选
        if (this.state.periodValidity) {
            let startTime = moment(this.state.periodValidity, "YYYY/MM/DD");
            disText = current && current < startTime.endOf("days");//运力有效期之前的时间禁选
        };
        return disText
    }

    //显示面板跳转
    openDatePicker(){
        let sailingtime=this.state.sailingtime;
        if(!sailingtime){//没有计划执行周期时
            let date=moment().add(1,"days").add(1,"months");
            if(this.state.periodValidity){
                date=moment(this.state.periodValidity,"YYYY-MM-DD").add(1,"days");
            };
            let startDate=date.format('YYYY-MM-DD');
            let endDate=date.add(1,'y').format('YYYY-MM-DD');
            sailingtime=startDate+","+endDate;
            this.props.changeEvent(sailingtime,[moment(startDate,"YYYY-MM-DD"),moment(endDate,"YYYY-MM-DD")]);//第一个参数：时间字符串 第二个参数：时间对象数组
        };
        this.setState({
            sailingtime
        });
        // this.props.changeEvent(sailingtime, [date,endD])
    }

    //选中为固定时间时
    onChangeRadio = (e) => {//
        let disabledRadio = true;
        let sailingtime = '';
        switch (e.target.value) {//选中的值
            case 0:
                sailingtime = "整年";
                break;
            case 1:
                sailingtime = "冬春航季";
                break;
            case 2:
                sailingtime = "夏秋航季";
                break;
        };
        if (e.target.value == 3) {
            disabledRadio = false;
            this.props.changeEvent(sailingtime, []);
        } else {
            this.props.changeEvent(sailingtime, []);
        };
        this.setState({
            radioValue: e.target.value,
            sailingtime,
            disabledRadio
        });
    }

    componentWillReceiveProps(nextProps) {  // Props发生改变
        let { edit = false, sailingtimeText = "", periodValidity = "", sailingtime = "整年" } = nextProps;
        let radioValue = this.state.radioValue;
        let disabledRadio = true;
        switch (sailingtime) {//计划执行周期
            case "整年":
                radioValue = 0;
                break;
            case "冬春航季":
                radioValue = 1;
                break;
            case "夏秋航季":
                radioValue = 2;
                break;
            default:
                radioValue = 3;
                disabledRadio = false;
                break;
        }
        this.setState({
            edit,
            sailingtimeText,
            periodValidity,
            sailingtime,
            radioValue,
            disabledRadio
        })
    }

    render() {
        let edit=this.state.edit;
        //草稿获取计划周期渲染事件
        let cycleDefault = [];
        if (this.state.sailingtime != "" && this.state.radioValue == 3) {
            let sailingtimeM=this.state.sailingtime.split(",");
            if(sailingtimeM.length==2){
                cycleDefault = [moment(this.state.sailingtime.split(",")[0], "YYYY/MM/DD"), moment(this.state.sailingtime.split(",")[1], "YYYY/MM/DD")];
            }else {
                cycleDefault = [moment(this.state.sailingtime.split(",")[0], "YYYY/MM/DD"), null];
            }
        }
        return (
            <div className={style['box']}>
                <div className={classNames({ [style['title']]: !edit, [style['title-no']]: edit })}>计划执行周期</div>
                <div className={style['choose']}>
                    <RadioGroup onChange={this.onChangeRadio} value={this.state.radioValue} style={edit ? { height: '30px' } : {}}>
                        <Radio value={0}><span title="约365天">整年</span></Radio>
                        <Radio value={1}><span title="约153天">冬春航季</span></Radio>
                        <Radio value={2}><span title="约216天">夏秋航季</span></Radio>
                        <Radio value={3}>自定义</Radio>
                    </RadioGroup>
                    <RangePicker
                        placeholder={["开始", "结束"]}
                        value={cycleDefault}
                        allowClear={false}
                        onChange={this.sailingtime.bind(this)}
                        format="YYYY-MM-DD"
                        disabledDate={this.sailingtimeDisabledDate.bind(this)}
                        dropdownClassName={style['antd']}
                        onCalendarChange={this.onCalendarChange.bind(this)}
                        onOpenChange={this.openDatePicker.bind(this)}
                        disabled={this.state.disabledRadio}
                        locale={{
                            "lang": {
                                "yearFormat": "YYYY" + "年",
                                "monthSelect": "选择月份",
                                "yearSelect": "选择年份",
                                "previousMonth": "上个月 (PageUp)",
                                "nextMonth": "下个月 (PageDown)",
                                "previousYear": "上一年 (Control + left)",
                                "nextYear": "下一年 (Control + right)"
                            }
                        }}
                    />
                </div>
                <span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 99, left: 40 }}>{this.state.sailingtimeText}</span>
            </div>
        )
    }
}