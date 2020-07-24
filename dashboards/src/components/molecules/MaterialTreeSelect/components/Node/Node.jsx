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
		const {data, enabled, onClick} = this.props;
		enabled && onClick(data);
	};

	handleClickShowMore = () => {
		const {children, data, getOptionValue, onLoadMoreChildren} = this.props;
		onLoadMoreChildren && onLoadMoreChildren(getOptionValue(data.value), Children.count(children));
	};

	handleClickToggleIcon = () => {
		const {data, onClickToggleIcon} = this.props;
		onClickToggleIcon(data);
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
		const {data, enabled, getOptionLabel} = this.props;
		const labelCN = cn({
			[styles.label]: true,
			[styles.disabledLabel]: !enabled
		});
		const label = getOptionLabel(data.value);

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
		const {data, expanded} = this.props;
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
			<div>
				{this.renderLabelContainer()}
				{this.renderChildren()}
			</div>
		);
	}
}

export default Node;
