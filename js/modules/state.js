export const appState = {
    currentPackage: null,
    selectedCharacters: [],
    selectedShows: [],
    selectedMasterClasses: [],
    selectedProducts: [],
    selectedAdditionalServices: [],
    maxCharacters: 0,
    maxShows: 0,
    maxMasterClasses: 0,
    basePrice: 0,
    visiblePhotosCount: 4
};

export function updateSelection(type, item) {
    const selectedArray = getSelectedArray(type);
    const index = selectedArray.findIndex(selected => selected.name === item.name);

    if (index === -1) {
        if (canSelectMore(type)) {
            selectedArray.push(item);
            dispatchSelectionUpdated();
            return true;
        }
        return false;
    } else {
        selectedArray.splice(index, 1);
        dispatchSelectionUpdated();
        return true;
    }
}

export function resetSelection() {
    appState.currentPackage = null;
    appState.selectedCharacters = [];
    appState.selectedShows = [];
    appState.selectedMasterClasses = [];
    appState.selectedProducts = [];
    appState.selectedAdditionalServices = [];
    dispatchSelectionUpdated();
}

export function calculateTotalPrice(state) {
    if (state.currentPackage === 'custom') {
        return calculateCustomPrice(state);
    }
    return calculatePackagePrice(state);
}

function calculateCustomPrice(state) {
    let total = 0;
    total += state.selectedCharacters.length * 5000;
    total += state.selectedShows.length * 8000;
    total += state.selectedMasterClasses.length * 5000;

    state.selectedProducts.forEach(prod => {
        if (prod.id === 'photo') total += 3000;
        else if (prod.id === 'decor') total += 2000;
        else if (prod.id === 'pinata') total += 3500;
    });

    state.selectedAdditionalServices.forEach(serv => {
        if (serv.id === 'photographer') total += 3000;
        else if (serv.id === 'pinata') total += 3500;
    });

    return total;
}

function calculatePackagePrice(state) {
    const basePrices = {
        basic: 10000,
        standard: 35000,
        premium: 55000
    };

    let total = basePrices[state.currentPackage] || 0;

    state.selectedProducts.forEach(p => total += p.price);
    state.selectedAdditionalServices.forEach(s => total += s.price);

    return total;
}

function getSelectedArray(type) {
    const arrays = {
        character: appState.selectedCharacters,
        show: appState.selectedShows,
        master: appState.selectedMasterClasses,
        product: appState.selectedProducts,
        additional: appState.selectedAdditionalServices
    };
    return arrays[type];
}

function canSelectMore(type) {
    const limits = {
        character: appState.maxCharacters,
        show: appState.maxShows,
        master: appState.maxMasterClasses
    };

    const selectedCount = getSelectedArray(type).length;
    return appState.currentPackage === 'custom' || selectedCount < limits[type];
}

function dispatchSelectionUpdated() {
    document.dispatchEvent(new CustomEvent('selectionUpdated'));
}