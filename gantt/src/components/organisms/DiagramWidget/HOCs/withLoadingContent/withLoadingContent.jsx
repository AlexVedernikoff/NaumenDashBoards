// @flow
import type {Components} from 'components/organisms/DiagramWidget/types';
import {DEFAULT_COMPONENTS} from 'components/organisms/DiagramWidget/constants';
import LoadingContent from 'containers/DiagramWidgetLoadingContent';
import memoize from 'memoize-one';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export const withLoadingContent = (Component: React$ComponentType<Props>): React$ComponentType<Props> => {
	return class DiagramWithLoading extends PureComponent<Props> {
		getComponents = memoize((components: Components = DEFAULT_COMPONENTS) => ({
			...components,
			Content: LoadingContent
		}));

		render () {
			const {components, ...props} = this.props;

			return <Component {...props} components={this.getComponents(components)} />;
		}
	};
};

export default withLoadingContent;
