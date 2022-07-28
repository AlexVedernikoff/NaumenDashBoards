// @flow
import type {InjectedProps, SetBlurRoot} from './types';
import React, {createContext, PureComponent} from 'react';

export const SET_BLUR_ROOT_CONTEXT = createContext<SetBlurRoot>(() => {});

SET_BLUR_ROOT_CONTEXT.displayName = 'SET_BLUR_ROOT_CONTEXT';

export const withBlurRoot = <Props: {} & InjectedProps>(Component: React$ComponentType<Props>): React$ComponentType<Props> =>
	class WithBlurRoot extends PureComponent<Props> {
		renderComponent = (setBlurRoot: SetBlurRoot) => (
			<Component{...this.props} setBlurRoot={setBlurRoot} />
		);

		render () {
			return (
				<SET_BLUR_ROOT_CONTEXT.Consumer>
					{setBlurRoot => this.renderComponent(setBlurRoot)}
				</SET_BLUR_ROOT_CONTEXT.Consumer>
			);
		}
	};

export default withBlurRoot;
