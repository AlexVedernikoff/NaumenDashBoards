package ru.naumen.modules.dashboards

import com.amazonaws.util.json.Jackson
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Spy
import org.mockito.junit.jupiter.MockitoExtension
import ru.naumen.core.shared.IUUIDIdentifiable
import ru.naumen.modules.dashboards.utils.ApiDependedUnitTest

import java.text.DecimalFormat
import java.text.DecimalFormatSymbols

import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.doReturn
import static org.mockito.Mockito.when

/**
 * <p>Тестирование методов модуля DashboardDataSet.</p>
 *
 * <p><b>Ссылки на задачи:</b></p>
 *
 * <ol>
 *     <li>
 *         <a href="https://naupp.naumen.ru/sd/operator/#uuid:projectTasks$140161710" target="_blank">
 *            SMRMEXT-12792 АТ: разработка юнит тестов на бэк
 *         </a>
 *    </li>
 * </ol>
 *
 *<p><b>Подготовка:</b></p>
 *
 * <ol>
 *     <li>при работе метода dashboardQueryWrapperUtils.getData будет возвращен заранее подготовленный результат - список списков данных ожидаемого формата;</li>
 *     <li>при работе метода countDistinct будет возвращен результат 29 для непревышения границ по параметру/разбивке в таблице;</li>
 *     <li>при работе метода formatGroupSet будет возвращать заранее подготовленный результат в случае, если в пришедшем датасете есть данные по статусам.</li>
 * </ol>
 *
 * <p><b>Действия и проверки:</b></p>
 *
 * <ol>
 *     <li>testGetDataForCompositeDiagram - метод buildDiagram - проверка списка лейблов на диаграмме на соответствие ожидаемому результату;</li>
 *     <li>testGetDataForCompositeDiagramWithBreakdown - метод buildDiagram - проверка данных по показателю на диаграмме на соответствие ожидаемому результату при наличии разбивки;</li>
 *     <li>testGetDataForCompositeDiagramWithCalculationAndBreakdown - метод buildDiagram -
 *     проверка данных по показателю на диаграмме на соответствие ожидаемому результату при наличии разбивки и вычислений (что вычисление применилось);</li>
 *
 *     <li>testGetDataForCompositeDiagramWithCalculation - метод buildDiagram -
 *     проверка данных по показателю на диаграмме на соответствие ожидаемому результату при наличии вычислений (что вычисление применилось);</li>
 *
 *     <li>testGetDataForTableDiagram - метод buildDiagram - проверка данных по параметру в таблице на соответствие ожидаемому результату;</li>
 *
 *     <li>testGetDataForTableDiagramWithCalculation - метод buildDiagram -
 *     проверка данных по показателю в таблице на соответствие ожидаемому результату при наличии вычислений  (что вычисление применилось);</li>
 *
 *     <li>testGetDataForTableDiagramWithCalculationAndBreakdown - метод buildDiagram -
 *     проверка данных по показателю в таблице на соответствие ожидаемому результату при наличии разбивки и вычислений (что вычисление применилось);</li>
 *
 *     <li>testGetDataForTableDiagramWithBreakdown - метод buildDiagram - проверка данных по показателю в таблице на соответствие ожидаемому результату при наличии разбивки.</li>
 * </ol>
 */

@ExtendWith(MockitoExtension)
class DashboardDataSetTest extends ApiDependedUnitTest
{
    @Spy
    @InjectMocks
    private final DashboardSettingsService dashboardSettingsService
    @Spy
    @InjectMocks
    private final DashboardDataSetService service

    private static final DecimalFormat DECIMAL_FORMAT = new DecimalFormatSymbols().with {
        setDecimalSeparator('.' as char)
        new DecimalFormat("#.##", it)
    }

    /**
     * проверка списка лейблов на диаграмме на соответствие ожидаемому результату при запросе по обычной диаграмме
     */
    @Test
    void testGetDataForCompositeDiagram()
    {
        service.dashboardSettingsService = dashboardSettingsService
        String dashboardKey = 'root_testContentCode'
        String widgetKey = 'root_testOtnositelnyhKriteriev_77d5d640-dcc1-47ab-bc5c-25ac8e765eee'
        String cardObjectUuid = 'root$401'
        String subjectUUID = cardObjectUuid
        DiagramType diagramType = DiagramType.COLUMN
        Map<String, Object> otherSettings = [offsetUTCMinutes: 240, widgetFilters: []]
        IUUIDIdentifiable user
        def (widgetFilters, offsetUTCMinutes) = [otherSettings.widgetFilters,
                                                 otherSettings.offsetUTCMinutes]

        URL fileUrl = getClass().getClassLoader().getResource('testGetDataForCompositeDiagramStorage.json')
        File file = new File(fileUrl.toURI())
        String storage = file.text
        DashboardSettingsClass testDashboardSettings = Jackson.fromJsonString(storage, DashboardSettingsClass)
        doReturn(testDashboardSettings).when(dashboardSettingsService).getDashboardSetting(dashboardKey, true)

        List<List> result = [['24038', '1С#service$1413205'], ['2922', 'AVEVA#service$1577104'], ['290', 'Capital Project#service$1577101'], ['601', 'Internet and WiFi#service$26958'], ['116', 'KY serv#service$45416401'], ['16', 'LIMS#service$1413208'], ['105', 'MES#service$1413207'], ['120', 'Naumen Service Desk#service$13150402'], ['3', 'SAP#service$1317704'], ['14', 'test#service$13150406'], ['16', 'VisitorControl#service$1577111'], ['58', 'WMS Solvo#service$1577108'], ['1', 'WMS#service$1577106'], ['7', '[New] тест услуга головного#service$41766207'], ['3', 'Актуализация справочника для внешнего call-центра#service$1808471'], ['3', 'АСТУЭ#service$1577105'], ['45', 'АСУ ТОиР#service$2109901'], ['6', 'База знаний ВКУС#service$10854701'], ['10', 'База знаний портала ВКУС#service$26944'], ['20', 'Банк-клиент#service$1577113'], ['5', 'БОСС-кадровик#service$1577102'], ['3827', 'ВКС/АКС, коллективные мероприятия#service$1413201'], ['13', 'Внешнеэкономическая деятельность#service$24370002'], ['4', 'Горячая линия промышленной безопасности#service$1808493'], ['5', 'Доработки систем (ЗнИ)/Проекты#service$1577121'], ['5250', 'Доступ к корп.системам и ресурсам#service$1577120'], ['40', 'ИСУП#service$2109902'], ['3417', 'КИС ЕСМ#service$1413206'], ['1', 'Клининг#service$17173501'], ['22', 'Компьютер, периферийное оборудование, программное обеспечение#service$10742801'], ['14961', 'Компьютер, периферийное оборудование, программное обеспечение#service$1117401'], ['13', 'Консультации ИБ#service$7672801'], ['616', 'Контактные данные#service$2109903'], ['205', 'Корпоративный портал СИБУР#service$26945'], ['6', 'Обслуживание абонентского оборудования доступа к сетям передачи данных и Интернет#service$1808482'], ['3', 'ОПОРА#service$1577103'], ['2', 'Организация командировок#service$20504901'], ['24', 'Отчеты на базе QlikView#service$1317709'], ['2879', 'Печать и сканирование#service$26938'], ['263', 'Портал ВКУС#service$1317708'], ['12', 'Программное обеспечение "Питание"#service$1577110'], ['1', 'Программное обеспечение Тренажер#service$1577119'], ['1', 'Прочее#service$1810102'], ['701', 'Прочее#service$26933'], ['1', 'Прочие услуги-базовые сервисы#service$1806837'], ['7', 'ПУ2 тестирование переклассификации#service$19005003'], ['27', 'Система SM "Замещения"#service$62157501'], ['17', 'Система SM#service$59157405'], ['198', 'Система управления проектами (JIRA)#service$1577107'], ['22', 'СЭД ЗапСиб-2#service$1577112'], ['179', 'Телефоны и связь#service$26963'], ['380', 'Тест MZ#service$30676401'], ['2', 'тест иерархии услуг#service$35241904'], ['3497', 'ТЕСТ Пользовательская услуга АРМ#service$1602603'], ['61', 'Тест услуга BPM#service$13150403'], ['4', 'тест услуга головного правила#service$41638901'], ['51', 'Тестовая услуга с динамическими полями#service$41766202'], ['3', 'Тестовая услуга ТЕА#service$96262501'], ['49', 'Тестовая услуга#service$20533601'], ['3', 'Техническая поддержка Aveva#service$1808415'], ['48', 'Техническая поддержка Skype for Business#service$1317711'], ['5', 'Техническая поддержка внутреннего Web-портала#service$1806816'], ['17', 'Техническая поддержка решения на платформе 1С#service$1804916'], ['2', 'Техническая поддержка Системы 1#service$28255'], ['10', 'Техническая поддержка системы SM#service$59157402'], ['1', 'Техническая поддержка системы аналитической отчетности на платформе QlikView (АГПЗ)#service$1810101'], ['5', 'Техподдержка NSD#service$13150404'], ['24', 'Транспорт#service$34535701'], ['6', 'ТУ1 тестирование переклассификации#service$19005002'], ['4', 'ТУ2 Тестирование переклассификации#service$19005004'], ['35', 'Управление услугами и процессами#service$1117407'], ['2', 'Услуга TAE#service$43752501'], ['67', 'Услуга Сакаевой (с согласованием)#service$59157407'], ['73', 'Услуга Сакаевой#service$48808001'], ['12', 'Услуга со всеми дин атрибутами#service$80740501'], ['10', 'Услуги сопровождения баз данных абонентов мобильной связи#service$1811716'], ['2', 'Услуги сопровождения баз данных сервисных запросов#service$1810188'], ['555', 'Услуги установки, тестирования и сопровождения программных средств АРМ#service$1810185'], ['43', 'Услуги установки, тестирования и сопровождения программных средств и баз данных КИС 1С: УПП ШР#service$1810189'], ['10', 'Услуги установки, тестирования и сопровождения программных средств и баз данных КИС CapitalProject#service$1811737'], ['1', 'Услуги установки, тестирования и сопровождения программных средств и баз данных КИС LIMS#service$1811703'], ['5', 'Услуги установки, тестирования и сопровождения программных средств и баз данных КИС MES#service$1811704'], ['1', 'Услуги установки, тестирования и сопровождения программных средств и баз данных КИС БОСС-Кадровик#service$1810194'], ['6', 'Услуги установки, тестирования и сопровождения программных средств и баз данных КИС ЕСМ#service$1810199'], ['15', 'Услуги установки, тестирования и сопровождения программных средств и баз данных КИС ЕСУИД#service$1810187'], ['13', 'Услуги установки, тестирования и сопровождения программных средств и баз данных локальных ИС#service$1811720'], ['2', 'Услуги эксплуатации и технической поддержки программно-аппаратных комплексов компьютерных систем фиксированной телефонной связи#service$1811731'], ['917', 'Учетная запись и пароль#service$1413204'], ['18', 'Учетная запись и пароль#service$20533604'], ['19', 'Учетная запись и пароль#service$9031802'], ['217', 'Фото#service$2109904'], ['49', 'Электронная подпись (ЭП)#service$1413203'], ['1554', 'Электронная почта/Email#service$1413202']]

        List expectedLabels = result*.get(1)

        when(service.dashboardQueryWrapperUtils.getData(any(), any(), any(), eq(true), eq(DiagramType.COLUMN), eq(false), any(), any())).thenReturn(result)

        StandardDiagram diagram = service.buildDiagram(dashboardKey, widgetKey, cardObjectUuid,
                                                       widgetFilters, offsetUTCMinutes, user)
        assert expectedLabels == diagram.labels
    }

    /**
     *  проверка данных по показателю на диаграмме на соответствие ожидаемому результату при запросе по обычной диаграмме и наличии в ней разбивки
     */
    @Test
    void testGetDataForCompositeDiagramWithBreakdown()
    {
        service.dashboardSettingsService = dashboardSettingsService
        String dashboardKey = 'root_testContentCode'
        String widgetKey = 'root_testContentCode_ef12c856-aef1-4a9b-9dd7-7a6b545cdaa8'
        String cardObjectUuid = 'root$401'
        String subjectUUID = cardObjectUuid
        DiagramType diagramType = DiagramType.COLUMN
        Map<String, Object> otherSettings = [offsetUTCMinutes: 240, widgetFilters: []]
        IUUIDIdentifiable user
        def (widgetFilters, offsetUTCMinutes) = [otherSettings.widgetFilters,
                                                 otherSettings.offsetUTCMinutes]

        URL fileUrl = getClass().getClassLoader().getResource('testGetDataForCompositeDiagramWithBreakdownStorage.json')
        File file = new File(fileUrl.toURI())
        String storage = file.text
        DashboardSettingsClass testDashboardSettings = Jackson.fromJsonString(storage, DashboardSettingsClass)
        doReturn(testDashboardSettings).when(dashboardSettingsService).getDashboardSetting(dashboardKey, true)

        List result = [[123, '1С#service$1413205', 'Закрыт#closed'], [7, '1С#service$1413205', 'Закрыт#closed'], [1, '1С#service$1413205', 'На переклассификации#initialSupport'], [5, '1С#service$1413205', 'Зарегистрирован#registered'], [14, '1С#service$1413205', 'В работе 2 линии#secondLine'], [1, '1С#service$1413205', 'Ожидает 1 линии#waitfirstLine'], [33, '1С#service$1413205', 'Ожидает 1 линии#waitfirstLine'], [1, '1С#service$1413205', 'В ожидании 4 линии#waitFourthLine'], [291, '1С#service$1413205', 'Закрыт#closed'], [23244, '1С#service$1413205', 'Закрыт#closed'], [3, '1С#service$1413205', 'Зарегистрирован#registered'], [257, '1С#service$1413205', 'Зарегистрирован#registered'], [1, '1С#service$1413205', 'Ожидает подтверждения#resolved'], [5, '1С#service$1413205', 'В работе 2 линии#secondLine'], [8, '1С#service$1413205', 'В работе 2 линии#secondLine'], [7, '1С#service$1413205', 'Ожидает 1 линии#waitfirstLine'], [18, '1С#service$1413205', 'Ожидает 1 линии#waitfirstLine'], [1, 'test#service$13150406', 'В работе 2 линии#secondLine'], [1, 'test#service$13150406', 'В работе 2 линии#secondLine'], [1, 'Актуализация справочника для внешнего call-центра#service$1808471', 'Закрыт#closed']]
        List expectedResult = [["23665", '1С#service$1413205', "Закрыт#closed"], ["1", '1С#service$1413205', "На переклассификации#initialSupport"], ["265", '1С#service$1413205', "Зарегистрирован#registered"], ["27", '1С#service$1413205', "В работе 2 линии#secondLine"], ["59", '1С#service$1413205', "Ожидает 1 линии#waitfirstLine"], ["1", '1С#service$1413205', "В ожидании 4 линии#waitFourthLine"], ["1", '1С#service$1413205', "Ожидает подтверждения#resolved"], ["2", 'test#service$13150406', "В работе 2 линии#secondLine"], ["1", 'Актуализация справочника для внешнего call-центра#service$1808471', "Закрыт#closed"]]
        List expectedSeries = expectedResult*.get(0)

        when(service.dashboardQueryWrapperUtils.getData(any(), any(), any(), eq(true), eq(DiagramType.COLUMN), eq(false), any(), any())).thenReturn(result)
        doReturn(result).when(service).formatGroupSet(anyList(), any(), anyList(), any())
        StandardDiagram diagram = service.buildDiagram(dashboardKey, widgetKey, cardObjectUuid,
                                                       widgetFilters, offsetUTCMinutes, user)
        assert diagram.series.data.flatten().findAll { it instanceof  String} - expectedSeries == []
    }

    /**
     * ппроверка данных по показателю на диаграмме на соответствие ожидаемому результату при запросе по обычной диаграмме и наличии в ней разбивки и вычислений
     */
    @Test
    void testGetDataForCompositeDiagramWithCalculationAndBreakdown()
    {
        service.dashboardSettingsService = dashboardSettingsService
        String dashboardKey = 'root_testContentCode'
        String widgetKey = 'root_testContentCode_ef12c856-aef1-4a9b-9dd7-7a6b545cdaa8'
        String cardObjectUuid = 'root$401'
        String subjectUUID = cardObjectUuid
        DiagramType diagramType = DiagramType.COLUMN
        Map<String, Object> otherSettings = [offsetUTCMinutes: 240, widgetFilters: []]
        IUUIDIdentifiable user
        def (widgetFilters, offsetUTCMinutes) = [otherSettings.widgetFilters,
                                                 otherSettings.offsetUTCMinutes]

        URL fileUrl = getClass().getClassLoader().getResource('testGetDataForCompositeDiagramWithBreakdownAndCalculationStorage.json')
        File file = new File(fileUrl.toURI())
        String storage = file.text
        DashboardSettingsClass testDashboardSettings = Jackson.fromJsonString(storage, DashboardSettingsClass)
        doReturn(testDashboardSettings).when(dashboardSettingsService).getDashboardSetting(dashboardKey, true)

        List result = [[123, '1С#service$1413205', 'Закрыт#closed'], [7, '1С#service$1413205', 'Закрыт#closed'], [1, '1С#service$1413205', 'На переклассификации#initialSupport'], [5, '1С#service$1413205', 'Зарегистрирован#registered'], [14, '1С#service$1413205', 'В работе 2 линии#secondLine'], [1, '1С#service$1413205', 'Ожидает 1 линии#waitfirstLine'], [33, '1С#service$1413205', 'Ожидает 1 линии#waitfirstLine'], [1, '1С#service$1413205', 'В ожидании 4 линии#waitFourthLine'], [291, '1С#service$1413205', 'Закрыт#closed'], [23244, '1С#service$1413205', 'Закрыт#closed'], [3, '1С#service$1413205', 'Зарегистрирован#registered'], [257, '1С#service$1413205', 'Зарегистрирован#registered'], [1, '1С#service$1413205', 'Ожидает подтверждения#resolved'], [5, '1С#service$1413205', 'В работе 2 линии#secondLine'], [8, '1С#service$1413205', 'В работе 2 линии#secondLine'], [7, '1С#service$1413205', 'Ожидает 1 линии#waitfirstLine'], [18, '1С#service$1413205', 'Ожидает 1 линии#waitfirstLine'], [1, 'test#service$13150406', 'В работе 2 линии#secondLine'], [1, 'test#service$13150406', 'В работе 2 линии#secondLine'], [1, 'Актуализация справочника для внешнего call-центра#service$1808471', 'Закрыт#closed']]
        List expectedResult = [["23665", '1С#service$1413205', "Закрыт#closed"], ["1", '1С#service$1413205', "На переклассификации#initialSupport"], ["265", '1С#service$1413205', "Зарегистрирован#registered"], ["27", '1С#service$1413205', "В работе 2 линии#secondLine"], ["59", '1С#service$1413205', "Ожидает 1 линии#waitfirstLine"], ["1", '1С#service$1413205', "В ожидании 4 линии#waitFourthLine"], ["1", '1С#service$1413205', "Ожидает подтверждения#resolved"], ["2", 'test#service$13150406', "В работе 2 линии#secondLine"], ["1", 'Актуализация справочника для внешнего call-центра#service$1808471', "Закрыт#closed"]]
        List expectedSeries = expectedResult*.get(0).collect {
            return DECIMAL_FORMAT.format((it as Double) * 2)
        }

        when(service.dashboardQueryWrapperUtils.getData(any(), any(), any(), eq(true), eq(DiagramType.COLUMN), eq(false), any(), any())).thenReturn(result)
        doReturn(result).when(service).formatGroupSet(anyList(), any(), anyList(), any())
        StandardDiagram diagram = service.buildDiagram(dashboardKey, widgetKey, cardObjectUuid,
                                                       widgetFilters, offsetUTCMinutes, user)
        assert diagram.series.data.flatten().findAll { it instanceof  String } - expectedSeries == []
    }

    /**
     *  проверка данных по показателю на диаграмме на соответствие ожидаемому результату при запросе по обычной диаграмме и наличии в ней вычислений
     */
    @Test
    void testGetDataForCompositeDiagramWithCalculation()
    {
        service.dashboardSettingsService = dashboardSettingsService
        String dashboardKey = 'root_testContentCode'
        String widgetKey = 'root_testContentCode_ef12c856-aef1-4a9b-9dd7-7a6b545cdaa8'
        String cardObjectUuid = 'root$401'
        String subjectUUID = cardObjectUuid
        DiagramType diagramType = DiagramType.COLUMN
        Map<String, Object> otherSettings = [offsetUTCMinutes: 240, widgetFilters: []]
        IUUIDIdentifiable user
        def (widgetFilters, offsetUTCMinutes) = [otherSettings.widgetFilters,
                                                 otherSettings.offsetUTCMinutes]

        URL fileUrl = getClass().getClassLoader().getResource('testGetDataForCompositeDiagramWithCalculationStorage.json')
        File file = new File(fileUrl.toURI())
        String storage = file.text
        DashboardSettingsClass testDashboardSettings = Jackson.fromJsonString(storage, DashboardSettingsClass)
        doReturn(testDashboardSettings).when(dashboardSettingsService).getDashboardSetting(dashboardKey, true)

        List<List> result = [['24038', '1С#service$1413205'], ['2922', 'AVEVA#service$1577104'], ['290', 'Capital Project#service$1577101'], ['601', 'Internet and WiFi#service$26958'], ['116', 'KY serv#service$45416401'], ['16', 'LIMS#service$1413208'], ['105', 'MES#service$1413207'], ['120', 'Naumen Service Desk#service$13150402'], ['3', 'SAP#service$1317704'], ['14', 'test#service$13150406'], ['16', 'VisitorControl#service$1577111'], ['58', 'WMS Solvo#service$1577108'], ['1', 'WMS#service$1577106'], ['7', '[New] тест услуга головного#service$41766207'], ['3', 'Актуализация справочника для внешнего call-центра#service$1808471'], ['3', 'АСТУЭ#service$1577105'], ['45', 'АСУ ТОиР#service$2109901'], ['6', 'База знаний ВКУС#service$10854701'], ['10', 'База знаний портала ВКУС#service$26944'], ['20', 'Банк-клиент#service$1577113'], ['5', 'БОСС-кадровик#service$1577102'], ['3827', 'ВКС/АКС, коллективные мероприятия#service$1413201'], ['13', 'Внешнеэкономическая деятельность#service$24370002'], ['4', 'Горячая линия промышленной безопасности#service$1808493'], ['5', 'Доработки систем (ЗнИ)/Проекты#service$1577121'], ['5250', 'Доступ к корп.системам и ресурсам#service$1577120'], ['40', 'ИСУП#service$2109902'], ['3417', 'КИС ЕСМ#service$1413206'], ['1', 'Клининг#service$17173501'], ['22', 'Компьютер, периферийное оборудование, программное обеспечение#service$10742801'], ['14961', 'Компьютер, периферийное оборудование, программное обеспечение#service$1117401'], ['13', 'Консультации ИБ#service$7672801'], ['616', 'Контактные данные#service$2109903'], ['205', 'Корпоративный портал СИБУР#service$26945'], ['6', 'Обслуживание абонентского оборудования доступа к сетям передачи данных и Интернет#service$1808482'], ['3', 'ОПОРА#service$1577103'], ['2', 'Организация командировок#service$20504901'], ['24', 'Отчеты на базе QlikView#service$1317709'], ['2879', 'Печать и сканирование#service$26938'], ['263', 'Портал ВКУС#service$1317708'], ['12', 'Программное обеспечение "Питание"#service$1577110'], ['1', 'Программное обеспечение Тренажер#service$1577119'], ['1', 'Прочее#service$1810102'], ['701', 'Прочее#service$26933'], ['1', 'Прочие услуги-базовые сервисы#service$1806837'], ['7', 'ПУ2 тестирование переклассификации#service$19005003'], ['27', 'Система SM "Замещения"#service$62157501'], ['17', 'Система SM#service$59157405'], ['198', 'Система управления проектами (JIRA)#service$1577107'], ['22', 'СЭД ЗапСиб-2#service$1577112'], ['179', 'Телефоны и связь#service$26963'], ['380', 'Тест MZ#service$30676401'], ['2', 'тест иерархии услуг#service$35241904'], ['3497', 'ТЕСТ Пользовательская услуга АРМ#service$1602603'], ['61', 'Тест услуга BPM#service$13150403'], ['4', 'тест услуга головного правила#service$41638901'], ['51', 'Тестовая услуга с динамическими полями#service$41766202'], ['3', 'Тестовая услуга ТЕА#service$96262501'], ['49', 'Тестовая услуга#service$20533601'], ['3', 'Техническая поддержка Aveva#service$1808415'], ['48', 'Техническая поддержка Skype for Business#service$1317711'], ['5', 'Техническая поддержка внутреннего Web-портала#service$1806816'], ['17', 'Техническая поддержка решения на платформе 1С#service$1804916'], ['2', 'Техническая поддержка Системы 1#service$28255'], ['10', 'Техническая поддержка системы SM#service$59157402'], ['1', 'Техническая поддержка системы аналитической отчетности на платформе QlikView (АГПЗ)#service$1810101'], ['5', 'Техподдержка NSD#service$13150404'], ['24', 'Транспорт#service$34535701'], ['6', 'ТУ1 тестирование переклассификации#service$19005002'], ['4', 'ТУ2 Тестирование переклассификации#service$19005004'], ['35', 'Управление услугами и процессами#service$1117407'], ['2', 'Услуга TAE#service$43752501'], ['67', 'Услуга Сакаевой (с согласованием)#service$59157407'], ['73', 'Услуга Сакаевой#service$48808001'], ['12', 'Услуга со всеми дин атрибутами#service$80740501'], ['10', 'Услуги сопровождения баз данных абонентов мобильной связи#service$1811716'], ['2', 'Услуги сопровождения баз данных сервисных запросов#service$1810188'], ['555', 'Услуги установки, тестирования и сопровождения программных средств АРМ#service$1810185'], ['43', 'Услуги установки, тестирования и сопровождения программных средств и баз данных КИС 1С: УПП ШР#service$1810189'], ['10', 'Услуги установки, тестирования и сопровождения программных средств и баз данных КИС CapitalProject#service$1811737'], ['1', 'Услуги установки, тестирования и сопровождения программных средств и баз данных КИС LIMS#service$1811703'], ['5', 'Услуги установки, тестирования и сопровождения программных средств и баз данных КИС MES#service$1811704'], ['1', 'Услуги установки, тестирования и сопровождения программных средств и баз данных КИС БОСС-Кадровик#service$1810194'], ['6', 'Услуги установки, тестирования и сопровождения программных средств и баз данных КИС ЕСМ#service$1810199'], ['15', 'Услуги установки, тестирования и сопровождения программных средств и баз данных КИС ЕСУИД#service$1810187'], ['13', 'Услуги установки, тестирования и сопровождения программных средств и баз данных локальных ИС#service$1811720'], ['2', 'Услуги эксплуатации и технической поддержки программно-аппаратных комплексов компьютерных систем фиксированной телефонной связи#service$1811731'], ['917', 'Учетная запись и пароль#service$1413204'], ['18', 'Учетная запись и пароль#service$20533604'], ['19', 'Учетная запись и пароль#service$9031802'], ['217', 'Фото#service$2109904'], ['49', 'Электронная подпись (ЭП)#service$1413203'], ['1554', 'Электронная почта/Email#service$1413202']]

        List expectedSeries = result*.get(0).collect {
            return DECIMAL_FORMAT.format((it as Double) * 2)
        }

        when(service.dashboardQueryWrapperUtils.getData(any(), any(), any(), eq(true), eq(DiagramType.COLUMN), eq(false), any(), any())).thenReturn(result)

        StandardDiagram diagram = service.buildDiagram(dashboardKey, widgetKey, cardObjectUuid,
                                                       widgetFilters, offsetUTCMinutes, user)
        assert expectedSeries == diagram.series.find().data
    }

    /**
     *  проверка данных по параметру на соответствие ожидаемому результату на соответствие ожидаемому результату при запросе по таблице
     */
    @Test
    void testGetDataForTableDiagram()
    {
        service.dashboardSettingsService = dashboardSettingsService
        String dashboardKey = 'root_testContentCode'
        String widgetKey = 'root_testContentCode_ef12c856-aef1-4a9b-9dd7-7a6b545cdaa8'
        String cardObjectUuid = 'root$401'
        String subjectUUID = cardObjectUuid
        DiagramType diagramType = DiagramType.COLUMN
        Map<String, Object> otherSettings = [offsetUTCMinutes: 240, tableRequestSettings: [ignoreLimits: [breakdown: false, parameter: false], pageNumber: 1, pageSize: 20, sorting: [type: "ASC"]], widgetFilters: []]
        IUUIDIdentifiable user
        def (widgetFilters, offsetUTCMinutes) = [otherSettings.widgetFilters,
                                                 otherSettings.offsetUTCMinutes]
        TableRequestSettings tableRequestSettings = new TableRequestSettings(otherSettings.tableRequestSettings)

        URL fileUrl = getClass().getClassLoader().getResource('testGetDataForTableDiagramStorage.json')
        File file = new File(fileUrl.toURI())
        String storage = file.text
        DashboardSettingsClass testDashboardSettings = Jackson.fromJsonString(storage, DashboardSettingsClass)
        doReturn(testDashboardSettings).when(dashboardSettingsService).getDashboardSetting(dashboardKey, true)

        List<List> result = [[15, 6, "1С", "1С СУЗиЗ и УПБ (ERP)"], [56, 11, "1С", "1С ШР"], [2, 1, "test", "test_comp"], [1, 1, "Актуализация справочника для внешнего call-центра", "(Старое) Актуализация справочника для внешнего call-центра"], [3, 1, "Горячая линия промышленной безопасности", "(Старое) Горячая линия промышленной безопасности"], [3, 2, "Компьютер, периферийное оборудование, программное обеспечение", "Принтер"], [3, 1, "Программное обеспечение \"Питание\"", "Модуль \"Столовая\""], [1, 1, "Прочее", "(Старое) Прочее"], [1, 1, "Прочие услуги-базовые сервисы", "(Старое) Прочие услуги-базовые сервисы"], [1, 1, "Система SM", "Система SM"], [9, 4, "Телефоны и связь", "Мобильная связь"], [4, 1, "Телефоны и связь", "Стационарные телефоны"], [2, 1, "Тест MZ", "Компонент в компоненте"], [2, 1, "тест иерархии услуг", "компонент 2 уровня"], [1, 1, "Техническая поддержка Aveva", "(Старое) Техническая поддержка Aveva"], [1, 1, "Техническая поддержка системы аналитической отчетности на платформе QlikView (АГПЗ)", "(Старое) Техническая поддержка системы аналитической отчетности на платформе QlikView (АГПЗ)"], [9, 1, "Транспорт", "Согласование"], [3, 2, "Управление услугами и процессами", "Управление услугами"], [2, 1, "Услуга со всеми дин атрибутами", "Компонент услуги"], [1, 1, "Услуги установки, тестирования и сопровождения программных средств АРМ", "Оборудование ВКС/АКС"]]

        List expectedLabels = result*.get(2)

        when(service.dashboardQueryWrapperUtils.getData(any(), any(), any(), eq(true), eq(DiagramType.TABLE), eq(false), any(), any())).thenReturn(result)

        doReturn(29).when(service).countDistinct(any(), any())

        TableDiagram diagram = service.buildDiagram(dashboardKey, widgetKey, cardObjectUuid,
                                                    widgetFilters, offsetUTCMinutes, user, tableRequestSettings)
        String keyTitle = testDashboardSettings.widgets[0].data.find().parameters.find().attribute.title
        assert expectedLabels == diagram.data*.get(keyTitle)
    }

    /**
     *  проверка данных по показателю на соответствие ожидаемому результату на соответствие ожидаемому результату при запросе по таблице и наличии в ней вычислений
     */
    @Test
    void testGetDataForTableDiagramWithCalculation()
    {
        service.dashboardSettingsService = dashboardSettingsService
        String dashboardKey = 'root_testContentCode'
        String widgetKey = 'root_testContentCode_ef12c856-aef1-4a9b-9dd7-7a6b545cdaa8'
        String cardObjectUuid = 'root$401'
        String subjectUUID = cardObjectUuid
        DiagramType diagramType = DiagramType.COLUMN
        Map<String, Object> otherSettings = [offsetUTCMinutes: 240, tableRequestSettings: [ignoreLimits: [breakdown: false, parameter: false], pageNumber: 1, pageSize: 20, sorting: [type: "ASC"]], widgetFilters: []]
        IUUIDIdentifiable user
        def (widgetFilters, offsetUTCMinutes) = [otherSettings.widgetFilters,
                                                 otherSettings.offsetUTCMinutes]
        TableRequestSettings tableRequestSettings = new TableRequestSettings(otherSettings.tableRequestSettings)

        URL fileUrl = getClass().getClassLoader().getResource('testGetDataForTableDiagramWithCalculationStorage.json')
        File file = new File(fileUrl.toURI())
        String storage = file.text
        DashboardSettingsClass testDashboardSettings = Jackson.fromJsonString(storage, DashboardSettingsClass)
        doReturn(testDashboardSettings).when(dashboardSettingsService).getDashboardSetting(dashboardKey, true)

        List<List> result = [[185, "1С", "1С СУЗиЗ и УПБ (ERP)"], [23834, "1С", "1С ШР"], [2, "test", "test_comp"], [3, "Актуализация справочника для внешнего call-центра", "(Старое) Актуализация справочника для внешнего call-центра"], [4, "Горячая линия промышленной безопасности", "(Старое) Горячая линия промышленной безопасности"], [6, "Компьютер, периферийное оборудование, программное обеспечение", "Принтер"], [6, "Обслуживание абонентского оборудования доступа к сетям передачи данных и Интернет", "(Старое) Обслуживание абонентского оборудования доступа к сетям передачи данных и Интернет"], [8, "Портал ВКУС", "Внутренние работы"], [3, "Программное обеспечение \"Питание\"", "Модуль \"Столовая\""], [1, "Прочее", "(Старое) Прочее"], [1, "Прочие услуги-базовые сервисы", "(Старое) Прочие услуги-базовые сервисы"], [1, "Система SM", "Система SM"], [88, "Телефоны и связь", "Мобильная связь"], [91, "Телефоны и связь", "Стационарные телефоны"], [3, "Тест MZ", "Компонент в компоненте"], [2, "тест иерархии услуг", "компонент 2 уровня"], [6, "Тестовая услуга", "Компонент1"], [3, "Техническая поддержка Aveva", "(Старое) Техническая поддержка Aveva"], [5, "Техническая поддержка внутреннего Web-портала", "(Старое) Техническая поддержка внутреннего Web-портала"], [17, "Техническая поддержка решения на платформе 1С", "(Старое) Техническая поддержка решения на платформе 1С"], [10, "Техническая поддержка системы SM", "Модуль SM1"], [1, "Техническая поддержка системы аналитической отчетности на платформе QlikView (АГПЗ)", "(Старое) Техническая поддержка системы аналитической отчетности на платформе QlikView (АГПЗ)"], [14, "Транспорт", "Согласование"], [3, "Управление услугами и процессами", "Управление услугами"], [2, "Услуга со всеми дин атрибутами", "Компонент услуги"], [10, "Услуги сопровождения баз данных абонентов мобильной связи", "SIM-карта"], [2, "Услуги сопровождения баз данных сервисных запросов", "Обращение ЕКДС"], [190, "Услуги установки, тестирования и сопровождения программных средств АРМ", "АРМ"], [4, "Услуги установки, тестирования и сопровождения программных средств АРМ", "АРМ к выдаче"], [132, "Услуги установки, тестирования и сопровождения программных средств АРМ", "МРМ к выдаче"], [196, "Услуги установки, тестирования и сопровождения программных средств АРМ", "Оборудование ВКС/АКС"], [8, "Услуги установки, тестирования и сопровождения программных средств АРМ", "Пользователь АРМ/МРМ"], [2, "Услуги установки, тестирования и сопровождения программных средств АРМ", "Пользователь локального почтового клиента"], [18, "Услуги установки, тестирования и сопровождения программных средств АРМ", "Пользователь оборудования ВКС/АКС"], [1, "Услуги установки, тестирования и сопровождения программных средств АРМ", "Пользователь устройства печати/ сканирования"], [4, "Услуги установки, тестирования и сопровождения программных средств АРМ", "Сессия коллективного мероприятия"], [14, "Услуги установки, тестирования и сопровождения программных средств и баз данных КИС 1С: УПП ШР", "Информационная система 1С: УПП ШР"], [2, "Услуги установки, тестирования и сопровождения программных средств и баз данных КИС 1С: УПП ШР", "Пользователь КИС 1С: Документооборот ШР"], [27, "Услуги установки, тестирования и сопровождения программных средств и баз данных КИС 1С: УПП ШР", "Пользователь КИС 1С: УПП ШР"], [1, "Услуги установки, тестирования и сопровождения программных средств и баз данных КИС CapitalProject", "Информационная система CapitalProject"], [9, "Услуги установки, тестирования и сопровождения программных средств и баз данных КИС CapitalProject", "Пользователь ИС CapitalProject"], [1, "Услуги установки, тестирования и сопровождения программных средств и баз данных КИС LIMS", "Информационная система LIMS"], [3, "Услуги установки, тестирования и сопровождения программных средств и баз данных КИС MES", "Информационная система MES"], [2, "Услуги установки, тестирования и сопровождения программных средств и баз данных КИС MES", "Пользователь КИС MES"], [1, "Услуги установки, тестирования и сопровождения программных средств и баз данных КИС БОСС-Кадровик", "Информационная система БОСС-Кадровик"], [2, "Услуги установки, тестирования и сопровождения программных средств и баз данных КИС ЕСМ", "Информационная система КИС ЕСМ"], [4, "Услуги установки, тестирования и сопровождения программных средств и баз данных КИС ЕСМ", "Пользователь КИС ЕСМ"], [4, "Услуги установки, тестирования и сопровождения программных средств и баз данных КИС ЕСУИД", "ЕСУИД"], [11, "Услуги установки, тестирования и сопровождения программных средств и баз данных КИС ЕСУИД", "Пользователь КИС ЕСУИД"], [4, "Услуги установки, тестирования и сопровождения программных средств и баз данных локальных ИС", "Информационная система Индустриальное питание"], [1, "Услуги установки, тестирования и сопровождения программных средств и баз данных локальных ИС", "Информационная система Тренажер"], [4, "Услуги установки, тестирования и сопровождения программных средств и баз данных локальных ИС", "Информационная система управления проектами"], [1, "Услуги установки, тестирования и сопровождения программных средств и баз данных локальных ИС", "Система аналитической отчетности на платформе QlikView"], [3, "Услуги установки, тестирования и сопровождения программных средств и баз данных локальных ИС", "Система АСТУЭ"], [2, "Услуги эксплуатации и технической поддержки программно-аппаратных комплексов компьютерных систем фиксированной телефонной связи", "Система фиксированной телефонной связи"]]

        List expectedSeries = result*.get(0).collect {
            return DECIMAL_FORMAT.format((it as Double) * 2)
        }

        when(service.dashboardQueryWrapperUtils.getData(any(), any(), any(), eq(true), eq(DiagramType.TABLE), eq(false), any(), any())).thenReturn(result)

        doReturn(29).when(service).countDistinct(any(), any())

        TableDiagram diagram = service.buildDiagram(dashboardKey, widgetKey, cardObjectUuid,
                                                    widgetFilters, offsetUTCMinutes, user, tableRequestSettings)

        String keyTitle = testDashboardSettings.widgets[0].data.find().indicators.find().attribute.title
        assert expectedSeries == diagram.data*.get(keyTitle)
    }

    /**
     *  проверка данных по показателю на соответствие ожидаемому результату на соответствие ожидаемому результату при запросе по таблице и наличии в ней вычислений и разбивки
     */
    @Test
    void testGetDataForTableDiagramWithCalculationAndBreakdown()
    {
        service.dashboardSettingsService = dashboardSettingsService
        String dashboardKey = 'root_testContentCode'
        String widgetKey = 'root_testContentCode_ef12c856-aef1-4a9b-9dd7-7a6b545cdaa8'
        String cardObjectUuid = 'root$401'
        String subjectUUID = cardObjectUuid
        DiagramType diagramType = DiagramType.COLUMN
        Map<String, Object> otherSettings = [offsetUTCMinutes: 240, tableRequestSettings: [ignoreLimits: [breakdown: false, parameter: false], pageNumber: 1, pageSize: 20, sorting: [type: "ASC"]], widgetFilters: []]
        IUUIDIdentifiable user
        def (widgetFilters, offsetUTCMinutes) = [otherSettings.widgetFilters,
                                                 otherSettings.offsetUTCMinutes]
        TableRequestSettings tableRequestSettings = new TableRequestSettings(otherSettings.tableRequestSettings)

        URL fileUrl = getClass().getClassLoader().getResource('testGetDataForTableDiagramWithBreakdownAndCalculationStorage.json')
        File file = new File(fileUrl.toURI())
        String storage = file.text
        DashboardSettingsClass testDashboardSettings = Jackson.fromJsonString(storage, DashboardSettingsClass)
        doReturn(testDashboardSettings).when(dashboardSettingsService).getDashboardSetting(dashboardKey, true)

        List result = [[123, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'Закрыт#closed'], [7, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'Закрыт#closed'], [1, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'На переклассификации#initialSupport'], [5, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'Зарегистрирован#registered'], [14, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'В работе 2 линии#secondLine'], [1, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'Ожидает 1 линии#waitfirstLine'], [33, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'Ожидает 1 линии#waitfirstLine'], [1, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'В ожидании 4 линии#waitFourthLine'], [291, '1С#service$1413205', '1С ШР#service$2109905', 'Закрыт#closed'], [23244, '1С#service$1413205', '1С ШР#service$2109905', 'Закрыт#closed'], [3, '1С#service$1413205', '1С ШР#service$2109905', 'Зарегистрирован#registered'], [257, '1С#service$1413205', '1С ШР#service$2109905', 'Зарегистрирован#registered'], [1, '1С#service$1413205', '1С ШР#service$2109905', 'Ожидает подтверждения#resolved'], [5, '1С#service$1413205', '1С ШР#service$2109905', 'В работе 2 линии#secondLine'], [8, '1С#service$1413205', '1С ШР#service$2109905', 'В работе 2 линии#secondLine'], [7, '1С#service$1413205', '1С ШР#service$2109905', 'Ожидает 1 линии#waitfirstLine'], [18, '1С#service$1413205', '1С ШР#service$2109905', 'Ожидает 1 линии#waitfirstLine'], [1, 'test#service$13150406', 'test_comp#service$13150407', 'В работе 2 линии#secondLine'], [1, 'test#service$13150406', 'test_comp#service$13150407', 'В работе 2 линии#secondLine'], [1, 'Актуализация справочника для внешнего call-центра#service$1808471', '(Старое) Актуализация справочника для внешнего call-центра#service$1814165', 'Закрыт#closed']]
        List expectedResult = [[260, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'Закрыт#closed'], [2, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'На переклассификации#initialSupport'], [10, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'Зарегистрирован#registered'], [28, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'В работе 2 линии#secondLine'], [68, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'Ожидает 1 линии#waitfirstLine'], [2, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'В ожидании 4 линии#waitFourthLine'], [47070, '1С#service$1413205', '1С ШР#service$2109905', 'Закрыт#closed'], [520, '1С#service$1413205', '1С ШР#service$2109905', 'Зарегистрирован#registered'], [2, '1С#service$1413205', '1С ШР#service$2109905', 'Ожидает подтверждения#resolved'], [26, '1С#service$1413205', '1С ШР#service$2109905', 'В работе 2 линии#secondLine'], [50, '1С#service$1413205', '1С ШР#service$2109905', 'Ожидает 1 линии#waitfirstLine'], [4, 'test#service$13150406', 'test_comp#service$13150407', 'В работе 2 линии#secondLine'], [2, 'Актуализация справочника для внешнего call-центра#service$1808471', '(Старое) Актуализация справочника для внешнего call-центра#service$1814165', 'Закрыт#closed']]
        List expectedSeries = expectedResult*.get(0).collect {
            return DECIMAL_FORMAT.format(it as Double)
        }

        when(service.dashboardQueryWrapperUtils.getData(any(), any(), any(), eq(true), eq(DiagramType.TABLE), eq(false), any(), any())).thenReturn(result)
        doReturn(result).when(service).formatGroupSet(anyList(), any(), anyList(), any())
        doReturn(29).when(service).countDistinct(any(), any())

        TableDiagram diagram = service.buildDiagram(dashboardKey, widgetKey, cardObjectUuid,
                                                    widgetFilters, offsetUTCMinutes, user, tableRequestSettings)

        String keyTitle = testDashboardSettings.widgets[0].data.find().indicators.find().attribute.title
        List actualSeries = diagram.data*.findResults {k, v -> k.contains(keyTitle) ? v : null}.flatten()
        assert expectedSeries == actualSeries
    }

    /**
     *  проверка данных по показателю на соответствие ожидаемому результату на соответствие ожидаемому результату при запросе по таблице и наличии в ней разбивки
     */
    @Test
    void testGetDataForTableDiagramWithBreakdown()
    {
        service.dashboardSettingsService = dashboardSettingsService
        String dashboardKey = 'root_testContentCode'
        String widgetKey = 'root_testContentCode_ef12c856-aef1-4a9b-9dd7-7a6b545cdaa8'
        String cardObjectUuid = 'root$401'
        String subjectUUID = cardObjectUuid
        DiagramType diagramType = DiagramType.COLUMN
        Map<String, Object> otherSettings = [offsetUTCMinutes: 240, tableRequestSettings: [ignoreLimits: [breakdown: false, parameter: false], pageNumber: 1, pageSize: 20, sorting: [type: "ASC"]], widgetFilters: []]
        IUUIDIdentifiable user
        def (widgetFilters, offsetUTCMinutes) = [otherSettings.widgetFilters,
                                                 otherSettings.offsetUTCMinutes]
        TableRequestSettings tableRequestSettings = new TableRequestSettings(otherSettings.tableRequestSettings)

        URL fileUrl = getClass().getClassLoader().getResource('testGetDataForTableDiagramWithBreakdownStorage.json')
        File file = new File(fileUrl.toURI())
        String storage = file.text
        DashboardSettingsClass testDashboardSettings = Jackson.fromJsonString(storage, DashboardSettingsClass)
        doReturn(testDashboardSettings).when(dashboardSettingsService).getDashboardSetting(dashboardKey, true)

        List result = [[123, 1, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'Закрыт#closed'], [7, 1, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'Закрыт#closed'], [1, 0, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'На переклассификации#initialSupport'], [5, 0, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'Зарегистрирован#registered'], [14, 4, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'В работе 2 линии#secondLine'], [1, 1, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'Ожидает 1 линии#waitfirstLine'], [33, 1, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'Ожидает 1 линии#waitfirstLine'], [1, 0, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'В ожидании 4 линии#waitFourthLine'], [291, 1, '1С#service$1413205', '1С ШР#service$2109905', 'Закрыт#closed'], [23244, 2, '1С#service$1413205', '1С ШР#service$2109905', 'Закрыт#closed'], [3, 1, '1С#service$1413205', '1С ШР#service$2109905', 'Зарегистрирован#registered'], [257, 0, '1С#service$1413205', '1С ШР#service$2109905', 'Зарегистрирован#registered'], [1, 1, '1С#service$1413205', '1С ШР#service$2109905', 'Ожидает подтверждения#resolved'], [5, 3, '1С#service$1413205', '1С ШР#service$2109905', 'В работе 2 линии#secondLine'], [8, 5, '1С#service$1413205', '1С ШР#service$2109905', 'В работе 2 линии#secondLine'], [7, 4, '1С#service$1413205', '1С ШР#service$2109905', 'Ожидает 1 линии#waitfirstLine'], [18, 3, '1С#service$1413205', '1С ШР#service$2109905', 'Ожидает 1 линии#waitfirstLine'], [1, 1, 'test#service$13150406', 'test_comp#service$13150407', 'В работе 2 линии#secondLine'], [1, 1, 'test#service$13150406', 'test_comp#service$13150407', 'В работе 2 линии#secondLine'], [1, 0, 'Актуализация справочника для внешнего call-центра#service$1808471', '(Старое) Актуализация справочника для внешнего call-центра#service$1814165', 'Закрыт#closed']]
        List expectedResult = [[130, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'Закрыт#closed'], [1, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'На переклассификации#initialSupport'], [5, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'Зарегистрирован#registered'], [14, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'В работе 2 линии#secondLine'], [34, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'Ожидает 1 линии#waitfirstLine'], [1, '1С#service$1413205', '1С СУЗиЗ и УПБ (ERP)#service$2109906', 'В ожидании 4 линии#waitFourthLine'], [23535, '1С#service$1413205', '1С ШР#service$2109905', 'Закрыт#closed'], [260, '1С#service$1413205', '1С ШР#service$2109905', 'Зарегистрирован#registered'], [1, '1С#service$1413205', '1С ШР#service$2109905', 'Ожидает подтверждения#resolved'], [13, '1С#service$1413205', '1С ШР#service$2109905', 'В работе 2 линии#secondLine'], [25, '1С#service$1413205', '1С ШР#service$2109905', 'Ожидает 1 линии#waitfirstLine'], [2, 'test#service$13150406', 'test_comp#service$13150407', 'В работе 2 линии#secondLine'], [1, 'Актуализация справочника для внешнего call-центра#service$1808471', '(Старое) Актуализация справочника для внешнего call-центра#service$1814165', 'Закрыт#closed']]
        List expectedSeries = expectedResult*.get(0).collect {
            return DECIMAL_FORMAT.format(it as Double)
        }

        when(service.dashboardQueryWrapperUtils.getData(any(), any(), any(), eq(true), eq(DiagramType.TABLE), eq(false), any(), any())).thenReturn(result)
        doReturn(result).when(service).formatGroupSet(anyList(), any(), anyList(), any())
        doReturn(29).when(service).countDistinct(any(), any())

        TableDiagram diagram = service.buildDiagram(dashboardKey, widgetKey, cardObjectUuid,
                                                    widgetFilters, offsetUTCMinutes, user, tableRequestSettings)

        String keyTitle = testDashboardSettings.widgets[0].data.find().indicators.find().attribute.title
        List actualSeries = diagram.data*.findResults {k, v -> k.contains(keyTitle) ? v : null}.flatten()
        assert expectedSeries == actualSeries
    }
}