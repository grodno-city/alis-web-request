import bluebird from 'bluebird';
import { sendInitialQuery as sendInitialQueryC, getPage as getPageC, parsePage } from './index.mjs';
import SearchResultsPage from './SearchResultsPage.mjs';

const sendInitialQuery = bluebird.promisify(sendInitialQueryC);
const getPage = bluebird.promisify(getPageC);

export default class Query {
  constructor(options) {
    const { alisEndpoint, ...queryParams } = options;
    this.alisEndpoint = alisEndpoint;
    this.queryParams = queryParams;
    this.initParams = options;
  }

  async send() {
    const { alisEndpoint, queryParams } = this;
    const res = await sendInitialQuery({ alisEndpoint, ...queryParams });

    this.jar = res.jar;

    if (res.page.match('<title>Не результативный поиск</title>')) {
      throw new Error('no match');
    }

    return new SearchResultsPage(this, parsePage(res.page));
  }

  getPage(pageNumber) {
    const { initParams, jar } = this;
    return getPage({ url: this.getPageUrl(pageNumber), jar, initParams });
  }

  getPageUrl(pageNumber) {
    const pageScript = `${this.alisEndpoint}/alis/EK/do_other.php`;
    return `${pageScript}?frow=1&fcheck=1&crow=1&ccheck=1&action=${pageNumber}`;
  }
}
