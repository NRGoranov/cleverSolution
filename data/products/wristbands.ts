/**
 * DEMO DATA — replace while transcribing. Grep for "Примерен".
 * No remote images — empty arrays show „Снимка предстои“ until you add local files.
 */
import type { Product } from "./schema";

export const wristbandsProducts: Product[] = [
  {
    slug: "sample-rfid-encoder",
    name: "Примерен RFID енкодер — заменете",
    tagline: "Машина за програмиране на RFID гривни",
    description:
      "Демо запис: настолен енкодер за запис на RFID чипове в all-inclusive гривни. Заменете със реални данни при транскрибиране.",
    images: [],
    specs: [
      { label: "Чип", value: "MIFARE Classic" },
      { label: "Интерфейс", value: "USB / Ethernet" },
    ],
    status: "published",
  },
  {
    slug: "sample-nfc-reader",
    name: "Примерен NFC четец — заменете",
    tagline: "Стационарен четец за NFC гривни",
    description:
      "Демо запис: NFC четец за cashless зони и входни точки. Заменете със реални данни при транскрибиране.",
    images: [],
    specs: [
      { label: "Стандарт", value: "ISO 14443" },
      { label: "Захранване", value: "5 V DC" },
    ],
    status: "published",
  },
  {
    slug: "sample-wristband-printer",
    name: "Примерен принтер за гривни — заменете",
    tagline: "Термопринтер за входни и VIP гривни",
    description:
      "Демо запис: индустриален принтер за печат на идентификационни гривни. Заменете със реални данни при транскрибиране.",
    images: [],
    specs: [
      { label: "Ширина", value: "до 50 mm" },
      { label: "Печат", value: "Термо трансфер" },
    ],
    status: "published",
  },
  {
    slug: "sample-access-gate",
    name: "Примерен четец за вход — заменете",
    tagline: "Входен терминал за RFID / NFC гривни",
    description:
      "Демо запис: терминал за валидация на гривни на входни точки. Заменете със реални данни при транскрибиране.",
    images: [],
    specs: [
      { label: "Режим", value: "Online / Offline" },
      { label: "Дисплей", value: "OLED" },
    ],
    status: "published",
  },
];
