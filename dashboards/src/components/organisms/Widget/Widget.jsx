// @flow
import cn from 'classnames';
import ControlPanel from 'containers/WidgetControlPanel';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Widget extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		components: {
			ControlPanel
		}
	};

	state = {
		hasError: false
	};

	static getDerivedStateFromError (error: Object) {
		window.top.console.log(error);

		return {
			hasError: true
		};
	}

	componentDidUpdate (prevProps: Props) {
		const {widget} = this.props;

		if (prevProps.widget !== widget) {
			this.setState({hasError: false});
		}
	}

	handleClearWarningMessage = () => {
		const {clearWarningMessage, widget} = this.props;

		clearWarningMessage(widget.id);
	};

	renderChildren = () => {
		const {children} = this.props;
		const {hasError} = this.state;

		return !hasError && children;
	};

	renderControlPanel = () => {
		const {components, widget} = this.props;
		const {ControlPanel} = components;

		return <ControlPanel className={styles.controlPanel} widget={widget} />;
	};

	renderError = () => {
		const {hasError} = this.state;
		const message = 'Ошибка построения.';

		return hasError && <div className={styles.error} title={message}>{message}</div>;
	};

	renderWidgetWarning = () => {
		const {warningMessage} = this.props.widget;

		if (warningMessage) {
			return (
				<div className={styles.widgetWarning} onMouseLeave={this.handleClearWarningMessage}>
					<div className={styles.widgetWaringContent}>{warningMessage}</div>
				</div>
			);
		}
	};

	render () {
		const {className, forwardedRef} = this.props;

		return (
			<div className={cn(styles.widget, className)} ref={forwardedRef}>
				{this.renderWidgetWarning()}
				{this.renderControlPanel()}
				{this.renderError()}
				{this.renderChildren()}
			</div>
		);
	}
}

export default Widget;
