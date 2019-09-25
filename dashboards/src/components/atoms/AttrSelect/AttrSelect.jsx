// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Props} from './types';
import React, {Component} from 'react';
import Select from 'react-select';

/* Компонент является декоратором для Select библиотеки react-select.
* !!! Все props пробрасываются дальше в компонент Select.
*/
export class AttrSelect extends Component<Props> {
	attrOptionLabel = (o: Attribute) => o.title;

	attrOptionValue = (o: Attribute) => o.code;

	noAttrMessage = () => 'Выберите источник данных';

	render () {
		return (
			<Select
				getOptionLabel={this.attrOptionLabel}
				getOptionValue={this.attrOptionValue}
				noOptionsMessage={this.noAttrMessage}
				{...this.props}
			/>
		);
	}
}

export default AttrSelect;
