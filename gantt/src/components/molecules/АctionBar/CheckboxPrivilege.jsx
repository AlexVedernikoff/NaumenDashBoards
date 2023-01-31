// @flow
import {Checkbox, FormControl} from 'naumen-common-components';
import type {Dispatch, ThunkAction} from 'store/types';
import {deepClone} from 'src/helpers';
import React, {useEffect, useState} from 'react';
import {
	setUsers
} from 'store/App/actions';
import styles from './styles.less';
import {useDispatch, useSelector} from 'react-redux';

const CheckboxPrivilege = ({code, nameUser, show, users, value}) => {
	const dispatch = useDispatch();
	const store = useSelector(state => state);

	const [isActive, setIsActive] = useState(value);
	const usersClone = deepClone(store.APP.users);

	const changeCheckbox = () => {
		setIsActive(!isActive);

		usersClone.forEach(item => {
			item.users.forEach(userCLone => {
				if (userCLone.code === code) {
					userCLone.ganttMaster = !isActive;
				}
			});
		});

		dispatch(setUsers(usersClone));
	};

	useEffect(() => {
		users.forEach(user => {
			if (user.code === code) {
				user.ganttMaster = isActive;
			}
		});
	}, [isActive]);

	return (
		<FormControl className={styles.formControlWrapper} small={true}>
			<div className={styles.title}>{nameUser}</div>
			<Checkbox checked={isActive} name="Checkbox" onChange={changeCheckbox} value={isActive} />
		</FormControl>
	);
};

export default CheckboxPrivilege;
