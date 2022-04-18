// @flow
import {compose} from 'redux';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import TableWidget from 'components/organisms/TableWidget';
import withBaseWidget from 'containers/withBaseWidget';

export class TableWidgetContainer extends PureComponent<Props> {
	render () {
		const {data, drillDown, openCardObject, updateData, updateWidget, updating, widget} = this.props;

		if (data) {
			return (
				<TableWidget
					data={data}
					loading={updating}
					onDrillDown={drillDown}
					onOpenCardObject={openCardObject}
					onUpdateData={updateData}
					onUpdateWidget={updateWidget}
					widget={widget}
				/>
			);
		}

		return null;
	}
}

export default compose(connect(props, functions), withBaseWidget)(TableWidgetContainer);
