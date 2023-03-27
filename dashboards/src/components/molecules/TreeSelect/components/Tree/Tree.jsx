// @flow
import Button, {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button';
import {getMapValues} from 'helpers';
import Loader from 'components/atoms/Loader';
import memoize from 'memoize-one';
import type {Node} from 'components/molecules/TreeSelect/types';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';

export class Tree extends Component<Props> {
	static defaultProps = {
		isDisabled: () => false,
		loading: false,
		multiple: false,
		showMore: false,
		treeListEmptytext: 'Tree::ListEmpty',
		value: '',
		values: []
	};

	componentDidMount () {
		const {loading, onFetch, options, searchValue} = this.props;

		if (!loading && !searchValue && Object.keys(options).length === 0 && typeof onFetch === 'function') {
			onFetch(null);
		}
	}

	getRoots = memoize(options => getMapValues(options).filter(node => !node.parent));

	handleClickShowMore = () => {
		const {onFetch, options} = this.props;

		onFetch && onFetch(null, this.getRoots(options).length);
	};

	handleLoadChildren = (node: Node) => {
		const {onFetch} = this.props;
		const {children, loading, uploaded} = node;

		if (onFetch && Array.isArray(children) && !loading && !uploaded) {
			onFetch(node, children.length);
		}
	};

	isSelected = (node: Node): boolean => {
		const {getNodeValue, getOptionValue, multiple, value, values} = this.props;

		return multiple
			? !!values.find(v => getOptionValue(v) === getNodeValue(node))
			: getOptionValue(value) === getNodeValue(node);
	};

	renderChildren = (children: Array<string>): Array<React$Node> => {
		const {options} = this.props;

		return children.map(id => options[id] && this.renderNode(options[id]));
	};

	renderLoader = () => this.props.loading && <div className={styles.message}><Loader size={35} /></div>;

	renderNoOptionsMessage = () => {
		const {loading, options, treeListEmptytext} = this.props;
		const loaded = !loading;
		const noOptions = Object.keys(options).length === 0;

		// return loaded && noOptions ? <div className={styles.message}><T text="Tree::ListEmpty" /></div> : null;
		return loaded && noOptions ? <div className={styles.message}><T text={treeListEmptytext} /></div> : null;
	};

	renderNode = (node: Node) => {
		const {components, getNodeLabel, isDisabled, onSelect, searchValue, showMore} = this.props;
		const {Node: NodeComponent} = components;
		const selected = this.isSelected(node);
		const disabled = isDisabled(node);

		return (
			<NodeComponent
				data={node}
				disabled={disabled}
				getNodeLabel={getNodeLabel}
				key={node.id}
				onClick={onSelect}
				onLoadChildren={this.handleLoadChildren}
				searchValue={searchValue}
				selected={selected}
				showMore={showMore}
			>
				{children => this.renderChildren(children)}
			</NodeComponent>
		);
	};

	renderShowMoreButton = () => {
		const {searchValue, showMore} = this.props;

		if (showMore && !searchValue) {
			return (
				<Button
					className={styles.showMoreButton}
					onClick={this.handleClickShowMore}
					variant={BUTTON_VARIANTS.SIMPLE}
				>
					<T text="Tree::ShowMore" />
				</Button>
			);
		}
	};

	render () {
		const {options} = this.props;

		return (
			<div className={styles.tree}>
				{this.renderNoOptionsMessage()}
				{this.getRoots(options).map(this.renderNode)}
				{this.renderLoader()}
				{this.renderShowMoreButton()}
			</div>
		);
	}
}

export default Tree;
