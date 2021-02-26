// @flow
import FormBox from 'components/molecules/FormBox';
import type {OnChangeInputEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import Toggle from 'components/atoms/Toggle';

export class ToggableFormBox extends PureComponent<Props> {
	static defaultProps = {
		name: ''
	};

	handleToggle = (event: OnChangeInputEvent) => {
		const {onToggle} = this.props;

		onToggle && onToggle(event);
	};

	renderContent = () => {
		const {children, showContent} = this.props;

		return showContent ? children : null;
	};

	renderControl = () => {
		const {name, showContent} = this.props;

		return <Toggle checked={showContent} name={name} onChange={this.handleToggle} value={showContent} />;
	};

	render () {
		const {title} = this.props;

		return (
			<FormBox rightControl={this.renderControl()} title={title}>
				{this.renderContent()}
			</FormBox>
		);
	}
}

export default ToggableFormBox;
