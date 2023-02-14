// @flow
import cn from 'classnames';
import {connect} from 'react-redux';
import {debounce, stringUnification, truncate} from './helpers';
import Edit from 'icons/edit.svg';
import {functions, props} from './selectors';
import ListHideIcon from 'icons/listHide.svg';
import ListItem from 'components/organisms/ListItem';
import Point from 'icons/point.svg';
import type {Props, RenderTitleProps} from './types';
import React, {useCallback, useState} from 'react';
import ReactTooltip from 'react-tooltip';
import Scrollable from 'components/atoms/Scrollable';
import SearchIcon from 'icons/search.svg';
import ShowFullIcon from 'icons/showFull.svg';
import styles from './styles.less';

const List = ({activeElement, data, goToPoint, searchObjects, searchText, setActiveElement, setSearchObjects, setSearchText, showEditForm}: Props) => {
	const [viewList, setViewList] = useState(true);
	const [valueSearch, setValueSearch] = useState('');

	const debounceSearch = useCallback(debounce((value: string) => {
		setSearchText(stringUnification(value));
	}), [setSearchText]);

	const handleOpenLink = actions => () => {
		const [action] = actions || [];

		if (action) {
			const {link} = action;

			window.open(link, '_blank', 'noopener,noreferrer');
		}
	};

	const handleOpenEdit = (uuid: string, codeEditingForm: string) => () => {
		if (codeEditingForm) {
			showEditForm(uuid, codeEditingForm);
		}
	};

	const handleGoToPoint = (uuid: string) => () => {
		goToPoint(uuid);
	};

	const handleChangeView = () => {
		setViewList(!viewList);
	};

	const handleSearch = (e: InputEvent) => {
		const value = e.target.value;
		setValueSearch(value);
		debounceSearch(value);
	};

	const handleShowFull = () => {
		setSearchText('');
		setSearchObjects([]);
		setValueSearch('');
		setActiveElement(null);
	};

	const renderShowFull = () => {
		if (activeElement || searchText) {
			return (
				<div className={styles.wrapShowFull} onClick={handleShowFull}>
					<ShowFullIcon className={styles.iconShowFull} />
					<div className={styles.textShowFull}>Показать полный список</div>
				</div>
			);
		}

		return null;
	};

	const renderSearch = () => {
		const classNames = cn({
			[styles.wrapInputSearch]: true,
			[styles.wrapInputSearchViewActive]: !viewList
		});

		return (
			<div className={classNames}>
				<div className={styles.iconSearch}>
					<SearchIcon />
				</div>

				<input className={styles.inputSearch} onInput={handleSearch} type='text' value={valueSearch} />
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
				<ListHideIcon />
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

		return renderContainer(item);
	};

	const renderNoSearch = () => {
		return <div className={styles.text}>По такому запросу ничего не найдено.</div>;
	};

	const renderContent = () => {
		if (activeElement) {
			return renderList(activeElement);
		}

		if (!searchObjects.length && searchText) {
			return renderNoSearch();
		}

		if (searchObjects.length) {
			return searchObjects.map(renderList);
		}

		return data.flat().map(renderList);
	};

	const classNames = cn({
		[styles.wrapList]: true,
		[styles.wrapListHide]: !viewList
	});

	return (
		<div className={classNames}>
			{renderChangeView()}
			{renderShowFull()}
			{renderSearch()}
			<Scrollable>
				{renderContent()}
			</Scrollable>
		</div>
	);
};

export default connect(props, functions)(List);
