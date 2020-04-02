// @flow
import {Button, FieldError, IconButton} from 'components/atoms';
import cn from 'classnames';
import {CrossIcon as RemoveIcon} from 'icons/form';
import {FIELDS} from 'components/molecules/GroupCreatingModal/constants';
import mainStyles from 'components/molecules/GroupCreatingModal/styles.less';
import {MaterialSelect} from 'components/molecules/index';
import type {OrCondition as OrConditionType} from 'CustomGroup/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';
import withCustomGroup from 'CustomGroup/withCustomGroup';

export class OrCondition extends PureComponent<Props> {
	handleChangeOperandData = (condition: OrConditionType) => {
		const {index, onUpdate} = this.props;
		onUpdate(index, condition);
	};

	handleClickRemoveButton = () => {
		const {index, onRemove} = this.props;
		onRemove(index);
	};

	handleSelectOperandType = (name: string, value: Object) => {
		const {createCondition, index, onUpdate} = this.props;
		const {value: type} = value;

		onUpdate(index, createCondition(type));
	};

	renderCondition = () => {
		const {condition, renderCondition} = this.props;

		return (
			<div className={styles.operandContainer}>
				<div className={styles.operand}>
					{renderCondition(condition, this.handleChangeOperandData)}
					{this.renderFieldError(FIELDS.data)}
				</div>
			</div>
		);
	};

	renderFieldError = (path: string) => {
		const {errors, validationPath} = this.props;
		const errorKey = `${validationPath}.${path}`;

		return <FieldError className={cn(mainStyles.error, styles.error)} text={errors[errorKey]} />;
	};

	renderOperandSelect = () => {
		const {condition, options} = this.props;
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
				<Button disabled={disabled} onClick={onCreate} variant={BUTTON_VARIANTS.SIMPLE}>
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
				{this.renderOperandSelect()}
				{this.renderCondition()}
				{this.renderOrOperator()}
				{this.renderRemoveButton()}
			</div>
		);
	}
}

export default withCustomGroup(OrCondition);
