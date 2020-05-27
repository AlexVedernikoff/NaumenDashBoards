// @flow
import {Button, SearchSelectInput} from 'components/atoms';
import cn from 'classnames';
import type {InputRef} from 'components/types';
import {Node} from 'components/molecules/MaterialTreeSelect/components';
import type {Node as ReactNode} from 'react';
import type {Node as NodeType, NodeValue, Props, State} from './types';
import React, {Component, createRef} from 'react';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class Tree extends Component<Props, State> {
	static defaultProps = {
		className: '',
		initialSelected: [],
		multiple: false,
		showMore: false,
		value: '',
		values: []
	};

	state = {
		expandedNodes: [],
		foundIds: [],
		searchValue: '',
		selectedIds: []
	};

	searchInputRef: InputRef = createRef();

	componentDidMount (): * {
		const {initialSelected: selectedIds} = this.props;
		selectedIds.length > 0 && this.setState({selectedIds});
	}

	componentDidUpdate (prevProps: Props) {
		const {show: prevShow} = prevProps;
		const {show: nextShow} = this.props;

		if (nextShow && nextShow !== prevShow) {
			this.focusOnSearchInput();
		}
	}

	focusOnSearchInput = () => {
		const {current} = this.searchInputRef;
		current && current.focus();
	};

	getContainerClassName = () => cn(styles.container, this.props.className);

	// $FlowFixMe
	getRoots = (): Array<NodeType> => Object.values(this.props.options).filter(this.isRoot);

	handleChangeSearchInput = (searchValue: string) => {
		const reg = new RegExp(searchValue, 'i');
		const foundIds = [];

		this.getRoots().forEach(node => {
			foundIds.push(...this.search(node, reg));
		});

		this.setState({foundIds, searchValue});
	};

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

	isDisabled = (value: NodeValue) => {
		const {isDisabled} = this.props;
		let disabled = false;

		if (isDisabled) {
			disabled = isDisabled(value);
		}

		return disabled;
	};

	isExpanded = (nodeId: string) => {
		const {expandedNodes, searchValue} = this.state;
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

	renderChildren = (node: NodeType, expanded: boolean): ReactNode => {
		const {options} = this.props;
		const {children} = node;

		if (expanded && Array.isArray(children) && children.length > 0) {
			return children.map(id => options[id] && this.renderNode(options[id]));
		}

		return null;
	};

	renderNode = (node: NodeType) => {
		const {getOptionLabel, getOptionValue, onLoad} = this.props;
		const {selectedIds} = this.state;
		const {foundIds, searchValue} = this.state;
		const {children, error, id, loading, uploaded} = node;
		const showMoreChildren = children && !(loading || uploaded || error);
		const nodeValue = getOptionValue(node.value);
		const expanded = this.isExpanded(id);
		const disabled = this.isDisabled(node.value);
		const selected = selectedIds.includes(id);

		if (!searchValue || foundIds.includes(id)) {
			return (
				<Node
					data={node}
					disabled={disabled}
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

	renderSearchInput = () => (
		<SearchSelectInput
			forwardedRef={this.searchInputRef}
			onChange={this.handleChangeSearchInput}
			value={this.state.searchValue}
		/>
	);

	renderShowMoreButton = () => {
		const {showMore} = this.props;

		if (showMore) {
			return (
				<Button className={styles.showMoreButton} onClick={this.handleClickShowMore} variant={BUTTON_VARIANTS.SIMPLE}>Показать еще</Button>
			);
		}
	};

	renderTree = () => (
		<div className={styles.tree}>
			{this.getRoots().map(this.renderNode)}
			{this.renderShowMoreButton()}
		</div>
	);

	render () {
		const {show} = this.props;

		if (show) {
			return (
				<div className={this.getContainerClassName()}>
					{this.renderSearchInput()}
					{this.renderTree()}
				</div>
			);
		}

		return null;
	}
}

export default Tree;
