import { format_as_diagram } from "../utils/converter.js";

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
  const time_frame = "Month";
  const today = new Date("2024-04-15T22:00:00.000Z");
  const comparees = ["UGG"];
  const input = [
    { comparee: "UGG", items_sold: 4, month: "2024-03-31T22:00:00.000Z" },
    { comparee: "UGG", items_sold: 7, month: "2023-06-30T22:00:00.000Z" },
    { comparee: "UGG", items_sold: 3, month: "2024-02-29T23:00:00.000Z" },
    { comparee: "UGG", items_sold: 5, month: "2023-04-30T22:00:00.000Z" },
    { comparee: "UGG", items_sold: 2, month: "2024-01-31T23:00:00.000Z" },
    { comparee: "UGG", items_sold: 12, month: "2023-11-30T23:00:00.000Z" },
    { comparee: "UGG", items_sold: 11, month: "2023-10-31T23:00:00.000Z" },
    { comparee: "UGG", items_sold: 1, month: "2023-12-31T23:00:00.000Z" },
    { comparee: "UGG", items_sold: 8, month: "2023-07-31T22:00:00.000Z" },
    { comparee: "UGG", items_sold: 10, month: "2023-09-30T22:00:00.000Z" },
    { comparee: "UGG", items_sold: 9, month: "2023-08-31T22:00:00.000Z" },
    { comparee: "UGG", items_sold: 6, month: "2023-05-31T22:00:00.000Z" },
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

  expect(format_as_diagram(input, comparees, time_frame, today)).toStrictEqual(
    expected_result
  );
});

test("converts sql output by months with missing input", () => {
  const time_frame = "Month";
  const today = new Date("2024-04-15T22:00:00.000Z");
  const comparees = ["adidas", "UGG"];
  const input = [
    { comparee: "adidas", items_sold: 4, month: "2023-03-31T22:00:00.000Z" },
    { comparee: "UGG", items_sold: 6, month: "2023-05-31T22:00:00.000Z" },
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

  expect(format_as_diagram(input, comparees, time_frame, today)).toStrictEqual(
    expected_result
  );
});
