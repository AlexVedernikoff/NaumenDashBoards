// @flow
import Checkbox from 'components/atoms/Checkbox';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormControl from 'components/molecules/FormControl';
import FormField from 'components/molecules/FormField';
import type {OnChangeEvent} from 'components/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import t from 'localization';

class ShowTotalAmountBox extends PureComponent<Props> {
	static defaultProps = {
		subTotalAmountView: false
	};

	handleChange = ({name, value}: OnChangeEvent<boolean>) => {
		const {onChange} = this.props;
		return onChange(name, !value);
	};

	renderShowSubTotalAmount = () => {
		const {showSubTotalAmount, subTotalAmountView} = this.props;

		if (subTotalAmountView) {
			return (
				<FormField>
					<FormControl label={t('ShowTotalAmountBox::ShowSubTotalAmount')}>
						<Checkbox
							checked={showSubTotalAmount}
							name={DIAGRAM_FIELDS.showSubTotalAmount}
							onChange={this.handleChange}
							value={showSubTotalAmount}
						/>
					</FormControl>
				</FormField>
			);
		}

		return null;
	};

	renderShowTotalAmount = () => {
		const {showTotalAmount} = this.props;
		return (
			<FormField>
				<FormControl label={t('ShowTotalAmountBox::ShowTotalAmount')}>
					<Checkbox
						checked={showTotalAmount}
						name={DIAGRAM_FIELDS.showTotalAmount}
						onChange={this.handleChange}
						value={showTotalAmount}
					/>
				</FormControl>
			</FormField>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderShowTotalAmount()}
				{this.renderShowSubTotalAmount()}
			</Fragment>
		);
	}
}

export default ShowTotalAmountBox;
