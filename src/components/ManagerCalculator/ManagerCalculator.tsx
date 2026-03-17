import React, { useState, useMemo, useEffect } from 'react';
import { type HouseParams, type EstimateItem, calculateEstimate } from './calculations';

// Reusable Numeric Input with +/- buttons
const CounterInput = ({ label, value, onChange, name, step = 1, min = 0 }: any) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center space-x-1">
            <button
                type="button"
                onClick={() => onChange({ target: { name, value: Math.max(min, parseFloat((value - step).toFixed(2))), type: 'number' } })}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 text-gray-600 font-bold"
            >
                -
            </button>
            <input
                type="number"
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm text-center focus:ring-[#6b8e23] focus:border-[#6b8e23]"
            />
            <button
                type="button"
                onClick={() => onChange({ target: { name, value: parseFloat((value + step).toFixed(2)), type: 'number' } })}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 text-gray-600 font-bold"
            >
                +
            </button>
        </div>
    </div>
);

const INITIAL_PARAMS: HouseParams = {
    length: 6,
    width: 6,
    height: 2.4,
    innerWallsLength: 5,
    modulesCount: 2,
    windowsPercent: 20,
    doorsCount: 1,
    interiorDoorsCount: 1,
    roofAngle: 35,
    roofOverhangStr: 0.5,
    roofOverhangPlumb: 0.3,
    wallStudStep: 0.6,
    floorJoistStep: 0.6,
    roofRafterStep: 0.6,
    roofType: 'gable',
    floorFinish: 'laminate',
    interiorWallFinish: 'imitationWood',
    ceilingFinish: 'imitationWood',
    exteriorWallFinish: 'combined',
    roofFinish: 'proflistRoof',
    floorInsulationThickness: 200,
    wallInsulationThickness: 150,
    roofInsulationThickness: 200,
    electricalType: 'basic',
    heatingType: 'onlyWiring',
    heatingThermostatsCount: 0,
    heatingElectricFloorArea: 0,
    isPainted: true,
    optLightingCableCount: 0,
    optBreezerCount: 0,
    optWarmTapCount: 0,
    optSocketCount: 0,
    optSpotlightCount: 0,
    optStreetLightCount: 0,
    optAcPrepCount: 0,
    optWetPointSplit: false,
    optModuleExtendCount: 0,
    optPartition: false,
    optTambour: false,
    optSafeDoor: false,
    optPanWindow3: false,
    optPanWindow2: false,
    optWin100x200Count: 0,
    optWin50x200Count: 0,
    optWin60x50Count: 0,
    optWin150x50Count: 0,
    optGutterPlastic: false,
    optGutterMetal: false,
    optPlinthPlanken: false,
    optTerraceCloseCount: 0,
    optCanopy: false,
    optTerraceArea: 0,
    optRailingsLength: 0,
    optRailingsCrossLength: 0,
    optPorchStepCount: 0,
    optTerraceStepCount: 0,
    discountPercent: 0,
    markupAmount: 0,
    marginPercent: 20, // Начальная маржа 20%
    customItems: [],
    clientName: '',
    managerName: '',
    kpNumber: '',
    kpDate: new Date().toLocaleDateString('ru-RU'),
    hideFoundationAndAssembly: false,
    bathroomFloorArea: 0,
    bathroomFloorFinish: 'quartzVinyl',
    bathroomWallFinish: 'keramogranit',
};

export default function ManagerCalculator() {
    const [params, setParams] = useState<HouseParams>(() => {
        const saved = localStorage.getItem('manager_calc_params');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Объединяем со значениями по умолчанию, чтобы новые поля (marginPercent и т.д.) не были undefined
                return { ...INITIAL_PARAMS, ...parsed };
            } catch (e) {
                return INITIAL_PARAMS;
            }
        }
        return INITIAL_PARAMS;
    });

    const [activeTab, setActiveTab ] = useState<'geo' | 'finish' | 'bathroom' | 'eng' | 'extra' | 'finance'>('geo');
    const [isInternalMode, setIsInternalMode] = useState(false);
    const [newCustomItem, setNewCustomItem] = useState({ name: '', quantity: 1, unit: 'шт', price: 0 });

    useEffect(() => {
        localStorage.setItem('manager_calc_params', JSON.stringify(params));
    }, [params]);

    const handleChange = (e: any) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setParams(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setParams(prev => ({
                ...prev,
                [name]: (type === 'number' || type === 'range') ? parseFloat(value) || 0 : value
            }));
        }
    };

    // Auto-set laminate when electric floor is selected
    useEffect(() => {
        if (params.heatingType === 'electricFloor' && params.floorFinish !== 'laminate' && params.floorFinish !== 'laminateWaterproof') {
            setParams(prev => ({ ...prev, floorFinish: 'laminate' }));
        }
    }, [params.heatingType, params.floorFinish]);

    const addCustomItem = () => {
        if (!newCustomItem.name) return;
        const total = newCustomItem.quantity * newCustomItem.price;
        setParams(prev => ({
            ...prev,
            customItems: [...prev.customItems, { ...newCustomItem, total }]
        }));
        setNewCustomItem({ name: '', quantity: 1, unit: 'шт', price: 0 });
    };

    const removeCustomItem = (index: number) => {
        setParams(prev => ({
            ...prev,
            customItems: prev.customItems.filter((_, i) => i !== index)
        }));
    };

    const resetParams = () => {
        if (window.confirm('Сбросить все параметры к заводским?')) {
            setParams(INITIAL_PARAMS);
            localStorage.removeItem('manager_calc_params');
        }
    };

    const estimateResult = useMemo(() => calculateEstimate(params), [params]);
    const { sections, grandTotal, materialsTotal } = estimateResult;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Калькулятор-Смета</h1>
                    <p className="text-sm text-gray-500">Внутренний инструмент менеджера</p>
                </div>
                <button
                    onClick={handlePrint}
                    className="bg-[#6b8e23] hover:bg-[#5a781c] text-white px-5 py-2 rounded-lg font-medium transition-colors"
                >
                    Скачать PDF / Распечатать КП
                </button>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* ЛЕВАЯ КОЛОНКА - ВВОД ПАРАМЕТРОВ */}
                <div className="lg:col-span-4 space-y-6 print:hidden">
                    {/* ТАБЫ */}
                    <div className="flex flex-wrap bg-white p-1 rounded-xl shadow-sm border border-gray-100 mb-4">
                        {[
                            { id: 'geo', label: 'Чертеж' },
                            { id: 'finish', label: 'Отделка' },
                            { id: 'bathroom', label: 'Санузел' },
                            { id: 'eng', label: 'Инженерия' },
                            { id: 'extra', label: 'Допы' },
                            { id: 'finance', label: 'КП' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${activeTab === tab.id ? 'bg-[#6b8e23] text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
                        {/* TAB: GEOMETRY */}
                        {activeTab === 'geo' && (
                            <div className="space-y-6 animate-fadeIn">
                                <h2 className="text-lg font-bold border-b pb-2">Габариты и Конструктив</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <CounterInput label="Длина, м" name="length" value={params.length} onChange={handleChange} />
                                    <CounterInput label="Ширина, м" name="width" value={params.width} onChange={handleChange} />
                                    <CounterInput label="Высота, м" name="height" value={params.height} onChange={handleChange} step={0.1} min={2} />
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Кол-во модулей</label>
                                        <select name="modulesCount" value={params.modulesCount} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm">
                                            {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'модуль' : n < 5 ? 'модуля' : 'модулей'}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <CounterInput label="Перегородки, м" name="innerWallsLength" value={params.innerWallsLength} onChange={handleChange} />
                                    <CounterInput label="Окна (% от стен)" name="windowsPercent" value={params.windowsPercent} onChange={handleChange} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <CounterInput label="Входные двери, шт" name="doorsCount" value={params.doorsCount} onChange={handleChange} />
                                    <CounterInput label="Межкомн. двери, шт" name="interiorDoorsCount" value={params.interiorDoorsCount} onChange={handleChange} />
                                </div>
                                <div className="pt-2 border-t">
                                    <label className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors">
                                        <input type="checkbox" name="hideFoundationAndAssembly" checked={params.hideFoundationAndAssembly} onChange={handleChange} className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
                                        <span className="text-xs font-bold text-blue-800 leading-tight">Без фундамента и монтажа</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Тип крыши</label>
                                    <select name="roofType" value={params.roofType} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm">
                                        <option value="gable">Двускатная</option>
                                        <option value="shed">Односкатная</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* TAB: FINISH */}
                        {activeTab === 'finish' && (
                            <div className="space-y-6 animate-fadeIn">
                                <h2 className="text-lg font-bold border-b pb-2">Отделка и Утепление</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Наружный фасад</label>
                                        <select name="exteriorWallFinish" value={params.exteriorWallFinish} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm">
                                            <option value="combined">Комбинированный (Планкен + Профлист)</option>
                                            <option value="planken">Планкен (все стороны)</option>
                                            <option value="proflistWall">Профлист (все стороны)</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Внутр. стены</label>
                                            <select name="interiorWallFinish" value={params.interiorWallFinish} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm">
                                                <option value="imitationWood">Имитация бруса</option>
                                                <option value="woodLining">Вагонка "Штиль"</option>
                                                <option value="drywall">Гипсокартон</option>
                                                <option value="plywood">Фанера</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Потолок</label>
                                            <select name="ceilingFinish" value={params.ceilingFinish} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm">
                                                <option value="imitationWood">Имитация бруса</option>
                                                <option value="stretchCeiling">Натяжной</option>
                                                <option value="plywood">Фанера</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                                            <input type="checkbox" name="isPainted" checked={params.isPainted} onChange={handleChange} className="w-5 h-5 text-[#6b8e23] border-gray-300 rounded" />
                                            <span className="text-xs font-medium text-gray-700 leading-tight">Интерьерная покраска (2 слоя)</span>
                                        </label>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Утепление Стены/Кровля/Пол</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <select name="wallInsulationThickness" value={params.wallInsulationThickness} onChange={handleChange} className="bg-white border border-gray-300 rounded px-1 py-1 text-xs">
                                                <option value="100">Cт: 100</option>
                                                <option value="150">Cт: 150</option>
                                                <option value="200">Cт: 200</option>
                                            </select>
                                            <select name="roofInsulationThickness" value={params.roofInsulationThickness} onChange={handleChange} className="bg-white border border-gray-300 rounded px-1 py-1 text-xs">
                                                <option value="150">Кр: 150</option>
                                                <option value="200">Кр: 200</option>
                                                <option value="250">Кр: 250</option>
                                            </select>
                                            <select name="floorInsulationThickness" value={params.floorInsulationThickness} onChange={handleChange} className="bg-white border border-gray-300 rounded px-1 py-1 text-xs">
                                                <option value="150">Пл: 150</option>
                                                <option value="200">Пл: 200</option>
                                                <option value="250">Пл: 250</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Напольное покрытие</label>
                                        <select name="floorFinish" value={params.floorFinish} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm">
                                            <option value="laminate">Ламинат 33 кл.</option>
                                            <option value="laminateWaterproof">Ламинат 33 кл. Водостойкий</option>
                                            {params.heatingType !== 'electricFloor' && (
                                                <>
                                                    <option value="linoleum">Линолеум</option>
                                                    <option value="quartzVinyl">Кварцвинил (SPC)</option>
                                                    <option value="floorBoardPine">Доска (Хвоя)</option>
                                                    <option value="floorBoardLarch">Доска (Листв.)</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: BATHROOM */}
                        {activeTab === 'bathroom' && (
                            <div className="space-y-6 animate-fadeIn">
                                <h2 className="text-lg font-bold border-b pb-2">Отделка Санузла</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <CounterInput 
                                        label="Площадь пола, м2" 
                                        name="bathroomFloorArea" 
                                        value={params.bathroomFloorArea} 
                                        onChange={handleChange} 
                                        min={0}
                                    />
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Пол санузла</label>
                                        <select name="bathroomFloorFinish" value={params.bathroomFloorFinish} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm">
                                            <option value="quartzVinyl">Кварцвинил</option>
                                            <option value="keramogranit">Керамогранит</option>
                                            <option value="laminateWaterproof">Ламинат Водостойкий</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Стены санузла</label>
                                        <select name="bathroomWallFinish" value={params.bathroomWallFinish} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm">
                                            <option value="keramogranit">Керамогранит</option>
                                            <option value="quartzVinyl">Кварцвинил</option>
                                            <option value="imitationWood">Имитация бруса</option>
                                            <option value="plywood">Фанера</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <p className="text-[10px] text-gray-400 leading-tight">
                                            * Площадь стен рассчитывается автоматически на основе площади пола.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'eng' && (
                            <div className="space-y-6 animate-fadeIn">
                                <h2 className="text-lg font-bold border-b pb-2">Инженерные системы</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Электропроводка</label>
                                            <select name="electricalType" value={params.electricalType} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm">
                                                <option value="none">Без проводки</option>
                                                <option value="basic">Стандарт (1.5к/м2)</option>
                                                <option value="advanced">Премиум (2.7к/м2)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Отопление</label>
                                            <select name="heatingType" value={params.heatingType} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm">
                                                <option value="onlyWiring">Только разводка</option>
                                                <option value="electricFloor">Эл. теплый пол</option>
                                                <option value="waterFloor">Водяной теплый пол</option>
                                                <option value="convectors">Конвекторы</option>
                                            </select>
                                        </div>
                                    </div>
                                    {params.heatingType === 'electricFloor' && (
                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 animate-fadeIn">
                                            <CounterInput 
                                                label="Кол-во зон (терморегуляторы)" 
                                                name="heatingThermostatsCount" 
                                                value={params.heatingThermostatsCount} 
                                                onChange={handleChange} 
                                                min={0}
                                            />
                                            <div className="mt-3">
                                                <CounterInput 
                                                    label="Площадь теплого пола, м2" 
                                                    name="heatingElectricFloorArea" 
                                                    value={params.heatingElectricFloorArea} 
                                                    onChange={handleChange} 
                                                    step={0.5}
                                                    min={0}
                                                />
                                            </div>
                                            <p className="text-[10px] text-yellow-700 mt-2 font-medium">
                                                * При выборе электрического теплого пола доступен только ламинат.
                                                {params.heatingElectricFloorArea === 0 && " Площадь рассчитывается как 70% от площади пола."}
                                            </p>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <CounterInput label="Бризеры (шт)" name="optBreezerCount" value={params.optBreezerCount} onChange={handleChange} />
                                        <CounterInput label="Уличный кран (шт)" name="optWarmTapCount" value={params.optWarmTapCount} onChange={handleChange} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <CounterInput label="Доп. розетки (шт)" name="optSocketCount" value={params.optSocketCount} onChange={handleChange} />
                                        <CounterInput label="Точеч. свет (шт)" name="optSpotlightCount" value={params.optSpotlightCount} onChange={handleChange} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <CounterInput label="Уличный свет (шт)" name="optStreetLightCount" value={params.optStreetLightCount} onChange={handleChange} />
                                        <CounterInput label="Трассы конд. (шт)" name="optAcPrepCount" value={params.optAcPrepCount} onChange={handleChange} />
                                    </div>
                                    <label className="flex items-center space-x-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100 cursor-pointer">
                                        <input type="checkbox" name="optWetPointSplit" checked={params.optWetPointSplit} onChange={handleChange} className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
                                        <span className="text-xs font-medium text-gray-700">Разрыв мокрой точки (кухня далеко)</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* TAB: EXTRA OPTIONS */}
                        {activeTab === 'extra' && (
                            <div className="space-y-6 animate-fadeIn">
                                <h2 className="text-lg font-bold border-b pb-2">Доп. строения и опции</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <CounterInput label="Терраса доп. (м2)" name="optTerraceArea" value={params.optTerraceArea} onChange={handleChange} />
                                        <CounterInput label="Закрытие проемов (шт)" name="optTerraceCloseCount" value={params.optTerraceCloseCount} onChange={handleChange} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <CounterInput label="Перила планкен (мп)" name="optRailingsLength" value={params.optRailingsLength} onChange={handleChange} />
                                        <CounterInput label="Перила крестик (мп)" name="optRailingsCrossLength" value={params.optRailingsCrossLength} onChange={handleChange} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <CounterInput label="Ступени кр. (шт)" name="optPorchStepCount" value={params.optPorchStepCount} onChange={handleChange} />
                                        <CounterInput label="Ступени тер. (шт)" name="optTerraceStepCount" value={params.optTerraceStepCount} onChange={handleChange} />
                                    </div>
                                    <label className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-100 cursor-pointer hover:bg-amber-100 transition-colors">
                                        <input type="checkbox" name="optSafeDoor" checked={params.optSafeDoor} onChange={handleChange} className="w-5 h-5 text-amber-600 border-gray-300 rounded" /> 
                                        <span className="text-xs font-medium text-gray-700">Входная сейф-дверь + крыльцо (1×1.2м) + 2 ступени</span>
                                    </label>
                                    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer">
                                        <input type="checkbox" name="optCanopy" checked={params.optCanopy} onChange={handleChange} className="w-5 h-5 text-green-600 border-gray-300 rounded" />
                                        <span className="text-xs font-medium text-gray-700">Навес над крыльцом</span>
                                    </label>
                                    <div className="pt-2 border-t">
                                        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">Водосточная система</label>
                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2"><input type="checkbox" name="optGutterPlastic" checked={params.optGutterPlastic} onChange={handleChange} /> <span className="text-xs">Пластик</span></label>
                                            <label className="flex items-center space-x-2"><input type="checkbox" name="optGutterMetal" checked={params.optGutterMetal} onChange={handleChange} /> <span className="text-xs">Металл</span></label>
                                        </div>
                                    </div>
                                    <label className="flex items-center space-x-2 pt-2 border-t"><input type="checkbox" name="optPlinthPlanken" checked={params.optPlinthPlanken} onChange={handleChange} /> <span className="text-xs">Цоколь планкен</span></label>
                                </div>
                            </div>
                        )}

                        {/* TAB: FINANCE & CLIENT */}
                        {activeTab === 'finance' && (
                            <div className="space-y-6 animate-fadeIn">
                                <h2 className="text-lg font-bold border-b pb-2">Клиент и Финансы</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Имя Клиента</label>
                                            <input type="text" name="clientName" value={params.clientName} onChange={handleChange} placeholder="Иванов Иван" className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Автор КП (Менеджер)</label>
                                            <input type="text" name="managerName" value={params.managerName} onChange={handleChange} placeholder="Петров Петр" className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Номер КП</label>
                                            <input type="text" name="kpNumber" value={params.kpNumber} onChange={handleChange} placeholder="№24-001" className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Дата</label>
                                            <input type="text" name="kpDate" value={params.kpDate} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <CounterInput label="Скидка, %" name="discountPercent" value={params.discountPercent} onChange={handleChange} max={50} />
                                        <CounterInput label="Наценка, ₽" name="markupAmount" value={params.markupAmount} onChange={handleChange} step={5000} />
                                    </div>
                                    
                                    <div className="pt-4 border-t">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Произвольные позиции</h3>
                                        <div className="space-y-2 mb-3">
                                            {params.customItems.map((item: EstimateItem, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded border border-gray-100">
                                                    <span className="truncate flex-1 font-medium">{item.name} ({item.quantity} {item.unit})</span>
                                                    <span className="font-bold text-gray-900 mx-2">{item.total.toLocaleString()} ₽</span>
                                                    <button onClick={() => removeCustomItem(idx)} className="text-red-500 hover:text-red-700 px-1">✕</button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 space-y-2">
                                            <input type="text" placeholder="Название услуги/материала" value={newCustomItem.name} onChange={(e) => setNewCustomItem({ ...newCustomItem, name: e.target.value })} className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs" />
                                            <div className="grid grid-cols-3 gap-2 text-xs">
                                                <input type="number" placeholder="Кол-во" value={newCustomItem.quantity} onChange={(e) => setNewCustomItem({ ...newCustomItem, quantity: parseFloat(e.target.value) || 0 })} className="w-full bg-white border border-gray-300 rounded px-2 py-1" />
                                                <input type="text" placeholder="Ед.изм" value={newCustomItem.unit} onChange={(e) => setNewCustomItem({ ...newCustomItem, unit: e.target.value })} className="w-full bg-white border border-gray-300 rounded px-2 py-1" />
                                                <input type="number" placeholder="Цена" value={newCustomItem.price} onChange={(e) => setNewCustomItem({ ...newCustomItem, price: parseFloat(e.target.value) || 0 })} className="w-full bg-white border border-gray-300 rounded px-2 py-1" />
                                            </div>
                                            <button onClick={addCustomItem} className="w-full py-1.5 bg-gray-800 text-white rounded text-[10px] font-bold uppercase hover:bg-black transition-colors">Добавить позицию</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* STICKY TOTAL PANEL */}
                    <div className="sticky bottom-6 space-y-3 z-10">
                        <div className="bg-gray-900 text-white p-5 rounded-xl shadow-lg border border-gray-800">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-400 text-xs">Итоговая стоимость:</span>
                                {isInternalMode && <span className="text-red-400 text-[10px] font-mono">DEBUG MODE ON</span>}
                            </div>
                            <div className="text-3xl font-bold text-[#6b8e23]">
                                {grandTotal.toLocaleString('ru-RU')} ₽
                            </div>

                            {isInternalMode && (
                                <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
                                    <div className="flex flex-col space-y-1">
                                        <label className="text-[10px] text-gray-400 uppercase tracking-tighter">Наценка (работы/маржа), %</label>
                                        <div className="flex items-center space-x-2">
                                            <input 
                                                type="range" 
                                                name="marginPercent" 
                                                min="0" 
                                                max="200" 
                                                step="5"
                                                value={params.marginPercent} 
                                                onChange={(e) => handleChange({ target: { name: 'marginPercent', value: parseFloat(e.target.value) }})}
                                                className="flex-1 accent-[#6b8e23] h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <span className="text-xs font-mono w-12 text-right">{params.marginPercent}%</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1 text-xs font-mono pt-2 border-t border-gray-800">
                                        <div className="flex justify-between text-gray-400"><span>Себестоимость:</span><span>{materialsTotal.toLocaleString('ru-RU')} ₽</span></div>
                                        <div className="flex justify-between text-[#6b8e23]"><span>Маржа ({params.marginPercent}%):</span><span>{Math.ceil(materialsTotal * (params.marginPercent / 100)).toLocaleString('ru-RU')} ₽</span></div>
                                        {params.discountPercent > 0 && <div className="flex justify-between text-red-400"><span>Скидка ({params.discountPercent}%):</span><span>-{Math.ceil((materialsTotal + Math.ceil(materialsTotal * (params.marginPercent / 100))) * (params.discountPercent / 100)).toLocaleString('ru-RU')} ₽</span></div>}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setIsInternalMode(!isInternalMode)}
                                    className={`text-[10px] py-1 px-2 rounded border uppercase tracking-wider transition-colors ${isInternalMode ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
                                >
                                    {isInternalMode ? 'Скрыть маржу' : 'Инфо для профи'}
                                </button>
                                <button
                                    onClick={resetParams}
                                    className="text-[10px] py-1 px-2 rounded border border-gray-700 bg-gray-800 text-gray-500 hover:text-white uppercase tracking-wider"
                                >
                                    Сброс
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ПРАВАЯ КОЛОНКА - СМЕТА */}
                <div className="lg:col-span-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0" id="print-area">
                    <div className="mb-8 hidden print:block">
                        <div className="flex justify-between items-center mb-8 border-b-2 border-gray-900 pb-6">
                            <img src="/logo-black.png" alt="Company Logo" className="h-10 object-contain" />
                            <div className="text-right">
                                <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">Приложение № 2</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                            <div className="space-y-1">
                                <p><span className="text-gray-400">Заказчик:</span> <span className="font-semibold">{params.clientName || '____________________'}</span></p>
                                <p><span className="text-gray-400">Объект:</span> <span className="font-semibold">Модульный дом {params.length}x{params.width}м</span></p>
                                <p><span className="text-gray-400">Площадь:</span> <span className="font-semibold">{(params.length * params.width - params.bathroomFloorArea).toFixed(2)} м²</span></p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p><span className="text-gray-400">Дата:</span> <span className="font-semibold">{params.kpDate}</span></p>
                                <p><span className="text-gray-400">Менеджер:</span> <span className="font-semibold">{params.managerName || 'Специалист BestTown'}</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-6 py-3 rounded-tl-lg">Наименование / Этап</th>
                                    <th className="px-4 py-3 text-center">Кол-во</th>
                                    <th className="px-4 py-3 text-center">Ед. изм.</th>
                                    <th className="px-4 py-3 text-right">Цена</th>
                                    <th className="px-6 py-3 text-right rounded-tr-lg">Сумма</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Вывод всех разделов единым списком */}
                                {sections.map((section, idx) => (
                                    <React.Fragment key={`section-${idx}`}>
                                        <tr className="bg-gray-50/80 border-b border-t font-semibold">
                                            <td colSpan={4} className="px-6 py-3 text-gray-900">{idx + 1}. {section.name}</td>
                                            <td className="px-6 py-3 text-right text-gray-900">{section.total.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽</td>
                                        </tr>
                                        {section.items.map((item, itemIdx) => (
                                            <tr key={itemIdx} className="border-b last:border-none hover:bg-gray-50/50">
                                                <td className="px-6 py-2.5 text-gray-700">{item.name}</td>
                                                <td className="px-4 py-2.5 text-center">
                                                    {typeof item.quantity === 'number' 
                                                        ? (['м2', 'м3', 'мп', 'пог. м'].includes(item.unit) ? item.quantity.toFixed(2) : Math.round(item.quantity))
                                                        : item.quantity}
                                                </td>
                                                <td className="px-4 py-2.5 text-center text-gray-500">{item.unit}</td>
                                                <td className="px-4 py-2.5 text-right text-gray-500">{item.price.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}</td>
                                                <td className="px-6 py-2.5 text-right font-medium">{item.total.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}

                                {/* ФИНАНСОВЫЕ КОРРЕКТИРОВКИ */}
                                {params.discountPercent > 0 && (
                                    <tr className="bg-green-50/30 text-green-700 font-semibold border-t">
                                        <td colSpan={4} className="px-6 py-3">Скидка лояльности ({params.discountPercent}%)</td>
                                        <td className="px-6 py-3 text-right">-{Math.ceil((materialsTotal + Math.ceil(materialsTotal * (params.marginPercent / 100))) * (params.discountPercent / 100)).toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽</td>
                                    </tr>
                                )}
                                {params.markupAmount !== 0 && (
                                    <tr className="bg-gray-50/50 text-gray-700 font-semibold border-t">
                                        <td colSpan={4} className="px-6 py-3">Корректировка стоимости</td>
                                        <td className="px-6 py-3 text-right">{params.markupAmount > 0 ? '+' : ''}{params.markupAmount.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽</td>
                                    </tr>
                                )}

                                {/* ФИНАЛЬНЫЙ ИТОГ */}
                                <tr className="bg-gray-900 text-white font-bold text-xl mt-4 border-t-4 border-white">
                                    <td colSpan={4} className="px-6 py-6 rounded-bl-lg">ИТОГО К ОПЛАТЕ:</td>
                                    <td className="px-6 py-6 text-right whitespace-nowrap rounded-br-lg">{grandTotal.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 pt-8 border-t text-sm text-gray-500 hidden print:block">
                        <p>Данный расчет носит информационный характер и может быть уточнен после выезда специалиста на участок.</p>
                        <div className="mt-16 flex justify-between px-10">
                            <div className="text-center w-64 border-t pt-2">Подпись менеджера</div>
                            <div className="text-center w-64 border-t pt-2">Подпись заказчика</div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Медиа-запросы для печати вынесены в index.css, но мы используем Tailwind print: утилиты */}
        </div>
    );
}
