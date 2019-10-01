// @flow
import 'rc-tree-select/assets/index.css';
import type {Node, Props, SelectValue, Tree} from './types';
import React, {Component} from 'react';
import styles from './styles.less';
import ToggleCollapsedIcon from 'icons/form/toggle-collapsed.svg';
import ToggleExpandedIcon from 'icons/form/toggle-expanded.svg';
import type {TreeProps} from 'rc-tree-select';
import TreeSelect, {TreeNode} from 'rc-tree-select';

export class TreeSelectInput extends Component<Props> {
	static defaultProps: {
		name: '',
		placeholder: '',
		searchPlaceholder: ''
	};

	handleOnChange = (value: SelectValue) => {
		const {name, onChange} = this.props;
		onChange(name, value);
	};

	renderRoot = (dataSources: Tree): TreeNode => (
		Object.keys(dataSources)
			.filter(key => dataSources[key].root)
			.map(key => this.renderNode(dataSources[key]))
	);

	renderNode = (dataSource: Node): TreeNode => {
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

	renderChildren = (dataSource: Node): TreeNode => {
		const {tree} = this.props;
		const {children} = dataSource;

		if (children.length) {
			return children.map(key => this.renderNode(tree[key]));
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
		const {
			name,
			placeholder,
			tree,
			value
		} = this.props;

		return (
			<TreeSelect
				className={styles.select}
				labelInValue
				name={name}
				onChange={this.handleOnChange}
				placeholder={placeholder}
				searchPlaceholder="Поиск..."
				switcherIcon={this.renderSwitcherIcon}
				treeNodeFilterProp="title"
				value={value}
			>
				{this.renderRoot(tree)}
			</TreeSelect>
		);
	}
}

export default TreeSelectInput;
