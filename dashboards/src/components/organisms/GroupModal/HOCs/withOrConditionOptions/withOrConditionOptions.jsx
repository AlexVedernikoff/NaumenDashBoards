// @flow
import type {Option} from 'GroupModal/types';
import type {InjectedProps} from './types';
import React, {createContext, PureComponent} from 'react';

export const OR_CONDITION_OPTIONS_CONTEXT = createContext<Array<Option>>([]);

export const withOrConditionOptions = <Props: {} & InjectedProps>(Component: React$ComponentType<Props>): React$ComponentType<Props> => {
	return class WrappedComponent extends PureComponent<Props> {
		render (): React$Node {
			return (
				<OR_CONDITION_OPTIONS_CONTEXT.Consumer>
					{options => <Component {...this.props} options={options} />}
				</OR_CONDITION_OPTIONS_CONTEXT.Consumer>
			);
		}
	};
};

export default withOrConditionOptions;
