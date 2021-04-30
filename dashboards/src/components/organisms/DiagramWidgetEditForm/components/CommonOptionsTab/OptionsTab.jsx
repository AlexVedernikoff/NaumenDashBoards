// @flow
import type {DataBuilderProps} from 'DiagramWidgetEditForm/builders/DataFormBuilder/types';
import FiltersOnWidget from 'containers/DiagramWidgetEditForm/components/FiltersOnWidget';
import React, {Component} from 'react';

export class OptionsTab extends Component<DataBuilderProps> {
	renderFilterOnWidget = (): React$Node => {
		const {fetchAttributes, setDataFieldValue, setFieldValue, values} = this.props;

		if (values) {
			return (
				<FiltersOnWidget
					fetchAttributes={fetchAttributes}
					setDataFieldValue={setDataFieldValue}
					setFieldValue={setFieldValue}
					values={values}
				/>
			);
		}

		return null;
	};

	render () {
		return this.renderFilterOnWidget();
	}
}

export default OptionsTab;
