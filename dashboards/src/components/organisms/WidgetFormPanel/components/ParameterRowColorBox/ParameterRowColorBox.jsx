// @flow
import cn from 'classnames';
import {DEFAULT_PRESET_COLOR, PRESET_COLORS} from 'store/widgetForms/pivotForm/constants';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Option, Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class ParameterRowColorBox extends PureComponent<Props, State> {
	static defaultProps = {
		color: DEFAULT_PRESET_COLOR
	};

	getHandleChangeColor = (value: string) => () => {
		const {name, onChange} = this.props;
		return onChange({name, value});
	};

	renderOption = (option: Option) => {
		const {value: currentValue} = this.props;
		const {previewColor, value} = option;
		const style = {color: previewColor};
		const CN = cn({
			[styles.colorsSvg]: true,
			[styles.checked]: currentValue === value
		});

		return (
			<div className={styles.colorsItem} key={value} onClick={this.getHandleChangeColor(value)} style={style}>
				<Icon className={CN} height={34} name={ICON_NAMES.ROW_COLOR} viewBox="0 0 50 34" width={50} />
			</div>);
	};

	render () {
		return (
			<div className={styles.colorsList}>
				{PRESET_COLORS.map(this.renderOption)}
			</div>
		);
	}
}

export default ParameterRowColorBox;
