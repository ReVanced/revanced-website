import { fake_fetch } from '$lib/testing/utils';
import { API } from '.';

import * as cache from './cache';

describe('API Cache', () => {
  beforeEach(() => {
    cache.clear();
  })

  it('should properly cache', async () => {
    const endpoint = "9-plus-10";
    const n = 21;

    const api = new API(endpoint, n);
    const fetch_fn = cy.spy(fake_fetch(n));

    // It should only have to call it once no matter how many times we try to do this.
    for (let i = 0; i < 10; i++) {
      await api.update(fetch_fn);
    }

    expect(fetch_fn).to.have.been.calledOnce;
    expect(cache.get(endpoint)).to.equal(n);

    // Now it can't use the cache anymore, so it should get called again.
    cache.clear();
    expect(cache.get(endpoint)).to.be.null;
    await api.update(fetch_fn);

    expect(fetch_fn).to.have.been.calledTwice;
  })

  it('should expire old data', () => {
    const endpoint = "something";
    const key_name = cache._l1_key_name(endpoint);

    localStorage.setItem(key_name, JSON.stringify({ data: "bruh", valid_until: 1 }));

    expect(cache.get("something")).to.be.null;
    expect(localStorage.getItem(key_name)).to.be.null;
  })
})
