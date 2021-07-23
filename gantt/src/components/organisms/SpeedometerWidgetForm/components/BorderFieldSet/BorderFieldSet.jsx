// @flow
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FieldError from 'WidgetFormPanel/components/FieldError';
import FormField from 'components/molecules/FormField';
import {getErrorPath} from 'WidgetFormPanel/helpers';
import HorizontalLabel from 'components/atoms/HorizontalLabel';
import Label from 'components/atoms/Label';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import TextInput from 'components/atoms/TextInput';

export class BorderFieldSet extends PureComponent<Props> {
	handleChangeBorder = ({name: key, value: inputValue}: Object) => {
		const {name, onChange, value: settings} = this.props;
		const value = inputValue.replace(',', '.');

		if (!value || /^-?(\d+)?(\.)?(\d{1,4})?$/.test(value)) {
			onChange(name, {...settings, [key]: value});
		}
	};

	renderScaleBorderField = (name: string, value: string) => (
		<Fragment>
			<FormField row small>
				<HorizontalLabel>{name}</HorizontalLabel>
				<TextInput name={name} onChange={this.handleChangeBorder} value={value} />
			</FormField>
			<FieldError className={styles.scaleBorderField} path={getErrorPath(DIAGRAM_FIELDS.borders, name)} />
		</Fragment>
	);

	renderScaleBorderLabel = () => <Label className={styles.scaleBorderField}>Границы шкал</Label>;

	render () {
		const {max, min} = this.props.value;

		return (
			<Fragment>
				{this.renderScaleBorderLabel()}
				{this.renderScaleBorderField('min', min)}
				{this.renderScaleBorderField('max', max)}
			</Fragment>
		);
	}
}

export default BorderFieldSet;
