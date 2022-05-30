const mdl = require('./src/md-links');

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
                                        response = `Total: ${links.length}\r\nUnique: ${linksUnique.length}\r\nBroken: ${linksBroken.length}`;
                                    } else {
                                        result.forEach(link => {
                                            response += `${link.file} ${link.link} ${link.statusText} ${link.statusCode} ${link.text}\r\n`;
                                        });
                                    }
                                    resolve({ response });
                                });
                        } else {
                            if (option.includes('--stats')) {
                                response = `Total: ${links.length}\r\nUnique: ${linksUnique.length}`;
                            } else {
                                linksUnique.forEach(link => {
                                    response += `${link.file} ${link.link}\r\n`;
                                });
                            }
                            resolve({ response });
                        }
                    } else {
                        reject({ error: 'No links found' })
                    }
                } else {
                    optionsE = '';
                    if (options.optionDuplicate.length > 0) {
                        optionsE += `Option duplicate: ${options.optionDuplicate.join()} `;
                    }
                    if (options.optionInvalid.length > 0) {
                        optionsE += `Option invalid: ${options.optionInvalid.join(', ')} `;
                    }
                    reject({ error: optionsE });
                }
            } else {
                reject({ error: 'the path entered not exist' });
            }
        } else {
            reject({ error: 'You not enter a path' });
        }

    })
}

