// @flow
import Field from 'components/atoms/FieldError';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import withErrors from 'GroupModal/HOCs/withErrors';

export class FieldError extends PureComponent<Props> {
	static defaultProps = {
		className: styles.error
	};

	render () {
		const {className, errors, path} = this.props;
		const text = errors[path];

		return text ? <Field className={className} text={errors[path]} /> : null;
	}
}

export default withErrors(FieldError);
