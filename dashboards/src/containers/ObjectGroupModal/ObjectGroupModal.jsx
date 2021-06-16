// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {
	BACK_BO_LINKS_OR_CONDITION_OPTIONS,
	BO_LINKS_OR_CONDITION_OPTIONS,
	DATA_CONTEXT,
	DEFAULT_DATA,
	OBJECT_OR_CONDITION_OPTIONS
} from './constants';
import {connect} from 'react-redux';
import {createRefObjectCustomGroupType} from 'GroupModal/helpers';
import {debounce} from 'helpers';
import {functions, props} from './selectors';
import {getObjectKey} from 'store/sources/attributesData/objects/helpers';
import MaterialTreeSelect from 'components/molecules/MaterialTreeSelect';
import memoize from 'memoize-one';
import Node from 'components/molecules/TreeSelect/components/Node';
import type {Node as NodeType} from 'components/molecules/TreeSelect/types';
import type {ObjectsState} from 'store/sources/attributesData/objects/types';
import {OR_CONDITION_TYPE_CONTEXT} from 'containers/RefObjectGroupModal/constants';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';
import type {Props, State} from './types';
import type {Props as NodeProps} from 'components/molecules/TreeSelect/components/Node/types';
import React, {Component} from 'react';
import RefObjectGroupModal from 'containers/RefObjectGroupModal';
import SearchInput from 'components/atoms/SearchInput';
import type {SelectProps} from 'containers/RefObjectGroupModal/types';

export class ObjectGroupModal extends Component<Props, State> {
	static defaultProps = {
		objects: DEFAULT_DATA
	};

	state = {
		id: this.getId(this.props)
	};

	componentDidUpdate (prevProps: Props) {
		if (prevProps.attribute !== this.props.attribute || prevProps.source !== this.props.source) {
			this.setState({id: this.getId(this.props)});
		}
	}

	getId (props: Props) {
		const {attribute, source} = props;

		return getObjectKey(attribute, source);
	}

	getComponents = memoize(() => ({
		Select: this.renderSelectWithContext
	}));

	getSelectComponents = memoize(() => ({
		Node: this.renderNode,
		SearchInput: this.renderSearchInput
	}));

	getNodeValue = (node: NodeType) => node.value;

	getObjectSelectData = (objects: ObjectsState, type: string) => {
		const {id} = this.state;
		const {actual: actualMap, all: allMap, found} = objects;
		const {[id]: foundData} = found;
		let data;

		if (foundData?.searchValue) {
			data = foundData;
		} else {
			const map = this.hasIncludingArchivalType(type) ? allMap : actualMap;

			({[id]: data = {
					error: false,
					items: {},
					loading: false,
					uploaded: false
				}} = map);
		}

		return data;
	};

	getOrConditionOptions = () => {
		const {attribute} = this.props;
		const {backBOLinks, boLinks} = ATTRIBUTE_TYPES;

		switch (attribute.type) {
			case backBOLinks:
				return BACK_BO_LINKS_OR_CONDITION_OPTIONS;
			case boLinks:
				return BO_LINKS_OR_CONDITION_OPTIONS;
			default:
				return OBJECT_OR_CONDITION_OPTIONS;
		}
	};

	handleChangeSearchInput = (type: string) => (searchValue: string) => {
		const {fullAttribute, searchObjects, source} = this.props;
		const includingArchival = type === OR_CONDITION_TYPES.NOT_CONTAINS_INCLUDING_ARCHIVAL;

		searchObjects(source, fullAttribute, searchValue, includingArchival);
	};

	handleLoad = (type: string) => (node?: Object, offset: number = 0) => {
		const {fetchObjectData, fullAttribute, source} = this.props;
		let parentUUID = null;
		let id = null;

		if (node) {
			id = node.id;
			parentUUID = node.value.uuid;
		}

		fetchObjectData({
			attribute: fullAttribute,
			id,
			includingArchival: this.hasIncludingArchivalType(type),
			offset,
			parentUUID,
			source
		});
	};

	hasIncludingArchivalType = (type: string) => {
		const {CONTAINS_INCLUDING_ARCHIVAL, NOT_CONTAINS_INCLUDING_ARCHIVAL} = OR_CONDITION_TYPES;

		return [CONTAINS_INCLUDING_ARCHIVAL, NOT_CONTAINS_INCLUDING_ARCHIVAL].includes(type);
	};

	renderNode = (props: NodeProps) => {
		const {[this.state.id]: foundData = {}} = this.props.objects.found;
		const {searchValue} = foundData;

		return <Node {...props} searchValue={searchValue} />;
	};

	renderSearchInput = () => {
		const {[this.state.id]: found} = this.props.objects.found;

		return (
			<OR_CONDITION_TYPE_CONTEXT.Consumer>
				{type => <SearchInput onChange={debounce(this.handleChangeSearchInput(type), 500)} value={found?.searchValue} />}
			</OR_CONDITION_TYPE_CONTEXT.Consumer>
		);
	};

	renderSelect = (props: SelectProps, objects: ObjectsState, type: string) => {
		const {error, items: options, loading, uploaded} = this.getObjectSelectData(objects, type);
		const showMore = !(loading || uploaded || error);

		return (
			<MaterialTreeSelect
				components={this.getSelectComponents()}
				loading={loading}
				onFetch={this.handleLoad(type)}
				options={options}
				showMore={showMore}
				{...props}
			/>
		);
	};

	renderSelectWithContext = (props: SelectProps) => (
		<DATA_CONTEXT.Consumer>
			{objects => (
				<OR_CONDITION_TYPE_CONTEXT.Consumer>
					{type => this.renderSelect(props, objects, type)}
				</OR_CONDITION_TYPE_CONTEXT.Consumer>
			)}
		</DATA_CONTEXT.Consumer>
	);

	render () {
		const {attribute, objects, onClose, onSubmit, value} = this.props;
		const customType = createRefObjectCustomGroupType(attribute, 'property');

		return (
			<DATA_CONTEXT.Provider value={objects}>
				<RefObjectGroupModal
					attribute={attribute}
					components={this.getComponents()}
					customType={customType}
					onClose={onClose}
					onSubmit={onSubmit}
					orConditionOptions={this.getOrConditionOptions()}
					transform={this.getNodeValue}
					value={value}
				/>
			</DATA_CONTEXT.Provider>
		);
	}
}

export default connect(props, functions)(ObjectGroupModal);
