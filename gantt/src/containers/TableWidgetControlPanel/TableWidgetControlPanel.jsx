// @flow
import {connect} from 'react-redux';
import ControlPanel from 'components/organisms/DiagramWidget/components/ControlPanel';
import {FILE_VARIANTS} from 'utils/export';
import {functions, props} from './selectors';
import memoize from 'memoize-one';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class TableWidgetControlPanel extends PureComponent<Props> {
	getExportOptions = memoize(options => [...options, FILE_VARIANTS.XLSX]);

	handleExport = async (type) => {
		const {data, exportExcel, onExport, widget} = this.props;

		if (type === FILE_VARIANTS.XLSX && data) {
			await exportExcel(widget, data.total);
			return;
		}

		onExport(type);
	};

	render () {
		const {exportOptions} = this.props;

		return (
			<ControlPanel
				{...this.props}
				exportOptions={this.getExportOptions(exportOptions)}
				onExport={this.handleExport}
			/>
		);
	}
}

export default connect(props, functions)(TableWidgetControlPanel);
