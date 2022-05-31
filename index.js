const mdl = require('./src/md-links');
const chalk = require('chalk');

module.exports.mdLink = (_path, option) => {
    return new Promise(function (resolve, reject) {
        if (_path) {
            // verificar si el link es absoluto, sino convertir
            pathRoot = mdl.convertToAbsolutePath(_path);
            // verificar si path existe
            if (mdl.isExistsPath(pathRoot)) {
                // verificar opciones ingresadas
                const options = mdl.verifyOptions(option);
                if (options.optionDuplicate.length === 0 && options.optionInvalid.length === 0) {
                    // leer archivos de carpeta
                    files = mdl.readPath(pathRoot);
                    // leer links de archivos
                    links = files.map(file => {
                        return mdl.readLinkFileMD(file);
                    }).flat();

                    if (links.length > 0) {
                        // obtener los links unicos
                        linksUnique = mdl.getLinksUnique(links);
                        let response = '';
                        if (option.includes('--validate')) {
                            // obtener información de links
                            Promise.all(linksUnique.map(link => mdl.requestLink(link)))
                                .then((result) => {
                                    const linksBroken = result.filter(link => link.statusText === 'fail')
                                    if (option.includes('--stats')) {
                                        response = `${chalk.bgMagenta.bold('Total: ')} ${chalk.magenta.bold(links.length)}\r\n${chalk.bgBlue.bold('Unique:')} ${chalk.blue.bold(linksUnique.length)}\r\n${chalk.bgRed.bold('Broken:')} ${chalk.red.bold(linksBroken.length)}`;
                                    } else {
                                        result.forEach(link => {
                                            response += `${chalk.magenta(link.file)} ${chalk.blue(link.link)} ${link.statusText=='ok'?chalk.green(link.statusText):chalk.red(link.statusText)} ${link.statusText=='ok'?chalk.green(link.statusCode):chalk.red(link.statusCode)} ${chalk.gray(link.text)}\r\n`;
                                        });
                                    }
                                    resolve({ response });
                                });
                        } else {
                            if (option.includes('--stats')) {
                                response = `${chalk.bgMagenta.bold('Total: ')} ${chalk.magenta.bold(links.length)}\r\n${chalk.bgBlue.bold('Unique:')} ${chalk.blue.bold(linksUnique.length)}`;
                            } else {
                                linksUnique.forEach(link => {
                                    response += `${chalk.magenta(link.file)} ${chalk.blue(link.link)} ${chalk.gray(link.text)}\r\n`;
                                });
                            }
                            resolve({ response });
                        }
                    } else {
                        reject({ error: `${chalk.bgRed('Error: ')} ${chalk.red('No links found')}` })
                    }
                } else {
                    optionsE = `${chalk.bgRed('Error: ')} \r\n`;
                    if (options.optionDuplicate.length > 0) {
                        optionsE += `${chalk.red('Option duplicate:')} ${chalk.red(options.optionDuplicate.join())} `;
                    }
                    if (options.optionInvalid.length > 0) {
                        optionsE += `${chalk.red('Option invalid:')} ${chalk.red(options.optionInvalid.join(', '))} `;
                    }
                    reject({ error: optionsE });
                }
            } else {
                reject({ error: `${chalk.bgRed('Error: ')} ${chalk.red('The path entered not exist')}` });
            }
        } else {
            reject({ error: `${chalk.bgRed('Error: ')} ${chalk.red('You not enter a path')}` });
        }

    })
}

