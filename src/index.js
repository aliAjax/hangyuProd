import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {Route,HashRouter as Router } from 'react-router-dom';
import 'babel-polyfill'

import {store,components} from "./store/index"
import "./static/css/transition.css"
import "./static/css/main.css"

import Volume from "./page/volume"
import './static/css/antd/antd.min.css';
import './static/css/antd/antdCover.css';

//渲染组件
let Volumes = components(Volume);
ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Route path="/" component={Volumes}></Route>
        </Router>
    </Provider>,
    document.getElementById('root')
)
