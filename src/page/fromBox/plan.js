import React, { Component } from 'react';
import emitter from '../../utils/events';
import { store } from './../../store/index';

import CapacityPlan from './capacityPlan.js';
import FlightScheme from './flightScheme.js';

export default class DetailTopInfo extends Component {
    constructor(props) {
        super(props);
    }
    planFun = () => {
        let { role, isMarket, demandPlans } = this.props || {};
        if (demandPlans) {
            if ((role === '1' && isMarket) || (role === '0' && !isMarket)) {//机场视角
                return <CapacityPlan scheme={demandPlans} />;
            } else if ((role === '1' && !isMarket) || (role === '0' && isMarket)) {//航司视角
                return <FlightScheme scheme={demandPlans} />;
            } else {
                return '';
            }
        }
    }
    render() {
        return (
            <div>
                {this.planFun()}
            </div>
        )
    }
}