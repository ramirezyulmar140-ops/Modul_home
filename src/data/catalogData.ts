import { Home, Sun, Maximize, Box } from 'lucide-react';

// Стандартная комплектация "Под ключ" — одинакова для всех проектов каркасных домов
export const STANDARD_INCLUSIONS = [
    {
        category: 'Фундамент и конструктив',
        items: [
            'Свайно-винтовой фундамент',
            'Деревянный каркас из древесины камерной сушки',
            'Утепление базальтовой ватой 200 мм (стены) и 250 мм (кровля)',
            'Пароизоляция и ветрозащитная мембрана',
        ],
    },
    {
        category: 'Кровля и фасад',
        items: [
            'Кровля из металлочерепицы (цвет по выбору)',
            'Внешняя отделка фасада по проекту',
            'Металлопластиковые окна с двухкамерным стеклопакетом',
            'Утеплённая входная дверь',
        ],
    },
    {
        category: 'Электрика',
        items: [
            'Разводка кабелей ВВГнг по всем помещениям',
            'Электрощиток с автоматической защитой',
            'Установленные розетки и выключатели',
            'Базовые светильники (споты / потолочные)',
        ],
    },
    {
        category: 'Водоснабжение и отопление',
        items: [
            'Внутренняя разводка труб ХВС и ГВС',
            'Внутренняя канализация до выпуска',
            'Радиаторы отопления в каждой комнате',
            'Подключение к системе отопления (котёл — под выбор клиента)',
        ],
    },
    {
        category: 'Чистовая отделка',
        items: [
            'Ламинат 33-го класса на полу',
            'Покраска стен влагостойкой краской',
            'Натяжной потолок белый матовый',
            'Напольные и потолочные плинтуса',
        ],
    },
    {
        category: 'Санузел',
        items: [
            'Кафельная плитка на полу и стенах санузла',
            'Подвесной унитаз с инсталляцией',
            'Раковина со смесителем',
            'Душевая кабина (поддон + стенки)',
        ],
    },
    {
        category: 'Двери',
        items: [
            'Межкомнатные двери с фурнитурой во всех комнатах',
        ],
    },
];

// Для фанерных модулей — немного другой состав (заводская сборка)
export const PLYWOOD_INCLUSIONS = [
    {
        category: 'Конструктив и утепление',
        items: [
            'Каркас из клееного бруса заводской сборки',
            'Утепление базальтовой ватой 200 мм',
            'Пароизоляция и ветрозащита',
        ],
    },
    {
        category: 'Фасад и кровля',
        items: [
            'Плоская кровля с ПВХ-мембраной',
            'Фасад из термообработанного дерева',
            'Стеклопакеты с тонировкой',
            'Утеплённая входная дверь',
        ],
    },
    {
        category: 'Электрика',
        items: [
            'Скрытая разводка кабелей',
            'Электрощиток с автоматами',
            'Розетки, выключатели, светильники',
        ],
    },
    {
        category: 'Водоснабжение',
        items: [
            'Разводка ХВС и ГВС',
            'Внутренняя канализация',
        ],
    },
    {
        category: 'Отделка',
        items: [
            'Стены и потолок — шлифованная берёзовая фанера ФК',
            'Пол — фанера ФК с лаковым покрытием',
            'Скрытые коммуникации за панелями',
        ],
    },
    {
        category: 'Санузел',
        items: [
            'Кафельная плитка пол + стены',
            'Унитаз, раковина, смеситель',
            'Душевая кабина',
        ],
    },
];

export const catalogData = [
    {
        id: 'barnhouse',
        name: 'Барнхаус',
        description: 'Популярный европейский стиль, сочетающий в себе минимализм и лофт. Отличительные черты: высокие потолки, панорамное остекление торцевых фасадов и отсутствие свесов кровли. Создает невероятное ощущение простора внутри.',
        icon: Home,
        coverImage: 'https://images.unsplash.com/photo-1623916949216-7afc8672074e?auto=format&fit=crop&q=80&w=1600',
        layouts: [
            {
                id: 'barn-45',
                name: "Барн 45",
                type: "Компактный",
                area: "45 м²",
                dimensions: "6×7.5 м",
                floors: "1 этаж",
                time: "25 дней",
                price: "1 950 000",
                description: "Идеален для пары или гостевого дома. Просторная кухня-гостиная со вторым светом.",
                image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800",
                floorPlan: "https://images.unsplash.com/photo-1542314831-c6a4d14cdac8?auto=format&fit=crop&q=80&w=800",
                images: [
                    "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
                ],
                features: ["1 спальня", "Кухня-гостиная", "Второй свет", "Терраса"],
                popular: false,
                tags: ["Компактный", "Отличный старт", "Растущий дом"],
                configurations: [
                    { name: "Теплый контур", priceOffset: 0, description: "Фундамент, каркас, утепление 200мм, окна, внешняя отделка" },
                    { name: "White Box", priceOffset: 500000, description: "Скрытая разводка коммуникаций, подготовка стен под покраску/обои" },
                    { name: "Под ключ", priceOffset: 1200000, description: "Чистовая отделка, установленная сантехника, розетки и выключатели" }
                ]
            },
            {
                id: 'barn-65',
                name: "Барн 65",
                type: "С антресолью",
                area: "65 м²",
                dimensions: "6×9 м",
                floors: "1.5 этажа",
                time: "30 дней",
                price: "2 850 000",
                description: "Хит продаж. Дополнительная спальня или кабинет на антресольном этаже.",
                image: "https://images.unsplash.com/photo-1542314831-c6a4d14cdac8?auto=format&fit=crop&q=80&w=800",
                floorPlan: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800",
                images: [
                    "https://images.unsplash.com/photo-1542314831-c6a4d14cdac8?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800"
                ],
                features: ["2 спальни", "Антресоль", "Панорамный фасад", "Скрытая проводка"],
                popular: true,
                tags: ["Хит", "Растущий дом"],
                configurations: [
                    { name: "Теплый контур", priceOffset: 0, description: "Фундамент, каркас, утепление 200мм, окна, внешняя отделка" },
                    { name: "White Box", priceOffset: 700000, description: "Скрытая разводка коммуникаций, подготовка стен под покраску/обои" },
                    { name: "Под ключ", priceOffset: 1600000, description: "Чистовая отделка, установленная сантехника, розетки и выключатели" }
                ]
            },
            {
                id: 'barn-110',
                name: "Барн 110",
                type: "Семейный",
                area: "110 м²",
                dimensions: "8×12 м",
                floors: "2 этажа",
                time: "45 дней",
                price: "4 200 000",
                description: "Полноценный коттедж для большой семьи. Три независимые спальни и огромная гостиная.",
                image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
                images: [
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
                ],
                features: ["3 спальни", "2 санузла", "Мастер-спальня", "Котельная"],
                tags: ["Для большой семьи", "Подходит под IT-ипотеку"],
                configurations: [
                    { name: "Теплый контур", priceOffset: 0, description: "Фундамент, каркас, утепление 200мм, окна, внешняя отделка" },
                    { name: "White Box", priceOffset: 1000000, description: "Скрытая разводка коммуникаций, подготовка стен под покраску/обои" },
                    { name: "Под ключ", priceOffset: 2200000, description: "Чистовая отделка, установленная сантехника, розетки и выключатели" }
                ]
            }
        ]
    },
    {
        id: 'scandi',
        name: 'Сканди',
        description: 'Теплый, традиционный и эстетически безупречный стиль. Двускатная крыша, экологичные материалы отделки и выверенная эргономика каждого квадратного метра. Дом, в котором хочется проводить зимы.',
        icon: Sun,
        coverImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1600',
        layouts: [
            {
                id: 'scandi-30',
                name: "Сканди 30",
                type: "Студия",
                area: "30 м²",
                dimensions: "5×6 м",
                floors: "1 этаж",
                time: "20 дней",
                price: "1 200 000",
                description: "Минималистичный проект для уединенного отдыха на природе. Отлично подходит под сдачу.",
                image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=800",
                images: [
                    "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&get=80&w=800",
                    "https://images.unsplash.com/photo-1542314831-c6a4d14cdac8?auto=format&fit=crop&q=80&w=800"
                ],
                features: ["Студия", "Санузел", "Сауна (опция)", "Патио"],
                tags: ["Инвестиция", "Можно пристроить модуль"],
                configurations: [
                    { name: "Теплый контур", priceOffset: 0, description: "Фундамент, каркас, утепление 200мм, окна, внешняя отделка" },
                    { name: "White Box", priceOffset: 300000, description: "Скрытая разводка коммуникаций, подготовка стен" },
                    { name: "Под ключ", priceOffset: 700000, description: "Чистовая отделка, сантехника, электрика" }
                ]
            },
            {
                id: 'scandi-55',
                name: "Сканди 55",
                type: "Популярный",
                area: "55 м²",
                dimensions: "7×8 м",
                floors: "1 этаж",
                time: "25 дней",
                price: "2 400 000",
                description: "Золотая середина. Комфортное зонирование, отделяющее спальни от шумной зоны гостиной.",
                image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
                images: [
                    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
                ],
                features: ["2 спальни", "Кухня-ниша", "Раздельный санузел", "Крыльцо"],
                popular: true,
                tags: ["Хит", "Семейная ипотека"],
                configurations: [
                    { name: "Теплый контур", priceOffset: 0, description: "Фундамент, каркас, утепление 200мм, окна, внешняя отделка" },
                    { name: "White Box", priceOffset: 550000, description: "Скрытая разводка коммуникаций, подготовка стен" },
                    { name: "Под ключ", priceOffset: 1200000, description: "Чистовая отделка, сантехника, электрика" }
                ]
            },
            {
                id: 'scandi-85',
                name: "Сканди 85",
                type: "Просторный",
                area: "85 м²",
                dimensions: "9×10 м",
                floors: "1 этаж",
                time: "35 дней",
                price: "3 600 000",
                description: "Широкий одноэтажный дом. Удобство отсутствия лестниц и просторные комнаты.",
                image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
                images: [
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800"
                ],
                features: ["3 спальни", "Гардеробная", "Окно в ванной", "Большая терраса"],
                tags: ["Просторный", "Без лестниц"],
                configurations: [
                    { name: "Теплый контур", priceOffset: 0, description: "Фундамент, каркас, утепление 200мм, окна, внешняя отделка" },
                    { name: "White Box", priceOffset: 800000, description: "Скрытая разводка коммуникаций, подготовка стен" },
                    { name: "Под ключ", priceOffset: 1700000, description: "Чистовая отделка, сантехника, электрика" }
                ]
            }
        ]
    },
    {
        id: 'minimalism',
        name: 'Хай-Тек',
        description: 'Строгие кубические формы, плоская эксплуатируемая кровля и максимум функциональности. Идеальный выбор для современных участков и прогрессивных владельцев.',
        icon: Maximize,
        coverImage: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1600',
        layouts: [
            {
                id: 'cube-40',
                name: "Куб 40",
                type: "Смарт",
                area: "40 м²",
                dimensions: "5×8 м",
                floors: "1 этаж",
                time: "25 дней",
                price: "1 800 000",
                description: "Ультрасовременный компактный дом с возможностью отдыха на крыше.",
                image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
                images: [
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
                ],
                features: ["1 спальня", "Плоская кровля", "Панорама", "Навес"],
                tags: ["Инновационный", "Эксплуатируемая кровля"],
                configurations: [
                    { name: "Теплый контур", priceOffset: 0, description: "Фундамент, каркас, утепление 200мм, окна, внешняя отделка" },
                    { name: "White Box", priceOffset: 450000, description: "Скрытая разводка коммуникаций, подготовка стен" },
                    { name: "Под ключ", priceOffset: 950000, description: "Чистовая отделка, сантехника, электрика" }
                ]
            },
            {
                id: 'module-75',
                name: "Модуль 75",
                type: "Угловой",
                area: "75 м²",
                dimensions: "L-форма",
                floors: "1 этаж",
                time: "35 дней",
                price: "3 300 000",
                description: "Г-образная планировка, создающая приватный внутренний дворик.",
                image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
                images: [
                    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800"
                ],
                features: ["2 спальни", "Кабинет", "Мастер-зона", "Умный дом"],
                popular: true,
                tags: ["Хит", "Приватный двор"],
                configurations: [
                    { name: "Теплый контур", priceOffset: 0, description: "Фундамент, каркас, утепление 200мм, окна, внешняя отделка" },
                    { name: "White Box", priceOffset: 700000, description: "Скрытая разводка коммуникаций, подготовка стен" },
                    { name: "Под ключ", priceOffset: 1500000, description: "Чистовая отделка, сантехника, электрика" }
                ]
            },
            {
                id: 'villa-120',
                name: "Вилла 120",
                type: "Премиум",
                area: "120 м²",
                dimensions: "10×12 м",
                floors: "2 этажа",
                time: "50 дней",
                price: "5 500 000",
                description: "Впечатляющий двухэтажный особняк с балконами и открытыми террасами на втором этаже.",
                image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800",
                images: [
                    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800"
                ],
                features: ["3 спальни", "2 гостиные", "2 санузла", "Мастер-люкс"],
                tags: ["Премиум", "Панорамные окна"],
                configurations: [
                    { name: "Теплый контур", priceOffset: 0, description: "Фундамент, каркас, утепление 200мм, окна, внешняя отделка" },
                    { name: "White Box", priceOffset: 1200000, description: "Скрытая разводка коммуникаций, подготовка стен" },
                    { name: "Под ключ", priceOffset: 2600000, description: "Чистовая отделка, сантехника, электрика" }
                ]
            }
        ]
    },
    {
        id: 'plywood',
        name: 'Модули INBOX / Фанера',
        description: 'Готовые решения с чистовой отделкой из высококачественной березовой фанеры. Решение "под ключ" с быстрой сборкой на участке за 1 день.',
        icon: Box,
        coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1600',
        layouts: [
            {
                id: 'plywood-31',
                name: "Дом 31 м²",
                type: "Студия",
                area: "26,2 м²",
                dimensions: "3,5 × 9 м",
                height: "2,8 м",
                floors: "1 этаж",
                time: "Монтаж за 1 день",
                price: "1 290 000",
                description: "Функциональная студия с панорамным остеклением. Отличное решение для базы отдыха или гостевого дома.",
                image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=800",
                floorPlan: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=800",
                images: [
                    "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
                ],
                features: ["Кухня-гостинная", "Санузел", "Терраса"],
                popular: false,
                tags: ["Студия", "Заводская сборка"],
                configurations: [
                    { name: "Базовая (Под ключ)", priceOffset: 0, description: "Чистовая отделка фанерой, скрытая разводка коммуникаций, готовый санузел" }
                ]
            },
            {
                id: 'plywood-42',
                name: "Дом 42 м²",
                type: "Комфорт",
                area: "34,6 м²",
                dimensions: "7 × 6 м",
                height: "2,8 м",
                floors: "1 этаж",
                time: "Монтаж за 1 день",
                price: "1 590 000",
                description: "Уютный дом с отдельной спальней и просторной кухней-столовой. Подходит для комфортного загородного отдыха.",
                image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
                images: [
                    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1623916949216-7afc8672074e?auto=format&fit=crop&q=80&w=800"
                ],
                features: ["Кухня-столовая", "Гостинная", "Спальня", "Санузел", "Терраса"],
                popular: false,
                tags: ["1 спальня", "Заводская сборка"],
                configurations: [
                    { name: "Базовая (Под ключ)", priceOffset: 0, description: "Чистовая отделка фанерой, скрытая разводка коммуникаций, готовый санузел" }
                ]
            },
            {
                id: 'plywood-49',
                name: "Дом 49 м²",
                type: "Семейный",
                area: "41,1 м²",
                dimensions: "7 × 7 м",
                height: "2,8 м",
                floors: "1 этаж",
                time: "Монтаж за 1 день",
                price: "1 790 000",
                description: "Квадратный в плане дом с рациональной планировкой. Выделенная спальная зона, большая кухня-столовая и гостиная.",
                image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800",
                images: [
                    "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800"
                ],
                features: ["Кухня-столовая", "Гостинная", "Спальня", "Санузел", "Терраса"],
                popular: true,
                tags: ["Популярный", "Заводская сборка"],
                configurations: [
                    { name: "Базовая (Под ключ)", priceOffset: 0, description: "Чистовая отделка фанерой, скрытая разводка коммуникаций, готовый санузел" }
                ]
            },
            {
                id: 'plywood-63',
                name: "Дом 63 м²",
                type: "Просторный",
                area: "54,6 м²",
                dimensions: "7 × 9 м",
                height: "2,8 м",
                floors: "1 этаж",
                time: "Монтаж за 1 день",
                price: "2 290 000",
                description: "Вместительный дом с двумя изолированными спальнями. Идеален для постоянного проживания семьи или комфортного отдыха на природе.",
                image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
                images: [
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
                ],
                features: ["Кухня-гостинная", "2 Спальни", "Санузел", "Терраса"],
                popular: false,
                tags: ["2 спальни", "Заводская сборка"],
                configurations: [
                    { name: "Базовая (Под ключ)", priceOffset: 0, description: "Чистовая отделка фанерой, скрытая разводка коммуникаций, готовый санузел" }
                ]
            },
            {
                id: 'plywood-77',
                name: "Дом 77 м²",
                type: "Премиум",
                area: "66,5 м²",
                dimensions: "7 × 11 м",
                height: "2,8 м",
                floors: "1 этаж",
                time: "Монтаж за 1 день",
                price: "2 590 000",
                description: "Самый просторный дом в линейке. Две большие спальни, огромная кухня-гостиная и комфортная терраса для всей семьи.",
                image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
                images: [
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1542314831-c6a4d14cdac8?auto=format&fit=crop&q=80&w=800"
                ],
                features: ["Кухня-гостинная", "2 Спальни", "Санузел", "Терраса"],
                popular: true,
                tags: ["Премиум", "Хит продаж"],
                configurations: [
                    { name: "Базовая (Под ключ)", priceOffset: 0, description: "Чистовая отделка фанерой, скрытая разводка коммуникаций, готовый санузел" }
                ]
            }
        ]
    }
];
