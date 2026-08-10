/**
 * DEMO DATA — replace while transcribing. Grep for "Примерен".
 * No remote images — empty arrays show „Снимка предстои“ until you add local files.
 */
import type { Product } from "./schema";

export const vacuumsProducts: Product[] = [
  {
    slug: "sample-robot-vacuum",
    name: "Примерен робот прахосмукачка — заменете",
    tagline: "Самонасочващ се робот с картографиране",
    description:
      "Демо запис: робот с LiDAR, приложение и станция за зареждане. Заменете със реални данни при транскрибиране.",
    images: [],
    specs: [
      { label: "Навигация", value: "LiDAR" },
      { label: "Време на работа", value: "до 180 мин" },
      { label: "Резервоар", value: "0.4 л" },
    ],
    status: "published",
  },
  {
    slug: "sample-robot-mop",
    name: "Примерен робот с мокро почистване — заменете",
    tagline: "2-в-1 прахосмукачка и моп",
    description:
      "Демо запис: робот с вакуум и мокро почистване. Заменете със реални данни при транскрибиране.",
    images: [],
    specs: [
      { label: "Функции", value: "Вакуум + моп" },
      { label: "Шум", value: "58 dB" },
    ],
    status: "published",
  },
  {
    slug: "sample-stick-vacuum",
    name: "Примерна вертикална прахосмукачка — заменете",
    tagline: "Безжична stick прахосмукачка",
    description:
      "Демо запис: лека вертикална прахосмукачка за ежедневно почистване. Заменете със реални данни при транскрибиране.",
    images: [],
    specs: [
      { label: "Батерия", value: "до 45 мин" },
      { label: "Тегло", value: "2.8 kg" },
    ],
    status: "published",
  },
  {
    slug: "sample-docking-station",
    name: "Примерна докинг станция — заменете",
    tagline: "Станция за самоизпразване",
    description:
      "Демо запис: докинг станция с торба за автоматично изпразване. Заменете със реални данни при транскрибиране.",
    images: [],
    specs: [
      { label: "Капацитет торба", value: "2.5 л" },
      { label: "Съвместимост", value: "серия Robot X" },
    ],
    status: "published",
  },
  {
    slug: "sample-draft-only-e2e",
    name: "Примерен draft продукт — не публикуван",
    tagline: "Този запис остава draft за тест",
    description:
      "Демо draft запис — не се показва на сайта, докато status не стане published.",
    images: [],
    specs: [],
    status: "draft",
  },
];
