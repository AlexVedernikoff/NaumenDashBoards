// @flow
import type {CatalogItemSetData} from 'store/sources/attributesData/catalogItemSets/types';
import {connect} from 'react-redux';
import {createRefObjectCustomGroupType} from 'GroupModal/helpers';
import {DATA_CONTEXT, DEFAULT_DATA, OR_CONDITION_OPTIONS} from './constants';
import {functions, props} from './selectors';
import MaterialTreeSelect from 'src/components/molecules/MaterialTreeSelect';
import memoize from 'memoize-one';
import type {Props} from './types';
import React, {Component} from 'react';
import RefObjectGroupModal from 'containers/RefObjectGroupModal';
import type {SelectProps} from 'src/containers/RefObjectGroupModal/types';

export class CatalogItemSetGroupModal extends Component<Props> {
	static defaultProps = {
		catalogItemSetData: DEFAULT_DATA
	};

	getComponents = memoize(() => ({
		Select: this.renderSelect
	}));

	handleLoad = () => {
		const {attribute, fetchCatalogItemSetData} = this.props;

		fetchCatalogItemSetData(attribute.property);
	};

	renderSelect = (props: SelectProps) => (
		<DATA_CONTEXT.Consumer>
			{({items, loading}: CatalogItemSetData) => (
				<MaterialTreeSelect loading={loading} onLoad={this.handleLoad} options={items} {...props} />
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
					orConditionOptions={OR_CONDITION_OPTIONS}
					value={value}
				/>
			</DATA_CONTEXT.Provider>
		);
	}
}

export default connect(props, functions)(CatalogItemSetGroupModal);
