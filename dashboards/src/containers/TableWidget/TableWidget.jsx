// @flow
import {connect} from 'react-redux';
import ControlPanel from 'containers/TableWidgetControlPanel';
import {DEFAULT_COMPONENTS} from 'components/organisms/DiagramWidget/constants';
import {functions, props} from './selectors';
import {LoadingDiagramWidget} from 'components/organisms/DiagramWidget';
import type {Props} from './types';
import React, {createContext, PureComponent} from 'react';
import Table from 'components/organisms/TableWidget';
import type {TableBuildData} from 'store/widgets/buildData/types';

const UPDATING_CONTEXT = createContext();

export class TableWidget extends PureComponent<Props> {
	components = {
		...DEFAULT_COMPONENTS,
		ControlPanel
	};

	renderTable = (data: TableBuildData) => {
		const {drillDown, openCardObject, updateData, updateWidget, widget} = this.props;

		return (
			<UPDATING_CONTEXT.Consumer>
				{updating => (
					<Table
						data={data}
						loading={updating}
						onDrillDown={drillDown}
						onOpenCardObject={openCardObject}
						onUpdateData={updateData}
						onUpdateWidget={updateWidget}
						widget={widget}
					/>
				)}
			</UPDATING_CONTEXT.Consumer>
		);
	};

	render () {
		const {updating, widget} = this.props;

		return (
			<UPDATING_CONTEXT.Provider value={updating}>
				<LoadingDiagramWidget components={this.components} widget={widget}>
					{data => this.renderTable(data)}
				</LoadingDiagramWidget>
			</UPDATING_CONTEXT.Provider>
		);
	}
}

export default connect(props, functions)(TableWidget);
