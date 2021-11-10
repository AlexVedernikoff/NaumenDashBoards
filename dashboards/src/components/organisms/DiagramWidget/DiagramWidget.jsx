// @flow
import cn from 'classnames';
import {DEFAULT_COMPONENTS} from './constants';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import styles from './styles.less';
import Widget from 'containers/Widget';

export class DiagramWidget extends PureComponent<Props, State> {
	static defaultProps = {
		...Widget.defaultProps,
		components: DEFAULT_COMPONENTS
	};

	widgetRef: Ref<'div'>;

	// eslint-disable-next-line react/no-deprecated
	componentWillMount () {
		this.widgetRef = this.props.forwardedRef ?? createRef();
	}

	render () {
		const {children, className, components, widget} = this.props;
		const widgetCN = cn(className, styles.widget);

		return (
			<Widget
				className={widgetCN}
				forwardedRef={this.widgetRef}
				widget={widget}
			>
				<components.Content widget={widget}>{children}</components.Content>
			</Widget>
		);
	}
}

export default DiagramWidget;
