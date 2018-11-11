import React, {Component} from 'react';
import styles from '../../../static/css/fromBox/accountOperation/withdrawFlow.scss'

export default class WithdrawFlow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            sureAShow: false,
            sureBShow: false,
            sureCShow: false,
            unsureAShow: false,
            unsureBShow: false,
            unsureCShow: false,
            unclorAShow: false,
            unclorBShow: false,
        };
    }
    show() {
        // 代码0、1、2对应的情况
        if(this.state.current == 0) {
            this.setState({
                sureAShow: true,
                sureBShow: false,
                sureCShow: false,
                unsureAShow: false,
                unsureBShow: true,
                unsureCShow: true,
                unclorAShow: true,
                unclorBShow: true,
            })
        }if(this.state.current == 1) {
            this.setState({
                sureAShow: true,
                sureBShow: true,
                sureCShow: false,
                unsureAShow: false,
                unsureBShow: false,
                unsureCShow: true,
                unclorAShow: false,
                unclorBShow: true,
            })
        }if(this.state.current == 2) {
            this.setState({
                sureAShow: true,
                sureBShow: true,
                sureCShow: true,
                unsureAShow: false,
                unsureBShow: false,
                unsureCShow: false,
                unclorAShow: false,
                unclorBShow: false,
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState(
            {
                current: nextProps.current
            },() => {
            this.show();
        })
    }
    render() {
        return (
            <div className={styles['wf-container']}>
                <div className={styles['wf-top']}>
                    <div className={styles['color']}>
                        {this.state.sureAShow && <div className={`${styles['sure']} ${styles['sure-a']} iconfont`}>&#xe6cc;</div>}
                        {this.state.sureBShow && <div className={`${styles['sure']} ${styles['sure-b']} iconfont`}>&#xe6cc;</div>}
                        {this.state.sureCShow && <div className={`${styles['sure']} ${styles['sure-c']} iconfont`}>&#xe6cc;</div>}
                        {this.state.unsureAShow && <div className={`${styles['unsure']} ${styles['unsure-a']}`}></div>}
                        {this.state.unsureBShow && <div className={`${styles['unsure']} ${styles['unsure-b']}`}></div>}
                        {this.state.unsureCShow && <div className={`${styles['unsure']} ${styles['unsure-c']}`}></div>}
                        {this.state.unclorAShow && <div className={`${styles['unclor']} ${styles['unclor-a']}`}></div>}
                        {this.state.unclorBShow && <div className={`${styles['unclor']} ${styles['unclor-b']}`}></div>}
                    </div>
                </div>
                <div className={styles['wf-bottom']}>
                    <div className={styles['text']}>
                        <span>发起申请</span>
                        <span>财务审核</span>
                        <span>提现成功</span>
                    </div>
                </div>
            </div>
        )
    }
}
