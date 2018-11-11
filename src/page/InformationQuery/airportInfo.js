import React, {Component} from 'react';
import Axios from './../../utils/axiosInterceptors'
import { Spin } from 'antd';
import style from './../../static/css/InformationQuery/airportInfo.scss'

export default class AirportInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            overflowShow:false,
            overflowShow1:false,
            overflowShow01: false,
            overflowShow2:false,
            allowedtoflyspecies: false,
            overflowShow3:false,
            overflowShow03: false,
            overflowShow4:false,
            overflowShow5:false,
            overflowShow6:false,
            overflowShow7:false,
            overflowShow8:false,
            infoData: null,
            dataShow:false,
            step:'1',
            spinShow: true,
            step1Show: false,
            step2Show: false,
            step3Show: false,
            step4Show: false,
            step5Show: false,
            step6Show: false,
        };
    }
    close() {
        this.props.closeDetail();
    }
    scrollTo(i) {  // 1到7
        this.refs.content.scrollTop = this.refs[`step${i}`].offsetTop - 90;
        /*this.setState({
            step: i,
        })*/
    }
    onScroll() {
        let content = this.refs.content.scrollTop;
        let step = '';
        for(let i = 1; i < 8; i++) {
            this.refs[`step${i}`].removeAttribute('active');
            if(content < this.refs[`step${2}`].offsetTop - 90) {
                step = 1;
                // this.refs[`step${1}`].setAttribute('class', 'active');
            }else if(content >= this.refs[`step${7}`].offsetTop - 90) {
                // this.refs[`step${7}`].setAttribute('class', 'active');
                step = 7;
            }else if((content >= this.refs[`step${i}`].offsetTop - 90) && (content < this.refs[`step${i + 1}`].offsetTop - 90)) {
                // this.refs[`step${i}`].setAttribute('class', 'active');
                step = i;
            }
        }
        this.setState({
            step,
        })
    }
    getData(){  // 获取数据
        Axios({
            method: 'post',
            url: '/loadAirportInfomation',
            params: {
                iata: this.props.myData.icao
            },
            dataType:'json',
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        }).then((response) => {
            let dataShow = true;
            let step1Show = false,
                step2Show = false,
                step3Show = false,
                step4Show = false,
                step5Show = false,
                step6Show = false;
            let infoData = null;
            if(response.data.opResult == "0") {
                let obj = response.data.obj;
                dataShow = true;
                infoData = response.data.obj;
                if(!obj['airportLocation']) {
                    step1Show = false;
                }else {
                    step1Show = true;
                }
                if(!obj['groundServices']) {
                    step2Show = false;
                }else {
                    step2Show = true;
                }
                if(!obj['rescue']) {
                    step3Show = false;
                }else {
                    step3Show = true;
                }
                if(!obj['apronTaxiway']) {
                    step4Show = false;
                }else {
                    step4Show = true;
                }
                if(!obj['physical']) {
                    step5Show = false;
                    step6Show = false;
                }else {
                    step5Show = true;
                    step6Show = true;
                }
            }else {
                dataShow = false;
                infoData = null;
            }
            this.setState({
                infoData,
                step1Show,
                step2Show,
                step3Show,
                step4Show,
                step5Show,
                step6Show,
                dataShow,
                spinShow: false,
            }, ()=>{
                if(this.state.dataShow) {
                    this.refs.content.addEventListener('scroll', this.onScroll.bind(this));
                }
            });
        })
    }
    componentDidMount() {
        this.getData();
    }
    componentWillUnmount() {
        if(this.state.dataShow) {
            this.refs.content.removeEventListener('scroll', this.onScroll.bind(this));
        }
    }
    render() {
        return (
            <div className={style['info-wrapper']}>
                <div className={style['airport-info']}>
                    <div className={style['hide-box']}></div>
                    <div className={style['top']}>
                        <div className={style['name']}>{this.props.myData.airlnCd} {this.props.myData.icao}/{this.props.myData.iata}</div>
                        <div className={style['icon']} onClick={this.close.bind(this)}><span className={`iconfont ${style['iconfont']}`}>&#xe62c;</span></div>
                    </div>
                    {
                        this.state.spinShow && <Spin size="large" style={{width: '100%', zIndex: 100}} />
                    }
                    {
                        (this.state.dataShow && this.state.infoData) ? (<div className={style['content']} ref={'content'}>
                            <div className={style['detail']}>
                                {
                                    <div className={style['box']} ref="step1">
                                        <div className={style['box-til']}><span className={`iconfont ${style['iconfont']}`}>&#xe627;</span>基本信息</div>
                                        {
                                            this.state.step1Show ? (<ul className={style['box-item']}>
                                                {/*<li>
                                                    <div>机场基准点坐标及其在机场的位置</div>
                                                    <div onMouseOver={()=>{this.setState({overflowShow: true})}} onMouseOut={()=>{this.setState({overflowShow: false})}} className={style['over-flow']}>{this.state.infoData.airportLocation.airportcoordinatesorattheairport||'-'}</div>
                                                    <div className={`${style['list-wrapper']} ${!this.state.overflowShow ? style['display-none'] : ''}`} onMouseOver={()=>{this.setState({overflowShow: true})}} onMouseOut={()=>{this.setState({overflowShow: false})}}>{this.state.infoData.airportLocation.airportcoordinatesorattheairport||'-'}</div>
                                                </li>
                                                <li>
                                                    <div>与城市的位置关系</div>
                                                    <div onMouseOver={()=>{this.setState({overflowShow1: true})}} onMouseOut={()=>{this.setState({overflowShow1: false})}} className={style['over-flow']}>{this.state.infoData.airportLocation.citylocation||'-'}</div>
                                                    <div className={`${style['list-wrapper']} ${!this.state.overflowShow1 ? style['display-none'] : ''}`} onMouseOver={()=>{this.setState({overflowShow1: true})}} onMouseOut={()=>{this.setState({overflowShow1: false})}}>{this.state.infoData.airportLocation.citylocation||'-'}</div>
                                                </li>*/}
                                                <li>
                                                    <div>机场标高/基准温度</div>
                                                    <div onMouseOver={()=>{this.setState({overflowShow01: true})}} onMouseOut={()=>{this.setState({overflowShow01: false})}} className={style['over-flow']}>{this.state.infoData.airportLocation.airportelevationorreferencetemperature||'-'}</div>
                                                    <div className={`${style['list-wrapper']} ${!this.state.overflowShow01 ? style['display-none'] : ''}`} onMouseOver={()=>{this.setState({overflowShow01: true})}} onMouseOut={()=>{this.setState({overflowShow01: false})}}>{this.state.infoData.airportLocation.airportelevationorreferencetemperature||'-'}</div>
                                                </li>
                                                <li>
                                                    <div>机场标高位置/高程异常</div>
                                                    <div>{this.state.infoData.airportLocation.airportelevationorheightanomaly||'-'}</div>
                                                </li>
                                                <li>
                                                    <div>磁差/年变率</div>
                                                    <div>{this.state.infoData.airportLocation.variationorannualvariationrate||'-'}</div>
                                                </li>
                                                <li>
                                                    <div>机场开放时间</div>
                                                    <div>{this.state.infoData.airportLocation.openinghoursattheairport||'-'}</div>
                                                </li>
                                                <li>
                                                    <div>允许飞行种类</div>
                                                    <div onMouseOver={()=>{this.setState({overflowShow02: true})}} onMouseOut={()=>{this.setState({overflowShow02: false})}} className={style['over-flow']}>{this.state.infoData.airportLocation.allowedtoflyspecies||'-'}</div>
                                                    <div className={`${style['list-wrapper']} ${!this.state.overflowShow02 ? style['display-none'] : ''}`} onMouseOver={()=>{this.setState({overflowShow02: true})}} onMouseOut={()=>{this.setState({overflowShow02: false})}}>{this.state.infoData.airportLocation.allowedtoflyspecies||'-'}</div>
                                                </li>
                                                <li>
                                                    <div>机场性质/飞行区指标</div>
                                                    <div onMouseOver={()=>{this.setState({overflowShow2: true})}} onMouseOut={()=>{this.setState({overflowShow2: false})}} className={style['over-flow']}>{this.state.infoData.airportLocation.natureoftheairportorairfieldindicators||'-'}</div>
                                                    <div className={`${style['list-wrapper']} ${!this.state.overflowShow2 ? style['display-none'] : ''}`} onMouseOver={()=>{this.setState({overflowShow2: true})}} onMouseOut={()=>{this.setState({overflowShow2: false})}}>{this.state.infoData.airportLocation.natureoftheairportorairfieldindicators||'-'}</div>
                                                </li>
                                                <li className={style['li-note']}>
                                                    <div>备注</div>
                                                    <div>{this.state.infoData.airportLocation.note||'-'}</div>
                                                </li>
                                                <li className={style['li-note']}>
                                                    <div>机场管理部门、地址、电话、地址</div>
                                                    <div className={style['over-oneline']}>{this.state.infoData.airportLocation.airpormanagementdepartmentinfo||'-'}</div>
                                                </li>
                                            </ul>) : <div style={{color: 'red', textAlign: 'center', lineHeight: '67px'}}>暂无数据！</div>
                                        }
                                    </div>
                                }

                                {
                                    <div className={style['box']} ref="step2">
                                        <div className={style['box-til']}><span className={`iconfont ${style['iconfont']}`}>&#xe625;</span>地勤服务</div>
                                        {
                                            this.state.step2Show ? (<ul className={style['box-item']}>
                                                <li>
                                                    <div>货物装卸设施</div>
                                                    <div onMouseOver={()=>{this.setState({overflowShow3: true})}} onMouseOut={()=>{this.setState({overflowShow3: false})}} className={style['over-flow']}>{this.state.infoData.groundServices.cargohandlingfacilities||'-'}</div>
                                                    <div className={`${style['list-wrapper']} ${!this.state.overflowShow3 ? style['display-none'] : ''}`} onMouseOver={()=>{this.setState({overflowShow3: true})}} onMouseOut={()=>{this.setState({overflowShow3: false})}}>{this.state.infoData.groundServices.cargohandlingfacilities||'-'}</div>
                                                </li>
                                                <li>
                                                    <div>燃油、滑油牌号</div>
                                                    <div onMouseOver={()=>{this.setState({overflowShow03: true})}} onMouseOut={()=>{this.setState({overflowShow03: false})}} className={style['over-flow']}>{this.state.infoData.groundServices.thefueloroilbrand||'-'}</div>
                                                    <div className={`${style['list-wrapper']} ${!this.state.overflowShow03 ? style['display-none'] : ''}`} onMouseOver={()=>{this.setState({overflowShow03: true})}} onMouseOut={()=>{this.setState({overflowShow03: false})}}>{this.state.infoData.groundServices.thefueloroilbrand||'-'}</div>
                                                </li>
                                                <li>
                                                    <div>加油设施/能力</div>
                                                    <div onMouseOver={()=>{this.setState({overflowShow4: true})}} onMouseOut={()=>{this.setState({overflowShow4: false})}} className={style['over-flow']}>{this.state.infoData.groundServices.refuelingfacilitiesorability||'-'}</div>
                                                    <div className={`${style['list-wrapper']} ${!this.state.overflowShow4 ? style['display-none'] : ''}`} onMouseOver={()=>{this.setState({overflowShow4: true})}} onMouseOut={()=>{this.setState({overflowShow4: false})}}>{this.state.infoData.groundServices.refuelingfacilitiesorability||'-'}</div>
                                                </li>
                                                <li>
                                                    <div>除冰设施</div>
                                                    <div  onMouseOver={()=>{this.setState({overflowShow7: true})}} onMouseOut={()=>{this.setState({overflowShow7: false})}} className={style['over-flow']}>{this.state.infoData.groundServices.deicingfacilities||'-'}</div>
                                                    <div className={`${style['list-wrapper']} ${!this.state.overflowShow7 ? style['display-none'] : ''}`} onMouseOver={()=>{this.setState({overflowShow7: true})}} onMouseOut={()=>{this.setState({overflowShow7: false})}}>{this.state.infoData.groundServices.deicingfacilities||'-'}</div>
                                                </li>
                                                <li>
                                                    <div>过站航空器机库</div>
                                                    <div onMouseOver={()=>{this.setState({overflowShow6: true})}} onMouseOut={()=>{this.setState({overflowShow6: false})}} className={style['over-flow']}>{this.state.infoData.groundServices.standingaircrafthangar||'-'}</div>
                                                    <div className={`${style['list-wrapper']} ${!this.state.overflowShow6 ? style['display-none'] : ''}`} onMouseOver={()=>{this.setState({overflowShow6: true})}} onMouseOut={()=>{this.setState({overflowShow6: false})}}>{this.state.infoData.groundServices.standingaircrafthangar||'-'}</div>
                                                </li>
                                                <li>
                                                    <div>过站航空器维修设施</div>
                                                    <div onMouseOver={()=>{this.setState({overflowShow8: true})}} onMouseOut={()=>{this.setState({overflowShow8: false})}} className={style['over-flow']}>{this.state.infoData.groundServices.inaircraftmaintenancefacilities||'-'}</div>
                                                    <div className={`${style['list-wrapper']} ${!this.state.overflowShow8 ? style['display-none'] : ''}`} onMouseOver={()=>{this.setState({overflowShow8: true})}} onMouseOut={()=>{this.setState({overflowShow8: false})}}>{this.state.infoData.groundServices.inaircraftmaintenancefacilities||'-'}</div>
                                                </li>
                                                <li className={style['li-note']}>
                                                    <div>备注</div>
                                                    <div>{this.state.infoData.groundServices.note||'-'}</div>
                                                </li>
                                            </ul>) : <div style={{color: 'red', textAlign: 'center', lineHeight: '67px'}}>暂无数据！</div>
                                        }
                                    </div>
                                }

                                {
                                    <div className={style['box']} ref="step3">
                                        <div className={style['box-til']}><span className={`iconfont ${style['iconfont']}`}>&#xe629;</span>消防救援</div>
                                        {
                                            this.state.step3Show ? (<ul className={style['box-item']}>
                                                <li>
                                                    <div>机场消防等级</div>
                                                    <div>{this.state.infoData.rescue.airportfirerating||'-'}</div>
                                                </li>
                                                <li>
                                                    <div>搬移受损航空器的能力</div>
                                                    <div onMouseOver={()=>{this.setState({overflowShow5: true})}} onMouseOut={()=>{this.setState({overflowShow5: false})}} className={style['over-flow']}>{this.state.infoData.rescue.abilitytomovethedamagedaircraft||'-'}</div>
                                                    <div className={`${style['list-wrapper']} ${!this.state.overflowShow5 ? style['display-none'] : ''}`} onMouseOver={()=>{this.setState({overflowShow5: true})}} onMouseOut={()=>{this.setState({overflowShow5: false})}}>{this.state.infoData.rescue.abilitytomovethedamagedaircraft||'-'}</div>
                                                </li>
                                                <li className={style['li-note']}>
                                                    <div>救援设备</div>
                                                    <div className={style['over-oneline']}>{this.state.infoData.rescue.rescuefacilities||'-'}</div>
                                                </li>
                                                <li className={style['li-note']}>
                                                    <div>备注</div>
                                                    <div>{this.state.infoData.rescue.note||'-'}</div>
                                                </li>
                                            </ul>) : <div style={{color: 'red', textAlign: 'center', lineHeight: '67px'}}>暂无数据！</div>
                                        }
                                    </div>
                                }

                                {
                                    <div className={style['box']} ref="step4">
                                        <div className={style['box-til']}><span className={`iconfont ${style['iconfont']}`}>&#xe657;</span>停机坪、滑行道及矫正位置数据</div>
                                        {
                                            this.state.step4Show ? (<ul className={style['box-item']}>
                                                <li>
                                                    <div>高度表校正点的位置及其标高</div>
                                                    <div>{this.state.infoData.apronTaxiway.altimetercalibrationpointpositionandelevation||'-'}</div>
                                                </li>
                                                <li>
                                                    <div>VOR/INS校正点</div>
                                                    <div>{this.state.infoData.apronTaxiway.vororinscalibrationpoints||'-'}</div>
                                                </li>
                                                <li className={style['li-note']}>
                                                    <div>停机坪道面和强度</div>
                                                    <div className={style['over-oneline']}>{this.state.infoData.apronTaxiway.airfieldpavementandintensity||'-'}</div>
                                                </li>
                                                <li className={style['li-note']}>
                                                    <div>滑行道宽度、道面和强度</div>
                                                    <div className={style['over-oneline']}>{this.state.infoData.apronTaxiway.taxiwaywidthpavementandstrength||'-'}</div>
                                                </li>
                                                <li className={style['li-note']}>
                                                    <div>备注</div>
                                                    <div>{this.state.infoData.apronTaxiway.note||'-'}</div>
                                                </li>
                                            </ul>) : <div style={{color: 'red', textAlign: 'center', lineHeight: '67px'}}>暂无数据！</div>
                                        }
                                    </div>
                                }

                                {
                                    <div className={style['box']} ref="step5">
                                        <div className={style['box-til']}><span className={`iconfont ${style['iconfont']}`}>&#xe626;</span>跑道特征</div>
                                        {
                                            this.state.step5Show ? (<div>
                                                <div className={style['table']}>
                                                    <ul className={style['t-head']}>
                                                        <li>跑道编号</li>
                                                        <li>真方位和磁方位</li>
                                                        <li>跑道长宽(m)</li>
                                                        <li>跑道强度(PCN) 跑道/停止面道面</li>
                                                        <li>跑道入口坐标及大地水准面波幅(m/f)</li>
                                                        <li>跑道入口标高和精密进近跑道接地带最高标高(m/f)</li>
                                                        <li>跑道坡度</li>
                                                        <li>停止道长宽(m)</li>
                                                        <li>净空道长宽(m)</li>
                                                        <li>升降道长宽(m)</li>
                                                        <li>跑道端安全区长宽(m)</li>
                                                        <li>无障碍物区(m)</li>
                                                    </ul>
                                                    {
                                                        this.state.infoData.physical.map((item, index) => {
                                                            return (
                                                                <ul className={style['c-list']} key={index}>
                                                                    <li>{item.runno||'-'}</li>
                                                                    <li>{item.orientation||'-'}</li>
                                                                    <li>{item.trackwidth||'-'}</li>
                                                                    <li>{item.runwayintensity||'-'}</li>
                                                                    <li>{item.runwayentrance||'-'}</li>
                                                                    <li>{item.runwayelevation||'-'}</li>
                                                                    <li>{item.runwayslope||'-'}</li>
                                                                    <li>{item.runwaystoplongwidth||'-'}</li>
                                                                    <li>{item.runwaynetlongwide||'-'}</li>
                                                                    <li>{item.runwayliftingbeltwidth||'-'}</li>
                                                                    <li>{item.runwayendofrunwaysafetyaspect||'-'}</li>
                                                                    <li>{item.runwaynoobstaclearea||'-'}</li>
                                                                </ul>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <ul className={style['box-item']}>
                                                    <li className={style['li-note']}>
                                                        <div>备注</div>
                                                        {
                                                            this.state.infoData.runwayRek
                                                                ? <div>{this.state.infoData.runwayRek.physicalcharacteristicsofrunwayrek||'-'}</div>
                                                                : <div>-</div>
                                                        }

                                                    </li>
                                                    <li className={style['li-note']}>
                                                        <div>跑道坡度</div>
                                                        <div>{''||'-'}</div>
                                                    </li>
                                                </ul>
                                                <div className={style['table']}>
                                                    <ul className={style['t-head']}>
                                                        <li>跑道编号</li>
                                                        <li>可用起飞滑道距离(m)</li>
                                                        <li>可用起飞距离(m)</li>
                                                        <li>可用加速停止距离(m)</li>
                                                        <li>可用着陆距离(m)</li>
                                                        <li>备注</li>
                                                    </ul>
                                                    {
                                                        this.state.infoData.physical.map((item, index) => {
                                                            return (
                                                                <ul className={style['c-list']} key={index}>
                                                                    <li>{item.runno||'-'}</li>
                                                                    <li>{item.runwayavailable||'-'}</li>
                                                                    <li>{item.runwaytakedistance||'-'}</li>
                                                                    <li>{item.runwaystoppingdistance||'-'}</li>
                                                                    <li>{item.runwaylandingdistance||'-'}</li>
                                                                    <li>{item.rek||'-'}</li>
                                                                </ul>
                                                            )
                                                        })
                                                    }

                                                </div>
                                            </div>) : <div style={{color: 'red', textAlign: 'center', lineHeight: '67px'}}>暂无数据！</div>
                                        }
                                    </div>
                                }

                                {
                                    <div className={style['box']} ref="step6">
                                        <div className={style['box-til']}><span className={`iconfont ${style['iconfont']}`}>&#xe6ef;</span>进近灯光</div>
                                        {
                                            this.state.step6Show ? (<div>
                                                <div className={style['table']}>
                                                    <ul className={style['t-head']}>
                                                        <li>跑道编号</li>
                                                        <li>进近灯光类型<br/>有否SFL<br/>长度<br/>强度</li>
                                                        <li>入口灯颜色<br/>翼排灯</li>
                                                        <li>坡度灯类型<br/>位置<br/>仰角<br/>MEHT</li>
                                                        <li>接地带灯长度</li>
                                                        <li>跑道中线灯长度、间隔、颜色、强度</li>
                                                        <li>跑道边灯长度、间隔、颜色、强度</li>
                                                        <li>跑道末端灯颜色</li>
                                                        <li>停止道灯长度<br/>颜色</li>
                                                    </ul>
                                                    {
                                                        this.state.infoData.physical.map((item, index) => {
                                                            return (
                                                                <ul className={style['c-list']} key={index}>
                                                                    <li>{item.runno||'-'}</li>
                                                                    <li>{item.lengthintensity||'-'}</li>
                                                                    <li>{item.lightcolor||'-'}</li>
                                                                    <li>{item.lamptype||'-'}</li>
                                                                    <li>{item.engthstriplights||'-'}</li>
                                                                    <li>{item.runwaycenterlinelightslength||'-'}</li>
                                                                    <li>{item.runwayedgelengthlamp||'-'}</li>
                                                                    <li>{item.runwayat||'-'}</li>
                                                                    <li>{item.stoplamplength||'-'}</li>
                                                                </ul>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <ul className={style['box-item']}>
                                                    <li className={style['li-note']}>
                                                        <div>备注</div>
                                                        {
                                                            this.state.infoData.intensityRek
                                                                ? <div>{this.state.infoData.intensityRek.lengthintensityrek||'-'}</div>
                                                                : <div>-</div>
                                                        }
                                                    </li>
                                                </ul>
                                            </div>) : <div style={{color: 'red', textAlign: 'center', lineHeight: '67px'}}>暂无数据！</div>
                                        }
                                    </div>
                                }

                                <div className={style['box']} ref="step7" style={{marginBottom: '150px'}}>
                                    <div className={style['box-til']}><span className={`iconfont ${style['iconfont']}`}>&#xe669;</span>飞行程序</div>
                                    <ul className={style['box-item']}>
                                        <li className={style['li-note']}>
                                            <div>总则</div>
                                            <div>-</div>
                                        </li>
                                        <li className={style['li-note']}>
                                            <div>起落航线</div>
                                            <div>-</div>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                            <div className={style['sidebar']}>
                                <ul className={style['sidebar-list']}>
                                    <li className={this.state.step == 1 ? style['active'] : ''} onClick={this.scrollTo.bind(this, '1')}>
                                        <span className={`${style['point']} ${this.state.step =='1' ? style['display-none'] : ''}`}></span>
                                        <span className={`iconfont ${style['iconfont']}`}>&#xe627;</span>基本信息
                                    </li>
                                    <li className={this.state.step == 2 ? style['active'] : ''} onClick={this.scrollTo.bind(this, '2')}>
                                        <span className={`${style['point']} ${this.state.step =='2' ? style['display-none'] : ''}`}></span>
                                        <span className={`iconfont ${style['iconfont']}`}>&#xe625;</span>地勤服务
                                    </li>
                                    <li className={this.state.step == 3 ? style['active'] : ''} onClick={this.scrollTo.bind(this, '3')}>
                                        <span className={`${style['point']} ${this.state.step =='3' ? style['display-none'] : ''}`}></span>
                                        <span className={`iconfont ${style['iconfont']}`}>&#xe629;</span>消防救援
                                    </li>
                                    <li className={this.state.step == 4 ? style['active'] : ''} style={{width: '210px'}} onClick={this.scrollTo.bind(this, '4')}>
                                        <span className={`${style['point']} ${this.state.step =='4' ? style['display-none'] : ''}`}></span>
                                        <span className="iconfont">&#xe657;</span>停机坪、滑行道及矫正位置数据
                                    </li>
                                    <li className={this.state.step == 5 ? style['active'] : ''} onClick={this.scrollTo.bind(this, '5')}>
                                        <span className={`${style['point']} ${this.state.step =='5' ? style['display-none'] : ''}`}></span>
                                        <span className={`iconfont ${style['iconfont']}`}>&#xe626;</span>跑道特征
                                    </li>
                                    <li className={this.state.step == 6 ? style['active'] : ''} onClick={this.scrollTo.bind(this, '6')}>
                                        <span className={`${style['point']} ${this.state.step =='6' ? style['display-none'] : ''}`}></span>
                                        <span className={`iconfont ${style['iconfont']}`}>&#xe6ef;</span>进近灯光
                                    </li>
                                    <li className={this.state.step == 7 ? style['active'] : ''} onClick={this.scrollTo.bind(this, '7')}>
                                        <span className={`${style['point']} ${this.state.step =='7' ? style['display-none'] : ''}`}></span>
                                        <span className={`iconfont ${style['iconfont']}`}>&#xe669;</span>飞行程序
                                    </li>
                                </ul>
                            </div>
                        </div>) : <div style={{color: 'red', textAlign: 'center', lineHeight: '67px'}}>暂无数据！</div>
                    }
                </div>
            </div>
        )
    }
}
