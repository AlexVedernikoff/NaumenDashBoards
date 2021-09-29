// @flow
import api from 'api';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import translate, {localization} from 'localization';
import {TRANSLATION_CONTEXT} from './constants';

class TranslationProvider extends PureComponent<Props, State> {
	state = {
		locale: null,
		translate: null
	};

	async componentDidMount () {
		const locale = api.instance.frame.getCurrentLocale();

		localization.addEventChange(this.changeLocale);
		localization.changeLocale(locale);
	}

	changeLocale = (locale) => this.setState({
		locale,
		translate: (key, params) => translate(key, params)
	});

	renderContent = () => {
		const {children} = this.props;
		const {locale, translate} = this.state;

		if (translate) {
			return (
				<TRANSLATION_CONTEXT.Provider value={{locale, translate}}>
					{children}
				</TRANSLATION_CONTEXT.Provider>
			);
		}

		return null;
	};

	renderNotLoading = () => {
		const {translate} = this.state;

		if (!translate) {
			return (<div />);
		}

		return null;
	};

	render () {
		return (
			<Fragment>
				{this.renderContent()}
				{this.renderNotLoading()}
			</Fragment>
		);
	}
}

export default TranslationProvider;
