// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Props} from 'components/organisms/Content/types';
import React, { useState } from 'react';
import styles from './styles.less';

const ListItemValue = ({label, url}: Props) => {
	const [viewTextFull, setViewTextFull] = useState(false);

	const truncate = (str, n) => {
		return str.length > n && viewTextFull ? str.substr(0, n - 1) : str;
	};

	const changeViewText = () => {
		setViewTextFull(!viewTextFull);
	};

	const renderValue = value => {
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

		return <div className={styles.itemDesc}>{label}</div>;
	};

	const renderTextFull = () => {
		return <div onClick={changeViewText}>{viewTextFull ? 'Показать подробнее' : 'Скрыть' }</div>;
	};

	return (
		<div>
			{renderValue()}
			{label.length > 255 && renderTextFull()}
		</div>
	);
};

export default connect(props, functions)(ListItemValue);
