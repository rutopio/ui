// A flat outline entry shared by the side dropdown and the mobile drawer.
export interface OutlineItem {
  id: string;
  label: string;
  href: string; // "#id"
  depth: 2 | 3;
}

