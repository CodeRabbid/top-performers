const format_as_diagram = (input, comparees, time_frame, today) => {
  if (time_frame == "All time") {
    const diagram = [{ time_unit: "All time" }];

    for (const item of input) {
      diagram[0][item.comparee] = item.items_sold;
    }
    return diagram;
  } else if (time_frame == "month" || time_frame == "quarter") {
    const diagram = [];
    let unit_names = [];
    let time_unit_today = 0;
    if (time_frame == "month") {
      unit_names = [
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
      time_unit_today = today.getMonth();
    } else if (time_frame == "quarter") {
      unit_names = [
        "1-st Quarter",
        "2-nd Quarter",
        "3-rd Quarter",
        "4-th Quarter",
      ];
      time_unit_today = Math.floor((today.getMonth() + 3) / 3) - 1;
    }

    const names_length = unit_names.length;

    for (let i = 0; i < names_length; i++) {
      const unit_name = unit_names[i];
      const shifted_month_id =
        (i - time_unit_today + names_length - 1) % names_length;
      const unit = { time_unit: unit_name };
      for (const comparee of comparees) {
        unit[comparee] = 0;
      }
      diagram[shifted_month_id] = unit;
    }

    for (const item of input) {
      if (comparees.includes(item.comparee)) {
        const unit_name = unit_names[item.month - 1];
        const month_id = item.time - 1;
        const shifted_month_id =
          (month_id - time_unit_today - 1 + names_length) % names_length;
        if (!diagram[shifted_month_id]) {
          diagram[shifted_month_id] = { time_unit: unit_name };
        }
        diagram[shifted_month_id][item.comparee] = item.items_sold;
      }
    }

    return diagram;
  }

  return;
};

export { format_as_diagram };
