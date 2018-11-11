import React, {Component} from 'react';
import emitter from "../../../utils/events";
import styles from '../../../static/css/fromBox/accountOperation/recharge.scss'

export default class Recharge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            symbol: '',  // 显示“+”、“-”、“ ”
            warnShow: false,  // 警告是否显示
            title: '意向金',
        };
    }
    closeFormBox() {  // 关闭formBox
        let obj = {};
        obj.openFrom = false;
        obj.fromType = '';
        obj.fromMe = '';
        emitter.emit('openFrom', obj);
    }
    symbolFn() {  // 01-充值、02-提现、0301-冻结(查看意向即发布航线需求)、0302-冻结(响应需求)、0401-解冻(撤回意向)、0402-解冻(需求下架)、0403-解冻(意向落选)、05-转入、06-支付、
                  // 0701-开航测算需求方案支付、0702-开航测算意向方案支付、0801-开航测算需求方案收入、0802-开航测算意向方案收入'
        let type = this.state.data.type;
        let symbol = '';
        let warnShow = false;
        let title = '意向金';
        if(type == '01') {  // 充值完成
            symbol = '+';
            warnShow = false;
            title = '账户金额';
        }else if(type == '0301' || type == '0302') {  // 机场冻结意向金
            symbol = '';
            warnShow = true;
            title = '意向金';
        }else if(type == '0401' || type == '0402' || type == '0403') {  // 机场解冻意向金
            symbol = '';
            warnShow = false;
            title = '意向金';
        }else if(type == '05') {  // 航司收入意向金
            symbol = '+';
            warnShow = false;
            title = '意向金';
        }else if(type == '06') {  // 机场支付意向金
            symbol = '-';
            warnShow = false;
            title = '意向金';
        }else if(type == '0701' || type == '0702') {  // 开航测算支付
            symbol = '-';
            warnShow = false;
            title = '账户金额';
        }else if(type == '0801' || type == '0802') {  // 开航测算收入
            symbol = '+';
            warnShow = false;
            title = '账户金额';
        }
        return {
            symbol,
            warnShow,
            title,
        }
    }
    componentWillReceiveProps(nextProps) {  // 获取数据
        this.setState(() => {
            return {data: nextProps.data}
        });
    }
    componentDidMount() {
        this.setState({
            data: this.props.data
        });
    }
    render() {
        let symbol = this.symbolFn();
        return (
            <div className={styles['plan-wrapper']}>
                <header>
                    <div className={`${styles['top-til']} ${styles['font-gray']}`}>
                        流水详情
                        <span className={'iconfont'} onClick={this.closeFormBox.bind(this)}>&#xe62c;</span>
                    </div>
                    <div className={styles['head-til']}>{this.state.data.discription2}</div>
                    <div className={styles['header-num']}>
                        <div className={styles['top']}>
                            {symbol.title}
                        </div>
                        <div className={styles['bottom']}>
                            <span>{symbol.symbol}</span><span>{this.state.data.number}</span>
                        </div>
                    </div>
                </header>
                <div className={styles['ard-container']}>
                    <div className={styles['ard-item']}>
                        <div className={`${styles['left']} ${styles['font-gray']}`}>创建时间</div>
                        <div className={styles['right']}>{this.state.data.dateComplete}</div>
                    </div>
                    <div className={styles['ard-item']}>
                        <div className={`${styles['left']} ${styles['font-gray']}`}>交易流水号</div>
                        <div className={styles['right']}>{this.state.data.serialNumber}</div>
                    </div>
                </div>
                <div style={{padding: '0 40px'}}>
                    {
                        symbol.warnShow && <span className={styles['warn']}>*意向金将在双方互选方案后支付，或在需求/意向撤回后退回</span>
                    }
                </div>
            </div>
        )
    }
}
