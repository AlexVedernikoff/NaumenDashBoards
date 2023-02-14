// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Props} from 'components/organisms/Content/types';
import React, { useState } from 'react';
import styles from './styles.less';

const ListItemValue = ({label, url}: Props) => {
	const [viewTextFull, setViewTextFull] = useState(true);

	const truncate = (str, n) => {
		return str.length > n && viewTextFull ? str.substring(0, n) : str;
	};

	const changeViewText = () => {
		setViewTextFull(!viewTextFull);
	};

	const renderValue = () => {
		const text = truncate(label, 255);

		if (url) {
			const props = {
				className: styles.itemDesc,
				href: url,
				rel: 'noreferrer',
				target: '_blank'
			};

			return <a {...props}>{text}</a>;
		}

		return <div className={styles.itemDesc}>{text}</div>;
	};

	const renderTextFull = () => {
		return <div className={styles.textFull} onClick={changeViewText}>{viewTextFull ? 'Показать подробнее...' : 'Скрыть' }</div>;
	};

	return (
		<div>
			{renderValue()}
			{label.length > 255 && renderTextFull()}
		</div>
	);
};

export default connect(props, functions)(ListItemValue);
