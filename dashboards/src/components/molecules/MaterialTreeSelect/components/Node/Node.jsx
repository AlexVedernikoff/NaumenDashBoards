// @flow
import {Button, Loader} from 'components/atoms';
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {Children, PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class Node extends PureComponent<Props> {
	getLabelClassName = () => {
		const {found, selected} = this.props;

		return cn({
			[styles.labelContainer]: true,
			[styles.selectedNode]: selected,
			[styles.foundNode]: found
		});
	};

	handleClick = () => {
		const {onClick, value} = this.props;
		onClick(value);
	};

	handleClickShowMore = () => {
		const {children, getOptionValue, onLoadMoreChildren, value} = this.props;
		onLoadMoreChildren && onLoadMoreChildren(getOptionValue(value), Children.count(children));
	};

	handleClickToggleIcon = () => {
		const {getOptionValue, onClickToggleIcon, value} = this.props;
		onClickToggleIcon(getOptionValue(value));
	};

	renderChildren = () => {
		const {children} = this.props;

		if (children) {
			return (
				<div className={styles.childrenContainer}>
					{children}
					{this.renderShowMoreButton()}
				</div>
			);
		}

		return null;
	};

	renderLabel = () => {
		const {getOptionLabel, value} = this.props;

		return (
			<div className={styles.label} onClick={this.handleClick}>
				{getOptionLabel(value)}
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
		const {loading} = this.props.value;

		if (loading) {
			return <Loader className={styles.loader} />;
		}
	};

	renderShowMoreButton = () => {
		const {showMoreChildren} = this.props;

		if (showMoreChildren) {
			return (
				<Button className={styles.showMoreButton} onClick={this.handleClickShowMore} variant={BUTTON_VARIANTS.SIMPLE}>
					Показать еще
				</Button>
			);
		}
	};

	renderToggleIcon = () => {
		const {expanded, value} = this.props;
		const {TOGGLE_COLLAPSED, TOGGLE_EXPANDED} = ICON_NAMES;
		const name = expanded ? TOGGLE_EXPANDED : TOGGLE_COLLAPSED;
		const iconCN = cn({
			[styles.toggleIconContainer]: true,
			[styles.invisibleContainer]: value.children === null
		});

		if (!value.loading) {
			return (
				<div className={iconCN} onClick={this.handleClickToggleIcon}>
					<Icon className={styles.toggleIcon} name={name} />
				</div>
			);
		}
	};

	render () {
		return (
			<div>
				{this.renderLabelContainer()}
				{this.renderChildren()}
			</div>
		);
	}
}

export default Node;
