// @flow
import type {DivRef} from 'components/types';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import ResizeDetector from 'components/molecules/ResizeDetector';
// import t from 'localization';

export class PivotWidget extends PureComponent<Props, State> {
	containerRef: DivRef = createRef();

	handleResize = (...props) => {
		const {updateOptions} = this.props;
		const {current: container} = this.containerRef;

		if (container) {
			updateOptions(container);
		}
	};

	render () {
		return (
			<ResizeDetector onResize={this.handleResize}>
				<div ref={this.containerRef}>
					Pivot
				</div>
			</ResizeDetector>
		);
	}
}

export default PivotWidget;
