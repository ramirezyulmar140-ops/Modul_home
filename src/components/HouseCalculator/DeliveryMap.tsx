import React, { useState } from 'react';
import { YMaps, Map } from '@pbe/react-yandex-maps';
import type { HouseCalcState } from './houseCalcTypes';
import { HOUSE_MODELS } from './houseCalculatorData';

interface DeliveryMapProps {
    state: HouseCalcState;
    onChange: (key: keyof HouseCalcState, value: any) => void;
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ state, onChange }) => {
    const selectedModel = HOUSE_MODELS.find(m => m.id === state.selectedHouse);
    const modulesCount = selectedModel?.modulesCount || 1;

    // Базовые настройки
    const BASE_ADDRESS = 'Свердловская обл., пгт. Верхнее Дуброво, ул. Малиновая, 6';
    const FREE_DISTANCE_KM = 50; 
    const PRICE_PER_KM_PER_MODULE = 100; // руб/км за модуль (можно будет скорректировать)

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
                if (distanceKm > FREE_DISTANCE_KM) {
                    const extraKm = distanceKm - FREE_DISTANCE_KM;
                    price = extraKm * PRICE_PER_KM_PER_MODULE * modulesCount;
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
                    
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <input 
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
                        <YMaps query={{ apikey: '341481f1-976f-4208-893b-868e5f953b10', load: 'package.full' }}>
                            <Map
                                defaultState={{ center: [56.761001, 61.054366], zoom: 9 }}
                                width="100%"
                                height="100%"
                                onLoad={(ymaps) => setYmapsInstance(ymaps)}
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
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Точка назначения (Участок)</p>
                                    <p className="font-medium text-gray-800">{state.deliveryAddress}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Расстояние по трассе</p>
                                    <p className="font-bold text-amber-600 text-lg">{state.deliveryDistance} км</p>
                                    <p className="text-xs text-gray-400">Включено: {FREE_DISTANCE_KM} км</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Стоимость доставки сверх лимита</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="font-bold text-gray-900 text-lg">{state.deliveryPrice.toLocaleString()} ₽</p>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        ( {(Math.max(0, state.deliveryDistance - FREE_DISTANCE_KM))} км × {PRICE_PER_KM_PER_MODULE}₽ × {modulesCount} модуля )
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
