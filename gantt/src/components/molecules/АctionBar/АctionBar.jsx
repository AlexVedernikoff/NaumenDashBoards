// @flow
import {Button} from 'naumen-common-components';
import {connect} from 'react-redux';
import {Datepicker} from 'components/molecules/Datepicker/Datepicker.jsx';
import {deepClone} from 'helpers';
import {functions, props} from 'components/organisms/FormPanel/selectors';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import React, {useState} from 'react';
import {ScaleNames} from 'components/organisms/FormPanel/consts';
import styles from './styles.less';
import Modal from 'components/atoms/Modal/Modal';
import {TextInput} from 'components/atoms/TextInput/TextInput';

const АctionBar = props => {
	const [inputStartDate, setinputStartDate] = useState('');
	const [inputEndDate, setinputEndDate] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [showDatePickerStartDate, setShowDatePickerStartDate] = useState(false);
	const [showDatePickerEndDate, setShowDatePickerEndDate] = useState(false);
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

	const onSelectStartDate = (value) => {
		setinputStartDate(value);
		setShowDatePickerStartDate(!showDatePickerStartDate);
	};

	const onSelectEndDate = (value) => {
		setinputEndDate(value);
		setShowDatePickerEndDate(!showDatePickerEndDate);
	};

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

	const renderDatePickerStartDate = () => {
		if (showDatePickerStartDate) {
			return <Datepicker onSelect={(value) => onSelectStartDate(value)} value="" />;
		}
	};

	const renderDatePickerEndDate = () => {
		if (showDatePickerEndDate) {
			return <Datepicker onSelect={(value) => onSelectEndDate(value)} value="" />;
		}
	};

	const sibmitRange = () => {
		const date = {
			endDate: inputEndDate,
			startDate: inputStartDate
		};

		props.setRangeTime(date);
		setShowModal(!showModal);
	};

	const renderModal = () => {
		if (showModal) {
			return (
				<Modal
					className={styles.modal}
					notice={true}
					onClose={() => setShowModal(!showModal)}
					onSubmit={() => sibmitRange()}
					submitText="Сохранить"
				>
					<div className={styles.inputwrapper}>
						<TextInput maxLength={30} placeholder="" value={inputStartDate} />
						<IconButton className={styles.calendar} icon={ICON_NAMES.CALENDAR} onClick={() => setShowDatePickerStartDate(!showDatePickerStartDate)} />
					</div>
					{renderDatePickerStartDate()}
					<div className={styles.inputwrapper}>
						<TextInput maxLength={30} placeholder="" value={inputEndDate} />
						<IconButton className={styles.calendar} icon={ICON_NAMES.CALENDAR} onClick={() => setShowDatePickerEndDate(!showDatePickerEndDate)} />
					</div>
					{renderDatePickerEndDate()}
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

	return (
		<div className={styles.wrapper}>
			{renderPanel()}
			{renderModal()}
		</div>
	);
};

export default connect(props, functions)(АctionBar);
