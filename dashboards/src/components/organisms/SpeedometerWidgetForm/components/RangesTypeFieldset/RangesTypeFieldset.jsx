// @flow
import FormField from 'components/molecules/FormField';
import Label from 'components/atoms/Label';
import type {Props} from './types';
import RadioField from 'components/atoms/RadioField';
import {RANGES_TYPES} from 'store/widgets/data/constants';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';

export class RangesTypeFieldset extends PureComponent<Props> {
	handleChangeType = ({value: type}) => {
		const {name, onChange} = this.props;
		return onChange(name, type);
	};

	render () {
		const {name, value: type} = this.props;
		const {ABSOLUTE, PERCENT} = RANGES_TYPES;

		return (
			<Fragment>
				<Label className={styles.label}><T text="BordersRangesTypeFieldset::RangeType" /></Label>
				<FormField>
					<RadioField
						checked={type === PERCENT}
						label={t('BordersRangesTypeFieldset::Percent')}
						name={name}
						onChange={this.handleChangeType}
						value={PERCENT}
					/>
				</FormField>
				<FormField>
					<RadioField
						checked={type === ABSOLUTE}
						label={t('BordersRangesTypeFieldset::Absolute')}
						name={name}
						onChange={this.handleChangeType}
						value={ABSOLUTE}
					/>
				</FormField>
			</Fragment>
		);
	}
}

export default RangesTypeFieldset;
