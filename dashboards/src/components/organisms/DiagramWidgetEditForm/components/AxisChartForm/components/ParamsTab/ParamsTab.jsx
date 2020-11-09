// @flow
import type {DataBuilderProps} from 'DiagramWidgetEditForm/builders/DataFormBuilder/types';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import React, {Component, Fragment} from 'react';
import {withDataFormBuilder} from 'DiagramWidgetEditForm/builders';

export class ParamsTab extends Component<DataBuilderProps> {
	renderIndicatorBoxes = () => {
		const {renderIndicatorBoxes} = this.props;
		const props = {
			name: FIELDS.yAxis,
			usesEmptyData: true
		};

		return renderIndicatorBoxes(props);
	};

	renderParameterBox = () => {
		const {renderParameterBox} = this.props;
		const props = {
			name: FIELDS.xAxis
		};

		return renderParameterBox(props);
	};

	renderSourceBox = () => {
		const {renderSourceBox} = this.props;
		const sourceRefFields = {
			breakdown: FIELDS.breakdown,
			indicator: FIELDS.yAxis,
			parameter: FIELDS.xAxis
		};

		return renderSourceBox(sourceRefFields);
	};

	render () {
		const {renderBaseBoxes, renderDisplayModeSelect} = this.props;

		return (
			<Fragment>
				{renderBaseBoxes()}
				{this.renderSourceBox()}
				{this.renderParameterBox()}
				{this.renderIndicatorBoxes()}
				{renderDisplayModeSelect()}
			</Fragment>
		);
	}
}

export default withDataFormBuilder(ParamsTab);
