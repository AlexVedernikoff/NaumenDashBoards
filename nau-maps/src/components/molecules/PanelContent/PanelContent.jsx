// @flow
import {connect} from 'react-redux';
import type {Equipment} from 'types/equipment';
import PanelPoint from 'components/molecules/PanelPoint';
import type {Part} from 'types/part';
import type {Point} from 'types/point';
import {props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import type {Trail} from 'types/trail';

export class PanelContent extends Component<Props> {
	renderEquipments = (object: Equipment, key: number) => {
		return this.renderPointData(object, key);
	};

	renderObject = (object: Trail, key: number) => {
		return (
			<div key={key}>
				{this.renderPointData(object, key)}
				{object.parts && object.parts.map(this.renderParts)}
				{object.equipments && object.equipments.map(this.renderEquipments)}
			</div>
		);
	};

	renderParts = (object: Part, key: number) => {
		return this.renderPointData(object, key);
	};

	renderPointData = (object: Part | Point | Equipment, key: number) => {
		return <PanelPoint key={key} point={object} />;
	};

	render () {
		const {points, showSingleObject, singleObject} = this.props;

		if (showSingleObject) {
			return this.renderPointData(singleObject, singleObject.data.uuid);
		}

		return points.map(this.renderObject);
	}
}

export default connect(props)(PanelContent);
