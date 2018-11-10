import _ from "lodash";

export default function registrations(state = {}, action) {
  switch (action.type) {
    case "FETCH_REGISTRATIONS_SUCCESS":
      return _.mapKeys(action.response, "id");
    case "FETCH_REGISTRATIONS_FAILURE":
      return {};
    default:
      return state;
  }
}

export const getRegistrations = state => _.map(state);

