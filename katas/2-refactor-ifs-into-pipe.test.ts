import { faker } from "@faker-js/faker";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as R from "fp-ts/Record";

// Conditionals, eithers and pipes
//
// The implementation of checkPrice passes all tests.
// Can you turn it into a single pipe?

type Request = {
  tag: "fruit" | "vegetable";
  name: string;
};

type CheckPrice = (
  prices: Record<string, number>
) => (req: Request) => E.Either<string, number>;

const isFruitRequest = (r: Request) => r.tag === "fruit";

const lookupIn = (prices: Record<string, number>) => (name: string) =>
  pipe(
    prices,
    R.lookup(name),
    E.fromOption(() => "price not known")
  );

const checkPrice: CheckPrice = (prices) => (request) =>
  pipe(
    request,
    E.fromPredicate(isFruitRequest, () => "not fruit"),
    E.map((req) => req.name),
    E.chain(lookupIn(prices))
  );

describe("lookup-value-only-in-some-cases", () => {
  describe("given a fruit request for which we know the price", () => {
    const fruitPrices = {
      banana: faker.datatype.float(),
    };
    const request = {
      tag: "fruit" as const,
      name: "banana",
    };
    const result = checkPrice(fruitPrices)(request);

    it("returns on the right with the price", () => {
      expect(result).toStrictEqual(E.right(fruitPrices.banana));
    });
  });

  describe("when the request is not a fruit request", () => {
    const request = {
      tag: "vegetable" as const,
      name: faker.datatype.string(),
    };
    const result = checkPrice({})(request);

    it("returns on the left, saying it ain't fruit", () => {
      expect(result).toStrictEqual(E.left("not fruit"));
    });
  });

  describe("given a fruit request for which we don't know the price", () => {
    const fruitPrices = {};
    const request = {
      tag: "fruit" as const,
      name: "banana",
    };
    const result = checkPrice(fruitPrices)(request);

    it("returns on the left, saying we don't know the price", () => {
      expect(result).toStrictEqual(E.left("price not known"));
    });
  });
});
