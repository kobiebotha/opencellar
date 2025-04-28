export type StorageLocation = {
  id: string;
  user_id: number;
  name: string;
};

export type Bin = {
  id: string;
  storage_location_id: string;
  name: string;
};

export type Wine = {
  id: string;
  bin_id: string;
  count: number;
  name: string;
  vintage: number;
  drink_between: string;
};

export type DrinkReason = 'gifted' | 'missing' | 'drank from cellar' | 'sold';

export type DrinkLog = {
  id: string;
  wine_id: string;
  drank_at: string;
  reason: DrinkReason;
};