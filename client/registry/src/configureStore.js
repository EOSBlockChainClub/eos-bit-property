import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import reducers from "./reducers";


const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () => {
  const middlewares = [thunk];

  if (process.env.NODE_ENV !== "production") {
    middlewares.push(createLogger());
  }

  /* eslint-disable no-underscore-dangle */
  return createStore(
    reducers,
    composeEnhancer(applyMiddleware(...middlewares))
  );
  /* eslint-enable */
};

export default configureStore;
