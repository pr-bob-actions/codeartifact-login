// Disable @actions/core logging
// to avoid warning and error in github actions when running tests
export const info = jest.fn();
export const warning = jest.fn();
export const error = jest.fn();
