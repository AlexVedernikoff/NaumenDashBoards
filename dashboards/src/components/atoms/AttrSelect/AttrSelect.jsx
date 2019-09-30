// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {MultiSelect} from 'components/atoms';
import type {Props} from './types';
import React, {Component} from 'react';

/* Компонент является декоратором для Select библиотеки react-select.
* !!! Все props пробрасываются дальше в компонент Select.
*/
export class AttrSelect extends Component<Props> {
	attrOptionLabel = (o: Attribute) => o.title;

	attrOptionValue = (o: Attribute) => o.code;

	noAttrMessage = () => 'Выберите источник данных';

	renderSelect = () => (
		<MultiSelect
			getOptionLabel={this.attrOptionLabel}
			getOptionValue={this.attrOptionValue}
			noOptionsMessage={this.noAttrMessage}
			{...this.props}
		/>
	);

	render () {
		return this.renderSelect();
	}
}

export default AttrSelect;
