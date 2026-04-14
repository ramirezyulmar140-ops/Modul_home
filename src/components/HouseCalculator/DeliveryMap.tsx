import React, { useState } from 'react';
import { YMaps, Map } from '@pbe/react-yandex-maps';
import type { HouseCalcState } from './houseCalcTypes';
import { HOUSE_MODELS, DELIVERY_VEHICLES } from './houseCalculatorData';

interface DeliveryMapProps {
    state: HouseCalcState;
    onChange: (key: keyof HouseCalcState, value: any) => void;
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ state, onChange }) => {
    const selectedModel = HOUSE_MODELS.find(m => m.id === state.selectedHouse);
    const modulesCount = selectedModel?.modulesCount || 1;

    // Базовые настройки
    const BASE_ADDRESS = 'Свердловская обл., пгт. Верхнее Дуброво, ул. Малиновая, 6';
    const OVERSIZED_BASE_PRICE = 20000;
    const OVERSIZED_KM_PRICE = 50;
    const CRANE_SERVICES_PRICE = 30000; // 15к погрузка + 15к разгрузка

    const selectedVehicle = DELIVERY_VEHICLES.find(v => v.id === state.deliveryVehicleId) || DELIVERY_VEHICLES[0];

    const [ymapsInstance, setYmapsInstance] = useState<any>(null);
    const [mapInstance, setMapInstance] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState(state.deliveryAddress || '');
    const [isCalculating, setIsCalculating] = useState(false);
    const [routeError, setRouteError] = useState('');

    const handleCalculate = async () => {
        if (!ymapsInstance || !mapInstance || !searchQuery) return;
        setIsCalculating(true);
        setRouteError('');

        mapInstance.geoObjects.removeAll();

        try {
            // 1. Геокодируем обе точки, чтобы получить координаты
            const [resA, resB] = await Promise.all([
                ymapsInstance.geocode(BASE_ADDRESS),
                ymapsInstance.geocode(searchQuery)
            ]);

            const objA = resA.geoObjects.get(0);
            const objB = resB.geoObjects.get(0);

            if (!objA) {
                setRouteError('Не удалось найти адрес вашего производства. Проверьте BASE_ADDRESS в коде.');
                setIsCalculating(false);
                return;
            }
            if (!objB) {
                setRouteError('Адрес участка не найден. Попробуйте ввести более точно (город, улица, дом).');
                setIsCalculating(false);
                return;
            }

            const coordsA = objA.geometry.getCoordinates();
            const coordsB = objB.geometry.getCoordinates();

            // 2. Строим маршрут по координатам
            ymapsInstance.route([coordsA, coordsB], {
                routingMode: 'auto',
            }).then((route: any) => {
                mapInstance.geoObjects.add(route);
                
                const lengthMeters = route.getLength();
                const distanceKm = Math.round(lengthMeters / 1000);
                
                onChange('deliveryAddress', searchQuery);
                onChange('deliveryDistance', distanceKm);
                
                let price = 0;
                
                // 1. Базовый тариф за пробег
                let rate = 0;
                if (selectedVehicle.type === 'manipulator') {
                    rate = selectedVehicle.fixedKmPrice || 0;
                } else {
                    if (distanceKm <= 100) rate = selectedVehicle.priceTier1 || 0;
                    else if (distanceKm <= 200) rate = selectedVehicle.priceTier2 || 0;
                    else rate = selectedVehicle.priceTier3 || 0;
                }
                
                price += distanceKm * rate * modulesCount;
                
                // 2. Негабарит (ширина 3.4м)
                let oversizedCost = 0;
                if (distanceKm > 0) {
                    oversizedCost = OVERSIZED_BASE_PRICE * modulesCount;
                    if (distanceKm > 50) {
                        oversizedCost += (distanceKm - 50) * OVERSIZED_KM_PRICE * modulesCount;
                    }
                }
                price += oversizedCost;

                // 3. Услуги крана (только для трала, если включено)
                if (selectedVehicle.type === 'trawl' && state.needLoadingCrane) {
                    price += CRANE_SERVICES_PRICE * modulesCount;
                }
                
                onChange('deliveryPrice', price);
                
                mapInstance.setBounds(route.getWayPoints().getBounds(), { checkZoomRange: true });
                setIsCalculating(false);
            }).catch((err: any) => {
                console.error('Ошибка маршрутизации:', err);
                setRouteError('Координаты найдены, но Яндекс не может проложить маршрут между ними. Проверьте, включена ли услуга "МАРШРУТИЗАЦИЯ" в кабинете Яндекса.');
                setIsCalculating(false);
            });

        } catch (err) {
            console.error('Ошибка геокодирования:', err);
            setRouteError('Ошибка API карт (scriptError). Проверьте: 1. Активен ли ключ. 2. Включен ли "Геокодер". 3. Нет ли ограничений по домену (referer).');
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-3 border rounded shadow-sm">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Тип техники</label>
                            <select 
                                value={state.deliveryVehicleId}
                                onChange={(e) => {
                                    onChange('deliveryVehicleId', e.target.value);
                                    // Обнуляем дальность, чтобы пользователь нажал "Пересчитать"
                                    onChange('deliveryDistance', 0);
                                    onChange('deliveryPrice', 0);
                                }}
                                className="w-full bg-gray-50 border border-gray-300 rounded py-2 px-3 text-sm focus:ring-amber-500 focus:border-amber-500"
                            >
                                {DELIVERY_VEHICLES.map(v => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                        {selectedVehicle.type === 'trawl' && (
                            <div className="flex items-center mt-6">
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
                                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-amber-700">Услуги крана (Погрузка + Монтаж)</span>
                                </label>
                            </div>
                        )}
                    </div>

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

                    <div className="h-[400px] bg-gray-200 rounded overflow-hidden relative">
                        <YMaps query={{ apikey: '341481f1-976f-4208-893b-868e5f953b10', load: 'package.full', lang: 'ru_RU' }}>
                            <Map
                                defaultState={{ center: [56.761001, 61.054366], zoom: 9 }}
                                width="100%"
                                height="100%"
                                onLoad={(ymaps: any) => {
                                    setYmapsInstance(ymaps);
                                    // Инициализируем подсказки сразу при загрузке API
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

                    {state.deliveryDistance > 0 && (
                        <div className="bg-white border text-sm p-4 rounded shadow-sm border-amber-100">
                            <h3 className="font-black text-gray-900 mb-2">Детали рейса</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Точка отправления (База)</p>
                                    <p className="font-medium text-gray-800">{BASE_ADDRESS}</p>
                                    <p className="text-gray-500 text-xs mt-2 mb-1">Техника</p>
                                    <p className="font-medium text-gray-800">{selectedVehicle.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Точка назначения (Участок)</p>
                                    <p className="font-medium text-gray-800">{state.deliveryAddress}</p>
                                    <p className="text-gray-500 text-xs mt-2 mb-1">Кол-во машин</p>
                                    <p className="font-medium text-gray-800">{modulesCount} шт.</p>
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
                                    <div className="flex items-baseline gap-2">
                                        <p className="font-bold text-gray-900 text-lg">{state.deliveryPrice.toLocaleString()} ₽</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        Включая негабарит 3.4м 
                                        {selectedVehicle.type === 'trawl' && state.needLoadingCrane ? ' и услуги крана' : ''}
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
