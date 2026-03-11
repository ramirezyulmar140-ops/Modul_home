import React, { useState, useMemo } from 'react';
import { type HouseParams, calculateEstimate } from './calculations';

export default function ManagerCalculator() {
    const [params, setParams] = useState<HouseParams>({
        length: 6,
        width: 6,
        height: 2.5,
        innerWallsLength: 5,
        windowsPercent: 20,
        doorsCount: 1,
        interiorDoorsCount: 1,
        // Скрытые технические настройки оставляем в стейте, но уберем из UI
        roofAngle: 35,
        roofOverhangStr: 0.5,
        roofOverhangPlumb: 0.3,
        wallStudStep: 0.6,
        floorJoistStep: 0.6,
        roofRafterStep: 0.6,

        // Новые настройки отделки
        foundationType: 'piles',
        roofType: 'gable',
        floorFinish: 'laminate',
        interiorWallFinish: 'imitationWood',
        ceilingFinish: 'imitationWood',
        exteriorWallFinish: 'combined',
        roofFinish: 'proflistRoof',

        // Толщина утепления (мм)
        floorInsulationThickness: 200,
        wallInsulationThickness: 150,
        roofInsulationThickness: 200,

        // Опции
        heatingType: 'none',
        isPainted: true,

        // Дополнительные опции - Инженерия
        optLightingCableCount: 0,
        optBreezerCount: 0,
        optWarmTapCount: 0,
        optSocketCount: 0,
        optSpotlightCount: 0,
        optStreetLightCount: 0,
        optAcPrepCount: 0,
        optWetPointSplit: false,

        // Дополнительные опции - Каркас
        optModuleExtendCount: 0,
        optMouseMeshFloor: false,
        optExtraInsulation: false,
        optPartition: false,
        optTambour: false,

        // Дополнительные опции - Двери и Окна
        optSafeDoor: false,
        optPanWindow3: false,
        optPanWindow2: false,
        optWin100x200Count: 0,
        optWin50x200Count: 0,
        optWin60x50Count: 0,
        optWin150x50Count: 0,

        // Дополнительные опции - Внешняя отделка
        optGutterPlastic: false,
        optGutterMetal: false,
        optPlinthPlanken: false,

        // Дополнительные опции - Терраса / Крыльцо
        optTerraceCloseCount: 0,
        optCanopy: false,
        optTerraceArea: 0,
        optRailingsLength: 0,
        optRailingsCrossLength: 0,
        optPorchStepCount: 0,
        optTerraceStepCount: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                [name]: type === 'number' ? parseFloat(value) || 0 : value
            }));
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

            <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* ЛЕВАЯ КОЛОНКА - ВВОД ПАРАМЕТРОВ */}
                <div className="lg:col-span-4 space-y-6 print:hidden">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 border-b pb-2">Геометрия дома</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Длина, м</label>
                                    <input type="number" name="length" value={params.length} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ширина, м</label>
                                    <input type="number" name="width" value={params.width} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Высота стен, м</label>
                                    <input type="number" step="0.1" name="height" value={params.height} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Перегородки, м</label>
                                    <input type="number" name="innerWallsLength" value={params.innerWallsLength} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 border-b pb-2">Проемы и комплектация</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Окна (% фасада)</label>
                                    <input type="number" name="windowsPercent" value={params.windowsPercent} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Межк. двери, шт</label>
                                    <input type="number" name="interiorDoorsCount" value={params.interiorDoorsCount} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Входные двери, шт</label>
                                    <input type="number" name="doorsCount" value={params.doorsCount} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Крыша</label>
                                    <select name="roofType" value={params.roofType} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm">
                                        <option value="gable">Двускатная</option>
                                        <option value="shed">Односкатная</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 border-b pb-2">Утепление (Толщина)</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Стены</label>
                                    <select name="wallInsulationThickness" value={params.wallInsulationThickness} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm">
                                        <option value="100">100 мм</option>
                                        <option value="150">150 мм</option>
                                        <option value="200">200 мм (Перекрестное)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Крыша</label>
                                    <select name="roofInsulationThickness" value={params.roofInsulationThickness} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm">
                                        <option value="150">150 мм</option>
                                        <option value="200">200 мм</option>
                                        <option value="250">250 мм (Перекрестное)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Пол</label>
                                    <select name="floorInsulationThickness" value={params.floorInsulationThickness} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm">
                                        <option value="150">150 мм</option>
                                        <option value="200">200 мм</option>
                                        <option value="250">250 мм (Перекрестное)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h2 className="text-lg font-bold mb-4 border-b pb-2">Инженерные сети</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Система отопления</label>
                                <select name="heatingType" value={params.heatingType} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm">
                                    <option value="none">Без отопления (только разводка труб)</option>
                                    <option value="electricFloor">Электрический теплый пол (пленка/маты)</option>
                                    <option value="waterFloor">Водяной теплый пол + Электрокотел</option>
                                    <option value="convectors">Электрические настенные конвекторы</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 border-b pb-2">Материалы чистовой отделки</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Наружная отделка фасада</label>
                                <select name="exteriorWallFinish" value={params.exteriorWallFinish} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm">
                                    <option value="combined">Комбинированный</option>
                                    <option value="planken">Планкен все стороны</option>
                                    <option value="proflistWall">Профлист все стороны</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Внутренняя отделка стен</label>
                                <select name="interiorWallFinish" value={params.interiorWallFinish} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm">
                                    <option value="imitationWood">Имитация бруса (стандарт)</option>
                                    <option value="woodLining">Вагонка "Штиль"</option>
                                    <option value="blockHouse">Блок хаус</option>
                                    <option value="drywall">Гипсокартон (ГКЛ предчистовая)</option>
                                    <option value="plywood">Березовая фанера</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Внутренняя отделка потолка</label>
                                <select name="ceilingFinish" value={params.ceilingFinish} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm">
                                    <option value="imitationWood">Имитация бруса (стандарт)</option>
                                    <option value="woodLining">Вагонка "Штиль"</option>
                                    <option value="drywall">Гипсокартон (ГКЛ предчистовая)</option>
                                    <option value="stretchCeiling">Натяжной потолок (ПВХ)</option>
                                    <option value="plywood">Березовая фанера</option>
                                </select>
                            </div>

                            <div className="pt-2">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="isPainted"
                                        checked={params.isPainted}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-[#6b8e23] border-gray-300 rounded focus:ring-[#6b8e23] transition-colors"
                                    />
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                                        Добавить интерьерную покраску стен и потолков (2 слоя деревянных покрытий или ГКЛ)
                                    </span>
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Напольное покрытие</label>
                                <select name="floorFinish" value={params.floorFinish} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm">
                                    <option value="linoleum">Линолеум (бюджет)</option>
                                    <option value="laminate">Ламинат 33 класс</option>
                                    <option value="quartzVinyl">Кварцвинил (SPC)</option>
                                    <option value="floorBoardPine">Половая доска (Хвоя)</option>
                                    <option value="floorBoardLarch">Половая доска (Лиственница)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-yellow-200">
                        <h2 className="text-lg font-bold mb-4 border-b border-yellow-300 pb-2 text-yellow-900">Инженерные Доп. Опции</h2>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs text-gray-700">Вывод кабеля осв. (шт)</label><input type="number" name="optLightingCableCount" value={params.optLightingCableCount} onChange={handleChange} className="w-full bg-white border border-yellow-300 rounded px-2 py-1 text-sm" /></div>
                                <div><label className="block text-xs text-gray-700">Бризер Ballu (шт)</label><input type="number" name="optBreezerCount" value={params.optBreezerCount} onChange={handleChange} className="w-full bg-white border border-yellow-300 rounded px-2 py-1 text-sm" /></div>
                                <div><label className="block text-xs text-gray-700">Теплый кран улица (шт)</label><input type="number" name="optWarmTapCount" value={params.optWarmTapCount} onChange={handleChange} className="w-full bg-white border border-yellow-300 rounded px-2 py-1 text-sm" /></div>
                                <div><label className="block text-xs text-gray-700">Доп. розетка (шт)</label><input type="number" name="optSocketCount" value={params.optSocketCount} onChange={handleChange} className="w-full bg-white border border-yellow-300 rounded px-2 py-1 text-sm" /></div>
                                <div><label className="block text-xs text-gray-700">Доп. точечный свет (шт)</label><input type="number" name="optSpotlightCount" value={params.optSpotlightCount} onChange={handleChange} className="w-full bg-white border border-yellow-300 rounded px-2 py-1 text-sm" /></div>
                                <div><label className="block text-xs text-gray-700">Уличный св-к (шт)</label><input type="number" name="optStreetLightCount" value={params.optStreetLightCount} onChange={handleChange} className="w-full bg-white border border-yellow-300 rounded px-2 py-1 text-sm" /></div>
                                <div><label className="block text-xs text-gray-700">Подготовка под кондей</label><input type="number" name="optAcPrepCount" value={params.optAcPrepCount} onChange={handleChange} className="w-full bg-white border border-yellow-300 rounded px-2 py-1 text-sm" /></div>
                            </div>
                            <label className="flex items-center space-x-2 mt-2"><input type="checkbox" name="optWetPointSplit" checked={params.optWetPointSplit} onChange={handleChange} className="w-4 h-4 text-yellow-600 rounded" /><span className="text-xs">Разрыв мокрой точки (кухня не у с/у)</span></label>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-200">
                        <h2 className="text-lg font-bold mb-4 border-b border-blue-300 pb-2 text-blue-900">Каркас и Фасад Доп.</h2>
                        <div className="space-y-2">
                            <div><label className="block text-xs text-gray-700">Увеличение модуля на 60см (шт)</label><input type="number" name="optModuleExtendCount" value={params.optModuleExtendCount} onChange={handleChange} className="w-full bg-white border border-blue-300 rounded px-2 py-1 text-sm mb-2" /></div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <label className="flex items-center space-x-2"><input type="checkbox" name="optMouseMeshFloor" checked={params.optMouseMeshFloor} onChange={handleChange} className="w-4 h-4 text-blue-600" /><span>Сетка от грызунов</span></label>
                                <label className="flex items-center space-x-2"><input type="checkbox" name="optExtraInsulation" checked={params.optExtraInsulation} onChange={handleChange} className="w-4 h-4 text-blue-600" /><span>Доп. утепление до 200мм</span></label>
                                <label className="flex items-center space-x-2"><input type="checkbox" name="optPartition" checked={params.optPartition} onChange={handleChange} className="w-4 h-4 text-blue-600" /><span>Перегородка вх/кухня</span></label>
                                <label className="flex items-center space-x-2"><input type="checkbox" name="optTambour" checked={params.optTambour} onChange={handleChange} className="w-4 h-4 text-blue-600" /><span>Тамбур с дверью</span></label>
                                <label className="flex items-center space-x-2"><input type="checkbox" name="optGutterPlastic" checked={params.optGutterPlastic} onChange={handleChange} className="w-4 h-4 text-blue-600" /><span>Водосточка (Пластик)</span></label>
                                <label className="flex items-center space-x-2"><input type="checkbox" name="optGutterMetal" checked={params.optGutterMetal} onChange={handleChange} className="w-4 h-4 text-blue-600" /><span>Водосточка (Металл)</span></label>
                                <label className="flex items-center space-x-2"><input type="checkbox" name="optPlinthPlanken" checked={params.optPlinthPlanken} onChange={handleChange} className="w-4 h-4 text-blue-600" /><span>Цоколь планкен</span></label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl shadow-sm border border-purple-200">
                        <h2 className="text-lg font-bold mb-4 border-b border-purple-300 pb-2 text-purple-900">Окна и Двери Доп.</h2>
                        <div className="space-y-3">
                            <label className="flex items-center space-x-2"><input type="checkbox" name="optSafeDoor" checked={params.optSafeDoor} onChange={handleChange} className="w-4 h-4 text-purple-600 rounded" /><span className="text-xs">Входная сейф дверь + крыльцо</span></label>
                            <label className="flex items-center space-x-2"><input type="checkbox" name="optPanWindow3" checked={params.optPanWindow3} onChange={handleChange} className="w-4 h-4 text-purple-600" /><span className="text-xs">Замена на панорамные (3 секции)</span></label>
                            <label className="flex items-center space-x-2"><input type="checkbox" name="optPanWindow2" checked={params.optPanWindow2} onChange={handleChange} className="w-4 h-4 text-purple-600" /><span className="text-xs">Замена на панорамные (2 секции)</span></label>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div><label className="block text-xs text-gray-700">Окно 1000x2000 (шт)</label><input type="number" name="optWin100x200Count" value={params.optWin100x200Count} onChange={handleChange} className="w-full bg-white border border-purple-300 rounded px-2 py-1 text-sm" /></div>
                                <div><label className="block text-xs text-gray-700">Глухое 500x2000 (шт)</label><input type="number" name="optWin50x200Count" value={params.optWin50x200Count} onChange={handleChange} className="w-full bg-white border border-purple-300 rounded px-2 py-1 text-sm" /></div>
                                <div><label className="block text-xs text-gray-700">Окно 600x500 (шт)</label><input type="number" name="optWin60x50Count" value={params.optWin60x50Count} onChange={handleChange} className="w-full bg-white border border-purple-300 rounded px-2 py-1 text-sm" /></div>
                                <div><label className="block text-xs text-gray-700">Окно 1500x500 (шт)</label><input type="number" name="optWin150x50Count" value={params.optWin150x50Count} onChange={handleChange} className="w-full bg-white border border-purple-300 rounded px-2 py-1 text-sm" /></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-200">
                        <h2 className="text-lg font-bold mb-4 border-b border-green-300 pb-2 text-green-900">Терраса и Крыльцо</h2>
                        <div className="space-y-3">
                            <label className="flex items-center space-x-2"><input type="checkbox" name="optCanopy" checked={params.optCanopy} onChange={handleChange} className="w-4 h-4 text-green-600 rounded" /><span className="text-xs">Навес над крыльцом</span></label>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div><label className="block text-xs text-gray-700">Закрытие проема (шт)</label><input type="number" name="optTerraceCloseCount" value={params.optTerraceCloseCount} onChange={handleChange} className="w-full bg-white border border-green-300 rounded px-2 py-1 text-sm" /></div>
                                <div><label className="block text-xs text-gray-700">Доп. площадь (м2)</label><input type="number" name="optTerraceArea" value={params.optTerraceArea} onChange={handleChange} className="w-full bg-white border border-green-300 rounded px-2 py-1 text-sm" /></div>
                                <div><label className="block text-xs text-gray-700">Перила планкен (м.п.)</label><input type="number" name="optRailingsLength" value={params.optRailingsLength} onChange={handleChange} className="w-full bg-white border border-green-300 rounded px-2 py-1 text-sm" /></div>
                                <div><label className="block text-xs text-gray-700">Перила крестик (м.п.)</label><input type="number" name="optRailingsCrossLength" value={params.optRailingsCrossLength} onChange={handleChange} className="w-full bg-white border border-green-300 rounded px-2 py-1 text-sm" /></div>
                                <div><label className="block text-xs text-gray-700">Ступень крыльца 1.2м (шт)</label><input type="number" name="optPorchStepCount" value={params.optPorchStepCount} onChange={handleChange} className="w-full bg-white border border-green-300 rounded px-2 py-1 text-sm" /></div>
                                <div><label className="block text-xs text-gray-700">Ступень террасы 6м (шт)</label><input type="number" name="optTerraceStepCount" value={params.optTerraceStepCount} onChange={handleChange} className="w-full bg-white border border-green-300 rounded px-2 py-1 text-sm" /></div>
                            </div>
                        </div>
                    </div>

                    {/* Итог (для менеджера перед глазами) */}
                    <div className="bg-[#6b8e23]/10 p-6 rounded-xl border border-[#6b8e23]/30">
                        <p className="text-sm text-gray-600 mb-1">Материалы:</p>
                        <p className="text-3xl font-bold text-[#6b8e23]">{materialsTotal.toLocaleString('ru-RU')} ₽</p>
                    </div>
                </div>

                {/* ПРАВАЯ КОЛОНКА - СМЕТА */}
                <div className="lg:col-span-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0" id="print-area">
                    <div className="mb-8 hidden print:block">
                        <div className="flex justify-between items-start border-b border-gray-900 pb-4 mb-4">
                            <div>
                                <h1 className="text-3xl font-serif text-gray-900">Приложение №2</h1>
                                <p className="text-gray-600 mt-2">Каркасный дом, Размеры: {params.length} x {params.width} м. Общая площадь: {params.length * params.width} м²</p>
                            </div>
                            <img src="/logo-black.png" alt="BestTown Logo" className="h-12 object-contain" />
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
                                            <td className="px-6 py-3 text-right text-gray-900">{section.total.toLocaleString('ru-RU')} ₽</td>
                                        </tr>
                                        {section.items.map((item, itemIdx) => (
                                            <tr key={itemIdx} className="border-b last:border-none hover:bg-gray-50/50">
                                                <td className="px-6 py-2.5 text-gray-700">{item.name}</td>
                                                <td className="px-4 py-2.5 text-center">{item.quantity}</td>
                                                <td className="px-4 py-2.5 text-center text-gray-500">{item.unit}</td>
                                                <td className="px-4 py-2.5 text-right text-gray-500">{item.price.toLocaleString('ru-RU')}</td>
                                                <td className="px-6 py-2.5 text-right font-medium">{item.total.toLocaleString('ru-RU')} ₽</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}

                                {/* ФИНАЛЬНЫЙ ИТОГ */}
                                <tr className="bg-gray-900 text-white font-bold text-lg mt-4 border-t-4 border-white">
                                    <td colSpan={4} className="px-6 py-5 rounded-bl-lg">ИТОГО ДОМ «ПОД КЛЮЧ»:</td>
                                    <td className="px-6 py-5 text-right whitespace-nowrap rounded-br-lg">{grandTotal.toLocaleString('ru-RU')} ₽</td>
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
