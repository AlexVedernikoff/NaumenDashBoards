// @flow
import type {CommonDialogContextProps} from './types';
import React, {createContext} from 'react';

export const CommonDialogContext: React$Context<Object> = createContext(null);
CommonDialogContext.displayName = 'COMMON_DIALOG_CONTEXT';

export const withCommonDialog = <Config: {}>(
	Component: React$ComponentType<Config & CommonDialogContextProps>
): React$ComponentType<Config> =>
		class WithCommonDialog extends React.Component<Config> {
			render () {
				return (
					<CommonDialogContext.Consumer>
						{(props: CommonDialogContextProps) => <Component {...this.props} {...props} />}
					</CommonDialogContext.Consumer>
				);
			}
		};

export default withCommonDialog;
