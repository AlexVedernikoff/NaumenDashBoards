// @flow
import type {DivRef} from 'components/types';
import type {InjectedProps, InnerProps, SetBlurRoot} from './types';
import React, {createContext, forwardRef, PureComponent} from 'react';

export const SET_BLUR_ROOT_CONTEXT = createContext<SetBlurRoot>(() => {});

SET_BLUR_ROOT_CONTEXT.displayName = 'SET_BLUR_ROOT_CONTEXT';

export const withBlurRoot = <Props: InnerProps>(Component: React$ComponentType<Props & InjectedProps>): React$ComponentType<Props> => {
	class WithBlurRoot extends PureComponent<Props & InnerProps> {
		renderComponent = (setBlurRoot: SetBlurRoot) => {
			const {forwardedRef, ...rest} = this.props;
			return <Component {...rest} ref={forwardedRef} setBlurRoot={setBlurRoot} />;
		};

		render () {
			return (
				<SET_BLUR_ROOT_CONTEXT.Consumer>
					{setBlurRoot => this.renderComponent(setBlurRoot)}
				</SET_BLUR_ROOT_CONTEXT.Consumer>
			);
		}
	}

	// $FlowFixMe
	const component = forwardRef<Props, DivRef>((props, ref) => <WithBlurRoot {...props} forwardedRef={ref} />);

	component.displayName = 'withBlurRoot';

	return component;
};

export default withBlurRoot;
