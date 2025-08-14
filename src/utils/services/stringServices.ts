const stringService = {
  normalizeString: (str: string): string =>
    str.trim().replace(/\s+/g, ' ').toLowerCase(),

  capitalizeFirstLetters: (str: string): string =>
    str
      .toLowerCase()
      .replace(/(^|\.\s*)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase()),

  removeSpacesAndLowerCase: (str: string): string =>
    str.replace(/\s+/g, '').toLowerCase()
};

export default stringService;
