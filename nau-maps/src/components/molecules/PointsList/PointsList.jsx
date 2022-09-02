// @flow
import {connect} from 'react-redux';
import type {Equipment} from 'types/equipment';
import OpenMapLine from 'components/molecules/OpenMap/Line';
import OpenMapMark from 'components/molecules/OpenMap/Mark';
import type {Part as PartType} from 'types/part';
import {props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import type {Trail as TrailType} from 'types/trail';
import YandexLine from 'components/molecules/Yandex/Line';
import YandexMark from 'components/molecules/Yandex/Mark';

export class PointsList extends Component<Props> {
	renderEquipments = (equipment: Equipment) => <OpenMapMark key={equipment.data.uuid} point={equipment} />;
	renderSections = (part: PartType) => <OpenMapLine key={part.data.uuid} part={part} />;

	renderTrails = (trail: TrailType) => {
		const {parts = [], equipments = []} = trail;

		return (
			<div key={trail.data.uuid} >
				{parts.map(this.renderSections)}
				{equipments.map(this.renderEquipments)}
			</div>
		);
	};

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
			case 'yandex':
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
						{trails.map(this.renderTrails)}
						{points.map(this.renderEquipments)}
						{sections.map(this.renderSections)}
					</div>
				);
		}
	}
}

export default connect(props)(PointsList);
