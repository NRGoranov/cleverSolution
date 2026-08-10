/**
 * DEMO DATA — replace while transcribing. Grep for "Примерен".
 *
 * Images: local files under /public/images/products/<slug>/ only.
 */
import type { Product } from "./schema";

export const kitchenwareProducts: Product[] = [
  {
    slug: "sample-fryer-15l",
    name: "Примерен фритюрник 15 л — заменете",
    tagline: "Професионален двоен фритюрник за ресторантска кухня",
    description:
      "Демо запис: двоен фритюрник от неръждаема стомана с термостати и кошници. Заменете със реални данни при транскрибиране.",
    images: [
      {
        src: "/images/products/sample-fryer-15l/1.png",
        alt: "Професионален двоен фритюрник от неръждаема стомана с две кошници",
      },
    ],
    specs: [
      { label: "Капацитет", value: "15 л" },
      { label: "Мощност", value: "9 kW" },
      { label: "Материал", value: "Неръждаема стомана" },
    ],
    status: "published",
  },
  {
    slug: "sample-combi-oven",
    name: "Примерен конвектомат — заменете",
    tagline: "Комбинирана фурна с пара и конвекция",
    description:
      "Демо запис: конвектомат за печене, задушаване и регенерация. Заменете със реални данни при транскрибиране.",
    images: [
      {
        src: "/images/products/sample-combi-oven/1.png",
        alt: "Професионален конвектомат Rational с дигитален панел",
      },
    ],
    specs: [
      { label: "Нива", value: "10 GN 1/1" },
      { label: "Захранване", value: "400 V" },
      { label: "Управление", value: "Дигитален панел" },
    ],
    status: "published",
  },
  {
    slug: "sample-deck-oven",
    name: "Примерен подова фурна — заменете",
    tagline: "Пекарска фурна с четири камери",
    description:
      "Демо запис: подова/пекарска фурна с дигитално управление. Заменете със реални данни при транскрибиране.",
    images: [
      {
        src: "/images/products/sample-deck-oven/1.png",
        alt: "Професионална пекарска фурна с четири стъклени врати",
      },
    ],
    specs: [
      { label: "Камери", value: "4" },
      { label: "Температура", value: "до 300 °C" },
    ],
    status: "published",
  },
  {
    slug: "sample-gas-range",
    name: "Примерен газов котлон — заменете",
    tagline: "Газов котлон с десет горелки и двойна фурна",
    description:
      "Демо запис: професионален газов котлон с две фурни. Заменете със реални данни при транскрибиране.",
    images: [
      {
        src: "/images/products/sample-gas-range/1.png",
        alt: "Професионален газов котлон с десет горелки и двойна фурна",
      },
    ],
    specs: [
      { label: "Горелки", value: "10" },
      { label: "Фурни", value: "2" },
    ],
    status: "published",
  },
  {
    slug: "sample-range-griddle",
    name: "Примерен котлон с грил плоча — заменете",
    tagline: "Газов котлон с горелки и плоска грил плоча",
    description:
      "Демо запис: комбиниран котлон с грил плоча на колела. Заменете със реални данни при транскрибиране.",
    images: [
      {
        src: "/images/products/sample-range-griddle/1.png",
        alt: "Професионален газов котлон с грил плоча и червени регулатори",
      },
    ],
    specs: [
      { label: "Горелки", value: "6" },
      { label: "Плоча", value: "Грил / flat-top" },
    ],
    status: "published",
  },
  {
    slug: "sample-kitchen-line",
    name: "Примерна кухненска линия — заменете",
    tagline: "Професионална кухня с фритюрник и готварска линия",
    description:
      "Демо запис: визуализация на професионална кухненска линия. Заменете със реални данни при транскрибиране.",
    images: [
      {
        src: "/images/products/sample-kitchen-line/1.png",
        alt: "Професионална кухня с фритюрник и готварско оборудване",
      },
    ],
    specs: [
      { label: "Тип", value: "Кухненска линия" },
      { label: "Материал", value: "Неръждаема стомана" },
    ],
    status: "published",
  },
];
