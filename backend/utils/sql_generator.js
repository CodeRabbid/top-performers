const generate_select = (age_groups_strings, today) => {
  const age_groups = age_groups_strings.map((age_groups_string) => {
    const age_strings = age_groups_string.split("-");
    return [Number(age_strings[0]), Number(age_strings[1])];
  });
  let select = `CASE\n`;
  for (const age_group of age_groups) {
    let lower_date = new Date(today);
    lower_date.setFullYear(lower_date.getFullYear() - age_group[1]);
    let upper_date = new Date(today);
    upper_date.setFullYear(upper_date.getFullYear() - age_group[0]);

    select += `WHEN '${lower_date.toISOString()}' <= customer.birthday AND customer.birthday < '${upper_date.toISOString()}' THEN '${
      age_group[0]
    }-${age_group[1]}'\n`;
  }
  select += `ELSE 'other'\nEnd as comparee`;
  return select;
};

export { generate_select };
