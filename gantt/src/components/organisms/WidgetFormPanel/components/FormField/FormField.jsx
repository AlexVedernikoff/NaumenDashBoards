// @flow
import Component from 'components/molecules/FormField';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import withErrors from 'components/organisms/WidgetForm/HOCs/withErrors';

export class FormField extends PureComponent<Props> {
	fieldRef = createRef();

	componentDidUpdate () {
		const {errors, onSetErrorFocusRef, path, paths} = this.props;

		if (
			(path && errors[path])
			|| (paths && paths.some(path => errors[path]))
		) {
			onSetErrorFocusRef(this.fieldRef);
		}
	}

	render () {
		const {errors, forwardedRef, path, paths, ...props} = this.props;
		const ref = forwardedRef ?? this.fieldRef;
		let error = '';

		if (path) {
			error = errors[path];
		}

		if (paths) {
			error = paths.filter(path => errors[path]).map(path => errors[path]).join('; ');
		}

		return <Component {...props} error={error} forwardedRef={ref} />;
	}
}

export default withErrors(FormField);
