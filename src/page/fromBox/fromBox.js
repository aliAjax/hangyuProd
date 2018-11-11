import React,{Component} from 'react'

import style from './../../static/css/from/formMain.scss'
import {
    CSSTransition,
} from 'react-transition-group';
import emitter from "../../utils/events";
import AirLineRelease from './airLineRelease';
import CapacityRelease from './capacityRelease';
import ItemDetailForm from './itemDetailForm';
import MyOrderForm from './myOrderForm';
import AccountOperation from './accountOperation/accountOperation'
import MeasuringRecord from './measuringRecord';
import Financing from './financing';
// import AirportDemandDetail from './airportDemandDetail';


export default class FromBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            height:0,
            show:false
        };
    }

    componentDidMount() {
        this.changeWindow();
        this.listener = emitter.addEventListener('changeWindow',(value)=>{  // 添加监听
            this.changeWindow();
        });
    }
    componentWillUnmount(){
    }
    // 窗口变化大小改变表单高度
    changeWindow(){
        this.setState({
            height:document.body.clientHeight
        });
    }
    // 关闭表单
    closeFrom(){
        
    }
    // 创建表单
    renderFrom(){  // 0：发布航线表单，1：发布运力表单，2：查看公司账户-提现/充值详情, 4:测算记录
        switch (this.props.fromType){
            case 0:
                return  <AirLineRelease
                    bianjiAgain={this.props.fromMes.transmit.bianjiAgain ? this.props.fromMes.transmit : false}
                    caogaoxiang={this.props.fromMes.transmit.caogaoxiang ? this.props.fromMes.transmit : false}
                    chongxinshangjia={this.props.fromMes.transmit.chongxinshangjia ? this.props.fromMes.transmit : false}/>;
                break;
            case 1:
                return  <CapacityRelease
                    // bianjiAgain={this.props.fromMes.transmit.bianjiAgain ? this.props.fromMes.transmit : false}
                    bianjiAgain={this.props.fromMes.transmit}
                    caogaoxiang={this.props.fromMes.transmit.caogaoxiang ? this.props.fromMes.transmit : false}
                    chongxinshangjia={this.props.fromMes.transmit.chongxinshangjia ? this.props.fromMes.transmit : false}
                />;
                break;
            case 2:
                return  <AccountOperation fromMes={this.props.fromMes}/>;
                break;
            case 3:
                return <ItemDetailForm fromMes={this.props.fromMes}/>;
                break;
            case 4:
                return <MeasuringRecord fromMes={this.props.fromMes}/>;
                break;
            case 5:
                return <MyOrderForm fromMes={this.props.fromMes}/>;
                break;
            case 6:
                return <Financing
                            fromMes={this.props.fromMes?this.props.fromMes:{type:true}}
                        />
            // case 4:
            //     return <AirportMarketDetail/>;
            //     break;

        }
    }
    render(){
        let showBox = this.props.openFrom;
        return(
            <CSSTransition
                timeout={500}
                classNames="formDetails"
                in={showBox}
                unmountOnExit
            >
                <div className={style["form-box"]} style={{height:`${this.state.height - (document.body.clientWidth <= 1366 ? 50 : 65)}px`}}>
                    {this.renderFrom()}
                </div>
            </CSSTransition>
        )
    }
}