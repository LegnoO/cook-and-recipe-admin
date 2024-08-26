export interface INavSectionTitle {
  sectionTitle: string;
  page: string;
  action: string;
}

export type INavLink = {
  icon?: string;
  path?: string;
  title: string;
  page: string;
  action: string;
};

export interface INavGroup {
  icon?: string;
  title: string;
  page: string;
  action: string;
  children?: (INavGroup | INavLink)[];
}

export type IVerticalNavItemsType = (INavLink | INavGroup | INavSectionTitle)[];
