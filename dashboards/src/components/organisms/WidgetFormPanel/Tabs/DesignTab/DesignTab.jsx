// @flow
import type {CheckBoxProps, SelectProps} from 'components/organisms/WidgetFormPanel/types';
import {ColorPicker, Divider} from 'components/atoms';
import {FormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import type {Node} from 'react';
import React from 'react';
import styles from 'components/organisms/WidgetFormPanel/styles.less';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class DesignTab extends FormBuilder {
	state = {
		currentColor: '#ffffff',
		colors: [
			'#EA3223',
			'#999999',
			'#2C6FBA',
			'#4EAD5B',
			'#DE5D30',
			'#67369A',
			'#F6C142',
			'#4CAEEA',
			'#A1BA66',
			'#B02318',
			'#536130',
			'#DCA5A2',
			'#928A5B',
			'#9BB3D4',
			'#8C4A1C',
			'#FFFE55'
		],
		colorIndex: 0,
		pallete: false
	};

	renderVisibilityLegend = () => {
		const {values} = this.props;
		const fields = [
			{
				key: 0,
				label: 'Выводить название осей',
				name: 'areAxisesNamesShown',
				value: values.areAxisesNamesShown
			},
			{
				key: 1,
				label: 'Выводить подписи осей',
				name: 'areAxisesLabelsShown',
				value: values.areAxisesLabelsShown
			},
			{
				key: 2,
				label: 'Выводить подписи значений',
				name: 'areAxisesMeaningsShown',
				value: values.areAxisesMeaningsShown
			}
		];

		return <div>{fields.map(this.renderLegendField)}</div>;
	};

	renderLegendField = (checkBox: CheckBoxProps) => (
		<div key={checkBox.key} className={styles.checkboxContainerLeft}>
			{this.renderCheckBox(checkBox)}
			<Divider className={styles.dividerLeft} />
		</div>
	);

	openColorPicker = (color: string, index: number) => (event: Event): void => {
		this.setState({
			currentColor: color,
			colorIndex: index,
			pallete: true
		});
	};

	changeColor = (itemColor: string): void => {
		const {colors, colorIndex} = this.state;
		const {handleChange} = this.props;

		this.setState(state => {
			state.colors[colorIndex] = itemColor;
			state.pallete = false;

			return state;
		});

		handleChange('color', colors);
	};

	closePicker = (): void => {
		this.setState({pallete: false});
	};

	renderColor = (color: string, index: number) => {
		return <div
			className={styles.itemPallete}
			key={index}
			onClick={this.openColorPicker(color, index)}
			style={{background: color}}
		/>;
	};

	renderColorPallete = (): Node => {
		const {colors} = this.state;

		return (
			<div className={styles.colorPalleteWrap}>
				{colors.map(this.renderColor)}
			</div>
		);
	};

	renderColorPicker = () => {
		const {currentColor, pallete} = this.state;
		const node = pallete ? <ColorPicker onClick={this.changeColor} closePicker={this.closePicker} currentColor={currentColor} /> : <div />;

		return <div className={styles.palletePicker}>{node}</div>;
	};

	renderInputs = () => {
		const {values} = this.props;

		const nameVisibility: CheckBoxProps = {
			key: 3,
			label: 'Название виджета',
			name: 'isNameShown',
			value: values.isNameShown
		};

		const legendPosition: SelectProps = {
			label: 'Положение легенды',
			name: 'legendPosition',
			options: [
				{value: 'right', label: 'Справа'},
				{value: 'left', label: 'Слева'},
				{value: 'top', label: 'Вверху'},
				{value: 'bottom', label: 'Внизу'}
			],
			placeholder: '',
			value: values.legendPosition
		};

		const legendVisibility: CheckBoxProps = {
			key: 4,
			label: 'Выводить легенду',
			name: 'isLegendShown',
			value: values.isLegendShown
		};

		return (
			<section className={styles.main}>
				{this.renderCheckBox(nameVisibility)}
				<Divider />
				{this.renderCheckBox(legendVisibility)}
				{this.renderSelect(legendPosition)}
				{this.renderVisibilityLegend()}
				{this.renderColorPallete()}
				{this.renderColorPicker()}
			</section>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(DesignTab);
