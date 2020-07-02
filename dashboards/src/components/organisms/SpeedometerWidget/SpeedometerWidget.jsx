// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {Speedometer} from 'components/organisms';

export class SpeedometerWidget extends PureComponent<Props> {
	render () {
		const {data, widget} = this.props;
		const {borders, ranges} = widget;
		const {max, min} = borders;
		const {title, total} = data;

		return (
			<Speedometer
				max={Number(max)}
				min={Number(min)}
				ranges={ranges}
				title={title}
				value={total}
			/>
		);
	}
}

export default SpeedometerWidget;
