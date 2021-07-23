// @flow
import Component from 'components/atoms/FieldError';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import withErrors from 'components/organisms/WidgetForm/HOCs/withErrors';

export class FieldError extends PureComponent<Props> {
	errorRef = createRef();

	componentDidUpdate () {
		const {errors, onSetErrorFocusRef, path} = this.props;

		if (errors[path]) {
			onSetErrorFocusRef(this.errorRef);
		}
	}

	render () {
		const {errors, onSetErrorFocusRef, path, ...props} = this.props;

		return <Component {...props} forwardedRef={this.errorRef} text={errors[path]} />;
	}
}

export default withErrors(FieldError);
