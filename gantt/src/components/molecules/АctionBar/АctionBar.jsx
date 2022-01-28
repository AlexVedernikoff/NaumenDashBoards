// @flow
import {Button} from 'naumen-common-components';
import {connect} from 'react-redux';
import {deepClone} from 'helpers';
import {functions, props} from 'components/organisms/FormPanel/selectors';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import React, {useState} from 'react';
import {ScaleNames} from 'components/organisms/FormPanel/consts';
import styles from './styles.less';
import Modal from 'components/atoms/Modal/Modal';
import {Datepicker} from 'components/molecules/Datepicker/Datepicker.jsx';
import {TextInput} from 'components/atoms/TextInput/TextInput';

const АctionBar = props => {
	const [showModal, setShowModal] = useState(false);
	const [showDatepicker, setShowDatepicker] = useState(true);
	const panelButtons = [
		{icon: ICON_NAMES.DOWNLOAD_FILE, key: 'DOWNLOAD_FILE', method: 'method'}
	];
	const iconButtonGroup = panelButtons.map(item =>
		<IconButton
			className={styles.icon}
			icon={item.icon}
			key={item.key}
			onClick={props.onClick}
		>{item.icon}
		</IconButton>);
	const {settings} = props;
	const newSettings = deepClone(settings);
	let indexScaleName;

	const defineCurrenScale = active => {
		ScaleNames.find((item, index) => {
			item.value === active ? indexScaleName = index : undefined;
		});
	};

	defineCurrenScale(settings.scale);

	const zoomIn = () => {
		if (indexScaleName !== 4) {
			const setIndex = indexScaleName + 1;

			ScaleNames.find((item, index) => {
				if (index === setIndex) {
					newSettings.scale = item.value;
					props.changeScale(newSettings);
				}
			});
		}
	};

	const zoomOut = () => {
		if (indexScaleName !== 0) {
			const setIndex = indexScaleName - 1;

			ScaleNames.find((item, index) => {
				if (index === setIndex) {
					newSettings.scale = item.value;
					props.changeScale(newSettings);
				}
			});
		}
	};

	const renderModal = () => {
		const showCalendar = () => {
			setShowDatepicker(!showDatepicker);
		};

		if (showModal) {
			return (
				<Modal
					className={styles.modal}
					notice={true}
					onClose={() => setShowModal(!showModal)}
					onSubmit={() => setShowModal(!showModal)}
					submitText="Сохранить"
				>
					<div className={styles.inputwrapper}>
						<TextInput />
						<IconButton className={styles.calendar} icon={ICON_NAMES.CALENDAR} onClick={showCalendar} />
					</div>
					<div className={styles.inputwrapper}>
						<TextInput />
						<IconButton className={styles.calendar} icon={ICON_NAMES.CALENDAR} onClick={showCalendar} />
					</div>
					{renderDatepicker()}
				</Modal>
			);
		}

		return null;
	};

	const openClockModal = () => {
		setShowModal(!showModal);
	};

	const renderPanel = () => {
		return (
			<div className={styles.container}>
				<IconButton className={styles.icon} icon={ICON_NAMES.ZOOM_OUT} onClick={zoomIn} />
				<IconButton className={styles.icon} icon={ICON_NAMES.ZOOM_IN} onClick={zoomOut} />
				<IconButton className={styles.icon} icon={ICON_NAMES.SETTINGS} />
				<IconButton className={styles.icon} icon={ICON_NAMES.CLOCK} onClick={openClockModal} />
				{iconButtonGroup}
				<IconButton className={styles.icon} icon={ICON_NAMES.BIG_PLUS} onClick={props.addNewTask} />
				<IconButton className={styles.icon} icon={ICON_NAMES.FAST_REFRESH} onClick={props.refresh} />
				<Button className={styles.btn} onClick={props.handleToggle}>{props.name}</Button>
			</div>
		);
	};

	const handleSelect = () => {
		setShowDatepicker(!showDatepicker);
	};

	const renderDatepicker = () => {
		if (!showDatepicker) {
			return (
				<div>
					<Datepicker onSelect={handleSelect} value="10.10.2021" />
				</div>
			);
		}
	};

	return (
		<div className={styles.wrapper}>
			{renderPanel()}
			{renderModal()}
		</div>
	);
};

export default connect(props, functions)(АctionBar);
