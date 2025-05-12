export const formatNumber = (n) => {
  //number formatiing
  if (typeof n === "string") {
    const number = Math.round(parseFloat(n) * 100) / 100;
    return `${number}%`;
  }
  return (Math.round(n * 100) / 100).toLocaleString();
};

export const numbersFormat = (num) => {
  let numbers = num;
  let calculatedNumber;
  if (num < 0) {
    numbers = Math.abs(num);
  }
  if (numbers > 999 && numbers < 1000000) {
    calculatedNumber = (numbers / 1000).toFixed(1) + "k"; // convert to K for numbersber from > 1000 < 1 million
  } else if (numbers > 1000000) {
    calculatedNumber = (numbers / 1000000).toFixed(1) + "m"; // convert to M for numbersber from > 1 million
  } else if (numbers < 999) {
    calculatedNumber = Math.round(numbers * 100) / 100; // if value < 1000, nothing to do
  }
  if (num < 0) {
    return `-${calculatedNumber}`;
  }
  return calculatedNumber;
};

export const totalEngagementPerKFans = (
  totalPageLikes,
  totalFeedsInteraction
) => {
  return ((totalFeedsInteraction / totalPageLikes) * 1000).toFixed(2);
};

export const getSubDomain = () => {
  // Fetching sub-domain based logo and banner
  const hostName = window.location.host;

  if (hostName.includes(".localhost")) {
    const subDomain = hostName.split(".localhost")[0];
    return subDomain;
  }

  const urlSplit = hostName.split(".");
  return urlSplit.length === 3 && urlSplit[0] !== "www"
    ? urlSplit[0]
    : undefined;
};

export const formatImage = (activeMedia, subdomain, imageLink) => {
  var subdomainCheck = getSubDomain();

  if (subdomainCheck) {
    return `https://${subdomainCheck.toLowerCase()}.${
      process.env.REACT_APP_IMAGE_URL
    }${imageLink}`;
  } else {
    return `https://${process.env.REACT_APP_IMAGE_URL}${imageLink}`;
  }
};

export const formatVideo = (activeMedia, subdomain, videoLink) => {
  var subdomainCheck = getSubDomain();

  if (subdomainCheck) {
    return `https://${subdomainCheck.toLowerCase()}.${
      process.env.REACT_APP_IMAGE_URL
    }${videoLink}`;
  } else {
    return `https://${process.env.REACT_APP_IMAGE_URL}${videoLink}`;
  }
};

export const formatServerImages = (imageLink) => {
  const checkIfURLLocalHost = () => {
    if (window.location.href.indexOf("localhost") != -1) {
      return true;
    } else return false;
  };

  var formattedImage = imageLink.replace(/^http?\:\/\//i, "https://");

  if (checkIfURLLocalHost()) {
    return imageLink;
  } else return formattedImage;
};
export const deleteConfirmation = (title, message) => {
  return new Promise((resolve) => {
    const isConfirmed = window.confirm(`${title}\n${message}`);
    resolve(isConfirmed);
  });
};
