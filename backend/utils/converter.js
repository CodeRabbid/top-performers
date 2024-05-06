const format_as_diagram = (input, comparees, time_frame, today) => {
  if (time_frame == "All time") {
    const diagram = [{ time_unit: "All time" }];

    for (const item of input) {
      diagram[0][item.comparee] = item.items_sold;
    }
    return diagram;
  } else if (time_frame == "Month") {
    const diagram = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const month_today = today.getMonth();

    for (let i = 0; i < 12; i++) {
      const month = monthNames[i];
      const shifted_month_id = (i - month_today + 11) % 12;
      const unit = { time_unit: month };
      for (const comparee of comparees) {
        unit[comparee] = 0;
      }
      diagram[shifted_month_id] = unit;
    }

    for (const item of input) {
      if (comparees.includes(item.comparee)) {
        const month = monthNames[new Date(item.month).getMonth()];
        const month_id = new Date(item.month).getMonth();
        const shifted_month_id = (month_id - month_today + 11) % 12;
        if (!diagram[shifted_month_id]) {
          diagram[shifted_month_id] = { time_unit: month };
        }
        diagram[shifted_month_id][item.comparee] = item.items_sold;
      }
    }

    return diagram;
  }

  return;
};

const format_ages_as_diagram = (input, comparees, time_frame, today) => {
  if (time_frame == "All time") {
    const diagram = [{ time_unit: "All time" }];

    for (const item of input) {
      diagram[0][item.comparee] = item.items_sold;
    }
    return diagram;
  } else if (time_frame == "Month") {
    const diagram = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const month_today = today.getMonth();

    for (let i = 0; i < 12; i++) {
      const month = monthNames[i];
      const shifted_month_id = (i - month_today + 11) % 12;
      const unit = { time_unit: month };
      for (const comparee of comparees) {
        unit[comparee] = 0;
      }
      diagram[shifted_month_id] = unit;
    }

    for (const item of input) {
      const month = monthNames[new Date(item.month).getMonth()];
      const month_id = new Date(item.month).getMonth();
      const shifted_month_id = (month_id - month_today + 11) % 12;
      if (!diagram[shifted_month_id]) {
        diagram[shifted_month_id] = { time_unit: month };
      }
      diagram[shifted_month_id][item.comparee] = item.items_sold;
    }

    return diagram;
  }

  return;
};

export { format_as_diagram, format_ages_as_diagram };
