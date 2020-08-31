// @flow
import type {DataBuilderProps} from 'WidgetFormPanel/builders/DataFormBuilder/types';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {LegacyCheckbox as Checkbox} from 'components/atoms';
import React, {Component, Fragment} from 'react';
import {withDataFormBuilder} from 'WidgetFormPanel/builders';

export class ParamsTab extends Component<DataBuilderProps> {
	sourceRefFields = [FIELDS.breakdown, FIELDS.column, FIELDS.row];

	renderCalcTotalField = (name: string) => {
		const {setFieldValue, values} = this.props;

		return (
			<Checkbox
				label="Подсчитывать итоги"
				name={name}
				onClick={setFieldValue}
				value={values[name]}
			/>
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
		const {column, row} = FIELDS;
		const sourceRefFields = {
			indicator: column,
			parameter: row
		};

		return renderSourceBox(sourceRefFields);
	};

	render () {
		const {renderBaseBoxes, renderDisplayModeSelect, renderShowEmptyDataCheckbox} = this.props;

		return (
			<Fragment>
				{renderBaseBoxes()}
				{this.renderSourceBox()}
				{this.renderParameterBox()}
				{this.renderIndicatorBoxes()}
				{renderShowEmptyDataCheckbox()}
				{renderDisplayModeSelect()}
			</Fragment>
		);
	}
}

export default withDataFormBuilder(ParamsTab);
