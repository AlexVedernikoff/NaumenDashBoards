// @flow
import CheckIconButtonGroup from 'components/molecules/CheckIconButtonGroup';
import cn from 'classnames';
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import type {Components, Props, SortingValueOption, State} from './types';
import Container from 'components/atoms/Container';
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {OnChangeInputEvent} from 'components/types';
import RadioField from 'components/atoms/RadioField';
import React, {PureComponent} from 'react';
import {SORTING_OPTIONS} from './constants';
import {SORTING_TYPES} from 'store/widgets/data/constants';
import styles from './styles.less';

const defaultComponents = {
	Container
};

export class SortingBox extends PureComponent<Props, State> {
	static defaultProps = {
		options: SORTING_OPTIONS
	};

	state = {
		components: this.getExtendedComponents(this.props.components)
	};

	getExtendedComponents (components?: $Shape<Components>) {
		return components ? {...defaultComponents, ...components} : defaultComponents;
	}

	handleChange = ({name: valueName, value}: OnChangeInputEvent) => {
		const {data, name, onChange} = this.props;
		onChange(name, {
			...data,
			[valueName]: value
		});
	};

	renderSortingButtons = () => {
		const {type} = this.props.data;
		const icons = [
			{
				name: ICON_NAMES.DESC,
				title: 'По убыванию',
				value: SORTING_TYPES.DESC
			},
			{
				name: ICON_NAMES.ASC,
				title: 'По возрастанию',
				value: SORTING_TYPES.ASC
			}
		];

		return <CheckIconButtonGroup icons={icons} name={FIELDS.type} onChange={this.handleChange} value={type} />;
	};

	renderValueField = (option: SortingValueOption) => {
		const {value: currentValue} = this.props.data;
		const {disabled, label, value} = option;
		const CN = cn({
			[styles.valueField]: true,
			[styles.disabledValueField]: disabled
		});

		return (
			<div className={CN}>
				<RadioField
					checked={currentValue === value}
					label={label}
					name={FIELDS.value}
					onChange={this.handleChange}
					value={value}
				/>
			</div>
		);
	};

	renderValueFields = () => {
		const {options} = this.props;

		return (
			<div className={styles.typeFieldset}>
				{options.map(this.renderValueField)}
			</div>
		);
	};

	render () {
		const {Container} = this.state.components;

		return (
			<CollapsableFormBox title="Сортировка">
				<Container className={styles.container}>
					{this.renderValueFields()}
					{this.renderSortingButtons()}
				</Container>
			</CollapsableFormBox>
		);
	}
}

export default SortingBox;
