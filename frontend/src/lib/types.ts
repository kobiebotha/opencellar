export type StorageLocation = {
  id: string;
  user_id: number;
  name: string;
};

export type Bin = {
  id: string;
  storage_location_id: string;
  name: string;
  storage_locations: { // Added to include storage location details
    name: string;
  } | null; // It could be null if a bin somehow doesn't have a storage location or if the join fails
};

export type Wine = {
  id: string;
  bin_id: string;
  count: number;
  name: string;
  vintage: number;
  drink_between: string;
};

export type DrinkReason = 'gifted' | 'missing' | 'drank from cellar';

export type DrinkLog = {
  id: string;
  wine_id: string;
  drank_at: string;
  reason: DrinkReason;
};