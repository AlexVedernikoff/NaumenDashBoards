// @flow
import AndCondition from 'CustomGroup/components/AndCondition';
import type {AndCondition as AndConditionType} from 'CustomGroup/types';
import FieldError from 'components/atoms/FieldError';
import {FIELDS} from 'components/molecules/GroupCreatingModal/constants';
import FormField from 'components/molecules/GroupCreatingModal/components/FormField';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import mainStyles from 'components/molecules/GroupCreatingModal/styles.less';
import {MAX_TEXT_LENGTH} from 'components/constants';
import type {OnChangeInputEvent} from 'components/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import TextInput from 'components/atoms/TextInput';
import withCustomGroup from 'CustomGroup/withCustomGroup';

export class SubGroup extends PureComponent<Props> {
	handleChangeName = (e: OnChangeInputEvent) => {
		const {index, onUpdate, subGroup} = this.props;
		const {value} = e;

		onUpdate(index, {...subGroup, name: String(value)});
	};

	handleCreateAndCondition = () => {
		const {createCondition, index, onUpdate, subGroup} = this.props;

		onUpdate(index, {
			...subGroup,
			data: [
				...subGroup.data,
				[createCondition()]
			]
		}, true);
	};

	handleRemoveAndCondition = (index: number) => {
		const {index: subGroupIndex, onRemove, onUpdate, subGroup} = this.props;
		const {data} = subGroup;

		data.splice(index, 1);

		data.length === 0 ? onRemove(subGroupIndex) : onUpdate(subGroupIndex, {...subGroup, data});
	};

	handleUpdateAndCondition = (index: number, condition: AndConditionType, isNewCondition: boolean = false) => {
		const {index: subGroupIndex, onUpdate, subGroup} = this.props;
		const {data} = subGroup;

		data[index] = condition;

		onUpdate(subGroupIndex, {
			...subGroup,
			data: [...data]
		}, isNewCondition);
	};

	renderAndCondition = (condition: AndConditionType, index: number, conditions: Array<AndConditionType>) => {
		const {isLast: isLastSubGroup, validationPath: currentPath} = this.props;
		const hasLastPosition = conditions.length - 1 === index;
		const isLast = isLastSubGroup && conditions.length === 1;
		const validationPath = `${currentPath}.${FIELDS.data}[${index}]`;
		let onCreate;

		if (hasLastPosition) {
			onCreate = this.handleCreateAndCondition;
		}

		return (
			<AndCondition
				condition={condition}
				disabled={!hasLastPosition}
				index={index}
				isLast={isLast}
				key={validationPath}
				onCreate={onCreate}
				onRemove={this.handleRemoveAndCondition}
				onUpdate={this.handleUpdateAndCondition}
				validationPath={validationPath}
			/>
		);
	};

	renderAndConditions = () => (
		<div className={styles.conditionsContainer}>
			{this.props.subGroup.data.map(this.renderAndCondition)}
		</div>
	);

	renderInfoIcon = () => (
		<div title="Подпись группы для отображения на оси" >
			<Icon className={mainStyles.infoIcon} name={ICON_NAMES.INFO} />
		</div>
	);

	renderNameError = () => {
		const {errors, validationPath} = this.props;
		const errorKey = `${validationPath}.${FIELDS.name}`;

		return <FieldError className={mainStyles.error} text={errors[errorKey]} />;
	};

	renderNameField = () => (
		<Fragment>
			<FormField className={styles.nameField} label="Название группы">
				<div className={styles.nameInputContainer}>
					{this.renderNameTextInput()}
					{this.renderInfoIcon()}
				</div>
			</FormField>
			{this.renderNameError()}
		</Fragment>
	);

	renderNameTextInput = () => {
		const {name} = this.props.subGroup;

		return (
			<div className={styles.nameInput}>
				<TextInput maxLength={MAX_TEXT_LENGTH} onChange={this.handleChangeName} value={name} />
			</div>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderNameField()}
				{this.renderAndConditions()}
			</Fragment>
		);
	}
}

export default withCustomGroup(SubGroup);
