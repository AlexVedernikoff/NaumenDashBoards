// @flow
import React, {createContext} from 'react';

export const ParentSource: React$Context<string | null> = createContext(null);

export const withParentSource = (Component: React$ComponentType<Object>) => {
	return class WrappedComponent extends React.Component<Object> {
		render () {
			return (
				<ParentSource.Consumer>
					{(classFqn: string | null) => <Component {...this.props} parentSource={classFqn} />}
				</ParentSource.Consumer>
			);
		}
	};
};

export default withParentSource;
