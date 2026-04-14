import React, { useState, useMemo, useEffect } from 'react';
import type { HouseCalcState, TabId, CustomItem, ServiceEntry, HouseModelId } from './houseCalcTypes';
import { calculateHouseEstimate } from './houseCalcEngine';
import {
    HOUSE_MODELS,
    FRAME_OPTIONS,
    WINDOW_OPTIONS,
    TERRACE_OPTIONS,
    SERVICE_CATALOG,
    BATHROOM_PRICES,
    FLOOR_PRICES,
    FOUNDATION_ASSEMBLY_DATA
} from './houseCalculatorData';

// ─── Reusable Counter Input ────────────────────────────
const Counter = ({ label, value, onChange, name, step = 1, min = 0 }: any) => (
    <div>
        <label className="block text-xs font-bold text-gray-600 tracking-wide mb-1.5">{label}</label>
        <div className="flex items-center space-x-1.5 max-w-[160px]">
            <button type="button" onClick={() => onChange(name, Math.max(min, parseFloat((value - step).toFixed(2))))}
                className="w-10 h-10 flex-shrink-0 items-center justify-center bg-gray-50 hover:bg-amber-100 hover:text-amber-700 rounded-lg border border-gray-300 text-gray-600 text-lg font-bold transition-colors">-</button>
            <input type="number" value={value}
                onChange={(e) => onChange(name, Math.max(min, parseFloat(e.target.value) || 0))}
                className="w-full bg-white border border-gray-300 rounded-lg px-2 py-2 text-sm font-semibold text-center focus:ring-amber-500 focus:border-amber-500" />
            <button type="button" onClick={() => onChange(name, parseFloat((value + step).toFixed(2)))}
                className="w-10 h-10 flex-shrink-0 items-center justify-center bg-gray-50 hover:bg-amber-100 hover:text-amber-700 rounded-lg border border-gray-300 text-gray-600 text-lg font-bold transition-colors">+</button>
        </div>
    </div>
);

// ─── Checkbox Option ────────────────────────────
const Check = ({ label, checked, onChange, name, disabled, price }: any) => (
    <label className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${disabled ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-100' : checked ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}>
        <input type="checkbox" checked={checked} disabled={disabled}
            onChange={(e) => onChange(name, e.target.checked)}
            className="w-5 h-5 text-amber-600 border-gray-300 rounded" />
        <span className="text-xs font-medium text-gray-700 leading-tight flex-1">{label}</span>
        {price && <span className="text-xs font-semibold text-amber-700 whitespace-nowrap">{typeof price === 'number' ? `${price.toLocaleString()} ₽` : price}</span>}
    </label>
);

// ─── Initial State ────────────────────────────
const INITIAL_STATE: HouseCalcState = {
    selectedHouse: 'dom49',
    wallFinish: 'none', ceilingFinish: 'none',
    paintWalls: false, paintCeiling: false,
    floorFinish: 'none',
    bathroomFloorArea: 4,
    bathroomFloorFinish: 'none',
    bathroomWallFinish: 'none',
    lightingCableCount: 0, warmTapCount: 0, lightSwitchCount: 0,
    extraSocketCount: 0, spotlightCount: 0, streetLightCount: 0,
    acPrepCount: 0, wetPointSplit: false, convectorCount: 0,
    breezer80Count: 0, breezer100Count: 0,
    heatingSystem: 'none', warmFloorArea: 34, warmFloorThermostats: 0,
    moduleExtendCount: 0, mouseMesh: false, extraInsulation: false,
    removePartition: false, extraPartitionLength: 0,
    safeDoor: false, relocateDoor: false,
    panoramicTrapezoidCount: 0, extraPanoramicSection: false,
    extraWindow1000x2000: 0, extraWindow500x2000: 0,
    extraWindow600x500: 0, extraWindow1500x500: 0,
    windowLamination: false, extraInteriorDoorCount: 0,
    facadePlanken: false, gutterPlastic: false, gutterMetal: false,
    plinthPlankenArea: 0,
    terraceCloseSideCount: 0, porchCanopy: false,
    closedTerraceArea: 0, openTerraceArea: 0,
    railingsPlankenLength: 0, railingsCrossLength: 0,
    services: [],
    addFoundation: false,
    pileLength: '2500',
    addAssembly: false,
    clientName: '', managerName: '', kpNumber: '',
    kpDate: new Date().toLocaleDateString('ru-RU'),
    discountPercent: 0, markupAmount: 0, customItems: [],
};

// ─── Tab Config ────────────────────────────
const TABS: { id: TabId; label: string }[] = [
    { id: 'house', label: 'Дом' },
    { id: 'finish', label: 'Отделка' },
    { id: 'bathroom', label: 'Санузел' },
    { id: 'engineering', label: 'Инженерия' },
    { id: 'frame', label: 'Каркас' },
    { id: 'windows', label: 'Окна' },
    { id: 'exterior', label: 'Фасад' },
    { id: 'terrace', label: 'Терраса' },
    { id: 'services', label: 'Услуги' },
    { id: 'kp', label: 'КП' },
];

export default function HouseCalculator() {
    const [state, setState] = useState<HouseCalcState>(() => {
        const saved = localStorage.getItem('house_calc_state');
        if (saved) { try { return { ...INITIAL_STATE, ...JSON.parse(saved) }; } catch { /* noop */ } }
        return INITIAL_STATE;
    });

    const [activeTab, setActiveTab] = useState<TabId>('house');
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [newCustomItem, setNewCustomItem] = useState({ name: '', quantity: 1, unit: 'шт', price: 0 });

    const toggleCategory = (cat: string) => {
        setExpandedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    useEffect(() => { localStorage.setItem('house_calc_state', JSON.stringify(state)); }, [state]);

    const set = (name: string, value: any) => {
        setState(prev => {
            const newState = { ...prev, [name]: value };
            const currentModel = HOUSE_MODELS.find(m => m.id === newState.selectedHouse);
            
            if (currentModel) {
                // Если сменили дом или систему отопления — обновляем площадь по умолчанию
                if (name === 'selectedHouse' || name === 'heatingSystem') {
                    if (newState.heatingSystem === 'water') {
                        newState.warmFloorArea = currentModel.area;
                    } else if (newState.heatingSystem === 'electric') {
                        newState.warmFloorArea = Math.round(currentModel.area * 0.7);
                    }
                }
            }
            return newState;
        });
    };

    const estimate = useMemo(() => calculateHouseEstimate(state), [state]);
    const { sections, grandTotal } = estimate;

    const model = HOUSE_MODELS.find(m => m.id === state.selectedHouse)!;
    const isAvailable = (availableFor?: string[]) => !availableFor || availableFor.includes(state.selectedHouse);

    // Service constructor helpers
    const addService = (catalogItem: typeof SERVICE_CATALOG[0]) => {
        const entry: ServiceEntry = { ...catalogItem, quantity: 1 };
        setState(prev => ({ ...prev, services: [...prev.services, entry] }));
    };
    const updateServiceQty = (idx: number, qty: number) => {
        setState(prev => ({
            ...prev,
            services: prev.services.map((s, i) => i === idx ? { ...s, quantity: Math.max(0, qty) } : s)
        }));
    };
    const removeService = (idx: number) => {
        setState(prev => ({ ...prev, services: prev.services.filter((_, i) => i !== idx) }));
    };

    // Custom items
    const addCustomItem = () => {
        if (!newCustomItem.name) return;
        const total = newCustomItem.quantity * newCustomItem.price;
        setState(prev => ({ ...prev, customItems: [...prev.customItems, { ...newCustomItem, total }] }));
        setNewCustomItem({ name: '', quantity: 1, unit: 'шт', price: 0 });
    };
    const removeCustomItem = (idx: number) => {
        setState(prev => ({ ...prev, customItems: prev.customItems.filter((_, i) => i !== idx) }));
    };

    const resetAll = () => {
        if (window.confirm('Сбросить все параметры?')) {
            setState(INITIAL_STATE);
            localStorage.removeItem('house_calc_state');
        }
    };

    const beforeDiscount = sections.reduce((s, sec) => s + sec.total, 0);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Калькулятор типовых домов</h1>
                    <p className="text-sm text-gray-500">Выбор модели → опции → смета → КП</p>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={resetAll}
                        className="text-xs py-2 px-4 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors uppercase tracking-wider font-medium">
                        Сброс
                    </button>
                    <button onClick={() => window.print()}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
                        🖨️ Печать КП
                    </button>
                </div>
            </header>

            <main className="flex-1 w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* ═══════ LEFT COLUMN (1/2) ═══════ */}
                <div className="lg:col-span-6 space-y-4 print:hidden">
                    {/* Tabs */}
                    <div className="grid grid-cols-5 gap-1.5 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
                        {TABS.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`py-3 px-1 text-xs font-bold rounded-lg transition-all border ${activeTab === tab.id 
                                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm scale-[1.02]' 
                                    : 'text-gray-600 bg-white border-gray-100 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-200'}`}>
                                <span className="truncate w-full text-center uppercase tracking-wider">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
                        {/* ──── TAB: HOUSE ──── */}
                        {activeTab === 'house' && (
                            <div className="space-y-4 animate-fadeIn">
                                <h2 className="text-lg font-bold border-b pb-2">Выбор модели дома</h2>
                                <div className="space-y-3">
                                    {HOUSE_MODELS.map(m => (
                                        <button key={m.id}
                                            onClick={() => set('selectedHouse', m.id)}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${state.selectedHouse === m.id ? 'border-amber-500 bg-amber-50 shadow-md ring-1 ring-amber-500' : 'border-gray-100 hover:border-amber-200 hover:bg-gray-50'}`}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className={`font-bold text-base ${state.selectedHouse === m.id ? 'text-amber-900' : 'text-gray-900'}`}>{m.name}</h3>
                                                    <p className="text-xs text-gray-500 mt-1">{m.description}</p>
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        {m.features.map((f, i) => (
                                                            <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{f}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4 flex-shrink-0">
                                                    <div className={`text-lg font-bold ${state.selectedHouse === m.id ? 'text-amber-700' : 'text-gray-900'}`}>
                                                        {m.basePrice.toLocaleString()} ₽
                                                    </div>
                                                    <div className="text-[10px] text-gray-400">{m.area} м²</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ──── TAB: FINISH ──── */}
                        {activeTab === 'finish' && (
                            <div className="space-y-5 animate-fadeIn">
                                <h2 className="text-lg font-bold border-b pb-2">Внутренняя отделка</h2>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Отделка стен</label>
                                    <select value={state.wallFinish} onChange={e => set('wallFinish', e.target.value)}
                                        className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm">
                                        <option value="none">Фанера шлифованная 12 мм (в базе)</option>
                                        <option value="gipsokarton">Гипсокартон</option>
                                        <option value="vagonka">Вагонка штиль</option>
                                        <option value="imitBrus">Имитация бруса</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Отделка потолка</label>
                                    <select value={state.ceilingFinish} onChange={e => set('ceilingFinish', e.target.value)}
                                        className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm">
                                        <option value="none">Натяжной потолок (в базе)</option>
                                        <option value="fanera">Фанера</option>
                                        <option value="imitBrus">Имитация бруса / вагонка штиль</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Напольное покрытие</label>
                                    <select value={state.floorFinish} onChange={e => set('floorFinish', e.target.value)}
                                        className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm">
                                        <option value="none">Ламинат KREAFORTA 33 кл. (в базе)</option>
                                        {Object.entries(FLOOR_PRICES).map(([key, val]) => (
                                            <option key={key} value={key}>{val.name} ({val.price} ₽/м²)</option>
                                        ))}
                                    </select>
                                </div>
                                <Check label="Покраска стен (2 слоя Тиккурила)" checked={state.paintWalls} onChange={set} name="paintWalls" />
                                <Check label="Покраска потолка (2 слоя Тиккурила)" checked={state.paintCeiling} onChange={set} name="paintCeiling" />
                                <Counter label="Доп. межкомнатная дверь (шт)" name="extraInteriorDoorCount" value={state.extraInteriorDoorCount} onChange={set} />
                            </div>
                        )}

                        {/* ──── TAB: BATHROOM ──── */}
                        {activeTab === 'bathroom' && (
                            <div className="space-y-5 animate-fadeIn">
                                <h2 className="text-lg font-bold border-b pb-2">Отделка санузла</h2>
                                <Counter label="Площадь пола санузла, м²" name="bathroomFloorArea" value={state.bathroomFloorArea} onChange={set} />
                                {state.bathroomFloorArea > 0 && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Пол санузла</label>
                                            <select value={state.bathroomFloorFinish} onChange={e => set('bathroomFloorFinish', e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm">
                                                <option value="none">Кварц-винил 1500 ₽/м² (в базе)</option>
                                                {Object.entries(BATHROOM_PRICES.floor).filter(([key]) => key !== 'quartzVinyl').map(([key, val]) => (
                                                    <option key={key} value={key}>{val.name} ({val.price} ₽/м²)</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Стены санузла</label>
                                            <select value={state.bathroomWallFinish} onChange={e => set('bathroomWallFinish', e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm">
                                                <option value="none">Фанера (в базе)</option>
                                                {Object.entries(BATHROOM_PRICES.wall).filter(([key]) => key !== 'fanera').map(([key, val]) => (
                                                    <option key={key} value={key}>{val.name} ({val.price} ₽/м²)</option>
                                                ))}
                                            </select>
                                        </div>
                                        <p className="text-[10px] text-gray-400">* Площадь стен рассчитывается автоматически из площади пола.</p>
                                    </>
                                )}
                            </div>
                        )}

                        {/* ──── TAB: ENGINEERING ──── */}
                        {activeTab === 'engineering' && (
                            <div className="space-y-5 animate-fadeIn">
                                <h2 className="text-lg font-bold border-b pb-2">Инженерные элементы</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    <Counter label="Вывод кабеля осв. (шт)" name="lightingCableCount" value={state.lightingCableCount} onChange={set} />
                                    <Counter label="Тёплый кран (шт)" name="warmTapCount" value={state.warmTapCount} onChange={set} />
                                    <Counter label="Переключ. свет (шт)" name="lightSwitchCount" value={state.lightSwitchCount} onChange={set} />
                                    <Counter label="Доп. розетки (шт)" name="extraSocketCount" value={state.extraSocketCount} onChange={set} />
                                    <Counter label="Точечный свет (шт)" name="spotlightCount" value={state.spotlightCount} onChange={set} />
                                    <Counter label="Уличный свет (шт)" name="streetLightCount" value={state.streetLightCount} onChange={set} />
                                    <Counter label="Трассы конд. (шт)" name="acPrepCount" value={state.acPrepCount} onChange={set} />
                                    <Counter label="Конвекторы (шт)" name="convectorCount" value={state.convectorCount} onChange={set} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Counter label="Бризер ASP-80 (шт)" name="breezer80Count" value={state.breezer80Count} onChange={set} />
                                    <Counter label="Бризер ASP-100 CO₂ (шт)" name="breezer100Count" value={state.breezer100Count} onChange={set} />
                                </div>
                                <Check label="Разрыв мокрой точки (кухня далеко)" checked={state.wetPointSplit} onChange={set} name="wetPointSplit" price="60 000 ₽" />
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Отопление (Тёплый пол)</label>
                                    <select value={state.heatingSystem} onChange={e => set('heatingSystem', e.target.value)}
                                        className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm">
                                        <option value="none">Без тёплого пола (в базе)</option>
                                        <option value="electric">Тёплый пол электрический модульный ЗЕБРА ЭВО-300 WF</option>
                                        <option value="water">Водяной тёплый пол (котёл, коллектор, трубы, ЭППС)</option>
                                    </select>
                                </div>
                                {state.heatingSystem !== 'none' && (
                                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mt-3 space-y-3">
                                        <Counter label="Площадь теплого пола (м²)" name="warmFloorArea" value={state.warmFloorArea} onChange={set} />
                                        <Counter 
                                            label={`Терморегуляторы к ${state.heatingSystem === 'electric' ? 'электро' : 'водяному'} ТП (${state.heatingSystem === 'electric' ? '3 000' : '15 000'} ₽/шт)`} 
                                            name="warmFloorThermostats" 
                                            value={state.warmFloorThermostats} 
                                            onChange={set} 
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ──── TAB: FRAME ──── */}
                        {activeTab === 'frame' && (
                            <div className="space-y-5 animate-fadeIn">
                                <h2 className="text-lg font-bold border-b pb-2">Каркас</h2>
                                {isAvailable(Object.keys(FRAME_OPTIONS.moduleExtend.priceByModel) as any) && (
                                    <Counter label="Увеличение модуля +60 см (шт)" name="moduleExtendCount" value={state.moduleExtendCount} onChange={set} />
                                )}
                                <Check label="Сетка от грызунов" checked={state.mouseMesh} onChange={set} name="mouseMesh" />
                                <Check label="Доп. утепление стен до 200 мм" checked={state.extraInsulation} onChange={set} name="extraInsulation" />
                                <Check label="Убрать перегородку (опен спейс)" checked={state.removePartition} onChange={set} name="removePartition" price="120 000 ₽" />
                                {isAvailable(FRAME_OPTIONS.extraPartition.availableFor) && (
                                    <Counter label="Доп. перегородка (м.п.)" name="extraPartitionLength" value={state.extraPartitionLength} onChange={set} />
                                )}
                            </div>
                        )}

                        {/* ──── TAB: WINDOWS ──── */}
                        {activeTab === 'windows' && (
                            <div className="space-y-5 animate-fadeIn">
                                <h2 className="text-lg font-bold border-b pb-2">Окна и Двери</h2>
                                {isAvailable(WINDOW_OPTIONS.safeDoor.availableFor) && (
                                    <Check label="Входная сейф-дверь + крыльцо + 3 ступени" checked={state.safeDoor} onChange={set} name="safeDoor" price="115 000 ₽" />
                                )}
                                {isAvailable(WINDOW_OPTIONS.relocateDoor.availableFor) && (
                                    <Check label="Перенос ПВХ двери на б. стену + крыльцо + 3 ступени" checked={state.relocateDoor} onChange={set} name="relocateDoor" price="80 000 ₽" />
                                )}
                                <Counter label="Панорам. трапециевидн. окно (шт)" name="panoramicTrapezoidCount" value={state.panoramicTrapezoidCount} onChange={set} />
                                <Check label="Доп. секция панорамного ост. кухни" checked={state.extraPanoramicSection} onChange={set} name="extraPanoramicSection" price="60 000 ₽" />
                                <div className="grid grid-cols-2 gap-3">
                                    <Counter label="Окно 1000×2000 (шт)" name="extraWindow1000x2000" value={state.extraWindow1000x2000} onChange={set} />
                                    <Counter label="Окно 500×2000 (шт)" name="extraWindow500x2000" value={state.extraWindow500x2000} onChange={set} />
                                    <Counter label="Окно 600×500 (шт)" name="extraWindow600x500" value={state.extraWindow600x500} onChange={set} />
                                    <Counter label="Окно 1500×500 (шт)" name="extraWindow1500x500" value={state.extraWindow1500x500} onChange={set} />
                                </div>
                                <Check label="Ламинация окон снаружи RAL7024" checked={state.windowLamination} onChange={set} name="windowLamination" price="40 000 ₽" />
                            </div>
                        )}

                        {/* ──── TAB: EXTERIOR ──── */}
                        {activeTab === 'exterior' && (
                            <div className="space-y-5 animate-fadeIn">
                                <h2 className="text-lg font-bold border-b pb-2">Внешняя отделка</h2>
                                <Check label="Фасад — планкен 90×18, покраска 2 слоя" checked={state.facadePlanken} onChange={set} name="facadePlanken" />
                                <div className="pt-2 border-t">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Водосточная система</label>
                                    <div className="space-y-2">
                                        <Check label="Водосточка (пластик)" checked={state.gutterPlastic} onChange={set} name="gutterPlastic" />
                                        <Check label="Водосточка (металл)" checked={state.gutterMetal} onChange={set} name="gutterMetal" />
                                    </div>
                                </div>
                                <Counter label="Обшивка цоколя планкеном (м²)" name="plinthPlankenArea" value={state.plinthPlankenArea} onChange={set} />
                            </div>
                        )}

                        {/* ──── TAB: TERRACE ──── */}
                        {activeTab === 'terrace' && (
                            <div className="space-y-5 animate-fadeIn">
                                <h2 className="text-lg font-bold border-b pb-2">Терраса / Крыльцо</h2>
                                <Counter label="Закрытие проёма террасы (шт)" name="terraceCloseSideCount" value={state.terraceCloseSideCount} onChange={set} />
                                {isAvailable(TERRACE_OPTIONS.porchCanopy.availableFor) && (
                                    <Check label="Навес над крыльцом" checked={state.porchCanopy} onChange={set} name="porchCanopy" price="65 000 ₽" />
                                )}
                                <div className="grid grid-cols-2 gap-3">
                                    <Counter label="Закр. терраса (м²)" name="closedTerraceArea" value={state.closedTerraceArea} onChange={set} />
                                    <Counter label="Откр. терраса (м²)" name="openTerraceArea" value={state.openTerraceArea} onChange={set} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Counter label="Перила планкен (п.м.)" name="railingsPlankenLength" value={state.railingsPlankenLength} onChange={set} />
                                    <Counter label="Перила крестик (п.м.)" name="railingsCrossLength" value={state.railingsCrossLength} onChange={set} />
                                </div>
                            </div>
                        )}

                        {/* ──── TAB: SERVICES ──── */}
                        {activeTab === 'services' && (
                            <div className="space-y-4 animate-fadeIn">
                                <h2 className="text-lg font-bold border-b pb-2">Доп. услуги (конструктор)</h2>
                                
                                <div className="space-y-3 mb-6 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                                    <h3 className="text-sm font-bold text-gray-800 flex justify-between items-center">
                                        Фундамент и монтаж
                                        <span className="text-[10px] font-normal text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Важно</span>
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg border transition-colors ${state.addFoundation ? 'bg-white border-amber-300 shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
                                            <label className="flex items-center space-x-3 cursor-pointer">
                                                <input type="checkbox" checked={state.addFoundation}
                                                    onChange={(e) => set('addFoundation', e.target.checked)}
                                                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
                                                <span className="text-sm font-semibold flex-1">Свайно-винтовой фундамент</span>
                                            </label>
                                            
                                            {state.addFoundation && (
                                                <div className="mt-3 pt-3 border-t border-amber-100 grid grid-cols-2 gap-3 items-end">
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Длина сваи</label>
                                                        <select value={state.pileLength} onChange={e => set('pileLength', e.target.value)}
                                                            className="w-full bg-white border border-amber-200 rounded px-2 py-1.5 text-xs focus:ring-amber-500 focus:border-amber-500 font-medium">
                                                            <option value="2500">2500 мм (6 000 ₽)</option>
                                                            <option value="3000">3000 мм (6 800 ₽)</option>
                                                            <option value="3500">3500 мм (7 300 ₽)</option>
                                                        </select>
                                                    </div>
                                                    <div className="text-right pb-1">
                                                        <div className="text-[10px] uppercase text-gray-400 font-bold">Итого свай: {FOUNDATION_ASSEMBLY_DATA[state.selectedHouse].piles} шт</div>
                                                        <div className="text-sm font-bold text-amber-700">
                                                            {(FOUNDATION_ASSEMBLY_DATA[state.selectedHouse].piles * (state.pileLength === '2500' ? 6000 : state.pileLength === '3000' ? 6800 : 7300)).toLocaleString()} ₽
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <Check 
                                            label="Монтаж дома (до 50 км)" 
                                            name="addAssembly" 
                                            checked={state.addAssembly} 
                                            onChange={set} 
                                            price={`${FOUNDATION_ASSEMBLY_DATA[state.selectedHouse as HouseModelId].assemblyPrice.toLocaleString()} ₽`} 
                                        />
                                    </div>
                                </div>

                                {/* Added services */}
                                {state.services.length > 0 && (
                                    <div className="space-y-2 mb-4">
                                        {state.services.map((svc, idx) => (
                                            <div key={idx} className="flex items-center text-xs bg-amber-50 p-2 rounded border border-amber-100 gap-2">
                                                <span className="flex-1 font-medium truncate">{svc.name} {svc.specs && `(${svc.specs})`}</span>
                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    <button onClick={() => updateServiceQty(idx, svc.quantity - 1)}
                                                        className="w-6 h-6 bg-white border border-gray-300 rounded text-xs font-bold">-</button>
                                                    <input type="number" value={svc.quantity}
                                                        onChange={e => updateServiceQty(idx, parseInt(e.target.value) || 0)}
                                                        className="w-12 text-center border border-gray-300 rounded text-xs py-0.5" />
                                                    <button onClick={() => updateServiceQty(idx, svc.quantity + 1)}
                                                        className="w-6 h-6 bg-white border border-gray-300 rounded text-xs font-bold">+</button>
                                                    <span className="text-xs text-gray-400 w-8">{svc.unit}</span>
                                                </div>
                                                <span className="font-bold text-amber-800 w-20 text-right">{(svc.quantity * svc.price).toLocaleString()} ₽</span>
                                                <button onClick={() => removeService(idx)} className="text-red-500 hover:text-red-700 px-1">✕</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* Catalog grouped by category */}
                                <div className="space-y-2">
                                    {['Септик', 'Скважина', 'Электричество', 'Забор'].map(cat => {
                                        const items = SERVICE_CATALOG.filter(s => s.category === cat && !s.id.startsWith('pile_'));
                                        if (items.length === 0) return null;
                                        const isExpanded = expandedCategories.includes(cat);
                                        return (
                                            <div key={cat} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                                <button onClick={() => toggleCategory(cat)}
                                                    className={`w-full flex justify-between items-center p-4 text-sm font-bold tracking-tight transition-colors ${isExpanded ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                                                    <span>{cat}</span>
                                                    <span className={`text-xl transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                                                </button>
                                                {isExpanded && (
                                                    <div className="p-3 bg-white space-y-1.5 animate-fadeIn">
                                                        {items.map(item => (
                                                            <button key={item.id} onClick={() => addService(item)}
                                                                className="w-full text-left text-xs p-3 rounded-lg border border-gray-50 hover:border-amber-200 hover:bg-amber-50/30 transition-all flex justify-between items-center group">
                                                                <div className="flex-1">
                                                                    <div className="font-semibold text-gray-800 group-hover:text-amber-900">{item.name}</div>
                                                                    {item.specs && <div className="text-[10px] text-gray-400 group-hover:text-amber-600/60 font-medium uppercase tracking-wide mt-0.5">{item.specs}</div>}
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="font-bold text-gray-600 whitespace-nowrap">{item.price.toLocaleString()} ₽ <span className="text-[10px] font-normal text-gray-400 italic">/ {item.unit}</span></div>
                                                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">+</div>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ──── TAB: KP ──── */}
                        {activeTab === 'kp' && (
                            <div className="space-y-5 animate-fadeIn">
                                <h2 className="text-lg font-bold border-b pb-2">Данные для КП</h2>

                                {/* Client */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Имя Клиента</label>
                                        <input type="text" value={state.clientName} onChange={e => set('clientName', e.target.value)}
                                            placeholder="Иванов Иван" className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Менеджер</label>
                                        <input type="text" value={state.managerName} onChange={e => set('managerName', e.target.value)}
                                            placeholder="Петров Петр" className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Номер КП</label>
                                        <input type="text" value={state.kpNumber} onChange={e => set('kpNumber', e.target.value)}
                                            placeholder="№24-001" className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Дата</label>
                                        <input type="text" value={state.kpDate} onChange={e => set('kpDate', e.target.value)}
                                            className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm" />
                                    </div>
                                </div>

                                {/* Финансы */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Counter label="Скидка, %" name="discountPercent" value={state.discountPercent} onChange={set} />
                                    <Counter label="Наценка, ₽" name="markupAmount" value={state.markupAmount} onChange={set} step={5000} />
                                </div>

                                {/* Произвольные позиции */}
                                <div className="pt-4 border-t">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Произвольные позиции</h3>
                                    {state.customItems.map((item: CustomItem, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded border border-gray-100 mb-1">
                                            <span className="truncate flex-1 font-medium">{item.name} ({item.quantity} {item.unit})</span>
                                            <span className="font-bold text-gray-900 mx-2">{item.total.toLocaleString()} ₽</span>
                                            <button onClick={() => removeCustomItem(idx)} className="text-red-500 hover:text-red-700 px-1">✕</button>
                                        </div>
                                    ))}
                                    <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 space-y-2 mt-2">
                                        <input type="text" placeholder="Название" value={newCustomItem.name}
                                            onChange={e => setNewCustomItem({ ...newCustomItem, name: e.target.value })}
                                            className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs" />
                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                            <input type="number" placeholder="Кол-во" value={newCustomItem.quantity}
                                                onChange={e => setNewCustomItem({ ...newCustomItem, quantity: parseFloat(e.target.value) || 0 })}
                                                className="w-full bg-white border border-gray-300 rounded px-2 py-1" />
                                            <input type="text" placeholder="Ед." value={newCustomItem.unit}
                                                onChange={e => setNewCustomItem({ ...newCustomItem, unit: e.target.value })}
                                                className="w-full bg-white border border-gray-300 rounded px-2 py-1" />
                                            <input type="number" placeholder="Цена" value={newCustomItem.price}
                                                onChange={e => setNewCustomItem({ ...newCustomItem, price: parseFloat(e.target.value) || 0 })}
                                                className="w-full bg-white border border-gray-300 rounded px-2 py-1" />
                                        </div>
                                        <button onClick={addCustomItem}
                                            className="w-full py-1.5 bg-gray-800 text-white rounded text-[10px] font-bold uppercase hover:bg-black transition-colors">
                                            Добавить позицию
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ═══════ RIGHT COLUMN (1/2) — TOTAL + ESTIMATE TABLE ═══════ */}
                <div className="lg:col-span-6 space-y-4 print:hidden">
                    {/* ─── STICKY TOTAL ─── */}
                    <div className="sticky top-4 z-10 space-y-4">
                        <div className="bg-gray-900 text-white p-5 rounded-xl shadow-lg border border-gray-800">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-gray-400 text-xs uppercase tracking-wider font-medium">Итоговая стоимость</div>
                                <div className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                                    {Math.round(grandTotal / model.area).toLocaleString('ru-RU')} ₽/м²
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-amber-400">{grandTotal.toLocaleString('ru-RU')} ₽</div>
                            <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400">
                                Модель: <span className="text-gray-300 font-medium">{model.name}</span> · {model.area} м²
                            </div>
                        </div>

                        {/* Подробная смета по разделам */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Подробная смета</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {sections.map((section, idx) => (
                                    <div key={idx} className="px-4 py-3 hover:bg-gray-50/30 transition-colors">
                                        <div className="flex justify-between items-center text-xs mb-1.5">
                                            <span className="font-bold text-gray-800">{idx + 1}. {section.name}</span>
                                            <span className="font-bold text-amber-700 tabular-nums">{section.total.toLocaleString('ru-RU')} ₽</span>
                                        </div>
                                        {/* Развернутые предметы из раздела */}
                                        {section.items.length > 0 && (
                                            <div className="space-y-1">
                                                {section.items.map((item, i) => (
                                                    <div key={i} className="flex justify-between items-start text-[10px] text-gray-500 pl-3">
                                                        <span className="pr-2 leading-tight py-0.5 flex-1">
                                                            · {item.name} {item.quantity > 1 && <span className="text-gray-400">({item.quantity} {item.unit})</span>}
                                                        </span>
                                                        <span className="whitespace-nowrap tabular-nums font-medium py-0.5">{item.total.toLocaleString('ru-RU')} ₽</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {state.discountPercent > 0 && (
                                    <div className="px-4 py-2.5 flex justify-between items-center text-xs text-green-700 bg-green-50/30">
                                        <span>Скидка ({state.discountPercent}%)</span>
                                        <span className="font-semibold">-{Math.ceil(beforeDiscount * (state.discountPercent / 100)).toLocaleString()} ₽</span>
                                    </div>
                                )}
                                {state.markupAmount !== 0 && (
                                    <div className="px-4 py-2.5 flex justify-between items-center text-xs text-gray-700 bg-gray-50/50">
                                        <span>Корректировка</span>
                                        <span className="font-semibold">{state.markupAmount > 0 ? '+' : ''}{state.markupAmount.toLocaleString()} ₽</span>
                                    </div>
                                )}
                            </div>
                            <div className="px-4 py-3 bg-gray-900 text-white flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-wider">ИТОГО</span>
                                <span className="text-lg font-bold text-amber-400">{grandTotal.toLocaleString('ru-RU')} ₽</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════ PRINT AREA — ESTIMATE TABLE (hidden on screen, visible on print) ═══════ */}
                <div className="hidden print:block lg:col-span-12 bg-white p-0" id="print-area">
                    {/* Print header */}
                    <div className="mb-8 hidden print:block">
                        <div className="flex justify-between items-center mb-8 border-b-2 border-gray-900 pb-6">
                            <img src="/logo-black.png" alt="Logo" className="h-10 object-contain" />
                            <div className="text-right">
                                <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900">Коммерческое предложение</h2>
                                {state.kpNumber && <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">№ {state.kpNumber}</span>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                            <div className="space-y-1">
                                <p><span className="text-gray-400">Заказчик:</span> <span className="font-semibold">{state.clientName || '____________________'}</span></p>
                                <p><span className="text-gray-400">Объект:</span> <span className="font-semibold">{model.name}</span></p>
                                <p><span className="text-gray-400">Площадь:</span> <span className="font-semibold">{model.area} м²</span></p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p><span className="text-gray-400">Дата:</span> <span className="font-semibold">{state.kpDate}</span></p>
                                <p><span className="text-gray-400">Менеджер:</span> <span className="font-semibold">{state.managerName || 'Специалист BestTown'}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Estimate table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-6 py-3 rounded-tl-lg">Наименование</th>
                                    <th className="px-4 py-3 text-center print:hidden">Кол-во</th>
                                    <th className="px-4 py-3 text-center print:hidden">Ед.</th>
                                    <th className="px-4 py-3 text-right print:hidden">Цена</th>
                                    <th className="px-6 py-3 text-right rounded-tr-lg">Сумма</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sections.map((section, idx) => (
                                    <React.Fragment key={`sec-${idx}`}>
                                        <tr className="bg-gray-50/80 border-b border-t font-semibold">
                                            <td className="px-6 py-3 text-gray-900">{idx + 1}. {section.name}</td>
                                            <td colSpan={3} className="print:hidden"></td>
                                            <td className="px-6 py-3 text-right text-gray-900">{section.total.toLocaleString('ru-RU')} ₽</td>
                                        </tr>
                                        {section.items.map((item, iIdx) => (
                                            <tr key={iIdx} className={`border-b last:border-none hover:bg-gray-50/50 ${section.hideItems ? 'print:hidden' : ''}`}>
                                                <td className="px-6 py-2.5 text-gray-700">{item.name}</td>
                                                <td className="px-4 py-2.5 text-center print:hidden">
                                                    {typeof item.quantity === 'number'
                                                        ? (['м²', 'м.п.', 'п.м.'].includes(item.unit) ? item.quantity.toFixed(1) : Math.round(item.quantity))
                                                        : item.quantity}
                                                </td>
                                                <td className="px-4 py-2.5 text-center text-gray-500 print:hidden">{item.unit}</td>
                                                <td className="px-4 py-2.5 text-right text-gray-500 print:hidden">{item.price.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}</td>
                                                <td className="px-6 py-2.5 text-right font-medium">
                                                    <span className="print:hidden">{item.total.toLocaleString('ru-RU')} ₽</span>
                                                    <span className="hidden print:inline">—</span>
                                                </td>
                                            </tr>
                                        ))}

                                        {/* Object Passport (Descriptions) — visible only on print */}
                                        {section.passportItems && section.passportItems.map((pItem, pIdx) => (
                                            <tr key={`passport-${pIdx}`} className="hidden print:table-row border-b last:border-none">
                                                <td className="px-10 py-1.5 text-gray-700 italic text-sm" colSpan={5}>
                                                    • {pItem}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}

                                {state.discountPercent > 0 && (
                                    <tr className="bg-green-50/30 text-green-700 font-semibold border-t">
                                        <td colSpan={4} className="px-6 py-3">Скидка ({state.discountPercent}%)</td>
                                        <td className="px-6 py-3 text-right">-{Math.ceil(beforeDiscount * (state.discountPercent / 100)).toLocaleString()} ₽</td>
                                    </tr>
                                )}
                                {state.markupAmount !== 0 && (
                                    <tr className="bg-gray-50/50 text-gray-700 font-semibold border-t">
                                        <td colSpan={4} className="px-6 py-3">Корректировка стоимости</td>
                                        <td className="px-6 py-3 text-right">{state.markupAmount > 0 ? '+' : ''}{state.markupAmount.toLocaleString()} ₽</td>
                                    </tr>
                                )}

                                {/* GrandTotal */}
                                <tr className="bg-gray-900 text-white font-bold text-xl border-t-4 border-white">
                                    <td colSpan={4} className="px-6 py-6 rounded-bl-lg">
                                        ИТОГО К ОПЛАТЕ:
                                        <div className="text-xs font-normal text-gray-400 mt-1">
                                            Стоимость за м²: {Math.round(grandTotal / model.area).toLocaleString()} ₽/м²
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right whitespace-nowrap rounded-br-lg">
                                        {grandTotal.toLocaleString('ru-RU')} ₽
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Print footer */}
                        <div className="hidden print:block mt-10 border-t-2 border-gray-900 pt-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Информация о предложении</div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>Предложение действительно в течение 7 календарных дней.</p>
                                        <p>Цены указаны в рублях. В стоимость не включена доставка (рассчитывается индивидуально).</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Итоговая стоимость</div>
                                    <div className="text-3xl font-bold text-gray-900">{grandTotal.toLocaleString('ru-RU')} ₽</div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Стоимость за м²: {Math.round(grandTotal / model.area).toLocaleString()} ₽/м²
                                        <span className="ml-4">Площадь: {model.area} м²</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
