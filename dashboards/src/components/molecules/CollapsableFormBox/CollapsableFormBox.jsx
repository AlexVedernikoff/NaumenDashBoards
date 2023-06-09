// @flow
import FormBox from 'components/molecules/FormBox';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class CollapsableFormBox extends PureComponent<Props, State> {
	static defaultProps = {
		showContent: false
	};

	state = {
		showContent: this.props.showContent
	};

	handleClick = () => this.setState({showContent: !this.state.showContent});

	renderContent = () => {
		const {children} = this.props;
		const {showContent} = this.state;

		return showContent ? children : null;
	};

	renderControl = () => {
		const {showContent} = this.state;
		const {ARROW_BOTTOM, ARROW_TOP} = ICON_NAMES;
		const iconName = showContent ? ARROW_TOP : ARROW_BOTTOM;

		return <Icon className={styles.icon} name={iconName} onClick={this.handleClick} />;
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

export default CollapsableFormBox;
