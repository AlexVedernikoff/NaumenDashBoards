// @flow
import {arrayToTree} from 'utils/arrayToTree';
import AttributeCreatingModal from 'components/organisms/AttributeCreatingModal';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import {functions, props} from './selectors';
import memoize from 'memoize-one';
import type {Node, Tree} from 'components/molecules/TreeSelect/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import withValues from 'components/organisms/WidgetForm/HOCs/withValues';

export class AttributeCreatingModalContainer extends PureComponent<Props> {
	getOptions = memoize((values, attributes): Tree => {
		const options = [];
		const mainIndex = values.data.findIndex(dataSet => !dataSet.sourceForCompute);
		const parentClassFqn = values.data[mainIndex]?.source.value.value ?? null;

		values.data.forEach(dataSet => {
			const {dataKey, source} = dataSet;
			const {value: sourceValue} = source;

			if (sourceValue) {
				const {value: classFqn} = sourceValue;
				const children = attributes[classFqn]?.options ?? [];

				options.push({
					children,
					dataKey,
					hasChildren: true,
					source: dataSet.sourceForCompute ? {...sourceValue, parentClassFqn} : sourceValue
				});
			}
		});

		return arrayToTree(options, {
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
	});

	handleFetch = (node: Node) => {
		const {fetchAttributes} = this.props;

		fetchAttributes(node.value.value, node.value.parentClassFqn);
	};

	render () {
		const {attributes, fetchAttributes, values, ...props} = this.props;

		return <AttributeCreatingModal {...props} onFetch={this.handleFetch} options={this.getOptions(values, attributes)} />;
	}
}

export default compose(withValues(DIAGRAM_FIELDS.data), connect(props, functions))(AttributeCreatingModalContainer);
