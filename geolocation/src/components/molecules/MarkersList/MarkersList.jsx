// @flow
import {connect} from 'react-redux';
import DynamicMarker from 'components/molecules/DynamicMarker';
import MultipleMarker from 'components/molecules/MultipleMarker';
import type {MultiplePoint} from 'types/multiple';
import type {Point} from 'types/point';
import type {Props, State} from './types';
import {props} from './selectors';
import React, {Component} from 'react';
import StaticMarker from 'components/molecules/StaticMarker';

export class MarkersList extends Component<Props, State> {
	renderDynamicMarker = (marker: Point, key: number) => <DynamicMarker marker={marker} key={key} />;

	renderMultipleMarker = (marker: MultiplePoint, key: number) => <MultipleMarker marker={marker} key={key} />;

	renderStaticMarker = (marker: Point, key: number) => <StaticMarker marker={marker} key={key} />;

	render () {
		const {dynamicMarkers, multipleMarkers, staticMarkers} = this.props;

		return (
			<div>
				{dynamicMarkers.length && dynamicMarkers.map(this.renderDynamicMarker)}
				{multipleMarkers.length && multipleMarkers.map(this.renderMultipleMarker)}
				{staticMarkers.length && staticMarkers.map(this.renderStaticMarker)}
			</div>
		);
	}
}
export default connect(props)(MarkersList);
