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
    checkClickFn(vl) {
        store.dispatch(an('FLYGRADE', vl));
        this.forceUpdate();
    }
    render() {
        let items = store.getState().demandList.conditions.flyGrade.va;
        return (
            <div className={styles['fly-list']}>
                {
                    items.map((vl, index) => {
                        return (
                            <div key={index}>
                                {
                                    vl.map((key, i) => {
                                        let checked = key.s ? styles['setBth'] : '';
                                        return (
                                            <div className={`${styles['unchecked']} ${checked}`}
                                                 onClick={this.checkClickFn.bind(this, [vl, i])}
                                                 key={i}
                                            >{key.v}</div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })

                }
            </div>

        )
    }
}

