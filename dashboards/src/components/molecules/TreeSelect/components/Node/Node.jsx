// @flow
import Button, {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button';
import cn from 'classnames';
import {escapeString} from 'helpers';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import Loader from 'components/atoms/Loader';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';

export class Node extends PureComponent<Props, State> {
	state = {
		expanded: !!this.props.searchValue && this.hasChildren(this.props)
	};

	componentDidUpdate (prevProps: Props) {
		const {searchValue} = this.props;

		if (searchValue !== prevProps.searchValue && this.hasChildren(this.props)) {
			this.setState({expanded: !!searchValue});
		}
	}

	hasChildren (props: Props): boolean {
		const {children} = props.data;

		return Array.isArray(children) && children.length > 0;
	}

	getLabelClassName = () => {
		const {selected} = this.props;

		return cn({
			[styles.labelContainer]: true,
			[styles.selectedNode]: selected,
			[styles.foundNode]: this.isFoundLabel()
		});
	};

	handleClick = () => {
		const {data, disabled, onClick} = this.props;

		!disabled && onClick(data);
	};

	handleClickShowMore = () => {
		const {data, onLoadChildren} = this.props;

		onLoadChildren(data);
	};

	handleClickToggleIcon = () => {
		const {data, onLoadChildren} = this.props;
		const {expanded} = this.state;
		const {children} = data;

		if (!expanded && Array.isArray(children) && children.length === 0) {
			onLoadChildren(data);
		}

		this.setState({expanded: !expanded});
	};

	isFoundLabel = () => {
		const {data, getNodeLabel, searchValue} = this.props;

		return searchValue && (new RegExp(escapeString(searchValue), 'i')).test(getNodeLabel(data));
	};

	renderChildren = () => {
		const {children, data} = this.props;
		const {expanded} = this.state;
		const {children: nodeChildren} = data;

		if (expanded && Array.isArray(nodeChildren) && nodeChildren.length > 0) {
			return (
				<div className={styles.childrenContainer}>
					{expanded && children(nodeChildren)}
					{this.renderShowMoreButton()}
				</div>
			);
		}

		return null;
	};

	renderLabel = () => {
		const {data, disabled, getNodeLabel} = this.props;
		const labelCN = cn({
			[styles.label]: true,
			[styles.disabledLabel]: disabled
		});
		const label = getNodeLabel(data);

		return (
			<div className={labelCN} onClick={this.handleClick} title={label}>
				{label}
			</div>
		);
	};

	renderLabelContainer = () => (
		<div className={this.getLabelClassName()}>
			{this.renderLoader()}
			{this.renderToggleIcon()}
			{this.renderLabel()}
		</div>
	);

	renderLoader = () => {
		const {loading} = this.props.data;

		if (loading) {
			return (
				<div className={styles.toggleIconContainer}>
					<Loader size={20} />
				</div>
			);
		}
	};

	renderShowMoreButton = () => {
		const {data, showMore} = this.props;
		const {children, error, loading, uploaded} = data;

		if (children && showMore && !(loading || uploaded || error)) {
			return (
				<Button className={styles.showMoreButton} onClick={this.handleClickShowMore} variant={BUTTON_VARIANTS.SIMPLE}>
					<T text="TreeSelectNode::ShowMore" />
				</Button>
			);
		}
	};

	renderToggleIcon = () => {
		const {data} = this.props;
		const {expanded} = this.state;
		const {TOGGLE_COLLAPSED, TOGGLE_EXPANDED} = ICON_NAMES;
		const name = expanded ? TOGGLE_EXPANDED : TOGGLE_COLLAPSED;
		const iconCN = cn({
			[styles.toggleIconContainer]: true,
			[styles.invisibleContainer]: data.children === null
		});

		if (!data.loading) {
			return (
				<div className={iconCN} onClick={this.handleClickToggleIcon}>
					<Icon className={styles.toggleIcon} name={name} />
				</div>
			);
		}
	};

	render () {
		return (
			<Fragment>
				{this.renderLabelContainer()}
				{this.renderChildren()}
			</Fragment>
		);
	}
}

export default Node;
