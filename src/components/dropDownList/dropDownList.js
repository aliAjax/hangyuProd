// 需求过滤 下拉菜单
import React, { Component } from 'react';
import style from './../../static/css/dropDownList/dropDownList.scss';

export default class DropDownList extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    // 根据props计算是否显示
    isShow = () => {
        return this.props.info.isShow ? '' : style['active'];
    }
    // 子组件点击触发父组件事件
    handleClick = (type, name) => {
        this.props.itemClick(type, name);
    }
    render() {
        return (
            <div className={`${style['dropDown-list']} ${this.isShow()}`}>
                <div className={style['dropDown-list-item']}>
                    {
                        this.props.info.list.map((item, index) => {
                            return (<div key={index}
                                onClick={this.handleClick.bind(null, item.type, this.props.name)}>
                                {item.text}
                            </div>);
                        })
                    }
                </div>
            </div>
        )
    }
}