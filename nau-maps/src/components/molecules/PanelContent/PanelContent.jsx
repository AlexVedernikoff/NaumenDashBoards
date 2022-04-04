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

export class PanelContent extends Component<Props> {
	renderEquipments = (object: Point | Equipment, key: number) => {
		const {data, geopositions, type} = object;
		return this.renderPointData(data, key, type, geopositions && geopositions[0]);
	};

	renderObject = (object: Trail, key: number) => {
		const {data, geopositions, type} = object;

		return (
			<div key={key}>
				{this.renderPointData(data, key, type, geopositions && geopositions[0])}
				{object.parts && object.parts.map(this.renderParts)}
				{object.equipments && object.equipments.map(this.renderEquipments)}
			</div>
		);
	};

	renderParts = (object: Part, key: number) => {
		const {data, geopositions, type} = object;
		return this.renderPointData(data, key, type, geopositions && geopositions[0]);
	};

	renderPointData = (pointData: PointData, key: number, type: PointType, geoposition: Geoposition) => {
		return <PanelPoint geoposition={geoposition} key={key} pointData={pointData} type={type} />;
	};

	render () {
		const {points, showSingleObject, singleObject} = this.props;

		if (showSingleObject) {
			return this.renderPointData(singleObject.data, singleObject.data.uuid, singleObject.type, singleObject.geoposition);
		}

		return points.map(this.renderObject);
	}
}

export default connect(props)(PanelContent);
