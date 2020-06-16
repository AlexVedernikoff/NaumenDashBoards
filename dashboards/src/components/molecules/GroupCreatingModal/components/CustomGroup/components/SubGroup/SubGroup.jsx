// @flow
import {AndCondition} from 'CustomGroup/components';
import type {AndCondition as AndConditionType} from 'CustomGroup/types';
import cn from 'classnames';
import {FieldError, TextInput} from 'components/atoms';
import {FIELDS} from 'components/molecules/GroupCreatingModal/constants';
import {FormControl} from 'components/molecules';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import mainStyles from 'components/molecules/GroupCreatingModal/styles.less';
import {MAX_TEXT_LENGTH} from 'WidgetFormPanel/constants';
import type {OnChangeInputEvent} from 'components/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
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
		});
	};

	handleRemoveAndCondition = (index: number) => {
		const {index: subGroupIndex, onRemove, onUpdate, subGroup} = this.props;
		const {data} = subGroup;
		data.splice(index, 1);

		data.length === 0 ? onRemove(subGroupIndex) : onUpdate(subGroupIndex, {...subGroup, data});
	};

	handleUpdateAndCondition = (index: number, condition: AndConditionType) => {
		const {index: subGroupIndex, onUpdate, subGroup} = this.props;
		const {data} = subGroup;
		data[index] = condition;

		onUpdate(subGroupIndex, {
			...subGroup,
			data: [...data]
		});
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
		<div className={mainStyles.field}>
			{this.props.subGroup.data.map(this.renderAndCondition)}
		</div>
	);

	renderGroupInputContainer = () => (
		<div className={styles.rowContainer}>
			{this.renderNameField()}
			{this.renderInfoIcon()}
		</div>
	);

	renderInfoIcon = () => {
		const iconCN = cn(mainStyles.infoIcon, styles.infoIcon);

		return (
			<Icon className={iconCN} name={ICON_NAMES.INFO} title="Название для сохранения группировки" />
		);
	};

	renderNameField = () => {
		const {errors, subGroup, validationPath} = this.props;
		const {name} = subGroup;
		const errorKey = `${validationPath}.${FIELDS.name}`;

		return (
			<FormControl className={mainStyles.shortField} label="Название группы">
				<TextInput
					maxLength={MAX_TEXT_LENGTH}
					onChange={this.handleChangeName}
					value={name}
				/>
				<FieldError className={mainStyles.error} text={errors[errorKey]} />
			</FormControl>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderGroupInputContainer()}
				{this.renderAndConditions()}
			</Fragment>
		);
	}
}

export default withCustomGroup(SubGroup);
