// @flow
import {DEFAULT_COMPONENTS} from 'components/molecules/TreeSelect/constants';
import type {DynamicGroupsNode} from 'store/sources/dynamicGroups/types';
import FormControl from 'components/molecules/FormControl';
import List from 'components/molecules/Select/components/List';
import type {Node} from 'components/molecules/TreeSelect/types';
import type {OnChangeEvent, TreeNode} from 'components/types';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';
import Toggle from 'components/atoms/Toggle';
import TreeList from 'components/molecules/TreeSelect/components/Tree';
import withAttributeFieldset from 'WidgetFormPanel/components/AttributeFieldset/HOCs/withAttributeFieldset';

export class MainSelectList extends PureComponent<Props, State> {
	components = null;
	searchDebounce = null;
	state = {
		showDynamicAttributes: false,
		showDynamicAttributesError: false
	};

	componentDidUpdate (prevProps: Props) {
		const {searchValue} = this.props;

		if (searchValue !== prevProps.searchValue) {
			this.handleChangeSearchValue();
		}
	}

	getNodeLabel = (node: Node) => this.props.getOptionLabel(node.value);

	getNodeValue = (node: Node) => this.props.getOptionValue(node.value);

	handleChangeSearchValue = () => {
		const {dataKey, fetchDynamicAttributeGroups, fetchSearchDynamicAttributeGroups, searchValue, source} = this.props;
		const {showDynamicAttributes: show} = this.state;
		const {descriptor, filterId} = source;

		if (this.searchDebounce !== null) {
			clearTimeout(this.searchDebounce);
		}

		if (show) {
			this.searchDebounce = setTimeout(() => {
				if (searchValue) {
					if (descriptor || filterId || show) {
						fetchSearchDynamicAttributeGroups(dataKey, searchValue, descriptor, filterId);
					}
				} else {
					fetchDynamicAttributeGroups(dataKey, descriptor, filterId);
				}
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
			source
		} = this.props;
		const {descriptor, filterId} = source;

		if (descriptor || filterId || show) {
			if (!dynamicGroups[dataKey] && !dynamicGroups[dataKey]?.loading) {
				if (searchValue) {
					fetchSearchDynamicAttributeGroups(dataKey, searchValue, descriptor, filterId);
				} else {
					fetchDynamicAttributeGroups(dataKey, descriptor, filterId);
				}
			}

			this.setState({showDynamicAttributes: !show});
		} else {
			this.setState({showDynamicAttributesError: true});
		}
	};

	handleFetchDynamicAttributes = (node: DynamicGroupsNode | null) => {
		const {dataKey, fetchDynamicAttributes, getOptionValue, searchValue} = this.props;

		if (node && !searchValue) {
			const {value} = node;

			fetchDynamicAttributes(dataKey, getOptionValue ? getOptionValue((value: Object)) : value.title);
		}
	};

	handleSelectDynAttr = (onSelect: Function) => ({value}: DynamicGroupsNode) => onSelect(value);

	isDisabledDynamicNode = (node: TreeNode<Object>) => !node.parent;

	renderDynamicAttributeList = () => {
		const {dataKey, dynamicGroups, getOptionLabel, getOptionValue, onSelect, searchValue, source, value} = this.props;
		const {showDynamicAttributes} = this.state;

		if ((source.descriptor || source.filterId) && showDynamicAttributes) {
			const initialSelected = [getOptionValue(value ?? {})];
			const {[dataKey]: sourceData = {
				data: {},
				loading: false
			}} = dynamicGroups;
			const {data, loading} = sourceData;

			return (
				<TreeList
					components={DEFAULT_COMPONENTS}
					getNodeLabel={this.getNodeLabel}
					getNodeValue={this.getNodeValue}
					getOptionLabel={getOptionLabel}
					getOptionValue={getOptionValue}
					initialSelected={initialSelected}
					isDisabled={this.isDisabledDynamicNode}
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
		const {descriptor, filterId} = this.props.source;
		const {showDynamicAttributesError} = this.state;

		if (!descriptor && !filterId && showDynamicAttributesError) {
			return (
				<div className={styles.dynamicError}>
					<T text="MainSelectList::DynamicAttributesError" />
				</div>
			);
		}
	};

	renderToggleShowingDynAttr = () => {
		const {source, sources} = this.props;
		const {showDynamicAttributes} = this.state;
		const {value: sourceValue} = source;
		const hasDynamic = sourceValue && sources[sourceValue.value] && sources[sourceValue.value].value.hasDynamic;

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

export default withAttributeFieldset(MainSelectList);
