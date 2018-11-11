import React, { Component } from 'react';
import { store } from './../../store/index';
import ApplyMeasuringChen from '../../components/applyMeasuring/applyMeasuringChen'
import style from './../../static/css/from/rsTime.scss';
import Axios from './../../utils/axiosInterceptors'

export default class rsTime extends Component {
	constructor(props) {
		super(props);
		this.state = {
			applyMeasuringData: {},  // 向“申请测算”组件传递的数据
			showApplyMeasuring: false,  // 申请测算组件是否显示
		}
		console.log('运力方案', props.rs);
	}
	closeMeasuringFn(i) {  // 关闭申请测算  1:成功  2：失败
        if(i == 1) {
            this.props.updateDetail();
        }
		this.setState({
			showApplyMeasuring: false,
		})
	}
	measuringFn() {  // 点击“申请测算”
		console.info(this.props.rs);
		Axios({
			method: 'post',
			url: '/selectOnceSailingMeasurePrice',
            /*params:{  // 一起发送的URL参数
                page:1
            },*/
			// data: JSON.stringify(demand),
			dataType: 'json',
			headers: {
				'Content-type': 'application/json;charset=utf-8'
			}
		}).then((response) => {
			if (response.data.opResult == 0) {
				let data = {};
				data.OnceSailingMeasurePrice = response.data.singleSailingMeasurePrice;
				// TODO: 传递的数据
				data.demandId = this.props.rs.demandId;
				data.responsePlanId = this.props.rs.id;
				this.setState({
					applyMeasuringData: data,
					showApplyMeasuring: true
				})

			} else {
				alert('申请测算失败！');
			}
		});
	}
	// 机场简称
	findName = (dpt, pst, arrv) => {
		let airList = store.getState().allAirList;
		let arr = {};
		airList.filter((value) => {
			if (value.iata == dpt) {
				arr.dptNm = value.airlnCd;
			} else if (value.iata == pst) {
				arr.pstNm = value.airlnCd;
			} else if (value.iata == arrv) {
				arr.arrvNm = value.airlnCd;
			}
		})
		return arr;
	}
	calculateEle = () => {
		let { calculationId, calculationRoute, calculationState, responseProgress } = this.props.rs;

		if (!this.props.calculate) {
			return '';
		} else if (calculationState === '0') {
			return <a style={{ 'background': '#8b93ae', color: '#ffffff', cursor: 'default' }}>测算中</a>
		} else if (calculationState === '1') {
			return <a href={`/downloadCalculationsRecord?id=${calculationId}`}>测算完成，点击下载</a>
		} else if (responseProgress == '-1' || responseProgress == '0' || responseProgress == '1' || responseProgress == '8') {
			return <a onClick={this.measuringFn.bind(this)}>申请测算</a>
		} else {
			return '';
		}
	}
	rsFun = () => {
		if (this.props.rs) {
			let { dpt, pst, arrv, dptTime, pstTime, arrvTime, pstBackTime, price } = this.props.rs;
			let { dptNm, pstNm, arrvNm } = this.findName(dpt, pst, arrv);
			let [dptLevel, dptEnter] = dptTime ? dptTime.split(',') : [];
			let [pstLevel, pstEnter] = pstTime ? pstTime.split(',') : [];
			let [pstBackLevel, pstBackEnter] = pstBackTime ? pstBackTime.split(',') : [];
			let [arrvLevel, arrvEnter] = arrvTime ? arrvTime.split(',') : [];
			function airline() {
				if (pst) {
					return (
						<div className={style['multi']}>
							<div>
								<div>{dptNm}</div>
								<div>{dptLevel + `-` + pstEnter}</div>
								<div>{pstNm}</div>
								<div>{pstLevel + '-' + arrvEnter}</div>
								<div>{arrvNm}</div>
							</div>
							<div>
								<div>{arrvNm}</div>
								<div>{arrvLevel + `-` + pstBackEnter}</div>
								<div>{pstNm}</div>
								<div>{pstBackLevel + '-' + dptEnter}</div>
								<div>{dptNm}</div>
							</div>
						</div>
					)
				} else {
					return (
						<div className={style['multi']}>
							<div>
								<div>{dptNm}</div>
								<div>{dptLevel + `-` + arrvEnter}</div>
								<div>{arrvNm}</div>
							</div>
							<div>
								<div>{arrvNm}</div>
								<div>{arrvLevel + `-` + dptEnter}</div>
								<div>{dptNm}</div>
							</div>
						</div>
					)
				}
			}

			return (
				<div className={style['mrs-scheme-con']}>
					{
						this.state.showApplyMeasuring && <ApplyMeasuringChen
							data={this.state.applyMeasuringData}
							close={this.closeMeasuringFn.bind(this)} />
					}
					<div className={style['title']}>
						<span>方案详情</span>
						{this.calculateEle()}
					</div>
					<div className={style['capacity-detail']}>
						<div className={style['flights']}>
							{airline()}
						</div>
						<div className={style['quoted']}>
							<div>
								<span>报价:</span>
								<div>
									{price}
								</div>
							</div>
							<div>
								<span>航线:</span>
								<div>
									{`${dptNm}-${pst ? pstNm + '-' : ''}${arrvNm}`}
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}
	}
	render() {
		return this.rsFun()
	}
}