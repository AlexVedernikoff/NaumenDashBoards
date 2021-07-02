// @flow
import type {ErrorsMap} from 'GroupModal/types';
import type {InjectedProps} from './types';
import React, {createContext, PureComponent} from 'react';

export const ERRORS_CONTEXT = createContext<ErrorsMap>({});

export const withErrors = <Props: {} & InjectedProps>(Component: React$ComponentType<Props>): React$ComponentType<Props> => {
	return class WithErrors extends PureComponent<Props> {
		render (): React$Node {
			return (
				<ERRORS_CONTEXT.Consumer>
					{(errors: ErrorsMap) => <Component {...this.props} errors={errors} />}
				</ERRORS_CONTEXT.Consumer>
			);
		}
	};
};

export default withErrors;
