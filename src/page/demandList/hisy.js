import React, {Component} from 'react';
import {hot} from 'react-hot-loader';
import styles from '../../static/css/demandList/hisy.scss'

export default class Hisy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
        };
    }
    res(vl) {
        this.props.reshisy(vl);
    }
    clear() {
        this.setState({
            list: []
        });
        localStorage.removeItem('hisyData');
        this.props.clear();
    }
    closeIconClickFn(index, e) {
        e.stopPropagation();
        this.state.list.splice(index, 1);
        let hisyData = this.state.list;
        if(hisyData != null && hisyData.length != 0) {
            this.setState((prev)=>{
                return ({
                    list: prev.list
                })
            });
        }else {
            this.props.clear();
        }
        localStorage.setItem('hisyData', JSON.stringify(this.state.list));
    }
    componentDidMount() {
        this.setState({
            list: JSON.parse(localStorage.getItem('hisyData'))
        })
    }
    render() {
        return (
            <div className={`${styles['history-list']} ${'scroll'}`} style={this.props.axis}>
                {
                    (this.state.list && this.state.list.length != 0) && this.state.list.map((val, index) => {
                        return (
                            <div onClick={this.res.bind(this, val)} key={index} style={{display: 'flex', justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <span className={styles['icon']}>&#xe646;</span>
                                    {val.name}
                                </div>
                                <span className={`${'iconfont'} ${styles['closeIcon']}`}
                                      onClick={this.closeIconClickFn.bind(this, index)}>&#xe62c;</span>
                            </div>
                        )
                    })
                }
                <div className={styles['clear-history']}>
                    <div onClick={this.clear.bind(this)}>清空历史</div>
                </div>
            </div>
        )
    }
}

