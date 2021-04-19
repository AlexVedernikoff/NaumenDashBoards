// @flow
import {connect} from 'react-redux';
import ControlPanel from 'containers/TableWidgetControlPanel';
import {DEFAULT_COMPONENTS} from 'components/organisms/DiagramWidget/constants';
import {functions} from './selectors';
import {LoadingDiagramWidget} from 'components/organisms/DiagramWidget';
import memoize from 'memoize-one';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import Table from 'components/organisms/TableWidget';

export class TableWidget extends PureComponent<Props> {
	getComponents = memoize(() => ({
		...DEFAULT_COMPONENTS,
		ControlPanel
	}));

	renderTable = (data: Object) => {
		const {drillDown, fetchBuildData, openCardObject, updateWidget, widget} = this.props;

		return (
			<Table
				data={data}
				onDrillDown={drillDown}
				onFetchBuildData={fetchBuildData}
				onOpenCardObject={openCardObject}
				onUpdate={updateWidget}
				widget={widget}
			/>
		);
	};

	render () {
		const {widget} = this.props;

		return (
			<LoadingDiagramWidget components={this.getComponents()} widget={widget}>
				{(data) => this.renderTable(data)}
			</LoadingDiagramWidget>
		);
	}
}

export default connect(null, functions)(TableWidget);
