// @flow
import {connect} from 'react-redux';
import {createRefObjectCustomGroupType} from 'GroupModal/helpers';
import {DATA_CONTEXT, DEFAULT_DATA, OR_CONDITION_OPTIONS} from './constants';
import {functions, props} from './selectors';
import MaterialSelect from 'components/molecules/MaterialSelect';
import memoize from 'memoize-one';
import type {Props} from './types';
import React, {Component} from 'react';
import RefObjectGroupModal from 'containers/RefObjectGroupModal';
import type {SelectProps} from 'containers/RefObjectGroupModal/types';
import type {StateData} from 'store/sources/attributesData/states/types';
import {translateObjectsArray} from 'localization';

export class StateGroupModal extends Component<Props> {
	orConditionOptions = translateObjectsArray('label', OR_CONDITION_OPTIONS);

	static defaultProps = {
		stateData: DEFAULT_DATA
	};

	getComponents = memoize(() => ({
		Select: this.renderSelect
	}));

	handleFetch = () => {
		const {attribute, fetchMetaClassStates} = this.props;

		fetchMetaClassStates(attribute.metaClassFqn);
	};

	renderSelect = (props: SelectProps) => (
		<DATA_CONTEXT.Consumer>
			{({items, loading}: StateData) => (
				<MaterialSelect fetchOptions={this.handleFetch} loading={loading} options={items} {...props} />
			)}
		</DATA_CONTEXT.Consumer>
	);

	render () {
		const {attribute, onClose, onSubmit, stateData, value} = this.props;
		const customType = createRefObjectCustomGroupType(attribute, 'metaClassFqn');

		return (
			<DATA_CONTEXT.Provider value={stateData}>
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

export default connect(props, functions)(StateGroupModal);
