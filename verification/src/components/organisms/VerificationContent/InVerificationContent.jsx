// @flow
import {AttributesData, AttributesTypeList, AttributesValue} from 'store/attributes/types';
import Button from 'components/atoms/Button';
import Checkbox from 'components/atoms/Checkbox';
import FormControl from 'components/molecules/FormControl';
import FormField from 'components/molecules/FormField';
import type {Props} from 'containers/VerificationContent/types';
import RadioButton from 'components/atoms/RadioButton';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class VerificationContent extends PureComponent<Props> {
	componentDidMount () {
		const {attributes, setVerificationAttribute, verification} = this.props;

		const attribute = attributes[verification.index];

		setVerificationAttribute({...attribute, values: []});
	}

	checkRenderTypeField = ({code, typeList, values}: AttributesData) => {
		return values.map((value: AttributesValue) => {
			switch (typeList) {
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
		const {setVerificationAttribute, verification} = this.props;
		const values = verification?.attribute?.values || [];
		const isSome = values.some(v => v.UUID === value.UUID);

		setVerificationAttribute({...verification.attribute, values: isSome ? values.filter(v => v.UUID !== value.UUID) : [...values, value]});
	};

	handleNextVerification = async () => {
		const {attributes, sendVerificationValue, setIndexVerification, setVerificationAttribute, verification} = this.props;

		await sendVerificationValue();

		if (!verification.isFullChecked) {
			const index = verification.index + 1;
			const attribute = attributes[index];

			setIndexVerification(index);
			setVerificationAttribute({...attribute, values: []});
		}
	};

	handleRadioValue = (value: AttributesValue) => {
		const {setVerificationAttribute, verification} = this.props;
		const values = verification?.attribute?.values || [];
		const isSome = values.some(v => v.UUID === value.UUID);

		setVerificationAttribute({...verification.attribute, values: isSome ? [] : [value]});
	};

	renderCheckboxField = ({UUID, title}: AttributesValue, code: string) => {
		const {verification} = this.props;
		const checked = verification.attribute?.values.some(value => { return value.UUID === UUID; });

		return (
			<FormField key={UUID} small>
				<FormControl label={title} onClickLabel={e => {
					this.handleCheckboxValue({UUID, title});
				}}>
					<Checkbox checked={checked} name={code} value={UUID} />
				</FormControl>
			</FormField>
		);
	};

	renderRadioField = ({UUID, title}: AttributesValue, code: string) => {
		const {verification} = this.props;
		const checked = verification.attribute?.values.some(value => { return value.UUID === UUID; });

		return (
			<FormField key={UUID} small>
				<FormControl label={title} onClickLabel={e => {
					this.handleRadioValue({UUID, title});
				}}>
					<RadioButton checked={checked} name={code} value={UUID} />
				</FormControl>
			</FormField>
		);
	};

	render () {
		const {attributes, verification} = this.props;
		const attribute = attributes[verification.index];

		if (attribute) {
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
						<Button onClick={this.handleNextVerification}>Проверка проведенна</Button>
					</FormField>
				</div>
			);
		}

		return null;
	}
}

export default VerificationContent;
