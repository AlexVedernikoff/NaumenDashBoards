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

@Field @Lazy @Delegate GanttDataSetController ganttDataSet = new GanttDataSetImpl()
interface GanttDataSetController
{
    /**
     * Метод получения данных для построения диаграммы Ганта.
     * @param request - тело запроса [subjectUUID:..., contentCode: ...]
     * @return данные для построения диаграммы Ганта.
     */
    String getGanttDiagramData(Map<String, String> requestData)
}

@InheritConstructors
class GanttDataSetImpl implements GanttDataSetController
{
    GanttDataSetService service = GanttDataSetService.instance

    @Override
    String getGanttDiagramData(Map<String, String> requestContent)
    {
        GetGanttSettingsRequest request = new ObjectMapper().convertValue(requestContent, GetGanttSettingsRequest)
        return toJson(service.getGanttDiagramData(request))
    }
}

@InjectApi
@Singleton
class GanttDataSetService
{
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
     * @return данные для построения диаграммы Ганта
     */
    GanttDiagramData getGanttDiagramData(GetGanttSettingsRequest request)
    {
        // Получение настроек диаграммы из хранилища.
        GanttSettingsService service = GanttSettingsService.instance
        GanttSettingsClass settings = service.getGanttSettings(request)

        def data = new GanttDiagramData()
        data.commonSettings = settings.commonSettings
        data.diagramKey = settings.diagramKey
        if (!(settings?.resourceAndWorkSettings))
        {
            data.tasks = []
        }
        else
        {
            data.tasks = buildDataListFromSettings(settings.resourceAndWorkSettings, null)
        }
        return data
    }

    /**
     * Метод получения данных для построения диаграммы Ганта, вызывается рекурсивно
     * @param settings - иерархический список настроек
     * @param parentUUID - уникальный идентификатор записи в БД о родителе
     * @return список Map<String, String> параметров для построения диаграммы
     */
    private List<Map<String, String>> buildDataListFromSettings(List<ResourceAndWorkSettings> settingsList, String parentUUID)
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
        Closure prepare = { (it?.type in AttributeType.LINK_TYPES) ? ("${it.code}.title") : it.code }

        def result = []

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
            Map<String, String> mapAttributes = ['id':'UUID', 'text':'title']

            Collection<AttributeSettings> attributesList = settings.attributeSettings
            mapAttributes << attributesList.collectEntries { [(it.code) : prepare(it.attribute)] }
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
            List<List<String>> res = getListResultsForParent(source, mapAttributes['parent'], parentUUID?.takeWhile {it != '_'}, listAttributes)
            if (res)
            {
                /* Из БД пришел набор данных. Необходимо задать правильное соответствие между названием
                   поля и значением, пришедшим из БД. Это необходимо, если технолог задал одинаковые атрибуты
                   в разных полях формы (в этом случае при простом сопоставлении получим сдвиг). Для этого
                   строим словарь-соответствие между наименованиями полей (id, text... и тд.) и номером
                   столбца набора данных, пришедшего из БД (0..n). */
                Map<String, Integer> mapAttributesIndexes = [:]
                mapAttributes.each {key, value ->
                    Integer ind = listAttributes.indexOf(value)
                    mapAttributesIndexes.put(key, ind)
                }

                // Преобразование в список из словарей (добавление к значениям, полученным из БД, ключей).
                List<Map<String, String>> resMap = []
                res.each { item ->
                    Map<String, String> itemMap = mapAttributesIndexes.collectEntries { key, value -> [(key) : item[value]] }
                    itemMap.id += "_${UUID.randomUUID()}" //добавление уникальности уникальному идентификатору в системе - объект может прийти дважды

                    if(itemMap.parent)
                    {
                        itemMap.parent = parentUUID//добавление уникальности уникальному идентификатору в системе - объект может прийти дважды
                    }

                    resMap.add(itemMap)
                }

                // Добавление данных, общих для списка.
                resMap.each {
                    it << ['level' : settings.level]
                    it << ['type' : settings.type]
                    if (settings.type == SourceType.WORK)
                    {
                        if (!isStartDate)
                        {
                            it << ['start_date' : null]
                        }
                        if (!isEndDate)
                        {
                            it << ['end_date' : null]
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
                        result.addAll(buildDataListFromSettings(settingsList[(i + 1)..-1], it['id']))
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
     * Метод получения данных из БД по условию на равенство (attrEq == value)
     * @param source - источник
     * @param paramEq - код атрибута, по которому ведется поиск
     * @param value - значение по которому ведется поиск
     * @param attributes - список запрашиваемых атрибутов (колонок) для выборки
     * @return выборка из БД
     */
    private List<List<String>> getListResultsForParent(Source source, String attrEq, String value, List<String> attributes)
    {
        def sc = api.selectClause
        def criteria
        if (source.descriptor)
        {
            criteria = source.descriptor.with(api.listdata.&createListDescriptor).with(api.listdata.&createCriteria)
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