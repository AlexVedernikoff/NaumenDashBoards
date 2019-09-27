// @flow
import {Button} from 'components/atoms';
import {getNextRow} from 'utils/layout';
import type {Props} from 'containers/WidgetAddPanel/types';
import React, {Component} from 'react';
import styles from './styles.less';

export class WidgetAddPanel extends Component<Props> {
	addWidgetOnNewRow = () => {
		const {addWidget, widgets} = this.props;
		const nextRow = getNextRow(widgets);

		addWidget(nextRow);
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
