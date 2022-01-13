// @flow
import type {ContextProps} from 'components/templates/TranslationProvider/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {TRANSLATION_CONTEXT} from 'components/templates/TranslationProvider/constants';

class Translation extends PureComponent<Props> {
	renderTranslate = ({translate}: ContextProps) => {
		const {text, ...props} = this.props;

		if (translate) {
			const filteredProps = {};

			Object.entries(props).forEach(([key, value]) => {
				if (key !== 'locale' && (typeof value === 'string' || typeof value === 'number' || value instanceof Date)) {
					filteredProps[key] = value;
				}
			});

			const message = translate(text, filteredProps);
			return message;
		}

		return text;
	};

	render () {
		return (
			<TRANSLATION_CONTEXT.Consumer>
				{this.renderTranslate}
			</TRANSLATION_CONTEXT.Consumer>
		);
	}
}

export default Translation;
