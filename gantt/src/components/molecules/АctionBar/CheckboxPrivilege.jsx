// @flow
import Department from './Department';
import React from 'react';
import type {Departments} from './types';

const CheckboxPrivilege = ({usersClone}) => {

	const renderDepartment = (department, index, usersClone) => <Department data={department} key={index} usersClone={usersClone} />;

	const renderTree = (departments: Departments) => {
		return departments.map((i, index) => renderDepartment(i, index, usersClone));
	};

	const showHTMLData = renderTree(usersClone);

	return <div>{showHTMLData}</div>;
};

export default CheckboxPrivilege;
