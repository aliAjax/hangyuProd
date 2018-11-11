import React, { Component } from 'react';
import Axios from "./../../utils/axiosInterceptors";
import { DatePicker, Modal } from 'antd';
import moment from 'moment';

import style from './../../static/css/from/planInfo.scss';

export default class PlanInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,

            id: null,
            isMarket: true,
            sailingtime: '',
            periodValidity: '',

            info: [],
            payload: null,
            contact: [],
            time: null,
        }
    }
    componentWillMount() {
        this.init(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.init(nextProps);
    }
    componentDidMount() {
        let timeTable = this.refs.timeTable;
        if (timeTable) {
            let [one, two] = timeTable.childNodes;
            let gather = [...one.childNodes, ...two.childNodes]
            for (let i = 0; i < gather.length; i++) {
                let obj = gather[i];
                let fontSize;
                let width = obj.offsetWidth;
                let text = obj.innerHTML
                if (obj.currentStyle) {
                    fontSize = obj.currentStyle['fontSize'];
                } else {
                    fontSize = getComputedStyle(obj, false)['fontSize'];
                }
                fontSize = Number(fontSize.replace('px', ''));
                if (fontSize * text.length >= width){
                    obj.title=text;
                }
            }
        }

    }
    init = (props) => {
        let { info, payload, contact, time } = props;
        if (info) {
            let { id, isMarket, sailingtime, periodValidity } = payload || {};
            this.setState(() => {
                return {
                    edit: false,
                    info,
                    payload,
                    contact,
                    time,//时刻
                    id,//需求id
                    isMarket,//市场/我的
                    sailingtime,//计划执行时间
                    periodValidity,//运力有效期
                }
            }, () => {
                // console.log(this.state)
            });
        }
    }
    // 点击修改
    editTime() {
        this.setState({
            edit: !this.state.edit,
        });
    }
    // 取消修改按钮
    cancelTime = () => {
        this.setState({
            edit: !this.state.edit,
            periodValidity: this.props.payload.periodValidity,//恢复至原来的内容
        });
    }
    // 确认修改按钮
    confirmTime = () => {
        let { id, periodValidity } = this.state;
        Axios({
            url: 'updatePeriodValidity',
            method: 'post',
            params: {
                demandId: id,
                periodValidity: periodValidity,
            },
        }).then((response) => {
            // console.log(response)
            if (response.data.opResult == "0") {
                Modal.success({
                    title: '修改成功',
                    content: '',
                    edit: false,
                });
                this.props.updateDetail()
            } else {
                Modal.error({
                    title: '修改失败',
                    content: '',
                    edit: false,
                });
            }
        })
    }
    // 禁用时间
    disabledTimeFn = (current) => {
        let { sailingtime } = this.state.payload;
        let [startTime, endTime] = sailingtime ? sailingtime.split(',') : [];

        return current && (current < moment().subtract(1, "days") || current > moment(startTime).subtract(1, "days").endOf("days"));
    }
    // 日期修改
    periodChange = (e, dateString) => {
        if (dateString == "") {
            let periodValidity = this.state.periodValidity;
            periodValidity = moment().format().split("T")[0];
            this.setState({
                periodValidity
            })
        } else {
            this.setState({
                periodValidity: dateString
            }, () => {
                // console.log(this.state);
            })
        }

    }
    // 初始化有效期
    renderTime = (obj, index) => {
        let { name, value, edit } = obj;
        let periodValidity = this.state.periodValidity;
        return (
            <div key={index}>
                <div>{name}</div>
                <div>
                    {
                        this.state.edit ?
                            (
                                <div className={style['edit']}>
                                    <div>
                                        <DatePicker size={'Small'} format={'YYYY-MM-DD'} value={periodValidity ? moment(periodValidity) : null} placeholder={value} onChange={this.periodChange} disabledDate={this.disabledTimeFn} />
                                    </div>
                                    <span className={`iconfont ${style['confirm']}`} onClick={this.confirmTime}>&#xe658;</span>
                                    <span className={`iconfont ${style['cancel']}`} onClick={this.cancelTime}>&#xe659;</span>
                                </div>
                            ) : (
                                <div className={style['default']}>
                                    {periodValidity}<span className={`iconfont`} onClick={this.editTime.bind(this)}>&#xe653;</span>
                                </div>
                            )
                    }
                </div>
            </div>
        )
    }
    infoBaseEle = () => {
        if (this.state.info && this.state.info.length) {
            // console.log(1123)
            return (
                <div className={`${style['base-info']} ${style['last-child-wrap']}`}>
                    {
                        this.state.info.map((obj, index) => {
                            let { name, value, edit } = obj;
                            if (edit) {
                                return this.renderTime(obj, index)
                            } else {
                                return (
                                    <div key={index}>
                                        <div>{name}</div>
                                        <div>{value}</div>
                                    </div>
                                );
                            }
                        })
                    }
                </div>
            )
        }
    }
    // 联系人
    infoContactEle = () => {
        if (this.state.contact && this.state.contact.length) {
            return (
                <div className={style['base-info']}>
                    {
                        this.props.contact.map((obj, index) => {
                            return (
                                <div key={index}>
                                    <div>{obj.name}</div>
                                    <div>{obj.value}</div>
                                </div>
                            )
                        })
                    }
                </div>
            )
        }
    }
    // 时刻(航线的航点时刻)
    infoTimeEle = () => {
        if (this.state.time) {
            let { dptLevel, dptEnter, pstEnter, pstLevel, arrvEnter, arrvLevel, pstBackEnter, pstBackLevel, dptNm, pstNm, arrvNm, dpt, pst, arrv } = this.props.time;
            return (
                <div className={style['time']}>
                    <div>时刻</div>
                    {pst ? (
                        <div className={style['multi']} >
                            <div>
                                <div>{dptNm}</div>
                                <div>{dptLevel + `-` + pstEnter}</div>
                                <div>{pstNm}</div>
                                <div>{pstLevel + '-' + arrvEnter}</div>
                                <div>{arrvNm}</div>
                            </div>
                            <div>
                                <div>{arrvNm}</div>
                                <div>{arrvLevel + `-` + pstBackEnter}</div>
                                <div>{pstNm}</div>
                                <div>{pstBackLevel + '-' + dptEnter}</div>
                                <div>{dptNm}</div>
                            </div>
                        </div>
                    ) : (
                            <div className={style['less']} ref='timeTable'>
                                <div>
                                    <div>{dptNm}</div>
                                    <div>{dptLevel + `-` + arrvEnter}</div>
                                    <div>{arrvNm}</div>
                                </div>
                                <div>
                                    <div>{arrvNm}</div>
                                    <div>{arrvLevel + `-` + dptEnter}</div>
                                    <div>{dptNm}</div>
                                </div>
                            </div>
                        )}
                </div>
            )
        } else {
            return '';
        }
    }
    render() {
        return (
            // {/*航线或者运力信息*/}
            <div className={style['plane-info']}>
                {this.infoBaseEle()}
                {this.infoContactEle()}
                {this.infoTimeEle()}

            </div>
        )
    }
}