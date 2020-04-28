// @flow
import {Checkbox, TextInput} from 'components/atoms';
import {FIELDS, MAX_TEXT_LENGTH} from 'components/organisms/WidgetFormPanel/constants';
import {FormCheckControl, FormControl, FormField, ToggableFormBox} from 'components/molecules';
import type {OnChangeInputEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {withStyleFormBuilder} from 'WidgetFormPanel/builders';

export class IndicatorBox extends PureComponent<Props> {
	handleChangeTickAmount = (event: OnChangeInputEvent) => {
		const {handleChange} = this.props;
		const {value} = event;

		if (value.toString().length < 3) {
			handleChange(event);
		}
	}

	render () {
		const {data, handleBoolChange, handleChange} = this.props;
		const {max, min, name, show, showName, tickAmount} = data;

		return (
			<ToggableFormBox title="Показатель">
				<FormField>
					<FormCheckControl label="Показать ось">
						<Checkbox checked={show} name={FIELDS.show} onChange={handleBoolChange} value={show} />
					</FormCheckControl>
				</FormField>
				<FormField>
					<FormCheckControl label="Выводить название">
						<Checkbox checked={showName} name={FIELDS.showName} onChange={handleBoolChange} value={showName} />
					</FormCheckControl>
				</FormField>
				<FormField small>
					<TextInput maxLength={MAX_TEXT_LENGTH} name={FIELDS.name} onChange={handleChange} value={name} />
				</FormField>
				<FormField row>
					<FormControl className={styles.textControl} label="Min деление">
						<TextInput
							name={FIELDS.min}
							onChange={handleChange}
							onlyNumber={true}
							placeholder="auto"
							value={min}
						/>
					</FormControl>
					<FormControl className={styles.textControl} label="Max деление">
						<TextInput
							name={FIELDS.max}
							onChange={handleChange}
							onlyNumber={true}
							placeholder="auto"
							value={max}
						/>
					</FormControl>
				</FormField>
				<FormField row={true}>
					<FormControl className={styles.textControl} label="Шаг делений">
						<TextInput
							name={FIELDS.tickAmount}
							onChange={this.handleChangeTickAmount}
							onlyNumber={true}
							placeholder="auto"
							value={tickAmount}
						/>
					</FormControl>
				</FormField>
			</ToggableFormBox>
		);
	}
}

export default withStyleFormBuilder(IndicatorBox);
