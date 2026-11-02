const unitLabels: Record<string, string> = {
  KILOGRAM: "kg",
  GRAM: "g",
  LITER: "L",
  MILLILITER: "ml",
  UNIT: "un",
  DOZEN: "dúzia",
  PACKAGE: "pct",
};

export function formatUnitOfMeasure(unit?: string | null): string {
  const value = unit?.trim();
  if (!value) return "un";
  return unitLabels[value.toUpperCase()] ?? value;
}

const categoryLabels: Record<string, string> = {
  FRUIT: "Frutas",
  VEGETABLE: "Vegetais",
  DAIRY: "Laticínios",
  GRAIN: "Mercearia",
  MEAT: "Carnes",
  BEVERAGE: "Bebidas",
  CLEANING: "Limpeza",
  PERSONAL_HYGIENE: "Higiene pessoal",
  FISH: "Peixes",
  FROZEN: "Congelados",
  SWEETS: "Doces",
  CANNED: "Enlatados",
  SEASONING: "Temperos",
};

export function formatProductCategory(category?: string | null): string {
  const value = category?.trim();
  if (!value) return "Outros";
  return categoryLabels[value.toUpperCase()] ?? value;
}

const domesticStoragePlaceLabels: Record<string, string> = {
  PANTRY: "Despensa",
  CABINET: "Despensa",
  SHELF: "Despensa",
  FRIDGE: "Geladeira",
  FREEZER: "Freezer",
};

const commercialStoragePlaceLabels: Record<string, string> = {
  PANTRY: "Depósito",
  CABINET: "Depósito",
  SHELF: "Área de venda",
  FRIDGE: "Câmara fria",
  FREEZER: "Freezer",
};

export function formatStoragePlace(
  storagePlace?: string | null,
  accountType: "domestic" | "commercial" = "domestic",
): string {
  const value = storagePlace?.trim();
  if (!value) return "Estoque";
  const labels = accountType === "commercial"
    ? commercialStoragePlaceLabels
    : domesticStoragePlaceLabels;
  return labels[value.toUpperCase()] ?? value;
}
