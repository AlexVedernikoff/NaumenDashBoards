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
import YandexLine from 'components/molecules/Yandex/Line';
import YandexMark from 'components/molecules/Yandex/Mark';

export class PointsList extends Component<Props> {
	renderEquipments = (equipment: Equipment) => <PointStatic key={equipment.data.uuid} point={equipment} />;
	renderSections = (part: PartType) => <Part key={part.data.uuid} part={part} />;
	renderTrail = (trail: TrailType) => <Trail key={trail.data.uuid} trail={trail} />;

	renderYandexLine = (part: PartType) => <YandexLine key={part.data.uuid} part={part} />;
	renderYandexMark = (equipment: Equipment) => <YandexMark key={equipment.data.uuid} point={equipment} />;
	renderYandexTrails = (trail: TrailType) => {
		const {parts = [], equipments = []} = trail;

		return (
			<div key={trail.data.uuid} >
				{parts.map(this.renderYandexLine)}
				{equipments.map(this.renderYandexMark)}
			</div>
		);
	};

	render () {
		const {points = [], sections = [], trails = [], typeMap} = this.props;

		switch (typeMap) {
			case 'Yandex':
				return (
					<div>
						{trails.map(this.renderYandexTrails)}
						{points.map(this.renderYandexMark)}
						{sections.map(this.renderYandexLine)}
					</div>
				);
			default:
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
}

export default connect(props)(PointsList);
