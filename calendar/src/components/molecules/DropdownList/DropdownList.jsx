// @flow
import {DropDownList} from '@progress/kendo-react-dropdowns';
import type {Props} from './types';
import React from 'react';

const DropdownList = ({label, data}: Props) => {
	return (
		<div>
			<p>{label}</p>
			<DropDownList data={data} textField="value" dataItemKey="id" />
		</div>
	);
};

export default DropdownList;
