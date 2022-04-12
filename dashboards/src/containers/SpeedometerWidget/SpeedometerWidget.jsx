// @flow
import type {DivRef} from 'components/types';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import ResizeDetector from 'components/molecules/ResizeDetector';
import Speedometer from 'components/molecules/Speedometer';
import styles from './styles.less';

export class SpeedometerWidget extends PureComponent<Props> {
	containerRef: DivRef = createRef();

	handleResize = () => {
		const {updateOptions} = this.props;
		const {current: container} = this.containerRef;

		if (container) {
			updateOptions(container);
		}
	};

	renderSpeedometer = () => {
		const {data, options, widget} = this.props;
		const {current} = this.containerRef;

		if (current && data && options && options.type === 'SpeedometerOptions') {
			return <Speedometer data={data} options={options} widget={widget} />;
		}

		return null;
	};

	render () {
		return (
			<ResizeDetector onResize={this.handleResize}>
				<div className={styles.speedometer} ref={this.containerRef}>
					{this.renderSpeedometer()}
				</div>
			</ResizeDetector>
		);
	}
}

export default SpeedometerWidget;
