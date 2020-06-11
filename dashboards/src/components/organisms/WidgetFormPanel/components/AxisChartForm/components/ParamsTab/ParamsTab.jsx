// @flow
import type {DataBuilderProps} from 'WidgetFormPanel/builders/DataFormBuilder/types';
import {FIELDS} from 'WidgetFormPanel';
import React, {Component, Fragment} from 'react';
import {withDataFormBuilder} from 'WidgetFormPanel/builders';

export class ParamsTab extends Component<DataBuilderProps> {
	sourceRefFields = [FIELDS.breakdown, FIELDS.xAxis, FIELDS.yAxis];

	renderIndicatorBoxes = () => {
		const {renderIndicatorBoxes} = this.props;
		const props = {
			name: FIELDS.yAxis
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
		const props = {
			indicatorName: FIELDS.yAxis,
			parameterName: FIELDS.xAxis,
			sourceRefFields: this.sourceRefFields
		};

		return renderSourceBox(props);
	};

	render () {
		const {renderBaseBoxes} = this.props;

		return (
			<Fragment>
				{renderBaseBoxes()}
				{this.renderSourceBox()}
				{this.renderParameterBox()}
				{this.renderIndicatorBoxes()}
			</Fragment>
		);
	}
}

export default withDataFormBuilder(ParamsTab);
