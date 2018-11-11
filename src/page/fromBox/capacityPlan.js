import React, { Component, Fragment } from 'react';
import { store } from './../../store/index';

import style from './../../static/css/from/capacityPlan.scss';


export default class CapacityPlan extends Component {
	constructor(props) {
		super(props);
	}
	computeTime = (dptTime = null, arrvTime = null) => {
		if (dptTime && arrvTime) {
			let dptHours = dptTime.split(':')[0];
			let arrvHours = arrvTime.split(':')[0];
			let range = arrvHours.match(/^\+\d{2}/) ? true : false;//true:跨天,false:不跨天
			return range ? (24 - parseInt(dptHours) + parseInt(arrvHours)) : (parseInt(arrvHours) - parseInt(dptHours));
		} else {
			return '';
		}
	}
	areaTypeStr = (areaType, arrv, name, ) => {
		let typeStr = '', nameStr = '';
		switch (Number(areaType)) {
			case 1: typeStr = "航点"; nameStr = name; break;
			case 2: typeStr = "省份"; nameStr = arrv; break;
			case 3: typeStr = "区域"; nameStr = arrv; break;
			default: typeStr = ''; nameStr = ''; break;
		}
		return { typeStr, nameStr };
	}
	targetFn = () => {
		let { areaType, mandatoryDesignation, pstMandatoryDesignation, pstAreaType, pst, pstNm, arrv, arrvNm } = this.props.scheme && this.props.scheme.length ? this.props.scheme[0] : {};
		let { typeStr: arrvTypeStr, nameStr: arrvNameStr } = this.areaTypeStr(areaType, arrv, arrvNm);
		let pstEle = '', arrvEle = '';
		if (pst) {
			let { typeStr: pstTypeStr, nameStr: pstNameStr } = this.areaTypeStr(pstAreaType, pst, pstNm);
			let coerce = '';
			if (pstMandatoryDesignation === '1') {
				coerce = '(强制)'
			}
			pstEle = (
				<div>
					<span>意向经停{pstTypeStr}{coerce}</span>
					<div>
						<span>{pstNameStr}</span>
					</div>
				</div>
			)
		}
		if (arrv) {
			let { typeStr: arrvTypeStr, nameStr: arrvNameStr } = this.areaTypeStr(areaType, arrv, arrvNm);
			let coerce = '';
			if (mandatoryDesignation === '1') {
				coerce = '(强制)'
			}
			arrvEle = (
				<div>
					<span>意向到达{arrvTypeStr}{coerce}</span>
					<div>
						<span>{arrvNameStr}</span>
					</div>
				</div>
			)
		}

		return (
			<Fragment>
				{pstEle}
				{arrvEle}
			</Fragment>

		)


	}
	render() {
		let { dptTime, arrvTime, areaType, fixedSubsidyPrice, bottomSubsidyPrice, subsidypolicy, days, arrv, arrvNm, price, mandatoryDesignation, pstMandatoryDesignation, pstAreaType } = this.props.scheme && this.props.scheme.length ? this.props.scheme[0] : {};

		let { typeStr, arrvStr } = this.areaTypeStr(areaType, arrv, arrvNm);

		return (
			<div className={style['capacity-detail']}>
				<div className={style['wireframe']}>
					<div className={style['circle']}>
						{this.computeTime(dptTime, arrvTime)}h
	                </div>
				</div>
				<div className={style['level-or-enter-time']}>
					<div>
						<span>出港时段</span>
						<span>
							{arrvTime && arrvTime.match(/^\+\d{2}/) ? (<span style={{ opacity: 0 }}>+</span>) : ''}
							{dptTime}时段</span>
					</div>
					<div>
						<span>进港时段</span>
						<span>{arrvTime}时段</span>
					</div>
				</div>
				<div className={style['quoted-schedule']}>
					<div className={style['qs-item']}>
						<div>
							<span>报价</span>
							<div>
								{subsidypolicy == '0' ? '待议' : ''}
								{fixedSubsidyPrice ? ` 定补 ${fixedSubsidyPrice}万/班` : ''}
								{bottomSubsidyPrice ? ` 保底 ${bottomSubsidyPrice}万/时` : ''}
							</div>
							
						</div>
						<div>
							<span>班期:</span>
							<div>
								<span>{days}</span>
							</div>
						</div>
					</div>
					<div className={style['qs-item']}>
						{this.targetFn()}
						{/* <div>
							<span>意向{typeStr}</span>
							<div>
								<span>{arrvStr}</span>
							</div>
						</div>
						<div>
							<span>意向到达航点(强制)</span>
							<div>
								哈尔冰太平国际机场
							</div>
						</div> */}
					</div>
				</div>
				{/* <div className={style['quoted']}>
					<div>
						<span>报价</span>
						<div>
							{subsidypolicy == '0' ? '待议' : ''}
							{fixedSubsidyPrice ? ` 定补 ${fixedSubsidyPrice}万/班` : ''}
							{bottomSubsidyPrice ? ` 保底 ${bottomSubsidyPrice}万/时` : ''}
						</div>
					</div>
					<div>
						<span>意向{typeStr}</span>
						<div>
							<span>{arrvStr}</span>
						</div>
					</div>
				</div>
				<div className={style['schedule']}>
					<div>
						<span>班期:</span>
						<span>{days}</span>
					</div>
				</div> */}
			</div>
		)
	}
}