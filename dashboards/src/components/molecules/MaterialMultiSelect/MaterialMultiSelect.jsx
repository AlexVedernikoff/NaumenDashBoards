// @flow
import {Button, OutsideClickDetector} from 'components/atoms';
import {ChevronDownIcon, ClearIcon} from 'icons/form';
import cn from 'classnames';
import type {Node} from 'react';
import type {Option, Props, State} from './types';
import React, {PureComponent} from 'react';
import {SimpleSelectMenu} from 'components/molecules';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class MaterialMultiSelect extends PureComponent<Props, State> {
	static defaultProps = {
		displayLimit: 8,
		isSearching: false,
		name: '',
		showMore: false
	};

	state = {
		showAllTags: false,
		showMenu: false
	};

	getOptionLabel = (option: Object) => {
		const {getOptionLabel} = this.props;
		return getOptionLabel ? getOptionLabel(option) : option.label;
	};

	getOptionValue = (option: Object) => {
		const {getOptionValue} = this.props;
		return getOptionValue ? getOptionValue(option) : option.value;
	};

	handleClickMoreButton = () => this.setState({showAllTags: true});

	handleClickTag = (e: SyntheticMouseEvent<HTMLDivElement>) => {
		const {onRemove} = this.props;
		const {value} = e.currentTarget.dataset;

		onRemove(value);
	};

	handleClickValue = () => this.setState({showMenu: !this.state.showMenu});

	handleSelect = (value: Option) => {
		const {name, onSelect} = this.props;

		this.setState({showMenu: false});
		onSelect(name, value);
	};

	hideMenu = () => this.setState({showMenu: false});

	renderCaret = () => <div className={styles.caret}><ChevronDownIcon /></div>;

	renderClearButton = () => (
		<div className={styles.clearButtonContainer}>
			<Button onClick={this.props.onClear} variant={BUTTON_VARIANTS.SIMPLE}>Очистить</Button>
		</div>
	);

	renderLabel = () => {
		const {values} = this.props;
		const cnLabel = cn({
			[styles.label]: true,
			[styles.labelAboveValues]: values.length > 0
		});

		return <div className={cnLabel}>Выберите значение</div>;
	};

	renderMenu = () => {
		const {
			getOptionLabel,
			getOptionValue,
			isSearching,
			onClickShowMore,
			options,
			showMore,
			values
		} = this.props;
		const {showMenu} = this.state;

		if (showMenu) {
			return (
				<SimpleSelectMenu
					getOptionLabel={getOptionLabel}
					getOptionValue={getOptionValue}
					isSearching={isSearching}
					multiple={true}
					onClickShowMore={onClickShowMore}
					onClose={this.hideMenu}
					onSelect={this.handleSelect}
					options={options}
					showMore={showMore}
					values={values}
				/>
			);
		}
	};

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

	renderTag = (option: Option) => (
		<div className={styles.tagContainer} data-value={this.getOptionValue(option)} onClick={this.handleClickTag}>
			<div className={styles.tagLabel}>{this.getOptionLabel(option)}</div>
			<ClearIcon className={styles.clearTagIcon} />
		</div>
	);

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
				</div>
			);
		}
	};

	renderValues = () => {
		const {values} = this.props;

		if (values.length > 0) {
			return (
				<div className={styles.values}>
					{values.map(this.getOptionLabel).join(', ')}
				</div>
			);
		}
	};

	renderValuesContainer = () => (
		<div className={styles.valuesContainer} onClick={this.handleClickValue}>
			{this.renderValues()}
			{this.renderLabel()}
			{this.renderCaret()}
			{this.renderMenu()}
		</div>
	);

	render () {
		return (
			<OutsideClickDetector onClickOutside={this.hideMenu}>
				<div className={styles.container}>
					{this.renderValuesContainer()}
					{this.renderTagsContainer()}
					{this.renderMoreTagsInfo()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default MaterialMultiSelect;
