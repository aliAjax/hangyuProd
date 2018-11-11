import React,{Component} from 'react'
import Axios from "./../../utils/axiosInterceptors";
import AirLineNeed from './airLineForm/airLineNeed'  // 航线需求
import AirLineEscrow from './airLineForm/airLineEscrow'  // 运营托管
import styles from '../../static/css/from/airLineRelease.scss'

import { Radio, Modal } from 'antd';

export default class AirLineRelease extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAirLineNeed: true,
            type: 0,  // 0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托
            data0: {},  // 航线需求
            data3: {},  // 委托航线
            data2: {},  // 运营托管
            demandId: '',
        };
    }
    success(mes) {
        Modal.success({
            title: mes,
        });
    }
    error(mes) {
        Modal.error({
            title: mes,
        });
    }
    radioChangeFn(e) {
        let target = e.target;
        this.setState({
            type: Number(target.value),
        });
        // this.initData();
    }
    renewData(i) {  // 点击“申请测算”更新数据
        // this.initData();

    }
    initData() {  // 获取并分配数据
        Axios({
            method: 'post',
            url: '/queryDraftDemand',
            /*params:{  // 一起发送的URL参数
                page:1
            },*/
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        }).then((response)=>{
            if(response.data.opResult == 0 || response.data.opResult == 1){  // 0:有数据，1:没数据
                if(response.data.list && response.data.list.length != 0) {
                    let list = response.data.list;
                    list.forEach((val) => {
                        let demandtype = Number(val.demandtype);
                        let demandprogress = Number(val.demandprogress);
                        if((demandtype === 0 || demandtype === 3) && demandprogress === 11) {  // 0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托
                            this.setState({
                                data0: val,
                            });
                        }else if(demandtype === 2 && demandprogress === 11) {  // 运营托管
                            this.setState({
                                data2: val,
                            })
                        }
                    });
                }
            }else {
                this.error('连接异常！');
            }
        })
    }
    bianjiAgainData() {  // 重新编辑-获取并分配数据
        Axios({
            method: 'post',
            url: '/demandFind',
            params:{  // 一起发送的URL参数
                demandId: this.props.bianjiAgain.demandId
            },
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        }).then((response)=>{
            if(response.data.opResult == 0) {
                this.setState({
                    data0: response.data.data
                });
            }else {
                this.error('连接异常！');
            }
        })
    }
    chongxinshangjia() {  // 重新上架-获取并分配数据
        Axios({
            method: 'post',
            url: '/republishDemand',
            params:{  // 一起发送的URL参数
                demandId: this.state.demandId
            },
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        }).then((response)=>{
            try {
                if(response.data.opResult == 0 || response.data.opResult == 1){  // 0:有数据，1:没数据
                    if(response.data.demand && response.data.demand.length != 0) {
                        let obj = response.data.demand;
                        let demandtype = Number(obj.demandtype);
                        let demandprogress = Number(obj.demandprogress);
                        if(demandtype === 0 || demandtype === 3) {  // 0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托
                            this.setState({
                                type: 0,
                                data0: obj,
                            });
                        }else if(demandtype === 2) {  // 运营托管
                            this.setState({
                                type: 2,
                                data2: obj,
                            })
                        }
                    }
                }else {
                    this.error('连接异常！');
                }
            } catch (e) {

            }
        })
    }
    caogaoxiang() {  // 草稿箱-获取并分配数据
        Axios({
            method: 'post',
            url: '/queryDraftDemandDetail',
            params:{  // 一起发送的URL参数
                demandId: this.state.demandId
            },
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        }).then((response)=>{
            if(response.data.opResult == 0 || response.data.opResult == 1){  // 0:有数据，1:没数据
                if(response.data.obj && response.data.obj.length != 0) {
                    let obj = response.data.obj;
                    let demandtype = Number(obj.demandtype);
                    let demandprogress = Number(obj.demandprogress);
                    if((demandtype === 0 || demandtype === 3) && demandprogress === 11) {  // 0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托
                        this.setState({
                            type: 0,
                            data0: obj,
                        });
                    }else if(demandtype === 2 && demandprogress === 11) {  // 运营托管
                        this.setState({
                            type: 2,
                            data2: obj,
                        })
                    }
                }
            }else {
                this.error('连接异常！');
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.caogaoxiang) {
            if(nextProps.caogaoxiang.demandId != this.props.caogaoxiang.demandId) {
                this.setState({
                    demandId: nextProps.caogaoxiang.demandId
                }, ()=>{
                    this.caogaoxiang();
                })
            }
        }else if(nextProps.chongxinshangjia) {
            if(nextProps.chongxinshangjia.demandId != this.props.chongxinshangjia.demandId) {
                this.setState({
                    demandId: nextProps.chongxinshangjia.demandId
                }, ()=>{
                    this.chongxinshangjia();
                })
            }
        }
    }
    componentDidMount() {
        if(this.props.bianjiAgain) {
            this.bianjiAgainData()
        }else if(this.props.caogaoxiang) {
            this.setState({
                demandId: this.props.caogaoxiang.demandId
            }, ()=>{
                this.caogaoxiang();
            })
        }else if(this.props.chongxinshangjia) {
            this.setState({
                demandId: this.props.chongxinshangjia.demandId
            }, ()=>{
                this.chongxinshangjia();
            })
        }else {
            // this.initData();
        }
    }
    componentWillUnmount() {

    }
    formItemFn(type) {
        let that = this;
        switch(type){ //TODO: data0: 航线需求  data3: 委托航线  data2: 运营托管
            case 0:
                return (<AirLineNeed key={0}
                                    shangjiaBianji={!!(this.props.bianjiAgain || this.props.chongxinshangjia)}
                                    demandtype={that.state.type}
                                    data={that.state.data0}
                                    renewData={that.renewData.bind(that)} />);
                break;
            case 2:
                return (<AirLineEscrow key={2}
                                      data={that.state.data2}
                                      renewData={that.renewData.bind(that)} />);
                break;
        }
    }
    render(){
        const RadioGroup = Radio.Group;
        return(
            <div style={{position: 'relative'}}>
                <div className={styles['top']}>
                    <div style={{fontWeight: 'bold'}}>发布需求</div>
                    <div>
                        <RadioGroup name="radiogroup"
                                    defaultValue={0}
                                    value={this.state.type}
                                    onChange={this.radioChangeFn.bind(this)}>
                            <Radio value={0} style={{fontSize: '1.2rem'}}>航线需求</Radio>
                            {/*<Radio value={3} style={{fontSize: '1.2rem'}}>委托航线</Radio>*/}
                            <Radio value={2} style={{fontSize: '1.2rem'}}>运营托管</Radio>
                        </RadioGroup>
                    </div>
                </div>
                { this.formItemFn(this.state.type) }
            </div>
        )
    }
}