// @flow
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import withTranslation from 'components/templates/TranslationProvider/withTranslation';

class Translation extends PureComponent<Props> {
	render () {
		const {children, t, ...props} = this.props;
		const filtredProps = {};

		Object.entries(props).forEach(([key, value]) => {
			if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
				filtredProps[key] = value;
			}
		});

		const message = t(children, filtredProps);
		return (
			<Fragment>
				{message}
			</Fragment>
		);
	}
}

export default withTranslation(Translation);
