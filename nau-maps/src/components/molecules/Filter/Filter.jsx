// @flow
import {connect} from 'react-redux';
import FilterItem from 'components/atoms/FilterItem';
import {functions, props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import type {StaticGroup} from 'types/point';
import styles from './Filter.less';

export class Filter extends Component<Props> {
	renderButtons = () => {
		const {resetAllGroups, selectAllGroups} = this.props;

		return (
			<div className={styles.filterBtnContainer}>
				<div onClick={selectAllGroups}>Выбрать все</div>
				<div onClick={resetAllGroups}>Снять выбор</div>
			</div>
		);
	};

	renderFilter = () => {
		const {staticGroups} = this.props;

		return (
			<div className={styles.filterListContainer}>
				{staticGroups.map(this.renderFilterItem)}
			</div>
		);
	};

	renderFilterItem = (filterItem: StaticGroup, key: number) => <FilterItem filterItem={filterItem} key={key} />;

	renderHead = () =>
		<div className={styles.filterHead}>
			<div className={styles.filterLable}>Фильтрация</div>
			{this.renderButtons()}
		</div>;

	render () {
		const {open} = this.props;

		if (open) {
			return (
				<div className={styles.filterWrap}>
					<div className={styles.filterContainer}>
						{this.renderHead()}
						{this.renderFilter()}
					</div>
				</div>
			);
		}

		return <div />;
	}
}

export default connect(props, functions)(Filter);
