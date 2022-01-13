// @flow
import AndCondition from 'GroupModal/components/AndCondition';
import type {AndCondition as AndConditionType} from 'GroupModal/types';
import {createNewAndCondition} from 'GroupModal/helpers';
import FieldError from 'GroupModal/components/FieldError';
import {FIELDS} from 'GroupModal/constants';
import FormField from 'GroupModal/components/FormField';
import Icon, {ICON_NAMES} from 'src/components/atoms/Icon';
import mainStyles from 'GroupModal/styles.less';
import {MAX_TEXT_LENGTH} from 'src/components/constants';
import type {OnChangeEvent} from 'src/components/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import t from 'localization';
import TextInput from 'src/components/atoms/TextInput';

export class SubGroup extends PureComponent<Props> {
	handleChangeName = (e: OnChangeEvent<string>) => {
		const {index, onUpdate, subGroup} = this.props;
		const {value} = e;

		onUpdate(index, {...subGroup, name: value});
	};

	handleCreateAndCondition = () => {
		const {index, onUpdate, subGroup} = this.props;

		onUpdate(index, {
			...subGroup,
			data: [
				...subGroup.data,
				createNewAndCondition()
			]
		}, true);
	};

	handleRemoveAndCondition = (index: number) => {
		const {index: subGroupIndex, onRemove, onUpdate, subGroup} = this.props;
		const {data} = subGroup;

		if (data.length === 1) {
			onRemove(subGroupIndex);
		} else {
			onUpdate(subGroupIndex, {...subGroup, data: data.filter((c, i) => i !== index)});
		}
	};

	handleUpdateAndCondition = (index: number, newCondition: AndConditionType, isNewCondition: boolean = false) => {
		const {index: subGroupIndex, onUpdate, subGroup} = this.props;
		const {data} = subGroup;

		onUpdate(subGroupIndex, {
			...subGroup,
			data: data.map((condition, i) => i === index ? newCondition : condition)
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
				disabled={!hasLastPosition}
				index={index}
				isLast={isLast}
				key={validationPath}
				onCreate={onCreate}
				onRemove={this.handleRemoveAndCondition}
				onUpdate={this.handleUpdateAndCondition}
				validationPath={validationPath}
				value={condition}
			/>
		);
	};

	renderAndConditions = () => (
		<div className={styles.conditionsContainer}>
			{this.props.subGroup.data.map(this.renderAndCondition)}
		</div>
	);

	renderInfoIcon = () => (
		<div title={t('SubGroup::GroupLabel')} >
			<Icon className={mainStyles.infoIcon} name={ICON_NAMES.INFO} />
		</div>
	);

	renderNameError = () => {
		const {validationPath} = this.props;
		const path = `${validationPath}.${FIELDS.name}`;

		return <FieldError path={path} />;
	};

	renderNameField = () => (
		<Fragment>
			<FormField className={styles.nameField} label={t('SubGroup::GroupName')}>
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

export default SubGroup;
