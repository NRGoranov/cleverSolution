/**
 * DEMO DATA — replace while transcribing. Grep for "Примерен".
 * No remote images — empty arrays show „Снимка предстои“ until you add local files.
 */
import type { Product } from "./schema";

export const securityProducts: Product[] = [
  {
    slug: "sample-ip-camera",
    name: "Примерна IP камера — заменете",
    tagline: "Външна камера с нощно виждане",
    description:
      "Демо запис: IP камера за двор и вход с Full HD и IR. Заменете със реални данни при транскрибиране.",
    images: [],
    specs: [
      { label: "Резолюция", value: "1080p" },
      { label: "Захранване", value: "PoE" },
      { label: "Защита", value: "IP66" },
    ],
    status: "published",
  },
  {
    slug: "sample-alarm-panel",
    name: "Примерен алармен панел — заменете",
    tagline: "Централа за безжична алармена система",
    description:
      "Демо запис: алармена централа със сензори за врата и PIR. Заменете със реални данни при транскрибиране.",
    images: [],
    specs: [
      { label: "Сензори", value: "6 бр." },
      { label: "Свързаност", value: "Wi‑Fi / GSM" },
    ],
    status: "published",
  },
  {
    slug: "sample-motion-sensor",
    name: "Примерен сензор за движение — заменете",
    tagline: "PIR сензор с регулируем обхват",
    description:
      "Демо запис: сензор за движение за интериор. Заменете със реални данни при транскрибиране.",
    images: [],
    specs: [
      { label: "Обхват", value: "до 12 m" },
      { label: "Ъгъл", value: "110°" },
    ],
    status: "published",
  },
  {
    slug: "sample-access-reader",
    name: "Примерен контрол на достъп — заменете",
    tagline: "Картов четец с електромагнитен ключ",
    description:
      "Демо запис: система за контрол на достъп за офис вход. Заменете със реални данни при транскрибиране.",
    images: [],
    specs: [
      { label: "Интерфейс", value: "Wiegand" },
      { label: "Потребители", value: "до 1000" },
    ],
    status: "published",
  },
];
