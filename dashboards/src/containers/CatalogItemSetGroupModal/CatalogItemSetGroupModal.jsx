// @flow
import type {CatalogItemSetData} from 'store/sources/attributesData/catalogItemSets/types';
import {connect} from 'react-redux';
import {createRefObjectCustomGroupType} from 'GroupModal/helpers';
import {DATA_CONTEXT, DEFAULT_DATA, OR_CONDITION_OPTIONS} from './constants';
import {functions, props} from './selectors';
import MaterialTreeSelect from 'src/components/molecules/MaterialTreeSelect';
import memoize from 'memoize-one';
import type {Node} from 'components/molecules/TreeSelect/types';
import type {Props} from './types';
import React, {Component} from 'react';
import RefObjectGroupModal from 'containers/RefObjectGroupModal';
import type {SelectProps} from 'src/containers/RefObjectGroupModal/types';
import {translateObjectsArray} from 'localization';

export class CatalogItemSetGroupModal extends Component<Props> {
	orConditionOptions = translateObjectsArray('label', OR_CONDITION_OPTIONS);

	static defaultProps = {
		catalogItemSetData: DEFAULT_DATA
	};

	getComponents = memoize(() => ({
		Select: this.renderSelect
	}));

	getNodeValue = (node: Node) => node.value;

	handleLoad = () => {
		const {attribute, fetchCatalogItemSetData} = this.props;

		fetchCatalogItemSetData(attribute.property);
	};

	renderSelect = (props: SelectProps) => (
		<DATA_CONTEXT.Consumer>
			{({items, loading}: CatalogItemSetData) => (
				<MaterialTreeSelect loading={loading} onFetch={this.handleLoad} options={items} {...props} />
			)}
		</DATA_CONTEXT.Consumer>
	);

	render () {
		const {attribute, catalogItemSetData, onClose, onSubmit, value} = this.props;
		const customType = createRefObjectCustomGroupType(attribute, 'property');

		return (
			<DATA_CONTEXT.Provider value={catalogItemSetData}>
				<RefObjectGroupModal
					attribute={attribute}
					components={this.getComponents()}
					customType={customType}
					onClose={onClose}
					onSubmit={onSubmit}
					orConditionOptions={this.orConditionOptions}
					transform={this.getNodeValue}
					value={value}
				/>
			</DATA_CONTEXT.Provider>
		);
	}
}

export default connect(props, functions)(CatalogItemSetGroupModal);
