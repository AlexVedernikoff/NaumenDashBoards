// @flow
import {AttributeValuesMultiSelectCodeList, AttributesData, AttributesTypeList, AttributesValue} from 'store/attributes/types';
import Button from 'components/atoms/Button';
import Checkbox from 'components/atoms/Checkbox';
import FormControl from 'components/molecules/FormControl';
import FormField from 'components/molecules/FormField';
import type {Props} from 'containers/VerificationContent/types';
import RadioButton from 'components/atoms/RadioButton';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class VerificationContent extends PureComponent<Props> {
	checkRenderTypeField = ({code, listType, values}: AttributesData) => {
		return values.map((value: AttributesValue) => {
			switch (listType) {
				case AttributesTypeList.RADIO:
					return this.renderRadioField(value, code);
				case AttributesTypeList.CHECK:
					return this.renderCheckboxField(value, code);
				default:
					return null;
			}
		});
	};

	handleCheckboxValue = (value: AttributesValue) => {
		const {setVerificationValue, verification} = this.props;
		const isSave = verification.values.some(v => v.UUID === value.UUID);
		const isMultiSelect = AttributeValuesMultiSelectCodeList.some(code => code === value.code);
		const valuesDefault = verification.values.filter(filterItem => !AttributeValuesMultiSelectCodeList.some(code => code === filterItem.code));

		if (valuesDefault.length < 1 || isMultiSelect || isSave) {
			setVerificationValue(isSave ? verification.values.filter(v => v.UUID !== value.UUID) : [...verification.values, value]);
		}
	};

	handleNextVerification = async () => {
		const {sendVerificationValue, setIndexVerification, setVerificationValue, verification} = this.props;

		await sendVerificationValue();

		if (!verification.isFullChecked) {
			const index = verification.index + 1;

			setIndexVerification(index);
			setVerificationValue([]);
		}
	};

	handleRadioValue = (value: AttributesValue) => {
		const {setVerificationValue, verification} = this.props;
		const isSome = verification.values.some(v => v.UUID === value.UUID);

		setVerificationValue(isSome ? [] : [value]);
	};

	renderCheckboxField = (field: AttributesValue, code: string) => {
		const {verification} = this.props;
		const checked = verification.values.some(value => value.UUID === field.UUID);
		const isMultiSelect = AttributeValuesMultiSelectCodeList.some(code => code === field.code);
		const valuesDefault = verification.values.filter(filterItem => !AttributeValuesMultiSelectCodeList.some(code => code === filterItem.code));

		const onClick = () => {
			this.handleCheckboxValue(field);
		};

		return (
			<FormField key={field.UUID} small>
				<FormControl className={valuesDefault.length > 0 && !isMultiSelect && styles.disabled} label={field.title} onClickLabel={onClick}>
					<Checkbox checked={checked} name={code} onChange={onClick} value={field.UUID} />
				</FormControl>
			</FormField>
		);
	};

	renderRadioField = (field: AttributesValue, code: string) => {
		const {verification} = this.props;
		const checked = verification.values.some(value => { return value.UUID === field.UUID; });

		const onClick = () => {
			this.handleRadioValue(field);
		};

		return (
			<FormField key={field.UUID} small>
				<FormControl label={field.title} onClickLabel={onClick}>
					<RadioButton checked={checked} name={code} onChange={onClick} value={field.UUID} />
				</FormControl>
			</FormField>
		);
	};

	render () {
		const {attributes, setVerificationCode, verification} = this.props;
		const attribute = attributes[verification.index];

		if (attribute) {
			setVerificationCode(attribute.code);

			if (verification.isFullChecked) {
				return (
					<div className={styles.content}>
						{verification.message}
					</div>
				);
			}

			return (
				<div className={styles.content}>
					{this.checkRenderTypeField(attribute)}
					<FormField small>
						<Button onClick={this.handleNextVerification}>Проверка проведена</Button>
					</FormField>
				</div>
			);
		}

		return null;
	}
}

export default VerificationContent;
