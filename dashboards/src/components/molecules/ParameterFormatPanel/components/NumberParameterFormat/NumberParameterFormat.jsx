// @flow
import {AXIS_FORMAT_FIELDS} from 'components/organisms/WidgetFormPanel/constants';
import Checkbox from 'components/atoms/Checkbox';
import FormControl from 'components/molecules/FormControl';
import FormField from 'components/molecules/FormField';
import {NOTATION_FORMATS} from 'store/widgets/data/constants';
import {NOTATION_FORMATS_OPTIONS} from './constants';
import NumberInput from 'components/atoms/NumberInput';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import Select from 'components/molecules/Select';
import SelectWithCustomEdit from 'components/molecules/SelectWithCustomEdit';
import styles from './styles.less';
import t from 'localization';
import Toggle from 'components/atoms/Toggle';

export class NumberParameterFormat extends PureComponent<Props> {
	handleChange = ({name, value: changeValue}, callback?: Function) => {
		const {onChange, value} = this.props;

		onChange({...value, [name]: changeValue}, callback);
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
		const options = t('NumberParameterFormat::AdditionalOptions');

		return (
			<FormField label={t('NumberParameterFormat::Additional')} small>
				<SelectWithCustomEdit
					name={AXIS_FORMAT_FIELDS.additional}
					onSelect={this.handleChange}
					options={options}
					placeholder={t('NumberParameterFormat::AdditionalOptionsUndefined')}
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
				<FormControl label={t('NumberParameterFormat::NumberFormat')} reverse={true}>
					<Toggle checked={showNotation} name={AXIS_FORMAT_FIELDS.notation} onChange={this.toggleNotation} value={showNotation} />
				</FormControl>
			</FormField>
		);
	};

	renderNotationValue = () => {
		const {value} = this.props;
		const {notation} = value;

		if (notation) {
			const options = NOTATION_FORMATS_OPTIONS.map(({label, value}) => ({label: t(label), value}));
			const notationValue = options.find(item => item.value === notation);
			return (
				<FormField small>
					<Select
						name={AXIS_FORMAT_FIELDS.notation}
						onSelect={this.handleNotationValue}
						options={options}
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
				<FormControl label={t('NumberParameterFormat::SplitDigits')} small>
					<Checkbox
						checked={splitDigits}
						name={AXIS_FORMAT_FIELDS.splitDigits}
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
				<FormField label={t('NumberParameterFormat::SymbolsAfterComma')} small>
					<NumberInput
						max={5}
						min={0}
						name={AXIS_FORMAT_FIELDS.symbolCount}
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
