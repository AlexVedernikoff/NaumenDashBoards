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

const List = ({activeElement, data, showEditForm}: Props) => {
	const [viewList, setViewList] = useState(true);

	const handleOpenLink = actions => () => {
		const [action] = actions || [];

		if (action) {
			const {link} = action;

			window.open(link, '_blank', 'noopener,noreferrer');
		}
	};

	const handleOpenEdit = uuid => () => {
		showEditForm(uuid);
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

	const renderTitle = ({actions, title, uuid}) => {
		return (
			<div className={styles.itemTitleContainer} >
				<div className={styles.itemTitle} onClick={handleOpenLink(actions)}>{title}</div>
				<Edit className={styles.itemEditButton} onClick={handleOpenEdit(uuid)} />
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
