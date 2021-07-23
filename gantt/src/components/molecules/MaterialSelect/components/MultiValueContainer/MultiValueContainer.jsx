// @flow
import Button from 'components/atoms/Button';
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Node} from 'react';
import type {Option, Props, State} from './types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class MultiValueContainer extends Component<Props, State> {
	static defaultProps = {
		displayLimit: 8,
		placeholder: ''
	};

	state = {
		showAllTags: false
	};

	handleClickMoreButton = () => this.setState({showAllTags: true});

	handleClickTag = (e: SyntheticMouseEvent<HTMLDivElement>) => {
		const {onRemove} = this.props;
		const {index} = e.currentTarget.dataset;

		onRemove && onRemove(Number(index));
	};

	renderCaret = () => <div className={styles.caret}><Icon name={ICON_NAMES.CARET} /></div>;

	renderClearButton = () => (
		<div className={styles.clearButtonContainer}>
			<Button onClick={this.props.onClear} variant={BUTTON_VARIANTS.SIMPLE}>Очистить</Button>
		</div>
	);

	renderMoreTagsInfo = () => {
		const {displayLimit, values} = this.props;
		const {showAllTags} = this.state;

		if (values.length > displayLimit && !showAllTags) {
			const left = values.length - displayLimit;

			return (
				<div className={styles.moreTagsInfoContainer}>
					<span className={styles.moreTagsInfo}>И еще {left}</span>
					<button className={styles.moreTagsButton} onClick={this.handleClickMoreButton}>Показать все</button>
				</div>
			);
		}
	};

	renderPlaceholder = () => {
		const {placeholder, values} = this.props;
		const cnLabel = cn({
			[styles.label]: true,
			[styles.labelAboveValues]: values.length > 0
		});

		return <div className={cnLabel}>{placeholder}</div>;
	};

	renderTag = (option: Option, index) => {
		const {getOptionLabel} = this.props;
		const label = getOptionLabel(option);

		return (
			<div className={styles.tagContainer} data-index={index} onClick={this.handleClickTag} title={label}>
				<div className={styles.tagLabel}>{label}</div>
				<Icon className={styles.clearTagIcon} name={ICON_NAMES.REMOVE} />
			</div>
		);
	};

	renderTags = (): Array<Node> => {
		const {displayLimit, values} = this.props;
		const {showAllTags} = this.state;
		const tags = showAllTags ? values : values.slice(0, displayLimit);

		return tags.map(this.renderTag);
	};

	renderTagsContainer = () => {
		const {values} = this.props;

		if (values.length > 0) {
			return (
				<div className={styles.tagsContainer}>
					{this.renderClearButton()}
					{this.renderTags()}
					{this.renderMoreTagsInfo()}
				</div>
			);
		}
	};

	renderValues = () => {
		const {getOptionLabel, values} = this.props;

		if (values.length > 0) {
			return (
				<div className={styles.values}>
					{values.map(getOptionLabel).join(', ')}
				</div>
			);
		}
	};

	renderValuesContainer = () => {
		const {onClick} = this.props;

		return (
			<div className={styles.valuesContainer} onClick={onClick}>
				{this.renderValues()}
				{this.renderPlaceholder()}
				{this.renderCaret()}
			</div>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderValuesContainer()}
				{this.renderTagsContainer()}
			</Fragment>
		);
	}
}

export default MultiValueContainer;
