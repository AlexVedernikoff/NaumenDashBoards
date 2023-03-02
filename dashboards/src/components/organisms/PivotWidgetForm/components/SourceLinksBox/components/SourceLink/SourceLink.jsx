// @flow
import AbsolutePortal from 'components/molecules/AbsolutePortal';
import cn from 'classnames';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import type {DivRef} from 'components/types';
import {EDIT_PANEL_POSITION} from 'store/dashboard/settings/constants';
import FormField from 'WidgetFormPanel/components/FormField';
import {getErrorPath} from 'WidgetFormPanel/helpers';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import IconButton from 'components/atoms/IconButton';
import type {PivotLink} from 'store/widgets/data/types';
import type {Props, State} from './types';
import React, {Component, createRef} from 'react';
import styles from './styles.less';
import t from 'localization';
import {VARIANTS as BUTTON_VARIANTS} from 'src/components/atoms/Button/constants';

export class SourceLink extends Component<Props, State> {
	state = {
		hasEdit: false
	};

	ref: DivRef = createRef();

	handleEditLink = () => this.setState({hasEdit: true});

	handleRemoveLink = () => {
		const {onDelete} = this.props;

		if (onDelete) {
			onDelete();
		}
	};

	handleSourceLinkChange = (value: PivotLink) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(value);
			this.hidePicker();
		}
	};

	hidePicker = () => this.setState({hasEdit: false});

	renderActions = () => (
		<div className={styles.actions}>
			<IconButton
				className={styles.actionButton}
				icon={ICON_NAMES.EDIT}
				onClick={this.handleEditLink}
				round={false}
				variant={BUTTON_VARIANTS.GRAY}
			/>
			<IconButton
				className={styles.actionButton}
				icon={ICON_NAMES.BASKET}
				onClick={this.handleRemoveLink}
				round={false}
				variant={BUTTON_VARIANTS.GRAY}
			/>
		</div>
	);

	renderConnection =() => {
		const {link} = this.props;
		const attributeName = link.attribute?.ref?.title ?? link.attribute?.title ?? t('PivotWidgetForm::SourceLinkAttributeEmpty');

		return (
			<div className={styles.connection}>
				<Icon className={styles.connectIcon} height={14} name={ICON_NAMES.CONNECTION} width={14} />
				<div className={styles.attribute}>{attributeName}</div>
			</div>
		);
	};

	renderEditLink = () => {
		const {components, data, link, position} = this.props;
		const {SourceLinkEditor} = components;
		const {hasEdit} = this.state;
		const className = cn({
			[styles.picker]: true,
			[styles.right]: position === EDIT_PANEL_POSITION.RIGHT,
			[styles.left]: position === EDIT_PANEL_POSITION.LEFT
		});

		if (hasEdit) {
			return (
				<AbsolutePortal elementRef={this.ref} onClickOutside={this.hidePicker}>
					<SourceLinkEditor
						className={className}
						data={data}
						onCancel={this.hidePicker}
						onChange={this.handleSourceLinkChange}
						value={link}
					/>
				</AbsolutePortal>
			);
		}

		return null;
	};

	renderSources = () => {
		const {data, link} = this.props;
		const firstDataSet = data.find(item => item.dataKey === link.dataKey1);
		const firstDataSetLabel = firstDataSet?.source.value?.label ?? '';
		const secondDataSet = data.find(item => item.dataKey === link.dataKey2);
		const secondDataSetLabel = secondDataSet?.source.value?.label ?? '';

		return (
			<div className={styles.sources}>
				<div className={styles.first} title={firstDataSetLabel}>{firstDataSetLabel}</div>
				<div className={styles.arrow}>→</div>
				<div className={styles.second} title={secondDataSetLabel}>{secondDataSetLabel}</div>
			</div>
		);
	};

	render () {
		const {index} = this.props;

		return (
			<FormField path={getErrorPath(DIAGRAM_FIELDS.links, index, DIAGRAM_FIELDS.attribute)} small>
				<div className={styles.link} ref={this.ref}>
					{this.renderSources()}
					{this.renderConnection()}
					{this.renderActions()}
				</div>
				{this.renderEditLink()}
			</FormField>
		);
	}
}

export default SourceLink;
