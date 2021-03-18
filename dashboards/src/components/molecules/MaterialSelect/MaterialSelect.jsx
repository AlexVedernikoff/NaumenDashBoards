// @flow
import cn from 'classnames';
import MultiValueContainer from './components/MultiValueContainer';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import ValueContainer from './components/ValueContainer';

export class MaterialSelect extends PureComponent<Props> {
	static defaultProps = {
		...Select.defaultProps,
		isEditingLabel: false,
		maxLabelLength: null,
		values: []
	};
	selectRef: Ref<typeof Select> = createRef();
	components = null;

	getComponents = () => {
		if (!this.components) {
			const {components = {}} = this.props;

			this.components = {
				ValueContainer: this.renderValueContainer,
				...components
			};
		}

		return this.components;
	};

	handleChangeLabel = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {name, onChangeLabel} = this.props;
		const {value} = e.currentTarget;

		onChangeLabel && onChangeLabel({name, value});
	};

	handleClick = () => {
		const {current: select} = this.selectRef;

		select && select.handleClick();
	};

	onLoadOptions = () => {
		const {onLoadOptions} = this.props;

		onLoadOptions();
	};

	renderMultiValueContainer = () => {
		const {getOptionLabel, getOptionValue, onClear, onRemove, values} = this.props;

		return (
			<MultiValueContainer
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				onClear={onClear}
				onClick={this.handleClick}
				onRemove={onRemove}
				values={values}
			/>
		);
	};

	renderSimpleValueContainer = () => {
		const {
			getOptionLabel,
			getOptionValue,
			isEditingLabel,
			maxLabelLength,
			placeholder,
			value
		} = this.props;

		return (
			<ValueContainer
				editableLabel={isEditingLabel}
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				maxLabelLength={maxLabelLength}
				onChangeLabel={this.handleChangeLabel}
				onClick={this.handleClick}
				placeholder={placeholder}
				value={value}
			/>
		);
	};

	renderValueContainer = () => {
		return this.props.multiple ? this.renderMultiValueContainer() : this.renderSimpleValueContainer();
	};

	render () {
		const {className} = this.props;

		return (
			<Select
				fetchOptions={this.onLoadOptions}
				{...this.props}
				className={cn(styles.select, className)}
				components={this.getComponents()}
				ref={this.selectRef}
			/>
		);
	}
}

export default MaterialSelect;
