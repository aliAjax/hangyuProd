
import React,{Component} from 'react';


export default class testPage1 extends Component {
    constructor(props){
        super(props);
        console.log(props)
    }
    componentDidMount() {   // 加载渲染完成

    }
    render(){
        return <div>test1</div>
    }
}

export {testPage1}