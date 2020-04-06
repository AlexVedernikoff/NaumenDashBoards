// @flow
import {ColorPalette, SimpleSelect} from 'components/molecules';
import {DEFAULT_COLORS, LEGEND_POSITIONS} from 'utils/chart/constants';
import {FieldLabel} from 'components/atoms';
import {FIELDS, OPTIONS, styles} from 'components/organisms/WidgetFormPanel';
import {FormBuilder} from 'components/organisms/WidgetFormPanel/builders';
import React, {Fragment} from 'react';
import {WIDGET_TYPES} from 'store/widgets/data/constants';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class Chart extends FormBuilder {
	changeColor = (colorIndex: number, itemColor: string): void => {
		let colors = this.getColors();
		colors[colorIndex] = itemColor;

		this.props.setFieldValue(FIELDS.colors, colors);
	};

	getColors = () => this.props.values[FIELDS.colors] || [...DEFAULT_COLORS];

	renderColorPalette = () => (
		<div className={styles.field}>
			<FieldLabel text="Цвета диаграммы" />
			<ColorPalette colors={this.getColors()} onChange={this.changeColor} />
		</div>
	);

	renderLegendCheckbox = () => {
		const {showLegend} = FIELDS;
		const {values} = this.props;

		const props = {
			hideDivider: true,
			label: 'Легенду',
			name: showLegend,
			value: values[showLegend]
		};

		return this.renderCheckBox(props);
	};

	renderLegendPositionInput = () => {
		const {values} = this.props;
		const {legendPosition} = FIELDS;
		const {LEGEND_POSITIONS: options} = OPTIONS;
		const value = options.find(p => p.value === values[legendPosition]);
		const defaultValue = options.find(p => p.value === LEGEND_POSITIONS.bottom);

		return (
			<div className={styles.field}>
				<SimpleSelect
					defaultValue={defaultValue}
					name={legendPosition}
					onSelect={this.handleSelectLegend}
					options={options}
					value={value}
				/>
			</div>
		);
	};

	renderValueCheckbox = (): any => {
		const {showValue} = FIELDS;
		const {values} = this.props;

		const props = {
			label: 'Значение',
			name: showValue,
			value: values[showValue]
		};

		return this.renderCheckBox(props);
	};

	renderVisibilityAxisCheckboxes = (): any => {
		const {values} = this.props;
		const {showXAxis, showYAxis} = FIELDS;
		const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, LINE} = WIDGET_TYPES;
		const isAxisChart = [BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, LINE].includes(values.type);

		if (isAxisChart) {
			const fields = [
				{
					label: 'Название оси X',
					name: showXAxis,
					value: values[showXAxis]
				},
				{
					label: 'Название оси Y',
					name: showYAxis,
					value: values[showYAxis]
				}
			];

			return fields.map(this.renderCheckBox);
		}
	};

	render () {
		return (
			<Fragment>
				{this.renderValueCheckbox()}
				{this.renderVisibilityAxisCheckboxes()}
				{this.renderLegendCheckbox()}
				{this.renderLegendPositionInput()}
				{this.renderDivider('section')}
				{this.renderColorPalette()}
			</Fragment>
		);
	}
}

export default withForm(Chart);
