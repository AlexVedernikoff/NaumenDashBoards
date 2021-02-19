// @flow
import type {DivRef} from 'components/types';
import BaseFormField from 'components/molecules/FormField';
import type {Props} from './types';
import React, {Component, createRef} from 'react';
import withForm from 'DiagramWidgetEditForm/withForm';

export class FormField extends Component<Props> {
	ref: DivRef = createRef();

	render () {
		const {error, onAddFieldErrorRef, ...props} = this.props;

		if (error) {
			onAddFieldErrorRef(this.ref);
		}

		return <BaseFormField {...props} error={error} forwardedRef={this.ref} />;
	}
}

export default withForm(FormField);
