import React, { Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToolById } from '../../lib/tool-registry';
import { LoadingScreen } from '../../components/ui/Loading';

// Lazy-load all tool components
const CaseConvert = React.lazy(() => import('./text/CaseConvert'));
const DedupSplit = React.lazy(() => import('./text/DedupSplit'));
const Replace = React.lazy(() => import('./text/Replace'));
const ReverseSort = React.lazy(() => import('./text/ReverseSort'));
const Numbering = React.lazy(() => import('./text/Numbering'));
const WordCount = React.lazy(() => import('./text/WordCount'));
const WordFreq = React.lazy(() => import('./text/WordFreq'));
const Typesetting = React.lazy(() => import('./text/Typesetting'));
const SpecialSymbols = React.lazy(() => import('./text/SpecialSymbols'));
const Emoji = React.lazy(() => import('./text/Emoji'));
const DuplicateCheck = React.lazy(() => import('./text/DuplicateCheck'));
const FancyFont = React.lazy(() => import('./text/FancyFont'));
const ToHtml = React.lazy(() => import('./text/ToHtml'));
const Workflow = React.lazy(() => import('./text/Workflow'));

// Codec tools
const Base64 = React.lazy(() => import('./codec/Base64'));
const Md5 = React.lazy(() => import('./codec/Md5'));
const Aes = React.lazy(() => import('./codec/Aes'));
const Sha1 = React.lazy(() => import('./codec/Sha1'));
const UrlCodec = React.lazy(() => import('./codec/Url'));
const FullHalf = React.lazy(() => import('./codec/FullHalf'));
const AsciiNative = React.lazy(() => import('./codec/AsciiNative'));
const Morse = React.lazy(() => import('./codec/Morse'));
const PasswordGen = React.lazy(() => import('./codec/PasswordGen'));
const RandomNumber = React.lazy(() => import('./codec/RandomNumber'));
const Guid = React.lazy(() => import('./codec/Guid'));

// Datetime tools
const DateCalc = React.lazy(() => import('./datetime/DateCalc'));
const Timestamp = React.lazy(() => import('./datetime/Timestamp'));
const TimestampBatch = React.lazy(() => import('./datetime/TimestampBatch'));
const Lunar = React.lazy(() => import('./datetime/Lunar'));
const Workday = React.lazy(() => import('./datetime/Workday'));
const WorldTime = React.lazy(() => import('./datetime/WorldTime'));
const EnFormat = React.lazy(() => import('./datetime/EnFormat'));
const Stopwatch = React.lazy(() => import('./datetime/Stopwatch'));
const Almanac = React.lazy(() => import('./datetime/Almanac'));
const SolarTerms = React.lazy(() => import('./datetime/SolarTerms'));
const Holiday = React.lazy(() => import('./datetime/Holiday'));
const Expiry = React.lazy(() => import('./datetime/Expiry'));
const Retirement = React.lazy(() => import('./datetime/Retirement'));
const RandomDate = React.lazy(() => import('./datetime/RandomDate'));

// Finance tools
const RmbUpper = React.lazy(() => import('./finance/RmbUpper'));
const CheckDate = React.lazy(() => import('./finance/CheckDate'));
const EnAmount = React.lazy(() => import('./finance/EnAmount'));
const Tax = React.lazy(() => import('./finance/Tax'));
const IncomeTax = React.lazy(() => import('./finance/IncomeTax'));
const LabourTax = React.lazy(() => import('./finance/LabourTax'));
const ExchangeRate = React.lazy(() => import('./finance/ExchangeRate'));
const CurrencyList = React.lazy(() => import('./finance/CurrencyList'));
const ListSum = React.lazy(() => import('./finance/ListSum'));
const Contract = React.lazy(() => import('./finance/Contract'));
const Loan = React.lazy(() => import('./finance/Loan'));
const BankCode = React.lazy(() => import('./finance/BankCode'));

// Devtools tools
const Naming = React.lazy(() => import('./devtools/Naming'));
const JsonEditor = React.lazy(() => import('./devtools/JsonEditor'));
const JsonFormatter = React.lazy(() => import('./devtools/JsonFormatter'));
const CssFormatter = React.lazy(() => import('./devtools/CssFormatter'));
const JsFormatter = React.lazy(() => import('./devtools/JsFormatter'));
const HtmlFormatter = React.lazy(() => import('./devtools/HtmlFormatter'));
const SqlFormatter = React.lazy(() => import('./devtools/SqlFormatter'));
const Regex = React.lazy(() => import('./devtools/Regex'));
const ColorConvert = React.lazy(() => import('./devtools/ColorConvert'));
const Crontab = React.lazy(() => import('./devtools/Crontab'));
const JsonToTs = React.lazy(() => import('./devtools/JsonToTs'));

// Language tools
const S2T = React.lazy(() => import('./language/S2T'));
const Pinyin = React.lazy(() => import('./language/Pinyin'));
const Cantonese = React.lazy(() => import('./language/Cantonese'));
const Idiom = React.lazy(() => import('./language/Idiom'));
const Translate = React.lazy(() => import('./language/Translate'));
const Wubi = React.lazy(() => import('./language/Wubi'));
const PinyinAbbr = React.lazy(() => import('./language/PinyinAbbr'));
const NamePinyin = React.lazy(() => import('./language/NamePinyin'));
const LangNumberEn = React.lazy(() => import('./language/NumberEn'));
const RandomIdiom = React.lazy(() => import('./language/RandomIdiom'));
const RandomPoem = React.lazy(() => import('./language/RandomPoem'));
const Inspire = React.lazy(() => import('./language/Inspire'));
const AntiPoison = React.lazy(() => import('./language/AntiPoison'));
const MovieQuotes = React.lazy(() => import('./language/MovieQuotes'));
const RandomEn = React.lazy(() => import('./language/RandomEn'));

// Image tools
const OCR = React.lazy(() => import('./image/OCR'));
const QRCodeGen = React.lazy(() => import('./image/QRCodeGen'));
const QRCodeDecode = React.lazy(() => import('./image/QRCodeDecode'));
const Barcode = React.lazy(() => import('./image/Barcode'));
const ISBN = React.lazy(() => import('./image/ISBN'));
const Compress = React.lazy(() => import('./image/Compress'));

// Convert tools
const Radix = React.lazy(() => import('./convert/Radix'));
const Length = React.lazy(() => import('./convert/Length'));
const Area = React.lazy(() => import('./convert/Area'));
const Weight = React.lazy(() => import('./convert/Weight'));
const Volume = React.lazy(() => import('./convert/Volume'));
const Temp = React.lazy(() => import('./convert/Temp'));
const Byte = React.lazy(() => import('./convert/Byte'));
const TimeUnit = React.lazy(() => import('./convert/TimeUnit'));
const Density = React.lazy(() => import('./convert/Density'));
const Pressure = React.lazy(() => import('./convert/Pressure'));
const NumberEn = React.lazy(() => import('./convert/NumberEn'));
const Coords = React.lazy(() => import('./convert/Coords'));
const Rect = React.lazy(() => import('./convert/Rect'));

// Life tools
const PhoneLookup = React.lazy(() => import('./life/PhoneLookup'));
const PhoneList = React.lazy(() => import('./life/PhoneList'));
const ZipCode = React.lazy(() => import('./life/ZipCode'));
const IdCard = React.lazy(() => import('./life/IdCard'));
const University = React.lazy(() => import('./life/University'));
const CountryCode = React.lazy(() => import('./life/CountryCode'));
const Capitals = React.lazy(() => import('./life/Capitals'));
const IntlCall = React.lazy(() => import('./life/IntlCall'));
const Reaction = React.lazy(() => import('./life/Reaction'));
const BloodType = React.lazy(() => import('./life/BloodType'));
const OilPrice = React.lazy(() => import('./life/OilPrice'));
const BMI = React.lazy(() => import('./life/BMI'));

// Network tools
const IpLookup = React.lazy(() => import('./network/IpLookup'));
const Whois = React.lazy(() => import('./network/Whois'));
const Icp = React.lazy(() => import('./network/Icp'));
const AltTag = React.lazy(() => import('./network/AltTag'));
const UserAgent = React.lazy(() => import('./network/UserAgent'));
const ContactExtract = React.lazy(() => import('./network/ContactExtract'));
const VideoParse = React.lazy(() => import('./network/VideoParse'));
const BulkOpen = React.lazy(() => import('./network/BulkOpen'));
const MacLookup = React.lazy(() => import('./network/MacLookup'));

const notFoundStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: 60,
  color: 'var(--text-muted)',
  fontSize: 16,
  fontFamily: 'var(--font-sans)',
};

const placeholderStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 12,
  background: 'var(--bg-tool)',
  border: '1px solid var(--border-light)',
  fontSize: 13,
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-sans)',
  marginBottom: 16,
};

const toolComponentMap: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'text-case-convert': CaseConvert,
  'text-dedup-split': DedupSplit,
  'text-replace': Replace,
  'text-reverse-sort': ReverseSort,
  'text-numbering': Numbering,
  'text-word-count': WordCount,
  'text-word-freq': WordFreq,
  'text-typesetting': Typesetting,
  'text-special-symbols': SpecialSymbols,
  'text-emoji': Emoji,
  'text-duplicate-check': DuplicateCheck,
  'text-fancy-font': FancyFont,
  'text-to-html': ToHtml,
  'text-workflow': Workflow,

  // Codec
  'codec-base64': Base64,
  'codec-md5': Md5,
  'codec-aes': Aes,
  'codec-sha1': Sha1,
  'codec-url': UrlCodec,
  'codec-full-half': FullHalf,
  'codec-ascii-native': AsciiNative,
  'codec-morse': Morse,
  'codec-password-gen': PasswordGen,
  'codec-random-number': RandomNumber,
  'codec-guid': Guid,

  // Datetime
  'date-calc': DateCalc,
  'date-timestamp': Timestamp,
  'date-timestamp-batch': TimestampBatch,
  'date-lunar': Lunar,
  'date-workday': Workday,
  'date-world-time': WorldTime,
  'date-en-format': EnFormat,
  'date-stopwatch': Stopwatch,
  'date-almanac': Almanac,
  'date-solar-terms': SolarTerms,
  'date-holiday': Holiday,
  'date-expiry': Expiry,
  'date-retirement': Retirement,
  'date-random': RandomDate,

  // Finance
  'fin-rmb-upper': RmbUpper,
  'fin-check-date': CheckDate,
  'fin-en-amount': EnAmount,
  'fin-tax': Tax,
  'fin-income-tax': IncomeTax,
  'fin-labour-tax': LabourTax,
  'fin-exchange-rate': ExchangeRate,
  'fin-currency-list': CurrencyList,
  'fin-list-sum': ListSum,
  'fin-contract': Contract,
  'fin-loan': Loan,
  'fin-bank-code': BankCode,

  // Devtools
  'dev-naming': Naming,
  'dev-json-editor': JsonEditor,
  'dev-json-formatter': JsonFormatter,
  'dev-css-formatter': CssFormatter,
  'dev-js-formatter': JsFormatter,
  'dev-html-formatter': HtmlFormatter,
  'dev-sql-formatter': SqlFormatter,
  'dev-regex': Regex,
  'dev-color-convert': ColorConvert,
  'dev-crontab': Crontab,
  'dev-json-to-ts': JsonToTs,

  // Language
  'lang-s2t': S2T,
  'lang-pinyin': Pinyin,
  'lang-cantonese': Cantonese,
  'lang-idiom': Idiom,
  'lang-translate': Translate,
  'lang-wubi': Wubi,
  'lang-pinyin-abbr': PinyinAbbr,
  'lang-name-pinyin': NamePinyin,
  'lang-number-en': LangNumberEn,
  'lang-random-idiom': RandomIdiom,
  'lang-random-poem': RandomPoem,
  'lang-inspire': Inspire,
  'lang-antipoison': AntiPoison,
  'lang-movie-quotes': MovieQuotes,
  'lang-random-en': RandomEn,

  // Image
  'img-ocr': OCR,
  'img-qrcode-gen': QRCodeGen,
  'img-qrcode-decode': QRCodeDecode,
  'img-barcode': Barcode,
  'img-isbn': ISBN,
  'img-compress': Compress,

  // Convert
  'conv-radix': Radix,
  'conv-length': Length,
  'conv-area': Area,
  'conv-weight': Weight,
  'conv-volume': Volume,
  'conv-temp': Temp,
  'conv-byte': Byte,
  'conv-time-unit': TimeUnit,
  'conv-density': Density,
  'conv-pressure': Pressure,
  'conv-number-en': NumberEn,
  'conv-coords': Coords,
  'conv-rect': Rect,

  // Life
  'life-phone-lookup': PhoneLookup,
  'life-phone-list': PhoneList,
  'life-zip-code': ZipCode,
  'life-id-card': IdCard,
  'life-university': University,
  'life-country-code': CountryCode,
  'life-capitals': Capitals,
  'life-intl-call': IntlCall,
  'life-reaction': Reaction,
  'life-blood-type': BloodType,
  'life-oil-price': OilPrice,
  'life-bmi': BMI,

  // Network
  'net-ip': IpLookup,
  'net-whois': Whois,
  'net-icp': Icp,
  'net-alt': AltTag,
  'net-ua': UserAgent,
  'net-contact-extract': ContactExtract,
  'net-video-parse': VideoParse,
  'net-bulk-open': BulkOpen,
  'net-mac': MacLookup,
};

export default function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const tool = getToolById(toolId || '');

  if (!toolId) {
    return <div style={notFoundStyle}>工具 ID 不能为空</div>;
  }

  if (!tool) {
    return (
      <div style={notFoundStyle}>
        <p style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>工具未找到</p>
        <p>工具 "{toolId}" 尚未实现或不存在</p>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: 16,
            padding: '8px 20px',
            borderRadius: 12,
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          返回首页
        </button>
      </div>
    );
  }

  const ToolComponent = toolComponentMap[tool.id];

  if (!ToolComponent) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          fontSize: 28, fontWeight: 800, color: 'var(--text-primary)',
          fontFamily: 'var(--font-sans)', marginBottom: 8,
        }}>
          {tool.name}
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
          {tool.description}
        </div>
        <div style={placeholderStyle}>
          💡 此工具正在开发中...
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <ToolComponent />
    </Suspense>
  );
}
