/*! UTF-8 */
//Автор: nordclan
//Дата создания: 07.08.2020
//Код:
//Назначение:
/**
 * Скрипт для перекомпиляции модулей в нужном порядке
 */
//Версия: 4.13.0.4
//Категория: Консольный скрипт

import ru.naumen.modules.dashboards.*

DashboardConfigService service = DashboardConfigService.instance
service.compileModules()