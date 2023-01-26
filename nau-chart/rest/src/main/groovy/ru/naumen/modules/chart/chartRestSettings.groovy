//Автор: Tkacen-ko
//Дата создания: 04.08.2022
//Код: schemeRestSettings
//Назначение:
/**
 * Лицензионный скриптовый модуль встроенного приложения "Schemes".
 *
 * Содержит служебные методы для получения данных ВП Scheme
 */
//Версия: 1.0

package ru.naumen.modules.chart

import static com.amazonaws.util.json.Jackson.toJsonString as toJson
import com.fasterxml.jackson.databind.ObjectMapper
import com.google.gson.internal.LinkedTreeMap

/**
 * Метод для получения данных об объектах для вывода на cхему
 * @param objectUuid - uuid текущего объекта
 * @param contentUuid - uuid карточки объекта
 * @param userUuid - информация о текущем пользователе
 * @return данные для схемы в json формате
 */
private String getSchemeData(String objectUuid, String contentUuid, LinkedTreeMap userUuid = null)
{
    Collection<LinkedHashMap> defaultValue = []
    LinkedHashMap aggregations = []
    Object subjectObject = api.utils.get(objectUuid)
    Object userObject = userUuid['admin'] ?: api.utils.get(userUuid['uuid'])
    contentUuid = "${api.utils.get(objectUuid).getMetainfo()}_${contentUuid}".toString()
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
    return new ObjectMapper().writeValueAsString(aggregations)
}

/**
 * Метод для выполнения поиска объектов на стенде по совпадению в строке
 * @param stringForFindingMatches - строка для выполнения поиска
 * @return список объектов содержащих переданную строку
 */
String getUuidObjects(String stringForFindingMatches)
{
    return new ObjectMapper()
        .writeValueAsString(api.fts.simpleSearch(stringForFindingMatches, "all", 999))
}