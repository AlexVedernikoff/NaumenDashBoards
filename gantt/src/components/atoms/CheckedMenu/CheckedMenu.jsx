// @flow
import 'rc-menu/assets/index.css';
import {Checkbox, FormControl, Icon, OutsideClickDetector} from 'naumen-common-components';
import Menu, {Item} from 'rc-menu';
import type {Props} from './types';
import React, {useState} from 'react';
import styles from './styles.less';

const CheckedMenu = (props: Props) => {
	const {items, onCheck, onToggle, position} = props;
	const {left, top} = position;

	const handleCheck = (target, value) => onCheck(target, value);

	const renderItems = () => items.map(item =>
		<Item key={item.code}>
			{renderCheckbox(item)}
		</Item>
	);

	const handleCheckbox = (setValueToLocalState, object) => {
		setValueToLocalState(!object.show);
		handleCheck(object, !object.show);
	};

	const renderCheckbox = item => {
		const [value, setValue] = useState(item.show);

		return (
			<FormControl label={item.label}>
				<Checkbox checked={value} name='Checkbox' onChange={() => handleCheckbox(setValue, item)} value={value} />
			</FormControl>
		);
	};

	return (
		<OutsideClickDetector onClickOutside={onToggle}>
			<Menu
				className={styles.submenu}
				expandIcon={<Icon name='EXPAND' />}
				style={{left, top}}
			>
				{items.length ? renderItems() : <small className={styles.margin}>Скрытых столбцов нет</small>}
			</Menu>
		</OutsideClickDetector>
	);
};

export default CheckedMenu;
