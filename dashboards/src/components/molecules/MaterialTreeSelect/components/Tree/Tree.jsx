// @flow
import {Button} from 'components/atoms';
import {Node} from 'components/molecules/MaterialTreeSelect/components';
import type {Node as ReactNode} from 'react';
import type {Node as NodeType, Props, State} from './types';
import React, {Component} from 'react';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class Tree extends Component<Props, State> {
	static defaultProps = {
		className: '',
		initialSelected: [],
		multiple: false,
		show: true,
		showMore: false,
		value: '',
		values: []
	};

	state = {
		expandedNodes: [],
		foundIds: [],
		selectedIds: []
	};

	componentDidMount () {
		const {initialSelected: selectedIds} = this.props;
		selectedIds.length > 0 && this.setState({selectedIds});
	}

	componentDidUpdate (prevProps: Props) {
		const {searchValue: prevSearchValue} = prevProps;
		const {searchValue: nextSearchValue} = this.props;

		if (prevSearchValue !== nextSearchValue) {
			this.setFoundIds(nextSearchValue);
		}
	}

	// $FlowFixMe
	getRoots = (): Array<NodeType> => Object.values(this.props.options).filter(this.isRoot);

	handleClick = (node: NodeType) => {
		const {multiple, onSelect} = this.props;
		let {selectedIds} = this.state;

		if (!multiple) {
			selectedIds = [];
		}

		if (!selectedIds.includes(node.id)) {
			selectedIds.push(node.id);
		}

		this.setState({selectedIds});
		onSelect(node);
	};

	handleClickNodeToggleIcon = (node: NodeType) => {
		const {onLoad} = this.props;
		const {expandedNodes} = this.state;
		const {children, id} = node;
		const expanded = expandedNodes.includes(id);

		if (onLoad && !expanded && Array.isArray(children) && children.length === 0) {
			onLoad(node);
		}

		this.setState({
			expandedNodes: expanded ? expandedNodes.filter(v => v !== id) : [...expandedNodes, id]
		});
	};

	handleClickShowMore = () => {
		const {onLoad} = this.props;
		onLoad && onLoad(null, this.getRoots().length);
	};

	isEnabledNode = (node: NodeType) => {
		const {isEnabledNode} = this.props;
		let enabled = true;

		if (isEnabledNode) {
			enabled = isEnabledNode(node);
		}

		return enabled;
	};

	isExpanded = (nodeId: string) => {
		const {searchValue} = this.props;
		const {expandedNodes} = this.state;

		return Boolean(searchValue) || expandedNodes.includes(nodeId);
	};

	isRoot = (node: NodeType) => !node.parent;

	search = (node: NodeType, reg: RegExp) => {
		const {getOptionLabel, options} = this.props;
		const {children, id, value: nodeValue} = node;
		const label = getOptionLabel(nodeValue);
		const foundedValues = [];

		if (Array.isArray(children) && children.length > 0) {
			children.forEach(id => {
				foundedValues.push(...this.search(options[id], reg));
			});
		}

		if (reg.test(label) || foundedValues.length > 0) {
			foundedValues.push(id);
		}

		return foundedValues;
	};

	setFoundIds = (searchValue: string) => {
		const reg = new RegExp(searchValue, 'i');
		const foundIds = [];

		this.getRoots().forEach(node => {
			foundIds.push(...this.search(node, reg));
		});

		this.setState({foundIds});
	};

	renderChildren = (node: NodeType, expanded: boolean): ReactNode => {
		const {options} = this.props;
		const {children} = node;

		if (expanded && Array.isArray(children) && children.length > 0) {
			return children.map(id => options[id] && this.renderNode(options[id]));
		}

		return null;
	};

	renderNode = (node: NodeType) => {
		const {getOptionLabel, getOptionValue, onLoad, searchValue} = this.props;
		const {foundIds, selectedIds} = this.state;
		const {children, error, id, loading, uploaded} = node;
		const showMoreChildren = children && !(loading || uploaded || error);
		const nodeValue = getOptionValue(node.value);
		const expanded = this.isExpanded(id);
		const enabled = this.isEnabledNode(node);
		const selected = selectedIds.includes(id);

		if (!searchValue || foundIds.includes(id)) {
			return (
				<Node
					data={node}
					enabled={enabled}
					expanded={expanded}
					found={Boolean(searchValue)}
					getOptionLabel={getOptionLabel}
					getOptionValue={getOptionValue}
					key={nodeValue}
					onClick={this.handleClick}
					onClickToggleIcon={this.handleClickNodeToggleIcon}
					onLoadMoreChildren={onLoad}
					selected={Boolean(selected)}
					showMoreChildren={Boolean(showMoreChildren)}
				>
					{this.renderChildren(node, expanded)}
				</Node>
			);
		}
	};

	renderShowMoreButton = () => {
		const {showMore} = this.props;

		if (showMore) {
			return (
				<Button
					className={styles.showMoreButton}
					onClick={this.handleClickShowMore}
					variant={BUTTON_VARIANTS.SIMPLE}>
					Показать еще
				</Button>
			);
		}
	};

	render () {
		const {show} = this.props;

		if (show) {
			return (
				<div className={styles.tree}>
					{this.getRoots().map(this.renderNode)}
					{this.renderShowMoreButton()}
				</div>
			);
		}

		return null;
	}
}

export default Tree;
