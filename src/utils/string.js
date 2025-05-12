/**
 * Create the sentence case from the given string
 * For eg: 'service_now' => 'Service Now'
 * For eg: 'service-now' => 'Service Now'
 *
 * @param {string} str
 * @returns {string}
 */
export const sentenceCase = (str) => {
  if (!str) return str;
  const splitChar = str.match(/[-_ ]/) ? str?.match(/[-_ ]/)?.[0] : ' ';

  return str
    .toLowerCase()
    .split(splitChar)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
