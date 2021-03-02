// @flow
import cn from 'classnames';
import MultiValueContainer from './components/MultiValueContainer';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import ValueContainer from './components/ValueContainer';

export class MaterialSelect extends PureComponent<Props> {
	static defaultProps = Select.defaultProps;
	selectRef = createRef();
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

	handleClick = () => {
		const {current: select} = this.selectRef;

		select && select.handleClick();
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
			forwardedLabelInputRef,
			getOptionLabel,
			getOptionValue,
			isEditingLabel,
			maxLabelLength,
			onChangeLabel,
			placeholder,
			value
		} = this.props;

		return (
			<ValueContainer
				editableLabel={isEditingLabel}
				forwardedInputRef={forwardedLabelInputRef}
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				maxLabelLength={maxLabelLength}
				onChangeLabel={onChangeLabel}
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
				{...this.props}
				className={cn(styles.select, className)}
				components={this.getComponents()}
				ref={this.selectRef}
			/>
		);
	}
}

export default MaterialSelect;
