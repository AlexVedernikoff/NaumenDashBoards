// @flow
import {Button} from 'naumen-common-components';
import {connect} from 'react-redux';
import {Datepicker} from 'components/molecules/Datepicker/Datepicker.jsx';
import {deepClone} from 'helpers';
import {functions, props} from 'components/organisms/FormPanel/selectors';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import React, {useEffect, useState} from 'react';
import {ScaleNames} from 'components/organisms/FormPanel/consts';
import styles from './styles.less';
import Modal from 'components/atoms/Modal/Modal';
import {TextInput} from 'components/atoms/TextInput/TextInput';

const АctionBar = props => {
	const [inputStartDate, setInputStartDate] = useState(new Date(props.startDate).toLocaleString());
	const [inputEndDate, setInputEndDate] = useState(new Date(props.endDate).toLocaleString());
	const [showModal, setShowModal] = useState(false);
	const [showDatePickerStartDate, setShowDatePickerStartDate] = useState(false);
	const [showDatePickerEndDate, setShowDatePickerEndDate] = useState(false);
	const [valueError, setValueError] = useState('');
	const panelButtons = [
		{icon: ICON_NAMES.DOWNLOAD_FILE, key: 'DOWNLOAD_FILE', method: 'method'}
	];
	const iconButtonGroup = panelButtons.map(item =>
		<IconButton
			className={styles.icon}
			icon={item.icon}
			key={item.key}
			tip="Экспорт"
			onClick={props.onClick}
		>{item.icon}
		</IconButton>);
	const {addNewTask, editMode, handleToggle, name, refresh, settings} = props;
	const newSettings = deepClone(settings);
	let indexScaleName;

	useEffect(() => {
		setInputEndDate(props.endDate);
		setInputStartDate(props.startDate);
	}, [props.endDate, props.startDate]);

	const onSelectStartDate = value => {
		setInputStartDate(new Date(value).toLocaleString());
		setShowDatePickerStartDate(!showDatePickerStartDate);
	};

	const onSelectEndDate = value => {
		setInputEndDate(new Date(value).toLocaleString());
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

	const convertDateToNormal = date => {
		const chunkDate = date.split(',');
		const dotReplacement = chunkDate[0].replace(/\./g, ',').split(',');

		[dotReplacement[0], dotReplacement[1]] = [dotReplacement[1], dotReplacement[0]];

		const modifiedDate = dotReplacement.join('.') + ',' + chunkDate[1];

		const withoutDotsandDash = modifiedDate.replace(/\./g, '/').replace(/\,/g, '');
		const modifiedDateStr = new Date(withoutDotsandDash);

		return modifiedDateStr;
	};

	const sibmitRange = () => {
		const newStartDate = new Date(convertDateToNormal(inputStartDate));
		const newEndDate = new Date(convertDateToNormal(inputEndDate));

		if (Date.parse(newEndDate) >= Date.parse(newStartDate)) {
			const date = {
				endDate: newEndDate,
				startDate: newStartDate
			};

			props.setRangeTime(date);
			setShowModal(!showModal);
			setValueError('');
		} else if (Date.parse(newEndDate) <= Date.parse(newStartDate)) {
			setValueError('Дата начала не может быть позднее даты завершения');
		} else if (!inputStartDate.length || !inputEndDate.length) {
			setValueError('Заполните все поля');
		} else {
			setValueError('Некорректная дата');
		}
	};

	const changeStartDate = target => {
		setInputStartDate(target.value);
	};

	const changeEndDate = target => {
		setInputEndDate(target.value);
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
						<TextInput label="Начало интервала" maxLength={30} onChange={changeStartDate} placeholder="дд.мм.гггг, чч:мм:сс" value={inputStartDate} />
						<IconButton className={styles.calendar} icon={ICON_NAMES.CALENDAR} onClick={() => setShowDatePickerStartDate(!showDatePickerStartDate)} />
					</div>
					{renderDatePickerStartDate()}
					<div className={styles.inputwrapper}>
						<TextInput label="Конец интервала" maxLength={30} onChange={changeEndDate} placeholder="дд.мм.гггг, чч:мм:сс" value={inputEndDate} />
						<IconButton className={styles.calendar} icon={ICON_NAMES.CALENDAR} onClick={() => setShowDatePickerEndDate(!showDatePickerEndDate)} />
					</div>
					{renderDatePickerEndDate()}
					<div className={styles.error}>{valueError}</div>
				</Modal>
			);
		}

		return null;
	};

	const openClockModal = () => {
		setShowModal(!showModal);
	};

	const onCloseDateModal = event => {
		const notInteractiveElements = [
			'src-components-atoms-Icon-styles__icon',
			'src-components-molecules-Datepicker-styles__daysContainer',
			'src-components-molecules-Datepicker-styles__container',
			'src-components-atoms-DatepickerControl-styles__iconContainer',
			'_3wX93PsyvAvzd8jTwAHjLy'
		];

		if (notInteractiveElements.includes(event.target.className && event.target.className.animVal) === false) {
			setShowDatePickerStartDate(false);
			setShowDatePickerEndDate(false);
		}
	};

	React.useEffect(() => {
		document.addEventListener('click', onCloseDateModal);
		return () => document.removeEventListener('click', onCloseDateModal);
	});

	const renderButtonSettings = () => {
		return editMode ? <IconButton className={styles.icon} icon={ICON_NAMES.SETTINGS} onClick={handleToggle} tip="Настройка" /> : null;
	};

	const renderPanel = () => {
		return (
			<div className={styles.container}>
				<IconButton className={styles.icon} icon={ICON_NAMES.ZOOM_OUT} onClick={zoomIn} tip="Уменьшить масштаб" />
				<IconButton className={styles.icon} icon={ICON_NAMES.ZOOM_IN} onClick={zoomOut} tip="Увеличить масштаб" />
				{renderButtonSettings()}
				<IconButton className={styles.icon} icon={ICON_NAMES.CLOCK} onClick={openClockModal} tip="Интервал" />
				{iconButtonGroup}
				<IconButton className={styles.icon} icon={ICON_NAMES.BIG_PLUS} onClick={addNewTask} tip="Добавить работу" />
				<IconButton className={styles.icon} icon={ICON_NAMES.FAST_REFRESH} onClick={refresh} tip="Обновить" />
				<Button className={styles.btn}>{name}</Button>
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
