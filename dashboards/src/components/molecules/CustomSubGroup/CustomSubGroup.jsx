// @flow
import type {AndCondition} from 'store/customGroups/types';
import {createNewAndCondition} from 'components/molecules/GroupCreatingModal/helpers';
import {CustomSubGroupAndCondition} from 'components/molecules';
import {FieldError, MaterialTextInput} from 'components/atoms';
import {FIELDS} from 'components/molecules/GroupCreatingModal/constants';
import mainStyles from 'components/molecules/GroupCreatingModal/styles.less';
import type {Props} from './types';
import React, {createRef, Fragment, PureComponent} from 'react';
import styles from './styles.less';
import {withGroup} from 'components/molecules/GroupCreatingModal';

export class CustomSubGroup extends PureComponent<Props> {
	refName = createRef();

	componentDidMount () {
		const {current} = this.refName;
		current && current.focus();
	}

	handleChangeName = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {index, onUpdate, subGroup} = this.props;
		const {value: name} = e.currentTarget;

		onUpdate(index, {...subGroup, name});
	};

	handleCreateAndCondition = () => {
		const {attribute, index, onUpdate, subGroup} = this.props;

		onUpdate(index, {
			...subGroup,
			data: [
				...subGroup.data,
				createNewAndCondition(attribute.type)
			]
		});
	};

	handleRemoveAndCondition = (index: number) => {
		const {index: subGroupIndex, onRemove, onUpdate, subGroup} = this.props;
		const {data} = subGroup;
		data.splice(index, 1);

		data.length === 0 ? onRemove(subGroupIndex) : onUpdate(subGroupIndex, {...subGroup, data});
	};

	handleUpdateAndCondition = (index: number, condition: AndCondition) => {
		const {index: subGroupIndex, onUpdate, subGroup} = this.props;
		const {data} = subGroup;
		data[index] = condition;

		onUpdate(subGroupIndex, {
			...subGroup,
			data: [...data]
		});
	};

	renderAndCondition = (condition: AndCondition, index: number, conditions: Array<AndCondition>) => {
		const {isLast: isLastSubGroup, validationPath: currentPath} = this.props;
		const hasLastPosition = conditions.length - 1 === index;
		const isLast = isLastSubGroup && conditions.length === 1;
		const validationPath = `${currentPath}.${FIELDS.data}[${index}]`;
		let onCreate;

		if (hasLastPosition) {
			onCreate = this.handleCreateAndCondition;
		}

		return (
			<CustomSubGroupAndCondition
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

	renderAndConditions = () => this.props.subGroup.data.map(this.renderAndCondition);

	renderNameField = () => {
		const {errors, subGroup, validationPath} = this.props;
		const {name} = subGroup;
		const errorKey = `${validationPath}.${FIELDS.name}`;

		return (
			<div className={styles.nameField}>
				<MaterialTextInput
					forwardedRef={this.refName}
					onChange={this.handleChangeName}
					placeholder="Название группы"
					value={name}
				/>
				<FieldError className={mainStyles.error} text={errors[errorKey]} />
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

export default withGroup(CustomSubGroup);
