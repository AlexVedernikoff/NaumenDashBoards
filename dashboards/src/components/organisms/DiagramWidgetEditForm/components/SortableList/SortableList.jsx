// @flow
import type {Item, Props, State} from './types';
import React, {Component} from 'react';
import {ReactSortable} from 'react-sortablejs';
import styles from './styles.less';

export class SortableList extends Component<Props, State> {
	renderHandler = () => <div className={styles.handler} />;

	renderItem = (item: Item, index: number, items: Array<Item>) => {
		const {renderItem} = this.props;

		return (
			<div className={styles.item} key={index}>
				{this.renderHandler()}
				{renderItem(item, index, items)}
			</div>
		);
	};

	render () {
		const {list, onChangeOrder} = this.props;
		const handle = `.${styles.handler}`;

		return (
			<ReactSortable
				chosenClass={styles.chosen}
				ghostClass={styles.ghost}
				handle={handle}
				list={list}
				setList={onChangeOrder}
			>
				{list.map(this.renderItem)}
			</ReactSortable>
		);
	}
}

export default SortableList;
