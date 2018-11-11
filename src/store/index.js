import { createStore } from 'redux';
import { connect } from 'react-redux';
import reducer from './mutations'
import {mapDispatchToProps,mapStateToProps} from './actions'

let store = createStore(reducer);

function components(template) {
    return connect(mapStateToProps, mapDispatchToProps)(template);
}
export {store,components};