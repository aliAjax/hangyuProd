import React, {Component} from 'react';
import Recharge from './recharge';  // 充值详情
import Withdraw from './withdraw';  // 提现详情

export default class AccountOperation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        };
    }

    componentWillReceiveProps(nextProps) {  // 获取数据
        this.setState({
            data: nextProps.fromMes
        })
    }
    componentDidMount() {
        this.setState({
            data: this.props.fromMes
        });
    }
    render() {
        let data = this.state.data;
        let item;
        if(data.type !== '' || data.type !== null) {
            if(data.type == '02'){
                item = <Withdraw data={data} key={1} />;  // 提现详情显示
            }else{
                item = <Recharge data={data} key={2} />; // 充值详情显示
        }
        }
        return (
            <div>
                { item }
            </div>
        )
    }
}
