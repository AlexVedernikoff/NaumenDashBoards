// @flow
import {connect} from 'react-redux';
import type {Equipment} from 'types/equipment';
import Part from 'components/molecules/Part';
import type {Part as PartType} from 'types/part';
import PointStatic from 'components/molecules/PointStatic';
import {props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import Trail from 'components/molecules/Trail';
import type {Trail as TrailType} from 'types/trail';

export class PointsList extends Component<Props> {
	renderEquipments = (equipment: Equipment) => <PointStatic point={equipment} key={equipment.data.uuid} />;
	renderSections = (part: PartType) => <Part part={part} key={part.data.uuid} />;
	renderTrail = (trail: TrailType) => <Trail trail={trail} key={trail.data.uuid} />;

	render () {
		const {trails, points, sections} = this.props;

		return (
			<div>
				{trails.length && trails.map(this.renderTrail)}
				{trails.length && trails.map(trail => trail.equipments && trail.equipments.map(this.renderEquipments))}
				{points.length && points.map(this.renderEquipments)}
				{sections.length && sections.map(this.renderSections)}
			</div>
		);
	}
}

export default connect(props)(PointsList);
