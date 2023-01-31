// @flow
import {gantt} from 'naumen-gantt';
import React, {useState} from 'react';
import styles from './styles.less';
import {updateGanttColorSettings} from 'store/App/actions';
import {useDispatch, useSelector} from 'react-redux';
import type {Props} from './types';

const ColorPanel = (props: Props) => {
	const currentColorSettings = useSelector(state => state.APP.currentColorSettings);
	const dispatch = useDispatch();
	const [currentColors, setCurrentColors] = useState(currentColorSettings);
	const tasks = gantt.getTaskByTime();

	const handleCancelClick = () => {
		setCurrentColors(currentColorSettings);
		props.setIsColorsModal(false);
	};

	const handleChangeColor = (event) => {
		const newColorSettings = currentColors.map(item => {
			if (item.id === event.target.id) {
				if (item.background) {
					item.background = event.target.value;
				} else {
					item.color = event.target.value;
				}
			}

			return item;
		});

		setCurrentColors(newColorSettings);
	};

	const handleSaveClick = () => {
		tasks.forEach(item => {
			for (let i = 0; i < currentColors.length; i++) {
				if (currentColors[i] && item.typeEntity === currentColors[i].type) {
					if (currentColors[i].background) {
						item.color = currentColors[i].background;
					} else if (currentColors[i].color) {
						item.textColor = currentColors[i].color;
					}
				}
			}
		});
		gantt.render();
		props.setIsColorsModal(false);
		dispatch(updateGanttColorSettings(currentColors));
	};

	return (
		<div>
			<h4>Панель цветов</h4>
			<form className={styles.wrapper}>
				{currentColors.map(item =>
					(
						item && <div className={styles.colorItem} key={item.id}>
							<input
								id={item.id}
								name="head"
								onChange={handleChangeColor}
								type="color" value={item.background ? item.background : item.color}
							/>
							<label htmlFor="head">{item.label}</label>
						</div>
					)
				)}
			</form>
			<div className={styles.buttons}>
				<button className={styles.saveButton} onClick={handleSaveClick}>Сохранить</button>
				<button className={styles.canсelButton} onClick={handleCancelClick}>Отмена</button>
			</div>
		</div>
	);
};

export default ColorPanel;
