// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import Text, {TEXT_TYPES} from 'components/atoms/Text';

export class ListItem extends PureComponent<Props> {
	handleClick = () => {
		const {item, onClick} = this.props;

		onClick(item);
	};

	render () {
		const {className, item} = this.props;
		const {label} = item;

		return (
			<Text className={className} onClick={this.handleClick} type={TEXT_TYPES.SMALL}>{label}</Text>
		);
	}
}

export default ListItem;
