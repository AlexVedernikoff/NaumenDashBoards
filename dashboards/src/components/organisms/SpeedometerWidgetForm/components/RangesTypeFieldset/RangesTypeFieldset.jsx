// @flow
import FormField from 'components/molecules/FormField';
import Label from 'components/atoms/Label';
import type {Props} from './types';
import RadioField from 'components/atoms/RadioField';
import {RANGES_TYPES} from 'store/widgets/data/constants';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';

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
				<Label className={styles.label}>Тип шкалы</Label>
				<FormField>
					<RadioField
						checked={type === PERCENT}
						label="Проценты"
						name={name}
						onChange={this.handleChangeType}
						value={PERCENT}
					/>
				</FormField>
				<FormField>
					<RadioField
						checked={type === ABSOLUTE}
						label="Абсолютное значение"
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
