// @flow
import {Button} from 'naumen-common-components';
import cn from 'classnames';
import {createPersonalView, deletePersonalView, getGanttData, setPersonal} from 'store/App/actions';
import React, {useEffect, useState} from 'react';
import styles from './styles.less';
import {useDispatch, useSelector} from 'react-redux';

const ViewPanel = () => {
	const isPersonalDiagram = useSelector(state => state.isPersonalDiagram);

	const [activeGeneralViewButton, setActiveGeneralViewButton] = useState(true);
	const [activePersonalViewButton, setActivePersonalViewButton] = useState(false);
	const [isPersonal, setActivePersonal] = useState(isPersonalDiagram);

	const dispatch = useDispatch();

	const generalBtnStyles = cn({
		[styles.generalBtn]: true,
		[styles.active]: activeGeneralViewButton
	});

	const personalBtnStyles = cn({
		[styles.personalBtn]: true,
		[styles.active]: activePersonalViewButton
	});

	const setGeneralView = () => {
		setActiveGeneralViewButton(true);
		setActivePersonalViewButton(false);
		dispatch(getGanttData(false));
		setPersonal(false);
	};

	const setPersonalView = () => {
		setActivePersonalViewButton(true);
		setActiveGeneralViewButton(false);
		dispatch(getGanttData(true));
		setPersonal(true);
	};

	const addView = () => {
		dispatch(createPersonalView());
		setActivePersonal(true);
	};

	const deleteView = () => {
		dispatch(deletePersonalView());
		setActivePersonal(false);
	};

	const renderViewButtons = () => {
		return isPersonal ? <div>
			<Button className={generalBtnStyles} onClick={setGeneralView}>Общий</Button>
			<Button className={personalBtnStyles} onClick={setPersonalView}>Личный</Button>
		</div> : null;
	};

	const renderAddButton = () => {
		return (
			<div>
				{!isPersonal && <Button className={styles.addlBtn} onClick={addView}>Сохранить себе</Button>}
			</div>
		);
	};

	const renderEditAndDeleteButtons = () => {
		return (
			<div>
				{isPersonal && <Button className={styles.deletelBtn} onClick={deleteView}>Удалить</Button>}
			</div>
		);
	};

	useEffect(() => {
		dispatch(setPersonalView(isPersonalDiagram));

		setActivePersonal(isPersonalDiagram);
	}, [isPersonalDiagram]);

	return (
		<div className={styles.wrapper}>
			<div className={styles.leftBlock}>
				{renderViewButtons()}
			</div>
			<div className={styles.rightBlock}>
				{renderAddButton()}
				{renderEditAndDeleteButtons()}
			</div>
		</div>
	);
};

export default ViewPanel;
