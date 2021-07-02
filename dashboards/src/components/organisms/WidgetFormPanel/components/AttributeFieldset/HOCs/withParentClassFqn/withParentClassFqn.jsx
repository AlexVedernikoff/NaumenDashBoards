// @flow
import React, {createContext} from 'react';

export const PARENT_CLASS_FQN_CONTEXT: React$Context<string | null> = createContext(null);
PARENT_CLASS_FQN_CONTEXT.displayName = 'PARENT_CLASS_FQN_CONTEXT';

export const withParentClassFqn = (Component: React$ComponentType<Object>) => {
	return class WithParentClassFqn extends React.Component<Object> {
		render () {
			return (
				<PARENT_CLASS_FQN_CONTEXT.Consumer>
					{(classFqn: string | null) => <Component {...this.props} parentClassFqn={classFqn} />}
				</PARENT_CLASS_FQN_CONTEXT.Consumer>
			);
		}
	};
};

export default withParentClassFqn;
