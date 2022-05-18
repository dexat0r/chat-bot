export default {
    start: "Привет! Это тренажер собеседований.\nПредставь, что я интервьюер и провожу собеседование. Я буду задавать вопросы, а ты на них отвечать. Не отвечай сухо и односложно, это может расстроить работодателя. Поехали?",
    refuse: `Тогда, я надеюсь, ты сам(а) справишься. Желаю успехов!\nЕсли что, я всегда готов помочь.\n`,
    stages: [
        {
            text: "Здравствуйте!",
            validation: (value: string): boolean => {
                const searchTerms = [
                    "здравствуйте",
                    "добрый вечер",
                    "добрый день",
                    "доброе утро",
                ];
                const match = value
                    .toLowerCase()
                    .match((searchTerms.join("|").toLowerCase()));
                return match ? match.length > 0 : false;
            },
        },
        {
            text: "Представьтесь, пожалуйста.",
            validation: (): boolean => {

                return true;
            },
        },
        {
            text: "Какую вакансию Вы выбрали и почему?",
            validation: (value: string): boolean => {
                const searchTerms = [
                    `потому что`,
                    `поскольку`,
                    `так как`,
                    `поэтому`,
                    `т.к.`,
                    `ведь`,
                    `потому как`,
                    `оттого что`,
                    `ибо`,
                    `в силу того, что`
                ];
                const match = value
                    .toLowerCase()
                    .match((searchTerms.join("|").toLowerCase()));
                console.log(match);
                return value.split(" ").length > 2 && match ? match.length > 0 : false;
            },
        },
        {
            text: "Расскажите о себе.",
            validation: (value: string): boolean => {
                return value.split(" ").length > 4;
            },
        },
        {
            text: "Спасибо. Расскажите о своем образовании?",
            validation: (value: string): boolean => {
                const searchTerms = [
                    "институт",
                    "университет",
                    "школа",
                    "бакалавриат",
                    "магистратура",
                    "аспирантура",
                    "курс",
                    "курсы",
                    "закончила",
                    "закончил",
                    "ПГУПС",
                    "государственный",
                    "РГГУ",
                    "РГПУ",
                    "Герцена",
                    "СПбАУ",
                    "СПбГУ",
                    "СПбГПУ",
                    "СПбГТУРП",
                    "СПбГУАП",
                    "СПбГУ ИТМО",
                    "ЛЭТИ",
                    "ВШЭ",
                    "НИУ ВШЭ",
                    "МГИМО",
                    "ГУУ",
                    "ИМТП",
                    "МАИ",
                    "МАРХИ",
                    "МАТИ-РГТУ",
                    "МГИМО",
                    "МГИЭТ",
                    "МГЛУ",
                    "МГТУ",
                    "МГУ",
                    "МГУКИ",
                    "МГУП",
                    "МГУПП",
                    "МГУС",
                    "МГУТУ",
                    "МИИГАиК",
                    "МИФИ",
                    "МИЭМ",
                    "МТУСИ",
                    "МУМ",
                    "РГГУ",
                    "РГСУ",
                    "РУДН",
                ];
                console.log((searchTerms.join("|").toLowerCase()))
                const match = value
                    .toLowerCase()
                    .match((searchTerms.join("|").toLowerCase()));
                console.log(match)
                return match ? match.length > 0 : false;
            },
        },
        [
            {
                text: "Какой у Вас опыт работы в данной сфере?",
                validation: (value: string): boolean => {
                    const searchTerms = [
                        "нет",
                        "нету",
                        "не было",
                        "не работал",
                    ];
                    const match = value
                        .toLowerCase()
                        .match((searchTerms.join("|")));
                    return !Boolean(match);
                },
            },
            {
                text: "Хорошо. Тогда перечислите Ваши сильные стороны характера.",
                validation: (value: string): boolean => {
                    return value.split(" ").length >= 2;
                },
            },
            {
                text: "Назовите Ваши слабые стороны характера.",
                validation: (value: string): boolean => {
                    return value.split(" ").length >= 2;
                },
            },
            {
                text: "Какую позицию Вы займете в коллективе?",
                validation: (): boolean => {
                    return true;
                },
            },
            {
                text: "Умеете ли Вы разрешать конфликтные ситуации? Можете привести пример?",
                validation: (value: string): boolean => {
                    return value.split(" ").length >= 4;
                },
            },
            {
                text: "Опишите идеального сотрудника нашей компании, по Вашему мнению.",
                validation: (value: string): boolean => {
                    return value.split(" ").length >= 4;
                },
            },
            {
                text: "Что отличает Вас от других сотрудников? Почему мы должны взять на работу именно Вас?",
                validation: (value: string): boolean => {
                    return value.split(" ").length >= 4;
                },
            },
            {
                text: "Кем Вы видите себя через 5 лет?",
                validation: (value: string): boolean => {
                    return value.split(" ").length >= 4;
                },
            },
            {
                text: "Сколько Вы хотите зарабатывать на нашей работе?",
                validation: (): boolean => {
                    return true;
                },
            },
            {
                text: "Что значит для Вас «достичь успеха»?",
                validation: (value: string): boolean => {
                    return value.split(" ").length >= 4;
                },
            },
        ],
    ],
    finish: "Спасибо большое, было интересно с Вами общаться. Хотите узнать результаты собеседования?",
    leave: "Спасибо за ответы. Удачи!",
    results: {
        9: "Отлично! Вы достаточно подробно и интересно ответили на все вопросы, скорее всего, Вы нам подходите.",
        6: "Спасибо за Ваши ответы. Вы неплохо справились, но мой Вам совет – отвечать более развернуто, чтобы работодателю было на что опереться. Мы рассмотрим Вашу кандидатуру. Всего доброго!",
        0: "К сожалению, Вам нужно еще потренироваться отвечать более подробно и развернуто. Мы не всегда могли Вас понять. Попробуйте еще раз?",
    },
    errors: {
        grammar:
            "Спасибо за Ваши ответы. Вы неплохо справились, но Вам нужно поработать с грамотностью, повторить правила русского языка. Мой Вам совет – отвечать более развернуто, чтобы работодателю было на что опереться. Мы рассмотрим Вашу кандидатуру.",
        fuck: "Извините, на собеседовании не приветствуется такая лексика. Мы вынуждены Вам отказать.",
    },
};
