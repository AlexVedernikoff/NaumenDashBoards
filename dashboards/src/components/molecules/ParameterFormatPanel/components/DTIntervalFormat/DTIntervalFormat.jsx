// @flow
import {AXIS_FORMAT_FIELDS} from 'components/organisms/WidgetFormPanel/constants';
import {DT_INTERVAL_PERIOD} from 'store/widgets/data/constants';
import {DT_INTERVAL_PERIOD_OPTIONS} from './constants';
import FormField from 'components/molecules/FormField';
import Label from 'components/atoms/Label';
import type {LangType} from 'localization/localize_types';
import NumberInput from 'components/atoms/NumberInput';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import t from 'localization';
import T from 'components/atoms/Translation';

export class DTIntervalFormat extends PureComponent<Props> {
	handleChangeSymbolCount = ({value: newValue}) => {
		const {onChange, value} = this.props;
		return onChange({...value, symbolCount: newValue});
	};

	handleSelect = ({name, value: option}) => {
		const {onChange, value} = this.props;
		const newValue = {...value, [name]: option.value};

		if (name === AXIS_FORMAT_FIELDS.remainder) {
			const remainderIndex = DT_INTERVAL_PERIOD_OPTIONS.findIndex(item => item.value === newValue.remainder);
			const quotientIndex = DT_INTERVAL_PERIOD_OPTIONS.findIndex(item => item.value === newValue.quotient);

			if (remainderIndex >= quotientIndex) {
				newValue.quotient = DT_INTERVAL_PERIOD_OPTIONS[remainderIndex + 1].value;
			}
		}

		onChange(newValue);
	};

	renderLabel = () => {
		const {title} = this.props;
		return (<Label className={styles.label}>{title}</Label>);
	};

	renderRange = () => {
		const {value: {quotient, remainder}} = this.props;
		return (
			<FormField row>
				{this.renderRangeItem(
					'DTIntervalFormat::RemainderPart',
					AXIS_FORMAT_FIELDS.remainder,
					remainder,
					null
				)}
				{this.renderRangeItem(
					'DTIntervalFormat::QuotientPart',
					AXIS_FORMAT_FIELDS.quotient,
					quotient,
					remainder
				)}
			</FormField>
		);
	};

	renderRangeItem = (
		title: LangType,
		field: $Keys<typeof AXIS_FORMAT_FIELDS>,
		value: $Keys<typeof DT_INTERVAL_PERIOD>,
		boundary: $Keys<typeof DT_INTERVAL_PERIOD> | null
	) => {
		let options = DT_INTERVAL_PERIOD_OPTIONS;

		if (boundary) {
			const boundaryIndex = options.findIndex(item => item.value === boundary);

			options = options.slice(boundaryIndex + 1);
		} else {
			options = options.slice(0, -1);
		}

		const itemValue = options.find(option => option.value === value) ?? options[0];

		return (
			<div className={styles.containerItem}>
				<Label className={styles.selectLabel}>
					<T text={title} />
				</Label>
				<Select
					getOptionLabel={option => t(option.label)}
					name={field}
					onSelect={this.handleSelect}
					options={options}
					value={itemValue}
				/>
			</div>
		);
	};

	renderSymbolCount = () => {
		const {value: {symbolCount}} = this.props;
		return (
			<FormField label='Количество знаков после запятой'>
				<NumberInput
					max={5}
					min={0}
					name={AXIS_FORMAT_FIELDS.symbolCount}
					onChange={this.handleChangeSymbolCount}
					value={symbolCount}
				/>
			</FormField>
		);
	};

	render () {
		return (
			<>
				{this.renderLabel()}
				{this.renderRange()}
				{this.renderSymbolCount()}
			</>
		);
	}
}
