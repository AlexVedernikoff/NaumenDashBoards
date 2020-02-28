// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {
	BACK_BO_LINKS_OPTIONS,
	BO_LINKS_OPTIONS,
	CATALOG_ITEM_OPTIONS,
	CATALOG_ITEM_SET_OPTIONS,
	DATETIME_OPTIONS,
	INTERVAL_OPTIONS,
	META_CLASS_AND_STATE_OPTIONS,
	NUMBER_OPTIONS,
	OBJECT_OPTIONS,
	STRING_OPTIONS
} from './constants';
import {BetweenOperand, IntervalOperand, MultiSelectOperand, SelectOperand, SimpleOperand} from './components';
import type {
	BetweenOperand as BetweenOperandType,
	DateOrCondition,
	IntervalOperand as IntervalOperandType,
	IntervalOrCondition,
	MultiSelectOperand as MultiSelectOperandType,
	NumberOrCondition,
	RefOrCondition,
	SelectOperand as SelectOperandType,
	SimpleOperand as SimpleOperandType,
	StringOrCondition
} from 'store/customGroups/types';
import {Button, FieldError, IconButton} from 'components/atoms';
import cn from 'classnames';
import {createNewOrCondition} from 'components/molecules/GroupCreatingModal/helpers';
import {CrossIcon as RemoveIcon} from 'icons/form';
import {FIELDS} from 'components/molecules/GroupCreatingModal/constants';
import mainStyles from 'components/molecules/GroupCreatingModal/styles.less';
import {MaterialSelect} from 'components/molecules/index';
import {OPERAND_TYPES} from 'store/customGroups/constants';
import type {OrCondition as OrConditionType, Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';
import {withGroup} from 'components/molecules/GroupCreatingModal';

export class OrCondition extends PureComponent<Props, State> {
	state = {
		options: []
	};

	componentDidMount () {
		this.setState({options: this.getOptions()});
	}

	getAttributesData = (actual: boolean = true) => {
		const {attribute, attributesData, fetchAttributesData} = this.props;
		const {actualValues, allValues, metaClasses, states} = attributesData;
		const {metaClassFqn, property, type} = attribute;
		const {metaClass, state} = ATTRIBUTE_TYPES;
		let data;

		if (property && actual) {
			data = actualValues[property];
		}

		if (property && !actual) {
			data = allValues[property];
		}

		if (type === state) {
			data = states[metaClassFqn];
		}

		if (type === metaClass) {
			data = metaClasses[metaClassFqn];
		}

		if (!data) {
			fetchAttributesData(attribute, actual);
		}

		return data;
	};

	getOptions = () => {
		const {type} = this.props.attribute;
		const {
			backBOLinks,
			boLinks,
			catalogItem,
			catalogItemSet,
			date,
			dateTime,
			double,
			dtInterval,
			integer,
			metaClass,
			object,
			state,
			string
		} = ATTRIBUTE_TYPES;

		switch (type) {
			case date:
			case dateTime:
				return DATETIME_OPTIONS;
			case double:
			case integer:
				return NUMBER_OPTIONS;
			case backBOLinks:
				return BACK_BO_LINKS_OPTIONS;
			case boLinks:
				return BO_LINKS_OPTIONS;
			case catalogItem:
				return CATALOG_ITEM_OPTIONS;
			case catalogItemSet:
				return CATALOG_ITEM_SET_OPTIONS;
			case object:
				return OBJECT_OPTIONS;
			case metaClass:
			case state:
				return META_CLASS_AND_STATE_OPTIONS;
			case string:
				return STRING_OPTIONS;
			case dtInterval:
				return INTERVAL_OPTIONS;
		}
	};

	handleChangeOperandData = (condition: OrConditionType) => {
		const {index, onUpdate} = this.props;
		onUpdate(index, condition);
	};

	handleClickRemoveButton = () => {
		const {index, onRemove} = this.props;
		onRemove(index);
	};

	handleClickShowMore = (actual: boolean) => () => {
		const {attribute, fetchAttributesData} = this.props;
		fetchAttributesData(attribute, actual);
	};

	handleSelectOperandType = (name: string, value: Object) => {
		const {attribute, index, onUpdate} = this.props;
		const {value: type} = value;
		const condition = createNewOrCondition(attribute.type, type);

		if (condition) {
			onUpdate(index, condition);
		}
	};

	hasNotArchiveType = (condition: OrConditionType) => {
		const {CONTAINS_INCLUDING_ARCHIVAL, NOT_CONTAINS_INCLUDING_ARCHIVAL} = OPERAND_TYPES;
		return ![CONTAINS_INCLUDING_ARCHIVAL, NOT_CONTAINS_INCLUDING_ARCHIVAL].includes(condition.type);
	};

	renderBetweenOperand = (condition: BetweenOperandType) => {
		const {data, type} = condition;

		return (
			<BetweenOperand data={data} onChange={this.handleChangeOperandData} type={type} />
		);
	};

	renderCondition = () => (
		<div className={styles.operandContainer}>
			<div className={styles.operand}>
				{this.renderConditionByAttribute()}
				{this.renderFieldError(FIELDS.data)}
			</div>
		</div>
	);

	renderConditionByAttribute = () => {
		const {attribute, condition} = this.props;
		const {
			backBOLinks,
			boLinks,
			catalogItem,
			catalogItemSet,
			date,
			dateTime,
			double,
			dtInterval,
			integer,
			metaClass,
			object,
			state,
			string
		} = ATTRIBUTE_TYPES;

		switch (attribute.type) {
			case date:
			case dateTime:
				return this.renderDateCondition(condition);
			case double:
			case integer:
				return this.renderNumberCondition(condition);
			case dtInterval:
				return this.renderIntervalCondition(condition);
			case backBOLinks:
			case boLinks:
			case catalogItem:
			case catalogItemSet:
			case metaClass:
			case object:
			case state:
				return this.renderRefCondition(condition);
			case string:
				return this.renderStringCondition(condition);
		}
	};

	renderDateCondition = (condition: DateOrCondition) => {
		const {BETWEEN, LAST, NEAR} = OPERAND_TYPES;

		switch (condition.type) {
			case BETWEEN:
				return this.renderBetweenOperand(condition);
			case LAST:
			case NEAR:
				return this.renderSimpleOperand(condition, true, true);
		}
	};

	renderFieldError = (path: string) => {
		const {errors, validationPath} = this.props;
		const errorKey = `${validationPath}.${path}`;

		return <FieldError className={cn(mainStyles.error, styles.error)} text={errors[errorKey]} />;
	};

	renderIntervalCondition = (condition: IntervalOrCondition) => {
		const {EQUAL, GREATER, LESS, NOT_EQUAL} = OPERAND_TYPES;

		switch (condition.type) {
			case EQUAL:
			case GREATER:
			case LESS:
			case NOT_EQUAL:
				return this.renderIntervalOperand(condition);
		}
	};

	renderIntervalOperand = (operand: IntervalOperandType) => {
		const validationPath = `${FIELDS.data}.${FIELDS.value}`;

		return (
			<Fragment>
				<IntervalOperand
					onChange={this.handleChangeOperandData}
					operand={operand}
				/>
				{this.renderFieldError(validationPath)}
			</Fragment>
		);
	};

	renderMultiSelectOperand = (operand: MultiSelectOperandType) => {
		const actual = this.hasNotArchiveType(operand);
		const attributesData = this.getAttributesData(actual);

		if (attributesData) {
			const {data: attributes, loading, uploaded = false} = attributesData;

			return (
				<MultiSelectOperand
					loading={loading}
					onChange={this.handleChangeOperandData}
					onClickShowMore={this.handleClickShowMore(actual)}
					operand={operand}
					options={attributes}
					showMore={!uploaded}
				/>
			);
		}
	};

	renderNumberCondition = (condition: NumberOrCondition) => {
		const {EQUAL, GREATER, LESS, NOT_EQUAL, NOT_EQUAL_NOT_EMPTY} = OPERAND_TYPES;

		switch (condition.type) {
			case EQUAL:
			case GREATER:
			case LESS:
			case NOT_EQUAL:
			case NOT_EQUAL_NOT_EMPTY:
				return this.renderSimpleOperand(condition, true);
		}
	};

	renderOperandSelect = () => {
		const {condition} = this.props;
		const {options} = this.state;
		const value = options.find(o => o.value === condition.type) || options[0];

		return (
			<div className={styles.operandSelect}>
				<MaterialSelect onSelect={this.handleSelectOperandType} options={options} value={value} />
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

	renderRefCondition= (condition: RefOrCondition) => {
		const {
			CONTAINS,
			CONTAINS_ANY,
			CONTAINS_ATTR_CURRENT_OBJECT,
			CONTAINS_INCLUDING_ARCHIVAL,
			CONTAINS_INCLUDING_NESTED,
			EQUAL_ATTR_CURRENT_OBJECT,
			NOT_CONTAINS,
			NOT_CONTAINS_INCLUDING_ARCHIVAL,
			TITLE_CONTAINS,
			TITLE_NOT_CONTAINS
		} = OPERAND_TYPES;

		switch (condition.type) {
			case CONTAINS:
			case CONTAINS_ATTR_CURRENT_OBJECT:
			case CONTAINS_INCLUDING_ARCHIVAL:
			case CONTAINS_INCLUDING_NESTED:
			case EQUAL_ATTR_CURRENT_OBJECT:
			case NOT_CONTAINS:
			case NOT_CONTAINS_INCLUDING_ARCHIVAL:
				return this.renderSelectOperand(condition);
			case CONTAINS_ANY:
				return this.renderMultiSelectOperand(condition);
			case TITLE_CONTAINS:
			case TITLE_NOT_CONTAINS:
				return this.renderSimpleOperand(condition);
		}
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

	renderSelectOperand = (operand: SelectOperandType) => {
		const actual = this.hasNotArchiveType(operand);
		const attributesData = this.getAttributesData(actual);

		if (attributesData) {
			const {data: attributes, loading, uploaded = false} = attributesData;

			return (
				<SelectOperand
					loading={loading}
					onChange={this.handleChangeOperandData}
					onClickShowMore={this.handleClickShowMore(actual)}
					operand={operand}
					options={attributes}
					showMore={!uploaded}
				/>
			);
		}
	};

	renderSimpleOperand = (operand: SimpleOperandType, number: boolean = false, onlyNumber: boolean = false) => {
		const {attribute} = this.props;
		let float = false;

		if (number) {
			float = attribute.type !== ATTRIBUTE_TYPES.integer;
		}

		return (
			<SimpleOperand
				float={float}
				onChange={this.handleChangeOperandData}
				onlyNumber={onlyNumber}
				operand={operand}
			/>
		);
	};

	renderStringCondition = (condition: StringOrCondition) => {
		const {CONTAINS, NOT_CONTAINS, NOT_CONTAINS_INCLUDING_EMPTY} = OPERAND_TYPES;

		switch (condition.type) {
			case CONTAINS:
			case NOT_CONTAINS:
			case NOT_CONTAINS_INCLUDING_EMPTY:
				return this.renderSimpleOperand(condition);
		}
	};

	render () {
		return (
			<div className={styles.container}>
				{this.renderOperandSelect()}
				{this.renderCondition()}
				{this.renderOrOperator()}
				{this.renderRemoveButton()}
			</div>
		);
	}
}

export default withGroup(OrCondition);
