// @flow
import type {DivRef} from 'components/types';
import {LoadingDiagramWidget} from 'components/organisms/DiagramWidget';
import type {Props, SpeedometerData} from './types';
import React, {createRef, PureComponent} from 'react';
import Speedometer from 'components/molecules/Speedometer';
import {speedometerMixin} from 'utils/chart/mixins';

export class SpeedometerWidget extends PureComponent<Props> {
	containerRef: DivRef = createRef();

	renderSpeedometer = (data: SpeedometerData) => {
		const {widget} = this.props;
		const {current} = this.containerRef;

		if (current) {
			const options = speedometerMixin(widget, data, current);

			return <Speedometer options={options} />;
		}

		return null;
	};

	render () {
		const {widget} = this.props;

		return (
			<LoadingDiagramWidget forwardedRef={this.containerRef} widget={widget}>
				{data => this.renderSpeedometer(data)}
			</LoadingDiagramWidget>
		);
	}
}

export default SpeedometerWidget;
