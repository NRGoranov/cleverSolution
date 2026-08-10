"""Generate client-facing Excel product import template (stdlib only)."""

from __future__ import annotations

import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

OUT = (
    Path(__file__).resolve().parents[1]
    / "docs"
    / "CleverSolutions-Produktov-shablon.xlsx"
)

HEADERS = [
    "category",
    "subcategory",
    "slug",
    "name",
    "tagline",
    "description",
    "status",
    "image_folder",
    "image_alt",
    "price_bgn",
    "buy_url",
    "spec_1_label",
    "spec_1_value",
    "spec_2_label",
    "spec_2_value",
    "spec_3_label",
    "spec_3_value",
    "spec_4_label",
    "spec_4_value",
]

EXAMPLES = [
    [
        "kitchenware",
        "fryers",
        "frityurnik-15l",
        "Фритюрник 15 л",
        "Професионален двоен фритюрник за ресторантска кухня",
        "Описание на продукта: материали, предназначение, забележки. Заменете с реален текст.",
        "published",
        "frityurnik-15l",
        "Двоен фритюрник от неръждаема стомана",
        "",
        "",
        "Капацитет",
        "15 л",
        "Мощност",
        "9 kW",
        "Материал",
        "Неръждаема стомана",
        "",
        "",
    ],
    [
        "kitchenware",
        "combi-ovens",
        "konvektomat-10-niva",
        "Конвектомат 10 нива",
        "Комбинирана фурна с пара и конвекция",
        "Пълно описание на модела. Заменете с реален текст.",
        "published",
        "konvektomat-10-niva",
        "Конвектомат с дигитален панел",
        "2499.00",
        "",
        "Нива",
        "10 GN 1/1",
        "Захранване",
        "400 V",
        "Управление",
        "Дигитален панел",
        "",
        "",
    ],
    [
        "security",
        "cameras",
        "kamera-wifi-outdoor",
        "Wi‑Fi камера за външен монтаж",
        "Наблюдение с нощен режим",
        "Описание на камерата и комплекта. Заменете с реален текст.",
        "draft",
        "kamera-wifi-outdoor",
        "Външна Wi‑Fi камера",
        "",
        "",
        "Резолюция",
        "2K",
        "Захранване",
        "12 V / PoE",
        "Водоустойчивост",
        "IP66",
        "",
        "",
    ],
    [
        "wristbands",
        "events",
        "grivna-rfid-event",
        "RFID гривна за събития",
        "All-inclusive достъп и плащания",
        "Описание на гривната, чиповете и приложенията. Заменете с реален текст.",
        "published",
        "grivna-rfid-event",
        "Силиконова RFID гривна",
        "",
        "",
        "Чип",
        "RFID / NFC",
        "Материал",
        "Силикон",
        "Цветове",
        "По заявка",
        "",
        "",
    ],
    [
        "vacuums",
        "robots",
        "robot-prahosmukachka-x1",
        "Роботизирана прахосмукачка X1",
        "Картографиране и автоматично зареждане",
        "Описание на робота и функциите. Заменете с реален текст.",
        "published",
        "robot-prahosmukachka-x1",
        "Робот прахосмукачка",
        "",
        "https://example.com/product",
        "Време на работа",
        "120 мин",
        "Навигация",
        "LiDAR",
        "Мокро почистване",
        "Да",
        "Станция",
        "Автоматично зареждане",
    ],
]

INSTRUCTIONS = [
    ["Тема", "Указание"],
    [
        "Цел на файла",
        "Попълнете продуктите в листа „Продукти“. Всеки ред = един продукт. След това ни върнете файла.",
    ],
    [
        "Формат",
        "Един Excel лист с продукти. Без обединени клетки. Първият ред са заглавията — не ги трийте и не ги преименувайте.",
    ],
    [
        "category",
        "Само: kitchenware (кухня), security (сигурност), wristbands (гривни), vacuums (прахосмукачки).",
    ],
    [
        "subcategory",
        "kitchenware: fryers, ovens, combi-ovens, cooktops | security: cameras, alarms, sensors, access-control | wristbands: events, resorts, festivals, rfid | vacuums: robots, stick, wet-clean, accessories",
    ],
    [
        "slug",
        "Уникален код: малки латински букви, цифри и тирета. Пример: konvektomat-10-niva. Без кирилица и интервали.",
    ],
    ["name", "Име на продукта на български."],
    ["tagline", "Кратко изречение под името."],
    ["description", "Пълно описание."],
    [
        "status",
        "published = видим на сайта; draft = скрит засега.",
    ],
    [
        "image_folder",
        "Най-добре същото като slug. Снимките: папка/<slug>/1.jpg, 2.jpg… (стават и png/webp).",
    ],
    ["image_alt", "Кратко описание на основната снимка."],
    ["price_bgn", "Само число (напр. 2499.00) или празно."],
    ["buy_url", "Пълен линк или празно."],
    [
        "spec_1_label / spec_1_value …",
        "Характеристики като двойки етикет + стойност. Празните колони се игнорират. Може да добавите spec_5_… при нужда.",
    ],
    [
        "Кирилица",
        "Разрешена в name, tagline, description, image_alt и характеристиките. Не в category, subcategory, slug, status.",
    ],
    [
        "Празни клетки",
        "Ако няма данни — оставете празно. Не пишете „няма“, „-“ или „n/a“.",
    ],
    [
        "Примери",
        "В листа „Продукти“ има 5 примерни реда. Изтрийте ги и попълнете реалните продукти, или ги заменете.",
    ],
]


def col_letter(n: int) -> str:
    s = ""
    while n:
        n, r = divmod(n - 1, 26)
        s = chr(65 + r) + s
    return s


def sheet_xml(rows: list[list[object]]) -> str:
    max_c = max((len(r) for r in rows), default=1)
    max_r = max(len(rows), 1)
    parts = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
        ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">',
        f'<dimension ref="A1:{col_letter(max_c)}{max_r}"/>',
        "<sheetData>",
    ]
    for r_idx, row in enumerate(rows, start=1):
        parts.append(f'<row r="{r_idx}">')
        for c_idx, val in enumerate(row, start=1):
            ref = f"{col_letter(c_idx)}{r_idx}"
            text = escape(str(val)) if val is not None else ""
            parts.append(f'<c r="{ref}" t="inlineStr"><is><t>{text}</t></is></c>')
        parts.append("</row>")
    parts.append("</sheetData></worksheet>")
    return "".join(parts)


def main() -> None:
    sheets = [
        ("Указания", INSTRUCTIONS),
        ("Продукти", [HEADERS] + EXAMPLES),
    ]

    sheet_files: list[tuple[str, str]] = []
    workbook_sheets: list[str] = []
    for i, (name, rows) in enumerate(sheets, start=1):
        sheet_files.append((f"xl/worksheets/sheet{i}.xml", sheet_xml(rows)))
        workbook_sheets.append(
            f'<sheet name="{escape(name)}" sheetId="{i}" r:id="rId{i}"/>'
        )

    workbook = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
        ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        f"<sheets>{''.join(workbook_sheets)}</sheets></workbook>"
    )
    wb_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + "".join(
            f'<Relationship Id="rId{i}" '
            'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" '
            f'Target="worksheets/sheet{i}.xml"/>'
            for i in range(1, len(sheets) + 1)
        )
        + "</Relationships>"
    )
    content_types = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Override PartName="/xl/workbook.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
        + "".join(
            f'<Override PartName="/xl/worksheets/sheet{i}.xml" '
            'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
            for i in range(1, len(sheets) + 1)
        )
        + "</Types>"
    )
    root_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" '
        'Target="xl/workbook.xml"/>'
        "</Relationships>"
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(OUT, "w", compression=zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types)
        z.writestr("_rels/.rels", root_rels)
        z.writestr("xl/workbook.xml", workbook)
        z.writestr("xl/_rels/workbook.xml.rels", wb_rels)
        for path, data in sheet_files:
            z.writestr(path, data)

    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
