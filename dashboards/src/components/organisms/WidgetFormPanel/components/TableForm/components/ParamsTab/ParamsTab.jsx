// @flow
import type {DataBuilderProps} from 'WidgetFormPanel/builders/DataFormBuilder/types';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {FormField} from 'components/molecules';
import {LegacyCheckbox as Checkbox} from 'components/atoms';
import React, {Component, Fragment} from 'react';
import {withDataFormBuilder} from 'WidgetFormPanel/builders';

export class ParamsTab extends Component<DataBuilderProps> {
	sourceRefFields = [FIELDS.breakdown, FIELDS.column, FIELDS.row];

	renderCalcTotalField = (name: string) => {
		const {setFieldValue, values} = this.props;

		return (
			<FormField>
				<Checkbox
					label="Подсчитывать итоги"
					name={name}
					onClick={setFieldValue}
					value={values[name]}
				/>
			</FormField>
		);
	};

	renderIndicatorBoxes = () => {
		const {renderIndicatorBoxes} = this.props;
		const props = {
			children: this.renderCalcTotalField(FIELDS.calcTotalColumn),
			name: FIELDS.column
		};

		return renderIndicatorBoxes(props);
	};

	renderParameterBox = () => {
		const {renderParameterBox} = this.props;
		const props = {
			children: this.renderCalcTotalField(FIELDS.calcTotalRow),
			name: FIELDS.row,
			useGroup: false
		};

		return renderParameterBox(props);
	};

	renderSourceBox = () => {
		const {renderSourceBox} = this.props;
		const props = {
			parameterName: FIELDS.row,
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
