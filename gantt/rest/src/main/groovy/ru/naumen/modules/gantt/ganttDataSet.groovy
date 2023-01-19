//Автор: NordClan
//Дата создания: 26.08.2021
//Код: ganttDataSet
//Назначение:
/**
 * Клиентский скриптовый модуль встроенного приложения "Gantt".
 * Содержит методы для формирования и получения данных по настройкам диаграммы.
 */
//Версия SMP: 4.12

package ru.naumen.modules.gantt

import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.Canonical
import groovy.transform.Field
import groovy.transform.InheritConstructors
import ru.naumen.core.server.script.api.injection.InjectApi
import static com.amazonaws.util.json.Jackson.toJsonString as toJson
import ru.naumen.core.shared.IUUIDIdentifiable
import ru.naumen.core.shared.dto.ISDtObject
import com.amazonaws.util.json.Jackson
import groovy.json.JsonSlurper
import ru.naumen.core.server.script.api.ISelectClauseApi
import ru.naumen.core.server.script.api.criteria.IApiCriteria
import ru.naumen.core.server.script.spi.ScriptDtObject
import sun.util.calendar.ZoneInfo
import ru.naumen.core.server.script.spi.ScriptDate

@Field @Lazy @Delegate GanttDataSetController ganttDataSet = new GanttDataSetImpl()

interface GanttDataSetController
{
    /**
     * Метод получения данных для построения диаграммы Ганта.
     * @param requestData - тело запроса [subjectUUID:..., contentCode: ...]
     * @param user - пользователь
     * @return данные для построения диаграммы Ганта.
     */
    String getGanttDiagramData(Map<String, String> requestData, IUUIDIdentifiable user)

    /**
     * Метод получения данных для построения версий диаграммы Ганта
     * @param requestData - тело запроса
     * @param user - пользователь
     * @return данные для построения диаграммы Ганта
     */
    String getGanttVersionDiagramData(Map<String, String> requestData, IUUIDIdentifiable user)

    /**
     * Метод получения работ при клике по чекбоксу отображения
     * @param requestContent - тело запроса
     * @param user - пользователь
     * @return список работ
     */
    String getWorks(Map<String, String> requestContent, IUUIDIdentifiable user)
}

@InheritConstructors
class GanttDataSetImpl implements GanttDataSetController
{
    GanttDataSetService service = GanttDataSetService.instance

    @Override
    String getGanttDiagramData(Map<String, String> requestContent, IUUIDIdentifiable user)
    {
        GetGanttSettingsRequest request = new ObjectMapper()
            .convertValue(requestContent, GetGanttSettingsRequest)
        return toJson(service.getGanttDiagramData(request, user))
    }

    @Override
    String getGanttVersionDiagramData(Map<String, String> requestData, IUUIDIdentifiable user)
    {
        return toJson(
            service.getGanttVersionDiagramData(requestData.versionKey, user, requestData.timezone)
        )
    }

    @Override
    String getWorks(Map<String, String> requestContent, IUUIDIdentifiable user)
    {
        GetGanttWorks request = new ObjectMapper()
            .convertValue(requestContent, GetGanttWorks)
        return toJson(service.getWorks(request, user))
    }
}

@InjectApi
@Singleton
class GanttDataSetService
{
    /**
     * Стандартные настройки цветов сущностей
     */
    private static final Collection<Map<String, String>> DEFAULT_COLOR_SETTINGS = initDefaultColors()

    private static final String GANTT_DATE_PATTERN = "yyyy-MM-dd, HH:mm:ss"
    /**
     * Максимальный размер выборки из БД.
     */
    static final LIMIT_SIZE_QUERY_FROM_DB = 10000

    /**
     * Максимальное количество строк табличной части диаграммы Ганта.
     */
    static final LIMIT_SIZE_GANTT_TABLE_RESULTS = 10000

    /**
     * Метод получения данных для построения диаграммы Ганта
     * @param request - тело запроса [subjectUUID:..., contentCode: ...]
     * @param user - пользователь
     * @return данные для построения диаграммы Ганта
     */
    GanttDiagramData getGanttDiagramData(GetGanttSettingsRequest request, IUUIDIdentifiable user)
    {
        // Получение настроек диаграммы из хранилища.
        GanttSettingsService service = GanttSettingsService.instance
        GanttSettingsClass settings = service.getGanttSettings(request, user)

        GanttDiagramData data = new GanttDiagramData()
        data.commonSettings = settings.commonSettings
        data.diagramKey = settings.diagramKey
        data.workRelations = settings.workRelations
        data.workRelationCheckbox = settings.workRelationCheckbox
        data.progressCheckbox = settings.progressCheckbox
        data.stateMilestonesCheckbox = settings.stateMilestonesCheckbox
        data.milestonesCheckbox = settings.milestonesCheckbox
        data.worksWithoutStartOrEndDateCheckbox = settings.worksWithoutStartOrEndDateCheckbox
        data.currentInterval = settings.currentInterval
        data.viewOfNestingCheckbox = settings.viewOfNestingCheckbox
        data.multiplicityCheckbox = settings.multiplicityCheckbox
        data.viewWork = settings.viewWork
        data.currentColorSettings = settings.currentColorSettings
        data.isPersonalDiagram = settings.isPersonalDiagram
        data.isPersonal = settings.isPersonal
        if (user)
        {
            data.isPersonalDiagram = settings.isPersonalDiagram
        }
        if (request.hasProperty('isPersonal') && request.isPersonal)
        {
            data.isPersonal = true
        }

        if (settings.startDate && settings.endDate)
        {
            String startDate = settings.startDate
            String endDate = settings.endDate
            Date sd = Date.parse("yyyy-MM-dd'T'HH:mm:ss", startDate)
            Date ed = Date.parse("yyyy-MM-dd'T'HH:mm:ss", endDate)
            data.startDate = sd.format(GANTT_DATE_PATTERN)
            data.endDate = ed.format(GANTT_DATE_PATTERN)
        }

        GanttWorkHandlerService ganttWorkHandlerService = GanttWorkHandlerService.instance
        settings.resourceAndWorkSettings.each {
            String metaClassCode = it.source.value.value
            data.attributesMap.put(
                metaClassCode,
                ganttWorkHandlerService.getAttributeGroups(metaClassCode)
            )
        }
        if (!(settings?.resourceAndWorkSettings))
        {
            data.tasks = []
        }
        else
        {
            addBasicListWork(settings, request, user, data)
            if (!data.worksWithoutStartOrEndDateCheckbox)
            {
                data.tasks = filterTasksWithNoDateRanges(data.tasks)
            }
        }
        return data
    }

    /**
     * Метод добавления работ
     * @param settings - настройки диаграммы из хранилища
     * @param request - тело запроса
     * @param user - пользователь
     * @param data - данные о диаграмме
     * @return список работ
     */
    void addBasicListWork(GanttSettingsClass settings,
                          GetGanttSettingsRequest request,
                          IUUIDIdentifiable user,
                          GanttDiagramData data)
    {
        data.tasks = buildDataListFromSettings(
            settings,
            settings.resourceAndWorkSettings,
            null,
            request.subjectUUID
        )
        ZoneInfo timezone =
            TimeZone.getTimeZone(
                api.employee.getPersonalSettings(user?.UUID).getTimeZone() ?: request.timezone
            )
        ResourceAndWorkSettings workAttributeSettings = settings.resourceAndWorkSettings.find {
            it.startWorkAttribute && it.endWorkAttribute
        }
        data.tasks.each {
            formatWorkDates(it, workAttributeSettings, timezone)
            setWorkTypeToProjectIfItHasChildren(it, data.tasks)
            setWorkProgress(it, settings)
            setColumnDateFormats(it, timezone)
        }
        if (data.commonSettings)
        {
            ColumnSettings columnSettingsTitle = data.commonSettings?.columnSettings?.first()
            data.tasks.each {
                if (columnSettingsTitle)
                {
                    it.name = it[columnSettingsTitle.code]
                }
            }
        }
        determiningCurrentPositionElement(request, data, user)
        data.tasks = finalSortingElements(data.tasks)
    }

    /**
     * Метод финальной сортировки элентов схемы
     * @param tasks - список задач
     * @return отсортированные элементы
     */
    Collection<Map<String, Object>> finalSortingElements(Collection<Map<String, Object>> tasks)
    {
        Collection<Map<String, Object>> resourcesOnly = tasks.findAll {
            it.level == 0
        }.sort {
            it.positionElement
        }
        Collection<Map<String, Object>> sortableElements = []
        resourcesOnly.each { resources ->
            sortableElements.add(resources)
            Collection<Map<String, Object>> workOnly =
                tasks.findAll { currentWorks -> currentWorks.parent == resources.id
                }
            if (workOnly)
            {
                sortableElements.addAll(
                    workOnly.sort {
                        it.positionElement
                    }
                )
            }
        }
        return sortableElements
    }

    /**
     * Метод определения позиции элемента схемы
     * @param request - тело запроса
     * @param data - данные о диаграмме
     * @param user - данные о пользователе
     * @return задачи с определенной позицией на схеме
     */
    void determiningCurrentPositionElement(GetGanttSettingsRequest request,
                                           GanttDiagramData data,
                                           IUUIDIdentifiable user)
    {
        Integer position = 0
        GanttSettingsService service = GanttSettingsService.instance
        String keySequencesElements
        if (request.hasProperty('isPersonal') && request.isPersonal)
        {
            keySequencesElements = [user.UUID, request.contentCode,
                                    'personalVersion', 'sequencesElements'].join('_')
        }
        else
        {
            keySequencesElements = [service.generateDiagramKey(
                request.subjectUUID,
                request.contentCode
            ), 'sequencesElements'].join('_')
        }
        String sequenceInformation = service.getJsonSettings(keySequencesElements)
        Collection<SequenceChartElements> sequenceElements = []
        if (sequenceInformation)
        {
            LinkedListSequenceChartElements linkedListSequenceChartElements =
                Jackson.fromJsonString(sequenceInformation, LinkedListSequenceChartElements)
            linkedListSequenceChartElements.elements.each { settingsSequenceChartElements ->
                if (data.tasks.find {
                    it.id == settingsSequenceChartElements.workUuid
                })
                {
                    data.tasks.find {
                        it.id == settingsSequenceChartElements.workUuid
                    }.positionElement = settingsSequenceChartElements.idLocations
                }
            }
        }
        else
        {
            data.tasks.eachWithIndex { currentTask, idx ->
                if (currentTask.type == SourceType.RESOURCE || currentTask.type == 'project')
                {
                    SequenceChartElements sequenceChartElements = new SequenceChartElements()
                    sequenceChartElements.workUuid = currentTask.id
                    sequenceChartElements.idLocations = position
                    sequenceChartElements.idChainChildWorkItems = 0
                    sequenceChartElements.metaInformation =
                        api.utils.get(currentTask.id).getMetainfo().toString()
                    sequenceChartElements.titleElement = api.utils.get(currentTask.id).title
                    position++
                    sequenceElements.add(sequenceChartElements)
                }
                if (currentTask.type == SourceType.WORK || currentTask.type == 'milestone')
                {
                    SequenceChartElements parentChartElements = sequenceElements.find {
                        currentTask.parent == it.workUuid
                    }
                    SequenceChartElements sequenceChartElements = new SequenceChartElements()
                    sequenceChartElements.workUuid = currentTask.id
                    sequenceChartElements.metaInformation =
                        api.utils.get(currentTask.id).getMetainfo().toString()
                    sequenceChartElements.parentUuid = parentChartElements.workUuid
                    sequenceChartElements.titleElement = api.utils.get(currentTask.id).title
                    sequenceChartElements.idLocations = parentChartElements.idChainChildWorkItems
                    parentChartElements.idChainChildWorkItems++
                    sequenceElements.add(sequenceChartElements)
                }
            }
            sequenceElements.each { sequenceEl ->
                if (sequenceEl.parentUuid == null)
                {
                    SequenceChartElements chartElements = sequenceElements.find {
                        it.parentUuid == null && it.idLocations == (sequenceEl.idLocations + 1)
                    }
                    if (chartElements)
                    {
                        sequenceEl.uuidNextElement = chartElements.workUuid
                    }
                }
                else
                {
                    SequenceChartElements chartElements = sequenceElements.find {
                        sequenceEl.parentUuid ==
                        it.parentUuid && it.idLocations == (sequenceEl.idLocations + 1)
                    }
                    if (chartElements)
                    {
                        sequenceEl.uuidNextElement = chartElements.workUuid
                    }
                }
            }
            LinkedListSequenceChartElements linkedListSequenceChartElements = new LinkedListSequenceChartElements()
            linkedListSequenceChartElements.elements = sequenceElements
            service.saveJsonSettings(
                keySequencesElements,
                Jackson.toJsonString(linkedListSequenceChartElements)
            )
        }
    }

    /**
     * Метод получения данных для построения версий диаграммы Ганта
     * @param versionKey - ключ диаграммы версии
     * @param user - пользователь
     * @param timezone - таймзона
     * @return данные для построения диаграммы Ганта
     */
    GanttDiagramData getGanttVersionDiagramData(String versionKey,
                                                IUUIDIdentifiable user,
                                                String timezone)
    {
        GanttSettingsService service = GanttSettingsService.instance
        GanttVersionsSettingsClass ganttVersionsSettings =
            service.getGanttVersionsSettings(versionKey)
        GanttDiagramData data = new GanttDiagramData()
        data.commonSettings = ganttVersionsSettings.commonSettings
        data.diagramKey = ganttVersionsSettings.ganttSettings.diagramKey
        data.workRelations = ganttVersionsSettings.workRelations
        data.workRelationCheckbox = ganttVersionsSettings.ganttSettings.workRelationCheckbox
        data.progressCheckbox = ganttVersionsSettings.ganttSettings.progressCheckbox
        data.stateMilestonesCheckbox = ganttVersionsSettings.ganttSettings.stateMilestonesCheckbox
        data.milestonesCheckbox = ganttVersionsSettings.ganttSettings.milestonesCheckbox
        data.worksWithoutStartOrEndDateCheckbox =
            ganttVersionsSettings.ganttSettings.worksWithoutStartOrEndDateCheckbox
        data.viewOfNestingCheckbox = ganttVersionsSettings.ganttSettings.viewOfNestingCheckbox
        data.multiplicityCheckbox = ganttVersionsSettings.ganttSettings.multiplicityCheckbox
        data.viewWork = ganttVersionsSettings.ganttSettings.viewWork
        data.currentColorSettings = ganttVersionsSettings.ganttSettings.currentColorSettings

        if (ganttVersionsSettings.ganttSettings.startDate &&
            ganttVersionsSettings.ganttSettings.endDate)
        {
            String startDate = ganttVersionsSettings.ganttSettings.startDate
            String endDate = ganttVersionsSettings.ganttSettings.endDate
            Date sd = Date.parse("yyyy-MM-dd'T'HH:mm:ss", startDate)
            Date ed = Date.parse("yyyy-MM-dd'T'HH:mm:ss", endDate)
            data.startDate = sd.format(GANTT_DATE_PATTERN)
            data.endDate = ed.format(GANTT_DATE_PATTERN)
        }
        if (!ganttVersionsSettings.ganttSettings.resourceAndWorkSettings)
        {
            data.tasks = []
        }
        else
        {
            data.tasks = ganttVersionsSettings.tasks
        }
        return data
    }

    /**
     * Метод фильтрации работ, у которых отсутствуют даты для отображения на диаграмме
     * @param tasks - работы
     * @return отфильтрованные работы
     */
    private Collection<Map<String, Object>> filterTasksWithNoDateRanges(Collection<Map<String, Object>> tasks)
    {
        return tasks.findResults {
            Boolean startAndEndDateExist = it.start_date && it.end_date
            Boolean type = it.type == SourceType.WORK
            if (it.type in [SourceType.RESOURCE, 'milestone', 'project'])
            {
                return it
            }
            if (startAndEndDateExist && type)
            {
                return it
            }
        }
    }

    /**
     * Метод генерации данных версии диаграммы для отображения
     * @param ganttVersionsSettings - настройки версии диаграммы
     * @return данные версии диаграммы
     */
    private Collection<Map<String, Object>> generateTasksForDiagramVersion(
        GanttVersionsSettingsClass ganttVersionsSettings)
    {
        Collection<Map<String, Object>> tasks = []

        Map<String, Collection<DiagramEntity>> diagramEntitiesGroupedByMetaClassCode =
            ganttVersionsSettings.diagramEntities.groupBy {
                it.entityUUID.split('\\$').first()
            }

        ganttVersionsSettings.ganttSettings.resourceAndWorkSettings.each {
            String settingsMetaClassCode = it.source.value.value
            if (settingsMetaClassCode.contains('$'))
            {
                settingsMetaClassCode = settingsMetaClassCode.split('\\$').first()
            }
            Collection<DiagramEntity> diagramEntities =
                diagramEntitiesGroupedByMetaClassCode[settingsMetaClassCode]
            if (!diagramEntities)
            {
                return
            }
            Map<String, String> mapAttributes = ['id': 'UUID', 'text': 'title']
            if (it.type as SourceType == SourceType.WORK)
            {
                if (it.startWorkAttribute)
                {
                    mapAttributes.start_date = it.startWorkAttribute.code.split('@').last()
                }
                if (it.endWorkAttribute)
                {
                    mapAttributes.end_date = it.endWorkAttribute.code.split('@').last()
                }
            }
            it.attributeSettings.each {
                mapAttributes[it.code] = it.attribute.code
            }

            diagramEntities.each { entity ->
                Map<String, Object> task = [:]
                if (entity.sourceType in ['WORK', 'milestone', 'project'])
                {
                    task.parent = entity.parent
                    task.datesStartDateAndEndDate = entity.datesStartDateAndEndDate
                    task.positionElement = entity.positionElement
                }
                else
                {
                    task.datesStartDateAndEndDate = false
                }
                task.type = entity.sourceType
                task.editable = entity.editable
                task.level = entity.level
                task.name = entity.name
                task.workOfLink = entity.workOfLink
                entity.dataTableColumns.each { key, value ->
                    task.put(key, value)
                }
                mapAttributes.keySet().each { fieldCode ->
                    task[fieldCode] =
                        getAttributeValueForVersionEntity(
                            entity,
                            mapAttributes[fieldCode],
                            fieldCode
                        )
                    if (task[fieldCode] &&
                        fieldCode in ['start_date', 'end_date'] && !(task[fieldCode] in Date))
                    {
                        task[fieldCode] = Date.parse("yyyy-MM-dd'T'HH:mm:ss", task[fieldCode])
                    }
                }

                if (task.type == 'WORK')
                {
                    task << ['typeEntity': task.type]
                    task << ['textColor':
                                 ganttVersionsSettings.ganttSettings?.currentColorSettings[0]?.color
                                     ?: DEFAULT_COLOR_SETTINGS[0].color]
                    task << ['color':
                                 ganttVersionsSettings
                                     .ganttSettings?.currentColorSettings[1]?.background ?:
                                     DEFAULT_COLOR_SETTINGS[1].color]
                }
                else if (task.type == 'RESOURCE')
                {
                    task << ['typeEntity': task.type]
                    task << ['textColor':
                                 ganttVersionsSettings.ganttSettings?.currentColorSettings[2]?.color
                                     ?: DEFAULT_COLOR_SETTINGS[2].color]
                    task << ['color':
                                 ganttVersionsSettings
                                     .ganttSettings?.currentColorSettings[3]?.background ?:
                                     DEFAULT_COLOR_SETTINGS[3].color]
                }
                else if (task.type == 'project')
                {
                    task << ['typeEntity': task.type]
                    task << ['textColor':
                                 ganttVersionsSettings.ganttSettings?.currentColorSettings[4]?.color
                                     ?: DEFAULT_COLOR_SETTINGS[4].color]
                    task << ['color':
                                 ganttVersionsSettings
                                     .ganttSettings?.currentColorSettings[5]?.background ?:
                                     DEFAULT_COLOR_SETTINGS[5].color]
                }
                else if (task.type == 'milestone')
                {
                    task << ['typeEntity': task.type]
                    task << ['textColor':
                                 ganttVersionsSettings.ganttSettings?.currentColorSettings[6]?.color
                                     ?: DEFAULT_COLOR_SETTINGS[6].color]
                    task << ['color':
                                 ganttVersionsSettings
                                     .ganttSettings?.currentColorSettings[7]?.background ?:
                                     DEFAULT_COLOR_SETTINGS[7].color]
                    task.completed = entity.completed
                    task.remove('end_date')
                }
                tasks << task
            }
        }
        return tasks
    }

    /**
     * Метод получения значения атрибута объекта для версии диаграммы
     * @param entity - объект диаграммы
     * @param attributeCode - код атрибута
     * @param fieldCode - поле атрибута
     * @return значение атрибута
     */
    private Object getAttributeValueForVersionEntity(DiagramEntity entity,
                                                     String attributeCode,
                                                     String fieldCode)
    {
        Object value = null
        String dateFormat = "yyyy-MM-dd'T'HH:mm:ss"
        if (entity.attributesData[attributeCode])
        {
            value = entity.attributesData[attributeCode]
        }
        else
        {
            ISDtObject entityInSystem = utils.load(entity.entityUUID)
            if (entityInSystem)
            {
                if (api.metainfo.getMetaClass(entityInSystem).hasAttribute(attributeCode))
                {
                    value = entityInSystem[attributeCode]

                    Collection<Long> dateInformation = entity?.attributesData.findAll { key, val ->
                        val instanceof Long || checkingItemForDate(val, dateFormat)
                    }.collect { key, val ->
                        if (val instanceof Long)
                        {
                            return val
                        }
                        else if (checkingItemForDate(val, dateFormat))
                        {
                            return Date.parse(dateFormat, val).getTime()
                        }
                    }
                    if (!dateInformation.isEmpty() && ['start_date', 'end_date']
                        .contains(fieldCode))
                    {
                        value = new Date(
                            fieldCode == 'start_date' ?
                                Math.min(dateInformation?.first(), dateInformation?.last())
                                : Math.max(dateInformation?.first(), dateInformation?.last())
                        )
                    }
                    if (value in ISDtObject)
                    {
                        value = value.title
                    }
                }
            }
        }
        return value
    }

    /**
     * Проверка строки на содержание даты
     * @param attributeValue - значение для приведения в дате
     * @param dateFormat - формат даты для форматирования
     * @return является ли строка датой
     */
    private Boolean checkingItemForDate(String attributeValue, String dateFormat)
    {
        try
        {
            Date.parse(dateFormat, attributeValue)
            return true
        }
        catch (Exception ex)
        {
            return false
        }
    }

    /**
     * Замена формата даты для колонок
     * @param work - работа
     * @param timezone - таймзона
     */
    private void setColumnDateFormats(Map work, TimeZone timezone)
    {
        Map workToMerge = [:]
        work.each {
            def value = it.value
            def key = it.key
            if (value in Date && !(key in ['start_date', 'end_date']))
            {
                workToMerge[key] =
                    value.getHours() ? value.format('dd.MM.yyyy, HH:mm:ss', timezone) :
                        value.format('dd.MM.yyyy')
            }
        }

        if (workToMerge)
        {
            workToMerge.each {
                work[it.key] = it.value
            }
        }
    }

    /**
     * Установить данные прогресса для работы
     * @param work - работа
     * @param ganttSettings - настройки диаграммы, где хранится прогресс
     */
    private void setWorkProgress(Map work, GanttSettingsClass ganttSettings)
    {
        Double progress = ganttSettings.workProgresses[work.id]
        work.progress = progress ?: 0
    }

    /**
     * Установить данные прогресса для работы версий
     * @param work - работа
     * @param ganttSettings - настройки диаграммы, где хранится прогресс
     */
    private void setWorkProgressVersion(Map work, GanttVersionsSettingsClass ganttVersionSettings)
    {
        Double progress = ganttVersionSettings.ganttSettings.workProgresses[work.id]
        work.progress = progress ?: 0
    }

    /**
     * Метод изменения типа работы на 'project', если у нее есть дочерние работы
     * @param work - текущая работа
     * @param allWorks - все работы
     */
    private void setWorkTypeToProjectIfItHasChildren(Map work, Collection<Map> allWorks)
    {
        allWorks.each {
            if (it.parent == work.id)
            {
                work['type'] = 'project'
            }
        }
    }

    /**
     * Метод перевода дат работ в строку
     * @param work - работа
     * @param workAttributeSettings - настройки работы
     * @param timezone - таймзона
     */
    private void formatWorkDates(Map work,
                                 ResourceAndWorkSettings workAttributeSettings,
                                 TimeZone timezone)
    {
        String dateFormat = "yyyy-MM-dd'T'HH:mm:ss"
        if (work['start_date'])
        {
            if (workAttributeSettings?.startWorkAttribute?.type == 'date' || (work['start_date'] in
                                                                              ScriptDate && !
                                                                                  work['start_date']
                                                                                      .getMinutes() && !
                                                                                  work['start_date']
                                                                                      .getHours()))
            {
                work['start_date'] = work['start_date'].format(dateFormat)
            }
            else
            {
                work['start_date'] = work['start_date'].format(dateFormat, timezone)
            }
        }
        if (work['end_date'])
        {
            if (workAttributeSettings?.endWorkAttribute?.type == 'date')
            {
                work['end_date'] = work['end_date'].format(dateFormat)
            }
            else
            {
                work['end_date'] = work['end_date'].format(dateFormat, timezone)
            }
        }
    }

    /**
     * Метод подготовки атрибута для запроса
     * @param attribute - значение атрибута
     * @return объединенная строчка через точку из кодов атрибута
     */
    private String prepare(Attribute attribute)
    {
        String attributeType = Attribute.getAttributeType(attribute)

        switch (attributeType)
        {
            case AttributeType.LINK_TYPES:
                attribute.attrChains().last().ref = new Attribute(code: 'title', type: 'string')
                break
            case AttributeType.META_CLASS_TYPE:
                attribute.code = 'metaClassFqn'
                break
        }
        return attribute.attrChains().code.join('.')
    }

    /**
     * Метод получения данных для построения диаграммы Ганта, вызывается рекурсивно
     * @param generalSettings - общие данные для настроек и построения диаграммы Ганта
     * @param settingsList - иерархический список настроек (подтип generalSettings)
     * @param parentUUID - уникальный идентификатор записи в БД о родителе
     * @param subjectUUID - уникальный идентификатор объекта, на карточке которого расположена диаграмма
     * @return список List<String, String> параметров для построения диаграммы
     */
    private List<Map<String, String>> buildDataListFromSettings(GanttSettingsClass generalSettings,
                                                                Collection<ResourceAndWorkSettings> settingsList,
                                                                String parentUUID,
                                                                String subjectUUID)
    {
        /* За текущую настройку из списка настроек, берется 1-ый элемент settingsList[0]. В цикле совершается поиск таких
           настроек, для которых уровень вложенности level равен level-у текущей. Таким образом находятся по сути соседние
           узлы/элементы этого иерархического списка (дерева) настроек.
           По каждому из них строится список результатов из БД.
           По каждой строке выборки, полученной из БД, рекурсивно выполняется этот же метод, дополняя список результатов
           (рекурсия в данном случае уместна, так как ее глубина не превысит количество настроек из списка settingsList,
           заданное вручную технологом, а точнее не превысит максимальную вложенность level элементов этого списка).
           Метод возвращает список словарей вида:
           ['id' : 'UUID',
            'text' : 'title',
            'render' : 'split'/null,
            'код_поля_формы_0' : значение из БД по коду атрибута 0 .....,
            'код_поля_формы_n' : значение из БД по коду атрибута n,
            'parent' : значение из БД по коду атрибута для связи,
            'start_date' : значение из БД по коду атрибута начала работы (для работ),
            'end_date' : значение из БД по коду атрибута окончания работы (для работ),
            'level' : уровень_вложенности,
            'type' : RESOURSE/WORK
            'entityType' : вторичный тип данных (RESOURSE, WORK, project, milestone etc...)
            'textColor' : цвет текста сущности
            'text' : цвет сущности
            'positionElement' : позиция элемента в списке
           ] */

        // Closure для подготовки кодов аттрибутов для запроса в БД.
        //Closure prepare = { (it?.type in AttributeType.LINK_TYPES) ? ("${it.code}.title") : it.code }

        def result = []
        Closure updateIfMetaClass = { item, attr ->
            attr == 'metaClassFqn'
                ? api.metainfo.getMetaClass(item)?.title
                : item
        }

        for (int i = 0; i < settingsList.size(); i++)
        {
            /* Если уровень вложенности следующей в списке настройки ниже, то ветка дерева настроек
               (иерархического списка) сменилась. Поиск завершается. */
            if (settingsList[i].level < settingsList[0].level)
            {
                break
            }

            // Текущие настройки, по которым необходимо построить список.
            ResourceAndWorkSettings settings

            // Настройка с уровнем вложенности level, равным level-у текущей, найдена.
            if (settingsList[i].level == settingsList[0].level)
            {
                settings = settingsList[i]
            }
            else
            {
                continue
            }

            // Собираем словарь из атрибутов, чтобы сделать запрос в БД.
            Map<String, String> mapAttributes = ['id': 'UUID', 'text': 'title']

            Collection<AttributeSettings> attributesList = settings.attributeSettings
            mapAttributes << attributesList.collectEntries {
                [(it.code): prepare(it.attribute)]
            }
            if (settings.communicationResourceAttribute)
            {
                mapAttributes.put('parent', settings.communicationResourceAttribute.code + '.UUID')
            }
            else if (settings.communicationWorkAttribute)
            {
                mapAttributes.put('parent', settings.communicationWorkAttribute.code + '.UUID')
            }
            // Проверка на null необходима, чтобы не выпала ошибка при запросе из БД.
            // В случае, если атрибут равен null, добавляем его позднее - после запроса в БД.
            boolean isStartDate, isEndDate, attributeForMilestone
            String milestoneAttributeName
            if (settings.type == SourceType.WORK)
            {
                isStartDate = settings.startWorkAttribute
                isEndDate = settings.endWorkAttribute
                attributeForMilestone = settings.checkpointStatusAttr
                if(milestoneAttributeName){
                    milestoneAttributeName = settings.checkpointStatusAttr.code.split('@').last()
                }
                if (isStartDate)
                {
                    mapAttributes.put('start_date', prepare(settings.startWorkAttribute))
                }
                if (isEndDate)
                {
                    mapAttributes.put('end_date', prepare(settings.endWorkAttribute))
                }
                if (attributeForMilestone)
                {
                    milestoneAttributeName = settings.checkpointStatusAttr.code.split('@').last()
                }
            }

            Source source = settings.source
            // Так как из БД нельзя получить повторяющиеся колонки, то имена атрибутов делаем уникальными.
            List<String> listAttributes = mapAttributes.values().toList().unique()
            List<List<String>> res = getListResultsForParent(
                source, mapAttributes['parent'], parentUUID?.takeWhile {
                it != '_'
            }, listAttributes, subjectUUID
            )

            if (res)
            {
                // Подготовка значений некоторых атрибутов
                res = replaceStatusCodeWithTitle(res, listAttributes)
                /* Из БД пришел набор данных. Необходимо задать правильное соответствие между названием
                   поля и значением, пришедшим из БД. Это необходимо, если технолог задал одинаковые атрибуты
                   в разных полях формы (в этом случае при простом сопоставлении получим сдвиг). Для этого
                   строим словарь-соответствие между наименованиями полей (id, text... и тд.) и номером
                   столбца набора данных, пришедшего из БД (0..n). */
                Map<String, Integer> mapAttributesIndexes = [:]
                mapAttributes.each { key, value ->
                    Integer ind = listAttributes.indexOf(value)
                    mapAttributesIndexes.put(key, [ind: ind, attr: value])
                }

                // Преобразование в список из словарей (добавление к значениям, полученным из БД, ключей).
                List<Map<String, String>> resMap = []

                res.each { item ->
                    Map<String, String> itemMap =
                        mapAttributesIndexes.collectEntries { key, valueMap ->
                            Object attributeValue = item[valueMap.ind]
                            if (attributeValue == true)
                            {
                                attributeValue = 'да'
                            }
                            else if (attributeValue == false)
                            {
                                attributeValue = 'нет'
                            }
                            return [(key): updateIfMetaClass(attributeValue, valueMap.attr)]
                        }

                    if (itemMap.parent)
                    {
                        itemMap.parent = parentUUID
                    }

                    resMap.add(itemMap)
                }
                // Добавление данных, общих для списка.
                resMap.each {
                    it << ['level': settings.level]
                    it << ['type': settings.type]
                    it << ['editable': true]
                    it << ['workOfLink': api.web.open(it.id)]
                    it << ['name': null]
                    it << ['duration': null]
                    it << ['unscheduled': null]
                    it << ['datesStartDateAndEndDate': true]
                    it << ['positionElement': null]
                    if (settings.type == SourceType.WORK)
                    {
                        it << ['typeEntity': settings.type]
                        if (!isStartDate)
                        {
                            it << ['start_date': null]
                        }
                        if (!isEndDate)
                        {
                            it << ['end_date': null]
                        }
                        it << ['textColor': generalSettings?.currentColorSettings[0]?.color ?:
                            DEFAULT_COLOR_SETTINGS[0].color]
                        it << ['color': generalSettings?.currentColorSettings[1]?.background ?:
                            DEFAULT_COLOR_SETTINGS[1].background]
                        if (!it?.start_date && !it?.end_date)
                        {
                            it.unscheduled = true
                        }
                        if (!it?.start_date || !it?.end_date)
                        {
                            it.duration = 1
                        }
                    }

                    else if ((settings.type == SourceType.RESOURCE) && (
                        settings.id in settingsList.parent))
                    {
                        it << ['render': (generalSettings?.viewOfNestingCheckbox) ? 'split' : null]
                        it << ['typeEntity': 'project']
                        it << ['textColor': generalSettings?.currentColorSettings[4]?.color ?:
                            DEFAULT_COLOR_SETTINGS[4].color]
                        it << ['color': generalSettings?.currentColorSettings[5]?.background ?:
                            DEFAULT_COLOR_SETTINGS[5].background]
                    }

                    else if (settings.type == SourceType.RESOURCE)
                    {
                        it << ['render': (generalSettings?.viewOfNestingCheckbox) ? 'split' : null]
                        it << ['typeEntity': settings.type]
                        it << ['textColor': generalSettings?.currentColorSettings[2]?.color ?:
                            DEFAULT_COLOR_SETTINGS[2].color]
                        it << ['color': generalSettings?.currentColorSettings[3]?.background ?:
                            DEFAULT_COLOR_SETTINGS[3].background]
                    }

                    ISDtObject currentObject = api.utils.get(it.id)
                    if (milestoneAttributeName && currentObject.hasProperty(milestoneAttributeName) &&
                        currentObject[milestoneAttributeName])
                    {
                        String elementWithFinalStatus =
                            api.metainfo.getMetaClass(currentObject).workflow.getState(
                                currentObject.state
                            ).code
                        String currentElementStatus =
                            api.metainfo.getMetaClass(currentObject).workflow.endState.code
                        it << ['type': 'milestone']
                        it << ['typeEntity': 'milestone']
                        it << ['textColor': generalSettings?.currentColorSettings[6]?.color ?:
                            DEFAULT_COLOR_SETTINGS[6].color]
                        it << ['color': generalSettings?.currentColorSettings[7]?.background ?:
                            DEFAULT_COLOR_SETTINGS[7].background]
                        it << ['completed': elementWithFinalStatus == currentElementStatus]
                        it.start_date = currentObject[milestoneAttributeName]
                        it.remove('end_date')
                    }
                    if (settings.type == SourceType.WORK || it.type == 'milestone')
                    {
                        it << ['positionElement': null]
                    }
                }
                // Если есть настройка-потомок (уровень вложенности следующей в списке настройки выше, чем у текущей).
                if ((settingsList.size() > (i + 1)) && (settingsList[i + 1].level > settings.level))
                {
                    // По каждому элементу списка рекурсивно выполняется этот же метод, дополняя список результатов.
                    resMap.any {
                        if (result.size() > LIMIT_SIZE_GANTT_TABLE_RESULTS)
                        {
                            return true
                        }
                        // Добавление элемента в результирующий список.
                        result.add(it)
                        // Рекурсивный вызов для "потомков". Список с настройками передается со второго элемента.
                        result.addAll(
                            buildDataListFromSettings(
                                generalSettings,
                                settingsList[(i + 1)..-1],
                                it['id'],
                                subjectUUID
                            )
                        )
                        return
                    }
                }
                else
                {
                    result.addAll(resMap)
                }
            }
        }
        return result
    }

    /**
     * Метод замены кодов статусов на их названия
     * @param result - результат из базы
     * @param attributes - список атрибутов
     * @return измененный результат
     */
    private List<List<String>> replaceStatusCodeWithTitle(List<List<String>> result, List<String> attributes)
    {
        Integer statusAttributeIndex = attributes.findIndexOf {
            it == AttributeType.STATE_TYPE
        }
        if (!statusAttributeIndex)
        {
            return
        }

        GanttWorkHandlerService workHandlerService = GanttWorkHandlerService.instance

        Map<List<Map>> statusesDataGroupedByClassCode = [:]

        return result.collect {
            String entityUUID = it.first()
            String metaClassCode = entityUUID.split('\\$').first()
            if (!statusesDataGroupedByClassCode[metaClassCode])
            {
                statusesDataGroupedByClassCode[metaClassCode] =
                    workHandlerService.getStates(metaClassCode)
            }

            return (it as List).withIndex().collect { value, index ->
                if (index == statusAttributeIndex)
                {
                    value = statusesDataGroupedByClassCode[metaClassCode]?.find {
                        it.uuid == value
                    }?.title
                }
                return value
            }
        }
    }

    /**
     * Метод получения данных из БД по условию на равенство (attrEq == value)
     * @param source - источник
     * @param attrEq - код атрибута, по которому ведется поиск
     * @param value - значение по которому ведется поиск
     * @param attributes - список запрашиваемых атрибутов (колонок) для выборки
     * @param subjectUUID - уникальный идентификатор объекта, на карточке которого расположена диаграмма
     * @return выборка из БД
     */
    private List<List<String>> getListResultsForParent(Source source,
                                                       String attrEq,
                                                       String value,
                                                       List<String> attributes,
                                                       String subjectUUID)
    {
        ISelectClauseApi sc = api.selectClause
        String descriptor = substitutionCardObject(source.descriptor, subjectUUID)
        IApiCriteria criteria
        if (descriptor)
        {
            criteria =
                descriptor.with(api.listdata.&createListDescriptor)
                          .with(api.listdata.&createCriteria)
        }
        else
        {
            criteria = api.db.createCriteria().addSource(source.value.value)
        }
        attributes.each {
            criteria.addColumn(sc.property(it))
        }
        if (attrEq)
        {
            criteria.add(api.filters.attrValueEq(attrEq, value))
        }
        return api.db.query(criteria).setMaxResults(LIMIT_SIZE_QUERY_FROM_DB).list()
    }

    private String substitutionCardObject(String descriptor, String cardObjectUuid)
    {
        Closure<String> closure = { String json ->
            JsonSlurper slurper = new JsonSlurper()
            Map res = slurper.parseText(json) as Map<String, Object>
            res.put('cardObjectUuid', cardObjectUuid)
            return toJson(res)
        }
        return descriptor && cardObjectUuid ? closure(descriptor) : descriptor
    }

    /**
     * Метод получения работ в зависимости от наличия даты начала и окончания
     * @param request - тело запроса
     * @param user - пользователь
     * @return список работ
     */
    Collection<Map<String, Object>> getWorks(GetGanttWorks request, IUUIDIdentifiable user)
    {
        GanttSettingsService service = GanttSettingsService.instance
        GanttSettingsClass settings = service.getGanttSettings(request)
        GanttDiagramData data = new GanttDiagramData()
        addBasicListWork(settings, request, user, data)
        if (!request.worksWithoutStartOrEndDateCheckbox)
        {
            data.tasks = filterTasksWithNoDateRanges(data.tasks)
        }
        return data.tasks
    }

    /**
     * Приватный метод инициализации стандартных настроек цветов
     * @return список объектов класса EntityColorSettings
     */
    private static Collection<EntityColorSettings> initDefaultColors()
    {
        return [
            new EntityColorSettings("#000000", "WORK", "WORKCOLOR", "Цвет текста работ"),
            new EntityColorSettings("#3db9d3", "WORK", "WORKBACKGROUND", "Цвет полос работ"),
            new EntityColorSettings(
                "#000000",
                "RESOURCE",
                "RESOURCECOLOR",
                "Цвет текста ресурсов"
            ),
            new EntityColorSettings(
                "#65c16f",
                "RESOURCE",
                "RESOURCEBACKGROUND",
                "Цвет полос ресурсов"
            ),
            new EntityColorSettings(
                "#000000",
                "project",
                "PROJECTCOLOR",
                "Цвет текста проектов"
            ),
            new EntityColorSettings(
                "#ffd700",
                "project",
                "PROJECTBACKGROUND",
                "Цвет полос проектов"
            ),
            new EntityColorSettings(
                "#000000",
                "milestone",
                "MILESTONECOLOR",
                "Цвет текста вех"
            ),
            new EntityColorSettings(
                "#ffffff",
                "milestone",
                "MILESTONEBACKGROUND",
                "Цвет полос вех"
            )]
    }
}

/**
 * Класс, содержащий информацию о типе сущности и настройке цветов сущности
 */
@Canonical
class EntityColorSettings
{
    /**
     * Цвет текста сущности
     */
    String color

    /**
     * Цвет отображения сущности
     */
    String background

    /**
     * Тип сущности
     */
    String type

    /**
     * Идентификатор сущности
     */
    String id

    /**
     * Название сущности
     */
    String label
}