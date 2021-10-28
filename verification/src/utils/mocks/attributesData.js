export default [
	{
		'code': 'checkStatus',
		'listType': 'CHECK',
		'title': 'Проверка статуса потребителя',
		'typeList': 'checkbox',
		'values': [
			{
				'UUID': 'catalogs$301837713',
				'code': 'byProxy',
				'title': 'Обращение заявителя по доверенности от потребителя',
				'uuid': 'catalogs$301837713'
			},
			{
				'UUID': 'catalogs$301837714',
				'code': 'fromRepresentative',
				'title': 'Обращение от представителя юридического лица (руководителя) или ИП (не цессионария)',
				'uuid': 'catalogs$301837714'
			},
			{
				'UUID': 'catalogs$301837715',
				'code': 'individualButIP',
				'title': 'Обращение ФЛ, который по договору выступает в качестве ИП',
				'uuid': 'catalogs$301837715'
			},
			{
				'UUID': 'catalogs$301837716',
				'code': 'withoutProxy',
				'title': 'Обращение заявителя от потребителя не по доверенности (помощь родственника и т.д.)',
				'uuid': 'catalogs$301837716'
			},
			{
				'UUID': 'catalogs$301837717',
				'code': 'fromAssigneeULorIP',
				'title': 'Обращение цессионария, если цедент ЮЛ или ИП',
				'uuid': 'catalogs$301837717'
			},
			{
				'UUID': 'catalogs$301837718',
				'code': 'claimsToThird',
				'title': 'Обращения потребителя с требованиями о взыскании в пользу третьего лица.',
				'uuid': 'catalogs$301837718'
			},
			{
				'UUID': 'catalogs$301837719',
				'code': 'withoutConfirmationOfAssigment',
				'title': 'Обращение заявителя при отсутствии подтверждения расторжения договора цессии.',
				'uuid': 'catalogs$301837719'
			},
			{
				'UUID': 'catalogs$301837720',
				'code': 'guardWithoutDocs',
				'title': 'Обращение законного представителя (в т.ч. опекуна/попечителя) без приложения подтверждающих законное представительство документов',
				'uuid': 'catalogs$301837720'
			},
			{
				'UUID': 'catalogs$301837721',
				'code': '14yeOld',
				'title': 'Обращение от несовершеннолетнего, не достигшего 14-летнего возраста',
				'uuid': 'catalogs$301837721'
			},
			{
				'UUID': 'catalogs$301837722',
				'code': '14yeOldEmancipated',
				'title': 'Обращение от несовершеннолетнего, достигшего 14-летнего возраста, за исключением эмансипации',
				'uuid': 'catalogs$301837722'
			},
			{
				'UUID': 'catalogs$301837723',
				'code': 'fromAssigneeWithoutAgreement',
				'title': 'Обращение цессионария без договора цессии',
				'uuid': 'catalogs$301837723'
			},
			{
				'UUID': 'catalogs$301837724',
				'code': 'byProxyWithInfoAboutAssigner',
				'title': 'Обращение представителя по доверенности, указавшего информацию о «цеденте»',
				'uuid': 'catalogs$301837724'
			},
			{
				'UUID': 'catalogs$301837726',
				'code': 'byLKThirdFace',
				'title': 'Обращение потребителя через ЛК иного лица',
				'uuid': 'catalogs$301837726'
			},
			{
				'UUID': 'catalogs$303324306',
				'code': 'byPostWithoutSign',
				'title': 'Обращение по почте не подписано',
				'uuid': 'catalogs$303324306'
			},
			{
				'UUID': 'catalogs$303680301',
				'code': 'manyAppalicantsOneFO',
				'title': 'В обращении сформулированы требования к одной ФО по нескольким потерпевшим (заявителям).',
				'uuid': 'catalogs$303680301'
			}
		]
	},
	{
		'code': 'checkA19',
		'listType': 'CHECK',
		'title': 'Проверка по ст. 19 (новый)',
		'typeList': 'checkbox',
		'values': [
			{
				'UUID': 'catalogs$301804900',
				'code': 'hasThirdJudgeDecision',
				'title': 'Имеется решение суда (третейского суда)',
				'uuid': 'catalogs$301804900'
			},
			{
				'UUID': 'catalogs$301837701',
				'code': 'judgeCaseWithSame',
				'title': 'Дело в суде по тому же предмету и по тем же основаниям',
				'uuid': 'catalogs$301837701'
			},
			{
				'UUID': 'catalogs$301837702',
				'code': 'decisionFUAboutSame',
				'title': 'Принято решение ФУ по тому же предмету и по тем же основаниям',
				'uuid': 'catalogs$301837702'
			},
			{
				'UUID': 'catalogs$301837703',
				'code': 'toFOWithoutLicense',
				'title': 'Обращение в отношении ФО, у которой отозвана лицензия',
				'uuid': 'catalogs$301837703'
			},
			{
				'UUID': 'catalogs$301837704',
				'code': 'FOonLiquidation',
				'title': 'ФО находится в стадии ликвидации',
				'uuid': 'catalogs$301837704'
			},
			{
				'UUID': 'catalogs$301837705',
				'code': 'aboutFOCaseWitoutLicensePVU',
				'title': 'Обращение в отношении ФО по ПВУ в случае отзыва у нее лицензии',
				'uuid': 'catalogs$301837705'
			},
			{
				'UUID': 'catalogs$301837706',
				'code': 'aboutBankruptcyULandFL',
				'title': 'Обращение по вопросам, связанным с банкротством ЮЛ и ФЛ',
				'uuid': 'catalogs$301837706'
			},
			{
				'UUID': 'catalogs$301837707',
				'code': 'compensationClaims',
				'title': 'В обращении заявлены требования о компенсации морального вреда и/или возмещении убытков в виде упущенной выгоды',
				'uuid': 'catalogs$301837707'
			},
			{
				'UUID': 'catalogs$301837708',
				'code': 'claimsAboutRelationsOrRecovery',
				'title': 'В обращении заявлены требования, связанные с трудовыми, семейными, административными, налоговыми правоотношениями, а также обращения о взыскании обязательных платежей и санкций',
				'uuid': 'catalogs$301837708'
			},
			{
				'UUID': 'catalogs$301837709',
				'code': 'sameReAppeal',
				'title': 'Обращение направлено повторно по тому же предмету и по тем же основаниям, что и обращение, ранее принятое ФУ к рассмотрению',
				'uuid': 'catalogs$301837709'
			},
			{
				'UUID': 'catalogs$301837710',
				'code': 'оbscene',
				'title': 'Обращение содержит нецензурные либо оскорбительные выражения, угрозы жизни, здоровью и имуществу ФУ или иных лиц',
				'uuid': 'catalogs$301837710'
			},
			{
				'UUID': 'catalogs$301837711',
				'code': 'notReadable',
				'title': 'Текст обращения (приложенных документов) не поддается прочтению',
				'uuid': 'catalogs$301837711'
			},
			{
				'UUID': 'catalogs$301837712',
				'code': 'notToFU',
				'title': 'Отсутствует обращение к ФУ',
				'uuid': 'catalogs$301837712'
			}
		]
	},
	{
		'code': 'checkA15',
		'listType': 'RADIO',
		'title': 'Проверка по ст. 15',
		'typeList': 'radio',
		'values': [
			{
				'UUID': 'catalogs$301804807',
				'code': 'notInRegistryFU',
				'title': 'Организация не включена в реестр/перечень ФУ',
				'uuid': 'catalogs$301804807'
			},
			{
				'UUID': 'catalogs$301804808',
				'code': 'toRCA',
				'title': 'Обращение в отношении РСА',
				'uuid': 'catalogs$301804808'
			}
		]
	},
	{
		'code': 'checkProperty',
		'listType': 'RADIO',
		'title': 'Проверка требований имущественного характера',
		'typeList': 'radio',
		'values': [
			{
				'UUID': 'catalogs$301804862',
				'code': 'notPropertyClaims',
				'title': 'Обращение потребителя с неимущественными требованиями (провести проверку ФО и т.д.)',
				'uuid': 'catalogs$301804862'
			},
			{
				'UUID': 'catalogs$301804863',
				'code': 'refinancingAndNotPaying',
				'title': 'Обращение с просьбой рефинансировать кредит и т.п., при этом заявитель не оплачивает кредит (указывает, что не будет оплачивать кредит)',
				'uuid': 'catalogs$301804863'
			},
			{
				'UUID': 'catalogs$301804864',
				'code': 'disputeWithFOThatHasClaims',
				'title': 'Обращение с просьбой вмешаться в спор с ФО, предъявившей регрессные требования или требования о возврате неосновательного обогащения',
				'uuid': 'catalogs$301804864'
			},
			{
				'UUID': 'catalogs$301804866',
				'code': 'notPropertyClaimsOSAGO',
				'title': 'В обращении по ОСАГО сформулированы неимущественные требования (проведение осмотра и т.д.)',
				'uuid': 'catalogs$301804866'
			},
			{
				'UUID': 'catalogs$303324308',
				'code': 'disputeWithFOAboutLoan',
				'title': 'Обращение с просьбой вмешаться в спор с ФО, предъявившей требования к заявителю по займу/кредиту, при этом заявитель указывает на то, что не брал заем/кредит',
				'uuid': 'catalogs$303324308'
			}
		]
	},
	{
		'code': 'checkA16',
		'listType': 'RADIO',
		'title': 'Проверка по ст. 16',
		'typeList': 'radio',
		'values': [
			{
				'UUID': 'catalogs$301804871',
				'code': 'claimToFoNotSent',
				'title': 'Претензия в ФО не направлялась',
				'uuid': 'catalogs$301804871'
			},
			{
				'UUID': 'catalogs$301804872',
				'code': 'claimReceivedBefore',
				'title': 'Претензия получена до даты начала взаимодействия',
				'uuid': 'catalogs$301804872'
			},
			{
				'UUID': 'catalogs$301804873',
				'code': 'docsNotIncluded',
				'title': 'Дата направления претензии неизвестна, нет документального подтверждения направления или получения ФО претензии, не приложена копия ответа ФО на нее',
				'uuid': 'catalogs$301804873'
			},
			{
				'UUID': 'catalogs$301804874',
				'code': 'expiredAndResponseNotIncluded',
				'title': 'Претензия подана не ранее даты начала взаимодействия, но срок на ее рассмотрение не истек и к обращению не приложена копия ответа ФО',
				'uuid': 'catalogs$301804874'
			},
			{
				'UUID': 'catalogs$301804875',
				'code': 'claimBeforeAppExpired',
				'title': 'Претензия направлена до истечения срока на рассмотрение первоначального заявления',
				'uuid': 'catalogs$301804875'
			},
			{
				'UUID': 'catalogs$301804876',
				'code': 'FONotRefuse',
				'title': 'Претензия подана, но срок на ее рассмотрение не истек и к обращению приложена копия ответа ФО, которая не содержит прямого отказа в удовлетворении требований заявителя.',
				'uuid': 'catalogs$301804876'
			},
			{
				'UUID': 'catalogs$301804877',
				'code': 'FOresponseNotSignAndAppFo',
				'title': 'Претензия подана, но срок на ее рассмотрение не истек и к обращению приложена копия ответа ФО в формате WORD (не на бланке ФО, с подписью в виде «вставки»)',
				'uuid': 'catalogs$301804877'
			},
			{
				'UUID': 'catalogs$301804878',
				'code': 'appButMustBeClaim',
				'title': 'К обращению приложена копия первичного заявления вместо претензии',
				'uuid': 'catalogs$301804878'
			},
			{
				'UUID': 'catalogs$301804879',
				'code': 'claimsNotInApp',
				'title': 'Обращение к ФУ содержит требования, не заявленные в заявлении (претензии) к ФО, либо касается существа спора, отличного от указанного в заявлении (претензии)',
				'uuid': 'catalogs$301804879'
			},
			{
				'UUID': 'catalogs$301804880',
				'code': 'claimAsChat',
				'title': 'К обращению приложена претензия в виде деловой переписки с ФО (не содержит имущественных требований и (или) не касается существа спора)',
				'uuid': 'catalogs$301804880'
			},
			{
				'UUID': 'catalogs$301804881',
				'code': 'reAppealButWrongNumber',
				'title': 'Повторное обращение с указанием номер договора при наличии решения о прекращении в связи с отсутствием номера договора, либо указанием иного номера',
				'uuid': 'catalogs$301804881'
			},
			{
				'UUID': 'catalogs$301804882',
				'code': 'claimNotSentAnd3yeExpired',
				'title': 'Претензия в ФО не направлялась при этом истек 3-х летний срок',
				'uuid': 'catalogs$301804882'
			},
			{
				'UUID': 'catalogs$301804883',
				'code': 'notStandartClaimByMail',
				'title': 'Претензия не по стандартной форме направлена по электронной почте (срок более 15, но менее 30 дней).',
				'uuid': 'catalogs$301804883'
			}
		]
	},
	{
		'code': 'checkThirdA16',
		'listType': 'RADIO',
		'title': 'Проверка по ст. 16 (3 лица)',
		'typeList': 'radio',
		'values': [
			{
				'UUID': 'catalogs$301804867',
				'code': 'withoutPaymentDoc',
				'title': 'Обращение цессионария без платежного документа',
				'uuid': 'catalogs$301804867'
			},
			{
				'UUID': 'catalogs$301804868',
				'code': 'withDefectivePaymentDoc',
				'title': 'Обращение цессионария с дефектами платежного поручения',
				'uuid': 'catalogs$301804868'
			},
			{
				'UUID': 'catalogs$301804869',
				'code': 'paymentNotProoved',
				'title': 'Обращение цессионария с платежным документом (поступление денежных средств ФУ не подтверждено)',
				'uuid': 'catalogs$301804869'
			},
			{
				'UUID': 'catalogs$301804870',
				'code': 'paymentDocUsed',
				'title': 'Обращение цессионария с приложением платежного документа, который уже был использован ранее',
				'uuid': 'catalogs$301804870'
			}
		]
	},
	{
		'code': 'checkOthers',
		'listType': 'CHECK',
		'title': 'Проверка по иным вопросам',
		'typeList': 'checkbox',
		'values': [
			{
				'UUID': 'catalogs$301804804',
				'code': 'aboutFeeForCons',
				'title': 'Обращение цессионария о взыскании с ФО платы ФУ за рассмотрение',
				'uuid': 'catalogs$301804804'
			},
			{
				'UUID': 'catalogs$301804805',
				'code': 'notCopyAttachedForTC',
				'title': 'В обращении по страховому спору заявитель указывает, что он является собственником поврежденного ТС, но не приложены копии ПТС, СР ТС, договора купли-продажи, решения суда о признании права на имущество',
				'uuid': 'catalogs$301804805'
			},
			{
				'UUID': 'catalogs$301804806',
				'code': 'claimForFine',
				'title': 'Требование о взыскании с ФО штрафа',
				'uuid': 'catalogs$301804806'
			}
		]
	},
	{
		'code': 'checkA17',
		'listType': 'CHECK',
		'title': 'Проверка по ст. 17 (новый)',
		'typeList': 'checkbox',
		'values': [
			{
				'UUID': 'catalogs$301804884',
				'code': 'notEnoughPersonalInfo',
				'title': 'В обращении и прилагаемых к нему документах не содержится информация о дате рождения, месте рождения, месте жительства потребителя финансовых услуг, наименовании, месте нахождения, адресе финансовой организации, дате направления обращения, размере требований имущественного характера. При этом данную информацию невозможно установить из приложенных к обращению документов.',
				'uuid': 'catalogs$301804884'
			},
			{
				'UUID': 'catalogs$301804885',
				'code': 'claimCopyNotIncluded',
				'title': 'К обращению не приложена копия претензии при наличии сведений о ее отправке или ответа ФО на претензию',
				'uuid': 'catalogs$301804885'
			},
			{
				'UUID': 'catalogs$301804886',
				'code': 'claimCopyWithoutProof',
				'title': 'К обращению приложена копия претензии без документов о ее направлении в ФО (доказательства получения претензии финансовой организацией, в том числе ответ на нее, отсутствуют) – не подтвержден факт направления',
				'uuid': 'catalogs$301804886'
			}
		]
	},
	{
		'code': 'checkFinServ',
		'listType': 'RADIO',
		'title': 'Проверка значения финансовой услуги',
		'typeList': 'radio',
		'values': [
			{
				'UUID': 'catalogs$301510301',
				'code': 'valueCorrect',
				'title': 'значение финансовой услуги корректно',
				'uuid': 'catalogs$301510301'
			},
			{
				'UUID': 'catalogs$301510302',
				'code': 'valueError',
				'title': 'ошибка в значении финансовой услуги',
				'uuid': 'catalogs$301510302'
			},
			{
				'UUID': 'catalogs$301510303',
				'code': 'notEnoughData',
				'title': 'недостаточно данных для идентификации',
				'uuid': 'catalogs$301510303'
			}
		]
	}
];
