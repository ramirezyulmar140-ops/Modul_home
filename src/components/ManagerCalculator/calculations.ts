import { PRICING_CONFIG, CALCULATIONS_CONFIG } from './pricingConfig';

export interface HouseParams {
    length: number;      // Длина, м
    width: number;       // Ширина, м
    height: number;      // Высота этажа, м
    innerWallsLength: number; // Длина перегородок, м
    modulesCount: number;  // Количество модулей

    // Дополнительные параметры из 3 версии калькулятора
    windowsPercent: number; // Доля остекления фасада, %
    doorsCount: number;  // Количество входных дверей
    interiorDoorsCount: number; // Межкомнатные двери

    // Геометрия крыши
    roofAngle: number;   // Угол крыши, градусов
    roofOverhangStr: number; // Свес со стороны карниза, м
    roofOverhangPlumb: number; // Свес со стороны фронтона, м

    // Шаги конструкций
    wallStudStep: number;   // Шаг стоек стен, м
    floorJoistStep: number; // Шаг лаг пола, м
    roofRafterStep: number; // Шаг стропил, м

    // Отделка
    floorFinish: 'laminate' | 'laminateWaterproof' | 'quartzVinyl' | 'linoleum' | 'floorBoardPine' | 'floorBoardLarch';
    interiorWallFinish: 'imitationWood' | 'drywall' | 'woodLining' | 'blockHouse' | 'plywood';
    ceilingFinish: 'imitationWood' | 'drywall' | 'woodLining' | 'stretchCeiling' | 'plywood';
    exteriorWallFinish: 'combined' | 'planken' | 'proflistWall'; // combined = планкен на фронтонах + профлист по длине
    roofFinish: 'proflistRoof' | 'metalTile' | 'clickfalz';

    // Утепление (толщина в мм)
    floorInsulationThickness: number;
    wallInsulationThickness: number;
    roofInsulationThickness: number;

    // Инженерия
    electricalType: 'none' | 'basic' | 'advanced';
    heatingType: 'none' | 'electricFloor' | 'waterFloor' | 'convectors' | 'onlyWiring';
    heatingThermostatsCount: number;
    heatingElectricFloorArea: number;

    // Опции
    isPainted: boolean;
    roofType: 'shed' | 'gable'; // Односкатная / двускатная

    // --- ДОПОЛНИТЕЛЬНЫЕ ОПЦИИ ИЗ ТАБЛИЦЫ ---
    // Инженерия
    optLightingCableCount: number;
    optBreezerCount: number;
    optWarmTapCount: number;
    optSocketCount: number;
    optSpotlightCount: number;
    optStreetLightCount: number;
    optAcPrepCount: number;
    optWetPointSplit: boolean;

    // Каркас
    optModuleExtendCount: number;
    optPartition: boolean;
    optTambour: boolean;

    // Двери и Окна
    optSafeDoor: boolean;
    optPanWindow3: boolean;
    optPanWindow2: boolean;
    optWin100x200Count: number;
    optWin50x200Count: number;
    optWin60x50Count: number;
    optWin150x50Count: number;

    // Внешняя отделка (водосточка, цоколь)
    optGutterPlastic: boolean;
    optGutterMetal: boolean;
    optPlinthPlanken: boolean;

    // Терраса / Крыльцо
    optTerraceCloseCount: number;
    optCanopy: boolean;
    optTerraceArea: number; // м2
    optRailingsLength: number; // пог. м
    optRailingsCrossLength: number; // пог. м
    optPorchStepCount: number;
    optTerraceStepCount: number;

    // --- ФИНАНСЫ И КЛИЕНТ (Новое) ---
    discountPercent: number;    // Скидка в %
    markupAmount: number;       // Наценка в руб.
    materialPercent: number;     // Доля материалов в цене дома (%)
    customItems: EstimateItem[]; // Произвольные позиции
    clientName: string;
    managerName: string;
    kpNumber: string;
    kpDate: string;

    // Скрытие разделов
    hideFoundationAndAssembly: boolean;

    // Санузел
    bathroomFloorArea: number;
    bathroomFloorFinish: 'quartzVinyl' | 'keramogranit' | 'laminateWaterproof';
    bathroomWallFinish: 'keramogranit' | 'quartzVinyl' | 'imitationWood' | 'plywood';
}

export interface EstimateSection {
    name: string;
    items: EstimateItem[];
    total: number;
    hideItems?: boolean;
    passportItems?: string[];
}

export interface EstimateItem {
    name: string;
    quantity: number;
    unit: string;
    price: number;
    total: number;
}

export interface EstimateResult {
    sections: EstimateSection[];
    grandTotal: number;
    materialsTotal: number;
    baseTotal: number;      // Цена до скидок и наценок
    hiddenTotal: number; // Для внутреннего пользования
}

export function calculateEstimate(params: HouseParams): EstimateResult {
    const sections: EstimateSection[] = [];

    // Валидация входных данных
    const length = Math.max(2, params.length);
    const width = Math.max(2, params.width);
    const height = Math.max(2, params.height) + 0.2; // +0.2м запас на отходы по высоте стен
    const innerWallsLength = Math.max(0, params.innerWallsLength);
    const windowsPercent = Math.min(80, Math.max(0, params.windowsPercent));

    // Автоматическая корректировка шага для отделки фанерой
    const isPlywood = params.interiorWallFinish === 'plywood' || params.ceilingFinish === 'plywood';
    const actualWallStudStep = isPlywood ? 1.2 : params.wallStudStep;
    const actualRoofRafterStep = isPlywood ? 1.2 : params.roofRafterStep;

    // 1. Базовая Геометрия
    const floorArea = length * width; // Площадь пола (Sпол)
    const perimeter = (length + width) * 2; // Периметр стен
    const outerWallAreaGross = perimeter * height; // Площадь внешних стен грязная

    // Расчет окон по проценту от площади внешних стен
    const windowsArea = parseFloat((outerWallAreaGross * (windowsPercent / 100)).toFixed(2));
    const outerWallAreaNet = outerWallAreaGross - windowsArea - (params.doorsCount * 2); // за вычетом окон и дверей
    const innerWallAreaGross = innerWallsLength * height * 2; // Перегородки с двух сторон

    // Модульные стены: между модулями двойные стены, их внутренняя отделка не считается
    const moduleWallsCount = Math.max(0, params.modulesCount - 1); // Кол-во межмодульных стыков
    const moduleWallArea = moduleWallsCount * 2 * length * height; // 2 поверхности на каждый стык

    // Площадь стен для внутренней отделки (без межмодульных стен)
    const finishableWallArea = Math.max(0, outerWallAreaNet + innerWallAreaGross - moduleWallArea);

    const bathroomWallArea = params.bathroomFloorArea > 0 
        ? parseFloat((Math.sqrt(params.bathroomFloorArea) * 4 * height).toFixed(2))
        : 0;

    // Площади для общей отделки (за вычетом санузла)
    const generalFloorArea = Math.max(0, floorArea - params.bathroomFloorArea);
    const generalWallArea = Math.max(0, finishableWallArea - bathroomWallArea);

    // Кровля: Пятно с учетом свесов 
    // Длина ската = (Ширина здания / 2 + карнизный свес) / cos(угол)
    const actualRoofAngle = params.roofType === 'shed' ? 10 : params.roofAngle; // У односкатной наклон меньше ~10 градусов
    const angleRad = actualRoofAngle * (Math.PI / 180);
    let slopeLength = 0;
    let roofArea = 0;

    if (params.roofType === 'gable') {
        slopeLength = ((width / 2) + params.roofOverhangStr) / Math.cos(angleRad);
        roofArea = slopeLength * 2 * (length + params.roofOverhangPlumb * 2);
    } else {
        slopeLength = (width + params.roofOverhangStr * 2) / Math.cos(angleRad);
        roofArea = slopeLength * (length + params.roofOverhangPlumb * 2);
    }
    roofArea = parseFloat(roofArea.toFixed(2));
    // -------------------------------------------------------------------------------- //
    // РАЗДЕЛ 1: ФУНДАМЕНТ
    // -------------------------------------------------------------------------------- //
    if (!params.hideFoundationAndAssembly) {
        const foundationItems: EstimateItem[] = [];
        // Шаг свай максимум 2 метра (сетка)
        const pilesLength = Math.ceil(length / 2) + 1;
        const pilesWidth = Math.ceil(width / 2) + 1;
        const pilesTotal = pilesLength * pilesWidth;

        foundationItems.push({
            name: 'Свая винтовая d108 мм с оголовком и монтажом',
            quantity: pilesTotal,
            unit: 'шт',
            price: PRICING_CONFIG.foundationPile108,
            total: pilesTotal * PRICING_CONFIG.foundationPile108
        });
        // Добавляем раздел
        sections.push({
            name: 'Фундамент',
            items: foundationItems,
            total: foundationItems.reduce((acc, item) => acc + item.total, 0),
            passportItems: [
                'Винтовые металлические сваи диаметром 108 мм, с оголовками и монтажом'
            ]
        });
    }

    // -------------------------------------------------------------------------------- //
    // РАЗДЕЛ 2: ПОЛ И ПЕРЕКРЫТИЕ
    // -------------------------------------------------------------------------------- //
    const floorItems: EstimateItem[] = [];

    // Обвязка (Брус 200х200)
    // Внутренние несущие линии (предположим 1 линия по длине)
    const obvyazkaLength = perimeter + length;
    const obvyazkaVol = parseFloat((obvyazkaLength * 0.2 * 0.2 * CALCULATIONS_CONFIG.timberMargin).toFixed(2));
    floorItems.push({
        name: 'Обвязка (брус 200х200)',
        quantity: obvyazkaVol,
        unit: 'м3',
        price: PRICING_CONFIG.timber200x200 * (1 / (0.2 * 0.2 * 6)), // цена за 1 м3
        total: Math.ceil(obvyazkaVol * (PRICING_CONFIG.timber200x200 * (1 / (0.2 * 0.2 * 6))))
    });

    // Лаги пола — ширина доски зависит от толщины утепления пола
    const floorBoardWidth = params.floorInsulationThickness >= 200 ? 200 : 150;
    const floorBoardWidthM = floorBoardWidth / 1000;
    const floorBoardPrice = floorBoardWidth >= 200 ? PRICING_CONFIG.board200x50 : PRICING_CONFIG.board150x50;
    const floorBoardVolPerPiece = floorBoardWidthM * 0.05 * 6;

    const lagsCount = Math.ceil(length / params.floorJoistStep) * Math.ceil(width / 6);
    const lagsVol = parseFloat((lagsCount * 6 * floorBoardWidthM * 0.05 * CALCULATIONS_CONFIG.timberMargin).toFixed(2));
    floorItems.push({
        name: `Лаги пола (Доска ${floorBoardWidth}х50)`,
        quantity: lagsVol,
        unit: 'м3',
        price: floorBoardPrice * (1 / floorBoardVolPerPiece),
        total: Math.ceil(lagsVol * (floorBoardPrice * (1 / floorBoardVolPerPiece)))
    });

    // Черновой пол и ОСБ
    const osbSheets = parseFloat((floorArea / 3.125 * CALCULATIONS_CONFIG.finishingMargin).toFixed(2));
    floorItems.push({
        name: 'Черновой пол ОСБ 22мм',
        quantity: osbSheets,
        unit: 'шт',
        price: PRICING_CONFIG.osb22,
        total: osbSheets * PRICING_CONFIG.osb22
    });

    // Утепление пола
    const floorInsulM = params.floorInsulationThickness / 1000;
    const floorInsulationVol = parseFloat((floorArea * floorInsulM * CALCULATIONS_CONFIG.insulationMargin).toFixed(2));
    floorItems.push({
        name: `Утеплитель пола (Рулон/Плита) ${params.floorInsulationThickness}мм`,
        quantity: floorInsulationVol,
        unit: 'м3',
        price: PRICING_CONFIG.insulationKnauf,
        total: Math.ceil(floorInsulationVol * PRICING_CONFIG.insulationKnauf)
    });

    // Пленки и сетка
    floorItems.push({
        name: 'Сетка от грызунов ЦПВС',
        quantity: parseFloat((floorArea * CALCULATIONS_CONFIG.finishingMargin).toFixed(2)),
        unit: 'м2',
        price: PRICING_CONFIG.mouseMesh,
        total: Math.ceil(floorArea * CALCULATIONS_CONFIG.finishingMargin * PRICING_CONFIG.mouseMesh)
    });

    floorItems.push({
        name: 'Ветрозащита (низ пола)',
        quantity: parseFloat((floorArea * CALCULATIONS_CONFIG.membraneMargin).toFixed(2)),
        unit: 'м2',
        price: PRICING_CONFIG.windProtection / 75, // Перевод рулона 75м2 в цену за метр
        total: Math.ceil(floorArea * CALCULATIONS_CONFIG.membraneMargin * (PRICING_CONFIG.windProtection / 75))
    });



    sections.push({
        name: 'Перекрытие пола',
        items: floorItems,
        total: floorItems.reduce((acc, item) => acc + item.total, 0),
        passportItems: [
            'Нижняя силовая обвязка из деревянного бруса 200×200 мм',
            `Лаги пола из сухой строганой доски ${params.floorInsulationThickness >= 200 ? 200 : 150}×50 мм`,
            'Черновой пол из плит OSB толщиной 22 мм',
            `Утепление пола минеральным утеплителем толщиной ${params.floorInsulationThickness} мм`,
            'Металлическая защитная сетка от грызунов ЦПВС',
            'Ветрозащитная мембрана по нижней части пола'
        ]
    });

    // -------------------------------------------------------------------------------- //
    // РАЗДЕЛ 3: СТЕНЫ НАРУЖНЫЕ
    // -------------------------------------------------------------------------------- //
    const wallItems: EstimateItem[] = [];

    // --- Детальный расчет Каркаса Стен (Доска 150х50 — всегда фиксированная) ---
    // 1. Стойки (с учетом уклона фронтонов)
    // Упрощенно: для обычных стен высота = height. Для фронтонов средняя высота больше.
    const standardStudsCount = Math.ceil((length * 2) / actualWallStudStep); // Две обычные стены (если gable)
    const gableStudsCount = Math.ceil((width * 2) / actualWallStudStep); // Два фронтона

    // Средняя высота фронтона = height + (высота конька / 2)
    const ridgeHeight = params.roofType === 'gable' 
        ? (width / 2) * Math.tan(actualRoofAngle * (Math.PI / 180))
        : width * Math.tan(actualRoofAngle * (Math.PI / 180));
    const averageGableHeight = height + (ridgeHeight / 2); // Упрощенно для обоих типов

    const totalStudsLength = (standardStudsCount * height) + (gableStudsCount * averageGableHeight);

    // 2. Обвязки стен (1 нижняя, 2 верхние = 3 периметра)
    const wallPlatesLength = perimeter * 3;

    // 3. Усиление проемов (окна и двери)
    // На каждое окно/дверь: 2 стойки по бокам, подоконная, надоконная доска + хедер (перемычка). 
    // Грубо: периметр каждого окна * 2
    const avgWindowPerimeter = 6; // Периметр среднего окна 1.5х1.5
    const windowsCount = Math.ceil(windowsArea / 2.25); // Примерное кол-во окон
    const openingsSubframingLength = (windowsCount * avgWindowPerimeter * 2) + (params.doorsCount * 6 * 2);

    // 4. Укосины (как минимум 2 на каждую глухую стену = 8 штук по ~3.5м)
    const bracingsLength = 8 * Math.sqrt(height * height + 2 * 2); // Гипотенуза угла

    const totalWallTimberLength = totalStudsLength + wallPlatesLength + openingsSubframingLength + bracingsLength;
    const wallTimberVol = parseFloat((totalWallTimberLength * 0.15 * 0.05 * CALCULATIONS_CONFIG.timberMargin).toFixed(2)); // кубометры

    wallItems.push({
        name: 'Каркас стен (стойки, обвязки, укосины 150х50)',
        quantity: wallTimberVol,
        unit: 'м3',
        price: PRICING_CONFIG.board150x50 * (1 / (0.15 * 0.05 * 6)), // цена за 1 м3
        total: Math.ceil(wallTimberVol * (PRICING_CONFIG.board150x50 * (1 / (0.15 * 0.05 * 6))))
    });

    // Утеплитель стен (объем)
    const wallInsulM = params.wallInsulationThickness / 1000;
    const wallInsulationVol = parseFloat((outerWallAreaNet * wallInsulM * CALCULATIONS_CONFIG.insulationMargin).toFixed(2));
    wallItems.push({
        name: `Утеплитель стен ${params.wallInsulationThickness}мм`,
        quantity: wallInsulationVol,
        unit: 'м3',
        price: PRICING_CONFIG.insulationRockwool,
        total: Math.ceil(wallInsulationVol * PRICING_CONFIG.insulationRockwool)
    });

    // Наружная отделка (разделение по сторонам)
    const totalOpeningsArea = windowsArea + (params.doorsCount * 2);
    const widthWallAreaNet = Math.max(0, 2 * (width * (height + 0.4)) - (totalOpeningsArea / 2));
    const lengthWallAreaGross = length * height * 2; // Боковые стены (по длине)

    if (params.exteriorWallFinish === 'combined') {
        // Стандарт: фронтоны (по ширине) — планкен, боковые (по длине) — профлист
        wallItems.push({
            name: 'Фасад фронтоны (Планкен)',
            quantity: parseFloat((widthWallAreaNet * CALCULATIONS_CONFIG.finishingMargin).toFixed(2)),
            unit: 'м2',
            price: PRICING_CONFIG.planken,
            total: Math.ceil(widthWallAreaNet * CALCULATIONS_CONFIG.finishingMargin * PRICING_CONFIG.planken)
        });
        wallItems.push({
            name: 'Фасад боковые стены (Профлист)',
            quantity: parseFloat((lengthWallAreaGross * CALCULATIONS_CONFIG.finishingMargin).toFixed(2)),
            unit: 'м2',
            price: PRICING_CONFIG.proflistWall,
            total: Math.ceil(lengthWallAreaGross * CALCULATIONS_CONFIG.finishingMargin * PRICING_CONFIG.proflistWall)
        });
    } else {
        const exteriorWallPrice = params.exteriorWallFinish === 'planken' ? PRICING_CONFIG.planken : PRICING_CONFIG.proflistWall;
        const exteriorWallName = params.exteriorWallFinish === 'planken' ? 'Внешняя отделка (Планкен)' : 'Внешняя отделка (Профлист)';
        wallItems.push({
            name: exteriorWallName,
            quantity: parseFloat((outerWallAreaNet * CALCULATIONS_CONFIG.finishingMargin).toFixed(2)),
            unit: 'м2',
            price: exteriorWallPrice,
            total: Math.ceil(outerWallAreaNet * CALCULATIONS_CONFIG.finishingMargin * exteriorWallPrice)
        });
    }

    // Пленки
    wallItems.push({
        name: 'Ветрозащита фасада',
        quantity: parseFloat((outerWallAreaGross * CALCULATIONS_CONFIG.membraneMargin).toFixed(2)),
        unit: 'м2',
        price: PRICING_CONFIG.windProtection / 75,
        total: Math.ceil(outerWallAreaGross * CALCULATIONS_CONFIG.membraneMargin * (PRICING_CONFIG.windProtection / 75))
    });

    if (params.interiorWallFinish !== 'plywood') {
        wallItems.push({
            name: 'Пароизоляция стен',
            quantity: parseFloat((outerWallAreaGross * CALCULATIONS_CONFIG.membraneMargin).toFixed(2)),
            unit: 'м2',
            price: PRICING_CONFIG.vaporBarrier,
            total: Math.ceil(outerWallAreaGross * CALCULATIONS_CONFIG.membraneMargin * PRICING_CONFIG.vaporBarrier)
        });
    }

    const wallPassportItems = [
        `Несущий каркас наружных стен из сухой строганой доски ${params.wallInsulationThickness}×50 мм`,
        `Утепление наружных стен минеральным утеплителем толщиной ${params.wallInsulationThickness} мм`
    ];
    if (params.exteriorWallFinish === 'combined') {
        wallPassportItems.push('Отделка фронтонов фасадной доской планкен');
        wallPassportItems.push('Отделка боковых стен фасада металлическим профилированным листом');
    } else if (params.exteriorWallFinish === 'planken') {
        wallPassportItems.push('Отделка фасада доской планкен (все стороны)');
    } else {
        wallPassportItems.push('Отделка фасада металлическим профилированным листом (все стороны)');
    }
    wallPassportItems.push('Ветрозащитная мембрана наружных стен');

    sections.push({
        name: 'Наружные стены',
        items: wallItems,
        total: wallItems.reduce((acc, item) => acc + item.total, 0),
        passportItems: wallPassportItems
    });

    // -------------------------------------------------------------------------------- //
    // РАЗДЕЛ 3.5: СТЕНЫ ВНУТРЕННИЕ (ПЕРЕГОРОДКИ)
    // -------------------------------------------------------------------------------- //
    const innerWallItems: EstimateItem[] = [];

    // Каркас перегородок (доска 100х50)
    // Добавляем по 1 доп. стойке на каждые 3м длины для углов и примыканий
    const innerStudsCount = Math.ceil(params.innerWallsLength / actualWallStudStep) + Math.ceil(params.innerWallsLength / 3);
    const innerStudsLength = innerStudsCount * height;
    const innerPlatesLength = params.innerWallsLength * 3; // 1 нижняя, 2 верхние

    // Усиление проемов (2 стойки на высоту + хедер и стойки над ним)
    const innerDoorsSubframing = params.interiorDoorsCount * ((height * 2) + 2);

    // Укосины (примерно 2 шт на каждые 4м стены)
    const innerBracingsLength = Math.ceil(params.innerWallsLength / 4) * 2 * Math.sqrt(height * height + 2 * 2);

    const totalInnerTimberLength = innerStudsLength + innerPlatesLength + innerDoorsSubframing + innerBracingsLength;
    const innerTimberVol = parseFloat((totalInnerTimberLength * 0.1 * 0.05 * CALCULATIONS_CONFIG.timberMargin).toFixed(2));

    innerWallItems.push({
        name: 'Каркас внутренних перегородок (доска 100х50)',
        quantity: innerTimberVol,
        unit: 'м3',
        price: PRICING_CONFIG.board100x50 * (1 / (0.1 * 0.05 * 6)),
        total: Math.ceil(innerTimberVol * (PRICING_CONFIG.board100x50 * (1 / (0.1 * 0.05 * 6))))
    });

    // Звукоизоляция (100мм)
    const innerInsulationVol = parseFloat((params.innerWallsLength * height * 0.1 * CALCULATIONS_CONFIG.insulationMargin).toFixed(2));
    if (innerInsulationVol > 0) {
        innerWallItems.push({
            name: 'Звукоизоляция перегородок (100мм)',
            quantity: innerInsulationVol,
            unit: 'м3',
            price: PRICING_CONFIG.insulationRockwool,
            total: Math.ceil(innerInsulationVol * PRICING_CONFIG.insulationRockwool)
        });
    }

    if (innerWallItems.length > 0) {
        sections.push({
            name: 'Стены внутренние (Перегородки)',
            items: innerWallItems,
            total: innerWallItems.reduce((acc, item) => acc + item.total, 0),
            passportItems: [
                'Каркас внутренних перегородок из сухой строганой доски 100×50 мм',
                'Звукоизоляция внутренних перегородок толщиной 100 мм'
            ]
        });
    }

    // -------------------------------------------------------------------------------- //
    // РАЗДЕЛ 4: КРЫША
    // -------------------------------------------------------------------------------- //
    const roofItems: EstimateItem[] = [];

    // Стропила — ширина доски зависит от толщины утепления крыши
    const roofBoardWidth = params.roofInsulationThickness >= 200 ? 200 : 150;
    const roofBoardWidthM = roofBoardWidth / 1000;
    const roofBoardPrice = roofBoardWidth >= 200 ? PRICING_CONFIG.board200x50 : PRICING_CONFIG.board150x50;
    const roofBoardVolPerPiece = roofBoardWidthM * 0.05 * 6;

    const rafterCount = Math.ceil(length / actualRoofRafterStep) * (params.roofType === 'gable' ? 2 : 1);
    // Берем среднюю длину стропилы как slopeLength * 1.1 на свесы и подрезы
    const rafterTotalLength = rafterCount * slopeLength * 1.1;
    const rafterVol = parseFloat((rafterTotalLength * roofBoardWidthM * 0.05 * CALCULATIONS_CONFIG.timberMargin).toFixed(2));
    roofItems.push({
        name: `Стропильная нога (Доска ${roofBoardWidth}х50)`,
        quantity: rafterVol,
        unit: 'м3',
        price: roofBoardPrice * (1 / roofBoardVolPerPiece),
        total: Math.ceil(rafterVol * (roofBoardPrice * (1 / roofBoardVolPerPiece)))
    });

    // Обрешетка
    const obReshetkaVol = parseFloat(((roofArea / 0.35) * 0.1 * 0.025 * CALCULATIONS_CONFIG.timberMargin).toFixed(2)); // Шаг 35см, доска 100х25
    roofItems.push({
        name: 'Обрешетка (Доска 100х25)',
        quantity: obReshetkaVol,
        unit: 'м3',
        price: PRICING_CONFIG.board100x25 * (1 / (0.1 * 0.025 * 6)),
        total: Math.ceil(obReshetkaVol * (PRICING_CONFIG.board100x25 * (1 / (0.1 * 0.025 * 6))))
    });

    // Покрытие крыши
    let roofFinishPrice = PRICING_CONFIG.proflistRoof;
    let roofFinishName = 'Кровельное покрытие (Металлочерепица / Профлист)';
    // В будущем можно добавить отдельные цены на кликфальц

    roofItems.push({
        name: roofFinishName,
        quantity: parseFloat((roofArea * CALCULATIONS_CONFIG.finishingMargin).toFixed(2)),
        unit: 'м2',
        price: roofFinishPrice,
        total: Math.ceil(roofArea * CALCULATIONS_CONFIG.finishingMargin * roofFinishPrice)
    });

    // Утепление крыши
    const roofInsulM = params.roofInsulationThickness / 1000;
    const roofInsulationVol = parseFloat((floorArea * roofInsulM * CALCULATIONS_CONFIG.insulationMargin).toFixed(2));
    roofItems.push({
        name: `Утеплитель кровли ${params.roofInsulationThickness}мм`,
        quantity: roofInsulationVol,
        unit: 'м3',
        price: PRICING_CONFIG.insulationRockwool,
        total: Math.ceil(roofInsulationVol * PRICING_CONFIG.insulationRockwool)
    });

    roofItems.push({
        name: 'Ветровлагозащитная мембрана кровли',
        quantity: parseFloat((roofArea * CALCULATIONS_CONFIG.membraneMargin).toFixed(2)),
        unit: 'м2',
        price: PRICING_CONFIG.windProtection / 75,
        total: Math.ceil(roofArea * CALCULATIONS_CONFIG.membraneMargin * (PRICING_CONFIG.windProtection / 75))
    });

    if (params.ceilingFinish !== 'plywood') {
        roofItems.push({
            name: 'Пароизоляция потолка',
            quantity: parseFloat((roofArea * CALCULATIONS_CONFIG.membraneMargin).toFixed(2)),
            unit: 'м2',
            price: PRICING_CONFIG.vaporBarrier,
            total: Math.ceil(roofArea * CALCULATIONS_CONFIG.membraneMargin * PRICING_CONFIG.vaporBarrier)
        });
    }

    sections.push({
        name: 'Крыша',
        items: roofItems,
        total: roofItems.reduce((acc, item) => acc + item.total, 0),
        passportItems: [
            'Стропильная система крыши из сухой строганой доски 150×50 мм',
            'Обрешетка крыши из сухой строганой доски 100×25 мм',
            'Кровельное покрытие из металлочерепицы или профилированного листа',
            `Утепление кровли минеральным утеплителем толщиной ${params.roofInsulationThickness} мм`,
            'Ветровлагозащитная мембрана кровли'
        ]
    });





    // Внутренняя отделка, Окна, Электрика
    const finishItems: EstimateItem[] = [];
    finishItems.push({ name: 'Остекление (Панорамное и обычное)', quantity: windowsArea, unit: 'м2', price: PRICING_CONFIG.windowM2, total: windowsArea * PRICING_CONFIG.windowM2 });

    if (params.doorsCount > 0) {
        finishItems.push({ name: 'Дверь входная с терморазрывом', quantity: params.doorsCount, unit: 'шт', price: PRICING_CONFIG.doorEntrance, total: params.doorsCount * PRICING_CONFIG.doorEntrance });
    }

    if (params.interiorDoorsCount > 0) {
        finishItems.push({ name: 'Дверь межкомнатная с фурнитурой', quantity: params.interiorDoorsCount, unit: 'шт', price: PRICING_CONFIG.doorInterior, total: params.interiorDoorsCount * PRICING_CONFIG.doorInterior });
    }

    // Выбор пола
    let floorFinishPrice = PRICING_CONFIG.laminate;
    let floorFinishName = 'Напольное покрытие (Ламинат)';
    if (params.floorFinish === 'laminateWaterproof') {
        floorFinishPrice = PRICING_CONFIG.laminateWaterproof;
        floorFinishName = 'Напольное покрытие (Ламинат 33 кл. Водостойкий)';
    } else if (params.floorFinish === 'quartzVinyl') {
        floorFinishPrice = PRICING_CONFIG.quartzVinyl;
        floorFinishName = 'Напольное покрытие (Кварцвинил)';
    } else if (params.floorFinish === 'linoleum') {
        floorFinishPrice = PRICING_CONFIG.linoleum;
        floorFinishName = 'Напольное покрытие (Линолеум)';
    } else if (params.floorFinish === 'floorBoardPine') {
        floorFinishPrice = PRICING_CONFIG.floorBoardPine;
        floorFinishName = 'Напольное покрытие (Половая доска Хвоя)';
    } else if (params.floorFinish === 'floorBoardLarch') {
        floorFinishPrice = PRICING_CONFIG.floorBoardLarch;
        floorFinishName = 'Напольное покрытие (Половая доска Лиственница)';
    }
    const finishFloorArea = parseFloat((generalFloorArea * CALCULATIONS_CONFIG.finishingMargin).toFixed(2));

    if (params.floorFinish === 'laminate' || params.floorFinish === 'laminateWaterproof' || params.floorFinish === 'quartzVinyl') {
        finishItems.push({ name: 'Подложка под напольное покрытие', quantity: finishFloorArea, unit: 'м2', price: PRICING_CONFIG.underlayment, total: Math.ceil(finishFloorArea * PRICING_CONFIG.underlayment) });
    }
    finishItems.push({ name: floorFinishName, quantity: finishFloorArea, unit: 'м2', price: floorFinishPrice, total: Math.ceil(finishFloorArea * floorFinishPrice) });

    // Санузел: Пол
    if (params.bathroomFloorArea > 0) {
        let bathFloorPrice = PRICING_CONFIG.quartzVinyl;
        let bathFloorName = 'Отделка пола санузла (Кварцвинил)';
        if (params.bathroomFloorFinish === 'keramogranit') {
            bathFloorPrice = PRICING_CONFIG.keramogranit;
            bathFloorName = 'Отделка пола санузла (Керамогранит)';
        } else if (params.bathroomFloorFinish === 'laminateWaterproof') {
            bathFloorPrice = PRICING_CONFIG.laminateWaterproof;
            bathFloorName = 'Отделка пола санузла (Ламинат Водостойкий)';
        }
        const bathFloorFinishingArea = parseFloat((params.bathroomFloorArea * CALCULATIONS_CONFIG.finishingMargin).toFixed(2));
        finishItems.push({ 
            name: bathFloorName, 
            quantity: bathFloorFinishingArea, 
            unit: 'м2', 
            price: bathFloorPrice, 
            total: Math.ceil(bathFloorFinishingArea * bathFloorPrice) 
        });
    }

    // Выбор стен
    let interiorWallPrice = PRICING_CONFIG.imitationWood;
    let interiorWallName = 'Отделка стен внутри (Имитация бруса)';
    if (params.interiorWallFinish === 'drywall') {
        interiorWallPrice = PRICING_CONFIG.drywall;
        interiorWallName = 'Отделка стен внутри (ГКЛ)';
    } else if (params.interiorWallFinish === 'woodLining') {
        interiorWallPrice = PRICING_CONFIG.woodLining;
        interiorWallName = 'Отделка стен внутри (Вагонка Штиль)';
    } else if (params.interiorWallFinish === 'blockHouse') {
        interiorWallPrice = PRICING_CONFIG.blockHouse;
        interiorWallName = 'Отделка стен внутри (Блок хаус)';
    } else if (params.interiorWallFinish === 'plywood') {
        interiorWallPrice = PRICING_CONFIG.plywoodInterior;
        interiorWallName = 'Отделка стен внутри (Березовая фанера)';
    }
    const innerWallsFinishingArea = parseFloat((generalWallArea * CALCULATIONS_CONFIG.finishingMargin).toFixed(2));
    finishItems.push({ name: interiorWallName, quantity: innerWallsFinishingArea, unit: 'м2', price: interiorWallPrice, total: Math.ceil(innerWallsFinishingArea * interiorWallPrice) });

    // Санузел: Стены
    if (params.bathroomFloorArea > 0) {
        let bathWallPrice = PRICING_CONFIG.keramogranit;
        let bathWallName = 'Отделка стен санузла (Керамогранит)';
        if (params.bathroomWallFinish === 'quartzVinyl') {
            bathWallPrice = PRICING_CONFIG.quartzVinyl;
            bathWallName = 'Отделка стен санузла (Кварцвинил)';
        } else if (params.bathroomWallFinish === 'imitationWood') {
            bathWallPrice = PRICING_CONFIG.imitationWood + 150;
            bathWallName = 'Отделка стен санузла (Имитация бруса)';
        } else if (params.bathroomWallFinish === 'plywood') {
            bathWallPrice = PRICING_CONFIG.plywoodInterior + 150;
            bathWallName = 'Отделка стен санузла (Фанера)';
        }
        const bathWallFinishingArea = parseFloat((bathroomWallArea * CALCULATIONS_CONFIG.finishingMargin).toFixed(2));
        finishItems.push({ 
            name: bathWallName, 
            quantity: bathWallFinishingArea, 
            unit: 'м2', 
            price: bathWallPrice, 
            total: Math.ceil(bathWallFinishingArea * bathWallPrice) 
        });
    }

    // Выбор потолка
    let ceilingFinishPrice = PRICING_CONFIG.imitationWood;
    let ceilingFinishName = 'Отделка потолка (Имитация бруса)';
    if (params.ceilingFinish === 'drywall') {
        ceilingFinishPrice = PRICING_CONFIG.drywall;
        ceilingFinishName = 'Отделка потолка (ГКЛ)';
    } else if (params.ceilingFinish === 'woodLining') {
        ceilingFinishPrice = PRICING_CONFIG.woodLining;
        ceilingFinishName = 'Отделка потолка (Вагонка Штиль)';
    } else if (params.ceilingFinish === 'stretchCeiling') {
        ceilingFinishPrice = PRICING_CONFIG.stretchCeiling;
        ceilingFinishName = 'Отделка потолка (Натяжной + багет)';
    } else if (params.ceilingFinish === 'plywood') {
        ceilingFinishPrice = PRICING_CONFIG.plywoodInterior;
        ceilingFinishName = 'Отделка потолка (Березовая фанера)';
    }
    const ceilingFinishingArea = parseFloat((roofArea * CALCULATIONS_CONFIG.finishingMargin).toFixed(2)); 
    finishItems.push({ name: ceilingFinishName, quantity: ceilingFinishingArea, unit: 'м2', price: ceilingFinishPrice, total: Math.ceil(ceilingFinishingArea * ceilingFinishPrice) });

    if (params.isPainted) {
        const hasPaintedCeiling = params.ceilingFinish !== 'stretchCeiling';
        let paintingArea = generalWallArea;
        if (hasPaintedCeiling) {
            paintingArea += roofArea;
        }
        paintingArea = parseFloat((paintingArea * CALCULATIONS_CONFIG.finishingMargin).toFixed(2));
        finishItems.push({
            name: hasPaintedCeiling ? 'Покраска стен и потолка (2 слоя)' : 'Покраска стен (2 слоя)',
            quantity: paintingArea,
            unit: 'м2',
            price: PRICING_CONFIG.workPaintingM2,
            total: Math.ceil(paintingArea * PRICING_CONFIG.workPaintingM2)
        });
    }

    const winDoorPassport = [];
    if (windowsArea > 0) winDoorPassport.push('Окна: панорамные и стандартные стеклопакеты');
    winDoorPassport.push('Утепленная входная дверь с терморазрывом');
    if (params.interiorDoorsCount > 0) winDoorPassport.push('Межкомнатные двери с фурнитурой');

    sections.push({
        name: 'Окна и Двери',
        items: finishItems.filter(i => i.name.includes('Остекление') || i.name.includes('Дверь')),
        total: finishItems.filter(i => i.name.includes('Остекление') || i.name.includes('Дверь')).reduce((acc, item) => acc + item.total, 0),
        passportItems: winDoorPassport
    });

    const finishPassport = [
        'Подложка под напольное покрытие'
    ];
    const floorMap: Record<string, string> = {
        'laminate': 'ламинат',
        'laminateWaterproof': 'водостойкий ламинат',
        'quartzVinyl': 'кварцвинил',
        'linoleum': 'линолеум',
        'floorBoardPine': 'половая доска (хвоя)',
        'floorBoardLarch': 'половая доска (лиственница)'
    };
    finishPassport.push(`Финишное напольное покрытие — ${floorMap[params.floorFinish] || params.floorFinish}`);
    if (params.bathroomFloorArea > 0) finishPassport.push('Влагостойкое напольное покрытие санузла — кварцвинил');
    
    if (params.interiorWallFinish === 'plywood') finishPassport.push('Внутренняя отделка стен березовой фанерой');
    else if (params.interiorWallFinish === 'imitationWood') finishPassport.push('Внутренняя отделка стен имитацией бруса');
    else if (params.interiorWallFinish === 'drywall') finishPassport.push('Внутренняя отделка стен гипсокартоном');
    
    if (params.bathroomFloorArea > 0) finishPassport.push('Отделка стен санузла имитацией бруса');
    
    if (params.ceilingFinish === 'plywood') finishPassport.push('Отделка потолка березовой фанерой');
    else if (params.ceilingFinish === 'imitationWood') finishPassport.push('Отделка потолка имитацией бруса');
    else if (params.ceilingFinish === 'stretchCeiling') finishPassport.push('Отделка потолка — натяжной потолок');

    if (params.isPainted) finishPassport.push('Покраска стен и потолка в 2 слоя');

    sections.push({
        name: 'Внутренняя отделка',
        items: finishItems.filter(i => !i.name.includes('Остекление') && !i.name.includes('Дверь')),
        total: finishItems.filter(i => !i.name.includes('Остекление') && !i.name.includes('Дверь')).reduce((acc, item) => acc + item.total, 0),
        passportItems: finishPassport
    });



    // Инженерные сети
    const commItems: EstimateItem[] = [];
    
    if (params.electricalType === 'basic') {
        commItems.push({ 
            name: 'Электромонтаж: Пакет «Стандарт»', 
            quantity: floorArea, 
            unit: 'м2', 
            price: PRICING_CONFIG.electricalBasicM2, 
            total: Math.ceil(floorArea * PRICING_CONFIG.electricalBasicM2) 
        });
    } else if (params.electricalType === 'advanced') {
        commItems.push({ 
            name: 'Электромонтаж: Пакет «Премиум»', 
            quantity: floorArea, 
            unit: 'м2', 
            price: PRICING_CONFIG.electricalAdvancedM2, 
            total: Math.ceil(floorArea * PRICING_CONFIG.electricalAdvancedM2) 
        });
    }

    commItems.push({ name: 'Сантехника и скрытые коммуникации', quantity: floorArea, unit: 'м2', price: PRICING_CONFIG.plumbing, total: floorArea * PRICING_CONFIG.plumbing });


    const engPassport = [];
    if (params.electricalType !== 'none') engPassport.push('Базовый пакет электромонтажа');
    engPassport.push('Сантехника и скрытая разводка коммуникаций');

    // Отопление (отдельный раздел)
    const heatingItems: EstimateItem[] = [];

    // Merge heating into Engineering for Passport
    if (params.heatingType === 'electricFloor') {
        const bathArea = params.bathroomFloorArea || 0;
        const mainFloorAreaForHeating = Math.max(0, floorArea - bathArea);
        
        const heatingAreaMain = params.heatingElectricFloorArea > 0 
            ? params.heatingElectricFloorArea 
            : parseFloat((mainFloorAreaForHeating * 0.7).toFixed(2));

        heatingItems.push({
            name: 'Теплый пол электрический модульный ЗЕБРА ЭВО-300 WF',
            quantity: heatingAreaMain,
            unit: 'м2',
            price: PRICING_CONFIG.heatingWarmFloorElectric,
            total: Math.ceil(heatingAreaMain * PRICING_CONFIG.heatingWarmFloorElectric)
        });

        if (bathArea > 0) {
            heatingItems.push({
                name: 'Теплый пол в санузле',
                quantity: bathArea,
                unit: 'м2',
                price: PRICING_CONFIG.heatingWarmFloorBathroom,
                total: Math.ceil(bathArea * PRICING_CONFIG.heatingWarmFloorBathroom)
            });
        }

        if (params.heatingThermostatsCount > 0) {
            heatingItems.push({
                name: 'Терморегулятор для теплого пола',
                quantity: params.heatingThermostatsCount,
                unit: 'шт',
                price: PRICING_CONFIG.heatingThermostat,
                total: params.heatingThermostatsCount * PRICING_CONFIG.heatingThermostat
            });
        }

        engPassport.push('Теплый пол электрический модульный ЗЕБРА ЭВО-300 WF');
        if (params.bathroomFloorArea > 0) engPassport.push('Теплый пол в санузле');
        if (params.heatingThermostatsCount > 0) engPassport.push('Установка терморегуляторов теплого пола');
    } else if (params.heatingType === 'waterFloor') {
        heatingItems.push({
            name: 'Теплый пол водяной (трубы, коллектор)',
            quantity: generalFloorArea,
            unit: 'м2',
            price: PRICING_CONFIG.heatingWarmFloorWater,
            total: Math.ceil(generalFloorArea * PRICING_CONFIG.heatingWarmFloorWater)
        });
        heatingItems.push({
            name: 'Электрический котел с монтажом',
            quantity: 1,
            unit: 'шт',
            price: PRICING_CONFIG.heatingElectricBoiler,
            total: PRICING_CONFIG.heatingElectricBoiler
        });

        engPassport.push('Теплый пол водяной (трубы, коллектор)');
        engPassport.push('Электрический котел с монтажом');
    } else if (params.heatingType === 'convectors') {
        const convectorsCount = Math.ceil(generalFloorArea / 15);
        heatingItems.push({
            name: 'Конвекторы электрические настенные',
            quantity: convectorsCount,
            unit: 'шт',
            price: PRICING_CONFIG.heatingConvector,
            total: convectorsCount * PRICING_CONFIG.heatingConvector
        });

        engPassport.push('Конвекторы электрические настенные');
    }

    const allEngItems = [...commItems, ...heatingItems];

    if (allEngItems.length > 0) {
        sections.push({
            name: 'Инженерные сети',
            items: allEngItems,
            total: allEngItems.reduce((acc, item) => acc + item.total, 0),
            passportItems: engPassport
        });
    }

    // -------------------------------------------------------------------------------- //
    // РАЗДЕЛ: ДОПОЛНИТЕЛЬНЫЕ ОПЦИИ (Из таблицы)
    // -------------------------------------------------------------------------------- //
    const extraItems: EstimateItem[] = [];

    // Инженерия (Доп)
    if (params.optLightingCableCount > 0) extraItems.push({ name: 'Вывод кабеля освещения шт.', quantity: params.optLightingCableCount, unit: 'шт', price: PRICING_CONFIG.optLightingCable, total: params.optLightingCableCount * PRICING_CONFIG.optLightingCable });
    if (params.optBreezerCount > 0) extraItems.push({ name: 'Бризер Ballu ONEAIR ASP-80', quantity: params.optBreezerCount, unit: 'шт', price: PRICING_CONFIG.optBreezer, total: params.optBreezerCount * PRICING_CONFIG.optBreezer });
    if (params.optWarmTapCount > 0) extraItems.push({ name: 'Теплый кран на улицу шт.', quantity: params.optWarmTapCount, unit: 'шт', price: PRICING_CONFIG.optWarmTap, total: params.optWarmTapCount * PRICING_CONFIG.optWarmTap });
    if (params.optSocketCount > 0) extraItems.push({ name: 'Дополнительная розетка шт.', quantity: params.optSocketCount, unit: 'шт', price: PRICING_CONFIG.optSocket, total: params.optSocketCount * PRICING_CONFIG.optSocket });
    if (params.optSpotlightCount > 0) extraItems.push({ name: 'Доп. точечный светильник шт.', quantity: params.optSpotlightCount, unit: 'шт', price: PRICING_CONFIG.optSpotlight, total: params.optSpotlightCount * PRICING_CONFIG.optSpotlight });
    if (params.optStreetLightCount > 0) extraItems.push({ name: 'Доп. уличный светильник шт.', quantity: params.optStreetLightCount, unit: 'шт', price: PRICING_CONFIG.optStreetLight, total: params.optStreetLightCount * PRICING_CONFIG.optStreetLight });
    if (params.optAcPrepCount > 0) extraItems.push({ name: 'Подготовка под установку кондиционера', quantity: params.optAcPrepCount, unit: 'шт', price: PRICING_CONFIG.optAcPrep, total: params.optAcPrepCount * PRICING_CONFIG.optAcPrep });
    if (params.optWetPointSplit) extraItems.push({ name: 'Разрыв мокрой точки (кухня не примыкает к с/у)', quantity: 1, unit: 'услуга', price: PRICING_CONFIG.optWetPointSplit, total: PRICING_CONFIG.optWetPointSplit });

    // Каркас (Доп) - Пересчет по м2
    if (params.optModuleExtendCount > 0) extraItems.push({ name: 'Увеличение длины модуля на 60 см (шт.)', quantity: params.optModuleExtendCount, unit: 'шт', price: PRICING_CONFIG.optModuleExtend, total: params.optModuleExtendCount * PRICING_CONFIG.optModuleExtend });

    if (params.optPartition) extraItems.push({ name: 'Перегородка между зоной входа и кухней-гостиной', quantity: 1, unit: 'шт', price: PRICING_CONFIG.optPartition, total: PRICING_CONFIG.optPartition });
    if (params.optTambour) extraItems.push({ name: 'Входной тамбур с межкомнатной дверью', quantity: 1, unit: 'шт', price: PRICING_CONFIG.optTambour, total: PRICING_CONFIG.optTambour });

    // Окна / Двери (Доп)
    if (params.optSafeDoor) extraItems.push({ name: 'Входная сейф дверь + крыльцо', quantity: 1, unit: 'шт', price: PRICING_CONFIG.optSafeDoor, total: PRICING_CONFIG.optSafeDoor });

    // Определяем, относится ли дом к категории "77о" и больше (условно площадь пола > 70)
    const isLargeHouse = floorArea > 70;

    if (params.optPanWindow3) {
        const p = isLargeHouse ? PRICING_CONFIG.optPanWindow3_77 : PRICING_CONFIG.optPanWindow3;
        extraItems.push({ name: 'Замена окон на панорамные (3 секции)', quantity: 1, unit: 'шт', price: p, total: p });
    }
    if (params.optPanWindow2) {
        const p = isLargeHouse ? PRICING_CONFIG.optPanWindow2_77 : PRICING_CONFIG.optPanWindow2;
        extraItems.push({ name: 'Замена окон на панорамные (2 секции)', quantity: 1, unit: 'шт', price: p, total: p });
    }
    if (params.optWin100x200Count > 0) extraItems.push({ name: 'Доп. окно 1000x2000 мм', quantity: params.optWin100x200Count, unit: 'шт', price: PRICING_CONFIG.optWin100x200, total: params.optWin100x200Count * PRICING_CONFIG.optWin100x200 });
    if (params.optWin50x200Count > 0) extraItems.push({ name: 'Доп. глухое окно 500x2000 мм', quantity: params.optWin50x200Count, unit: 'шт', price: PRICING_CONFIG.optWin50x200, total: params.optWin50x200Count * PRICING_CONFIG.optWin50x200 });
    if (params.optWin60x50Count > 0) extraItems.push({ name: 'Доп. окно 600x500 мм', quantity: params.optWin60x50Count, unit: 'шт', price: PRICING_CONFIG.optWin60x50, total: params.optWin60x50Count * PRICING_CONFIG.optWin60x50 });
    if (params.optWin150x50Count > 0) extraItems.push({ name: 'Доп. окно 1500x500 мм', quantity: params.optWin150x50Count, unit: 'шт', price: PRICING_CONFIG.optWin150x50, total: params.optWin150x50Count * PRICING_CONFIG.optWin150x50 });

    // Отделка фасадная (Доп)
    if (params.optGutterPlastic) extraItems.push({ name: 'Водосточная система (пластик)', quantity: parseFloat(perimeter.toFixed(2)), unit: 'пог. м', price: PRICING_CONFIG.optGutterPlasticM2, total: Math.ceil(perimeter * PRICING_CONFIG.optGutterPlasticM2) });
    if (params.optGutterMetal) extraItems.push({ name: 'Водосточная система (металл)', quantity: parseFloat(perimeter.toFixed(2)), unit: 'пог. м', price: PRICING_CONFIG.optGutterMetalM2, total: Math.ceil(perimeter * PRICING_CONFIG.optGutterMetalM2) });
    if (params.optPlinthPlanken) extraItems.push({ name: 'Обшивка цоколя планкеном', quantity: perimeter, unit: 'м.п.', price: PRICING_CONFIG.optPlinthPlankenM2, total: Math.ceil(perimeter * PRICING_CONFIG.optPlinthPlankenM2) }); // Используем периметр для цоколя

    const extraPassport = [];
    if (params.optBreezerCount > 0) extraPassport.push('Приточная вентиляционная установка Ballu ONEAIR ASP-80');
    if (params.optWarmTapCount > 0) extraPassport.push('Уличный незамерзающий водоразборный кран');
    if (params.optSocketCount > 0) extraPassport.push('Дополнительная электрическая розетка');
    if (params.optSpotlightCount > 0) extraPassport.push('Дополнительный точечный светильник');
    if (params.optStreetLightCount > 0) extraPassport.push('Дополнительный уличный светильник');
    if (params.optAcPrepCount > 0) extraPassport.push('Подготовка коммуникаций под установку кондиционера');
    if (params.optWetPointSplit) extraPassport.push('Дополнительная разводка коммуникаций при удаленном расположении кухни от санузла');
    if (params.optSafeDoor) extraPassport.push('Усиленная входная сейф-дверь');
    if (params.optGutterPlastic) extraPassport.push('Пластиковая водосточная система');
    if (params.optPlinthPlanken) extraPassport.push('Обшивка цоколя фасадной доской планкен');

    if (extraItems.length > 0) {
        sections.push({
            name: 'Дополнительные опции',
            items: extraItems,
            total: extraItems.reduce((acc, item) => acc + item.total, 0),
            passportItems: extraPassport
        });
    }

    // -------------------------------------------------------------------------------- //
    // РАЗДЕЛ: ПРОИЗВОЛЬНЫЕ ПОЗИЦИИ (Новое)
    // -------------------------------------------------------------------------------- //
    if (params.customItems && params.customItems.length > 0) {
        sections.push({
            name: 'Дополнительные услуги и материалы (индивидуально)',
            items: params.customItems,
            total: params.customItems.reduce((acc, item) => acc + item.total, 0)
        });
    }

    // -------------------------------------------------------------------------------- //
    // РАЗДЕЛ: ТЕРРАСА И КРЫЛЬЦО
    // -------------------------------------------------------------------------------- //
    const terraceItems: EstimateItem[] = [];

    if (params.optTerraceCloseCount > 0) terraceItems.push({ name: 'Закрытие проема террасы (сторона)', quantity: params.optTerraceCloseCount, unit: 'шт', price: PRICING_CONFIG.optTerraceClose, total: params.optTerraceCloseCount * PRICING_CONFIG.optTerraceClose });
    if (params.optCanopy) terraceItems.push({ name: 'Навес над крыльцом', quantity: 1, unit: 'шт', price: PRICING_CONFIG.optCanopy, total: PRICING_CONFIG.optCanopy });
    if (params.optTerraceArea > 0) terraceItems.push({ name: 'Доп. площадь террасы', quantity: params.optTerraceArea, unit: 'м2', price: PRICING_CONFIG.optTerraceAreaM2, total: params.optTerraceArea * PRICING_CONFIG.optTerraceAreaM2 });
    if (params.optRailingsLength > 0) terraceItems.push({ name: 'Перила (планкен)', quantity: params.optRailingsLength, unit: 'м.п.', price: PRICING_CONFIG.optRailings, total: params.optRailingsLength * PRICING_CONFIG.optRailings });
    if (params.optRailingsCrossLength > 0) terraceItems.push({ name: 'Перила (узор крестик)', quantity: params.optRailingsCrossLength, unit: 'м.п.', price: PRICING_CONFIG.optRailingsCross, total: params.optRailingsCrossLength * PRICING_CONFIG.optRailingsCross });
    if (params.optPorchStepCount > 0) terraceItems.push({ name: 'Ступень крыльца 1.2м', quantity: params.optPorchStepCount, unit: 'шт', price: PRICING_CONFIG.optPorchStep, total: params.optPorchStepCount * PRICING_CONFIG.optPorchStep });
    if (params.optTerraceStepCount > 0) terraceItems.push({ name: 'Ступень террасы 6м', quantity: params.optTerraceStepCount, unit: 'шт', price: PRICING_CONFIG.optTerraceStep, total: params.optTerraceStepCount * PRICING_CONFIG.optTerraceStep });

    const terracePassport = [];
    if (params.optTerraceCloseCount > 0) terracePassport.push('Закрытие одной стороны проема террасы');
    if (params.optCanopy) terracePassport.push('Навес над крыльцом');
    if (params.optTerraceArea > 0) terracePassport.push('Увеличение площади террасы');
    if (params.optRailingsLength > 0) terracePassport.push('Ограждение из доски планкен');
    if (params.optRailingsCrossLength > 0) terracePassport.push('Декоративные перила с рисунком «крестик»');
    if (params.optPorchStepCount > 0) terracePassport.push('Ступень крыльца шириной 1,2 м');
    if (params.optTerraceStepCount > 0) terracePassport.push('Ступень террасы длиной 6 м');

    if (terraceItems.length > 0) {
        sections.push({
            name: 'Терраса и Крыльцо',
            items: terraceItems,
            total: terraceItems.reduce((acc, item) => acc + item.total, 0),
            passportItems: terracePassport
        });
    }

    // -------------------------------------------------------------------------------- //
    // РАЗДЕЛ: РАСХОДНЫЕ МАТЕРИАЛЫ
    // -------------------------------------------------------------------------------- //
    // Расчет основан на средних отраслевых нормах потребления
    const areaRatio = floorArea / 36;
    const consumablesItems: EstimateItem[] = [
        { name: 'Гайка оцинкованная ГОСТ 5927-70, M16 (5кг)', quantity: parseFloat((3 * areaRatio).toFixed(2)), unit: 'шт', price: PRICING_CONFIG.consumables_nutM16, total: Math.ceil(3 * areaRatio) * PRICING_CONFIG.consumables_nutM16 },
        { name: 'Шуруп КРЕП-КОМП Глухарь 8x120 (50шт)', quantity: parseFloat((1 * areaRatio).toFixed(2)), unit: 'компл', price: PRICING_CONFIG.consumables_gluhar8x120, total: Math.ceil(1 * areaRatio) * PRICING_CONFIG.consumables_gluhar8x120 },
        { name: 'Утеплитель межвенцовый ТермоДЖУТ (20м)', quantity: parseFloat((8 * areaRatio).toFixed(2)), unit: 'шт', price: PRICING_CONFIG.consumables_jute, total: Math.ceil(8 * areaRatio) * PRICING_CONFIG.consumables_jute },
        { name: 'Клейкая лента Delta Multi Band M 60 (25м)', quantity: parseFloat((15 * areaRatio).toFixed(2)), unit: 'шт', price: PRICING_CONFIG.consumables_deltaTape, total: Math.ceil(15 * areaRatio) * PRICING_CONFIG.consumables_deltaTape },
        { name: 'Гвозди шиферные 5x120 мм оцинк (1кг)', quantity: parseFloat((8 * areaRatio).toFixed(2)), unit: 'кг', price: PRICING_CONFIG.consumables_nailsShif5x120, total: Math.ceil(8 * areaRatio * PRICING_CONFIG.consumables_nailsShif5x120) },
        { name: 'Скоба для степлера тонкая 53/14 (1000шт)', quantity: parseFloat((5 * areaRatio).toFixed(2)), unit: 'компл', price: PRICING_CONFIG.consumables_staples53, total: Math.ceil(5 * areaRatio) * PRICING_CONFIG.consumables_staples53 },
        { name: 'Гвозди строительные 3x70 мм (1кг)', quantity: parseFloat((10 * areaRatio).toFixed(2)), unit: 'кг', price: PRICING_CONFIG.consumables_nails3x70, total: Math.ceil(10 * areaRatio * PRICING_CONFIG.consumables_nails3x70) },
        { name: 'Саморезы по дереву/ГКЛ 3.5x35 (3кг)', quantity: parseFloat((10 * areaRatio).toFixed(2)), unit: 'кг', price: PRICING_CONFIG.consumables_screws35x35, total: Math.ceil(10 * areaRatio * PRICING_CONFIG.consumables_screws35x35) },
        { name: 'Шуруп констр. для дер. домостр. 5x60 (1кг)', quantity: parseFloat((12 * areaRatio).toFixed(2)), unit: 'кг', price: PRICING_CONFIG.consumables_screwConstr5x60, total: Math.ceil(12 * areaRatio * PRICING_CONFIG.consumables_screwConstr5x60) },
        { name: 'Шуруп констр. для дер. домостр. 5x70 (50шт)', quantity: parseFloat((35 * areaRatio).toFixed(2)), unit: 'компл', price: PRICING_CONFIG.consumables_screwConstr5x70, total: Math.ceil(35 * areaRatio) * PRICING_CONFIG.consumables_screwConstr5x70 },
        { name: 'Лента бутил-каучуковая Изобонд LK (25м)', quantity: parseFloat((3 * areaRatio).toFixed(2)), unit: 'шт', price: PRICING_CONFIG.consumables_butylTape, total: Math.ceil(3 * areaRatio) * PRICING_CONFIG.consumables_butylTape },
        { name: 'Герметик акриловый Kudo Praktik white (260мл)', quantity: parseFloat((24 * areaRatio).toFixed(2)), unit: 'шт', price: PRICING_CONFIG.consumables_sealantKudo, total: Math.ceil(24 * areaRatio) * PRICING_CONFIG.consumables_sealantKudo },
        { name: 'Шайба DIN 125A 16 мм оцинк (1кг)', quantity: parseFloat((5 * areaRatio).toFixed(2)), unit: 'кг', price: PRICING_CONFIG.consumables_washerM16, total: Math.ceil(5 * areaRatio * PRICING_CONFIG.consumables_washerM16) },
        { name: 'Саморезы кровельные 4.8x29 RAL7024 (1кг)', quantity: parseFloat((15 * areaRatio).toFixed(2)), unit: 'кг', price: PRICING_CONFIG.consumables_screwsRoof48x29, total: Math.ceil(15 * areaRatio * PRICING_CONFIG.consumables_screwsRoof48x29) },
        { name: 'Саморезы по дереву/ГКЛ 4.8x100 (1кг)', quantity: parseFloat((10 * areaRatio).toFixed(2)), unit: 'кг', price: PRICING_CONFIG.consumables_screws48x100, total: Math.ceil(10 * areaRatio * PRICING_CONFIG.consumables_screws48x100) }
    ];

    sections.push({
        name: 'Расходные материалы',
        items: consumablesItems,
        total: consumablesItems.reduce((acc, item) => acc + item.total, 0),
        hideItems: true,
        passportItems: [
            'Расходные и вспомогательные материалы для строительства и монтажа'
        ]
    });

    // Считаем сумму всех собранных до этого момента разделов = Это чистая стоимость материалов
    const materialsTotal = sections.reduce((sum, s) => sum + s.total, 0);

    // Из умножения на коэффициент исключаем фундамент и окна/двери (они уже с прайсом "под ключ/с работой")
    const foundationSection = sections.find(s => s.name === 'Фундамент');
    const foundationTotal = foundationSection ? foundationSection.total : 0;
    
    const windowsDoorsSection = sections.find(s => s.name === 'Окна и Двери');
    const windowsDoorsTotal = windowsDoorsSection ? windowsDoorsSection.total : 0;

    const consumablesSection = sections.find(s => s.name === 'Расходные материалы');
    const consumablesTotal = consumablesSection ? consumablesSection.total : 0;

    const engineeringSection = sections.find(s => s.name === 'Инженерные сети');
    const engineeringTotal = engineeringSection ? engineeringSection.total : 0;

    const extraOptionsSection = sections.find(s => s.name === 'Дополнительные опции');
    const extraOptionsTotal = extraOptionsSection ? extraOptionsSection.total : 0;

    const terraceSection = sections.find(s => s.name === 'Терраса и Крыльцо');
    const terraceTotal = terraceSection ? terraceSection.total : 0;
    
    const excludedTotal = foundationTotal + windowsDoorsTotal + consumablesTotal + engineeringTotal + extraOptionsTotal + terraceTotal;
    const houseMaterialsTotal = materialsTotal - excludedTotal;

    // Коэффициент наценки на материалы (динамический: 1.8 для фанеры, 2.1 для остального)
    const multiplier = isPlywood ? 1.8 : 2.1; 
    const housePrice = Math.ceil(houseMaterialsTotal * multiplier);

    // Итоговая сумма (Дом + Исключения)
    let grandTotal = housePrice + excludedTotal;

    // Применяем пользовательскую скидку
    if (params.discountPercent > 0) {
        grandTotal = Math.ceil(grandTotal * (1 - params.discountPercent / 100));
    }
    
    // Добавляем фиксированную наценку
    grandTotal += params.markupAmount;

    return {
        sections,
        grandTotal,
        materialsTotal,
        baseTotal: housePrice + excludedTotal,
        hiddenTotal: 0
    };
}
