export const bg = {
  site: {
    name: "Clever Solution",
    tagline: "Your clever choice",
    description:
      "КЛЕВЪР СОЛЮШЪН ЕООД предлага професионално кухненско оборудване, решения за контрол на достъпа, опаковъчни материали и препарати за почистване и поддръжка.",
  },
  nav: {
    home: "Начало",
    about: "За нас",
    categories: "Категории",
    contact: "Контакти",
    menuOpen: "Отвори менюто",
    menuClose: "Затвори менюто",
    scrollToTop: "Към началото на страницата",
  },
  about: {
    title: "За нас",
    bg: {
      heading: "Кои сме ние?",
      p1: "КЛЕВЪР СОЛЮШЪН ЕООД е новосъздадена компания от доказани и опитни професионалисти, специализирана в сферата на оборудване на обекти и предприятия за обществено хранене, индустриални кухни и кетъринг. Продуктовото портфолио на компанията включва и разнообразни и функционални кухненски аксесоари, решения за контрол на достъпа, като почистващи препарати. Грижим си и за сигурния достъп до Вашите обекти и събития, като предлагаме киоск терминали и гривни, карти и аксесоари за контрол на достъпа.",
      p2: "С над двадесет години опит в сегмента, ние гарантираме високо качество, предлагайки надеждни продукти от водещи и доказани производители, фокусирайки се върху предоставянето на цялостни решения, съобразени с нуждите на нашите клиенти. Ние нямаме само клиенти, а изграждаме мрежа от доверени партньори и приятели!",
      p3: "Нашият ангажимент е да подобрим вашата оперативна ефективност с ноу-хау и чрез надеждни продукти и отлично клиентско обслужване!",
    },
    en: {
      heading: "Who we are?",
      p1: "CLEVER SOLUTION Ltd is a newly established business from proven and experienced professionals, specializing in industrial catering equipment, consumables and accessories, access control solutions, such as functional kitchen accessories, cleaning detergents, kiosks and access control wristbands, cards, and accessories.",
      p2: "With over two decades of experience in the segment, we ensure high-quality, offering products from leading and reliable manufacturers, focusing on providing comprehensive solutions, tailored to the needs of our clients. We do not have just customers, we gain a network from trusted partners and friends. Our commitment is to enhance your operational efficiency with know-how and through reliable products, and excellent customer service!",
    },
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
      description:
        "Професионално кухненско оборудване — конвектомати, фурни и аксесоари",
      slug: "kitchen",
      subcategories: [
        { name: "Конвектомати", slug: "combi-ovens" },
        { name: "Speed ovens", slug: "speed-ovens" },
        { name: "Автоматични фурни", slug: "ovens" },
        { name: "Sous-Vide", slug: "sous-vide" },
        { name: "Оборудване", slug: "equipment" },
      ],
    },
    security: {
      name: "Сигурност",
      description: "Решения за контрол на достъпа — терминали, карти и системи",
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
      description: "Препарати за почистване и поддръжка",
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
