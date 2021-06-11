// @flow
import type {ContainerProps} from 'components/molecules/TreeSelect/types';
import memoize from 'memoize-one';
import MultiValueContainer from 'components/molecules/MaterialSelect/components/MultiValueContainer';
import type {Props} from './types';
import React, {Component} from 'react';
import TreeSelect from 'components/molecules/TreeSelect';
import ValueContainer from 'components/molecules/MaterialSelect/components/ValueContainer';

export class MaterialTreeSelect extends Component<Props> {
	static defaultProps = TreeSelect.defaultProps;

	getComponents = memoize(() => ({
		ValueContainer: this.renderValueContainer,
		...this.props.components
	}));

	renderMultiValueContainer = (props: ContainerProps) => {
		const {getOptionLabel, getOptionValue, onClear, onRemove, values} = this.props;

		return (
			<MultiValueContainer
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				onClear={onClear}
				onClick={props.onClick}
				onRemove={onRemove}
				values={values}
			/>
		);
	};

	renderSimpleValueContainer = (props: ContainerProps) => {
		const {getOptionLabel, getOptionValue, value} = this.props;

		return (
			<ValueContainer
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				onClick={props.onClick}
				value={value}
			/>
		);
	};

	renderValueContainer = (props: ContainerProps) => this.props.multiple
		? this.renderMultiValueContainer(props)
		: this.renderSimpleValueContainer(props);

	render () {
		return <TreeSelect {...this.props} components={this.getComponents()} />;
	}
}

export default MaterialTreeSelect;
