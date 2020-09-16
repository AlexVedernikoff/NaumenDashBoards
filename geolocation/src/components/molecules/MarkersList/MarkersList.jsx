// @flow
import {connect} from 'react-redux';
import DynamicMarker from 'components/molecules/DynamicMarker';
import MultipleMarker from 'components/molecules/MultipleMarker';
import type {DynamicPoint, StaticPoint} from 'types/point';
import type {Props, State} from './types';
import {props} from './selectors';
import React, {Component} from 'react';
import StaticMarker from 'components/molecules/StaticMarker';

export class MarkersList extends Component<Props, State> {
	renderDynamicMarker = (marker: DynamicPoint, key: number) => <DynamicMarker marker={marker} key={key} />;

	renderStaticMarker = (marker: StaticPoint, key: number) => marker.data.length ===1 ? <StaticMarker marker={marker} key={key} /> : <MultipleMarker marker={marker} key={key} />;

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
export default connect(props)(MarkersList);
