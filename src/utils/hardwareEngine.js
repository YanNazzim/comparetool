// src/utils/hardwareEngine.js
import allBrandsData from '../data/products';

/**
 * Sargent ANSI / BHMA Function Code Definitions
 */
export const SARGENT_FUNCTION_CODES = {
  '13': {
    code: '13',
    ansi: 'ANSI 08',
    name: 'Classroom / Key Locks & Unlocks Outside Lever',
    description: 'Key outside locks and unlocks the outside ET lever control. Inside push rail always free for immediate egress.',
    vdSuffix: 'L',
    vdAnsi: 'ANSI 08'
  },
  '04': {
    code: '04',
    ansi: 'ANSI 03',
    name: 'Night Latch / Key Retracts Latchbolt',
    description: 'Latching bolt is retracted by key outside or inside push rail. Outside lever is rigid or standalone pull required.',
    vdSuffix: 'NL',
    vdAnsi: 'ANSI 03'
  },
  '10': {
    code: '10',
    ansi: 'ANSI 01',
    name: 'Exit Only / No Outside Trim',
    description: 'No outside trim or cylinder. Purely an exit device operated by depressing the interior push rail.',
    vdSuffix: 'EO',
    vdAnsi: 'ANSI 01'
  },
  '15': {
    code: '15',
    ansi: 'ANSI 14',
    name: 'Passage / Always Operable',
    description: 'Outside lever always operable without a key (blank escutcheon, no cylinder). Push rail operates normally.',
    vdSuffix: 'L-BE',
    vdAnsi: 'ANSI 14'
  },
  '06': {
    code: '06',
    ansi: 'ANSI 06',
    name: 'Key Unlocks Trim / Relocks on Key Removal',
    description: 'Key unlocks trim, trim retracts latchbolt. Trim automatically relocks when key is removed.',
    vdSuffix: 'L-06',
    vdAnsi: 'ANSI 06'
  },
  '40': {
    code: '40',
    ansi: 'ANSI 02',
    name: 'Freewheeling Dummy Trim (Pull When Dogged)',
    description: 'Rigid or freewheeling lever dummy trim. Outside lever operates as pull only when exit device is dogged down.',
    vdSuffix: 'L-DT',
    vdAnsi: 'ANSI 02'
  },
  '44': {
    code: '44',
    ansi: 'ANSI 03',
    name: 'Freewheeling Night Latch',
    description: 'Key outside retracts latchbolt. Outside freewheeling lever prevents forced entry vandalism.',
    vdSuffix: 'L-NL',
    vdAnsi: 'ANSI 03'
  },
  '73': {
    code: '73',
    ansi: 'ANSI Grade 1 Electrified',
    name: 'Fail Safe Electrified ET Trim',
    description: 'Power on locks outside lever; power off unlocks outside lever. Allows emergency unlocking on fire alarm.',
    vdSuffix: 'E-L (FS)',
    vdAnsi: 'ANSI Electrified'
  },
  '74': {
    code: '74',
    ansi: 'ANSI Grade 1 Electrified',
    name: 'Fail Secure Electrified ET Trim',
    description: 'Power on unlocks outside lever; power off keeps outside lever locked. Auxiliary key override available.',
    vdSuffix: 'E-L (FSE)',
    vdAnsi: 'ANSI Electrified'
  },
  '75': {
    code: '75',
    ansi: 'ANSI Grade 1 Electrified',
    name: 'Electrified ET Trim w/ Cylinder Override (Fail Safe)',
    description: 'Remote electric locking of outside trim with mechanical mortise cylinder override.',
    vdSuffix: 'E-L w/ Override',
    vdAnsi: 'ANSI Electrified'
  },
  '76': {
    code: '76',
    ansi: 'ANSI Grade 1 Electrified',
    name: 'Electrified ET Trim w/ Cylinder Override (Fail Secure)',
    description: 'Remote electric unlocking of outside trim with mechanical mortise cylinder override.',
    vdSuffix: 'E-L w/ Override',
    vdAnsi: 'ANSI Electrified'
  }
};

/**
 * Flat Product Index for fast lookups
 */
export function buildProductIndex() {
  const byId = new Map();
  const allList = [];

  allBrandsData.forEach(brandData => {
    brandData.categories.forEach(categoryData => {
      categoryData.subCategories.forEach(subCategoryData => {
        subCategoryData.series.forEach(seriesData => {
          seriesData.models.forEach(modelData => {
            modelData.functions.forEach(func => {
              const enriched = {
                ...func,
                brand: brandData.brand,
                category: categoryData.name,
                subCategory: subCategoryData.name,
                seriesName: seriesData.seriesName,
                modelNumber: modelData.modelNumber,
              };
              byId.set(func.id.toLowerCase(), enriched);
              allList.push(enriched);
            });
          });
        });
      });
    });
  });

  return { byId, allList };
}

export const { byId: productIndexById, allList: allIndexedProducts } = buildProductIndex();

export function findProductById(productId) {
  if (!productId) return null;
  return productIndexById.get(productId.toLowerCase()) || null;
}

/**
 * Authoritative Von Duprin Nomenclature Resolver
 * Accurately decodes catalog numbers, authentic trim models, and function suffixes.
 */
export function resolveVonDuprinCallout(product) {
  if (!product) return null;
  const id = (product.id || '').toLowerCase();
  const series = product.seriesName || '';
  const model = product.modelNumber || '';
  const funcName = product.functionName || '';

  // 1. Determine Base Chassis
  let baseChassis = '';
  let chassisType = 'Rim Exit Device';

  if (model.includes('7847WDC')) { baseChassis = '7847WDC'; chassisType = 'Wood Door Concealed Vertical Rod'; }
  else if (model.includes('7827')) { baseChassis = '7827'; chassisType = 'Surface Vertical Rod Device'; }
  else if (model.includes('7847')) { baseChassis = '7847'; chassisType = 'Concealed Vertical Rod Device'; }
  else if (series.includes('78') || model.includes('78 Rim') || id.includes('vd-78-rim')) { baseChassis = '78'; chassisType = 'Wide Stile Rim Exit Device'; }
  else if (model.includes('7527')) { baseChassis = '7527'; chassisType = 'Surface Vertical Rod Device'; }
  else if (model.includes('7547')) { baseChassis = '7547'; chassisType = 'Concealed Vertical Rod Device'; }
  else if (series.includes('75') || model.includes('75 Rim') || id.includes('vd-75-rim')) { baseChassis = '75'; chassisType = 'Narrow Stile Rim Exit Device'; }
  else if (model.includes('8875') || id.includes('8875')) { baseChassis = '8875'; chassisType = 'Wide Stile Mortise Lock Exit Device'; }
  else if (model.includes('8827') || id.includes('8827')) { baseChassis = '8827'; chassisType = 'Surface Mounted Vertical Rod Device'; }
  else if (model.includes('8847') || id.includes('8847')) { baseChassis = '8847'; chassisType = 'Concealed Vertical Rod Device'; }
  else if (series.includes('88') || model.includes('88 Rim') || id.includes('vd-88-rim')) { baseChassis = '88'; chassisType = 'Wide Stile Crossbar Rim Exit Device'; }
  else if (model.includes('5575') || id.includes('5575')) { baseChassis = '5575'; chassisType = 'Narrow Stile Mortise Lock Exit Device'; }
  else if (model.includes('5547WDC')) { baseChassis = '5547WDC'; chassisType = 'Wood Door Concealed Vertical Rod'; }
  else if (model.includes('5547') || id.includes('5547')) { baseChassis = '5547'; chassisType = 'Concealed Vertical Rod Device'; }
  else if (series.includes('55') || model.includes('55 Rim') || id.includes('vd-55-rim')) { baseChassis = '55'; chassisType = 'Narrow Stile Crossbar Rim Exit Device'; }
  else if (model.includes('9475') || model.includes('9575') || id.includes('9475')) { baseChassis = '9475'; chassisType = 'INPACT Recessed Mortise Lock Device'; }
  else if (model.includes('9447') || model.includes('9547') || id.includes('9447')) { baseChassis = '9447'; chassisType = 'INPACT Recessed Concealed Vertical Rod'; }
  else if (model.includes('3327') || model.includes('3527') || id.includes('3327')) { baseChassis = '3327A'; chassisType = 'Narrow Stile Surface Vertical Rod'; }
  else if (model.includes('3347') || model.includes('3547') || id.includes('3347')) { baseChassis = '3347A'; chassisType = 'Narrow Stile Concealed Vertical Rod'; }
  else if (series.includes('33') || series.includes('35') || model.includes('33A') || model.includes('35A') || id.includes('vd-33-rim')) { baseChassis = '33A'; chassisType = 'Narrow Stile Rim Exit Device'; }
  else if (model.includes('9847WDC') || model.includes('9947WDC')) { baseChassis = '9847WDC'; chassisType = 'Wood Door Concealed Vertical Rod'; }
  else if (model.includes('9875') || model.includes('9975') || id.includes('9875')) { baseChassis = '9875'; chassisType = 'Wide Stile Mortise Lock Exit Device'; }
  else if (model.includes('9827') || model.includes('9927') || id.includes('9827')) { baseChassis = '9827'; chassisType = 'Wide Stile Surface Vertical Rod'; }
  else if (model.includes('9847') || model.includes('9947') || id.includes('9847')) { baseChassis = '9847'; chassisType = 'Wide Stile Concealed Vertical Rod'; }
  else if (model.includes('9857') || model.includes('9957') || id.includes('9857')) { baseChassis = '9857'; chassisType = 'Three-Point Latch Exit Device'; }
  else if (series.includes('98') || series.includes('99') || id.includes('vd-98-') || id.includes('vd-99-')) { baseChassis = '98'; chassisType = 'Wide Stile Rim Exit Device'; }
  else if (model.includes('2227') || id.includes('2227')) { baseChassis = '2227'; chassisType = 'Surface Vertical Rod Device'; }
  else if (series.includes('22') || id.includes('vd-22-')) { baseChassis = '22'; chassisType = 'Standard Rim Exit Device'; }
  else {
    const rawMatch = id.match(/vd-(?:33-|88-|55-|75-|78-|94-)?([0-9a-z]+)/i);
    baseChassis = rawMatch ? rawMatch[1].toUpperCase() : '98';
  }

  // 2. Determine Function Suffix, Trim Callout, and ANSI Code
  let suffix = 'L';
  let calloutSuffix = 'L';
  let ansiCode = 'ANSI 08';
  let functionTitle = 'Key Locks and Unlocks Outside Lever';
  let outsideTrim = '';

  if (id.includes('m996l-be') || id.includes('e360l-be') || id.includes('e373l-be') || id.includes('e780l-lbe')) {
    suffix = 'E-L (BE)';
    calloutSuffix = 'E-L';
    ansiCode = 'ANSI Grade 1 Electrified';
    functionTitle = 'Electrified Lever Control (Fail Safe / Fail Secure, Blank Escutcheon)';
    outsideTrim = baseChassis.startsWith('78') ? 'E780L-BE Electric Escutcheon Trim'
      : baseChassis.startsWith('75') || baseChassis.startsWith('33') ? 'E360L-BE Electric Lever Trim'
      : baseChassis.startsWith('88') ? 'E373L-BE Electric Control'
      : 'E996L-BE Electric Lever Trim';
  } else if (id.includes('m996l') || id.includes('e360l') || id.includes('e373l') || id.includes('e780l')) {
    suffix = 'E-L';
    calloutSuffix = 'E-L';
    ansiCode = 'ANSI Grade 1 Electrified';
    functionTitle = 'Electrified Lever Control w/ Key Override';
    outsideTrim = baseChassis.startsWith('78') ? 'E780L Electric Lever Trim'
      : baseChassis.startsWith('75') || baseChassis.startsWith('33') ? 'E360L Electric Lever Trim'
      : baseChassis.startsWith('88') ? 'E373L Electric Control'
      : 'E996L Electric Lever Trim';
  } else if (id.includes('l-be') || funcName.includes('Blank Escutcheon') || funcName.includes('Passage')) {
    suffix = 'L-BE';
    calloutSuffix = 'L-BE';
    ansiCode = 'ANSI 14';
    functionTitle = 'Passage Lever - Always Operable (No Cylinder)';
    outsideTrim = baseChassis.startsWith('78') ? '780L-BE Escutcheon Lever Trim'
      : baseChassis.startsWith('75') ? '360L-BE Escutcheon Lever Trim'
      : baseChassis.startsWith('33') ? '374L-BE Escutcheon Lever Trim'
      : baseChassis.startsWith('88') ? '373L-BE / 880L-BE Lever Trim'
      : baseChassis.startsWith('94') || baseChassis.startsWith('95') ? '940L-BE Escutcheon Trim'
      : '996L-BE Breakaway Lever Trim';
  } else if (id.includes('l-dt') || funcName.includes('Lever Dummy')) {
    suffix = 'L-DT';
    calloutSuffix = 'L-DT';
    ansiCode = 'ANSI 02';
    functionTitle = 'Dummy Trim Lever - Rigid Lever, Pull When Dogged';
    outsideTrim = baseChassis.startsWith('78') ? '780L-DT Escutcheon Trim'
      : baseChassis.startsWith('75') ? '360L-DT Escutcheon Trim'
      : baseChassis.startsWith('33') ? '374L-DT Escutcheon Trim'
      : baseChassis.startsWith('88') ? '880L-DT Trim'
      : '996L-DT Rigid Lever Trim';
  } else if (id.includes('l-nl') || funcName.includes('L-NL')) {
    suffix = 'L-NL';
    calloutSuffix = 'L-NL';
    ansiCode = 'ANSI 03';
    functionTitle = 'Night Latch Lever - Key Retracts Latch, Rigid Lever';
    outsideTrim = baseChassis.startsWith('78') ? '780L-NL Escutcheon Trim'
      : baseChassis.startsWith('75') ? '360L-NL Escutcheon Trim'
      : baseChassis.startsWith('33') ? '374L-NL Escutcheon Trim'
      : baseChassis.startsWith('88') ? '880L-NL Trim'
      : '996L-NL Night Latch Lever Trim';
  } else if (id.includes('l-kc') || funcName.includes('Key Capture')) {
    suffix = 'L-06';
    calloutSuffix = 'L-06';
    ansiCode = 'ANSI 09';
    functionTitle = 'Key Capture Lever - Key Unlocks, Retracts Latch Bolt';
    outsideTrim = '996L-06 Key Capture Trim';
  } else if (id.includes('nl-op') || funcName.includes('NL-OP')) {
    suffix = 'NL-OP';
    calloutSuffix = 'NL-OP';
    ansiCode = 'ANSI 03';
    functionTitle = 'Night Latch - Standalone Pull Required';
    outsideTrim = baseChassis.startsWith('78') ? '785NL Pull Trim'
      : baseChassis.startsWith('75') ? '386NL Pull Trim'
      : baseChassis.startsWith('88') ? '880NL Pull Trim'
      : '110NL Cylinder Assembly x Standalone Pull';
  } else if (id.includes('-nl') || funcName.includes('Night Latch')) {
    suffix = 'NL';
    calloutSuffix = 'NL';
    ansiCode = 'ANSI 03';
    functionTitle = 'Night Latch - Key Retracts Latch Bolt';
    outsideTrim = baseChassis.startsWith('78') ? '785NL Pull Trim'
      : baseChassis.startsWith('75') ? '386NL Pull Trim'
      : baseChassis.startsWith('88') ? '880NL Pull Trim'
      : baseChassis.startsWith('55') ? '555NL / 556NL Pull Trim'
      : '990NL Pull Plate Trim';
  } else if (id.includes('-dt') || funcName.includes('Dummy Trim')) {
    suffix = 'DT';
    calloutSuffix = 'DT';
    ansiCode = 'ANSI 02';
    functionTitle = 'Dummy Trim - Pull Plate, Operable When Dogged';
    outsideTrim = baseChassis.startsWith('78') ? '785DT Pull Trim'
      : baseChassis.startsWith('75') ? '386DT Pull Trim'
      : baseChassis.startsWith('88') ? '880DT Pull Trim'
      : baseChassis.startsWith('55') ? '550DT Heavy Pull'
      : '990DT Pull Plate Trim';
  } else if (id.includes('-eo') || funcName.includes('Exit Only')) {
    suffix = 'EO';
    calloutSuffix = 'EO';
    ansiCode = 'ANSI 01';
    functionTitle = 'Exit Only - No Outside Operation';
    outsideTrim = 'Exit Only (No Outside Trim)';
  } else if (id.includes('-tl') || funcName.includes('Thumbturn') || funcName.includes('Turn Lever')) {
    suffix = 'TL';
    calloutSuffix = 'TL';
    ansiCode = 'ANSI 11/12';
    functionTitle = 'Turn Lever / Thumbturn - Key Locks and Unlocks';
    outsideTrim = baseChassis.startsWith('78') ? '785DT x 374T/376T Trim'
      : baseChassis.startsWith('75') ? '386DT x 374T/376T Trim'
      : '376T Thumbturn Control';
  } else if (id.includes('-tp') || funcName.includes('Thumbpiece')) {
    suffix = 'TP';
    calloutSuffix = 'TP';
    ansiCode = 'ANSI 05';
    functionTitle = 'Thumbpiece Trim - Key Locks and Unlocks';
    outsideTrim = '880TP Thumbpiece Trim';
  } else if (id.includes('-k') || funcName.includes('Knob')) {
    suffix = 'K';
    calloutSuffix = 'K';
    ansiCode = 'ANSI 08';
    functionTitle = 'Knob Trim - Key Locks and Unlocks';
    outsideTrim = '880K Knob Trim';
  } else {
    // Standard Classroom Lever (L)
    suffix = 'L';
    calloutSuffix = 'L';
    ansiCode = 'ANSI 08';
    functionTitle = 'Classroom Lever - Key Outside Unlocks/Locks Outside Lever';
    outsideTrim = baseChassis.startsWith('78') ? '780L Escutcheon Trim (9-3/4" x 2-3/4")'
      : baseChassis.startsWith('75') ? '360L Escutcheon Trim (7-1/2" x 1-11/16")'
      : baseChassis.startsWith('88') ? '373L Lever Control / 880L Heavy Trim'
      : baseChassis.startsWith('55') ? (baseChassis.includes('5575') ? '375L Mortise Lever Trim' : '379L Rim Lever Trim')
      : baseChassis.startsWith('94') || baseChassis.startsWith('95') ? '940L Forged Brass Escutcheon Trim'
      : baseChassis.startsWith('33') || baseChassis.startsWith('35') ? '374L / 378L Escutcheon Trim'
      : baseChassis.startsWith('22') ? '210L / 230L Heavy Lever Trim'
      : '996L Breakaway Lever Escutcheon Trim';
  }

  // 3. Construct Genuine Catalog Number
  let combinedNumber = '';
  if (baseChassis.startsWith('33') || baseChassis.startsWith('35')) {
    combinedNumber = `${baseChassis}-${calloutSuffix}`;
  } else {
    combinedNumber = `${baseChassis}${calloutSuffix}`;
  }

  return {
    baseChassis,
    chassisType,
    suffix,
    calloutSuffix,
    ansiCode,
    combinedNumber,
    functionTitle,
    codeLabel: `VD Suffix: ${suffix} (${ansiCode})`,
    outsideTrim
  };
}

/**
 * Authoritative Sargent Nomenclature Resolver
 */
export function resolveSargentCallout(product) {
  if (!product) return null;
  const id = (product.id || '').toLowerCase();
  const funcName = product.functionName || '';
  let trim = '';

  if (id.endsWith('-et-pull')) trim = 'ET Pull';
  else if (id.endsWith('-et')) trim = 'ET';
  else if (id.endsWith('-pull')) trim = 'Pull';

  const idDashMatch = id.match(/sargent-(?:pe)?(\d{4})-(\d{2})(?:-(?:et|pull))?$/i);
  const idDirectMatch = id.match(/sargent-([a-z]*?)(\d{2})(\d{2})(?:-(?:et|pull))?$/i);

  let combinedNumber = '';
  let functionCode = '';

  if (idDashMatch) {
    const chassisNum = idDashMatch[1];
    functionCode = idDashMatch[2];
    const isPe = id.includes('sargent-pe');
    if (['9800', '9900', '9700', '9400'].includes(chassisNum)) {
      combinedNumber = `${chassisNum.slice(0, 2)}${functionCode}${trim ? ' ' + trim : ''}`;
    } else if (chassisNum === '5300') {
      combinedNumber = `53${functionCode}${trim ? ' ' + trim : ''}`;
    } else if (['3828', '3727', '2828', '2727'].includes(chassisNum)) {
      combinedNumber = `${chassisNum} (Func ${functionCode})`;
    } else {
      const pfx = isPe ? `PE${chassisNum.slice(0, 2)}` : chassisNum.slice(0, 2);
      combinedNumber = `${pfx}${functionCode}${trim ? ' ' + trim : ''}`;
    }
  } else if (idDirectMatch) {
    const pfx = idDirectMatch[1].toUpperCase();
    const chBase = idDirectMatch[2];
    functionCode = idDirectMatch[3];
    combinedNumber = `${pfx}${chBase}${functionCode}${trim ? ' ' + trim : ''}`;
  } else {
    combinedNumber = product.modelNumber;
    if (funcName.includes('ANSI 08')) functionCode = '13';
    else if (funcName.includes('ANSI 03')) functionCode = '04';
    else if (funcName.includes('ANSI 01')) functionCode = '10';
    else if (funcName.includes('ANSI 14')) functionCode = '15';
    else if (funcName.includes('ANSI 06')) functionCode = '06';
  }

  const sInfo = SARGENT_FUNCTION_CODES[functionCode];
  const ansi = sInfo ? sInfo.ansi : (funcName.match(/ANSI\s*(\d{2})/i) ? `ANSI ${funcName.match(/ANSI\s*(\d{2})/i)[1]}` : 'ANSI Grade 1');

  return {
    combinedNumber: combinedNumber || product.modelNumber,
    functionCode: functionCode || '13',
    ansiCode: ansi,
    functionTitle: sInfo ? sInfo.name : funcName,
    codeLabel: functionCode ? `Sargent Function Code: ${functionCode}` : '',
    outsideTrim: trim ? `${trim} Lever Control Trim (700 Series)` : 'Heavy Architectural Trim',
    vdSuffixEquivalent: sInfo ? sInfo.vdSuffix : 'L'
  };
}

/**
 * Standard Product Spec Info Generator for both Sargent and Competitors
 */
export function getProductSpecInfo(product) {
  if (!product) return null;

  if (product.brand === 'Sargent') {
    const s = resolveSargentCallout(product);
    return {
      brand: 'Sargent',
      series: product.seriesName,
      chassis: `${product.seriesName} (${product.modelNumber})`,
      combinedNumber: s.combinedNumber,
      functionCode: s.functionCode,
      ansiCode: s.ansiCode,
      codeLabel: s.codeLabel,
      trimStyle: s.outsideTrim,
      description: product.description?.replace(/<[^>]+>/g, '') || s.functionTitle
    };
  }

  if (product.brand === 'Von Duprin') {
    const vd = resolveVonDuprinCallout(product);
    return {
      brand: 'Von Duprin',
      series: product.seriesName,
      chassis: `${product.seriesName} (${product.modelNumber})`,
      combinedNumber: vd.combinedNumber,
      functionCode: vd.suffix,
      ansiCode: vd.ansiCode,
      codeLabel: vd.codeLabel,
      trimStyle: vd.outsideTrim,
      description: product.description?.replace(/<[^>]+>/g, '') || vd.functionTitle
    };
  }

  return {
    brand: product.brand,
    series: product.seriesName,
    chassis: `${product.seriesName} (${product.modelNumber})`,
    combinedNumber: product.modelNumber,
    functionCode: '',
    ansiCode: product.functionName?.match(/ANSI\s*(\d{2})/i) ? `ANSI ${product.functionName.match(/ANSI\s*(\d{2})/i)[1]}` : 'ANSI Grade 1',
    codeLabel: product.functionName,
    trimStyle: 'Architectural Trim',
    description: product.description?.replace(/<[^>]+>/g, '')
  };
}

/**
 * Find Equivalents for Product 1 in chosen target brand
 */
export function findEquivalentProducts(product1, targetBrandName) {
  if (!product1 || !targetBrandName || !product1.equivalentProductIds) return [];

  return product1.equivalentProductIds
    .map(findProductById)
    .filter(p => p && p.brand.toLowerCase() === targetBrandName.toLowerCase());
}

/**
 * Offline Natural Language & Spec Query Processor (No external AI connected)
 */
export function parseHardwareQuery(rawQuery) {
  if (!rawQuery || typeof rawQuery !== 'string') {
    return {
      type: 'EMPTY',
      text: 'Please enter a hardware model number or question to get started.'
    };
  }

  const query = rawQuery.trim().toLowerCase();

  // 1. Direct Sargent Model Search (e.g. 8313, 8513, 8804, 8813, 8713, PE8813, 8204)
  const sargentModelMatch = query.match(/\b(pe8[0-9]{3}|8[0-9]{3}|9[0-9]{3}|3[0-9]{3}|53[0-9]{2})\b/i);
  if (sargentModelMatch) {
    const num = sargentModelMatch[1].toLowerCase();
    const candidate = allIndexedProducts.find(p => p.brand === 'Sargent' && p.id.toLowerCase().includes(num));
    if (candidate) {
      const equivalents = findEquivalentProducts(candidate, 'Von Duprin');
      const sSpec = getProductSpecInfo(candidate);
      const vdSpec = equivalents[0] ? getProductSpecInfo(equivalents[0]) : null;

      return {
        type: 'PRODUCT_MATCH',
        product1: candidate,
        product2: equivalents[0] || null,
        title: `Sargent ${sSpec.combinedNumber} Architectural Specification`,
        text: `### 🚪 Sargent ${sSpec.combinedNumber} vs ${vdSpec ? vdSpec.combinedNumber : 'Von Duprin Equivalent'}\n\n` +
          `• **Manufacturer Baseline:** Sargent (${candidate.seriesName} - ${candidate.modelNumber})\n` +
          `• **Function Code:** ${sSpec.functionCode} (${sSpec.ansiCode})\n` +
          `• **Outside Trim:** ${sSpec.trimStyle}\n` +
          `• **List Price:** ${candidate.minPrice ? `$${candidate.minPrice.toFixed(2)} - $${candidate.maxPrice.toFixed(2)}` : 'Pricing TBD'}\n\n` +
          (vdSpec
            ? `#### ⚖️ Direct Von Duprin Callout: **${vdSpec.combinedNumber}**\n` +
              `• **Von Duprin Series:** ${vdSpec.series} (${vdSpec.chassis})\n` +
              `• **Von Duprin Trim:** ${vdSpec.trimStyle}\n` +
              `• **ANSI Function Suffix:** **${vdSpec.functionCode}** (${vdSpec.ansiCode})\n` +
              `• **Specification Status:** Fully Approved Grade 1 Equivalent`
            : `*No direct automated Von Duprin equivalent is indexed in this series.*`)
      };
    }
  }

  // 2. Direct Von Duprin Callout Search (e.g. 98L, 78L, 75L, 88L, 8875L, 9875L, 33A-L)
  const vdModelMatch = query.match(/\b(9875-?l?|9975-?l?|98-?l?|99-?l?|78-?l?|75-?l?|8875-?l?|88-?l?|5575-?l?|55-?l?|33a-?l?|9475-?l?)\b/i);
  if (vdModelMatch) {
    const code = vdModelMatch[1].toLowerCase().replace('-', '');
    const candidate = allIndexedProducts.find(p => p.brand === 'Von Duprin' && p.id.toLowerCase().includes(code));
    if (candidate) {
      const equivalents = findEquivalentProducts(candidate, 'Sargent');
      const vdSpec = getProductSpecInfo(candidate);
      const sSpec = equivalents[0] ? getProductSpecInfo(equivalents[0]) : null;

      return {
        type: 'PRODUCT_MATCH',
        product1: equivalents[0] || null,
        product2: candidate,
        title: `Von Duprin ${vdSpec.combinedNumber} Specification Callout`,
        text: `### 🚪 Von Duprin **${vdSpec.combinedNumber}** Specification\n\n` +
          `• **Catalog Callout:** **${vdSpec.combinedNumber}**\n` +
          `• **Chassis:** ${vdSpec.chassis}\n` +
          `• **Function Suffix:** ${vdSpec.functionCode} (${vdSpec.ansiCode})\n` +
          `• **Approved Outside Trim:** ${vdSpec.trimStyle}\n\n` +
          (sSpec
            ? `#### ⚖️ Direct Sargent Baseline: **${sSpec.combinedNumber}**\n` +
              `• **Sargent Series:** ${sSpec.series} (${sSpec.chassis})\n` +
              `• **Sargent Function Code:** ${sSpec.functionCode}\n` +
              `• **Sargent Trim:** ${sSpec.trimStyle}\n` +
              `• **List Price:** ${equivalents[0].minPrice ? `$${equivalents[0].minPrice.toFixed(2)} - $${equivalents[0].maxPrice.toFixed(2)}` : 'TBD'}`
            : '')
      };
    }
  }

  // 3. ANSI Function Questions (e.g. "what is ansi 08", "ansi 03", "ansi 01")
  const ansiMatch = query.match(/ansi\s*(01|02|03|06|08|09|14|11|12)/i);
  if (ansiMatch) {
    const num = ansiMatch[1];
    const mappings = {
      '08': {
        name: 'ANSI 08 - Classroom Function',
        sargent: 'Function 13 (e.g., 8813 ET, 8513 ET, 8313 ET, PE8813 ET)',
        vd: 'Suffix L with Lever Trim (e.g., 98L, 78L, 75L, 88L, 8875L, 33A-L)',
        desc: 'Key outside locks and unlocks outside lever control. Egress from inside pushbar is always uninhibited.'
      },
      '03': {
        name: 'ANSI 03 - Night Latch Function',
        sargent: 'Function 04 (e.g., 8804 ET, 8504 ET, 8304)',
        vd: 'Suffix NL or L-NL (e.g., 98NL, 98L-NL, 78NL, 75NL, 88NL, 33A-NL)',
        desc: 'Key outside retracts latchbolt. Outside lever is rigid or pull plate is required.'
      },
      '01': {
        name: 'ANSI 01 - Exit Only',
        sargent: 'Function 10 (e.g., 8810, 8510, 8310, 9810)',
        vd: 'Suffix EO (e.g., 98EO, 78EO, 75EO, 88EO, 33A-EO)',
        desc: 'No outside trim or cylinder. Interior egress only.'
      },
      '02': {
        name: 'ANSI 02 - Dummy Trim',
        sargent: 'Function 40 (ET Pull / Dummy)',
        vd: 'Suffix DT or L-DT (e.g., 98DT, 98L-DT, 78DT, 75DT)',
        desc: 'Outside pull or rigid lever operates only when device is dogged down.'
      },
      '14': {
        name: 'ANSI 14 - Passage',
        sargent: 'Function 15 (e.g., 8815 ET, 8515 ET, 8315 ET)',
        vd: 'Suffix L-BE (Blank Escutcheon, e.g., 98L-BE, 78L-BE, 75L-BE)',
        desc: 'Outside lever is always operable (no cylinder). Free entry and exit at all times.'
      }
    };

    const info = mappings[num];
    if (info) {
      return {
        type: 'SPEC_EXPLANATION',
        title: `${info.name} Cross-Reference`,
        text: `### 📋 ${info.name}\n\n` +
          `**Operation:** ${info.desc}\n\n` +
          `• **Sargent Specification:** ${info.sargent}\n` +
          `• **Von Duprin Callout:** ${info.vd}\n\n` +
          `*Both comply with ANSI/BHMA A156.3 Grade 1 egress hardware standards.*`
      };
    }
  }

  // 4. Prefix questions (e.g. "prefix 56-", "qel", "12-", "fire rated")
  if (query.includes('56') || query.includes('qel') || query.includes('latch retraction')) {
    return {
      type: 'SPEC_EXPLANATION',
      title: 'Electric Latch Retraction Cross-Reference',
      text: `### ⚡ Motorized Electric Latch Retraction (MELR)\n\n` +
        `• **Sargent Prefix: 56-** (e.g., \`56-8813 ET 32D\`, \`56-PE8813 ETL 32D\`)\n` +
        `  - Fast motorized retraction (<0.3s), low inrush (~1.0A peak, 0.14A holding), compatible with standard 24VDC power supplies.\n` +
        `• **Von Duprin Prefix: QEL** (e.g., \`QEL98L 26D\`, \`QEL78L 626\`)\n` +
        `  - Quiet Electric Latch retraction motor drive, replacing the older solenoid-based EL series.\n\n` +
        `💡 Both are direct architectural equivalents for automated openings and card reader integration.`
    };
  }

  if (query.includes('12-') || query.includes('fire rated') || query.includes('fire exit')) {
    return {
      type: 'SPEC_EXPLANATION',
      title: 'Fire Rated Exit Hardware Cross-Reference',
      text: `### 🔥 Fire Exit Hardware (UL 10C / NFPA 80)\n\n` +
        `• **Sargent Prefix: 12-** (e.g., \`12-8813 ET 32D\`)\n` +
        `  - Eliminates mechanical dogging mechanism to ensure door remains positively latched during a fire event.\n` +
        `• **Von Duprin Suffix: -F** (e.g., \`98L-F\`, \`78L-F\`, \`88L-F\`, \`8875L-F\`)\n` +
        `  - Supplied with fire-rated latching components and strikes (e.g. 299F, 499F, 268 strikes).\n\n` +
        `💡 Always verify door manufacturer fire listing limits (up to 3-hour on 4'x10' single, 8'x10' pairs).`
    };
  }

  // 5. Default General Assistance
  return {
    type: 'HELP',
    title: 'Hardware Specification Assistant',
    text: `### 🤖 Architectural Spec Assistant (Offline Engine)\n\n` +
      `I can cross-reference any Sargent and Von Duprin exit device, decode model numbers, or explain ANSI functions:\n\n` +
      `• **Sargent Models:** Try \`8313\`, \`8513\`, \`8804\`, \`8813\`, \`PE8813\`\n` +
      `• **Von Duprin Callouts:** Try \`98L\`, \`9875L\`, \`78L\`, \`75L\`, \`88L\`, \`8875L\`, \`33A-L\`\n` +
      `• **ANSI Functions:** Ask *\"What is ANSI 08?\"* or *\"Explain ANSI 03\"*\n` +
      `• **Electrified Prefixes:** Ask *\"Sargent 56- vs Von Duprin QEL\"* or *\"Fire rating 12-\"*`
  };
}
