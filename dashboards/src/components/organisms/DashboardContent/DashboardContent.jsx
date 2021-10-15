// @flow
import cn from 'classnames';
import DashboardPanel from 'containers/DashboardPanel';
import type {Props, State} from 'containers/DashboardContent/types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import styles from './styles.less';
import WidgetsGrid from 'containers/WidgetsGrid/WidgetsGrid';

export class DashboardContent extends PureComponent<Props, State> {
	state = {
		intersecting: false
	};

	contentRef: Ref<'div'> = createRef();
	observer = null;

	componentDidMount () {
		const {current} = this.contentRef;

		if (current) {
			this.observer = new IntersectionObserver(this.handleIntersectionObserver);
			this.observer.observe(current);
		}
	}

	componentWillUnmount () {
		if (this.observer) {
			this.observer.disconnect();
		}
	}

	handleIntersectionObserver = entries => {
		const {intersecting} = this.state;

		if (entries.length > 0) {
			const {isIntersecting} = entries[0];

			if (intersecting !== isIntersecting) {
				this.setState({intersecting: isIntersecting});
			}
		}
	};

	renderPanel = () => {
		const {editMode} = this.props;
		const {intersecting} = this.state;

		if (editMode && intersecting) {
			return <DashboardPanel />;
		}

		return null;
	};

	renderWidgets = () => {
		const {intersecting} = this.state;

		if (intersecting) {
			return <WidgetsGrid />;
		}

		return null;
	};

	render () {
		const {isMobileDevice} = this.props;
		const className = cn(styles.content, {
			[styles.contentMobile]: isMobileDevice
		});

		return (
			<div className={className} ref={this.contentRef}>
				{this.renderWidgets()}
				{this.renderPanel()}
			</div>
		);
	}
}

export default DashboardContent;
