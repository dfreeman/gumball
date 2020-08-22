/* eslint-disable @typescript-eslint/ban-types */

export const memoize: MethodDecorator = (target, key, descriptor) => {
  let memo = new WeakMap<object, unknown>();

  const { get } = descriptor;
  if (!get) {
    throw new Error('Invalid application of @memoize');
  }

  descriptor.get = function (this: object): ReturnType<typeof get> {
    if (memo.has(this)) {
      return memo.get(this) as ReturnType<typeof get>;
    } else {
      let value = get?.call(this);
      memo.set(this, value);
      return value;
    }
  };
};
