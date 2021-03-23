const fs = require('fs');
const web3 = require('web3');
const utils = web3.utils;
const contractsDirectory = './src/contracts';
const tokensDirectory = './src/tokens';
const iconsDirectory = './src/icons';
function recreateContractFiles() {
  fs.readdirSync(contractsDirectory).forEach(folderFile => {
    fs.readdirSync(`${contractsDirectory}/${folderFile}`).forEach(file => {
      const newFile = JSON.parse(
        fs.readFileSync(`${contractsDirectory}/${folderFile}/${file}`)
      );
      const currentAddress = newFile.address;
      newFile.address = utils.toChecksumAddress(currentAddress);
      fs.rename(
        `${contractsDirectory}/${folderFile}/${file}`,
        `${contractsDirectory}/${folderFile}/${utils.toChecksumAddress(
          file.replace('.json', '')
        )}.json`,
        function(err) {
          if (err) console.log('ERROR: ', err);
        }
      );
    });
  });
}

function recreateTokenFiles() {
  fs.readdirSync(tokensDirectory).forEach(folderFile => {
    fs.readdirSync(`${tokensDirectory}/${folderFile}`).forEach(file => {
      const newFile = JSON.parse(
        fs.readFileSync(`${tokensDirectory}/${folderFile}/${file}`)
      );
      const currentAddress = newFile.address;
      newFile.address = utils.toChecksumAddress(currentAddress);
      fs.rename(
        `${tokensDirectory}/${folderFile}/${file}`,
        `${tokensDirectory}/${folderFile}/${utils.toChecksumAddress(
          file.replace('.json', '')
        )}.json`,
        function(err) {
          if (err) console.log('ERROR: ', err);
        }
      );
    });
  });
}

function recreateIconFiles() {
  const date = new Date();
  const dateT = date.getTime();
  fs.readdirSync(iconsDirectory).forEach(imgFile => {
    const findAddressStart = imgFile.indexOf('-0x');
    const foundAddress =
      findAddressStart !== -1
        ? imgFile.substr(findAddressStart + 1, imgFile.length)
        : null;
    const address = foundAddress
      ? foundAddress.replace(/(?<name>.png|.svg)/g, '')
      : imgFile;
    const extension = imgFile.substring(imgFile.length - 4, imgFile.length);
    try {
      if (utils.isAddress(address) && foundAddress) {
        const checksumAddress = utils.toChecksumAddress(address);
        const newName = `${imgFile.substring(
          0,
          findAddressStart
        )}-${dateT}-${checksumAddress}${extension}`;
        fs.rename(
          `${iconsDirectory}/${imgFile}`,
          `${iconsDirectory}/${newName}`,
          function(err) {
            if (err) console.log('ERROR: ', err);
          }
        );
      }
    } catch (e) {
      console.log(e);
    }
  });
}

function recreateFiles() {
  recreateContractFiles();
  recreateTokenFiles();
  // recreateIconFiles();
}
module.exports = recreateFiles;
