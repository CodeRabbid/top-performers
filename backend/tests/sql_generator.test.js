import { generate_select } from "../utils/sql_generator.js";

describe("test generate", () => {
  test("generates SELECT", () => {
    const age_groups = ["18-24", "25-35"];
    const ecpected_output = `CASE
WHEN '2000-02-04T23:00:00.000Z' <= customer.birthday AND customer.birthday < '2006-02-04T23:00:00.000Z' THEN '18-24'
WHEN '1989-02-04T23:00:00.000Z' <= customer.birthday AND customer.birthday < '1999-02-04T23:00:00.000Z' THEN '25-35'
ELSE 'other'
End as comparee`;

    expect(generate_select(age_groups, new Date("02.05.2024"))).toStrictEqual(
      ecpected_output
    );
  });
});
