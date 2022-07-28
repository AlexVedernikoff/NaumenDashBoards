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
import groovy.transform.Field
import groovy.transform.InheritConstructors
import ru.naumen.core.server.script.api.injection.InjectApi
import static groovy.json.JsonOutput.toJson
import ru.naumen.core.shared.IUUIDIdentifiable
import ru.naumen.core.shared.dto.ISDtObject

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
        return toJson(service.getGanttVersionDiagramData(requestData.versionKey, user, requestData.timezone))
    }
}

@InjectApi
@Singleton
class GanttDataSetService
{
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
        GanttSettingsClass settings = service.getGanttSettings(request)

        def data = new GanttDiagramData()
        data.commonSettings = settings.commonSettings
        data.diagramKey = settings.diagramKey
        data.workRelations = settings.workRelations
        data.workRelationCheckbox = settings.workRelationCheckbox
        data.progressCheckbox = settings.progressCheckbox
        data.currentInterval = settings.currentInterval

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
            data.tasks = buildDataListFromSettings(settings.resourceAndWorkSettings, null)
            def timezone =
                TimeZone.getTimeZone(
                    api.employee.getPersonalSettings(user?.UUID).getTimeZone() ?: request.timezone
                )
            def workAttributeSettings = settings.resourceAndWorkSettings.find {
                it.startWorkAttribute && it.endWorkAttribute
            }
            data.tasks.each {
                formatWorkDates(it, workAttributeSettings, timezone)
                setWorkTypeToProjectIfItHasChildren(it, data.tasks)
                setWorkProgress(it, settings)
                setColumnDateFormats(it, timezone)
            }
            data.tasks = filterTasksWithNoDateRanges(data.tasks)
        }
        return data
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
        GanttVersionsSettingsClass ganttVersionsSettings = service.getGanttVersionsSettings(versionKey)
        GanttDiagramData data = new GanttDiagramData()

        data.commonSettings = ganttVersionsSettings.ganttSettings.commonSettings
        data.diagramKey = ganttVersionsSettings.ganttSettings.diagramKey
        data.workRelations = ganttVersionsSettings.ganttSettings.workRelations
        data.workRelationCheckbox = ganttVersionsSettings.ganttSettings.workRelationCheckbox
        data.progressCheckbox = ganttVersionsSettings.ganttSettings.progressCheckbox

        if (ganttVersionsSettings.ganttSettings.startDate && ganttVersionsSettings.ganttSettings.endDate)
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
            data.tasks = generateTasksForDiagramVersion(ganttVersionsSettings)
            TimeZone timeZone =
                TimeZone.getTimeZone(
                    api.employee.getPersonalSettings(user?.UUID).getTimeZone() ?: timezone
                )
            ResourceAndWorkSettings workAttributeSettings =
                ganttVersionsSettings.ganttSettings.resourceAndWorkSettings.find {
                    it.startWorkAttribute && it.endWorkAttribute
                }

            data.tasks.each {
                formatWorkDates(it, workAttributeSettings, timeZone)
                setWorkTypeToProjectIfItHasChildren(it, data.tasks)
                setWorkProgressVersion(it, ganttVersionsSettings)
                setColumnDateFormats(it, timeZone)
            }
            data.tasks = filterTasksWithNoDateRanges(data.tasks)
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
            if (!startAndEndDateExist &&
                it.type == SourceType.WORK || it.type == SourceType.RESOURCE)
            {
                return null
            }
            else
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
                task.parent = entity.parent
                task.level = entity.sourceType as SourceType == SourceType.RESOURCE ? 0 : 1
                task.type = entity.sourceType
                mapAttributes.keySet().each { fieldCode ->
                    task[fieldCode] =
                        getAttributeValueForVersionEntity(entity, mapAttributes[fieldCode])
                    if (task[fieldCode] && fieldCode in ['start_date', 'end_date'] && !(task[fieldCode] in Date))
                    {
                        task[fieldCode] = new Date(task[fieldCode])
                    }
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
     * @return значение атрибута
     */
    private Object getAttributeValueForVersionEntity(DiagramEntity entity, String attributeCode)
    {
        Object value = null
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
                    if (value in ISDtObject)
                    {
                        value = value.UUID
                    }
                }
            }
        }

        return value
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
                workToMerge[key] = value.format("dd.MM.yyyy, HH:mm:ss", timezone)
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
            if (workAttributeSettings?.startWorkAttribute?.type == 'date')
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
     * @param settings - иерархический список настроек
     * @param parentUUID - уникальный идентификатор записи в БД о родителе
     * @param versionKey - ключ версии диаграммы
     * @return список Map<String, String> параметров для построения диаграммы
     */
    private List<Map<String, String>> buildDataListFromSettings(Collection<ResourceAndWorkSettings> settingsList,
                                                                String parentUUID)
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
            'код_поля_формы_0' : значение из БД по коду атрибута 0 .....
            'код_поля_формы_n' : значение из БД по коду атрибута n,
            'parent' : значение из БД по коду атрибута для связи,
            'start_date' : значение из БД по коду атрибута начала работы (для работ),
            'end_date' : значение из БД по коду атрибута окончания работы (для работ),
            'level' : уровень_вложенности,
            'type' : RESOURSE/WORK
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
            boolean isStartDate, isEndDate
            if (settings.type == SourceType.WORK)
            {
                isStartDate = settings.startWorkAttribute
                isEndDate = settings.endWorkAttribute
                if (isStartDate)
                {
                    mapAttributes.put('start_date', prepare(settings.startWorkAttribute))
                }
                if (isEndDate)
                {
                    mapAttributes.put('end_date', prepare(settings.endWorkAttribute))
                }
            }

            Source source = settings.source
            // Так как из БД нельзя получить повторяющиеся колонки, то имена атрибутов делаем уникальными.
            List<String> listAttributes = mapAttributes.values().toList().unique()
            List<List<String>> res = getListResultsForParent(
                source, mapAttributes['parent'], parentUUID?.takeWhile {
                it != '_'
            }, listAttributes
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
                            return [(key): updateIfMetaClass(item[valueMap.ind], valueMap.attr)]
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
                    if (settings.type == SourceType.WORK)
                    {
                        if (!isStartDate)
                        {
                            it << ['start_date': null]
                        }
                        if (!isEndDate)
                        {
                            it << ['end_date': null]
                        }
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
                            buildDataListFromSettings(settingsList[(i + 1)..-1], it['id'])
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
     * @return выборка из БД
     */
    private List<List<String>> getListResultsForParent(Source source,
                                                       String attrEq,
                                                       String value,
                                                       List<String> attributes)
    {
        def sc = api.selectClause
        def criteria
        if (source.descriptor)
        {
            criteria =
                source.descriptor.with(api.listdata.&createListDescriptor)
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
}