// @flow
import type {Attribute} from 'src/store/sources/attributes/types';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Item, ItemsMap} from 'src/store/sources/currentObject/types';
import MaterialTreeSelect from 'src/components/molecules/MaterialTreeSelect';
import type {OnSelectEvent, TreeNode} from 'src/components/types';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import type {SelectData} from 'src/store/customGroups/types';

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

	getOptionLabel = (option: SelectData) => option.title;

	getOptionValue = (option: SelectData) => option.code;

	handleLoad = (item: Item | null) => {
		const {attribute, fetchCurrentObjectAttributes} = this.props;

		fetchCurrentObjectAttributes(item, attribute);
	};

	handleSelect = ({value: option}: OnSelectEvent) => {
		const {onChange, value} = this.props;

		onChange({...value, data: option});
	};

	isEnabledNode = (node: TreeNode<Attribute>) => this.props.attribute.property === node.value.property;

	render () {
		const {currentObjectData, value} = this.props;
		const {options} = this.state;

		return (
			<MaterialTreeSelect
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				isEnabledNode={this.isEnabledNode}
				loading={currentObjectData.loading}
				onLoad={this.handleLoad}
				onSelect={this.handleSelect}
				options={options}
				value={value.data}
			/>
		);
	}
}

export default connect(props, functions)(CurrentObjectOrCondition);
