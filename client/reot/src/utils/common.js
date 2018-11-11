import moment from "moment";

export const getFormattedDate = timestamp =>
  moment(timestamp * 1000).format("DD MMMM YYYY");

export const formatOptions = options =>
  options.map(o => ({ key: o, value: o, text: o }));
