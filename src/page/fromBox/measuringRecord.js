import React, {Component} from 'react';
import emitter from "../../utils/events";
import styles from '../../static/css/fromBox/measuringRecord.scss'
import Axios from './../../utils/axiosInterceptors'
import { store } from "../../store/index";

export default class MeasuringRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: null,  // 测算记录数组
        };
    }

    closeFormBox() {  // 关闭formBox
        let obj = {};
        obj.openFrom = false;
        obj.fromType = '';
        obj.fromMe = '';
        emitter.emit('openFrom', obj);
    }
    componentWillReceiveProps(nextProps) {  // 获取数据

    }
    componentDidMount() {
        Axios({
            method: 'post',
            url: '/selectCalculationsRecordByEmployeeId',
            params:{  // 一起发送的URL参数
                employeeId: store.getState().role.id
            },
            // data: JSON.stringify(demand),
            dataType:'json',
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        }).then((response)=>{
            console.info(response);
            if(response.data.opResult == 0) {
                this.setState({
                    records: response.data.records
                })
            }
        })
    }
    render() {
        return (
            <div>
                <div className={styles['plan-wrapper']}>
                    <header>
                        <div className={`${styles['top-til']} ${styles['font-gray']}`}>
                            测算记录
                            <span className={'iconfont'} onClick={this.closeFormBox.bind(this)}>&#xe62c;</span>
                        </div>
                    </header>
                    <div className={styles['row']}>
                        <div>时间</div>
                        <div>航线</div>
                        <div>文件</div>
                    </div>
                    {
                        (this.state.records && this.state.records.length != '') ? this.state.records.map((val, index) => {
                            return (
                                <div className={styles['row']} key={index}>
                                    <div>{val.applicationDate}</div>
                                    <div>{val.airLine}</div>
                                    {
                                        val.isMeasurementReport == 1
                                            ? <a href={`downloadCalculationsRecord?id=${val.id}`}
                                                 title={`${val.airLine}测算报告.pdf`}>{val.airLine}测算报告.pdf</a>
                                            : <div>测算中...</div>
                                    }
                                </div>
                            )
                        }) : (<div className={styles['font-gray']} style={{textAlign: 'center'}}>暂无数据!</div>)
                    }
                </div>
            </div>
        )
    }
}
