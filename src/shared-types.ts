import {Nullable} from '@/extensions';

export type ProductApi = {
  'saturated-fat_100g': Nullable<number>;
  sugars_100g: Nullable<number>;
  salt_100g: Nullable<number>;
  additives_tags: Nullable<string[]>;
  nova_group: Nullable<number>;
  ecoscore_score: Nullable<number>;
  code: string;
  product_name_fr: string;
  brands: string;
  image_front_url: string;
  compared_to_category: string;
  categories_hierarchy: string[];
};

export type DefaultNavigationHandler = {
  navigate: (screenName: string) => void;
  goBack: () => void;
};

export type NavigationHandler<TProps> = {
  navigate: (screenName: string, props?: TProps) => void;
  push: (screenName: string, props: TProps) => void;
};

export type NavigationProductProps = {
  eanCode: string;
  isRelated: boolean;
  originProductEanCode: Nullable<string>;
};
