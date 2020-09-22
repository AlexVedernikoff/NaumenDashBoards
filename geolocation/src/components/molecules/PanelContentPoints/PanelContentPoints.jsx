// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Geoposition} from 'types/geoposition';
import PanelPoint from 'components/molecules/PanelPoint';
import type {Point, PointData, PointType} from 'types/point';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './PanelContentPoints.less';

export class PanelContentPoints extends Component<Props, State> {
	renderPointData = (pointData: PointData, key: number, type: PointType, geoposition: Geoposition) => {
		return <PanelPoint key={key} pointData={pointData} type={type} geoposition={geoposition} />
	}

	renderPoint = (point: Point, key: number) => {
		const {data, geoposition, type} = point;

		return (
			<div key={key}>
				{data.map((pointData, key) => this.renderPointData(pointData, key, type, geoposition))}
			</div>
		);
	};

	render () {
		const {points} = this.props;

		return (
			<div className={styles.content}>
				{points.map(this.renderPoint)}
			</div>
		);
	};
}
export default connect(props, functions)(PanelContentPoints);
