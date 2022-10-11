// @flow
import {connect} from 'react-redux';
import {createRefObjectCustomGroupType} from 'GroupModal/helpers';
import {DATA_CONTEXT, DEFAULT_DATA, OR_CONDITION_OPTIONS} from './constants';
import {functions, props} from './selectors';
import MaterialSelect from 'components/molecules/MaterialSelect';
import memoize from 'memoize-one';
import type {MetaClassData} from 'store/sources/attributesData/metaClasses/types';
import type {Props} from './types';
import React, {Component} from 'react';
import RefObjectGroupModal from 'containers/RefObjectGroupModal';
import type {SelectProps} from 'containers/RefObjectGroupModal/types';
import {translateObjectsArray} from 'localization';

export class MetaClassGroupModal extends Component<Props> {
	orConditionOptions = translateObjectsArray('label', OR_CONDITION_OPTIONS);

	static defaultProps = {
		metaClassData: DEFAULT_DATA
	};

	getComponents = memoize(() => ({
		Select: this.renderSelect
	}));

	handleFetch= () => {
		const {attribute, fetchMetaClassData} = this.props;

		fetchMetaClassData(attribute.metaClassFqn);
	};

	renderSelect = (props: SelectProps) => (
		<DATA_CONTEXT.Consumer>
			{({items, loading}: MetaClassData) => (
				<MaterialSelect fetchOptions={this.handleFetch} isSearching={true} loading={loading} options={items} {...props} />
			)}
		</DATA_CONTEXT.Consumer>
	);

	render () {
		const {attribute, metaClassData, onClose, onSubmit, value} = this.props;
		const customType = createRefObjectCustomGroupType(attribute, 'metaClassFqn');

		return (
			<DATA_CONTEXT.Provider value={metaClassData}>
				<RefObjectGroupModal
					attribute={attribute}
					components={this.getComponents()}
					customType={customType}
					onClose={onClose}
					onSubmit={onSubmit}
					orConditionOptions={this.orConditionOptions}
					value={value}
				/>
			</DATA_CONTEXT.Provider>
		);
	}
}

export default connect(props, functions)(MetaClassGroupModal);
