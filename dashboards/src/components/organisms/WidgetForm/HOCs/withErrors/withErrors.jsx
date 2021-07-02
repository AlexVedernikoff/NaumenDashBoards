// @flow
import {ERRORS_CONTEXT} from './constants';
import type {ErrorsContext, InjectedProps} from './types';
import React from 'react';

export const withErrors = <Props: {} & InjectedProps>(Component: React$ComponentType<Props>): React$ComponentType<Props> => {
	return class WithErrors extends React.Component<Props> {
		renderComponent = ({errors, setErrorFocusRef}: ErrorsContext) => (
			<Component{...this.props} errors={errors} onSetErrorFocusRef={setErrorFocusRef} />
		);

		render () {
			return (
				<ERRORS_CONTEXT.Consumer>
					{errors => this.renderComponent(errors)}
				</ERRORS_CONTEXT.Consumer>
			);
		}
	};
};

export default withErrors;
