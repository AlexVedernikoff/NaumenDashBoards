// @flow
import {Checkbox, FormControl} from 'naumen-common-components';
import React, {useEffect, useState} from 'react';
import {setUsers} from 'store/App/actions';
import {useDispatch} from 'react-redux';

const CheckboxPrivilege = ({code, users, value}) => {
	const dispatch = useDispatch();

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

		dispatch(setUsers(users));
	}, [isActive]);

	return (
		<FormControl label="" small={true}>
			<Checkbox checked={isActive} name="Checkbox" onChange={changeCheckbox} value={isActive} />
		</FormControl>
	);
};

export default CheckboxPrivilege;
