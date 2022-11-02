// @flow
import {arrayToTree} from 'utils/arrayToTree';
import AttributeCreatingModal from 'components/organisms/AttributeCreatingModal';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import {functions, props} from './selectors';
import type {Node} from 'components/molecules/TreeSelect/types';
import {parseAttrSetConditions} from 'store/widgetForms/helpers';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import withValues from 'components/organisms/WidgetForm/HOCs/withValues';

export class AttributeCreatingModalContainer extends PureComponent<Props, State> {
	state = {
		optionsTree: {}
	};

	componentDidMount () {
		this.fetchOptionsTree();
	}

	componentDidUpdate (prevProps: Props) {
		const {attributes, values} = this.props;

		if (prevProps.attributes !== attributes || prevProps.values !== values) {
			this.fetchOptionsTree();
		}
	}

	fetchOptionsTree = async () => {
		const {attributes, values} = this.props;
		const mainIndex = values.data.findIndex(dataSet => !dataSet.sourceForCompute);
		const mainSource = values.data[mainIndex]?.source;
		const parentClassFqn = mainSource.value?.value ?? null;
		const attrSetConditions = await parseAttrSetConditions(mainSource);
		const options = [];

		values.data.forEach(dataSet => {
			const {dataKey, source, sourceForCompute} = dataSet;
			let {value: sourceValue} = source;

			if (sourceValue) {
				const {value: classFqn} = sourceValue;
				const children = attributes[classFqn]?.options ?? [];

				sourceValue = {
					...sourceValue,
					attrSetConditions,
					parentClassFqn: sourceForCompute ? parentClassFqn : null
				};

				options.push({
					children,
					dataKey,
					hasChildren: true,
					source: sourceValue
				});
			}
		});

		const optionsTree = arrayToTree(options, {
			keys: {
				value: 'code'
			},
			values: {
				id: (arrayNode, parent) => parent ? `${parent}$${arrayNode.code}` : arrayNode.dataKey,
				loading: (arrayNode, parent) => parent ? false : attributes[arrayNode.source.value]?.loading,
				uploaded: (arrayNode, parent) => parent ? true : attributes[arrayNode.source.value]?.options.length > 0,
				value: (arrayNode, parent) => parent ? arrayNode : arrayNode.source
			}
		});

		this.setState({optionsTree});
	};

	handleFetch = (node: Node) => {
		const {fetchAttributes} = this.props;
		const {attrSetConditions, parentClassFqn, value} = node.value;

		fetchAttributes(value, parentClassFqn, attrSetConditions);
	};

	render () {
		const {attributes, fetchAttributes, values, ...props} = this.props;
		const {optionsTree} = this.state;

		return <AttributeCreatingModal {...props} onFetch={this.handleFetch} options={optionsTree} />;
	}
}

export default compose(withValues(DIAGRAM_FIELDS.data), connect(props, functions))(AttributeCreatingModalContainer);
