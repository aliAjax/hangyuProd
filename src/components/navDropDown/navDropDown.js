import React, { Component } from "react";
import styles from "../../static/css/navDropDown/navDropDown.scss";
export default class NavDropDown extends Component {

    //点击事件
    returnType(type, text) {
        this.props.itemMethod(type, text)
    }

    render() {
        const { icon, text, type } = this.props.item;
        //判断组件加载样式
        let dropStyle = '';
        if (icon) {
            dropStyle = styles['nav-drop-down']
        } else {
            dropStyle = styles['nav-drop']
        }
        return (
            <div
                className={dropStyle}
                onClick={() => {
                    return (
                        this.returnType(type, text)
                    )
                }}
            >
                <i dangerouslySetInnerHTML={{ __html: icon }} className={'iconfont'} />
                <span>{text}</span>
            </div>
        )
    }
}