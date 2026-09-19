/** Local images for the hero DriftWall background (paths under /public). */

export const HERO_DRIFT_COLUMNS = 7;

/**
 * Base column roles for the drifting backdrop (repeated when fillViewport adds columns):
 * 0–3 kitchen equipment, 4 access-control wristbands, 5–6 additional catalogue photos.
 */
export const heroDriftColumnRoles = [
  "kitchen",
  "kitchen",
  "kitchen",
  "kitchen",
  "security",
  "packaging",
  "cleaning",
] as const;

type DriftItem = {
  image: string;
  title: string;
  column: number;
};

const kitchenPool: Omit<DriftItem, "column">[] = [
  { image: "/images/products/icp-xs/1.png", title: "iCombi PRO XS" },
  { image: "/images/products/icp-6-1-1/1.png", title: "iCombi PRO 6-11" },
  { image: "/images/products/icp-10-1-1/1.png", title: "iCombi PRO 10-11" },
  { image: "/images/products/icc-10-11e/1.png", title: "iCombi Classic" },
  { image: "/images/products/joker-mt-6-11/1.png", title: "JOKER MT" },
  { image: "/images/products/genius-mt-6-11e/1.png", title: "GENIUS MT" },
  { image: "/images/products/cook-master-6/1.jpeg", title: "COOK MASTER 6" },
  { image: "/images/products/ivario-pro-2-s/1.jpeg", title: "iVario PRO 2-S" },
  { image: "/images/products/ivario-pro-l/1.png", title: "iVario PRO L" },
  { image: "/images/products/w6h/1.png", title: "VISION NUVŌ" },
  { image: "/images/products/a70-1me/1.png", title: "Хладилен шкаф SMART" },
  { image: "/images/products/vc77fe/1.jpeg", title: "Domina PRO 700" },
  { image: "/images/products/wristbands/vinyl-classic/1.jpg", title: "Vinyl Classic" },
  { image: "/images/products/wristbands/plastic-superband/1.jpg", title: "Superband" },
  { image: "/images/products/wristbands/tyvek/1.jpg", title: "Tyvek" },
];

function assignColumns(pool: Omit<DriftItem, "column">[]): DriftItem[] {
  const items: DriftItem[] = [];
  const kitchenCols = [0, 1, 2, 3];
  const kitchen = pool.slice(0, 12);
  kitchen.forEach((item, i) => {
    items.push({ ...item, column: kitchenCols[i % kitchenCols.length] });
  });

  const placeholders = pool.slice(12);
  const otherCols = [4, 5, 6];
  otherCols.forEach((column, i) => {
    const primary = placeholders[i] ?? pool[i];
    const extra = pool[i + 3];
    items.push({ ...primary, column });
    if (extra) items.push({ ...extra, column });
  });

  return items;
}

export const heroDriftWallItems = assignColumns(kitchenPool);
