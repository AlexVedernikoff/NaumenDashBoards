// @flow
import type {Item, Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class List extends PureComponent<Props> {
	renderItem = (item: Item) => {
		const {components, onSelect} = this.props;
		const {ListItem} = components;

		return <ListItem className={styles.listItem} item={item} onClick={onSelect} />;
	};

	render (): Array<React$Node> | null {
		const {options, show} = this.props;
		return show ? options.map(this.renderItem) : null;
	}
}

export default List;
