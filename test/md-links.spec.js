const mdLinks = require('../src/md-links');

jest.mock('../src/request.js');

describe('mdLinks', () => {
  it('should return true if path is absolute', () => {
    const isAbsolute = mdLinks.isAbsolutePath('C://');
    expect(isAbsolute).toBe(true);
  });

  it('should return false if path is not absolute', () => {
    const isAbsolute = mdLinks.isAbsolutePath('test');
    expect(isAbsolute).toBe(false);
  });

  it('should return E:\\MYRIAM\\LABORATORIA\\LIM17-md-links\\test if path is not absolute', () => {
    const absolutePath = mdLinks.convertToAbsolutePath('test');
    expect(absolutePath).toBe('E:\\MYRIAM\\LABORATORIA\\LIM17-md-links\\test');
  });

  it('should return E:\\MYRIAM\\LABORATORIA\\LIM17-md-links\\test if path is absolute', () => {
    const absolutePath = mdLinks.convertToAbsolutePath('E:\\MYRIAM\\LABORATORIA\\LIM17-md-links\\test');
    expect(absolutePath).toBe('E:\\MYRIAM\\LABORATORIA\\LIM17-md-links\\test');
  });

  it('should return true if path exist', () => {
    const existPath = mdLinks.isExistsPath('test/prueba-links');
    expect(existPath).toBe(true);
  });

  it('should return false if path not exist', () => {
    const existPath = mdLinks.isExistsPath('test/prueba3-links');
    expect(existPath).toBe(false);
  });

  it('should return true if is Directory', () => {
    const directory = mdLinks.isDirectory('test/prueba-links');
    expect(directory).toBe(true);
  });

  it('should return false if is not Directory', () => {
    const directory = mdLinks.isDirectory('index.js');
    expect(directory).toBe(false);
  });

  it('should return true if is MD', () => {
    const link = mdLinks.isMDFile('prueba.md');
    expect(link).toBe(true);
  });

  it('should return false if is not MD', () => {
    const link = mdLinks.isMDFile('prueba.js');
    expect(link).toBe(false);
  });
});

describe('readPath', () => {
  it('should return array [..,..,..] if path is directory', () => {
    const links = mdLinks.readPath('test/prueba-links');
    const result = ['test\\prueba-links\\archivo.MD', 'test\\prueba-links\\archivo.txt', 'test\\prueba-links\\prueba2-links\\archivo2.md', 'test\\prueba-links\\prueba2-links\\prueba3-links\\archivo3.md']
    expect(links).toEqual(result);
  });

  it('should return array [..] if path is not directory', () => {
    const links = mdLinks.readPath('test/prueba-links/archivo.MD');
    const result = ['test/prueba-links/archivo.MD']
    expect(links).toEqual(result);
  });
});

describe('readLinkFileMD', () => {
  it('should return array [{file,link},{file,link},..] if link is MD', () => {
    const links = mdLinks.readLinkFileMD('test/prueba-links/archivo.MD');
    const result = [{ 'file': 'test/prueba-links/archivo.MD', 'link': 'http://es.wikipedia.org/wiki/Wikipedia:Portada', }, { 'file': 'test/prueba-links/archivo.MD', 'link': 'https://www.youtube.com/', },]
    expect(links).toEqual(result);
  });

  it('should return array [] if link is not MD', () => {
    const links = mdLinks.readLinkFileMD('test/prueba-links/archivo.txt');
    const result = []
    expect(links).toEqual(result);
  });
});

describe('getLinksUnique', () => {
  it('should return array [{file1,link1},{file2,link2}] if link is not equal', () => {
    const links = [{ 'file': 'test/prueba-links/archivo.MD', 'link': 'http://es.wikipedia.org/wiki/Wikipedia', }, { 'file': 'test/prueba-links/archivo.MD', 'link': 'https://www.youtube.com/' }];
    const linksUnique = mdLinks.getLinksUnique(links);
    const result = [{ 'file': 'test/prueba-links/archivo.MD', 'link': 'http://es.wikipedia.org/wiki/Wikipedia', }, { 'file': 'test/prueba-links/archivo.MD', 'link': 'https://www.youtube.com/' }]
    expect(linksUnique).toEqual(result);
  });

  it('should return array [{file1,link1}] if link is equal', () => {
    const links = [{ 'file': 'test/prueba-links/archivo.MD', 'link': 'https://www.youtube.com/', }, { 'file': 'test/prueba-links/archivo.MD', 'link': 'https://www.youtube.com/' }];
    const linksUnique = mdLinks.getLinksUnique(links);
    const result = [{ 'file': 'test/prueba-links/archivo.MD', 'link': 'https://www.youtube.com/' }]
    expect(linksUnique).toEqual(result);
  });
});

describe('requestLink', () => {
  it('should return Promise resolve {file,link,statusCode:200,statusText:ok,text:data} from link', () => mdLinks.requestLink({ 'file': 'test/prueba-links/archivo.MD', 'link': 'https://www.youtube.com/' })
    .then((request) => {
      const result = { 'file': 'test/prueba-links/archivo.MD', 'link': 'https://www.youtube.com/', 'statusCode': '200', 'statusText': 'ok', 'text': 'data' }
      expect(request).toEqual(result);
    }));
  it('should return Promise resolve {file,link,statusCode:400,statusText:fail,text:data} from link', () => mdLinks.requestLink({ 'file': 'test/prueba-links/archivo.MD', 'link': 'www.youtube.com/' })
    .then((request) => {
      const result = { 'file': 'test/prueba-links/archivo.MD', 'link': 'www.youtube.com/', 'statusCode': '400', 'statusText': 'fail', 'text': 'data' }
      expect(request).toEqual(result);
    }));
  it('should return Promise resolve {file,link,statusCode:200,statusText:ok,text:} from link', () => mdLinks.requestLink({ 'file': 'test/prueba-links/archivo.MD', 'link': 'https://www.noData.com/' })
    .then((request) => {
      const result = { 'file': 'test/prueba-links/archivo.MD', 'link': 'https://www.noData.com/', 'statusCode': '200', 'statusText': 'ok', 'text': '' }
      expect(request).toEqual(result);
    }));
  it('should return Promise resolve {file,link,statusCode:404,statusText:fail,text:} from link', () => mdLinks.requestLink({ 'file': 'test/prueba-links/archivo.MD', 'link': 'www.noData.com/' })
    .then((request) => {
      const result = { 'file': 'test/prueba-links/archivo.MD', 'link': 'www.noData.com/', 'statusCode': '404', 'statusText': 'fail', 'text': '' }
      expect(request).toEqual(result);
    }));
});

describe('verifyOptions', () => {
  it('should return array [-stats] if options is invalid', () => {
    const options = mdLinks.filterOptionInvalid(['-stats']);
    expect(options).toEqual(['-stats']);
  });

  it('should return array [] if options is valid', () => {
    const options = mdLinks.filterOptionInvalid(['--stats']);
    expect(options).toEqual([]);
  });

  it('should return array [--stats] if options is duplicated', () => {
    const options = mdLinks.filterOptionValidDuplicate(['--stats', '--stats']);
    expect(options).toEqual(['--stats']);
  });

  it('should return array [] if options is not duplicated', () => {
    const options = mdLinks.filterOptionValidDuplicate(['--stats']);
    expect(options).toEqual([]);
  });

  it('should return array [{optionInvalid: [-stats], optionDuplicate: [--stats]}] if options is duplicated and invalid', () => {
    const options = mdLinks.verifyOptions(['--stats', '--stats', '-stats']);
    expect(options).toEqual({ optionInvalid: ['-stats'], optionDuplicate: ['--stats'] });
  });

  it('should return array [{optionInvalid: [], optionDuplicate: []}] if options is not duplicated and valid', () => {
    const options = mdLinks.verifyOptions(['--stats']);
    expect(options).toEqual({ optionInvalid: [], optionDuplicate: [] });
  });
});

