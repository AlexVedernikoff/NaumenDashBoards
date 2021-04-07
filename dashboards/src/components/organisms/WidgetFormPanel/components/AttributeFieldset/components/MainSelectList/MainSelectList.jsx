// @flow
import type {DynamicGroupsNode} from 'store/sources/dynamicGroups/types';
import FormCheckControl from 'components/molecules/FormCheckControl';
import List from 'components/molecules/Select/components/List';
import type {OnChangeEvent, TreeNode} from 'components/types';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import Toggle from 'components/atoms/Toggle';
import TreeList from 'components/molecules/MaterialTreeSelect/components/Tree';
import withAttributeFieldset from 'WidgetFormPanel/components/AttributeFieldset/HOCs/withAttributeFieldset';

export class MainSelectList extends PureComponent<Props, State> {
	components = null;
	state = {
		showDynamicAttributes: false,
		showDynamicAttributesError: false
	};

	handleChangeShowDynamicAttributes = ({value: show}: OnChangeEvent<boolean>) => {
		const {dataKey, dynamicGroups, fetchDynamicAttributeGroups, source} = this.props;
		const {descriptor} = source;

		if (descriptor || show) {
			if (!show && !dynamicGroups[dataKey]) {
				fetchDynamicAttributeGroups(dataKey, descriptor);
			}

			this.setState({showDynamicAttributes: !show});
		} else {
			this.setState({showDynamicAttributesError: true});
		}
	};

	handleLoadDynamicAttributes = (node: DynamicGroupsNode | null) => {
		const {dataKey, fetchDynamicAttributes, getOptionValue} = this.props;

		if (node) {
			const {value} = node;

			fetchDynamicAttributes(dataKey, getOptionValue ? getOptionValue((value: Object)) : value.title);
		}
	};

	handleSelectDynAttr = (onSelect: Function) => ({value}: DynamicGroupsNode) => onSelect(value);

	isEnabledDynamicNode = (node: TreeNode<Object>) => !!node.parent;

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
					getOptionLabel={getOptionLabel}
					getOptionValue={getOptionValue}
					initialSelected={initialSelected}
					isEnabledNode={this.isEnabledDynamicNode}
					loading={loading}
					onLoad={this.handleLoadDynamicAttributes}
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
					Для отображения списка, установите, пожалуйста, параметры фильтрации
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
					<FormCheckControl className={styles.dynamicAttributesShowHandler} label="Динамические атрибуты">
						<Toggle
							checked={showDynamicAttributes}
							onChange={this.handleChangeShowDynamicAttributes}
							value={showDynamicAttributes}
						/>
					</FormCheckControl>
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
