// @flow
import DashboardHeaderTemplate from 'components/templates/DashboardHeaderTemplate';
import {getLastPosition} from 'helpers';
import {Link} from 'react-router-dom';
import type {Props} from 'containers/DashboardEditHeader/types';
import React, {Component} from 'react';

export class DashboardEditHeader extends Component<Props> {
	addWidgetAfterLast = () => {
		const {addWidget, widgets} = this.props;

		const lastPosition = getLastPosition(widgets);
		addWidget(lastPosition);
	};

	render () {
		return (
			<DashboardHeaderTemplate>
				<button type="button" onClick={this.addWidgetAfterLast}>Добавить виджет</button>
				<Link to="/">Просмотр</Link>
			</DashboardHeaderTemplate>
		)
	}
}

export default DashboardEditHeader;
