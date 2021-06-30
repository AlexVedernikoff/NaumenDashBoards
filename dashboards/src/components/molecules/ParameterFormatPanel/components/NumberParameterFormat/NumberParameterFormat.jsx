// @flow
import {ADDITIONAL_OPTIONS, ADDITIONAL_OPTIONS_UNDEFINED, NOTATION_FORMATS_OPTIONS} from './constants';
import Checkbox from 'components/atoms/Checkbox';
import FormControl from 'components/molecules/FormControl';
import FormField from 'components/molecules/FormField';
import {LABEL_FORMAT_FIELDS} from 'components/organisms/WidgetFormPanel/constants';
import {NOTATION_FORMATS} from 'store/widgets/data/constants';
import NumberInput from 'components/atoms/NumberInput';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import Select from 'components/molecules/Select';
import SelectWithCustomEdit from 'components/molecules/SelectWithCustomEdit';
import styles from './styles.less';
import Toggle from 'components/atoms/Toggle';

export class NumberParameterFormat extends PureComponent<Props> {
	handleChange = ({name, value: changeValue}) => {
		const {onChange, value} = this.props;

		onChange({...value, [name]: changeValue});
	};

	handleChangeChecked = ({name, value: changeValue}) => {
		const {onChange, value} = this.props;
		return onChange({...value, [name]: !changeValue});
	};

	handleNotationValue = ({name, value: {value}}) => {
		this.handleChange({name, value});
	};

	toggleNotation = ({name, value: changeValue}) => {
		const {onChange, value} = this.props;

		if (changeValue === false) {
			onChange({...value, [name]: NOTATION_FORMATS.THOUSAND});
		} else {
			onChange({...value, [name]: undefined});
		}
	};

	renderAdditional = () => {
		const {value} = this.props;
		const {additional} = value;

		return (
			<FormField label="Дополнительные обозначения" small>
				<SelectWithCustomEdit
					name={LABEL_FORMAT_FIELDS.additional}
					onSelect={this.handleChange}
					options={ADDITIONAL_OPTIONS}
					placeholder={ADDITIONAL_OPTIONS_UNDEFINED}
					value={additional}
				/>
			</FormField>
		);
	};

	renderNotation = () => {
		const {value} = this.props;
		const {notation} = value;
		const showNotation = !!notation;

		return (
			<FormField className={styles.singleControl} small>
				<FormControl label="Формат числа" reverse={true}>
					<Toggle checked={showNotation} name={LABEL_FORMAT_FIELDS.notation} onChange={this.toggleNotation} value={showNotation} />
				</FormControl>
			</FormField>
		);
	};

	renderNotationValue = () => {
		const {value} = this.props;
		const {notation} = value;

		if (notation) {
			const notationValue = NOTATION_FORMATS_OPTIONS.find(item => item.value === notation);
			return (
				<FormField small>
					<Select
						name={LABEL_FORMAT_FIELDS.notation}
						onSelect={this.handleNotationValue}
						options={NOTATION_FORMATS_OPTIONS}
						value={notationValue}
					/>
				</FormField>
			);
		}

		return null;
	};

	renderSplitDigits = () => {
		const {value} = this.props;
		const {splitDigits = false} = value;

		return (
			<FormField className={styles.singleControl} small>
				<FormControl label="Разделить разряды" small>
					<Checkbox
						checked={splitDigits}
						name={LABEL_FORMAT_FIELDS.splitDigits}
						onChange={this.handleChangeChecked}
						value={splitDigits}
					/>
				</FormControl>
			</FormField>
		);
	};

	renderSymbolCount = () => {
		const {showSymbolCount, value} = this.props;
		const {symbolCount} = value;

		if (showSymbolCount) {
			return (
				<FormField label="Количество знаков после запятой" small>
					<NumberInput
						max={5}
						min={0}
						name={LABEL_FORMAT_FIELDS.symbolCount}
						onChange={this.handleChange}
						value={symbolCount ?? 0}
					/>
				</FormField>
			);
		}

		return null;
	};

	render () {
		return (
			<Fragment>
				{this.renderAdditional()}
				{this.renderSymbolCount()}
				{this.renderSplitDigits()}
				{this.renderNotation()}
				{this.renderNotationValue()}
			</Fragment>
		);
	}
}
