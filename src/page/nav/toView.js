import React , {Component} from 'react';
import emitter from './../../utils/events';
import style from '../../static/css/nav/nav.scss';


export default class ToView extends Component{
    constructor(props){
        super(props);
        this.state = {
            num:''
        }
    }
    componentDidMount(){
        this.changeNum = emitter.addEventListener("changeNum", (num)=> {
            this.setState({
                num
            })
        })
    }
    componentWillUnmount() {
        emitter.removeEventListener(this.changeNum);
    }
    openTime(){
        emitter.emit('openTimeBox',true);
    }
    render(){
        return(
            <div className={style['bar-item']} onClick={this.openTime.bind(this)}>
                <div className={style['item-message']}>
                    <i className={'iconfont'}>&#xe64b;</i>
                    {
                        (this.state.num === '' || this.state.num === 0) ? '' : <div>{this.state.num > 99 ? 99 :this.state.num}</div>
                    }
                </div>
            </div>
        )
    }
}