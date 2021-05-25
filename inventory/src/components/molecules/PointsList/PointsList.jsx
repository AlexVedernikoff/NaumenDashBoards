// @flow
import {connect} from 'react-redux';
import type {Point} from 'types/point';
import PointDynamic from 'components/molecules/PointDynamic';
import PointMultiple from 'components/molecules/PointMultiple';
import PointStatic from 'components/molecules/PointStatic';
import type {Props, State} from './types';
import {props} from './selectors';
import React, {Component} from 'react';

export class PointsList extends Component<Props, State> {
	renderDynamicMarker = (point: Point, key: number) => <PointDynamic point={point} key={key} />;

	renderStaticMarker = (point: Point) => point.data.length === 1 ? <PointStatic point={point} key={point.data[0].uuid} /> : <PointMultiple point={point} key={point.data[0].uuid} />;

	render () {
		const {dynamicPoints, staticPoints} = this.props;

		return (
			<div>
				{dynamicPoints.length && dynamicPoints.map(this.renderDynamicMarker)}
				{staticPoints.length && staticPoints.map(this.renderStaticMarker)}
			</div>
		);
	}
}
export default connect(props)(PointsList);
