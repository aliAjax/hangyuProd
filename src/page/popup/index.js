import React, { Component } from 'react'

import style from './../../static/css/popup/popup.scss'
import {
    CSSTransition,
} from 'react-transition-group';
import emitter from "../../utils/events";
import EditCapacityRelease from './editCapacityRelease';
import EditAirLineRelease from './editAirLineRelease';
// import ChooseAirlineRelease from './chooseAirlineRelease';
import OutOfStock from './outOfStock';
import Information from './information';


export default class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    // 关闭弹出层 type为0即可
    handleClick = () => {
        let o = {
            popupType: 0,
            popupMes: '',
        }
        emitter.emit('openPopup', o);
    }
    // 创建表单
    renderFrom() {
        let popup = null;
        switch (this.props.popupType) {
            case 0:
                popup;
                break;
            case 1:
                popup = <EditAirLineRelease popupMes={this.props.popupMes} />;
                break;
            case 2:
                popup = <EditCapacityRelease popupMes={this.props.popupMes} />;
                break;
            // case 3:
            //     popup = <ChooseAirlineRelease popupMes={this.props.popupMes} />;
            //     break;
            case 4:
                popup = <OutOfStock popupMes={this.props.popupMes} />;
                break;
            case 5:
                popup = <Information popupMes={this.props.popupMes} />
            default:
                popup;
        }
        if (popup) {
            return (
                <div className={style['popup-con']}>
                    {/*<button onClick={this.handleClick}>关闭</button>*/}
                    {popup}
                </div>
            )
        } else {
            return '';
        }

    }
    render() {
        return this.renderFrom();
    }
}