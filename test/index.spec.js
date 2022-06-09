const chalk = require('../node_modules/chalk');
const { mdLink } = require('../src/index');

jest.mock('../src/request');

describe('requestLink', () => {
  it('should return md-link', () => mdLink('test', [])
    .then((request) => {
      const result = {
        response: `${chalk.magenta('E:\\MYRIAM\\LABORATORIA\\LIM17-md-links\\test\\prueba-links\\archivo.MD')} ${chalk.blue('https://es.wikipedia.org/wiki/Wikipedia:Portada')} ${chalk.gray('wikipedia')}\r\n${chalk.magenta('E:\\MYRIAM\\LABORATORIA\\LIM17-md-links\\test\\prueba-links\\archivo.MD')} ${chalk.blue('https://www.youtube.com/')} ${chalk.gray('youtube')}\r\n${chalk.magenta('E:\\MYRIAM\\LABORATORIA\\LIM17-md-links\\test\\prueba-links\\prueba2-links\\archivo2.md')} ${chalk.blue('https://google.com')} ${chalk.gray('google')}\r\n${chalk.magenta('E:\\MYRIAM\\LABORATORIA\\LIM17-md-links\\test\\prueba-links\\prueba2-links\\prueba3-links\\archivo3.md')} ${chalk.blue('http://facebook')} ${chalk.gray('facebook')}\r\n`,
      };
      expect(request).toEqual(result);
    }));
  it('should return md-link --stats', () => mdLink('test', ['--stats'])
    .then((request) => {
      const result = {
        response: `${chalk.bgMagenta.bold('Total: ')} ${chalk.magenta.bold('5')}\r\n${chalk.bgBlue.bold('Unique:')} ${chalk.blue.bold('4')}`,
      };
      expect(request).toEqual(result);
    }));
  it('should return md-link --validate', () => mdLink('test', ['--validate'])
    .then((request) => {
      const result = {
        response: `${chalk.magenta('E:\\MYRIAM\\LABORATORIA\\LIM17-md-links\\test\\prueba-links\\archivo.MD')} ${chalk.blue('https://es.wikipedia.org/wiki/Wikipedia:Portada')} ${chalk.green('ok')} ${chalk.green('200')} ${chalk.gray('wikipedia')}\r\n${chalk.magenta('E:\\MYRIAM\\LABORATORIA\\LIM17-md-links\\test\\prueba-links\\archivo.MD')} ${chalk.blue('https://www.youtube.com/')} ${chalk.green('ok')} ${chalk.green('200')} ${chalk.gray('youtube')}\r\n${chalk.magenta('E:\\MYRIAM\\LABORATORIA\\LIM17-md-links\\test\\prueba-links\\prueba2-links\\archivo2.md')} ${chalk.blue('https://google.com')} ${chalk.green('ok')} ${chalk.green('200')} ${chalk.gray('google')}\r\n${chalk.magenta('E:\\MYRIAM\\LABORATORIA\\LIM17-md-links\\test\\prueba-links\\prueba2-links\\prueba3-links\\archivo3.md')} ${chalk.blue('http://facebook')} ${chalk.red('fail')} ${chalk.red('400')} ${chalk.gray('facebook')}\r\n`,
      };
      expect(request).toStrictEqual(result);
    }));
  it('should return md-link --validate --stats', () => mdLink('test', ['--validate', '--stats'])
    .then((request) => {
      const result = {
        response: `${chalk.bgMagenta.bold('Total: ')} ${chalk.magenta.bold('5')}\r\n${chalk.bgBlue.bold('Unique:')} ${chalk.blue.bold('4')}\r\n${chalk.bgRed.bold('Broken:')} ${chalk.red.bold('1')}`,
      };
      expect(request).toStrictEqual(result);
    }));
  it('should return md-link Error Option Invalid', () => mdLink('test', ['-validate'])
    .catch((error) => {
      const result = { error: `${chalk.bgRed('Error: ')} \r\n${chalk.red('Option invalid:')} ${chalk.red('-validate')} ` };
      expect(error).toStrictEqual(result);
    }));
  it('should return md-link Error Option Duplicate', () => mdLink('test', ['--stats', '--stats'])
    .catch((error) => {
      const result = { error: `${chalk.bgRed('Error: ')} \r\n${chalk.red('Option duplicate:')} ${chalk.red('--stats')} ` };
      expect(error).toStrictEqual(result);
    }));
  it('should return md-link Error not enter a path', () => mdLink('', [])
    .catch((error) => {
      const result = { error: `${chalk.bgRed('Error: ')} ${chalk.red('You not enter a path')}` };
      expect(error).toStrictEqual(result);
    }));
  it('should return md-link Error The path entered not exist', () => mdLink('test1', [])
    .catch((error) => {
      const result = { error: `${chalk.bgRed('Error: ')} ${chalk.red('The path entered not exist')}` };
      expect(error).toStrictEqual(result);
    }));
  it('should return md-link Error No links found', () => mdLink('test/prueba-links/archivo.txt', [])
    .catch((error) => {
      const result = { error: `${chalk.bgRed('Error: ')} ${chalk.red('No links found')}` };
      expect(error).toStrictEqual(result);
    }));
});
