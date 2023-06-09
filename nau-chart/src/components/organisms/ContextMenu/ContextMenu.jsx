// @flow
import cn from 'classnames';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Props} from 'components/organisms/Content/types';
import React from 'react';
import styles from './styles.less';

const ContextMenu = ({activeElement, contextMenu, showEditForm}: Props) => {
	if (!contextMenu) {
		return null;
	}

	const {actions, codeEditingForm, uuid} = activeElement;

	const handleOpenPage = () => {
		const [action] = actions || [];

		if (action) {
			const {link} = action;

			window.open(link, '_blank', 'noopener,noreferrer');
		}
	};

	const handleEditForm = () => {
		showEditForm(uuid, codeEditingForm);
	};

	const classNames = cn({
		[styles.wrapMenuListItem]: true,
		[styles.disabled]: !codeEditingForm
	});

	return (
		<div
			className={styles.wrapMenu}
			style={{
				left: contextMenu.x,
				top: contextMenu.y
			}}
		>
			<ul className={styles.wrapMenuList}>
				<li className={classNames} onClick={handleEditForm}>Редактировать</li>
				<li className={styles.wrapMenuListItem} onClick={handleOpenPage}>Перейти на карточку обьекта</li>
			</ul>
		</div>
	);
};

export default connect(props, functions)(ContextMenu);
