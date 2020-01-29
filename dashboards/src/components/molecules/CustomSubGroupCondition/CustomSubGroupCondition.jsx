// @flow
import cn from 'classnames';
import {CrossIcon as RemoveIcon} from 'icons/form';
import {IconButton, MaterialDateInput, MaterialTextInput} from 'components/atoms';
import {MaterialSelect} from 'components/molecules';
import {OPERAND_OPTIONS} from './constants';
import {OPERAND_TYPES, OPERATORS} from 'store/customGroups/constants';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';

export class CustomSubGroupCondition extends PureComponent<Props> {
	handleSelectOperandType = (conditionId: string, value: Object) => {
		const {data, onUpdate} = this.props;
		const {value: type} = value;
		onUpdate({
			...data,
			operand: {
				data: null,
				type
			}
		});
	};

	handleClickOperator = (operator: $Keys<typeof OPERATORS>) => () => {
		const {data, onCreate} = this.props;
		onCreate({...data, operator});
	};

	handleClickRemoveButton = () => {
		const {data, onRemove, prev} = this.props;
		const prevId = prev ? prev.id : '';

		onRemove(data, prevId);
	};

	handleChangeDateData = (name: string, date: string) => {
		const {data, onUpdate} = this.props;
		let operandData = data.operand.data;

		if (!operandData || (operandData && typeof operandData !== 'object')) {
			operandData = {
				endDate: '',
				startDate: ''
			};
		}

		onUpdate({
			...data,
			operand: {
				...data.operand,
				data: {
					...operandData,
					[name]: date
				}
			}
		});
	};

	handleChangeNumberData = (name: string, numberData: string) => {
		const {data, onUpdate} = this.props;
		onUpdate({
			...data,
			operand: {
				...data.operand,
				data: Number(numberData)
			}
		});
	};

	renderAndOperator = () => {
		const {operator} = this.props.data;
		const {AND} = OPERATORS;

		if (operator === AND) {
			const andOperatorCN = cn({
				[styles.andOperator]: true,
				[styles.disabledAndOperator]: operator === AND
			});

			return (
				<div className={andOperatorCN}>
					<span onClick={this.handleClickOperator(AND)}>И</span>
				</div>
			);
		}
	};

	renderBetweenData = () => {
		const {data} = this.props.data.operand;
		let startDate = '';
		let endDate = '';

		if (data && typeof data === 'object') {
			startDate = data.startDate;
			endDate = data.endDate;
		}

		return (
			<Fragment>
				{this.renderDateField('startDate', startDate)}
				{this.renderDateField('endDate', endDate)}
			</Fragment>
		);
	};

	renderDateField = (name: string, date: string) => (
		<div className={styles.dateField}>
			<MaterialDateInput name={name} onChange={this.handleChangeDateData} value={date} />
		</div>
	);

	renderNumberData = () => {
		const {data} = this.props.data.operand;
		const value = typeof data === 'number' ? data : 0;

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
		const {type} = this.props.data.operand;
		const {BETWEEN, LAST, NEAR} = OPERAND_TYPES;

		switch (type) {
			case BETWEEN:
				return this.renderBetweenData();
			case LAST:
			case NEAR:
				return this.renderNumberData();
		}
	};

	renderOperandSelect = () => {
		const {id, operand} = this.props.data;
		const {type} = operand;
		const value = OPERAND_OPTIONS.find(o => o.value === type) || OPERAND_OPTIONS[0];

		return (
			<div className={styles.operandSelect}>
				<MaterialSelect
					name={id}
					onSelect={this.handleSelectOperandType}
					options={OPERAND_OPTIONS}
					value={value}
				/>
			</div>
		);
	};

	renderOrOperator = () => {
		const {operator} = this.props.data;
		const orOperatorCN = cn({
			[styles.orOperator]: true,
			[styles.disabledOrOperator]: operator === OPERATORS.OR
		});

		return (
			<div className={orOperatorCN} onClick={this.handleClickOperator(OPERATORS.OR)}>ИЛИ</div>
		);
	};

	renderRemoveButton = () => {
		const {isLast} = this.props;
		let button;

		if (!isLast) {
			button = (
				<IconButton onClick={this.handleClickRemoveButton}>
					<RemoveIcon />
				</IconButton>
			);
		}

		return (
			<div className={styles.removeButton}>
				{button}
			</div>
		);
	};

	render () {
		const {prev} = this.props;
		const isAdditionalCondition = prev && prev.operator !== OPERATORS.AND;
		const conditionCN = cn({
			[styles.condition]: true,
			[styles.additionalCondition]: isAdditionalCondition
		});

		return (
			<Fragment>
				<div className={conditionCN}>
					{this.renderOperand()}
					{this.renderOrOperator()}
					{this.renderRemoveButton()}
				</div>
				{this.renderAndOperator()}
			</Fragment>
		);
	}
}

export default CustomSubGroupCondition;
