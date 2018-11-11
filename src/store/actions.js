
import * as types from "./types";
import {assemblyAction as an} from "./../utils/assemblyAction";

function mapDispatchToProps(dispatch){
    return{
        onButtonClick:(data)=>dispatch(an(types.CHANGE_TEXT,data)),
        onChangeText:(data)=>dispatch(an(types.BUTTON_CLICK,data)),
        onButtonClickChilid:(data)=>dispatch(an(types.CLICKCHILID,data))
    }
}

function mapStateToProps(state) {
    return state;
}
//连接组件

export {mapDispatchToProps,mapStateToProps};