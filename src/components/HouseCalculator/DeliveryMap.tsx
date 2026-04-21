import React, { useState } from 'react';
import { YMaps, Map } from '@pbe/react-yandex-maps';
import type { HouseCalcState, DeliveryVehicleEntry } from './houseCalcTypes';
import { DELIVERY_VEHICLES } from './houseCalculatorData';

interface DeliveryMapProps {
    state: HouseCalcState;
    onChange: (key: keyof HouseCalcState, value: string | number | boolean | DeliveryVehicleEntry[]) => void;
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
const CRANE_SERVICES_PRICE = 30000; // фиксировано, не зависит от кол-ва модулей

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ state, onChange }) => {
    const BASE_ADDRESS = 'Свердловская обл., пгт. Верхнее Дуброво, ул. Малиновая, 6';

    const [ymapsInstance, setYmapsInstance] = useState<unknown>(null);
    const [mapInstance, setMapInstance] = useState<unknown>(null);
    const [searchQuery, setSearchQuery] = useState(state.deliveryAddress || '');
    const [isCalculating, setIsCalculating] = useState(false);
    const [routeError, setRouteError] = useState('');

    // --- Управление списком машин ---
    const vehicles = state.deliveryVehicles && state.deliveryVehicles.length > 0
        ? state.deliveryVehicles
        : [{ vehicleId: 'manip_10_10', qty: 1 }];

    // --- Считает общую стоимость доставки ---
    const computeDeliveryPrice = (distanceKm: number, currentVehicles: DeliveryVehicleEntry[], isCraneNeeded: boolean): number => {
        let price = 0;

        for (const entry of currentVehicles) {
            const rate = getVehicleRate(entry.vehicleId, distanceKm);
            price += distanceKm * rate * entry.qty;

            if (distanceKm > 0) {
                const oversized = OVERSIZED_BASE_PRICE * entry.qty;
                price += oversized;
            }
        }

        if (isCraneNeeded) {
            price += CRANE_SERVICES_PRICE;
        }

        return Math.round(price * 1.1);
    };

    const updateVehicles = (newList: DeliveryVehicleEntry[]) => {
        onChange('deliveryVehicles', newList);
        if (state.deliveryDistance > 0) {
            onChange('deliveryPrice', computeDeliveryPrice(state.deliveryDistance, newList, state.needLoadingCrane));
        }
    };

    const addVehicle = () => {
        updateVehicles([...vehicles, { vehicleId: 'manip_10_10', qty: 1 }]);
    };

    const removeVehicle = (idx: number) => {
        if (vehicles.length <= 1) return;
        updateVehicles(vehicles.filter((_, i) => i !== idx));
    };

    const handleVehicleChange = (index: number, vehicleId: string) => {
        const list = [...vehicles];
        list[index] = { ...list[index], vehicleId };
        updateVehicles(list);
    };

    const handleQtyChange = (index: number, qty: number) => {
        const list = [...vehicles];
        list[index] = { ...list[index], qty: Math.max(1, qty) };
        updateVehicles(list);
    };

    const totalVehicleCount = vehicles.reduce((s, v) => s + v.qty, 0);

    // --- Построить маршрут ---
    const handleCalculate = async () => {
        if (!ymapsInstance || !mapInstance || !searchQuery) return;
        setIsCalculating(true);
        setRouteError('');
        (mapInstance as { geoObjects: { removeAll: () => void } }).geoObjects.removeAll();

        try {
            interface YMapsRoute { 
                geocode: (s: string) => Promise<{ geoObjects: { get: (i: number) => { geometry: { getCoordinates: () => number[] } } } }>;
                route: (coords: number[][], options: { routingMode: string }) => Promise<{ 
                    getLength: () => number, 
                    getWayPoints: () => { getBounds: () => unknown } 
                }>;
            }
            const ymaps = ymapsInstance as YMapsRoute;
            const [resA, resB] = await Promise.all([
                ymaps.geocode(BASE_ADDRESS),
                ymaps.geocode(searchQuery)
            ]);

            const objA = resA.geoObjects.get(0);
            const objB = resB.geoObjects.get(0);

            if (!objA) { setRouteError('Не удалось найти адрес производства.'); setIsCalculating(false); return; }
            if (!objB) { setRouteError('Адрес участка не найден. Попробуйте ввести точнее.'); setIsCalculating(false); return; }

            const coordsA = objA.geometry.getCoordinates();
            const coordsB = objB.geometry.getCoordinates();

            ymaps.route([coordsA, coordsB], { routingMode: 'auto' }).then((route) => {
                interface MapInstance { 
                    geoObjects: { add: (r: unknown) => void };
                    setBounds: (b: unknown, o: { checkZoomRange: boolean }) => void;
                }
                const map = mapInstance as MapInstance;
                map.geoObjects.add(route);
                const distanceKm = Math.round(route.getLength() / 1000);

                onChange('deliveryAddress', searchQuery);
                onChange('deliveryDistance', distanceKm);
                onChange('deliveryPrice', computeDeliveryPrice(distanceKm, vehicles, state.needLoadingCrane));

                map.setBounds(route.getWayPoints().getBounds(), { checkZoomRange: true });
                setIsCalculating(false);
            }).catch((err: unknown) => {
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
                                className="w-full pl-3 pr-4 py-3 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm shadow-sm"
                            />
                        </div>
                        <button
                            onClick={handleCalculate}
                            disabled={!ymapsInstance || isCalculating}
                            className="bg-amber-500 text-white font-bold py-3 px-6 rounded hover:bg-amber-600 transition-colors disabled:opacity-50 text-sm flex-shrink-0 shadow-sm"
                        >
                            {isCalculating ? 'Считаем...' : 'Построить маршрут'}
                        </button>
                    </div>

                    {routeError && (
                        <div className="text-red-500 text-sm font-semibold p-2 bg-red-50 rounded border border-red-200">{routeError}</div>
                    )}

                    {/* ---- Карта ---- */}
                    <div className="h-[400px] bg-gray-200 rounded overflow-hidden relative border border-gray-300 shadow-sm">
                        <YMaps query={{ apikey: '341481f1-976f-4208-893b-868e5f953b10', load: 'package.full', lang: 'ru_RU' }}>
                            <Map
                                defaultState={{ center: [56.761001, 61.054366], zoom: 9 }}
                                width="100%"
                                height="100%"
                                onLoad={(ymaps: unknown) => {
                                    setYmapsInstance(ymaps);
                                    interface YMapsSuggest { SuggestView: new (id: string) => { events: { add: (n: string, cb: (e: { get: (k: string) => { value: string } }) => void) => void } } }
                                    const y = ymaps as YMapsSuggest;
                                    if (document.getElementById('suggest-input') && !document.getElementById('suggest-input-ready')) {
                                        const suggestView = new y.SuggestView('suggest-input');
                                        const hiddenMarker = document.createElement('div');
                                        hiddenMarker.id = 'suggest-input-ready';
                                        document.body.appendChild(hiddenMarker);
                                        suggestView.events.add('select', (e) => {
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

                    {/* ---- Список машин ---- */}
                    <div className="bg-white p-4 border rounded shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-gray-800">Техника для доставки</label>
                            <button onClick={addVehicle}
                                className="text-sm bg-amber-100 text-amber-800 px-4 py-1.5 rounded hover:bg-amber-200 font-bold transition-colors">
                                + Добавить машину
                            </button>
                        </div>
                        <div className="space-y-3">
                            {vehicles.map((entry, idx) => {
                                return (
                                    <div key={idx} className="flex flex-col md:flex-row md:items-center gap-3 bg-gray-50 border border-gray-200 rounded p-3">
                                        <select
                                            value={entry.vehicleId}
                                            onChange={(e) => handleVehicleChange(idx, e.target.value)}
                                            className="w-full md:flex-1 bg-white border border-gray-300 rounded py-2.5 px-3 text-sm focus:ring-amber-500 focus:border-amber-500"
                                        >
                                            {DELIVERY_VEHICLES.map(dv => (
                                                <option key={dv.id} value={dv.id}>{dv.name}</option>
                                            ))}
                                        </select>
                                        <div className="flex items-center justify-between md:justify-start gap-3 w-full md:w-auto">
                                            <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden shadow-sm h-[38px]">
                                                <button onClick={() => handleQtyChange(idx, entry.qty - 1)}
                                                    className="w-10 h-full flex items-center justify-center text-gray-700 bg-gray-100 hover:bg-gray-200 font-bold transition-colors">
                                                    −
                                                </button>
                                                <div className="w-px h-full bg-gray-300"></div>
                                                <input type="text" value={entry.qty} readOnly
                                                    className="w-12 h-full text-center text-sm font-bold focus:outline-none text-gray-800" />
                                                <div className="w-px h-full bg-gray-300"></div>
                                                <button onClick={() => handleQtyChange(idx, entry.qty + 1)}
                                                    className="w-10 h-full flex items-center justify-center text-gray-700 bg-gray-100 hover:bg-gray-200 font-bold transition-colors">
                                                    +
                                                </button>
                                            </div>
                                            {vehicles.length > 1 && (
                                                <button onClick={() => removeVehicle(idx)}
                                                    className="w-10 h-[38px] flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors text-lg border border-transparent hover:border-red-200" title="Удалить машину">
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ---- Чекбокс крана (всегда видим) ---- */}
                    <div className="bg-white p-4 border rounded shadow-sm">
                        <label className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={state.needLoadingCrane}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    onChange('needLoadingCrane', checked);
                                    if (state.deliveryDistance > 0) {
                                        onChange('deliveryPrice', computeDeliveryPrice(state.deliveryDistance, vehicles, checked));
                                    }
                                }}
                                className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                            />
                            <span className="ml-3 text-sm font-medium text-gray-800 group-hover:text-amber-700">
                                Услуги крана 25т — Погрузка + Монтаж ({CRANE_SERVICES_PRICE.toLocaleString()} ₽)
                            </span>
                        </label>
                    </div>

                    {/* ---- Детали рейса ---- */}
                    {state.deliveryDistance > 0 && (
                        <div className="bg-white border text-sm p-5 rounded shadow-sm border-amber-200">
                            <h3 className="font-black text-gray-900 mb-4 text-lg">Детали рейса</h3>
                            <div className="grid grid-cols-2 gap-6">
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
