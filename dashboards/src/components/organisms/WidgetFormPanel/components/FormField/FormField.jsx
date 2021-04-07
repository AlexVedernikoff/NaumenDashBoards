// @flow
import Component from 'components/molecules/FormField';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import withErrors from 'components/organisms/WidgetForm/HOCs/withErrors';

export class FormField extends PureComponent<Props> {
	fieldRef = createRef();

	componentDidUpdate () {
		const {errors, onSetErrorFocusRef, path} = this.props;

		if (errors[path]) {
			onSetErrorFocusRef(this.fieldRef);
		}
	}

	render () {
		const {errors, forwardedRef, path, ...props} = this.props;
		const ref = forwardedRef ?? this.fieldRef;

		return <Component {...props} error={errors[path]} forwardedRef={ref} />;
	}
}

export default withErrors(FormField);
