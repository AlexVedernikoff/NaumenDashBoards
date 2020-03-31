// @flow
import {Button, SearchSelectInput} from 'components/atoms';
import cn from 'classnames';
import type {InputRef} from 'components/types';
import {Node} from 'components/molecules/MaterialTreeSelect/components';
import type {Node as ReactNode} from 'react';
import type {Node as NodeType, Props, State} from './types';
import React, {Component, createRef} from 'react';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class Tree extends Component<Props, State> {
	static defaultProps = {
		className: '',
		multiple: false,
		value: ''
	};

	state = {
		expandedValues: [],
		foundValues: [],
		searchValue: ''
	};

	searchInputRef: InputRef = createRef();

	componentDidMount () {
		this.focusOnSearchInput();
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
		const foundValues = [];

		this.getRoots().forEach(node => {
			foundValues.push(...this.search(node, reg));
		});

		this.setState({foundValues, searchValue});
	};

	handleClickNodeToggleIcon = (value: string) => {
		const {onLoadNode, options} = this.props;
		const {expandedValues} = this.state;
		const expanded = expandedValues.includes(value);
		const {children} = options[value];

		if (!expanded && Array.isArray(children) && children.length === 0) {
			onLoadNode(value);
		}

		this.setState({
			expandedValues: expanded ? expandedValues.filter(v => v !== value) : [...expandedValues, value]
		});
	};

	handleClickShowMore = () => this.props.onLoadMore(null, this.getRoots().length);

	isExpanded = (value: string) => {
		const {expandedValues, searchValue} = this.state;
		return Boolean(searchValue) || expandedValues.includes(value);
	};

	isRoot = (node: NodeType) => node.root;

	search = (node: NodeType, reg: RegExp) => {
		const {getOptionLabel, getOptionValue, options} = this.props;
		const {children} = node;
		const label = getOptionLabel(node);
		const value = getOptionValue(node);
		const foundedValues = [];

		if (Array.isArray(children) && children.length > 0) {
			children.forEach(id => {
				foundedValues.push(...this.search(options[id], reg));
			});
		}

		if (reg.test(label) || foundedValues.length > 0) {
			foundedValues.push(value);
		}

		return foundedValues;
	};

	renderChildren = (node: NodeType, expanded: boolean): ReactNode => {
		const {options} = this.props;
		const {children} = node;

		if (expanded && Array.isArray(children) && children.length > 0) {
			return children.map(id => this.renderNode(options[id]));
		}

		return null;
	};

	renderNode = (node: NodeType) => {
		const {getOptionLabel, getOptionValue, multiple, onLoadMore, onSelect, value, values} = this.props;
		const {foundValues, searchValue} = this.state;
		const {children, error, loading, uploaded} = node;
		const showMoreChildren = children && !(loading || uploaded || error);
		const nodeValue = getOptionValue(node);
		const expanded = this.isExpanded(nodeValue);
		const selected = multiple
			? values.find(value => getOptionValue(value) === nodeValue)
			: getOptionValue(value) === nodeValue;

		if (!searchValue || foundValues.includes(nodeValue)) {
			return (
				<Node
					expanded={expanded}
					found={Boolean(searchValue)}
					getOptionLabel={getOptionLabel}
					getOptionValue={getOptionValue}
					onClick={onSelect}
					onClickToggleIcon={this.handleClickNodeToggleIcon}
					onLoadMoreChildren={onLoadMore}
					selected={Boolean(selected)}
					showMoreChildren={Boolean(showMoreChildren)}
					value={node}
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
