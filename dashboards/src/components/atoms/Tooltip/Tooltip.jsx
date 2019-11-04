// @flow
import 'react-popper-tooltip/dist/styles.css';
import type {Props, TooltipElementProps} from './types';
import React, {Component} from 'react';
import TooltipTrigger from 'react-popper-tooltip';

class Tooltip extends Component<Props> {
	static defaultProps = {
		hideArrow: false,
		placement: 'bottom'
	};

	renderChildren = (props: TooltipElementProps) => {
		const {children} = this.props;
		const {getTriggerProps, triggerRef} = props;
		const triggerProps = getTriggerProps({
			className: 'trigger',
			ref: triggerRef
		});

		return (
			<span {...triggerProps}>
				{children}
			</span>
		);
	};

	renderTooltip = (props: TooltipElementProps) => {
		const {hideArrow, tooltip} = this.props;
		const {arrowRef, getArrowProps, getTooltipProps, placement, tooltipRef} = props;
		const tooltipProps = getTooltipProps({
			className: 'tooltip-container',
			ref: tooltipRef
		});
		const arrowProps = getArrowProps({
			className: 'tooltip-arrow',
			'data-placement': placement,
			ref: arrowRef
		});

		return (
			<div {...tooltipProps}>
				{!hideArrow && <div {...arrowProps} />}
				{tooltip}
			</div>
		);
	};

	render () {
		const {children, hideArrow, tooltip, ...props} = this.props;

		return (
			<TooltipTrigger {...props} tooltip={this.renderTooltip}>
				{this.renderChildren}
			</TooltipTrigger>
		);
	}
}

export default Tooltip;
