import { faker } from "@faker-js/faker";
import * as E from "fp-ts/Either";

// Conditionals, eithers and pipes
//
// The implementation of checkPrice passes all tests.
// Can you turn it into a single pipe?
//
// Hint: Build the pipe starting from the bottom.

type Request = {
  tag: "fruit" | "vegetable";
  name: string;
};

type CheckPrice = (
  prices: Record<string, number>
) => (req: Request) => E.Either<string, number>;

const checkPrice: CheckPrice = (prices) => (request) => {
  // Refactor this to be a single pipe
  if (request.tag !== "fruit") {
    return E.left("not fruit");
  }
  const price = prices[request.name];
  if (!price) {
    return E.left("price not known");
  }
  return E.right(price);
};

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
