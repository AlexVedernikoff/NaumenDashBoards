// @flow
import 'rc-tree-select/assets/index.css';
import {CrossIcon, EditIcon, ToggleCollapsedIcon, ToggleExpandedIcon} from 'icons/form';
import {IconButton} from 'components/atoms';
import {InputForm} from 'components/molecules';
import type {Node, Props, State, Tree, TreeSelectValue} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import type {TreeProps} from 'rc-tree-select';
import TreeSelect, {TreeNode} from 'rc-tree-select';

export class TreeSelectInput extends PureComponent<Props, State> {
	static defaultProps: {
		name: '',
		placeholder: '',
		searchPlaceholder: ''
	};

	state = {
		showForm: false
	};

	handleOnChange = (value: TreeSelectValue) => {
		const {name, onChange} = this.props;
		onChange(name, value);
	};

	handleShowForm = (showForm: boolean) => () => this.setState({showForm});

	handleSubmit = (value: string) => {
		const {form, name} = this.props;

		if (form) {
			form.onSubmit(name, value);
		}

		this.handleShowForm(false)();
	};

	renderChildren = (dataSource: Node): TreeNode => {
		const {tree} = this.props;
		const {children} = dataSource;

		if (children.length) {
			return children.map(key => this.renderNode(tree[key]));
		}
	};

	renderClearIcon = () => (
		<div className={styles.clearIconContainer}>
			<IconButton>
				<CrossIcon />
			</IconButton>
		</div>
	);

	renderEditForm = () => {
		const {form} = this.props;
		const {showForm} = this.state;

		if (showForm && form) {
			const {rule, value} = form;

			return (
				<div className={styles.formContainer}>
					<InputForm
						onClose={this.handleShowForm(false)}
						onSubmit={this.handleSubmit}
						rule={rule}
						value={value}
					/>
				</div>
			);
		}
	};

	renderEditIcon = () => {
		const {value} = this.props;
		const {showForm} = this.state;

		if (value && !showForm) {
			return (
				<div className={styles.editIconContainer}>
					<IconButton className={styles.editIcon} onClick={this.handleShowForm(true)}>
						<EditIcon />
					</IconButton>
				</div>
			);
		}
	};

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

	renderRoot = (dataSources: Tree): TreeNode => (
		Object.keys(dataSources)
			.filter(key => dataSources[key].root)
			.map(key => this.renderNode(dataSources[key]))
	);

	renderSwitcherIcon = (props: TreeProps) => {
		const {expanded, isLeaf} = props;
		const iconProps = {
			className: styles.icon
		};

		if (!isLeaf) {
			return expanded ? <ToggleExpandedIcon {...iconProps} /> : <ToggleCollapsedIcon {...iconProps} />;
		}
	};

	renderTreeSelect = () => {
		const {
			name,
			placeholder,
			tree,
			value
		} = this.props;

		return (
			<TreeSelect
				allowClear
				className={styles.select}
				clearIcon={this.renderClearIcon}
				labelInValue
				name={name}
				notFoundContent=""
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
	};

	render () {
		const {showForm} = this.state;

		return (
			<div className={styles.container}>
				{this.renderEditIcon()}
				{showForm ? this.renderEditForm() : this.renderTreeSelect()}
			</div>
		);
	}
}

export default TreeSelectInput;
