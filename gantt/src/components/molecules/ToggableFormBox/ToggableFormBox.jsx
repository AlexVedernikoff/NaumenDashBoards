// @flow
import FormBox from 'components/molecules/FormBox';
import type {OnChangeEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import Toggle from 'components/atoms/Toggle';

export class ToggableFormBox extends PureComponent<Props> {
	static defaultProps = {
		disabled: false,
		message: null,
		name: ''
	};

	handleToggle = (event: OnChangeEvent<boolean>) => {
		const {onToggle} = this.props;

		onToggle && onToggle(event);
	};

	renderContent = () => {
		const {children, showContent} = this.props;

		return showContent ? children : null;
	};

	renderControl = () => {
		const {disabled, name, showContent} = this.props;

		return <Toggle checked={showContent} disabled={disabled} name={name} onChange={this.handleToggle} value={showContent} />;
	};

	renderMessage = () => this.props.message;

	render () {
		const {title} = this.props;

		return (
			<FormBox rightControl={this.renderControl()} title={title}>
				{this.renderMessage()}
				{this.renderContent()}
			</FormBox>
		);
	}
}

export default ToggableFormBox;
