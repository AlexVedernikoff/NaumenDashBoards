// @flow
import type {Condition} from 'store/customGroups/types';
import {createNewCondition} from 'components/molecules/GroupCreatingModal/helpers';
import {CustomSubGroupCondition} from 'components/molecules';
import {MaterialTextInput} from 'components/atoms';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import uuid from 'tiny-uuid';

export class CustomSubGroup extends PureComponent<Props> {
	handleChangeName = (name: string, value: string) => {
		const {data, onUpdate} = this.props;
		onUpdate({...data, name: value});
	};

	handleCreateCondition = (prevCondition: Condition) => {
		const {data, onUpdate} = this.props;
		const conditionId = uuid();
		let {map} = data.conditions;

		onUpdate({
			...data,
			conditions: {
				...data.conditions,
				map: {
					...map,
					[prevCondition.id]: {...prevCondition, next: conditionId},
					[conditionId]: createNewCondition(conditionId, prevCondition.next)
				}
			}
		});
	};

	handleRemoveCondition = (condition: Condition, prev: string) => {
		const {data, isLast, onRemove, onUpdate, prev: prevSubGroupId} = this.props;
		const {id, next, operator} = condition;
		let {first, map} = data.conditions;

		if (!isLast && Object.keys(map).length === 1) {
			return onRemove(data, prevSubGroupId);
		}

		if (first === id) {
			first = next;
		} else {
			map[prev] = {...map[prev], next, operator};
		}

		delete map[id];
		onUpdate({
			...data,
			conditions: {
				first,
				map: {...map}
			}
		});
	};

	handleUpdateCondition = (condition: Condition) => {
		const {data, onUpdate} = this.props;

		onUpdate({
			...data,
			conditions: {
				...data.conditions,
				map: {
					...data.conditions.map,
					[condition.id]: condition
				}
			}
		});
	};

	renderCondition = (condition: Condition, prev: Condition | null, isLast: boolean) => {
		return (
			<CustomSubGroupCondition
				data={condition}
				isLast={isLast}
				onCreate={this.handleCreateCondition}
				onRemove={this.handleRemoveCondition}
				onUpdate={this.handleUpdateCondition}
				prev={prev}
			/>
		);
	};

	renderConditions = () => {
		const {data, isLast} = this.props;
		const {first, map} = data.conditions;
		const conditions = [];
		const isLastCondition = isLast && Object.keys(map).length === 1;
		let condition = map[first];
		let prev = null;

		while (condition) {
			conditions.push(this.renderCondition(condition, prev, isLastCondition));
			prev = condition;
			condition = map[condition.next];
		}

		return (
			<div className={styles.conditions}>
				{conditions}
			</div>
		);
	};

	renderNameField = () => {
		const {name} = this.props.data;

		return (
			<div className={styles.nameField}>
				<MaterialTextInput
					onChange={this.handleChangeName}
					placeholder="Название группы"
					value={name}
				/>
			</div>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderNameField()}
				{this.renderConditions()}
			</Fragment>
		);
	}
}

export default CustomSubGroup;
