import React, { useState } from 'react';
import { YMaps, Map } from '@pbe/react-yandex-maps';
import type { HouseCalcState, DeliveryVehicleEntry } from './houseCalcTypes';
import { DELIVERY_VEHICLES } from './houseCalculatorData';

interface DeliveryMapProps {
    state: HouseCalcState;
    onChange: (key: keyof HouseCalcState, value: any) => void;
}

// Считает ставку за км для конкретной машины на конкретную дистанцию
function getVehicleRate(vehicleId: string, distanceKm: number): number {
    const v = DELIVERY_VEHICLES.find(d => d.id === vehicleId);
    if (!v) return 0;
    if (v.type === 'manipulator') return v.fixedKmPrice || 0;
    if (distanceKm <= 100) return v.priceTier1 || 0;
    if (distanceKm <= 200) return v.priceTier2 || 0;
    return v.priceTier3 || 0;
}

const OVERSIZED_BASE_PRICE = 20000;
const OVERSIZED_KM_PRICE = 50;
const CRANE_SERVICES_PRICE = 30000; // фиксировано, не зависит от кол-ва модулей

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ state, onChange }) => {
    const BASE_ADDRESS = 'Свердловская обл., пгт. Верхнее Дуброво, ул. Малиновая, 6';

    const [ymapsInstance, setYmapsInstance] = useState<any>(null);
    const [mapInstance, setMapInstance] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState(state.deliveryAddress || '');
    const [isCalculating, setIsCalculating] = useState(false);
    const [routeError, setRouteError] = useState('');

    // --- Управление списком машин ---
    const vehicles = state.deliveryVehicles && state.deliveryVehicles.length > 0
        ? state.deliveryVehicles
        : [{ vehicleId: 'manip_10_10', qty: 1 }];

    const updateVehicles = (newList: DeliveryVehicleEntry[]) => {
        onChange('deliveryVehicles', newList);
        onChange('deliveryDistance', 0);
        onChange('deliveryPrice', 0);
    };

    const addVehicle = () => {
        updateVehicles([...vehicles, { vehicleId: 'manip_10_10', qty: 1 }]);
    };

    const removeVehicle = (idx: number) => {
        if (vehicles.length <= 1) return;
        updateVehicles(vehicles.filter((_, i) => i !== idx));
    };

    const changeVehicleType = (idx: number, vehicleId: string) => {
        const list = [...vehicles];
        list[idx] = { ...list[idx], vehicleId };
        updateVehicles(list);
    };

    const changeVehicleQty = (idx: number, qty: number) => {
        const list = [...vehicles];
        list[idx] = { ...list[idx], qty: Math.max(1, qty) };
        updateVehicles(list);
    };

    // --- Считает общую стоимость доставки ---
    const computeDeliveryPrice = (distanceKm: number): number => {
        let price = 0;

        // Для каждой машины: ставка × км × кол-во
        for (const entry of vehicles) {
            const rate = getVehicleRate(entry.vehicleId, distanceKm);
            price += distanceKm * rate * entry.qty;

            // Негабарит за каждую единицу
            if (distanceKm > 0) {
                let oversized = OVERSIZED_BASE_PRICE * entry.qty;
                if (distanceKm > 50) {
                    oversized += (distanceKm - 50) * OVERSIZED_KM_PRICE * entry.qty;
                }
                price += oversized;
            }
        }

        // Услуги крана — фиксировано 30 000 (не зависит от модулей)
        if (state.needLoadingCrane) {
            price += CRANE_SERVICES_PRICE;
        }

        return price;
    };

    const totalVehicleCount = vehicles.reduce((s, v) => s + v.qty, 0);

    // --- Построить маршрут ---
    const handleCalculate = async () => {
        if (!ymapsInstance || !mapInstance || !searchQuery) return;
        setIsCalculating(true);
        setRouteError('');
        mapInstance.geoObjects.removeAll();

        try {
            const [resA, resB] = await Promise.all([
                ymapsInstance.geocode(BASE_ADDRESS),
                ymapsInstance.geocode(searchQuery)
            ]);

            const objA = resA.geoObjects.get(0);
            const objB = resB.geoObjects.get(0);

            if (!objA) { setRouteError('Не удалось найти адрес производства.'); setIsCalculating(false); return; }
            if (!objB) { setRouteError('Адрес участка не найден. Попробуйте ввести точнее.'); setIsCalculating(false); return; }

            const coordsA = objA.geometry.getCoordinates();
            const coordsB = objB.geometry.getCoordinates();

            ymapsInstance.route([coordsA, coordsB], { routingMode: 'auto' }).then((route: any) => {
                mapInstance.geoObjects.add(route);
                const distanceKm = Math.round(route.getLength() / 1000);

                onChange('deliveryAddress', searchQuery);
                onChange('deliveryDistance', distanceKm);
                onChange('deliveryPrice', computeDeliveryPrice(distanceKm));

                mapInstance.setBounds(route.getWayPoints().getBounds(), { checkZoomRange: true });
                setIsCalculating(false);
            }).catch((err: any) => {
                console.error('Ошибка маршрутизации:', err);
                setRouteError('Координаты найдены, но Яндекс не может проложить маршрут. Проверьте услугу «Маршрутизация» в кабинете Яндекса.');
                setIsCalculating(false);
            });

        } catch (err) {
            console.error('Ошибка геокодирования:', err);
            setRouteError('Ошибка API карт. Проверьте ключ, Геокодер и ограничения по домену.');
            setIsCalculating(false);
        }
    };

    return (
        <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                <h2 className="text-xl font-black text-[#1A1C19]">Доставка на участок</h2>
                <label className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" className="sr-only"
                            checked={state.useDeliveryMap}
                            onChange={(e) => onChange('useDeliveryMap', e.target.checked)} />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${state.useDeliveryMap ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${state.useDeliveryMap ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Использовать интерактивную карту</span>
                </label>
            </div>

            {state.useDeliveryMap && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">

                    {/* ---- Список машин ---- */}
                    <div className="bg-white p-3 border rounded shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-gray-700">Техника для доставки</label>
                            <button onClick={addVehicle}
                                className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded hover:bg-amber-200 font-bold transition-colors">
                                + Добавить машину
                            </button>
                        </div>
                        {vehicles.map((entry, idx) => {
                            return (
                                <div key={idx} className="flex items-center gap-2 bg-gray-50 border rounded p-2">
                                    <select
                                        value={entry.vehicleId}
                                        onChange={(e) => changeVehicleType(idx, e.target.value)}
                                        className="flex-1 bg-white border border-gray-300 rounded py-1.5 px-2 text-xs focus:ring-amber-500 focus:border-amber-500"
                                    >
                                        {DELIVERY_VEHICLES.map(dv => (
                                            <option key={dv.id} value={dv.id}>{dv.name}</option>
                                        ))}
                                    </select>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => changeVehicleQty(idx, entry.qty - 1)}
                                            className="w-6 h-6 bg-white border border-gray-300 rounded text-xs font-bold">−</button>
                                        <input type="number" value={entry.qty}
                                            onChange={e => changeVehicleQty(idx, parseInt(e.target.value) || 1)}
                                            className="w-10 text-center border border-gray-300 rounded text-xs py-0.5" />
                                        <button onClick={() => changeVehicleQty(idx, entry.qty + 1)}
                                            className="w-6 h-6 bg-white border border-gray-300 rounded text-xs font-bold">+</button>
                                        <span className="text-[10px] text-gray-400 w-6">шт</span>
                                    </div>
                                    {vehicles.length > 1 && (
                                        <button onClick={() => removeVehicle(idx)}
                                            className="text-red-500 hover:text-red-700 px-1 text-xs font-bold">✕</button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ---- Чекбокс крана (всегда видим) ---- */}
                    <div className="bg-white p-3 border rounded shadow-sm">
                        <label className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={state.needLoadingCrane}
                                onChange={(e) => {
                                    onChange('needLoadingCrane', e.target.checked);
                                    onChange('deliveryDistance', 0);
                                    onChange('deliveryPrice', 0);
                                }}
                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-amber-700">
                                Услуги крана 25т — Погрузка + Монтаж ({CRANE_SERVICES_PRICE.toLocaleString()} ₽)
                            </span>
                        </label>
                    </div>

                    {/* ---- Поиск адреса ---- */}
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <input
                                id="suggest-input"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                                placeholder="Введите адрес участка (например: г. Истра, ул. Ленина 1)"
                                className="w-full pl-3 pr-4 py-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                            />
                        </div>
                        <button
                            onClick={handleCalculate}
                            disabled={!ymapsInstance || isCalculating}
                            className="bg-amber-500 text-white font-bold py-2 px-6 rounded hover:bg-amber-600 transition-colors disabled:opacity-50 text-sm flex-shrink-0"
                        >
                            {isCalculating ? 'Считаем...' : 'Построить маршрут'}
                        </button>
                    </div>

                    {routeError && (
                        <div className="text-red-500 text-xs font-semibold">{routeError}</div>
                    )}

                    {/* ---- Карта ---- */}
                    <div className="h-[400px] bg-gray-200 rounded overflow-hidden relative">
                        <YMaps query={{ apikey: '341481f1-976f-4208-893b-868e5f953b10', load: 'package.full', lang: 'ru_RU' }}>
                            <Map
                                defaultState={{ center: [56.761001, 61.054366], zoom: 9 }}
                                width="100%"
                                height="100%"
                                onLoad={(ymaps: any) => {
                                    setYmapsInstance(ymaps);
                                    if (document.getElementById('suggest-input') && !document.getElementById('suggest-input-ready')) {
                                        const suggestView = new ymaps.SuggestView('suggest-input');
                                        const hiddenMarker = document.createElement('div');
                                        hiddenMarker.id = 'suggest-input-ready';
                                        document.body.appendChild(hiddenMarker);
                                        suggestView.events.add('select', (e: any) => {
                                            const item = e.get('item');
                                            if (item) setSearchQuery(item.value);
                                        });
                                    }
                                }}
                                instanceRef={(map) => setMapInstance(map)}
                            />
                        </YMaps>
                        {!ymapsInstance && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70">
                                <span className="text-sm font-medium text-gray-500 animate-pulse">Загрузка карты...</span>
                            </div>
                        )}
                    </div>

                    {/* ---- Детали рейса ---- */}
                    {state.deliveryDistance > 0 && (
                        <div className="bg-white border text-sm p-4 rounded shadow-sm border-amber-100">
                            <h3 className="font-black text-gray-900 mb-2">Детали рейса</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Точка отправления (База)</p>
                                    <p className="font-medium text-gray-800">{BASE_ADDRESS}</p>
                                    <p className="text-gray-500 text-xs mt-2 mb-1">Техника ({totalVehicleCount} шт.)</p>
                                    {vehicles.map((entry, idx) => {
                                        const v = DELIVERY_VEHICLES.find(d => d.id === entry.vehicleId);
                                        return <p key={idx} className="font-medium text-gray-800 text-xs">{v?.name || '?'} × {entry.qty}</p>;
                                    })}
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Точка назначения (Участок)</p>
                                    <p className="font-medium text-gray-800">{state.deliveryAddress}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Расстояние по трассе</p>
                                    <p className="font-bold text-amber-600 text-lg">{state.deliveryDistance} км</p>
                                    {state.deliveryDistance > 50 && (
                                        <p className="text-[10px] text-red-500 italic">Свыше 50 км ({state.deliveryDistance - 50} км) применяется надбавка за негабарит.</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Итоговая стоимость доставки</p>
                                    <p className="font-bold text-gray-900 text-lg">{state.deliveryPrice.toLocaleString()} ₽</p>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        Включая негабарит 3.4м
                                        {state.needLoadingCrane ? ' и услуги крана 25т' : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
