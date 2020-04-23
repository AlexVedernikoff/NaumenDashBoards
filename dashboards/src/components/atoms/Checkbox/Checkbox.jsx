// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Checkbox extends PureComponent<Props> {
	handleClick = () => {
		const {name, onChange, value} = this.props;
		onChange({name, value});
	};

	render () {
		const {checked} = this.props;
		const {CHECKBOX, CHECKBOX_CHECKED} = ICON_NAMES;
		const name = checked ? CHECKBOX_CHECKED : CHECKBOX;
		const iconCN = cn({
			[styles.icon]: true,
			[styles.checked]: checked
		});

		return <Icon className={iconCN} name={name} onClick={this.handleClick} />;
	}
}

export default Checkbox;
