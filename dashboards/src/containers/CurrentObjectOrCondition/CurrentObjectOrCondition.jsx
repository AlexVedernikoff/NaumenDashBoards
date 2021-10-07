// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Item, ItemsMap} from 'store/sources/currentObject/types';
import MaterialTreeSelect from 'components/molecules/MaterialTreeSelect';
import type {OnSelectEvent, TreeNode} from 'components/types';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import type {SelectData} from 'store/customGroups/types';

export class CurrentObjectOrCondition extends PureComponent<Props, State> {
	static defaultProps = {
		currentObjectData: {
			error: false,
			items: {},
			loading: false
		}
	};

	state = {
		options: this.getOptions(this.props)
	};

	componentDidUpdate (prevProps: Props) {
		if (prevProps.currentObjectData.items !== this.props.currentObjectData.items) {
			this.setState({options: this.getOptions(this.props)});
		}
	}

	getOptions (props: Props): ItemsMap {
		const {attribute, currentObjectData} = props;
		const {items} = currentObjectData;

		return Object.keys(items).reduce((obj: ItemsMap, key: string) => {
			const node = items[key];

			return node.children !== null || attribute.property === node.value.property ? {...obj, [key]: node} : obj;
		}, {});
	}

	getOptionLabel = (option: SelectData | null) => option?.title ?? '';

	getOptionValue = (option: SelectData | null) => option?.code;

	handleLoad = (item: Item | null) => {
		const {attribute, fetchCurrentObjectAttributes} = this.props;

		fetchCurrentObjectAttributes(item, attribute);
	};

	handleSelect = ({value: node}: OnSelectEvent) => {
		const {onChange, value} = this.props;

		onChange({...value, data: node.value});
	};

	isDisabledNode = (node: TreeNode<Attribute>) => this.props.attribute.property !== node.value.property;

	render () {
		const {currentObjectData, value} = this.props;
		const {options} = this.state;

		return (
			<MaterialTreeSelect
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				isDisabled={this.isDisabledNode}
				loading={currentObjectData.loading}
				onFetch={this.handleLoad}
				onSelect={this.handleSelect}
				options={options}
				value={value.data}
			/>
		);
	}
}

export default connect(props, functions)(CurrentObjectOrCondition);
