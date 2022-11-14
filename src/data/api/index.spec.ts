import { fake_fetch } from '$lib/testing/utils';
import { API } from '.';

import sinon from 'sinon';
import '$lib/testing/register-sinon';

describe("API", () => {
  it("should start with the default value", async () => {
    const subscriber = sinon.spy();

    const data = { num: 0 };
    const api = new API("", data);
    const unsub = api.subscribe(subscriber);

    expect(subscriber).to.have.been.calledOnceWithExactly(data);
    expect(api.has_requested).to.be.false;

    unsub();
  })

  it("should transform data", async () => {
    // Transform function
    const transform = sinon.spy(data => {
      data.num++;
      return data;
    });

    const api = new API("", null, transform);

    expect(transform).to.not.have.been.called;
    expect(api.has_requested).to.be.false;

    // Fake fetch
    const fetch_data = { num: 4 };
    const fetch_fn = sinon.spy(fake_fetch(fetch_data));

    // Update with the fake fetched data
    await api.update(fetch_fn);
    expect(api.has_requested).to.be.true;

    // Subscribe
    const subscriber = sinon.spy();
    const unsub = api.subscribe(subscriber);

    expect(transform).to.have.been.calledOnceWithExactly(fetch_data);
    expect(fetch_fn).to.have.been.calledOnce;
    expect(subscriber).to.have.been.calledOnceWithExactly({ num: 5 });

    unsub();
  })
})
