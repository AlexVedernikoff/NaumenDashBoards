// @flow
import {DEFAULT_TOOLTIP_SETTINGS} from 'store/widgets/data/constants';
import Message from './components/Message';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class WidgetTooltip extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		text: '[?]',
		tooltip: DEFAULT_TOOLTIP_SETTINGS
	};

	render () {
		const {position, text, tooltip} = this.props;
		const {show, title} = tooltip ?? DEFAULT_TOOLTIP_SETTINGS;

		if (show) {
			return (
				<span
					className={styles.tooltipHandler}
					title=""
				>
					{text}
					<Message position={position} text={title} />
				</span>
			);
		}

		return null;
	}
}

export default WidgetTooltip;
