// @flow
import {connect} from 'react-redux';
import CustomGroup from 'GroupModal/components/CustomGroup';
import {functions, props} from './selectors';
import memoize from 'memoize-one';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class CustomGroupContainer extends PureComponent<Props> {
	componentDidMount () {
		const {group, loading, onFetch, value} = this.props;

		if (value && !group && !loading) {
			onFetch(value);
		}
	}

	getOptions = memoize((options, id) => id ? options.filter(option => option.id !== id) : options);

	render () {
		const {forwardedRef, group, options, ...props} = this.props;

		return <CustomGroup {...props} options={this.getOptions(options, group?.id)} ref={forwardedRef} value={group} />;
	}
}

export default connect(props, functions)(CustomGroupContainer);
