// @flow
import 'rc-menu/assets/index.css';
import {Icon, OutsideClickDetector} from 'naumen-common-components';
import Menu, {Item} from 'rc-menu';
import type {Props} from './types';
import React from 'react';
import styles from './styles.less';

const CheckedMenu = (props: Props) => {
	const {items, onCheck, onToggle} = props;

	const handleCheck = value => onCheck(value);

	const renderItems = () => items.map(item => <Item key={item.code} onClick={() => handleCheck(item)}>{item.label}</Item>);

	return (
		<OutsideClickDetector onClickOutside={onToggle}>
			<Menu
				className={styles.submenu}
				expandIcon={<Icon name='EXPAND' />}
				mode="vertical-right"
			>
				{renderItems()}
			</Menu>
		</OutsideClickDetector>
	);
};

export default CheckedMenu;
