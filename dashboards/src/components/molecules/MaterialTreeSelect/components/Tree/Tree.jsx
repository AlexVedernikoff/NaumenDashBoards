// @flow
import {Button, Loader} from 'components/atoms';
import {ListMessage} from 'components/molecules/Select/components';
import Node from 'components/molecules/MaterialTreeSelect/components/Node';
import type {Node as NodeType, Props, State} from './types';
import React, {Component} from 'react';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class Tree extends Component<Props, State> {
	static defaultProps = {
		className: '',
		components: {
			Node
		},
		initialSelected: [],
		loading: false,
		multiple: false,
		show: true,
		showMore: false,
		value: '',
		values: []
	};

	state = {
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

	handleClickShowMore = () => {
		const {onLoad} = this.props;
		onLoad && onLoad(null, this.getRoots().length);
	};

	handleLoadChildren = (node: NodeType) => {
		const {onLoad} = this.props;
		const {children, loading} = node;

		if (onLoad && Array.isArray(children) && !loading) {
			onLoad(node, children.length);
		}
	};

	isEnabledNode = (node: NodeType) => {
		const {isEnabledNode} = this.props;
		let enabled = true;

		if (isEnabledNode) {
			enabled = isEnabledNode(node);
		}

		return enabled;
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

	renderChildren = (children: Array<string>): Array<React$Node> => {
		const {options} = this.props;
		return children.map(id => options[id] && this.renderNode(options[id]));
	};

	renderLoader = () => this.props.loading && <ListMessage><Loader size={35} /></ListMessage>;

	renderNoOptionsMessage = () => {
		const {loading, options} = this.props;
		const loaded = !loading;
		const noOptions = Object.keys(options).length === 0;

		return loaded && noOptions ? <ListMessage>Список пуст</ListMessage> : null;
	};

	renderNode = (node: NodeType) => {
		const {components, getOptionLabel, getOptionValue, searchValue} = this.props;
		const {foundIds, selectedIds} = this.state;
		const {Node} = components;
		const {id} = node;
		const enabled = this.isEnabledNode(node);
		const selected = selectedIds.includes(id);

		if (!searchValue || foundIds.includes(id)) {
			return (
				<Node
					data={node}
					enabled={enabled}
					getOptionLabel={getOptionLabel}
					getOptionValue={getOptionValue}
					key={id}
					onClick={this.handleClick}
					onLoadChildren={this.handleLoadChildren}
					searchValue={searchValue}
					selected={Boolean(selected)}
				>
					{(children) => this.renderChildren(children)}
				</Node>
			);
		}

		return null;
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
					{this.renderLoader()}
					{this.renderNoOptionsMessage()}
					{this.renderShowMoreButton()}
				</div>
			);
		}

		return null;
	}
}

export default Tree;
