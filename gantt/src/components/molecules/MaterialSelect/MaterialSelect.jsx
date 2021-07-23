// @flow
import cn from 'classnames';
import {DEFAULT_PROPS as SELECT_DEFAULT_PROPS} from 'components/molecules/Select/constants';
import MultiValueContainer from './components/MultiValueContainer';
import type {Props} from './types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import ValueContainer from './components/ValueContainer';

export class MaterialSelect extends PureComponent<Props> {
	static defaultProps = {
		...SELECT_DEFAULT_PROPS,
		isEditingLabel: false,
		maxLabelLength: null,
		values: []
	};
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

	onLoadOptions = () => {
		const {onLoadOptions} = this.props;

		onLoadOptions();
	};

	renderMultiValueContainer = (props: ContainerProps): React$Node => {
		const {getOptionLabel, getOptionValue, onClear, onRemove, values} = this.props;
		const {onClick} = props;

		return (
			<MultiValueContainer
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				onClear={onClear}
				onClick={onClick}
				onRemove={onRemove}
				values={values}
			/>
		);
	};

	renderSimpleValueContainer = (props: ContainerProps): React$Node => {
		const {
			getOptionLabel,
			getOptionValue,
			isEditingLabel,
			maxLabelLength,
			placeholder,
			value
		} = this.props;
		const {onClick} = props;

		return (
			<ValueContainer
				editableLabel={isEditingLabel}
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				maxLabelLength={maxLabelLength}
				onChangeLabel={this.handleChangeLabel}
				onClick={onClick}
				placeholder={placeholder}
				value={value}
			/>
		);
	};

	renderValueContainer = (props: ContainerProps): React$Node => {
		return this.props.multiple ? this.renderMultiValueContainer(props) : this.renderSimpleValueContainer(props);
	};

	render () {
		const {className} = this.props;

		return (
			<Select
				fetchOptions={this.onLoadOptions}
				{...this.props}
				className={cn(styles.select, className)}
				components={this.getComponents()}
			/>
		);
	}
}

export default MaterialSelect;
