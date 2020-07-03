// @flow
import cn from 'classnames';
import {ColorInput, FormField} from 'components/molecules';
import {FIELDS} from 'WidgetFormPanel/index';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {OnChangeInputEvent} from 'components/types';
import type {Props} from './types';
import type {Props as ColorInputProps} from 'components/molecules/ColorInput/components/Input/types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {TextInput} from 'components/atoms';

export class RangeField extends PureComponent<Props> {
	getColorBrightness = (color: string) => Math.round(
			0.2126 * this.getColorNumber(color, 0)
		+ 0.7152 * this.getColorNumber(color, 2)
		+ 0.0722 * this.getColorNumber(color, 4)
	);

	getColorNumber = (color: string, from: number) => parseInt(`0x${color.substr(from, 2)}`);

	handleChange = (event: OnChangeInputEvent) => {
		const {index, onChange, range} = this.props;
		const {name, value} = event;

		onChange(index, {
			...range,
			[name]: value
		});
	};

	handleChangeToRange = (event: OnChangeInputEvent) => {
		const {index, onChangeToRange, usePercent} = this.props;
		let value = String(event.value);

		if (usePercent) {
			value = value.replace(/%/g, '');
		}

		if (/^(\d+)?$/.test(value) && (!usePercent || Number(value) <= 100)) {
			onChangeToRange(index, value);
		}
	};

	handleRemove = () => {
		const {index, onRemove} = this.props;
		onRemove(index);
	};

	modifyValue = (value: string | number) => this.props.usePercent ? `${value}%` : value;

	renderColorInput = (props: ColorInputProps) => {
		const {forwardedRef, onClick, value} = props;
		const brightness = this.getColorBrightness(value.substring(1, 6));
		const inputCN = cn({
			[styles.colorInput]: true,
			[styles.insetColorShadow]: brightness > 225
		});

		return <div className={inputCN} onClick={onClick} ref={forwardedRef} style={{backgroundColor: value}} />;
	};

	renderRemoveIcon = () => {
		const {removable} = this.props;
		const iconCN = cn({
			[styles.removeIcon]: true,
			[styles.invisibleRemoveIcon]: !removable
		});

		return (
			<div className={iconCN} onClick={this.handleRemove} title="Удалить">
				<Icon name={ICON_NAMES.BASKET} />
			</div>
		);
	};

	render () {
		const {index, range, usePercent} = this.props;
		const {color, from, to} = range;
		const toRangeDisabled = usePercent && index > 0 && Number(to) === 100;

		return (
			<FormField className={styles.container} row>
				{this.renderRemoveIcon()}
				<ColorInput
					components={{Input: this.renderColorInput}}
					name={FIELDS.color}
					onChange={this.handleChange}
					value={color}
				/>
				<TextInput
					className={styles.fromField}
					disabled={usePercent}
					name="from"
					onChange={this.handleChange}
					value={this.modifyValue(from)}
				/>
				<TextInput
					className={styles.toField}
					disabled={toRangeDisabled}
					onChange={this.handleChangeToRange}
					value={this.modifyValue(to)}
				/>
			</FormField>
		);
	}
}

export default RangeField;
