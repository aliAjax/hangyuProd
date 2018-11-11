import React, { Component } from 'react';
import Axios from "./../../utils/axiosInterceptors";
import { store } from './../../store/index';
import emitter from '../../utils/events';
import { Checkbox, Modal } from 'antd';

import style from './../../static/css/popup/outOfStock.scss';


export default class OutofStock extends Component {
    constructor(popup) {
        super(popup)
        this.state = {
            isMsg: true,
            isoutof: false,
            otherCheck: false,
            otherType: true,//是否禁用textarea
            other: '',
            data: "",//异步请求数据
            dataList: [],//存储多选原因数据
            textNum: 0,//输入字数
            list1: false,//运力调整是否选中，false未选中
            list2: false,//时刻航权是否选中，false未选中
            list3: false,//处罚限制是否选中，false未选中
            loading: false,
        }
    }
    componentWillMount() {

    }
    //TODO:删除数组中某条数据
    delDate(data) {
        let dataList = this.state.dataList;
        for (let i = 0; i < dataList.length; i++) {
            if (dataList[i] == data) {
                dataList.splice(i, 1)
                return dataList
            }
        };
    }

    //多选原因
    clickEvent1() {
        let dataList = this.state.dataList;
        if (this.state.list1) {
            dataList = this.delDate("运力调整")
        } else {
            dataList.push("运力调整")
        };
        this.setState({
            list1: !this.state.list1,
            dataList,
            otherCheck: false,
            otherType: true,
            other: ""
        })
    }

    clickEvent2() {
        let dataList = this.state.dataList;
        if (this.state.list2) {
            dataList = this.delDate("时刻航权")
        } else {
            dataList.push("时刻航权")
        };
        this.setState({
            list2: !this.state.list2,
            dataList,
            otherCheck: false,
            otherType: true,
            other: ""
        })
    }

    clickEvent3() {
        let dataList = this.state.dataList;
        if (this.state.list3) {
            dataList = this.delDate("处罚限制")
        } else {
            dataList.push("处罚限制")
        };
        this.setState({
            list3: !this.state.list3,
            dataList,
            otherCheck: false,
            otherType: true,
            other: ""
        })
    }
    // 航路调整
    // 报价变更
    // 时刻航权
    cancel = () => {
        emitter.emit('openPopup', {
            popupType: 0,
            popupMes: {}
        })
    }
    continueOutOf = () => {
        this.setState({
            isMsg: false,
            isoutof: true,
        })
    }
    // TODO: 下架原因 尚未对角色判定

    //点击确定 下架需求
    handleOutofStock = (id) => {
        if (this.state.dataList.length == 0 && this.state.otherCheck == false) {
            Modal.error({
                title: '信息提示：',
                content: '请填写下架原因',
                onOk() {
                },
                className: "test"
            });
        } else if (this.state.dataList.length == 0 && this.state.otherCheck == true && this.state.other == "") {
            Modal.error({
                title: '信息提示：',
                content: '请输入具体原因',
                onOk() {
                },
                className: "test"
            });
        } else {
            this.setState({
                loading: true
            })
            let paramsData;
            if (this.state.dataList.length != 0) {
                paramsData = this.state.dataList.join("€")
            } else {
                paramsData = this.state.other
            };
            Axios({
                url: 'closeDemandById',
                method: 'post',
                params: {
                    id: id,
                    closeReason: paramsData
                }
            }).then((response) => {
                if (response.data.opResult === '0') {
                    emitter.emit('openPopup', {
                        popupType: 0,
                        popupMes: {}
                    });
                    Modal.success({
                        title: '信息提示：',
                        content: '下架成功',
                        onOk() {
                        },
                        className: "test"
                    });
                    emitter.emit('renewWodefabu');
                } else {
                    emitter.emit('openPopup', {
                        popupType: 0,
                        popupMes: {}
                    });
                    Modal.error({
                        title: '信息提示：',
                        content: response.data.msg,
                        onOk() {
                        },
                        className: "test"
                    })
                    this.setState({
                        loading: false
                    })
                }
            })
        }
    }
    otherChange = (event) => {
        this.setState({
            other: event.target.value,
            textNum: event.target.value.length
        })
    }
    otherCheckChange = () => {
        let otherType;
        if (this.state.otherCheck) {
            otherType = true
        } else {
            otherType = false
        };
        this.setState({
            list1: false,
            list2: false,
            list3: false,
            dataList: [],
            otherType,
            otherCheck: !this.state.otherCheck
        })
    }
    render() {
        let { id, title, identifier } = this.props.popupMes.transmit || {}
        let role = store.getState().role.role;
        return (
            <div>
                {
                    this.state.isMsg ? (
                        <div className={style['out-of-stock']}>
                            <div className={style['title']}>
                                <button className={style['close']} onClick={this.cancel}>
                                    <span className={'iconfont'}>&#xe62c;</span>
                                </button>
                            </div>
                            <div className={style['content']}>
                                需求下架后，该需求信息将会从市场上删除，并要求您提供下架原因。<br />
                                若需再次上架需重新发布新需求
                            </div>
                            <div className={style['footer']}>
                                <button className={`${style['btn-blue-plus']} ${style['cancel']}`} onClick={this.cancel}>取消</button>
                                <button className={`${style['btn-gray']} ${style['confirm']}`} onClick={this.continueOutOf}>继续下架</button>
                            </div>
                        </div>
                    ) : ''
                }

                {
                    this.state.isoutof ? (
                        <div className={style['out-of-stock']}>
                            <div className={style['title']}>
                                <button className={style['close']} onClick={this.cancel}>
                                    <span className={'iconfont'}>&#xe62c;</span>
                                </button>
                            </div>
                            <div className={style['cause']}>
                                <p>请告知“{title}”（需求编号{identifier}）下架原因</p>
                                <div>
                                    <div className={style['moreClick']}>
                                        <Checkbox checked={this.state.list1} onClick={this.clickEvent1.bind(this)} >运力调整</Checkbox>
                                        <Checkbox checked={this.state.list2} onClick={this.clickEvent2.bind(this)} >时刻航权</Checkbox>
                                        <Checkbox checked={this.state.list3} onClick={this.clickEvent3.bind(this)} >处罚限制</Checkbox>
                                    </div>
                                    <div className={style['other']}>
                                        <Checkbox checked={this.state.otherCheck} onClick={this.otherCheckChange}>其他</Checkbox>
                                        <div className={style['textarea']}>
                                            <span></span>
                                            <span></span>
                                            <textarea className={style['textarea']} value={this.state.other} placeholder={this.state.otherType ? "请先选择其他，方可输入" : "输入原因后点击确定按钮方可下架"} maxLength="75" disabled={this.state.otherType} onChange={this.otherChange}></textarea>
                                            <div>
                                                <span style={{ position: 'absolute', bottom: '4px', right: '10px', border: 0 }}>{this.state.textNum}/75</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className={style['footer']}>
                                <button className={`${style['btn-blue-plus']} ${style['cancel']}`} onClick={this.handleOutofStock.bind(this, id)} disabled={this.state.loading}>确定</button>
                                <button className={`${style['btn-gray']} ${style['confirm']}`} onClick={this.cancel}>取消</button>
                            </div>
                        </div>
                    ) : ''
                }

            </div>
        )
    }
}