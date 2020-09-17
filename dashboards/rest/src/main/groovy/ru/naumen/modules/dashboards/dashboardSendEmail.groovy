/*! UTF-8 */
//Автор: nordclan
//Дата создания: 06.11.2019
//Код:
//Назначение:
/**
 * Бекенд для отправки email в встроенном приложении "Дашборды"
 */
//Версия: 4.10.0.15
//Категория: скриптовый модуль

package ru.naumen.modules.dashboards

import org.apache.poi.util.IOUtils
import javax.mail.util.ByteArrayDataSource
import static groovy.json.JsonOutput.toJson


//region REST-МЕТОДЫ
/**
 * Метод отправки сообщений на почту
 * @param tokenKey - ключ на файл в хранилище
 * @param format - формат файла
 * @return успех/провал
 */
String sendFileToMail(String tokenKey, String format)
{
    if (!user?.email)
    {
        utils.throwReadableException('User email is null or empty!')
    }
    def file = utils.uploadService.get(tokenKey)
    String title = file?.name
    def ds = new ByteArrayDataSource(file.inputStream, file.contentType)

    def message = api.mail.sender.createMail()
    message.addTo(user.title, user.email)
    message.setSubject(title) //установка темы сообщения
    message.addText("${title}. Файл с изображением дашборда находится во вложении.") //установка текста сообщения
    message.attachFile(ds, "${title}.${format}")
    return toJson(api.mail.sender.sendMail(message))
}
//endregion