import React, {Component} from 'react';
import styles from '../../static/css/components/saveOrNot.scss'

export default class SaveOrNot extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    saveFn() {
        this.props.save();
    }
    closeFn() {
        this.props.cancel();
    }
    render() {
        return (
            <div className={styles['saveWrapper']}>
                <div className={styles['container']}>
                    <div>
                        <div>
                            {
                                this.props.daizhifu ? '是否保存数据？' : '是否保存为草稿？'
                            }
                        </div>
                        <div>
                            {
                                this.props.daizhifu ? '保存后可在下次点击查看' : '存为草稿后，可在个人中心-草稿箱查看'
                            }
                        </div>
                    </div>
                    <div className={styles['buttons']}>
                        <div className={'btn-b'} onClick={this.saveFn.bind(this)}>
                            {
                                this.props.daizhifu ? '保存数据' : '存为草稿'
                            }
                        </div>
                        <div className={'btn-w'} onClick={this.closeFn.bind(this)}>取消</div>
                    </div>
                </div>
            </div>
        )
    }
}
