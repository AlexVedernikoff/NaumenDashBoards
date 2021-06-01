// @flow
import {connect} from 'react-redux';
import type {Equipment} from 'types/equipment';
import type {Geoposition} from 'types/geoposition';
import PanelPoint from 'components/molecules/PanelPoint';
import type {Part} from 'types/part';
import type {Point, PointData, PointType} from 'types/point';
import {props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import type {Trail} from 'types/trail';

export class PanelContentPoints extends Component<Props> {
	renderPointData = (pointData: PointData, key: number, type: PointType, geoposition: Geoposition) => {
		return <PanelPoint key={key} pointData={pointData} type={type} geoposition={geoposition} />;
	};

	renderEquipments = (object: Point | Equipment, key: number) => {
		const {data, geoposition, type} = object;

		return (
			<div key={key}>
				{this.renderPointData(data, key, type, geoposition)}
			</div>
		);
	};

	renderParts = (object: Part, key: number) => {
		const {data, geopositions, type} = object;

		return (
			<div key={key}>
				{this.renderPointData(data, key, type, geopositions[0])}
			</div>
		);
	};

	renderTrail = (object: Trail, key: number) => {
		const {data, type} = object;

		return (
			<div key={key}>
				{this.renderPointData(data, key, type, object.parts && object.parts[0] && object.parts[0].geopositions[0])}
				{object.parts && object.parts.map(this.renderParts)}
				{object.equipments && object.equipments.map(this.renderEquipments)}
			</div>
		);
	};

	render () {
		const {points, showSingleObject, singleObject} = this.props;

		if (showSingleObject) {
			return this.renderPointData(singleObject.data, singleObject.data.uuid, singleObject.type, singleObject.geoposition);
		}

		return (
			<div>
				{points.map(this.renderTrail)}
			</div>
		);
	}
}

export default connect(props)(PanelContentPoints);
