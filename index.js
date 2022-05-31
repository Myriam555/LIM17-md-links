const chalk = require('./node_modules/chalk');
const mdl = require('./src/md-links');

module.exports.mdLink = (_path, option) => new Promise((resolve, reject) => {
  let error;
  if (_path) {
    // verificar si el link es absoluto, sino convertir
    const pathRoot = mdl.convertToAbsolutePath(_path);
    // verificar si path existe
    if (mdl.isExistsPath(pathRoot)) {
      // verificar opciones ingresadas
      const options = mdl.verifyOptions(option);
      if (options.optionDuplicate.length === 0 && options.optionInvalid.length === 0) {
        // leer archivos de carpeta
        const files = mdl.readPath(pathRoot);
        // leer links de archivos
        const links = files.map((file) => mdl.readLinkFileMD(file)).flat();

        if (links.length > 0) {
          // obtener los links unicos
          const linksUnique = mdl.getLinksUnique(links);
          let response = '';
          if (option.includes('--validate')) {
            // obtener información de links
            Promise.all(linksUnique.map((link) => mdl.requestLink(link)))
              .then((result) => {
                const linksBroken = result.filter((link) => link.statusText === 'fail');
                if (option.includes('--stats')) {
                  response = `${chalk.bgMagenta.bold('Total: ')} ${chalk.magenta.bold(links.length)}\r\n${chalk.bgBlue.bold('Unique:')} ${chalk.blue.bold(linksUnique.length)}\r\n${chalk.bgRed.bold('Broken:')} ${chalk.red.bold(linksBroken.length)}`;
                } else {
                  result.forEach((link) => {
                    response += `${chalk.magenta(link.file)} ${chalk.blue(link.link)} ${link.statusText === 'ok' ? chalk.green(link.statusText) : chalk.red(link.statusText)} ${link.statusText === 'ok' ? chalk.green(link.statusCode) : chalk.red(link.statusCode)} ${chalk.gray(link.text)}\r\n`;
                  });
                }
                resolve({ response });
              });
          } else {
            if (option.includes('--stats')) {
              response = `${chalk.bgMagenta.bold('Total: ')} ${chalk.magenta.bold(links.length)}\r\n${chalk.bgBlue.bold('Unique:')} ${chalk.blue.bold(linksUnique.length)}`;
            } else {
              linksUnique.forEach((link) => {
                response += `${chalk.magenta(link.file)} ${chalk.blue(link.link)} ${chalk.gray(link.text)}\r\n`;
              });
            }
            resolve({ response });
          }
        } else {
          error = { error: `${chalk.bgRed('Error: ')} ${chalk.red('No links found')}` };
          reject(error);
        }
      } else {
        let optionsE = `${chalk.bgRed('Error: ')} \r\n`;
        if (options.optionDuplicate.length > 0) {
          optionsE += `${chalk.red('Option duplicate:')} ${chalk.red(options.optionDuplicate.join())} `;
        }
        if (options.optionInvalid.length > 0) {
          optionsE += `${chalk.red('Option invalid:')} ${chalk.red(options.optionInvalid.join(', '))} `;
        }
        error = { error: optionsE };
        reject(error);
      }
    } else {
      error = { error: `${chalk.bgRed('Error: ')} ${chalk.red('The path entered not exist')}` };
      reject(error);
    }
  } else {
    error = { error: `${chalk.bgRed('Error: ')} ${chalk.red('You not enter a path')}` };
    reject(error);
  }
});
