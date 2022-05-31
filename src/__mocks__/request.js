const axios = {
  get: (link) => {
    if (link.includes('https')) {
      let response;
      if (link.includes('noData')) {
        response = {
          status: '200',
          statusText: 'ok',
        };
      } else {
        response = {
          status: '200',
          statusText: 'ok',
          data: 'data',
        };
      }
      return Promise.resolve(response);
    }
    let error;
    if (link.includes('noData')) {
      error = {};
    } else {
      error = {
        response: {
          status: '400',
          data: 'data',
        },
      };
    }
    return Promise.reject(error);
  },
};

module.exports = axios;
