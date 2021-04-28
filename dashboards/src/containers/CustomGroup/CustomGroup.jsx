// @flow
import Component from 'GroupModal/components/CustomGroup';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class CustomGroup extends PureComponent<Props> {
	render () {
		const {forwardedRef, ...props} = this.props;

		return <Component {...props} ref={forwardedRef} />;
	}
}

export default connect(props, functions)(CustomGroup);
