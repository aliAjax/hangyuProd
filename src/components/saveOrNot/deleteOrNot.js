import React, {Component} from 'react';
import styles from '../../static/css/components/saveOrNot.scss'
import { Modal } from 'antd';

export default class DeleteOrNot extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
    saveFn() {
        let index = this.props.index;
        let delResponsePlanId = this.props.delResponsePlanId;
        this.props.save(index, delResponsePlanId);
        this.success('删除方案成功！');
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
                            您已提交过测算申请，是否删除？
                        </div>
                        <div>
                            删除后测算结果可在“个人中心-测算记录”中查看。
                        </div>
                    </div>
                    <div className={styles['buttons']}>
                        <div className={'btn-b'} onClick={this.saveFn.bind(this)}>确认删除</div>
                        <div className={'btn-w'} onClick={this.closeFn.bind(this)}>取消</div>
                    </div>
                </div>
            </div>
        )
    }
}
