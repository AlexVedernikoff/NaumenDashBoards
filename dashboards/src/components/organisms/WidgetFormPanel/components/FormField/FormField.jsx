// @flow
import type {DivRef} from 'components/types';
import {FormField as BaseFormField} from 'components/molecules';
import type {Props} from './types';
import React, {Component, createRef} from 'react';
import withForm from 'WidgetFormPanel/withForm';

export class FormField extends Component<Props> {
	ref: DivRef = createRef();

	render () {
		const {addFieldErrorRef, error, ...props} = this.props;

		if (error) {
			addFieldErrorRef(this.ref);
		}

		return <BaseFormField {...props} error={error} forwardedRef={this.ref} />;
	}
}

export default withForm(FormField);
