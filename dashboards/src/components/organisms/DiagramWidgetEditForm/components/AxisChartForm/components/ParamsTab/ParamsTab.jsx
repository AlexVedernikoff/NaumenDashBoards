// @flow
import type {DataBuilderProps} from 'DiagramWidgetEditForm/builders/DataFormBuilder/types';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import {getAttributeValue} from 'store/sources/attributes/helpers';
import React, {Component, Fragment} from 'react';
import {withDataFormBuilder} from 'DiagramWidgetEditForm/builders';

export class ParamsTab extends Component<DataBuilderProps> {
	onSelectIndicatorCallback = (index: number) => () => {
		const {setFieldValue, values} = this.props;
		const {data, indicator} = values;
		const {[FIELDS.yAxis]: attribute} = data[index];

		setFieldValue(FIELDS.indicator, {
			...indicator,
			name: getAttributeValue(attribute, 'title')
		});
	};

	renderIndicatorBoxes = () => {
		const {renderIndicatorBoxes} = this.props;
		const props = {
			onSelectCallback: this.onSelectIndicatorCallback,
			usesBlankData: true,
			usesEmptyData: true,
			usesTop: true
		};

		return renderIndicatorBoxes(props);
	};

	render () {
		const {renderBaseBoxes, renderDisplayModeSelect, renderNavigationBox, renderParameterBox, renderSourceBox} = this.props;

		return (
			<Fragment>
				{renderBaseBoxes()}
				{renderSourceBox()}
				{renderParameterBox()}
				{this.renderIndicatorBoxes()}
				{renderDisplayModeSelect()}
				{renderNavigationBox()}
			</Fragment>
		);
	}
}

export default withDataFormBuilder(ParamsTab);
