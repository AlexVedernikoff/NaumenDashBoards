// @flow
import {Button} from 'components/atoms';
import {getNextRow} from 'utils/layout';
import {NewWidget} from 'utils/widget';
import type {Props} from 'containers/WidgetAddPanel/types';
import React, {Component} from 'react';
import styles from './styles.less';

export class WidgetAddPanel extends Component<Props> {
	addWidgetOnNewRow = () => {
		const {addWidget, layoutMode, widgets} = this.props;
		const nextRow = getNextRow(widgets);

		addWidget(new NewWidget(nextRow, layoutMode));
	};

	render () {
		return (
			<div className={styles.panel}>
				<Button onClick={this.addWidgetOnNewRow}>Добавить виджет</Button>
			</div>
		);
	}
}

export default WidgetAddPanel;
