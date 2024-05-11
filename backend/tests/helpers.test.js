import { full_time_unit_year_ago } from "../utils/helpers.js";

describe("test helpers", () => {
  test("converts a date to full month year ago", () => {
    const today = new Date("2024-05-15T22:00:00.000Z");
    const expected_converted_date = new Date("2023-05-31T22:00:00.000Z");
    expect(full_time_unit_year_ago(today, "month")).toStrictEqual(
      expected_converted_date
    );
  });

  test("converts may to full quarter year ago", () => {
    const today = new Date("2024-05-15T22:00:00.000Z");
    const expected_converted_date = new Date("2023-06-30T22:00:00.000Z");
    expect(full_time_unit_year_ago(today, "quarter")).toStrictEqual(
      expected_converted_date
    );
  });

  test("converts june to full quarter year ago", () => {
    const today = new Date("2024-06-15T22:00:00.000Z");
    const expected_converted_date = new Date("2023-06-30T22:00:00.000Z");
    expect(full_time_unit_year_ago(today, "quarter")).toStrictEqual(
      expected_converted_date
    );
  });

  test("converts january to full quarter year ago", () => {
    const today = new Date("2023-12-31T23:00:01.000Z");
    const expected_converted_date = new Date("2023-03-31T22:00:00.000Z");
    expect(full_time_unit_year_ago(today, "quarter")).toStrictEqual(
      expected_converted_date
    );
  });

  test("converts december to full quarter year ago", () => {
    const today = new Date("2023-12-15T10:00:01.000Z");
    const expected_converted_date = new Date("2022-12-31T23:00:00.000Z");
    expect(full_time_unit_year_ago(today, "quarter")).toStrictEqual(
      expected_converted_date
    );
  });
});
