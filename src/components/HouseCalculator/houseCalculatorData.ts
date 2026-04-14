import type { HouseModel, HouseModelId, DeliveryRoute, ServiceEntry } from './houseCalcTypes';

// ==========================================
// 1. ТИПОВЫЕ ДОМА
// ==========================================
export const HOUSE_MODELS: HouseModel[] = [
    {
        id: 'dom42',
        name: 'Дом 42 м²',
        area: 42,
        basePrice: 1690000,
        description: 'Уютный дом с отдельной спальней и просторной кухней-столовой.',
        features: ['Кухня-столовая', 'Гостиная', 'Спальня', 'Санузел', 'Терраса'],
    },
    {
        id: 'dom49',
        name: 'Дом 49 м²',
        area: 49,
        basePrice: 1890000,
        description: 'Квадратный дом с рациональной планировкой и выделенной спальной зоной.',
        features: ['Кухня-столовая', 'Гостиная', 'Спальня', 'Санузел', 'Терраса'],
    },
    {
        id: 'dom63',
        name: 'Дом 63 м²',
        area: 63,
        basePrice: 2390000,
        description: 'Вместительный дом с двумя изолированными спальнями.',
        features: ['Кухня-гостиная', '2 Спальни', 'Санузел', 'Терраса'],
    },
    {
        id: 'dom77',
        name: 'Дом 77 м²',
        area: 77,
        basePrice: 2690000,
        description: 'Просторный семейный дом с большой кухней-гостиной.',
        features: ['Кухня-гостиная', '2 Спальни', 'Санузел', 'Терраса'],
    },
    {
        id: 'dom77o',
        name: 'Дом 77о м²',
        area: 77,
        basePrice: 2810000,
        description: 'Альтернативная планировка 77 м² с улучшенной конфигурацией.',
        features: ['Кухня-гостиная', '2 Спальни', 'Санузел', 'Терраса'],
    },
];

export const FOUNDATION_ASSEMBLY_DATA: Record<HouseModelId, { piles: number; assemblyPrice: number }> = {
    dom42: { piles: 18, assemblyPrice: 80000 },
    dom49: { piles: 21, assemblyPrice: 100000 },
    dom63: { piles: 24, assemblyPrice: 120000 },
    dom77: { piles: 28, assemblyPrice: 160000 },
    dom77o: { piles: 28, assemblyPrice: 160000 },
};
export const PILE_PRICE = 6950;

// ==========================================
// СТАНДАРТНАЯ КОМПЛЕКТАЦИЯ (Паспорт объекта)
// Всё что входит в базовую цену дома
// ==========================================
export interface SpecSection {
    title: string;
    items: { label: string; value: string }[];
}

export const STANDARD_SPECS: SpecSection[] = [
    {
        title: 'Пол (изнутри → наружу)',
        items: [
            { label: 'Напольное покрытие', value: 'Ламинат KREAFORTA 33 класс, толщина 8 мм (бюджет ~700 ₽/м²)' },
            { label: 'Напольное покрытие санузла', value: 'Кварц-винил 1 500 ₽/м²' },
            { label: 'Подоснова', value: 'Фанера 18 мм' },
            { label: 'Утеплитель', value: 'Knauf Insulation 037 Aquastatic, 150 мм' },
            { label: 'Лаги', value: '145×45 мм, доски камерной сушки, калиброванные' },
            { label: 'Ветрозащита', value: 'ONDUTISS PRO AM' },
        ],
    },
    {
        title: 'Стены (изнутри → наружу)',
        items: [
            { label: 'Внутренняя отделка', value: 'Фанера шлифованная 12 мм (без покраски)' },
            { label: 'Отделка санузла', value: 'Кварц-винил серый' },
            { label: 'Каркас', value: '145×45 мм, доски камерной сушки, калиброванные' },
            { label: 'Утеплитель', value: 'Knauf Insulation 037 Aquastatic, 150 мм' },
            { label: 'Ветрозащита', value: 'ONDUTISS PRO AM' },
            { label: 'Контробрешётка', value: '20×45 мм, брусок камерной сушки' },
            { label: 'Обрешётка / вентзазор', value: '20×90 мм, доски камерной сушки' },
            { label: 'Внешняя отделка', value: 'Полимерное покрытие Vimatt (цвет: Палисандр)' },
            { label: 'Отделка террасы и торцов спален', value: 'Планкен 90×18, сосна/ель, покраска 2 слоя DUFA Wood Protect' },
        ],
    },
    {
        title: 'Окна и двери',
        items: [
            { label: 'Профиль окон', value: 'ПВХ REHAU, профиль 70 мм, стеклопакет 40 мм' },
            { label: 'Тип окон в спальне', value: 'Горизонтальные' },
            { label: 'Внешняя ламинация окон', value: 'Нет (опция)' },
            { label: 'Межкомнатные двери', value: 'Albero vinyl Рим' },
        ],
    },
    {
        title: 'Кровля (изнутри → наружу)',
        items: [
            { label: 'Внутренняя отделка потолка', value: 'Фанера (без покраски)' },
            { label: 'Каркас', value: '145×45 мм, доски камерной сушки, калиброванные' },
            { label: 'Утеплитель', value: 'Knauf Insulation 037 Aquastatic, 150 мм' },
            { label: 'Ветрозащита', value: 'ONDUTISS PRO AM' },
            { label: 'Контробрешётка', value: '45×45 мм, брусок камерной сушки' },
            { label: 'Обрешётка', value: '25×100 мм, доски камерной сушки' },
            { label: 'Кровельное покрытие', value: 'Профлист МП-20, толщина 0,45 мм, RAL 7024' },
        ],
    },
    {
        title: 'Коммуникации и оборудование',
        items: [
            { label: 'Электрика', value: 'Полный комплект' },
            { label: 'Светильники внутренние', value: 'Встроенные GX53 Феррон — 18 шт' },
            { label: 'Светильники террасы', value: 'Встроенные GX53 Феррон' },
            { label: 'Розетки одинарные', value: 'Lezard Vesna, чёрные — 8 шт' },
            { label: 'Розетки двойные', value: 'Lezard Vesna, чёрные — 6 шт' },
            { label: 'Выключатели', value: 'Lezard Vesna, чёрные — 2 двухклав. + 2 одноклав.' },
            { label: 'Вентиляция', value: 'Приточный клапан 100 мм, вытяжной вентилятор 100 мм, 4 отверстия' },
            { label: 'Канализация', value: 'Труба 40–110 мм' },
            { label: 'Водоснабжение', value: 'Армированный полипропилен 20 мм' },
            { label: 'Кабель вводной', value: 'ВВГ НГ LS 5×6' },
            { label: 'Кабель розеток', value: 'ВВГ НГ LS 3×2,5' },
            { label: 'Кабель освещения', value: 'ВВГ НГ LS 2×1,5' },
            { label: 'Распределительный щит', value: 'IEK' },
            { label: 'Технический шкаф', value: 'Есть' },
        ],
    },
    {
        title: 'Дополнительно',
        items: [
            { label: 'Обработка террасы', value: 'Террасное масло Teknos Woodex Aqua Wood Oil, 2 слоя' },
            { label: 'Сетка от грызунов', value: 'Установлена' },
            { label: 'Лента для стыков', value: 'EUROVENT UNISAN' },
            { label: 'Высота выводов воды (душ)', value: '1 200 мм' },
        ],
    },
];

// ==========================================
// 2. ОПЦИИ — ИНЖЕНЕРНЫЕ ЭЛЕМЕНТЫ
// ==========================================
export const ENGINEERING_OPTIONS = {
    lightingCable: { name: 'Вывод кабеля освещения', price: 3000, unit: 'шт' },
    warmTap: { name: 'Тёплый кран на улицу', price: 12000, unit: 'шт' },
    lightSwitch: { name: 'Переключатель на свет (1 группа)', price: 15000, unit: 'шт' },
    extraSocket: { name: 'Дополнительная розетка', price: 4000, unit: 'шт' },
    spotlight: { name: 'Дополнительный точечный светильник', price: 4000, unit: 'шт' },
    streetLight: { name: 'Дополнительный уличный светильник', price: 8000, unit: 'шт' },
    acPrep: { name: 'Подготовка под кондиционер', price: 10000, unit: 'шт' },
    wetPointSplit: { name: 'Разрыв мокрой точки (кухня не примыкает к СУ)', price: 60000 },
    convector: { name: 'Внутрипольный конвектор 1600–1800', price: 60000, unit: 'шт' },
    breezer80: { name: 'Бризер Ballu ONEAIR ASP-80', price: 30000, unit: 'шт' },
    breezer100: { name: 'Бризер Ballu ONEAIR ASP-100 с датчиком CO₂', price: 60000, unit: 'шт' },
    warmFloorThermostat: { name: 'Терморегулятор к водяному ТП (1 помещение)', price: 15000, unit: 'шт' },
    electricWarmFloorThermostat: { name: 'Терморегулятор к электро-ТП', price: 3000, unit: 'шт' },
};

// Тёплый пол — цены зависят от модели дома
export const WARM_FLOOR_PRICES: Record<HouseModelId, number> = {
    dom42: 150000,
    dom49: 170000,
    dom63: 200000,
    dom77: 240000,
    dom77o: 240000,
};

// ==========================================
// 3. ОПЦИИ — КАРКАС (цены по моделям)
// ==========================================
export const FRAME_OPTIONS = {
    moduleExtend: {
        name: 'Увеличение длины модуля на 60 см',
        priceByModel: { dom42: 250000, dom49: 250000 } as Partial<Record<HouseModelId, number>>,
        unit: 'шт',
    },
    mouseMesh: {
        name: 'Сетка от грызунов на основание дома',
        priceByModel: { dom42: 30000, dom49: 35000, dom63: 45000, dom77: 50000, dom77o: 50000 } as Record<HouseModelId, number>,
    },
    extraInsulation: {
        name: 'Доп. утепление стен до 200 мм',
        priceByModel: { dom42: 70000, dom49: 80000, dom63: 90000, dom77: 100000, dom77o: 100000 } as Record<HouseModelId, number>,
    },
    removePartition: {
        name: 'Убрать перегородку между модулями (опен спейс)',
        price: 120000,
    },
    extraPartition: {
        name: 'Доп. перегородка (тамбур и прочее)',
        price: 20000,
        unit: 'м.п.',
        availableFor: ['dom77o'] as HouseModelId[],
    },
};

// ==========================================
// 4. ОПЦИИ — ОКНА/ДВЕРИ
// ==========================================
export const WINDOW_OPTIONS = {
    safeDoor: {
        name: 'Входная сейф-дверь + крыльцо (1×1,2м) + 3 ступени',
        price: 115000,
        availableFor: ['dom42', 'dom49', 'dom63', 'dom77o'] as HouseModelId[],
    },
    relocateDoor: {
        name: 'Перенос ПВХ двери на боковую стену + крыльцо + 3 ступени',
        price: 80000,
        availableFor: ['dom42', 'dom49', 'dom63'] as HouseModelId[],
    },
    panoramicTrapezoid: {
        name: 'Замена горизонт. окна на панорамное трапециевидное',
        price: 60000,
        unit: 'шт',
    },
    extraPanoramicSection: {
        name: 'Доп. секция к панорамному остеклению кухни-гостиной',
        price: 60000,
    },
    win1000x2000: { name: 'Дополнительное окно 1000×2000 мм', price: 70000, unit: 'шт' },
    win500x2000: { name: 'Доп. глухое окно 500×2000 мм', price: 50000, unit: 'шт' },
    win600x500: { name: 'Дополнительное окно 600×500 мм', price: 30000, unit: 'шт' },
    win1500x500: { name: 'Дополнительное окно 1500×500 мм', price: 40000, unit: 'шт' },
    windowLamination: { name: 'Ламинация окон снаружи в RAL7024', price: 40000 },
};

// ==========================================
// 5. ОПЦИИ — ВНЕШНЯЯ ОТДЕЛКА (цены по моделям)
// ==========================================
export const EXTERIOR_OPTIONS = {
    facadePlanken: {
        name: 'Отделка фасада — Планкен 90×18, покраска 2 слоя',
        priceByModel: { dom42: 60000, dom49: 75000, dom63: 90000, dom77: 100000, dom77o: 100000 } as Record<HouseModelId, number>,
    },
    gutterPlastic: {
        name: 'Водосточная система (пластик)',
        priceByModel: { dom42: 70000, dom49: 80000, dom63: 90000, dom77: 100000, dom77o: 100000 } as Record<HouseModelId, number>,
    },
    gutterMetal: {
        name: 'Водосточная система (металл)',
        priceByModel: { dom42: 100000, dom49: 120000, dom63: 140000, dom77: 150000, dom77o: 150000 } as Record<HouseModelId, number>,
    },
    plinthPlanken: {
        name: 'Обшивка цоколя планкеном',
        price: 3000,
        unit: 'м²',
    },
};

// ==========================================
// 6. ОПЦИИ — ВНУТРЕННЯЯ ОТДЕЛКА (цены по моделям)
// ==========================================
export const INTERIOR_FINISH_OPTIONS = {
    wallVagonka: {
        name: 'Отделка стен — вагонка штиль',
        priceByModel: { dom42: 60000, dom49: 75000, dom63: 100000, dom77: 120000, dom77o: 120000 } as Record<HouseModelId, number>,
    },
    wallImitBrus: {
        name: 'Отделка стен — имитация бруса',
        priceByModel: { dom42: 80000, dom49: 100000, dom63: 130000, dom77: 150000, dom77o: 150000 } as Record<HouseModelId, number>,
    },
    wallGipsokarton: {
        name: 'Отделка стен — гипсокартон',
        priceByModel: { dom42: 60000, dom49: 75000, dom63: 100000, dom77: 120000, dom77o: 120000 } as Record<HouseModelId, number>,
    },
    ceilingFanera: {
        name: 'Отделка потолка — фанера',
        priceByModel: { dom42: 50000, dom49: 60000, dom63: 80000, dom77: 90000, dom77o: 90000 } as Record<HouseModelId, number>,
    },
    ceilingImitBrus: {
        name: 'Отделка потолка — имитация бруса / вагонка штиль',
        priceByModel: { dom42: 40000, dom49: 50000, dom63: 65000, dom77: 75000, dom77o: 75000 } as Record<HouseModelId, number>,
    },
    paintWalls: {
        name: 'Покраска стен (2 слоя Тиккурила Евро Тренд)',
        priceByModel: { dom42: 30000, dom49: 35000, dom63: 42000, dom77: 50000, dom77o: 50000 } as Record<HouseModelId, number>,
    },
    paintCeiling: {
        name: 'Покраска потолка (2 слоя Тиккурила Евро Тренд)',
        priceByModel: { dom42: 18000, dom49: 22000, dom63: 27000, dom77: 30000, dom77o: 30000 } as Record<HouseModelId, number>,
    },
    keramogranit: {
        name: 'Монтаж керамогранита (бюджет керамогранита 2000 ₽)',
        price: 9000,
        unit: 'м²',
    },
    extraInteriorDoor: {
        name: 'Дополнительная межкомнатная дверь',
        price: 30000,
        unit: 'шт',
    },
};

// ==========================================
// 7. ОПЦИИ — ТЕРРАСА / КРЫЛЬЦО
// ==========================================
export const TERRACE_OPTIONS = {
    terraceCloseSide: {
        name: 'Закрытие проёма террасы (одна сторона)',
        price: 25000,
        unit: 'шт',
    },
    porchCanopy: {
        name: 'Навес над крыльцом',
        price: 65000,
        availableFor: ['dom77o'] as HouseModelId[],
    },
    closedTerraceArea: {
        name: 'Доп. площадь закрытой террасы (без свай)',
        price: 16000,
        unit: 'м²',
    },
    openTerraceArea: {
        name: 'Доп. площадь открытой террасы (без свай)',
        price: 9000,
        unit: 'м²',
    },
    railingsPlanken: {
        name: 'Перила (планкен горизонтальный)',
        price: 6000,
        unit: 'п.м.',
    },
    railingsCross: {
        name: 'Перила (узор крестик)',
        price: 10000,
        unit: 'п.м.',
    },
};

// ==========================================
// 8. САНУЗЕЛ — цены за м²
// ==========================================
export const BATHROOM_PRICES = {
    floor: {
        quartzVinyl: { name: 'Кварцвинил', price: 1500 },
        keramogranit: { name: 'Керамогранит', price: 9000 },
        laminateWP: { name: 'Ламинат водостойкий', price: 1590 },
    },
    wall: {
        keramogranit: { name: 'Керамогранит', price: 9000 },
        quartzVinyl: { name: 'Кварцвинил', price: 1500 },
        imitationWood: { name: 'Имитация бруса', price: 970 },
        fanera: { name: 'Фанера', price: 450 },
    },
};

// Пол — цены за м² (из pricingConfig)
export const FLOOR_PRICES = {
    laminateWP: { name: 'Ламинат 33 кл. водостойкий', price: 1590 },
    quartzVinyl: { name: 'Кварцвинил (SPC)', price: 1500 },
    linoleum: { name: 'Линолеум', price: 600 },
    boardPine: { name: 'Половая доска (Хвоя)', price: 1000 },
    boardLarch: { name: 'Половая доска (Лиственница)', price: 1600 },
};

// ==========================================
// 9. ДОП. УСЛУГИ — конструктор по позициям
// ==========================================
export const SERVICE_CATALOG: Omit<ServiceEntry, 'quantity'>[] = [
    // Фундамент
    { id: 'pile_2500', category: 'Фундамент', name: 'Свая 73ф', specs: '2500мм', unit: 'шт', price: 6000 },
    { id: 'pile_3000', category: 'Фундамент', name: 'Свая 73ф', specs: '3000мм', unit: 'шт', price: 6800 },
    { id: 'pile_3500', category: 'Фундамент', name: 'Свая 73ф', specs: '3500мм', unit: 'шт', price: 7300 },
    // Септик
    { id: 'ring_700', category: 'Септик', name: 'Кольцо ЖБ', specs: '700мм', unit: 'шт', price: 2800 },
    { id: 'ring_1000', category: 'Септик', name: 'Кольцо ЖБ', specs: '1000мм', unit: 'шт', price: 3200 },
    { id: 'ring_1500', category: 'Септик', name: 'Кольцо ЖБ', specs: '1500мм', unit: 'шт', price: 5800 },
    { id: 'lid_1000', category: 'Септик', name: 'Крышка колодца ЖБ', specs: '1000мм', unit: 'шт', price: 2800 },
    { id: 'lid_1500', category: 'Септик', name: 'Крышка колодца ЖБ', specs: '1500мм', unit: 'шт', price: 5500 },
    { id: 'manhole_pvh', category: 'Септик', name: 'Люк для колодца ПВХ', specs: '3т', unit: 'шт', price: 1250 },
    { id: 'tractor', category: 'Септик', name: 'Трактор JCB', specs: '1 смена', unit: 'смена', price: 25000 },
    { id: 'pipe_110', category: 'Септик', name: 'Труба канализ. наружная 110', specs: '1м', unit: 'м', price: 570 },
    { id: 'insul_110', category: 'Септик', name: 'Скорлупа ППС 110×50×1000мм', specs: '1м', unit: 'м', price: 580 },
    { id: 'consumables', category: 'Септик', name: 'Расходка', specs: '1м/1колод', unit: 'компл.', price: 620 },
    { id: 'septic_work', category: 'Септик', name: 'Работы', specs: '1 смена', unit: 'смена', price: 20000 },
    { id: 'septic_delivery', category: 'Септик', name: 'Доставка', specs: '1 комплект', unit: 'компл.', price: 10000 },
    { id: 'gravel', category: 'Септик', name: 'Щебень/отсев', specs: '1 машина', unit: 'маш.', price: 20000 },
    { id: 'septic_connect', category: 'Септик', name: 'Подключение септика к дому', specs: '', unit: 'компл.', price: 5000 },
    { id: 'drain_bath', category: 'Септик', name: 'Дренаж для бани', specs: '1 комплект', unit: 'компл.', price: 35000 },
    // Скважина
    { id: 'well_drilling', category: 'Скважина', name: 'Бурение скважины', specs: '', unit: 'м.п.', price: 2500 },
    { id: 'well_pump', category: 'Скважина', name: 'Насос', specs: '', unit: 'шт', price: 12000 },
    { id: 'well_head', category: 'Скважина', name: 'Оголовок 168мм', specs: '', unit: 'шт', price: 3500 },
    { id: 'well_cable', category: 'Скважина', name: 'Трос нержавейка 4мм', specs: '', unit: 'м', price: 50 },
    { id: 'well_parts', category: 'Скважина', name: 'Комплектующие', specs: '', unit: 'компл.', price: 2500 },
    { id: 'well_binding', category: 'Скважина', name: 'Работы по обвязке скважины', specs: '', unit: 'компл.', price: 7000 },
    { id: 'well_insul', category: 'Скважина', name: 'Утеплитель для труб', specs: 'полиуретан 13мм', unit: 'м', price: 110 },
    { id: 'heat_cable', category: 'Скважина', name: 'Греющий кабель', specs: '', unit: 'м', price: 250 },
    { id: 'pnd_pipe', category: 'Скважина', name: 'Труба ПНД 32ф', specs: '', unit: 'м', price: 60 },
    { id: 'water_laying', category: 'Скважина', name: 'Прокладка водоподведения', specs: '', unit: 'м', price: 700 },
    { id: 'water_connect', category: 'Скважина', name: 'Подключение воды к дому', specs: '', unit: 'компл.', price: 7000 },
    // Электричество
    { id: 'electric_connect', category: 'Электричество', name: 'Подключение к электричеству объект', specs: '', unit: 'компл.', price: 5000 },
    // Забор
    { id: 'fence', category: 'Забор', name: 'Забор Профлист МП-20, высота 2м', specs: '', unit: 'м.п.', price: 4200 },
    // Монтаж
    { id: 'module_install', category: 'Монтаж', name: 'Монтаж модуля (бани)', specs: '1 модуль', unit: 'шт', price: 5000 },
];

// ==========================================
// 10. ДОСТАВКА — маршруты из Берёзы
// ==========================================
export const DELIVERY_ROUTES: DeliveryRoute[] = [
    { region: 'Свердловская', rateOversizePerKm: 500, rateStandardPerKm: 46, distance: 25, priceStandard1Tral: 1380, priceOversize1Tral: 15625, priceOversize2Tral: 31250 },
    { region: 'Челябинская', rateOversizePerKm: 510, rateStandardPerKm: 222, distance: 224, priceStandard1Tral: 59674, priceOversize1Tral: 142800, priceOversize2Tral: 285600 },
    { region: 'Курганская', rateOversizePerKm: 400, rateStandardPerKm: 160, distance: 380, priceStandard1Tral: 72960, priceOversize1Tral: 190000, priceOversize2Tral: 380000 },
    { region: 'Тюменская', rateOversizePerKm: 400, rateStandardPerKm: 332, distance: 550, priceStandard1Tral: 219120, priceOversize1Tral: 275000, priceOversize2Tral: 550000 },
    { region: 'Пермский край', rateOversizePerKm: 450, rateStandardPerKm: 380, distance: 576, priceStandard1Tral: 262656, priceOversize1Tral: 324000, priceOversize2Tral: 648000 },
    { region: 'Башкортостан', rateOversizePerKm: 320, rateStandardPerKm: 160, distance: 590, priceStandard1Tral: 113280, priceOversize1Tral: 236000, priceOversize2Tral: 472000 },
    { region: 'Удмуртская', rateOversizePerKm: 270, rateStandardPerKm: 160, distance: 700, priceStandard1Tral: 134400, priceOversize1Tral: 236250, priceOversize2Tral: 472500 },
    { region: 'Кировская', rateOversizePerKm: 280, rateStandardPerKm: 210, distance: 870, priceStandard1Tral: 219240, priceOversize1Tral: 304500, priceOversize2Tral: 609000 },
    { region: 'Оренбургская', rateOversizePerKm: 250, rateStandardPerKm: 95, distance: 930, priceStandard1Tral: 106020, priceOversize1Tral: 290625, priceOversize2Tral: 581250 },
    { region: 'Татарстан', rateOversizePerKm: 270, rateStandardPerKm: 95, distance: 930, priceStandard1Tral: 106020, priceOversize1Tral: 313875, priceOversize2Tral: 627750 },
    { region: 'Самарская', rateOversizePerKm: 235, rateStandardPerKm: 120, distance: 980, priceStandard1Tral: 141120, priceOversize1Tral: 287875, priceOversize2Tral: 575750 },
    { region: 'Омская', rateOversizePerKm: 200, rateStandardPerKm: 140, distance: 1000, priceStandard1Tral: 168000, priceOversize1Tral: 250000, priceOversize2Tral: 500000 },
    { region: 'Чувашская Республика', rateOversizePerKm: 250, rateStandardPerKm: 190, distance: 1050, priceStandard1Tral: 239400, priceOversize1Tral: 328125, priceOversize2Tral: 656250 },
    { region: 'ХМАО', rateOversizePerKm: 230, rateStandardPerKm: 190, distance: 1100, priceStandard1Tral: 261250, priceOversize1Tral: 316250, priceOversize2Tral: 632500 },
    { region: 'Ульяновская', rateOversizePerKm: 240, rateStandardPerKm: 100, distance: 1200, priceStandard1Tral: 144000, priceOversize1Tral: 360000, priceOversize2Tral: 720000 },
    { region: 'Мордовия', rateOversizePerKm: 230, rateStandardPerKm: 85, distance: 1300, priceStandard1Tral: 132600, priceOversize1Tral: 373750, priceOversize2Tral: 747500 },
    { region: 'Нижегородская', rateOversizePerKm: 210, rateStandardPerKm: 100, distance: 1310, priceStandard1Tral: 157200, priceOversize1Tral: 343875, priceOversize2Tral: 687750 },
    { region: 'Саратовская', rateOversizePerKm: 190, rateStandardPerKm: 85, distance: 1350, priceStandard1Tral: 137700, priceOversize1Tral: 320625, priceOversize2Tral: 641250 },
    { region: 'Владимирская', rateOversizePerKm: 190, rateStandardPerKm: 100, distance: 1520, priceStandard1Tral: 182400, priceOversize1Tral: 361000, priceOversize2Tral: 722000 },
    { region: 'Ивановская', rateOversizePerKm: 210, rateStandardPerKm: 100, distance: 1560, priceStandard1Tral: 187200, priceOversize1Tral: 409500, priceOversize2Tral: 819000 },
    { region: 'Новосибирская', rateOversizePerKm: 200, rateStandardPerKm: 140, distance: 1580, priceStandard1Tral: 265440, priceOversize1Tral: 395000, priceOversize2Tral: 790000 },
    { region: 'Ярославская', rateOversizePerKm: 200, rateStandardPerKm: 100, distance: 1580, priceStandard1Tral: 189600, priceOversize1Tral: 395000, priceOversize2Tral: 790000 },
    { region: 'Тамбовская', rateOversizePerKm: 210, rateStandardPerKm: 160, distance: 1630, priceStandard1Tral: 312960, priceOversize1Tral: 427875, priceOversize2Tral: 855750 },
    { region: 'Рязанская', rateOversizePerKm: 190, rateStandardPerKm: 100, distance: 1700, priceStandard1Tral: 204000, priceOversize1Tral: 403750, priceOversize2Tral: 807500 },
    { region: 'ЯНАО', rateOversizePerKm: 210, rateStandardPerKm: 140, distance: 1700, priceStandard1Tral: 285600, priceOversize1Tral: 446250, priceOversize2Tral: 892500 },
    { region: 'Волгоградская', rateOversizePerKm: 220, rateStandardPerKm: 120, distance: 1750, priceStandard1Tral: 252000, priceOversize1Tral: 481250, priceOversize2Tral: 962500 },
    { region: 'Калужская', rateOversizePerKm: 190, rateStandardPerKm: 120, distance: 1810, priceStandard1Tral: 260640, priceOversize1Tral: 429875, priceOversize2Tral: 859750 },
    { region: 'МО (Москва)', rateOversizePerKm: 190, rateStandardPerKm: 100, distance: 1810, priceStandard1Tral: 217200, priceOversize1Tral: 429875, priceOversize2Tral: 859750 },
    { region: 'Тульская', rateOversizePerKm: 190, rateStandardPerKm: 100, distance: 1840, priceStandard1Tral: 220800, priceOversize1Tral: 437000, priceOversize2Tral: 874000 },
    { region: 'Томская', rateOversizePerKm: 220, rateStandardPerKm: 160, distance: 1860, priceStandard1Tral: 357120, priceOversize1Tral: 511500, priceOversize2Tral: 1023000 },
    { region: 'Липецкая', rateOversizePerKm: 210, rateStandardPerKm: 160, distance: 1870, priceStandard1Tral: 359040, priceOversize1Tral: 490875, priceOversize2Tral: 981750 },
    { region: 'Воронежская', rateOversizePerKm: 190, rateStandardPerKm: 120, distance: 1910, priceStandard1Tral: 275040, priceOversize1Tral: 453625, priceOversize2Tral: 907250 },
    { region: 'Алтайский край', rateOversizePerKm: 210, rateStandardPerKm: 0, distance: 2020, priceStandard1Tral: 0, priceOversize1Tral: 530250, priceOversize2Tral: 1060500 },
    { region: 'Тверская', rateOversizePerKm: 200, rateStandardPerKm: 100, distance: 2100, priceStandard1Tral: 252000, priceOversize1Tral: 525000, priceOversize2Tral: 1050000 },
    { region: 'Кемеровская', rateOversizePerKm: 200, rateStandardPerKm: 140, distance: 2130, priceStandard1Tral: 357840, priceOversize1Tral: 532500, priceOversize2Tral: 1065000 },
    { region: 'Белгородская', rateOversizePerKm: 210, rateStandardPerKm: 0, distance: 2170, priceStandard1Tral: 0, priceOversize1Tral: 569625, priceOversize2Tral: 1139250 },
    { region: 'Курская', rateOversizePerKm: 200, rateStandardPerKm: 120, distance: 2250, priceStandard1Tral: 324000, priceOversize1Tral: 562500, priceOversize2Tral: 1125000 },
    { region: 'Ростовская', rateOversizePerKm: 190, rateStandardPerKm: 110, distance: 2270, priceStandard1Tral: 299640, priceOversize1Tral: 539125, priceOversize2Tral: 1078250 },
    { region: 'ЛО (Ленингр. обл.)', rateOversizePerKm: 180, rateStandardPerKm: 120, distance: 2280, priceStandard1Tral: 328320, priceOversize1Tral: 513000, priceOversize2Tral: 1026000 },
    { region: 'Брянская', rateOversizePerKm: 210, rateStandardPerKm: 140, distance: 2300, priceStandard1Tral: 386400, priceOversize1Tral: 603750, priceOversize2Tral: 1207500 },
    { region: 'Красноярский край', rateOversizePerKm: 200, rateStandardPerKm: 140, distance: 2350, priceStandard1Tral: 394800, priceOversize1Tral: 587500, priceOversize2Tral: 1175000 },
    { region: 'Смоленская', rateOversizePerKm: 180, rateStandardPerKm: 100, distance: 2400, priceStandard1Tral: 288000, priceOversize1Tral: 540000, priceOversize2Tral: 1080000 },
    { region: 'Крым', rateOversizePerKm: 210, rateStandardPerKm: 110, distance: 2410, priceStandard1Tral: 318120, priceOversize1Tral: 632625, priceOversize2Tral: 1265250 },
    { region: 'Ставропольский край', rateOversizePerKm: 200, rateStandardPerKm: 110, distance: 2440, priceStandard1Tral: 322080, priceOversize1Tral: 610000, priceOversize2Tral: 1220000 },
    { region: 'Республика Сев. Осетия', rateOversizePerKm: 235, rateStandardPerKm: 140, distance: 2570, priceStandard1Tral: 431760, priceOversize1Tral: 754938, priceOversize2Tral: 1509875 },
    { region: 'Хакасия', rateOversizePerKm: 200, rateStandardPerKm: 140, distance: 2590, priceStandard1Tral: 435120, priceOversize1Tral: 647500, priceOversize2Tral: 1295000 },
    { region: 'Краснодарский край', rateOversizePerKm: 210, rateStandardPerKm: 110, distance: 2600, priceStandard1Tral: 343200, priceOversize1Tral: 682500, priceOversize2Tral: 1365000 },
    { region: 'Дагестан', rateOversizePerKm: 250, rateStandardPerKm: 160, distance: 2700, priceStandard1Tral: 518400, priceOversize1Tral: 843750, priceOversize2Tral: 1687500 },
    { region: 'Мурманская', rateOversizePerKm: 220, rateStandardPerKm: 120, distance: 3100, priceStandard1Tral: 446400, priceOversize1Tral: 852500, priceOversize2Tral: 1705000 },
    { region: 'Иркутская', rateOversizePerKm: 210, rateStandardPerKm: 110, distance: 3800, priceStandard1Tral: 501600, priceOversize1Tral: 997500, priceOversize2Tral: 1995000 },
    { region: 'Хабаровский', rateOversizePerKm: 170, rateStandardPerKm: 110, distance: 6600, priceStandard1Tral: 871200, priceOversize1Tral: 1402500, priceOversize2Tral: 2805000 },
    { region: 'Приморский', rateOversizePerKm: 170, rateStandardPerKm: 110, distance: 8400, priceStandard1Tral: 1108800, priceOversize1Tral: 1785000, priceOversize2Tral: 3570000 },
];
