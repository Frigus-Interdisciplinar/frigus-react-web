import { z } from "zod";
import { nullableOptional as optional } from "./common.schema";

export const productResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  category: z.string(),
  storagePlace: z.string(),
  unitPrice: z.number(),
  unitOfMeasure: z.string(),
  brand: optional(z.string()),
  imageUrl: optional(z.string()),
  ownerGroupId: optional(z.string()),
});
export const stockProductResponseSchema = z.object({
  id: z.number().int(),
  productId: z.number().int(),
  stockId: z.number().int(),
  quantity: z.number().int(),
  initialQuantity: optional(z.number().int()),
  minimalQuantity: optional(z.number().int()),
  expireDate: z.string(),
  productStatus: optional(z.string()),
  category: z.string(),
  batch: optional(z.string()),
  product: optional(productResponseSchema),
});
export const stockMovementResponseSchema = z.object({
  id: z.number().int(),
  movementType: z.string(),
  quantity: z.number().int(),
  date: optional(z.string()),
  userId: optional(z.string()),
  observation: optional(z.string()),
  balanceAfter: optional(z.number().int()),
});
export const stockResponseSchema = z.object({
  id: z.number().int(),
  groupId: z.string(),
  name: z.string(),
});
export const inventoryContextResponseSchema = z.object({
  groupId: z.string(),
  stocks: z.array(stockResponseSchema),
});
export const groupContextResponseSchema = z.object({ groupId: z.string() });
export const stockSummaryResponseSchema = z.object({
  stockCount: z.number(),
  productCount: z.number(),
  itemCount: z.number(),
  pendingShoppingItems: z.number(),
  nearExpiration: z.array(stockProductResponseSchema),
  itemsByStoragePlace: z.record(z.string(), z.number()),
  consumedThisWeek: z.record(z.string(), z.number()),
});
export const notificationResponseSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  body: z.string(),
  readAt: z
    .string()
    .nullish()
    .transform((v) => v ?? null),
  createdAt: z.string(),
  groupId: optional(z.string()),
  referenceId: optional(z.string()),
});
export const notificationPageResponseSchema = z.object({
  content: z.array(notificationResponseSchema),
});
export const advertisementResponseSchema = z.object({
  id: z.string(),
  advertiserId: z.string(),
  advertiserName: z.string(),
  name: z.string(),
  productName: z.string(),
  category: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  destinationUrl: optional(z.string()),
  price: optional(z.number()),
  startDate: optional(z.string()),
  endDate: optional(z.string()),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "ARCHIVED"]),
  impressions: z.number(),
  clicks: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const advertisementPageResponseSchema = z.object({
  content: z.array(advertisementResponseSchema),
  totalElements: z.number(),
  totalPages: z.number(),
});
export const attachmentResponseSchema = z.object({
  id: z.number().int(),
  fileUrl: z.string(),
  fileName: optional(z.string()),
  mimeType: z.string(),
  fileSize: optional(z.number().int()),
  createdAt: optional(z.string()),
});
export const chatMessageResponseSchema = z.object({
  id: z.number().int(),
  conversationId: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  messageType: optional(z.string()),
  // An attachment-only message has null content in the database.
  content: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
  createdAt: optional(z.string()),
  attachments: optional(z.array(attachmentResponseSchema)),
  relatedShoppingListProductId: optional(z.number().int()),
});
export const conversationResponseSchema = z.object({
  id: z.string(),
  conversationType: z.string(),
  groupId: optional(z.string()),
  groupName: optional(z.string()),
  name: optional(z.string()),
  latestMessage: optional(chatMessageResponseSchema),
});
export const shoppingListProductResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  category: z.string(),
  unitOfMeasure: z.string(),
});
export const shoppingListItemResponseSchema = z.object({
  id: z.number().int(),
  product: shoppingListProductResponseSchema,
  quantity: z.number().int(),
  status: z.string(),
  purchasedUnitPrice: optional(z.number()),
});
export const shoppingListResponseSchema = z.object({
  id: z.string(),
  stockId: z.number().int(),
  name: z.string(),
  status: z.string(),
  items: z.array(shoppingListItemResponseSchema),
  date: optional(z.string()),
  supplier: optional(z.string()),
  total: optional(z.number()),
  completedAt: optional(z.string()),
});
export const shoppingListPageResponseSchema = z.object({
  content: z.array(z.object({ id: z.string(), status: z.string() })),
});
export const shoppingListSuggestionResponseSchema = z.object({
  product: shoppingListProductResponseSchema,
  currentQuantity: z.number(),
  suggestedQuantity: z.number(),
  reason: z.string(),
});
export const recipeIngredientResponseSchema = z.object({
  id: z.number(),
  productName: optional(z.string()),
  quantity: optional(z.number()),
  unit: optional(z.string()),
  required: optional(z.boolean()),
  inStock: optional(z.boolean()),
});
export const recipeResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: optional(z.string()),
  instructions: optional(z.string()),
  favorite: z.boolean(),
  ingredients: optional(z.array(recipeIngredientResponseSchema)),
});
export const recipeSummaryResponseSchema = recipeResponseSchema.pick({
  id: true,
  name: true,
  favorite: true,
  ingredients: true,
});
export const expenseResponseSchema = z.object({
  id: z.string(),
  description: z.string(),
  category: z.string(),
  amount: z.number(),
  expenseDate: z.string(),
  supplier: optional(z.string()),
});
export const discardResponseSchema = z.object({
  id: z.number(),
  stockProductId: z.number(),
  quantity: z.number(),
  reason: optional(z.string()),
  date: z.string(),
});
export const monthlyReportResponseSchema = z.object({
  month: z.string(),
  totalExpenses: z.number(),
  purchaseTotal: z.number(),
  completedPurchases: z.number(),
  expensesByCategory: z.record(z.string(), z.number()),
});
export const employeeResponseSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string(),
  memberRole: optional(z.enum(["OWNER", "EDITOR", "VIEWER"])),
  isOwner: optional(z.boolean()),
});
export const invitationResponseSchema = z.object({
  id: z.string(),
  name: optional(z.string()),
  email: z.string(),
  acceptedAt: optional(z.string()),
  revokedAt: optional(z.string()),
});
export const groupMemberResponseSchema = employeeResponseSchema.transform(
  (member) => ({
    ...member,
    role: member.isOwner ? "OWNER" : (member.memberRole ?? "VIEWER"),
  }),
);
export const groupResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  bannerPicture: optional(z.string()),
  membersCount: optional(z.number()),
  members: optional(z.array(groupMemberResponseSchema)),
});
export const transactionResponseSchema = z.object({
  id: z.string(),
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "APPROVED",
    "REJECTED",
    "CANCELED",
    "ERROR",
  ]),
  amount: optional(z.number().finite().nonnegative()),
  planCode: optional(z.string()),
});
export const authUserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  birthDate: optional(z.string()),
  profilePictureUrl: optional(z.string()),
  accountType: z.enum(["DOMESTIC", "COMMERCIAL", "BUSINESS"]),
  planSelectionRequired: z.boolean().default(false),
  pendingPlanTransactionId: optional(z.string().uuid()),
});
export const loginResponseSchema = z.object({ user: authUserResponseSchema });
export const registerResponseSchema = authUserResponseSchema;
export const groupIdentityResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
});
