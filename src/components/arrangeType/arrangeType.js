// author:wangli time:2018-05-05 content:排序组件
import React, { Component } from "react";
import style from "../../static/css/issueTime/issueTime.scss";

export default class ArrangeType extends Component {
    constructor(props) {
        super(props);
    }

    changeArrangeTimeMethod(e) {
        e.stopPropagation();
        let arrangeType = !this.props.arrangeType;
        this.props.arrangeTypeEvent(arrangeType);
    }

    render() {
        let arrangeType = this.props.arrangeType;
        let title = this.props.title;
        let arrangeTypeTop, arrangeTypeBottom;
        if (arrangeType) {
            arrangeTypeTop = style['demand-list-top-triangle0'];
            arrangeTypeBottom = style['demand-list-bottom-triangle0']
        } else {
            arrangeTypeTop = style['demand-list-top-triangle1'];
            arrangeTypeBottom = style['demand-list-bottom-triangle1']
        };
        return (
            <div className={style['content-box']} style={this.props.style ? this.props.style : {}}>
                {title}
                <div className={style['demand-list-triangle']} onClick={(e) => this.changeArrangeTimeMethod(e)}>
                    <div className={arrangeTypeTop}></div>
                    <div className={arrangeTypeBottom}></div>
                </div>
            </div>
        )
    }

}