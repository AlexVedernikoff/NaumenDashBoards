// @flow
import {DropDownList} from '@progress/kendo-react-dropdowns';
import type {Props} from './types';
import React from 'react';

const DropdownList = ({
	value,
	label,
	data,
	onChange: handleChange
}: Props) => (
	<div>
		<p>{label}</p>
		<DropDownList
			onChange={handleChange}
			data={data}
			textField="value"
			dataItemKey="id"
			value={value}
		/>
	</div>
);

export default DropdownList;
