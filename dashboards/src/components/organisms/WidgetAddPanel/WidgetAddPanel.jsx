// @flow
import {Button} from 'components/atoms';
import NewWidget from 'store/widgets/data/NewWidget';
import type {Props} from 'containers/WidgetAddPanel/types';
import React, {Component} from 'react';
import styles from './styles.less';

export class WidgetAddPanel extends Component<Props> {
	addWidgetOnNewRow = () => {
		const {addWidget, layoutMode} = this.props;
		addWidget(new NewWidget(layoutMode));
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
