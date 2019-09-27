// @flow
import 'rc-tree-select/assets/index.css';
import type {DataSource, DataSourceMap} from 'store/sources/data/types';
import type {Props} from 'containers/DataSourceInput/types';
import React, {Component} from 'react';
import styles from './styles.less';
import ToggleCollapsedIcon from 'icons/form/toggle-collapsed.svg';
import ToggleExpandedIcon from 'icons/form/toggle-expanded.svg';
import type {TreeProps} from 'rc-tree-select';
import TreeSelect, {TreeNode} from 'rc-tree-select';

export class DataSourceInput extends Component<Props> {
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
		const {children} = dataSource;

		if (children.length) {
			return children.map(key => this.renderNode(dataSources[key]));
		}
	};

	renderSwitcherIcon = (props: TreeProps) => {
		const {expanded, isLeaf} = props;
		const iconProps = {
			className: styles.icon
		};

		if (!isLeaf) {
			return expanded ? <ToggleExpandedIcon {...iconProps} /> : <ToggleCollapsedIcon {...iconProps} />;
		}
	};

	render () {
		const {dataSources, onChange, value} = this.props;

		return (
			<TreeSelect
				className={styles.select}
				labelInValue
				onChange={onChange}
				placeholder="Источник"
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
