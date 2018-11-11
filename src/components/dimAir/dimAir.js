// author:wangli time:2018-06-08 content:机型选择组件
import React, { Component, Fragment } from "react";
import { store } from "../../store";
import { Input } from 'antd';
import style from '../../static/css/fromBox/capacityRelease.scss';
export default class DimAir extends Component {
    constructor(props) {
        super(props);
        this.state = {
            air: [],//机型全部数据
            aircrfttyp: "",//已选机型
            aircrfttypShowType: false,//是否显示下拉框
            aircrfttypBox: [],//机型可选数据
            aircrfttypTypeSearchText: "",//输入框输入的筛选条件
            aircrfttypTypeSearch: "",//用户输入值
            placeholder:"",//提示文字
        }
    }

    componentWillMount() {  // 将要渲染
        let { airType="0",placeholder="" }=this.props;
        let air;
        if(airType=="1"){//判断使用类机型列表或者单个机型列表 1:单个机型列表
            air=store.getState().airSingleList;
        }else {
            air = store.getState().air;
        };
        this.setState({
            air,
            placeholder
        })
    }

    componentWillReceiveProps(nextProps) {
        this.airTypeInput.input.value = nextProps.defaultData ? nextProps.defaultData : this.state.aircrfttypTypeSearch;
        this.setState({
            aircrfttyp: nextProps.defaultData
        })
    }

    //拟飞机型焦点事件
    aircrfttypOnFocus() {
        let air = this.state.air;
        let aircrfttypBox = [];
        let listReg = new RegExp(this.airTypeInput.input.value.toUpperCase());//将字母转换为大写,设置筛选机型条件
        for (let i = 0; i < this.state.air.length; i++) {//根据筛选条件筛选付合的机型
            if (listReg.test(air[i])) {
                aircrfttypBox.push(air[i])
            }
        };
        this.setState({
            aircrfttypShowType: true,
            aircrfttypBox
        })
    }

    //拟飞机型失去焦点事件
    aircrfttypOnBlur() {
        setTimeout(() => {
            this.setState({
                aircrfttypShowType: false
            });
            this.props.dimEvent(this.state.aircrfttyp)
        }, 150);

    }

    //拟飞机型模糊查询事件
    changeAir() {
        let air = this.state.air;
        let aircrfttypBox = [];
        let listReg = new RegExp(this.airTypeInput.input.value.toUpperCase());
        for (let i = 0; i < this.state.air.length; i++) {//根据筛选条件筛选付合的机型
            if (listReg.test(air[i])) {
                aircrfttypBox.push(air[i])
            }
        };
        this.setState({
            aircrfttyp: "",
            aircrfttypBox,
            aircrfttypTypeSearchText: this.airTypeInput.input.value.toUpperCase(),
            aircrfttypTypeSearch: this.airTypeInput.input.value,
        })
    }

    //向父组件返回已选机型
    aircrfttypEvent(item) {
        this.airTypeInput.input.value = item;
        this.setState({
            aircrfttyp: item
        });
        this.props.dimEvent(item);
    }

    render() {
        let aircrfttypBoxStyle = this.state.aircrfttypShowType ? style['airTypeBox'] : style['hidden'];
        return (
            <div className={style['container']}>
                <Fragment>
                    <Input className={style['capacity-release-input-hover']} placeholder={this.state.placeholder} ref={(data) => this.airTypeInput = data} onFocus={this.aircrfttypOnFocus.bind(this)} onBlur={this.aircrfttypOnBlur.bind(this)} onChange={this.changeAir.bind(this)} maxLength="8"  />
                    <div className={`scroll box-show ${aircrfttypBoxStyle}`}>
                        {this.state.aircrfttypBox.map((item, index) => {
                            let styleSpan = "style='color: #3c78ff'";
                            let airText = item.replace(this.state.aircrfttypTypeSearchText, "<span " + styleSpan + ">" + this.state.aircrfttypTypeSearchText + "</span>")
                            return <div key={index} onClick={this.aircrfttypEvent.bind(this, item)} dangerouslySetInnerHTML={{ __html: airText }}></div>
                        })}
                    </div>
                </Fragment>
            </div>
        )
    }
}