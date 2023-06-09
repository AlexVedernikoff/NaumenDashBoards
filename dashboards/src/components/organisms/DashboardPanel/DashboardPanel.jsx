// @flow
import Button, {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button';
import cn from 'classnames';
import type {DivRef} from 'components/types';
import {EDIT_PANEL_POSITION} from 'store/dashboard/settings/constants';
import type {EditPanelPosition} from 'store/dashboard/settings/types';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import IconButton from 'components/atoms/IconButton';
import {MAX_WIDTH, MIN_WIDTH} from './constants';
import type {Props, State} from './types';
import React, {createRef, PureComponent, Suspense} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';

const WidgetAddPanel = React.lazy(() => import('containers/WidgetAddPanel'));
const WidgetCopyPanel = React.lazy(() => import('containers/WidgetCopyPanel'));
const WidgetFormPanel = React.lazy(() => import('containers/WidgetFormPanel'));

export class DashboardPanel extends PureComponent<Props, State> {
	contentRef: DivRef = createRef();

	state = {
		width: 320
	};

	componentDidMount () {
		const {width} = this.props;

		this.setState({width});
	}

	componentDidUpdate (prevProps: Props) {
		const {width} = this.props;

		if (width !== prevProps.width) {
			this.setState({width});
		}
	}

	componentWillUnmount () {
		document.removeEventListener('mousemove', this.resize);
		document.removeEventListener('mouseup', this.stopResize);
	}

	handleChangePosition = (position: EditPanelPosition) => () => {
		const {updatePanelPosition} = this.props;
		return updatePanelPosition(position);
	};

	handleGoBack = () => {
		const {goBack, showCopyPanel} = this.props;
		return goBack(!showCopyPanel, this.contentRef);
	};

	handleToggle = () => {
		const {swiped, updateSwiped} = this.props;
		return updateSwiped(!swiped);
	};

	resize = (e: MouseEvent) => {
		const {position} = this.props;
		const {current} = this.contentRef;

		if (current) {
			const currentRect = current.getBoundingClientRect();
			let width = position === EDIT_PANEL_POSITION.RIGHT
				? currentRect.right - e.clientX
				: e.clientX;

			if (width > MAX_WIDTH) {
				width = MAX_WIDTH;
			}

			if (width < MIN_WIDTH) {
				width = MIN_WIDTH;
			}

			this.setState({width});
		}
	};

	startResize = (e: MouseEvent) => {
		document.addEventListener('mousemove', this.resize);
		document.addEventListener('mouseup', this.stopResize);
	};

	stopResize = (e: MouseEvent) => {
		const {updateWidth} = this.props;
		const {width} = this.state;

		document.removeEventListener('mousemove', this.resize);
		document.removeEventListener('mouseup', this.stopResize);
		updateWidth(width);
	};

	renderContent = () => {
		let content = null;

		if (this.props.selectedWidgetId) {
			content = (<WidgetFormPanel key={this.props.selectedWidgetId} />);
		} else if (this.props.showCopyPanel) {
			content = (<WidgetCopyPanel />);
		} else {
			content = (<WidgetAddPanel />);
		}

		return (
			<div className={styles.contentPlace} ref={this.contentRef}>
				<Suspense fallback={this.renderFallback()}>{content}</Suspense>
			</div>
		);
	};

	renderDrawerControl = () => {
		const {position, swiped} = this.props;
		const {LEFT, RIGHT} = EDIT_PANEL_POSITION;
		const CN = cn({
			[styles.drawerControl]: true,
			[styles.activeDrawerControl]: swiped,
			[styles.drawerControlLeft]: position === LEFT,
			[styles.drawerControlRight]: position === RIGHT
		});
		const iconName = swiped ? ICON_NAMES.DRAWER_OPEN : ICON_NAMES.DRAWER_CLOSE;

		return (
			<div className={CN} onClick={this.handleToggle}>
				<Icon className={styles.drawerIcon} name={iconName} />
			</div>
		);
	};

	renderFallback = () => <div className={styles.fallback}><T text="DashboardPanel::LoadingContent" /></div>;

	renderHeader = () => {
		const {position} = this.props;
		const {LEFT, RIGHT} = EDIT_PANEL_POSITION;
		const rightClassName = position === RIGHT ? cn(styles.active, styles.positionButton) : null;
		const leftClassName = position === LEFT ? cn(styles.active, styles.positionButton) : null;
		return (
			<div className={styles.title}>
				<div>{this.renderHeaderTitle()}</div>
				<IconButton
					className={leftClassName}
					icon={ICON_NAMES.PANEL_TO_LEFT}
					onClick={this.handleChangePosition(LEFT)}
					round={false}
				/>
				<IconButton
					className={rightClassName}
					icon={ICON_NAMES.PANEL_TO_RIGHT}
					onClick={this.handleChangePosition(RIGHT)}
					round={false}
				/>
			</div>
		);
	};

	renderHeaderTitle = () => {
		const {showBackButton, showCopyPanel, title} = this.props;

		if (showBackButton || showCopyPanel) {
			return (
				<Button className={styles.backButton} onClick={this.handleGoBack} variant={BUTTON_VARIANTS.SIMPLE}>
					<Icon name={ICON_NAMES.BACK_ARROW} />
					<T text="DashboardPanel::Back" />
				</Button>
			);
		}

		return title;
	};

	renderResizer = () => {
		const {position} = this.props;
		const CN = cn({
			[styles.resizer]: true,
			[styles.leftPosition]: position === EDIT_PANEL_POSITION.LEFT,
			[styles.rightPosition]: position === EDIT_PANEL_POSITION.RIGHT
		});

		return <div className={CN} onMouseDown={this.startResize} />;
	};

	render () {
		const {position, swiped} = this.props;
		const {width} = this.state;
		const CN = cn({
			[styles.container]: true,
			[styles.swipedContainer]: swiped,
			[styles.leftPosition]: position === EDIT_PANEL_POSITION.LEFT,
			[styles.rightPosition]: position === EDIT_PANEL_POSITION.RIGHT
		});

		return (
			<div className={CN} style={{width}}>
				{this.renderResizer()}
				<div className={styles.content}>
					{this.renderHeader()}
					{this.renderContent()}
				</div>
				{this.renderDrawerControl()}
			</div>
		);
	}
}

export default DashboardPanel;
