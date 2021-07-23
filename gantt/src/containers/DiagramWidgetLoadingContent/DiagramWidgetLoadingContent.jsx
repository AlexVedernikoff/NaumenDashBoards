// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import LoadingContent from 'components/organisms/DiagramWidget/components/LoadingContent';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class LoadingContentContainer extends PureComponent<Props> {
	componentDidMount () {
		const {buildData, fetchBuildData, widget} = this.props;
		const {data, error, loading} = buildData;

		if (!error || !loading || !data) {
			fetchBuildData(widget);
		}
	}

	render () {
		return <LoadingContent {...this.props} />;
	}
}

export default connect(props, functions)(LoadingContentContainer);
