// author:wangli time:2018-05-15 content:拟开班期组件
import React, { Component } from "react";
import style from "../../static/css/dateChoose/dateChoose.scss";
export default class DateChoose extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {  // 将要渲染
    }

    //点击选择拟开航班日期事件
    chooseDate(text) {//text:已选航班日期
        let newData = this.props.data;
        for (var key in newData) {
            if (newData[key].name === text) {
                newData[key].type = !newData[key].type
            }
        };
        this.props.chooseDate(newData)
    }

    render() {
        const dataList = this.props.data;
        return (
            <div>
                {
                    dataList.map((item, index) => {//循环渲染组件
                        let notChooseStyle;
                        if (!item.type) {
                            notChooseStyle = style['date-choose-button']
                        } else {
                            notChooseStyle = style['data-choose']
                        }
                        return <input type='button' value={item.name} key={index} onClick={this.chooseDate.bind(this, item.name)} className={notChooseStyle} />
                    })
                }
            </div>
        )
    }
}