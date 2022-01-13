// @flow
import type {CatalogItemData} from 'store/sources/attributesData/catalogItems/types';
import {connect} from 'react-redux';
import {createRefObjectCustomGroupType} from 'GroupModal/helpers';
import {DATA_CONTEXT, DEFAULT_DATA, OR_CONDITION_OPTIONS} from './constants';
import {functions, props} from './selectors';
import MaterialTreeSelect from 'components/molecules/MaterialTreeSelect';
import memoize from 'memoize-one';
import type {Node} from 'components/molecules/TreeSelect/types';
import type {Props} from './types';
import React, {Component} from 'react';
import RefObjectGroupModal from 'containers/RefObjectGroupModal';
import type {SelectProps} from 'containers/RefObjectGroupModal/types';
import {translateObjectsArray} from 'localization';

export class CatalogItemGroupModal extends Component<Props> {
	orConditionOptions = translateObjectsArray('label', OR_CONDITION_OPTIONS);

	static defaultProps = {
		catalogItemData: DEFAULT_DATA
	};

	getComponents = memoize(() => ({
		Select: this.renderSelect
	}));

	getNodeValue = (node: Node) => node.value;

	handleLoad = () => {
		const {attribute, fetchCatalogItemData} = this.props;

		fetchCatalogItemData(attribute.property);
	};

	renderSelect = (props: SelectProps) => (
		<DATA_CONTEXT.Consumer>
			{({items, loading}: CatalogItemData) => (
				<MaterialTreeSelect loading={loading} onFetch={this.handleLoad} options={items} {...props} />
			)}
		</DATA_CONTEXT.Consumer>
	);

	render () {
		const {attribute, catalogItemData, onClose, onSubmit, value} = this.props;
		const customType = createRefObjectCustomGroupType(attribute, 'property');

		return (
			<DATA_CONTEXT.Provider value={catalogItemData}>
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

export default connect(props, functions)(CatalogItemGroupModal);
