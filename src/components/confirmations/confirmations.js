import React, { Component } from "react";
import { CSSTransition, } from 'react-transition-group';
import Btn from "../button/btn";

import style from "../../static/css/confirmations/confirmations.scss";
export default class Confirmations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '--',
            subTitle: '--',
            tipText: '--',
            onOk: () => { },
            onCancel: () => { },
            uploading: false,//数据提交状态

            visible: false,
        }
    }
    componentWillMount() {  // 将要渲染
        this.init(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.init(nextProps);
    }
    // 初始化操作
    init = (props) => {
        let params = props || null;
        if (params) {
            this.setState(() => {
                return {
                    ...params
                }
            })
        }
    }
    // 确认按钮事件
    confirm = () => {
        if (!this.state.uploading) {
            this.state.onOk();
        }

    }
    // 取消按钮事件
    cancel = () => {
        if (!this.state.uploading) {
            this.state.onCancel();
        }
    }

    render() {
        return (
            <CSSTransition
                timeout={500}
                classNames="confirmations"
                in={this.state.visible}
                unmountOnExit >
                <div className={style['tip-shade']} style={{ display: this.state.visible ? 'block' : 'none' }}>
                    <div className={style['tip-info']}>
                        <div className={style['tip-title']}>
                            <div>{this.state.title}</div>
                            <div>
                                <span className={`${style['close']} iconfont`} onClick={this.cancel}>&#xe62c;</span>
                            </div>
                        </div>
                        <div className={style['tip-content']}>
                            <p className={style['sub-title']}>{this.state.subTitle}</p>
                            <p>{this.state.tipText}</p>
                        </div>
                        <div className={style['tip-btn']}>
                            <Btn text="确认" btnType='1' otherText="提交中"
                                isDisable={this.state.uploading}
                                onClick={this.confirm}
                                styleJson={{ width: "120px", padding: '0' }} />
                            {/* <button className={style['confirm']} onClick={this.confirm}>确认</button> */}
                            <button className={style['cancel']} onClick={this.cancel}>取消</button>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}