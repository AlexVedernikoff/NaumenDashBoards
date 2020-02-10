// @flow
import {Button, FieldError, IconButton, MaterialDateInput, MaterialTextInput} from 'components/atoms';
import cn from 'classnames';
import {CONDITION_OPTIONS} from './constants';
import {CONDITION_TYPES} from 'store/customGroups/constants';
import {CrossIcon as RemoveIcon} from 'icons/form';
import {FIELDS} from 'components/molecules/GroupCreatingModal/constants';
import mainStyles from 'components/molecules/GroupCreatingModal/styles.less';
import {MaterialSelect} from 'components/molecules';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class CustomSubGroupOrCondition extends PureComponent<Props> {
	handleChangeDateData = (name: string, date: string) => {
		const {condition, index, onUpdate} = this.props;
		let {data} = condition;

		if (!data || (data && typeof data !== 'object')) {
			data = {
				endDate: '',
				startDate: ''
			};
		}

		onUpdate(index, {
			...condition,
			data: {
				...data,
				[name]: date
			}
		});
	};

	handleChangeNumberData = (name: string, numberData: string) => {
		const {condition, index, onUpdate} = this.props;
		const data = numberData ? Number(numberData) : null;

		onUpdate(index, {
			...condition,
			data
		});
	};

	handleClickRemoveButton = () => {
		const {index, onRemove} = this.props;
		onRemove(index);
	};

	handleSelectOperandType = (index: number, value: Object) => {
		const {onUpdate} = this.props;
		const {value: type} = value;

		onUpdate(index, {
			data: null,
			type
		});
	};

	renderBetweenData = () => {
		const {data} = this.props.condition;
		let startDate = '';
		let endDate = '';

		if (data && typeof data === 'object') {
			startDate = data.startDate;
			endDate = data.endDate;
		}

		return (
			<div className={styles.dateFieldContainer}>
				{this.renderDateField(FIELDS.startDate, startDate)}
				{this.renderDateField(FIELDS.endDate, endDate)}
				{this.renderDataError()}
			</div>
		);
	};

	renderDataError = () => {
		const {errors, validationPath} = this.props;
		const errorKey = `${validationPath}.${FIELDS.data}`;

		return <FieldError className={cn(mainStyles.error, styles.error)} text={errors[errorKey]} />;
	};

	renderDateField = (name: string, date: string) => (
		<div className={styles.dateField}>
			<MaterialDateInput name={name} onChange={this.handleChangeDateData} value={date} />
		</div>
	);

	renderNumberData = () => {
		const {data} = this.props.condition;
		const value = typeof data === 'number' ? data : '';

		return (
			<div className={styles.numberField}>
				<MaterialTextInput onChange={this.handleChangeNumberData} onlyNumber={true} value={value} />
			</div>
		);
	};

	renderOperand = () => (
		<div className={styles.operand}>
			{this.renderOperandSelect()}
			{this.renderOperandDataByType()}
		</div>
	);

	renderOperandDataByType = () => {
		const {type} = this.props.condition;
		const {BETWEEN, LAST, NEAR} = CONDITION_TYPES;

		switch (type) {
			case BETWEEN:
				return this.renderBetweenData();
			case LAST:
			case NEAR:
				return this.renderNumberData();
		}
	};

	renderOperandSelect = () => {
		const {condition, index} = this.props;
		const value = CONDITION_OPTIONS.find(o => o.value === condition.type) || CONDITION_OPTIONS[0];

		return (
			<div className={styles.operandSelect}>
				<MaterialSelect
					name={index}
					onSelect={this.handleSelectOperandType}
					options={CONDITION_OPTIONS}
					value={value}
				/>
			</div>
		);
	};

	renderOrOperator = () => {
		const {disabled, onCreate} = this.props;

		return (
			<div className={styles.orOperator}>
				<Button
					disabled={disabled}
					onClick={onCreate}
					variant={BUTTON_VARIANTS.SIMPLE}
				>
					ИЛИ
				</Button>
			</div>
		);
	};

	renderRemoveButton = () => {
		const {isLast} = this.props;
		const removeButtonCN = isLast && styles.hiddenRemoveButton;

		return (
			<div className={styles.removeButtonContainer}>
				<IconButton className={removeButtonCN} onClick={this.handleClickRemoveButton}>
					<RemoveIcon />
				</IconButton>
			</div>
		);
	};

	render () {
		return (
			<div className={styles.container}>
				{this.renderOperand()}
				{this.renderOrOperator()}
				{this.renderRemoveButton()}
			</div>
		);
	}
}

export default CustomSubGroupOrCondition;
