// @flow
import {FormBox} from 'components/molecules';
import type {OnChangeInputEvent} from 'components/types';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import {Toggle} from 'components/atoms';

export class ToggableFormBox extends PureComponent<Props, State> {
	static defaultProps = {
		name: '',
		showContent: false
	};

	state = {
		showContent: this.props.showContent
	};

	handleToggle = (event: OnChangeInputEvent) => {
		const {onToggle} = this.props;

		this.setState({showContent: !this.state.showContent});
		onToggle && onToggle(event);
	};

	renderContent = () => {
		const {children} = this.props;
		const {showContent} = this.state;

		return showContent ? children : null;
	};

	renderControl = () => {
		const {name} = this.props;
		const {showContent} = this.state;

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
