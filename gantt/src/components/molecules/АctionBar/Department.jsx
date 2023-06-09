// @flow
import ArrowIcon from 'icons/ArrowIcon';
import {Checkbox, FormControl} from 'naumen-common-components';
import cn from 'classnames';
import {deepClone} from 'helpers';
import type {Departments} from './types';
import React, {useState} from 'react';
import {
	setUsers
} from 'store/App/actions';
import styles from './styles.less';
import {useDispatch, useSelector} from 'react-redux';

const Department = ({data, usersClone}) => {
	const {department, showUsers, users, innerDepartments, lvl} = data;
	const [show, setShow] = useState(false);

	const storeUsers = useSelector(state => state.APP.users);

	const dispatch = useDispatch();

	const arrowCN = cn({
		[styles.activeArrow]: showUsers
	});

	const getShowUsersHandler = () => () => {
		setShow(!show);

		data.showUsers = !data.showUsers;
	};

	const findActiveCheckbox = (initialDepartments, departments, isRoot = true) => {
		initialDepartments.forEach((initialDepartment, index) => {
			if (departments[index].users.length) {
				departments[index].users.forEach(user => {
					const userFromInitialDepartment = initialDepartment.users.find(_user => _user.code === user.code);

					if (userFromInitialDepartment) {
						userFromInitialDepartment.ganttMaster = user.ganttMaster;
					}
				});
			}

			if (departments[index].innerDepartments) {
				findActiveCheckbox(initialDepartment.innerDepartments, departments[index].innerDepartments, false);
			}
		});

		if (isRoot) {
			dispatch(setUsers(initialDepartments));
		}
	};

	const getCheckboxChangeHandler = user => () => {
		users.forEach(item => {
			if (item.code === user.code) {
				item.ganttMaster = !item.ganttMaster;
			}
		});

		const _usersClone = deepClone(storeUsers);

		findActiveCheckbox(_usersClone, usersClone);
	};

	const renderUser = user => (
		<FormControl className={styles.formControlWrapper} key={user.code} small={true}>
			<div className={styles.title}>{user.name}</div>
			<Checkbox checked={user.ganttMaster} name="Checkbox" onChange={getCheckboxChangeHandler(user)} value={user.ganttMaster} />
		</FormControl>
	);

	const renderInnerDepartment = (department, index) => <Department data={department} key={index} usersClone={usersClone} />;

	const renderUsers = () => users.map(renderUser);

	const renderInnerDepartments = () => innerDepartments.map(renderInnerDepartment);

	const resultDepartment = [];

	resultDepartment.push(data);

	/**
	 * Функция для проверки существования хотя бы одного пользователя в иерархии подразделений
	 * @param {Departments} departmentsHierarcy - иерархия подразделения
	 * @returns {boolean}
	 */
	const hasUsersInDepartmentHierarchy = departmentsHierarcy => {
		if (resultDepartment?.length) {
			const hasUsers = departmentsHierarcy.some(deparmentHierarcy => {
				if (deparmentHierarcy.users?.length) {
					return true;
				}

				return deparmentHierarcy.innerDepartments ? hasUsersInDepartmentHierarchy(deparmentHierarcy.innerDepartments) : false;
			});

			return hasUsers;
		} else {
			return false;
		}
	};

	const renderHeaderDepartment = () => {
		if (hasUsersInDepartmentHierarchy(resultDepartment)) {
			return (
				<div className={styles.wrapperUser} onClick={getShowUsersHandler()}>
					<ArrowIcon toggleArrow={arrowCN} />
					<div className={styles.department}>{department}</div>
				</div>
			);
		}
	};

	return (
		<div style={{'margin-left': 1 * 20 + 'px'}}>
			{renderHeaderDepartment()}
			{showUsers && renderUsers()}
			{innerDepartments && showUsers && renderInnerDepartments()}
		</div>
	);
};

export default Department;
