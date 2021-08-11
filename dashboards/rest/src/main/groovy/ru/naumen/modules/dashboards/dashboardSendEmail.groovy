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

import javax.mail.util.ByteArrayDataSource
import ru.naumen.core.server.script.api.injection.InjectApi
import groovy.transform.Field
import static MessageProvider.*
import static CurrentUserHolder.*

@Field @Lazy @Delegate DashboardSendEmail dashboardSendEmail = new DashboardSendEmailImpl()

/**
 * Интерфейс главного контроллера
 */
interface DashboardSendEmail
{
    /**
     * Метод отправки сообщений на почту
     * @param tokenKey - ключ на файл в хранилище
     * @param format - формат файла
     * @param fileName - название файла
     * @param users - список пользователей
     */
    void sendFileToMail(String tokenKey, String format, String fileName, List users)
}

class DashboardSendEmailImpl extends BaseController implements DashboardSendEmail
{
    DashboardSendEmailService service = DashboardSendEmailService.instance

    @Override
    void sendFileToMail(String tokenKey, String format, String fileName, List users)
    {
        service.sendFileToMail(tokenKey, format, fileName, users)
    }
}

@InjectApi
@Singleton
class DashboardSendEmailService
{
    MessageProvider messageProvider = MessageProvider.instance
    /**
     * Метод отправки сообщений на почту
     * @param tokenKey - ключ на файл в хранилище
     * @param format - формат файла
     * @param fileName - название файла
     * @param users - список пользователей
     */
    void sendFileToMail(String tokenKey, String format, String fileName, List users)
    {
        users.each {user ->
            if (!user?.email)
            {
                String locale = DashboardUtils.getUserLocale(CurrentUserHolder.currentUser.get()?.UUID)
                String message = messageProvider.getConstant(USER_EMAIL_IS_NULL_OR_EMPTY_ERROR, locale)
                api.utils.throwReadableException("$message#${USER_EMAIL_IS_NULL_OR_EMPTY_ERROR}")
            }
            def file = beanFactory.getBean('uploadServiceImpl').get(tokenKey)
            def ds = new ByteArrayDataSource(file.inputStream, file.contentType)

            def message = api.mail.sender.createMail()
            message.addTo(user.title ?: api.metainfo.getMetaClass('employee').title, user.email)
            message.setSubject(fileName) //установка темы сообщения
            message.addText("${fileName}. Файл с изображением дашборда находится во вложении.") //установка текста сообщения
            message.attachFile(ds, "${fileName}.${format}")
            api.mail.sender.sendMail(message)
        }
    }
}