// @flow
import type {CatalogItemData} from 'store/sources/attributesData/catalogItems/types';
import {connect} from 'react-redux';
import {createRefObjectCustomGroupType} from 'GroupModal/helpers';
import {DATA_CONTEXT, DEFAULT_DATA, OR_CONDITION_OPTIONS} from './constants';
import {functions, props} from './selectors';
import MaterialTreeSelect from 'components/molecules/MaterialTreeSelect';
import memoize from 'memoize-one';
import type {Props} from './types';
import React, {Component} from 'react';
import RefObjectGroupModal from 'containers/RefObjectGroupModal';
import type {SelectProps} from 'containers/RefObjectGroupModal/types';

export class CatalogItemGroupModal extends Component<Props> {
	static defaultProps = {
		catalogItemData: DEFAULT_DATA
	};

	getComponents = memoize(() => ({
		Select: this.renderSelect
	}));

	handleLoad = () => {
		const {attribute, fetchCatalogItemData} = this.props;

		fetchCatalogItemData(attribute.property);
	};

	renderSelect = (props: SelectProps) => (
		<DATA_CONTEXT.Consumer>
			{({items, loading}: CatalogItemData) => (
				<MaterialTreeSelect loading={loading} onLoad={this.handleLoad} options={items} {...props} />
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
					orConditionOptions={OR_CONDITION_OPTIONS}
					value={value}
				/>
			</DATA_CONTEXT.Provider>
		);
	}
}

export default connect(props, functions)(CatalogItemGroupModal);
