// @flow
import {FormBox} from './FormBox/FormBox';
import {IconButton} from 'naumen-common-components';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class CollapsableFormBox extends PureComponent<Props, State> {
	static defaultProps = {
		showContent: true
	};

	state = {
		showContent: this.props.showContent
	};

	handleClick = () => this.setState({showContent: !this.state.showContent});

	renderButtons = () => {
		const {handleAddNewBlock, handleDeleteBlock} = this.props;

		if (handleDeleteBlock) {
			return (
				<>
					<IconButton className={styles.icon} icon='BASKET' onClick={handleDeleteBlock} />
					<IconButton className={styles.icon} icon='PLUS' onClick={handleAddNewBlock} />
				</>
			);
		}

		return <IconButton className={styles.icon} icon='PLUS' onClick={handleAddNewBlock} />;
	};

	renderContent = () => {
		const {children} = this.props;
		const {showContent} = this.state;

		return showContent ? children : null;
	};

	renderControl = () => {
		const {showContent} = this.state;
		const iconName = showContent ? 'ARROW_TOP' : 'ARROW_BOTTOM';

		return <IconButton className={styles.icon} icon={iconName} onClick={this.handleClick} />;
	};

	render () {
		const {title} = this.props;

		return (
			<FormBox className={styles.border} leftControl={this.renderControl()} rightControl={this.renderButtons()} title={title}>
				{this.renderContent()}
			</FormBox>
		);
	}
}

export default CollapsableFormBox;
