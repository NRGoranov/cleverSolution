export const bg = {
  site: {
    name: "CleverSolutions",
    tagline: "Подбрани продукти за дома и събития",
    description:
      "CleverSolutions представя внимателно подбрани продукти — кухненски принадлежности, системи за сигурност, гривни за събития и роботизирани прахосмукачки.",
  },
  nav: {
    home: "Начало",
    categories: "Категории",
    contact: "Контакти",
    menuOpen: "Отвори менюто",
    menuClose: "Затвори менюто",
    scrollToTop: "Към началото на страницата",
  },
  hero: {
    headline: "Подбрани решения за",
    headlineAccent: "вашия дом и събития",
    subheadline:
      "Разгледайте нашите категории продукти и се свържете с нас за повече информация и наличност.",
    cta: "Разгледайте категориите",
    contactCta: "Свържете се с нас",
  },
  categories: {
    sectionTitle: "Категории",
    sectionSubtitle: "Четири области, в които можем да ви помогнем",
    kitchenware: {
      name: "Кухня",
      description: "Кухненски принадлежности и аксесоари",
      slug: "kitchen",
      subcategories: [
        { name: "Фритюрници", slug: "fryers" },
        { name: "Фурни", slug: "ovens" },
        { name: "Конвектомати", slug: "combi-ovens" },
        { name: "Готварски плочи", slug: "cooktops" },
      ],
    },
    security: {
      name: "Сигурност",
      description: "Устройства и системи за домашна сигурност",
      slug: "security",
      subcategories: [
        { name: "Камери", slug: "cameras" },
        { name: "Аларми", slug: "alarms" },
        { name: "Сензори", slug: "sensors" },
        { name: "Контрол на достъп", slug: "access-control" },
      ],
    },
    wristbands: {
      name: "Гривни",
      description: "All-inclusive гривни за събития и курорти",
      slug: "wristbands",
      subcategories: [
        { name: "Събития", slug: "events" },
        { name: "Курорти", slug: "resorts" },
        { name: "Фестивали", slug: "festivals" },
        { name: "RFID / NFC", slug: "rfid" },
      ],
    },
    vacuums: {
      name: "Почистване",
      description: "Роботизирани прахосмукачки",
      slug: "vacuums",
      subcategories: [
        { name: "Роботи", slug: "robots" },
        { name: "Вертикални", slug: "stick" },
        { name: "Мокро почистване", slug: "wet-clean" },
        { name: "Аксесоари", slug: "accessories" },
      ],
    },
  },
  featured: {
    title: "Препоръчани продукти",
    subtitle: "Подбрани артикули от нашите категории",
    viewAll: "Вижте всички",
  },
  product: {
    contactForPrice: "Свържете се за цена",
    contactCta: "Свържете се за повече информация",
    detailsCta: "Детайли",
    specsTitle: "Характеристики",
    descriptionTitle: "Описание",
    priceLabel: "Цена",
    currency: "лв.",
    photoPending: "Снимка предстои",
    notFound: "Продуктът не е намерен",
    backToCategories: "Към категориите",
    externalBuy: "Вижте в магазина",
  },
  category: {
    comingSoon: "Очаквайте скоро",
    comingSoonDescription:
      "Работим по попълването на тази категория. Свържете се с нас, ако търсите конкретен продукт.",
    contactCta: "Свържете се с нас",
    productCount: (count: number) =>
      count === 1 ? "1 продукт" : `${count} продукта`,
  },
  contact: {
    title: "Контакти",
    subtitle: "Попълнете формата и ще се свържем с вас",
    form: {
      name: "Име",
      namePlaceholder: "Вашето име",
      email: "Имейл",
      emailPlaceholder: "email@example.com",
      phone: "Телефон",
      phonePlaceholder: "+359 ...",
      product: "Продукт",
      productPlaceholder: "За кой продукт питате?",
      message: "Съобщение",
      messagePlaceholder: "Как можем да ви помогнем?",
      submit: "Изпратете съобщението",
      submitting: "Изпращане...",
      success: "Благодарим ви! Съобщението е изпратено успешно.",
      error: "Възникна грешка. Моля, опитайте отново.",
    },
    info: {
      title: "Информация",
      email: "info@cleversolutions.bg",
      phone: "+359 888 000 000",
      address: "София, България",
      hours: "Пон–Пет: 9:00–18:00",
    },
  },
  home: {
    contactSection: {
      title: "Имате въпрос?",
      subtitle: "Свържете се с нас за информация и наличност.",
      cta: "Към контактите",
    },
  },
  footer: {
    rights: "Всички права запазени.",
    contact: "Контакти",
    madeBy: "Site was made by",
    makerName: "NRG",
    makerUrl: "https://nrgtrw.com",
  },
  // Testimonials section — plug back in when real content exists
  // testimonials: { ... },
} as const;

export type Content = typeof bg;
