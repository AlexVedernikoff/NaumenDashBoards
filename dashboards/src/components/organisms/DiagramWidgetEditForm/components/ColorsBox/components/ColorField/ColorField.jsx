// @flow
import cn from 'classnames';
import ColorInput from 'components/molecules/ColorInput';
import type {Components, Props, State} from './types';
import FormField from 'components/molecules/FormField';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import Label from 'components/atoms/Label';
import type {OnChangeEvent} from 'components/types';
import type {Props as ValueProps} from 'components/molecules/ColorInput/components/Value/types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class ColorField extends PureComponent<Props, State> {
	static defaultProps = {
		name: '',
		removable: false
	};

	components = this.getExtendedComponents(this.props.components);
	state = {
		showPicker: false
	};

	getExtendedComponents (components: $Shape<Components> = {}): Components {
		return {
			Label,
			...components
		};
	}

	handleChange = ({value}: OnChangeEvent<string>) => {
		const {name, onChange} = this.props;

		onChange({name, value});
	};

	handleClickColorInput = () => this.setState({showPicker: true});

	handleClickRemoveButton = () => {
		const {name, onRemove} = this.props;

		onRemove && onRemove(name);
	};

	hidePicker = () => this.setState({showPicker: false});

	renderColorInput = () => {
		const {value} = this.props;
		const components = {
			Value: this.renderColorValue
		};

		return <ColorInput components={components} onChange={this.handleChange} value={value} />;
	};

	renderColorValue = (props: ValueProps) => {
		const {forwardedRef, onClick, value: backgroundColor} = props;

		return <div className={styles.colorValue} onClick={onClick} ref={forwardedRef} style={{backgroundColor}} />;
	};

	renderLabel = () => {
		const {label, name} = this.props;
		const {Label} = this.components;

		return <Label className={styles.label} name={name}>{label}</Label>;
	};

	renderRemoveButton = () => {
		const {removable} = this.props;
		const CN = cn({
			[styles.removeButton]: true,
			[styles.hiddenRemoveButton]: !removable
		});

		return <IconButton className={CN} icon={ICON_NAMES.BASKET} onClick={this.handleClickRemoveButton} round={false} />;
	};

	render () {
		return (
			<FormField className={styles.field}>
				{this.renderRemoveButton()}
				{this.renderColorInput()}
				{this.renderLabel()}
			</FormField>
		);
	}
}

export default ColorField;
