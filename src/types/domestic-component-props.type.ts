export type RecipeDetailsContentProps = { id?: string };
export type ChatContentProps = { alias: string | null };
export type FoodDetailsContentProps = { id?: string };
export type BatchDetailsContentProps = { id?: string };
export type NewFoodData = {
  name: string;
  category: "FRUIT" | "VEGETABLE" | "DAIRY" | "GRAIN" | "MEAT" | "BEVERAGE";
  location: "Despensa" | "Geladeira" | "Freezer";
  quantity: number;
  unitOfMeasure:
    | "KILOGRAM"
    | "GRAM"
    | "LITER"
    | "MILLILITER"
    | "UNIT"
    | "DOZEN"
    | "PACKAGE";
  unitPrice: number;
  expiration: string;
};
export type AddFoodModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: NewFoodData) => Promise<void>;
};
export type FoodItemData = {
  id?: string;
  name: string;
  category: string;
  location: "Despensa" | "Geladeira" | "Freezer";
  quantity: string;
  expiration: string;
};
export type EditFoodModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: FoodItemData) => void | Promise<void>;
  initialData: FoodItemData;
};
export type EditFoodFormProps = Omit<EditFoodModalProps, "isOpen">;
export type InviteMemberData = {
  name: string;
  email: string;
  role: "Pode editar" | "Visualizar";
};
export type InviteMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: InviteMemberData) => Promise<void>;
  householdName?: string;
};
