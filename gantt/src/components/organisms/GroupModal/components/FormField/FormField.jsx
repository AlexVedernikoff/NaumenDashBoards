// @flow
import Label from 'components/atoms/Label';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class FormField extends PureComponent<Props> {
	static defaultProps = {
		className: styles.field
	};

	render (): React$Node {
		const {children, className, label} = this.props;

		return (
			<div className={className}>
				<Label className={styles.label}>{label}</Label>
				{children}
			</div>
		);
	}
}

export default FormField;
