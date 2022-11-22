// @flow
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './TooltipPoint.less';
import {Tooltip} from 'react-leaflet';

export class TooltipPoint extends Component<Props> {
	static defaultProps = {
		sticky: false
	};

	render () {
		const {sticky, title} = this.props;
		const offset = [0, 30];

		return (
			<Tooltip className={styles.tooltipLabel} interactive={true} offset={offset} opacity={1} sticky={sticky}>
				{title}
			</Tooltip>
		);
	}
}

export default TooltipPoint;
