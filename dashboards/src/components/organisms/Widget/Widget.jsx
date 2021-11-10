// @flow
import cn from 'classnames';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import WidgetKebab from 'containers/WidgetKebab';

export class Widget extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		components: {
			WidgetKebab
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

	handleClick = () => {
		const {editMode, isMobileDevice, setSelectedWidget, widget} = this.props;

		if (!editMode && !isMobileDevice) {
			setSelectedWidget(widget.id);
		}
	};

	renderChildren = () => {
		const {children} = this.props;
		const {hasError} = this.state;

		return !hasError && children;
	};

	renderError = () => {
		const {hasError} = this.state;
		const message = 'Ошибка построения.';

		return hasError && <div className={styles.error} title={message}>{message}</div>;
	};

	renderWidgetKebab = () => {
		const {components, forwardedRef, isMobileDevice, widget} = this.props;
		const {WidgetKebab} = components;

		return isMobileDevice ? null : <WidgetKebab className={styles.controlPanel} widget={widget} widgetRef={forwardedRef} />;
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
			<div className={cn(styles.widget, className)} onClick={this.handleClick} ref={forwardedRef}>
				{this.renderWidgetWarning()}
				{this.renderWidgetKebab()}
				{this.renderError()}
				{this.renderChildren()}
			</div>
		);
	}
}

export default Widget;
