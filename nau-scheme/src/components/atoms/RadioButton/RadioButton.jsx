// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class RadioButton extends PureComponent<Props> {
	componentDidMount () {
		const {setTrigger} = this.props;
		setTrigger && setTrigger(this.handleClick);
	}

	handleClick = () => {
		const {name, onChange, value} = this.props;
		onChange && onChange({name, value});
	};

	renderCheckedIcon = () => <Icon className={cn(styles.icon, styles.checkedIcon)} name={ICON_NAMES.RADIO_CHECKED} onClick={this.handleClick} />;

	renderIcon = () => <Icon className={styles.icon} name={ICON_NAMES.RADIO} onClick={this.handleClick} />;

	render () {
		return this.props.checked ? this.renderCheckedIcon() : this.renderIcon();
	}
}

export default RadioButton;
