"""
Build the master language registry from V2 extraction step3 files.

Scans every language name across all 51 benchmarks' step3_languages.json,
resolves each to authoritative metadata via Glottolog / CLDR / Joshi taxonomy,
and writes language_registry.json.

Design principle:
  - The ONLY input from extraction is the language name string.
  - All other fields (iso_code, family, script, macroarea, continent, joshi_level)
    are derived deterministically from authoritative sources.
  - Unresolvable names are flagged for human review, never guessed.

Two-pass workflow:
  Pass 1: python analysis/build_language_registry.py
          → generates registry + review report (registry_review.txt)
  Pass 2: human edits overrides, re-runs → clean registry

Usage:
    python analysis/build_language_registry.py
"""

import csv
import json
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

from jsonschema import Draft202012Validator

# ─── Paths ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
V2_EXTRACTED_DIR = DATA_DIR / "benchmarks"
OUTPUT_DIR = DATA_DIR / "generated"
REGISTRY_PATH = OUTPUT_DIR / "language_registry.json"
REVIEW_PATH = OUTPUT_DIR / "registry_review.txt"
LANG2TAX_PATH = Path(__file__).resolve().parent / "lang2tax.txt"

REFERENCE_DIR = DATA_DIR / "reference"
GLOTTOLOG_LANGUAGES_CSV = REFERENCE_DIR / "glottolog_languages.csv"
GLOTTOLOG_NAMES_CSV = REFERENCE_DIR / "glottolog_names.csv"
CLDR_LANGUAGE_DATA_JSON = REFERENCE_DIR / "cldr_languageData.json"
OVERRIDES_PATH = REFERENCE_DIR / "language_metadata_overrides.json"
OVERRIDES_SCHEMA_PATH = DATA_DIR / "schemas" / "language_metadata_overrides.schema.json"

# ─── Joshi level names ────────────────────────────────────────────────────────
JOSHI_LEVEL_NAMES = {
    0: "Left-Behinds",
    1: "Scraping-Bys",
    2: "Hopefuls",
    3: "Rising Stars",
    4: "Underdogs",
    5: "Winners",
}

# ─── Seed aliases: map known variant names → canonical name ───────────────────
# These are applied BEFORE Glottolog resolution so that duplicates merge.
SEED_ALIASES = {
    # Bantu noun-class prefix variants
    "isiZulu": "Zulu",
    "isiXhosa": "Xhosa",
    "chiShona": "Shona",
    "Setswana": "Tswana",
    "Xitsonga": "Tsonga",
    "Kikongo": "Kongo",
    "Kiswahili": "Swahili",
    "Sesotho": "Southern Sotho",
    "Kirundi": "Rundi",
    # Diacritics / spelling variants
    "Yorùbá": "Yoruba",
    "Éwé": "Ewe",
    "Ghomálá'": "Ghomala'",
    "Kabiyè": "Kabiye",
    # Script / regional variants → base language
    "Oriya": "Odia",
    "Panjabi": "Punjabi",
    "Eastern Panjabi": "Punjabi",
    "Modern Standard Arabic": "Standard Arabic",
    "Simplified Chinese": "Chinese",
    "Traditional Chinese": "Chinese",
    "Chinese (Simplified)": "Chinese",
    "Chinese (Traditional)": "Chinese",
    "Norwegian Bokmål": "Norwegian",
    "Modern Greek": "Greek",
    "Mandarin": "Chinese",
    "Mandarin Chinese": "Chinese",
    "Filipino (Tagalog)": "Filipino",
    "Standard Latvian": "Latvian",
    "Standard Malay": "Malay",
    "Northern Uzbek": "Uzbek",
    "North Azerbaijani": "Azerbaijani",
    "Tosk Albanian": "Albanian",
    "Plateau Malagasy": "Malagasy",
    "Halh Mongolian": "Mongolian",
    "Standard Tibetan": "Tibetan",
    "West Central Oromo": "Oromo",
    "Western Persian": "Persian",
    "Southern Pashto": "Pashto",
    "Meiteilon (Manipuri)": "Manipuri",
    "Sorani Kurdish": "Central Kurdish",
    "Ganda": "Luganda",
    "Nyanja": "Chichewa",
    "Boro": "Bodo",
    "Ateso": "Teso",
    "Runyankole": "Runyankore",
    "Tamasheq": "Tamashek",
    "Luba-Kasai": "Ciluba",
    "Northern Ndebele": "Ndebele",
    "Nigerian Fulfulde": "Fulfulde",
    "Wixarika": "Huichol",
    "Rarámuri": "Tarahumara",
    "Mossi": "Mooré",
    "N'Ko": "NKo",
    "Haitian": "Haitian Creole",
    "Portuguese (Brazil)": "Brazilian Portuguese",
    "Spanish (Latin America)": "Latin American Spanish",
    "Serbian (Cyrillic)": "Serbian",
    "Serbian (Latin)": "Serbian",
    "Luo (Kenya)": "Luo",
    "Meerut": "Meeruti",
    "Bhatner": "Bhatnair",
    "Kurdish": "Central Kurdish",
    "Tagalog": "Filipino",
}

# ─── Glottolog overrides: canonical_name → glottocode ─────────────────────────
GLOTTOLOG_OVERRIDES = {
    # Macrolanguage / ambiguous cases
    "Arabic": "stan1318",
    "Standard Arabic": "stan1318",
    "Azerbaijani": "nort2697",
    "Bemba": "bemb1257",
    "Bodo": "bodo1269",
    "Bosnian": "bosn1245",
    "Chinese": "mand1415",
    "Croatian": "croa1245",
    "Dinka": "nort2815",
    "Fula": "west2454",
    "Greek": "mode1248",
    "Guarani": "para1311",
    "Hebrew": "hebr1245",
    "Kamba": "kamb1297",
    "Kanuri": "cent2050",
    "Khmer": "cent1989",
    "Kongo": "koon1244",
    "Konkani": "goan1235",
    "Luo": "luok1236",
    "Malagasy": "plat1254",
    "Malay": "stan1306",
    "Mesopotamian Arabic": "meso1252",
    "Nahuatl": "cent2132",
    "Oromo": "west2721",
    "Otomí": "mezq1235",
    "Pashto": "cent1973",
    "Persian": "west2369",
    "Quechua": "cusc1236",
    "Cusco Quechua": "cusc1236",
    "Rajasthani": "marw1260",
    "Serbian": "serb1264",
    "Tamazight": "cent2194",
    "Twi": "akan1250",
    "Uzbek": "nort2690",
    "Waray": "wara1300",
    "Teso": "teso1249",
    "Albanian": "tosk1239",
    "Aymara": "cent2142",
    "Yiddish": "east2295",

    # Romanized variants → base language
    "Bengali (Romanized)": "beng1280",
    "Hindi (Romanized)": "hind1269",
    "Nepali (Romanized)": "nepa1254",
    "Sinhala (Romanized)": "sinh1246",
    "Urdu (Romanized)": "urdu1245",
    "Modern Standard Arabic (Romanized)": "stan1318",

    # Regional / script variants
    "English (Indian)": "stan1293",
    "European Portuguese": "port1283",
    "European Spanish": "stan1288",
    "Mozambican Portuguese": "port1283",
    "Brazilian Portuguese": "port1283",
    "Latin American Spanish": "stan1288",
    "Filipino": "taga1270",
    "Manipuri": "mani1292",
    "Northern Sotho": "pedi1238",
    "Tibetan": "tibe1272",
    "Central Kurdish": "cent1972",
    "Yoruba": "yoru1245",
    "Luganda": "gand1255",
    "Mongolian": "mong1331",

    # Indigenous / less-resourced
    "Tarahumara": "cent2131",
    "Huichol": "huic1243",
    "Ghomala'": "ghom1247",
    "Tamashek": "tama1365",
    "Mooré": "moss1236",
    "NKo": "bamb1269",
    "Ciluba": "luba1249",
    "Ndebele": "nort2795",
    "Fulfulde": "west2454",
    "Kabiye": "kabi1261",
    "Kabuverdianu": "kabu1256",
    "Runyankore": "nyan1307",

    # Indian dialects
    "Baleswari": "oriy1255",
    "Bhatnair": "hind1269",
    "Bilaspuri": "hind1269",
    "Desia": "desi1235",
    "Ganjami": "oriy1255",
    "Kulluvi": "kull1236",
    "Mandyali": "mand1409",
    "Meeruti": "hind1269",
    "Muzaffarnagar": "hind1269",
    "Sambalpuri": "samb1325",
    "Sirmouri": "hind1269",
    "Asháninka": "asha1243",
    "Chokwe": "chok1245",
    "Kimbundu": "kimb1241",
    "Shipibo-Konibo": "ship1254",
    "Bribri": "brib1243",

    # Arabic dialects
    "Algerian Arabic": "alge1239",
    "Moroccan Arabic": "moro1292",
    "Tunisian Arabic": "tuni1259",
    "Najdi Arabic": "najd1235",
    "North Levantine Arabic": "nort3139",
    "Egyptian Arabic": "egyp1253",

    # Others
    "Nigerian Pidgin": "nige1257",
    "Haitian Creole": "hait1244",
    "Cantonese": "yuec1235",
    "Crimean Tatar": "crim1257",
}

# ─── Joshi taxonomy overrides ─────────────────────────────────────────────────
# canonical_name → (lang2tax_name, source, rationale, dialect_of)
LANG2TAX_OVERRIDES = {
    # Alias mappings
    "Chinese": ("mandarin", "alias", "Chinese in NLP = Mandarin Chinese", None),
    "Standard Arabic": ("arabic", "alias", "Modern Standard Arabic → Arabic in lang2tax", None),
    "European Spanish": ("spanish", "dialect", "European variety of Spanish", "Spanish"),
    "English (Indian)": ("english", "dialect", "Indian English variety", "English"),
    "Persian": ("persian", "alias", "Western Persian = standard Persian", None),
    "Brazilian Portuguese": ("portuguese", "dialect", "Brazilian variety of Portuguese", "Portuguese"),
    "European Portuguese": ("portuguese", "dialect", "European variety of Portuguese", "Portuguese"),
    "Latin American Spanish": ("spanish", "dialect", "Latin American variety of Spanish", "Spanish"),
    "Mozambican Portuguese": ("portuguese", "dialect", "Mozambican variety of Portuguese", "Portuguese"),
    "Filipino": ("tagalog", "alias", "Filipino is standardized register of Tagalog", None),
    "Latvian": ("latvian", "alias", "Direct match", None),
    "Malay": ("malay", "alias", "Direct match", None),
    "Uzbek": ("uzbek", "alias", "Direct match", None),
    "Swahili": ("swahili", "alias", "Direct match", None),
    "Yoruba": ("yoruba", "alias", "Direct match", None),
    "Zulu": ("zulu", "alias", "Direct match", None),
    "Xhosa": ("xhosa", "alias", "Direct match", None),
    "Tswana": ("tswana", "alias", "Direct match", None),
    "Shona": ("shona", "alias", "Direct match", None),
    "Punjabi": ("eastern punjabi", "alias", "Punjabi in NLP = Eastern Punjabi", None),
    "Norwegian": ("norwegian (bokmål)", "alias", "Default Norwegian = Bokmål", None),
    "Azerbaijani": ("azerbaijani", "alias", "Direct match", None),
    "Kyrgyz": ("kirghiz", "alias", "Kirghiz = Kyrgyz", None),
    "Mongolian": ("mongolian", "alias", "Direct match", None),
    "Albanian": ("albanian", "alias", "Direct match", None),
    "Malagasy": ("malagasy", "alias", "Direct match", None),
    "Central Kurdish": ("kurdish (sorani)", "alias", "Central Kurdish = Sorani", None),
    "Luganda": ("luganda", "alias", "Direct match", None),
    "Tsonga": ("tsonga", "alias", "Direct match", None),
    "Southern Sotho": ("sesotho", "alias", "Sesotho = Southern Sotho", None),
    "Northern Sotho": ("northern sotho", "alias", "Direct match", None),
    "Chichewa": ("chichewa", "alias", "Direct match", None),
    "Kongo": ("kongo", "alias", "Direct match", None),
    "Oromo": ("oromo", "alias", "Direct match", None),
    "Pashto": ("pashto", "alias", "Direct match", None),
    "Manipuri": ("meithei", "alias", "Manipuri = Meitei language", None),
    "Fon": ("fongbe", "alias", "Fon = Fongbe", None),
    "Bodo": ("bodo", "alias", "Direct match", None),
    "Teso": ("teso", "alias", "Direct match", None),
    "Runyankore": ("runyankore", "alias", "Direct match", None),
    "Tamashek": ("tamashek", "alias", "Direct match", None),
    "Ciluba": ("ciluba", "alias", "Direct match", None),
    "Ndebele": ("ndebele", "alias", "Direct match", None),
    "Fulfulde": ("fulfulde", "alias", "Direct match", None),
    "Huichol": ("huichol", "alias", "Wixárika autonym → Huichol", None),
    "Tarahumara": ("tarahumara", "alias", "Rarámuri autonym → Tarahumara", None),
    "Greek": ("greek", "alias", "Modern Greek → Greek", None),

    # Romanized variants
    "Bengali (Romanized)": ("bengali", "romanized", "Romanized Bengali", "Bengali"),
    "Hindi (Romanized)": ("hindi", "romanized", "Romanized Hindi", "Hindi"),
    "Nepali (Romanized)": ("nepali", "romanized", "Romanized Nepali", "Nepali"),
    "Sinhala (Romanized)": ("sinhalese", "romanized", "Romanized Sinhala", "Sinhala"),
    "Urdu (Romanized)": ("urdu", "romanized", "Romanized Urdu", "Urdu"),
    "Modern Standard Arabic (Romanized)": ("arabic", "romanized", "Romanized MSA", "Standard Arabic"),

    # Arabic dialects
    "Algerian Arabic": (None, "dialect", "Arabic dialect", "Standard Arabic"),
    "Moroccan Arabic": (None, "dialect", "Arabic dialect (Darija)", "Standard Arabic"),
    "Tunisian Arabic": (None, "dialect", "Arabic dialect", "Standard Arabic"),
    "Najdi Arabic": (None, "dialect", "Arabic dialect", "Standard Arabic"),
    "North Levantine Arabic": (None, "dialect", "Arabic dialect", "Standard Arabic"),
    "Mesopotamian Arabic": (None, "dialect", "Arabic dialect", "Standard Arabic"),
    "Egyptian Arabic": (None, "dialect", "Arabic dialect", "Standard Arabic"),

    # Indian sub-regional dialects
    "Baleswari": (None, "dialect", "Odia dialect (Balasore)", "Odia"),
    "Bhatnair": (None, "dialect", "Hindi dialect", "Hindi"),
    "Bilaspuri": (None, "dialect", "Pahari dialect (HP)", "Hindi"),
    "Desia": (None, "dialect", "Dravidian-influenced Odia dialect", "Odia"),
    "Ganjami": (None, "dialect", "Odia dialect (Ganjam)", "Odia"),
    "Kulluvi": (None, "dialect", "Pahari dialect (Kullu, HP)", "Hindi"),
    "Mandyali": (None, "dialect", "Pahari dialect (Mandi, HP)", "Hindi"),
    "Meeruti": (None, "dialect", "Hindi dialect (western UP)", "Hindi"),
    "Muzaffarnagar": (None, "dialect", "Hindi dialect (western UP)", "Hindi"),
    "Sambalpuri": (None, "dialect", "Odia dialect (western Odisha)", "Odia"),
    "Sirmouri": (None, "dialect", "Pahari dialect (Sirmaur, HP)", "Hindi"),
    "Rajasthani": (None, "dialect", "Hindi-belt dialect group", "Hindi"),

    # Other
    "Asháninka": (None, "manual", "Amazonian Arawakan language; not in Joshi 2020", None),
    "Cusco Quechua": (None, "manual", "Quechua variety; Quechua=1 in lang2tax", None),
    "Kabuverdianu": (None, "manual", "Cape Verdean Creole; not in Joshi 2020", None),
    "Chokwe": (None, "manual", "Bantu (Angola/DRC); not in Joshi 2020", None),
    "Kimbundu": (None, "manual", "Angolan Bantu; not in Joshi 2020", None),
    "Luo": (None, "manual", "Dholuo, Western Nilotic; not in lang2tax", None),
    "Mooré": (None, "manual", "Gur language (Burkina Faso); not in lang2tax", None),
    "Ghomala'": (None, "manual", "Cameroonian Grassfields Bantu; not in Joshi 2020", None),
    "NKo": (None, "manual", "Manding in NKo script; Bambara=1 in lang2tax", None),
    "Tamazight": (None, "manual", "Central Atlas Tamazight (Berber)", None),
    "Cantonese": ("cantonese", "alias", "Direct match", None),
    "Nigerian Pidgin": (None, "manual", "Nigerian Pidgin English; not in Joshi 2020", None),
    "Haitian Creole": (None, "manual", "Haitian Creole; not in Joshi 2020", None),
    "Crimean Tatar": (None, "manual", "Turkic (Crimea); not in Joshi 2020", None),
    "Shipibo-Konibo": (None, "manual", "Panoan (Peru); not in Joshi 2020", None),
    "Bribri": (None, "manual", "Chibchan (Costa Rica); not in Joshi 2020", None),
    "Kabiye": (None, "manual", "Gur language (Togo); not in Joshi 2020", None),
}

# ─── CLDR script code → readable name ────────────────────────────────────────
CLDR_SCRIPT_NAMES = {
    "Adlm": "Adlam", "Arab": "Arabic", "Armn": "Armenian", "Beng": "Bengali",
    "Cyrl": "Cyrillic", "Deva": "Devanagari", "Ethi": "Ethiopic", "Geor": "Georgian",
    "Grek": "Greek", "Gujr": "Gujarati", "Guru": "Gurmukhi", "Hang": "Hangul",
    "Hans": "Simplified Chinese", "Hant": "Traditional Chinese", "Hebr": "Hebrew",
    "Jpan": "Japanese", "Khmr": "Khmer", "Knda": "Kannada", "Kore": "Korean",
    "Laoo": "Lao", "Latn": "Latin", "Mlym": "Malayalam", "Mong": "Mongolian",
    "Mtei": "Meitei Mayek", "Mymr": "Myanmar", "Nkoo": "NKo", "Olck": "Ol Chiki",
    "Orya": "Odia", "Sinh": "Sinhala", "Taml": "Tamil", "Telu": "Telugu",
    "Tfng": "Tifinagh", "Thai": "Thai", "Tibt": "Tibetan", "Vaii": "Vai",
}

# Macroarea → continent mapping (Glottolog uses 6 macroareas)
MACROAREA_TO_CONTINENT = {
    "Africa": "Sub-Saharan Africa",
    "Eurasia": "Eurasia",
    "Papunesia": "Oceania",
    "Australia": "Oceania",
    "North America": "Americas",
    "South America": "Americas",
}

# More specific continent overrides for Eurasian languages
CONTINENT_OVERRIDES = {
    # South Asian languages
    "Hindi": "South Asia", "Bengali": "South Asia", "Telugu": "South Asia",
    "Tamil": "South Asia", "Marathi": "South Asia", "Gujarati": "South Asia",
    "Kannada": "South Asia", "Malayalam": "South Asia", "Odia": "South Asia",
    "Punjabi": "South Asia", "Assamese": "South Asia", "Urdu": "South Asia",
    "Nepali": "South Asia", "Sinhala": "South Asia", "Sindhi": "South Asia",
    "Sanskrit": "South Asia", "Konkani": "South Asia", "Dogri": "South Asia",
    "Kashmiri": "South Asia", "Maithili": "South Asia", "Bhojpuri": "South Asia",
    "Santali": "South Asia", "Bodo": "South Asia", "Manipuri": "South Asia",
    "Mizo": "South Asia", "Pashto": "South Asia",
    # South Asian dialects
    "Baleswari": "South Asia", "Bhatnair": "South Asia", "Bilaspuri": "South Asia",
    "Desia": "South Asia", "Ganjami": "South Asia", "Kulluvi": "South Asia",
    "Mandyali": "South Asia", "Meeruti": "South Asia", "Muzaffarnagar": "South Asia",
    "Sambalpuri": "South Asia", "Sirmouri": "South Asia", "Rajasthani": "South Asia",
    # Romanized South Asian
    "Bengali (Romanized)": "South Asia", "Hindi (Romanized)": "South Asia",
    "Nepali (Romanized)": "South Asia", "Sinhala (Romanized)": "South Asia",
    "Urdu (Romanized)": "South Asia",
    # Southeast Asian
    "Thai": "Southeast Asia", "Vietnamese": "Southeast Asia", "Indonesian": "Southeast Asia",
    "Malay": "Southeast Asia", "Filipino": "Southeast Asia", "Burmese": "Southeast Asia",
    "Lao": "Southeast Asia", "Khmer": "Southeast Asia", "Javanese": "Southeast Asia",
    "Cebuano": "Southeast Asia", "Ilocano": "Southeast Asia", "Waray": "Southeast Asia",
    "Shan": "Southeast Asia", "Jingpho": "Southeast Asia", "Minangkabau": "Southeast Asia",
    "Sundanese": "Southeast Asia", "Balinese": "Southeast Asia", "Banjar": "Southeast Asia",
    "Achinese": "Southeast Asia", "Madurese": "Southeast Asia", "Toba Batak": "Southeast Asia",
    "Ngaju": "Southeast Asia",
    # East Asian
    "Chinese": "East Asia", "Japanese": "East Asia", "Korean": "East Asia",
    "Cantonese": "East Asia", "Mongolian": "East Asia", "Tibetan": "East Asia",
    # Central Asian / Middle Eastern
    "Azerbaijani": "Central Asia", "Kazakh": "Central Asia", "Kyrgyz": "Central Asia",
    "Uzbek": "Central Asia", "Tajik": "Central Asia", "Tatar": "Central Asia",
    "Crimean Tatar": "Central Asia", "Karakalpak": "Central Asia", "Uyghur": "Central Asia",
    "Arabic": "Middle East & North Africa", "Standard Arabic": "Middle East & North Africa",
    "Persian": "Middle East & North Africa", "Hebrew": "Middle East & North Africa",
    "Turkish": "Middle East & North Africa", "Central Kurdish": "Middle East & North Africa",
    "Modern Standard Arabic (Romanized)": "Middle East & North Africa",
    # Arabic dialects
    "Algerian Arabic": "Middle East & North Africa", "Moroccan Arabic": "Middle East & North Africa",
    "Tunisian Arabic": "Middle East & North Africa", "Najdi Arabic": "Middle East & North Africa",
    "North Levantine Arabic": "Middle East & North Africa", "Mesopotamian Arabic": "Middle East & North Africa",
    "Egyptian Arabic": "Middle East & North Africa",
    # European
    "English": "Europe", "French": "Europe", "German": "Europe", "Spanish": "Europe",
    "Italian": "Europe", "Portuguese": "Europe", "Dutch": "Europe", "Polish": "Europe",
    "Romanian": "Europe", "Czech": "Europe", "Slovak": "Europe", "Hungarian": "Europe",
    "Bulgarian": "Europe", "Greek": "Europe", "Swedish": "Europe", "Danish": "Europe",
    "Norwegian": "Europe", "Finnish": "Europe", "Estonian": "Europe", "Latvian": "Europe",
    "Lithuanian": "Europe", "Slovenian": "Europe", "Serbian": "Europe", "Croatian": "Europe",
    "Bosnian": "Europe", "Macedonian": "Europe", "Albanian": "Europe", "Catalan": "Europe",
    "Basque": "Europe", "Galician": "Europe", "Irish": "Europe", "Welsh": "Europe",
    "Scottish Gaelic": "Europe", "Icelandic": "Europe", "Maltese": "Europe",
    "Ukrainian": "Europe", "Belarusian": "Europe", "Russian": "Europe",
    "Luxembourgish": "Europe", "Afrikaans": "Europe", "Yiddish": "Europe",
    "Occitan": "Europe", "Asturian": "Europe", "Ligurian": "Europe",
    "European Spanish": "Europe", "European Portuguese": "Europe",
    "Esperanto": "Europe",
    # Americas
    "Brazilian Portuguese": "Americas", "Mozambican Portuguese": "Sub-Saharan Africa",
    "Latin American Spanish": "Americas", "Haitian Creole": "Americas",
    "Guarani": "Americas", "Quechua": "Americas", "Cusco Quechua": "Americas",
    "Nahuatl": "Americas", "Asháninka": "Americas", "Shipibo-Konibo": "Americas",
    "Bribri": "Americas", "Otomí": "Americas", "Huichol": "Americas",
    "Tarahumara": "Americas", "Aymara": "Americas",
    "English (Indian)": "South Asia",
}


# ═══════════════════════════════════════════════════════════════════════════════
# Step 1: Collect unique language names from V2 step3 files
# ═══════════════════════════════════════════════════════════════════════════════

def load_overrides():
    """Load and validate contributor-maintained language metadata exceptions."""
    with open(OVERRIDES_PATH, encoding="utf-8") as f:
        overrides = json.load(f)
    with open(OVERRIDES_SCHEMA_PATH, encoding="utf-8") as f:
        schema = json.load(f)

    validator = Draft202012Validator(schema)
    errors = sorted(validator.iter_errors(overrides), key=lambda error: list(error.absolute_path))
    if errors:
        details = "\n".join(
            f"  - {'.'.join(str(part) for part in error.absolute_path) or '<root>'}: {error.message}"
            for error in errors
        )
        raise ValueError(
            f"Invalid language metadata override file: {OVERRIDES_PATH.relative_to(ROOT)}\n{details}"
        )
    return overrides


def collect_language_names(external_aliases):
    """Scan all V2 step3 files and collect unique canonical language names.

    Returns:
        canonical_names: set of canonical language names
        raw_to_canonical: dict mapping raw name → canonical name
        name_to_benchmarks: dict mapping canonical name → list of benchmark names
    """
    raw_to_canonical = {}
    name_to_benchmarks = defaultdict(set)

    for bm_dir in sorted(V2_EXTRACTED_DIR.iterdir(), key=lambda path: path.name):
        if not bm_dir.is_dir():
            continue
        step3 = bm_dir / "step3_languages.json"
        if not step3.exists():
            print(f"  WARNING: missing step3 for {bm_dir.name}")
            continue
        with open(step3, encoding="utf-8") as f:
            data = json.load(f)
        for raw_name in data.get("languages", {}):
            canonical = external_aliases.get(raw_name, SEED_ALIASES.get(raw_name, raw_name))
            raw_to_canonical[raw_name] = canonical
            name_to_benchmarks[canonical].add(bm_dir.name)

    canonical_names = set(name_to_benchmarks.keys())
    print(f"  Collected {len(canonical_names)} unique canonical names "
          f"from {len(raw_to_canonical)} raw names across "
          f"{sum(1 for d in V2_EXTRACTED_DIR.iterdir() if d.is_dir())} benchmarks")

    return canonical_names, raw_to_canonical, name_to_benchmarks


# ═══════════════════════════════════════════════════════════════════════════════
# Step 2: Glottolog resolution
# ═══════════════════════════════════════════════════════════════════════════════

def load_glottolog():
    """Load Glottolog reference data."""
    langs_by_id = {}
    name_to_id = {}
    family_names = {}

    with open(GLOTTOLOG_LANGUAGES_CSV, encoding="utf-8") as f:
        for row in csv.DictReader(f):
            langs_by_id[row["ID"]] = row
            if row["Level"] == "language":
                name_to_id[row["Name"].lower()] = row["ID"]
            if row["Level"] == "family":
                family_names[row["ID"]] = row["Name"]

    altname_to_ids = defaultdict(set)
    with open(GLOTTOLOG_NAMES_CSV, encoding="utf-8") as f:
        for row in csv.DictReader(f):
            altname_to_ids[row["Name"].lower()].add(row["Language_ID"])

    print(f"  Glottolog: {len(name_to_id)} languages, "
          f"{len(family_names)} families, {len(altname_to_ids)} alt-names")
    return langs_by_id, name_to_id, altname_to_ids, family_names


def resolve_glottolog(
    canonical_names,
    langs_by_id,
    name_to_id,
    altname_to_ids,
    family_names,
    language_overrides,
):
    """Resolve each canonical name to a Glottolog entry.

    Returns:
        resolved: {canonical_name: {glottocode, iso_code, family, macroarea, source}}
        unresolved: [canonical_name, ...]
        ambiguous: {canonical_name: [candidate_ids]}
    """
    resolved = {}
    unresolved = []
    ambiguous = {}

    for name in sorted(canonical_names):
        glottocode = None
        source = None

        # 1. Override
        external_glottocode = language_overrides.get(name, {}).get("glottocode")
        if external_glottocode:
            glottocode = external_glottocode
            source = "metadata_override"
        elif name in GLOTTOLOG_OVERRIDES:
            glottocode = GLOTTOLOG_OVERRIDES[name]
            source = "override"

        # 2. Exact name match in languages.csv
        if not glottocode:
            lname = name.lower()
            if lname in name_to_id:
                glottocode = name_to_id[lname]
                source = "exact"

        # 3. Alt-name match (single-ID only)
        if not glottocode:
            lname = name.lower()
            ids = altname_to_ids.get(lname, set())
            # Filter to language-level entries only
            lang_ids = {i for i in ids if langs_by_id.get(i, {}).get("Level") == "language"}
            if len(lang_ids) == 1:
                glottocode = next(iter(lang_ids))
                source = "altname"
            elif len(lang_ids) > 1:
                ambiguous[name] = sorted(lang_ids)

        # Resolve metadata
        if glottocode and glottocode in langs_by_id:
            row = langs_by_id[glottocode]
            fam_id = row.get("Family_ID", "")
            family = family_names.get(fam_id)
            if row.get("Level") == "language" and not fam_id:
                family = row["Name"] + " (isolate)"
            resolved[name] = {
                "glottocode": glottocode,
                "iso_code": row.get("ISO639P3code") or None,
                "family": family,
                "macroarea": row.get("Macroarea") or None,
                "source": source,
            }
        elif glottocode:
            resolved[name] = {
                "glottocode": glottocode,
                "iso_code": None,
                "family": None,
                "macroarea": None,
                "source": source + "_unresolved",
            }
        else:
            if name not in ambiguous:
                unresolved.append(name)

    return resolved, unresolved, ambiguous


# ═══════════════════════════════════════════════════════════════════════════════
# Step 3: CLDR script resolution
# ═══════════════════════════════════════════════════════════════════════════════

def load_cldr_scripts():
    """Load CLDR languageData.json → {iso_code: [script_code, ...]}."""
    with open(CLDR_LANGUAGE_DATA_JSON, encoding="utf-8") as f:
        data = json.load(f)
    ld = data.get("supplemental", {}).get("languageData", {})
    result = {}
    for code, info in ld.items():
        scripts = info.get("_scripts", [])
        if scripts:
            result[code] = scripts
    print(f"  CLDR: {len(result)} ISO codes with script data")
    return result


def resolve_scripts(resolved, cldr):
    """Add script_cldr to each resolved entry."""
    import langcodes

    matched = 0
    missing = []
    for name, entry in resolved.items():
        iso = entry.get("iso_code")
        if not iso:
            entry["script"] = None
            missing.append(name)
            continue

        cldr_code = None
        try:
            for tag in langcodes.Language.get(iso).broader_tags():
                if tag in cldr:
                    cldr_code = tag
                    break
        except Exception:
            if iso in cldr:
                cldr_code = iso

        if cldr_code:
            codes = cldr[cldr_code]
            primary = codes[0]
            entry["script"] = CLDR_SCRIPT_NAMES.get(primary, primary)
            matched += 1
        else:
            entry["script"] = None
            missing.append(name)

    print(f"  CLDR scripts: {matched}/{len(resolved)} matched")
    return missing


# ═══════════════════════════════════════════════════════════════════════════════
# Step 4: Joshi taxonomy
# ═══════════════════════════════════════════════════════════════════════════════

def load_lang2tax():
    """Load Joshi taxonomy → {lowercase_name: level}."""
    tax = {}
    with open(LANG2TAX_PATH, encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split(",")
            if len(parts) >= 2:
                name = ",".join(parts[:-1]).strip().lower()
                level = int(parts[-1].strip())
                tax[name] = level
    print(f"  Joshi taxonomy: {len(tax)} languages")
    return tax


def apply_joshi(resolved, raw_to_canonical):
    """Add joshi_level and related fields to each resolved entry."""
    tax = load_lang2tax()
    stats = Counter()
    joshi_unmatched = []

    # Build reverse alias map: canonical → set of raw names
    canonical_aliases = defaultdict(set)
    for raw, canonical in raw_to_canonical.items():
        if raw != canonical:
            canonical_aliases[canonical].add(raw)

    for name, entry in resolved.items():
        # 1. Check overrides
        if name in LANG2TAX_OVERRIDES:
            tax_name, source, rationale, dialect_of = LANG2TAX_OVERRIDES[name]
            if tax_name is not None:
                level = tax.get(tax_name)
                if level is None:
                    level = 0
                    source = "manual"
                    rationale += " [override target not found in lang2tax]"
            else:
                level = 0
            entry["joshi_level"] = level
            entry["joshi_level_name"] = JOSHI_LEVEL_NAMES[level]
            entry["joshi_source"] = source
            entry["joshi_rationale"] = rationale
            if dialect_of:
                entry["dialect_of"] = dialect_of
            stats[source] += 1
            continue

        # 2. Exact match
        lname = name.lower()
        if lname in tax:
            entry["joshi_level"] = tax[lname]
            entry["joshi_level_name"] = JOSHI_LEVEL_NAMES[tax[lname]]
            entry["joshi_source"] = "exact"
            entry["joshi_rationale"] = "Exact name match in lang2tax.txt"
            stats["exact"] += 1
            continue

        # 3. Alias match
        matched = False
        for alias in canonical_aliases.get(name, set()):
            if alias.lower() in tax:
                entry["joshi_level"] = tax[alias.lower()]
                entry["joshi_level_name"] = JOSHI_LEVEL_NAMES[tax[alias.lower()]]
                entry["joshi_source"] = "alias"
                entry["joshi_rationale"] = f"Matched via alias '{alias}'"
                stats["alias"] += 1
                matched = True
                break
        if matched:
            continue

        # 4. Fallback
        entry["joshi_level"] = 0
        entry["joshi_level_name"] = JOSHI_LEVEL_NAMES[0]
        entry["joshi_source"] = "fallback"
        entry["joshi_rationale"] = "Not in Joshi 2020; default level 0"
        stats["fallback"] += 1
        joshi_unmatched.append(name)

    print(f"  Joshi applied: {dict(stats)}")
    return joshi_unmatched


# ═══════════════════════════════════════════════════════════════════════════════
# Step 5: Continent resolution
# ═══════════════════════════════════════════════════════════════════════════════

def resolve_continents(resolved):
    """Add continent field. Priority: CONTINENT_OVERRIDES > Glottolog macroarea."""
    for name, entry in resolved.items():
        if name in CONTINENT_OVERRIDES:
            entry["continent"] = CONTINENT_OVERRIDES[name]
        elif entry.get("macroarea"):
            entry["continent"] = MACROAREA_TO_CONTINENT.get(
                entry["macroarea"], entry["macroarea"]
            )
        else:
            entry["continent"] = "Unknown"


def apply_metadata_overrides(resolved, language_overrides):
    """Apply reviewed secondary metadata exceptions after automatic resolution."""
    for name, override in language_overrides.items():
        entry = resolved.get(name)
        if entry is None:
            continue
        if "script" in override:
            entry["script"] = override["script"]
            entry["script_source"] = "metadata_override"
        if "continent" in override:
            entry["continent"] = override["continent"]
            entry["continent_source"] = "metadata_override"
        if "joshi_level" in override:
            level = override["joshi_level"]
            entry["joshi_level"] = level
            entry["joshi_level_name"] = JOSHI_LEVEL_NAMES[level]
            entry["joshi_source"] = "metadata_override"
            entry["joshi_rationale"] = override["rationale"]
        if "dialect_of" in override:
            entry["dialect_of"] = override["dialect_of"]


def validate_metadata(
    canonical_names,
    resolved,
    unresolved,
    ambiguous,
    duplicates,
    overrides,
    name_to_benchmarks,
):
    """Return actionable fatal errors for incomplete language metadata."""
    errors = []
    language_overrides = overrides["languages"]

    for name in sorted(unresolved):
        errors.append({
            "language": name,
            "problem": "No exact or unambiguous Glottolog language match was found.",
            "action": (
                "Add the verified glottocode under languages."
                f"{name}.glottocode in data/reference/language_metadata_overrides.json."
            ),
        })

    for name, candidates in sorted(ambiguous.items()):
        errors.append({
            "language": name,
            "problem": f"Glottolog name resolution is ambiguous: {', '.join(candidates)}.",
            "action": (
                "Select the correct candidate and add it under languages."
                f"{name}.glottocode in data/reference/language_metadata_overrides.json."
            ),
        })

    required_fields = {
        "glottocode": "a verified Glottocode",
        "iso_code": "an ISO 639-3 code",
        "family": "a language family",
        "script": "a script",
        "continent": "a region",
        "joshi_level": "an explicit Joshi resource level",
        "joshi_level_name": "a Joshi resource-level label",
    }
    for name, entry in sorted(resolved.items()):
        for field, description in required_fields.items():
            value = entry.get(field)
            if value is None or value == "" or value == "Unknown":
                errors.append({
                    "language": name,
                    "problem": f"Missing {description} ({field}).",
                    "action": (
                        f"Add a reviewed {field} override for languages.{name} in "
                        "data/reference/language_metadata_overrides.json."
                    ),
                })
        if entry.get("joshi_source") == "fallback":
            errors.append({
                "language": name,
                "problem": "No Joshi taxonomy match or explicit reviewed resource-level override exists.",
                "action": (
                    f"Add languages.{name}.joshi_level and a rationale in "
                    "data/reference/language_metadata_overrides.json."
                ),
            })

    unknown_overrides = sorted(set(language_overrides) - set(canonical_names))
    for name in unknown_overrides:
        errors.append({
            "language": name,
            "problem": "The override does not correspond to any language in benchmark step3 files.",
            "action": "Remove the stale override or correct the submitted language name.",
        })

    duplicate_exceptions = overrides["duplicate_glottocode_exceptions"]
    for glottocode, names in sorted(duplicates.items()):
        exception = duplicate_exceptions.get(glottocode)
        if exception is None or set(exception["languages"]) != set(names):
            errors.append({
                "language": ", ".join(sorted(names)),
                "problem": f"Unreviewed duplicate Glottocode {glottocode}.",
                "action": (
                    "Merge true aliases or add an exact, justified entry under "
                    "duplicate_glottocode_exceptions in "
                    "data/reference/language_metadata_overrides.json."
                ),
            })

    for glottocode in sorted(set(duplicate_exceptions) - set(duplicates)):
        errors.append({
            "language": ", ".join(duplicate_exceptions[glottocode]["languages"]),
            "problem": f"Stale duplicate-Glottocode exception {glottocode}.",
            "action": "Remove or update the exception to match the generated duplicate group.",
        })

    for error in errors:
        error["benchmarks"] = sorted(
            {
                benchmark
                for name in error["language"].split(", ")
                for benchmark in name_to_benchmarks.get(name, set())
            }
        )
    return errors


# ═══════════════════════════════════════════════════════════════════════════════
# Step 6: Detect duplicates (different canonical names → same glottocode)
# ═══════════════════════════════════════════════════════════════════════════════

def find_duplicates(resolved):
    """Find canonical names that resolve to the same glottocode."""
    glottocode_to_names = defaultdict(list)
    for name, entry in resolved.items():
        gc = entry.get("glottocode")
        if gc:
            glottocode_to_names[gc].append(name)
    return {gc: names for gc, names in glottocode_to_names.items() if len(names) > 1}


# ═══════════════════════════════════════════════════════════════════════════════
# Build registry and write outputs
# ═══════════════════════════════════════════════════════════════════════════════

def build_registry(resolved, raw_to_canonical, name_to_benchmarks):
    """Build the final registry dict."""
    registry = {}

    # Build canonical → aliases
    canonical_aliases = defaultdict(set)
    for raw, canonical in raw_to_canonical.items():
        if raw != canonical:
            canonical_aliases[canonical].add(raw)

    for name in sorted(resolved.keys()):
        entry = resolved[name]
        registry[name] = {
            "iso_code": entry.get("iso_code"),
            "glottocode": entry.get("glottocode"),
            "family": entry.get("family"),
            "script": entry.get("script"),
            "macroarea": entry.get("macroarea"),
            "continent": entry.get("continent", "Unknown"),
            "joshi_level": entry.get("joshi_level", 0),
            "joshi_level_name": entry.get("joshi_level_name", "Left-Behinds"),
            "joshi_source": entry.get("joshi_source", "fallback"),
            "joshi_rationale": entry.get("joshi_rationale", ""),
            "glottolog_source": entry.get("source", ""),
            "aliases": sorted(canonical_aliases.get(name, set())),
            "benchmarks": sorted(name_to_benchmarks.get(name, set())),
            "num_benchmarks": len(name_to_benchmarks.get(name, set())),
        }
        if entry.get("dialect_of"):
            registry[name]["dialect_of"] = entry["dialect_of"]

    return registry


def write_review_report(
    unresolved,
    ambiguous,
    duplicates,
    joshi_unmatched,
    script_missing,
    resolved,
    langs_by_id,
    name_to_benchmarks,
    metadata_errors,
):
    """Write the human review report."""
    lines = []
    lines.append("=" * 70)
    lines.append("  V2 LANGUAGE REGISTRY — HUMAN REVIEW REPORT")
    lines.append(f"  Generated: {datetime.now(timezone.utc).isoformat()}")
    lines.append("=" * 70)
    lines.append("")

    # Summary
    total = len(resolved) + len(unresolved) + len(ambiguous)
    lines.append(f"  Total unique canonical names: {total}")
    lines.append(f"  Resolved via Glottolog:       {len(resolved)}")
    lines.append(f"  Unresolved:                   {len(unresolved)}")
    lines.append(f"  Ambiguous:                    {len(ambiguous)}")
    lines.append(f"  Joshi unmatched:              {len(joshi_unmatched)}")
    lines.append(f"  CLDR script missing:          {len(script_missing)}")
    lines.append(f"  Duplicate glottocodes:         {len(duplicates)}")
    lines.append(f"  Fatal metadata errors:        {len(metadata_errors)}")
    lines.append("")

    lines.append("-" * 70)
    lines.append("  FATAL METADATA ERRORS")
    lines.append("-" * 70)
    if metadata_errors:
        for error in metadata_errors:
            lines.append(f"  Language: {error['language']}")
            if error["benchmarks"]:
                lines.append(f"    Benchmarks: {', '.join(error['benchmarks'])}")
            lines.append(f"    Problem: {error['problem']}")
            lines.append(f"    How to fix: {error['action']}")
            lines.append("")
    else:
        lines.append("  (none)")
        lines.append("")

    # UNRESOLVED NAMES
    lines.append("-" * 70)
    lines.append("  UNRESOLVED NAMES")
    lines.append("  Action: Add to GLOTTOLOG_OVERRIDES with correct glottocode")
    lines.append("-" * 70)
    if unresolved:
        for name in sorted(unresolved):
            bms = sorted(name_to_benchmarks.get(name, set()))
            lines.append(f"  {name}")
            lines.append(f"    Benchmarks: {', '.join(bms)}")
    else:
        lines.append("  (none)")
    lines.append("")

    # AMBIGUOUS MATCHES
    lines.append("-" * 70)
    lines.append("  AMBIGUOUS MATCHES")
    lines.append("  Action: Add to GLOTTOLOG_OVERRIDES with correct glottocode")
    lines.append("-" * 70)
    if ambiguous:
        for name in sorted(ambiguous.keys()):
            candidates = ambiguous[name]
            bms = sorted(name_to_benchmarks.get(name, set()))
            lines.append(f"  {name}")
            lines.append(f"    Benchmarks: {', '.join(bms)}")
            lines.append(f"    Candidates ({len(candidates)}):")
            for cid in candidates[:10]:
                row = langs_by_id.get(cid, {})
                lines.append(f"      {cid}: {row.get('Name', '?')} "
                             f"[ISO={row.get('ISO639P3code', '?')}, "
                             f"Family={row.get('Family_ID', '?')}, "
                             f"Macroarea={row.get('Macroarea', '?')}]")
            if len(candidates) > 10:
                lines.append(f"      ... and {len(candidates) - 10} more")
    else:
        lines.append("  (none)")
    lines.append("")

    # DUPLICATE GLOTTOCODES
    lines.append("-" * 70)
    lines.append("  DUPLICATE GLOTTOCODES (different names → same language)")
    lines.append("  Action: Merge via SEED_ALIASES if they should be the same,")
    lines.append("  or keep distinct if genuinely different (e.g., dialects)")
    lines.append("-" * 70)
    if duplicates:
        for gc, names in sorted(duplicates.items()):
            row = langs_by_id.get(gc, {})
            lines.append(f"  {gc} ({row.get('Name', '?')}):")
            for n in sorted(names):
                bms = sorted(name_to_benchmarks.get(n, set()))
                lines.append(f"    → {n} (in {len(bms)} benchmarks)")
    else:
        lines.append("  (none)")
    lines.append("")

    # JOSHI UNMATCHED
    lines.append("-" * 70)
    lines.append("  JOSHI UNMATCHED (resolved in Glottolog but not in Joshi taxonomy)")
    lines.append("  Action: Add to LANG2TAX_OVERRIDES or confirm level 0 default")
    lines.append("-" * 70)
    if joshi_unmatched:
        for name in sorted(joshi_unmatched):
            entry = resolved.get(name, {})
            lines.append(f"  {name} [family={entry.get('family', '?')}, "
                         f"iso={entry.get('iso_code', '?')}]")
    else:
        lines.append("  (none)")
    lines.append("")

    # CLDR SCRIPT MISSING
    lines.append("-" * 70)
    lines.append("  CLDR SCRIPT MISSING (valid ISO code but no script in CLDR)")
    lines.append("  Action: Add manual script entry or leave as null")
    lines.append("-" * 70)
    if script_missing:
        for name in sorted(script_missing):
            entry = resolved.get(name, {})
            lines.append(f"  {name} [iso={entry.get('iso_code', '?')}, "
                         f"family={entry.get('family', '?')}]")
    else:
        lines.append("  (none)")
    lines.append("")

    lines.append("=" * 70)
    lines.append("  END OF REVIEW REPORT")
    lines.append("=" * 70)

    with open(REVIEW_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"  Review report: {REVIEW_PATH}")


def write_json_atomic(path, document):
    temporary_path = path.with_suffix(path.suffix + ".tmp")
    with open(temporary_path, "w", encoding="utf-8") as f:
        json.dump(document, f, ensure_ascii=False, indent=2)
        f.write("\n")
    temporary_path.replace(path)


def print_metadata_errors(errors):
    print(f"\n[FAIL] Language metadata validation failed with {len(errors)} error(s).")
    for error in errors:
        print(f"\nLanguage: {error['language']}")
        if error["benchmarks"]:
            print(f"Benchmarks: {', '.join(error['benchmarks'])}")
        print(f"Problem: {error['problem']}")
        print(f"How to fix: {error['action']}")
    print("\nAfter correcting the source metadata, run:")
    print("  npm run update-evals")
    print("  npm run check-evals")


def main():
    print("=" * 60)
    print("  Build Language Registry V2")
    print("=" * 60)

    try:
        overrides = load_overrides()
    except (OSError, json.JSONDecodeError, ValueError) as error:
        print(f"\n[FAIL] {error}", file=sys.stderr)
        return 1

    # Step 1: Collect names
    print("\n[1/5] Collecting language names from V2 step3 files...")
    canonical_names, raw_to_canonical, name_to_benchmarks = collect_language_names(
        overrides["aliases"]
    )

    # Step 2: Glottolog resolution
    print("\n[2/5] Resolving via Glottolog...")
    langs_by_id, name_to_id, altname_to_ids, family_names = load_glottolog()
    resolved, unresolved, ambiguous = resolve_glottolog(
        canonical_names,
        langs_by_id,
        name_to_id,
        altname_to_ids,
        family_names,
        overrides["languages"],
    )
    print(f"  Resolved: {len(resolved)}, Unresolved: {len(unresolved)}, "
          f"Ambiguous: {len(ambiguous)}")

    # Step 3: CLDR scripts
    print("\n[3/5] Resolving CLDR scripts...")
    cldr = load_cldr_scripts()
    script_missing = resolve_scripts(resolved, cldr)

    # Step 4: Joshi taxonomy
    print("\n[4/5] Applying Joshi taxonomy...")
    joshi_unmatched = apply_joshi(resolved, raw_to_canonical)

    # Step 5: Continents
    print("\n[5/5] Resolving continents...")
    resolve_continents(resolved)
    apply_metadata_overrides(resolved, overrides["languages"])

    joshi_unmatched = [
        name for name in joshi_unmatched
        if resolved.get(name, {}).get("joshi_source") == "fallback"
    ]
    script_missing = [
        name for name in script_missing
        if not resolved.get(name, {}).get("script")
    ]

    # Find duplicates
    duplicates = find_duplicates(resolved)
    metadata_errors = validate_metadata(
        canonical_names,
        resolved,
        unresolved,
        ambiguous,
        duplicates,
        overrides,
        name_to_benchmarks,
    )

    # Build output
    registry = build_registry(resolved, raw_to_canonical, name_to_benchmarks)

    output = {
        "metadata": {
            "description": "V2 master language registry — single source of truth.",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "design_principle": "Only language names from extraction; all metadata from Glottolog/CLDR/Joshi.",
            "num_languages": len(registry),
            "joshi_level_scale": JOSHI_LEVEL_NAMES,
        },
        "languages": registry,
    }

    # Write review report
    write_review_report(
        unresolved, ambiguous, duplicates, joshi_unmatched,
        script_missing, resolved, langs_by_id, name_to_benchmarks,
        metadata_errors,
    )

    if metadata_errors:
        print_metadata_errors(metadata_errors)
        print("\nThe existing language registry was left unchanged.")
        return 1

    write_json_atomic(REGISTRY_PATH, output)
    print(f"\n  Wrote registry: {REGISTRY_PATH} ({len(registry)} languages)")

    print(f"\n{'=' * 60}")
    print(f"  SUMMARY")
    print(f"{'=' * 60}")
    print(f"  Languages in registry:  {len(registry)}")
    print(f"  Needs human review:     {len(unresolved) + len(ambiguous)}")
    print(f"  Joshi fallback (lvl 0): {len(joshi_unmatched)}")
    print(f"  Missing CLDR script:    {len(script_missing)}")
    print(f"  Duplicate glottocodes:  {len(duplicates)}")
    print(f"{'=' * 60}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
