import React, {Component} from 'react';
import {hot} from 'react-hot-loader';
import styles from '../../static/css/demandList/check.scss'
import {store} from '../../store'
import {assemblyAction as an} from "../../utils/assemblyAction";

export default class Check extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    setSubsidyPolicy(index) {
        store.dispatch(an('SUBSIDYPOLICY', index));
        this.forceUpdate();
    }
    render() {
        let items = store.getState().demandList.conditions.subsidyPolicy.va;
        let role = Number(store.getState().role.role);
        return (
            <div className={styles['fly-list']} style={{flexWrap: 'wrap'}}>
                {
                    items.map((vl, index) => {
                        let checked = vl.s ? styles['setBth'] : '';
                        /*if(role === 0) {
                            if(vl.v == '其他') {
                                return false
                            }else {
                                return (
                                    <div key={index}>
                                        {
                                            <div onClick={this.setSubsidyPolicy.bind(this, index)} className={checked}>{vl.v}</div>
                                        }
                                    </div>
                                )
                            }
                        }else {*/
                        return (
                            <div key={index}>
                                {
                                    <div onClick={this.setSubsidyPolicy.bind(this, index)} className={checked}>{vl.v}</div>
                                }
                            </div>
                        )
                        // }
                    })

                }
            </div>

        )
    }
}

