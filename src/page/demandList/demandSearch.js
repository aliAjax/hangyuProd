import React, {Component} from 'react';
import emitter from '../../utils/events';
import AirportSearchHis from '../../components/search/airportSearchHis'
import Hisy from './hisy'
import styles from '../../static/css/demandList/demandSearch.scss'

export default class DemandSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            searchTextBus: '',
            showHisy: false,  // 历史记录是否显示
            showAirportSearchHis: false,  // 下拉搜索框是否显示
            data:"",//传给父组件的机场信息
            coverDivShow: false,
        };
    }
    coverDivFn() {
        this.setState({
            coverDivShow: false,
        }, ()=>{
            this.refs.searchInput.focus();
        })
    }
    closeIconClickFn() {
        this.setState({
            searchText: '',
            searchTextBus: '',
            data: '',
            showHisy: true,
            coverDivShow: false,
            showAirportSearchHis: false
        }, ()=>{
            this.refs.searchInput.focus();
        });
    }
    // TODO: 输入框改变事件
    searchTextChangeFn(e) {
        let target = e.target;
        let hisyData = JSON.parse(localStorage.getItem('hisyData'));
        this.setState({
            searchText: target.value,
            data:"",
            coverDivShow: false,
        });
        if (target.value == '' && hisyData != null && hisyData.length != 0) {
            this.setState({
                showHisy: true,
                searchText: '',
                searchTextBus: '',
                showAirportSearchHis: false,
            })
        }else {
            if(target.value == '') {
                this.setState({
                    showHisy: false,
                    showAirportSearchHis: false,
                })
            }else {
                this.setState({
                    showHisy: false,
                    showAirportSearchHis: true,
                })
            }
        }
    }
    // TODO: 输入框焦点事件
    inputFocusFn(e) {
        let hisyData = JSON.parse(localStorage.getItem('hisyData'));
        let target = e.target;
        let showHisy = true,
            showAirportSearchHis = false;
        if (target.value == '' && hisyData != null && hisyData.length != 0) {
            showHisy = true;
            showAirportSearchHis = false;
        }else {
            showHisy = false;
            showAirportSearchHis = true;
        }
        this.setState({
            showHisy,
            // showAirportSearchHis,
            coverDivShow: false,
        })
    }
    //TODO: input失焦事件
    inputBlurFn() {
        setTimeout(()=>{
            let coverDivShow = false,
                searchText = '',
                data = '';
            if(this.state.searchTextBus == '' || this.state.searchTextBus == null){
                coverDivShow = false;
                data = '';
            }else {
                searchText = this.state.searchTextBus;
                coverDivShow = true;
                data = this.state.data;
            }
            this.setState({
                data,
                coverDivShow,
                searchText,
            },()=>{
                this.props.resSearchData(this.state.data);  // 向父组件传递数据
            })
        },150)

    }
    // TODO：点击获取搜索组件传来的数据
    airportData(data){
        this.setState({
            searchText: data.name,
            searchTextBus: data.name,
            showAirportSearchHis: false,
            coverDivShow: true,
            data
        });
        this.props.resSearchData(data);  // 向父组件传递数据
    }

    // TODO: 历史组件传来的数据
    reshisyData(data) {
        this.setState({
            searchText: data.name,
            searchTextBus: data.name,
            showHisy: false,
            coverDivShow: true,
            data
        }, ()=>{
            this.props.resSearchData(this.state.data);
        });
    }
    //TODO: 点击“清空历史”，Hisy隐藏
    clear() {
        this.setState({
            showHisy: false
        })
    }

    componentDidMount() {
        this.closeFloatingLayer = emitter.addEventListener('closeFloatingLayer', (message) => {
            // 监听浮沉关闭
            let searchInput = this.refs['searchInput'];
            if(searchInput !== undefined){
                searchInput.blur();
            };
            this.setState({
                showHisy: false,  // 历史记录是否显示
                showAirportSearchHis: false,  // 下拉搜索框是否显示
            })
        });
        this.resSearchData = emitter.addEventListener("resSearchData",(data)=>{
            this.setState({
                searchText: data.airlnCdName,
                searchTextBus: data.airlnCdName,
                coverDivShow: true,
                showHisy: false,
                data:{
                    code:data.iata,
                    id:data.id,
                    name:data.airlnCdName,
                    testCode:data.id,
                    testName:data.airlnCdName,
                    type:0
                }
            });
            this.props.resSearchData({
                code:data.iata,
                id:data.id,
                name:data.airlnCdName,
                testCode:data.id,
                testName:data.airlnCdName,
                type:0
            });  // 向父组件传递数据
        })
    }
    componentWillUnmount() {
        emitter.removeEventListener(this.closeFloatingLayer);
        emitter.removeEventListener(this.resSearchData);
    }
    render() {
        let axis = {
            position: 'absolute',
            top: '32px',
            left: '20px',
            width: '264px',
            maxHeight: '220px',
            overflowY: 'scroll',
            background: 'white',
            fontSize: '1.2rem',
            zIndex: 22,
            boxShadow: '0 2px 11px rgba(85,85,85,0.1)'
        };
        return (
            <div className={styles['search-box']} style={this.props.searchStyle}>
                <div className={styles['icon-box']}>
                    <span className="iconfont">&#xe62e;</span>
                </div>
                <input type="text" maxLength="20" placeholder="搜索"
                       ref="searchInput"
                       value={this.state.searchText}
                       onClick={(e)=>{e.stopPropagation()}}
                       onChange={this.searchTextChangeFn.bind(this)}
                       onFocus={this.inputFocusFn.bind(this)}
                       onBlur={this.inputBlurFn.bind(this)} />
                {
                    this.state.coverDivShow && (<div className={styles['searchBtn']} onClick={this.coverDivFn.bind(this)}>
                        <span style={{textIndent: '1rem'}}>{this.state.searchText}</span>
                        <span className={`${'iconfont'} ${styles['closeIcon']}`}
                              onClick={this.closeIconClickFn.bind(this)}>&#xe62c;</span>
                    </div>)
                }

                {
                    this.state.showAirportSearchHis
                        && <AirportSearchHis axis={axis}
                             resData={this.airportData.bind(this)}
                             searchText={this.state.searchText} />
                }
                {
                    this.state.showHisy
                        && <Hisy axis={axis}
                            reshisy={this.reshisyData.bind(this)}
                            clear={this.clear.bind(this)} />
                }
            </div>
        )
    }
}

