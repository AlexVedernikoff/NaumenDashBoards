// @flow
import type {Context} from './types';
import React, {createContext} from 'react';

export const SHOW_DYNAMIC_ATTRIBUTES_CONTEXT: React$Context<Context | null> = createContext(null);
SHOW_DYNAMIC_ATTRIBUTES_CONTEXT.displayName = 'SHOW_DYNAMIC_ATTRIBUTES_CONTEXT';

export const withShowDynamicAttributes = <Config: {}>(Component: React$ComponentType<Config & Context>): React$ComponentType<Config> =>
	class withShowDynamicAttributes extends React.Component<Config> {
		render () {
			return (
				<SHOW_DYNAMIC_ATTRIBUTES_CONTEXT.Consumer>
					{(values: Context | null) =>
						<Component
							{...this.props}
							dynamicAttributesMode={values?.dynamicAttributesMode ?? 'hide'}
						/>}
				</SHOW_DYNAMIC_ATTRIBUTES_CONTEXT.Consumer>
			);
		}
	};

export default withShowDynamicAttributes;
