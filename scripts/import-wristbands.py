"""Import all-inclusive wristband products from the website scheme and Word docs."""

from __future__ import annotations

import json
import re
import unicodedata
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "docs" / "onedrive-sep2026"
OUT_TS = ROOT / "data" / "products" / "wristbands.ts"
OUT_JSON = ROOT / "data" / "products" / "wristbands-import.json"
IMAGES_ROOT = ROOT / "public" / "images" / "products" / "wristbands"

SKIP_MEDIA_SIZES = {
    2131188,  # repeated banner TIF across docs
    47486,
    33104,
    9590,
    30637,
    26437,
    7672,
    39379,
    44563,
    46550,
    46483,
}
MIN_MEDIA_BYTES = 55_000
MAX_IMAGES_PER_FAMILY = 3

CYRILLIC_MAP = {
    "а": "a",
    "б": "b",
    "в": "v",
    "г": "g",
    "д": "d",
    "е": "e",
    "ж": "zh",
    "з": "z",
    "и": "i",
    "й": "y",
    "к": "k",
    "л": "l",
    "м": "m",
    "н": "n",
    "о": "o",
    "п": "p",
    "р": "r",
    "с": "s",
    "т": "t",
    "у": "u",
    "ф": "f",
    "х": "h",
    "ц": "ts",
    "ч": "ch",
    "ш": "sh",
    "щ": "sht",
    "ъ": "a",
    "ь": "",
    "ю": "yu",
    "я": "ya",
}


def slugify(text: str) -> str:
    text = text.strip().lower()
    out: list[str] = []
    for ch in text:
        if ch in CYRILLIC_MAP:
            out.append(CYRILLIC_MAP[ch])
            continue
        norm = unicodedata.normalize("NFKD", ch)
        norm = norm.encode("ascii", "ignore").decode("ascii")
        if norm:
            out.append(norm.lower())
    slug = re.sub(r"[^a-z0-9]+", "-", "".join(out)).strip("-")
    return re.sub(r"-{2,}", "-", slug)[:80] or "product"


def ts_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


# Catalogue from Web site scheme.xlsx, with copy from the matching Word docs.
PRODUCTS: list[dict] = [
    # --- Vinyl ---
    {
        "name": "Vinyl Classic® Narrow 430P",
        "subcategory": "vinyl",
        "tagline": "Винилови гривни · 14 мм",
        "family": "vinyl-classic",
        "description": "Гривните Vinyl Classic® Narrow 430P са направени от многослоен винил в живи цветове и ширина само 14 мм. Долният бял слой придава плътност на цвета. Подходящи за мултидневно използване в хотели, аквапаркове, фестивали и нощни заведения.",
        "specs": [
            {"label": "Материал", "value": "Многослоен винил"},
            {"label": "Ширина", "value": "14 мм"},
            {"label": "Серия", "value": "Vinyl Classic®"},
        ],
    },
    {
        "name": "Vinyl Classic® Medium VSP",
        "subcategory": "vinyl",
        "tagline": "Винилови гривни · 19 мм",
        "family": "vinyl-classic",
        "description": "Vinyl Classic® Medium VSP са многослойни винилови гривни с ярки цветове и ширина 19 мм. VIP®Band закопчаването ги прави практически непрехвърляеми. Подходящи за all-inclusive обекти, курорти и няколкодневни събития.",
        "specs": [
            {"label": "Материал", "value": "Многослоен винил"},
            {"label": "Ширина", "value": "19 мм"},
            {"label": "Модел", "value": "VSP"},
        ],
    },
    {
        "name": "Vinyl Classic® фосфоресциращи 430G",
        "subcategory": "vinyl",
        "tagline": "Светещи винилови гривни",
        "family": "vinyl-classic",
        "description": "Фосфоресциращи Vinyl Classic® гривни 430G за идентификация при ниска осветеност — нощни заведения, фестивали и вечерни зони в курорти. Запазват здравината и комфорта на класическия винил.",
        "specs": [
            {"label": "Материал", "value": "Многослоен винил"},
            {"label": "Модел", "value": "430G"},
            {"label": "Ефект", "value": "Фосфоресциращ"},
        ],
    },
    {
        "name": "Vinyl Classic® Wide 420P",
        "subcategory": "vinyl",
        "tagline": "Винилови гривни с широка печатна зона",
        "family": "vinyl-classic",
        "description": "Vinyl Classic® Wide 420P са многослойни винилови гривни в широка цветова гама. Началната зона е 25 мм за повече свобода при брандиране, след което гривната се стеснява за комфорт на китката.",
        "specs": [
            {"label": "Материал", "value": "Многослоен винил"},
            {"label": "Ширина на печата", "value": "25 мм"},
            {"label": "Модел", "value": "420P"},
        ],
    },
    {
        "name": "Vinyl Wrist-Rider® Wristicket®",
        "subcategory": "vinyl",
        "tagline": "Винил с отделяеми билети",
        "family": "vinyl-classic",
        "description": "Wrist-Rider® Wristicket® се произвеждат от многослоен винил с допълнителни лесно отделяеми секции в основата. Секциите служат като куверт за храна, напитки, атракциони или наем на екипировка. Предлагат се варианти 3TSP, 4TSP и 5TSP.",
        "specs": [
            {"label": "Материал", "value": "Многослоен винил"},
            {"label": "Варианти", "value": "3TSP / 4TSP / 5TSP"},
            {"label": "Цветове", "value": "6 стандартни"},
        ],
    },
    {
        "name": "Vinyl ClearImage® VIP®Band",
        "subcategory": "vinyl",
        "tagline": "Полупрозрачен винил",
        "family": "vinyl-clearimage",
        "description": "ClearImage® VIP®Band са направени от многослоен полупрозрачен винил с уникално оцветяване. Подходящи за мултидневна идентификация в хотели, аквапаркове и събития, където визията на гривната е част от бранда.",
        "specs": [
            {"label": "Материал", "value": "Полупрозрачен винил"},
            {"label": "Серия", "value": "ClearImage® VIP®Band"},
        ],
    },
    {
        "name": "Vinyl ClearImage® Narrow 130P",
        "subcategory": "vinyl",
        "tagline": "Полупрозрачен винил · 14 мм",
        "family": "vinyl-clearimage",
        "description": "ClearImage® Narrow 130P са полупрозрачни винилови гривни с ширина 14 мм и характерна палитра. Леки, устойчиви и подходящи за няколкодневен all-inclusive достъп.",
        "specs": [
            {"label": "Материал", "value": "Полупрозрачен винил"},
            {"label": "Ширина", "value": "14 мм"},
            {"label": "Модел", "value": "130P"},
        ],
    },
    {
        "name": "Vinyl ClearImage® Medium VCP",
        "subcategory": "vinyl",
        "tagline": "Полупрозрачен винил · 19 мм",
        "family": "vinyl-clearimage",
        "description": "ClearImage® Medium VCP са полупрозрачни винилови гривни с ширина 19 мм. Предлагат се с метална закопчалка за еднократно или многократно закопчаване.",
        "specs": [
            {"label": "Материал", "value": "Полупрозрачен винил"},
            {"label": "Ширина", "value": "19 мм"},
            {"label": "Модел", "value": "VCP"},
        ],
    },
    # --- Plastic ---
    {
        "name": "Superband® VIP®Band",
        "subcategory": "plastic",
        "tagline": "Трислойна пластмаса",
        "family": "plastic-superband",
        "description": "Superband® VIP®Band са направени от трислойна пластмаса за максимална здравина. Устойчиви са, но нежни към кожата, с богат избор от цветове. Системата за затваряне не позволява предаване от човек на човек — гривната се сваля само чрез срязване.",
        "specs": [
            {"label": "Материал", "value": "Трислойна пластмаса"},
            {"label": "Серия", "value": "Superband® VIP®Band"},
            {"label": "Цветове", "value": "21"},
        ],
    },
    {
        "name": "Superband® Narrow 460P",
        "subcategory": "plastic",
        "tagline": "Пластмасови гривни · 14 мм",
        "family": "plastic-superband",
        "description": "Superband® Narrow 460P са от изключително здрава трислойна пластмаса с ширина 14 мм. Имат отделяемо удължение 77 мм, което може да се използва за томболи, куверти или промоции.",
        "specs": [
            {"label": "Материал", "value": "Трислойна пластмаса"},
            {"label": "Ширина", "value": "14 мм"},
            {"label": "Отрязък", "value": "77 мм"},
        ],
    },
    {
        "name": "Superband® Medium 400P",
        "subcategory": "plastic",
        "tagline": "Пластмасови гривни · 19 мм",
        "family": "plastic-superband",
        "description": "Superband® Medium 400P са трислойни пластмасови гривни в ярки цветове и ширина 19 мм. Леки, водоустойчиви и подходящи за неколкодневни събития дори в екстремни условия.",
        "specs": [
            {"label": "Материал", "value": "Трислойна пластмаса"},
            {"label": "Ширина", "value": "19 мм"},
            {"label": "Модел", "value": "400P"},
        ],
    },
    {
        "name": "Superband® Wide 470P",
        "subcategory": "plastic",
        "tagline": "Пластмасови гривни с широка зона за печат",
        "family": "plastic-superband",
        "description": "Superband® Wide 470P са трислойни пластмасови гривни в 21 ярки цвята. Началната зона е 25 мм за брандиране, след което ширината се редуцира за комфорт.",
        "specs": [
            {"label": "Материал", "value": "Трислойна пластмаса"},
            {"label": "Ширина на печата", "value": "25 мм"},
            {"label": "Модел", "value": "470P"},
        ],
    },
    {
        "name": "SureImage® Narrow 460S",
        "subcategory": "plastic",
        "tagline": "Пълноцветен печат · 14 мм",
        "family": "plastic-sureimage",
        "description": "SureImage® Narrow 460S са здрави пластмасови гривни с ширина 14 мм и отделяемо удължение 77 мм. По цялата дължина може да се отпечата пълноцветно фотоизображение — лого, спонсори или снимка на събитието.",
        "specs": [
            {"label": "Материал", "value": "Пластмаса"},
            {"label": "Ширина", "value": "14 мм"},
            {"label": "Печат", "value": "Пълноцветно фотоизображение"},
        ],
    },
    {
        "name": "SureImage® Medium 400S",
        "subcategory": "plastic",
        "tagline": "Пълноцветен печат · 19 мм",
        "family": "plastic-sureimage",
        "description": "SureImage® Medium 400S съчетават здравина, комфорт и ширина 19 мм за пълноцветно фотоизображение по цялата гривна. Подходящи за фестивали, курорти и брандирани all-inclusive програми.",
        "specs": [
            {"label": "Материал", "value": "Пластмаса"},
            {"label": "Ширина", "value": "19 мм"},
            {"label": "Печат", "value": "Пълноцветно фотоизображение"},
        ],
    },
    {
        "name": "SureImage® Wide 470S",
        "subcategory": "plastic",
        "tagline": "Пълноцветен печат с широка зона",
        "family": "plastic-sureimage",
        "description": "SureImage® Wide 470S са здрави пластмасови гривни с начална зона 25 мм за по-голяма презентационна площ, която след това се стеснява до 14 мм. Пълноцветен печат по цялата дължина.",
        "specs": [
            {"label": "Материал", "value": "Пластмаса"},
            {"label": "Ширина на печата", "value": "25 мм"},
            {"label": "Печат", "value": "Пълноцветно фотоизображение"},
        ],
    },
    {
        "name": "SureImage® Big 450S",
        "subcategory": "plastic",
        "tagline": "Пълноцветен печат · голям формат",
        "family": "plastic-sureimage",
        "description": "SureImage® Big 450S е големият формат в серията за пълноцветно фотоизображение върху здрава пластмаса. Максимална видимост на бранда при фестивали, паркове и курорти.",
        "specs": [
            {"label": "Материал", "value": "Пластмаса"},
            {"label": "Модел", "value": "450S"},
            {"label": "Печат", "value": "Пълноцветно фотоизображение"},
        ],
    },
    {
        "name": "SureImage® Ident-A-Kids 410S",
        "subcategory": "plastic",
        "tagline": "Детска идентификация",
        "family": "plastic-sureimage",
        "description": "SureImage® Ident-A-Kids 410S е формат за идентификация на деца в курорти, аквапаркове и големи събития. Пълноцветен печат позволява име, телефон на родителя или бранда на обекта.",
        "specs": [
            {"label": "Материал", "value": "Пластмаса"},
            {"label": "Модел", "value": "410S"},
            {"label": "Предназначение", "value": "Детска идентификация"},
        ],
    },
    {
        "name": "Liquide Glitter® 4480",
        "subcategory": "plastic",
        "tagline": "Холограмни гривни",
        "family": "plastic-holographic",
        "description": "Холограмни пластмасови гривни Liquide Glitter® 4480 с блестящ ефект. Висока видимост за VIP зони, партита и брандирани събития, при здравината на многослойната пластмаса.",
        "specs": [
            {"label": "Материал", "value": "Холограмна пластмаса"},
            {"label": "Модел", "value": "4480"},
            {"label": "Ефект", "value": "Liquide Glitter®"},
        ],
    },
    {
        "name": "Confetti 4800",
        "subcategory": "plastic",
        "tagline": "Холограмни гривни",
        "family": "plastic-holographic",
        "description": "Холограмни гривни Confetti 4800 с конфетен ефект. Подходящи за фестивали, клубове и тематични вечери, където идентификацията трябва да се отличава отдалеч.",
        "specs": [
            {"label": "Материал", "value": "Холограмна пластмаса"},
            {"label": "Модел", "value": "4800"},
            {"label": "Ефект", "value": "Confetti"},
        ],
    },
    {
        "name": "Stars 4830",
        "subcategory": "plastic",
        "tagline": "Холограмни гривни",
        "family": "plastic-holographic",
        "description": "Холограмни гривни Stars 4830 със звезден мотив. Използват се за VIP достъп, партита и събития с визуално отличителна идентификация.",
        "specs": [
            {"label": "Материал", "value": "Холограмна пластмаса"},
            {"label": "Модел", "value": "4830"},
            {"label": "Ефект", "value": "Stars"},
        ],
    },
    {
        "name": "Rain 4840",
        "subcategory": "plastic",
        "tagline": "Холограмни гривни",
        "family": "plastic-holographic",
        "description": "Холограмни гривни Rain 4840 с дъждовен холографски ефект. Здрава пластмаса за неколкодневна употреба и висока устойчивост на фалшификация.",
        "specs": [
            {"label": "Материал", "value": "Холограмна пластмаса"},
            {"label": "Модел", "value": "4840"},
            {"label": "Ефект", "value": "Rain"},
        ],
    },
    {
        "name": "Kaleidoscope® 480P",
        "subcategory": "plastic",
        "tagline": "Холограмни гривни",
        "family": "plastic-holographic",
        "description": "Kaleidoscope® 480P са холограмни пластмасови гривни с калейдоскопен ефект. Подходящи за фестивали и клубове, където гривната е едновременно билет и визуален акцент.",
        "specs": [
            {"label": "Материал", "value": "Холограмна пластмаса"},
            {"label": "Модел", "value": "480P"},
            {"label": "Ефект", "value": "Kaleidoscope®"},
        ],
    },
    # --- Silicone (scheme heading + RFID/barcode lines) ---
    {
        "name": "Гривни Smart® silicone",
        "subcategory": "silicone",
        "tagline": "Силикон с RFID",
        "family": "silicone",
        "description": "Силиконови гривни Smart® за многократна употреба с възможност за RFID чип. Комфортни, с дълъг живот и релефен печат — подходящи за курорти, клубове и кампании, където гривната остава като сувенир.",
        "specs": [
            {"label": "Материал", "value": "Силикон"},
            {"label": "Чип", "value": "RFID / Smart®"},
            {"label": "Употреба", "value": "Многократна"},
        ],
    },
    {
        "name": "QR Code silicone",
        "subcategory": "silicone",
        "tagline": "Силикон с QR код",
        "family": "silicone",
        "description": "Силиконови гривни с QR код за бърза идентификация и връзка към профил, билет или cashless система. Издръжливи и удобни за дълъг престой в курорт или многодневно събитие.",
        "specs": [
            {"label": "Материал", "value": "Силикон"},
            {"label": "Код", "value": "QR"},
        ],
    },
    # --- Textile (scheme heading + models from Textile bands_info.docx) ---
    {
        "name": "Textile VIP®Bands Woven",
        "subcategory": "textile",
        "tagline": "Тъкан текстил до 8 цвята",
        "family": "textile",
        "description": "Моделите Woven VIP®Band са от смес найлон и памук и се персонализират в до 8 цвята. Прецизното тъкане възпроизвежда лога и детайли; често се пазят като сувенир след събитието.",
        "specs": [
            {"label": "Материал", "value": "Тъкан текстил (найлон/памук)"},
            {"label": "Цветове", "value": "до 8"},
            {"label": "Серия", "value": "Textile VIP®Bands"},
        ],
    },
    {
        "name": "Textile VIP®Bands Satin",
        "subcategory": "textile",
        "tagline": "Сатен със сублимационен печат",
        "family": "textile",
        "description": "Satin VIP®Band възпроизвеждат фотоизображения с висока острота чрез сублимационен печат. Подходящи за фестивали и брандирани събития, при които гривната остава като колекционерски сувенир.",
        "specs": [
            {"label": "Материал", "value": "Сатен"},
            {"label": "Печат", "value": "Сублимация"},
            {"label": "Серия", "value": "Textile VIP®Bands"},
        ],
    },
    {
        "name": "Textile модел Nice",
        "subcategory": "textile",
        "tagline": "Еднократни текстилни гривни",
        "family": "textile",
        "description": "Модел Nice се изработва от тъкан текстил или сатен, размер 26×1,5 см, с кръгла пластмасова клип закопчалка. Предлага се възможност за втъкаване на сериен номер. Разфасовка по 100 бр.",
        "specs": [
            {"label": "Размер", "value": "26 × 1,5 см"},
            {"label": "Закопчалка", "value": "Кръгъл пластмасов клип"},
            {"label": "Материал", "value": "Тъкан текстил или сатен"},
        ],
    },
    {
        "name": "Textile модел Lagos",
        "subcategory": "textile",
        "tagline": "Еднократни текстилни гривни",
        "family": "textile",
        "description": "Модел Lagos — тъкан текстил или сатен, 26×1,5 см, с триъгълна пластмасова клип закопчалка. За фестивали, клубове и еднодневни събития.",
        "specs": [
            {"label": "Размер", "value": "26 × 1,5 см"},
            {"label": "Закопчалка", "value": "Триъгълен пластмасов клип"},
        ],
    },
    {
        "name": "Textile модел Miami",
        "subcategory": "textile",
        "tagline": "Еднократни текстилни гривни",
        "family": "textile",
        "description": "Модел Miami с квадратна пластмасова клип закопчалка. Текстилна гривна за събития, която гостите често запазват като сувенир.",
        "specs": [
            {"label": "Закопчалка", "value": "Квадратен пластмасов клип"},
            {"label": "Серия", "value": "Textile VIP®Bands"},
        ],
    },
    {
        "name": "Textile модел Tenerife",
        "subcategory": "textile",
        "tagline": "Еднократни текстилни гривни",
        "family": "textile",
        "description": "Модел Tenerife се изработва само от тъкан текстил с тънка кръгла пластмасова клип закопчалка.",
        "specs": [
            {"label": "Материал", "value": "Тъкан текстил"},
            {"label": "Закопчалка", "value": "Тънък кръгъл клип"},
        ],
    },
    {
        "name": "Textile модел Ibiza",
        "subcategory": "textile",
        "tagline": "Еднократни текстилни гривни",
        "family": "textile",
        "description": "Модел Ibiza — само тъкан текстил, размер 35×1 см, с пластмасова приплъзваща закопчалка със сърцевидна форма.",
        "specs": [
            {"label": "Размер", "value": "35 × 1 см"},
            {"label": "Закопчалка", "value": "Приплъзваща, сърцевидна"},
            {"label": "Материал", "value": "Тъкан текстил"},
        ],
    },
    {
        "name": "Textile модел Woodstock",
        "subcategory": "textile",
        "tagline": "Еднократни текстилни гривни",
        "family": "textile",
        "description": "Модел Woodstock от тъкан текстил или сатен, 35×1,5 см, с пластмасова приплъзваща закопчалка.",
        "specs": [
            {"label": "Размер", "value": "35 × 1,5 см"},
            {"label": "Закопчалка", "value": "Пластмасова приплъзваща"},
        ],
    },
    {
        "name": "Textile модел Barcelona",
        "subcategory": "textile",
        "tagline": "Еднократни текстилни гривни",
        "family": "textile",
        "description": "Модел Barcelona, размер 35×1,4 см, с плоска пластмасова приплъзваща закопчалка.",
        "specs": [
            {"label": "Размер", "value": "35 × 1,4 см"},
            {"label": "Закопчалка", "value": "Плоска приплъзваща"},
        ],
    },
    {
        "name": "Textile модел Honolulu",
        "subcategory": "textile",
        "tagline": "Еднократни текстилни гривни",
        "family": "textile",
        "description": "Модел Honolulu с плоска метална закопчалка. За фиксиране се използват клещи.",
        "specs": [
            {"label": "Закопчалка", "value": "Плоска метална (с клещи)"},
            {"label": "Серия", "value": "Textile VIP®Bands"},
        ],
    },
    {
        "name": "Textile модел Las Vegas",
        "subcategory": "textile",
        "tagline": "Многократни текстилни гривни",
        "family": "textile",
        "description": "Модел Las Vegas с метална приплъзваща закопчалка за многократна употреба — за клубове, курорти и членски програми.",
        "specs": [
            {"label": "Закопчалка", "value": "Метална приплъзваща"},
            {"label": "Употреба", "value": "Многократна"},
        ],
    },
    # --- Tyvek ---
    {
        "name": "Sheeted Tyvek® TENS",
        "subcategory": "tyvek",
        "tagline": "Tyvek® Classic",
        "family": "tyvek",
        "description": "Sheeted Tyvek® TENS са икономични гривни от рециклируем материал DuPont Tyvek®. Надеждни и удобни за еднодневни събития, клубове и възрастова идентификация.",
        "specs": [
            {"label": "Материал", "value": "Tyvek®"},
            {"label": "Модел", "value": "TENS"},
            {"label": "Серия", "value": "Tyvek® Classic"},
        ],
    },
    {
        "name": "Sheeted Tyvek® TENS Jr.",
        "subcategory": "tyvek",
        "tagline": "Tyvek® Classic",
        "family": "tyvek",
        "description": "По-тесният формат TENS Jr. от Tyvek® Classic — за еднодневни събития и детски зони, с пълна гама възможности за персонализация.",
        "specs": [
            {"label": "Материал", "value": "Tyvek®"},
            {"label": "Модел", "value": "TENS Jr."},
        ],
    },
    {
        "name": "Securband® 2008",
        "subcategory": "tyvek",
        "tagline": "Tyvek® Classic",
        "family": "tyvek",
        "description": "Securband® 2008 е класическа Tyvek® гривна за еднодневна идентификация с надеждно залепване и богата цветова гама.",
        "specs": [
            {"label": "Материал", "value": "Tyvek®"},
            {"label": "Модел", "value": "2008"},
            {"label": "Серия", "value": "Securband®"},
        ],
    },
    {
        "name": "Securband® 2025",
        "subcategory": "tyvek",
        "tagline": "Tyvek® Classic",
        "family": "tyvek",
        "description": "Securband® 2025 допълва класическата Tyvek® линия за клубове, концерти и еднодневни мероприятия.",
        "specs": [
            {"label": "Материал", "value": "Tyvek®"},
            {"label": "Модел", "value": "2025"},
            {"label": "Серия", "value": "Securband®"},
        ],
    },
    {
        "name": "Securband® Plus 2066",
        "subcategory": "tyvek",
        "tagline": "Tyvek® Classic с отрязък",
        "family": "tyvek",
        "description": "Securband® Plus 2066 добавя отделяем участък към класическата Tyvek® гривна — за томболи, куверти и промоции.",
        "specs": [
            {"label": "Материал", "value": "Tyvek®"},
            {"label": "Модел", "value": "2066"},
            {"label": "Серия", "value": "Securband® Plus"},
        ],
    },
    {
        "name": "Tyvek® TTAB",
        "subcategory": "tyvek",
        "tagline": "Tyvek® ECO",
        "family": "tyvek",
        "description": "Tyvek® TTAB от линията ECO — зеленият избор за екологично устойчиви еднодневни събития. Лепилото остава върху гривната и не пада на земята.",
        "specs": [
            {"label": "Материал", "value": "Tyvek® ECO"},
            {"label": "Модел", "value": "TTAB"},
        ],
    },
    {
        "name": "Tyvek® NTAB",
        "subcategory": "tyvek",
        "tagline": "Tyvek® ECO",
        "family": "tyvek",
        "description": "Tyvek® NTAB е ECO формат за еднодневна идентификация с рециклируем материал DuPont и сигурно залепване.",
        "specs": [
            {"label": "Материал", "value": "Tyvek® ECO"},
            {"label": "Модел", "value": "NTAB"},
        ],
    },
    {
        "name": "SureImage® TENS Jr.",
        "subcategory": "tyvek",
        "tagline": "Tyvek® SureImage®",
        "family": "tyvek",
        "description": "Tyvek® TENS Jr. SureImage® с пълноцветен фотопечат върху икономичния Tyvek® материал. За еднодневни събития, които все пак искат силен визуален бранд.",
        "specs": [
            {"label": "Материал", "value": "Tyvek®"},
            {"label": "Печат", "value": "Пълноцветен фотопечат"},
            {"label": "Модел", "value": "TENS Jr. SureImage®"},
        ],
    },
    {
        "name": "Ticketband® TTX",
        "subcategory": "tyvek",
        "tagline": "Tyvek® билет-гривна",
        "family": "tyvek",
        "description": "TicketBand® TTX осигуряват удобството на входен билет без риск от загуба или прехвърляне. Персонализират се със сериен номер, баркод и лого (варианти TTX1–TTX4).",
        "specs": [
            {"label": "Материал", "value": "Tyvek®"},
            {"label": "Модел", "value": "TTX"},
            {"label": "Персонализация", "value": "Сериен номер / баркод / лого"},
        ],
    },
    {
        "name": "Ticketband® Plus TXP",
        "subcategory": "tyvek",
        "tagline": "Tyvek® билет-гривна с отрязък",
        "family": "tyvek",
        "description": "TicketBand Plus® TXP имат допълнителен отрязък към стандартния TTX формат. Отрязъкът се персонализира отделно — за томболи, гардероб или предплатени услуги.",
        "specs": [
            {"label": "Материал", "value": "Tyvek®"},
            {"label": "Модел", "value": "TXP"},
            {"label": "Серия", "value": "TicketBand Plus®"},
        ],
    },
    # --- Thermal ---
    {
        "name": "Clever Custom Scanband®",
        "subcategory": "thermal",
        "tagline": "Гривни за термопечат",
        "family": "thermal",
        "description": "Clever Custom Scanband® са гривни за термопечат на обекта — име, баркод или номер се отпечатват при издаване. Подходящи за болници, дневни посещения и системи с променливи данни.",
        "specs": [
            {"label": "Печат", "value": "Термопечат"},
            {"label": "Серия", "value": "Scanband®"},
        ],
    },
    {
        "name": "Scanband® Wide 7144 / 7147",
        "subcategory": "thermal",
        "tagline": "Гривни за термопечат",
        "family": "thermal",
        "description": "Scanband® Wide 7144/7147 е широкият формат за термопечат. Повече място за име, баркод и лого при издаване на място.",
        "specs": [
            {"label": "Печат", "value": "Термопечат"},
            {"label": "Модел", "value": "7144 / 7147"},
            {"label": "Формат", "value": "Wide"},
        ],
    },
    {
        "name": "Scanband® Narrow 7122",
        "subcategory": "thermal",
        "tagline": "Гривни за термопечат",
        "family": "thermal",
        "description": "Scanband® Narrow 7122 е тесният формат за термопечат — компактна гривна с баркод или номер, подходяща за висок поток на входа.",
        "specs": [
            {"label": "Печат", "value": "Термопечат"},
            {"label": "Модел", "value": "7122"},
            {"label": "Формат", "value": "Narrow"},
        ],
    },
    {
        "name": "Scanband® FloodCoat 7244 / 7247",
        "subcategory": "thermal",
        "tagline": "Гривни за термопечат",
        "family": "thermal",
        "description": "Scanband® FloodCoat 7244/7247 с плътно цветно покритие и термопечат на променливи данни. Цветът кодира зона или тариф, а печатът носи уникалния идентификатор.",
        "specs": [
            {"label": "Печат", "value": "Термопечат"},
            {"label": "Модел", "value": "7244 / 7247"},
            {"label": "Серия", "value": "FloodCoat"},
        ],
    },
    # --- RFID & barcode ---
    {
        "name": "RFID плъзгачи",
        "subcategory": "rfid",
        "tagline": "RFID решения",
        "family": "rfid",
        "description": "RFID плъзгачи се монтират върху съществуваща гривна и добавят безконтактна идентификация към all-inclusive, cashless или контрол на достъпа. Работим с често използвани RFID стандарти за хотели и събития.",
        "specs": [
            {"label": "Тип", "value": "RFID плъзгач"},
            {"label": "Приложение", "value": "Гривни all-inclusive / cashless"},
        ],
    },
    {
        "name": "Гривни Smart® Woven",
        "subcategory": "rfid",
        "tagline": "Текстил с RFID",
        "family": "rfid",
        "description": "Smart® Woven съчетават тъкана текстилна гривна с RFID чип. Комфорт на текстила и функционалност на безконтактния достъп — за курорти и многодневни събития.",
        "specs": [
            {"label": "Материал", "value": "Тъкан текстил"},
            {"label": "Чип", "value": "RFID / Smart®"},
        ],
    },
    {
        "name": "Баркод плъзгачи",
        "subcategory": "rfid",
        "tagline": "Баркод решения",
        "family": "rfid",
        "description": "Баркод плъзгачи добавят сканируем код към гривна без електроника. Подходящи за гардероб, наем на екипировка и отчитане на предплатени услуги.",
        "specs": [
            {"label": "Тип", "value": "Баркод плъзгач"},
            {"label": "Приложение", "value": "Сканиране на входа / услуги"},
        ],
    },
]

FAMILY_DOCS: dict[str, list[str]] = {
    "vinyl-classic": ["Vinyl bands-Classic_info.docx"],
    "vinyl-clearimage": ["Vinyl bands-ClearImage_info.docx"],
    "plastic-superband": ["Plastic Superband_info.docx"],
    "plastic-sureimage": ["Plastic SureImage_info.docx"],
    "plastic-holographic": ["Plastic Superband_info.docx"],
    "silicone": ["SureImage Barcode_info.docx", "Opisanie po PRILOJENIE_info.docx"],
    "textile": ["Textile bands_info.docx"],
    "tyvek": ["Tyvek bands_info.docx"],
    "thermal": ["SureImage Barcode_info.docx"],
    "rfid": ["SureImage Barcode_info.docx", "Opisanie po PRILOJENIE_info.docx"],
}


def pick_docx_images(docx_path: Path) -> list[tuple[int, str, bytes]]:
    if not docx_path.exists():
        return []
    picked: list[tuple[int, str, bytes]] = []
    seen_sizes: set[int] = set()
    with zipfile.ZipFile(docx_path) as z:
        candidates: list[tuple[int, str]] = []
        for info in z.infolist():
            if not info.filename.startswith("word/media/"):
                continue
            ext = Path(info.filename).suffix.lower()
            if ext not in {".jpg", ".jpeg", ".png"}:
                continue
            if info.file_size in SKIP_MEDIA_SIZES or info.file_size < MIN_MEDIA_BYTES:
                continue
            candidates.append((info.file_size, info.filename))
        candidates.sort(reverse=True)
        for size, name in candidates:
            if size in seen_sizes:
                continue
            seen_sizes.add(size)
            picked.append((size, name, z.read(name)))
            if len(picked) >= MAX_IMAGES_PER_FAMILY:
                break
    return picked


def extract_family_images() -> dict[str, list[dict[str, str]]]:
    IMAGES_ROOT.mkdir(parents=True, exist_ok=True)
    by_family: dict[str, list[dict[str, str]]] = {}
    for family, docs in FAMILY_DOCS.items():
        dest_dir = IMAGES_ROOT / family
        dest_dir.mkdir(parents=True, exist_ok=True)
        images: list[dict[str, str]] = []
        seen_sizes: set[int] = set()
        index = 1
        for doc_name in docs:
            for size, name, data in pick_docx_images(DOCS_DIR / doc_name):
                if size in seen_sizes:
                    continue
                seen_sizes.add(size)
                ext = Path(name).suffix.lower()
                if ext == ".jpeg":
                    ext = ".jpg"
                dest = dest_dir / f"{index}{ext}"
                dest.write_bytes(data)
                images.append(
                    {
                        "src": f"/images/products/wristbands/{family}/{index}{ext}",
                        "alt": family,
                    }
                )
                index += 1
                if len(images) >= MAX_IMAGES_PER_FAMILY:
                    break
            if len(images) >= MAX_IMAGES_PER_FAMILY:
                break
        by_family[family] = images
    return by_family


def render_ts(products: list[dict]) -> str:
    lines = [
        "/**",
        " * Imported from Web site scheme.xlsx and wristband Word docs.",
        " * Regenerate: python scripts/import-wristbands.py",
        " */",
        'import type { Product } from "./schema";',
        "",
        "export const wristbandsProducts: Product[] = [",
    ]
    for product in products:
        lines.append("  {")
        lines.append(f"    slug: {ts_string(product['slug'])},")
        lines.append(f"    subcategory: {ts_string(product['subcategory'])},")
        lines.append(f"    name: {ts_string(product['name'])},")
        lines.append(f"    tagline: {ts_string(product['tagline'])},")
        lines.append(f"    description: {ts_string(product['description'])},")
        lines.append("    images: [")
        for image in product.get("images", []):
            lines.append(
                f"      {{ src: {ts_string(image['src'])}, alt: {ts_string(image['alt'])} }},"
            )
        lines.append("    ],")
        lines.append("    specs: [")
        for spec in product["specs"]:
            lines.append(
                f"      {{ label: {ts_string(spec['label'])}, value: {ts_string(spec['value'])} }},"
            )
        lines.append("    ],")
        lines.append('    status: "published",')
        lines.append("  },")
    lines.append("];")
    lines.append("")
    return "\n".join(lines)


def build_products() -> list[dict]:
    family_images = extract_family_images()
    products: list[dict] = []
    seen: dict[str, int] = {}
    for item in PRODUCTS:
        base = slugify(item["name"])
        count = seen.get(base, 0)
        seen[base] = count + 1
        slug = base if count == 0 else f"{base}-{count + 1}"
        images = []
        for image in family_images.get(item["family"], []):
            images.append({"src": image["src"], "alt": item["name"]})
        products.append(
            {
                "slug": slug,
                "subcategory": item["subcategory"],
                "name": item["name"],
                "tagline": item["tagline"],
                "description": item["description"],
                "images": images,
                "specs": item["specs"],
                "status": "published",
            }
        )
    return products


def main() -> None:
    if not DOCS_DIR.exists():
        raise SystemExit(f"Wristband docs not found: {DOCS_DIR}")

    products = build_products()
    OUT_JSON.write_text(
        json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    OUT_TS.write_text(render_ts(products), encoding="utf-8")

    with_images = sum(1 for product in products if product.get("images"))
    by_sub: dict[str, int] = {}
    for product in products:
        by_sub[product["subcategory"]] = by_sub.get(product["subcategory"], 0) + 1

    print(f"Imported {len(products)} wristband products")
    print(f"Products with images: {with_images}/{len(products)}")
    for sub, count in by_sub.items():
        print(f"  {sub}: {count}")
    print(f"Wrote {OUT_TS.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
