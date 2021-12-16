// @flow
import React from 'react';
import {TRANSLATION_CONTEXT} from './constants';
import type {WithUtilsProps} from './types';

export const withTranslation = <Config: {}> (Component: React$ComponentType<Config & WithUtilsProps>): React$ComponentType<Config> =>
	class WithTranslation extends React.Component<Config> {
		render () {
			return (
				<TRANSLATION_CONTEXT.Consumer>
					{({locale, translate}) => <Component {...this.props} locale={locale} t={translate} />}
				</TRANSLATION_CONTEXT.Consumer>
			);
		}
	};

export default withTranslation;
