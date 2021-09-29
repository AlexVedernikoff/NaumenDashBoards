// @flow
import React from 'react';
import {TRANSLATION_CONTEXT} from './constants';

export const withTranslation = (Component: React$ComponentType<Object>) => {
	return class WithTranslation extends React.Component<Object> {
		render () {
			return (
				<TRANSLATION_CONTEXT.Consumer>
					{({locale, translate}) => <Component {...this.props} locale={locale} t={translate} />}
				</TRANSLATION_CONTEXT.Consumer>
			);
		}
	};
};

export default withTranslation;
