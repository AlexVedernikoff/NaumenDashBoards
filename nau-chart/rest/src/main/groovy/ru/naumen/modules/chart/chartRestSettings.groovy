//Автор: Tkacen-ko
//Дата создания: 04.08.2022
//Код: chartRestSettings
//Назначение:
/**
 * Лицензионный скриптовый модуль встроенного приложения "Chart".
 *
 * Содержит служебные методы для получения данных ВП Chart
 */
//Версия: 1.0

package ru.naumen.modules.chart

import com.fasterxml.jackson.databind.ObjectMapper
import com.google.gson.internal.LinkedTreeMap
import groovy.transform.Field
import groovy.transform.InheritConstructors
import ru.naumen.core.server.script.api.injection.InjectApi
import static com.amazonaws.util.json.Jackson.toJsonString as toJson

@Field @Lazy @Delegate Chart chartConfig = new ChartImpl()

interface Chart
{
    /**
     * Метод для получения данных об объектах для вывода на cхему
     * @param objectUuid - uuid текущего объекта
     * @param contentUuid - uuid карточки объекта
     * @param userUuid - информация о текущем пользователе
     * @return данные для схемы в json формате
     */
    String getSchemeData(String objectUuid, String contentUuid, LinkedTreeMap userUuid)

    /**
     * Метод для выполнения поиска объектов на стенде по совпадению в строке
     * @param stringForFindingMatches - строка для выполнения поиска
     * @return список объектов содержащих переданную строку
     */
    String getUuidObjects(String stringForFindingMatches)
}

@InheritConstructors
class ChartImpl implements Chart
{
    ChartService service = ChartService.instance

    @Override
    String getSchemeData(String objectUuid, String contentUuid, LinkedTreeMap userUuid = null)
    {
        return new ObjectMapper()
            .writeValueAsString(service.getSchemeData(objectUuid, contentUuid, userUuid))
    }

    @Override
    String getUuidObjects(String stringForFindingMatches)
    {
        return new ObjectMapper()
            .writeValueAsString(service.getUuidObjects(stringForFindingMatches))
    }
}

@InjectApi
@Singleton
class ChartService
{
    /**
     * Метод для получения данных об объектах для вывода на cхему
     * @param objectUuid - uuid текущего объекта
     * @param contentUuid - uuid карточки объекта
     * @param userUuid - информация о текущем пользователе
     * @return данные для схемы в json формате
     */
    LinkedHashMap getSchemeData(String objectUuid,
                                String contentUuid,
                                LinkedTreeMap userUuid = null)
    {
        Collection<LinkedHashMap> defaultValue = []
        LinkedHashMap aggregations = []
        Object subjectObject = api.utils.get(objectUuid)
        Object userObject = userUuid['admin'] ?: api.utils.get(userUuid['uuid'])
        contentUuid = "${ api.utils.get(objectUuid).getMetainfo() }_${ contentUuid }".toString()
        LinkedHashMap<String, Object> bindings = userUuid['admin'] ? ['subject': subjectObject] :
            ['subject': subjectObject, 'user': userObject]
        try
        {
            Collection<Collection<ElementChart>> getData =
                new Charts().getDataDisplayScheme(contentUuid, bindings) ?: defaultValue
            aggregations = [entities: getData]
        }
        catch (Exception ex)
        {
            logger.error("#schemeRestSettings> ${ ex.message }", ex)
        }
        return aggregations
    }

    /**
     * Метод для выполнения поиска объектов на стенде по совпадению в строке
     * @param stringForFindingMatches - строка для выполнения поиска
     * @return список объектов содержащих переданную строку
     */
    Collection getUuidObjects(String stringForFindingMatches)
    {
        return api.fts.simpleSearch(stringForFindingMatches, "all", 999)
    }
}
