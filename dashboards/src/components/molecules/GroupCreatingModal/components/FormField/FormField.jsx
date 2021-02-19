// @flow
import cn from 'classnames';
import Label from 'components/atoms/Label';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class FormField extends PureComponent<Props> {
	static defaultProps = {
		className: ''
	};

	render (): React$Node {
		const {children, className, label} = this.props;

		return (
			<div className={cn(styles.field, className)}>
				<Label className={styles.label}>{label}</Label>
				{children}
			</div>
		);
	}
}

export default FormField;
