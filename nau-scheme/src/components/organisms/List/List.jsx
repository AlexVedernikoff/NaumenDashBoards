// @flow
import cn from 'classnames';
import {connect} from 'react-redux';
import Edit from 'icons/edit.svg';
import {functions, props} from './selectors';
import ListHide from 'icons/listHide.svg';
import type {Props} from 'components/organisms/Content/types';
import React, { useState } from 'react';
import styles from './styles.less';

const List = ({activeElement, data}: Props) => {
	const [viewList, setViewList] = useState(false);

	const handleOpenEdit = actions => () => {
		const [action] = actions || [];

		if (action) {
			const {link} = action;

			window.open(link, '_blank', 'noopener,noreferrer');
		}
	};

	const handleChangeView = () => {
		setViewList(!viewList);
	};

	const renderContainer = item => {
		return (
			<div className={styles.itemList} key={item.id}>
				{renderTitle(item)}
				{(item.options || []).map(option => renderChildren(option))}
			</div>
		);
	};

	const renderLink = value => {
		if (value.url) {
			return <a className={styles.itemDesc} href={value.url} rel="noreferrer" target="_blank">{value.label}</a>;
		} else {
			return <div className={styles.itemDesc}>{value.label}</div>;
		}
	};

	const renderChildren = ({label, value}) => {
		return (
			<div className={styles.itemContainer} key={label}>
				<div className={styles.itemTitle}>{label}</div>
				{renderLink(value)}
			</div>
		);
	};

	const renderChangeView = () => {
		return (
			<button className={styles.buttonChangeView} onClick={handleChangeView}>
				<ListHide />
			</button>
		);
	};

	const renderTitle = ({actions, title}) => {
		return (
			<div className={styles.itemTitleContainer}>
				<div className={styles.itemTitle}>{title}</div>
				<Edit className={styles.itemEditButton} onClick={handleOpenEdit(actions)} />
			</div>
		);
	};

	const renderList = item => {
		if (activeElement && activeElement.id === item.id) {
			return;
		}

		return renderContainer(item);
	};

	const classNames = cn({
		[styles.wrapList]: true,
		[styles.wrapListHide]: !viewList
	});

	return (
		<div className={classNames}>
			{renderChangeView()}
			{activeElement && renderContainer(activeElement)}
			{data.map(renderList)}
		</div>
	);
};

export default connect(props, functions)(List);
