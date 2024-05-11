import { format_as_diagram } from "../utils/converter.js";

describe("test 1", () => {
  test("converts sql output to api response", () => {
    const time_frame = "All time";
    const comparees = ["UGG"];
    const input = [
      {
        comparee: "Ahnu",
        items_sold: 59,
      },
      {
        comparee: "adidas",
        items_sold: 57,
      },
      {
        comparee: "Aetrex",
        items_sold: 86,
      },
    ];
    const expected_result = [
      {
        Ahnu: 59,
        adidas: 57,
        Aetrex: 86,
        time_unit: "All time",
      },
    ];

    expect(format_as_diagram(input, comparees, time_frame)).toStrictEqual(
      expected_result
    );
  });

  test("converts sql output by months", () => {
    const time_frame = "month";
    const today = new Date("2024-04-15T22:00:00.000Z");
    const comparees = ["UGG"];
    const input = [
      { comparee: "UGG", items_sold: 4, time: 4 },
      { comparee: "UGG", items_sold: 7, time: 7 },
      { comparee: "UGG", items_sold: 3, time: 3 },
      { comparee: "UGG", items_sold: 5, time: 5 },
      { comparee: "UGG", items_sold: 2, time: 2 },
      { comparee: "UGG", items_sold: 12, time: 12 },
      { comparee: "UGG", items_sold: 11, time: 11 },
      { comparee: "UGG", items_sold: 1, time: 1 },
      { comparee: "UGG", items_sold: 8, time: 8 },
      { comparee: "UGG", items_sold: 10, time: 10 },
      { comparee: "UGG", items_sold: 9, time: 9 },
      { comparee: "UGG", items_sold: 6, time: 6 },
    ];
    const expected_result = [
      {
        UGG: 5,
        time_unit: "May",
      },
      {
        UGG: 6,
        time_unit: "Jun",
      },
      {
        UGG: 7,
        time_unit: "Jul",
      },
      {
        UGG: 8,
        time_unit: "Aug",
      },
      {
        UGG: 9,
        time_unit: "Sep",
      },
      {
        UGG: 10,
        time_unit: "Oct",
      },
      {
        UGG: 11,
        time_unit: "Nov",
      },
      {
        UGG: 12,
        time_unit: "Dec",
      },
      {
        UGG: 1,
        time_unit: "Jan",
      },
      {
        UGG: 2,
        time_unit: "Feb",
      },
      {
        UGG: 3,
        time_unit: "Mar",
      },
      {
        UGG: 4,
        time_unit: "Apr",
      },
    ];

    expect(
      format_as_diagram(input, comparees, time_frame, today)
    ).toStrictEqual(expected_result);
  });

  test("converts sql output by months with missing input", () => {
    const time_frame = "month";
    const today = new Date("2024-04-15T22:00:00.000Z");
    const comparees = ["adidas", "UGG"];
    const input = [
      { comparee: "adidas", items_sold: 4, time: 4 },
      { comparee: "UGG", items_sold: 6, time: 6 },
    ];
    const expected_result = [
      {
        adidas: 0,
        UGG: 0,
        time_unit: "May",
      },
      {
        adidas: 0,
        UGG: 6,
        time_unit: "Jun",
      },
      {
        adidas: 0,
        UGG: 0,
        time_unit: "Jul",
      },
      {
        adidas: 0,
        UGG: 0,
        time_unit: "Aug",
      },
      {
        adidas: 0,
        UGG: 0,
        time_unit: "Sep",
      },
      {
        adidas: 0,
        UGG: 0,
        time_unit: "Oct",
      },
      {
        adidas: 0,
        UGG: 0,
        time_unit: "Nov",
      },
      {
        adidas: 0,
        UGG: 0,
        time_unit: "Dec",
      },
      {
        adidas: 0,
        UGG: 0,
        time_unit: "Jan",
      },
      {
        adidas: 0,
        UGG: 0,
        time_unit: "Feb",
      },
      {
        adidas: 0,
        UGG: 0,
        time_unit: "Mar",
      },
      {
        adidas: 4,
        UGG: 0,
        time_unit: "Apr",
      },
    ];

    expect(
      format_as_diagram(input, comparees, time_frame, today)
    ).toStrictEqual(expected_result);
  });

  test("converts sql output by months with extra input", () => {
    const time_frame = "month";
    const today = new Date("2024-04-15T22:00:00.000Z");
    const comparees = ["adidas"];
    const input = [
      { comparee: "adidas", items_sold: 4, time: 4 },
      { comparee: "other", items_sold: 6, time: 6 },
    ];
    const expected_result = [
      {
        adidas: 0,
        time_unit: "May",
      },
      {
        adidas: 0,
        time_unit: "Jun",
      },
      {
        adidas: 0,
        time_unit: "Jul",
      },
      {
        adidas: 0,
        time_unit: "Aug",
      },
      {
        adidas: 0,
        time_unit: "Sep",
      },
      {
        adidas: 0,
        time_unit: "Oct",
      },
      {
        adidas: 0,
        time_unit: "Nov",
      },
      {
        adidas: 0,
        time_unit: "Dec",
      },
      {
        adidas: 0,
        time_unit: "Jan",
      },
      {
        adidas: 0,
        time_unit: "Feb",
      },
      {
        adidas: 0,
        time_unit: "Mar",
      },
      {
        adidas: 4,
        time_unit: "Apr",
      },
    ];

    expect(
      format_as_diagram(input, comparees, time_frame, today)
    ).toStrictEqual(expected_result);
  });

  test("converts age groups", () => {
    const time_frame = "month";
    const today = new Date("2024-04-15T22:00:00.000Z");
    const comparees = ["18 - 24", "25 - 35"];
    const input = [
      { comparee: "18 - 24", items_sold: 4, time: 4 },
      { comparee: "25 - 35", items_sold: 6, time: 6 },
    ];
    const expected_result = [
      {
        "18 - 24": 0,
        "25 - 35": 0,
        time_unit: "May",
      },
      {
        "18 - 24": 0,
        "25 - 35": 6,
        time_unit: "Jun",
      },
      {
        "18 - 24": 0,
        "25 - 35": 0,
        time_unit: "Jul",
      },
      {
        "18 - 24": 0,
        "25 - 35": 0,
        time_unit: "Aug",
      },
      {
        "18 - 24": 0,
        "25 - 35": 0,
        time_unit: "Sep",
      },
      {
        "18 - 24": 0,
        "25 - 35": 0,
        time_unit: "Oct",
      },
      {
        "18 - 24": 0,
        "25 - 35": 0,
        time_unit: "Nov",
      },
      {
        "18 - 24": 0,
        "25 - 35": 0,
        time_unit: "Dec",
      },
      {
        "18 - 24": 0,
        "25 - 35": 0,
        time_unit: "Jan",
      },
      {
        "18 - 24": 0,
        "25 - 35": 0,
        time_unit: "Feb",
      },
      {
        "18 - 24": 0,
        "25 - 35": 0,
        time_unit: "Mar",
      },
      {
        "18 - 24": 4,
        "25 - 35": 0,
        time_unit: "Apr",
      },
    ];

    expect(
      format_as_diagram(input, comparees, time_frame, today)
    ).toStrictEqual(expected_result);
  });

  test("converts quarters", () => {
    const time_frame = "quarter";
    const today = new Date("2024-04-15T22:00:00.000Z");
    const comparees = ["UGG"];
    const input = [
      { comparee: "UGG", items_sold: 1, time: 1 },
      { comparee: "UGG", items_sold: 2, time: 2 },
      { comparee: "UGG", items_sold: 3, time: 3 },
      { comparee: "UGG", items_sold: 4, time: 4 },
    ];
    const expected_result = [
      {
        UGG: 3,
        time_unit: "3-rd Quarter",
      },
      {
        UGG: 4,
        time_unit: "4-th Quarter",
      },
      {
        UGG: 1,
        time_unit: "1-st Quarter",
      },
      {
        UGG: 2,
        time_unit: "2-nd Quarter",
      },
    ];

    expect(
      format_as_diagram(input, comparees, time_frame, today)
    ).toStrictEqual(expected_result);
  });
});
