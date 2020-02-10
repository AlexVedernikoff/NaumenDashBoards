// @flow
import {Button, FieldError, IconButton, MaterialDateInput, MaterialTextInput} from 'components/atoms';
import cn from 'classnames';
import {CONDITION_TYPES} from 'store/customGroups/constants';
import {CrossIcon as RemoveIcon} from 'icons/form';
import {DATETIME_OPTIONS, INTEGER_OPTIONS} from './constants';
import {FIELDS} from 'components/molecules/GroupCreatingModal/constants';
import {GROUP_TYPES} from 'store/widgets/constants';
import mainStyles from 'components/molecules/GroupCreatingModal/styles.less';
import {MaterialSelect} from 'components/molecules';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';
import {withGroup} from 'components/molecules/GroupCreatingModal';

export class CustomSubGroupOrCondition extends PureComponent<Props, State> {
	state = {
		options: []
	};

	componentDidMount () {
		const options = this.getOptions();
		this.setState({options});
	}

	getOptions = () => {
		const {type} = this.props;
		const {DATETIME, INTEGER} = GROUP_TYPES;

		switch (type) {
			case DATETIME:
				return DATETIME_OPTIONS;
			case INTEGER:
				return INTEGER_OPTIONS;
		}
	};

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
		const {
			BETWEEN,
			EQUAL,
			GREATER,
			LAST,
			LESS,
			NEAR,
			NOT_EQUAL,
			NOT_EQUAL_NOT_EMPTY
		} = CONDITION_TYPES;

		switch (type) {
			case BETWEEN:
				return this.renderBetweenData();
			case EQUAL:
			case GREATER:
			case LAST:
			case LESS:
			case NEAR:
			case NOT_EQUAL:
			case NOT_EQUAL_NOT_EMPTY:
				return this.renderNumberData();
		}
	};

	renderOperandSelect = () => {
		const {condition, index} = this.props;
		const {options} = this.state;
		const value = options.find(o => o.value === condition.type) || options[0];

		return (
			<div className={styles.operandSelect}>
				<MaterialSelect
					name={index}
					onSelect={this.handleSelectOperandType}
					options={options}
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
		const containerCN = cn({
			[styles.removeButtonContainer]: true,
			[styles.hiddenRemoveButtonContainer]: isLast
		});

		return (
			<div className={containerCN}>
				<IconButton onClick={this.handleClickRemoveButton}>
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

export default withGroup(CustomSubGroupOrCondition);
