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
	state = {
		showDynamicAttributes: false,
		showDynamicAttributesError: false
	};

	getNodeLabel = (node: Node) => this.props.getOptionLabel(node.value);

	getNodeValue = (node: Node) => this.props.getOptionValue(node.value);

	handleChangeShowDynamicAttributes = ({value: show}: OnChangeEvent<boolean>) => {
		const {dataKey, dynamicGroups, fetchDynamicAttributeGroups, source} = this.props;
		const {descriptor} = source;

		if (descriptor || show) {
			if (!dynamicGroups[dataKey] && !dynamicGroups[dataKey]?.loading) {
				fetchDynamicAttributeGroups(dataKey, descriptor);
			}

			this.setState({showDynamicAttributes: !show});
		} else {
			this.setState({showDynamicAttributesError: true});
		}
	};

	handleFetchDynamicAttributes = (node: DynamicGroupsNode | null) => {
		const {dataKey, fetchDynamicAttributes, getOptionValue} = this.props;

		if (node) {
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
