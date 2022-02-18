// @flow
import {Tooltip} from 'react-leaflet';
import React, {Component} from 'react';
import styles from './TooltipPoint.less';
import type {Props} from './types';

export class TooltipPoint extends Component<Props> {
	static defaultProps = {
		sticky: false
	};

	render () {
		const {title, sticky} = this.props;
		const offset = [0, 30];

		return (
			<Tooltip className={styles.tolltipLabel} offset={offset} opacity={1} sticky={sticky} interactive={true}>
				{title}
			</Tooltip>
		);
	}
}

export default TooltipPoint;
