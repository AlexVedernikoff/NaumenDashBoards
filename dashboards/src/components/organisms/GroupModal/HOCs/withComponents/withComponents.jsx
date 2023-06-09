// @flow
import type {Components} from 'GroupModal/types';
import type {InjectedProps} from './types';
import React, {createContext, PureComponent} from 'react';

export const COMPONENTS_CONTEXT = createContext<Components>({});

COMPONENTS_CONTEXT.displayName = 'COMPONENTS_CONTEXT';

export const withComponents = <Props: {} & InjectedProps>(Component: React$ComponentType<Props>): React$ComponentType<Props> => {
	return class WithComponents extends PureComponent<Props> {
		render (): React$Node {
			return (
				<COMPONENTS_CONTEXT.Consumer>
					{components => <Component {...this.props} components={components} />}
				</COMPONENTS_CONTEXT.Consumer>
			);
		}
	};
};

export default withComponents;
