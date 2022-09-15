// @flow
import cn from 'classnames';
import {connect} from 'react-redux';
import Edit from 'icons/edit.svg';
import {functions, props} from './selectors';
import ListHide from 'icons/listHide.svg';
import ListItem from 'components/organisms/ListItem';
import type {Props} from 'components/organisms/Content/types';
import React, { useState } from 'react';
import Scrollable from 'components/atoms/Scrollable';
import styles from './styles.less';

const List = ({activeElement, data}: Props) => {
	const [viewList, setViewList] = useState(true);

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
				{(item.options || []).map(option => <ListItem key={option.label} label={option.label} value={option.value} />)}
			</div>
		);
	};

	const renderChangeView = () => {
		const classNames = cn({
			[styles.buttonChangeView]: true,
			[styles.buttonChangeViewActive]: !viewList
		});

		return (
			<button className={classNames} onClick={handleChangeView}>
				<ListHide />
			</button>
		);
	};

	const renderTitle = ({actions, title}) => {
		return (
			<div className={styles.itemTitleContainer} onClick={handleOpenEdit(actions)}>
				<div className={styles.itemTitle}>{title}</div>
				<Edit className={styles.itemEditButton} />
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
			<Scrollable>
				{activeElement && renderContainer(activeElement)}
				{data.map(renderList)}
			</Scrollable>
		</div>
	);
};

export default connect(props, functions)(List);
