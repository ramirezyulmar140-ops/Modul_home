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
    DELIVERY_VEHICLES,
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

    // ─── Unified Specification (Passport) — now top-level sections ───
    const spec: Record<number, { title: string; items: string[] }> = {
        1: { title: 'Перекрытие пола', items: [] },
        2: { title: 'Наружные стены', items: [] },
        3: { title: 'Стены внутренние (Перегородки)', items: [] },
        4: { title: 'Крыша', items: [] },
        5: { title: 'Окна и Двери', items: [] },
        6: { title: 'Внутренняя отделка', items: [] },
        7: { title: 'Инженерные сети', items: [] },
        8: { title: 'Расходные материалы', items: [] },
    };

    spec[1].items.push('Нижняя силовая обвязка из пакета 3-х досок 150×50 мм');
    spec[1].items.push('Лаги пола из сухой строганой доски 150×50 мм');
    spec[1].items.push('Черновой пол из плит OSB толщиной 22 мм');
    spec[1].items.push('Утепление пола минеральным утеплителем толщиной 150 мм');
    if (state.mouseMesh) spec[1].items.push('Металлическая защитная сетка от грызунов ЦПВС');
    spec[1].items.push('Ветрозащитная мембрана по нижней части пола');

    spec[2].items.push('Несущий каркас наружных стен из сухой строганой доски 150×50 мм');
    spec[2].items.push(`Утепление наружных стен минеральным утеплителем толщиной ${state.extraInsulation ? 200 : 150} мм`);
    if (state.facadePlanken) {
        spec[2].items.push('Отделка фасада: полная отделка деревянным планкеном с покраской в 2 слоя');
    } else {
        spec[2].items.push('Отделка фронтонов фасадной доской планкен');
        spec[2].items.push('Отделка боковых стен фасада металлическим профилированным листом');
    }
    spec[2].items.push('Ветрозащитная мембрана наружных стен');

    spec[3].items.push('Каркас внутренних перегородок из сухой строганой доски 100×50 мм');
    spec[3].items.push('Звукоизоляция внутренних перегородок толщиной 100 мм');
    if (state.removePartition) spec[3].items.push('Свободная планировка: удаление межмодульных перегородок');
    if (state.extraPartitionLength > 0) spec[3].items.push(`Доп. перегородки: ${state.extraPartitionLength} м.п.`);

    spec[4].items.push('Стропильная система крыши из сухой строганой доски 150×50 мм');
    spec[4].items.push('Обрешетка крыши из сухой строганой доски 100×25 мм');
    spec[4].items.push('Кровельное покрытие из металлочерепицы или профилированного листа');
    spec[4].items.push('Утепление кровли минеральным утеплителем толщиной 150 мм');
    spec[4].items.push('Ветровлагозащитная мембрана кровли');
    if (state.gutterPlastic) spec[4].items.push('Водосточная система: ПВХ Döcke (Premium)');
    if (state.gutterMetal) spec[4].items.push('Водосточная система: металлическая Grand Line (Lux)');

    let winDesc = 'Окна: ПВХ REHAU 70 мм, энергосберегающий стеклопакет 40 мм';
    if (state.windowLamination) winDesc += ' (ламинация снаружи RAL7024)';
    if (state.windowLaminationInside) winDesc += ' (ламинация внутри)';
    spec[5].items.push(winDesc);
    if (state.panoramicTrapezoidCount > 0) spec[5].items.push(`Панорамное остекление: трапециевидные окна (${state.panoramicTrapezoidCount} шт.)`);
    if (state.extraPanoramicSection) spec[5].items.push('Доп. секция панорамного остекления в гостиной');
    if (state.safeDoor) {
        spec[5].items.push('Входная группа: сейф-дверь с терморазрывом + крыльцо со ступенями');
    } else {
        spec[5].items.push('Дверь на террасу (ПВХ с остеклением)');
    }
    spec[5].items.push(`Межкомнатные двери с фурнитурой${state.extraInteriorDoorCount > 0 ? ` (+${state.extraInteriorDoorCount} доп.)` : ''}`);

    spec[6].items.push('Подложка под напольное покрытие');
    if (state.floorFinish === 'none') {
        spec[6].items.push('Финишное напольное покрытие: Ламинат 33 класс (стандарт)');
    } else {
        const floorDef = FLOOR_PRICES[state.floorFinish as keyof typeof FLOOR_PRICES];
        spec[6].items.push(`Финишное напольное покрытие: ${floorDef?.name || state.floorFinish}`);
    }
    let bathFloor = 'кварцвинил';
    if (state.bathroomFloorFinish !== 'none') {
        const bf = BATHROOM_PRICES.floor[state.bathroomFloorFinish as keyof typeof BATHROOM_PRICES.floor];
        bathFloor = bf?.name || state.bathroomFloorFinish;
    }
    spec[6].items.push(`Влагостойкое напольное покрытие санузла: ${bathFloor}`);
    const wallMap: Record<string, string> = { none: 'шлифованная фанера (стандарт)', vagonka: 'вагонка штиль (хвоя)', imitBrus: 'имитация бруса', gipsokarton: 'подготовка под чистовую (ГКЛ)' };
    spec[6].items.push(`Отделка стен: ${wallMap[state.wallFinish as keyof typeof wallMap] || state.wallFinish}${state.paintWalls ? ' + покраска в 2 слоя' : ''}`);
    let bathWall = 'фанера + зона душевой из кварцвинила (стандарт)';
    if (state.bathroomWallFinish !== 'none') {
        const bw = BATHROOM_PRICES.wall[state.bathroomWallFinish as keyof typeof BATHROOM_PRICES.wall];
        bathWall = bw?.name || state.bathroomWallFinish;
    }
    spec[6].items.push(`Отделка стен санузла: ${bathWall}`);
    const ceilMap: Record<string, string> = { none: 'натяжной потолок белый матовый (стандарт)', fanera: 'премиальная фанера', imitBrus: 'имитация бруса / вагонка' };
    spec[6].items.push(`Отделка потолка: ${ceilMap[state.ceilingFinish as keyof typeof ceilMap] || state.ceilingFinish}${state.paintCeiling && state.ceilingFinish !== 'none' ? ' + покраска в 2 слоя' : ''}`);

    spec[7].items.push('Скрытая электроразводка, розетки, выключатели, светильники');
    if (state.heatingSystem === 'electric') {
        spec[7].items.push(`Система отопления: электрический теплый пол ЗЕБРА (${state.warmFloorArea} м²) + терморегуляторы`);
    } else if (state.heatingSystem === 'water') {
        spec[7].items.push(`Система отопления: водяной теплый пол (${state.warmFloorArea} м²) + котел и автоматика`);
    } else {
        spec[7].items.push('Система отопления: электрические конвекторы (стандарт)');
    }
    spec[7].items.push('Сантехника и скрытая разводка коммуникаций ХВС/ГВС/Канализация');
    if (state.acPrepCount > 0) spec[7].items.push(`Подготовка под кондиционеры: ${state.acPrepCount} шт.`);
    if (state.breezer80Count + state.breezer100Count > 0) spec[7].items.push(`Приточные установки Ballu: ${state.breezer80Count + state.breezer100Count} шт.`);

    spec[8].items.push('Расходные и вспомогательные материалы для строительства и монтажа');

    // Create sections for technical categories
    for (const key of [1, 2, 3, 4, 5, 6, 7, 8]) {
        const cat = spec[key];
        sections.push({
            name: cat.title,
            items: key === 1 ? [{ name: `${model.name} — базовая комплектация`, quantity: 1, unit: 'компл.', price: model.basePrice, total: model.basePrice }] : [],
            total: key === 1 ? model.basePrice : 0,
            passportItems: cat.items,
            hideItems: true
        });
    }

    // ─── 1.5. Фундамент и монтаж ──────────────────
    const foundationItems: EstimateLineItem[] = [];
    const foundationData = FOUNDATION_ASSEMBLY_DATA[modelId];
    
    if (state.addFoundation) {
        const pilePrice = state.pileLength === '2500' ? 6000 : state.pileLength === '3000' ? 6800 : 7300;
        addItem(foundationItems, `Свайно-винтовой фундамент (d=73мм, L=${state.pileLength}мм)`, foundationData.piles, 'шт', pilePrice);
    }
    if (state.addAssembly) {
        if (state.useDeliveryMap && state.deliveryDistance > 0) {
            const vehicleDescs = (state.deliveryVehicles || []).map(entry => {
                const v = DELIVERY_VEHICLES.find(d => d.id === entry.vehicleId);
                return `${v?.name || '?'} ×${entry.qty}`;
            }).join(', ');
            
            addFixed(foundationItems, 'Монтаж и сборка дома.', foundationData.assemblyPrice);
            foundationItems.push({ name: `Доставка модулей (Адрес: ${state.deliveryAddress || 'не указан'}).`, quantity: 1, unit: 'адрес', price: 0, total: 0 });
            
            let techLine = `Расстояние: ${state.deliveryDistance} км. Техника: ${vehicleDescs}.`;
            if (state.needLoadingCrane) {
                techLine += ` Вкл. услуги крана 25т (погрузка/монтаж).`;
            }
            addFixed(foundationItems, techLine, state.deliveryPrice);
        } else {
            addFixed(foundationItems, `Монтаж дома на участке`, foundationData.assemblyPrice);
        }
    }
    if (foundationItems.length > 0) {
        sections.push({ 
            name: 'Фундамент и монтаж', 
            items: foundationItems, 
            total: sumItems(foundationItems),
            hideItems: false
        });
    }

    // ─── 2. Отделка ──────────────────
    const finishItems: EstimateLineItem[] = [];
    
    if (state.wallFinish === 'vagonka') {
        addFixed(finishItems, INTERIOR_FINISH_OPTIONS.wallVagonka.name, INTERIOR_FINISH_OPTIONS.wallVagonka.priceByModel[modelId]);
    } else if (state.wallFinish === 'imitBrus') {
        addFixed(finishItems, INTERIOR_FINISH_OPTIONS.wallImitBrus.name, INTERIOR_FINISH_OPTIONS.wallImitBrus.priceByModel[modelId]);
    } else if (state.wallFinish === 'gipsokarton') {
        addFixed(finishItems, INTERIOR_FINISH_OPTIONS.wallGipsokarton.name, INTERIOR_FINISH_OPTIONS.wallGipsokarton.priceByModel[modelId]);
    }
    
    if (state.ceilingFinish === 'fanera') {
        addFixed(finishItems, INTERIOR_FINISH_OPTIONS.ceilingFanera.name, INTERIOR_FINISH_OPTIONS.ceilingFanera.priceByModel[modelId]);
    } else if (state.ceilingFinish === 'imitBrus') {
        addFixed(finishItems, INTERIOR_FINISH_OPTIONS.ceilingImitBrus.name, INTERIOR_FINISH_OPTIONS.ceilingImitBrus.priceByModel[modelId]);
    }
    
    if (state.paintWalls) {
        addFixed(finishItems, INTERIOR_FINISH_OPTIONS.paintWalls.name, INTERIOR_FINISH_OPTIONS.paintWalls.priceByModel[modelId]);
    }
    if (state.paintCeiling && state.ceilingFinish !== 'none') {
        addFixed(finishItems, INTERIOR_FINISH_OPTIONS.paintCeiling.name, INTERIOR_FINISH_OPTIONS.paintCeiling.priceByModel[modelId]);
    }
    
    if (state.floorFinish !== 'none') {
        const floorDef = FLOOR_PRICES[state.floorFinish as keyof typeof FLOOR_PRICES];
        if (floorDef) {
            const floorArea = model.area - (state.bathroomFloorArea || 0);
            if (floorArea > 0) {
                const upgradePrice = floorDef.price - 700;
                if (upgradePrice !== 0) addItem(finishItems, `Напольное покрытие — ${floorDef.name} (${upgradePrice > 0 ? 'доплата' : 'экономия'})`, floorArea, 'м²', upgradePrice);
            }
        }
    }

    if (state.extraInteriorDoorCount > 0) {
        addItem(finishItems, INTERIOR_FINISH_OPTIONS.extraInteriorDoor.name, state.extraInteriorDoorCount, 'шт', INTERIOR_FINISH_OPTIONS.extraInteriorDoor.price);
    }

    if (finishItems.length > 0) {
        sections.push({ name: 'Внутренняя отделка', items: finishItems, total: sumItems(finishItems), hideItems: false });
    }

    // ─── 3. Санузел ──────────────────
    const bathItems: EstimateLineItem[] = [];
    if (state.bathroomFloorArea > 0) {
        if (state.bathroomFloorFinish !== 'none') {
            const bathFloor = BATHROOM_PRICES.floor[state.bathroomFloorFinish as keyof typeof BATHROOM_PRICES.floor];
            const upgradePrice = bathFloor.price - 1500;
            if (upgradePrice !== 0) addItem(bathItems, `Пол санузла — ${bathFloor.name}`, state.bathroomFloorArea, 'м²', upgradePrice);
        }
        if (state.bathroomWallFinish !== 'none') {
            const bathWallArea = Math.round(Math.sqrt(state.bathroomFloorArea) * 4 * 2.5 * 10) / 10;
            const bathWall = BATHROOM_PRICES.wall[state.bathroomWallFinish as keyof typeof BATHROOM_PRICES.wall];
            const upgradePrice = bathWall.price - 450;
            if (upgradePrice !== 0) addItem(bathItems, `Стены санузла — ${bathWall.name}`, bathWallArea, 'м²', upgradePrice);
        }
    }
    if (bathItems.length > 0) {
        sections.push({ name: 'Санузел', items: bathItems, total: sumItems(bathItems), hideItems: false });
    }

    // ─── 4. Инженерные элементы ──────────────────
    const engItems: EstimateLineItem[] = [];
    if (state.lightingCableCount > 0) addItem(engItems, ENGINEERING_OPTIONS.lightingCable.name, state.lightingCableCount, 'шт', ENGINEERING_OPTIONS.lightingCable.price);
    if (state.warmTapCount > 0) addItem(engItems, ENGINEERING_OPTIONS.warmTap.name, state.warmTapCount, 'шт', ENGINEERING_OPTIONS.warmTap.price);
    if (state.lightSwitchCount > 0) addItem(engItems, ENGINEERING_OPTIONS.lightSwitch.name, state.lightSwitchCount, 'шт', ENGINEERING_OPTIONS.lightSwitch.price);
    if (state.extraSocketCount > 0) addItem(engItems, ENGINEERING_OPTIONS.extraSocket.name, state.extraSocketCount, 'шт', ENGINEERING_OPTIONS.extraSocket.price);
    if (state.spotlightCount > 0) addItem(engItems, ENGINEERING_OPTIONS.spotlight.name, state.spotlightCount, 'шт', ENGINEERING_OPTIONS.spotlight.price);
    if (state.streetLightCount > 0) addItem(engItems, ENGINEERING_OPTIONS.streetLight.name, state.streetLightCount, 'шт', ENGINEERING_OPTIONS.streetLight.price);
    if (state.acPrepCount > 0) addItem(engItems, ENGINEERING_OPTIONS.acPrep.name, state.acPrepCount, 'шт', ENGINEERING_OPTIONS.acPrep.price);
    if (state.wetPointSplit) addFixed(engItems, ENGINEERING_OPTIONS.wetPointSplit.name, ENGINEERING_OPTIONS.wetPointSplit.price);
    if (state.convectorCount > 0) addItem(engItems, ENGINEERING_OPTIONS.convector.name, state.convectorCount, 'шт', ENGINEERING_OPTIONS.convector.price);
    if (state.breezer80Count > 0) addItem(engItems, ENGINEERING_OPTIONS.breezer80.name, state.breezer80Count, 'шт', ENGINEERING_OPTIONS.breezer80.price);
    if (state.breezer100Count > 0) addItem(engItems, ENGINEERING_OPTIONS.breezer100.name, state.breezer100Count, 'шт', ENGINEERING_OPTIONS.breezer100.price);
    
    if (state.heatingSystem === 'electric') {
        addItem(engItems, 'Тёплый пол электрический модульный ЗЕБРА ЭВО-300 WF', state.warmFloorArea, 'м²', 2200);
        addItem(engItems, ENGINEERING_OPTIONS.electricWarmFloorThermostat.name, state.warmFloorThermostats, 'шт', ENGINEERING_OPTIONS.electricWarmFloorThermostat.price);
    } else if (state.heatingSystem === 'water') {
        addItem(engItems, 'Тёплый пол водяной (котёл, коллектор, трубы, ЭППС)', state.warmFloorArea, 'м²', 3900);
        addItem(engItems, ENGINEERING_OPTIONS.warmFloorThermostat.name, state.warmFloorThermostats, 'шт', ENGINEERING_OPTIONS.warmFloorThermostat.price);
    }

    if (engItems.length > 0) {
        sections.push({ name: 'Инженерные решения', items: engItems, total: sumItems(engItems), hideItems: false });
    }

    // ─── 5. Каркас и доп. опции ──────────────────
    const frameItems: EstimateLineItem[] = [];
    if (state.moduleExtendCount > 0 && FRAME_OPTIONS.moduleExtend.priceByModel[modelId]) addItem(frameItems, FRAME_OPTIONS.moduleExtend.name, state.moduleExtendCount, 'шт', FRAME_OPTIONS.moduleExtend.priceByModel[modelId]!);
    if (state.mouseMesh) addFixed(frameItems, FRAME_OPTIONS.mouseMesh.name, FRAME_OPTIONS.mouseMesh.priceByModel[modelId]);
    if (state.extraInsulation) addFixed(frameItems, FRAME_OPTIONS.extraInsulation.name, FRAME_OPTIONS.extraInsulation.priceByModel[modelId]);
    if (state.removePartition) addFixed(frameItems, FRAME_OPTIONS.removePartition.name, FRAME_OPTIONS.removePartition.price);
    if (state.extraPartitionLength > 0 && FRAME_OPTIONS.extraPartition.availableFor.includes(modelId)) addItem(frameItems, FRAME_OPTIONS.extraPartition.name, state.extraPartitionLength, 'м.п.', FRAME_OPTIONS.extraPartition.price);
    if (frameItems.length > 0) {
        sections.push({ name: 'Конструктив и каркас', items: frameItems, total: sumItems(frameItems), hideItems: false });
    }

    // ─── 6. Окна и проемы ──────────────────
    const winItems: EstimateLineItem[] = [];
    if (state.safeDoor && (!WINDOW_OPTIONS.safeDoor.availableFor || WINDOW_OPTIONS.safeDoor.availableFor.includes(modelId))) addFixed(winItems, WINDOW_OPTIONS.safeDoor.name, WINDOW_OPTIONS.safeDoor.price);
    if (state.relocateDoor && (!WINDOW_OPTIONS.relocateDoor.availableFor || WINDOW_OPTIONS.relocateDoor.availableFor.includes(modelId))) addFixed(winItems, WINDOW_OPTIONS.relocateDoor.name, WINDOW_OPTIONS.relocateDoor.price);
    if (state.panoramicTrapezoidCount > 0) addItem(winItems, WINDOW_OPTIONS.panoramicTrapezoid.name, state.panoramicTrapezoidCount, 'шт', WINDOW_OPTIONS.panoramicTrapezoid.price);
    if (state.extraPanoramicSection) addFixed(winItems, WINDOW_OPTIONS.extraPanoramicSection.name, WINDOW_OPTIONS.extraPanoramicSection.price);
    if (state.extraWindow1000x2000 > 0) addItem(winItems, WINDOW_OPTIONS.win1000x2000.name, state.extraWindow1000x2000, 'шт', WINDOW_OPTIONS.win1000x2000.price);
    if (state.extraWindow500x2000 > 0) addItem(winItems, WINDOW_OPTIONS.win500x2000.name, state.extraWindow500x2000, 'шт', WINDOW_OPTIONS.win500x2000.price);
    if (state.extraWindow600x500 > 0) addItem(winItems, WINDOW_OPTIONS.win600x500.name, state.extraWindow600x500, 'шт', WINDOW_OPTIONS.win600x500.price);
    if (state.extraWindow1500x500 > 0) addItem(winItems, WINDOW_OPTIONS.win1500x500.name, state.extraWindow1500x500, 'шт', WINDOW_OPTIONS.win1500x500.price);
    if (state.windowLamination) addFixed(winItems, WINDOW_OPTIONS.windowLamination.name, WINDOW_OPTIONS.windowLamination.price);
    if (state.windowLaminationInside) addFixed(winItems, WINDOW_OPTIONS.windowLaminationInside.name, WINDOW_OPTIONS.windowLaminationInside.price);
    if (winItems.length > 0) {
        sections.push({ name: 'Окна и проемы', items: winItems, total: sumItems(winItems), hideItems: false });
    }

    // ─── 7. Внешняя отделка ──────────────────
    const extItems: EstimateLineItem[] = [];
    if (state.facadePlanken) addFixed(extItems, EXTERIOR_OPTIONS.facadePlanken.name, EXTERIOR_OPTIONS.facadePlanken.priceByModel[modelId]);
    if (state.gutterPlastic) addFixed(extItems, EXTERIOR_OPTIONS.gutterPlastic.name, EXTERIOR_OPTIONS.gutterPlastic.priceByModel[modelId]);
    if (state.gutterMetal) addFixed(extItems, EXTERIOR_OPTIONS.gutterMetal.name, EXTERIOR_OPTIONS.gutterMetal.priceByModel[modelId]);
    if (state.plinthPlankenArea > 0) addItem(extItems, EXTERIOR_OPTIONS.plinthPlanken.name, state.plinthPlankenArea, 'м²', EXTERIOR_OPTIONS.plinthPlanken.price);
    if (extItems.length > 0) {
        sections.push({ name: 'Фасадные решения', items: extItems, total: sumItems(extItems), hideItems: false });
    }

    // ─── 8. Терраса / Крыльцо ──────────────────
    const terItems: EstimateLineItem[] = [];
    if (state.closedTerraceArea > 0) addItem(terItems, TERRACE_OPTIONS.closedTerraceArea.name, state.closedTerraceArea, 'м²', TERRACE_OPTIONS.closedTerraceArea.price);
    if (state.openTerraceArea > 0) addItem(terItems, TERRACE_OPTIONS.openTerraceArea.name, state.openTerraceArea, 'м²', TERRACE_OPTIONS.openTerraceArea.price);
    if (state.railingsPlankenLength > 0) addItem(terItems, TERRACE_OPTIONS.railingsPlanken.name, state.railingsPlankenLength, 'п.м.', TERRACE_OPTIONS.railingsPlanken.price);
    if (state.railingsCrossLength > 0) addItem(terItems, TERRACE_OPTIONS.railingsCross.name, state.railingsCrossLength, 'п.м.', TERRACE_OPTIONS.railingsCross.price);
    if (terItems.length > 0) {
        sections.push({ name: 'Террасы и малые формы', items: terItems, total: sumItems(terItems), hideItems: false });
    }

    // ─── 9. Доп. услуги ──────────────────
    const svcItems: EstimateLineItem[] = [];
    for (const svc of state.services) {
        if (svc.quantity > 0) addItem(svcItems, `${svc.name}${svc.specs ? ` (${svc.specs})` : ''}`, svc.quantity, svc.unit, svc.price);
    }
    if (svcItems.length > 0) {
        sections.push({ name: 'Дополнительные услуги', items: svcItems, total: sumItems(svcItems), hideItems: false });
    }

    // ─── 11. Custom Items ──────────────────
    const customItems: EstimateLineItem[] = [];
    for (const ci of state.customItems) {
        if (ci.total > 0) customItems.push({ name: ci.name, quantity: ci.quantity, unit: ci.unit, price: ci.price, total: ci.total });
    }
    if (customItems.length > 0) {
        sections.push({ name: 'Дополнительные опции', items: customItems, total: sumItems(customItems), hideItems: false });
    }

    let grandTotal = sections.reduce((s, sec) => s + sec.total, 0);
    if (state.discountPercent > 0) grandTotal = grandTotal - Math.ceil(grandTotal * (state.discountPercent / 100));
    grandTotal += state.markupAmount;

    return { sections, basePrice: model.basePrice, optionsTotal: grandTotal - model.basePrice, grandTotal };
}
