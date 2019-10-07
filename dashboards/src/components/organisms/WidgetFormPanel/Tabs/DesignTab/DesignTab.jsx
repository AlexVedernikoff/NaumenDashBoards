// @flow
import type {CheckBoxProps, SelectProps} from 'components/organisms/WidgetFormPanel/types';
import type {State} from './types';
import {ColorPicker, Divider, DropDownMenu} from 'components/atoms';
import {FormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import React, {Fragment} from 'react';
import styles from 'components/organisms/WidgetFormPanel/styles.less';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class DesignTab extends FormBuilder<{}, State> {
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
		indexColor: 0,
		pallete: false
	}

	renderVisibilityLegend = () => {
		const {values} = this.props;
		console.log(this);

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

		return (
			<div className={styles.dropdownMenuContainer}>
				<DropDownMenu name="Редактировать легенду">
					{fields.map(this.renderLegendField)}
				</DropDownMenu>
			</div>
		);
	};

	renderLegendField = (checkBox: CheckBoxProps) => (
		<div key={checkBox.key} className={styles.checkboxContainerLeft}>
			{this.renderCheckBox(checkBox)}
			<Divider className={styles.dividerLeft} />
		</div>
	);

	openColorPicker = (color: string, index: number): void => {
		this.setState({
			...this.state,
			indexColor: index,
			currentColor: color,
			pallete: true
		});
	}

	changeColor = (itemColor: string): void => {
		const {indexColor, colors} = this.state;
		const {handleChange} = this.props;

		this.setState(state => {
			state.colors[indexColor] = itemColor;
			state.pallete = false;
      return state;
		});
		handleChange('color', colors);
	}

	closePicker = (): void => {
		this.setState({pallete: false});
	}

	renderColorPallete = (): Fragment => {
		const {colors} = this.state;
		return (
			<Fragment>
				<div className={styles.colorPalleteWrap}>
					{colors.map((color: string, index: number) => {
						return <div
							key={index}
							onClick={(): void => this.openColorPicker(color, index)}
							className={styles.itemPallete}
							style={{background: color}}
						/>;
					})}
				</div>
				</Fragment>
		);
	};

	renderInputs = () => {
		const {values} = this.props;
		const {pallete, currentColor} = this.state;

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
				<Divider />
				{this.renderColorPallete()}
				<div className={styles.palletePicker}>
					{pallete ? <ColorPicker handleClick={this.changeColor} closePicker={this.closePicker} currentColor={currentColor}/> : null}
				</div>
			</section>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(DesignTab);
