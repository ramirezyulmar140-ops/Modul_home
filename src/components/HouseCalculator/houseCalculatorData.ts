import type { HouseModel, HouseModelId, ServiceEntry } from './houseCalcTypes';

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
        modulesCount: 3,
    },
    {
        id: 'dom49',
        name: 'Дом 49 м²',
        area: 49,
        basePrice: 1890000,
        description: 'Квадратный дом с рациональной планировкой и выделенной спальной зоной.',
        features: ['Кухня-столовая', 'Гостиная', 'Спальня', 'Санузел', 'Терраса'],
        modulesCount: 3,
    },
    {
        id: 'dom63',
        name: 'Дом 63 м²',
        area: 63,
        basePrice: 2390000,
        description: 'Вместительный дом с двумя изолированными спальнями.',
        features: ['Кухня-гостиная', '2 Спальни', 'Санузел', 'Терраса'],
        modulesCount: 4,
    },
    {
        id: 'dom77',
        name: 'Дом 77 м²',
        area: 77,
        basePrice: 2690000,
        description: 'Просторный семейный дом с большой кухней-гостиной.',
        features: ['Кухня-гостиная', '2 Спальни', 'Санузел', 'Терраса'],
        modulesCount: 5,
    },
    {
        id: 'dom77o',
        name: 'Дом 77о м²',
        area: 77,
        basePrice: 2810000,
        description: 'Альтернативная планировка 77 м² с улучшенной конфигурацией.',
        features: ['Кухня-гостиная', '2 Спальни', 'Санузел', 'Терраса'],
        modulesCount: 5,
    },
];

export const FOUNDATION_ASSEMBLY_DATA: Record<HouseModelId, { piles: number; assemblyPrice: number }> = {
    dom42: { piles: 18, assemblyPrice: 80000 },
    dom49: { piles: 21, assemblyPrice: 100000 },
    dom63: { piles: 24, assemblyPrice: 120000 },
    dom77: { piles: 28, assemblyPrice: 160000 },
    dom77o: { piles: 28, assemblyPrice: 160000 },
};



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
    acPrep: { name: 'Подготовка под конд.', price: 10000, unit: 'шт' },
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
    windowLaminationInside: { name: 'Ламинация окон внутри', price: 40000 },
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

