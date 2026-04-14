export type HouseModelId = 'dom42' | 'dom49' | 'dom63' | 'dom77' | 'dom77o';

export interface HouseModel {
    id: HouseModelId;
    name: string;
    area: number;
    basePrice: number;
    description: string;
    features: string[];
    modulesCount: number;
}

export interface ServiceEntry {
    id: string;
    category: string;
    name: string;
    specs: string;
    unit: string;
    price: number;
    quantity: number;
}

export interface CustomItem {
    name: string;
    quantity: number;
    unit: string;
    price: number;
    total: number;
}



export type TabId = 'house' | 'finish' | 'bathroom' | 'engineering' | 'frame' | 'windows' | 'exterior' | 'terrace' | 'services' | 'delivery' | 'kp';

export interface HouseCalcState {
    // Выбранный дом
    selectedHouse: HouseModelId;

    // Отделка внутренняя (стены/потолок — фиксированные цены по модели)
    wallFinish: 'none' | 'vagonka' | 'imitBrus' | 'gipsokarton';
    ceilingFinish: 'none' | 'fanera' | 'imitBrus';
    paintWalls: boolean;
    paintCeiling: boolean;
    // Пол — per m² pricing
    floorFinish: 'none' | 'laminateWP' | 'quartzVinyl' | 'linoleum' | 'boardPine' | 'boardLarch';

    // Санузел
    bathroomFloorArea: number;
    bathroomFloorFinish: 'none' | 'quartzVinyl' | 'keramogranit' | 'laminateWP';
    bathroomWallFinish: 'none' | 'keramogranit' | 'quartzVinyl' | 'imitationWood' | 'fanera';

    // Инженерные элементы
    lightingCableCount: number;
    warmTapCount: number;
    lightSwitchCount: number;
    extraSocketCount: number;
    spotlightCount: number;
    streetLightCount: number;
    acPrepCount: number;
    wetPointSplit: boolean;
    convectorCount: number;
    breezer80Count: number;
    breezer100Count: number;
    heatingSystem: 'none' | 'electric' | 'water';
    warmFloorArea: number;
    warmFloorThermostats: number;

    // Каркас
    moduleExtendCount: number;
    mouseMesh: boolean;
    extraInsulation: boolean;
    removePartition: boolean;
    extraPartitionLength: number;

    // Окна/Двери
    safeDoor: boolean;
    relocateDoor: boolean;
    panoramicTrapezoidCount: number;
    extraPanoramicSection: boolean;
    extraWindow1000x2000: number;
    extraWindow500x2000: number;
    extraWindow600x500: number;
    extraWindow1500x500: number;
    windowLamination: boolean;
    windowLaminationInside: boolean;
    extraInteriorDoorCount: number;

    // Внешняя отделка
    facadePlanken: boolean;
    gutterPlastic: boolean;
    gutterMetal: boolean;
    plinthPlankenArea: number;

    // Терраса / Крыльцо
    terraceCloseSideCount: number;
    porchCanopy: boolean;
    closedTerraceArea: number;
    openTerraceArea: number;
    railingsPlankenLength: number;
    railingsCrossLength: number;

    // Доп. услуги (конструктор по позициям)
    services: ServiceEntry[];

    // Фундамент и монтаж
    addFoundation: boolean;
    pileLength: '2500' | '3000' | '3500';
    addAssembly: boolean;

    // Доставка
    useDeliveryMap: boolean;
    deliveryAddress: string;
    deliveryDistance: number;
    deliveryPrice: number;

    // КП
    clientName: string;
    managerName: string;
    kpNumber: string;
    kpDate: string;
    discountPercent: number;
    markupAmount: number;
    customItems: CustomItem[];
}

export interface EstimateLineItem {
    name: string;
    quantity: number;
    unit: string;
    price: number;
    total: number;
}

export interface EstimateSection {
    name: string;
    items: EstimateLineItem[];
    total: number;
    passportItems?: string[];
    hideItems?: boolean;
}

export interface EstimateResult {
    sections: EstimateSection[];
    basePrice: number;
    optionsTotal: number;
    grandTotal: number;
}
