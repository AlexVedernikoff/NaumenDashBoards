// @flow
import cn from 'classnames';
import {connect} from 'react-redux';
import Edit from 'icons/edit.svg';
import {functions, props} from './selectors';
import ListHide from 'icons/listHide.svg';
import ListItem from 'components/organisms/ListItem';
import Point from 'icons/point.svg';
import type {Props, RenderTitleProps} from './types';
import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import Scrollable from 'components/atoms/Scrollable';
import styles from './styles.less';
import {truncate} from './helpers';

const List = ({activeElement, data, goToPoint, showEditForm}: Props) => {
	const [viewList, setViewList] = useState(true);

	const handleOpenLink = actions => () => {
		const [action] = actions || [];

		if (action) {
			const {link} = action;

			window.open(link, '_blank', 'noopener,noreferrer');
		}
	};

	const handleOpenEdit = (uuid: string, codeEditingForm: string) => () => {
		showEditForm(uuid, codeEditingForm);
	};

	const handleGoToPoint = (uuid: string) => () => {
		goToPoint(uuid);
	};

	const handleChangeView = () => {
		setViewList(!viewList);
	};

	const handleSearch = () => {
		setViewList(!viewList);
	};

	const renderSearch = () => {
		const classNames = cn({
			[styles.inputSearch]: true
		});

		return (
			<div className={styles.wrapInputSearch}>
				<input className={classNames} onClick={handleSearch} type='text' />
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

	const renderTitle = ({actions, codeEditingForm, title, uuid}: RenderTitleProps) => {
		const classNamesEdit = cn({
			[styles.itemButton]: true,
			[styles.disabled]: !codeEditingForm
		});
		const props = {
			className: styles.itemTitle,
			onClick: handleOpenLink(actions)
		};
		let value = title;

		if (value && value.length > 30) {
			props['data-tip'] = value;
			value = truncate(value, 30);
		}

		return (
			<div className={styles.itemTitleContainer}>
				<div {...props}>{value}</div>
				<Edit className={classNamesEdit} onClick={handleOpenEdit(uuid, codeEditingForm)} />
				<Point className={styles.itemButton} onClick={handleGoToPoint(uuid)} title="Показать на схеме" />
			</div>
		);
	};

	const renderContainer = item => {
		return (
			<div className={styles.itemList} key={item.id}>
				{renderTitle(item)}
				{(item.options || []).map(option => <ListItem key={option.label} label={option.label} value={option.value} />)}
				<ReactTooltip type="light" />
			</div>
		);
	};

	const renderList = item => {
		const [action] = item.actions || [];

		if (action) {
			const {link} = action;

			if (!link) {
				return;
			}
		} else {
			return;
		}

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
			{renderSearch()}
			<Scrollable>
				{activeElement && renderContainer(activeElement)}
				{data.flat().map(renderList)}
			</Scrollable>
		</div>
	);
};

export default connect(props, functions)(List);
