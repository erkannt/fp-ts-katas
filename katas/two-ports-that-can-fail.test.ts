import { faker } from "@faker-js/faker";
import * as E from "fp-ts/Either";

// Deal with two dependencies that could fail
//
// Make the test pass by implementing getAndCombineResults
//
// Hint: sequenceS

type Ports = {
  getName: (userId: string) => E.Either<number, string>;
  getEmail: (userId: string) => E.Either<number, string>;
};

type GetAndCombineResults = (port: Ports) => (userId: string) => string;

const getAndCombineResults: GetAndCombineResults = () => () => "";

describe("two-ports-that-can-fail", () => {
  describe("when both ports succeed", () => {
    const userId = faker.random.alphaNumeric();
    const name = faker.name.fullName();
    const email = faker.internet.email();

    const adapters = {
      getName: () => E.right(name),
      getEmail: () => E.right(email),
    };

    it("combines the respective results in a string", () => {
      const output = getAndCombineResults(adapters)(userId);

      expect(output).toContain(name);
      expect(output).toContain(email);
    });
  });
});
