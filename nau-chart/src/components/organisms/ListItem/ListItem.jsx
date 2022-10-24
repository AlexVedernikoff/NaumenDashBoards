// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import ListItemValue from 'components/organisms/ListItemValue';
import type {Props} from 'components/organisms/Content/types';
import React from 'react';
import styles from './styles.less';

const ListItem = ({label, value}: Props) => {
	return (
		<div className={styles.itemContainer} key={label}>
			<div className={styles.itemTitle}>{label}</div>
			{value.map(({label, url}) => <ListItemValue key={label} label={label} url={url} />)}
		</div>
	);
};

export default connect(props, functions)(ListItem);
