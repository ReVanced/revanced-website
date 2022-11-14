// Creates a fake fetch function.
export function fake_fetch(data: any) {
  const json = () => Promise.resolve(data);
  return () => Promise.resolve({ json });
}
