// @flow
import {connect} from 'react-redux';
import Download from 'icons/download.svg';
import {functions, props} from './selectors';
import Minus from 'icons/minus.svg';
import Plus from 'icons/plus.svg';
import type {Props} from 'components/organisms/Content/types';
import React from 'react';
import Reload from 'icons/reload.svg';
import Reset from 'icons/reset.svg';

import styles from './styles.less';

const Control = ({getDataEntity, position, scale, setExportTo, setPosition, setScale}: Props) => {
	const exportFormatList = [
		{format: 'jpeg', title: 'JPG'},
		{format: 'png', title: 'PNG'},
		{format: 'pdf', title: 'PDF'}
	];

	const addScale = () => {
		if (scale === 2) {
			return;
		}

		if (scale >= 1) {
			setScale(scale + 0.5);
		} else {
			setScale(scale * 2);
		}
	};

	const decreaseScale = () => {
		if (scale === 0.25) {
			return;
		}

		if (scale >= 1) {
			setScale(scale - 0.5);
		} else {
			setScale(scale / 2);
		}
	};

	const reloadSchema = () => {
		getDataEntity();
		setScale(scale);
		setPosition(position);
	};

	const exportSchema = format => () => {
		setExportTo(format);
	};

	const resetSchemaSetting = () => {
		setScale(1);
		setPosition({x: 0, y: 0});
	};

	const renderReloadSchema = () => {
		return <div className={styles.containerControl}>
			<button className={styles.control} onClick={reloadSchema}>
				<Reload />
			</button>
		</div>;
	};

	const renderZoomControl = () => {
		return <div className={styles.containerControl}>
			<button className={styles.control} onClick={addScale}>
				<Plus />
			</button>
			<button className={styles.control} onClick={decreaseScale}>
				<Minus />
			</button>
		</div>;
	};

	const renderExportList = () => exportFormatList.map(({format, title}) => <li className={styles.containerHoverListItem} key={format} onClick={exportSchema(format)}>{title}</li>);

	const renderExportSchema = () => {
		return <div className={styles.containerControl}>
			<button className={styles.control} >
				<Download />
			</button>
			<div className={styles.containerHoverWrap}>
				<ul className={styles.containerHoverList}>
					{renderExportList()}
				</ul>
			</div>
		</div>;
	};

	const renderResetSchemaSetting = () => {
		return <div className={styles.containerControl}>
			<button className={styles.control} >
				<Reset />
			</button>
			<div className={styles.containerHoverWrap}>
				<ul className={styles.containerHoverList}>
					<li className={styles.containerHoverListItem} onClick={resetSchemaSetting}>Сбросить настройки вида</li>
				</ul>
			</div>
		</div>;
	};

	return (
		<div className={styles.wrapControl}>
			{renderReloadSchema()}
			{renderZoomControl()}
			{renderExportSchema()}
			{renderResetSchemaSetting()}
		</div>
	);
};

export default connect(props, functions)(Control);
