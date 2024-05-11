const full_time_unit_year_ago = (today, time_unit) => {
  if (time_unit == "month") {
    return new Date(today.getFullYear() - 1, today.getMonth() + 1, 1);
  } else if ((time_unit = "quarter")) {
    const quarter_today = Math.floor((today.getMonth() + 3) / 3) - 1;
    const first_month_of_next_quarter = (quarter_today + 1) * 3;
    console.log(first_month_of_next_quarter);
    const shifted_date = new Date(
      today.getFullYear() - 1,
      first_month_of_next_quarter,
      1
    );
    return shifted_date;
  }
};

export { full_time_unit_year_ago };
