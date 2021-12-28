import bluebird from 'bluebird';
import _ from 'lodash';
import { parsePage, getItems, getTotal } from './index.mjs';

const RESULTS_PER_PAGE = 20;

export default class SearchResultsPage {
  /**
   *
   * @param {import('./Query.mjs').default} query
   * @param {*} $
   */
  constructor(query, $) {
    this.query = query;

    /** @type cheerio.Cheerio */
    this.$ = $;
  }

  /**
   * Даць агульную колькасць рэзультатаў згодна са статыстыкай на старонке
   *
   * @returns number
   */
  getResultsTotal() {
    return getTotal(this.$);
  }

  getLastPageNumber() {
    return Math.ceil(this.getResultsTotal() / RESULTS_PER_PAGE);
  }

  async getItems() {
    // Мы пачынаем з другой старонкі, таму што першую ўжо маем ад стварэння
    // аб'екта.
    const pageNumbers = _.range(2, this.getLastPageNumber());
    const getItemsFromPage = async (pageNumber) => {
      const page = await this.query.getPage(pageNumber);
      return getItems(parsePage(page));
    };

    const items = await bluebird.map(pageNumbers, getItemsFromPage, { concurrency: 1 });

    return getItems(this.$).concat(_.flatten(items));
  }
}
