// @flow
import type {Point} from 'types/point';
import {connect} from 'react-redux';
import {colorGroup} from 'helpers/marker';
import {functions, props} from './selectors';
import PanelPoint from 'components/molecules/PanelPoint';
import type {Props, State} from './types';
import React, {Component} from 'react';
import type {StaticPoint} from 'types/point';

export class PanelContentStatic extends Component<Props, State> {

	renderPoint = (point: Point, key: number) => {
		const {actions, header, options, uuid} = point;
		const {group} = point;
		const {staticGroups, params} = this.props;
		const {colorStaticPoint} = params;
		const color = colorGroup(group, staticGroups);
		const statusColor = color || colorStaticPoint;

		return (
			<PanelPoint
				key={key}
				options={options}
				header={header}
				actions={actions}
				uuid={uuid}
				statusColor={statusColor}
			/>
		);
	};

	renderStaticContent = (staticPoint: StaticPoint, key: number) => {
		const {data} = staticPoint;

		return <div key={key}>{data.map(this.renderPoint)}</div>;
	};

	render () {
		const {staticPoints} = this.props;

		return (
			<div>
				{staticPoints.map(this.renderStaticContent)}
			</div>
		);
	}
}
export default connect(props, functions)(PanelContentStatic);
