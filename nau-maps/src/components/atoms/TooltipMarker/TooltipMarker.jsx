// @flow
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './TooltipMarker.less';
import {Tooltip} from 'react-leaflet';

export class TooltipPoint extends Component<Props, State> {
	render () {
		const {title} = this.props;
		const offset = [0, 30];

		return (
			<Tooltip className={styles.tolltipLabel} interactive={true} offset={offset} opacity={1}>
				{title}
			</Tooltip>
		);
	}
}
export default TooltipPoint;
