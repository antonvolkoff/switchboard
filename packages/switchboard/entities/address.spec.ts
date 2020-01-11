import Address from "./address";

test("should return address and name", () => {
  const address = new Address('john.smith@example.com', "John Smith");
  expect(address.text).toBe("John Smith <john.smith@example.com>");
});
