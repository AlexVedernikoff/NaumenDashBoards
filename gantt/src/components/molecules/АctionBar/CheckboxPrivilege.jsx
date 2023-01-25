// @flow
import {Checkbox, FormControl} from 'naumen-common-components';
import React, {useEffect, useState} from 'react';
import styles from './styles.less';

const CheckboxPrivilege = ({code, nameUser, show, users, value}) => {
	const [isActive, setIsActive] = useState(value);

	const changeCheckbox = () => {
		setIsActive(!isActive);
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
