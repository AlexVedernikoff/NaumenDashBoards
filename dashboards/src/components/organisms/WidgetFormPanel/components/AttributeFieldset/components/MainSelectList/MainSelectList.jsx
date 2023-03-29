// @flow
import {DEFAULT_COMPONENTS} from 'components/molecules/TreeSelect/constants';
import type {DynamicGroupsNode} from 'store/sources/dynamicGroups/types';
import FormControl from 'components/molecules/FormControl';
import List from 'components/molecules/Select/components/List';
import type {Node} from 'components/molecules/TreeSelect/types';
import type {OnChangeEvent, TreeNode} from 'components/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';
import Toggle from 'components/atoms/Toggle';
import TreeList from 'components/molecules/TreeSelect/components/Tree';
import withAttributeFieldset from 'WidgetFormPanel/components/AttributeFieldset/HOCs/withAttributeFieldset';
import withAttributesHelpers from 'containers/DiagramWidgetForm/HOCs/withAttributesHelpers';
import withShowDynamicAttributes from 'WidgetFormPanel/components/AttributeFieldset/HOCs/withShowDynamicAttributes';

export class MainSelectList extends PureComponent<Props> {
	components = null;
	searchDebounce = null;

	componentDidMount () {
		this.handleChangeSearchValue();
	}

	componentDidUpdate (prevProps: Props) {
		const {searchValue} = this.props;

		if (searchValue !== prevProps.searchValue) {
			this.handleChangeSearchValue();
		}
	}

	getNodeLabel = (node: Node) => this.props.getOptionLabel(node.value);

	getNodeValue = (node: Node) => this.props.getOptionValue(node.value);

	handleChangeSearchValue = () => {
		const {
			dataKey,
			dynamicAttributesMode,
			fetchDynamicAttributeGroups,
			fetchSearchDynamicAttributeGroups,
			searchValue,
			source
		} = this.props;
		const {descriptor, filterId} = source;

		if (this.searchDebounce !== null) {
			clearTimeout(this.searchDebounce);
		}

		if (dynamicAttributesMode === 'show') {
			this.searchDebounce = setTimeout(() => {
				if (searchValue) {
					if (descriptor || filterId) {
						fetchSearchDynamicAttributeGroups(dataKey, searchValue, descriptor, filterId);
					}
				} else {
					fetchDynamicAttributeGroups(dataKey, descriptor, filterId);
				}

				this.searchDebounce = null;
			}, 500);
		}
	};

	handleChangeShowDynamicAttributes = ({value: show}: OnChangeEvent<boolean>) => {
		const {
			dataKey,
			dynamicGroups,
			fetchDynamicAttributeGroups,
			fetchSearchDynamicAttributeGroups,
			searchValue,
			setDynamicAttributesMode,
			source
		} = this.props;
		const {descriptor, filterId} = source;

		if (this.searchDebounce === null) {
			if (descriptor || filterId || show) {
				if (!dynamicGroups[dataKey] && !dynamicGroups[dataKey]?.loading) {
					if (searchValue) {
						fetchSearchDynamicAttributeGroups(dataKey, searchValue, descriptor, filterId);
					} else {
						fetchDynamicAttributeGroups(dataKey, descriptor, filterId);
					}
				}

				setDynamicAttributesMode(show ? 'hide' : 'show');
			} else {
				setDynamicAttributesMode('error');
			}
		}
	};

	handleFetchDynamicAttributes = (node: DynamicGroupsNode | null) => {
		const {dataKey, fetchDynamicAttributes, getOptionValue, searchValue} = this.props;

		if (node && !searchValue) {
			const {value} = node;
			const groupCode = getOptionValue ? getOptionValue((value: Object)) : value.title;

			fetchDynamicAttributes(
				dataKey,
				groupCode
			);
		}
	};

	handleSelectDynAttr = (onSelect: Function) => ({value}: DynamicGroupsNode) => onSelect(value);

	isDisabledDynamicNode = (node: TreeNode<Object>) => !node.parent;

	renderDynamicAttributeList = () => {
		const {
			attributesHelpers,
			dataKey,
			dataSetIndex,
			dynamicAttributesMode,
			dynamicGroups,
			getOptionLabel,
			getOptionValue,
			onSelect,
			searchValue,
			source,
			value
		} = this.props;

		if ((source.descriptor || source.filterId) && dynamicAttributesMode === 'show') {
			const initialSelected = [getOptionValue(value ?? {})];
			const {[dataKey]: sourceData = {
				data: {},
				loading: false
			}} = dynamicGroups;
			let {data, loading} = sourceData;

			data = attributesHelpers.filterDynamicAttributes(data, dataSetIndex, initialSelected);

			const listEmptyText = data && searchValue ? 'Tree::NotFoundMessage' : 'Tree::ListEmpty';

			return (
				<TreeList
					components={DEFAULT_COMPONENTS}
					dynamicAttributesMode={dynamicAttributesMode}
					getNodeLabel={this.getNodeLabel}
					getNodeValue={this.getNodeValue}
					getOptionLabel={getOptionLabel}
					getOptionValue={getOptionValue}
					initialSelected={initialSelected}
					isDisabled={this.isDisabledDynamicNode}
					listEmptyText={listEmptyText}
					loading={loading}
					onFetch={this.handleFetchDynamicAttributes}
					onSelect={this.handleSelectDynAttr(onSelect)}
					options={data}
					searchValue={searchValue}
					value={value}
				/>
			);
		}

		return null;
	};

	renderDynamicAttributesError = () => {
		const {dynamicAttributesMode, source} = this.props;
		const {descriptor, filterId} = source;

		if (!descriptor && !filterId && dynamicAttributesMode === 'error') {
			return (
				<div className={styles.dynamicError}>
					<T text="MainSelectList::DynamicAttributesError" />
				</div>
			);
		}
	};

	renderToggleShowingDynAttr = () => {
		const {dynamicAttributesMode, source, sources} = this.props;
		const {value: sourceValue} = source;
		const hasDynamic = sourceValue
			&& sources[sourceValue.value]
			&& sources[sourceValue.value].value.hasDynamic;
		const showDynamicAttributes = dynamicAttributesMode === 'show';

		if (hasDynamic) {
			return (
				<Fragment>
					<FormControl
						className={styles.dynamicAttributesShowHandler}
						label={t('MainSelectList::DynamicAttributes')}
					>
						<Toggle
							checked={showDynamicAttributes}
							onChange={this.handleChangeShowDynamicAttributes}
							value={showDynamicAttributes}
						/>
					</FormControl>
					{this.renderDynamicAttributesError()}
				</Fragment>
			);
		}

		return null;
	};

	render () {
		return (
			<Fragment>
				{this.renderToggleShowingDynAttr()}
				{this.renderDynamicAttributeList()}
				<List {...this.props} />
			</Fragment>
		);
	}
}

export default withShowDynamicAttributes(withAttributeFieldset(withAttributesHelpers(MainSelectList)));
