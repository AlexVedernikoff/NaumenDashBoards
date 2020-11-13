// @flow
import React, {cloneElement} from 'react';
import {DropDownList} from '@progress/kendo-react-dropdowns';
import type {Props} from './types';
import styles from './DropdownList.less';

const DropdownList = ({
	value,
	label,
	data,
	onChange: handleChange
}: Props) => {
	const itemRender = (li, itemProps) => {
		const itemChildren = (
			<span className={styles.itemWrapper}>{li.props.children}</span>
		);

		return cloneElement(li, li.props, itemChildren);
	};
	return (
		<div>
			<p>{label}</p>
			<DropDownList
				onChange={handleChange}
				data={data}
				textField="value"
				dataItemKey="id"
				value={value}
				itemRender={itemRender}
			/>
		</div>
	);
};

export default DropdownList;
