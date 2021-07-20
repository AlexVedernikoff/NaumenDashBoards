// @flow
import type {InjectedProps} from './types';
import type {Option} from 'GroupModal/types';
import React, {createContext, PureComponent} from 'react';

export const OR_CONDITION_OPTIONS_CONTEXT = createContext<Array<Option>>([]);

OR_CONDITION_OPTIONS_CONTEXT.displayName = 'OR_CONDITION_OPTIONS_CONTEXT';

export const withOrConditionOptions = <Props: {} & InjectedProps>(Component: React$ComponentType<Props>): React$ComponentType<Props> => {
	return class WithOrConditionOptions extends PureComponent<Props> {
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
