// @flow
import {Button} from 'naumen-common-components';
import {connect} from 'react-redux';
import {Datepicker} from 'components/molecules/Datepicker/Datepicker.jsx';
import {deepClone} from 'helpers';
import {functions, props} from 'components/organisms/FormPanel/selectors';
import {gantt} from 'naumen-gantt';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import React, {useEffect, useState} from 'react';
import {ScaleNames} from 'components/organisms/FormPanel/consts';
import styles from './styles.less';
import Modal from 'components/atoms/Modal/Modal';
import {TextInput} from 'components/atoms/TextInput/TextInput';
import {useDispatch} from 'react-redux';

const АctionBar = props => {
	const [active, setActive] = useState(true);
	const [inputStartDate, setInputStartDate] = useState(new Date(props.startDate).toLocaleString());
	const [inputEndDate, setInputEndDate] = useState(new Date(props.endDate).toLocaleString());
	const [nameValue, setNameValue] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [showDatePickerStartDate, setShowDatePickerStartDate] = useState(false);
	const [showDatePickerEndDate, setShowDatePickerEndDate] = useState(false);
	const [showModalConfirmation, setShowModalConfirmation] = useState(false);
	const [showModalSave, setShowModalSave] = useState(false);
	const [valueError, setValueError] = useState('');
	const [showListVersions, setShowListVersions] = useState(false);

	const dispatch = useDispatch();

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
	const {addNewTask, editMode, endDate, handleToggle, name, refresh, startDate, settings} = props;
	const newSettings = deepClone(settings);
	let indexScaleName;

	useEffect(() => {
		if (typeof endDate !== 'string' && typeof startDate !== 'string') {
			const inputEndDate = new Date(endDate).toLocaleString(endDate);
			const inputstartDate = new Date(startDate).toLocaleString(startDate);

			setInputEndDate(inputEndDate);
			setInputStartDate(inputstartDate);
		} else {
			setInputEndDate(endDate);
			setInputStartDate(startDate);
		}
	}, [endDate, startDate]);

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

	const submitConfirmation = () => {
		setShowModalConfirmation(!showModalConfirmation);
	};

	const renderModalConfirmation = () => {
		if (showModalConfirmation) {
			return (
				<Modal
					className={styles.modal}
					notice={true}
					onClose={() => setShowModalConfirmation(!showModalConfirmation)}
					onSubmit={() => submitConfirmation()}
					submitText="Принять"
				>
					<div>Изменения будут применены к атрибутам</div>
				</Modal>
			);
		}

		return null;
	};

	const sibmitSave = () => {
		setShowModalSave(!showModalSave);
	};

	const renderModalSave = () => {
		if (showModalSave) {
			return (
				<Modal
					className={styles.modal}
					notice={true}
					onClose={() => setShowModalSave(!showModalSave)}
					onSubmit={() => sibmitSave()}
					submitText="Сохранить"
				>
					<div>Изменения к атрибутам не будут применены</div>
				</Modal>
			);
		}

		return null;
	};

	const openSaveModal = () => {
		setShowModalSave(!showModalSave);
	};

	const openConfirmationModal = () => {
		setShowModalConfirmation(!showModalConfirmation);
	};

	const changeNameValue = target => {
		setNameValue(target.value);
	};

	const submitSaveVersion = () => {
		const title = deepClone(nameValue);

		props.savedGanttVersionSettings(title, new Date().toLocaleString());
		dispatch(props.setCurrentVersion(''));

		setShowModalSave(!showModalSave);
	};

	const renderModalSecondLevel = () => {
		if (showModalSave) {
			return (
				<Modal
					className={styles.modal}
					notice={true}
					onClose={() => setShowModalSave(!showModalSave)}
					onSubmit={submitSaveVersion}
					submitText="Сохранить"
				>
					<div className={styles.inputInnerwrapper}>
						<TextInput label="Название" maxLength={30} onChange={changeNameValue} value={nameValue} />
					</div>
					<div className={styles.inputInnerwrapper}>
						<TextInput label="Дата и время создания" maxLength={30} placeholder="дд.мм.гггг, чч:мм:сс" value={new Date().toLocaleString()} />
					</div>
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

	const handleVersionButtonClick = () => {
		const {diagramKey} = props;

		setShowListVersions(true);
		setActive(false);

		props.getVersionSettingsAll(diagramKey);
	};

	const handleCurrentButtonClick = () => {
		setActive(true);
		props.getGanttData();
		dispatch(props.setCurrentVersion(''));
	};

	const handleModalClose = () => {
		setShowListVersions(!showListVersions);
	};

	const selectedVersion = version => {
		props.getVersionSettings(version.diagramKey);
		handleModalClose();
		gantt.render();
	};

	const deleteVersion = (title, diagramKey) => {
		const versions = deepClone(props.versions).filter(version => version.title !== title);

		props.deleteGanttVersionSettings(diagramKey);
		props.setListVersions(versions);
	};

	const renderVersion = (version) => {
		return (
			<div className={styles.itemBlock}>
				<div key={version.diagramKey} onClick={() => selectedVersion(version)}>
					{version.title}
				</div>
				<div onClick={() => deleteVersion(version.title, version.diagramKey)}>Удалить</div>
			</div>
		);
	};

	const renderVersions = () => props.versions.map(renderVersion);

	const renderModalListVersions = () => {
		if (showListVersions) {
			return (
				<Modal
					className={styles.modal}
					notice={true}
					onClose={handleModalClose}
					onSubmit={handleModalClose}
					submitText="Закрыть"
				>
					<ul className={styles.listTitle}>
						{renderVersions()}
					</ul>
				</Modal>
			);
		}

		return null;
	};

	const renderPanel = () => {
		return (
			<div className={styles.container}>
				<div className={styles.leftContainer}>
					<Button className={`${styles.btn} ${styles.btnVersions} ${active ? styles.unActive : ''}`} onClick={handleVersionButtonClick}>Версии</Button>
					<Button className={` ${styles.btn} ${styles.btnCurrent} ${!active ? styles.unActive : ''}`} onClick={handleCurrentButtonClick } >Текущий</Button>
				</div>
				<div className={styles.container}>
					<IconButton className={styles.icon} icon={ICON_NAMES.ZOOM_OUT} onClick={zoomIn} tip="Уменьшить масштаб" />
					<IconButton className={styles.icon} icon={ICON_NAMES.ZOOM_IN} onClick={zoomOut} tip="Увеличить масштаб" />
					{renderButtonSettings()}
					<IconButton className={styles.icon} icon={ICON_NAMES.CLOCK} onClick={openClockModal} tip="Интервал" />
					{iconButtonGroup}
					<IconButton className={styles.icon} icon={ICON_NAMES.BIG_PLUS} onClick={addNewTask} tip="Добавить работу" />
					<IconButton className={styles.icon} icon={ICON_NAMES.FAST_REFRESH} onClick={refresh} tip="Обновить" />
					<Button className={styles.btn} onClick={openConfirmationModal}>Применить</Button>
					<Button className={styles.btn} onClick={openSaveModal}>Сохранить</Button>
				</div>
			</div>
		);
	};

	return (
		<div className={styles.wrapper}>
			{renderPanel()}
			{renderModal()}
			{renderModalConfirmation()}
			{renderModalSave()}
			{renderModalSecondLevel()}
			{renderModalListVersions()}
		</div>
	);
};

export default connect(props, functions)(АctionBar);
