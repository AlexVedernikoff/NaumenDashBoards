// @flow
import {Tooltip} from 'react-leaflet';
import React, {Component} from 'react';
import styles from './TooltipMarker.less';
import type {Props, State} from './types';

export class TooltipPoint extends Component<Props, State> {
	render () {
		const {title} = this.props;
		const offset = [0, 20];

		return (
			<Tooltip className={styles.tolltipLable} offset={offset} opacity={1} interactive={true}>
				{title}
			</Tooltip>
		);
	}
}
export default TooltipPoint;
