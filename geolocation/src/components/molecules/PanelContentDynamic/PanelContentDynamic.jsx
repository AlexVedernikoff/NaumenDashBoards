// @flow
import type {Point} from 'types/point';
import {connect} from 'react-redux';
import {colorActive} from 'helpers/marker';
import {functions, props} from './selectors';
import PanelPoint from 'components/molecules/PanelPoint';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './PanelContentDynamic.less';

export class PanelContentDynamic extends Component<Props, State> {
	renderPoint = (point: Point, key: number) => {
		const {actions, geoposition, header, options, uuid} = point;
		const {params} = this.props;
		const {date} = geoposition;
		const statusColor = colorActive(date, params);

		return (
			<PanelPoint
				key={key}
				options={options}
				header={header}
				actions={actions}
				statusColor={statusColor}
				uuid={uuid}
			/>
		);
	};

	render () {
		const {dynamicPoints} = this.props;

		return (
			<div className={styles.content}>
				{dynamicPoints.map(this.renderPoint)}
			</div>
		);
	};
}
export default connect(props, functions)(PanelContentDynamic);
