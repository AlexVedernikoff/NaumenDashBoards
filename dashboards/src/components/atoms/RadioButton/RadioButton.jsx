// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class RadioButton extends PureComponent<Props> {
	handleClick = () => {
		const {name, onChange, value} = this.props;
		onChange({name, value});
	};

	renderCheckedIcon = () => <Icon className={cn(styles.icon, styles.checkedIcon)} name={ICON_NAMES.RADIO_CHECKED} />;

	renderIcon = () => <Icon className={styles.icon} name={ICON_NAMES.RADIO} onClick={this.handleClick} />;

	render () {
		return this.props.checked ? this.renderCheckedIcon() : this.renderIcon();
	}
}

export default RadioButton;
