// @flow
import cn from 'classnames';
import type {Components as SavedFiltersComponents, Props, SourceFiltersItem} from './types';
import type {Components as ListComponents} from 'components/molecules/Select/components/List/types';
import type {Components as ListOptionComponents} from 'components/molecules/Select/components/ListOption/types';
import Container from 'components/atoms/Container';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import List from 'components/molecules/Select/components/List';
import ListOption from 'components/molecules/Select/components/ListOption';
import memoize from 'memoize-one';
import type {OnSelectEvent} from 'components/types';
import React, {Component} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';

export class SavedFilters extends Component<Props> {
	static defaultProps = {
		className: '',
		filters: [],
		loading: false
	};

	getComponents = (): SavedFiltersComponents => memoize({
		List: this.renderFilterList,
		ValueContainer: this.renderValueContainer
	});

	getListComponents = (): ListComponents => ({
		ListOption: this.renderListOption
	});

	getListOptionComponents = (): $Shape<ListOptionComponents> => ({
		ValueContainer: this.renderListOptionValueContainer
	});

	handleDeleteFilter = (option: SourceFiltersItem) => (e: SyntheticMouseEvent<HTMLElement>) => {
		const {onDelete} = this.props;
		const {id} = option;

		if (id) {
			onDelete(id);
		}

		e.stopPropagation();
	};

	handleLoadFilters = () => {	};

	handleSelect = ({value}: OnSelectEvent) => {
		const {onSelect} = this.props;
		return onSelect(value);
	};

	renderFilterList = (props) => {
		return (
			<List {...props} components={this.getListComponents()} />
		);
	};

	renderListOption = (props) => {
		return (
			<ListOption {...props} components={this.getListOptionComponents()} />
		);
	};

	renderListOptionValueContainer = (props) => {
		const {children, className, onClick, option} = props;

		return (
			<Container className={className} onClick={onClick}>
				{children}
				<div className={styles.actionButtons}>
					<IconButton
						className={styles.caret}
						icon={ICON_NAMES.BASKET}
						onClick={this.handleDeleteFilter(option)}
					/>
				</div>
			</Container>
		);
	};

	renderValueContainer = ({className, onClick}) => {
		const selectCN = cn([className, styles.savedFilters]);
		return (
			<Container className={selectCN} onClick={onClick}>
				Сохраненные фильтры
			</Container>
		);
	};

	render () {
		const {className, filters, loading} = this.props;
		const selectCN = cn([className, styles.selectTransparent]);

		return (
			<Select
				className={selectCN}
				components={this.getComponents()}
				fetchOptions={this.handleLoadFilters}
				getOptionLabel={(item: SourceFiltersItem) => item.label}
				getOptionValue={(item: SourceFiltersItem) => item.id}
				isSearching={true}
				loading={loading}
				onSelect={this.handleSelect}
				options={filters}
				placeholder="Не выбрано"
			/>
		);
	}
}

export default SavedFilters;
