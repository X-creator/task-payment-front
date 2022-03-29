import { useEffect, useMemo, useReducer } from "react";

const initialState = {
  requestData: null,
  isLoading: false,
  isError: false,
  responseData: null
};

const dataFetchReducer = (state, { type, data }) => {
  switch (type) {
    case "SET_REQUEST_DATA":
      return {
        ...state,
        requestData: data
      };
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        responseData: data,
        isLoading: false,
        isError: false
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};


const UseDataFetch = (url, createOption) => {
  const [{ isLoading, isError, requestData, responseData }, dispatch] = useReducer(dataFetchReducer, initialState);

  const setRequestHandler = (data) => {
    dispatch({ type: "SET_REQUEST_DATA", data });
  };

  const request = useMemo(() => ([url, (createOption ? createOption(requestData) : null)]), [url, requestData, createOption]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const response = await fetch(...request);
        const data = await response.json();
        dispatch({ type: "FETCH_SUCCESS", data });
      } catch (error) {
        dispatch({ type: "FETCH_FAILURE" });
      }
    };
    if (requestData) fetchData();
  }, [request, requestData]);

  return [{ isLoading, isError, responseData }, setRequestHandler];
};

export default UseDataFetch;
