// @flow
import cn from 'classnames';
import ColorInput from 'components/molecules/ColorInput';
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import FormField from 'components/molecules/FormField';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {OnChangeInputEvent} from 'components/types';
import type {Props} from './types';
import type {Props as ColorInputProps} from 'components/molecules/ColorInput/components/Value/types';
import {RANGES_TYPES} from 'store/widgets/data/constants';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import TextInput from 'components/atoms/TextInput';

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

	handleChangeAbsoluteRange = (event: OnChangeInputEvent) => {
		let value = String(event.value);

		if (/^-?(\d+)?(\.)?(\d{1,4})?$/.test(value)) {
			this.handleChange(event);
		}
	};

	handleChangePercentRange = (event: OnChangeInputEvent) => {
		let {name, value} = event;

		value = String(value).replace(/%/g, '');

		if (/^(\d{1,3})?$/.test(value) && (name !== FIELDS.to || Number(value) <= 100)) {
			this.handleChange({...event, value});
		}
	};

	handleChangeRange = (event: OnChangeInputEvent) => this.hasPercentType()
		? this.handleChangePercentRange(event)
		: this.handleChangeAbsoluteRange(event);

	handleRemove = () => {
		const {index, onRemove} = this.props;

		onRemove(index);
	};

	hasPercentType = () => this.props.type === RANGES_TYPES.PERCENT;

	modifyValue = (value: string | number) => this.hasPercentType() ? `${value}%` : value;

	renderColorValue = (props: ColorInputProps) => {
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
		const {index, range} = this.props;
		const {color, from, to} = range;
		const hasPercentType = this.hasPercentType();
		const toRangeDisabled = hasPercentType && index > 0 && Number(to) === 100;

		return (
			<FormField className={styles.container} row>
				{this.renderRemoveIcon()}
				<ColorInput
					components={{Value: this.renderColorValue}}
					name={FIELDS.color}
					onChange={this.handleChange}
					value={color}
				/>
				<TextInput
					className={styles.fromField}
					disabled={hasPercentType}
					name={FIELDS.from}
					onChange={this.handleChangeRange}
					value={this.modifyValue(from)}
				/>
				<TextInput
					className={styles.toField}
					disabled={toRangeDisabled}
					name={FIELDS.to}
					onChange={this.handleChangeRange}
					value={this.modifyValue(to)}
				/>
			</FormField>
		);
	}
}

export default RangeField;
