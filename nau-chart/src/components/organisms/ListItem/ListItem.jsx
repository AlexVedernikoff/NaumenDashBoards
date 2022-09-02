// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Props} from 'components/organisms/Content/types';
import React, { useState } from 'react';
import styles from './styles.less';

const ListItem = ({label, value}: Props) => {
	const [viewTextFull, setViewTextFull] = useState(false);

	const truncate = (str, n) => {
		return str.length > n && viewTextFull ? str.substr(0, n - 1) : str;
	};

	const changeViewText = () => {
		setViewTextFull(!viewTextFull);
	};

	const renderLink = value => {
		if (value.url) {
			return <a className={styles.itemDesc} href={value.url} rel="noreferrer" target="_blank">{value.label}</a>;
		} else {
			return <div className={styles.itemDesc}>{value.label}</div>;
		}
	};

	const renderTextFull = () => {
		return <div onClick={changeViewText}>{viewTextFull ? 'Показать подробнее' : 'Скрыть' }</div>;
	};

	return (
		<div className={styles.itemContainer} key={label}>
			<div className={styles.itemTitle}>
				{truncate(label, 255)}
				{label.length > 255 && renderTextFull()}
			</div>
			{renderLink(value)}
		</div>
	);
};

export default connect(props, functions)(ListItem);
