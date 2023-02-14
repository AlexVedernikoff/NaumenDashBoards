// @flow
import Button from 'components/atoms/Button';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React from 'react';
import Select from 'components/atoms/Select';
import styles from './styles.less';

const TopMenu = ({
	changeEditingGlobal,
	dataDefaultView,
	editingGlobal,
	personalViewData,
	setDefaultViewData
}: Props) => {
	const handleChangeEditingGlobal = editing => () => {
		changeEditingGlobal(editing);
	};

	const handleSelectView = ({value: view}) => {
		setDefaultViewData(view);
	};

	const renderLeftMenu = () => {
		return (
			<div className={styles.wrapLeftTopMenu}>
				<Select
					className={styles.selectViews}
					disabled={editingGlobal}
					onSelect={handleSelectView}
					options={personalViewData}
					placeholder={'Выберите вид'}
					value={dataDefaultView}
				/>
				<IconButton className={styles.iconButton} icon={ICON_NAMES.DOWNLOAD} />
			</div>
		);
	};

	const renderEditingButton = () => {
		if (editingGlobal) {
			return null;
		}

		return (
			<div className={styles.wrapRightTopMenu}>
				<Button className={styles.buttonTopMenu} onClick={handleChangeEditingGlobal(true)}>
					Редактировать вид
				</Button>
			</div>
		);
	};

	const renderSaveAndResetButton = () => {
		if (!editingGlobal) {
			return null;
		}

		return (
			<div className={styles.wrapRightTopMenu}>
				<IconButton className={styles.iconButton} icon={ICON_NAMES.CLEAR}></IconButton>
				<Button className={styles.buttonTopMenu} onClick={handleChangeEditingGlobal(false)}>
					Отменить
				</Button>
				<Button className={styles.buttonTopMenu}>
					Сохранить
				</Button>
			</div>
		);
	};

	return (
		<div className={styles.wrapTopMenu}>
			{renderLeftMenu()}
			{renderEditingButton()}
			{renderSaveAndResetButton()}
		</div>
	);
};

export default connect(props, functions)(TopMenu);
