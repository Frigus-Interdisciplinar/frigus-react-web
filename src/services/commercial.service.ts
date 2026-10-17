import { z } from "zod";
import { uuid, pageSchema, type Paging } from "@/schemas/api.schema";
import { request, query } from "./request";
export const expenseSchema=z.object({id:uuid,groupId:uuid,description:z.string(),category:z.string(),amount:z.number(),expenseDate:z.iso.date(),supplier:z.string().nullish(),shoppingListId:uuid.nullish(),createdBy:uuid});
export const advertisementSchema=z.object({id:uuid,advertiserId:uuid,advertiserName:z.string(),name:z.string(),productName:z.string(),category:z.string(),description:z.string(),imageUrl:z.url(),destinationUrl:z.url().nullish(),price:z.number().nullish(),startDate:z.iso.date().nullish(),endDate:z.iso.date().nullish(),status:z.enum(["DRAFT","ACTIVE","PAUSED","ARCHIVED"]),impressions:z.number().int(),clicks:z.number().int(),createdAt:z.iso.datetime({offset:true})});
const adInputSchema=advertisementSchema.pick({name:true,productName:true,category:true,description:true,imageUrl:true}).extend({destinationUrl:z.url().optional(),price:z.number().nonnegative().optional(),startDate:z.iso.date().optional(),endDate:z.iso.date().optional()});
const expenseInputSchema=z.object({description:z.string().min(1).max(255),category:z.string().min(1).max(120),amount:z.number().positive(),expenseDate:z.iso.date(),supplier:z.string().max(255).optional()});
export const commercialService={
 expenses:(groupId:string,paging?:Paging)=>request(pageSchema(expenseSchema),`/web/core/commercial/groups/${uuid.parse(groupId)}/expenses`,`GET`,undefined,query(paging)),
 createExpense:(groupId:string,data:z.input<typeof expenseInputSchema>)=>request(expenseSchema,`/web/core/commercial/groups/${uuid.parse(groupId)}/expenses`,`POST`,expenseInputSchema.parse(data)),
 monthlyReport:(groupId:string,month:string)=>request(z.record(z.string(),z.unknown()),`/web/core/commercial/groups/${uuid.parse(groupId)}/reports/monthly`,`GET`,undefined,{params:{month:z.string().regex(/^\d{4}-\d{2}$/).parse(month)}}),
 employees:(groupId:string)=>request(z.array(z.record(z.string(),z.unknown())),`/web/core/commercial/groups/${uuid.parse(groupId)}/employees`),
 inviteEmployee:(groupId:string,email:string,name:string,memberRole:"OWNER"|"EDITOR"|"VIEWER")=>request(z.unknown(),`/web/core/commercial/groups/${uuid.parse(groupId)}/employees/invitations`,`POST`,{email:z.email().parse(email),name:name||undefined,memberRole}),
 advertisements:(paging?:Paging)=>request(pageSchema(advertisementSchema),"/web/core/advertisements/mine","GET",undefined,query(paging)),
 createAdvertisement:(data:z.input<typeof adInputSchema>)=>request(advertisementSchema,"/web/core/advertisements","POST",adInputSchema.parse(data)),
 updateAdvertisement:(id:string,data:z.input<typeof adInputSchema>)=>request(advertisementSchema,`/web/core/advertisements/${uuid.parse(id)}`,"PUT",adInputSchema.parse(data)),
 setAdvertisementStatus:(id:string,status:"ACTIVE"|"PAUSED"|"ARCHIVED")=>request(advertisementSchema,`/web/core/advertisements/${uuid.parse(id)}/status`,`PATCH`,{status}),
};
