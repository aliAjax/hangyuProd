import React, {Component} from 'react';
import styles from '../../static/css/components/saveOrNot.scss'

export default class EditOrNot extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    saveFn() {
        let item = this.props.data.item;
        let index = this.props.data.index;
        this.props.save(item, index);
    }
    closeFn() {
        this.props.cancel();
    }
    render() {
        return (
            <div className={styles['saveWrapper']}>
                <div className={styles['container']}>
                    <div>
                        <div style={{marginBottom: '35px'}}>
                            <div style={{marginBottom: '5px'}}>
                                您已提交过测算申请，修改后需重新测算
                            </div>
                            <div style={{textAlign: 'center'}}>
                                是否修改？
                            </div>
                        </div>
                        <div>
                            当前测算结果可在“个人中心-测算记录”中查看。
                        </div>
                    </div>
                    <div className={styles['buttons']}>
                        <div className={'btn-b'} onClick={this.saveFn.bind(this)}>确认修改</div>
                        <div className={'btn-w'} onClick={this.closeFn.bind(this)}>取消</div>
                    </div>
                </div>
            </div>
        )
    }
}
