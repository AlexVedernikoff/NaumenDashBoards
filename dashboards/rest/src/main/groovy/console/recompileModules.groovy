/*! UTF-8 */
//Автор: nordclan
//Дата создания: 07.08.2020
//Код:
//Назначение:
/**
 * Скрипт для перекомпиляции модулей в нужном порядке
 */
//Версия: 4.10.0.15
//Категория: Консольный скрипт

import ru.naumen.core.server.script.spi.ScriptServiceImpl
def scriptService = beanFactory.getBean(ScriptServiceImpl)
scriptService.reloadModules([
    'dashboardCommon',
    'dashboardMarshaller',
    'dashboardFormulaCalculator',
    'dashboardQueryWrapper',
    'dashboardSettings',
    'dashboardDataSet',
    'dashboardDrilldown',
    'dashboards',
    'dashboardSendEmail'
])