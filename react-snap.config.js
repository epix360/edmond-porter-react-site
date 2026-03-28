module.exports = {
  source: './build/index.html',
  destination: './build/index.html',
  puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
  minify: false,
  skipThirdPartyRequests: true,
  userAgent: 'react-snap',
  publicPath: '/'
};
