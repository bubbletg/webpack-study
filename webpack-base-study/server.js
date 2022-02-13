const http = require('http');
http
  .createServer(function (req, res) {
    res.end(
      JSON.stringify({
        a: {
          name: '1111',
          arr: [1, 2, 3, 4, 5, 6, 7],
        },
      })
    );
  })
  .listen(30001);
