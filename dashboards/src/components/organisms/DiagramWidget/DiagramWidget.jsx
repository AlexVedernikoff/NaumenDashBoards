// @flow
import cn from 'classnames';
import {createSnapshot, getSnapshotName} from 'utils/export';
import {DEFAULT_COMPONENTS, EXPORT_LIST} from './constants';
import memoize from 'memoize-one';
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

	getComponents = memoize(() => ({
		ControlPanel: this.renderControlPanel
	}));

	handleExport = async (type: string) => {
		const {widget} = this.props;

		if (this.widgetRef) {
			const {current} = this.widgetRef;

			if (current) {
				const name = await getSnapshotName(widget.name);

				if (current) {
					createSnapshot({
						container: current,
						fragment: true,
						name,
						toDownload: true,
						type
					});
				}
			}
		}
	};

	renderControlPanel = (props: Object) => {
		const {ControlPanel} = this.props.components;

		return <ControlPanel {...props} exportOptions={EXPORT_LIST} onExport={this.handleExport} />;
	};

	render () {
		const {children, className, components, widget} = this.props;
		const widgetCN = cn(className, styles.widget);

		return (
			<Widget
				className={widgetCN}
				components={this.getComponents()}
				forwardedRef={this.widgetRef}
				widget={widget}
			>
				<components.Content widget={widget}>{children}</components.Content>
			</Widget>
		);
	}
}

export default DiagramWidget;
