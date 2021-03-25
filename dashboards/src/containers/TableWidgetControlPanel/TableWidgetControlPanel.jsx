// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {COLUMN_TYPES, SEPARATOR} from 'store/widgets/buildData/constants';
import {connect} from 'react-redux';
import ControlPanel from 'components/organisms/DiagramWidget/components/ControlPanel';
import {createContextName, exportSheet, FILE_VARIANTS} from 'utils/export';
import {deepClone} from 'helpers';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getSeparatedLabel} from 'store/widgets/buildData/helpers';
import {isCardObjectColumn} from 'components/organisms/TableWidget/helpers';
import memoize from 'memoize-one';
import {props} from './selectors';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import type {TableRow} from 'utils/export/types';

export class TableWidgetControlPanel extends PureComponent<Props> {
	getExportOptions = memoize(options => [...options, FILE_VARIANTS.XLSX]);

	handleExport = async (type) => {
		const {data, onExport, widget} = this.props;
		const contextName = await createContextName();
		const name = `${widget.name}_${contextName}`;

		if (type === FILE_VARIANTS.XLSX && data) {
			return exportSheet(name, {...data, data: this.removeCodesFromRows(data)});
		}

		onExport(type);
	};

	removeCodesFromRows = (data: DiagramBuildData): Array<TableRow> => {
		const {columns, data: originalRows} = data;
		const rows = deepClone(originalRows);

		columns.forEach(column => {
			const {accessor, attribute, type} = column;
			const isMetaClassParameterColumn = type === COLUMN_TYPES.PARAMETER && attribute.type === ATTRIBUTE_TYPES.metaClass;

			if (isMetaClassParameterColumn || isCardObjectColumn(column)) {
				rows.forEach(row => {
					const value = row[accessor];

					row[accessor] = typeof value === 'string' ? getSeparatedLabel(value, SEPARATOR) : value;
				});
			}
		});

		return rows;
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

export default connect(props)(TableWidgetControlPanel);
