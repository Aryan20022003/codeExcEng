const uniqueFileName = (fileExt) => {
  const fileName = `${Math.floor(Math.random() * 1e18)}${fileExt}`;
  return fileName;
};

module.exports = {
  uniqueFileName,
};
