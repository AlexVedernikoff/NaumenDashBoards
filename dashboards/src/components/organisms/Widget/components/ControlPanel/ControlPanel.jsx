// @flow
import cn from 'classnames';
import Container from 'components/atoms/Container';
import {DISPLAY_MODE} from 'store/widgets/data/constants';
import {DISPLAY_MODE_OPTIONS} from 'store/widgets/constants';
import DropDownButton from 'components/organisms/Widget/components/DropDownButton';
import DropdownMenu from 'components/atoms/DropdownMenu';
import {FOOTER_POSITIONS, SIZES} from 'components/molecules/Modal/constants';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import {Item as MenuItem} from 'rc-menu';
import Modal from 'components/molecules/Modal';
import type {OnSelectEvent} from 'components/types';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS as ICON_BUTTON_VARIANTS} from 'components/atoms/IconButton/constants';

export class ControlPanel extends PureComponent<Props, State> {
	static defaultProps = {
		components: {
			Container,
			DropdownMenu,
			FilterOnWidget: null
		}
	};

	state = {
		showRemoveModal: false,
		showSubmenu: false
	};

	getDisplayModeIcon = (): React$Node => {
		const {widget} = this.props;

		switch (widget.displayMode) {
			case DISPLAY_MODE.WEB:
				return ICON_NAMES.WEB;
			case DISPLAY_MODE.MOBILE:
				return ICON_NAMES.MOBILE;
			default:
				return ICON_NAMES.WEB_MK;
		}
	};

	handleChangeDisplayMode = ({value}: OnSelectEvent) => {
		const {onEditChunkData, widget} = this.props;

		onEditChunkData(widget, {displayMode: value});
	};

	handleClick = (e: SyntheticMouseEvent<HTMLDivElement>) => e.stopPropagation();

	handleClickRemoveButton = () => this.setState({showRemoveModal: true});

	handleCloseRemoveModal = () => this.setState({showRemoveModal: false});

	handleEdit = () => {
		const {onSelect, widget} = this.props;

		onSelect(widget.id);
	};

	handleSubmitRemoveModal = () => {
		const {onRemove, widget} = this.props;

		this.setState({showRemoveModal: false});
		onRemove(widget.id);
	};

	handleToggleSubMenu = () => this.setState({showSubmenu: !this.state.showSubmenu});

	renderChangeDisplayModeButton = () => {
		const {editable, personalDashboard, widget} = this.props;
		const value = DISPLAY_MODE_OPTIONS.find(item => item.value === widget.displayMode) || DISPLAY_MODE_OPTIONS[0];

		if (editable && !personalDashboard) {
			return (
				<DropDownButton
					buttonIcon={this.getDisplayModeIcon()}
					className={styles.markedIcon}
					menu={DISPLAY_MODE_OPTIONS}
					onSelect={this.handleChangeDisplayMode}
					tip={`Отображается ${value.label}`}
					value={value}
				/>
			);
		}

		return null;
	};

	renderDropdownMenu = () => {
		const {showSubmenu} = this.state;
		const {DropdownMenu} = this.props.components;

		if (showSubmenu) {
			return <DropdownMenu onToggle={this.handleToggleSubMenu}>{this.renderRemoveMenuItem()}</DropdownMenu>;
		}

		return null;
	};

	renderEditButton = () => {
		const {editable} = this.props;

		if (editable) {
			return <IconButton icon={ICON_NAMES.EDIT} onClick={this.handleEdit} round={false} tip="Редактировать" />;
		}

		return null;
	};

	renderFilterOnWidget = (): React$Node => {
		const {components} = this.props;
		const {FilterOnWidget} = components;

		if (FilterOnWidget) {
			return <FilterOnWidget />;
		}

		return null;
	};

	renderRemoveMenuItem = () => {
		const {editable} = this.props;

		if (editable) {
			return (
				<MenuItem onClick={this.handleClickRemoveButton}>
					Удалить виджет
					{this.renderRemoveModal()}
				</MenuItem>
			);
		}

		return null;
	};

	renderRemoveModal = () => {
		const {showRemoveModal} = this.state;

		if (showRemoveModal) {
			return (
				<Modal
					cancelText="Нет"
					footerPosition={FOOTER_POSITIONS.RIGHT}
					header="Подтверждение удаления"
					notice={true}
					onClose={this.handleCloseRemoveModal}
					onSubmit={this.handleSubmitRemoveModal}
					size={SIZES.SMALL}
					submitText="Да"
				>
					Вы действительно хотите удалить виджет?
				</Modal>
			);
		}
	};

	renderSubmenuButton = () => {
		const {showSubmenu} = this.state;

		return (
			<div className="header-submenu">
				<IconButton
					active={showSubmenu}
					icon={ICON_NAMES.KEBAB}
					onClick={this.handleToggleSubMenu}
					round={false}
					tip="Меню"
					variant={ICON_BUTTON_VARIANTS.GRAY}
				/>
				{this.renderDropdownMenu()}
			</div>
		);
	};

	render () {
		const {className, components} = this.props;
		const {showSubmenu} = this.state;
		const {Container} = components;
		const CN = cn({
			[styles.panel]: true,
			[styles.visible]: showSubmenu
		}, className);

		return (
			<Container className={CN} onClick={this.handleClick}>
				{this.renderChangeDisplayModeButton()}
				{this.renderEditButton()}
				{this.renderFilterOnWidget()}
				{this.renderSubmenuButton()}
			</Container>
		);
	}
}

export default ControlPanel;
