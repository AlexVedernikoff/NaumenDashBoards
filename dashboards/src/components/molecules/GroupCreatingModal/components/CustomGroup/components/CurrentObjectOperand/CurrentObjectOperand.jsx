// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Item} from 'store/sources/currentObject/types';
import {MaterialTreeSelect} from 'components/molecules';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import type {SelectData} from 'store/customGroups/types';
import type {TreeNode} from 'components/types';

export class CurrentObjectOperand extends PureComponent<Props> {
	static defaultProps = {
		data: {
			error: false,
			items: {},
			loading: true
		}
	};

	getOptionLabel = (option: SelectData) => option.title;

	getOptionValue = (option: SelectData) => option.code;

	getOptions = () => {
		const {data} = this.props;
		let {items: options} = data;

		return Object.keys(options)
			.filter(key => {
				const node = options[key];
				return node.children !== null || this.props.attribute.property === node.value.property;
			})
			.reduce((obj, key) => {
				obj[key] = options[key];
				return obj;
			}, {});
	};

	handleLoad = (item: Item | null) => {
		const {attribute, fetch} = this.props;
		fetch(item, attribute);
	};

	handleSelect = (name: string, value: Attribute) => {
		const {onChange, operand} = this.props;
		onChange({...operand, data: value});
	};

	isEnabledNode = (node: TreeNode<Attribute>) => this.props.attribute.property === node.value.property;

	render () {
		const {operand} = this.props;

		return (
			<MaterialTreeSelect
				async={true}
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				isEnabledNode={this.isEnabledNode}
				onLoad={this.handleLoad}
				onSelect={this.handleSelect}
				options={this.getOptions()}
				value={operand.data}
			/>
		);
	}
}

export default CurrentObjectOperand;
