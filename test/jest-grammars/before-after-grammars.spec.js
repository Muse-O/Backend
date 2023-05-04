beforeAll(() => console.log("1 - beforeAll"));
afterAll(() => console.log("1 - afterAll"));
beforeEach(() => console.log("1 - beforeEach"));
afterEach(() => console.log("1 - afterEach"));

test.skip("", () => console.log("1 - test"));

describe.skip("Scoped / Nested block", () => {
  beforeAll(() => console.log("2 - beforeAll"));
  afterAll(() => console.log("2 - afterAll"));
  beforeEach(() => console.log("2 - beforeEach"));
  afterEach(() => console.log("2 - afterEach"));

  test.skip("", () => console.log("2.1 - test"));

  test.skip("", () => console.log("2.2 - test"));
});

/** Print
 *
 *     1 - beforeAll
 *       at Object.<anonymous> (test/jest-grammars/before-after.spec.test.js:1:45)
 *
 *     1 - beforeEach
 *       at Object.log (test/jest-grammars/before-after.spec.test.js:3:26)
 *
 *     1 - test
 *       at Object.log (test/jest-grammars/before-after.spec.test.js:6:24)
 *
 *     1 - afterEach
 *       at Object.log (test/jest-grammars/before-after.spec.test.js:4:25)
 *
 *     2 - beforeAll
 *       at Object.log (test/jest-grammars/before-after.spec.test.js:9:27)
 *
 *     1 - beforeEach
 *       at Object.log (test/jest-grammars/before-after.spec.test.js:3:26)
 *
 *     2 - beforeEach
 *       at Object.log (test/jest-grammars/before-after.spec.test.js:11:28)
 *
 *     2.1 - test
 *       at Object.log (test/jest-grammars/before-after.spec.test.js:14:26)
 *
 *     2 - afterEach
 *       at Object.log (test/jest-grammars/before-after.spec.test.js:12:27)
 *
 *     1 - afterEach
 *       at Object.log (test/jest-grammars/before-after.spec.test.js:4:25)
 *
 *     1 - beforeEach
 *       at Object.log (test/jest-grammars/before-after.spec.test.js:3:26)
 *
 *     2 - beforeEach
 *       at Object.log (test/jest-grammars/before-after.spec.test.js:11:28)
 *
 *     2.2 - test
 *       at Object.log (test/jest-grammars/before-after.spec.test.js:16:26)
 *
 *     2 - afterEach
 *       at Object.log (test/jest-grammars/before-after.spec.test.js:12:27)
 *
 *     1 - afterEach
 *       at Object.log (test/jest-grammars/before-after.spec.test.js:4:25)
 *
 *     2 - afterAll
 *       at Object.log (test/jest-grammars/before-after.spec.test.js:10:26)
 *
 *     1 - afterAll
 *       at Object.log (test/jest-grammars/before-after.spec.test.js:2:24)
 * **/
