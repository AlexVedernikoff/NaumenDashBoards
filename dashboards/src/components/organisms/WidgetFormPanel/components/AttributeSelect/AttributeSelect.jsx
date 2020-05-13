// @flow
import type {OnChangeLabelEvent, OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {TransparentSelect} from 'components/molecules';

export class AttributeSelect extends PureComponent<Props> {
	handleChangeLabel = (event: OnChangeLabelEvent) => {
		const {onChangeLabel, parent} = this.props;
		onChangeLabel({...event, parent});
	}

	handleSelect = (event: OnSelectEvent) => {
		const {onSelect, parent} = this.props;
		onSelect({...event, parent});
	}

	render () {
		const {parent, ...props} = this.props;

		return (
			<TransparentSelect {...props} onChangeLabel={this.handleChangeLabel} onSelect={this.handleSelect} />
		);
	}
}

export default AttributeSelect;
