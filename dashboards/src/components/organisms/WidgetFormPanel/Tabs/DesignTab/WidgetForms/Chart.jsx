// @flow
import {ColorPicker} from 'components/molecules';
import {FIELDS, OPTIONS, styles, VALUES} from 'components/organisms/WidgetFormPanel';
import {FormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import type {Node} from 'react';
import React, {Fragment} from 'react';
import type {SelectProps} from 'components/organisms/WidgetFormPanel/types';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class Chart extends FormBuilder {
	state = {
		colorIndex: 0,
		currentColor: '',
		showPalette: false
	};

	openColorPicker = (color: string, index: number) => (): void => {
		this.setState({
			colorIndex: index,
			currentColor: color,
			showPalette: true
		});
	};

	changeColor = (itemColor: string): void => {
		const {colorIndex} = this.state;
		const {setFieldValue, values} = this.props;
		let colors = values[FIELDS.colors] || VALUES.COLORS;
		colors[colorIndex] = itemColor;

		this.setState({
			showPalette: false
		});
		setFieldValue(FIELDS.colors, colors);
	};

	closePicker = (): void => {
		this.setState({showPalette: false});
	};

	renderVisibilityCheckBoxes = () => {
		const {axis, values} = this.props;
		const {showLegend, showValue, showXAxis, showYAxis} = FIELDS;
		let fields = [
			{
				label: 'Значение',
				name: showValue,
				value: values[showValue]
			},
			{
				hideDivider: true,
				label: 'Легенду',
				name: showLegend,
				value: values[showLegend]
			}
		];

		if (axis) {
			const axisFields = [
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
			fields = [...axisFields, ...fields];
		}

		return <div className="mb-2">{fields.map(this.renderCheckBox)}</div>;
	};

	renderColor = (color: string, index: number) => (
		<div
			className={styles.itemPalette}
			key={index}
			onClick={this.openColorPicker(color, index)}
			style={{background: color}}
		/>
	);

	renderColorPalette = (): Node => {
		const {values} = this.props;
		const colors = values[FIELDS.colors] || VALUES.COLORS;

		return (
			<div className={styles.colorPaletteWrap}>
				{colors.map(this.renderColor)}
			</div>
		);
	};

	renderColorPicker = () => {
		const {currentColor, showPalette} = this.state;

		if (showPalette) {
			return (
				<div className={styles.palettePicker}>
					<ColorPicker onClick={this.changeColor} closePicker={this.closePicker} currentColor={currentColor} />
				</div>
			);
		}
	};

	renderInputs = () => {
		const {values} = this.props;
		const {legendPosition} = FIELDS;

		const legendPositionProps: SelectProps = {
			name: legendPosition,
			options: OPTIONS.LEGEND_POSITIONS,
			placeholder: 'Расположение легенды',
			value: values[legendPosition]
		};

		return (
			<Fragment>
				{this.renderVisibilityCheckBoxes()}
				{this.renderSelect(legendPositionProps)}
				{this.renderColorPalette()}
				{this.renderColorPicker()}
			</Fragment>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(Chart);
