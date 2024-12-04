export interface IDeal {
  description: string;
  id: number;
  imgSrc: string;
  isRatedByUser: boolean;
  isRedeemed: boolean;
  isFeatured: boolean;
  name: string;
  rating: number;
  recommendations: string;
  tags: {id: number; name: string};
  title: string;
  upgradeNeeded: boolean;
  url: string;
  value: string;
}
