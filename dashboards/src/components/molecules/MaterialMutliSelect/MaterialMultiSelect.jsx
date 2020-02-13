// @flow
import {Button, OutsideClickDetector} from 'components/atoms';
import {ChevronDownIcon, ClearIcon} from 'icons/form';
import type {Option, Props, State} from './types';
import React, {PureComponent} from 'react';
import {SimpleSelectMenu} from 'components/molecules';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class MaterialMultiSelect extends PureComponent<Props, State> {
	static defaultProps = {
		displayLimit: 6,
		isSearching: false,
		name: ''
	};

	state = {
		showAllTags: false,
		showMenu: false
	};

	getLabel = (option: Option) => option.label;

	handleClickMoreButton = () => this.setState({showAllTags: true});

	handleClickOutside = () => this.setState({showMenu: false});

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

	renderCaret = () => <div className={styles.caret}><ChevronDownIcon /></div>;

	renderClearButton = () => (
		<div className={styles.clearButtonContainer}>
			<Button onClick={this.props.onClear} variant={BUTTON_VARIANTS.SIMPLE}>Очистить</Button>
		</div>
	);

	renderMenu = () => {
		const {isSearching, options, values} = this.props;
		const {showMenu} = this.state;

		if (showMenu) {
			return (
				<SimpleSelectMenu
					isSearching={isSearching}
					multiple={true}
					onSelect={this.handleSelect}
					options={options}
					values={values}
				/>
			);
		}
	};

	renderMoreTagsInfo = () => {
		const {displayLimit, values} = this.props;
		const {showAllTags} = this.state;

		if (!showAllTags) {
			const left = values.length - displayLimit;

			return (
				<div className={styles.moreTagsInfoContainer}>
					<span className={styles.moreTagsInfo}>И еще {left}</span>
					<button className={styles.moreTagsButton} onClick={this.handleClickMoreButton}>Показать все</button>
				</div>
			);
		}
	};

	renderTag = (option: Option) => {
		const {label, value} = option;

		return (
			<div className={styles.tagContainer} data-value={value} onClick={this.handleClickTag}>
				<div className={styles.tagLabel}>{label}</div>
				<ClearIcon className={styles.clearTagIcon} />
			</div>
		);
	};

	renderTags = () => {
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
		const {values} = this.props;

		return (
			<div className={styles.values}>{values.map(this.getLabel).join(', ')}</div>
		);
	};

	renderValuesContainer = () => (
		<div className={styles.valuesContainer} onClick={this.handleClickValue}>
			{this.renderValues()}
			{this.renderCaret()}
		</div>
	);

	render () {
		return (
			<OutsideClickDetector onClickOutside={this.handleClickOutside}>
				<div className={styles.container}>
					{this.renderValuesContainer()}
					{this.renderTagsContainer()}
					{this.renderMenu()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default MaterialMultiSelect;
