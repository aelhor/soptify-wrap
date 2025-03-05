export interface QueryFilter<
  Cursor,
  Where,
  OrderBy,
  Skip = any,
  Take = any,
  Select = any,
> {
  skip?: Skip;
  take?: Take;
  cursor?: Cursor;
  where?: Where;
  orderBy?: OrderBy;
  select?: Partial<Select>;
}

export interface OneQueryFilter<Where, Select, Include = any> {
  where: Where;
  select?: Select;
  include?: Partial<Include>;
}

export interface Count {
  count: number;
}
