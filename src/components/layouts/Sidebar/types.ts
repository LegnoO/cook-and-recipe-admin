export interface INavSectionTitle {
  sectionTitle: string;
  action?: string;
  subject?: string;
}

export type INavLink = {
  icon?: string;
  path?: string;
  title: string;
  action?: string;
  subject?: string;
};

export interface INavGroup {
  icon?: string;
  title: string;
  action?: string;
  subject?: string;
  children?: (INavGroup | INavLink)[];
}

export type IVerticalNavItemsType = (INavLink | INavGroup | INavSectionTitle)[];
