import type { HouseCalcState, EstimateResult, EstimateSection, EstimateLineItem, HouseModelId } from './houseCalcTypes';
import {
    HOUSE_MODELS,
    ENGINEERING_OPTIONS,
    FRAME_OPTIONS,
    WINDOW_OPTIONS,
    EXTERIOR_OPTIONS,
    INTERIOR_FINISH_OPTIONS,
    TERRACE_OPTIONS,
    BATHROOM_PRICES,
    FLOOR_PRICES,
    FOUNDATION_ASSEMBLY_DATA,
} from './houseCalculatorData';

function getModel(id: HouseModelId) {
    return HOUSE_MODELS.find(m => m.id === id)!;
}

function addItem(items: EstimateLineItem[], name: string, quantity: number, unit: string, price: number) {
    if (quantity <= 0 || price === 0) return;
    items.push({ name, quantity, unit, price, total: Math.round(quantity * price) });
}

function addFixed(items: EstimateLineItem[], name: string, price: number) {
    if (price === 0) return;
    items.push({ name, quantity: 1, unit: 'компл.', price, total: price });
}

function sumItems(items: EstimateLineItem[]): number {
    return items.reduce((s, i) => s + i.total, 0);
}

export function calculateHouseEstimate(state: HouseCalcState): EstimateResult {
    const sections: EstimateSection[] = [];
    const model = getModel(state.selectedHouse);
    const modelId = state.selectedHouse;

    // ─── 1. Базовая стоимость дома ──────────────────
    const baseItems: EstimateLineItem[] = [];
    addFixed(baseItems, `${model.name} — базовая комплектация`, model.basePrice);
    sections.push({ 
        name: 'Базовая стоимость дома', 
        items: baseItems, 
        total: model.basePrice,
        passportItems: [
            `Силовой каркас: доска камерной сушки 145х45 мм, калиброванная`,
            `Утепление: минераловатный утеплитель 150 мм (пол, стены, кровля)`,
            `Внешняя отделка: профилированный лист Vimatt + вставки из планкена`,
            `Внутренняя отделка: шлифованная фанера 12 мм (базовая)`,
            `Окна: ПВХ REHAU 70 мм, энергосберегающий стеклопакет 40 мм`,
            `Двери: входная ПВХ с остеклением, межкомнатные Albero`,
            `Инженерия: скрытая электроразводка, светильники, вентиляция`
        ],
        hideItems: true
    });

    // ─── 1.5. Фундамент и монтаж ──────────────────
    const foundationItems: EstimateLineItem[] = [];
    const foundationData = FOUNDATION_ASSEMBLY_DATA[modelId];
    const foundationPassport: string[] = [];
    
    if (state.addFoundation) {
        const pilePrice = state.pileLength === '2500' ? 6000 : state.pileLength === '3000' ? 6800 : 7300;
        addItem(foundationItems, `Свайно-винтовой фундамент (d=73мм, L=${state.pileLength}мм)`, foundationData.piles, 'шт', pilePrice);
        foundationPassport.push(`Фундамент: свайно-винтовой (сталь d=73мм, длина ${state.pileLength}мм) — ${foundationData.piles} шт.`);
    }
    if (state.addAssembly) {
        addFixed(foundationItems, `Монтаж дома на участке (удаленность до 50 км)`, foundationData.assemblyPrice);
        foundationPassport.push(`Монтаж: сборка модулей на участке, герметизация стыков, пусконаладка.`);
    }
    if (foundationItems.length > 0) {
        sections.push({ 
            name: 'Фундамент и монтаж', 
            items: foundationItems, 
            total: sumItems(foundationItems),
            passportItems: foundationPassport,
            hideItems: true
        });
    }

    // ─── 2. Отделка (внутренняя: стены, потолок, пол, покраска) ──────
    const finishItems: EstimateLineItem[] = [];
    const finishPassport: string[] = [];
    
    // Стены
    if (state.wallFinish === 'none') {
        finishPassport.push('Отделка стен: шлифованная фанера (стандарт)');
    } else if (state.wallFinish === 'vagonka') {
        addFixed(finishItems, INTERIOR_FINISH_OPTIONS.wallVagonka.name, INTERIOR_FINISH_OPTIONS.wallVagonka.priceByModel[modelId]);
        finishPassport.push('Отделка стен: вагонка штиль (хвоя)');
    } else if (state.wallFinish === 'imitBrus') {
        addFixed(finishItems, INTERIOR_FINISH_OPTIONS.wallImitBrus.name, INTERIOR_FINISH_OPTIONS.wallImitBrus.priceByModel[modelId]);
        finishPassport.push('Отделка стен: имитация бруса');
    } else if (state.wallFinish === 'gipsokarton') {
        addFixed(finishItems, INTERIOR_FINISH_OPTIONS.wallGipsokarton.name, INTERIOR_FINISH_OPTIONS.wallGipsokarton.priceByModel[modelId]);
        finishPassport.push('Отделка стен: подготовка под чистовую (ГКЛ)');
    }
    
    // Потолок
    if (state.ceilingFinish === 'none') {
        finishPassport.push('Отделка потолка: шлифованная фанера (стандарт)');
    } else if (state.ceilingFinish === 'fanera') {
        addFixed(finishItems, INTERIOR_FINISH_OPTIONS.ceilingFanera.name, INTERIOR_FINISH_OPTIONS.ceilingFanera.priceByModel[modelId]);
        finishPassport.push('Отделка потолка: премиальная фанера');
    } else if (state.ceilingFinish === 'imitBrus') {
        addFixed(finishItems, INTERIOR_FINISH_OPTIONS.ceilingImitBrus.name, INTERIOR_FINISH_OPTIONS.ceilingImitBrus.priceByModel[modelId]);
        finishPassport.push('Отделка потолка: имитация бруса / вагонка');
    }
    
    // Покраска
    if (state.paintWalls) {
        addFixed(finishItems, INTERIOR_FINISH_OPTIONS.paintWalls.name, INTERIOR_FINISH_OPTIONS.paintWalls.priceByModel[modelId]);
        finishPassport.push('Покраска стен: профессиональная покраска в 2 слоя (цвет на выбор)');
    }
    if (state.paintCeiling) {
        addFixed(finishItems, INTERIOR_FINISH_OPTIONS.paintCeiling.name, INTERIOR_FINISH_OPTIONS.paintCeiling.priceByModel[modelId]);
        finishPassport.push('Покраска потолка: профессиональная покраска в 2 слоя (цвет на выбор)');
    }
    
    // Пол (per m²)
    if (state.floorFinish !== 'none') {
        const floorDef = FLOOR_PRICES[state.floorFinish as keyof typeof FLOOR_PRICES];
        if (floorDef) {
            const floorArea = model.area - (state.bathroomFloorArea || 0);
            if (floorArea > 0) {
                const upgradePrice = floorDef.price - 700;
                if (upgradePrice !== 0) {
                    addItem(finishItems, `Напольное покрытие — ${floorDef.name} (${upgradePrice > 0 ? 'доплата' : 'экономия'})`, floorArea, 'м²', upgradePrice);
                }
            }
            finishPassport.push(`Напольное покрытие: ${floorDef.name}`);
        }
    } else {
        finishPassport.push(`Напольное покрытие: Ламинат 33 класс (стандарт)`);
    }
    
    // Доп. межкомнатная дверь
    if (state.extraInteriorDoorCount > 0) {
        addItem(finishItems, INTERIOR_FINISH_OPTIONS.extraInteriorDoor.name, state.extraInteriorDoorCount, 'шт', INTERIOR_FINISH_OPTIONS.extraInteriorDoor.price);
        finishPassport.push(`Доп. межкомнатные двери: ${state.extraInteriorDoorCount} шт.`);
    }

    if (finishItems.length > 0 || finishPassport.length > 0) {
        sections.push({ 
            name: 'Внутренняя отделка', 
            items: finishItems, 
            total: sumItems(finishItems),
            passportItems: finishPassport.length > 0 ? finishPassport : undefined,
            hideItems: true
        });
    }

    // ─── 3. Санузел ──────────────────
    const bathItems: EstimateLineItem[] = [];
    const bathPassport: string[] = [];
    
    if (state.bathroomFloorArea > 0) {
        bathPassport.push(`Площадь санузла: ${state.bathroomFloorArea} м²`);
        if (state.bathroomFloorFinish !== 'none') {
            const bathFloor = BATHROOM_PRICES.floor[state.bathroomFloorFinish as keyof typeof BATHROOM_PRICES.floor];
            const upgradePrice = bathFloor.price - 1500;
            if (upgradePrice !== 0) {
                addItem(bathItems, `Пол санузла — ${bathFloor.name} (${upgradePrice > 0 ? 'доплата' : 'экономия'})`, state.bathroomFloorArea, 'м²', upgradePrice);
            }
            bathPassport.push(`Пол санузла: ${bathFloor.name}`);
        }
        if (state.bathroomWallFinish !== 'none') {
            const bathWallArea = Math.round(Math.sqrt(state.bathroomFloorArea) * 4 * 2.5 * 10) / 10;
            const bathWall = BATHROOM_PRICES.wall[state.bathroomWallFinish as keyof typeof BATHROOM_PRICES.wall];
            const upgradePrice = bathWall.price - 450;
            if (upgradePrice !== 0) {
                addItem(bathItems, `Стены санузла — ${bathWall.name} (${upgradePrice > 0 ? 'доплата' : 'экономия'})`, bathWallArea, 'м²', upgradePrice);
            }
            bathPassport.push(`Стены санузла: ${bathWall.name}`);
        }
        bathPassport.push('Скрытая разводка труб ХВС/ГВС и канализации');
        bathPassport.push('Выводы под сантехнику (унитаз, раковина, душ)');
    }
    if (bathItems.length > 0 || bathPassport.length > 0) {
        sections.push({ 
            name: 'Санузел', 
            items: bathItems, 
            total: sumItems(bathItems),
            passportItems: bathPassport.length > 0 ? bathPassport : undefined,
            hideItems: true
        });
    }

    // ─── 4. Инженерные элементы ──────────────────
    const engItems: EstimateLineItem[] = [];
    const engPassport: string[] = [];
    
    if (state.lightingCableCount > 0) {
        addItem(engItems, ENGINEERING_OPTIONS.lightingCable.name, state.lightingCableCount, 'шт', ENGINEERING_OPTIONS.lightingCable.price);
        engPassport.push(`Доп. выводы освещения: ${state.lightingCableCount} шт.`);
    }
    if (state.warmTapCount > 0) {
        addItem(engItems, ENGINEERING_OPTIONS.warmTap.name, state.warmTapCount, 'шт', ENGINEERING_OPTIONS.warmTap.price);
        engPassport.push(`Уличные краны (незамерзающие): ${state.warmTapCount} шт.`);
    }
    if (state.lightSwitchCount > 0) {
        addItem(engItems, ENGINEERING_OPTIONS.lightSwitch.name, state.lightSwitchCount, 'шт', ENGINEERING_OPTIONS.lightSwitch.price);
        engPassport.push(`Проходные переключатели: ${state.lightSwitchCount} групп.`);
    }
    if (state.extraSocketCount > 0) {
        addItem(engItems, ENGINEERING_OPTIONS.extraSocket.name, state.extraSocketCount, 'шт', ENGINEERING_OPTIONS.extraSocket.price);
        engPassport.push(`Доп. розетки: ${state.extraSocketCount} шт.`);
    }
    if (state.spotlightCount > 0) {
        addItem(engItems, ENGINEERING_OPTIONS.spotlight.name, state.spotlightCount, 'шт', ENGINEERING_OPTIONS.spotlight.price);
        engPassport.push(`Доп. точечные светильники: ${state.spotlightCount} шт.`);
    }
    if (state.streetLightCount > 0) {
        addItem(engItems, ENGINEERING_OPTIONS.streetLight.name, state.streetLightCount, 'шт', ENGINEERING_OPTIONS.streetLight.price);
        engPassport.push(`Доп. уличные светильники: ${state.streetLightCount} шт.`);
    }
    if (state.acPrepCount > 0) {
        addItem(engItems, ENGINEERING_OPTIONS.acPrep.name, state.acPrepCount, 'шт', ENGINEERING_OPTIONS.acPrep.price);
        engPassport.push(`Подготовка под кондиционеры (трасса + эл-во): ${state.acPrepCount} шт.`);
    }
    if (state.wetPointSplit) {
        addFixed(engItems, ENGINEERING_OPTIONS.wetPointSplit.name, ENGINEERING_OPTIONS.wetPointSplit.price);
        engPassport.push(`Раздельная разводка мокрых точек (кухня/санузел).`);
    }
    if (state.convectorCount > 0) {
        addItem(engItems, ENGINEERING_OPTIONS.convector.name, state.convectorCount, 'шт', ENGINEERING_OPTIONS.convector.price);
        engPassport.push(`Внутрипольные конвекторы: ${state.convectorCount} шт.`);
    }
    if (state.breezer80Count > 0) {
        addItem(engItems, ENGINEERING_OPTIONS.breezer80.name, state.breezer80Count, 'шт', ENGINEERING_OPTIONS.breezer80.price);
        engPassport.push(`Приточные установки Ballu ASP-80: ${state.breezer80Count} шт.`);
    }
    if (state.breezer100Count > 0) {
        addItem(engItems, ENGINEERING_OPTIONS.breezer100.name, state.breezer100Count, 'шт', ENGINEERING_OPTIONS.breezer100.price);
        engPassport.push(`Приточные установки Ballu ASP-100 (с CO₂): ${state.breezer100Count} шт.`);
    }
    
    if (state.heatingSystem === 'electric') {
        addItem(engItems, 'Тёплый пол электрический модульный ЗЕБРА ЭВО-300 WF', state.warmFloorArea, 'м²', 2200);
        addItem(engItems, ENGINEERING_OPTIONS.electricWarmFloorThermostat.name, state.warmFloorThermostats, 'шт', ENGINEERING_OPTIONS.electricWarmFloorThermostat.price);
        engPassport.push(`Система отопления: электрический теплый пол ЗЕБРА (${state.warmFloorArea} м²) с терморегуляторами.`);
    } else if (state.heatingSystem === 'water') {
        addItem(engItems, 'Тёплый пол водяной (котёл, коллектор, трубы, ЭППС)', state.warmFloorArea, 'м²', 3900);
        addItem(engItems, ENGINEERING_OPTIONS.warmFloorThermostat.name, state.warmFloorThermostats, 'шт', ENGINEERING_OPTIONS.warmFloorThermostat.price);
        engPassport.push(`Система отопления: водяной теплый пол (${state.warmFloorArea} м²) с котлом и автоматикой.`);
    } else {
        // Стандартная комплектация — описание уже в базовом разделе
    }

    if (engItems.length > 0 || engPassport.length > 0) {
        sections.push({ 
            name: 'Инженерные решения', 
            items: engItems, 
            total: sumItems(engItems),
            passportItems: engPassport.length > 0 ? engPassport : undefined,
            hideItems: true
        });
    }

    // ─── 5. Каркас и доп. опции ──────────────────
    const frameItems: EstimateLineItem[] = [];
    const framePassport: string[] = [];
    
    if (state.moduleExtendCount > 0 && FRAME_OPTIONS.moduleExtend.priceByModel[modelId]) {
        addItem(frameItems, FRAME_OPTIONS.moduleExtend.name, state.moduleExtendCount, 'шт', FRAME_OPTIONS.moduleExtend.priceByModel[modelId]!);
        framePassport.push(`Увеличение длины модулей: +60 см (${state.moduleExtendCount} шт.).`);
    }
    if (state.mouseMesh) {
        addFixed(frameItems, FRAME_OPTIONS.mouseMesh.name, FRAME_OPTIONS.mouseMesh.priceByModel[modelId]);
        framePassport.push(`Защита от грызунов: металлическая сетка ЦПВС по всему основанию.`);
    }
    if (state.extraInsulation) {
        addFixed(frameItems, FRAME_OPTIONS.extraInsulation.name, FRAME_OPTIONS.extraInsulation.priceByModel[modelId]);
        framePassport.push(`Усиленное утепление стен: общая толщина 200 мм.`);
    }
    if (state.removePartition) {
        addFixed(frameItems, FRAME_OPTIONS.removePartition.name, FRAME_OPTIONS.removePartition.price);
        framePassport.push(`Свободная планировка: удаление межмодульных перегородок.`);
    }
    if (state.extraPartitionLength > 0 && FRAME_OPTIONS.extraPartition.availableFor.includes(modelId)) {
        addItem(frameItems, FRAME_OPTIONS.extraPartition.name, state.extraPartitionLength, 'м.п.', FRAME_OPTIONS.extraPartition.price);
        framePassport.push(`Доп. перегородки: ${state.extraPartitionLength} м.п.`);
    }
    
    if (frameItems.length > 0 || framePassport.length > 0) {
        sections.push({ 
            name: 'Конструктив и каркас', 
            items: frameItems, 
            total: sumItems(frameItems),
            passportItems: framePassport.length > 0 ? framePassport : undefined,
            hideItems: true
        });
    }

    // ─── 6. Окна и проемы ──────────────────
    const winItems: EstimateLineItem[] = [];
    const winPassport: string[] = [];
    
    if (state.safeDoor && (!WINDOW_OPTIONS.safeDoor.availableFor || WINDOW_OPTIONS.safeDoor.availableFor.includes(modelId))) {
        addFixed(winItems, WINDOW_OPTIONS.safeDoor.name, WINDOW_OPTIONS.safeDoor.price);
        winPassport.push('Входная группа: сейф-дверь с терморазрывом + крыльцо со ступенями.');
    }
    if (state.relocateDoor && (!WINDOW_OPTIONS.relocateDoor.availableFor || WINDOW_OPTIONS.relocateDoor.availableFor.includes(modelId))) {
        addFixed(winItems, WINDOW_OPTIONS.relocateDoor.name, WINDOW_OPTIONS.relocateDoor.price);
        winPassport.push('Перенос входной двери на боковую стену.');
    }
    
    if (state.panoramicTrapezoidCount > 0) {
        addItem(winItems, WINDOW_OPTIONS.panoramicTrapezoid.name, state.panoramicTrapezoidCount, 'шт', WINDOW_OPTIONS.panoramicTrapezoid.price);
        winPassport.push(`Панорамное остекление: замена окон на трапециевидные (${state.panoramicTrapezoidCount} шт.).`);
    }
    if (state.extraPanoramicSection) {
        addFixed(winItems, WINDOW_OPTIONS.extraPanoramicSection.name, WINDOW_OPTIONS.extraPanoramicSection.price);
        winPassport.push('Доп. секция панорамного остекления в гостиной.');
    }
    
    if (state.extraWindow1000x2000 > 0) addItem(winItems, WINDOW_OPTIONS.win1000x2000.name, state.extraWindow1000x2000, 'шт', WINDOW_OPTIONS.win1000x2000.price);
    if (state.extraWindow500x2000 > 0) addItem(winItems, WINDOW_OPTIONS.win500x2000.name, state.extraWindow500x2000, 'шт', WINDOW_OPTIONS.win500x2000.price);
    if (state.extraWindow600x500 > 0) addItem(winItems, WINDOW_OPTIONS.win600x500.name, state.extraWindow600x500, 'шт', WINDOW_OPTIONS.win600x500.price);
    if (state.extraWindow1500x500 > 0) addItem(winItems, WINDOW_OPTIONS.win1500x500.name, state.extraWindow1500x500, 'шт', WINDOW_OPTIONS.win1500x500.price);
    
    if (state.extraWindow1000x2000 + state.extraWindow500x2000 + state.extraWindow600x500 + state.extraWindow1500x500 > 0) {
        winPassport.push('Установка дополнительных оконных блоков согласно планировке.');
    }
    
    if (state.windowLamination) {
        addFixed(winItems, WINDOW_OPTIONS.windowLamination.name, WINDOW_OPTIONS.windowLamination.price);
        winPassport.push('Декоративная ламинация оконных профилей (цвет Anthracit/RAL7024).');
    }

    if (winItems.length > 0 || winPassport.length > 0) {
        sections.push({ 
            name: 'Окна и проемы', 
            items: winItems, 
            total: sumItems(winItems),
            passportItems: winPassport.length > 0 ? winPassport : undefined,
            hideItems: true
        });
    }

    // ─── 7. Внешняя отделка ──────────────────
    const extItems: EstimateLineItem[] = [];
    const extPassport: string[] = [];
    
    if (state.facadePlanken) {
        addFixed(extItems, EXTERIOR_OPTIONS.facadePlanken.name, EXTERIOR_OPTIONS.facadePlanken.priceByModel[modelId]);
        extPassport.push('Фасад: полная отделка деревянным планкеном с покраской в 2 слоя.');
    }
    
    if (state.gutterPlastic) {
        addFixed(extItems, EXTERIOR_OPTIONS.gutterPlastic.name, EXTERIOR_OPTIONS.gutterPlastic.priceByModel[modelId]);
        extPassport.push('Водосточная система: ПВХ Döcke (Premium).');
    }
    if (state.gutterMetal) {
        addFixed(extItems, EXTERIOR_OPTIONS.gutterMetal.name, EXTERIOR_OPTIONS.gutterMetal.priceByModel[modelId]);
        extPassport.push('Водосточная система: металлическая Grand Line (Lux).');
    }
    if (state.plinthPlankenArea > 0) {
        addItem(extItems, EXTERIOR_OPTIONS.plinthPlanken.name, state.plinthPlankenArea, 'м²', EXTERIOR_OPTIONS.plinthPlanken.price);
        extPassport.push(`Декоративная отделка цоколя: планкен (${state.plinthPlankenArea} м²).`);
    }
    
    if (extItems.length > 0 || extPassport.length > 0) {
        sections.push({ 
            name: 'Фасадные решения', 
            items: extItems, 
            total: sumItems(extItems),
            passportItems: extPassport.length > 0 ? extPassport : undefined,
            hideItems: true
        });
    }

    // ─── 8. Терраса / Крыльцо ──────────────────
    const terItems: EstimateLineItem[] = [];
    const terPassport: string[] = [];
    
    if (state.terraceCloseSideCount > 0) {
        addItem(terItems, TERRACE_OPTIONS.terraceCloseSide.name, state.terraceCloseSideCount, 'шт', TERRACE_OPTIONS.terraceCloseSide.price);
        terPassport.push(`Ограждение террасы: закрытие боковых сторон (${state.terraceCloseSideCount} шт.).`);
    }
    if (state.porchCanopy && TERRACE_OPTIONS.porchCanopy.availableFor.includes(modelId)) {
        addFixed(terItems, TERRACE_OPTIONS.porchCanopy.name, TERRACE_OPTIONS.porchCanopy.price);
        terPassport.push('Навес над крыльцом: стальной каркас + кровельное покрытие.');
    }
    if (state.closedTerraceArea > 0) {
        addItem(terItems, TERRACE_OPTIONS.closedTerraceArea.name, state.closedTerraceArea, 'м²', TERRACE_OPTIONS.closedTerraceArea.price);
        terPassport.push(`Доп. площадь закрытой террасы: ${state.closedTerraceArea} м².`);
    }
    if (state.openTerraceArea > 0) {
        addItem(terItems, TERRACE_OPTIONS.openTerraceArea.name, state.openTerraceArea, 'м²', TERRACE_OPTIONS.openTerraceArea.price);
        terPassport.push(`Доп. площадь открытой террасы: ${state.openTerraceArea} м².`);
    }
    if (state.railingsPlankenLength > 0) {
        addItem(terItems, TERRACE_OPTIONS.railingsPlanken.name, state.railingsPlankenLength, 'п.м.', TERRACE_OPTIONS.railingsPlanken.price);
        terPassport.push(`Перила террасы: горизонтальный планкен (${state.railingsPlankenLength} м.п.).`);
    }
    if (state.railingsCrossLength > 0) {
        addItem(terItems, TERRACE_OPTIONS.railingsCross.name, state.railingsCrossLength, 'п.м.', TERRACE_OPTIONS.railingsCross.price);
        terPassport.push(`Перила террасы: декоративный узор "крестик" (${state.railingsCrossLength} м.п.).`);
    }
    
    if (terItems.length > 0 || terPassport.length > 0) {
        sections.push({ 
            name: 'Террасы и малые формы', 
            items: terItems, 
            total: sumItems(terItems),
            passportItems: terPassport.length > 0 ? terPassport : undefined,
            hideItems: true
        });
    }

    // ─── 9. Доп. услуги ──────────────────
    // Сгруппируем услуги по категориям для паспорта
    const svcByCat: Record<string, string[]> = {};
    const svcItems: EstimateLineItem[] = [];
    
    for (const svc of state.services) {
        if (svc.quantity > 0) {
            addItem(svcItems, `${svc.name}${svc.specs ? ` (${svc.specs})` : ''}`, svc.quantity, svc.unit, svc.price);
            if (!svcByCat[svc.category]) svcByCat[svc.category] = [];
            svcByCat[svc.category].push(`${svc.name} ${svc.specs}: ${svc.quantity} ${svc.unit}`);
        }
    }
    
    if (svcItems.length > 0) {
        const svcPassport: string[] = [];
        Object.entries(svcByCat).forEach(([cat, items]) => {
            svcPassport.push(`${cat}: ${items.join(', ')}`);
        });
        
        sections.push({ 
            name: 'Дополнительные услуги', 
            items: svcItems, 
            total: sumItems(svcItems),
            passportItems: svcPassport,
            hideItems: true
        });
    }

    // ─── 11. Итоговые расчеты ──────────────────
    const customItems: EstimateLineItem[] = [];
    for (const ci of state.customItems) {
        if (ci.total > 0) {
            customItems.push({ name: ci.name, quantity: ci.quantity, unit: ci.unit, price: ci.price, total: ci.total });
        }
    }
    if (customItems.length > 0) {
        sections.push({ 
            name: 'Дополнительные опции', 
            items: customItems, 
            total: sumItems(customItems),
            hideItems: false // Произвольные позиции лучше видеть детально
        });
    }

    // ─── ИТОГИ ──────────────────
    const basePrice = model.basePrice;
    const optionsTotal = sections.reduce((s, sec) => s + sec.total, 0) - basePrice;
    let grandTotal = sections.reduce((s, sec) => s + sec.total, 0);

    // Скидка
    if (state.discountPercent > 0) {
        grandTotal = grandTotal - Math.ceil(grandTotal * (state.discountPercent / 100));
    }
    // Наценка
    grandTotal += state.markupAmount;

    return { sections, basePrice, optionsTotal, grandTotal };
}
