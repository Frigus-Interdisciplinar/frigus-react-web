import * as advertisements from "@/services/advertisement.service";
import * as aiChat from "@/services/ai-chat.service";
import * as auth from "@/services/auth.service";
import * as chat from "@/services/chat.service";
import * as discards from "@/services/discard.service";
import * as employees from "@/services/employee.service";
import * as expenses from "@/services/expense.service";
import * as groups from "@/services/group.service";
import * as inventory from "@/services/inventory.service";
import * as notifications from "@/services/notification.service";
import * as plans from "@/services/plan.service";
import * as preferences from "@/services/preferences.service";
import * as profile from "@/services/profile.service";
import * as recipes from "@/services/recipe.service";
import * as shoppingLists from "@/services/shopping-list.service";
import * as transactions from "@/services/transaction.service";

const serviceOperations = {
  advertisements,
  aiChat,
  auth,
  chat,
  discards,
  employees,
  expenses,
  groups,
  inventory,
  notifications,
  plans,
  preferences,
  profile,
  recipes,
  shoppingLists,
  transactions,
};

export function useServiceOperations() {
  return serviceOperations;
}
