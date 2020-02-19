// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {
	BACK_BO_LINKS_OPTIONS,
	BO_LINKS_OPTIONS,
	CATALOG_ITEM_OPTIONS,
	CATALOG_ITEM_SET_OPTIONS,
	DATETIME_OPTIONS,
	INTEGER_OPTIONS,
	META_CLASS_AND_STATE_OPTIONS,
	OBJECT_OPTIONS
} from './constants';
import {BetweenOperand, MaterialSelect, MultiSelectOperand, SelectOperand, SimpleOperand} from 'components/molecules';
import type {
	BetweenOperand as BetweenOperandType,
	MultiSelectOperand as MultiSelectOperandType,
	OrCondition,
	SelectOperand as SelectOperandType,
	SimpleOperand as SimpleOperandType
} from 'store/customGroups/types';
import {Button, FieldError, IconButton} from 'components/atoms';
import cn from 'classnames';
import {createNewOrCondition} from 'components/molecules/GroupCreatingModal/helpers';
import {CrossIcon as RemoveIcon} from 'icons/form';
import {FIELDS} from 'components/molecules/GroupCreatingModal/constants';
import mainStyles from 'components/molecules/GroupCreatingModal/styles.less';
import {OPERAND_TYPES} from 'store/customGroups/constants';
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
			integer,
			metaClass,
			object,
			state
		} = ATTRIBUTE_TYPES;

		switch (type) {
			case date:
			case dateTime:
				return DATETIME_OPTIONS;
			case double:
			case integer:
				return INTEGER_OPTIONS;
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
		}
	};

	handleChangeOperandData = (condition: OrCondition) => {
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
		const {index, onUpdate} = this.props;
		const {value: type} = value;
		const condition = createNewOrCondition(type);

		if (condition) {
			onUpdate(index, condition);
		}
	};

	hasNotArchiveType = (condition: OrCondition) => {
		const {CONTAINS_INCLUDING_ARCHIVAL, NOT_CONTAINS_INCLUDING_ARCHIVAL} = OPERAND_TYPES;
		return ![CONTAINS_INCLUDING_ARCHIVAL, NOT_CONTAINS_INCLUDING_ARCHIVAL].includes(condition.type);
	};

	renderBetweenOperand = (condition: BetweenOperandType) => {
		const {data, type} = condition;

		return (
			<BetweenOperand data={data} onChange={this.handleChangeOperandData} type={type} />
		);
	};

	renderDataError = () => {
		const {errors, validationPath} = this.props;
		const errorKey = `${validationPath}.${FIELDS.data}`;

		return <FieldError className={cn(mainStyles.error, styles.error)} text={errors[errorKey]} />;
	};

	renderMultiSelectOperand = (condition: MultiSelectOperandType) => {
		const {data, type} = condition;
		const actual = this.hasNotArchiveType(condition);
		const attributesData = this.getAttributesData(actual);

		if (attributesData) {
			const {data: attributes, loading, uploaded = false} = attributesData;

			return (
				<MultiSelectOperand
					data={data}
					loading={loading}
					onChange={this.handleChangeOperandData}
					onClickShowMore={this.handleClickShowMore(actual)}
					options={attributes}
					showMore={!uploaded}
					type={type}
				/>
			);
		}
	};

	renderOperand = () => (
		<div className={styles.operandContainer}>
			<div className={styles.operand}>
				{this.renderOperandByType()}
				{this.renderDataError()}
			</div>
		</div>
	);

	renderOperandByType = () => {
		const {condition} = this.props;
		const {
			BETWEEN,
			CONTAINS,
			CONTAINS_ANY,
			CONTAINS_ATTR_CURRENT_OBJECT,
			CONTAINS_INCLUDING_ARCHIVAL,
			CONTAINS_INCLUDING_NESTED,
			EQUAL,
			EQUAL_ATTR_CURRENT_OBJECT,
			GREATER,
			LAST,
			LESS,
			NEAR,
			NOT_CONTAINS,
			NOT_CONTAINS_INCLUDING_ARCHIVAL,
			NOT_EQUAL,
			NOT_EQUAL_NOT_EMPTY,
			TITLE_CONTAINS,
			TITLE_NOT_CONTAINS
		} = OPERAND_TYPES;

		switch (condition.type) {
			case BETWEEN:
				return this.renderBetweenOperand(condition);
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
			case LAST:
			case NEAR:
				return this.renderSimpleOperand(condition, true, true);
			case EQUAL:
			case GREATER:
			case LESS:
			case NOT_EQUAL:
			case NOT_EQUAL_NOT_EMPTY:
				return this.renderSimpleOperand(condition, true);
			case TITLE_CONTAINS:
			case TITLE_NOT_CONTAINS:
				return this.renderSimpleOperand(condition);
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

	renderSelectOperand = (condition: SelectOperandType) => {
		const {data, type} = condition;
		const actual = this.hasNotArchiveType(condition);
		const attributesData = this.getAttributesData(actual);

		if (attributesData) {
			const {data: attributes, loading, uploaded = false} = attributesData;

			return (
				<SelectOperand
					data={data}
					loading={loading}
					onChange={this.handleChangeOperandData}
					onClickShowMore={this.handleClickShowMore(actual)}
					options={attributes}
					showMore={!uploaded}
					type={type}
				/>
			);
		}
	};

	renderSimpleOperand = (condition: SimpleOperandType, number: boolean = false, onlyNumber: boolean = false) => {
		const {attribute} = this.props;
		const {data, type} = condition;
		let float = false;

		if (number) {
			float = attribute.type !== ATTRIBUTE_TYPES.integer;
		}

		return (
			<SimpleOperand
				data={data}
				float={float}
				onChange={this.handleChangeOperandData}
				onlyNumber={onlyNumber}
				type={type}
			/>
		);
	};

	render () {
		return (
			<div className={styles.container}>
				{this.renderOperandSelect()}
				{this.renderOperand()}
				{this.renderOrOperator()}
				{this.renderRemoveButton()}
			</div>
		);
	}
}

export default withGroup(CustomSubGroupOrCondition);
