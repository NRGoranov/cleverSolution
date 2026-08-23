/** Local images for the hero DriftWall background (paths under /public). */

export const HERO_DRIFT_COLUMNS = 7;

/**
 * Column roles for the drifting backdrop (7 columns):
 * 0–3 kitchen equipment, 4 access control, 5 packaging, 6 cleaning.
 * Partner photos will replace the placeholder kitchen shots in columns 4–6.
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
  { image: "/images/hero/1-fryer.png", title: "Фритюрник" },
  { image: "/images/hero/2-combi-oven.png", title: "Конвектомат" },
  { image: "/images/hero/3-deck-oven.png", title: "Пекарска фурна" },
  { image: "/images/products/sample-fryer-15l/1.png", title: "Фритюрник 15 л" },
  { image: "/images/products/sample-combi-oven/1.png", title: "Конвектомат" },
  { image: "/images/products/sample-deck-oven/1.png", title: "Подова фурна" },
  { image: "/images/products/sample-gas-range/1.png", title: "Газова плита" },
  { image: "/images/products/sample-kitchen-line/1.png", title: "Кухненска линия" },
  { image: "/images/products/sample-range-griddle/1.png", title: "Грил плита" },
  { image: "/347340190033198057.jpg", title: "Кухненско оборудване" },
  {
    image: encodeURI("/Bakery Convection Ovens.jpg"),
    title: "Пекарна фурна",
  },
  {
    image: encodeURI("/Black Diamond BDGR-60 60.jpg"),
    title: "Грил",
  },
  {
    image: encodeURI("/Friteuse a Gaz sur Meuble au Meilleur prix.jpg"),
    title: "Газов фритюрник",
  },
  {
    image: encodeURI("/MoTak MR10-RGB24-N-C-S 60.jpg"),
    title: "Хладилник",
  },
  {
    image: encodeURI(
      "/Overnight cooking in the Rational SelfCookingCenter whitefficiency.jpg"
    ),
    title: "Rational конвектомат",
  },
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
