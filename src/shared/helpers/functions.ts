import { BadRequestException } from "@nestjs/common";

export const isObject = (item: any) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};
export const mergeDeep = (target: any, ...sources: any): any => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
};

export function containsSpecialArabicCharacters(keyword: string): boolean {
  const arabicPattern = /[أإاىيةهآ]/;
  return arabicPattern.test(keyword);
}

export function escapeSQLSpecialCharacters(keyword: string): string {
  const escapeSpecialCharacters = (kw: string) => kw.replace(/([_%])/g, '\\$1');
  return escapeSpecialCharacters(keyword);
}



export function generateKeywordVariations(keyword: string): string[] {
  const variations: string[] = [];
  const characterVariations: Record<string, string[]> = {
    أ: ['أ', 'ا', 'إ', 'آ'],
    إ: ['أ', 'ا', 'إ', 'آ'],
    ا: ['أ', 'ا', 'إ', 'آ'],
    آ: ['أ', 'ا', 'إ', 'آ'],
    ى: ['ي', 'ى'],
    ي: ['ي', 'ى'],
    ة: ['ة', 'ه'],
    ه: ['ة', 'ه'],
  };

  // for (let i = 0; i < keyword.length; i++) {
  //   const char = keyword[i];
  //   const charVariants = characterVariations[char];
  //   if (charVariants) {
  //     for (const variant of charVariants) {
  //       const variation = keyword.slice(0, i) + variant + keyword.slice(i + 1);
  //       variations.push(variation);
  //     }
  //   }
  // }

  // return variations;

  function generateVariations(currentIndex: number, currentKeyword: string) {
    if (currentIndex === keyword.length) {
      // Base case: If currentIndex reaches the end of keyword, add the current variation
      variations.push(currentKeyword);
      return;
    }

    const char = keyword[currentIndex];
    const charVariants = characterVariations[char] || [char]; // If char is not special, use itself
    for (const variant of charVariants) {
      generateVariations(
        currentIndex + 1,
        currentKeyword.slice(0, currentIndex) +
        variant +
        currentKeyword.slice(currentIndex + 1),
      );
    }
  }

  generateVariations(0, keyword); // Start recursion from index 0

  return variations;
}


export function getPaginationParams(page: number, perPage: number) {
  page = page ? Number(page) : 1;
  perPage = perPage ? Number(perPage) : 10;

  if (page <= 0) {
    throw new BadRequestException('Page number must be a positive integer');
  }
  if (perPage <= 0) {
    throw new BadRequestException('perPage number must be a positive integer');
  }
  const skip = (page - 1) * perPage;

  return { page, perPage, skip }
}