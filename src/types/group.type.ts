export interface GroupMemberDto {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export interface GroupDto {
  id: string;
  name: string;
  membersCount?: number;
  members?: GroupMemberDto[];
}
