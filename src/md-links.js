const path = require('path');
const fs = require('fs');
const axios = require('./request');

const isAbsolutePath = _path => path.isAbsolute(_path);
const convertToAbsolutePath = (_path) => isAbsolutePath(_path) ? _path : path.resolve(_path);
const isExistsPath = (_path) => fs.existsSync(_path);
const isDirectory = (_path) => fs.statSync(_path).isDirectory();
const isMDFile = (file) => path.extname(file).toLowerCase() == '.md' ? true : false;

// leer archivos de path ingresado
const readPath = _path => {
  if (isDirectory(_path)) {
    // leer archivos de carpeta
    const files = fs.readdirSync(_path);
    const arrayFiles = files.map(file => {
      const pathFile = path.join(_path, file);
      return isDirectory(pathFile) ? readPath(pathFile) : pathFile;
    });
    return arrayFiles.flat();
  } else {
    const arrayFiles = [];
    arrayFiles.push(_path);
    return arrayFiles;
  }
}

// leer archivos md
const readLinkFileMD = file => {
  let links = [];
  if (isMDFile(file)) {
    const content = fs.readFileSync(file, 'utf-8').split('\r\n').join(' ').split(' ');
    links = content.filter(str => str.substring(0, 7).includes('http://') || str.substring(0, 8).includes('https://'))
  }
  linksInf = links.map(link => ({ file, link }))
  return linksInf;
};
// obtener links unicos
const getLinksUnique = links => {
  const uniqueLinks = links.map(link => {
    return [link.link, link]
  });
  return [...new Map(uniqueLinks).values()];
}
// request de links
const requestLink = link => {
  return new Promise(function (resolve) {
    axios.get(link.link)
      .then(response => {
        link.statusCode = response.status;
        link.statusText = response.statusText.toLowerCase();
        link.text = response.data ? response.data.substring(0, 50) : '';
        resolve(link);
      })
      .catch(error => {
        link.statusCode = error.response ? error.response.status : '404';
        link.statusText = 'fail'
        link.text = error.response ? error.response.data.substring(0, 50) : '';
        resolve(link);
      });
  });
};

// verificacion de opciones

const filterOptionInvalid = option => option.filter( opt => opt!=='--validate' && opt!=='--stats');
const filterOptionValidDuplicate = option => option.filter((element, index) => option.indexOf(element)!==index && (element==='--validate' || element==='--stats'));
const verifyOptions = option => ({optionInvalid: filterOptionInvalid(option),optionDuplicate: filterOptionValidDuplicate(option)});

module.exports = { isAbsolutePath, convertToAbsolutePath, isExistsPath, isMDFile, isDirectory, readPath, readLinkFileMD, getLinksUnique, requestLink, filterOptionInvalid, filterOptionValidDuplicate, verifyOptions };
