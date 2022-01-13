// @flow
import {ALIGN_OPTIONS} from './constants';
import CheckIconButtonGroup from 'components/molecules/CheckIconButtonGroup';
import type {Props} from 'components/molecules/CheckIconButtonGroup/types';
import React, {PureComponent} from 'react';
import {translateObjectsArray} from 'localization';

export class TextAlignControl extends PureComponent<Props> {
	static defaultProps = {
		...CheckIconButtonGroup.defaultProps,
		options: ALIGN_OPTIONS
	};

	render () {
		const {name, onChange, options, value} = this.props;
		const tOptions = translateObjectsArray('title', options);

		return <CheckIconButtonGroup name={name} onChange={onChange} options={tOptions} value={value} />;
	}
}

export default TextAlignControl;
