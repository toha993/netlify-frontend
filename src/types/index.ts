export interface User {
  id: string;
  userAgent: string;
}

export interface Vote {
  id: string;
  user_id: string;
  item_id: string;
  category_id: string;
}

export interface Item {
  id: string;
  img?: string;
  name: string;
  category_id: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ItemWithVotes extends Item {
  voteCount: number;
}

export interface CategoryWithVoteCount extends Category {
  itemCount: number;
  voteCount: number;
  items: ItemWithVotes[];
}
