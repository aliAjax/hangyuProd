// author:wangli time:2018-07-05 content:工具-滚动条组件
import React,{Component,Fragment} from "react";
import style from "../../static/css/scrollBar/scrollBar.scss";

export default class ScrollBar extends Component{
    constructor(props){
        super(props);
        this.state={
            chooseNum:"",//选中的字母
            scrollList:[],//右侧滚动条数据
        }
    };

    componentWillMount(){
        let { scrollList = [] }=this.props;
        this.setState({
            scrollList
        })
    };

    //选中字母滚动页面事件
    clickEvent(data){//data:选中的字母,例：“A”
        this.setState({
            chooseNum:data
        });
        this.props.chooseEvent(data);
    }

    render(){
        let liStyle=style['li'];
        let {styleJson={}}=this.props;
        return (
            <div className={style['box']} style={styleJson}>
                <ul>
                    {
                        this.state.scrollList.map((item,index)=>{//遍历数组渲染组件
                            if(item==this.state.chooseNum){
                                liStyle=style['liChoose']
                            }else {
                                liStyle=style['li']
                            };
                            return <li key={index} title={item} className={liStyle} onClick={()=>this.clickEvent(item)}><span className={style['disc']}></span>{item}</li>
                        })
                    }
                </ul>
            </div>
        )
    }
}