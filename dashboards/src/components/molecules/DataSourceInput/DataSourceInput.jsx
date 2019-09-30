// @flow
import 'rc-tree-select/assets/index.css';
import type {DataSource, DataSourceMap} from 'store/sources/data/types';
import type {Props} from 'containers/DataSourceInput/types';
import React, {Component} from 'react';
import type {SelectValue} from 'components/organisms/WidgetFormPanel/types';
import styles from './styles.less';
import TreeSelect, {TreeNode} from 'rc-tree-select';
import ToggleCollapsedIcon from 'icons/form/toggle-collapsed.svg';
import ToggleExpandedIcon from 'icons/form/toggle-expanded.svg';

export class DataSourceInput extends Component<Props> {
	onChange = ({label, value}: SelectValue) => this.props.onChange({label, value});

	onLoadData = async (treeNode: TreeNode): Promise<void> => {
		const {fetchDataSources} = this.props;
		await fetchDataSources(treeNode.props.value);
	};

	renderRoot = (dataSources: DataSourceMap): TreeNode => (
		Object.keys(dataSources)
			.filter(key => dataSources[key].root)
			.map(key => this.renderNode(dataSources[key]))
	);

	renderNode = (dataSource: DataSource): TreeNode => {
		const {isLeaf, title, value} = dataSource;

		return (
			<TreeNode
				isLeaf={isLeaf}
				key={value}
				title={title}
				value={value}
			>
				{this.renderChildren(dataSource)}
			</TreeNode>
		);
	};

	renderChildren = (dataSource: DataSource): TreeNode => {
		const {dataSources} = this.props;
		const {children, errorLoadingChildren} = dataSource;

		if (errorLoadingChildren) {
			return this.renderChildrenError(dataSource);
		} else if (Array.isArray(children)) {
			return children.map(key => this.renderNode(dataSources[key]));
		}
	};

	renderChildrenError = (dataSource: DataSource): TreeNode => (
		<TreeNode
			title="Ошибка загрузки"
			disabled isLeaf={true}
			value={`${dataSource.value}-error`}
		/>
	);

	renderSwitcherIcon = (TreeSelect) => {
		const props = {
			className: styles.icon
		};
		  
		if (expanded) {
			return <ToggleExpandedIcon {...props} />;
		}
		  
		return <ToggleCollapsedIcon {...props} />;
	};

	render () {
		const {dataSources, value} = this.props;

		return (
			<TreeSelect
				className={styles.select}
				labelInValue
				loadData={this.onLoadData}
				onChange={this.onChange}
				searchPlaceholder="Поиск..."
				switcherIcon={this.renderSwitcherIcon}
				treeNodeFilterProp="title"
				value={value}
			>
				{this.renderRoot(dataSources)}
			</TreeSelect>
		);
	}
}

export default DataSourceInput;
